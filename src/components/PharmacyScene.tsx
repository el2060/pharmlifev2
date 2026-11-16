import { lazy, Suspense } from 'react';
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
  viewedStage?: GameStage;
  onVisit?: (stage: GameStage) => void;
}

export function StationRoute({ activeStage, viewedStage, onVisit }: StationRouteProps) {
  return (
    <ol className="station-route" aria-label="Pharmacy workflow">
      {stationOrder.map((stage, index) => {
        const active = stage === activeStage;
        const complete = activeStage !== undefined && index < stationOrder.indexOf(activeStage);
        const preview = stage === viewedStage && !active;
        const Icon = complete ? Check : stations[stage].icon;
        const content = (
          <>
            <span className="station-route-icon"><Icon size={19} aria-hidden="true" /></span>
            <span>
              <strong>{stations[stage].name}</strong>
              <small>{preview ? 'Preview' : stations[stage].place}</small>
            </span>
            {onVisit && (
              <span className="sr-only">{active ? 'Active task' : complete ? 'Complete, preview station' : 'Upcoming, preview station'}</span>
            )}
          </>
        );

        return (
          <li key={stage} aria-current={active ? 'step' : undefined} className={complete ? 'station-done' : undefined} data-preview={preview || undefined}>
            {onVisit ? <button type="button" onClick={() => onVisit(stage)}>{content}</button> : content}
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
