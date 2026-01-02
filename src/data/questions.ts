import { CounselingQuestion } from '../types/game.types';

export const counselingQuestions: CounselingQuestion[] = [
  // Paracetamol 250mg
  {
    id: 'q-001',
    medicationId: 'med-001',
    question: 'What is this medication for?',
    options: [
      'This is for your pain and fever',
      'This is for diabetes',
      'This is for your infection',
      'This is for diarrhoea',
    ],
    correctAnswer: 0,
    explanation: 'Paracetamol is used to treat pain and reduce fever.',
    category: 'indication',
  },
  {
    id: 'q-002',
    medicationId: 'med-001',
    question: 'How should the patient take this medication?',
    options: [
      'Take this only when necessary',
      'Complete the course',
      'Take with meals only',
      'Take before bedtime',
    ],
    correctAnswer: 0,
    explanation: 'Paracetamol should be taken only when necessary for pain or fever.',
    category: 'dosage',
  },

  // Paracetamol 500mg
  {
    id: 'q-001b',
    medicationId: 'med-001b',
    question: 'What is this medication for?',
    options: [
      'This is for your pain and fever',
      'This is for diabetes',
      'This is for your infection',
      'This is for diarrhoea',
    ],
    correctAnswer: 0,
    explanation: 'Paracetamol is used to treat pain and reduce fever.',
    category: 'indication',
  },
  {
    id: 'q-002b',
    medicationId: 'med-001b',
    question: 'How should the patient take this medication?',
    options: [
      'Take this only when necessary',
      'Complete the course',
      'Take with high protein food',
      'Avoid all food',
    ],
    correctAnswer: 0,
    explanation: 'Paracetamol should be taken only when necessary for pain or fever.',
    category: 'dosage',
  },

  // Ibuprofen
  {
    id: 'q-003',
    medicationId: 'med-002',
    question: 'What is this medication for?',
    options: [
      'This is for your pain and fever',
      'This is for diabetes',
      'This is for your infection',
      'This is for diarrhoea',
    ],
    correctAnswer: 0,
    explanation: 'Ibuprofen is a pain reliever and fever reducer.',
    category: 'indication',
  },
  {
    id: 'q-004',
    medicationId: 'med-002',
    question: 'How should the patient take this medication?',
    options: [
      'Take this only when necessary',
      'Complete the course',
      'This can cause red eyes',
      'This can cause hearing loss',
    ],
    correctAnswer: 0,
    explanation: 'Ibuprofen should be taken only when necessary for pain or fever.',
    category: 'dosage',
  },

  // Amoxicillin 250mg
  {
    id: 'q-005',
    medicationId: 'med-003',
    question: 'What is this medication for?',
    options: [
      'This is for your infection',
      'This is for diabetes',
      'This is for depression',
      'This is for giddiness',
    ],
    correctAnswer: 0,
    explanation: 'Amoxicillin is an antibiotic used to treat bacterial infections.',
    category: 'indication',
  },
  {
    id: 'q-006',
    medicationId: 'med-003',
    question: 'What is important to tell the patient about this medication?',
    options: [
      'Complete the course',
      'This can cause drowsiness',
      'This can cause red eyes',
      'This can cause hearing loss',
    ],
    correctAnswer: 0,
    explanation: 'It is crucial to complete the full course of antibiotics even if feeling better.',
    category: 'dosage',
  },
  {
    id: 'q-006b',
    medicationId: 'med-003',
    question: 'What side effect should you warn the patient about?',
    options: [
      'This can cause drowsiness',
      'This can cause red eyes',
      'This can cause hearing loss',
      'This causes weight gain',
    ],
    correctAnswer: 0,
    explanation: 'Amoxicillin can cause drowsiness in some patients.',
    category: 'side-effects',
  },

  // Amoxicillin 500mg
  {
    id: 'q-007',
    medicationId: 'med-003b',
    question: 'What is this medication for?',
    options: [
      'This is for your infection',
      'This is for diabetes',
      'This is for depression',
      'This is for giddiness',
    ],
    correctAnswer: 0,
    explanation: 'Amoxicillin is an antibiotic used to treat bacterial infections.',
    category: 'indication',
  },
  {
    id: 'q-008',
    medicationId: 'med-003b',
    question: 'What side effect should you warn the patient about?',
    options: [
      'This can cause drowsiness',
      'This can cause red eyes',
      'This can cause hearing loss',
      'This causes weight gain',
    ],
    correctAnswer: 0,
    explanation: 'Amoxicillin can cause drowsiness in some patients.',
    category: 'side-effects',
  },
  {
    id: 'q-009',
    medicationId: 'med-003b',
    question: 'How should the patient take this antibiotic?',
    options: [
      'Complete the course',
      'Stop when feeling better',
      'Take only when necessary',
      'Skip doses if side effects occur',
    ],
    correctAnswer: 0,
    explanation: 'Always complete the full course of antibiotics to prevent resistance.',
    category: 'dosage',
  },

  // Antacid
  {
    id: 'q-010',
    medicationId: 'med-004',
    question: 'What is this medication for?',
    options: [
      'This is to protect your stomach',
      'This is for your constipation',
      'This is for diarrhoea',
      'This is for cough',
    ],
    correctAnswer: 0,
    explanation: 'Antacids neutralize stomach acid and protect the stomach lining.',
    category: 'indication',
  },
  {
    id: 'q-011',
    medicationId: 'med-004',
    question: 'How should the patient take this medication?',
    options: [
      'Chew the tablet before swallowing',
      'This may cause drowsiness',
      'Complete the course of this medication',
      'Avoid high protein food',
    ],
    correctAnswer: 0,
    explanation: 'Antacid tablets should be chewed thoroughly before swallowing for best effect.',
    category: 'dosage',
  },

  // Chlorpheniramine
  {
    id: 'q-012',
    medicationId: 'med-005',
    question: 'What is this medication for?',
    options: [
      'This is for runny nose',
      'This is for your blocked nose',
      'This is for the inflammation in your sinus',
      'This is to help you sleep',
    ],
    correctAnswer: 0,
    explanation: 'Chlorpheniramine is an antihistamine used to treat runny nose and allergies.',
    category: 'indication',
  },
  {
    id: 'q-013',
    medicationId: 'med-005',
    question: 'What important warning should you give?',
    options: [
      'This may cause drowsiness. Do not drive.',
      'This is a non-drowsy tablet',
      'This is for the pain',
      'Do not take continuously for more than 5 days in a row',
    ],
    correctAnswer: 0,
    explanation: 'Chlorpheniramine can cause drowsiness, so patients should avoid driving or operating machinery.',
    category: 'warnings',
  },
  {
    id: 'q-014',
    medicationId: 'med-005',
    question: 'How long can the patient take this medication continuously?',
    options: [
      'Do not take continuously for more than 5 days in a row',
      'Can take as long as needed',
      'Must take for exactly 7 days',
      'Take for 1 month minimum',
    ],
    correctAnswer: 0,
    explanation: 'Chlorpheniramine should not be taken continuously for more than 5 days without consulting a doctor.',
    category: 'warnings',
  },

  // Dextromethorphan
  {
    id: 'q-015',
    medicationId: 'med-006',
    question: 'What is this medication for?',
    options: [
      'This is for cough',
      'This is for runny nose',
      'This is for pain',
      'This is for constipation',
    ],
    correctAnswer: 0,
    explanation: 'Dextromethorphan is a cough suppressant.',
    category: 'indication',
  },
  {
    id: 'q-016',
    medicationId: 'med-006',
    question: 'How should the patient take this medication?',
    options: [
      'Use when necessary',
      'This may cause sleep loss',
      'Complete the course of this medication',
      'Take with meals only',
    ],
    correctAnswer: 0,
    explanation: 'Dextromethorphan should be used when necessary for cough symptoms.',
    category: 'dosage',
  },

  // Salbutamol
  {
    id: 'q-017',
    medicationId: 'med-007',
    question: 'What is this medication for?',
    options: [
      'This is to open your airways',
      'This is to reduce inflammation in your airways',
      'Rinse your mouth after using',
      'Do not use a spacer with this',
    ],
    correctAnswer: 0,
    explanation: 'Salbutamol is a bronchodilator that opens the airways to make breathing easier.',
    category: 'indication',
  },
  {
    id: 'q-018',
    medicationId: 'med-007',
    question: 'How should the patient use this inhaler?',
    options: [
      'Use when necessary',
      'Do not shake the canister before inhaling',
      'Use regularly',
    ],
    correctAnswer: 0,
    explanation: 'Salbutamol is a reliever inhaler used when necessary for breathing difficulties.',
    category: 'dosage',
  },

  // Omeprazole
  {
    id: 'q-020',
    medicationId: 'med-008',
    question: 'When should this medication be taken?',
    options: [
      'Before breakfast',
      'After dinner',
      'With meals',
      'At bedtime',
    ],
    correctAnswer: 0,
    explanation: 'Omeprazole is best taken before breakfast for optimal acid suppression.',
    category: 'dosage',
  },
  {
    id: 'q-021',
    medicationId: 'med-008',
    question: 'How should the capsule be taken?',
    options: [
      'Swallow whole, do not crush or chew',
      'Chew thoroughly',
      'Dissolve in water',
      'Open capsule and mix with food',
    ],
    correctAnswer: 0,
    explanation: 'Omeprazole capsules contain enteric-coated granules and must be swallowed whole.',
    category: 'dosage',
  },

  // Cetirizine
  {
    id: 'q-022',
    medicationId: 'med-009',
    question: 'What warning should you give about this medication?',
    options: [
      'May cause drowsiness, avoid driving if affected',
      'Always causes severe drowsiness',
      'Never causes drowsiness',
      'Must avoid all activities',
    ],
    correctAnswer: 0,
    explanation: 'Cetirizine may cause drowsiness in some patients, affecting ability to drive.',
    category: 'warnings',
  },
  {
    id: 'q-023',
    medicationId: 'med-009',
    question: 'How often should this medication be taken?',
    options: [
      'Take once daily',
      'Take three times daily',
      'Take only when necessary',
      'Take twice daily',
    ],
    correctAnswer: 0,
    explanation: 'Cetirizine is typically taken once daily for allergy relief.',
    category: 'dosage',
  },
];

export const getQuestionsByMedicationId = (medicationId: string): CounselingQuestion[] => {
  return counselingQuestions.filter((q) => q.medicationId === medicationId);
};
