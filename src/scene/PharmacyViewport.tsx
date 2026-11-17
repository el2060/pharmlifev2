import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
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

export type PharmacyRenderer = 'pending' | 'webgl' | 'unavailable';

interface PharmacyViewportProps {
  stage?: GameStage;
  view?: PharmacyView;
  deskInset?: number;
  rotationRequest?: number;
  showTaskMarker?: boolean;
  taskMarkerLabel?: string;
  onVisit?: (view: PharmacyView) => void;
  caseNumber?: number;
  onTask?: () => void;
  onChoose?: (id: string) => void;
  moment?: SceneMoment;
  lobbyPreview?: boolean;
  onRendererChange?: (renderer: PharmacyRenderer) => void;
}

export default function PharmacyViewport({ stage, view = stage ?? 'overview', deskInset = 0, rotationRequest = 0, showTaskMarker = true, taskMarkerLabel, caseNumber = 1, onTask, onChoose, onVisit, moment, lobbyPreview = false, onRendererChange }: PharmacyViewportProps) {
  const [renderer, setRenderer] = useState<PharmacyRenderer>('pending');
  const ready = renderer === 'webgl';
  const [hoveredProduct, setHoveredProduct] = useState<SceneProduct>();
  const [inspectedId, setInspectedId] = useState<string>();
  const inspectedProduct = view === 'picking' ? moment?.products?.find(({ id }) => id === inspectedId) : undefined;
  const host = useRef<HTMLDivElement>(null);
  const stationAction = showTaskMarker ? onTask : undefined;
  const scene = useRef({ view, deskInset, rotationRequest, stationAction, activeStage: stage ?? 'receiving', caseNumber, moment, choose: (id: string) => onChoose?.(id), ambient: !stage, lobbyPreview, markers: {} as Partial<Record<GameStage, HTMLButtonElement>> });

  useEffect(() => onRendererChange?.(renderer), [onRendererChange, renderer]);

  useEffect(() => {
    scene.current.view = view;
    scene.current.deskInset = deskInset;
    scene.current.rotationRequest = rotationRequest;
    scene.current.stationAction = stationAction;
    scene.current.activeStage = stage ?? 'receiving';
    scene.current.caseNumber = caseNumber;
    scene.current.ambient = !stage;
    scene.current.moment = moment;
    scene.current.choose = (id) => {
      if (window.matchMedia('(max-width: 600px)').matches) setInspectedId(id);
      else onChoose?.(id);
    };
  }, [view, deskInset, rotationRequest, stationAction, caseNumber, stage, moment, onChoose]);

  useEffect(() => setInspectedId(undefined), [caseNumber, view]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    try {
      return mountPharmacy(element, scene.current, (available) => setRenderer(available ? 'webgl' : 'unavailable'), setHoveredProduct);
    } catch {
      setRenderer('unavailable');
    }
  }, []);

  const markerKeys = !stage || (view === stage && !showTaskMarker)
    ? []
    : view === 'overview' ? Object.keys(locations) as GameStage[] : [view];
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
            {hoveredProduct.strength && !hoveredProduct.name.includes(hoveredProduct.strength) && <span>{hoveredProduct.strength}</span>}
            <span>{hoveredProduct.selected ? 'Click to return to shelf' : 'Click to add to basket'}</span>
          </div>
        )}
      </div>
      {ready && inspectedProduct && (
        <section className="world-carton-inspection" aria-label="Carton details">
          <button type="button" className="world-carton-close" onClick={() => setInspectedId(undefined)} aria-label="Close carton details">
            <X size={18} aria-hidden="true" />
          </button>
          <p><strong>{inspectedProduct.name}</strong></p>
          {inspectedProduct.strength && !inspectedProduct.name.includes(inspectedProduct.strength) && <p>{inspectedProduct.strength}</p>}
          <button type="button" className="shift-button" onClick={() => {
            onChoose?.(inspectedProduct.id);
            setInspectedId(undefined);
          }}>
            {inspectedProduct.selected ? 'Return to shelf' : 'Add to basket'}
          </button>
        </section>
      )}
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
          <span>{view === 'overview' ? locations[key].name : key === stage ? taskMarkerLabel ?? locations[key].action : 'Return to your station'}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      ))}
      {stage && view !== 'picking' && !previewing && moment?.caption && (
        <div className="world-dialogue" aria-hidden="true" key={moment.caption}>
          <p><strong>{moment.speaker}</strong></p>
          <p>{moment.caption}</p>
        </div>
      )}
    </div>
  );
}
