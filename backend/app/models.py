import time
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# 1. DATABASE ENTITY SCHEMAS
class UserModel(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    password_hash: Optional[str] = None
    role: str = "patient"  # "patient" | "doctor" | "admin"
    auth_provider: str = "email"  # "email" | "otp" | "google"
    google_id: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    age: Optional[int] = None
    gender: Optional[str] = "Not Specified"
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    fee: Optional[int] = None
    location: Optional[str] = None
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)

class OTPRecord(BaseModel):
    phone_number: str
    otp_hash: str
    attempts: int = 0
    max_attempts: int = 5
    expires_at: float
    created_at: float = Field(default_factory=time.time)
    is_consumed: bool = False

# 2. REQUEST & RESPONSE SCHEMAS
class SendOTPRequest(BaseModel):
    phone_number: str = Field(..., description="E.164 formatted phone number e.g. +919876543210")

class VerifyOTPRequest(BaseModel):
    phone_number: str = Field(..., description="E.164 formatted phone number")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit numeric OTP code")
    role: Optional[str] = "patient"
    name: Optional[str] = None

class SendEmailOTPRequest(BaseModel):
    email: str = Field(..., description="Recipient email address")

class VerifyEmailOTPRequest(BaseModel):
    email: str = Field(..., description="Recipient email address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")
    role: Optional[str] = "patient"
    name: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    credential: Optional[str] = Field(None, description="Google OAuth 2.0 ID Token / Credential")
    email: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = "patient"
    avatar: Optional[str] = None

class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    phone_number: str = Field(..., min_length=10, max_length=20)
    password: str = Field(..., min_length=6, max_length=128)
    role: str = "patient"
    age: Optional[int] = 25
    gender: Optional[str] = "Not Specified"
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    fee: Optional[int] = None
    location: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "patient"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
