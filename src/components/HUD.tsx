import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, House, Map, PanelRightClose, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getPharmacyQueueNumber, useShiftScene } from '../scene/shiftScene';
import type { PharmacyView } from '../scene/pharmacyWorld';
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
  const [navigation, setNavigation] = useState<{ step: string; view: PharmacyView; taskOpen: boolean }>();
  const [deskInset, setDeskInset] = useState(0);
  const deskRef = useRef<HTMLDivElement>(null);
  const reopenTask = useRef(false);
  const step = `${currentLevel}-${currentStage}`;
  const currentNavigation = navigation?.step === step ? navigation : undefined;
  const view = currentNavigation?.view ?? currentStage;
  const taskOpen = currentNavigation?.taskOpen ?? true;
  const previewing = view !== currentStage;
  const scene = useShiftScene();
  const moment = scene?.moment?.stage === currentStage ? scene.moment : undefined;
  const queueNumber = getPharmacyQueueNumber(currentLevel);
  const counter = currentStage === 'receiving' ? '01' : currentStage === 'dispensing' ? '02' : null;

  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const desktop = window.matchMedia('(min-width: 851px)');
    const measure = () => setDeskInset(taskOpen && desktop.matches ? desk.clientWidth + 20 : 0);
    const observer = new ResizeObserver(measure);
    observer.observe(desk);
    desktop.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      desktop.removeEventListener('change', measure);
    };
  }, [taskOpen]);

  useEffect(() => {
    if (!taskOpen || !reopenTask.current) return;
    reopenTask.current = false;
    document.getElementById('workstation')?.focus();
  }, [taskOpen]);

  useEffect(() => {
    if (deskRef.current) deskRef.current.scrollTop = 0;
  }, [step]);

  function showTask(focus = false) {
    if (focus) {
      if (taskOpen) document.getElementById('workstation')?.focus();
      else reopenTask.current = true;
    }
    setNavigation({ step, view: currentStage, taskOpen: true });
  }

  function visitStation(target: PharmacyView) {
    if (target === currentStage) showTask(true);
    else setNavigation({ step, view: target, taskOpen: false });
  }

  function handleSceneAction() {
    if (!taskOpen) {
      showTask(true);
      return;
    }
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
        <StationRoute activeStage={currentStage} viewedStage={view === 'overview' ? undefined : view} onVisit={visitStation} />
      </header>

      <div className="shift-layout" data-task-open={taskOpen}>
        <section className="play-scene" aria-label="Pharmacy scene">
          <Suspense fallback={<div className="pharmacy-world"><p className="world-status" role="status">Opening the pharmacy…</p></div>}>
            <PharmacyViewport
              stage={currentStage}
              view={view}
              deskInset={deskInset}
              caseNumber={currentLevel}
              onTask={handleSceneAction}
              onVisit={visitStation}
              moment={moment}
              onChoose={(id) => scene?.choose.current?.(id)}
            />
          </Suspense>
          <motion.div
            key={`${view}-${currentLevel}`}
            className="play-scene-title"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p className="scene-kicker">Year {currentYear} <span aria-hidden="true">/</span> Case {currentLevel} of {caseCount}</p>
              <h1>{view === 'overview' ? 'Pharmacy map' : stations[view].place}</h1>
              <p className="workstation-patient" aria-live="polite">
                {previewing ? `Preview · Continue the case at the ${stations[currentStage].place.toLowerCase()}` : currentPrescription?.patientName}
              </p>
            </div>
            <div className="queue-display" aria-label={counter ? 'Pharmacy queue display' : 'Current queue ticket'}>
              <span>Queue no.</span>{counter && <span>Counter</span>}
              <strong>{queueNumber}</strong>{counter && <strong>{counter}</strong>}
            </div>
          </motion.div>
          <div className="world-controls">
            {view !== 'overview' && (
              <button type="button" className="world-control" onClick={() => visitStation('overview')}>
                <Map size={17} aria-hidden="true" /> Pharmacy map
              </button>
            )}
            {taskOpen ? (
              <button type="button" className="world-control scene-hide-task" onClick={() => setNavigation({ step, view: currentStage, taskOpen: false })}>
                <PanelRightClose size={17} aria-hidden="true" /> Hide task
              </button>
            ) : (
              <button type="button" className="world-control scene-show-task" onClick={() => showTask(true)}>
                <RotateCcw size={16} aria-hidden="true" /> {previewing ? 'Return to active task' : 'Show task'}
              </button>
            )}
          </div>
          {taskOpen && <a className="mobile-task-link" href="#workstation">Go to task <ArrowDown size={14} aria-hidden="true" /></a>}
        </section>
        <div ref={deskRef} className="shift-task" hidden={!taskOpen}>
          {children}
        </div>
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
