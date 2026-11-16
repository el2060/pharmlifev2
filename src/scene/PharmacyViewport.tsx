import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { mountPharmacy } from './mountPharmacy';
import type { PharmacyView } from './pharmacyWorld';
import type { SceneMoment, SceneProduct } from './shiftScene';
import type { GameStage } from '../types/game.types';

const locations = {
  receiving: { name: 'Prescription counter', action: 'Open patient file' },
  typing: { name: 'Label station', action: 'Use the label printer' },
  picking: { name: 'Medication shelves', action: 'Inspect the shelves' },
  dispensing: { name: 'Counselling counter', action: 'Speak with the patient' },
} satisfies Record<GameStage, { name: string; action: string }>;

interface PharmacyViewportProps {
  stage?: GameStage;
  view?: PharmacyView;
  deskInset?: number;
  onVisit?: (view: PharmacyView) => void;
  caseNumber?: number;
  onTask?: () => void;
  onChoose?: (id: string) => void;
  moment?: SceneMoment;
}

export default function PharmacyViewport({ stage, view = stage ?? 'overview', deskInset = 0, caseNumber = 1, onTask, onChoose, onVisit, moment }: PharmacyViewportProps) {
  const [renderer, setRenderer] = useState<'pending' | 'webgl' | 'unavailable'>('pending');
  const ready = renderer === 'webgl';
  const [hoveredProduct, setHoveredProduct] = useState<SceneProduct>();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef({ view, deskInset, activeStage: stage ?? 'receiving', caseNumber, moment, choose: (id: string) => onChoose?.(id), ambient: !stage, markers: {} as Partial<Record<GameStage, HTMLButtonElement>> });

  useEffect(() => {
    scene.current.view = view;
    scene.current.deskInset = deskInset;
    scene.current.activeStage = stage ?? 'receiving';
    scene.current.caseNumber = caseNumber;
    scene.current.ambient = !stage;
    scene.current.moment = moment;
    scene.current.choose = (id) => onChoose?.(id);
  }, [view, deskInset, caseNumber, stage, moment, onChoose]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    try {
      return mountPharmacy(element, scene.current, (available) => setRenderer(available ? 'webgl' : 'unavailable'), setHoveredProduct);
    } catch {
      setRenderer('unavailable');
    }
  }, []);

  const markerKeys = !stage ? [] : view === 'overview' ? Object.keys(locations) as GameStage[] : [view];
  const previewing = stage !== undefined && view !== stage;

  return (
    <div className="pharmacy-world" data-renderer={renderer} data-view={view} aria-hidden={stage ? undefined : true}>
      {stage && !ready && (
        <p className="world-status" role="status">
          {renderer === 'pending' ? 'Opening the pharmacy…' : 'The 3D view is unavailable. You can still use the task controls.'}
        </p>
      )}
      <div ref={host} className="pharmacy-world-canvas">
        {hoveredProduct && view === 'picking' && ready && (
          <div className="world-stock-tooltip" aria-hidden="true">
            <strong>{hoveredProduct.name}</strong>
            <span>{hoveredProduct.selected ? 'Return to shelf' : 'Add to the tray'}</span>
          </div>
        )}
      </div>
      {stage && ready && markerKeys.map((key) => (
        <button
          type="button"
          key={key}
          className="world-marker"
          ref={(element) => {
            if (element) scene.current.markers[key] = element;
            else delete scene.current.markers[key];
          }}
          onClick={() => {
            if (view === 'overview') onVisit?.(key);
            else if (key === stage) onTask?.();
            else onVisit?.(stage);
          }}
        >
          <span className="world-marker-dot" aria-hidden="true" />
          <span>{view === 'overview' ? locations[key].name : key === stage ? moment?.actionLabel ?? locations[key].action : 'Return to your station'}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      ))}
      {stage && !previewing && moment?.caption && (
        <div className="world-dialogue" aria-hidden="true" key={moment.caption}>
          <p><strong>{moment.speaker}</strong></p>
          <p>{moment.caption}</p>
        </div>
      )}
    </div>
  );
}
