import os
import re
import time
import json
import hmac
import base64
import hashlib
import secrets
from typing import Optional, Dict, Tuple
from fastapi import HTTPException, Security, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Security Configurations
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "medicare_super_secret_jwt_key_2026_x99a!")
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", 15 * 60)) # 15 Minutes
REFRESH_TOKEN_EXPIRE_SECONDS = int(os.getenv("REFRESH_TOKEN_EXPIRE_SECONDS", 7 * 24 * 60 * 60)) # 7 Days

OTP_EXPIRY_SECONDS = 300 # 5 Minutes
OTP_MAX_ATTEMPTS = 5 # Brute-force lockout threshold
OTP_RATE_LIMIT_WINDOW = 3600 # 1 Hour
OTP_MAX_REQUESTS_PER_WINDOW = 5 # Max OTP requests per hour
OTP_COOLDOWN_SECONDS = 30 # Minimum seconds between OTP requests

# In-Memory Security Stores (Production: Redis / DB)
# Structure: {phone: [{"timestamp": ts}, ...]}
OTP_RATE_LIMIT_STORE: Dict[str, list] = {}

# Structure: {phone: {"otp_hash": str, "salt": str, "attempts": int, "expires_at": float}}
OTP_STORE: Dict[str, dict] = {}

# Structure: {token_jti: {"user_id": str, "expires_at": float}}
REVOKED_TOKENS: Dict[str, float] = {}

security_bearer = HTTPBearer(auto_error=False)

# 1. PHONE SANITIZATION & E.164 VALIDATION
def sanitize_phone_number(raw_phone: str) -> str:
    """
    Normalizes a phone number to standard E.164 format.
    Accepts Indian 10-digit, +91, with or without spaces/dashes.
    """
    if not raw_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number cannot be empty."
        )
    
    # Strip spaces, dashes, parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', raw_phone.strip())
    
    # If starts with + (international format)
    if cleaned.startswith("+"):
        digits_only = cleaned[1:]
        if not digits_only.isdigit() or len(digits_only) < 10 or len(digits_only) > 15:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid international phone number format (E.164 required)."
            )
        return cleaned
    
    # If 10-digit Indian number without country code
    digits = re.sub(r'\D', '', cleaned)
    if len(digits) == 10:
        return f"+91{digits}"
    elif len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    elif len(digits) >= 10 and len(digits) <= 15:
        return f"+{digits}"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number. Must be a valid 10-digit mobile number."
        )

# 2. CRYPTOGRAPHIC PASSWORD & OTP HASHING
def hash_string(secret: str, salt: Optional[str] = None) -> Tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        secret.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return hashed, salt

def verify_hash(secret: str, hashed: str, salt: str) -> bool:
    new_hash, _ = hash_string(secret, salt)
    return hmac.compare_digest(new_hash, hashed)

def generate_secure_otp() -> str:
    """
    Generates a cryptographically secure 6-digit numeric OTP.
    """
    return str(secrets.randbelow(900000) + 100000)

# 3. RATE LIMITING & BRUTE FORCE SHIELD
def check_otp_rate_limit(phone: str, ip_address: Optional[str] = None):
    now = time.time()
    
    # Clean expired records from window
    history = OTP_RATE_LIMIT_STORE.get(phone, [])
    history = [entry for entry in history if now - entry["timestamp"] < OTP_RATE_LIMIT_WINDOW]
    OTP_RATE_LIMIT_STORE[phone] = history
    
    # 1. Cooldown check (prevent rapid button spam)
    if history:
        last_request_time = history[-1]["timestamp"]
        time_since_last = now - last_request_time
        if time_since_last < OTP_COOLDOWN_SECONDS:
            remaining_cooldown = int(OTP_COOLDOWN_SECONDS - time_since_last)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {remaining_cooldown} seconds before requesting a new OTP."
            )
            
    # 2. Max hourly requests limit
    if len(history) >= OTP_MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Maximum OTP request limit exceeded for this hour. Please try again later."
        )

