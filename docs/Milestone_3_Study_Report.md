# Milestone 3: System Architecture & Module Design

---

## Document Metadata & Team Details

* **Project Title:** AI-Based Patient Appointment System
* **Document Type:** Milestone 3 Technical Architecture & Comprehensive Module Design Report
* **Submission Milestone:** Milestone 3: System Architecture & Module Design
* **Team Lead / Authors:** Lokendra Prajapati & Samyak Lariya
* **Roll Numbers / Student IDs:** BTIT2603D03 & BTIT2603D05
* **Branch / Department:** Information Technology (B.Tech IT)
* **GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **Date of Submission:** September 2026

---

## 1. Executive Summary & Milestone 3 Scope

Following the rigorous dataset collection, clinical preprocessing, and exploratory data analysis completed in **Milestone 2**, the objective of **Milestone 3** is to transition the project from data engineering into a robust, scalable, enterprise-grade software architecture. 

Modern clinical systems face severe bottlenecks due to fragmented communication between appointment schedulers, patient record systems, and triage workflows. The **AI-Based Patient Appointment System** solves this by establishing a tightly coupled yet modular architecture where an intelligent conversational triage layer seamlessly communicates with patient identity providers, dynamic doctor availability calendars, and clinical dashboards.

### Core Objectives of Milestone 3:
1. **End-to-End System Architecture Formulation:** Designing a multi-tiered, decoupled client-server architecture balancing real-time responsiveness, clinical safety, and data persistence.
2. **Technology Stack Finalization:** Selecting and formalizing modern, high-performance technologies across frontend, API gateway, asynchronous services, and security frameworks.
3. **Comprehensive Module Decomposition:** Defining the architectural boundaries, contracts, and responsibilities for 8 core functional subsystems.
4. **Relational Database & Data Flow Modeling:** Architecting comprehensive Entity-Relationship (ER) schemas, normalization, foreign key constraints, and state transition lifecycles.
5. **Asynchronous Communication & Workflow Pipelines:** Modeling multi-step sequence flows connecting patient symptom inputs, AI assessment heuristics, doctor matching engines, slot locking, and doctor review portals.
6. **Clinical Safety & Security Architectural Integration:** Embedding non-negotiable medical disclaimers, role-based access control (RBAC), token authentication, and data privacy safeguards directly into the architectural fabric.

---

## 2. Technology Stack & Architectural Decision Matrix

The technical stack is purposefully chosen to ensure ultra-low latency, robust type validation, clean separation of concerns, and rapid user feedback loops.

| Architectural Layer | Selected Technology | Alternative Considered | Rationale & Architectural Advantage |
| :--- | :--- | :--- | :--- |
| **Client Frontend** | **React 18 / Vite + Vanilla Modern SPA** | Angular / Traditional MPA | Sub-second load times, declarative UI state management for real-time chat, responsive glassmorphism aesthetic. |
| **API Gateway & Microservices** | **FastAPI (Python 3.10+)** | Django / Express.js | Native asynchronous (`asyncio`) execution, automated OpenAPI/Swagger documentation, native Pydantic v2 data validation. |
| **AI / NLP Triage Engine** | **Python NLP Engine + Vector Similarity** | Pure Rule-Based Engine | Hybrid architecture combining deterministic emergency keyword matching with flexible token-overlap similarity scoring. |
| **Authentication & Security** | **Google OAuth 2.0 (GIS) + JWT + Bcrypt** | Session Cookies / Firebase | Industry-standard identity federation (Google Sign-In), stateless cryptographic token authorization, zero vendor lock-in. |
| **Persistence Layer** | **SQLAlchemy ORM + SQLite / PostgreSQL** | MongoDB / DynamoDB | Relational integrity is paramount in medical scheduling to prevent double-booking anomalies, orphaned records, and race conditions. |
| **Communication Layer** | **RESTful JSON API + Asynchronous Workers** | GraphQL | Simplicity, predictable caching, low overhead, and straightforward contract testing for clinical micro-endpoints. |

---

## 3. High-Level Multi-Tier System Architecture

The system follows an enterprise **N-Tier Decoupled Architecture**:

