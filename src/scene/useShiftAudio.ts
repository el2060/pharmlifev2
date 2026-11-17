import { useEffect, useRef, useState } from 'react';
import type { GameStage } from '../types/game.types';
import type { SceneGesture } from './shiftScene';

const cues = {
  call: [523, 698],
  printed: [659, 880],
  packed: [587],
  checked: [587, 784],
  handover: [523, 659, 784],
};

function play(context: AudioContext, notes: number[]) {
  if (context.state !== 'running') return;
  notes.forEach((frequency, index) => {
    const start = context.currentTime + index * 0.12;
    const tone = context.createOscillator();
    const volume = context.createGain();
    tone.type = 'sine';
    tone.frequency.value = frequency;
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(0.055, start + 0.018);
    volume.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
    tone.connect(volume).connect(context.destination);
    tone.onended = () => {
      tone.disconnect();
      volume.disconnect();
    };
    tone.start(start);
    tone.stop(start + 0.23);
  });
}

export function useShiftAudio(stage: GameStage, caseNumber: number, gesture: SceneGesture | undefined, basketCount: number) {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext>();
  const previousBasket = useRef(basketCount);
  const supported = typeof window.AudioContext === 'function';

  useEffect(() => () => {
    if (context.current && context.current.state !== 'closed') void context.current.close().catch(() => {});
  }, []);

  useEffect(() => {
    if (context.current && (stage === 'receiving' || stage === 'dispensing')) {
      play(context.current, cues.call);
    }
  }, [caseNumber, stage]);

  useEffect(() => {
    const audio = context.current;
    if (!audio) return;
    if (gesture === 'printed') play(audio, cues.printed);
    else if (gesture === 'basket-match') play(audio, cues.checked);
    else if (gesture === 'handover') play(audio, cues.handover);
  }, [gesture]);

  useEffect(() => {
    if (context.current && basketCount > previousBasket.current) play(context.current, cues.packed);
    previousBasket.current = basketCount;
  }, [basketCount]);

  async function toggle() {
    if (!supported) return;
    try {
      const audio = context.current ?? new AudioContext();
      context.current = audio;
      if (enabled) {
        await audio.suspend();
      } else {
        await audio.resume();
        play(audio, cues.call);
      }
      setEnabled(audio.state === 'running');
    } catch {
      setEnabled(false);
    }
  }

  return { enabled, supported, toggle };
}
