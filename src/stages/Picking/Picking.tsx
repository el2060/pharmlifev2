import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById, getMedicationsByCategory } from '../../data/medications';
import { Medication } from '../../types/game.types';

const categoryColors: Record<string, string> = {
  analgesic: 'from-red-400 to-pink-400',
  gastrointestinal: 'from-green-400 to-emerald-400',
  cardiovascular: 'from-blue-400 to-cyan-400',
  respiratory: 'from-yellow-400 to-amber-400',
  antimicrobial: 'from-purple-400 to-violet-400',
  endocrine: 'from-orange-400 to-red-400',
  neurological: 'from-indigo-400 to-purple-400',
};

export const Picking: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  const requiredMedIds = currentPrescription.medications.map((m) => m.medicationId);
  const requiredMeds = requiredMedIds.map((id) => getMedicationById(id)!).filter(Boolean);

  // Get all unique categories from required medications
  const categories = [...new Set(requiredMeds.map((m) => m.category))];

  // Get all medications for these categories
  const availableMedicationsByCategory: Record<string, Medication[]> = {};
  categories.forEach((cat) => {
    availableMedicationsByCategory[cat] = getMedicationsByCategory(cat);
  });

  const handleSelectMedication = (medId: string) => {
    if (selectedMedications.includes(medId)) {
      setSelectedMedications(selectedMedications.filter((id) => id !== medId));
    } else {
      setSelectedMedications([...selectedMedications, medId]);
    }
  };

  const handleSubmit = () => {
    // Check if selected medications match required medications
    const correct =
      selectedMedications.length === requiredMedIds.length &&
      requiredMedIds.every((id) => selectedMedications.includes(id));

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      addScore(70);
      addRxPoints(30);
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      nextStage();
    } else {
      setSelectedMedications([]);
      setShowResult(false);
    }
  };

  return (
    <div className="container-custom mx-auto p-3 sm:p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Shopping Cart */}
        <div className="game-screen p-4 sm:p-6 relative">
          <div className="scanline" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <ShoppingCart className="text-cyan-400" size={28} />
              </motion.div>
              <div>
                <h3 
                  className="text-sm sm:text-base font-bold text-white mb-1"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                >
                  PICKING BASKET
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300" style={{ fontFamily: "'VT323', monospace" }}>
                  Selected: {selectedMedications.length} / {requiredMedIds.length}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleSubmit}
              disabled={selectedMedications.length === 0}
              className={`arcade-button ${
                selectedMedications.length === 0
                  ? 'bg-gray-500 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              } text-white py-3 px-4 sm:px-6 flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto`}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
              whileHover={selectedMedications.length > 0 ? { scale: 1.05 } : {}}
              whileTap={selectedMedications.length > 0 ? { scale: 0.95 } : {}}
            >
              <Package size={16} />
              <span>VERIFY</span>
            </motion.button>
          </div>

          {/* Selected Medications Display */}
          {selectedMedications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {selectedMedications.map((medId) => {
                const med = getMedicationById(medId);
                return med ? (
                  <motion.div
                    key={medId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg text-white"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {med.genericName} {med.strength}
                    <button
                      onClick={() => handleSelectMedication(medId)}
                      className="text-white hover:text-red-200 text-lg font-bold leading-none"
                    >
                      ×
                    </button>
                  </motion.div>
                ) : null;
              })}
            </motion.div>
          )}
        </div>

        {/* Prescription Reference */}
        <div className="game-screen p-4 sm:p-6 relative">
          <div className="scanline" />
          <h4 
            className="font-bold mb-3 flex items-center gap-2 text-white"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
          >
            <span className="text-2xl">📋</span>
            PRESCRIPTION
          </h4>
          <div className="space-y-2">
            {currentPrescription.medications.map((medItem, idx) => {
              const med = getMedicationById(medItem.medicationId);
              return med ? (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-3 rounded-lg border-2 border-indigo-500/30 flex flex-col xs:flex-row justify-between gap-2"
                >
                  <span 
                    className="font-bold text-yellow-300 text-xs sm:text-sm"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {med.genericName} {med.strength}
                  </span>
                  <span 
                    className="text-xs text-white/80"
                    style={{ fontFamily: "'VT323', monospace" }}
                  >
                    {medItem.dosageInstruction} {medItem.frequency}
                  </span>
                </motion.div>
              ) : null;
            })}
          </div>
        </div>

        {/* Hints */}
        <Hint
          title="Need help finding medications?"
          hints={[
            "Match the medication name and strength exactly - check the prescription items list above",
            "Shelves are organized by drug category with color coding - analgesics (red), gastrointestinal (green), respiratory (yellow), antimicrobials (purple)",
            "Each medication card shows the generic name, brand name (if available), strength, and dosage form",
            "Make sure you select the correct strength - some medications come in multiple strengths (e.g., 250mg vs 500mg)",
            "Your picking basket shows how many items you've selected vs how many you need - check the counter before submitting"
          ]}
          className="mx-auto max-w-4xl"
        />

        {/* Pharmacy Shelves */}
        <div className="space-y-4 sm:space-y-6">
          <motion.h3 
            className="text-xl sm:text-2xl font-bold text-center text-white"
            style={{ 
              fontFamily: "'Press Start 2P', monospace",
              textShadow: '3px 3px 0 rgba(0,0,0,0.3)'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            PHARMACY SHELVES
          </motion.h3>

          {Object.entries(availableMedicationsByCategory).map(([category, meds], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="relative"
            >
              <div
                className={`rounded-t-lg p-3 sm:p-4 bg-gradient-to-r ${
                  categoryColors[category] || 'from-gray-400 to-gray-500'
                } shadow-lg relative overflow-hidden`}
              >
                {/* Pixel decoration */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-white/40" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-white/40" />
                
                <h4 
                  className="text-white font-bold uppercase tracking-wide flex items-center gap-2 text-sm sm:text-base"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                >
                  <motion.span 
                    className="text-2xl sm:text-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: catIndex * 0.3 }}
                  >
                    {category === 'analgesic' && '💊'}
                    {category === 'gastrointestinal' && '🍃'}
                    {category === 'cardiovascular' && '❤️'}
                    {category === 'respiratory' && '🫁'}
                    {category === 'antimicrobial' && '🦠'}
                    {category === 'endocrine' && '⚡'}
                  </motion.span>
                  {category}
                </h4>
              </div>

              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-b-lg p-3 sm:p-4 shadow-lg border-4 border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {meds.map((med, medIndex) => {
                    const isSelected = selectedMedications.includes(med.id);
                    return (
                      <motion.div
                        key={med.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: catIndex * 0.1 + medIndex * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectMedication(med.id)}
                        className={`cursor-pointer p-3 sm:p-4 rounded-lg border-4 transition-all relative ${
                          isSelected
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-xl'
                            : 'border-gray-300 hover:border-blue-400 bg-white shadow-md'
                        }`}
                      >
                        {/* Medication box visual */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p 
                              className="font-bold text-gray-800 text-xs sm:text-sm mb-1"
                              style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
                            >
                              {med.genericName}
                            </p>
                            {med.brandName && (
                              <p className="text-[10px] sm:text-xs text-gray-500 mb-1" style={{ fontFamily: "'VT323', monospace" }}>
                                ({med.brandName})
                              </p>
                            )}
                            <p className="text-xs sm:text-sm text-gray-700 font-bold" style={{ fontFamily: "'VT323', monospace" }}>
                              {med.strength}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-1" style={{ fontFamily: "'VT323', monospace" }}>
                              {med.dosageForm}
                            </p>
                            <p className="text-[8px] sm:text-xs text-gray-500 mt-2" style={{ fontFamily: "'VT323', monospace" }}>
                              {med.drugClass}
                            </p>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                            </motion.div>
                          )}
                        </div>

                        {/* Pixel corners */}
                        {isSelected && (
                          <>
                            <div className="absolute top-1 left-1 w-2 h-2 bg-green-500" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500" />
                            <div className="absolute bottom-1 left-1 w-2 h-2 bg-green-500" />
                            <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500" />
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Result Modal */}
        <Modal isOpen={showResult} onClose={() => {}} showCloseButton={false}>
          <div className="text-center">
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
                <h3 
                  className="text-xl sm:text-2xl font-bold text-green-600 mb-2"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                >
                  PERFECT PICK!
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base" style={{ fontFamily: "'VT323', monospace" }}>
                  You selected all the correct medications. Well done!
                </p>
                <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'VT323', monospace" }}>
                  +30 Rx Points
                </p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-shake"
                >
                  <XCircle size={48} className="text-red-500" />
                </motion.div>
                <h3 
                  className="text-xl sm:text-2xl font-bold text-red-600 mb-2"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                >
                  INCORRECT
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base" style={{ fontFamily: "'VT323', monospace" }}>
                  Please review the prescription carefully and select the exact medications required.
                </p>
              </>
            )}
            <motion.button
              onClick={handleContinue}
              className={`arcade-button ${
                isCorrect
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700'
              } text-white py-3 px-6 w-full min-h-[48px]`}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCorrect ? 'CONTINUE →' : 'TRY AGAIN'}
            </motion.button>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
