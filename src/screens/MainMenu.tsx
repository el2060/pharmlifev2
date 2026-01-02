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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}>

      <motion.div
        className="w-full max-w-6xl xl:max-w-7xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Game Title Screen */}
        <div className="poke-menu p-6 sm:p-8 lg:p-10 mb-6 lg:mb-8" style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)' }}>
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
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none'
              }}
            >
              PHARM LIFE
            </h1>

            <p
              className="text-base sm:text-lg text-poke-text mb-6 font-medium"
            >
              Prescription Quest
            </p>

            {/* Blinking arrow */}
            <motion.p
              className="text-sm sm:text-base font-semibold text-gray-700 pixel-blink"
            >
              ▼ PRESS START ▼
            </motion.p>
          </div>

          {/* Pokemon-style Menu Options + Stats in wide grid */}
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                className="w-full text-base sm:text-lg flex items-center justify-between px-6 py-4 font-semibold rounded-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: '2px solid rgba(217, 119, 6, 0.3)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-3">
                  <HelpCircle size={20} />
                  <span>HOW TO PLAY</span>
                </span>
                <span>▶</span>
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

            {/* Player Stats - Modern Style */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="px-4 py-3 h-full font-medium rounded-xl border transition-all hover:shadow-lg"
                  style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">PLAYER</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 text-lg font-bold">{playerLevel}</p>
                    <Award className="text-amber-500" size={24} fill="currentColor" />
                  </div>
                </div>

                <div
                  className="px-4 py-3 h-full font-medium rounded-xl border transition-all hover:shadow-lg"
                  style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Rx POINTS</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 text-lg font-bold">{rxPoints}</p>
                    <Star className="text-amber-500" size={24} fill="currentColor" />
                  </div>
                </div>
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

          <div className="font-medium">
            <p className="text-gray-700 text-xs sm:text-sm font-bold">
              © 2026 PHARMLIFE
            </p>
            <p className="text-gray-600 text-[10px] sm:text-xs leading-relaxed mt-2">
              Gamified Learning for Dip Pharm Sci, LSCT, NP
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
        <div className="space-y-2 sm:space-y-3 font-medium">
          {/* Game Flow */}
          <div className="bg-blue-50 border-4 border-blue-500 p-3 sm:p-5 rounded">
            <p className="font-bold text-blue-900 mb-2 text-[10px] sm:text-base">
              🎮 GAME FLOW
            </p>
            <p className="text-[10px] sm:text-sm leading-relaxed text-blue-900">
              <strong>4 Stages per Level:</strong><br />
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
              From <strong>Level 1-2 onwards</strong>, you'll face real scenarios requiring professional judgment.<br />
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
              <p>🟢 0-99: <strong>Pharmacy Intern</strong></p>
              <p>🔵 100-299: <strong>Junior Pharmacy Technician</strong></p>
              <p>🟣 300-599: <strong>Pharmacy Technician</strong></p>
              <p>🟠 600-999: <strong>Senior Pharmacy Technician</strong></p>
              <p>🔴 1000+: <strong>Chief Pharmacy Technician</strong></p>
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
