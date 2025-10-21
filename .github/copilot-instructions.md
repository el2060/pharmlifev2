# PharmLife Development Guide

## Project Overview
PharmLife is an educational pharmacy simulation game built with React 18, TypeScript, and Vite. Students progress through 4 game stages (Receiving, Typing, Picking, Dispensing) across 3 difficulty levels (Year 1-3), learning real-world pharmacy workflows through gamification.

## Architecture & State Management

### State Flow (Zustand)
- **Single global store**: `src/store/gameStore.ts` manages all game state
- **Key state**: `currentYear`, `currentStage`, `score`, `rxPoints`, `currentPrescription`, `selectedMedications`, `stageProgress`
- **Stage progression**: Linear flow through `stageOrder` array: receiving → typing → picking → dispensing
- **Level advancement**: Completing all 4 stages increments `currentLevel` and resets to receiving stage
- **No backend**: All game logic runs client-side; data stored in `src/data/` as TypeScript objects

### Screen Navigation Pattern
`App.tsx` manages screens using local state (`currentScreen: 'menu' | 'year-selection' | 'about' | 'game'`). The game screen renders stages conditionally based on `useGameStore().currentStage`. Use `AnimatePresence` from Framer Motion for smooth transitions.

## Data Structure Conventions

### Medications (`src/data/medications.ts`)
- Each medication has a unique `id` (e.g., `'med-001'`, `'med-001b'` for different strengths)
- **Variants by strength**: Separate entries for Paracetamol 250mg vs 500mg
- Categories: `analgesic`, `gastrointestinal`, `cardiovascular`, `respiratory`, `antimicrobial`, `endocrine`
- Access via: `getMedicationById(id)` or `getMedicationsByCategory(category)`

### Prescriptions (`src/data/prescriptions.ts`)
- **Structure**: Each `Prescription` contains `medications[]` array referencing medication IDs
- **Validation states**: `isValid: boolean` + optional `invalidReason` (e.g., `'missing-signature'`, `'expired-date'`)
- **Medical abbreviations**: `bd` (twice daily), `tds` (three times daily), `prn` (when necessary) - defined in `medicalAbbreviations` object
- **Levels**: Each `LevelData` object combines a prescription with metadata (`year`, `chapterNumber`, `difficulty`)

### Questions (`src/data/questions.ts`)
- Counseling MCQs with `medicationId` reference, `correctAnswer` index, and `explanation`
- Categories: `indication`, `dosage`, `side-effects`, `storage`, `warnings`

## Component Patterns

### Reusable UI Components (`src/components/`)
- **Button**: Supports `variant` prop (`primary`, `secondary`, `danger`, `success`) + Framer Motion hover effects
- **Card**: Standard container with rounded corners and shadow
- **Modal**: Controlled by `isOpen` prop; use `showCloseButton={false}` for result modals
- **Hint**: Collapsible help section with expandable hints array
- **HUD**: Top game bar displaying score, Rx points, player level, and "Back to Home" button

### Stage Component Structure
All stages follow this pattern:
1. Local state for step tracking (e.g., `'identity' | 'validation' | 'complete'`)
2. Zustand hooks: `const { currentPrescription, addScore, addRxPoints, nextStage } = useGameStore()`
3. Conditional rendering with `AnimatePresence` for step transitions
4. Result modal with correct/incorrect feedback
5. Call `nextStage()` on success to advance to next stage

## Styling Approach

### Tailwind CSS + Custom Utilities
- **Mobile-first**: All layouts use responsive classes (`sm:`, `md:`, `lg:`)
- **Custom colors**: Defined in `tailwind.config.js` as `pharm-blue`, `pharm-green`, etc.
- **Animations**: Custom keyframes for `stamp`, `shake` effects (see `tailwind.config.js`)
- **Typography**: Body text uses default sans-serif; retro mode uses `'Press Start 2P'` (pixel font)

### Common Class Patterns
- Container: `container-custom mx-auto p-4 max-w-4xl`
- Prescription paper: `prescription-paper p-6 rounded-lg` (custom CSS in `index.css`)
- Button sizing: Touch-friendly minimum 44x44px for mobile

