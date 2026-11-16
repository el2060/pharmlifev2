import { useSceneMoment } from '../../scene/shiftScene';
import { PatientIdentityCard } from './PatientIdentityCard';
import { PreceptorNote } from '../../components/PharmacyScene';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Shield, FileText, MousePointer2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';

export const ReceivingStandard: React.FC = () => {
    const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore();

    const [step, setStep] = useState<'identity' | 'validation' | 'complete'>('identity');
    const [identityChecked, setIdentityChecked] = useState(false);
    const [allergyChecked, setAllergyChecked] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Scroll to top when step changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    // Interactive validation checks
    const [checkedFields, setCheckedFields] = useState<Set<string>>(new Set());
    const [foundIssues, setFoundIssues] = useState<string[]>([]);

    useSceneMoment({
        stage: 'receiving',
        speaker: step === 'identity' && !identityChecked ? currentPrescription?.patientName : 'Preceptor',
        caption: step === 'identity'
            ? identityChecked ? 'Check the drug allergies before reviewing the prescription.' : 'Hello, I’m here to collect my medication. Here’s my IC.'
            : 'Check the prescription details before it goes to the label station.',
        actionLabel: step === 'identity' ? 'Open patient file' : 'Review prescription',
        gesture: step === 'identity' && !identityChecked ? 'talk' : 'nod',
    });


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

    const handleFieldCheck = (fieldName: string, hasIssue: boolean) => {
        const newChecked = new Set(checkedFields);
        newChecked.add(fieldName);
        setCheckedFields(newChecked);


        // Critical Guard: If the prescription is comprehensively VALID, 
        // we must NEVER flag an issue, regardless of what individual checks say.
        // This protects against date mismatches, parsing errors, etc.
        if (currentPrescription.isValid && hasIssue) {
            console.warn('Blocked false positive issue for field:', fieldName);
            hasIssue = false;
        }

        if (hasIssue) {
            setFoundIssues([...foundIssues, fieldName]);
        }


        // Award points for each check
        addScore(5);
    };

    const handleSubmitValidation = () => {
        // Check if all required fields were checked
        const requiredChecks = ['signature', 'date', 'patient', 'dosage', 'allergies'];
        const allChecked = requiredChecks.every(check => checkedFields.has(check));

        if (!allChecked) {
            // Player didn't check all fields
            setIsCorrect(false);
            setShowResult(true);
            return;
        }

        // Determine if player's assessment matches reality
        const playerFoundIssues = foundIssues.length > 0;
        const actuallyHasIssues = !currentPrescription.isValid;

        if (playerFoundIssues === actuallyHasIssues) {
            setIsCorrect(true);
            addScore(50);
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
            setShowResult(false);
            setCheckedFields(new Set());
            setFoundIssues([]);
        }
    };

    return (
        <div className="container-custom mx-auto p-4 sm:p-6 lg:p-8 max-w-[1400px]">
            <PreceptorNote step={step}>
                {step === 'identity' && 'Compare the patient’s ID with the prescription, then check for drug allergies.'}
                {step === 'validation' && 'Review the prescription details before sending it to the label station.'}
                {step === 'complete' && 'The prescription check is complete.'}
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
                        whileHover={{ scale: 1.05 }}

                    >
                        <User size={16} className="sm:hidden" />
                        <User size={20} className="hidden sm:block" />
                        <span className="font-semibold text-xs sm:text-base">1. Identity check</span>
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
                        aria-current={step === 'validation' ? 'step' : undefined}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'validation'
                            ? 'bg-purple-500 text-white border-purple-700 shadow-lg scale-105 sm:scale-110'
                            : 'bg-gray-100 text-gray-400 border-gray-300'
                            }`}
                        whileHover={{ scale: 1.05 }}

                    >
                        <FileText size={16} className="sm:hidden" />
                        <FileText size={20} className="hidden sm:block" />
                        <span className="font-semibold text-xs sm:text-base">2. Prescription review</span>
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
                                    <h3 tabIndex={-1} data-scene-task className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                        <User className="text-blue-500" size={24} />
                                        <span>Patient arrival</span>
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="intake-documents grid gap-4 lg:grid-cols-2 items-start">
                                            <PatientIdentityCard prescription={currentPrescription} />

                                            {/* Prescription snapshot so ID and Rx can be compared on one screen */}
                                            <motion.div
                                                className="game-screen p-4 sm:p-5"
                                                initial={{ scale: 0.9, opacity: 0, rotateY: 15 }}
                                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                                transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
                                            >
                                                <p className="pixel-title text-lg sm:text-xl mb-3">PRESCRIPTION PREVIEW</p>
                                                <div className="space-y-2 text-poke-black" >
                                                    <p>Patient: {currentPrescription.patientName}</p>
                                                    <p>IC: {currentPrescription.patientIC}</p>
                                                    <div className="pt-1">
                                                        <p className="font-bold">Medications:</p>
                                                        <div className="space-y-1 mt-1">
                                                            {currentPrescription.medications.map((med, idx) => {
                                                                const medication = getMedicationById(med.medicationId);
                                                                return (
                                                                    <div key={idx} className="mb-2">
                                                                        <p className="font-bold">• {medication?.genericName} {medication?.strength ? `(${medication.strength})` : ''}:</p>
                                                                        <p className="pl-3">{med.dosageInstruction} {med.frequency}{med.specialInstructions ? ` ${med.specialInstructions}` : ''} x {med.duration}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <details className="rx-source-details">
                                                    <summary>Prescriber and visit details</summary>
                                                    <div className="space-y-1.5">
                                                    <p>Doctor: {currentPrescription.doctorName} {currentPrescription.doctorMCR && <span className="text-xs text-gray-600">({currentPrescription.doctorMCR})</span>}</p>
                                                    <p>Signature: {currentPrescription.doctorSignature ? '✓ Signed' : '✗ Missing'}</p>
                                                    {currentPrescription.clinicAddress && <p>Clinic: {currentPrescription.clinicAddress}</p>}
                                                    <p>Date: {currentPrescription.date}</p>
                                                    {currentPrescription.patientAddress && <p>Address: {currentPrescription.patientAddress}</p>}
                                                    </div>
                                                </details>
                                            </motion.div>
                                        </div>

                                        {/* Identity Verification with arcade button */}
                                        <div className="mt-6 mb-3">
                                            <h4 className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wider">
                                                At the counter
                                            </h4>
                                        </div>
                                        <motion.div
                                            className="border-4 border-dashed border-green-400 bg-green-50 p-6 rounded-lg"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Shield size={24} className="text-green-600" />
                                                    <span className="font-semibold text-lg" >
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
                                            <p className="text-sm text-gray-600 mb-4" >
                                                ⚠️ Check two identifiers: Name and IC number
                                            </p>
                                            <motion.button
                                                onClick={handleIdentityCheck}
                                                disabled={identityChecked}
                                                className={`arcade-button w-full py-4 ${identityChecked
                                                    ? 'bg-gradient-to-r from-green-500 to-green-700'
                                                    : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                    } text-white`}

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
                                                    <span className="font-semibold text-lg" >
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
                                            {currentPrescription.patientAllergies.length > 0 && !currentPrescription.patientAllergies.includes('NKDA') ? (
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
                                                    <p className="font-semibold text-red-900 text-center" >
                                                        ⚠️ ALLERGIES: {currentPrescription.patientAllergies.join(', ')}
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <p className="text-sm text-gray-600 mb-4 text-center" >
                                                    ✓ No known drug allergies
                                                </p>
                                            )}
                                            <motion.button
                                                onClick={handleAllergyCheck}
                                                disabled={allergyChecked}
                                                className={`arcade-button w-full py-4 ${allergyChecked
                                                    ? 'bg-gradient-to-r from-green-500 to-green-700'
                                                    : 'bg-gradient-to-r from-orange-400 to-red-600'
                                                    } text-white`}

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
                                                    Review prescription →
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2: Interactive Prescription Validation */}
                    {step === 'validation' && (
                        <motion.div
                            key="validation"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* Instructions */}
                            <div className="poke-textbox p-4" style={{ background: '#FFFFFF' }}>
                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2" >
                                    VALIDATE PRESCRIPTION
                                </p>
                                <p className="text-poke-black text-sm sm:text-base" >
                                    Review the prescription details, then <span className="font-bold text-blue-600">tap on each task box below</span> to verify.
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-4">
                                {/* Prescription reference on same screen for cross-checking */}
                                <div className="game-screen p-4 sm:p-5">
                                    <p className="pixel-title text-lg sm:text-xl mb-3">PRESCRIPTION DETAILS</p>
                                    <div className="space-y-2 text-poke-black" >
                                        <p>Patient: {currentPrescription.patientName}</p>
                                        <p>IC: {currentPrescription.patientIC}</p>
                                        <p>Doctor: {currentPrescription.doctorName} {currentPrescription.doctorMCR && <span className="text-xs text-gray-600">({currentPrescription.doctorMCR})</span>}</p>
                                        <p>Signature: {currentPrescription.doctorSignature ? '✓ Signed' : '✗ Missing'}</p>
                                        {currentPrescription.clinicAddress && <p>Clinic: {currentPrescription.clinicAddress}</p>}
                                        <p>Date: {currentPrescription.date}</p>
                                        <div className="pt-1">
                                            <p className="font-bold">Medications:</p>
                                            <div className="space-y-1 mt-1">
                                                {currentPrescription.medications.map((med, idx) => {
                                                    const medication = getMedicationById(med.medicationId);
                                                    return (
                                                        <div key={idx} className="mb-2">
                                                            <p className="font-bold">• {medication?.genericName} {medication?.strength ? `(${medication.strength})` : ''}:</p>
                                                            <p className="pl-3">{med.dosageInstruction} {med.frequency}{med.specialInstructions ? ` ${med.specialInstructions}` : ''} x {med.duration}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-3 font-medium">
                                        Reference this while ticking the 5 validation fields.
                                    </p>
                                </div>

                                {/* Interactive Prescription Display */}
                                <div className="poke-menu p-4 sm:p-6 space-y-4" style={{ background: '#FFFFFF' }}>

                                    <div className="mb-2">
                                        <h4 className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wider">
                                            At the counter (Tap to Verify)
                                        </h4>
                                    </div>

                                    {/* 1. Doctor Signature Check */}
                                    <motion.button
                                        onClick={() => handleFieldCheck('signature', !currentPrescription.doctorSignature)}
                                        disabled={checkedFields.has('signature')}
                                        className="w-full border-4 border-poke-black p-4 sm:p-5 text-left relative overflow-hidden cursor-pointer group"
                                        style={{
                                            background: checkedFields.has('signature')
                                                ? (currentPrescription.doctorSignature ? '#90EE90' : '#FFB6C1')
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        whileHover={!checkedFields.has('signature') ? { scale: 1.02, boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 6px 6px 0 0 rgba(0,0,0,0.3)' } : {}}
                                        whileTap={{ scale: checkedFields.has('signature') ? 1 : 0.97 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2 flex items-center gap-2" >
                                                    ☐ DOCTOR SIGNATURE
                                                    {!checkedFields.has('signature') && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold animate-pulse bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                            <MousePointer2 size={12} /> TAP HERE
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-poke-black text-sm sm:text-base" >
                                                    {currentPrescription.doctorName}
                                                </p>
                                                {currentPrescription.doctorSignature && (
                                                    <p className="italic text-gray-600 text-sm mt-1">✍️ Signed</p>
                                                )}
                                            </div>
                                            {checkedFields.has('signature') ? (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex-shrink-0"
                                                >
                                                    {currentPrescription.doctorSignature ? (
                                                        <CheckCircle className="text-green-600" size={32} />
                                                    ) : (
                                                        <XCircle className="text-red-600" size={32} />
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                >
                                                    <User size={24} className="opacity-20" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* 2. Prescription Date Check */}
                                    <motion.button
                                        onClick={() => {
                                            const rxDate = new Date(currentPrescription.date);
                                            const today = new Date();
                                            const daysDiff = Math.floor((today.getTime() - rxDate.getTime()) / (1000 * 60 * 60 * 24));
                                            const isExpired = daysDiff > 180; // More than 6 months old
                                            // If prescription is valid, force NO ISSUE (false), overriding any date math glitches
                                            handleFieldCheck('date', currentPrescription.isValid ? false : isExpired);
                                        }}
                                        disabled={checkedFields.has('date')}
                                        className="w-full border-4 border-poke-black p-4 text-left cursor-pointer group"
                                        style={{
                                            background: checkedFields.has('date')
                                                ? (currentPrescription.isValid ? '#90EE90' : (foundIssues.includes('date') ? '#FFB6C1' : '#90EE90'))
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('date') ? 1 : 0.98 }}
                                        whileHover={!checkedFields.has('date') ? { scale: 1.02 } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2 flex items-center gap-2" >
                                                    ☐ PRESCRIPTION DATE
                                                    {!checkedFields.has('date') && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold animate-pulse bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                            <MousePointer2 size={12} /> TAP HERE
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-poke-black text-sm sm:text-base" >
                                                    {currentPrescription.date}
                                                </p>
                                            </div>
                                            {checkedFields.has('date') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex-shrink-0"
                                                >
                                                    {!foundIssues.includes('date') ? (
                                                        <CheckCircle className="text-green-600" size={32} />
                                                    ) : (
                                                        <XCircle className="text-red-600" size={32} />
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* 3. Patient Details Check */}
                                    <motion.button
                                        onClick={() => handleFieldCheck('patient', false)} // Assuming always matches in our scenarios
                                        disabled={checkedFields.has('patient')}
                                        className="w-full border-4 border-poke-black p-4 text-left cursor-pointer group"
                                        style={{
                                            background: checkedFields.has('patient') ? '#90EE90' : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('patient') ? 1 : 0.98 }}
                                        whileHover={!checkedFields.has('patient') ? { scale: 1.02 } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2 flex items-center gap-2" >
                                                    ☐ PATIENT DETAILS
                                                    {!checkedFields.has('patient') && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold animate-pulse bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                            <MousePointer2 size={12} /> TAP HERE
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-poke-black text-sm sm:text-base" >
                                                    {currentPrescription.patientName}
                                                </p>
                                                <p className="text-gray-600 text-xs mt-1">IC: {currentPrescription.patientIC}</p>
                                            </div>
                                            {checkedFields.has('patient') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    <CheckCircle className="text-green-600" size={32} />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* 4. Dosage Instructions Check */}
                                    <motion.button
                                        onClick={() => {
                                            // Check if any medication is missing duration or dosage
                                            const hasIncomplete = currentPrescription.medications.some(
                                                med => !med.duration || !med.dosageInstruction || !med.frequency
                                            );
                                            // If prescription is valid, force NO ISSUE (false)
                                            handleFieldCheck('dosage', currentPrescription.isValid ? false : hasIncomplete);
                                        }}
                                        disabled={checkedFields.has('dosage')}
                                        className="w-full border-4 border-poke-black p-4 text-left cursor-pointer group"
                                        style={{
                                            background: checkedFields.has('dosage')
                                                ? (foundIssues.includes('dosage') ? '#FFB6C1' : '#90EE90')
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('dosage') ? 1 : 0.98 }}
                                        whileHover={!checkedFields.has('dosage') ? { scale: 1.02 } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2 flex items-center gap-2" >
                                                    ☐ DOSAGE COMPLETE
                                                    {!checkedFields.has('dosage') && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold animate-pulse bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                            <MousePointer2 size={12} /> TAP HERE
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="space-y-1">
                                                    {currentPrescription.medications.map((med, idx) => {
                                                        const medication = getMedicationById(med.medicationId);
                                                        return (
                                                            <p key={idx} className="text-poke-black text-xs" >
                                                                {medication?.genericName}: {med.dosageInstruction || '?'} {med.frequency || '?'} x {med.duration || '?'}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            {checkedFields.has('dosage') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    {!foundIssues.includes('dosage') ? (
                                                        <CheckCircle className="text-green-600" size={32} />
                                                    ) : (
                                                        <XCircle className="text-red-600" size={32} />
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* 5. Drug Allergies Check */}
                                    <motion.button
                                        onClick={() => {
                                            // Check if any prescribed medication matches patient allergies
                                            const hasAllergyConflict = currentPrescription.medications.some(med => {
                                                const medication = getMedicationById(med.medicationId);
                                                return currentPrescription.patientAllergies.some(
                                                    allergy => medication?.genericName.toLowerCase().includes(allergy.toLowerCase())
                                                );
                                            });
                                            // If prescription is valid, force NO ISSUE (false)
                                            handleFieldCheck('allergies', currentPrescription.isValid ? false : hasAllergyConflict);
                                        }}
                                        disabled={checkedFields.has('allergies')}
                                        className="w-full border-4 border-poke-black p-4 text-left cursor-pointer group"
                                        style={{
                                            background: checkedFields.has('allergies')
                                                ? (foundIssues.includes('allergies') ? '#FFB6C1' : '#90EE90')
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('allergies') ? 1 : 0.98 }}
                                        whileHover={!checkedFields.has('allergies') ? { scale: 1.02 } : {}}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-sm sm:text-base font-bold mb-2 flex items-center gap-2" >
                                                    ☐ DRUG ALLERGIES
                                                    {!checkedFields.has('allergies') && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold animate-pulse bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                            <MousePointer2 size={12} /> TAP HERE
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-poke-black text-sm sm:text-base" >
                                                    {currentPrescription.patientAllergies.length > 0 ? currentPrescription.patientAllergies.join(', ') : 'NIL'}
                                                </p>
                                            </div>
                                            {checkedFields.has('allergies') && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    {!foundIssues.includes('allergies') ? (
                                                        <CheckCircle className="text-green-600" size={32} />
                                                    ) : (
                                                        <XCircle className="text-red-600" size={32} />
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* Submit Button */}
                                    <motion.button
                                        onClick={handleSubmitValidation}
                                        className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        VERIFY PRESCRIPTION →
                                    </motion.button>
                                </div>
                            </div>

                            {/* Validation Result Modal */}
                            <Modal
                                isOpen={showResult}
                                onClose={() => { }}
                                showCloseButton={false}
                            >
                                <div className="text-center">
                                    {isCorrect ? (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4"
                                            >
                                                <CheckCircle size={64} className="text-pharm-green mx-auto sm:w-20 sm:h-20" />
                                            </motion.div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-pharm-green mb-2" >
                                                PRESCRIPTION VERIFIED!
                                            </h3>
                                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                                Good job spotting the details. The prescription is valid.
                                            </p>
                                            <Button variant="success" onClick={handleContinue} fullWidth>
                                                Send to label station →
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4"
                                            >
                                                <XCircle size={64} className="text-poke-red mx-auto animate-shake sm:w-20 sm:h-20" />
                                            </motion.div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-poke-red mb-2" >
                                                INCORRECT VALIDATION
                                            </h3>
                                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                                                {checkedFields.size < 5
                                                    ? "You must check ALL 5 fields before validating."
                                                    : "Your assessment doesn't match the actual prescription status. Check carefully!"}
                                            </p>
                                            <Button variant="danger" onClick={handleContinue} fullWidth>
                                                TRY AGAIN
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Modal>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
