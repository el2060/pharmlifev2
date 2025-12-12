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
    bgColor: 'bg-emerald-500',
    disabled: false,
  },
  {
    year: 2 as YearLevel,
    title: 'YEAR 2',
    subtitle: 'Pharmacology',
    description: 'Coming soon',
    difficulty: 'Locked',
    bgColor: 'bg-slate-400',
    disabled: true,
  },
  {
    year: 3 as YearLevel,
    title: 'YEAR 3',
    subtitle: 'Advanced',
    description: 'Coming soon',
    difficulty: 'Locked',
    bgColor: 'bg-slate-400',
    disabled: true,
  },
];

export const YearSelection: React.FC<YearSelectionProps> = ({ onSelectYear, onBack }) => {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}>
      <motion.div
        className="w-full max-w-6xl xl:max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="poke-menu p-6 mb-6" style={{ background: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)' }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={onBack}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-lg"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <ArrowLeft size={16} />
            </motion.button>
            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 flex-1"
              
            >
              SELECT YEAR
            </h2>
            <GraduationCap className="text-amber-500" size={32} />
          </div>
          <p
            className="text-gray-700 text-sm sm:text-base font-medium"
          >
            Choose your difficulty level
          </p>
        </div>

        {/* Year Cards - Modern Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearData.map((data, index) => (
            <motion.button
              key={data.year}
              onClick={() => !data.disabled && onSelectYear(data.year)}
              disabled={data.disabled}
              className={`p-6 text-left w-full rounded-xl border transition-all ${data.disabled ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
              style={{ background: '#ffffff', borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileTap={data.disabled ? undefined : { scale: 0.98 }}
              whileHover={data.disabled ? undefined : { scale: 1.02, boxShadow: '0 12px 24px rgba(0,0,0,0.12)', borderColor: '#cbd5e1' }}
            >
              {/* Year Badge */}
              <div className={`${data.bgColor} text-white rounded-lg p-4 mb-4 shadow-lg`}
              >
                <h3
                  className="text-lg font-bold mb-1"
                  
                >
                  {data.title}
                </h3>
                <p
                  className="text-sm font-medium opacity-90"
                  
                >
                  {data.subtitle}
                </p>
              </div>

              {/* Description */}
              <p
                className="text-gray-700 text-sm mb-4 leading-relaxed font-medium"
              >
                {data.description}
              </p>

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <span
                  className="text-gray-600 text-xs font-semibold uppercase tracking-wide"
                >
                  DIFFICULTY
                </span>
                <span
                  className="text-amber-500 text-lg font-bold"
                  
                >
                  {data.difficulty}
                </span>
              </div>

              {data.disabled && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Coming soon
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
