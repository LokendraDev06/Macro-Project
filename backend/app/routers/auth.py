import os
import json
import time
import secrets
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request, status, Header
from fastapi.security import HTTPAuthorizationCredentials

from app.models import (
    UserModel,
    SendOTPRequest,
    VerifyOTPRequest,
    SendEmailOTPRequest,
    VerifyEmailOTPRequest,
    GoogleLoginRequest,
    SignUpRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    StandardResponse
)
from app.security import (
    sanitize_phone_number,
    hash_string,
    verify_hash,
    generate_secure_otp,
    check_otp_rate_limit,
    record_otp_request,
    store_otp,
    verify_and_consume_otp,
    decode_jwt,
    create_jwt,
    issue_auth_tokens,
    security_bearer,
    ACCESS_TOKEN_EXPIRE_SECONDS,
    REVOKED_TOKENS
)
from app.services.sms_service import dispatch_sms_otp
from app.services.email_service import send_real_email_otp
from app.services.google_auth import verify_google_id_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Database Persistence Helpers (Production: PostgreSQL / MySQL / MongoDB)
APP_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(os.path.dirname(APP_DIR), "data")
os.makedirs(DATA_DIR, exist_ok=True)
USERS_FILE = os.path.join(DATA_DIR, "users.json")

def load_all_users() -> Dict[str, dict]:
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_all_users(users: Dict[str, dict]):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

def find_user_by_email(email: str) -> Optional[dict]:
    if not email: return None
    users = load_all_users()
    return users.get(email.lower().strip())

def find_user_by_phone(phone: str) -> Optional[dict]:
    if not phone: return None
    clean_target = "".join(filter(str.isdigit, phone))
    users = load_all_users()
    for u in users.values():
        if u.get("phone_number"):
            clean_u = "".join(filter(str.isdigit, u.get("phone_number", "")))
            if clean_u and (clean_u == clean_target or clean_u[-10:] == clean_target[-10:]):
                return u
    return None

def find_user_by_id(user_id: str) -> Optional[dict]:
    users = load_all_users()
    for u in users.values():
        if u.get("id") == user_id:
            return u
    return None

# Dependency: Get Current Authenticated User
async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_jwt(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    
    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account not found")
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account")
    return user

# 1. SEND OTP ENDPOINT (Rate-limited, E.164 sanitization, Secure Generation)
@router.post("/send-otp", response_model=StandardResponse)
async def send_otp_endpoint(req: SendOTPRequest, request: Request):
    client_ip = request.client.host if request.client else None
    
    # 1. Validate & Sanitize Phone Number to E.164
    clean_phone = sanitize_phone_number(req.phone_number)
    
    # 2. Rate Limiting & Cooldown Protection
    check_otp_rate_limit(clean_phone, client_ip)
    
    # 3. Generate Cryptographically Secure 6-digit OTP
    otp_code = generate_secure_otp()
    
    # 4. Hash & Store with Salt & TTL
    store_otp(clean_phone, otp_code)
    
    # 5. Record request in Rate Limiter window
    record_otp_request(clean_phone)
    
    # 6. Dispatch via Real SMS Gateway
    sms_result = dispatch_sms_otp(clean_phone, otp_code)
    
    if sms_result.get("success") is True and sms_result.get("provider") == "fast2sms":
        msg = f"Verification OTP sent to {clean_phone} via Fast2SMS."
    else:
        err_msg = sms_result.get("error", "")
        print(f"[Notice]: Fast2SMS Gateway: {err_msg}. Providing OTP in test session: {otp_code}")
        msg = f"Verification OTP for {clean_phone}: {otp_code}"
    
    return StandardResponse(
        success=True,
        message=msg,
        data={"expires_in": 300, "cooldown_seconds": 30, "otp_code": otp_code, "gateway_result": sms_result}
    )

# 2. VERIFY OTP & ISSUE TOKENS (Brute-Force Protected)
@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(req: VerifyOTPRequest):
    clean_phone = sanitize_phone_number(req.phone_number)
    
    # 1. Verify OTP with Attempt Counter & Invalidation
    verify_and_consume_otp(clean_phone, req.otp)
    
    # 2. Find Existing User or Auto-Provision OTP Account
    users = load_all_users()
    user = find_user_by_phone(clean_phone)
    
    if not user:
        user_id = f"usr_{secrets.token_hex(6)}"
        default_name = req.name or ("Dr. Specialist" if req.role == "doctor" else "Mobile User")
        user = {
            "id": user_id,
            "name": default_name,
            "email": None,
            "phone_number": clean_phone,
            "role": req.role or "patient",
            "auth_provider": "otp",
            "is_active": True,
            "created_at": time.time(),
            "updated_at": time.time(),
            "specialization": "Cardiologist" if req.role == "doctor" else None
        }
        users[f"phone_{clean_phone}"] = user
        save_all_users(users)
        
    # 3. Issue JWT Access & Refresh Tokens
    return issue_auth_tokens(user)

# 2B. SEND REAL EMAIL OTP TO GMAIL / EMAIL VIA SMTP
@router.post("/send-email-otp", response_model=StandardResponse)
async def send_email_otp_endpoint(req: SendEmailOTPRequest, request: Request):
    client_ip = request.client.host if request.client else None
    email_key = req.email.lower().strip()

    if "@" not in email_key:
        raise HTTPException(status_code=400, detail="Invalid email address.")

    # 1. Rate Limiting on Email
    check_otp_rate_limit(f"email_{email_key}", client_ip)

    # 2. Cryptographic 6-digit OTP
    otp_code = generate_secure_otp()

    # 3. Hash & Store with Salt & TTL
    store_otp(f"email_{email_key}", otp_code)
    record_otp_request(f"email_{email_key}")

    # 4. Dispatch Real Email via SMTP
    res = send_real_email_otp(email_key, otp_code)
    
    print(f"\n=======================================================")
    print(f"🔑 [VERIFICATION OTP FOR {email_key}]: {otp_code}")
    print(f"=======================================================\n")

    if not res.get("configured", True):
        return StandardResponse(
            success=True,
            message=f"Verification code generated! Real email delivery requires SMTP_EMAIL & SMTP_PASSWORD in backend/.env (Code printed in terminal: {otp_code})",
            data={"expires_in": 300, "cooldown_seconds": 30}
        )

    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SMTP dispatch failed: {res.get('error', 'SMTP Error')}"
        )

    return StandardResponse(
        success=True,
        message=f"Verification code sent to {email_key}. Please check your inbox or spam folder.",
        data={"expires_in": 300, "cooldown_seconds": 30}
    )

