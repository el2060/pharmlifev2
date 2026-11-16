import { ArrowLeft, Check } from 'lucide-react';
import { PharmacyArt, StationRoute } from '../components/PharmacyScene';

interface AboutProps {
  onBack: () => void;
}

const learningObjectives = [
  'Validate prescriptions for completeness and accuracy',
  'Identify patient information correctly',
  'Interpret medical abbreviations and terminology',
  'Calculate medication quantities and dosages',
  'Select appropriate medications by strength and form',
  'Counsel patients on medication use',
  'Understand drug indications and side effects',
  'Practise the pharmacy workflow from intake to collection',
];

export function About({ onBack }: AboutProps) {
  return (
    <main className="shift-selection">
      <div className="selection-scene">
        <PharmacyArt />
        <div className="selection-title">
          <button type="button" className="lobby-link" onClick={onBack}>
            <ArrowLeft size={17} aria-hidden="true" /> Back to the lobby
          </button>
          <h1>About Pharm Life</h1>
        </div>
      </div>
      <section className="placement-roster about-shift">
        <p>Practise working through a prescription in a fictional Singapore polyclinic pharmacy. The shift draws on the outpatient pharmacy workflow familiar from local hospitals and polyclinics.</p>
        <StationRoute />
        <h2>Learning goals</h2>
        <ul>
          {learningObjectives.map((objective) => (
            <li key={objective}><Check size={17} aria-hidden="true" />{objective}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
