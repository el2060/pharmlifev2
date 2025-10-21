import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Award } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface MainMenuProps {
  onStartGame: () => void;
  onShowAbout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowAbout }) => {
  const { rxPoints, playerLevel } = useGameStore();

  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Animated Pharmacy Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Pills - Hidden on small mobile */}
        <motion.div
          className="absolute top-20 left-10 text-4xl sm:text-6xl opacity-20 hidden sm:block"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          💊
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-3xl sm:text-5xl opacity-20 hidden sm:block"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          💉
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/4 text-5xl sm:text-7xl opacity-15 hidden md:block"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          🏥
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-1/3 text-3xl sm:text-5xl opacity-20 hidden sm:block"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          💊
        </motion.div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Arcade-Style Title Card */}
        <motion.div
          className="text-center mb-6 sm:mb-8 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {/* Pixel art pharmacy icon with glow */}
          <motion.div 
            className="mb-4 sm:mb-6 relative inline-block"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-6xl sm:text-8xl filter drop-shadow-lg relative">
              🏥
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl opacity-50"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏥
              </motion.div>
            </div>
          </motion.div>

          {/* Retro Title with pixel font */}
          <motion.div
            animate={{
              textShadow: [
                '4px 4px 0 rgba(0,0,0,0.3)',
                '6px 6px 0 rgba(0,0,0,0.3)',
                '4px 4px 0 rgba(0,0,0,0.3)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 pixel-title"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#FFD700',
                textShadow: '3px 3px 0 #FF6B00, -2px -2px 0 #333',
                letterSpacing: '2px'
              }}
            >
              PHARM
              <br />
              LIFE
            </h1>
          </motion.div>

          {/* Subtitle with retro VT323 font */}
          <motion.p 
            className="text-lg sm:text-2xl text-white mt-3 sm:mt-4 px-2"
            style={{ fontFamily: "'VT323', monospace" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            &lt; THE PRESCRIPTION QUEST &gt;
          </motion.p>

          {/* Blinking "INSERT COIN" style text */}
          <motion.p
            className="text-xs sm:text-sm text-green-400 mt-3 sm:mt-4 pixel-blink"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            PRESS START
          </motion.p>
        </motion.div>

        {/* Arcade-Style Menu Buttons */}
        <motion.div
          className="space-y-3 sm:space-y-4 mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={onStartGame}
              className="w-full arcade-button bg-gradient-to-r from-green-400 to-green-600 text-white py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden group min-h-[52px]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                transition={{ duration: 0.3 }}
              />
              <Play size={20} className="relative z-10 hidden sm:block" />
              <Play size={16} className="relative z-10 sm:hidden" />
              <span className="relative z-10">START GAME</span>
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={onShowAbout}
              className="w-full arcade-button bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden group min-h-[48px]"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                transition={{ duration: 0.3 }}
              />
              <Info size={16} className="relative z-10 hidden sm:block" />
              <Info size={14} className="relative z-10 sm:hidden" />
              <span className="relative z-10 text-xs sm:text-sm">ABOUT</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Player Stats - Retro Game Style */}
        <motion.div
          className="game-screen p-4 sm:p-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-full" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 relative z-10" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
            <div className="text-center">
              <p className="text-gray-600 uppercase mb-1 text-sm sm:text-base">Player Level</p>
              <motion.p 
                className="font-bold text-2xl sm:text-3xl text-purple-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {playerLevel}
              </motion.p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 bg-yellow-100 px-3 sm:px-4 py-2 rounded-lg border-4 border-yellow-600">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Award className="text-yellow-600" size={24} />
              </motion.div>
              <div className="text-center">
                <p className="text-gray-600 text-xs sm:text-sm uppercase">Rx Points</p>
                <p className="font-bold text-2xl sm:text-3xl text-yellow-700">{rxPoints}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Retro Footer */}
        <motion.div
          className="text-center mt-4 sm:mt-6 space-y-2 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p 
            className="text-white/80 text-xs sm:text-sm"
            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
          >
            &copy; 2025 PHARMLIFE | v1.0
          </p>
          <p 
            className="text-white/60 text-[10px] sm:text-xs"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            PHARMACY LEARNING SIMULATION
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
