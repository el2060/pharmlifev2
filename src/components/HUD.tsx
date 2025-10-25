import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Star, Home, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { Button } from './Button';

interface HUDProps {
  onBackToHome: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onBackToHome }) => {
  const { currentStage, score, rxPoints, playerLevel } = useGameStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const stageName = {
    receiving: '📥 Receiving',
    typing: '⌨️ Typing',
    picking: '📦 Picking',
    dispensing: '💊 Dispensing',
  }[currentStage];

  const handleHomeClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmHome = () => {
    setShowConfirmModal(false);
    onBackToHome();
  };

  // Calculate health/lives based on score (just visual, max 5 hearts)
  const hearts = Math.min(5, Math.floor(score / 100) + 3);

  return (
    <>
      {/* Pokemon Red Style HUD */}
      <div className="poke-menu p-3 sm:p-4 mb-4 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="container-custom mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-3">
            {/* Top Row: Stage & Home */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleHomeClick}
                className="bg-poke-red text-poke-white px-4 py-3 text-base font-bold flex items-center gap-2 flex-shrink-0 min-h-[56px] border-4 border-poke-black"
                whileTap={{ scale: 0.98 }}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  boxShadow: 'inset -2px -2px 0 0 #C80000, inset 2px 2px 0 0 #FF4444, 4px 4px 0 0 rgba(0,0,0,0.3)'
                }}
              >
                <Home size={16} />
                <span className="hidden xs:inline">HOME</span>
              </motion.button>

              <div
                className="flex-1 poke-textbox px-4 py-3 min-h-[56px] flex items-center"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-poke-black">▶</span>
                  <span className="font-bold text-poke-black text-sm sm:text-base truncate">
                    {stageName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Stats - Pokemon Style */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {/* Score Display */}
              <div
                className="border-2 border-poke-black px-3 py-2 flex flex-col gap-1"
                style={{ fontFamily: "'Press Start 2P', monospace", background: '#FFFFFF' }}
              >
                <div className="flex items-center gap-2">
                  <Star className="text-poke-dark-yellow" size={16} fill="currentColor" />
                  <p className="text-poke-black text-xs leading-tight font-bold">SCORE</p>
                </div>
                <p className="font-bold text-poke-black text-base sm:text-lg leading-tight">{score}</p>
              </div>

              {/* Rx Points Display */}
              <div
                className="border-2 border-poke-black px-3 py-2 flex flex-col gap-1"
                style={{ fontFamily: "'Press Start 2P', monospace", background: '#FFFFFF' }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="text-poke-blue" size={16} fill="currentColor" />
                  <p className="text-poke-black text-xs leading-tight font-bold">Rx</p>
                </div>
                <p className="font-bold text-poke-black text-base sm:text-lg leading-tight">{rxPoints}</p>
              </div>

              {/* Hearts Display */}
              <div className="border-2 border-poke-black px-3 py-2 flex items-center justify-center" style={{ background: '#FFFFFF' }}>
                <div className="flex gap-1">
                  {[...Array(Math.min(3, hearts))].map((_, i) => (
                    <Heart
                      key={i}
                      size={16}
                      className="text-poke-red"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              {/* Player Level */}
              <div
                className="border-2 border-poke-black px-2 py-2 flex flex-col justify-center"
                style={{ fontFamily: "'Press Start 2P', monospace", background: '#FFFFFF' }}
              >
                <p className="text-poke-black text-[8px] sm:text-xs leading-tight font-bold text-center mb-1">RANK</p>
                <p className="font-bold text-poke-black text-[8px] sm:text-[10px] leading-tight text-center break-words">
                  {playerLevel.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Return to Main Menu?"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Your current progress will be lost. Are you sure you want to return to the main menu?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleConfirmHome}
              fullWidth
            >
              Yes, Go Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
