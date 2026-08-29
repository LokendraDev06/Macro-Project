# Milestone 1: Existing Healthcare Appointment Systems & AI Chatbot Study

---

## Document Metadata & Team Details

* **Project Title:** AI-Based Patient Appointment System
* **Document Type:** Milestone 1 Comprehensive Project & Study Report
* **Submission Milestone:** Milestone 1
* **Team Lead / Author:** Lokendra Prajapati & Samyak Lariya 
* **Roll Number / Student ID:** BTIT2603D03 & BTIT2603D05
* **GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **Date of Submission:** August 2026

---

## 1. Milestone 1 Study: Existing Healthcare Appointment Systems & AI Chatbot Analysis

### 1.1 Executive Summary
Modern healthcare management demands seamless coordination between patient triage, specialist recommendation, and calendar scheduling. However, traditional digital health platforms remain fragmented. Appointment booking portals require patients to self-diagnose and select medical specialties without clinical guidance, while standalone AI diagnostic chatbots lack direct scheduling capabilities.

This study analyzes prominent existing platforms—**Practo**, **Zocdoc**, **Ada Health**, **Babylon Health**, and **Buoy Health**—comparing their registration flows, symptom collection, AI capabilities, usability, and operational limitations to define requirements for our proposed **AI-Based Patient Appointment System**.

### 1.2 Comparative Feature Analysis Matrix

| Platform | Category | Primary Features | AI / LLM Capabilities | Usability & Strengths | Major Limitations & Gaps |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Practo** | Appointment Booking | Specialist search, clinic directory, slot booking, digital health records | **Low** (Keyword-based directory search) | Extensive doctor network, intuitive scheduling UI | Patient must self-diagnose and pick doctor specialty; no AI symptom assessment. |
| **Zocdoc** | Doctor Discovery | Location & insurance filter, doctor reviews, real-time booking | **Low** (Rule-based query matching) | Excellent availability tracking and calendar integration | Lacks preliminary symptom triage; patient requires prior medical awareness. |
| **Ada Health** | AI Symptom Assessment | Probabilistic diagnostic questionnaire, symptom report | **High** (Bayesian AI diagnostic engine) | Highly accurate symptom assessment and risk report | **No direct doctor scheduling** or appointment booking integration. |
| **Babylon Health** | Telehealth & AI Triage | Conversational AI triage, virtual video consultations | **High** (NLP & Expert Rules Engine) | Combines virtual consultations with chatbot triage | Complex setup, limited local clinic network integration. |
| **Buoy Health** | Care Navigation Triage | Symptom questionnaire, level of care routing (ER vs Urgent Care) | **Moderate-High** (Machine Learning & Rules) | Great emergency vs routine care decision tree | Redirection to external clinic partners is fragmented; lacks unified booking DB. |

### 1.3 Key Industry Challenges & Gaps Identified
1. **The Triage-Scheduling Disconnect:** Existing apps separate symptom evaluation from appointment booking. Users must manually bridge this gap.
2. **Patient Self-Diagnosis Dilemma:** Patients frequently book appointments with incorrect medical specialists (e.g. visiting Orthopedics for rheumatic fever joint pain), leading to wasted consultations and delayed care.
3. **Absence of Emergency Triage Filters:** Standard booking portals fail to immediately flag life-threatening symptoms (e.g. acute chest pain, stroke symptoms), putting critical patients at risk.
4. **Doctor Context Blindness:** Doctors receive no structured pre-consultation AI summary, spending valuable appointment time on repetitive basic intake.

---

## 2. Problem Statement & Project Objectives

### 2.1 Problem Statement
> *"Existing appointment booking platforms require patients to manually identify the appropriate medical specialty without clinical guidance, while AI symptom checkers function in isolation without offering direct scheduling with relevant nearby doctors. There is a critical need for an integrated system that combines AI-driven symptom assessment, automated doctor-specialty recommendation, emergency risk filtering, real-time slot scheduling, and structured clinical summaries for doctors."*

