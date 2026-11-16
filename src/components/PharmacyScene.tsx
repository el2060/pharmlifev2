import { lazy, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { ArrowDownToLine, Check, ClipboardList, MessageCircle, Printer } from 'lucide-react';
import type { GameStage } from '../types/game.types';

export const stations = {
  receiving: { name: 'Receiving', place: 'Prescription counter', icon: ClipboardList },
  typing: { name: 'Typing', place: 'Label station', icon: Printer },
  picking: { name: 'Picking & packing', place: 'Medication shelves', icon: ArrowDownToLine },
  dispensing: { name: 'Dispensing', place: 'Counselling counter', icon: MessageCircle },
};

const stationOrder: GameStage[] = ['receiving', 'typing', 'picking', 'dispensing'];

interface StationRouteProps {
  activeStage?: GameStage;
  completed?: Record<GameStage, boolean>;
}

export function StationRoute({ activeStage }: StationRouteProps) {
  return (
    <ol className="station-route" aria-label="Pharmacy workflow">
      {stationOrder.map((stage, index) => {
        const active = stage === activeStage;
        const complete = activeStage !== undefined && index < stationOrder.indexOf(activeStage);
        const Icon = complete ? Check : stations[stage].icon;

        return (
          <li key={stage} aria-current={active ? 'step' : undefined} className={complete ? 'station-done' : undefined}>
            <span className="station-route-icon"><Icon size={19} aria-hidden="true" /></span>
            <span>
              <strong>{stations[stage].name}</strong>
              <small>{stations[stage].place}</small>
            </span>
            {complete && <span className="sr-only">Complete</span>}
          </li>
        );
      })}
    </ol>
  );
}

const PharmacyViewport = lazy(() => import('../scene/PharmacyViewport'));

export function PharmacyArt() {
  return (
    <div className="pharmacy-art" aria-hidden="true">
      <Suspense fallback={null}><PharmacyViewport /></Suspense>
    </div>
  );
}

export function NPLogo() {
  return <img className="np-logo" src={import.meta.env.BASE_URL + 'np-logo.png'} alt="Ngee Ann Polytechnic" />;
}

export function PreceptorNote({ step, children }: { step: string; children: ReactNode }) {
  const note = useRef<HTMLElement>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step && step !== 'outcome') note.current?.focus();
    previousStep.current = step;
  }, [step]);

  return (
    <aside ref={note} tabIndex={-1} className="preceptor-note" aria-label="Preceptor guidance">
      <span><ClipboardList size={20} aria-hidden="true" /></span>
      <div><small>Preceptor</small><p>{children}</p></div>
    </aside>
  );
}
