import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Award, Star, HelpCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

interface MainMenuProps {
  onStartGame: () => void;
  onShowAbout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowAbout }) => {
  const { rxPoints, playerLevel } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
              onClick={() => setShowHowToPlay(true)}
              className="w-full border-4 border-poke-black text-base sm:text-lg flex items-center justify-between px-6 py-4 text-poke-white"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: '#FFB100',
                boxShadow: 'inset -2px -2px 0 0 #C88800, inset 2px 2px 0 0 #FFD700, 4px 4px 0 0 rgba(0,0,0,0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-3">
                <span>▶</span>
                <span>HOW TO PLAY</span>
              </span>
              <HelpCircle size={20} />
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
            <p className="text-poke-black text-[9px] sm:text-xs leading-relaxed mt-3 opacity-75">
              Last Updated: December 12, 2025
            </p>
          </div>
        </div>
      </motion.div>

      {/* How to Play Modal */}
      <Modal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        title="📖 HOW TO PLAY"
      >
        <div className="space-y-2 sm:space-y-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {/* Game Flow */}
          <div className="bg-blue-50 border-4 border-blue-500 p-3 sm:p-5 rounded">
            <p className="font-bold text-blue-900 mb-2 text-[10px] sm:text-base">
              🎮 GAME FLOW
            </p>
            <p className="text-[10px] sm:text-sm leading-relaxed text-blue-900">
              <strong>4 Stages per Level:</strong><br/>
              📥 Receiving → ⌨️ Typing → 📦 Picking → 💊 Dispensing
            </p>
          </div>

          {/* Stages Explained */}
          <div className="space-y-2 sm:space-y-3">
            <div className="border-4 border-gray-400 p-3 sm:p-5 rounded" style={{ background: '#FFFFFF', boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)' }}>
              <p className="font-bold text-[10px] sm:text-base mb-1 sm:mb-2">📥 RECEIVING</p>
              <p className="text-[10px] sm:text-sm text-gray-700 leading-relaxed">Verify patient identity, check prescription validity. Make professional decisions!</p>
            </div>
            <div className="border-4 border-gray-400 p-3 sm:p-5 rounded" style={{ background: '#FFFFFF', boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)' }}>
              <p className="font-bold text-[10px] sm:text-base mb-1 sm:mb-2">⌨️ TYPING</p>
              <p className="text-[10px] sm:text-sm text-gray-700 leading-relaxed">Create medication labels. Match dosage, form, and frequency exactly.</p>
            </div>
            <div className="border-4 border-gray-400 p-3 sm:p-5 rounded" style={{ background: '#FFFFFF', boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)' }}>
              <p className="font-bold text-[10px] sm:text-base mb-1 sm:mb-2">📦 PICKING</p>
              <p className="text-[10px] sm:text-sm text-gray-700 leading-relaxed">Select correct medications from pharmacy shelves. Check strength carefully!</p>
            </div>
            <div className="border-4 border-gray-400 p-3 sm:p-5 rounded" style={{ background: '#FFFFFF', boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)' }}>
              <p className="font-bold text-[10px] sm:text-base mb-1 sm:mb-2">💊 DISPENSING</p>
              <p className="text-[10px] sm:text-sm text-gray-700 leading-relaxed">Counsel the patient. Answer questions about medication use and safety.</p>
            </div>
          </div>

          {/* Decision Making */}
          <div className="bg-yellow-50 border-4 border-yellow-500 p-3 sm:p-5 rounded">
            <p className="font-bold text-yellow-900 mb-2 text-[10px] sm:text-base">
              ⚡ INTERACTIVE DECISIONS
            </p>
            <p className="text-[10px] sm:text-sm leading-relaxed text-yellow-900">
              From <strong>Level 1-2 onwards</strong>, you'll face real scenarios requiring professional judgment.<br/>
              <strong>Choose wisely</strong> - wrong decisions have consequences!
            </p>
          </div>

          {/* Scoring */}
          <div className="bg-green-50 border-4 border-green-500 p-3 sm:p-5 rounded">
            <p className="font-bold text-green-900 mb-2 text-[10px] sm:text-base">
              ⭐ SCORING SYSTEM
            </p>
            <div className="text-[10px] sm:text-sm space-y-1 sm:space-y-2 text-green-900 leading-relaxed">
              <p><strong>Score:</strong> Resets each level. Shows your current performance.</p>
              <p><strong>Rx Points:</strong> Never reset! Accumulate to unlock ranks.</p>
              <p className="text-red-700"><strong>⚠️ WARNING:</strong> Bad decisions = NEGATIVE points!</p>
            </div>
          </div>

          {/* Ranks */}
          <div className="border-4 border-purple-500 p-3 sm:p-5 rounded bg-purple-50">
            <p className="font-bold text-purple-900 mb-2 text-[10px] sm:text-base">
              🏆 PLAYER RANKS
            </p>
            <div className="text-[10px] sm:text-sm space-y-1 sm:space-y-2 text-purple-900 leading-relaxed">
              <p>🟢 0-99: <strong>Pharmacy Trainee</strong></p>
              <p>🔵 100-299: <strong>Junior Pharmacist</strong></p>
              <p>🟣 300-599: <strong>Pharmacist</strong></p>
              <p>🟠 600-999: <strong>Senior Pharmacist</strong></p>
              <p>🔴 1000+: <strong>Chief Pharmacist</strong></p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-100 border-4 border-gray-400 p-3 sm:p-5 rounded">
            <p className="font-bold text-gray-900 mb-2 text-[10px] sm:text-base">
              💡 QUICK TIPS
            </p>
            <ul className="text-[10px] sm:text-sm space-y-1 sm:space-y-2 text-gray-800 list-disc list-inside leading-relaxed">
              <li>Always verify TWO identifiers (name + IC)</li>
              <li>Read prescriptions carefully - details matter!</li>
              <li>When in doubt, call the doctor</li>
              <li>Patient safety always comes first</li>
              <li>Learn from wrong answers - read explanations!</li>
            </ul>
          </div>

          <Button onClick={() => setShowHowToPlay(false)} fullWidth variant="primary">
            GOT IT! LET'S PLAY
          </Button>
        </div>
      </Modal>
    </div>
  );
};
