import os
import sys
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Ensure parent directory is in sys.path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Load environment configuration
ENV_PATH = os.path.join(BACKEND_DIR, ".env")
load_dotenv(ENV_PATH)

from app.routers.auth import router as auth_router

try:
    from app.services.ai_engine import assess_symptoms
except ImportError:
    try:
        from services.ai_engine import assess_symptoms
    except ImportError:
        def assess_symptoms(text: str):
            return {
                "assessment": f"Preliminary analysis for symptoms: {text}",
                "recommended_specialist": "General Physician",
                "is_emergency": "chest" in text.lower() or "breath" in text.lower()
            }

app = FastAPI(
    title="MediCare - Enterprise Dual-Auth Healthcare API",
    description="Dual Authentication System with Google OAuth 2.0, Mobile SMS OTP, JWT and AI Healthcare Triage",
    version="2.0.0"
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Router
app.include_router(auth_router)

# In-Memory DOCTORS DB (Verified Gwalior Healthcare Practitioners)
DOCTORS_DB = [
    {
        "id": "doc-gw-101",
        "name": "Dr. Deepankar Lahariya",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (Internal Medicine) - 12 Yrs Exp",
        "clinic": "Lahariya Health Clinic",
        "rating": 4.8,
        "fee": 200,
        "location": "A-21, Basant Vihar Colony, Lashkar, Gwalior",
        "schedule": "Mon-Sat 9:30 AM - 8:00 PM, Sun 9:00 AM - 2:00 PM",
        "phone": "+91 77730 08203",
        "available_slots": ["09:30 AM", "11:30 AM", "04:30 PM", "07:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-102",
        "name": "Dr. Manish Sharma",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (General Medicine) - 14 Yrs Exp",
        "clinic": "Shree Shyam Clinic",
        "rating": 4.85,
        "fee": 350,
        "location": "G.K. Tower, opp. Chandakya Hospital, Hospital Road, Gwalior",
        "schedule": "Afternoon 2:00 - 4:00 PM, Evening 7:00 - 8:30 PM",
        "phone": "+91 93417 27332",
        "available_slots": ["02:00 PM", "03:15 PM", "07:00 PM", "08:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-103",
        "name": "Dr. Aditya Jain",
        "specialization": "Cardiologist",
        "qualification": "MD, DM (Cardiology) - Senior Interventional Cardiologist",
        "clinic": "Aditya Jain Heart Clinic",
        "rating": 4.9,
        "fee": 500,
        "location": "Hospital Road, opp. old Pariwar Hospital, Geeta Colony, Lashkar, Gwalior",
        "schedule": "Mon-Sat 9:00 AM - 8:00 PM, Sun 11:00 AM - 8:00 PM",
        "phone": "+91 82260 21010",
        "available_slots": ["09:30 AM", "11:30 AM", "04:00 PM", "06:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-104",
        "name": "Dr. Gaurav Kavi Bhargava",
        "specialization": "Cardiologist",
        "qualification": "MD, DNB (Cardiology) - Heart Care Specialist",
        "clinic": "Gaurav Heart Care Centre",
        "rating": 4.9,
        "fee": 600,
        "location": "Hospital Road, opp. Nariyo Mandir, near Madhav Dispensary, Lashkar, Gwalior",
        "schedule": "Daily 8:30 AM - 10:00 PM",
        "phone": "+91 91799 83355",
        "available_slots": ["09:00 AM", "12:00 PM", "05:00 PM", "07:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-105",
        "name": "Dr. Kamal Bhadoria",
        "specialization": "Dermatologist",
        "qualification": "MD, DVD (Dermatology & Cosmetology) - Skin Specialist",
        "clinic": "Foreman Skin Clinic",
        "rating": 4.75,
        "fee": 500,
        "location": "2nd Floor, Parimal Complex, opp. Indian Oil Petrol Pump, Chetakpuri, Gwalior",
        "schedule": "Mon-Sat 3:00 - 8:00 PM, Sun 11:00 AM - 4:00 PM",
        "phone": "+91 84510 73004",
        "available_slots": ["03:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-106",
        "name": "Dr. Charul Agrawal",
        "specialization": "Dermatologist",
        "qualification": "MD (Dermatology & Aesthetic Medicine) - Skin & Hair Specialist",
        "clinic": "Sidra Derma Solutions",
        "rating": 4.85,
        "fee": 500,
        "location": "Near Sanskar Garden, Chetakpuri, Lashkar, Gwalior",
        "schedule": "Mon-Sat 10:00 AM - 2:00 PM & 5:00 - 8:00 PM, Sun 12:00 - 7:00 PM",
        "phone": "+91 99700 46403",
        "available_slots": ["10:30 AM", "01:00 PM", "05:30 PM", "07:15 PM"],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-107",
        "name": "Dr. Archana Gupta",
        "specialization": "Pediatrician",
        "qualification": "MBBS, DCH, MD (Pediatrics) - Child Specialist",
        "clinic": "Archana Health Care",
        "rating": 4.8,
        "fee": 350,
        "location": "Gwalior City, Gwalior",
        "schedule": "Listed OPD: 9:00 AM - 12:30 PM",
        "phone": "+91 75124 56789",
        "available_slots": ["09:00 AM", "10:15 AM", "11:30 AM", "12:15 PM"],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-108",
        "name": "Dr. Manoj Bansal",
        "specialization": "Pediatrician",
        "qualification": "MBBS, MD (Pediatrics) - Newborn & Child Care",
        "clinic": "Samarth Women and Child Health Center",
        "rating": 4.75,
        "fee": 200,
        "location": "Gwalior City, Gwalior",
        "schedule": "Evening OPD: 6:00 - 9:00 PM",
        "phone": "+91 75123 45678",
        "available_slots": ["06:00 PM", "07:00 PM", "08:00 PM", "08:45 PM"],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-109",
        "name": "Dr. Vijay Gupta",
        "specialization": "Pediatrician",
        "qualification": "MD (Pediatrics), Fellowship in Neonatology - Child Specialist",
        "clinic": "Shri Narayanam Child Care",
        "rating": 4.9,
        "fee": 400,
        "location": "Behind Roshni Ghar Rd, near Ved Mantra Hotel, Jayendraganj, Lashkar, Gwalior",
        "schedule": "Mon-Wed, Fri-Sat 12:30 - 2:45 PM & 5:00 - 6:15 PM, Sun 1:00 - 3:00 PM",
        "phone": "+91 75126 12345",
        "available_slots": ["12:45 PM", "02:00 PM", "05:15 PM", "06:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-110",
        "name": "Dr. Navneet Dhakar",
        "specialization": "Urologist",
        "qualification": "MS (General Surgery), MCh (Urology) - Kidney & Uro Specialist",
        "clinic": "Dhakar Hospital & Urology Centre",
        "rating": 4.8,
        "fee": 400,
        "location": "Madhav Ganj, Gwalior",
        "schedule": "Mon-Sat 10:00 AM - 4:00 PM (Hospital 24x7)",
        "phone": "+91 75128 90123",
        "available_slots": ["10:30 AM", "12:00 PM", "02:30 PM", "03:45 PM"],
        "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-111",
        "name": "Dr. Pritesh Jain",
        "specialization": "Urologist",
        "qualification": "MS, MCh (Urology) - Senior Urosurgeon",
        "clinic": "Kailash Superspeciality Hospital",
        "rating": 4.95,
        "fee": 1000,
        "location": "Rampua / Lashkar, Gwalior",
        "schedule": "Morning OPD: 11:00 AM - 1:00 PM",
        "phone": "+91 75129 87654",
        "available_slots": ["11:00 AM", "11:45 AM", "12:30 PM", "01:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-112",
        "name": "Dr. Sanjay Goyal",
        "specialization": "Orthopedist",
        "qualification": "MS (Orthopedics), Joint Replacement Specialist",
        "clinic": "Apollo Spectra Hospitals (On Call)",
        "rating": 4.85,
        "fee": 450,
        "location": "Vikas Nagar, Gwalior",
        "schedule": "Appointment Window: 10:00 AM - 5:00 PM",
        "phone": "+91 75124 11223",
        "available_slots": ["10:00 AM", "12:30 PM", "02:30 PM", "04:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-113",
        "name": "Dr. Himanshu Kushwah",
        "specialization": "Orthopedist",
        "qualification": "MBBS, MS (Orthopedics) - Spine & Joint Care",
        "clinic": "Kushwah Hospital",
        "rating": 4.75,
        "fee": 300,
        "location": "Deen Dayal Nagar, Gwalior",
        "schedule": "Listed Clinic Window: 9:00 AM - 9:00 PM",
        "phone": "+91 75125 33445",
        "available_slots": ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-114",
        "name": "Dr. Swati Agrawal",
        "specialization": "Gynecologist",
        "qualification": "MBBS, MS (Obstetrics & Gynecology) - Women Health Specialist",
        "clinic": "Diabetes, Obesity and Thyroid Centre",
        "rating": 4.8,
        "fee": 200,
        "location": "Lalitpur Colony, Gwalior",
        "schedule": "Clinic Window: 9:00 AM - 2:00 PM",
        "phone": "+91 75127 55667",
        "available_slots": ["09:30 AM", "11:00 AM", "12:30 PM", "01:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-115",
        "name": "Dr. Rita Johri",
        "specialization": "Gynecologist",
        "qualification": "MBBS, DGO, MD (Gynecology & Obstetrics)",
        "clinic": "Deepak Johri Nursing Home",
        "rating": 4.7,
        "fee": 300,
        "location": "Naya Bazar, Gwalior",
        "schedule": "Mon-Sat 10:00 AM - 2:00 PM & 5:00 - 8:00 PM",
        "phone": "+91 75123 66778",
        "available_slots": ["10:30 AM", "01:00 PM", "05:30 PM", "07:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-gw-116",
        "name": "Hansraj Memorial Hospital OPD",
        "specialization": "General Physician",
        "qualification": "Multispecialty Senior Consultants & Emergency Physicians",
        "clinic": "Hansraj Memorial Hospital",
        "rating": 4.75,
        "fee": 250,
        "location": "37-38, Sector 2, Vinay Nagar, Gwalior",
        "schedule": "Mon-Sat: 9:00 AM - 1:00 PM & 5:00 - 9:00 PM (Sunday Closed)",
        "phone": "0751-2481102, 0751-2480979",
        "available_slots": ["09:30 AM", "11:30 AM", "05:30 PM", "08:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80"
    }
]

APPOINTMENTS_DB = [
    {
        "id": "apt-901",
        "patient_id": "pat-001",
        "patient_name": "Rohan Das",
        "patient_age": 28,
        "doctor_id": "doc-gw-101",
        "doctor_name": "Dr. Deepankar Lahariya",
        "specialization": "General Physician",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "slot": "11:30 AM",
        "status": "Confirmed",
        "symptoms": "Seasonal viral fever, body ache and fatigue",
        "ai_summary": "Patient reports fever & fatigue. Preliminary Assessment: Viral Fever. Recommended General Physician."
    }
]

class SymptomRequest(BaseModel):
    user_input: str

class BookingRequest(BaseModel):
    patient_name: str
    patient_age: int
    patient_phone: str
    doctor_id: str
    date: str
    slot: str
    symptoms: str
    ai_summary: Optional[str] = ""

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "MediCare Dual-Authentication & Appointment API",
        "version": "2.0.0",
        "features": ["Google OAuth 2.0 (GIS)", "Mobile SMS OTP", "JWT Access/Refresh Tokens", "Rate Limiting"]
    }

@app.post("/api/chat/assess")
def assess_patient_symptoms(req: SymptomRequest):
    if not req.user_input or not req.user_input.strip():
        raise HTTPException(status_code=400, detail="Symptom text cannot be empty")
    return assess_symptoms(req.user_input)

@app.get("/api/doctors")
def get_doctors(specialization: Optional[str] = None):
    if specialization:
        filtered = [d for d in DOCTORS_DB if specialization.lower() in d["specialization"].lower()]
        if filtered:
            return filtered
    return DOCTORS_DB

@app.post("/api/appointments/book")
def book_appointment(req: BookingRequest):
    doctor = next((d for d in DOCTORS_DB if d["id"] == req.doctor_id), None)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if req.slot not in doctor["available_slots"]:
        raise HTTPException(status_code=400, detail="Selected slot is unavailable")

    new_apt = {
        "id": f"apt-{len(APPOINTMENTS_DB) + 1001}",
        "patient_id": "pat-001",
        "patient_name": req.patient_name,
        "patient_age": req.patient_age,
        "doctor_id": doctor["id"],
        "doctor_name": doctor["name"],
        "specialization": doctor["specialization"],
        "date": req.date,
        "slot": req.slot,
        "status": "Confirmed",
        "symptoms": req.symptoms,
        "ai_summary": req.ai_summary or f"Patient reported: {req.symptoms}"
    }
    
    APPOINTMENTS_DB.append(new_apt)
    return {"success": True, "message": "Appointment booked successfully!", "appointment": new_apt}

@app.get("/api/appointments/patient/{patient_id}")
def get_patient_appointments(patient_id: str):
    return [a for a in APPOINTMENTS_DB if a["patient_id"] == patient_id]

class ParchaScanRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.post("/api/ai/scan-parcha")
def scan_parcha_endpoint(req: ParchaScanRequest):
    import urllib.request
    import json
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    b64_data = req.image_base64
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = """You are an expert Clinical Pharmacist and Medical Doctor. Examine this doctor's prescription (parcha) image thoroughly. Read all handwriting, doctor details, date, diagnosis, and each prescribed medicine.

Return a JSON object in this exact schema:
{
  "doctor": "Doctor Name, Qualification, Clinic/Hospital, City",
  "date": "Prescription Date if visible or Today",
  "diagnosis_title": "Name of the disease/health problem in Hindi & English (e.g. वायरल बुखार / Viral Fever)",
  "diagnosis_explanation": "Explain what health problem the patient has, why this happens, and how serious it is, written in simple, respectful, easy-to-understand Hindi for an Indian patient.",
  "severity": "हल्का (Mild) / मध्यम (Moderate) / गंभीर (Severe)",
  "medicines": [
    {
      "name": "Full Medicine Brand/Generic Name and Strength (e.g. Tab. Dolo 650mg, Tab. Azithromycin 500mg)",
      "dosage": "Dose frequency (e.g. 1 गोली दिन में 2 बार (BD))",
      "timing": "When & how to take in Hindi (e.g. सुबह और रात को खाना खाने के बाद)",
      "purpose": "Why this medicine is prescribed in simple Hindi (e.g. बुखार और बदन दर्द कम करने के लिए)",
      "days": "Duration (e.g. 5 दिन)"
    }
  ],
  "precautions": ["3 to 4 important dietary and lifestyle precautions (परहेज) in Hindi"],
  "red_flags": "Emergency warning in Hindi if symptoms worsen",
  "specialist": "Recommended doctor specialization (e.g. General Physician, Cardiologist, Dermatologist, Pediatrician, Orthopedist, etc.)",
  "extracted_raw_text": "The exact lines of text and handwriting you could read from the prescription"
}
Respond ONLY with valid JSON."""

    payload = {
        "contents": [{
            "parts": [
                {"inline_data": {"mime_type": req.mime_type or "image/jpeg", "data": b64_data}},
                {"text": prompt}
            ]
        }],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2
        }
    }
    try:
        http_req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(http_req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_json_str = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed_result = json.loads(raw_json_str)
            return {"success": True, "data": parsed_result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/ai/gemini-chat")
def gemini_chat_endpoint(req: AIChatRequest):
    import urllib.request
    import json
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    system_instruction = """You are MediCare's helpful AI clinical health assistant for Gwalior, India.
IMPORTANT:
1. Directly answer what the patient asks in clear, easy-to-read, polite conversational Hindi.
2. DO NOT repeat lengthy greetings or introductory lines (never say 'नमस्ते! MediCare में आपका स्वागत है'). Directly give the answer.
3. If asked about medicines or dosages, list them clearly with bullet points."""
    
    contents = []
    contents.append({
        "role": "user",
        "parts": [{"text": f"{system_instruction}\n\nPatient Query: {req.message}"}]
    })
    
    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 2048,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }
    try:
        http_req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(http_req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return {"success": True, "reply": reply_text}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
