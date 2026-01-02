import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Shield, FileText } from 'lucide-react';
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
            {/* Pharmacy Scene Background */}
            <div className="mb-4 sm:mb-6 relative">
                <motion.div
                    className="pharmacy-counter rounded-t-xl p-3 sm:p-8 relative overflow-hidden"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {/* Pharmacy Counter Scene */}
                    <div className="flex justify-between items-end mb-2 sm:mb-4 h-[120px] sm:h-auto">
                        {/* Pharmacist Character */}
                        <motion.div
                            className="relative scale-90 sm:scale-100 origin-bottom-left"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="character-pharmacist" />
                            <motion.div
                                className="speech-bubble mt-2 absolute -right-2 top-0 transform translate-x-full w-[120px] sm:static sm:w-auto sm:max-w-xs text-[9px] sm:text-xs leading-tight sm:leading-normal z-10"
                                initial={{ scale: 0, originX: 0, originY: 1 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6, type: 'spring' }}
                            >
                                {step === 'identity' && 'Welcome! Let\'s verify identity.'}
                                {step === 'validation' && 'Checking prescription...'}
                                {step === 'complete' && 'Done! Next stage.'}
                            </motion.div>
                        </motion.div>

                        {/* Patient Character */}
                        <motion.div
                            className="relative scale-90 sm:scale-100 origin-bottom-right"
                            initial={{ x: 20, opacity: 0 }}
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
                            className="text-xl sm:text-3xl"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ⚕️
                        </motion.span>
                    </div>
                </motion.div>

                {/* Shelves Background */}
                <div className="pharmacy-shelf h-12 sm:h-20 rounded-b-xl relative flex items-center justify-around px-2 sm:px-8">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="medicine-box w-6 h-6 sm:w-12 sm:h-12 rounded"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 * i }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-full h-full flex items-center justify-center text-sm sm:text-2xl">
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
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'identity'
                            ? 'bg-blue-500 text-white border-blue-700 shadow-lg scale-105 sm:scale-110'
                            : 'bg-gray-100 text-gray-400 border-gray-300'
                            }`}
                        whileHover={{ scale: 1.05 }}

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
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-4 transition-all ${step === 'validation'
                            ? 'bg-purple-500 text-white border-purple-700 shadow-lg scale-105 sm:scale-110'
                            : 'bg-gray-100 text-gray-400 border-gray-300'
                            }`}
                        whileHover={{ scale: 1.05 }}

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
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3" >
                                        <User className="text-blue-500" size={24} />
                                        <span className="hidden sm:inline">PATIENT ARRIVAL</span>
                                        <span className="sm:hidden">PATIENT</span>
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid gap-4 lg:grid-cols-2">
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
                                                            <p className="text-base sm:text-xl font-bold text-gray-900 mt-1 font-mono">
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
                                                                <p className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                                                                    {currentPrescription.patientName.toUpperCase()}
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-8">
                                                                <div>
                                                                    <p className="text-[10px] sm:text-xs text-gray-600">Race</p>
                                                                    <p className="text-xs sm:text-sm font-bold text-gray-900">CHINESE</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] sm:text-xs text-gray-600">Sex</p>
                                                                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                                                                        {currentPrescription.patientName.toLowerCase().includes('sarah') ||
                                                                            currentPrescription.patientName.toLowerCase().includes('ms') ||
                                                                            currentPrescription.patientName.toLowerCase().startsWith('mrs') ||
                                                                            currentPrescription.patientName.toLowerCase().startsWith('mdm')
                                                                            ? 'F'
                                                                            : 'M'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-gray-600">Date of Birth</p>
                                                                <p className="text-xs sm:text-sm font-bold text-gray-900">
                                                                    {currentPrescription.patientDOB || (currentPrescription.patientIC.startsWith('S') || currentPrescription.patientIC.startsWith('T')
                                                                        ? '15-03-1985'
                                                                        : '22-08-1992')}
                                                                </p>
                                                            </div>

                                                            {currentPrescription.patientAddress && (
                                                                <div className="col-span-2">
                                                                    <p className="text-[10px] sm:text-xs text-gray-600">Address</p>
                                                                    <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                                                        {currentPrescription.patientAddress}
                                                                    </p>
                                                                </div>
                                                            )}

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

                                            {/* Prescription snapshot so ID and Rx can be compared on one screen */}
                                            <motion.div
                                                className="game-screen p-4 sm:p-5 h-full"
                                                initial={{ scale: 0.9, opacity: 0, rotateY: 15 }}
                                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                                transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
                                            >
                                                <p className="pixel-title text-lg sm:text-xl mb-3">PRESCRIPTION PREVIEW</p>
                                                <div className="space-y-2 text-poke-black" >
                                                    <p>Patient: {currentPrescription.patientName}</p>
                                                    <p>IC: {currentPrescription.patientIC}</p>
                                                    <p>Doctor: {currentPrescription.doctorName} {currentPrescription.doctorMCR && <span className="text-xs text-gray-600">({currentPrescription.doctorMCR})</span>}</p>
                                                    <p>Signature: {currentPrescription.doctorSignature ? '✓ Signed' : '✗ Missing'}</p>
                                                    {currentPrescription.clinicAddress && <p>Clinic: {currentPrescription.clinicAddress}</p>}
                                                    <p>Date: {currentPrescription.date}</p>
                                                    {currentPrescription.patientAddress && <p>Address: {currentPrescription.patientAddress}</p>}
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
                                                <p className="text-xs text-gray-600 mt-3 font-medium">
                                                    Cross-check name/IC against the card before proceeding.
                                                </p>
                                            </motion.div>
                                        </div>

                                        {/* Identity Verification with arcade button */}
                                        <div className="mt-6 mb-3">
                                            <h4 className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-wider">
                                                Your Tasks
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
                                                    PROCEED TO PRESCRIPTION VALIDATION →
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
                                <p className="text-poke-black text-xs sm:text-sm" >
                                    Check each field carefully. Keep the prescription visible while you tick each box.
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-4">
                                {/* Prescription reference on same screen for cross-checking */}
                                <div className="game-screen p-4 sm:p-5 h-full">
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
                                            Your Tasks
                                        </h4>
                                    </div>

                                    {/* 1. Doctor Signature Check */}
                                    <motion.button
                                        onClick={() => handleFieldCheck('signature', !currentPrescription.doctorSignature)}
                                        disabled={checkedFields.has('signature')}
                                        className="w-full border-4 border-poke-black p-4 sm:p-5 text-left relative overflow-hidden"
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
                                                <p className="text-poke-black text-xs sm:text-sm font-bold mb-2" >
                                                    ☐ DOCTOR SIGNATURE
                                                </p>
                                                <p className="text-poke-black text-xs sm:text-sm" >
                                                    Dr. {currentPrescription.doctorName}
                                                </p>
                                                {currentPrescription.doctorSignature && (
                                                    <p className="italic text-gray-600 text-sm mt-1">✍️ Signed</p>
                                                )}
                                            </div>
                                            {checkedFields.has('signature') && (
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
                                        className="w-full border-4 border-poke-black p-4 text-left"
                                        style={{
                                            background: checkedFields.has('date')
                                                ? (currentPrescription.isValid ? '#90EE90' : (foundIssues.includes('date') ? '#FFB6C1' : '#90EE90'))
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('date') ? 1 : 0.98 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-xs sm:text-sm font-bold mb-2" >
                                                    ☐ PRESCRIPTION DATE
                                                </p>
                                                <p className="text-poke-black text-xs sm:text-sm" >
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
                                        className="w-full border-4 border-poke-black p-4 text-left"
                                        style={{
                                            background: checkedFields.has('patient') ? '#90EE90' : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('patient') ? 1 : 0.98 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-xs sm:text-sm font-bold mb-2" >
                                                    ☐ PATIENT DETAILS
                                                </p>
                                                <p className="text-poke-black text-xs sm:text-sm" >
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
                                        className="w-full border-4 border-poke-black p-4 text-left"
                                        style={{
                                            background: checkedFields.has('dosage')
                                                ? (foundIssues.includes('dosage') ? '#FFB6C1' : '#90EE90')
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('dosage') ? 1 : 0.98 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-xs sm:text-sm font-bold mb-2" >
                                                    ☐ DOSAGE COMPLETE
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
                                        className="w-full border-4 border-poke-black p-4 text-left"
                                        style={{
                                            background: checkedFields.has('allergies')
                                                ? (foundIssues.includes('allergies') ? '#FFB6C1' : '#90EE90')
                                                : '#FFFFFF',
                                            boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                                        }}
                                        whileTap={{ scale: checkedFields.has('allergies') ? 1 : 0.98 }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-poke-black text-xs sm:text-sm font-bold mb-2" >
                                                    ☐ DRUG ALLERGIES
                                                </p>
                                                <p className="text-poke-black text-xs sm:text-sm" >
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
                                                PROCEED TO PREPARATION →
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
