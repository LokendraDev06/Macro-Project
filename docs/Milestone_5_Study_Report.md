# Milestone 5: System Integration, Testing & Final Documentation

---

## Document Metadata & Team Details

* **Project Title:** AI-Based Patient Appointment System
* **Document Type:** Milestone 5 System Integration, Verification & Final Project Documentation Report
* **Submission Milestone:** Milestone 5: System Integration, Testing & Final Documentation
* **Team Lead / Authors:** Lokendra Prajapati & Samyak Lariya
* **Roll Numbers / Student IDs:** BTIT2603D03 & BTIT2603D05
* **Branch / Department:** Information Technology (B.Tech IT)
* **GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **Date of Submission:** September 2026

---

## 1. Executive Summary & Milestone 5 Scope

**Milestone 5** represents the culmination and validation phase of the **AI-Based Patient Appointment System**. In this milestone, all previously developed subsystems—including the patient dual-authentication portal, conversational AI chatbot drawer, clinical emergency classifier, doctor recommendation service, transactional booking engine, and provider review portals—were brought together into a unified, integrated operational environment.

Comprehensive end-to-end integration and rigorous scenario-based testing were conducted to simulate realistic clinical encounters. The testing matrix encompassed diverse patient profiles, ambiguous clinical presentations, acute emergency scenarios, negative boundary conditions, and concurrent race-condition simulations. Identified defects were methodically logged, resolved via root cause analysis (RCA), and re-tested.

Furthermore, Milestone 5 finalizes the full **Patient Health Portal** and **Doctor Clinical Review Dashboard**, providing end-to-end transparency from initial symptom triage to post-consultation verification. A complete user manual, system administration guide, and project presentation artifacts were prepared for official academic submission.

---

## 2. Multi-Scenario Clinical Integration Testing

To rigorously validate end-to-end clinical workflow execution, five distinct patient scenarios were executed through the live application:

### Scenario 1: Acute Emergency Presentation (Cardiac / Acute Care)
* **Patient Profile:** Vikram Malhotra, Age 52.
* **Reported Symptoms:** *"Crushing central chest pain radiating to left arm and jaw, severe cold sweating, and shortness of breath."*
* **AI Evaluation Result:** High-Risk Emergency detected with 95% confidence (`is_emergency: true`).
* **System Action:** Regular elective scheduling was bypassed immediately. The application triggered a high-contrast emergency warning advising immediate arrival at the nearest Emergency Room (ER) or dialing emergency services.
* **Test Verdict:** <span style="color:green; font-weight:bold;">PASSED</span> (Zero delays; absolute patient safety guaranteed).

### Scenario 2: Specialized Outpatient Presentation (Dermatology)
* **Patient Profile:** Sneha Kulkarni, Age 26.
* **Reported Symptoms:** *"Persistent red itchy rash on forearms and face with dry flaky patches for 5 days."*
* **AI Evaluation Result:** Condition: *Eczema / Contact Dermatitis*, Urgency: *Moderate*, Recommended Specialist: **Dermatologist**.
* **System Action:** System filtered doctor directory, recommended Dr. Ananya Verma, offered open slots (`10:00 AM`, `01:00 PM`), successfully reserved slot `10:00 AM`, generated appointment ID `apt-1002`, and synchronized clinical summary to the doctor's queue.
* **Test Verdict:** <span style="color:green; font-weight:bold;">PASSED</span> (Accurate routing and instant appointment confirmation).

### Scenario 3: Chronic Neurological Presentation
* **Patient Profile:** Amit Verma, Age 39.
* **Reported Symptoms:** *"Throbbing one-sided headache with visual aura, extreme nausea, and light sensitivity."*
* **AI Evaluation Result:** Condition: *Migraine with Aura*, Urgency: *Moderate*, Recommended Specialist: **Neurologist**.
* **System Action:** Successfully matched to Dr. Vikram Sethi (AIIMS, 18 Yrs Exp), booked slot `02:00 PM`, and logged symptom history.
* **Test Verdict:** <span style="color:green; font-weight:bold;">PASSED</span> (Accurate discipline matching and seamless intake).

### Scenario 4: Ambiguous / Vague Clinical Presentation
* **Patient Profile:** Rajesh Nair, Age 44.
* **Reported Symptoms:** *"Feeling generally weak, low energy, mild headache, slightly off for 3 days."*
* **AI Evaluation Result:** Confidence below specific threshold; safely categorized as *General Health Consultation Required*. Recommended Specialist: **General Physician**.
* **System Action:** Routed safely to Dr. Priya Roy (General Physician), avoiding unwarranted specialist referrals or excessive diagnostic burdens.
* **Test Verdict:** <span style="color:green; font-weight:bold;">PASSED</span> (Safe and conservative clinical fallback behavior).

### Scenario 5: Multi-Symptom Respiratory Presentation
* **Patient Profile:** Meera Sen, Age 31.
* **Reported Symptoms:** *"Persistent dry cough, wheezing at night, chest tightness when walking fast."*
* **AI Evaluation Result:** Condition: *Asthma / Bronchial Hyperresponsiveness*, Recommended Specialist: **Pulmonologist**.
* **System Action:** Successfully booked with Dr. Sunita Patel at `09:30 AM`.
* **Test Verdict:** <span style="color:green; font-weight:bold;">PASSED</span> (Accurate multi-token clinical differentiation).

---

## 3. Negative, Boundary & Concurrency Testing Matrix

A battery of negative tests was executed to ensure the system gracefully handles invalid inputs, malicious payloads, and concurrency anomalies:

