import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ReceivingEnhanced } from './ReceivingEnhanced';
import { ReceivingStandard } from './ReceivingStandard';

export const Receiving: React.FC = () => {
  const { currentPrescription } = useGameStore();

  // Guard clause for loading state
  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  // Consistent hook execution by delegating to child components
  // The logic for choosing which component to render is simple
  // and doesn't involve hook calls itself other than useGameStore

  if (currentPrescription.scenario) {
    return <ReceivingEnhanced />;
  }

  return <ReceivingStandard />;
};
