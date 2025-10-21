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
    <div className="min-h-screen retro-bg flex items-center justify-center p-3 sm:p-6">
      <motion.div
        className="w-full max-w-4xl game-screen p-4 sm:p-8 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Scanline effect */}
        <div className="scanline" />

        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <BookOpen className="text-cyan-400" size={36} />
            </motion.div>
            <h2 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
              style={{ 
                fontFamily: "'Press Start 2P', monospace",
                textShadow: '3px 3px 0 rgba(0,0,0,0.3)'
              }}
            >
              GAME GUIDE
            </h2>
          </div>
          <p className="text-white/90 text-sm sm:text-base" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
            &gt; Master the pharmacy workflow &lt;
          </p>
        </motion.div>

        {/* Stages */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-4 sm:p-6 rounded-lg border-4 border-purple-500/30 relative overflow-hidden group hover:border-purple-400/50 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              {/* Pixel corners */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-purple-400/50" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400/50" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-purple-400/50" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-400/50" />

              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  {stage.icon}
                </motion.div>
                <div className="flex-1">
                  <h3 
                    className="text-base sm:text-lg font-bold text-white mb-1"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                  >
                    {stage.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-green-300 text-xs" style={{ fontFamily: "'VT323', monospace" }}>
                      STAGE {index + 1}/4
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed" style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Learning Objectives */}
        <motion.div
          className="bg-gradient-to-br from-cyan-900/50 to-teal-900/50 p-4 sm:p-6 rounded-lg border-4 border-cyan-500/30 mb-6 sm:mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Pixel corners */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-cyan-400/50" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400/50" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-cyan-400/50" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-cyan-400/50" />

          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Target className="text-yellow-300" size={24} />
            <h3 
              className="text-sm sm:text-base font-bold text-white"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
            >
              LEARNING OBJECTIVES
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {learningObjectives.map((objective, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 bg-white/10 p-2 sm:p-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  <CheckCircle className="text-green-300 flex-shrink-0 mt-0.5" size={16} />
                </motion.div>
                <span className="text-white/90 text-xs sm:text-sm" style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
                  {objective}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onBack}
            className="arcade-button bg-gradient-to-r from-red-500 to-red-700 text-white py-3 px-6 flex items-center justify-center gap-2 w-full min-h-[48px]"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={16} />
            <span>CLOSE</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
