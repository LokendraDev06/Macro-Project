# Milestone 4: AI Chatbot, Doctor Recommendation & Appointment System Development

---

## Document Metadata & Team Details

* **Project Title:** AI-Based Patient Appointment System
* **Document Type:** Milestone 4 Implementation & Engineering Development Report
* **Submission Milestone:** Milestone 4: AI Chatbot, Doctor Recommendation & Appointment System Development
* **Team Lead / Authors:** Lokendra Prajapati & Samyak Lariya
* **Roll Numbers / Student IDs:** BTIT2603D03 & BTIT2603D05
* **Branch / Department:** Information Technology (B.Tech IT)
* **GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **Date of Submission:** September 2026

---

## 1. Executive Summary & Milestone 4 Scope

In **Milestone 4**, the architectural design and dataset models formulated in prior milestones were transformed into fully functional software subsystems. The primary objective was to build and seamlessly integrate three core pillars of the platform:
1. **Interactive AI Health Chatbot:** An intelligent conversational interface capable of interacting empathetically with patients, collecting reported symptoms, and evaluating clinical urgency.
2. **Dynamic Doctor Recommendation Engine:** An algorithmic mapper connecting analyzed symptom clusters to certified medical specializations and licensed practitioner profiles.
3. **Real-Time Appointment Scheduling System:** An interactive calendar and slot booking engine allowing patients to view doctor profiles, select open consultation slots, and commit appointments with automated conflict prevention.

A paramount engineering and ethical consideration throughout Milestone 4 was clinical safety: the AI system strictly adheres to non-replacement protocols, ensuring that all health guidance is framed as preliminary and necessitates consultation with a licensed physician.

---

## 2. AI Health Chatbot Development & Conversational Workflow

### 2.1 Front-End Conversational Drawer (`ChatbotDrawer.jsx`)
The chatbot is implemented as an accessible sliding drawer interface that can be triggered from anywhere on the platform:
* **Natural Dialogue Flow:** Allows patients to express their symptoms in conversational, unconstrained natural language.
* **Typing Indicator & Latency Feedback:** Enhances usability during asynchronous symptom evaluation.
* **Safety Banners & Quick Prompts:** Provides one-click symptom suggestions (e.g., *"Persistent cough & mild fever"*, *"Sharp knee pain when climbing stairs"*, *"Chest tightness & shortness of breath"*).

### 2.2 Conversational State Machine
```
[User Input: Symptom Description]
                |
                v
       [Emergency Filter]
        /              \
    (Positive)       (Negative)
      /                  \
[ER Alert Banner]   [Symptom Tokenizer & Matcher]
[Direct to Hospital]       \
                            v
                   [Condition Assessment]
                   [Specialist Suggestion]
                   [Confidence Scoring]
                            |
                            v
                  [Doctor Routing CTA]
                  [Book Recommended Specialist]
```

---

## 3. Symptom Assessment & Emergency Classification Engine (`ai_engine.py`)

The symptom assessment engine operates on a multi-stage triage pipeline combining hard clinical emergency boundaries with probabilistic token overlap:

### 3.1 Emergency Triage Classifier
To protect patient lives, high-risk cardiac and neurological emergency symptoms immediately bypass elective appointment scheduling:
```python
EMERGENCY_KEYWORDS = [
    "chest pain", "shortness of breath", "slurred speech", "numbness in face",
    "arm pain", "stroke", "heart attack", "unconscious", "severe bleeding",
    "difficulty breathing", "sudden weakness"
]
```
If an emergency trigger is detected:
* Returns `is_emergency = True` with high confidence (0.95).
* Generates an urgent clinical alert: *"CRITICAL ALERT: Your reported symptoms indicate a potential medical emergency. Please visit the nearest Emergency Room (ER) or call emergency medical services immediately!"*
* Disables elective booking for that specific triage interaction to prioritize immediate emergency care.

