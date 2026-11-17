import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { GameStage } from '../types/game.types';

export function getPharmacyQueueNumber(caseNumber: number) {
  return `P${100 + caseNumber}`;
}

export type SceneGesture = 'talk' | 'nod' | 'consider' | 'print' | 'printed' | 'pack' | 'basket-match' | 'basket-review' | 'handover';

export interface SceneProduct {
  id: string;
  name: string;
  strength: string;
  selected: boolean;
}

export interface SceneMoment {
  stage: GameStage;
  speaker?: string;
  speakerRole?: 'patient' | 'staff';
  caption?: string;
  actionLabel?: string;
  canActFromScene?: boolean;
  gesture?: SceneGesture;
  products?: SceneProduct[];
}

function useSceneState() {
  const [moment, setMoment] = useState<SceneMoment | null>(null);
  const action = useRef<(() => void) | null>(null);
  const choose = useRef<((id: string) => void) | null>(null);
  return useMemo(() => ({ moment, setMoment, action, choose }), [moment]);
}

const SceneContext = createContext<ReturnType<typeof useSceneState> | null>(null);

export function ShiftSceneProvider({ children }: { children: ReactNode }) {
  const state = useSceneState();
  return <SceneContext.Provider value={state}>{children}</SceneContext.Provider>;
}

export function useShiftScene() {
  return useContext(SceneContext);
}

export function useSceneMoment({ stage, speaker, speakerRole, caption, actionLabel, canActFromScene, gesture, products }: SceneMoment, onAction?: () => void, onChoose?: (id: string) => void) {
  const context = useShiftScene();
  const setMoment = context?.setMoment;
  const action = context?.action;
  const handler = useRef(onAction);
  handler.current = onAction;
  const hasAction = Boolean(onAction);
  const choose = context?.choose;
  const chooseHandler = useRef(onChoose);
  chooseHandler.current = onChoose;
  const hasChoose = Boolean(onChoose);

  useEffect(() => {
    if (!setMoment) return;
    setMoment({ stage, speaker, speakerRole, caption, actionLabel, canActFromScene, gesture, products });
  }, [stage, speaker, speakerRole, caption, actionLabel, canActFromScene, gesture, products, setMoment]);

  useEffect(() => {
    if (!action || !hasAction) return;
    const run = () => handler.current?.();
    action.current = run;
    return () => {
      if (action.current === run) action.current = null;
    };
  }, [action, hasAction]);

  useEffect(() => {
    if (!choose || !hasChoose) return;
    const run = (id: string) => chooseHandler.current?.(id);
    choose.current = run;
    return () => {
      if (choose.current === run) choose.current = null;
    };
  }, [choose, hasChoose]);
}
