import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, House, Map, RotateCcw, RotateCw, Volume2, VolumeX, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getPharmacyQueueNumber, useShiftScene } from '../scene/shiftScene';
import type { PharmacyView } from '../scene/pharmacyWorld';
import { useShiftAudio } from '../scene/useShiftAudio';
import { Modal } from './Modal';
import { Button } from './Button';
import { StationRoute, stations } from './PharmacyScene';

const PharmacyViewport = lazy(() => import('../scene/PharmacyViewport'));

interface HUDProps {
  onBackToHome: () => void;
  onRestart: () => void;
  caseCount: number;
  children: ReactNode;
}

export function HUD({ onBackToHome, onRestart, caseCount, children }: HUDProps) {
  const { currentStage, currentLevel, currentYear, currentPrescription, score, rxPoints, playerLevel } = useGameStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [navigation, setNavigation] = useState<{ step: string; view: PharmacyView; taskOpen: boolean }>();
  const [deskInset, setDeskInset] = useState(0);
  const [rotationRequest, setRotationRequest] = useState(0);
  const deskRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const openTaskButton = useRef<HTMLButtonElement>(null);
  const restoreSceneFocus = useRef(false);
  const reopenTask = useRef<'desk' | 'scene' | null>(null);
  const step = `${currentLevel}-${currentStage}`;
  const previousStep = useRef(step);
  const currentNavigation = navigation?.step === step ? navigation : undefined;
  const view = currentNavigation?.view ?? currentStage;
  const taskOpen = currentNavigation?.taskOpen ?? (currentStage === 'typing' || currentStage === 'picking');
  const pickingLayout = currentStage === 'picking' && view === 'picking';
  const previewing = view !== currentStage;
  const scene = useShiftScene();
  const moment = scene?.moment?.stage === currentStage ? scene.moment : undefined;
  const queueNumber = getPharmacyQueueNumber(currentLevel);
  const counter = currentStage === 'receiving' ? '01' : currentStage === 'dispensing' ? '02' : null;
  const taskLabel = moment?.actionLabel ?? (currentStage === 'receiving' ? 'Open patient file' : 'Open workstation');
  const shelfProducts = pickingLayout ? moment?.products : undefined;
  const basketCount = moment?.products?.filter(({ selected }) => selected).length ?? 0;
  const audio = useShiftAudio(currentStage, currentLevel, moment?.gesture, basketCount);

  useEffect(() => {
    sceneRef.current?.querySelector('h1')?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const desk = deskRef.current;
    if (!desk) return;
    const desktop = window.matchMedia('(min-width: 851px)');
    const measure = () => setDeskInset(taskOpen && !pickingLayout && desktop.matches ? desk.clientWidth + 20 : 0);
    const observer = new ResizeObserver(measure);
    observer.observe(desk);
    desktop.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      desktop.removeEventListener('change', measure);
    };
  }, [pickingLayout, taskOpen]);

  useEffect(() => {
    if (!taskOpen && restoreSceneFocus.current) {
      restoreSceneFocus.current = false;
      sceneRef.current?.scrollIntoView({ block: 'nearest' });
      const marker = sceneRef.current?.querySelector<HTMLElement>('.world-marker');
      (marker ?? openTaskButton.current)?.focus({ preventScroll: true });
    }
    if (!taskOpen || !reopenTask.current) return;
    const task = document.getElementById('workstation');
    const control = reopenTask.current === 'scene'
      ? task?.querySelector<HTMLElement>('[data-scene-task]')
      : null;
    reopenTask.current = null;
    (control ?? task)?.focus();
  }, [taskOpen]);

  useEffect(() => {
    if (deskRef.current) deskRef.current.scrollTop = 0;
    if (previousStep.current !== step) {
      if (window.matchMedia('(max-width: 850px)').matches) {
        sceneRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      sceneRef.current?.querySelector('h1')?.focus({ preventScroll: true });
    }
    previousStep.current = step;
  }, [step]);

  useEffect(() => {
    if (moment?.gesture === 'handover' && window.matchMedia('(max-width: 850px)').matches) {
      sceneRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [moment?.gesture]);

  function showTask(focus = false) {
    if (focus) {
      if (taskOpen) document.getElementById('workstation')?.focus();
      else reopenTask.current = 'desk';
    }
    setNavigation({ step, view: currentStage, taskOpen: true });
  }

  function visitStation(target: PharmacyView) {
    if (target === currentStage) showTask(true);
    else setNavigation({ step, view: target, taskOpen: false });
  }

  function handleSceneAction() {
    if (!taskOpen) {
      if (moment?.canActFromScene) scene?.action.current?.();
      else reopenTask.current = 'scene';
      showTask();
      return;
    }
    if (moment?.canActFromScene) scene?.action.current?.();
  }

  function closeTask() {
    restoreSceneFocus.current = true;
    setNavigation({ step, view: currentStage, taskOpen: false });
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
          {audio.supported && (
            <button type="button" className="shift-sound" aria-label="Shift sounds" aria-pressed={audio.enabled} title={audio.enabled ? 'Mute shift sounds' : 'Enable shift sounds'} onClick={audio.toggle}>
              {audio.enabled ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
            </button>
          )}
          <button type="button" className="shift-restart" aria-label="Restart shift" onClick={onRestart}>
            <RotateCcw size={17} aria-hidden="true" /> <span>Restart<span className="shift-restart-word"> shift</span></span>
          </button>
        </div>
        <StationRoute activeStage={currentStage} viewedStage={view === 'overview' ? undefined : view} onVisit={visitStation} />
      </header>

      <div className="shift-layout" data-task-open={taskOpen} data-picking={pickingLayout}>
        <section ref={sceneRef} id="pharmacy-scene" tabIndex={-1} className="play-scene" aria-label="Pharmacy scene">
          <Suspense fallback={<div className="pharmacy-world"><p className="world-status" role="status">Opening the pharmacy…</p></div>}>
            <PharmacyViewport
              stage={currentStage}
              view={view}
              deskInset={deskInset}
              rotationRequest={rotationRequest}
              caseNumber={currentLevel}
              onTask={handleSceneAction}
              showTaskMarker={!taskOpen || moment?.canActFromScene === true}
              taskMarkerLabel={taskLabel}
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
              <h1 tabIndex={-1}>{view === 'overview' ? 'Pharmacy map' : stations[view].place}</h1>
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
            <button type="button" className="world-control scene-rotate" onClick={() => setRotationRequest(count => count + 1)} aria-label="Rotate 3D view">
              <RotateCw size={17} aria-hidden="true" /> Rotate
            </button>
            {!taskOpen && (
              <button ref={openTaskButton} type="button" className={`world-control ${previewing ? '' : 'scene-task-fallback'}`} onClick={previewing ? () => showTask(true) : handleSceneAction}>
                {previewing ? 'Return to active task' : taskLabel} <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
          {taskOpen && (
            <a className="mobile-task-link" href={shelfProducts?.length ? '#picking-basket' : '#workstation'}>
              {shelfProducts?.length ? `Basket (${basketCount})` : 'Go to task'} <ArrowDown size={14} aria-hidden="true" />
            </a>
          )}
        </section>
        <div ref={deskRef} className="shift-task" hidden={!taskOpen}>
          {!pickingLayout && taskOpen && (
            <div className="task-dock-controls">
              <button type="button" onClick={closeTask}><X size={16} aria-hidden="true" /> Close task</button>
            </div>
          )}
          {children}
        </div>
      </div>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Leave the shift?">
        <div className="space-y-4">
          <p>Leaving clears your progress through the cases. Your Rx points stay with you for this session.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={onBackToHome} fullWidth>Leave shift</Button>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} fullWidth>Stay on shift</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
