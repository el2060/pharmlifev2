import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ScorePopupProps {
  points: number;
  x?: number;
  y?: number;
  type?: 'score' | 'rx' | 'level';
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ 
  points, 
  x = window.innerWidth / 2, 
  y = window.innerHeight / 2,
  type = 'score' 
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    score: { text: '#FFD700', shadow: '#FF6B00' },
    rx: { text: '#A855F7', shadow: '#6B21A8' },
    level: { text: '#10B981', shadow: '#047857' }
  };

  const icons = {
    score: '★',
    rx: '⚡',
    level: '↑'
  };

  const content = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            y: 0, 
            scale: 0.5, 
            opacity: 0,
            x: x,
            top: y
          }}
          animate={{ 
            y: -80, 
            scale: [0.5, 1.3, 1], 
            opacity: [0, 1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, times: [0, 0.3, 0.5, 1] }}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '28px',
            fontWeight: 'bold',
            color: colors[type].text,
            textShadow: `
              3px 3px 0 ${colors[type].shadow},
              -1px -1px 0 #333,
              1px -1px 0 #333,
              -1px 1px 0 #333,
              1px 1px 0 #333
            `,
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{icons[type]}</span>
          <span>+{points}</span>
          <span>{icons[type]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

// Hook for easy score popup triggering
export const useScorePopup = () => {
  const [popups, setPopups] = useState<Array<{ id: number; points: number; type: 'score' | 'rx' | 'level'; x: number; y: number }>>([]);

  const showScorePopup = (
    points: number, 
    type: 'score' | 'rx' | 'level' = 'score',
    x?: number,
    y?: number
  ) => {
    const id = Date.now();
    const popup = {
      id,
      points,
      type,
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
    };
    
    setPopups(prev => [...prev, popup]);
    
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  };

  const PopupContainer = () => (
    <>
      {popups.map(popup => (
        <ScorePopup
          key={popup.id}
          points={popup.points}
          type={popup.type}
          x={popup.x}
          y={popup.y}
        />
      ))}
    </>
  );

  return { showScorePopup, PopupContainer };
};
