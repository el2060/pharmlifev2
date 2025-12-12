import { Medication } from '../types/game.types';

export const medications: Medication[] = [
  // Analgesics and anti-inflammatory
  {
    id: 'med-001',
    genericName: 'Paracetamol',
    brandName: 'Panadol',
    strength: '500mg',
    dosageForm: 'tablet',
    category: 'analgesic',
    drugClass: 'Analgesic/Antipyretic',
    mechanismOfAction: 'Inhibits prostaglandin synthesis in the CNS',
    commonUses: ['Pain relief', 'Fever reduction'],
    sideEffects: ['Rare: liver damage with overdose', 'Allergic reactions'],
    counselingPoints: [
      'This is for your pain and fever',
      'Take this only when necessary',
      'Do not exceed recommended dose',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for your pain and fever',
        alternatives: ['This is for diabetes', 'This is for your infection', 'This is for diarrhoea']
      },
      {
        question: 'When should you take this medication?',
        correctAnswer: 'Take this only when necessary',
        alternatives: ['Complete the course', '', '']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature, away from moisture',
    warnings: ['Do not use if allergic to paracetamol', 'Avoid alcohol while taking this medication'],
  },
  {
    id: 'med-001b',
    genericName: 'Paracetamol',
    strength: '500mg',
    dosageForm: 'tablet',
    category: 'analgesic',
    drugClass: 'Analgesic/Antipyretic',
    mechanismOfAction: 'Inhibits prostaglandin synthesis in the CNS',
    commonUses: ['Pain relief', 'Fever reduction'],
    sideEffects: ['Rare: liver damage with overdose', 'Allergic reactions'],
    counselingPoints: [
      'This is for your pain and fever',
      'Take this only when necessary',
      'Do not exceed 4000mg per day',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for your pain and fever',
        alternatives: ['This is for diabetes', 'This is for your infection', 'This is for diarrhoea']
      },
      {
        question: 'When should you take this medication?',
        correctAnswer: 'Take this only when necessary',
        alternatives: ['Complete the course', '', '']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature, away from moisture',
    warnings: ['Do not use if allergic to paracetamol', 'Avoid alcohol while taking this medication'],
  },
  {
    id: 'med-002',
    genericName: 'Ibuprofen',
    brandName: 'Nurofen',
    strength: '200mg',
    dosageForm: 'tablet',
    category: 'analgesic',
    drugClass: 'NSAID (Non-Steroidal Anti-Inflammatory Drug)',
    mechanismOfAction: 'Inhibits COX enzymes, reducing prostaglandin production',
    commonUses: ['Pain relief', 'Inflammation reduction', 'Fever reduction'],
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
    counselingPoints: [
      'This is for your pain and fever',
      'Take this only when necessary',
      'Take with food to reduce stomach upset',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for your pain and fever',
        alternatives: ['This is for diabetes', 'This is for your infection', 'This is for diarrhoea']
      },
      {
        question: 'When should you take this medication?',
        correctAnswer: 'Take this only when necessary',
        alternatives: ['Complete the course', '', '']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Not suitable during pregnancy (third trimester)', 'Avoid with blood thinners'],
  },

  // Anti-infectives
  {
    id: 'med-003',
    genericName: 'Amoxicillin',
    brandName: 'Amoxil',
    strength: '250mg',
    dosageForm: 'tablet',
    category: 'antimicrobial',
    drugClass: 'Penicillin Antibiotic',
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis',
    commonUses: ['Bacterial infections', 'Respiratory tract infections', 'Urinary tract infections'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reactions'],
    counselingPoints: [
      'This is for your infection',
      'Complete the course',
      'Take with or without food',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for your infection',
        alternatives: ['This is for diabetes', 'This is for giddiness', '']
      },
      {
        question: 'How should you take this medication?',
        correctAnswer: 'Complete the course',
        alternatives: ['This can cause drowsiness', 'This can cause red eyes', 'This can cause hearing loss']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Inform doctor if allergic to penicillin', 'This can cause drowsiness'],
  },
  {
    id: 'med-003b',
    genericName: 'Amoxicillin',
    strength: '500mg',
    dosageForm: 'tablet',
    category: 'antimicrobial',
    drugClass: 'Penicillin Antibiotic',
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis',
    commonUses: ['Bacterial infections', 'Respiratory tract infections'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
    counselingPoints: [
      'This is for your infection',
      'Complete the course',
      'Do not stop even if feeling better',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for your infection',
        alternatives: ['This is for diabetes', 'This is for giddiness', '']
      },
      {
        question: 'How should you take this medication?',
        correctAnswer: 'Complete the course',
        alternatives: ['This can cause drowsiness', 'This can cause red eyes', 'This can cause hearing loss']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Report any rash immediately', 'This can cause drowsiness'],
  },

  // Gastrointestinal drugs
  {
    id: 'med-004',
    genericName: 'Antacid',
    brandName: 'Gaviscon',
    strength: '',
    dosageForm: 'tablet',
    category: 'gastrointestinal',
    drugClass: 'Antacid',
    mechanismOfAction: 'Neutralizes stomach acid',
    commonUses: ['Heartburn', 'Indigestion', 'Acid reflux'],
    sideEffects: ['Constipation', 'Diarrhea', 'Chalky taste'],
    counselingPoints: [
      'This is to protect your stomach',
      'Chew the tablet before swallowing',
      'Take after meals or when symptoms occur',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is to protect your stomach',
        alternatives: ['This is for your constipation', 'This is for diarrhoea', 'This is for cough']
      },
      {
        question: 'How should you take this medication?',
        correctAnswer: 'Chew the tablet before swallowing',
        alternatives: ['This may cause drowsiness', 'This is a non-drowsy tablet', 'This is for the pain']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Do not take continuously for more than 2 weeks without consulting doctor'],
  },

  // Respiratory drugs
  {
    id: 'med-005',
    genericName: 'Chlorpheniramine',
    strength: '4mg',
    dosageForm: 'tablet',
    category: 'respiratory',
    drugClass: 'Antihistamine',
    mechanismOfAction: 'H1 receptor antagonist, blocks histamine effects',
    commonUses: ['Allergic rhinitis', 'Runny nose', 'Allergies'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    counselingPoints: [
      'This is for runny nose',
      'This may cause drowsiness. Do not drive.',
      'Take only when necessary',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for runny nose',
        alternatives: ['This is for your blocked nose', 'This is to reduce inflammation in your sinus', 'This is to help you sleep']
      },
      {
        question: 'What are the precautions for this medication?',
        correctAnswer: 'This may cause drowsiness. Do not drive.',
        alternatives: ['This is a non-drowsy tablet', 'This is for the pain', 'Do not take continuously for more than 5 days in a row']
      }
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Avoid alcohol as it may increase drowsiness', 'Do not take continuously for more than 5 days in a row'],
  },
  {
    id: 'med-006',
    genericName: 'Dextromethorphan',
    strength: '15mg/5ml',
    dosageForm: 'syrup',
    category: 'respiratory',
    drugClass: 'Cough Suppressant',
    mechanismOfAction: 'Acts on the cough center in the brain',
    commonUses: ['Dry cough', 'Cough suppression'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
    counselingPoints: [
      'This is for cough',
      'Use when necessary',
      'Shake well before use',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is for cough',
        alternatives: ['This is for runny nose', 'This is for pain', 'This is for constipation']
      },
      {
        question: 'When should you take this medication?',
        correctAnswer: 'Use when necessary',
        alternatives: ['This may cause sleep loss', 'Complete the course of this medication', '']
      }
    ],
    packingUnit: 'btl',
    storage: 'Store at room temperature',
    warnings: ['Do not exceed recommended dose', 'Avoid with other cough medications'],
  },
  {
    id: 'med-007',
    genericName: 'Salbutamol',
    brandName: 'Ventolin',
    strength: '100mcg',
    dosageForm: 'inhaler',
    category: 'respiratory',
    drugClass: 'Short-acting Beta-2 Agonist',
    mechanismOfAction: 'Relaxes bronchial smooth muscle via beta-2 receptors',
    commonUses: ['Asthma', 'Bronchospasm', 'COPD'],
    sideEffects: ['Tremor', 'Increased heart rate', 'Headache'],
    counselingPoints: [
      'This is to open your airways',
      'Use when necessary',
      'Shake the canister before inhaling',
    ],
    counselingQuestions: [
      {
        question: 'What is this medication for?',
        correctAnswer: 'This is to open your airways',
        alternatives: ['This is to reduce inflammation in your airways', 'Rinse your mouth after using', 'Do not use a spacer with this']
      },
      {
        question: 'When should you take this medication?',
        correctAnswer: 'Use when necessary',
        alternatives: ['Do not shake the canister before inhaling', 'Use regularly', '']
      }
    ],
    packingUnit: 'pc',
    storage: 'Store at room temperature, do not puncture or burn',
    warnings: ['If needing more than usual, consult doctor immediately'],
  },

  // Additional medications
  {
    id: 'med-008',
    genericName: 'Omeprazole',
    brandName: 'Losec',
    strength: '20mg',
    dosageForm: 'capsule',
    category: 'gastrointestinal',
    drugClass: 'Proton Pump Inhibitor (PPI)',
    mechanismOfAction: 'Blocks the H+/K+ ATPase pump in gastric parietal cells',
    commonUses: ['Gastric ulcers', 'GERD', 'Acid reflux'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
    counselingPoints: [
      'Take before breakfast for best effect',
      'Swallow whole, do not crush or chew',
      'May take 1-4 days to feel full effect',
    ],
    packingUnit: 'cap',
    storage: 'Store in original container, protected from moisture',
    warnings: ['Long-term use may affect bone density'],
  },
  {
    id: 'med-009',
    genericName: 'Cetirizine',
    brandName: 'Zyrtec',
    strength: '10mg',
    dosageForm: 'tablet',
    category: 'respiratory',
    drugClass: 'Antihistamine',
    mechanismOfAction: 'H1 receptor antagonist, blocks histamine effects',
    commonUses: ['Allergic rhinitis', 'Urticaria', 'Allergies'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    counselingPoints: [
      'May cause drowsiness',
      'Take once daily',
      'Can be taken with or without food',
    ],
    packingUnit: 'tab',
    storage: 'Store at room temperature',
    warnings: ['Avoid alcohol as it may increase drowsiness'],
  },
];

export const getMedicationById = (id: string): Medication | undefined => {
  return medications.find((med) => med.id === id);
};

export const getMedicationsByCategory = (category: string): Medication[] => {
  return medications.filter((med) => med.category === category);
};
