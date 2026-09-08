import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from dotenv import load_dotenv

def get_smtp_config():
    # Reload from .env dynamically
    load_dotenv(override=True)
    return {
        "server": os.getenv("SMTP_SERVER", "smtp.gmail.com").strip(),
        "port": int(os.getenv("SMTP_PORT", 587)),
        "email": os.getenv("SMTP_EMAIL", "").strip(),
        "password": os.getenv("SMTP_PASSWORD", "").strip()
    }

def send_real_email_otp(to_email: str, otp_code: str) -> Dict[str, Any]:
    """
    Sends a real verification OTP code directly to the user's Gmail / Email address via SMTP.
    """
    config = get_smtp_config()
    smtp_email = config["email"]
    smtp_password = config["password"]
    smtp_server = config["server"]
    smtp_port = config["port"]

    print(f"\n[EMAIL DISPATCH INITIATED]")
    print(f"To: {to_email}")
    print(f"Generated OTP: {otp_code}")
    print(f"Sender Email Configured: '{smtp_email}' (Length: {len(smtp_email)})")

    if not smtp_email or not smtp_password:
        warning_msg = (
            f"SMTP_EMAIL ya SMTP_PASSWORD backend/.env me khali (empty) hai. "
            f"Real email delivery ke liye apna Gmail aur 16-digit App Password backend/.env me fill karein."
        )
        print(f"⚠️ [Email Service Error]: {warning_msg}")
        return {
            "success": False,
            "configured": False,
            "error": warning_msg,
            "otp_code": otp_code # Logged for local developer testing
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp_code} is your MediCare Verification Code"
        msg["From"] = f"MediCare Health <{smtp_email}>"
        msg["To"] = to_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
            .container {{ max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
            .header {{ text-align: center; margin-bottom: 24px; }}
            .logo {{ font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }}
            .otp-box {{ background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }}
            .otp-code {{ font-size: 34px; font-weight: 800; color: #1d4ed8; letter-spacing: 8px; font-family: monospace; }}
            .footer {{ font-size: 12px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏥 MediCare Health</div>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Secure Patient & Doctor Portal</p>
            </div>
            
            <p style="font-size: 15px; color: #1e293b; line-height: 1.5;">Hello,</p>
            <p style="font-size: 15px; color: #334155; line-height: 1.5;">
              Use the 6-digit verification code below to securely authenticate your MediCare account:
            </p>
            
            <div class="otp-box">
              <div class="otp-code">{otp_code}</div>
            </div>
            
            <p style="font-size: 13px; color: #475569; line-height: 1.5;">
              ⏱️ This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
            </p>
            
            <div class="footer">
              <p>© 2026 MediCare Health Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_body, "html"))

        # Strip any spaces from app password if user entered formatted password
        clean_password = smtp_password.replace(" ", "")

        with smtplib.SMTP(smtp_server, smtp_port, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_email, clean_password)
            server.sendmail(smtp_email, to_email, msg.as_string())

        print(f"✅ [Email Service Success]: Real verification email dispatched to {to_email}")
        return {"success": True, "configured": True, "message": f"Verification code successfully delivered to {to_email}"}
    except Exception as err:
        print(f"❌ [Email Service SMTP Error]: {err}")
        return {"success": False, "configured": True, "error": str(err), "otp_code": otp_code}
