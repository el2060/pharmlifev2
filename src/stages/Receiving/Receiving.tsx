import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, ContactRound, Phone, ScanLine } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { useSceneMoment } from '../../scene/shiftScene';
import type { ConsequenceResult, Prescription } from '../../types/game.types';
import { PatientIdentityCard } from './PatientIdentityCard';

const routineActions = [
  { id: 'prepare', text: 'Send to the label station', detail: 'The identity matches and the prescription can proceed.', icon: ArrowRight },
  { id: 'verify', text: 'Check identity with the patient', detail: 'A patient identifier differs from the prescription.', icon: ContactRound },
  { id: 'clarify', text: 'Hold and call the prescriber', detail: 'A prescription detail or allergy needs clarification.', icon: Phone },
];

function PrescriptionDocument({ prescription }: { prescription: Prescription }) {
  const { identityMismatch, patientName, patientIC, doctorName, doctorMCR, doctorSignature, clinicAddress, date, medications, patientAddress, remarks } = prescription;
  const name = identityMismatch?.field === 'name' ? identityMismatch.prescriptionValue : patientName;
  const ic = identityMismatch?.field === 'ic' ? identityMismatch.prescriptionValue : patientIC;

  return (
    <section className="receiving-rx" aria-labelledby="receiving-rx-title">
      <h3 id="receiving-rx-title"><ClipboardList size={19} aria-hidden="true" /> Prescription</h3>
      <dl className="receiving-rx-identifiers">
        <div><dt>Name</dt><dd>{name}</dd></div>
        <div><dt>IC number</dt><dd>{ic}</dd></div>
      </dl>
      <ul className="receiving-rx-medications" aria-label="Ordered medicines">
        {medications.map((item, index) => {
          const medication = getMedicationById(item.medicationId);
          return (
            <li key={`${item.medicationId}-${index}`}>
              <strong>{medication?.genericName ?? item.medicationId}</strong>
              <p>{item.dosageInstruction} {item.frequency} {item.specialInstructions}</p>
              <p>Duration / supply <strong>{item.duration || '—'}</strong></p>
            </li>
          );
        })}
      </ul>
      {remarks && <p className="receiving-rx-remarks">Remarks <strong>{remarks}</strong></p>}
      <details className="rx-source-details">
        <summary>Prescriber and visit details</summary>
        <dl className="receiving-rx-metadata">
          <div><dt>Prescriber</dt><dd>{doctorName}{doctorMCR && ` (${doctorMCR})`}</dd></div>
          <div><dt>Signature</dt><dd>{doctorSignature ? 'Signed' : 'Missing'}</dd></div>
          <div><dt>Date</dt><dd>{date || 'Missing'}</dd></div>
          {clinicAddress && <div><dt>Clinic</dt><dd>{clinicAddress}</dd></div>}
          {patientAddress && <div><dt>Patient address</dt><dd>{patientAddress}</dd></div>}
        </dl>
      </details>
    </section>
  );
}

function routineFeedback(prescription: Prescription, action: string): ConsequenceResult {
  const expected = prescription.identityMismatch ? 'verify' : prescription.isValid ? 'prepare' : 'clarify';
  const isCorrect = action === expected;
  const ready = expected === 'prepare';
  const safetyNote = prescription.patientAllergies.some((allergy) => allergy.toUpperCase() !== 'NKDA')
    ? 'The recorded allergy does not match the medicine ordered in this case.'
    : 'There is no recorded drug allergy in this case.';
  const explanation = ready
    ? `The name and IC match, and the prescription is complete. ${safetyNote}`
    : expected === 'verify'
      ? 'The name or IC differs between the documents. Verify the details before processing the prescription.'
      : 'The prescription needs clarification. Check the prescription fields and contact the prescriber before processing it.';

  return {
    isCorrect,
    shouldSkipRemainingStages: isCorrect && !ready,
    scoreImpact: isCorrect ? 85 : 0,
    rxPointsImpact: isCorrect ? 30 : 0,
    outcome: isCorrect ? ready ? 'Prescription ready for labelling' : 'Prescription placed on hold' : 'Review the patient file',
    patientReaction: '',
    explanation,
  };
}

