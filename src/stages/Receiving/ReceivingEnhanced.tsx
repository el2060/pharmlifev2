import { useSceneMoment } from '../../scene/shiftScene';
import { PatientIdentityCard } from './PatientIdentityCard';
import { PreceptorNote } from '../../components/PharmacyScene';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Shield, FileText, AlertTriangle, Phone } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { ConsequenceResult } from '../../types/game.types';

export const ReceivingEnhanced: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, nextStage, setAllergyConflictDetected, completeLevel } = useGameStore();
  const [step, setStep] = useState<'identity' | 'investigation' | 'decision' | 'outcome'>('identity');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [allergyChecked, setAllergyChecked] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [consequence, setConsequence] = useState<ConsequenceResult | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  // Track player's findings during investigation
  const [foundIssues, setFoundIssues] = useState<string[]>([]);
  const [checkedFields, setCheckedFields] = useState<Set<string>>(new Set());

  useSceneMoment({
    stage: 'receiving',
    speaker: showOutcome || (step === 'identity' && !identityVerified) ? currentPrescription?.patientName : 'Preceptor',
    caption: showOutcome ? consequence?.patientReaction
      : step === 'identity'
        ? identityVerified ? 'Now check the patient’s drug allergies.' : 'Hello, I’m here to collect my medication. Here’s my IC.'
        : step === 'decision' ? 'Decide how to handle this prescription.' : 'Read the prescription and check the remarks.',
    actionLabel: step === 'identity' ? 'Open patient file' : 'Review prescription',
    gesture: showOutcome ? consequence?.isCorrect ? 'nod' : 'consider' : step === 'identity' && !identityVerified ? 'talk' : undefined,
  });


  if (!currentPrescription) {
    return <div>Loading prescription...</div>;
  }

  const hasScenario = !!currentPrescription.scenario;

  const handleIdentityVerification = () => {
    // Check if there's an identity mismatch scenario
    if (currentPrescription.identityMismatch) {
      // Player needs to spot the mismatch
      // For now, just mark as verified - the scenario will handle the decision
      setIdentityVerified(true);
    } else {
      setIdentityVerified(true);
    }
  };

  const handleAllergyCheck = () => {
    setAllergyChecked(true);

    // Check for allergy conflicts
    const hasConflict = currentPrescription.medications.some(med => {
      const medication = getMedicationById(med.medicationId);
      return currentPrescription.patientAllergies.some(
        allergy => medication?.genericName.toLowerCase().includes(allergy.toLowerCase())
      );
    });

    if (hasConflict) {
      // Set the flag in global state so Picking stage can use it
      setAllergyConflictDetected(true);

      if (!foundIssues.includes('allergy-conflict')) {
        setFoundIssues([...foundIssues, 'allergy-conflict']);
      }
    }
  };

  const handleProceedToInvestigation = () => {
    if (identityVerified && allergyChecked) {
      setStep('investigation');
      addScore(10);
    }
  };

  const handleFieldCheck = (fieldName: string) => {
    const newChecked = new Set(checkedFields);
    newChecked.add(fieldName);
    setCheckedFields(newChecked);
    addScore(5);
  };

  const handleProceedToDecision = () => {
    // Once all fields are checked, proceed to decision point
    if (hasScenario) {
      setStep('decision');
    } else {
      // No scenario - use old validation logic
      const playerFoundIssues = foundIssues.length > 0;
      const actuallyHasIssues = !currentPrescription.isValid;

      if (playerFoundIssues === actuallyHasIssues) {
        addScore(50);
        addRxPoints(30);
        nextStage();
      } else {
        // Show feedback and retry
        alert('Incorrect assessment. Please review the prescription carefully.');
      }
    }
  };

  const handleActionSelect = (optionId: string) => {
    if (!currentPrescription.scenario) return;

    setSelectedAction(optionId);
    const result = currentPrescription.scenario.consequences[optionId];
    setConsequence(result);

    // Apply score impacts
    addScore(result.scoreImpact);
    addRxPoints(result.rxPointsImpact);

    setShowOutcome(true);
  };

  const handleContinue = () => {
    if (consequence?.isCorrect) {
      if (consequence.shouldSkipRemainingStages) {
        completeLevel();
      } else {
        nextStage();
      }
    } else {
      // Reset for retry
      setSelectedAction('');
      setConsequence(null);
      setShowOutcome(false);
      setStep('investigation');
      setCheckedFields(new Set());
      setFoundIssues([]);
    }
  };

  return (
    <div className="container-custom mx-auto p-3 sm:p-4 max-w-4xl">
      {/* Pharmacy Scene Background - Mobile Optimized */}
      <PreceptorNote step={step}>
        {step === 'identity' && 'Start by comparing the patient’s ID and prescription.'}
        {step === 'investigation' && 'Review the prescription and patient details before deciding what to do.'}
        {step === 'decision' && 'How would you handle this prescription at the counter?'}
        {step === 'outcome' && (consequence?.isCorrect ? 'Review what happened before moving on.' : 'Let’s review what happened at the counter.')}
      </PreceptorNote>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Step Indicator */}
        <div className="intake-steps flex flex-wrap gap-2 mb-4">
          <motion.div
            aria-current={step === 'identity' ? 'step' : undefined}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'identity'
              ? 'bg-blue-500 text-white border-blue-700 shadow-lg scale-105 sm:scale-110'
              : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}

          >
            <User size={20} />
            <span className="font-semibold text-xs sm:text-base">1. Identity check</span>
            {step !== 'identity' && <span className="text-green-500 text-lg">✓</span>}
          </motion.div>

          <motion.div
            aria-current={step === 'investigation' ? 'step' : undefined}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'investigation'
              ? 'bg-purple-500 text-white border-purple-700 shadow-lg scale-105 sm:scale-110'
              : 'bg-gray-100 text-gray-400 border-gray-300'
              }`}

          >
            <FileText size={20} />
            <span className="font-semibold text-xs sm:text-base">2. Prescription review</span>
          </motion.div>

          {hasScenario && (
            <motion.div
              aria-current={step === 'decision' ? 'step' : undefined}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'decision'
                ? 'bg-orange-500 text-white border-orange-700 shadow-lg scale-105 sm:scale-110'
                : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}

            >
              <AlertTriangle size={20} />
              <span className="font-semibold text-xs sm:text-base">3. Decide what to do</span>
            </motion.div>
          )}
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
                  <h3 tabIndex={-1} data-scene-task className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <User className="text-blue-500" size={24} />
                    <span>Patient arrival</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 items-start">
                      <PatientIdentityCard prescription={currentPrescription} />
                      <section className="prescription-slip">
                        <h4>Prescription details</h4>
                        <dl>
                          <div><dt>Name</dt><dd>{currentPrescription.patientName}</dd></div>
                          <div><dt>IC number</dt><dd>{currentPrescription.patientIC}</dd></div>
                        </dl>
                      </section>
                    </div>

                    {/* Identity Verification */}
                    <div className="mt-6 mb-3">
                      <h4 className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wider">
                        At the counter
                      </h4>
                    </div>
                    <motion.div
                      className="border-4 border-dashed border-green-400 bg-green-50 p-6 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield size={24} className="text-green-600" />
                          <span className="font-semibold text-lg" >
                            VERIFY PATIENT IDENTITY
                          </span>
                        </div>
                        {identityVerified && (
                          <CheckCircle className="text-green-500" size={32} />
                        )}
                      </div>
                      <p className="text-base text-gray-600 mb-4 font-bold" >
                        ⚠️ Check TWO identifiers: Name and IC number
                      </p>
                      <button
                        onClick={handleIdentityVerification}
                        disabled={identityVerified}
                        className={`arcade-button w-full py-4 ${identityVerified
                          ? 'bg-gradient-to-r from-green-500 to-green-700'
                          : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          } text-white`}

                      >
                        {identityVerified ? '✓ IDENTITY VERIFIED' : 'VERIFY IDENTITY'}
                      </button>
                    </motion.div>

                    {/* Allergy Check */}
                    <motion.div
                      className="border-4 border-dashed border-red-400 bg-red-50 p-6 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield size={24} className="text-red-600" />
                          <span className="font-semibold text-lg" >
                            CHECK DRUG ALLERGIES
                          </span>
                        </div>
                        {allergyChecked && (
                          <CheckCircle className="text-green-500" size={32} />
                        )}
                      </div>
                      {currentPrescription.patientAllergies.length > 0 && !currentPrescription.patientAllergies.includes('NKDA') ? (
                        <div className="bg-red-200 border-4 border-red-600 p-4 rounded mb-4">
                          <p className="font-semibold text-red-900 text-center" >
                            ⚠️ ALLERGIES: {currentPrescription.patientAllergies.join(', ')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-4 text-center" >
                          ✓ No known drug allergies
                        </p>
                      )}
                      <button
                        onClick={handleAllergyCheck}
                        disabled={allergyChecked}
                        className={`arcade-button w-full py-4 ${allergyChecked
                          ? 'bg-gradient-to-r from-green-500 to-green-700'
                          : 'bg-gradient-to-r from-orange-400 to-red-600'
                          } text-white`}

                      >
                        {allergyChecked ? '✓ ALLERGIES CHECKED' : 'CHECK ALLERGIES'}
                      </button>
                    </motion.div>

                    {/* Proceed Button */}
                    {identityVerified && allergyChecked && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <button
                          onClick={handleProceedToInvestigation}
                          className="arcade-button w-full py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white"

                        >
                          PROCEED TO INVESTIGATION →
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Investigation (Check prescription details) */}
          {step === 'investigation' && (
            <motion.div
              key="investigation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="poke-textbox p-3 sm:p-4">
                <p className="text-poke-black text-xs sm:text-base font-bold mb-2" >
                  INVESTIGATE PRESCRIPTION
                </p>
                <p className="text-poke-black text-[10px] sm:text-sm" >
                  Review all prescription details carefully. Look for any issues or concerns.
                </p>
              </div>

              {/* Show Prescription Details */}
              <div className="poke-menu p-3 sm:p-6 space-y-3 sm:space-y-4">
                <div className="border-4 border-poke-black p-3 sm:p-4 bg-white">
                  <h4 className="text-sm sm:text-base font-bold mb-3" >
                    PRESCRIPTION DETAILS
                  </h4>

                  <div className="space-y-2 sm:space-y-3 text-sm sm:text-base" >
                    <div className="break-words">
                      <span className="font-bold">Patient:</span> {currentPrescription.patientName}
                    </div>
                    <div className="break-all">
                      <span className="font-bold">IC:</span> {currentPrescription.patientIC}
                    </div>
                    <div className="break-words">
                      <span className="font-bold">Doctor:</span> {currentPrescription.doctorName} {currentPrescription.doctorMCR && <span className="text-xs text-gray-600">({currentPrescription.doctorMCR})</span>}
                    </div>
                    {currentPrescription.clinicAddress && (
                      <div className="break-words">
                        <span className="font-bold">Clinic:</span> {currentPrescription.clinicAddress}
                      </div>
                    )}
                    <div>
                      <span className="font-bold">Signature:</span> {currentPrescription.doctorSignature ? '✓ Signed' : '✗ NOT SIGNED'}
                    </div>
                    <div>
                      <span className="font-bold">Date:</span> {currentPrescription.date}
                    </div>
                    {currentPrescription.patientAddress && (
                      <div className="break-words">
                        <span className="font-bold">Address:</span> {currentPrescription.patientAddress}
                      </div>
                    )}
                    <div>
                      <span className="font-bold">Medications:</span>
                      <ul className="mt-2 ml-3 sm:ml-4 space-y-2">
                        {currentPrescription.medications.map((med, idx) => {
                          const medication = getMedicationById(med.medicationId);
                          return (
                            <li key={idx} className="text-sm leading-relaxed break-words mb-2">
                              <b>• {medication?.genericName} {medication?.strength}</b><br />
                              <span className="ml-2">{med.dosageInstruction} {med.frequency} {med.duration ? `x ${med.duration}` : '(duration missing)'}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {checkedFields.size === 0 && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-100 border-4 border-yellow-600 rounded">
                      <p className="text-[10px] sm:text-sm font-bold text-yellow-900" >
                        💡 TIP: Click the button below when you're done reviewing
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleFieldCheck('all');
                    handleProceedToDecision();
                  }}
                  className="btn-primary w-full text-sm sm:text-lg py-3 sm:py-4"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <FileText size={20} className="sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-base">Decide what to do →</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Decision Point (if scenario exists) */}
          {step === 'decision' && currentPrescription.scenario && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Scenario Situation */}
              <div className="poke-textbox p-4 sm:p-6 bg-yellow-100 border-4 border-yellow-600">
                <div className="flex items-start gap-4 mb-3">
                  <AlertTriangle className="text-yellow-700 flex-shrink-0" size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-poke-black text-lg sm:text-xl font-bold mb-2" >
                      SITUATION
                    </p>
                    <p className="text-poke-black text-base sm:text-lg leading-relaxed" >
                      {currentPrescription.scenario.situation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="poke-menu p-4 sm:p-6">
                <p className="text-poke-black text-lg sm:text-xl font-bold mb-6 leading-relaxed" >
                  {currentPrescription.scenario.question}
                </p>

                {/* Action Options */}
                <div className="space-y-3 sm:space-y-4">
                  {currentPrescription.scenario.options.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleActionSelect(option.id)}
                      disabled={selectedAction !== ''}
                      className={`w-full border-4 border-poke-black p-4 sm:p-5 text-left transition-all ${selectedAction === option.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-poke-black hover:bg-gray-100'
                        }`}
                      style={{
                        boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)',
                        cursor: selectedAction !== '' ? 'not-allowed' : 'pointer'
                      }}
                      whileTap={selectedAction === '' ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {option.action === 'call-doctor' && <Phone size={24} className="min-w-6" />}
                          {option.action === 'ask-patient' && <User size={24} className="min-w-6" />}
                          {option.action === 'refuse-rx' && <XCircle size={24} className="min-w-6" />}
                          {option.action === 'accept-rx' && <CheckCircle size={24} className="min-w-6" />}
                        </div>
                        <span className="flex-1 text-base sm:text-lg font-medium break-words">{option.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outcome Modal */}
        <Modal isOpen={showOutcome} onClose={() => { }} showCloseButton={false}>
          <div className="text-center">
            {consequence && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4"
                >
                  {consequence.isCorrect ? (
                    <CheckCircle size={64} className="text-pharm-green mx-auto sm:w-20 sm:h-20" />
                  ) : (
                    <XCircle size={64} className="text-poke-red mx-auto animate-shake sm:w-20 sm:h-20" />
                  )}
                </motion.div>

                <h3 className={`text-lg sm:text-2xl font-bold mb-2 sm:mb-3 ${consequence.isCorrect ? 'text-pharm-green' : 'text-poke-red'}`} >
                  {consequence.isCorrect
                    ? (consequence.shouldSkipRemainingStages ? 'CASE CLOSED: INTERVENTION SUCCESSFUL' : 'EXCELLENT!')
                    : 'INCORRECT'}
                </h3>

                {/* Outcome */}
                <div className="bg-gray-100 border-4 border-gray-400 p-3 sm:p-4 mb-3 sm:mb-4 text-left">
                  <p className="text-sm sm:text-base font-bold mb-2" >
                    What happened
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed" >
                    {consequence.outcome}
                  </p>
                  {consequence.isCorrect && consequence.shouldSkipRemainingStages && (
                    <p className="text-sm sm:text-base font-bold mt-2 text-blue-600">
                      ✓ Prescription cancelled. No further processing required.
                    </p>
                  )}
                </div>

                {/* Patient Reaction */}
                <div className={`border-4 p-3 sm:p-4 mb-3 sm:mb-4 text-left ${consequence.isCorrect ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600'}`}>
                  <p className="text-sm sm:text-base font-bold mb-2" >
                    Patient response
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed" >
                    {consequence.patientReaction}
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-blue-100 border-4 border-blue-600 p-3 sm:p-4 mb-3 sm:mb-4 text-left">
                  <p className="text-sm sm:text-base font-bold mb-2" >
                    Why it matters
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed" >
                    {consequence.explanation}
                  </p>
                </div>

                {!consequence.isCorrect && (
                  <div className="bg-yellow-100 border-2 border-yellow-600 p-3 mb-4 text-left">
                    <p className="text-yellow-900 text-sm sm:text-base font-bold">
                      💡 TIP: Review the "Remarks" and patient details closely!
                    </p>
                  </div>
                )}

                {/* Score Impact */}
                <div className="mb-4 sm:mb-6">
                  <p className={`text-base sm:text-lg font-bold ${consequence.scoreImpact > 0 ? 'text-green-600' : 'text-red-600'}`} >
                    {consequence.scoreImpact > 0 ? '+' : ''}{consequence.scoreImpact} Points
                  </p>
                  <p className={`text-sm sm:text-base font-bold ${consequence.rxPointsImpact > 0 ? 'text-green-600' : 'text-red-600'}`} >
                    {consequence.rxPointsImpact > 0 ? '+' : ''}{consequence.rxPointsImpact} Rx Points
                  </p>
                </div>

                <Button variant={consequence.isCorrect ? 'success' : 'danger'} onClick={handleContinue} fullWidth>
                  <span className="text-xs sm:text-base">
                    {consequence.isCorrect
                      ? (consequence.shouldSkipRemainingStages ? 'Call the next patient →' : 'Send to label station →')
                      : 'Review and try again'}
                  </span>
                </Button>
              </>
            )}
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
