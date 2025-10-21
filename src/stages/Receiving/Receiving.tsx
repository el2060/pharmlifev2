import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Shield, FileText } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { InvalidReason } from '../../types/game.types';
import { getMedicationById } from '../../data/medications';

const invalidReasonLabels: Record<InvalidReason, string> = {
  'missing-signature': 'Missing doctor signature',
  'expired-date': 'Expired prescription date',
  'incomplete-dosage': 'Incomplete dosage instructions',
  'patient-mismatch': 'Patient details do not match',
  'illegible-handwriting': 'Illegible handwriting',
  'missing-date': 'Missing prescription date',
};

export const Receiving: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore();
  const [step, setStep] = useState<'identity' | 'validation' | 'complete'>('identity');
  const [identityChecked, setIdentityChecked] = useState(false);
  const [allergyChecked, setAllergyChecked] = useState(false);
  const [validationChoice, setValidationChoice] = useState<boolean | null>(null);
  const [selectedReason, setSelectedReason] = useState<InvalidReason | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!currentPrescription) {
    return <div>Loading prescription...</div>;
  }

  const handleIdentityCheck = () => {
    setIdentityChecked(true);
  };

  const handleAllergyCheck = () => {
    setAllergyChecked(true);
  };

  const handleProceedToValidation = () => {
    if (identityChecked && allergyChecked) {
      setStep('validation');
      addScore(10);
    }
  };

  const handleValidationChoice = (choice: boolean) => {
    setValidationChoice(choice);

    if (choice === currentPrescription.isValid) {
      if (currentPrescription.isValid) {
        // Correct: prescription is valid
        setIsCorrect(true);
        addScore(50);
        addRxPoints(20);
        setShowResult(true);
      }
      // If invalid, wait for reason selection
    } else {
      // Wrong choice
      setIsCorrect(false);
      setShowResult(true);
    }
  };

  const handleReasonSubmit = () => {
    if (selectedReason === currentPrescription.invalidReason) {
      setIsCorrect(true);
      addScore(75);
      addRxPoints(30);
    } else {
      setIsCorrect(false);
    }
    setShowResult(true);
  };

  const handleContinue = () => {
    if (isCorrect) {
      nextStage();
    } else {
      // Reset for retry
      setValidationChoice(null);
      setSelectedReason(null);
      setShowResult(false);
    }
  };

  return (
    <div className="container-custom mx-auto p-3 sm:p-4 max-w-4xl">
      {/* Pharmacy Scene Background */}
      <div className="mb-4 sm:mb-6 relative">
        <motion.div
          className="pharmacy-counter rounded-t-xl p-4 sm:p-8 relative overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Pharmacy Counter Scene */}
          <div className="flex justify-between items-end mb-4">
            {/* Pharmacist Character */}
            <motion.div
              className="relative scale-75 sm:scale-100"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="character-pharmacist" />
              <motion.div
                className="speech-bubble mt-2 max-w-[200px] sm:max-w-xs text-[8px] sm:text-[10px] leading-tight sm:leading-normal"
                initial={{ scale: 0, originX: 0, originY: 1 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
              >
                {step === 'identity' && 'Welcome! Let\'s verify your identity first.'}
                {step === 'validation' && 'Now let me check this prescription...'}
                {step === 'complete' && 'All done! Moving to next stage.'}
              </motion.div>
            </motion.div>

            {/* Patient Character */}
            <motion.div
              className="relative scale-75 sm:scale-100"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="character-patient" />
              <motion.div
                className="absolute -top-6 sm:-top-8 right-0 text-2xl sm:text-3xl"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💊
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Pharmacy Elements */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 opacity-60">
            <motion.span
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚕️
            </motion.span>
          </div>
        </motion.div>

        {/* Shelves Background */}
        <div className="pharmacy-shelf h-16 sm:h-20 rounded-b-xl relative flex items-center justify-around px-4 sm:px-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="medicine-box w-8 h-8 sm:w-12 sm:h-12 rounded"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 * i }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl">
                {['💊', '💉', '🧪', '🩹', '💊'][i]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${
              step === 'identity' 
                ? 'bg-blue-500 text-white border-blue-700 shadow-lg scale-105 sm:scale-110' 
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
          >
            <User size={16} className="sm:hidden" />
            <User size={20} className="hidden sm:block" />
            <span className="font-semibold text-xs sm:text-base">1. IDENTITY CHECK</span>
            {step !== 'identity' && identityChecked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500 text-lg sm:text-xl"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
          <motion.div
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${
              step === 'validation' 
                ? 'bg-purple-500 text-white border-purple-700 shadow-lg scale-105 sm:scale-110' 
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
          >
            <FileText size={16} className="sm:hidden" />
            <FileText size={20} className="hidden sm:block" />
            <span className="font-semibold text-xs sm:text-base">2. VALIDATION</span>
          </motion.div>
        </div>

        {/* Step 1: Identity Check */}
        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card>
                <div className="game-screen p-4 sm:p-6">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3" style={{ fontFamily: "'VT323', monospace" }}>
                    <User className="text-blue-500" size={24} />
                    <span className="hidden sm:inline">PATIENT ARRIVAL</span>
                    <span className="sm:hidden">PATIENT</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Singapore NRIC Card Display */}
                    <motion.div 
                      className="relative overflow-hidden rounded-xl shadow-2xl"
                      initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
                      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    >
                      {/* NRIC Card */}
                      <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white p-4 sm:p-6 border-4 border-pink-200 rounded-xl relative">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-700 tracking-wide">REPUBLIC OF SINGAPORE</p>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-1">IDENTITY CARD NO.</p>
                            <p className="text-base sm:text-xl font-bold text-gray-900 mt-1" style={{ fontFamily: "'Courier New', monospace" }}>
                              {currentPrescription.patientIC}
                            </p>
                          </div>
                          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                              <span className="text-xl sm:text-3xl">🦁</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-4">
                          {/* Photo placeholder */}
                          <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg border-2 border-gray-400 flex items-center justify-center overflow-hidden">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-3xl sm:text-5xl opacity-60"
                            >
                              👤
                            </motion.div>
                          </div>

                          {/* Personal Info */}
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-600">Name</p>
                              <p className="text-sm sm:text-lg font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Arial', sans-serif" }}>
                                {currentPrescription.patientName.toUpperCase()}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-600">Race</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">CHINESE</p>
                              </div>
                              <div>
                                <p className="text-[10px] sm:text-xs text-gray-600">Sex</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">M</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-600">Date of Birth</p>
                              <p className="text-xs sm:text-sm font-bold text-gray-900">
                                {currentPrescription.patientIC.startsWith('S') || currentPrescription.patientIC.startsWith('T') 
                                  ? '15-03-1985' 
                                  : '22-08-1992'}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-600">Country of Birth</p>
                              <p className="text-xs sm:text-sm font-bold text-gray-900">SINGAPORE</p>
                            </div>
                          </div>
                        </div>

                        {/* Fingerprint graphic */}
                        <div className="absolute bottom-3 right-3 w-10 h-10 sm:w-12 sm:h-12 opacity-30">
                          <div className="w-full h-full rounded-full border-2 border-gray-400 relative">
                            <div className="absolute inset-1 rounded-full border border-gray-400"></div>
                            <div className="absolute inset-2 rounded-full border border-gray-400"></div>
                          </div>
                        </div>

                        {/* Hologram effect */}
                        <motion.div
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          style={{
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                            backgroundSize: '200% 200%',
                          }}
                          animate={{
                            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>

                      {/* Pixel border decoration */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-500 opacity-50" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 opacity-50" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-500 opacity-50" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 opacity-50" />
                    </motion.div>

                    {/* Identity Verification with arcade button */}
                    <motion.div 
                      className="border-4 border-dashed border-green-400 bg-green-50 p-6 rounded-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield size={24} className="text-green-600" />
                          <span className="font-semibold text-lg" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
                            VERIFY PATIENT IDENTITY
                          </span>
                        </div>
                        {identityChecked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle className="text-green-500" size={32} />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                        ⚠️ Check two identifiers: Name and IC number
                      </p>
                      <motion.button
                        onClick={handleIdentityCheck}
                        disabled={identityChecked}
                        className={`arcade-button w-full py-4 ${
                          identityChecked 
                            ? 'bg-gradient-to-r from-green-500 to-green-700' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        } text-white`}
                        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                        whileHover={!identityChecked ? { scale: 1.02 } : {}}
                        whileTap={!identityChecked ? { scale: 0.98 } : {}}
                      >
                        {identityChecked ? '✓ IDENTITY VERIFIED' : 'VERIFY IDENTITY'}
                      </motion.button>
                    </motion.div>

                    {/* Allergy Check */}
                    <motion.div 
                      className="border-4 border-dashed border-red-400 bg-red-50 p-6 rounded-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield size={24} className="text-red-600" />
                          <span className="font-semibold text-lg" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
                            CHECK DRUG ALLERGIES
                          </span>
                        </div>
                        {allergyChecked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle className="text-green-500" size={32} />
                          </motion.div>
                        )}
                      </div>
                      {currentPrescription.patientAllergies.length > 0 ? (
                        <motion.div 
                          className="bg-red-200 border-4 border-red-600 p-4 rounded mb-4"
                          animate={{ 
                            boxShadow: [
                              '0 0 10px rgba(220, 38, 38, 0.5)',
                              '0 0 20px rgba(220, 38, 38, 0.8)',
                              '0 0 10px rgba(220, 38, 38, 0.5)',
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <p className="font-semibold text-red-900 text-center" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>
                            ⚠️ ALLERGIES: {currentPrescription.patientAllergies.join(', ')}
                          </p>
                        </motion.div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-4 text-center" style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                          ✓ No known drug allergies
                        </p>
                      )}
                      <motion.button
                        onClick={handleAllergyCheck}
                        disabled={allergyChecked}
                        className={`arcade-button w-full py-4 ${
                          allergyChecked 
                            ? 'bg-gradient-to-r from-green-500 to-green-700' 
                            : 'bg-gradient-to-r from-orange-400 to-red-600'
                        } text-white`}
                        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px' }}
                        whileHover={!allergyChecked ? { scale: 1.02 } : {}}
                        whileTap={!allergyChecked ? { scale: 0.98 } : {}}
                      >
                        {allergyChecked ? '✓ ALLERGIES CHECKED' : 'CHECK ALLERGIES'}
                      </motion.button>
                    </motion.div>

                    {/* Proceed Button */}
                    {identityChecked && allergyChecked && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <motion.button
                          onClick={handleProceedToValidation}
                          className="arcade-button w-full py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(168, 85, 247, 0.5)',
                              '0 0 40px rgba(168, 85, 247, 0.8)',
                              '0 0 20px rgba(168, 85, 247, 0.5)',
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          PROCEED TO PRESCRIPTION VALIDATION →
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Prescription Validation */}
          {step === 'validation' && (
            <motion.div
              key="validation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-purple-500" />
                  Prescription Validation
                </h3>

                {/* Prescription Display */}
                <div className="prescription-paper p-6 rounded-lg mb-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Doctor:</p>
                      <p className="font-bold">{currentPrescription.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Date:</p>
                      <p className="font-bold">{currentPrescription.date}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Patient:</p>
                    <p className="font-bold">{currentPrescription.patientName}</p>
                    <p className="text-gray-700 text-sm">IC: {currentPrescription.patientIC}</p>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600 mb-2">Prescription:</p>
                    {currentPrescription.medications.map((med, idx) => {
                      const medication = getMedicationById(med.medicationId);
                      return (
                        <p key={idx} className="font-mono text-sm mb-1">
                          {medication?.genericName} {medication?.strength}, {med.dosageInstruction} {med.frequency} {med.specialInstructions ? med.specialInstructions + ' ' : ''}x {med.duration}
                        </p>
                      );
                    })}
                  </div>

                  {currentPrescription.doctorSignature && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Signature:</p>
                      <p className="italic font-signature text-lg">
                        {currentPrescription.doctorName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Validation Question */}
                {validationChoice === null && (
                  <div className="space-y-4">
                    <p className="font-semibold text-lg">Is this prescription valid?</p>

                    {/* Hint Component */}
                    <Hint
                      title="Need help validating?"
                      hints={[
                        "Check if the doctor's signature is present",
                        "Verify the prescription date is recent (not expired)",
                        "Ensure all medication details are complete and legible",
                        "Confirm patient details match what you verified earlier",
                        "If patient has allergies, ensure the medication isn't one they're allergic to"
                      ]}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="success"
                        onClick={() => handleValidationChoice(true)}
                        fullWidth
                        className="py-4 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        VALID - Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleValidationChoice(false)}
                        fullWidth
                        className="py-4 flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        INVALID - Reject
                      </Button>
                    </div>
                  </div>
                )}

                {/* Invalid Reason Selection */}
                {validationChoice === false && !showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-6"
                  >
                    <p className="font-semibold">What is the issue with this prescription?</p>
                    <select
                      value={selectedReason || ''}
                      onChange={(e) => setSelectedReason(e.target.value as InvalidReason)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select the issue...</option>
                      {Object.entries(invalidReasonLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="primary"
                      onClick={handleReasonSubmit}
                      disabled={!selectedReason}
                      fullWidth
                    >
                      Submit Answer
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Modal */}
        <Modal isOpen={showResult} onClose={() => {}} showCloseButton={false}>
          <div className="text-center">
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Correct!</h3>
                <p className="text-gray-600 mb-4">
                  {currentPrescription.isValid
                    ? 'The prescription is valid. Well done!'
                    : `You correctly identified: ${
                        invalidReasonLabels[currentPrescription.invalidReason!]
                      }`}
                </p>
                <p className="text-sm text-gray-500 mb-6">+{isCorrect ? (currentPrescription.isValid ? 20 : 30) : 0} Rx Points</p>
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
                <h3 className="text-2xl font-bold text-red-600 mb-2">Incorrect</h3>
                <p className="text-gray-600 mb-4">
                  {currentPrescription.isValid
                    ? 'This prescription is actually valid. Please review it again.'
                    : `The correct issue is: ${
                        invalidReasonLabels[currentPrescription.invalidReason!]
                      }`}
                </p>
              </>
            )}
            <Button variant={isCorrect ? 'success' : 'primary'} onClick={handleContinue} fullWidth>
              {isCorrect ? 'Continue to Next Stage →' : 'Try Again'}
            </Button>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
