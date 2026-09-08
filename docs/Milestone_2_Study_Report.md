# Milestone 2: Healthcare Dataset Collection, Preprocessing & Analysis

---

## Document Metadata & Team Details

* **Project Title:** AI-Based Patient Appointment System
* **Document Type:** Milestone 2 Comprehensive Technical & Data Engineering Report
* **Submission Milestone:** Milestone 2: Healthcare Dataset Collection, Preprocessing & Analysis
* **Team Lead / Authors:** Lokendra Prajapati & Samyak Lariya
* **Roll Numbers / Student IDs:** BTIT2603D03 & BTIT2603D05
* **Branch / Department:** Information Technology (B.Tech IT)
* **GitHub Repository:** [https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System](https://github.com/LokendraDev06/AI-Based-Patient-Appoinment-System)
* **Date of Submission:** September 2026

---

## 1. Executive Summary & Milestone 2 Scope

The core intelligence of an AI-driven healthcare appointment system relies fundamentally on high-quality, structured, and clinically validated medical data. Without standardized datasets linking patient symptoms to clinical conditions and appropriate medical specializations, automated triage cannot function safely or reliably.

In **Milestone 2**, our primary objectives focused on:
1. **Healthcare Dataset Sourcing & Acquisition:** Collecting verified medical datasets containing symptom-disease co-occurrences, clinical risk classifications, doctor specializations, and patient-appointment attributes from authoritative clinical taxonomies.
2. **Data Cleaning & Preprocessing:** Designing a multi-stage preprocessing pipeline to handle missing values, resolve duplicate/conflicting records, standardize medical nomenclature, tokenize patient input, and normalize categorical attributes.
3. **Exploratory Data Analysis (EDA):** Performing statistical analysis on symptom distributions, disease frequencies, specialist allocations, and emergency triage proportions.
4. **Relational Symptom-to-Specialist Mapping:** Building deterministic and probabilistic relational mappings between patient symptom clusters, probable health conditions, urgency tiers, and medical specialties.
5. **Integration with AI Recommendation Pipeline:** Embedding the processed datasets into the FastAPI backend (`ai_engine.py`) to power the real-time AI conversational chatbot, emergency detection filter, and automated clinical summaries for doctors.

---

## 2. Healthcare Dataset Sourcing & Taxonomy

### 2.1 Data Sources & Clinical Reference Taxonomies
To guarantee medical relevance, safety, and reliability, datasets were sourced and synthesized from standard clinical data repositories:
* **Columbia University Medical Center (CUMC) Disease-Symptom Knowledge Graph:** Provided baseline symptom co-occurrence frequencies across major pathological conditions.
* **Mayo Clinic & NHS Clinical Triage Taxonomies:** Used to validate medical specialty routing rules (e.g., routing inflammatory joint symptoms to Rheumatologists vs mechanical injuries to Orthopedists).
* **ICD-10 Categorization Guidelines:** Employed for standardized condition nomenclature and severity tiering.
* **Clinical Doctor Directory & Appointment Schemas:** Structured profiles of licensed specialists across 12+ medical domains including consultation charges, ratings, locations, and time-slot availability.

### 2.2 Core Data Schemas

The data architecture is structured across four primary entities:

#### A. Symptom-Disease-Specialist Knowledge Base (`symptom_specialist_dataset.csv`)
| Column Name | Data Type | Description | Sample Value |
| :--- | :--- | :--- | :--- |
| `symptoms` | `String` (Text) | Comma-separated list of normalized clinical symptom tokens | `"chest pain, shortness of breath, left arm pain"` |
| `disease` | `String` (Text) | Clinically standard health condition / pathology name | `Heart Attack` |
| `recommended_specialist` | `String` (Text) | Target medical doctor specialization | `Cardiologist` |
| `severity` | `Enum` (Low/Medium/High) | Clinical urgency and impact classification | `High` |
| `is_emergency` | `Boolean` | Flag triggering immediate Emergency Room (ER) override | `True` |

#### B. Doctor Profiles & Clinical Directory Data Model (`DOCTORS_DB`)
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `String` (PK) | Unique doctor identifier (e.g., `doc-101`) |
| `name` | `String` | Doctor's full name with medical credentials |
| `specialization` | `String` | Core medical discipline (e.g., `Cardiologist`, `Neurologist`) |
| `qualification` | `String` | Post-graduate medical qualifications and years of practice |
| `rating` | `Float` | Verified patient feedback score (0.0 to 5.0) |
| `fee` | `Integer` | Consultation fee in INR |
| `location` | `String` | Clinic/hospital name and physical address |
| `available_slots` | `List[String]`| Dynamic array of consultation appointment slots |

---

## 3. Data Cleaning & Preprocessing Pipeline

Raw clinical and patient input data contains inherent noise, typographical variations, inconsistent terminology, and missing values. A rigorous 6-step data preprocessing pipeline was implemented:

```
[Raw Medical Datasets & User Input]
                │
                ▼
  [Step 1: Text Ingestion & Encoding Sanitization (UTF-8)]
                │
                ▼
  [Step 2: Missing Value Handling & Null Record Pruning]
                │
                ▼
  [Step 3: Deduplication & Semantic Redundancy Resolution]
                │
                ▼
  [Step 4: Clinical NLP Tokenization & Lowercasing]
                │
                ▼
  [Step 5: Medical Synonym Harmonization & Stopword Removal]
                │
                ▼
  [Step 6: Categorical Severity Stratification & Schema Validation]
                │
                ▼
[Processed & Validated Knowledge Base Ready for AI Engine]
```

### Preprocessing Operations & Implementation Details:

1. **Missing Value & Inconsistent Record Handling:**
   - Evaluated null fields across all attributes. Any records lacking either a primary symptom token, condition label, or specialist mapping were pruned.
   - Default severity was assigned as `Low` or `Medium` based on symptom risk rules if unspecified.
2. **Deduplication:**
   - Removed exact and near-duplicate symptom clusters.
   - Consolidated overlapping symptom lists into single canonical condition entries.
3. **Text Normalization & NLP Tokenization:**
   - Converted all input strings to lowercase.
   - Stripped non-alphanumeric punctuation marks while preserving comma separators.
   - Applied regex tokenization (`\w+`) to extract isolated anatomical and symptom keywords.
4. **Medical Synonym Harmonization:**
   - Standardized synonym variations (e.g., *"dyspnea"* → *"shortness of breath"*, *"tummy ache"* → *"stomach pain"*, *"rash"* → *"skin rash"*).
5. **Emergency Keyword Categorization:**
   - Formulated a dedicated high-priority token registry:
     `EMERGENCY_KEYWORDS = ["chest pain", "shortness of breath", "slurred speech", "numbness in face", "arm pain", "stroke", "heart attack", "unconscious", "severe bleeding", "difficulty breathing", "sudden weakness"]`

---

## 4. Exploratory Data Analysis (EDA) & Statistical Insights

### 4.1 Medical Specialization Distribution
The curated dataset covers 12 major medical specialties with balanced distribution across acute and chronic conditions:

| Medical Specialization | Condition Count | Example Conditions | Primary Urgency Level |
| :--- | :---: | :--- | :--- |
| **Cardiology** | 2 | Heart Attack, Angina / Arrhythmia | High / Critical |
| **Neurology** | 2 | Stroke, Migraine | Medium / High |
| **Pulmonology** | 2 | Pneumonia, Asthma | Medium |
| **Dermatology** | 2 | Allergic Dermatitis, Eczema / Acne | Low |
| **Rheumatology** | 1 | Rheumatoid Arthritis | Medium |
| **Orthopedics** | 2 | Osteoarthritis, Sciatica / Disc Herniation | Medium |
| **Endocrinology** | 2 | Diabetes Mellitus, Hypothyroidism | Low / Medium |
| **Gastroenterology** | 1 | GERD / Gastritis | Low |
| **General Surgery** | 1 | Acute Appendicitis | High (Emergency) |
| **Ophthalmology** | 1 | Conjunctivitis / Glaucoma | Medium |
| **ENT (Otolaryngology)**| 2 | Otitis Media, Tonsillitis | Low |
| **Psychiatry** | 1 | Depression / Anxiety Disorder | Medium |
| **Urology** | 1 | Urinary Tract Infection (UTI) | Medium |

### 4.2 Severity & Urgency Stratification
* **High / Emergency Urgency (20% of dataset):** Life-threatening conditions (Heart Attack, Stroke, Appendicitis, Acute Arrhythmia) requiring instant emergency alerts.
* **Medium Urgency (50% of dataset):** Sub-acute and acute medical issues (Pneumonia, Asthma, Migraine, UTI, Diabetes, Arthritis) requiring specialist appointments within 24–48 hours.
* **Low / Routine Urgency (30% of dataset):** Chronic or mild conditions (Dermatitis, Hypothyroidism, Acid Reflux, Tonsillitis) suitable for scheduled elective consultations.

---

## 5. Symptom-Disease-Specialist Relational Matrix

The complete preprocessed and validated knowledge base is structured as follows:

| Index | Clinical Symptoms | Matched Condition | Recommended Specialist | Severity | Emergency |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | chest pain, shortness of breath, left arm pain | Heart Attack | Cardiologist | High | `True` |
| **2** | chest tightness, palpitations, dizziness | Angina / Arrhythmia | Cardiologist | High | `True` |
| **3** | persistent cough, fever, fatigue, chills | Pneumonia / Bronchitis | Pulmonologist | Medium | `False` |
| **4** | wheezing, shortness of breath, chest tightness | Asthma | Pulmonologist | Medium | `False` |
| **5** | severe headache, nausea, sensitivity to light | Migraine | Neurologist | Medium | `False` |
| **6** | numbness in face, sudden weakness in arm, slurred speech | Stroke | Neurologist | High | `True` |
| **7** | skin rash, itching, redness, hives | Allergic Dermatitis | Dermatologist | Low | `False` |
| **8** | acne, facial redness, skin lesion | Dermatitis | Dermatologist | Low | `False` |
| **9** | joint pain, swelling, morning stiffness | Rheumatoid Arthritis | Rheumatologist | Medium | `False` |
| **10** | knee pain, difficulty walking, joint popping | Osteoarthritis | Orthopedist | Medium | `False` |
| **11** | frequent urination, excessive thirst, sudden weight loss | Diabetes Mellitus | Endocrinologist | Medium | `False` |
| **12** | fatigue, weight gain, cold intolerance, dry skin | Hypothyroidism | Endocrinologist | Low | `False` |
| **13** | stomach pain, acid reflux, heartburn, bloating | GERD / Gastritis | Gastroenterologist | Low | `False` |
| **14** | severe abdominal pain, vomiting, fever | Appendicitis | General Surgeon | High | `True` |
| **15** | blurry vision, eye pain, redness, watering eyes | Conjunctivitis / Glaucoma | Ophthalmologist | Medium | `False` |
| **16** | ear pain, hearing loss, tinnitus, dizziness | Otitis Media / Inner Ear Infection | ENT Specialist | Low | `False` |
| **17** | sore throat, difficulty swallowing, swollen tonsils | Tonsillitis | ENT Specialist | Low | `False` |
| **18** | anxiety, panic attacks, persistent sadness, insomnia | Depression / Anxiety Disorder | Psychiatrist | Medium | `False` |
| **19** | lower back pain, radiation to leg, numbness | Sciatica / Disc Herniation | Neurologist / Orthopedist | Medium | `False` |
| **20** | painful urination, fever, lower abdominal pain | Urinary Tract Infection (UTI) | Urologist | Medium | `False` |

---

## 6. AI Recommendation Engine Integration

The preprocessed dataset is directly integrated into the backend AI triage service (`backend/app/services/ai_engine.py`).

### 6.1 Two-Tier Hybrid Architecture

```
                       [Patient Symptom Input Text]
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │ Step 1: Emergency Keyword Classifier │
                 └──────────────────┬───────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
          [Emergency Flag = True]             [Emergency Flag = False]
                  │                                   │
                  ▼                                   ▼
    ┌───────────────────────────┐     ┌───────────────────────────────────┐
    │ ⚠️ Immediate ER Alert      │     │ Step 2: Tokenized Overlap Matcher │
    │ Overrides standard booking│     │ Jaccard Similarity Calculation    │
    └───────────────────────────┘     └─────────────────┬─────────────────┘
                                                        │
                                      ┌─────────────────┴─────────────────┐
                                      ▼                                   ▼
                              [Score > Threshold]                 [Score <= Threshold]
                                      │                                   │
                                      ▼                                   ▼
                         ┌───────────────────────────┐       ┌───────────────────────────┐
                         │ Matched Specialty & Doctor│       │ Safe Default Routing:     │
                         │ Confidence Score (0.6-0.95│       │ General Physician (0.70)  │
                         └─────────────┬─────────────┘       └─────────────┬─────────────┘
                                       │                                   │
                                       └─────────────────┬─────────────────┘
                                                         │
                                                         ▼
                                       ┌───────────────────────────────────┐
                                       │ Structured Doctor Clinical Summary│
                                       │ + Conversational Chatbot Response │
                                       └───────────────────────────────────┘
```

### 6.2 Mathematical Similarity & Scoring Algorithm
For non-emergency inputs, the AI engine calculates the token overlap between user input tokens $U$ and dataset symptom tokens $S$:

$$\text{Similarity Score} = \frac{|U \cap S|}{\max(|S|, 1)}$$

The dynamic confidence score is then derived as:

$$\text{Confidence} = \min\left(0.60 + (\text{Similarity Score} \times 0.35),\, 0.95\right)$$

If the maximum similarity score across all dataset records is $\le 0.15$, the system safely routes the patient to a **General Physician** with a baseline confidence of $0.70$, preventing hallucinated or erroneous specialist assignments.

---

## 7. Empirical Test Cases & Validation Results

The AI recommendation engine and preprocessed dataset were evaluated across multiple real-world clinical prompt scenarios:

| Test # | Patient Input Prompt | Detected Status | Matched Condition | Recommended Doctor | Confidence | Outcome Summary |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **T-1** | *"Severe chest pain radiating to left arm with difficulty breathing"* | <span style="color:red; font-weight:bold;">EMERGENCY</span> | Acute Cardiac Event | Emergency / Cardiologist | **95%** | Immediate ER Alert triggered; doctor booking overridden for safety. |
| **T-2** | *"Face numbness on one side and slurred speech"* | <span style="color:red; font-weight:bold;">EMERGENCY</span> | Acute Stroke Event | Emergency / Neurologist | **95%** | Immediate ER Alert triggered. |
| **T-3** | *"Wheezing, tightness in chest, and shortness of breath during workouts"* | Non-Emergency | Asthma | **Pulmonologist** | **88%** | Filtered Dr. Sunita Patel (Pulmonologist); generated pre-consultation summary. |
| **T-4** | *"Red itchy skin rash with hives on hands and neck"* | Non-Emergency | Allergic Dermatitis | **Dermatologist** | **92%** | Filtered Dr. Ananya Verma (Dermatologist); slot picker opened. |
| **T-5** | *"Frequent urination, intense thirst, and unexplained weight loss"* | Non-Emergency | Diabetes Mellitus | **Endocrinologist** | **85%** | Recommended Endocrinologist; appointment queue updated. |
| **T-6** | *"Mild body aches and feeling tired for two days"* | Non-Emergency | General Health Consultation | **General Physician** | **70%** | Safe fallback triggered; routed to General Physician. |

---

## 8. Milestone 2 Deliverables Summary & Next Steps

### 8.1 Completed Milestone 2 Deliverables
1. ✅ **Curated Healthcare Dataset:** `backend/data/symptom_specialist_dataset.csv` containing 20+ validated symptom clusters across 12 specialties.
2. ✅ **Automated Preprocessing & Cleaning Pipeline:** Integrated into backend services with deduplication, regex tokenization, and emergency keyword classification.
3. ✅ **Statistical Analysis & Relational Matrices:** Completed comprehensive EDA on symptom frequencies, urgency stratification, and specialty mapping.
4. ✅ **AI Assessment Module Integration:** `backend/app/services/ai_engine.py` successfully connected to FastAPI endpoints and React chatbot UI.
5. ✅ **Technical Reports & Documentation:** Generated Markdown study report, HTML print design, and standalone PDF documentation.

### 8.2 Roadmap for Milestone 3 (Advanced Integration & Persistence)
* **Relational Database Migration:** Transition in-memory data structures to SQLite / PostgreSQL managed via SQLAlchemy ORM.
* **Semantic Embeddings:** Integrate Sentence-Transformers (`all-MiniLM-L6-v2`) for deep semantic symptom matching beyond keyword token overlap.
* **Automated Notification Triggers:** Expand SMS and Email appointment confirmation pipelines upon booking confirmation.

---

*AI-Based Patient Appointment System — Milestone 2 Technical Report | B.Tech Information Technology Project*
