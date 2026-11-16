import { useSceneMoment } from '../../scene/shiftScene';
import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, ShoppingCart, X, Plus } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById, getMedicationsByCategory } from '../../data/medications';
import { Medication } from '../../types/game.types';

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
    <div className="picking-desk">
      <header className="label-desk-heading" tabIndex={-1} data-scene-task>
        <div>
          <h2>Pick the medicines</h2>
          <p>Select cartons from the shelf. Match each name and strength to the prescription.</p>
        </div>
      </header>

      <section className="picking-reference" aria-labelledby="picking-prescription">
        <h3 id="picking-prescription">Prescription</h3>
        <ul>
          {currentPrescription.medications.map((order, index) => {
            const medication = getMedicationById(order.medicationId);
            const name = medication?.genericName ?? order.medicationId;
            return (
              <li key={index}>
                <strong>{name}</strong>
                {medication?.strength && !name.includes(medication.strength) && <> · {medication.strength}</>}
                <p>
                  {order.dosageInstruction} {order.frequency}
                  {order.specialInstructions ? ` ${order.specialInstructions}` : ''}
                  {order.duration ? ` × ${order.duration}` : ''}
                </p>
              </li>
            );
          })}
        </ul>
        {currentPrescription.patientAllergies.length > 0 && (
          <p className="picking-allergies"><strong>Allergies</strong> · {currentPrescription.patientAllergies.join(', ')}</p>
        )}
        <details className="label-reference">
          <summary>Patient details</summary>
          <p>{currentPrescription.patientName} · {currentPrescription.patientIC}</p>
        </details>
      </section>

      <section className="picking-basket" aria-labelledby="picking-basket">
        <div className="picking-basket-heading">
          <h3 id="picking-basket" ref={basketHeading} tabIndex={-1}><ShoppingCart size={18} aria-hidden="true" /> Basket</h3>
          <p aria-live="polite">{selectedMedications.length} of {requiredMedIds.length} picked</p>
        </div>
        {selectedMedications.length > 0 && (
          <ul>
            {selectedMedications.map((id) => {
              const medication = getMedicationById(id);
              if (!medication) return null;
              const name = medication.genericName;
              return (
                <li key={id}>
                  <span>{name}{medication.strength && !name.includes(medication.strength) ? ` · ${medication.strength}` : ''}</span>
                  <button type="button" onClick={() => handleSelectMedication(id)} aria-label={`Return ${name} to the shelf`}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button type="button" onClick={handleSubmit} disabled={!selectedMedications.length} className="shift-button w-full justify-center">
          <Package size={19} aria-hidden="true" /> Check basket
        </button>
        <a className="picking-return-link" href="#pharmacy-scene">Back to the 3D shelves</a>
      </section>

      <details className="picking-stock-list">
        <summary>Pick from a text list</summary>
        {Object.entries(availableMedicationsByCategory).map(([category, medicines]) => (
          <section key={category}>
            <h3>{category}</h3>
            <ul>
              {medicines.map((medication) => {
                const selected = selectedMedications.includes(medication.id);
                return (
                  <li key={medication.id}>
                    <button type="button" aria-pressed={selected} onClick={() => handleSelectMedication(medication.id)}>
                      <span><strong>{medication.genericName}</strong><small>{[medication.strength, medication.dosageForm, medication.brandName].filter(Boolean).join(' · ')}</small></span>
                      {selected ? <CheckCircle size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </details>

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
  );
};
