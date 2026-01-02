import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, ShoppingCart, Activity } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
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
  const { currentPrescription, allergyConflictDetected, addScore, addRxPoints, nextStage } = useGameStore();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  // Block if allergy conflict was detected in Receiving stage
  if (allergyConflictDetected) {
    return (
      <div className="container-custom mx-auto p-3 sm:p-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-screen p-6 sm:p-8 text-center"
        >
          <XCircle size={80} className="text-poke-red mx-auto mb-4" fill="currentColor" />
          <h2 className="text-2xl sm:text-3xl font-bold text-poke-red mb-4 font-pixel">
            CANNOT PROCEED
          </h2>
          <p className="text-lg font-medium text-white mb-6">
            ⚠️ ALLERGY CONFLICT DETECTED
          </p>
          <div className="bg-red-900 border-4 border-red-600 p-6 rounded mb-6 text-left">
            <p className="text-white text-base font-medium">
              The patient has a documented allergy to one of the prescribed medications.
              You must contact the prescribing doctor to request an alternative medication before proceeding.
            </p>
            <p className="text-yellow-300 font-bold text-base mt-4">
              This is a critical safety issue. Never dispense medications that contradict patient allergies.
            </p>
          </div>
          <p className="text-white text-sm font-medium">
            ← Go back to Receiving stage to handle this properly
          </p>
        </motion.div>
      </div>
    );
  }

  const requiredMedIds = currentPrescription.medications.map((m) => m.medicationId);
  const requiredMeds = requiredMedIds.map((id) => getMedicationById(id)!).filter(Boolean);

  // Get all unique categories from required medications
  const categories = [...new Set(requiredMeds.map((m) => m.category))];

  // Get all medications for these categories
  const availableMedicationsByCategory: Record<string, Medication[]> = {};
  categories.forEach((cat) => {
    availableMedicationsByCategory[cat] = getMedicationsByCategory(cat).sort((a, b) =>
      a.genericName.localeCompare(b.genericName)
    );
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
    <div className="container-custom mx-auto p-4 sm:p-6 lg:p-8 max-w-[1500px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Left Column: Prescription + Instructions */}
          <div className="space-y-4">
            {/* Prescription Reference Card */}
            <Card>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 border-b-2 border-gray-100 pb-2">
                  <Activity className="text-blue-500" size={20} />
                  <h3 className="font-bold text-gray-800">PRESCRIPTION</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                      <p className="font-bold text-gray-900">{currentPrescription.patientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Age/IC</p>
                      <p className="font-bold text-gray-900">{currentPrescription.patientIC}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Medications</p>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-2">
                      {currentPrescription.medications.map((med, idx) => {
                        const medication = getMedicationById(med.medicationId);
                        return (
                          <div key={idx} className="pb-2 border-b border-blue-200 last:border-0 last:pb-0">
                            <p className="font-bold text-blue-900">
                              {medication?.genericName} {medication?.strength ? `(${medication.strength})` : ''}
                            </p>
                            <p className="text-blue-800 text-xs">
                              {med.dosageInstruction} {med.frequency}
                              {med.specialInstructions ? ` ${med.specialInstructions}` : ''}
                              {med.duration ? ` x ${med.duration}` : ''}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {currentPrescription.patientAllergies.length > 0 && (
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                      <p className="text-red-700 text-xs font-bold">
                        ⚠️ Allergies: {currentPrescription.patientAllergies.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick instruction for the stage */}
            <div className="poke-textbox p-4" style={{ background: '#FFFFFF' }}>
              <p className="text-poke-black text-sm sm:text-base font-bold mb-2">
                PICK THE RIGHT MEDICATIONS
              </p>
              <p className="text-poke-black text-xs sm:text-sm font-semibold">
                Browse the shelves, tap the correct items to add them to your basket, then verify once done.
              </p>
            </div>

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
                    <h3 className="text-blue-900 mb-1 pixel-label font-bold">
                      PICKING BASKET
                    </h3>
                    <p className="text-sm sm:text-base text-blue-700 font-medium">
                      {selectedMedications.length === requiredMedIds.length ? (
                        <span className="text-green-600 font-bold">Ready to Verify!</span>
                      ) : (
                        `Selected: ${selectedMedications.length} / ${requiredMedIds.length}`
                      )}
                    </p>
                  </div>
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
            </div>
          </div>

          {/* Right Column: Shelves */}
          <div className="space-y-6">

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
                    className={`rounded-t-lg p-3 sm:p-4 bg-gradient-to-r ${categoryColors[category] || 'from-gray-400 to-gray-500'
                      } shadow-lg relative overflow-hidden`}
                  >
                    {/* Pixel decoration */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white/40" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white/40" />

                    <h4 className="text-white font-bold uppercase tracking-wide flex items-center gap-2 pixel-label text-contrast-shadow">
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

                  <div className="shelf-panel rounded-b-lg p-3 sm:p-4 shadow-lg border-4 border-gray-300">
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
                            className={`cursor-pointer p-3 sm:p-4 rounded-lg border-4 transition-all relative ${isSelected
                              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-xl'
                              : 'border-gray-300 hover:border-blue-400 bg-white shadow-md'
                              }`}
                          >
                            {/* Medication box visual */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                                  {med.genericName}
                                </p>
                                {med.brandName && (
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                                    ({med.brandName})
                                  </p>
                                )}
                                <p className="text-sm sm:text-base text-gray-800 font-bold">
                                  {med.strength}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
                                  {med.dosageForm}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
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
          </div>

          {/* Verify Button moved to bottom for natural scroll */}
          <motion.button
            onClick={handleSubmit}
            disabled={selectedMedications.length === 0}
            className={`w-full arcade-button lg:col-span-2 ${selectedMedications.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              } py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all`}
            whileHover={selectedMedications.length > 0 ? { scale: 1.01 } : {}}
            whileTap={selectedMedications.length > 0 ? { scale: 0.99 } : {}}
          >
            <Package size={20} />
            <span className="tracking-wide">VERIFY SELECTION</span>
          </motion.button>

          {/* Result Modal */}
          <Modal isOpen={showResult} onClose={() => { }} showCloseButton={false}>
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
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
                    PERFECT PICK!
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base font-medium">
                    You selected all the correct medications. Well done!
                  </p>
                  <p className="text-sm text-gray-500 mb-6 font-medium">
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
                  <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
                    INCORRECT
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base font-medium">
                    Please review the prescription carefully and select the exact medications required.
                  </p>
                </>
              )}
              <motion.button
                onClick={handleContinue}
                className={`arcade-button ${isCorrect
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700'
                  } text-white py-3 px-6 w-full min-h-[48px] font-semibold`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCorrect ? 'CONTINUE →' : 'TRY AGAIN'}
              </motion.button>
            </div>
          </Modal>
        </div>
      </motion.div>
    </div>
  );
};
