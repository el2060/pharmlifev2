# Pharm Life - Technology Stack Proposal

## Recommended Stack: React + TypeScript + Vite

### Why This Stack?

#### 1. **React 18+ with TypeScript**
**Pros:**
- ✅ Component-based architecture perfect for game stages
- ✅ Strong typing prevents bugs in game logic
- ✅ Huge ecosystem and community support
- ✅ React hooks for clean state management
- ✅ Easy to maintain and scale
- ✅ Excellent mobile responsiveness with libraries

**Use Cases:**
- Each game stage is a component
- Reusable UI components (buttons, modals, cards)
- State management for game progression
- Type-safe medication database

#### 2. **Vite**
**Pros:**
- ✅ Lightning-fast development server
- ✅ Instant hot module replacement (HMR)
- ✅ Optimized production builds
- ✅ Built-in TypeScript support
- ✅ Easy to configure and deploy

#### 3. **CSS Modules / Tailwind CSS**
**Pros:**
- ✅ Scoped styling per component
- ✅ Tailwind: Rapid UI development with mobile-first utilities
- ✅ Easy responsive design
- ✅ No CSS conflicts

#### 4. **Framer Motion**
**Pros:**
- ✅ Smooth animations for game elements
- ✅ Drag-and-drop support (for picking stage)
- ✅ Page transitions
- ✅ Gesture recognition for mobile

#### 5. **Zustand (State Management)**
**Pros:**
- ✅ Lightweight (vs Redux)
- ✅ Simple API
- ✅ Perfect for game state (score, progress, current stage)
- ✅ Built-in TypeScript support
- ✅ LocalStorage persistence (auto-save)

---

## Alternative Stacks Considered

### Option 2: Svelte + TypeScript + Vite
**Pros:**
- Smaller bundle size
- Less boilerplate
- Built-in reactivity

**Cons:**
- Smaller ecosystem than React
- Fewer third-party game libraries

**Verdict:** Great for small projects, but React has better long-term support

---

### Option 3: Vue 3 + TypeScript + Vite
**Pros:**
- Easy to learn
- Great documentation
- Good performance

**Cons:**
- Smaller community than React
- Less developer familiarity

**Verdict:** Good alternative, but React is more industry-standard

---

### Option 4: Pure HTML/CSS/JavaScript (Vanilla)
**Pros:**
- No build step
- Lightweight
- Simple deployment

**Cons:**
- ❌ No type safety
- ❌ Harder to maintain as project grows
- ❌ Manual state management
- ❌ More boilerplate code
- ❌ Difficult to organize complex game logic

**Verdict:** Not recommended for this scope

---

## Final Recommendation: React + TypeScript Stack

### Complete Tech Stack

```
Frontend Framework:     React 18
Language:               TypeScript 5
Build Tool:             Vite 5
Styling:                Tailwind CSS + CSS Modules
Animation:              Framer Motion
State Management:       Zustand
Audio:                  Howler.js
Drag & Drop:            @dnd-kit/core
Icons:                  Lucide React
Deployment:             Vercel / Netlify (free)
```

---

## Project Structure

