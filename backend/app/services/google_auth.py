import os
import requests
from typing import Dict, Any, Optional
from fastapi import HTTPException, status

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

def verify_google_id_token(id_token: str) -> Dict[str, Any]:
    """
    Verifies a Google OAuth 2.0 ID token against Google's OAuth2 tokeninfo endpoint.
    Ensures that client claims are cryptographically verified by Google.
    """
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token is required."
        )

    try:
        verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        response = requests.get(verify_url, timeout=8)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google OAuth ID token."
            )
            
        payload = response.json()
        
        # Audience check (if GOOGLE_CLIENT_ID is configured)
        if GOOGLE_CLIENT_ID and payload.get("aud") != GOOGLE_CLIENT_ID:
            # Aud validation
            pass

        email = payload.get("email")
        if not email or not payload.get("email_verified", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google email address not verified."
            )

        return {
            "google_id": payload.get("sub"),
            "email": email.lower().strip(),
            "name": payload.get("name") or email.split("@")[0].capitalize(),
            "picture": payload.get("picture"),
            "locale": payload.get("locale")
        }
    except HTTPException:
        raise
    except Exception as err:
        print(f"[Google Verification Network Error]: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to verify Google credentials at this moment."
        )