```
+-----------------------------------------------------------------------------------+
|                                PRESENTATION TIER                                  |
|   +--------------------------+   +-----------------------+   +----------------+   |
|   | Patient Portal / Booking |   | AI Health Chat Drawer |   | Doctor Portal  |   |
|   +--------------------------+   +-----------------------+   +----------------+   |
+-----------------------------------------|-----------------------------------------+
                                          | HTTPS / REST JSON Requests
                                          v
+-----------------------------------------------------------------------------------+
|                              API & APPLICATION TIER                               |
|   FastAPI Gateway (Uvicorn Async Worker Pool)                                     |
|   +--------------------------+   +-----------------------+   +----------------+   |
|   | Security & Auth Router   |   | Appointment Engine    |   | Doctor Routing |   |
|   | (Google GIS, OTP, JWT)   |   | (Booking, Slot Locks) |   | Controller     |   |
|   +--------------------------+   +-----------------------+   +----------------+   |
+--------------------|----------------------------------------|---------------------+
                     |                                        |
                     v                                        v
+------------------------------------+   +------------------------------------------+
|          AI TRIAGE ENGINE          |   |            DATA PERSISTENCE TIER         |
|  - Emergency Classifier Filter     |   |  - Users & Authentication Store          |
|  - Symptom Dataset Matcher         |   |  - Doctor Profiles & Availability Grid   |
|  - Clinical Summary Generator      |   |  - Appointment Transactions & Records    |
|  - Confidence & Urgency Scorer     |   |  - Medical Disclaimer & Audit Logs       |
+------------------------------------+   +------------------------------------------+
```

---

## 4. Comprehensive Subsystem & Module Decomposition

The application is decomposed into eight strictly defined functional modules:

### Module 1: Dual Patient & Doctor Authentication / Identity Service
* **Responsibilities:** Manages identity verification through Google OAuth 2.0 token exchange, SMS/Email OTP generation, and traditional hashed email/password authentication.
* **Key Components:** `auth.py`, `security.py`, `google_auth.py`, `sms_service.py`, `email_service.py`.
* **Security Controls:** Rate limiting (max 5 OTP attempts), cryptographically secure random OTPs, Bcrypt password salt/hashing (cost factor 12), and short-lived JWT access tokens with rotating refresh tokens.

### Module 2: AI Health Chatbot Conversational Drawer
* **Responsibilities:** Real-time conversational interface enabling natural language symptom input, providing empathetic response formatting, asking clarifying questions, and delivering safety-gated preliminary guidance.
* **Key Components:** `ChatbotDrawer.jsx`, `App.jsx`, `api/chat/assess`.

### Module 3: Clinical Symptom Assessment & Emergency Detection Engine
* **Responsibilities:** Parses unstructured patient descriptions, evaluates against clinical emergency red flags (e.g., severe chest pressure, sudden hemiparesis, acute dyspnea), computes confidence scores, and determines triage level.
* **Safety Rules:** Mandatory ER redirection for emergency flags; automatic disclaimer injection on every output.
* **Key Components:** `ai_engine.py`, `symptom_specialist_dataset.csv`.

### Module 4: Doctor Recommendation & Specialist Mapping Service
* **Responsibilities:** Maps identified clinical syndromes to accredited medical specialties (e.g., Cardiology, Neurology, Pulmonology, Dermatology, Orthopedics, General Medicine).
* **Key Components:** `ai_engine.py`, `main.py` (`/api/doctors`).

### Module 5: Doctor Availability & Schedule Management Matrix
* **Responsibilities:** Maintains granular 30-minute consultation slots, supports dynamic doctor schedule configuration, filters active slots in real-time, and handles doctor leave overrides.
* **Key Components:** `DOCTORS_DB`, `AppointmentModal.jsx`.

### Module 6: Appointment Scheduling & Conflict-Prevention Engine
* **Responsibilities:** Executes atomic booking transactions, binds patient identifiers, doctor profiles, consultation dates, and selected slots; strictly prevents duplicate slot allocations.
* **Key Components:** `book_appointment`, `APPOINTMENTS_DB`, `AppointmentModal.jsx`.

### Module 7: Patient Health Records & Consultation History
* **Responsibilities:** Stores consultation histories, patient age/demographics, reported symptoms, preliminary AI assessments, and appointment fulfillment states.
* **Key Components:** `PatientDashboard.jsx`, `/api/appointments/patient/{id}`.

