import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Star, Home, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Retro Game HUD */}
      <div className="game-screen p-2 sm:p-3 mb-3 sm:mb-4 relative overflow-hidden">
        {/* Animated scanline effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <div className="container-custom mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {/* Top Row: Stage & Home */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                onClick={handleHomeClick}
                className="arcade-button bg-red-500 text-white px-2 sm:px-3 py-2 text-[8px] sm:text-xs flex items-center gap-1 sm:gap-2 flex-shrink-0 min-h-[40px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <Home size={12} className="sm:hidden" />
                <Home size={14} className="hidden sm:block" />
                <span className="hidden xs:inline">HOME</span>
              </motion.button>

              <div 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-4 py-2 rounded border-3 sm:border-4 border-purple-900 shadow-lg min-h-[40px] flex items-center"
                style={{ fontFamily: "'VT323', monospace" }}
              >
                <div className="flex items-center gap-2 w-full">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"
                    animate={{ 
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.2, 1] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-bold text-white text-sm sm:text-lg truncate">
                    {stageName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Stats */}
            <div className="flex gap-1.5 sm:gap-2 justify-between items-center">
              {/* Score Display */}
              <motion.div
                className="bg-gradient-to-br from-yellow-400 to-yellow-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded border-3 sm:border-4 border-yellow-700 shadow-lg flex items-center gap-1 sm:gap-2 flex-1"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex-shrink-0"
                >
                  <Star className="text-yellow-900" size={14} fill="currentColor" />
                </motion.div>
                <div style={{ fontFamily: "'Press Start 2P', monospace" }} className="min-w-0">
                  <p className="text-yellow-900 text-[8px] sm:text-xs leading-none">SCORE</p>
                  <p className="font-bold text-white text-xs sm:text-lg leading-none mt-0.5">{score}</p>
                </div>
              </motion.div>

              {/* Rx Points Display */}
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-purple-700 px-2 sm:px-4 py-1.5 sm:py-2 rounded border-3 sm:border-4 border-purple-900 shadow-lg flex items-center gap-1 sm:gap-2 flex-1"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -3, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <Zap className="text-yellow-300" size={14} fill="currentColor" />
                </motion.div>
                <div style={{ fontFamily: "'Press Start 2P', monospace" }} className="min-w-0">
                  <p className="text-purple-200 text-[8px] sm:text-xs leading-none">Rx</p>
                  <p className="font-bold text-white text-xs sm:text-lg leading-none mt-0.5">{rxPoints}</p>
                </div>
              </motion.div>

              {/* Hearts Display */}
              <div className="bg-gradient-to-br from-pink-400 to-red-500 px-2 sm:px-3 py-1.5 sm:py-2 rounded border-3 sm:border-4 border-red-700 shadow-lg hidden xs:block">
                <div className="flex gap-0.5 sm:gap-1">
                  <AnimatePresence>
                    {[...Array(Math.min(3, hearts))].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Heart 
                          size={12} 
                          className="text-white sm:w-4 sm:h-4" 
                          fill="currentColor"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Player Level */}
              <motion.div
                className="bg-gradient-to-br from-green-400 to-green-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded border-3 sm:border-4 border-green-800 shadow-lg text-center min-w-[60px] sm:min-w-[80px]"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(74, 222, 128, 0.5)',
                    '0 0 20px rgba(74, 222, 128, 0.8)',
                    '0 0 10px rgba(74, 222, 128, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p 
                  className="text-green-900 text-[8px] sm:text-xs leading-none"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  LVL
                </p>
                <motion.p 
                  className="font-bold text-white text-lg sm:text-2xl leading-none mt-0.5"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  key={playerLevel}
                  initial={{ scale: 1.5, color: '#FFD700' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  transition={{ duration: 0.5 }}
                >
                  {playerLevel}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Pixel decoration corners */}
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-white/30" />
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-white/30" />
        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-white/30" />
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-white/30" />
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
