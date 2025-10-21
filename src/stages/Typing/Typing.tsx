import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { medicalAbbreviations } from '../../data/prescriptions';

export const Typing: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore();
  const [currentMedIndex, setCurrentMedIndex] = useState(0);
  const [labelData, setLabelData] = useState({
    quantity: '',
    dosageForm: '',
    frequency: '',
    specialInstructions: '',
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  const currentMed = currentPrescription.medications[currentMedIndex];
  const medication = getMedicationById(currentMed.medicationId);

  if (!medication) {
    return <div>Medication not found</div>;
  }

  const frequencyOptions = [
    { value: 'every morning', abbr: 'om' },
    { value: 'every night', abbr: 'on' },
    { value: 'two times a day', abbr: 'bd' },
    { value: 'three times a day', abbr: 'tds' },
    { value: 'four times a day', abbr: 'qds' },
    { value: 'when necessary', abbr: 'prn' },
  ];

  const dosageFormOptions = ['tablet', 'capsule', 'liquid', 'inhaler', 'topical'];

  // Generate quantity options based on medication type
  const getQuantityOptions = () => {
    const form = medication.dosageForm;
    if (form === 'liquid') {
      // For liquids, allow ml values
      return [5, 10, 15, 20, 25, 30];
    } else if (form === 'inhaler') {
      // For inhalers, allow puff values
      return [1, 2, 3, 4];
    } else {
      // For tablets/capsules, allow standard values
      return [1, 2, 3, 4, 5];
    }
  };

  const handlePrintLabel = () => {
    setIsPrinting(true);

    setTimeout(() => {
      // Validate label
      const correctFreq = frequencyOptions.find(f => f.abbr === currentMed.frequency);
      const isValid =
        labelData.quantity === currentMed.quantity.toString() &&
        labelData.dosageForm === medication.dosageForm &&
        labelData.frequency === correctFreq?.value;

      setIsCorrect(isValid);
      setIsPrinting(false);
      setShowResult(true);

      if (isValid) {
        addScore(60);
        addRxPoints(25);
      }
    }, 1500);
  };

  const handleContinue = () => {
    if (isCorrect) {
      if (currentMedIndex < currentPrescription.medications.length - 1) {
        // More medications to label
        setCurrentMedIndex(currentMedIndex + 1);
        setLabelData({
          quantity: '',
          dosageForm: '',
          frequency: '',
          specialInstructions: '',
        });
        setShowResult(false);
      } else {
        // All medications labeled
        nextStage();
      }
    } else {
      // Retry
      setLabelData({
        quantity: '',
        dosageForm: '',
        frequency: '',
        specialInstructions: '',
      });
      setShowResult(false);
    }
  };

  return (
    <div className="container-custom mx-auto p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 md:space-y-6"
      >
        {/* Progress Indicator */}
        {currentPrescription.medications.length > 1 && (
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <p className="text-xs sm:text-sm text-gray-600 mb-2" style={{ fontFamily: "'VT323', monospace" }}>
              Medication {currentMedIndex + 1} of {currentPrescription.medications.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{
                  width: `${((currentMedIndex + 1) / currentPrescription.medications.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left: Prescription */}
          <Card>
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'VT323', monospace" }}>
              <span className="text-2xl">📋</span>
              Prescription
            </h3>

            <div className="prescription-paper p-3 sm:p-4 rounded-lg space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Medication:</p>
                <p className="font-bold text-base sm:text-lg">{medication.genericName}</p>
                <p className="text-sm sm:text-base text-gray-700">{medication.strength}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs sm:text-sm text-gray-600">Instructions:</p>
                <p className="font-mono text-base sm:text-lg font-bold break-words">
                  {currentMed.dosageInstruction} {currentMed.frequency}
                </p>
                {currentMed.duration && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Duration: {currentMed.duration}</p>
                )}
              </div>

              {currentMed.specialInstructions && (
                <div className="border-t pt-3">
                  <p className="text-xs sm:text-sm text-gray-600">Special Instructions:</p>
                  <p className="text-xs sm:text-sm">{currentMed.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Abbreviation Helper */}
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-2">Quick Reference:</p>
              <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs">
                {Object.entries(medicalAbbreviations)
                  .slice(0, 8)
                  .map(([abbr, meaning]) => (
                    <div key={abbr} className="flex gap-1 items-start">
                      <span className="font-bold flex-shrink-0">{abbr}:</span>
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">{meaning}</span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Right: Label Builder */}
          <Card>
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'VT323', monospace" }}>
              <Printer className="text-purple-500" size={20} />
              Label Builder
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Quantity per dose:
                </label>
                <select
                  value={labelData.quantity}
                  onChange={(e) => setLabelData({ ...labelData, quantity: e.target.value })}
                  className="w-full p-3 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[44px]"
                >
                  <option value="">Select...</option>
                  {getQuantityOptions().map((num) => (
                    <option key={num} value={num}>
                      {num}
                      {medication.dosageForm === 'liquid' ? ' ml' : ''}
                      {medication.dosageForm === 'inhaler' ? ' puff' + (num > 1 ? 's' : '') : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dosage Form */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Dosage form:
                </label>
                <select
                  value={labelData.dosageForm}
                  onChange={(e) => setLabelData({ ...labelData, dosageForm: e.target.value })}
                  className="w-full p-3 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[44px]"
                >
                  <option value="">Select...</option>
                  {dosageFormOptions.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Frequency:
                </label>
                <select
                  value={labelData.frequency}
                  onChange={(e) => setLabelData({ ...labelData, frequency: e.target.value })}
                  className="w-full p-3 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[44px]"
                >
                  <option value="">Select...</option>
                  {frequencyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value} ({opt.abbr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Label Preview */}
              {labelData.quantity && labelData.dosageForm && labelData.frequency && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-dashed border-blue-300 p-3 sm:p-4 rounded-lg"
                >
                  <p className="text-xs text-gray-500 mb-2">Label Preview:</p>
                  <p className="font-bold text-sm sm:text-base">
                    {medication.genericName} {medication.strength}
                  </p>
                  <p className="mt-2 text-sm sm:text-base break-words">
                    Take {labelData.quantity} {labelData.dosageForm}(s) {labelData.frequency}
                  </p>
                  {currentMed.specialInstructions && (
                    <p className="text-xs sm:text-sm mt-1 text-gray-600">{currentMed.specialInstructions}</p>
                  )}
                </motion.div>
              )}

              {/* Hints - Hidden on mobile by default, expandable */}
              <div className="block">
                <Hint
                  title="Need help with the label?"
                  hints={[
                    "Look at the prescription instructions on the left - the abbreviations show the frequency",
                    "Check the 'Quick Reference' guide to translate abbreviations like 'bd', 'tds', 'om', 'on'",
                    "The quantity per dose is the number before 'tab', 'ml', or 'puffs' in the dosage instruction",
                    "The dosage form should match the medication type - tablets for pills, liquid for syrups, inhaler for puffs",
                    "Special instructions like 'prn' (when necessary) will be shown automatically in the label preview"
                  ]}
                />
              </div>

              {/* Print Button - Touch friendly */}
              <motion.button
                onClick={handlePrintLabel}
                disabled={!labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting}
                className={`w-full py-4 px-6 rounded-lg text-sm sm:text-base font-bold flex items-center justify-center gap-2 min-h-[52px] transition-all ${
                  !labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                }`}
                style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}
                whileTap={{ scale: 0.95 }}
              >
                {isPrinting ? (
                  <>
                    <div className="spinner w-5 h-5 border-2" />
                    Printing...
                  </>
                ) : (
                  <>
                    <Printer size={24} />
                    PRINT LABEL
                  </>
                )}
              </motion.button>
            </div>
          </Card>
        </div>

        {/* Result Modal */}
        <Modal isOpen={showResult} onClose={() => {}} showCloseButton={false}>
          <div className="text-center">
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Perfect!</h3>
                <p className="text-gray-600 mb-4">
                  Label created correctly!
                </p>
                <p className="text-sm text-gray-500 mb-6">+25 Rx Points</p>
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
                <h3 className="text-2xl font-bold text-red-600 mb-2">Incorrect Label</h3>
                <p className="text-gray-600 mb-4">
                  Please check the prescription instructions carefully and try again.
                </p>
              </>
            )}
            <Button variant={isCorrect ? 'success' : 'primary'} onClick={handleContinue} fullWidth>
              {isCorrect ? (
                currentMedIndex < currentPrescription.medications.length - 1
                  ? 'Next Medication →'
                  : 'Continue to Picking →'
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
