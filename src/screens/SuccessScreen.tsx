import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PharmacyArt } from '../components/PharmacyScene';

interface SuccessScreenProps {
  onBackToHome: () => void;
}

export function SuccessScreen({ onBackToHome }: SuccessScreenProps) {
  const { currentYear, score, rxPoints, playerLevel } = useGameStore();

  return (
    <main className="shift-selection">
      <div className="selection-scene">
        <PharmacyArt />
        <div className="selection-title">
          <p className="scene-kicker">Year {currentYear} · Pharmacy placement</p>
          <h1>Shift complete</h1>
        </div>
      </div>
      <motion.section className="placement-roster" aria-label="Shift summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="placement-available shift-summary">
          <div>
            <h2><Check aria-hidden="true" size={24} /> All patient cases complete</h2>
            <p>{playerLevel}</p>
          </div>
          <dl>
            <div><dt>Final case score</dt><dd>{score}</dd></div>
            <div><dt>Rx points</dt><dd>{rxPoints}</dd></div>
          </dl>
          <button type="button" className="shift-button" onClick={onBackToHome}>
            <ArrowLeft size={18} aria-hidden="true" /> Back to the lobby
          </button>
        </div>
      </motion.section>
    </main>
  );
}
