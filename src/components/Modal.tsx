import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Pokemon-style Modal Dialog Box */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'tween', duration: 0.15 }}
          >
            <div className="poke-textbox max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 bg-poke-red text-poke-white border-2 border-poke-black hover:bg-poke-dark-red transition-colors"
                  aria-label="Close modal"
                  style={{
                    boxShadow: 'inset -1px -1px 0 0 #880000, inset 1px 1px 0 0 #FF4444'
                  }}
                >
                  <X size={16} />
                </button>
              )}

              {title && (
                <h2
                  className="text-lg sm:text-xl font-bold mb-4 pr-12 text-poke-black"
                  
                >
                  {title}
                </h2>
              )}

              <div
                className="text-poke-black"
                
              >
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
