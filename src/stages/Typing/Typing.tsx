import { useSceneMoment } from '../../scene/shiftScene';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { medicalAbbreviations, convertDuration } from '../../data/prescriptions';

const correctionHints = {
  quantity: 'Check how many tablets, capsules, millilitres, or puffs make one dose.',
  dosageForm: 'Check the dosage form named on the prescription.',
  frequency: 'Check the frequency abbreviation in the prescription or open the abbreviation guide.',
};

export const Typing: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore();
  const [currentMedIndex, setCurrentMedIndex] = useState(0);
  const [labelData, setLabelData] = useState({
    quantity: '',
    dosageForm: '',
    frequency: '',
    specialInstructions: '',
  });
  const [result, setResult] = useState<'printed' | 'held' | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(printTimer.current), []);

  // New state to track attempts and help stuck users
  const [attempts, setAttempts] = useState(0);

  // Patient dialogue state
  const [showPatientDialogue, setShowPatientDialogue] = useState(false);
  const [patientQuestion, setPatientQuestion] = useState('');
  const [flaggedField, setFlaggedField] = useState<keyof typeof correctionHints | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (currentMedIndex > 0) heading.current?.focus();
  }, [currentMedIndex]);

  const canPrint = Boolean(labelData.quantity && labelData.dosageForm && labelData.frequency);
  const printerReady = canPrint && !isPrinting && !result && !showPatientDialogue;

  useSceneMoment({
    stage: 'typing',
    speaker: showPatientDialogue ? currentPrescription?.patientName : 'Pharmacy technician',
    speakerRole: showPatientDialogue ? 'patient' : 'staff',
    caption: showPatientDialogue ? patientQuestion : isPrinting ? 'Printing the label…'
      : result === 'printed' ? 'The label is ready.' : 'Use the prescription to prepare the label.',
    gesture: isPrinting ? 'print' : result === 'printed' ? 'printed' : showPatientDialogue ? 'consider' : 'talk',
    actionLabel: printerReady ? 'Print medication label' : 'Open label workstation',
    canActFromScene: printerReady,
  }, () => {
    if (printerReady) handlePrintLabel();
  });


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

  const specialInstructionLabel = currentMed.specialInstructions?.trim().toLowerCase() === 'prn'
    ? 'when necessary'
    : currentMed.specialInstructions;

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
    setFlaggedField(null);
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

      setIsPrinting(false);

      // If label is wrong, patient asks for confirmation
      if (!isValid) {
        setAttempts(prev => prev + 1); // Increment attempts on failure

        // Patient notices something is off
        const wrongField = labelData.quantity !== currentMed.quantity.toString() ? 'quantity' :
          labelData.dosageForm !== medication.dosageForm ? 'dosageForm' : 'frequency';
        setFlaggedField(wrongField);

        if (wrongField === 'quantity') {
          setPatientQuestion('Can you check how much I should take each time?');
        } else if (wrongField === 'frequency') {
          setPatientQuestion(`The label says ${labelData.frequency}, but I think the doctor said something different...`);
        } else {
          setPatientQuestion(`This doesn't look right to me. Can you double-check the prescription?`);
        }
        setShowPatientDialogue(true);
      } else {
        // Label is correct - show success
        setResult('printed');
        addScore(60);
        addRxPoints(25);
      }
    }, 1500);
  };

  const handlePatientDialogueResponse = (response: 'recheck' | 'insist') => {
    setShowPatientDialogue(false);
    if (response === 'insist') setResult('held');
  };

  const updateField = (field: keyof typeof correctionHints, value: string) => {
    setLabelData({ ...labelData, [field]: value });
    if (flaggedField === field) setFlaggedField(null);
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

    setFlaggedField(null);
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
      setResult(null);
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
            <h2 ref={heading} tabIndex={-1}>Prepare the medication label</h2>
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
              <select id="label-quantity" data-scene-task value={labelData.quantity} onChange={(event) => updateField('quantity', event.target.value)} disabled={isPrinting}>
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
              <select id="label-dosageForm" value={labelData.dosageForm} onChange={(event) => updateField('dosageForm', event.target.value)} disabled={isPrinting}>
                <option value="">Choose a form</option>
                {dosageFormOptions.map((form) => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
            <div className="label-field">
              <label htmlFor="label-frequency">Frequency</label>
              <select id="label-frequency" value={labelData.frequency} onChange={(event) => updateField('frequency', event.target.value)} disabled={isPrinting}>
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

            <div role="status">
              {flaggedField && !showPatientDialogue && !result && <p className="label-correction">{correctionHints[flaggedField]}</p>}
              {!canPrint && <p>Choose all three fields to print the label.</p>}
            </div>
            <button type="button" className="shift-button label-print" onClick={handlePrintLabel} disabled={!printerReady}>
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
            {attempts >= 3 && <button type="button" className="label-autofill" onClick={handleAutoFill} disabled={isPrinting}>Show the correct label settings</button>}
          </section>
        </div>

        <Modal isOpen={result !== null} onClose={() => {}} title={result === 'printed' ? 'Label printed' : 'The label needs checking'} showCloseButton={false}>
          <div className="space-y-4">
            {result === 'printed' ? (
              <>
                <p>The dose, form, and frequency match the prescription for <strong>{medication.genericName}</strong>.</p>
                <p><strong>+25 Rx points</strong></p>
                <button type="button" className="shift-button w-full justify-center" onClick={proceedToNext}>
                  {currentMedIndex < currentPrescription.medications.length - 1 ? 'Label the next medicine' : 'Go to picking & packing'}
                </button>
              </>
            ) : (
              <>
                <p>Giving the patient this label could lead to a dosing error. Check the prescription whenever a patient questions the directions.</p>
                <button type="button" className="shift-button w-full justify-center" onClick={() => setResult(null)}>
                  Review the label
                </button>
              </>
            )}
          </div>
        </Modal>

        <Modal isOpen={showPatientDialogue} onClose={() => {}} title="The patient asks about the label" showCloseButton={false}>
          <div className="space-y-4">
            <blockquote className="patient-label-question">
              <p><strong>{currentPrescription.patientName}</strong></p>
              <p>“{patientQuestion}”</p>
            </blockquote>
            <p>How would you reply?</p>
            <div className="grid gap-3">
              <button type="button" className="conversation-reply" onClick={() => handlePatientDialogueResponse('recheck')}>
                “Let me double-check the prescription for you.”
              </button>
              <button type="button" className="conversation-reply" onClick={() => handlePatientDialogueResponse('insist')}>
                “I’m sure the label is correct.”
              </button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
