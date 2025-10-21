import { Prescription, LevelData } from '../types/game.types';

// Rx #1 - Valid Rx (Ibuprofen)
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
      medicationId: 'med-002',
      quantity: 1,
      dosageInstruction: '1 tab',
      frequency: 'bd',
      duration: '40 tabs',
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

// Rx #3 - Invalid Rx (Patient allergic to medication)
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
  invalidReason: 'patient-mismatch', // Using this to represent allergy mismatch
};

// Rx #4 - Invalid Rx (Missing duration for one medication)
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
};

// Additional prescriptions for variety
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
};

// Level data combining prescriptions with metadata
export const levels: LevelData[] = [
  // Year 1 Levels - Basic
  {
    id: 'level-1-1',
    year: 1,
    chapterNumber: 1,
    title: 'First Day Fundamentals',
    description: 'Learn the basics of prescription validation',
    prescription: rx5, // Simple valid prescription
    difficulty: 'basic',
  },
  {
    id: 'level-1-2',
    year: 1,
    chapterNumber: 2,
    title: 'Spot the Missing Signature',
    description: 'Identify invalid prescriptions',
    prescription: rx6, // Missing signature
    difficulty: 'basic',
  },
  {
    id: 'level-1-3',
    year: 1,
    chapterNumber: 3,
    title: 'Date Detective',
    description: 'Check prescription dates carefully',
    prescription: rx7, // Expired date
    difficulty: 'basic',
  },
  {
    id: 'level-1-4',
    year: 1,
    chapterNumber: 4,
    title: 'Allergy Alert',
    description: 'Watch out for patient allergies',
    prescription: rx1, // Patient allergic to paracetamol (using ibuprofen correctly)
    difficulty: 'basic',
  },

  // Year 2 Levels - Intermediate
  {
    id: 'level-2-1',
    year: 2,
    chapterNumber: 1,
    title: 'Multiple Medications',
    description: 'Handle prescriptions with multiple drugs',
    prescription: rx2, // Three medications
    difficulty: 'intermediate',
  },
  {
    id: 'level-2-2',
    year: 2,
    chapterNumber: 2,
    title: 'Incomplete Information',
    description: 'Identify missing prescription details',
    prescription: rx4, // Missing duration
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
