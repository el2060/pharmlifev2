export type YearLevel = 1 | 2 | 3;

export type GameStage = 'receiving' | 'typing' | 'picking' | 'dispensing';

export type DosageForm = 'tablet' | 'capsule' | 'liquid' | 'syrup' | 'topical' | 'inhaler' | 'injection';

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
  | 'missing-date'
  | 'allergy-conflict'
  | 'drug-interaction';

export type PharmacistAction =
  | 'accept-rx'
  | 'call-doctor'
  | 'refuse-rx'
  | 'ask-patient'
  | 'check-references';

export interface ScenarioDecision {
  id: string;
  situation: string;
  question: string;
  options: DecisionOption[];
  correctAction: string;
  consequences: {
    [key: string]: ConsequenceResult;
  };
}

export interface DecisionOption {
  id: string;
  text: string;
  action: PharmacistAction;
}

export interface ConsequenceResult {
  outcome: string;
  patientReaction: string;
  scoreImpact: number;
  rxPointsImpact: number;
  isCorrect: boolean;
  explanation: string;
  shouldSkipRemainingStages?: boolean;
}

export interface PatientDialogue {
  id: string;
  text: string;
  mood?: 'happy' | 'neutral' | 'angry' | 'confused' | 'worried';
  triggerCondition?: string;
}

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
  patientAddress?: string;
  patientDOB?: string;
  patientAllergies: string[];
  doctorName: string;
  doctorMCR?: string;
  doctorSignature: boolean;
  clinicAddress?: string;
  date: string;
  medications: PrescriptionItem[];
  isValid: boolean;
  invalidReason?: InvalidReason;
  scenario?: ScenarioDecision;
  patientDialogues?: PatientDialogue[];
  identityMismatch?: {
    field: 'name' | 'ic';
    prescriptionValue: string;
    actualValue: string;
  };
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
  allergyConflictDetected: boolean;
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
