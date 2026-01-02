import { Prescription, LevelData, YearLevel } from '../types/game.types';
import {
  rx3AllergyScenario,
  rx4IncompleteDurationScenario,
  allergyConflictScenario,
  expiredRxScenario,
  missingSigScenario,
  identityMismatchScenario,
  signatureVerificationScenario,
} from './scenarios';

// Helper to get a date relative to today (YYYY-MM-DD)
const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Force refresh for HMR


// Rx #1 - Valid Rx (Ibuprofen)
const rx1: Prescription = {
  id: 'rx-001',
  patientName: 'Mr Tan Ah Beng',
  patientIC: 'S0248566J',
  patientAddress: '1, Jalan Toa Payoh, Singapore 123456',
  patientDOB: '12-Jan-67',
  patientAllergies: ['Paracetamol'],
  doctorName: 'Dr William Tan',
  doctorMCR: '1155A',
  doctorSignature: true,
  clinicAddress: 'Ngee Ann Clinic, 5 Bishan Lane, Singapore 159111',
  date: '2021-02-02',
  medications: [
    {
      medicationId: 'med-002', // Ibuprofen
      quantity: 1, // Interpreted as 1 pack/supply
      dosageInstruction: '200mg', // Updated to match image "200mg"
      frequency: 'bd',
      duration: '40 tabs', // "x 40"
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

// Rx #2 - Valid Rx (Multiple medications)
const rx2: Prescription = {
  id: 'rx-002',
  patientName: 'Muhammad Imran',
  patientIC: 'G4500872F',
  patientAddress: '2 Bukit Batok Road, Singapore 338495',
  patientDOB: '29-Mar-73',
  patientAllergies: [],
  doctorName: 'Dr Chan Yew Chan',
  doctorMCR: '1482P',
  doctorSignature: true,
  clinicAddress: 'Chan Clinic, Bukit Batok St 21 S(233233)',
  date: '2021-04-11',
  medications: [
    {
      medicationId: 'med-003b', // Amoxicillin
      quantity: 1,
      dosageInstruction: '500mg',
      frequency: 'bd',
      duration: '1/52',
    },
    {
      medicationId: 'med-005', // Chlorpheniramine
      quantity: 1,
      dosageInstruction: '4mg',
      frequency: 'on',
      duration: '1/52',
      specialInstructions: 'prn',
    },
    {
      medicationId: 'med-006', // Dextromethorphan
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
  patientAddress: '1, Jalan Toa Payoh, Singapore 123456',
  patientDOB: '12-Jan-67',
  patientAllergies: ['Paracetamol'],
  doctorName: 'Dr William Tan',
  doctorMCR: '1155A',
  doctorSignature: true,
  clinicAddress: 'Ngee Ann Clinic, 5 Bishan Lane, Singapore 159111',
  date: '2021-02-02',
  medications: [
    {
      medicationId: 'med-001b', // Paracetamol 500mg
      quantity: 1,
      dosageInstruction: '500mg',
      frequency: 'qds',
      duration: '40 tabs',
      specialInstructions: 'prn',
    },
  ],
  isValid: false,
  invalidReason: 'allergy-conflict',
  scenario: rx3AllergyScenario,
};

// Rx #4 - Missing duration for Antacid
const rx4: Prescription = {
  id: 'rx-004',
  patientName: 'Sivanathan Ramasamy',
  patientIC: 'S8023455I',
  patientAddress: '2 Bedok South Ave 3 S(212733)',
  patientDOB: '19-Feb-80',
  patientAllergies: [],
  doctorName: 'Dr Ang Ah Ang',
  doctorMCR: '1192N',
  doctorSignature: true,
  clinicAddress: 'Grace Clinic, 22 Ryce Ave S(324917)',
  date: '2020-11-28',
  medications: [
    {
      medicationId: 'med-007', // Salbutamol
      quantity: 2,
      dosageInstruction: '2 puffs',
      frequency: 'tds',
      duration: '2 inhalers',
      specialInstructions: 'prn',
    },
    {
      medicationId: 'med-004', // Antacid
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'tds',
      specialInstructions: 'prn',
      // Missing duration - validated against scenario
    },
  ],
  isValid: false,
  invalidReason: 'incomplete-dosage',
  scenario: rx4IncompleteDurationScenario,
};

// Rx #5 - Simple valid prescription (Tutorial)
export const rx5: Prescription = {
  id: 'rx-005',
  patientName: 'Sarah Tan',
  patientIC: 'S1234567A',
  patientAllergies: [],
  doctorName: 'Dr Lee Ming',
  doctorSignature: true,
  date: getRelativeDate(7),
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tablets',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

const rx6: Prescription = {
  id: 'rx-006',
  patientName: 'John Lim',
  patientIC: 'S9876543B',
  patientAllergies: ['Penicillin'],
  doctorName: 'Dr Wong',
  doctorSignature: false, // Invalid - missing signature
  date: getRelativeDate(4),
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
  date: getRelativeDate(200), // Invalid - expired date (> 6 months)
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
  date: getRelativeDate(6),
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tablets',
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
export const rx9: Prescription = {
  id: 'rx-009',
  patientName: 'Sarah Tan',
  patientIC: 'S1234567A',
  patientAllergies: [],
  doctorName: 'Dr Lee Ming',
  doctorSignature: true, // Present but questionably legible
  date: getRelativeDate(1),
  medications: [
    {
      medicationId: 'med-001',
      quantity: 2,
      dosageInstruction: '2 tablets (500mg)',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true, // Valid if verified
  scenario: signatureVerificationScenario,
};

// Rx #10 - Allergy conflict with patient saying "no allergies"
export const rx10: Prescription = {
  id: 'rx-010',
  patientName: 'David Wong',
  patientIC: 'S3456789D',
  patientAllergies: ['Penicillin'], // System shows allergy
  doctorName: 'Dr Tan',
  doctorSignature: true,
  date: getRelativeDate(3),
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

// Rx #11 - Year 1 Level 5: Valid prescription with Ibuprofen
export const rx11: Prescription = {
  id: 'rx-011',
  patientName: 'Mrs Wong Mei Lin',
  patientIC: 'S2345678E',
  patientAllergies: [],
  doctorName: 'Dr Lim Seng',
  doctorSignature: true,
  date: getRelativeDate(14),
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
export const rx12: Prescription = {
  id: 'rx-012',
  patientName: 'Mr Pillai Ravi',
  patientIC: 'S4567890F',
  patientAllergies: [],
  doctorName: 'Dr Kumar',
  doctorSignature: true,
  date: getRelativeDate(370), // Expired - more than 1 year old
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
export const rx13: Prescription = {
  id: 'rx-013',
  patientName: 'Mr Gomez Luis',
  patientIC: 'S6789012G',
  patientAllergies: ['Sulfonamides'],
  doctorName: 'Dr Fernandes',
  doctorSignature: true,
  date: getRelativeDate(8),
  medications: [
    {
      medicationId: 'med-006',
      quantity: 10,
      dosageInstruction: '10ml',
      frequency: 'tds',
      duration: '5 days',
      specialInstructions: 'prn',
    },
  ],
  isValid: true,
};

// Level data combining prescriptions with metadata
const allLevels: LevelData[] = [
  // Year 1 Levels - Basic + The Requested 4 Levels
  {
    id: 'level-1-1',
    year: 1,
    chapterNumber: 1,
    title: 'Standard Prescription',
    description: 'Valid Rx: Ibuprofen for Mr Tan',
    prescription: rx1,
    difficulty: 'basic',
  },
  {
    id: 'level-1-2',
    year: 1,
    chapterNumber: 2,
    title: 'Multiple Items',
    description: 'Valid Rx: 3 Medications for Mr Imran',
    prescription: rx2,
    difficulty: 'intermediate',
  },
  {
    id: 'level-1-3',
    year: 1,
    chapterNumber: 3,
    title: 'Allergy Intervention',
    description: 'Invalid: Paracetamol allergy! Call doctor.',
    prescription: rx3,
    difficulty: 'intermediate',
  },
  {
    id: 'level-1-4',
    year: 1,
    chapterNumber: 4,
    title: 'Missing Information',
    description: 'Invalid: Missing Antacid duration.',
    prescription: rx4,
    difficulty: 'intermediate',
  },
  {
    id: 'level-1-5',
    year: 1,
    chapterNumber: 5,
    title: 'Missing Signature Challenge',
    description: 'What should you do when signature is missing?',
    prescription: rx6,
    difficulty: 'basic',
  },
  {
    id: 'level-1-6',
    year: 1,
    chapterNumber: 6,
    title: 'Expired Prescription Dilemma',
    description: 'Patient says doctor approved it - what do you do?',
    prescription: rx7,
    difficulty: 'basic',
  },
  {
    id: 'level-1-7',
    year: 1,
    chapterNumber: 7,
    title: 'Professional Decision Making',
    description: 'IC number doesn\'t match - verify the patient',
    prescription: rx8,
    difficulty: 'basic',
  },
];

// Active catalog: Year 1
const activeLevels = allLevels.filter(
  (level) => level.year === 1,
);

// Year limits for gameplay selection and wrapping
export const ACTIVE_LEVEL_LIMIT: Record<YearLevel, number> = {
  1: activeLevels.length,
  2: 0,
  3: 0,
};

export const levels: LevelData[] = activeLevels;

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