### Module 8: Doctor Clinical Dashboard & Consultation Portal
* **Responsibilities:** Provides licensed physicians with a chronological queue of booked consultations, highlighted patient triage summaries, AI-generated preliminary clinical notes, and appointment disposition toggles.
* **Key Components:** `DoctorDashboard.jsx`, `/api/appointments/doctor/{id}`.

---

## 5. Database Schema & Entity-Relationship (ER) Architecture

The database architecture guarantees relational integrity, 3NF normalization, and zero data redundancy.

### Entity Schemas:

```
+--------------------+        1:N        +-------------------------+
|      USERS         | ----------------< |      APPOINTMENTS       |
+--------------------+                   +-------------------------+
| PK  id             |                   | PK  id                  |
|     name           |                   | FK  patient_id          |
|     email          |                   | FK  doctor_id           |
|     phone_number   |                   |     date                |
|     role           |                   |     slot                |
|     password_hash  |                   |     status              |
|     auth_provider  |                   |     symptoms            |
|     created_at     |                   |     ai_summary          |
+--------------------+                   |     doctor_notes        |
          | 1:1                          |     created_at          |
          v                              +-------------------------+
+--------------------+                                ^
|  DOCTOR_PROFILES   |                                | 1:N
+--------------------+                                |
| PK  id (doc_id)    | -------------------------------+
|     specialization |
|     qualification  |
|     rating         |
|     fee            |
|     location       |
|     available_slots|
+--------------------+
```

### Table Specifications:
1. **`users` Table:** Stores identity metadata, credentials, roles (`patient`, `doctor`, `admin`), phone, and authentication provider.
2. **`doctor_profiles` Table:** Stores clinical credentials, medical licensing, specialization, fees, and active slot schedules.
3. **`appointments` Table:** Relational ledger of scheduled appointments, slot allocations, status flags (`Confirmed`, `In-Consultation`, `Completed`, `Cancelled`), patient symptom inputs, and AI-generated preliminary summaries.
4. **`otp_records` Table:** Ephemeral store for mobile and email verification codes, expiration timestamps, attempt counters, and consumption states.

---

## 6. End-to-End Workflow & Communication Protocols

### Workflow A: Patient AI Triage to Confirmed Booking
1. **Symptom Expression:** Patient types symptoms in conversational chat drawer.
2. **Asynchronous Triage Request:** Client executes `POST /api/chat/assess`.
3. **Emergency Check:** System checks critical condition triggers. If positive, ER alert is issued immediately.
4. **Knowledge Base Mapping:** Non-emergency symptoms matched against CSV knowledge base; specialist and confidence score computed.
5. **Doctor Query:** Client queries `GET /api/doctors?specialization={specialist}`.
6. **Slot Selection:** Patient selects preferred doctor, date, and available slot.
7. **Atomic Booking:** Client sends `POST /api/appointments/book`.
8. **Confirmation & Sync:** Slot is reserved, booking saved, and record made accessible to both Patient and Doctor Dashboards.

---

## 7. Clinical Safety, Legal Disclaimers & Security Design

* **Statutory Non-Replacement Directive:** The AI module explicitly informs users that it does not replace professional medical diagnosis, prescription, or clinical treatment.
* **Doctor-in-the-Loop Architecture:** All AI-generated symptom assessments are labeled "Preliminary" and require verification by the attending physician during the actual consultation.
* **Role-Based Access Control (RBAC):** Strict separation prevents patients from viewing other patients' clinical histories or accessing doctor configuration panels.
* **Zero Data Exfiltration:** Patient symptom queries remain securely processed within the local backend environment without unauthorized third-party sharing.

---

## 8. Milestone 3 Deliverables & Readiness for Milestone 4

* ✅ Formalized System Architecture Diagram & Technology Stack.
* ✅ Defined schemas and contracts for all 8 core modules.
* ✅ Relational Entity-Relationship (ER) model and database schemas.
* ✅ End-to-end communication sequence flows for triage, booking, and doctor review.
* ✅ Integrated clinical safety boundaries and statutory disclaimers.
* ➡️ **Ready for Milestone 4:** AI Chatbot development, doctor recommendation algorithms, and appointment scheduling engine implementation.