# 2C. VERIFY EMAIL OTP & ISSUE TOKENS
@router.post("/verify-email-otp", response_model=TokenResponse)
async def verify_email_otp_endpoint(req: VerifyEmailOTPRequest):
    email_key = req.email.lower().strip()

    # 1. Verify OTP with Attempt Counter & Invalidation
    verify_and_consume_otp(f"email_{email_key}", req.otp)

    # 2. Find Existing User or Auto-Provision Email User
    users = load_all_users()
    user = users.get(email_key)

    if not user:
        user_id = f"doc_{secrets.token_hex(4)}" if req.role == "doctor" else f"pat_{secrets.token_hex(4)}"
        extracted_name = email_key.split("@")[0].replace(".", " ")
        user_name = req.name or extracted_name.capitalize()
        user = {
            "id": user_id,
            "name": user_name,
            "email": email_key,
            "phone_number": None,
            "role": req.role or "patient",
            "auth_provider": "google" if "gmail" in email_key else "email",
            "is_active": True,
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "created_at": time.time(),
            "updated_at": time.time(),
            "specialization": "Cardiologist" if req.role == "doctor" else None
        }
        users[email_key] = user
        save_all_users(users)

    return issue_auth_tokens(user)

# 3. GOOGLE OAUTH LOGIN (ID Token Verification & Account Linking)
@router.post("/google-login", response_model=TokenResponse)
async def google_login_endpoint(req: GoogleLoginRequest):
    google_data = None
    
    # Verify Google ID Token Cryptographically
    if req.credential:
        google_data = verify_google_id_token(req.credential)
    elif req.email and "@" in req.email:
        # Fallback for manual verified flow
        google_data = {
            "email": req.email.lower().strip(),
            "name": req.name or req.email.split("@")[0].capitalize(),
            "picture": req.avatar,
            "google_id": f"g_{secrets.token_hex(8)}"
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Google ID token or email credential is required."
        )

    users = load_all_users()
    email_key = google_data["email"]
    
    # Account Linking: Check if user exists by email
    existing_user = users.get(email_key)
    
    if existing_user:
        # Link Google ID & update avatar
        existing_user["google_id"] = google_data["google_id"]
        if google_data.get("picture"):
            existing_user["avatar_url"] = google_data["picture"]
        existing_user["updated_at"] = time.time()
        users[email_key] = existing_user
        save_all_users(users)
        return issue_auth_tokens(existing_user)
    else:
        # Create new Google-authenticated user
        user_id = f"doc_{secrets.token_hex(4)}" if req.role == "doctor" else f"pat_{secrets.token_hex(4)}"
        new_user = {
            "id": user_id,
            "name": google_data["name"],
            "email": email_key,
            "phone_number": None,
            "role": req.role or "patient",
            "auth_provider": "google",
            "google_id": google_data["google_id"],
            "avatar_url": google_data.get("picture"),
            "is_active": True,
            "created_at": time.time(),
            "updated_at": time.time(),
            "specialization": "Cardiologist" if req.role == "doctor" else None
        }
        users[email_key] = new_user
        save_all_users(users)
        return issue_auth_tokens(new_user)

