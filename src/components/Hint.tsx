import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface HintProps {
  title?: string;
  hints: string[];
  className?: string;
}

export const Hint: React.FC<HintProps> = ({
  title = "Need a hint?",
  hints,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && revealedHints === 0) {
      setRevealedHints(1); // Show first hint when opening
    }
  };

  const handleShowNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints(revealedHints + 1);
    }
  };

  return (
    <div className={`${className}`}>
      <motion.button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-300 rounded-lg transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="text-yellow-600" size={20} />
          <span className="font-semibold text-yellow-800">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-yellow-600" size={20} />
        ) : (
          <ChevronDown className="text-yellow-600" size={20} />
        )}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-yellow-50/50 border-2 border-yellow-200 rounded-lg space-y-3">
              {hints.slice(0, revealedHints).map((hint, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{hint}</p>
                </motion.div>
              ))}

              {revealedHints < hints.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleShowNextHint}
                  className="w-full mt-2 px-4 py-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold rounded-lg transition-colors text-sm"
                >
                  Show Next Hint ({revealedHints}/{hints.length})
                </motion.button>
              )}

              {revealedHints === hints.length && hints.length > 1 && (
                <p className="text-xs text-yellow-700 text-center italic mt-2">
                  All hints revealed! You can do this! 💪
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