### 2.2 Core Project Objectives
1. **Intelligent Symptom Triage:** Provide an interactive 24/7 AI chatbot that accepts natural language inputs to collect patient symptoms, duration, and severity.
2. **Automated Symptom-to-Specialty Mapping:** Algorithmically map patient symptom profiles to the most suitable medical specialization (Cardiology, Dermatology, Neurology, Pulmonology, Orthopedics, General Physician).
3. **Emergency Risk Detection:** Identify life-threatening symptoms in real-time and immediately redirect patients to Emergency Room (ER) services.
4. **Seamless Real-Time Scheduling:** Provide an interactive calendar booking system with verified doctors, displaying available slots and preventing overlapping reservations.
5. **Doctor Pre-Consultation Summary:** Generate automated AI clinical summaries for doctors before appointments to maximize consultation effectiveness.

---

## 3. Technology Stack

The proposed system utilizes a modern decoupled full-stack architecture built for scalability, performance, and responsive user experience:

```
[ Frontend: React.js + Vite ] <---> [ REST API: FastAPI (Python 3.14) ] <---> [ AI Engine & Datasets ]
```

* **Frontend Layer:**
  * **Framework:** React.js 18 with Vite build tool
  * **Styling & Design System:** Custom Vanilla CSS3, Modern Glassmorphism, CSS Variables, Responsive Grid Layout
  * **Icons & Components:** Lucide-React Icons, Custom Modal & Drawer components
* **Backend Layer:**
  * **Language & Runtime:** Python 3.14
  * **Framework:** FastAPI (Asynchronous Python REST API)
  * **Server:** Uvicorn ASGI Server
  * **Data Validation:** Pydantic Schemas & Type Hints
  * **Security & Access:** CORS Middleware
* **Database & Data Storage:**
  * **Medical Dataset:** `symptom_specialist_dataset.csv` (Mapping symptoms -> diseases -> recommended doctor specialties)
  * **Storage Engine:** In-Memory Relational Data Structures (Milestone 1) -> SQLite / PostgreSQL with SQLAlchemy (Milestone 3)
* **AI & NLP Engine:**
  * **Emergency Classifier:** High-risk keyword pattern matcher (`chest pain`, `shortness of breath`, `slurred speech`)
  * **Symptom Matcher:** Token overlap & similarity score matching algorithm

---

## 4. System Architecture, ER Diagram & Process Flowchart

### 4.1 Tiered System Architecture

```
+-------------------------------------------------------------------------+
|                          PRESENTATION LAYER                             |
|    React.js (Vite) Single Page App | Patient & Doctor Dashboards       |
+------------------------------------+------------------------------------+
                                     |  HTTP REST / API Calls
                                     v
+-------------------------------------------------------------------------+
|                        FASTAPI BACKEND GATEWAY                          |
|  - CORS Middleware  - Pydantic Validation  - Route Controllers           |
+------------------------------------+------------------------------------+
                                     |  Internal Service Calls
                                     v
+-------------------------------------------------------------------------+
|                        AI RECOMMENDATION ENGINE                         |
|  - Emergency Triage Classifier   - Symptom-to-Specialist Matcher        |
+------------------------------------+------------------------------------+
                                     |  Query / Read / Write
                                     v
+-------------------------------------------------------------------------+
|                           DATA LAYER                                    |
|  - Symptom-Disease Dataset (CSV)   - Doctor & Appointment DB           |
+-------------------------------------------------------------------------+
```

### 4.2 Entity-Relationship (ER) Diagram

```
+------------------+             +--------------------+             +------------------+
|     PATIENT      |             |    APPOINTMENT     |             |      DOCTOR      |
+------------------+             +--------------------+             +------------------+
| patient_id (PK)  |<--- 1:N --->| appointment_id(PK) |<--- N:1 --->| doctor_id (PK)   |
| name             |             | patient_id (FK)    |             | name             |
| age              |             | doctor_id (FK)     |             | specialization   |
| phone            |             | date               |             | qualification    |
| email            |             | slot               |             | rating           |
| medical_history  |             | status             |             | fee              |
+------------------+             | symptoms           |             | location         |
                                 | ai_summary         |             | available_slots  |
                                 +--------------------+             +------------------+
```