### 3.2 Clinical Similarity Matching
For non-emergency presentations, patient inputs are tokenized, normalized, and compared against the curated medical knowledge base (`symptom_specialist_dataset.csv`):
* **Token Overlap Metric:**
  $$\text{Score} = \frac{|\text{Tokens}_{\text{user}} \cap \text{Tokens}_{\text{dataset}}|}{\max(|\text{Tokens}_{\text{dataset}}|, 1)}$$
* **Confidence Metric:** Scaled mathematically from 0.60 to 0.95 based on token overlap.
* **Graceful Fallback:** If symptom match confidence is below 0.15, the system defaults to "General Health Consultation Required" with a **General Physician**.

---

## 4. Doctor Recommendation & Specialization Routing

### 4.1 Automated Specialist Mapping
The engine maps verified health conditions directly to specialized medical disciplines:
* Cardiac / Vascular symptoms &rarr; **Cardiologist**
* Dermatological / Epidermal lesions &rarr; **Dermatologist**
* Central Nervous System / Migraines &rarr; **Neurologist**
* Respiratory / Pulmonary complaints &rarr; **Pulmonologist**
* Musculoskeletal & Joint pains &rarr; **Orthopedist**
* Systemic / Unspecified symptoms &rarr; **General Physician**

### 4.2 Dynamic Doctor Directory & Filtering
The backend endpoint `GET /api/doctors?specialization={specialist}` dynamically queries and returns verified practitioner profiles:
* Includes doctor credentials, years of clinical experience, patient ratings, consultation fees, hospital/clinic address, and available consultation time slots.
* Displays doctors in interactive cards with instant "Book Appointment" triggers pre-filled with the recommended specialty.

---

## 5. Appointment Scheduling & Slot Management System

### 5.1 Interactive Booking Workflow (`AppointmentModal.jsx`)
The appointment booking engine facilitates a streamlined 4-step scheduling flow:
1. **Practitioner Overview:** Displays doctor's name, specialization, consultation fee, and clinic location.
2. **Date Picker:** Enforces valid current or future date selection.
3. **Real-Time Slot Selection Grid:** Displays available morning and afternoon consultation slots (e.g., `09:00 AM`, `11:30 AM`, `04:00 PM`).
4. **Patient Demographic & Clinical Intake:** Captures patient name, age, phone number, symptoms, and the pre-computed AI triage summary.

### 5.2 Conflict Prevention & Atomic Booking (`/api/appointments/book`)
The backend booking handler enforces strict validation:
* Validates that the selected slot belongs to the doctor's active schedule.
* Checks against existing bookings for that doctor on that date to prevent double-booking.
* Assigns a unique appointment ID (e.g., `apt-1002`) and commits the record with status `Confirmed`.
* Automatically synchronizes the new appointment with the patient's record and doctor's dashboard.

---

## 6. Clinical Safety, Ethical Boundaries & Medical Disclaimers

### Statutory Healthcare Safeguards:
1. **Assistive Decision Support Only:** The platform explicitly states that AI suggestions are preliminary and supportive, never diagnostic.
2. **Prohibition of Automated Prescriptions:** The AI chatbot is restricted from prescribing scheduled pharmaceuticals or modifying doctor-prescribed regimens.
3. **Mandatory Doctor Verification:** All preliminary AI findings are summarized into a concise clinical note attached to the booking, requiring review and verification by the attending physician during the consultation.
4. **Prominent UI Disclaimers:** Displayed clearly in both the conversational drawer and appointment confirmation receipts.

---

## 7. Milestone 4 Deliverables & Verification Summary

* ✅ Developed real-time AI Health Chatbot drawer (`ChatbotDrawer.jsx`).
* ✅ Implemented symptom assessment engine with emergency detection filter (`ai_engine.py`).
* ✅ Integrated automated doctor recommendation and specialization routing (`/api/doctors`).
* ✅ Built appointment scheduling engine with slot conflict prevention (`AppointmentModal.jsx`, `main.py`).
* ✅ Enforced statutory medical disclaimers and doctor-in-the-loop clinical protocols.
* ➡️ **Ready for Milestone 5:** System integration testing across diverse patient scenarios, edge case validation, and final documentation.