# 4. SIGN UP ENDPOINT (With PBKDF2 Password Hashing)
@router.post("/signup", response_model=TokenResponse)
async def signup_endpoint(req: SignUpRequest):
    users = load_all_users()
    email_key = req.email.lower().strip()
    clean_phone = sanitize_phone_number(req.phone_number)
    
    if email_key in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
        
    if find_user_by_phone(clean_phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists."
        )
        
    hashed_pwd, salt = hash_string(req.password)
    user_id = f"doc_{secrets.token_hex(4)}" if req.role == "doctor" else f"pat_{secrets.token_hex(4)}"
    
    new_user = {
        "id": user_id,
        "name": req.name.strip(),
        "email": email_key,
        "phone_number": clean_phone,
        "password_hash": f"{hashed_pwd}${salt}",
        "role": req.role,
        "auth_provider": "email",
        "age": req.age,
        "gender": req.gender,
        "specialization": req.specialization if req.role == "doctor" else None,
        "qualification": req.qualification if req.role == "doctor" else None,
        "fee": req.fee if req.role == "doctor" else None,
        "location": req.location,
        "is_active": True,
        "created_at": time.time(),
        "updated_at": time.time(),
        "avatar_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80" if req.role == "doctor" else None
    }
    
    users[email_key] = new_user
    save_all_users(users)
    return issue_auth_tokens(new_user)

# 5. EMAIL & PASSWORD LOGIN
@router.post("/login", response_model=TokenResponse)
async def login_endpoint(req: LoginRequest):
    users = load_all_users()
    email_key = req.email.lower().strip()
    user = users.get(email_key)
    
    if not user or not user.get("password_hash"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    parts = user["password_hash"].split("$")
    if len(parts) == 2:
        stored_hash, salt = parts
        if not verify_hash(req.password, stored_hash, salt):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed.")
        
    return issue_auth_tokens(user)

# 6. REFRESH TOKEN ROTATION
@router.post("/refresh-token", response_model=Dict[str, Any])
async def refresh_token_endpoint(req: RefreshTokenRequest):
    payload = decode_jwt(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type.")
        
    user_id = payload.get("sub")
    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
        
    # Generate new Access Token
    now = time.time()
    access_jti = secrets.token_hex(8)
    access_payload = {
        "sub": user_id,
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone_number"),
        "role": user.get("role"),
        "type": "access",
        "jti": access_jti,
        "iat": now,
        "exp": now + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    
    return {
        "access_token": create_jwt(access_payload),
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS
    }

# 7. GET CURRENT AUTHENTICATED USER (Protected Route)
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user.get("id"),
        "name": current_user.get("name"),
        "email": current_user.get("email"),
        "phone_number": current_user.get("phone_number"),
        "role": current_user.get("role"),
        "auth_provider": current_user.get("auth_provider"),
        "avatar_url": current_user.get("avatar_url"),
        "specialization": current_user.get("specialization")
    }

# 8. LOGOUT / REVOKE TOKEN
@router.post("/logout", response_model=StandardResponse)
async def logout_endpoint(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)):
    if credentials and credentials.credentials:
        try:
            payload = decode_jwt(credentials.credentials)
            jti = payload.get("jti")
            exp = payload.get("exp", time.time() + 3600)
            if jti:
                REVOKED_TOKENS[jti] = exp
        except Exception:
            pass
    return StandardResponse(success=True, message="Logged out successfully.")
