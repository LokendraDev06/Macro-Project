# AI-Based Patient Appointment System — Milestones 1, 2 & 3 Viva Master Guide

**Project Title:** AI-Based Patient Appointment System  
**Authors / Team:** Lokendra Prajapati (BTIT2603D03) & Samyak Lariya (BTIT2603D05)  
**Department:** Information Technology (B.Tech IT)  
**GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)  
**Generated PDF Location:** [`docs/Milestone_1_2_3_Viva_Comprehensive_Guide.pdf`](file:///d:/project/AI%20Based%20Patient-Appoinment%20System/docs/Milestone_1_2_3_Viva_Comprehensive_Guide.pdf)  
**Interactive HTML Location:** [`docs/Milestone_1_2_3_Viva_Comprehensive_Guide.html`](file:///d:/project/AI%20Based%20Patient-Appoinment%20System/docs/Milestone_1_2_3_Viva_Comprehensive_Guide.html)  

---

## 1. 30-Second Elevator Pitch (Viva Intro)

> *"Good morning Sir/Ma'am. Our project is an **AI-Based Patient Appointment System**. In traditional healthcare platforms like Practo, patients must self-diagnose and pick doctor specialties manually without medical guidance, often booking the wrong doctor. On the other hand, AI symptom checkers like Ada Health analyze symptoms but do not allow direct doctor booking. Our system bridges this gap by unifying 24/7 conversational AI symptom triage, emergency red-flag detection, automatic specialist recommendation, real-time conflict-free slot booking, and pre-consultation AI clinical summaries for doctors on a unified dashboard."*

---

## 2. Core Problem Statement & Research Gaps (Milestone 1)

1. **The Disconnect Between Assessment and Booking:**
   - Existing apps either do *symptom assessment* (Ada Health, Buoy) or *doctor scheduling* (Practo, Zocdoc), but not both seamlessly.
2. **Patient Self-Diagnosis Dilemma:**
   - Patients frequently choose incorrect specialists (e.g., visiting an Orthopedist for joint pain caused by Rheumatic fever, or an ENT for chest-related cough), causing wasted consultations.
3. **Doctor Context Void:**
   - Doctors spend the first 10–15 minutes asking basic diagnostic questions. Our system generates a ready-to-read pre-consultation clinical summary.
4. **Emergency Red-Flag Routing:**
   - Life-threatening acute emergencies (heart attack, stroke) must instantly bypass routine elective clinic booking and guide patients to Emergency Services (112/108/911).

---

## 3. Comparative Matrix of Existing Systems

| Platform | Category | AI Capabilities | Core Strength | Major Limitation / Gap |
| :--- | :--- | :--- | :--- | :--- |
| **Practo** | Doctor Booking | Minimal (Keyword search) | Huge doctor network | Patient must self-diagnose specialist. |
| **Zocdoc** | Doctor Discovery | Basic NLP search | Real-time slot UI | No symptom checker; needs medical awareness. |
| **Ada Health** | Symptom Triage | High (Bayesian Network) | Detailed symptom assessment | **No appointment booking** / doctor directory. |
| **Babylon Health** | Telehealth & Triage | High (NLP + Rules) | Virtual consultations | High complexity; no local clinic slot locks. |
| **Our System** | **Integrated AI Healthcare** | **Hybrid 2-Tier AI Triage** | **Symptom triage + Real-time Booking + Doctor Summaries** | Solves both triage and scheduling in one platform. |

---

## 4. Dataset & AI Triage Algorithm (Milestone 2)

### 4.1 Data Sources
Synthesized from standard clinical taxonomies:
* **Columbia University Medical Center (CUMC)** Disease-Symptom Knowledge Graph
* **Mayo Clinic & NHS Clinical Triage Rules**
* **ICD-10 Condition Categorization**
* Dataset file: `backend/data/symptom_specialist_dataset.csv` (covering 12+ specialties including Cardiology, Neurology, Pulmonology, Dermatology, Orthopedics, Endocrinology, General Surgery, ENT, Psychiatry, Urology, General Physician).

### 4.2 6-Stage Preprocessing Pipeline
1. **UTF-8 Text Sanitization**
2. **Missing Record Pruning** (dropping null symptom/condition fields)
3. **Deduplication** (resolving overlapping symptom clusters)
4. **Clinical NLP Tokenization** (regex `\w+`, lowercasing)
5. **Medical Synonym Harmonization** (*"dyspnea"* &rarr; *"shortness of breath"*, *"rash"* &rarr; *"skin rash"*)
6. **Emergency & Urgency Stratification** (High/Emergency: 20%, Medium: 50%, Low: 30%)

### 4.3 2-Tier AI Recommendation Logic (`ai_engine.py`)
* **Tier 1: Emergency Classifier (Deterministic Rule Matching):**
  - High-priority token registry: `["chest pain", "shortness of breath", "slurred speech", "numbness in face", "arm pain", "stroke", "heart attack", "unconscious", "severe bleeding", "difficulty breathing"]`.
  - If detected &rarr; Triggers **Immediate Emergency Alert** and overrides routine booking.
* **Tier 2: Tokenized Jaccard Similarity Matcher:**
  $$\text{Similarity Score} = \frac{|U \cap S|}{\max(|S|, 1)}$$
  $$\text{Confidence} = \min\left(0.60 + (\text{Similarity Score} \times 0.35),\, 0.95\right)$$
  - Safe Default Fallback: If similarity $\le 0.15$, safe routing to **General Physician** at 70% confidence.

---

## 5. System Architecture & Module Design (Milestone 3)

### 5.1 Technology Stack
* **Frontend:** React 18 + Vite (SPA, Responsive Glassmorphism Design, ChatbotDrawer component)
* **Backend:** FastAPI (Python 3.10+, Asynchronous `asyncio`, Pydantic v2 type safety, auto-generated Swagger UI)
* **Database & ORM:** SQLite / PostgreSQL + SQLAlchemy ORM (3NF Normalized, Foreign Keys, ACID transactions)
* **Authentication & Security:** Google OAuth 2.0 (Google Identity Services GIS) + JWT Token Rotation + Bcrypt Hashing
* **AI Module:** Custom Python NLP Engine with deterministic emergency classifier and token overlap scoring.

### 5.2 The 8 Functional Subsystem Modules
1. **Auth & Identity Service:** Google OAuth GIS verification, OTP verification, JWT access tokens.
2. **AI Chatbot Conversational Drawer:** Real-time multi-turn conversational symptom intake.
3. **Clinical Symptom Assessment Engine:** Calculates disease matches and emergency red flags.
4. **Doctor Recommendation Service:** Maps syndromes to verified specialist profiles.
5. **Doctor Schedule Management Matrix:** Granular 30-minute consultation slots.
6. **Appointment Booking Engine:** Atomic slot locking to prevent double bookings.
7. **Patient Health Records:** Past consultations, reported symptoms, AI triage history.
8. **Doctor Clinical Dashboard:** Daily appointment queue + AI pre-consultation summaries.

---

## 6. Top 10 Viva Questions & Quick Answers

1. **Q: What is the USP (Unique Selling Proposition) of your project?**  
   *Ans:* The seamless integration of AI symptom triage, red-flag emergency detection, doctor recommendation, and real-time conflict-free slot booking with pre-consultation doctor summaries.

2. **Q: Why FastAPI instead of Django or Flask?**  
   *Ans:* FastAPI is natively asynchronous (`asyncio`), has superior throughput for real-time chat and booking, auto-validates payloads via Pydantic, and generates interactive Swagger documentation automatically.

3. **Q: How does the system prevent double-booking?**  
   *Ans:* Through atomic database transactions and unique constraints on `(doctor_id, date, slot)`. If two users click simultaneously, the first transaction commits and the second receives an HTTP 409 Conflict error.

4. **Q: How does Google OAuth 2.0 work in your system?**  
   *Ans:* Frontend uses Google Identity Services (GIS) to obtain a signed ID token. Backend verifies it with Google's public certs, retrieves verified email and profile, and issues our internal JWT session token.

5. **Q: How do you handle medical liabilities and errors?**  
   *Ans:* Every output has prominent medical disclaimers; acute emergencies trigger ER overrides; and all AI outputs are marked "Preliminary" for doctor verification (Doctor-in-the-Loop).
