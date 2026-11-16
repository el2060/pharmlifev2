import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { levels } from '../data/prescriptions';
import type { YearLevel } from '../types/game.types';
import { PharmacyArt } from '../components/PharmacyScene';

interface YearSelectionProps {
  onSelectYear: (year: YearLevel) => void;
  onBack: () => void;
}

const caseCount = levels.filter(({ year }) => year === 1).length;

export function YearSelection({ onSelectYear, onBack }: YearSelectionProps) {
  return (
    <main className="shift-selection">
      <div className="selection-scene">
        <PharmacyArt />
        <div className="selection-title">
          <button type="button" className="lobby-link" onClick={onBack}>
            <ArrowLeft size={17} aria-hidden="true" /> Back to the lobby
          </button>
          <h1>Choose your placement</h1>
        </div>
      </div>
      <section className="placement-roster" aria-label="Year placements">
        <div className="placement-available">
          <div>
            <p className="scene-kicker">Year 1 · {caseCount} patient cases</p>
            <h2>Foundations</h2>
            <p>Practise checking prescriptions, recognising dosage forms, and preparing medicines for patients.</p>
          </div>
          <button type="button" className="shift-button" onClick={() => onSelectYear(1)}>
            Begin Year 1 <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="placement-unavailable">
          <div><LockKeyhole size={16} aria-hidden="true" /><span>Year 2 · Pharmacology</span><small>Coming soon</small></div>
          <div><LockKeyhole size={16} aria-hidden="true" /><span>Year 3 · Advanced</span><small>Coming soon</small></div>
        </div>
      </section>
    </main>
  );
}
