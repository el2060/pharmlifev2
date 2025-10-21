import { create } from 'zustand';
import { GameState, GameStage, YearLevel, Prescription } from '../types/game.types';

interface GameStore extends GameState {
  // Actions
  setYear: (year: YearLevel) => void;
  setStage: (stage: GameStage) => void;
  setPrescription: (prescription: Prescription) => void;
  addScore: (points: number) => void;
  addRxPoints: (points: number) => void;
  completeStage: (stage: GameStage) => void;
  nextStage: () => void;
  resetLevel: () => void;
  addSelectedMedication: (medicationId: string) => void;
  clearSelectedMedications: () => void;
  updatePlayerLevel: () => void;
}

const getPlayerLevel = (rxPoints: number): string => {
  if (rxPoints < 100) return 'Pharmacy Trainee';
  if (rxPoints < 300) return 'Junior Pharmacist';
  if (rxPoints < 600) return 'Pharmacist';
  if (rxPoints < 1000) return 'Senior Pharmacist';
  return 'Chief Pharmacist';
};

const stageOrder: GameStage[] = ['receiving', 'typing', 'picking', 'dispensing'];

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentYear: 1,
  currentStage: 'receiving',
  currentLevel: 1,
  score: 0,
  rxPoints: 0,
  playerLevel: 'Pharmacy Trainee',
  currentPrescription: null,
  selectedMedications: [],
  stageProgress: {
    receiving: false,
    typing: false,
    picking: false,
    dispensing: false,
  },

  // Actions
  setYear: (year) => set({ currentYear: year, currentLevel: 1 }),

  setStage: (stage) => set({ currentStage: stage }),

  setPrescription: (prescription) => set({ currentPrescription: prescription }),

  addScore: (points) => set((state) => ({ score: state.score + points })),

  addRxPoints: (points) => {
    set((state) => {
      const newRxPoints = state.rxPoints + points;
      return {
        rxPoints: newRxPoints,
        playerLevel: getPlayerLevel(newRxPoints),
      };
    });
  },

  completeStage: (stage) =>
    set((state) => ({
      stageProgress: { ...state.stageProgress, [stage]: true },
    })),

  nextStage: () => {
    const currentStage = get().currentStage;
    const currentIndex = stageOrder.indexOf(currentStage);

    if (currentIndex < stageOrder.length - 1) {
      set({ currentStage: stageOrder[currentIndex + 1] });
    } else {
      // All stages complete, move to next level
      set((state) => ({
        currentLevel: state.currentLevel + 1,
        currentStage: 'receiving',
        stageProgress: {
          receiving: false,
          typing: false,
          picking: false,
          dispensing: false,
        },
      }));
    }
  },

  resetLevel: () =>
    set({
      currentStage: 'receiving',
      score: 0,
      selectedMedications: [],
      stageProgress: {
        receiving: false,
        typing: false,
        picking: false,
        dispensing: false,
      },
    }),

  addSelectedMedication: (medicationId) =>
    set((state) => ({
      selectedMedications: [...state.selectedMedications, medicationId],
    })),

  clearSelectedMedications: () => set({ selectedMedications: [] }),

  updatePlayerLevel: () => {
    const rxPoints = get().rxPoints;
    set({ playerLevel: getPlayerLevel(rxPoints) });
  },
}));