## Game Logic Conventions

### Scoring System
- **Receiving**: 10 pts for identity check, 50-75 pts for correct validation
- **Typing**: 60 pts per medication label created
- **Picking**: 70 pts for selecting all correct medications
- **Dispensing**: 40 pts per correct counseling answer
- **Rx Points**: Separate leveling currency (100 → Junior Pharmacist, 300 → Pharmacist, 600 → Senior, 1000 → Chief)

### Error Handling Pattern
Wrong answers trigger:
1. `setIsCorrect(false)` + `setShowResult(true)`
2. Modal displays incorrect feedback with explanation
3. "Try Again" button resets state (does NOT penalize score)
4. User can retry until correct

### Validation Logic (Receiving Stage)
Check `currentPrescription.isValid`:
- **If true**: Accept prescription → proceed
- **If false**: User must identify `invalidReason` from dropdown (exact match required)

## Development Workflows

### Adding New Medications
1. Add to `medications` array in `src/data/medications.ts`
2. Include all required fields: `id`, `genericName`, `strength`, `dosageForm`, `category`, `drugClass`, `counselingPoints[]`
3. Create corresponding questions in `src/data/questions.ts`
4. Reference in new prescriptions using the medication `id`

### Creating New Levels
1. Define `Prescription` object in `src/data/prescriptions.ts`
2. Add to `levels` array with `year`, `chapterNumber`, and `difficulty`
3. Ensure `medications[]` array references valid medication IDs
4. Set `isValid` and `invalidReason` appropriately

### Testing Stages Independently
Modify `App.tsx` initial screen state or add dev buttons to jump to specific stages. Use `setStage()` from game store to navigate directly.

## Build & Deployment

### Commands
- **Dev server**: `npm run dev` (Vite HMR on port 3000, auto-opens browser)
- **Production build**: `npm run build` (TypeScript compilation + Vite optimization → `dist/`)
- **Preview build**: `npm run preview` (Test production build locally)

### Deployment Targets
- **Vercel/Netlify**: Automatically detects Vite config; deploy `dist/` folder
- **Static hosting**: Build output is pure static HTML/JS/CSS (no server required)

## TypeScript Conventions

### Type Imports
Always import types from `src/types/game.types.ts`:
```typescript
import { YearLevel, GameStage, Medication, Prescription } from '../types/game.types';
```

### Union Types
- `YearLevel`: Literal union `1 | 2 | 3`
- `GameStage`: `'receiving' | 'typing' | 'picking' | 'dispensing'`
- `InvalidReason`: String literals for specific validation errors

### Type Safety in Components
Use typed props interfaces for all components. Zustand store is fully typed via `GameStore` interface.

## Performance Considerations

- **Lazy loading**: Not currently implemented but recommended for future scaling
- **Memoization**: Consider `React.memo` for frequently re-rendered lists (e.g., medication cards in Picking stage)
- **Bundle size**: Current stack is minimal (~500KB); avoid heavy dependencies

## Accessibility Notes

- All interactive elements support keyboard navigation
- Color coding should not be the only indicator (use text + icons)
- `aria-label` attributes recommended for icon-only buttons
- Future work: Add screen reader announcements for score updates

## Common Pitfalls

1. **Medication ID typos**: Always use `getMedicationById()` to catch missing references early
2. **Stage progression**: Don't manually set `currentStage`; always use `nextStage()` to maintain stage order
3. **Prescription validity**: Double-check `isValid` matches `invalidReason` presence (invalid prescriptions MUST have a reason)
4. **Mobile testing**: Verify touch targets are ≥44px; test on actual devices, not just DevTools

## Design Philosophy

- **Educational accuracy over gamification**: Correct pharmacy workflows must never be compromised for fun
- **Immediate feedback**: Every action should have visual/audio confirmation
- **Retro aesthetics with modern UX**: Pixel art charm but intuitive, accessible interface
- **Progressive difficulty**: Year 1 = basics with hints; Year 3 = real-world complexity with time pressure
