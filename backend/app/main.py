import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Ensure parent directory is in sys.path for robust module imports
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from app.services.ai_engine import assess_symptoms
except ImportError:
    from services.ai_engine import assess_symptoms

app = FastAPI(
    title="AI-Based Patient Appointment System API",
    description="Backend API for AI Chatbot Symptom Assessment, Doctor Recommendation, and Slot Booking",
    version="1.0.0"
)

# Enable CORS for React Frontend & Local Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Doctor Database
DOCTORS_DB = [
    {
        "id": "doc-101",
        "name": "Dr. Rajesh Sharma",
        "specialization": "Cardiologist",
        "qualification": "MD, DM (Cardiology) - 15 Yrs Exp",
        "rating": 4.9,
        "fee": 800,
        "location": "Central Heart Hospital, Metro City",
        "available_slots": ["09:00 AM", "11:30 AM", "04:00 PM", "06:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-102",
        "name": "Dr. Ananya Verma",
        "specialization": "Dermatologist",
        "qualification": "MD (Dermatology) - 10 Yrs Exp",
        "rating": 4.8,
        "fee": 650,
        "location": "Skin & Glow Clinic, Sector 18",
        "available_slots": ["10:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-103",
        "name": "Dr. Vikram Sethi",
        "specialization": "Neurologist",
        "qualification": "DM (Neurology), AIIMS - 18 Yrs Exp",
        "rating": 4.95,
        "fee": 1000,
        "location": "Brain Care Institute, Tech Park",
        "available_slots": ["11:00 AM", "02:00 PM", "05:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-104",
        "name": "Dr. Sunita Patel",
        "specialization": "Pulmonologist",
        "qualification": "MD (Pulmonary Medicine) - 12 Yrs Exp",
        "rating": 4.7,
        "fee": 700,
        "location": "Breathe Easy Respiratory Care",
        "available_slots": ["09:30 AM", "12:30 PM", "04:30 PM"],
        "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-105",
        "name": "Dr. Arvind Mehta",
        "specialization": "Orthopedist",
        "qualification": "MS (Orthopedics) - 14 Yrs Exp",
        "rating": 4.85,
        "fee": 750,
        "location": "Joint & Bone Care Clinic",
        "available_slots": ["10:30 AM", "02:30 PM", "06:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": "doc-106",
        "name": "Dr. Priya Roy",
        "specialization": "General Physician",
        "qualification": "MBBS, MD (General Medicine) - 8 Yrs Exp",
        "rating": 4.75,
        "fee": 500,
        "location": "City Care Family Clinic",
        "available_slots": ["09:00 AM", "11:00 AM", "03:00 PM", "07:00 PM"],
        "avatar": "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
    }
]

# In-Memory Appointments Database
APPOINTMENTS_DB = [
    {
        "id": "apt-901",
        "patient_id": "pat-001",
        "patient_name": "Rohan Das",
        "patient_age": 28,
        "doctor_id": "doc-101",
        "doctor_name": "Dr. Rajesh Sharma",
        "specialization": "Cardiologist",
        "date": "2026-08-28",
        "slot": "11:30 AM",
        "status": "Confirmed",
        "symptoms": "Occasional chest tightness and palpitations after workout",
        "ai_summary": "Patient reports chest tightness & palpitations. Preliminary Assessment: Angina/Arrhythmia. Recommended Cardiologist."
    }
]

# Data Schemas
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
def read_root():
    return {"status": "Online", "message": "AI-Based Patient Appointment System API"}

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

@app.get("/api/appointments/doctor/{doctor_id}")
def get_doctor_appointments(doctor_id: str):
    return [a for a in APPOINTMENTS_DB if a["doctor_id"] == doctor_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
