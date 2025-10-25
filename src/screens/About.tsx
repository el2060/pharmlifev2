import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Target, X } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

const stages = [
  {
    title: 'RECEIVING',
    description: 'Validate prescriptions and check patient identity',
    icon: <span className="text-4xl">📋</span>,
  },
  {
    title: 'TYPING',
    description: 'Interpret prescriptions and create labels',
    icon: <span className="text-4xl">🏷️</span>,
  },
  {
    title: 'PICKING',
    description: 'Select correct medications from pharmacy shelves',
    icon: <span className="text-4xl">📦</span>,
  },
  {
    title: 'DISPENSING',
    description: 'Counsel patients on medication use',
    icon: <span className="text-4xl">💊</span>,
  },
];

const learningObjectives = [
  'Validate prescriptions for completeness and accuracy',
  'Identify patient information correctly',
  'Interpret medical abbreviations and terminology',
  'Calculate medication quantities and dosages',
  'Select appropriate medications by strength and form',
  'Provide patient counseling on medication use',
  'Understand drug indications and side effects',
  'Practice professional pharmacy workflow',
];

export const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-4 sm:p-6" style={{ background: '#FFFFFF' }}>
      <motion.div
        className="w-full max-w-4xl poke-menu p-6 sm:p-8 relative"
        style={{ background: '#FFFFFF' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <BookOpen className="text-poke-blue" size={24} />
            <h2
              className="text-sm sm:text-xl font-bold text-poke-black flex-1"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              GAME GUIDE
            </h2>
            <motion.button
              onClick={onBack}
              className="bg-poke-red text-poke-white px-3 py-2 sm:px-4 sm:py-3 border-4 border-poke-black"
              whileTap={{ scale: 0.98 }}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: 'inset -2px -2px 0 0 #C80000, inset 2px 2px 0 0 #FF4444, 4px 4px 0 0 rgba(0,0,0,0.3)'
              }}
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </motion.button>
          </div>
          <p className="text-poke-black text-[10px] sm:text-sm" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Master pharmacy workflow
          </p>
        </div>

        {/* Stages */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              className="border-4 border-poke-black p-3 sm:p-5 relative"
              style={{
                background: '#FFFFFF',
                boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="text-3xl sm:text-5xl flex-shrink-0">
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[10px] sm:text-base font-bold text-poke-black mb-1 sm:mb-2"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {stage.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <span className="text-poke-black text-[8px] sm:text-xs font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      STAGE {index + 1}/4
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-poke-black text-[10px] sm:text-sm leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Learning Objectives */}
        <div
          className="border-4 border-poke-black p-3 sm:p-6 mb-4 sm:mb-6"
          style={{
            background: '#FFFFFF',
            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <Target className="text-poke-dark-yellow w-5 h-5 sm:w-7 sm:h-7" />
            <h3
              className="text-[10px] sm:text-base font-bold text-poke-black"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              LEARNING GOALS
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {learningObjectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-2 sm:gap-3 border-2 border-poke-black p-2 sm:p-3"
                style={{ background: '#FFFFFF' }}
              >
                <CheckCircle className="text-pharm-green flex-shrink-0 mt-0.5 sm:mt-1" size={16} />
                <span className="text-poke-black text-[9px] sm:text-xs leading-relaxed" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {objective}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onBack}
          className="btn-danger w-full text-sm sm:text-lg"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <X size={16} className="sm:w-5 sm:h-5" />
            <span>CLOSE</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
};
