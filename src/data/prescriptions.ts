import { Prescription, LevelData } from '../types/game.types';
import {
  rx3AllergyScenario,
  rx4IncompleteDurationScenario,
  allergyConflictScenario,
  expiredRxScenario,
  missingSigScenario,
  identityMismatchScenario,
  signatureVerificationScenario,
} from './scenarios';

// Rx #1 - Valid Rx (Ibuprofen) - Patient has Paracetamol allergy but correctly prescribed Ibuprofen
const rx1: Prescription = {
  id: 'rx-001',
  patientName: 'Mr Tan Ah Beng',
  patientIC: 'S0248566J',
  patientAllergies: ['Paracetamol'],
  doctorName: 'Dr William Tan',
  doctorSignature: true,
  date: '2025-02-02',
  medications: [
    {
      medicationId: 'med-002', // Ibuprofen (safe alternative)
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '40 tabs',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
  // No scenario - this is a correctly managed allergy case (good example)
};

// Rx #2 - Valid Rx (Multiple medications)
const rx2: Prescription = {
  id: 'rx-002',
  patientName: 'Muhammad Imran',
  patientIC: 'G4500872F',
  patientAllergies: [],
  doctorName: 'Dr Chan Yew Chan',
  doctorSignature: true,
  date: '2025-04-11',
  medications: [
    {
      medicationId: 'med-003b',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '1/52',
    },
    {
      medicationId: 'med-005',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'on',
      duration: '1/52',
      specialInstructions: 'prn',
    },
    {
      medicationId: 'med-006',
      quantity: 10,
      dosageInstruction: '10ml',
      frequency: 'tds',
      duration: '1/52',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

// Rx #3 - Invalid Rx (Patient allergic to medication) - ENHANCED WITH SCENARIO
const rx3: Prescription = {
  id: 'rx-003',
  patientName: 'Mr Tan Ah Beng',
  patientIC: 'S0248566J',
  patientAllergies: ['Paracetamol'],
  doctorName: 'Dr William Tan',
  doctorSignature: true,
  date: '2025-02-02',
  medications: [
    {
      medicationId: 'med-001b',
      quantity: 2,
      dosageInstruction: '2 tabs',
      frequency: 'qds',
      duration: '40 tabs',
      specialInstructions: 'prn',
    },
  ],
  isValid: false,
  invalidReason: 'allergy-conflict',
  scenario: rx3AllergyScenario,
};

// Rx #4 - Invalid Rx (Missing duration for one medication) - ENHANCED WITH SCENARIO
const rx4: Prescription = {
  id: 'rx-004',
  patientName: 'Sivanathan Ramasamy',
  patientIC: 'S8023455I',
  patientAllergies: [],
  doctorName: 'Dr Ang Ah Ang',
  doctorSignature: true,
  date: '2025-11-28',
  medications: [
    {
      medicationId: 'med-007',
      quantity: 2,
      dosageInstruction: '2 puffs',
      frequency: 'tds',
      duration: '2 inhalers',
      specialInstructions: 'prn',
    },
    {
      medicationId: 'med-004',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'tds',
      specialInstructions: 'prn',
      // Missing duration - should be 1/12
    },
  ],
  isValid: false,
  invalidReason: 'incomplete-dosage',
  scenario: rx4IncompleteDurationScenario,
};

// Additional prescriptions for variety
// Rx #5 - Simple valid prescription (for Year 1 Level 1 - Tutorial level, keep simple)
const rx5: Prescription = {
  id: 'rx-005',
  patientName: 'Sarah Tan',
  patientIC: 'S1234567A',
  patientAllergies: [],
  doctorName: 'Dr Lee Ming',
  doctorSignature: true,
  date: '2025-10-20',
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tabs',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
  // No scenario for tutorial level - keep it simple for first-time players
};

const rx6: Prescription = {
  id: 'rx-006',
  patientName: 'John Lim',
  patientIC: 'S9876543B',
  patientAllergies: ['Penicillin'],
  doctorName: 'Dr Wong',
  doctorSignature: false, // Invalid - missing signature
  date: '2025-10-20',
  medications: [
    {
      medicationId: 'med-002',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '7 days',
    },
  ],
  isValid: false,
  invalidReason: 'missing-signature',
  scenario: missingSigScenario,
};

const rx7: Prescription = {
  id: 'rx-007',
  patientName: 'Mary Chen',
  patientIC: 'S5555555C',
  patientAllergies: [],
  doctorName: 'Dr Tan',
  doctorSignature: true,
  date: '2024-08-15', // Invalid - expired date
  medications: [
    {
      medicationId: 'med-008',
      quantity: 1,
      dosageInstruction: '1 cap',
      frequency: 'om',
      duration: '30 days',
    },
  ],
  isValid: false,
  invalidReason: 'expired-date',
  scenario: expiredRxScenario,
};

// Rx #8 - Identity Mismatch Scenario
const rx8: Prescription = {
  id: 'rx-008',
  patientName: 'Mr Tan Ah Beng',
  patientIC: 'S0248576J', // Transposed digits: should be S0248567J
  patientAllergies: [],
  doctorName: 'Dr Lee',
  doctorSignature: true,
  date: '2025-10-22',
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tabs',
      frequency: 'tds',
      duration: '1/52',
      specialInstructions: 'prn',
    },
  ],
  isValid: false,
  invalidReason: 'patient-mismatch',
  scenario: identityMismatchScenario,
  identityMismatch: {
    field: 'ic',
    prescriptionValue: 'S0248576J',
    actualValue: 'S0248567J',
  },
};

// Rx #9 - Signature verification scenario
const rx9: Prescription = {
  id: 'rx-009',
  patientName: 'Sarah Tan',
  patientIC: 'S1234567A',
  patientAllergies: [],
  doctorName: 'Dr Lee Ming',
  doctorSignature: true, // Present but questionably legible
  date: '2025-10-24',
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tabs',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true, // Valid if verified
  scenario: signatureVerificationScenario,
};

// Rx #10 - Allergy conflict with patient saying "no allergies"
const rx10: Prescription = {
  id: 'rx-010',
  patientName: 'David Wong',
  patientIC: 'S3456789D',
  patientAllergies: ['Penicillin'], // System shows allergy
  doctorName: 'Dr Tan',
  doctorSignature: true,
  date: '2025-10-23',
  medications: [
    {
      medicationId: 'med-003b', // Amoxicillin - a penicillin antibiotic
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'tds',
      duration: '1/52',
    },
  ],
  isValid: false,
  invalidReason: 'allergy-conflict',
  scenario: allergyConflictScenario,
};

// Additional Year 1 cases for gameplay variety
// Rx #11 - Year 1 Level 5: Valid prescription with Ibuprofen
const rx11: Prescription = {
  id: 'rx-011',
  patientName: 'Mrs Wong Mei Lin',
  patientIC: 'S2345678E',
  patientAllergies: [],
  doctorName: 'Dr Lim Seng',
  doctorSignature: true,
  date: '2025-11-01',
  medications: [
    {
      medicationId: 'med-002',
      quantity: 2,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

// Rx #12 - Year 1 Level 6: Invalid - expired date
const rx12: Prescription = {
  id: 'rx-012',
  patientName: 'Mr Pillai Ravi',
  patientIC: 'S4567890F',
  patientAllergies: [],
  doctorName: 'Dr Kumar',
  doctorSignature: true,
  date: '2024-11-15', // Expired - more than 1 year old
  medications: [
    {
      medicationId: 'med-005',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '7 days',
    },
  ],
  isValid: false,
  invalidReason: 'expired-date',
};

// Rx #13 - Year 1 Level 7: Valid prescription with GI medication
const rx13: Prescription = {
  id: 'rx-013',
  patientName: 'Mr Gomez Luis',
  patientIC: 'S6789012G',
  patientAllergies: ['Sulfonamides'],
  doctorName: 'Dr Fernandes',
  doctorSignature: true,
  date: '2025-11-10',
  medications: [
    {
      medicationId: 'med-006',
      quantity: 1,
      dosageInstruction: '10ml',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

// Level data combining prescriptions with metadata
export const levels: LevelData[] = [
  // Year 1 Levels - Basic (Progressive difficulty with scenarios)
  {
    id: 'level-1-1',
    year: 1,
    chapterNumber: 1,
    title: 'First Day Fundamentals',
    description: 'Learn the basics - simple valid prescription',
    prescription: rx5, // Simple valid prescription (no scenario - tutorial)
    difficulty: 'basic',
  },
  {
    id: 'level-1-2',
    year: 1,
    chapterNumber: 2,
    title: 'Missing Signature Challenge',
    description: 'What should you do when signature is missing?',
    prescription: rx6, // Missing signature WITH SCENARIO
    difficulty: 'basic',
  },
  {
    id: 'level-1-3',
    year: 1,
    chapterNumber: 3,
    title: 'Expired Prescription Dilemma',
    description: 'Patient says doctor approved it - what do you do?',
    prescription: rx7, // Expired date WITH SCENARIO
    difficulty: 'basic',
  },
  {
    id: 'level-1-4',
    year: 1,
    chapterNumber: 4,
    title: 'Professional Decision Making',
    description: 'IC number doesn\'t match - verify the patient',
    prescription: rx8, // Identity mismatch WITH SCENARIO
    difficulty: 'basic',
  },
  {
    id: 'level-1-5',
    year: 1,
    chapterNumber: 5,
    title: 'Managing Pain Relief',
    description: 'Dispensing pain medication safely',
    prescription: rx11, // Valid Ibuprofen prescription
    difficulty: 'basic',
  },
  {
    id: 'level-1-6',
    year: 1,
    chapterNumber: 6,
    title: 'Date Awareness',
    description: 'Check prescription dates carefully',
    prescription: rx12, // Expired prescription
    difficulty: 'basic',
  },
  {
    id: 'level-1-7',
    year: 1,
    chapterNumber: 7,
    title: 'Digestive Health',
    description: 'Liquid medication for GI treatment',
    prescription: rx13, // Valid GI medication
    difficulty: 'basic',
  },

  // Year 2 Levels - Intermediate (Complex scenarios)
  {
    id: 'level-2-1',
    year: 2,
    chapterNumber: 1,
    title: 'Signature Verification',
    description: 'Unclear signature - is it genuine?',
    prescription: rx9, // Signature verification scenario
    difficulty: 'intermediate',
  },
  {
    id: 'level-2-2',
    year: 2,
    chapterNumber: 2,
    title: 'Missing Duration Crisis',
    description: 'Patient knows the duration but prescription is incomplete',
    prescription: rx4, // Missing duration WITH SCENARIO
    difficulty: 'intermediate',
  },
  {
    id: 'level-2-3',
    year: 2,
    chapterNumber: 3,
    title: 'Multiple Medications',
    description: 'Complex prescription with 3 medications',
    prescription: rx2, // Three medications (no scenario - already complex)
    difficulty: 'intermediate',
  },

  // Year 3 Levels - Advanced
  {
    id: 'level-3-1',
    year: 3,
    chapterNumber: 1,
    title: 'Allergy Conflict',
    description: 'Critical thinking - patient allergic to prescribed medication',
    prescription: rx3, // Patient allergic to paracetamol but prescribed paracetamol
    difficulty: 'advanced',
  },
  {
    id: 'level-3-2',
    year: 3,
    chapterNumber: 2,
    title: 'Complex Multi-Drug Therapy',
    description: 'Manage respiratory and infection treatments',
    prescription: rx2, // Reuse complex prescription
    difficulty: 'advanced',
  },
  {
    id: 'level-3-3',
    year: 3,
    chapterNumber: 3,
    title: 'Identity Verification Challenge',
    description: 'Two patients with the same name - ensure correct identification',
    prescription: rx8, // Identity mismatch
    difficulty: 'advanced',
  },
  {
    id: 'level-3-4',
    year: 3,
    chapterNumber: 4,
    title: 'Conflicting Information',
    description: 'Patient verbal report contradicts system records',
    prescription: rx10, // Allergy conflict scenario
    difficulty: 'advanced',
  },
  {
    id: 'level-3-5',
    year: 3,
    chapterNumber: 5,
    title: 'Signature Verification',
    description: 'Verify authenticity of unclear prescription signature',
    prescription: rx9, // Signature verification
    difficulty: 'advanced',
  },
  {
    id: 'level-3-6',
    year: 3,
    chapterNumber: 6,
    title: 'Correct Allergy Management',
    description: 'Patient has allergy but prescription uses safe alternative',
    prescription: rx1, // Correctly managed allergy (educational example)
    difficulty: 'advanced',
  },
];

// Medical abbreviations dictionary
export const medicalAbbreviations: Record<string, string> = {
  om: 'every morning',
  on: 'every night',
  bd: 'two times a day',
  tds: 'three times a day',
  qds: 'four times a day',
  prn: 'when necessary',
  pc: 'after meals',
  ac: 'before meals',
  stat: 'immediately',
  tab: 'tablet',
  cap: 'capsule',
  ml: 'milliliter',
  mg: 'milligram',
  mcg: 'microgram',
  '1/7': '1 day',
  '1/52': '1 week',
  '1/12': '1 month',
};

// Duration conversion helper
export const convertDuration = (duration: string): string => {
  if (duration.includes('/7')) {
    const days = duration.replace('/7', '');
    return `${days} day${days !== '1' ? 's' : ''}`;
  }
  if (duration.includes('/52')) {
    const weeks = duration.replace('/52', '');
    return `${weeks} week${weeks !== '1' ? 's' : ''}`;
  }
  if (duration.includes('/12')) {
    const months = duration.replace('/12', '');
    return `${months} month${months !== '1' ? 's' : ''}`;
  }
  return duration;
};
