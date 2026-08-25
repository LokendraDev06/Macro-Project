# Milestone 1: Existing Healthcare Appointment Systems & AI Chatbot Study

**Project Title:** AI-Based Patient Appointment System  
**Document Version:** 1.0  
**Submission Milestone:** Milestone 1  

---

## 1. Executive Summary

The modern healthcare industry faces growing challenges in managing patient flow, optimizing doctor schedules, and ensuring patients receive timely and accurate medical guidance. Traditional healthcare appointment management systems rely heavily on manual doctor selection by patients who may lack medical knowledge, often resulting in inappropriate specialist selection, delayed care, and clinic inefficiencies.

This report presents a comprehensive comparative study of existing healthcare appointment management systems (e.g., Practo, Zocdoc) and AI-driven medical diagnostic chatbots (e.g., Ada Health, Babylon Health, Buoy Health). By identifying critical gaps in existing platforms—specifically the disconnect between symptom evaluation and direct appointment scheduling—we define the requirements, objectives, and architectural foundation for an integrated **AI-Based Patient Appointment System**.

---

## 2. Comparative Analysis of Existing Healthcare Systems

A thorough review of prominent digital health applications was conducted across four key dimensions: **Patient Registration & Usability**, **AI Chatbot Capabilities**, **Doctor Recommendation Logic**, and **Appointment Booking Integration**.

| System Name | Category | Primary Features | AI/LLM Capabilities | Strengths | Major Limitations & Gaps |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Practo** | Appointment Booking | Specialist search, clinic booking, online consultation, electronic health records. | Minimal (Basic keyword-based search, no interactive symptom triage). | Large doctor directory, seamless appointment booking. | Patients must self-diagnose and pick doctor specialty; no preliminary AI symptom analysis. |
| **Zocdoc** | Doctor Discovery & Scheduling | Location-based search, insurance filter, slot booking, patient reviews. | Basic NLP for search query mapping. | Excellent scheduling UI, real-time doctor availability. | Lacks symptom-checker chatbot; user requires prior medical awareness to choose right doctor. |
| **Ada Health** | AI Symptom Assessment | Interactive probabilistic symptom assessment, condition probability report. | High (Bayesian network / AI diagnostic engine). | Detailed symptom analysis, user-friendly questionnaire. | Does **not** offer direct appointment booking or doctor scheduling integration. |
| **Babylon Health** | Telehealth & AI Triage | AI Chatbot triage, video consultations, health tracking. | High (NLP & Expert Rules System). | Combines chatbot triage with virtual consultations. | High operating complexity, limited local clinic availability integration, restricted customization. |
| **Buoy Health** | AI Triage & Navigational Care | AI symptom questionnaire, level of care triage (ER vs Urgent Care vs Primary Care). | Moderate-High (Rule-based AI & ML). | Great emergency triage filtering and level-of-care recommendations. | Redirection to external healthcare providers is fragmented; lacks unified booking database. |

---

## 3. Key Findings & Gap Identification

Based on the comparative analysis, three major gaps were identified in current healthcare platforms:

1. **The Disconnect Between AI Assessment and Booking Engine**:
   - Systems excel at *either* symptom assessment (Ada) *or* appointment booking (Practo/Zocdoc), but rarely integrate both into a single seamless workflow.
2. **Patient Self-Diagnosis Dilemma**:
   - Patients frequently select incorrect medical specialists (e.g., visiting an Orthopedic specialist for general joint pain caused by Rheumatic fever), causing wasted appointments and delayed treatments.
3. **Doctor Context Deficiency**:
   - Doctors receive minimal background prior to patient arrival. They spend valuable consultation time manually asking basic diagnostic questions that an AI chatbot could collect beforehand.

---

## 4. Problem Statement

> *"Existing appointment booking platforms require patients to manually identify the appropriate medical specialty without clinical guidance, while AI symptom checkers function in isolation without offering direct scheduling with relevant nearby doctors. There is a critical need for an integrated system that combines AI-driven symptom assessment, automated doctor-specialty recommendation, real-time slot scheduling, and structured clinical summaries for doctors."*

---

## 5. Objectives of Proposed AI-Based System

The proposed system aims to achieve the following core objectives:

1. **Intelligent Symptom Triage**: Provide a 24/7 AI-powered conversational chatbot to collect patient symptoms, duration, and severity using natural language processing (NLP).
2. **Automated Doctor-Specialty Mapping**: Map patient symptoms to appropriate medical specializations (e.g., Cardiology, Dermatology, Neurology) using an AI recommendation model.
3. **Emergency Triage Filter**: Instantly identify high-risk emergency symptoms (e.g., acute chest pain, stroke symptoms) and direct patients to emergency services rather than routine bookings.
4. **Seamless Slot Scheduling**: Provide interactive real-time appointment booking with verified doctors based on availability, specialization, and location.
5. **Doctor Clinical Dashboard**: Provide doctors with pre-consultation AI-generated patient summaries to optimize consultation time and improve diagnostic quality.

---

## 6. Functional & Non-Functional Requirements

### 6.1 Functional Requirements (FR)

- **FR-1: Patient Registration & Authentication**: Secure sign-up/login via email/JWT with profile data (age, gender, medical history).
- **FR-2: AI Symptom Chatbot**: Interactive multi-turn chat interface accepting text/voice symptom inputs with contextual follow-up questions.
- **FR-3: Smart Recommendation Engine**: Algorithmically match assessed symptoms with doctor specializations, ratings, and locations.
- **FR-4: Real-Time Appointment Booking**: Display interactive calendar slots, allow booking confirmation, and prevent slot overlapping.
- **FR-5: Dual Dashboard System**:
  - *Patient Dashboard*: Past consultations, symptom chat history, upcoming bookings.
  - *Doctor Dashboard*: Patient queue, AI-generated clinical summaries, schedule management.

### 6.2 Non-Functional Requirements (NFR)

- **NFR-1: Security & Data Privacy**: Encrypt Patient Health Information (PHI) in transit (TLS 1.3) and at rest (AES-256).
- **NFR-2: Usability & Accessibility**: Responsive interface accessible across desktop and mobile devices with multi-lingual support.
- **NFR-3: Performance**: Chatbot response latency under 1.5 seconds; API booking execution under 500ms.
- **NFR-4: Medical Safety & Disclaimer**: Display prominent disclaimers stating AI assessments are preliminary and require qualified medical verification.

---

## 7. Conclusion & Next Steps

Milestone 1 successfully establishes the theoretical foundation, market analysis, and requirement specifications for the AI-Based Patient Appointment System. 

**Next Milestone (Milestone 2)** will focus on:
- Collecting healthcare symptom-disease-doctor datasets (e.g., Kaggle Healthcare Datasets).
- Data cleaning, preprocessing, and label encoding.
- Building the mapping matrix for AI symptom assessment and doctor specialization recommendation.