### 4.3 Process Flowchart

```
[Patient Log In / Arrival]
           |
           v
[Interactive AI Chatbot Input Symptoms]
           |
           v
   /===============\
  /   Emergency     \ --- YES ---> [ALERT: Redirect to Emergency Room (ER)]
  \   Symptoms?     /
   \===============/
           | NO
           v
[AI Assesses Condition & Recommends Doctor Specialty]
           |
           v
[Display Filtered Doctor List & Available Slots]
           |
           v
[Patient Selects Date/Time Slot & Confirms Booking]
           |
           v
[System Saves Appointment & Generates AI Summary]
           |
           v
[Summary Displayed on Doctor Dashboard Queue]
```

---

## 5. Milestone 1 Deliverables & Current Progress

### 5.1 Implemented Frontend Modules
The following user interface components are fully developed, styled, and functional:

1. **`Navbar.jsx`:** Main navigation bar with brand identity, active tab switcher, and quick role toggle (Patient View vs. Doctor View).
2. **`IntroOnboarding.jsx`:** Interactive hero banner introducing the system, displaying key features, emergency notices, and quick action buttons.
3. **`ChatbotDrawer.jsx`:** Sliding AI conversational drawer for symptom intake, integrating real-time responses from backend AI endpoints.
4. **`DoctorCard.jsx`:** Card view for displaying doctor profiles, specializations, ratings, clinic locations, fees, and slot availability.
5. **`AppointmentModal.jsx`:** Slot selection and patient details modal that submits booking requests to the backend.
6. **`PatientDashboard.jsx`:** Patient dashboard displaying past consultations, symptom chat history, and upcoming appointments.
7. **`DoctorDashboard.jsx`:** Doctor workspace displaying upcoming patient appointments, time slot status, and AI-generated clinical summaries.

### 5.2 Implemented Backend Endpoints

| Method | Endpoint Path | Functionality | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root health check & API version response | **Active** |
| `POST` | `/api/chat/assess` | Processes patient symptoms, performs emergency check, returns matched specialty & AI summary | **Active** |
| `GET` | `/api/doctors` | Returns doctor profiles (supports optional `specialization` query filter) | **Active** |
| `POST` | `/api/appointments/book` | Validates slot availability, registers appointment, records clinical summary | **Active** |
| `GET` | `/api/appointments/patient/{id}` | Retrieves all booked appointments for a patient | **Active** |
| `GET` | `/api/appointments/doctor/{id}` | Retrieves appointment queue and AI clinical summaries for a specific doctor | **Active** |

---

## 6. GitHub Repository & Live Demo Details

### 6.1 GitHub Repository Link
* **Repository URL:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **License:** MIT License
* **Repository Structure:**
  * `/frontend`: React + Vite application
  * `/backend`: FastAPI backend application with AI engine
  * `/docs`: Project documentation, Milestone 1 study report, HTML and PDF report artifacts

### 6.2 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System.git
cd "AI Based Patient-Appoinment System"

# 2. Run Backend Server (FastAPI)
cd backend
pip install -r requirements.txt
python app/main.py
# Backend API will start at http://127.0.0.1:8000
# Interactive API documentation at http://127.0.0.1:8000/docs

# 3. Run Frontend Server (React + Vite)
cd ../frontend
npm install
npm run dev
# Frontend app will start at http://localhost:5173
```

---

## 7. Conclusion & Milestone 2 Roadmap

Milestone 1 successfully establishes the comparative market research, problem definition, system architecture, data models, initial frontend UI stack, and backend FastAPI endpoints.

**Milestone 2 Roadmap:**
* Dataset expansion (incorporating Kaggle Healthcare Symptom-Disease datasets).
* Preprocessing, label encoding, and feature vectorization.
* Training Machine Learning classifier models (Scikit-learn Random Forest / Decision Trees) for enhanced diagnostic accuracy.
