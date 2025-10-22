export type YearLevel = 1 | 2 | 3;

export type GameStage = 'receiving' | 'typing' | 'picking' | 'dispensing';

export type DosageForm = 'tablet' | 'capsule' | 'liquid' | 'topical' | 'inhaler' | 'injection';

export type MedicationCategory =
  | 'analgesic'
  | 'gastrointestinal'
  | 'cardiovascular'
  | 'respiratory'
  | 'antimicrobial'
  | 'endocrine'
  | 'neurological';

export type InvalidReason =
  | 'missing-signature'
  | 'expired-date'
  | 'incomplete-dosage'
  | 'patient-mismatch'
  | 'illegible-handwriting'
  | 'missing-date';

export interface CounselingQuestionSimple {
  question: string;
  correctAnswer: string;
  alternatives: string[];
}

export interface Medication {
  id: string;
  genericName: string;
  brandName?: string;
  strength: string;
  dosageForm: DosageForm;
  category: MedicationCategory;
  drugClass: string;
  mechanismOfAction: string;
  commonUses: string[];
  sideEffects: string[];
  counselingPoints: string[];
  counselingQuestions?: CounselingQuestionSimple[];
  packingUnit?: string;
  storage: string;
  warnings: string[];
}

export interface PrescriptionItem {
  medicationId: string;
  quantity: number;
  dosageInstruction: string;
  frequency: string;
  duration?: string;
  specialInstructions?: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientIC: string;
  patientAllergies: string[];
  doctorName: string;
  doctorSignature: boolean;
  date: string;
  medications: PrescriptionItem[];
  isValid: boolean;
  invalidReason?: InvalidReason;
}

export interface Patient {
  name: string;
  ic: string;
  allergies: string[];
  age: number;
  mood?: 'happy' | 'neutral' | 'angry' | 'confused';
}

export interface CounselingQuestion {
  id: string;
  medicationId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'indication' | 'dosage' | 'side-effects' | 'storage' | 'warnings';
}

export interface GameState {
  currentYear: YearLevel;
  currentStage: GameStage;
  currentLevel: number;
  score: number;
  rxPoints: number;
  playerLevel: string;
  currentPrescription: Prescription | null;
  selectedMedications: string[];
  stageProgress: {
    receiving: boolean;
    typing: boolean;
    picking: boolean;
    dispensing: boolean;
  };
}

export interface LevelData {
  id: string;
  year: YearLevel;
  chapterNumber: number;
  title: string;
  description: string;
  prescription: Prescription;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
