import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import type { YearLevel } from '../types/game.types';

interface YearSelectionProps {
  onSelectYear: (year: YearLevel) => void;
  onBack: () => void;
}

const yearData = [
  {
    year: 1 as YearLevel,
    title: 'YEAR 1',
    subtitle: 'Foundations',
    description: 'Prescription basics & dosage forms',
    color: 'from-green-400 to-cyan-500',
  },
  {
    year: 2 as YearLevel,
    title: 'YEAR 2',
    subtitle: 'Pharmacology',
    description: 'Drug classes & counseling',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    year: 3 as YearLevel,
    title: 'YEAR 3',
    subtitle: 'Advanced',
    description: 'Complex scenarios & customer service',
    color: 'from-purple-400 to-pink-500',
  },
];

export const YearSelection: React.FC<YearSelectionProps> = ({ onSelectYear, onBack }) => {
  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-3 sm:p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GraduationCap className="text-yellow-300" size={32} />
            </motion.div>
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              style={{ 
                fontFamily: "'Press Start 2P', monospace",
                textShadow: '3px 3px 0 rgba(0,0,0,0.3)'
              }}
            >
              SELECT YEAR
            </h2>
          </div>
          <p className="text-white/90 text-sm sm:text-lg" style={{ fontFamily: "'VT323', monospace" }}>
            &gt; Choose your difficulty level &lt;
          </p>
        </motion.div>

        {/* Year Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
          {yearData.map((data, index) => (
            <motion.div
              key={data.year}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onSelectYear(data.year)}
                className="w-full game-screen p-4 sm:p-6 text-left hover:shadow-2xl transition-all group relative overflow-hidden min-h-[200px] sm:min-h-[240px]"
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20"
                  style={{ background: `linear-gradient(135deg, ${data.color.replace('from-', 'rgb(var(--tw-gradient-from))').replace(' to-', ', rgb(var(--tw-gradient-to))')})` }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className={`bg-gradient-to-br ${data.color} rounded-lg p-4 sm:p-6 mb-3 sm:mb-4 relative z-10 border-4 border-white/20`}>
                  <motion.h3 
                    className="text-xl sm:text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {data.title}
                  </motion.h3>
                  <p className="text-white/90 font-semibold text-sm sm:text-base" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
                    {data.subtitle}
                  </p>
                </div>
                
                <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 relative z-10 leading-relaxed" style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
                  {data.description}
                </p>

                <div className="flex items-center justify-between text-xs relative z-10">
                  <span className="text-gray-600 font-semibold" style={{ fontFamily: "'VT323', monospace" }}>DIFFICULTY:</span>
                  <div className="flex gap-1">
                    {[...Array(data.year)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded bg-gradient-to-r ${data.color} shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 + i * 0.1 }}
                      />
                    ))}
                    {[...Array(3 - data.year)].map((_, i) => (
                      <div key={`empty-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-300" />
                    ))}
                  </div>
                </div>

                {/* Pixel corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 z-10" />
                <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 z-10" />
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/30 z-10" />
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/30 z-10" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onBack}
            className="arcade-button bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px]"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            <span>BACK TO MENU</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
