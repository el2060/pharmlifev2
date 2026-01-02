import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Printer, CheckCircle, XCircle } from 'lucide-react';
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

  // Patient dialogue state
  const [showPatientDialogue, setShowPatientDialogue] = useState(false);
  const [patientQuestion, setPatientQuestion] = useState('');

  // Scroll to top when moving to next medication
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentMedIndex]);

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

  const specialInstructionLabel = useMemo(() => {
    if (!currentMed.specialInstructions) return '';
    const text = currentMed.specialInstructions.trim().toLowerCase();
    if (text === 'prn') return 'when necessary';
    return currentMed.specialInstructions;
  }, [currentMed.specialInstructions]);

  const dosageFormOptions = ['tablet', 'capsule', 'syrup', 'inhaler', 'topical'];

  // Generate quantity options based on medication type
  const getQuantityOptions = () => {
    const form = medication.dosageForm;
    if (form === 'liquid' || form === 'syrup') {
      // For liquids/syrups, allow ml values
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
      const expectedAbbrs = currentMed.frequency.split('or').map((part) => part.trim());
      const allowedFrequencies = frequencyOptions
        .filter((f) => expectedAbbrs.includes(f.abbr))
        .map((f) => f.value);

      const isValid =
        labelData.quantity === currentMed.quantity.toString() &&
        labelData.dosageForm === medication.dosageForm &&
        allowedFrequencies.includes(labelData.frequency);

      setIsCorrect(isValid);
      setIsPrinting(false);

      // If label is wrong, patient asks for confirmation
      if (!isValid) {
        // Patient notices something is off
        const wrongField = labelData.quantity !== currentMed.quantity.toString() ? 'quantity' :
          labelData.dosageForm !== medication.dosageForm ? 'form' : 'frequency';

        if (wrongField === 'quantity') {
          setPatientQuestion(`Wait, this seems like a lot of ${medication.dosageForm}s... Are you sure about the quantity?`);
        } else if (wrongField === 'frequency') {
          setPatientQuestion(`The label says ${labelData.frequency}, but I think the doctor said something different...`);
        } else {
          setPatientQuestion(`This doesn't look right to me. Can you double-check the prescription?`);
        }
        setShowPatientDialogue(true);
      } else {
        // Label is correct - show success
        setShowResult(true);
        addScore(60);
        addRxPoints(25);
      }
    }, 1500);
  };

  const handlePatientDialogueResponse = (response: string) => {
    setShowPatientDialogue(false);
    if (response === 'recheck') {
      // Player catches their mistake
      addScore(30); // Partial credit for catching error
      setLabelData({
        quantity: '',
        dosageForm: '',
        frequency: '',
        specialInstructions: '',
      });
    } else {
      // Player insists it's correct (wrong)
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      // Proceed straight to next step; counseling handled in Dispensing stage
      proceedToNext();
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

  const proceedToNext = () => {
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
  };

  return (
    <div className="container-custom mx-auto p-4 sm:p-6 lg:p-8 max-w-[1500px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 md:space-y-6"
      >
        {/* Pokemon-style Progress Indicator */}
        {currentPrescription.medications.length > 1 && (
          <div
            className="border-4 border-poke-black p-4"
            style={{
              background: '#FFFFFF',
              boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)',
            }}
          >
            <p className="text-poke-black text-sm mb-3 font-bold">
              MEDICATION {currentMedIndex + 1} / {currentPrescription.medications.length}
            </p>
            <div className="w-full border-2 border-poke-black h-6" style={{ background: '#FFFFFF' }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${((currentMedIndex + 1) / currentPrescription.medications.length) * 100}%`,
                  background: '#3075D8',
                  boxShadow: 'inset -2px -2px 0 0 #1A4A8A'
                }}
              />
            </div>
          </div>
        )}

        {/* Quick instruction for the stage */}
        <div className="poke-textbox p-4" style={{ background: '#FFFFFF' }}>
          <p className="text-poke-black text-sm sm:text-base font-bold mb-2" >
            TYPE THE LABEL
          </p>
          <p className="text-poke-black text-xs sm:text-sm" >
            Interpret the prescription and print the medication label. Translate abbreviations before printing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left: Prescription - Pokemon Style */}
          <div
            className="border-4 border-poke-black p-4 sm:p-6"
            style={{
              background: '#FFFFFF',
              boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
            }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-poke-black" >
              <span className="text-2xl">📋</span>
              PRESCRIPTION
            </h3>

            <div className="poke-textbox p-4 space-y-4 mb-4">
              <div>
                <p className="text-sm text-poke-black mb-2 font-bold" >MEDICATION:</p>
                <p className="font-bold text-base text-poke-black" >{medication.genericName}</p>
                <p className="text-sm text-poke-black" >{medication.strength}</p>
              </div>

              <div className="border-t-2 border-poke-black pt-4">
                <p className="text-sm text-poke-black mb-2 font-bold" >INSTRUCTIONS:</p>
                <p className="text-base font-bold text-poke-black break-words" >
                  {currentMed.dosageInstruction} {currentMed.frequency}
                </p>
                {currentMed.duration && (
                  <p className="text-sm text-poke-black mt-2" >Duration: {currentMed.duration}</p>
                )}
              </div>

              {specialInstructionLabel && (
                <div className="border-t-2 border-poke-black pt-4">
                  <p className="text-sm text-poke-black mb-2 font-bold" >SPECIAL:</p>
                  <p className="text-sm text-poke-black" >{specialInstructionLabel}</p>
                </div>
              )}
            </div>

            {/* Abbreviation Helper - Pokemon Style */}
            <div className="border-4 border-poke-black p-3" style={{ background: '#58A8F8' }}>
              <p className="text-sm font-bold text-poke-black mb-3" >QUICK REF:</p>
              <div className="grid grid-cols-2 gap-2 text-xs" >
                {Object.entries(medicalAbbreviations)
                  .slice(0, 8)
                  .map(([abbr, meaning]) => (
                    <div key={abbr} className="flex gap-1 items-start text-poke-black">
                      <span className="font-bold flex-shrink-0">{abbr}:</span>
                      <span className="leading-relaxed">{meaning}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right: Label Builder - Pokemon Style */}
          <div
            className="border-4 border-poke-black p-4 sm:p-6"
            style={{
              background: '#FFFFFF',
              boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
            }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 text-poke-black" >
              <Printer className="text-poke-blue" size={20} />
              LABEL BUILD
            </h3>

            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-poke-black mb-2" >
                  QUANTITY:
                </label>
                <select
                  value={labelData.quantity}
                  onChange={(e) => setLabelData({ ...labelData, quantity: e.target.value })}
                  className="w-full p-3 text-base border-4 border-poke-black focus:outline-none min-h-[56px] text-poke-black font-bold"
                  style={{
                    background: '#FFFFFF',
                    boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF'
                  }}
                >
                  <option value="">SELECT...</option>
                  {getQuantityOptions().map((num) => (
                    <option key={num} value={num}>
                      {num}
                      {(medication.dosageForm === 'liquid' || medication.dosageForm === 'syrup') ? ' ml' : ''}
                      {medication.dosageForm === 'inhaler' ? ' puff' + (num > 1 ? 's' : '') : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dosage Form */}
              <div>
                <label className="block text-sm font-bold text-poke-black mb-2" >
                  FORM:
                </label>
                <select
                  value={labelData.dosageForm}
                  onChange={(e) => setLabelData({ ...labelData, dosageForm: e.target.value })}
                  className="w-full p-3 text-base border-4 border-poke-black focus:outline-none min-h-[56px] text-poke-black font-bold"
                  style={{
                    background: '#FFFFFF',
                    boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF'
                  }}
                >
                  <option value="">SELECT...</option>
                  {dosageFormOptions.map((form) => (
                    <option key={form} value={form}>
                      {form.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-bold text-poke-black mb-2" >
                  FREQUENCY:
                </label>
                <select
                  value={labelData.frequency}
                  onChange={(e) => setLabelData({ ...labelData, frequency: e.target.value })}
                  className="w-full p-3 text-base border-4 border-poke-black focus:outline-none min-h-[56px] text-poke-black font-bold"
                  style={{
                    background: '#FFFFFF',
                    boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF'
                  }}
                >
                  <option value="">SELECT...</option>
                  {frequencyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.abbr.toUpperCase()} - {opt.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label Preview - Pokemon Style */}
              {labelData.quantity && labelData.dosageForm && labelData.frequency && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="poke-textbox p-4"
                >
                  <p className="text-xs text-poke-black mb-3 font-bold" >PREVIEW:</p>
                  <p className="font-bold text-sm text-poke-black mb-2" >
                    {medication.genericName}
                  </p>
                  <p className="text-xs text-poke-black mb-2" >
                    {medication.strength}
                  </p>
                  <p className="mt-3 text-sm text-poke-black break-words" >
                    Take {labelData.quantity}{['liquid', 'syrup'].includes(labelData.dosageForm) ? 'ml' : ` ${labelData.dosageForm}(s)`} {labelData.frequency}
                  </p>
                  {specialInstructionLabel && (
                    <p className="text-xs text-poke-black mt-2" >{specialInstructionLabel}</p>
                  )}
                </motion.div>
              )}

              {/* Hints - Pokemon Style */}
              <div className="block">
                <Hint
                  title="Need help with the label?"
                  hints={[
                    "Look at the prescription instructions on the left - the abbreviations show the frequency",
                    "Check the 'Quick Reference' guide to translate abbreviations like 'bd', 'tds', 'om', 'on'",
                    "The quantity per dose is the number before 'tab', 'ml', or 'puffs' in the dosage instruction",
                    "The dosage form should match the medication type - tablets for pills, liquid for syrups, inhaler for puffs",
                    "Special instructions are already written out as words (e.g., 'when necessary') in the label preview"
                  ]}
                />
              </div>

              {/* Print Button - Pokemon Style */}
              <motion.button
                onClick={handlePrintLabel}
                disabled={!labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting}
                className={`w-full px-6 text-base font-bold flex items-center justify-center gap-3 min-h-[56px] border-4 border-poke-black ${!labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting
                  ? 'text-poke-gray cursor-not-allowed'
                  : 'text-poke-white'
                  }`}
                style={{
                  background: !labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting
                    ? '#888888'
                    : '#3075D8',
                  boxShadow: !labelData.quantity || !labelData.dosageForm || !labelData.frequency || isPrinting
                    ? 'inset -2px -2px 0 0 #606060, inset 2px 2px 0 0 #AAAAAA'
                    : 'inset -2px -2px 0 0 #1A4A8A, inset 2px 2px 0 0 #58A8F8, 4px 4px 0 0 rgba(0,0,0,0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isPrinting ? (
                  <>
                    <div className="spinner w-5 h-5 border-2" />
                    PRINTING...
                  </>
                ) : (
                  <>
                    <Printer size={20} />
                    PRINT LABEL
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Result Modal - Pokemon Style */}
        <Modal isOpen={showResult} onClose={() => { }} showCloseButton={false}>
          <div className="text-center">
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="mx-auto mb-6"
                >
                  <CheckCircle size={64} className="text-pharm-green mx-auto" fill="currentColor" />
                </motion.div>
                <h3 className="text-xl font-bold text-poke-black mb-4" >
                  PERFECT!
                </h3>
                <p className="text-poke-black mb-4 text-base" >
                  Label created correctly!
                </p>
                <div className="border-4 border-poke-black p-3 mb-6" style={{ background: '#FFD700' }}>
                  <p className="text-poke-black font-bold text-base" >
                    +25 Rx Points
                  </p>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto mb-6 animate-shake"
                >
                  <XCircle size={64} className="text-poke-red mx-auto" fill="currentColor" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-poke-black mb-3 sm:mb-4" >
                  WRONG LABEL!
                </h3>

                {/* Show Consequence */}
                <div className="bg-red-100 border-4 border-red-600 p-4 sm:p-5 mb-3 sm:mb-4 rounded text-left">
                  <p className="text-xs sm:text-sm font-bold text-red-900 mb-2" >
                    CONSEQUENCE:
                  </p>
                  <p className="text-sm sm:text-base text-red-800 leading-relaxed" >
                    Patient followed your incorrect label and took the wrong dosage. This could lead to treatment failure or adverse effects!
                  </p>
                </div>

                <div className="bg-yellow-100 border-4 border-yellow-600 p-4 sm:p-5 mb-4 sm:mb-6 rounded text-left">
                  <p className="text-xs sm:text-sm font-bold text-yellow-900 mb-2" >
                    💡 LEARNING POINT:
                  </p>
                  <p className="text-sm sm:text-base text-yellow-800 leading-relaxed" >
                    Always double-check prescription instructions before printing labels. When patients question the label, take it seriously and review carefully!
                  </p>
                </div>
              </>
            )}
            <motion.button
              onClick={handleContinue}
              className="w-full px-6 text-base font-bold flex items-center justify-center gap-3 min-h-[56px] border-4 border-poke-black text-poke-white"
              style={{
                background: isCorrect ? '#00A85E' : '#3075D8',
                boxShadow: isCorrect
                  ? 'inset -2px -2px 0 0 #006B3A, inset 2px 2px 0 0 #00E57B, 4px 4px 0 0 rgba(0,0,0,0.3)'
                  : 'inset -2px -2px 0 0 #1A4A8A, inset 2px 2px 0 0 #58A8F8, 4px 4px 0 0 rgba(0,0,0,0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isCorrect ? (
                currentMedIndex < currentPrescription.medications.length - 1
                  ? 'NEXT MED ▶'
                  : 'TO PICKING ▶'
              ) : (
                '◀ TRY AGAIN'
              )}
            </motion.button>
          </div>
        </Modal>

        {/* Patient Dialogue Modal - When label has errors */}
        <Modal isOpen={showPatientDialogue} onClose={() => { }} showCloseButton={false}>
          <div className="text-center">
            {/* Patient Avatar */}
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-4xl sm:text-5xl border-4 border-blue-500 shadow-lg">
                  🤔
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl sm:text-3xl animate-bounce">
                  💭
                </div>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-poke-black mb-3 sm:mb-4" >
              PATIENT QUESTION
            </h3>

            <div className="border-4 border-yellow-600 bg-yellow-100 p-4 sm:p-5 mb-4 sm:mb-6 rounded">
              <p className="text-poke-black text-base sm:text-lg leading-relaxed font-medium" >
                "{patientQuestion}"
              </p>
            </div>

            <p className="text-sm sm:text-base mb-3 sm:mb-4 text-gray-600 font-bold" >
              How do you respond?
            </p>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => handlePatientDialogueResponse('recheck')}
                className="w-full p-4 sm:p-5 border-4 border-poke-black text-left bg-green-200 hover:bg-green-300 transition-colors text-sm sm:text-base font-bold"
                style={{
                  lineHeight: '1.5',
                  boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                }}
              >
                "Let me double-check that for you..."<br />
                <span className="text-xs sm:text-sm text-green-800 font-normal">(Review the prescription again)</span>
              </button>

              <button
                onClick={() => handlePatientDialogueResponse('insist')}
                className="w-full p-4 sm:p-5 border-4 border-poke-black text-left bg-red-200 hover:bg-red-300 transition-colors text-sm sm:text-base font-bold"
                style={{
                  lineHeight: '1.5',
                  boxShadow: 'inset -2px -2px 0 0 #888888, inset 2px 2px 0 0 #FFFFFF, 4px 4px 0 0 rgba(0,0,0,0.3)'
                }}
              >
                "I'm sure this is correct."<br />
                <span className="text-xs sm:text-sm text-red-800 font-normal">(Insist label is right)</span>
              </button>
            </div>
          </div>
        </Modal>

      </motion.div>
    </div>
  );
};
