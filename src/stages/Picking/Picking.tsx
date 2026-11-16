import { useSceneMoment } from '../../scene/shiftScene';
import React, { useMemo, useRef, useState } from 'react';
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
  const basketHeading = useRef<HTMLHeadingElement>(null);

  const requiredMedIds = currentPrescription?.medications.map((item) => item.medicationId) ?? [];
  const mismatchedMeds = selectedMedications.filter((id) => !requiredMedIds.includes(id));
  const missingCount = requiredMedIds.filter((id) => !selectedMedications.includes(id)).length;
  const availableMedicationsByCategory = useMemo(() => {
    const requiredMeds = currentPrescription?.medications.flatMap(({ medicationId }) => {
      const medication = getMedicationById(medicationId);
      return medication ? [medication] : [];
    }) ?? [];
    const categories = [...new Set(requiredMeds.map(({ category }) => category))];
    const available: Record<string, Medication[]> = {};
    for (const category of categories) {
      available[category] = getMedicationsByCategory(category).sort((a, b) => a.genericName.localeCompare(b.genericName));
    }
    return available;
  }, [currentPrescription]);

  const sceneProducts = useMemo(() => allergyConflictDetected ? [] : Object.values(availableMedicationsByCategory).flat().map((med) => ({
    id: med.id,
    name: med.genericName,
    strength: med.strength,
    selected: selectedMedications.includes(med.id),
  })), [allergyConflictDetected, availableMedicationsByCategory, selectedMedications]);

  function handleSelectMedication(medId: string) {
    setSelectedMedications((items) => items.includes(medId)
      ? items.filter((id) => id !== medId)
      : [...items, medId]);
  }


  useSceneMoment({
    stage: 'picking',
    speaker: 'Pharmacy technician',
    speakerRole: 'staff',
    caption: showResult
      ? isCorrect ? 'The items match the prescription.' : 'Compare the medication names and strengths with the prescription.'
      : 'Check the name and strength on each carton before you put it in the basket.',
    actionLabel: 'Open picking workstation',
    gesture: showResult ? isCorrect ? 'nod' : 'consider' : 'pack',
    products: sceneProducts,
  }, undefined, handleSelectMedication);


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
            Use Restart shift to review the prescription from the beginning.
          </p>
        </motion.div>
      </div>
    );
  }

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
      setShowResult(false);
      requestAnimationFrame(() => basketHeading.current?.focus());
    }
  };

  return (
    <div className="container-custom mx-auto p-4 sm:p-6 lg:p-8 max-w-[1500px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        <header className="label-desk-heading">
          <div>
            <h2>Pick the prescribed medicines</h2>
            <p>Select cartons from the 3D shelves or the list. Match each name and strength, then check your basket.</p>
          </div>
        </header>
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Left Column: Prescription + Instructions */}
          <div className="space-y-4">
            {/* Prescription Reference Card */}
            <Card>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 border-b-2 border-gray-100 pb-2">
                  <Activity className="text-blue-500" size={20} />
                  <h3 className="font-bold text-gray-800">Prescription</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                      <p className="font-bold text-gray-900">{currentPrescription.patientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IC number</p>
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

            {/* Shopping Cart */}
            <div className="picking-tray game-screen p-4 sm:p-6 relative">
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
                    <h3 ref={basketHeading} tabIndex={-1} className="text-blue-900 mb-1 font-bold">
                      Picking basket
                    </h3>
                    <p className="text-sm sm:text-base text-blue-700 font-medium" aria-live="polite">
                      {selectedMedications.length} selected · {requiredMedIds.length} prescribed
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
                          className="tray-item"
                        >
                          {med.genericName} {med.strength}
                          <button
                            onClick={() => handleSelectMedication(medId)}
                            className="tray-remove" aria-label={`Return ${med.genericName} ${med.strength} to the shelf`}
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
                "Each medication carton shows the generic name, brand name (if available), strength, and dosage form",
                "Make sure you select the correct strength - some medications come in multiple strengths (e.g., 250mg vs 500mg)",
                "Your picking basket shows how many items you've selected vs how many you need - check the counter before submitting"
              ]}
              className="mx-auto max-w-4xl"
            />

            {/* Pharmacy Shelves */}
            <div className="space-y-4 sm:space-y-6">
              <motion.h3
                className="text-xl sm:text-2xl font-bold text-left text-emerald-950"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Shelf stock
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
                    className={`shelf-heading rounded-t-lg p-3 sm:p-4 bg-gradient-to-r ${categoryColors[category] || 'from-gray-400 to-gray-500'
                      } shadow-lg relative overflow-hidden`}
                  >
                    <h4>{category}</h4>
                  </div>

                  <div className="shelf-panel rounded-b-lg p-3 sm:p-4 shadow-lg border-4 border-gray-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {meds.map((med, medIndex) => {
                        const isSelected = selectedMedications.includes(med.id);
                        return (
                          <motion.button
                            key={med.id}
                            type="button"
                            aria-pressed={isSelected}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: catIndex * 0.1 + medIndex * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectMedication(med.id)}
                            className="med-carton"
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

                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Verify Button moved to bottom for natural scroll */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedMedications.length === 0}
            className="shift-button w-full justify-center lg:col-span-2"
          >
            <Package size={20} aria-hidden="true" />
            Check basket
          </button>

          <Modal isOpen={showResult} onClose={() => {}} title={isCorrect ? 'Basket checked' : 'Check the basket again'} showCloseButton={false}>
            <div className="space-y-4">
              {isCorrect ? (
                <>
                  <p>All selected medicines match the prescription. The basket is ready for the counselling counter.</p>
                  <p><strong>+30 Rx points</strong></p>
                </>
              ) : (
                <>
                  {mismatchedMeds.length > 0 && (
                    <p>Return {mismatchedMeds.map((id) => getMedicationById(id)?.genericName ?? id).join(', ')} to the shelf. Check the prescription for the correct name and strength.</p>
                  )}
                  {missingCount > 0 && <p>{missingCount} prescribed {missingCount === 1 ? 'item is' : 'items are'} still missing.</p>}
                </>
              )}
              <button type="button" className="shift-button w-full justify-center" onClick={handleContinue}>
                {isCorrect ? 'Go to counselling counter' : 'Edit basket'}
              </button>
            </div>
          </Modal>
        </div>
      </motion.div>
    </div>
  );
};