def record_otp_request(phone: str):
    now = time.time()
    history = OTP_RATE_LIMIT_STORE.get(phone, [])
    history.append({"timestamp": now})
    OTP_RATE_LIMIT_STORE[phone] = history

# 4. OTP STORAGE & VERIFICATION
def store_otp(phone: str, otp_code: str):
    hashed_otp, salt = hash_string(otp_code)
    OTP_STORE[phone] = {
        "otp_hash": hashed_otp,
        "salt": salt,
        "attempts": 0,
        "expires_at": time.time() + OTP_EXPIRY_SECONDS
    }

def verify_and_consume_otp(phone: str, submitted_otp: str) -> bool:
    record = OTP_STORE.get(phone)
    now = time.time()
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP found for this number. Please request a new OTP."
        )
        
    if now > record["expires_at"]:
        del OTP_STORE[phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP code has expired. Please request a new OTP."
        )
        
    # Increment attempt count
    record["attempts"] += 1
    
    # Check brute force limit
    if record["attempts"] > OTP_MAX_ATTEMPTS:
        del OTP_STORE[phone]
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. For security, this OTP is now invalidated. Please request a new one."
        )
        
    # Constant-time comparison
    is_valid = verify_hash(submitted_otp.strip(), record["otp_hash"], record["salt"])
    
    if not is_valid:
        remaining_attempts = OTP_MAX_ATTEMPTS - record["attempts"]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP code. {remaining_attempts} attempts remaining."
        )
        
    # Consume OTP immediately on success
    del OTP_STORE[phone]
    return True

# 5. JWT TOKENS (RFC 7519 Compliant Implementation)
def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - len(data) % 4) if len(data) % 4 else ''
    return base64.urlsafe_b64decode(data + padding)

def create_jwt(payload: dict, secret: str = JWT_SECRET_KEY) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    
    signing_input = f"{header_b64}.{payload_b64}"
    signature = hmac.new(secret.encode('utf-8'), signing_input.encode('utf-8'), hashlib.sha256).digest()
    signature_b64 = _base64url_encode(signature)
    
    return f"{signing_input}.{signature_b64}"

def decode_jwt(token: str, secret: str = JWT_SECRET_KEY) -> dict:
    parts = token.split('.')
    if len(parts) != 3:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed JWT token")
        
    header_b64, payload_b64, signature_b64 = parts
    signing_input = f"{header_b64}.{payload_b64}"
    expected_sig = hmac.new(secret.encode('utf-8'), signing_input.encode('utf-8'), hashlib.sha256).digest()
    expected_sig_b64 = _base64url_encode(expected_sig)
    
    if not hmac.compare_digest(signature_b64, expected_sig_b64):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")
        
    try:
        payload = json.loads(_base64url_decode(payload_b64).decode('utf-8'))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
        
    # Check expiry
    if "exp" in payload and time.time() > payload["exp"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        
    # Check revocation
    jti = payload.get("jti")
    if jti and jti in REVOKED_TOKENS:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")
        
    return payload

def issue_auth_tokens(user: dict) -> dict:
    now = time.time()
    user_id = str(user.get("id"))
    
    # Access Token (15m)
    access_jti = secrets.token_hex(8)
    access_payload = {
        "sub": user_id,
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone_number"),
        "role": user.get("role", "patient"),
        "type": "access",
        "jti": access_jti,
        "iat": now,
        "exp": now + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    access_token = create_jwt(access_payload)
    
    # Refresh Token (7d)
    refresh_jti = secrets.token_hex(12)
    refresh_payload = {
        "sub": user_id,
        "type": "refresh",
        "jti": refresh_jti,
        "iat": now,
        "exp": now + REFRESH_TOKEN_EXPIRE_SECONDS
    }
    refresh_token = create_jwt(refresh_payload)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
        "user": {
            "id": user.get("id"),
            "name": user.get("name"),
            "email": user.get("email"),
            "phone_number": user.get("phone_number"),
            "role": user.get("role"),
            "auth_provider": user.get("auth_provider"),
            "avatar_url": user.get("avatar_url") or user.get("avatar"),
            "specialization": user.get("specialization")
        }
    }
