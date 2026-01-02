import { ScenarioDecision, PatientDialogue } from '../types/game.types';

// Scenario 1: Allergy Conflict - Patient verbal vs system record
export const allergyConflictScenario: ScenarioDecision = {
  id: 'scenario-allergy-conflict',
  situation: 'The patient says they have NO drug allergies, but the system shows an allergy to Penicillin. The prescription contains Amoxicillin (a penicillin antibiotic).',
  question: 'What action should you take?',
  options: [
    {
      id: 'proceed',
      text: 'Proceed with dispensing - patient said no allergies',
      action: 'accept-rx',
    },
    {
      id: 'verify',
      text: 'Ask patient to verify the allergy record',
      action: 'ask-patient',
    },
    {
      id: 'call',
      text: 'Call the doctor to clarify',
      action: 'call-doctor',
    },
    {
      id: 'refuse',
      text: 'Refuse to dispense due to allergy conflict',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'verify',
  consequences: {
    proceed: {
      outcome: 'You dispensed the medication. The patient had an allergic reaction and was hospitalized!',
      patientReaction: 'Patient suffers severe allergic reaction',
      scoreImpact: -100,
      rxPointsImpact: -50,
      isCorrect: false,
      explanation: 'NEVER dispense when there is an allergy conflict. Always verify with the patient first. Patient safety is paramount!',
    },
    verify: {
      outcome: 'You asked the patient about the Penicillin allergy. Patient remembers: "Oh yes! I forgot about that. I broke out in rashes last time."',
      patientReaction: 'Patient thanks you for being thorough',
      scoreImpact: 100,
      rxPointsImpact: 50,
      isCorrect: true,
      explanation: 'Excellent! You prevented a potentially dangerous allergic reaction. Always verify discrepancies between patient statements and records.',
    },
    call: {
      outcome: 'You called the doctor. They confirmed the patient has a penicillin allergy and prescribed an alternative antibiotic.',
      patientReaction: 'Patient appreciates your diligence',
      scoreImpact: 80,
      rxPointsImpact: 40,
      isCorrect: true,
      explanation: 'Good decision! Calling the doctor is appropriate when there are allergy conflicts. However, asking the patient first would be faster.',
    },
    refuse: {
      outcome: 'You refused without investigating. The patient left confused and frustrated. Later you found out it was a data entry error - patient has no allergies.',
      patientReaction: 'Patient leaves unhappy and goes to another pharmacy',
      scoreImpact: -50,
      rxPointsImpact: -20,
      isCorrect: false,
      explanation: 'Always investigate before refusing. Ask the patient first to verify the allergy record.',
    },
  },
};

// Scenario 2: Expired Prescription but Patient insists
export const expiredRxScenario: ScenarioDecision = {
  id: 'scenario-expired-rx',
  situation: 'The prescription is dated 8 months ago (valid for 6 months only). The patient says: "The doctor told me I can refill this anytime."',
  question: 'What should you do?',
  options: [
    {
      id: 'dispense',
      text: 'Dispense it - patient says doctor approved',
      action: 'accept-rx',
    },
    {
      id: 'explain',
      text: 'Explain to patient that Rx is expired, suggest visiting doctor',
      action: 'ask-patient',
    },
    {
      id: 'call-verify',
      text: 'Call doctor to verify if refill is still valid',
      action: 'call-doctor',
    },
    {
      id: 'refuse-firm',
      text: 'Refuse outright - prescription is expired',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'explain',
  consequences: {
    dispense: {
      outcome: 'You dispensed medication on an expired prescription. The pharmacy failed an audit and received a warning from the regulatory board.',
      patientReaction: 'Patient is happy but you violated regulations',
      scoreImpact: -80,
      rxPointsImpact: -40,
      isCorrect: false,
      explanation: 'Expired prescriptions are invalid regardless of what the patient claims. Always follow regulations.',
    },
    explain: {
      outcome: 'You politely explained the 6-month validity rule and suggested the patient get a new prescription. Patient understood and scheduled a doctor visit.',
      patientReaction: 'Patient initially frustrated but appreciates the explanation',
      scoreImpact: 100,
      rxPointsImpact: 50,
      isCorrect: true,
      explanation: 'Perfect! Clear communication about regulations while being helpful. You maintained compliance and patient relations.',
    },
    'call-verify': {
      outcome: 'Doctor confirmed the medication is still needed but issued a new prescription. Patient received medication after slight delay.',
      patientReaction: 'Patient appreciates the thorough service',
      scoreImpact: 90,
      rxPointsImpact: 45,
      isCorrect: true,
      explanation: 'Good approach! Calling the doctor can help, but explaining to the patient first is more efficient.',
    },
    'refuse-firm': {
      outcome: 'You refused without explanation. Patient left angry and complained about poor service.',
      patientReaction: 'Patient storms out and posts negative review',
      scoreImpact: -30,
      rxPointsImpact: -15,
      isCorrect: false,
      explanation: 'While refusing is correct, you need to explain WHY and offer a solution. Good customer service matters!',
    },
  },
};

// Scenario 3: Missing Signature but everything else looks valid
export const missingSigScenario: ScenarioDecision = {
  id: 'scenario-missing-sig',
  situation: 'The prescription has all required information but the doctor signature field is blank. Patient says: "I was just at the clinic 10 minutes ago, the doctor must have forgotten to sign."',
  question: 'What is the appropriate action?',
  options: [
    {
      id: 'dispense-trust',
      text: 'Dispense - patient just came from clinic, it\'s clearly valid',
      action: 'accept-rx',
    },
    {
      id: 'call-clinic',
      text: 'Call the clinic to verify and ask doctor to sign',
      action: 'call-doctor',
    },
    {
      id: 'ask-return',
      text: 'Ask patient to return to clinic for signature',
      action: 'ask-patient',
    },
    {
      id: 'refuse-nosig',
      text: 'Refuse - no signature means invalid prescription',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'call-clinic',
  consequences: {
    'dispense-trust': {
      outcome: 'You dispensed without a signature. It turned out to be a forged prescription. You are held liable.',
      patientReaction: 'Patient leaves with medication (potential fraud)',
      scoreImpact: -150,
      rxPointsImpact: -80,
      isCorrect: false,
      explanation: 'CRITICAL ERROR! A prescription without a signature is INVALID, period. This is a legal requirement to prevent fraud.',
    },
    'call-clinic': {
      outcome: 'You called the clinic. Doctor confirmed the prescription and authorized you to dispense while they send a signed copy via email. Crisis averted!',
      patientReaction: 'Patient waits patiently and thanks you',
      scoreImpact: 120,
      rxPointsImpact: 60,
      isCorrect: true,
      explanation: 'Excellent! You followed protocol while being practical. Verifying with the clinic is the best approach.',
    },
    'ask-return': {
      outcome: 'Patient returned to clinic, got signature, came back. Everything resolved but patient was inconvenienced.',
      patientReaction: 'Patient slightly annoyed but understands',
      scoreImpact: 60,
      rxPointsImpact: 30,
      isCorrect: true,
      explanation: 'This works but is less efficient. Calling the clinic first could have saved the patient a trip.',
    },
    'refuse-nosig': {
      outcome: 'You refused without offering solutions. Patient left frustrated and went to another pharmacy who called the clinic for verification.',
      patientReaction: 'Patient leaves angry and doesn\'t return',
      scoreImpact: -20,
      rxPointsImpact: -10,
      isCorrect: false,
      explanation: 'While you\'re right about the invalid signature, you should offer to help by calling the clinic. Always try to solve the problem!',
    },
  },
};

// Scenario 4: Identity Mismatch - IC number off by one digit
export const identityMismatchScenario: ScenarioDecision = {
  id: 'scenario-identity-mismatch',
  situation: 'Patient IC on card: S1234567A. Prescription shows: S1234576A (digits transposed). Patient name matches perfectly.',
  question: 'What do you do?',
  options: [
    {
      id: 'proceed-name',
      text: 'Proceed - name matches, likely a typo',
      action: 'accept-rx',
    },
    {
      id: 'verify-patient',
      text: 'Ask patient to verify the correct IC number',
      action: 'ask-patient',
    },
    {
      id: 'call-check',
      text: 'Call doctor to verify the correct IC',
      action: 'call-doctor',
    },
    {
      id: 'refuse-mismatch',
      text: 'Refuse - IC numbers don\'t match exactly',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'verify-patient',
  consequences: {
    'proceed-name': {
      outcome: 'You dispensed to the wrong patient! Two patients have the same name. The medication was meant for someone else.',
      patientReaction: 'Wrong patient receives wrong medication',
      scoreImpact: -120,
      rxPointsImpact: -70,
      isCorrect: false,
      explanation: 'CRITICAL ERROR! IC number is a unique identifier for a reason. Two people can have the same name, never skip IC verification!',
    },
    'verify-patient': {
      outcome: 'Patient confirmed their IC ends in 67A. You caught a doctor\'s typo error and prevented wrong patient medication error!',
      patientReaction: 'Patient appreciates your attention to detail',
      scoreImpact: 110,
      rxPointsImpact: 55,
      isCorrect: true,
      explanation: 'Perfect! Two identifiers (name AND IC) must always match. You caught a critical error!',
    },
    'call-check': {
      outcome: 'Doctor confirmed it was a typo and corrected it. Good catch but took longer than needed.',
      patientReaction: 'Patient waits but appreciates thoroughness',
      scoreImpact: 80,
      rxPointsImpact: 40,
      isCorrect: true,
      explanation: 'Good approach, but asking the patient first would be faster. The patient has their IC card right there!',
    },
    'refuse-mismatch': {
      outcome: 'You refused without investigating. Patient left confused and had to return to the doctor.',
      patientReaction: 'Patient frustrated by the inconvenience',
      scoreImpact: -40,
      rxPointsImpact: -20,
      isCorrect: false,
      explanation: 'While being cautious is good, simply asking the patient to verify could have resolved this quickly.',
    },
  },
};

// Scenario 5: Missing Duration - Patient knows the details
export const incompleteDosageScenario: ScenarioDecision = {
  id: 'scenario-incomplete-dosage',
  situation: 'The prescription says "Amoxicillin 500mg capsule, 1 cap tds" but duration is missing. Patient says: "Doctor said take it for 7 days."',
  question: 'How should you handle this?',
  options: [
    {
      id: 'trust-patient',
      text: 'Add 7 days based on patient information',
      action: 'accept-rx',
    },
    {
      id: 'call-confirm',
      text: 'Call doctor to confirm the 7-day duration',
      action: 'call-doctor',
    },
    {
      id: 'ask-verify',
      text: 'Ask patient if they have clinic notes or discharge summary',
      action: 'ask-patient',
    },
    {
      id: 'refuse-incomplete',
      text: 'Refuse - prescription is incomplete',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'call-confirm',
  consequences: {
    'trust-patient': {
      outcome: 'You added 7 days. Later found out doctor actually prescribed 5 days. Patient took antibiotics for too long, increasing resistance risk.',
      patientReaction: 'Patient followed your instructions (incorrect duration)',
      scoreImpact: -90,
      rxPointsImpact: -45,
      isCorrect: false,
      explanation: 'Never add information to a prescription based on patient statement alone. Missing info requires doctor verification.',
    },
    'call-confirm': {
      outcome: 'Doctor confirmed 7 days and sent an updated prescription via email. You correctly followed protocol!',
      patientReaction: 'Patient waits but appreciates proper procedure',
      scoreImpact: 100,
      rxPointsImpact: 50,
      isCorrect: true,
      explanation: 'Excellent! Incomplete prescriptions require doctor clarification. Antibiotic duration is critical - never guess!',
    },
    'ask-verify': {
      outcome: 'Patient checked their phone - doctor sent them a message saying "7 days course". You called to confirm anyway, which was correct.',
      patientReaction: 'Patient shows phone message, you verify with doctor',
      scoreImpact: 90,
      rxPointsImpact: 45,
      isCorrect: true,
      explanation: 'Good thinking to check for documentation, but you should still call the doctor for missing prescription info.',
    },
    'refuse-incomplete': {
      outcome: 'You refused without helping. Patient had to return to clinic during work hours, losing time and money.',
      patientReaction: 'Patient very frustrated, leaves negative review',
      scoreImpact: -50,
      rxPointsImpact: -25,
      isCorrect: false,
      explanation: 'While the prescription IS incomplete, a good pharmacist would call the doctor to resolve it rather than just refusing.',
    },
  },
};

// Patient Dialogues for Typing Stage
export const typingDialogues: PatientDialogue[] = [
  {
    id: 'dialogue-dosage-confirm',
    text: 'So how many tablets should I take each time?',
    mood: 'neutral',
  },
  {
    id: 'dialogue-frequency-question',
    text: 'The doctor said something about taking it twice a day... is that right?',
    mood: 'confused',
  },
  {
    id: 'dialogue-timing-question',
    text: 'Should I take this before or after meals?',
    mood: 'neutral',
  },
  {
    id: 'dialogue-duration-confirm',
    text: 'How many days do I need to take this medicine?',
    mood: 'neutral',
  },
  {
    id: 'dialogue-alcohol-warning',
    text: 'Can I drink alcohol while taking this medication?',
    mood: 'worried',
  },
  {
    id: 'dialogue-missed-dose',
    text: 'What if I forget to take a dose?',
    mood: 'worried',
  },
  {
    id: 'dialogue-side-effects',
    text: 'The doctor mentioned something about side effects... what should I watch out for?',
    mood: 'worried',
  },
  {
    id: 'dialogue-storage',
    text: 'Do I need to keep this in the fridge?',
    mood: 'neutral',
  },
  {
    id: 'dialogue-different-look',
    text: 'This looks different from what I got last time. Are you sure it\'s the same medicine?',
    mood: 'confused',
  },
  {
    id: 'dialogue-wrong-label',
    text: 'Wait, the label says take 3 times a day, but I\'m sure the doctor said twice a day...',
    mood: 'confused',
    triggerCondition: 'wrong-frequency',
  },
  {
    id: 'dialogue-too-many-pills',
    text: 'This seems like a lot of pills... are you sure about the quantity?',
    mood: 'worried',
    triggerCondition: 'wrong-quantity',
  },
];

// Scenario 6: RX #3 - Patient allergic to Paracetamol but prescribed it
export const rx3AllergyScenario: ScenarioDecision = {
  id: 'scenario-rx3-allergy',
  situation: 'The prescription works for Paracetamol 500mg. Patient record shows allergy to Paracetamol. Remarks: "Patient is allergic to Paracetamol... give the dr a call - intervention".',
  question: 'You found that the patient is allergic to the prescribed medication. What should you do?',
  options: [
    {
      id: 'dispense-anyway',
      text: 'Dispense anyway - doctor knows best',
      action: 'accept-rx',
    },
    {
      id: 'call-doctor-alternative',
      text: 'Call doctor to request alternative medication',
      action: 'call-doctor',
    },
    {
      id: 'ask-patient-confirm',
      text: 'Ask patient about their Paracetamol allergy',
      action: 'ask-patient',
    },
    {
      id: 'refuse-unsafe',
      text: 'Refuse to dispense - unsafe for patient',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'call-doctor-alternative',
  consequences: {
    'dispense-anyway': {
      outcome: 'You dispensed Paracetamol to an allergic patient. Patient developed severe allergic reaction (anaphylaxis) and was rushed to ER. You are held professionally liable!',
      patientReaction: 'Patient suffers life-threatening allergic reaction',
      scoreImpact: -200,
      rxPointsImpact: -100,
      isCorrect: false,
      explanation: 'CRITICAL WARNING: The patient is allergic to Paracetamol! Check the "Allergies" field on the Patient Card. Dispensing this could be fatal!',
    },
    'call-doctor-alternative': {
      outcome: 'You called the doctor. Doctor confirmed: "Patient is allergic to Paracetamol, so cannot proceed." An alternative was prescribed.',
      patientReaction: 'Patient grateful you prevented a dangerous situation',
      scoreImpact: 150,
      rxPointsImpact: 75,
      isCorrect: true,
      explanation: 'Model Answer: "Patient is allergic to Paracetamol, so cannot proceed. (In such instances, usually the staff has to give the dr a call - intervention)"',
      shouldSkipRemainingStages: true,
    },
    'ask-patient-confirm': {
      outcome: 'Patient confirmed: "Yes, I get terrible rashes from Paracetamol." You then refused to dispense and told patient to contact the doctor. Good catch!',
      patientReaction: 'Patient appreciates your diligence',
      scoreImpact: 100,
      rxPointsImpact: 50,
      isCorrect: true,
      explanation: 'Good verification, but there is a safer and faster way. Hint: Since the allergy is confirmed in the records, calling the doctor for an alternative is the standard procedure.',
    },
    'refuse-unsafe': {
      outcome: 'You refused without helping arrange an alternative. Patient had to make another doctor appointment, delaying treatment.',
      patientReaction: 'Patient left without pain relief, frustrated',
      scoreImpact: 20,
      rxPointsImpact: 10,
      isCorrect: false,
      explanation: 'Refusing is safe but not helpful. Hint: The patient needs medication. Call the doctor to get a safe alternative instead.',
    },
  },
};

// Scenario 7: RX #4 - Missing Duration Information
export const rx4IncompleteDurationScenario: ScenarioDecision = {
  id: 'scenario-rx4-duration',
  situation: 'Prescription for Antacid tablet, 1 tab tds prn. The duration/quantity field shows "(missing)". Remarks: "1/12".',
  question: 'The prescription is missing the duration information. What is your action?',
  options: [
    {
      id: 'dispense-standard',
      text: 'Dispense standard 1-month supply - it\'s a common medication',
      action: 'accept-rx',
    },
    {
      id: 'call-verify-duration',
      text: 'Call the prescribing doctor to get the missing duration',
      action: 'call-doctor',
    },
    {
      id: 'ask-patient-duration',
      text: 'Ask patient how long they need the medication',
      action: 'ask-patient',
    },
    {
      id: 'refuse-incomplete-rx',
      text: 'Refuse - prescription is incomplete',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'call-verify-duration',
  consequences: {
    'dispense-standard': {
      outcome: 'You dispensed 1 month supply without authorization. Doctor only intended 1 week. Patient overused the medication, leading to adverse effects. Pharmacy audit flagged this error.',
      patientReaction: 'Patient took medication as you advised (too long)',
      scoreImpact: -100,
      rxPointsImpact: -50,
      isCorrect: false,
      explanation: 'Wait! Look at the "Duration" field for the Antacid. It says "(missing)". Check the Remarks field or call the doctor to confirm the intended duration.',
    },
    'call-verify-duration': {
      outcome: 'You called the clinic. Doctor specified "1/12" (1 month). You updated the prescription and dispensed correctly.',
      patientReaction: 'Patient waits briefly but receives proper medication',
      scoreImpact: 120,
      rxPointsImpact: 60,
      isCorrect: true,
      explanation: 'Model Answer: "1/12" (1 month). Incomplete prescriptions require prescriber clarification.',
    },
    'ask-patient-duration': {
      outcome: 'Patient said "I don\'t know, how much should I take?" You realized patient input isn\'t sufficient and called the doctor anyway.',
      patientReaction: 'Patient doesn\'t know, waits while you verify',
      scoreImpact: 60,
      rxPointsImpact: 30,
      isCorrect: false,
      explanation: 'Patients often don\'t know the clinical details. Hint: If information is missing from the prescription, the doctor is the only one who can officially clarify it.',
    },
    'refuse-incomplete-rx': {
      outcome: 'You refused without attempting to help. Patient left frustrated and had to return to the clinic during work hours.',
      patientReaction: 'Patient very unhappy, leaves negative review',
      scoreImpact: -60,
      rxPointsImpact: -30,
      isCorrect: false,
      explanation: 'Refusing closes the door on the patient. Hint: You can solve this! Call the doctor to get the missing details and help the patient.',
    },
  },
};

// Scenario 8: Patient identity verification with similar names
export const identityVerificationScenario: ScenarioDecision = {
  id: 'scenario-identity-verification',
  situation: 'You have TWO patients in the system with the name "Tan Ah Beng". One is S0248566J (age 40), the other is S8765432B (age 65). The prescription shows name "Mr Tan Ah Beng" but IC is partially illegible.',
  question: 'How do you verify you have the correct patient?',
  options: [
    {
      id: 'assume-younger',
      text: 'Assume it\'s the younger patient (more common)',
      action: 'accept-rx',
    },
    {
      id: 'check-both-ids',
      text: 'Ask patient to show IC card and verify the exact number',
      action: 'ask-patient',
    },
    {
      id: 'call-clinic-verify',
      text: 'Call the clinic to verify which patient',
      action: 'call-doctor',
    },
    {
      id: 'refuse-unclear',
      text: 'Refuse - IC number is illegible',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'check-both-ids',
  consequences: {
    'assume-younger': {
      outcome: 'You dispensed to the wrong Tan Ah Beng! The medication was for the 65-year-old with heart condition. The 40-year-old took medication he didn\'t need. Critical error!',
      patientReaction: 'Wrong patient received wrong medication',
      scoreImpact: -150,
      rxPointsImpact: -80,
      isCorrect: false,
      explanation: 'NEVER assume! Two identifiers (name AND IC) must ALWAYS match. This is a fundamental safety requirement.',
    },
    'check-both-ids': {
      outcome: 'Patient showed IC card: S0248566J. You verified both name and IC match, dispensed correctly. Standard proper procedure followed!',
      patientReaction: 'Patient cooperates, no delay',
      scoreImpact: 100,
      rxPointsImpact: 50,
      isCorrect: true,
      explanation: 'Perfect! Always verify TWO identifiers. Simply asking to see the patient\'s IC card resolves this instantly.',
    },
    'call-clinic-verify': {
      outcome: 'You called the clinic and verified. Correct approach but took extra time when patient had their IC card right there.',
      patientReaction: 'Patient waits while you make unnecessary call',
      scoreImpact: 60,
      rxPointsImpact: 30,
      isCorrect: true,
      explanation: 'This works but is inefficient. The patient has their IC card - just ask to see it!',
    },
    'refuse-unclear': {
      outcome: 'You refused without asking patient for their IC. Patient frustrated when they had their card ready to show.',
      patientReaction: 'Patient leaves annoyed',
      scoreImpact: -40,
      rxPointsImpact: -20,
      isCorrect: false,
      explanation: 'Simply asking the patient to verify their IC would have resolved this immediately. Don\'t refuse without trying to verify first.',
    },
  },
};

// Scenario 9: Doctor signature verification scenario
export const signatureVerificationScenario: ScenarioDecision = {
  id: 'scenario-signature-check',
  situation: 'The prescription has what looks like a signature, but it\'s very messy and barely legible. You can\'t clearly read the doctor\'s name from the signature. The printed doctor name says "Dr. Lee Ming".',
  question: 'What should you do about the unclear signature?',
  options: [
    {
      id: 'accept-has-signature',
      text: 'Accept it - there is a signature present',
      action: 'accept-rx',
    },
    {
      id: 'call-verify-signature',
      text: 'Call the clinic to verify the prescription is genuine',
      action: 'call-doctor',
    },
    {
      id: 'ask-patient-clinic',
      text: 'Ask patient if they came directly from Dr. Lee\'s clinic',
      action: 'ask-patient',
    },
    {
      id: 'refuse-illegible',
      text: 'Refuse - signature is illegible',
      action: 'refuse-rx',
    },
  ],
  correctAction: 'call-verify-signature',
  consequences: {
    'accept-has-signature': {
      outcome: 'You accepted the prescription. Later discovered it was a forged prescription using a stamp. Pharmacy received regulatory warning for inadequate verification.',
      patientReaction: 'Person obtains controlled medication illegally',
      scoreImpact: -120,
      rxPointsImpact: -60,
      isCorrect: false,
      explanation: 'Illegible signatures should always be verified with the clinic, especially for new or controlled medications. Forgeries do happen!',
    },
    'call-verify-signature': {
      outcome: 'You called the clinic. Receptionist confirmed Dr. Lee did see this patient today and the prescription is genuine. Doctor just has messy handwriting!',
      patientReaction: 'Patient waits patiently, appreciates thoroughness',
      scoreImpact: 110,
      rxPointsImpact: 55,
      isCorrect: true,
      explanation: 'Excellent! When in doubt, verify. Better to be cautious than to accept a potentially forged prescription.',
    },
    'ask-patient-clinic': {
      outcome: 'Patient confirmed they just came from the clinic. You still felt unsure and called to verify anyway. Good instinct!',
      patientReaction: 'Patient confirms, you verify anyway',
      scoreImpact: 80,
      rxPointsImpact: 40,
      isCorrect: true,
      explanation: 'Good, but patient confirmation isn\'t sufficient for signature verification. Calling the clinic is the right action.',
    },
    'refuse-illegible': {
      outcome: 'You refused a genuine prescription because of the doctor\'s messy handwriting. Patient upset and had to return to clinic.',
      patientReaction: 'Patient very frustrated',
      scoreImpact: -50,
      rxPointsImpact: -25,
      isCorrect: false,
      explanation: 'Calling to verify would have been better than outright refusing. Many doctors have messy signatures!',
    },
  },
};

export const allScenarios = [
  allergyConflictScenario,
  expiredRxScenario,
  missingSigScenario,
  identityMismatchScenario,
  incompleteDosageScenario,
  rx3AllergyScenario,
  rx4IncompleteDurationScenario,
  identityVerificationScenario,
  signatureVerificationScenario,
];