function ReceivingCase({ prescription }: { prescription: Prescription }) {
  const { currentLevel, addScore, addRxPoints, nextStage, completeLevel, setPrescription, setAllergyConflictDetected } = useGameStore();
  const [result, setResult] = useState<ConsequenceResult | null>(null);
  const [selected, setSelected] = useState<string>();
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const decisionHeading = useRef<HTMLHeadingElement>(null);
  const resolving = useRef(false);
  const continuing = useRef(false);
  const retrying = useRef(false);
  const { scenario } = prescription;
  const allergies = prescription.patientAllergies.filter((allergy) => allergy.trim().toUpperCase() !== 'NKDA');
  const actions = scenario?.options ?? (currentLevel % 2 === 0 ? [routineActions[1], routineActions[2], routineActions[0]] : routineActions);

  useSceneMoment({
    stage: 'receiving',
    speaker: result?.patientReaction ? prescription.patientName : result ? 'Preceptor' : prescription.patientName,
    caption: result?.patientReaction || result?.explanation || 'Hello, I’m here to collect my medication. Here’s my IC.',
    actionLabel: result ? 'See case feedback' : 'Open patient file',
    gesture: result ? result.isCorrect ? 'nod' : 'consider' : 'talk',
  });

  useEffect(() => {
    if (result) feedbackHeading.current?.focus();
    else if (retrying.current) {
      retrying.current = false;
      decisionHeading.current?.focus();
    }
  }, [result]);

  function choose(action: string) {
    if (resolving.current) return;
    const feedback = scenario ? scenario.consequences[action] : routineFeedback(prescription, action);
    if (!feedback) return;
    resolving.current = true;
    setSelected(action);
    setResult(feedback);
    addScore(feedback.isCorrect ? feedback.scoreImpact : Math.min(0, feedback.scoreImpact));
    addRxPoints(feedback.isCorrect ? feedback.rxPointsImpact : Math.min(0, feedback.rxPointsImpact));
  }

  function continueCase() {
    if (!result || continuing.current) return;
    if (!result.isCorrect) {
      resolving.current = false;
      setSelected(undefined);
      retrying.current = true;
      setResult(null);
      return;
    }
    continuing.current = true;
    if (result.shouldSkipRemainingStages) {
      completeLevel();
      return;
    }

    if (result.confirmedDurations) {
      const durations = result.confirmedDurations;
      setPrescription({
        ...prescription,
        medications: prescription.medications.map((medication) => durations[medication.medicationId]
          ? { ...medication, duration: durations[medication.medicationId] }
          : medication),
      });
    }
    const hasConflict = prescription.medications.some((item) => {
      const name = getMedicationById(item.medicationId)?.genericName.toLowerCase();
      return name && allergies.some((allergy) => name.includes(allergy.trim().toLowerCase()));
    });
    setAllergyConflictDetected(hasConflict);
    nextStage();
  }

  return (
    <div className="container-custom receiving-desk">
      <header className="receiving-desk-header" tabIndex={-1} data-scene-task={!result || undefined}>
        <h2>Review the patient file</h2>
        <p>Compare the name and IC, then check the medicines against the allergy record and prescription directions.</p>
      </header>

      <div className="receiving-evidence">
        <div className="receiving-record">
          <PatientIdentityCard prescription={prescription} />
          <section className="receiving-allergies" aria-label="Recorded drug allergies">
            <h3>Drug allergies</h3>
            <p>{allergies.length ? allergies.join(', ') : 'No known drug allergies'}</p>
          </section>
        </div>
        <PrescriptionDocument prescription={prescription} />
      </div>

      {!result && (
        <section className="receiving-decision" aria-labelledby="receiving-decision-title">
          <h3 id="receiving-decision-title" tabIndex={-1} ref={decisionHeading}>What would you do at the counter?</h3>
          {scenario && !scenario.documentLed && <p>{scenario.situation} {scenario.question}</p>}
          <div className="receiving-actions">
            {actions.map((action) => {
              const Icon = 'icon' in action ? action.icon : ScanLine;
              return (
                <button key={action.id} type="button" onClick={() => choose(action.id)}>
                  <Icon size={19} aria-hidden="true" />
                  <span><strong>{action.text}</strong>{'detail' in action && <small>{action.detail}</small>}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {result && (
        <section className="receiving-feedback" data-success={result.isCorrect} aria-labelledby="receiving-feedback-title">
          <h3 ref={feedbackHeading} id="receiving-feedback-title" tabIndex={-1} data-scene-task>
            {result.isCorrect && <CheckCircle2 size={20} aria-hidden="true" />}
            {scenario ? (result.isCorrect ? 'Outcome' : 'Pause and review') : result.outcome}
          </h3>
          {scenario && <p><strong>{result.isCorrect ? 'What happened' : 'What could happen'}</strong> {result.outcome}</p>}
          <p><strong>Why it matters</strong> {result.explanation}</p>
          {scenario && result.patientReaction && <p><strong>Patient response</strong> {result.patientReaction}</p>}
          {scenario?.documentLed && <details><summary>Case notes</summary><p>{scenario.situation} {scenario.question}</p></details>}
          <p className="receiving-feedback-choice">You chose {actions.find(({ id }) => id === selected)?.text}.</p>
          <button type="button" className="shift-button" onClick={continueCase}>
            {result.isCorrect ? result.shouldSkipRemainingStages ? 'Call the next patient' : 'Go to the label station' : 'Review and try again'}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      )}
    </div>
  );
}

export function Receiving() {
  const prescription = useGameStore((state) => state.currentPrescription);
  return prescription ? <ReceivingCase key={prescription.id} prescription={prescription} /> : <p>Loading prescription…</p>;
}
