# PharmLife Game Scenarios Documentation

This document outlines the 4 scenarios (levels) currently active in the Year 1 gameplay loop.

## 1. Standard Prescription (Rx #001)

**Level Title:** Standard Prescription
**Difficulty:** Basic

### Patient Details
*   **Name:** Mr Tan Ah Beng
*   **IC:** S0248566J
*   **Medication:** Ibuprofen 200mg (40 tabs)

### Scenario Logic
*   **Status:** **Valid Prescription**
*   **Issue:** None.
*   **Correct Action:** Proceed through all stages (Receiving -> Typing -> Picking -> Dispensing).
*   **Key Learning:** Basic dispensing flow for a standard prescription.

---

## 2. Multiple Items (Rx #002)

**Level Title:** Multiple Items
**Difficulty:** Intermediate

### Patient Details
*   **Name:** Muhammad Imran
*   **IC:** G4500872F
*   **Medications:** 
    1.  Amoxicillin 500mg
    2.  Chlorpheniramine 4mg
    3.  Dextromethorphan Syrup

### Scenario Logic
*   **Status:** **Valid Prescription**
*   **Issue:** None.
*   **Correct Action:** Process all 3 items correctly.
*   **Key Learning:** Managing valid multi-item prescriptions and packing multiple medications.

---

## 3. Allergy Intervention (Rx #003)

**Level Title:** Allergy Intervention
**Difficulty:** Intermediate

### Patient Details
*   **Name:** Mr Tan Ah Beng
*   **IC:** S0248566J
*   **Medication:** Paracetamol 500mg
*   **Allergy Record:** Paracetamol

### Scenario Logic
*   **Status:** **Invalid (Allergy Conflict)**
*   **Situation:** The prescription works for Paracetamol 500mg. Patient record shows allergy to Paracetamol. Remarks: "Patient is allergic to Paracetamol, so cannot proceed. (In such instances, usually the staff has to give the dr a call - intervention)".
*   **Question:** You found that the patient is allergic to the prescribed medication. What should you do?

### Decision Options & Outcomes

| Option Text | Is Correct? | Outcome / Feedback |
| :--- | :---: | :--- |
| **Call doctor to request alternative medication** | **YES** | **Outcome:** You called the doctor. Doctor confirmed: "Patient is allergic to Paracetamol, so cannot proceed." An alternative was prescribed.<br>**Feedback:** Model Answer: "Patient is allergic to Paracetamol, so cannot proceed. (In such instances, usually the staff has to give the dr a call - intervention)" |
| Dispense anyway - doctor knows best | NO | **Outcome:** You dispensed Paracetamol to an allergic patient. Patient developed severe allergic reaction (anaphylaxis) and was rushed to ER. You are held professionally liable!<br>**Feedback:** CRITICAL WARNING: The patient is allergic to Paracetamol! Check the "Allergies" field on the Patient Card. Dispensing this could be fatal! |
| Ask patient about their Paracetamol allergy | YES* | **Outcome:** Patient confirmed: "Yes, I get terrible rashes from Paracetamol." You then refused to dispense and told patient to contact the doctor. Good catch!<br>**Feedback:** Good verification, but there is a safer and faster way. Hint: Since the allergy is confirmed in the records, calling the doctor for an alternative is the standard procedure. |
| Refuse to dispense - unsafe for patient | NO | **Outcome:** You refused without helping arrange an alternative. Patient had to make another doctor appointment, delaying treatment.<br>**Feedback:** Refusing is safe but not helpful. Hint: The patient needs medication. Call the doctor to get a safe alternative instead. |

*> *Note: While asking the patient is "Correct" in terms of safety, "Calling the Doctor" is the optimal/model answer for this scenario.*

---

## 4. Missing Information (Rx #004)

**Level Title:** Missing Information
**Difficulty:** Intermediate

### Patient Details
*   **Name:** Sivanathan Ramasamy
*   **IC:** S8023455I
*   **Medications:** 
    1. Salbutamol Inhaler
    2. Antacid Tablet (Missing Duration)

### Scenario Logic
*   **Status:** **Invalid (Incomplete Dosage)**
*   **Situation:** Prescription for Antacid tablet, 1 tab tds prn. The duration/quantity field shows "(missing)". Remarks: "1/12".
*   **Question:** The prescription is missing the duration information. What is your action?

### Decision Options & Outcomes

| Option Text | Is Correct? | Outcome / Feedback |
| :--- | :---: | :--- |
| **Call the prescribing doctor to get the missing duration** | **YES** | **Outcome:** You called the clinic. Doctor specified "1/12" (1 month). You updated the prescription and dispensed correctly.<br>**Feedback:** Model Answer: "1/12" (1 month). Incomplete prescriptions require prescriber clarification. |
| Dispense standard 1-month supply - it's a common medication | NO | **Outcome:** You dispensed 1 month supply without authorization. Doctor only intended 1 week. Patient overused the medication, leading to adverse effects. Pharmacy audit flagged this error.<br>**Feedback:** Wait! Look at the "Duration" field for the Antacid. It says "(missing)". Check the Remarks field or call the doctor to confirm the intended duration. |
| Ask patient how long they need the medication | NO | **Outcome:** Patient said "I don't know, how much should I take?" You realized patient input isn't sufficient and called the doctor anyway.<br>**Feedback:** Patients often don't know the clinical details. Hint: If information is missing from the prescription, the doctor is the only one who can officially clarify it. |
| Refuse - prescription is incomplete | NO | **Outcome:** You refused without attempting to help. Patient left frustrated and had to return to the clinic during work hours.<br>**Feedback:** Refusing closes the door on the patient. Hint: You can solve this! Call the doctor to get the missing details and help the patient. |
