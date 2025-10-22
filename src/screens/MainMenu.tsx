import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Award, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface MainMenuProps {
  onStartGame: () => void;
  onShowAbout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowAbout }) => {
  const { rxPoints, playerLevel } = useGameStore();

  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-4 sm:p-6 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Pokemon-style pixelated border effect */}
      <div className="absolute inset-0 pointer-events-none border-8 border-poke-black" />

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Pokemon Red Title Screen */}
        <div className="poke-menu p-6 sm:p-8 mb-4" style={{ background: '#FFFFFF' }}>
          {/* Title */}
          <div className="text-center mb-8">
            <motion.div
              className="mb-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-7xl sm:text-8xl mb-4">🏥</div>
            </motion.div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-poke-red"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                textShadow: '4px 4px 0 rgba(0,0,0,0.25)',
                lineHeight: '1.5'
              }}
            >
              PHARM LIFE
            </h1>

            <p
              className="text-base sm:text-lg text-poke-text mb-6"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Prescription Quest
            </p>

            {/* Blinking arrow */}
            <motion.p
              className="text-sm sm:text-base text-poke-black pixel-blink"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ▼ PRESS START ▼
            </motion.p>
          </div>

          {/* Pokemon-style Menu Options */}
          <div className="space-y-4 mb-6">
            <motion.button
              onClick={onStartGame}
              className="w-full btn-primary text-base sm:text-lg flex items-center justify-between px-6 py-4"
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-3">
                <span className="text-poke-white">▶</span>
                <span>START GAME</span>
              </span>
              <Play size={20} />
            </motion.button>

            <motion.button
              onClick={onShowAbout}
              className="w-full btn-secondary text-base sm:text-lg flex items-center justify-between px-6 py-4"
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-3">
                <span className="text-poke-white">▶</span>
                <span>ABOUT</span>
              </span>
              <Info size={20} />
            </motion.button>
          </div>

          {/* Player Stats - Pokemon Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="border-2 border-poke-black px-4 py-3"
              style={{ fontFamily: "'Press Start 2P', monospace", background: '#FFFFFF' }}
            >
              <p className="text-poke-black text-xs mb-2">PLAYER</p>
              <div className="flex items-center justify-between">
                <p className="text-poke-black text-lg font-bold">{playerLevel}</p>
                <Award className="text-poke-dark-yellow" size={24} fill="currentColor" />
              </div>
            </div>

            <div
              className="border-2 border-poke-black px-4 py-3"
              style={{ fontFamily: "'Press Start 2P', monospace", background: '#FFFFFF' }}
            >
              <p className="text-poke-black text-xs mb-2">Rx POINTS</p>
              <div className="flex items-center justify-between">
                <p className="text-poke-black text-lg font-bold">{rxPoints}</p>
                <Star className="text-poke-dark-yellow" size={24} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 mt-8 sm:mt-10">
          {/* NP Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="https://www.np.edu.sg/images/default-source/default-album/img-logo.png?sfvrsn=764583a6_19"
              alt="Nanyang Polytechnic Logo"
              className="h-12 sm:h-16 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          <div style={{ fontFamily: "'Press Start 2P', monospace" }}>
            <p className="text-poke-black text-xs sm:text-sm font-bold">
              © 2025 PHARMLIFE
            </p>
            <p className="text-poke-black text-[10px] sm:text-xs leading-relaxed mt-2">
              Gamified Learning for Dip Pharm Sci, LSCT, NP
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