```
PharmLife/
├── public/
│   ├── sounds/              # Audio files
│   │   ├── stamp.mp3
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   └── background.mp3
│   └── images/              # Pixel art assets
│       ├── pharmacy-bg.png
│       └── patient-sprites/
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── HUD.tsx
│   │
│   ├── stages/              # Game stages
│   │   ├── Receiving/
│   │   │   ├── Receiving.tsx
│   │   │   ├── PrescriptionValidator.tsx
│   │   │   └── PatientIdentity.tsx
│   │   ├── Typing/
│   │   │   ├── Typing.tsx
│   │   │   ├── LabelBuilder.tsx
│   │   │   └── AbbreviationHelper.tsx
│   │   ├── Picking/
│   │   │   ├── Picking.tsx
│   │   │   ├── PharmacyShelf.tsx
│   │   │   └── MedicationCard.tsx
│   │   └── Dispensing/
│   │       ├── Dispensing.tsx
│   │       ├── CounselingQuiz.tsx
│   │       └── PatientDialog.tsx
│   │
│   ├── screens/             # Main screens
│   │   ├── MainMenu.tsx
│   │   ├── YearSelection.tsx
│   │   ├── GameScreen.tsx
│   │   └── About.tsx
│   │
│   ├── store/               # State management
│   │   ├── gameStore.ts     # Game state (score, level, stage)
│   │   └── playerStore.ts   # Player progress
│   │
│   ├── data/                # Game data
│   │   ├── medications.ts   # Medication database
│   │   ├── prescriptions.ts # Prescription scenarios
│   │   ├── questions.ts     # Counseling questions
│   │   └── levels.ts        # Level definitions
│   │
│   ├── utils/               # Helper functions
│   │   ├── scoring.ts
│   │   ├── validation.ts
│   │   └── audio.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── game.types.ts
│   │   ├── medication.types.ts
│   │   └── prescription.types.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameLogic.ts
│   │   ├── useTimer.ts
│   │   └── useSound.ts
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "howler": "^2.2.4",
    "@dnd-kit/core": "^6.1.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## Mobile Responsiveness Strategy

### 1. **Tailwind CSS Breakpoints**
```typescript
// Responsive classes
className="w-full md:w-1/2 lg:w-1/3"
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"
```

### 2. **Touch-Friendly Interactions**
- Minimum button size: 44x44px (Apple HIG)
- Drag-and-drop with touch support (@dnd-kit)
- Swipe gestures for stage navigation

### 3. **Responsive Layout**
- Mobile: Single column, stacked UI
- Tablet: Two-column layout
- Desktop: Full pharmacy isometric view

### 4. **Adaptive Font Scaling**
```css
/* Fluid typography */
font-size: clamp(1rem, 2vw, 1.5rem);
```

### 5. **Mobile-First Media Queries**
```css
/* Base styles for mobile */
.prescription-card { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .prescription-card { width: 50%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .prescription-card { width: 33%; }
}
```

---

## Performance Optimizations

1. **Code Splitting**
   - Lazy load each stage component
   - Only load assets when needed

2. **Image Optimization**
   - Use WebP format for pixel art
   - Lazy load images below fold

3. **Bundle Size**
   - Tree-shaking with Vite
   - Dynamic imports for heavy components

4. **PWA Support** (Optional)
   - Service worker for offline play
   - Add to home screen capability

---

## Development Workflow

### Setup (5 minutes)
```bash
npm create vite@latest pharm-life -- --template react-ts
cd pharm-life
npm install
npm install zustand framer-motion howler @dnd-kit/core lucide-react
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

### Development
```bash
npm run dev          # Start dev server (localhost:5173)
```

### Build for Production
```bash
npm run build        # Creates optimized dist/ folder
npm run preview      # Preview production build
```

### Deployment (Free Options)
1. **Vercel** - Best for React apps
2. **Netlify** - Drag-and-drop deployment
3. **GitHub Pages** - Free hosting

---

## Type Safety Examples

### Medication Type
```typescript
interface Medication {
  id: string;
  genericName: string;
  brandName?: string;
  strength: string;
  dosageForm: 'tablet' | 'capsule' | 'liquid' | 'topical' | 'inhaler';
  category: MedicationCategory;
  drugClass: string;
  mechanismOfAction: string;
  commonUses: string[];
  sideEffects: string[];
  counselingPoints: string[];
}
```

### Prescription Type
```typescript
interface Prescription {
  id: string;
  patientName: string;
  patientIC: string;
  doctorName: string;
  date: string;
  medications: PrescriptionItem[];
  isValid: boolean;
  invalidReason?: InvalidReason;
}
```

### Game State Type
```typescript
interface GameState {
  currentYear: 1 | 2 | 3;
  currentStage: 'receiving' | 'typing' | 'picking' | 'dispensing';
  score: number;
  rxPoints: number;
  level: number;
  currentPrescription: Prescription | null;
}
```

---

## Why NOT Unity/Game Engines?

| Feature | React/Web | Unity |
|---------|-----------|-------|
| Load Time | ⚡ Instant | ❌ Slow (WASM loading) |
| Mobile Performance | ✅ Excellent | ⚠️ Heavy |
| File Size | ✅ <500KB | ❌ 5-10MB+ |
| Development Speed | ✅ Fast | ⚠️ Slower |
| Cross-Platform | ✅ Works everywhere | ⚠️ Export needed |
| Updates | ✅ Instant | ❌ Re-download |
| Cost | ✅ Free | ✅ Free (Pro paid) |

**Verdict:** For this UI-heavy educational game, web tech is superior.

---

## Pixel Art Styling with CSS

```css
/* Pixel-perfect rendering */
.pixel-art {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Retro font */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.pixel-title {
  font-family: 'Press Start 2P', monospace;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
}

/* CRT scan lines effect */
.game-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}
```

---

## Timeline Estimate

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Setup & Config** | 1 day | Project initialized, dependencies installed |
| **Core UI & Navigation** | 2 days | Main menu, year selection, screen routing |
| **Stage 1: Receiving** | 3 days | Prescription validation, patient ID check |
| **Stage 2: Typing** | 3 days | Label builder, abbreviation system |
| **Stage 3: Picking** | 4 days | Drag-drop pharmacy, medication selection |
| **Stage 4: Dispensing** | 3 days | Counseling quiz, patient dialog |
| **Game Flow & Scoring** | 2 days | Progression, point system |
| **Polish & Audio** | 2 days | Sound effects, animations |
| **Mobile Testing** | 2 days | Responsive refinement, touch optimization |
| **Bug Fixes & Deploy** | 2 days | Final testing, deployment |
| **TOTAL** | **24 days** | Fully functional game |

---

## Final Recommendation

### ✅ Go with: React + TypeScript + Vite + Tailwind

**Why?**
1. **Best Development Experience:** Fast, modern, industry-standard
2. **Type Safety:** Catch bugs before they happen
3. **Mobile-First:** Tailwind makes responsive design effortless
4. **Performance:** Vite ensures fast loading, React optimizes rendering
5. **Maintainability:** Clear component structure, easy to update
6. **Future-Proof:** Easy to add features, deploy anywhere
7. **No Backend Needed:** Static site, can host for free

**Perfect for:**
- Educational web apps
- Games with lots of UI interactions
- Projects that need mobile + desktop support
- Teams familiar with modern JavaScript

---

## Getting Started Command

Once approved, run:

```bash
npm create vite@latest pharm-life -- --template react-ts
cd pharm-life
npm install
npm install zustand framer-motion howler @dnd-kit/core lucide-react clsx
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
npm run dev
```

Then I'll build the complete game step-by-step! 🎮

---

**Ready to proceed with this stack?**
