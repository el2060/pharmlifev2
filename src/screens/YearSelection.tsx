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
    difficulty: '★☆☆',
    bgColor: 'bg-pharm-green',
  },
  // Year 2 and Year 3 hidden for Open House - coming soon!
  // {
  //   year: 2 as YearLevel,
  //   title: 'YEAR 2',
  //   subtitle: 'Pharmacology',
  //   description: 'Drug classes & counseling',
  //   difficulty: '★★☆',
  //   bgColor: 'bg-poke-blue',
  // },
  // {
  //   year: 3 as YearLevel,
  //   title: 'YEAR 3',
  //   subtitle: 'Advanced',
  //   description: 'Complex scenarios & customer service',
  //   difficulty: '★★★',
  //   bgColor: 'bg-poke-red',
  // },
];

export const YearSelection: React.FC<YearSelectionProps> = ({ onSelectYear, onBack }) => {
  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-4 sm:p-6 lg:p-10" style={{ background: '#FFFFFF' }}>
      <motion.div
        className="w-full max-w-6xl xl:max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="poke-menu p-6 mb-6" style={{ background: '#FFFFFF' }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={onBack}
              className="bg-poke-red text-poke-white px-4 py-3 border-4 border-poke-black text-sm"
              whileTap={{ scale: 0.98 }}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: 'inset -2px -2px 0 0 #C80000, inset 2px 2px 0 0 #FF4444, 4px 4px 0 0 rgba(0,0,0,0.3)'
              }}
            >
              <ArrowLeft size={16} />
            </motion.button>
            <h2
              className="text-xl sm:text-2xl font-bold text-poke-black flex-1"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              SELECT YEAR
            </h2>
            <GraduationCap className="text-poke-dark-yellow" size={32} />
          </div>
          <p
            className="text-poke-black text-sm sm:text-base"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Choose difficulty
          </p>
        </div>

        {/* Year Cards - Pokemon Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearData.map((data, index) => (
            <motion.button
              key={data.year}
              onClick={() => onSelectYear(data.year)}
              className="poke-menu p-6 text-left w-full"
              style={{ background: '#FFFFFF' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Year Badge */}
              <div className={`${data.bgColor} text-poke-white border-4 border-poke-black p-4 mb-4`}
                style={{ boxShadow: 'inset -2px -2px 0 0 rgba(0,0,0,0.3), inset 2px 2px 0 0 rgba(255,255,255,0.3)' }}
              >
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {data.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {data.subtitle}
                </p>
              </div>

              {/* Description */}
              <p
                className="text-poke-black text-sm mb-4 leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {data.description}
              </p>

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <span
                  className="text-poke-black text-xs"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  DIFFICULTY
                </span>
                <span
                  className="text-poke-dark-yellow text-lg font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {data.difficulty}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
