import { motion } from 'framer-motion';
import { ContactRound } from 'lucide-react';
import type { Prescription } from '../../types/game.types';

export function PatientIdentityCard({ prescription }: { prescription: Prescription }) {
  const { identityMismatch, patientName, patientIC, patientDOB, patientAddress } = prescription;
  const name = identityMismatch?.field === 'name' ? identityMismatch.actualValue : patientName;
  const ic = identityMismatch?.field === 'ic' ? identityMismatch.actualValue : patientIC;

  return (
    <motion.section
      className="patient-id"
      aria-label="Patient identification"
      initial={{ opacity: 0, rotateY: -8, y: 6 }}
      animate={{ opacity: 1, rotateY: 0, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="patient-id-heading">
        <ContactRound size={21} aria-hidden="true" />
        <h4>Singapore identity card</h4>
        <small>Training copy</small>
      </div>
      <dl>
        <div><dt>Name</dt><dd>{name}</dd></div>
        <div><dt>IC number</dt><dd>{ic}</dd></div>
      </dl>
      {(patientDOB || patientAddress) && (
        <details className="rx-source-details">
          <summary>Other ID details</summary>
          <dl>
            {patientDOB && <div><dt>Date of birth</dt><dd>{patientDOB}</dd></div>}
            {patientAddress && <div><dt>Address</dt><dd>{patientAddress}</dd></div>}
          </dl>
        </details>
      )}
    </motion.section>
  );
}
