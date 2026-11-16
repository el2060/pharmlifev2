import { useState } from 'react';
import { ArrowRight, BookOpen, Info, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { NPLogo, PharmacyArt, StationRoute } from '../components/PharmacyScene';

interface MainMenuProps {
  caseCount: number;
  onStartGame: () => void;
  onShowAbout: () => void;
}

export function MainMenu({ caseCount, onStartGame, onShowAbout }: MainMenuProps) {
  const { rxPoints, playerLevel } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <main className="pharmacy-lobby">
      <section className="lobby-scene" aria-labelledby="game-title">
        <PharmacyArt />
        <header className="lobby-header">
          <NPLogo />
          <p>Diploma in Pharmaceutical Science</p>
        </header>
        <motion.div
          className="lobby-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="scene-kicker"><MapPin size={15} aria-hidden="true" /> Polyclinic pharmacy · Singapore</p>
          <h1 id="game-title">Pharm Life<span>.</span></h1>
          <p className="lobby-subtitle">The Prescription Quest</p>
          <p className="lobby-description">Step behind the counter, review prescriptions, and help patients use their medicines safely.</p>
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
      <section className="lobby-workflow">
        <div className="lobby-workflow-heading">
          <h2>Your pharmacy route</h2>
          <p>Review, label, pack, and counsel at four stations.</p>
        </div>
        <StationRoute />
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
