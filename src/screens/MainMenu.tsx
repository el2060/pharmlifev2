import { useRef, useState } from 'react';
import { ArrowRight, BookOpen, Info, MapPin, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { NPLogo, PharmacyArt, StationRoute, stations } from '../components/PharmacyScene';
import type { PharmacyRenderer } from '../scene/PharmacyViewport';
import type { PharmacyView } from '../scene/pharmacyWorld';
import type { GameStage } from '../types/game.types';

interface MainMenuProps {
  caseCount: number;
  onStartGame: () => void;
  onShowAbout: () => void;
}

export function MainMenu({ caseCount, onStartGame, onShowAbout }: MainMenuProps) {
  const { rxPoints, playerLevel } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [preview, setPreview] = useState<PharmacyView>('overview');
  const [renderer, setRenderer] = useState<PharmacyRenderer>('pending');
  const visual = useRef<HTMLDivElement>(null);

  function previewStation(stage: GameStage) {
    setPreview(current => current === stage ? 'overview' : stage);
    if (window.matchMedia('(max-width: 760px)').matches) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      visual.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'instant' : 'smooth' });
    }
  }

  return (
    <main className="pharmacy-lobby">
      <section className="lobby-scene" aria-labelledby="game-title">
        <header className="lobby-header">
          <NPLogo />
          <p>Diploma in Pharmaceutical Science</p>
        </header>
        <div ref={visual} className="lobby-visual" data-renderer-state={renderer} tabIndex={-1} role="region" aria-label="3D pharmacy preview">
          <PharmacyArt view={preview} onRendererChange={setRenderer} />
          {renderer === 'webgl' && (
            <div className="lobby-preview-caption">
              <p aria-live="polite" key={preview}>{preview === 'overview' ? 'Pharmacy overview' : stations[preview].place}</p>
              {preview !== 'overview' && (
                <button type="button" onClick={() => {
                  setPreview('overview');
                  visual.current?.focus({ preventScroll: true });
                }}><Maximize2 size={15} aria-hidden="true" /> Overview</button>
              )}
            </div>
          )}
        </div>
        <motion.div
          className="lobby-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="scene-kicker"><MapPin size={15} aria-hidden="true" /> Polyclinic pharmacy · Singapore</p>
          <h1 id="game-title">Pharm Life<span>.</span></h1>
          <p className="lobby-subtitle">The Prescription Quest</p>
          <p className="lobby-description">Take a shift in a 3D polyclinic pharmacy. Review prescriptions, prepare medicines, and counsel patients.</p>
          <div className="lobby-actions">
            <button type="button" className="shift-button" aria-describedby="shift-details" onClick={onStartGame}>
              Start your shift <ArrowRight size={19} aria-hidden="true" />
            </button>
            <button type="button" className="lobby-link" onClick={() => setShowHowToPlay(true)}>
              <BookOpen size={17} aria-hidden="true" /> Shift guide
            </button>
          </div>
          <p className="lobby-shift-details" id="shift-details">Year 1 Foundations · {caseCount} patient cases</p>
        </motion.div>
      </section>
      <section className="lobby-workflow" aria-labelledby="lobby-workflow-title">
        <div className="lobby-workflow-heading">
          <h2 id="lobby-workflow-title">Explore the pharmacy</h2>
          <p>{renderer === 'webgl' ? 'Select a station for a closer look.' : 'Four stations in your shift.'}</p>
        </div>
        <StationRoute viewedStage={preview === 'overview' ? undefined : preview} onVisit={renderer === 'webgl' ? previewStation : undefined} />
      </section>
      <footer className="lobby-footer">
        <p><strong>{playerLevel}</strong><span aria-hidden="true"> / </span>{rxPoints} Rx points</p>
        <div>
          <button type="button" onClick={onShowAbout}><Info size={15} aria-hidden="true" /> About</button>
          <p>© 2026 Pharm Life · Updated {__COMMIT_DATE__}</p>
        </div>
      </footer>
      <Modal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} title="Shift guide">
        <div className="shift-guide">
          <section>
            <h3>Follow the prescription</h3>
            <ol>
              <li><strong>Receiving.</strong> Verify two identifiers, check allergies, and review the prescription.</li>
              <li><strong>Typing.</strong> Interpret the instructions and print a matching label.</li>
              <li><strong>Picking and packing.</strong> Select each medication and check its strength.</li>
              <li><strong>Dispensing.</strong> Counsel the patient about medication use and safety.</li>
            </ol>
          </section>
          <section>
            <h3>Making a decision</h3>
            <p>Use the information at each station to make a decision. Read the feedback, then follow the next action. Some cases end at the prescription counter when you identify a safety issue.</p>
          </section>
          <section>
            <h3>Explore the pharmacy</h3>
            <p>Rotate the 3D view or drag the scene to look around. Select a carton directly from the shelf at the picking station. Use the map to preview other stations, then return to the active task.</p>
          </section>
          <section>
            <h3>Scores and ranks</h3>
            <p>Your case score resets with each patient. Rx points carry across cases during the shift and unlock ranks. Unsafe decisions can cost points.</p>
            <dl>
              <div><dt>0–99</dt><dd>Pharmacy Intern</dd></div>
              <div><dt>100–299</dt><dd>Junior Pharmacy Technician</dd></div>
              <div><dt>300–599</dt><dd>Pharmacy Technician</dd></div>
              <div><dt>600–999</dt><dd>Senior Pharmacy Technician</dd></div>
              <div><dt>1,000+</dt><dd>Chief Pharmacy Technician</dd></div>
            </dl>
          </section>
          <Button onClick={() => setShowHowToPlay(false)} fullWidth>Back to the lobby</Button>
        </div>
      </Modal>
    </main>
  );
}
