import { lazy, Suspense, useState, type ReactNode } from 'react';
import { ArrowDown, House } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getPharmacyQueueNumber, useShiftScene } from '../scene/shiftScene';
import { Modal } from './Modal';
import { Button } from './Button';
import { StationRoute, stations } from './PharmacyScene';

const PharmacyViewport = lazy(() => import('../scene/PharmacyViewport'));

interface HUDProps {
  onBackToHome: () => void;
  caseCount: number;
  children: ReactNode;
}

export function HUD({ onBackToHome, caseCount, children }: HUDProps) {
  const { currentStage, currentLevel, currentYear, currentPrescription, score, rxPoints, playerLevel } = useGameStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const scene = useShiftScene();
  const moment = scene?.moment?.stage === currentStage ? scene.moment : undefined;
  const station = stations[currentStage];
  const queueNumber = getPharmacyQueueNumber(currentLevel);
  const counter = currentStage === 'receiving' ? '01' : currentStage === 'dispensing' ? '02' : null;

  function handleSceneAction() {
    const action = scene?.action.current;
    if (action) {
      action();
      return;
    }
    const task = document.getElementById('workstation');
    const control = task?.querySelector<HTMLElement>('[data-scene-task], .med-carton');
    (control ?? task)?.focus();
  }

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
        <StationRoute activeStage={currentStage} />
      </header>

      <div className="shift-layout">
        <section className={`play-scene scene-${currentStage}`} aria-label="Pharmacy scene">
          <Suspense fallback={<div className="pharmacy-world" data-renderer="image"><div className="pharmacy-world-fallback" /></div>}>
            <PharmacyViewport stage={currentStage} caseNumber={currentLevel} onTask={handleSceneAction} moment={moment} onChoose={(id) => scene?.choose.current?.(id)} />
          </Suspense>
          <motion.div
            key={`${currentStage}-${currentLevel}`}
            className="play-scene-title"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p className="scene-kicker">Year {currentYear} <span aria-hidden="true">/</span> Case {currentLevel} of {caseCount}</p>
              <h1>{station.place}</h1>
              {currentPrescription && <p className="workstation-patient">{currentPrescription.patientName}</p>}
            </div>
            <div className="queue-display" aria-label={counter ? 'Pharmacy queue display' : 'Current queue ticket'}>
              <span>Queue no.</span>{counter && <span>Counter</span>}
              <strong>{queueNumber}</strong>{counter && <strong>{counter}</strong>}
            </div>
          </motion.div>
          <a className="mobile-task-link" href="#workstation">Go to task <ArrowDown size={14} aria-hidden="true" /></a>
        </section>
        {children}
      </div>

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
