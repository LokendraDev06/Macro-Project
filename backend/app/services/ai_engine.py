import os
import re
import csv
from typing import Dict, Any, List

# Load dataset for rule-based / similarity symptom matching
DATASET_PATH = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "symptom_specialist_dataset.csv"))

symptoms_data: List[Dict[str, str]] = []

try:
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                symptoms_data.append(row)
except Exception as e:
    print(f"Dataset load warning: {e}")
    symptoms_data = []

EMERGENCY_KEYWORDS = [
    "chest pain", "shortness of breath", "slurred speech", "numbness in face",
    "arm pain", "stroke", "heart attack", "unconscious", "severe bleeding",
    "difficulty breathing", "sudden weakness"
]

def check_emergency(symptoms_text: str) -> bool:
    """Check if symptoms contain high-risk emergency flags."""
    text_lower = symptoms_text.lower()
    for kw in EMERGENCY_KEYWORDS:
        if kw in text_lower:
            return True
    return False

def assess_symptoms(user_input: str) -> Dict[str, Any]:
    """
    Analyzes patient symptom input and returns:
    - Emergency status
    - Matched Possible Disease
    - Recommended Doctor Specialization
    - Severity Level
    - Confidence Score
    - Clinical Summary for Doctor
    """
    is_emergency = check_emergency(user_input)
    
    if is_emergency:
        return {
            "is_emergency": True,
            "matched_condition": "Emergency Condition Detected (Possible Acute Cardiac / Neurological Event)",
            "recommended_specialist": "Emergency Medicine / Cardiologist",
            "severity": "Critical / High",
            "confidence": 0.95,
            "clinical_summary": f"ALERT: High-risk symptoms reported: '{user_input}'. Direct patient to nearest ER immediately.",
            "bot_reply": "⚠️ CRITICAL ALERT: Your reported symptoms indicate a potential medical emergency (e.g. cardiac or acute condition). Please visit the nearest Emergency Room (ER) or call emergency medical services immediately! Do not wait for a regular appointment."
        }

    # Similarity matching over dataset
    user_words = set(re.findall(r'\w+', user_input.lower()))
    best_match = None
    best_score = 0.0
    
    if symptoms_data:
        for row in symptoms_data:
            symptom_tokens = set(re.findall(r'\w+', row.get('symptoms', '').lower()))
            overlap = len(user_words.intersection(symptom_tokens))
            score = overlap / max(len(symptom_tokens), 1)
            
            if score > best_score:
                best_score = score
                best_match = row

    if best_match is not None and best_score > 0.15:
        condition = best_match.get('disease', 'General Health Issue')
        specialist = best_match.get('recommended_specialist', 'General Physician')
        severity = best_match.get('severity', 'Mild')
        confidence = min(round(0.60 + (best_score * 0.35), 2), 0.95)
    else:
        condition = "General Health Consultation Required"
        specialist = "General Physician"
        severity = "Mild / General"
        confidence = 0.70

    clinical_summary = (
        f"Patient reports: '{user_input}'. "
        f"Preliminary AI Assessment: {condition} (Severity: {severity}). "
        f"Recommended Specialty: {specialist}."
    )

    bot_reply = (
        f"Based on your symptoms ('{user_input}'), our preliminary AI assessment suggests a possible match for "
        f"**{condition}** ({severity} severity). We recommend scheduling an appointment with a **{specialist}**.\n\n"
        f"📌 *Note: This is a preliminary assessment. Please consult a qualified doctor for diagnosis and treatment.*"
    )

    return {
        "is_emergency": False,
        "matched_condition": condition,
        "recommended_specialist": specialist,
        "severity": severity,
        "confidence": confidence,
        "clinical_summary": clinical_summary,
        "bot_reply": bot_reply
    }