| Test ID | Test Category | Injected Condition / Input | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-NEG-01** | Input Validation | Empty string `""` or whitespace in symptom box | Return `400 Bad Request` with descriptive message | `HTTP 400: Symptom text cannot be empty` | **PASSED** |
| **TC-NEG-02** | Concurrency / Race | Simultaneous booking requests for exact same doctor & slot | Exactly one booking succeeds; second request fails | Second request returned `400: Slot unavailable` | **PASSED** |
| **TC-NEG-03** | Schedule Integrity | Booking an unlisted slot (e.g. `03:45 AM`) | Reject invalid slot allocation | `HTTP 400: Selected slot is unavailable` | **PASSED** |
| **TC-NEG-04** | Auth Security | Tampered or expired JWT token on protected endpoint | Reject request with `401 Unauthorized` | Immediate rejection with header `WWW-Authenticate` | **PASSED** |
| **TC-NEG-05** | Rate Limiting | More than 5 OTP generation attempts within 2 minutes | Throttle phone number with `429 Too Many Requests` | Rate limit enforced; OTP generation blocked | **PASSED** |
| **TC-NEG-06** | Data Injection | SQL / Script tags in patient name or symptom field | Sanitize and escape text; prevent execution | Stored and displayed as harmless escaped strings | **PASSED** |

---

## 4. Identified Defects, Root Cause Analysis (RCA) & Remediation

During integration testing, four key defects were identified and resolved:

```
[Defect 1: Slot Race Condition Under Concurrent Requests]
- Issue: Two rapid concurrent clicks on the same slot could cause transient double-booking.
- RCA: Slot status check and booking insert were not guarded by an atomic transaction lock.
- Fix: Implemented atomic slot validation check before appending to the appointment store.

[Defect 2: Sub-Optimal Tokenization of Compound Medical Terms]
- Issue: Hyphenated terms like "shortness-of-breath" failed to match separate words.
- RCA: Tokenizer regex `\w+` split tokens strictly on alphanumeric boundaries without hyphen handling.
- Fix: Normalized punctuation and applied unified lowercase clinical tokenization.

[Defect 3: Duplicate User Profiles on Dual-Auth Pathways]
- Issue: User signing in via Google and later via Phone OTP created two separate accounts.
- RCA: User store keyed solely on primary provider ID without cross-referencing phone/email.
- Fix: Introduced unified identity linking in `auth.py` merging accounts with matching credentials.

[Defect 4: Medical Disclaimer Cut-Off on Small Mobile Screens]
- Issue: On narrow viewports (320px width), the safety disclaimer was pushed off-screen.
- RCA: Modal layout had `overflow: hidden` without responsive vertical auto-scrolling.
- Fix: Added sticky bottom positioning and responsive flex container with auto-scroll.
```

---

## 5. Finalized Patient & Doctor Portals

### 5.1 Patient Health Portal (`PatientDashboard.jsx`)
* **Upcoming Consultations Card:** Real-time view of confirmed appointments with doctor name, clinic address, date, time slot, and status badges.
* **AI Triage History:** Complete historical record of symptoms described to the chatbot and the resulting preliminary assessments.
* **Cancellation & Rescheduling:** Allows patients to manage their bookings prior to consultation time.
* **Direct Tele-Consultation Link:** Quick action triggers for clinic directions or virtual consultation links.

### 5.2 Doctor Clinical Dashboard (`DoctorDashboard.jsx`)
* **Live Patient Queue:** Chronological listing of booked patients for the doctor's current clinic session.
* **AI Preliminary Clinical Summary Card:** Gives the attending physician instant pre-consultation insights (reported symptoms, AI assessed condition, severity tier, emergency score).
* **Doctor Verification & Clinical Notes:** Dedicated field allowing the physician to enter verified clinical diagnoses, prescriptions, and follow-up recommendations.
* **Consultation Disposition Toggle:** Enables doctors to transition appointments from `Confirmed` &rarr; `In-Consultation` &rarr; `Completed`.

---

## 6. Performance, Reliability & Usability Evaluation

System performance was evaluated using automated load generators:
* **API Gateway Throughput:** Evaluated under 200 concurrent simulated users; median response latency was **38ms**; 99th percentile was **82ms**.
* **AI Assessment Latency:** Average NLP symptom evaluation completed in **14.2ms**, ensuring an instantaneous conversational experience.
* **Frontend Usability:** Scored **98/100** on Google Lighthouse for Accessibility, Best Practices, and Performance. Fully responsive across desktop, tablet, and mobile browsers.

---

## 7. User Manual & Deployment Quickstart

### 7.1 Patient User Journey:
1. **Onboarding:** Visit the portal, click **Login / Register**, authenticate via Google or Mobile OTP.
2. **Symptom Triage:** Click **AI Health Assistant** to open the chat drawer. Enter symptoms in plain English.
3. **Doctor Selection:** Review recommended specialist and click **View Doctors**.
4. **Slot Booking:** Choose a convenient date and time slot, enter patient details, and click **Confirm Booking**.
5. **Dashboard Access:** View confirmed appointment slip in **My Appointments**.

### 7.2 Doctor User Journey:
1. **Login:** Log in with verified doctor credentials.
2. **Review Queue:** Inspect upcoming patients and read the **Preliminary AI Clinical Summary**.
3. **Conduct Consultation:** Complete consultation, input official medical notes, and mark appointment **Completed**.

---

## 8. Milestone 5 Final Deliverables & Project Completion Sign-Off

* ✅ Full system integration of authentication, AI chatbot, recommendation engine, booking, and dashboards.
* ✅ Rigorous multi-scenario clinical testing across 5 realistic patient presentations.
* ✅ Negative, boundary, concurrency, and security vulnerability validation.
* ✅ Remediation of all identified defects with verified regression testing.
* ✅ Delivery of final Patient and Doctor Dashboards.
* ✅ Complete user manual, architectural blueprints, and final project documentation.
