import { useSceneMoment } from '../../scene/shiftScene';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { medicalAbbreviations, convertDuration } from '../../data/prescriptions';

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
  const printTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(printTimer.current), []);

  // New state to track attempts and help stuck users
  const [attempts, setAttempts] = useState(0);

  // Patient dialogue state
  const [showPatientDialogue, setShowPatientDialogue] = useState(false);
  const [patientQuestion, setPatientQuestion] = useState('');

  // Scroll to top when moving to next medication
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(scrollTimer);
  }, [currentMedIndex]);

  const canPrint = Boolean(labelData.quantity && labelData.dosageForm && labelData.frequency);

  useSceneMoment({
    stage: 'typing',
    speaker: showPatientDialogue ? currentPrescription?.patientName : 'Pharmacy technician',
    caption: showPatientDialogue ? patientQuestion : isPrinting ? 'Printing the label…' : 'I’ll set up the printer. Enter the directions from the prescription.',
    gesture: isPrinting ? 'print' : undefined,
    actionLabel: canPrint && !isPrinting ? 'Print medication label' : 'Use the label printer',
  }, handlePrinterInteraction);

  function handlePrinterInteraction() {
    if (!currentPrescription || isPrinting || showResult || showPatientDialogue) return;
    if (canPrint) handlePrintLabel();
    else document.getElementById('label-quantity')?.focus();
  }


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
    if (printTimer.current !== undefined) return;
    setIsPrinting(true);

    printTimer.current = setTimeout(() => {
      printTimer.current = undefined;
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
        setAttempts(prev => prev + 1); // Increment attempts on failure

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
    if (response !== 'recheck') setShowResult(true);
  };

  const handleContinue = () => {
    if (isCorrect) {
      // Proceed straight to next step; counseling handled in Dispensing stage
      proceedToNext();
    } else {
      // Retry
      // Do NOT clear labelData
      setShowResult(false);
    }
  };

  const handleAutoFill = () => {
    // Find correct frequency value
    const expectedAbbrs = currentMed.frequency.split('or').map((part) => part.trim());
    const correctFreq = frequencyOptions.find(f => expectedAbbrs.includes(f.abbr))?.value || '';

    setLabelData({
      quantity: currentMed.quantity.toString(),
      dosageForm: medication.dosageForm,
      frequency: correctFreq,
      specialInstructions: specialInstructionLabel || '',
    });

    // Reset attempts so button disappears? Or keep it? keeping it is fine.
    // Maybe show a toast or highlight effect? For now just filling is enough feedback as inputs change.
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
      setAttempts(0); // Reset attempts for next med
      setShowResult(false);
    } else {
      // All medications labeled
      nextStage();
    }
  };

  return (
    <div className="container-custom label-desk">
      <motion.div initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} className="label-workflow">
        <header className="label-desk-heading">
          <div>
            <h2>Prepare the medication label</h2>
            <p>Use the prescription to choose the amount per dose, form, and frequency.</p>
          </div>
          {currentPrescription.medications.length > 1 && (
            <p className="label-item-count">Item {currentMedIndex + 1} of {currentPrescription.medications.length}</p>
          )}
        </header>

        <div className="label-desk-grid">
          <section className="label-document" aria-label="Prescription directions">
            <h3>Prescription</h3>
            <p className="label-medicine-name">{medication.genericName}</p>
            {medication.strength && !medication.genericName.includes(medication.strength) && <p>{medication.strength}</p>}
            <dl className="label-directions">
              <div><dt>Directions</dt><dd>{currentMed.dosageInstruction} {currentMed.frequency}{currentMed.specialInstructions ? ` ${currentMed.specialInstructions}` : ''}</dd></div>
              {currentMed.duration && <div><dt>Duration / supply</dt><dd>{convertDuration(currentMed.duration)}</dd></div>}
              {specialInstructionLabel && <div><dt>Special instructions</dt><dd>{specialInstructionLabel}</dd></div>}
            </dl>
            <details className="label-reference">
              <summary>Abbreviation guide</summary>
              <dl>
                {Object.entries(medicalAbbreviations).slice(0, 8).map(([abbreviation, meaning]) => (
                  <div key={abbreviation}><dt>{abbreviation}</dt><dd>{meaning}</dd></div>
                ))}
              </dl>
            </details>
          </section>

          <section className="label-form" aria-label="Label printer">
            <div className="label-field">
              <label htmlFor="label-quantity">Amount per dose</label>
              <select id="label-quantity" data-scene-task value={labelData.quantity} onChange={(event) => setLabelData({ ...labelData, quantity: event.target.value })}>
                <option value="">Choose an amount</option>
                {getQuantityOptions().map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}{['liquid', 'syrup'].includes(medication.dosageForm) ? ' mL' : medication.dosageForm === 'inhaler' ? ` puff${amount > 1 ? 's' : ''}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="label-field">
              <label htmlFor="label-dosageForm">Dosage form</label>
              <select id="label-dosageForm" value={labelData.dosageForm} onChange={(event) => setLabelData({ ...labelData, dosageForm: event.target.value })}>
                <option value="">Choose a form</option>
                {dosageFormOptions.map((form) => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
            <div className="label-field">
              <label htmlFor="label-frequency">Frequency</label>
              <select id="label-frequency" value={labelData.frequency} onChange={(event) => setLabelData({ ...labelData, frequency: event.target.value })}>
                <option value="">Choose a frequency</option>
                {frequencyOptions.map(({ value }) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>

            {canPrint && (
              <motion.div className="printed-label p-4 label-preview" aria-label="Medication label preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="label-preview-name">Label preview · {currentPrescription.patientName}</p>
                <p><strong>{medication.genericName}</strong></p>
                <p>Take {labelData.quantity}{
                  ['liquid', 'syrup'].includes(labelData.dosageForm) ? ' mL'
                    : labelData.dosageForm === 'inhaler' ? ` puff${Number(labelData.quantity) > 1 ? 's' : ''}`
                      : ` ${labelData.dosageForm}${Number(labelData.quantity) > 1 ? 's' : ''}`
                } {labelData.frequency}</p>
                {specialInstructionLabel && <p>{specialInstructionLabel}</p>}
              </motion.div>
            )}

            <button type="button" className="shift-button label-print" onClick={handlePrintLabel} disabled={!canPrint || isPrinting}>
              <Printer size={20} aria-hidden="true" /> {isPrinting ? 'Printing…' : 'Print label'}
            </button>

            <Hint
              title="Need help with the label?"
              hints={[
                'Compare the dose with the strength of one tablet or capsule to work out how many are needed.',
                'Open the abbreviation guide if you need to check the frequency.',
                'For a liquid or inhaler, check the number of millilitres or puffs in the directions.',
                'Special instructions appear in words on the label preview.',
              ]}
            />
            {attempts >= 3 && <button type="button" className="label-autofill" onClick={handleAutoFill}>Show the correct label settings</button>}
          </section>
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
