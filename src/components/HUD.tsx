import { useState } from 'react';
import { ArrowUpRight, House } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Modal } from './Modal';
import { Button } from './Button';
import { PharmacyArt, StationRoute, stations } from './PharmacyScene';

interface HUDProps {
  onBackToHome: () => void;
  caseCount: number;
}

export function HUD({ onBackToHome, caseCount }: HUDProps) {
  const { currentStage, currentLevel, currentYear, currentPrescription, score, rxPoints, playerLevel } = useGameStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const station = stations[currentStage];
  const queueNumber = 'P' + String(100 + currentLevel);
  const counter = currentStage === 'receiving' ? '01' : currentStage === 'dispensing' ? '02' : null;

  return (
    <>
      <header className="shift-hud">
        <div className="shift-bar">
          <button type="button" className="shift-home" onClick={() => setShowConfirmModal(true)}>
            <House size={17} aria-hidden="true" /> <span>Pharm Life</span>
          </button>
          <span className="shift-rank">{playerLevel}</span>
          <dl className="shift-totals">
            <div><dt>Case score</dt><dd>{score}</dd></div>
            <div><dt>Rx points</dt><dd>{rxPoints}</dd></div>
          </dl>
        </div>
        <div className={`workstation-scene scene-${currentStage}`}>
          <PharmacyArt />
          <motion.div
            key={`${currentStage}-${currentLevel}`}
            className="workstation-title"
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="scene-kicker">Year {currentYear} <span aria-hidden="true">/</span> Case {currentLevel} of {caseCount}</p>
            <h1>{station.place}</h1>
            {currentPrescription && <p className="workstation-patient">{currentPrescription.patientName}</p>}
          </motion.div>
          <div className="pharmacy-queue">
            <div className="queue-display" aria-label={counter ? 'Pharmacy queue display' : 'Current queue ticket'}>
              <span>Queue no.</span>{counter && <span>Counter</span>}
              <strong>{queueNumber}</strong>{counter && <strong>{counter}</strong>}
            </div>
            <a href="#workstation" className="workstation-jump">Go to task <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <StationRoute activeStage={currentStage} />
      </header>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Leave the shift?">
        <div className="space-y-4">
          <p>Returning to the main menu resets your current case. Your Rx points stay with you for this session.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={onBackToHome} fullWidth>Leave shift</Button>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} fullWidth>Stay on shift</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
