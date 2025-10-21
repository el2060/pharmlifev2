# Pharm Life: The Prescription Quest

A retro-inspired pharmacy simulation game built with React, TypeScript, and modern web technologies. Designed to teach pharmacy students the core workflows of a real-world pharmacy through immersive, gamified stages.

## Features

- **4 Learning Stages**: Receiving, Typing, Picking & Packing, and Dispensing
- **3 Difficulty Levels**: Year 1 (Basic), Year 2 (Intermediate), Year 3 (Advanced)
- **Mobile-First Design**: Fully responsive, works on phones, tablets, and desktops
- **Type-Safe**: Built with TypeScript for reliability
- **Smooth Animations**: Framer Motion for polished interactions
- **Educational Content**: Real medication database with 12+ drugs
- **No Backend Required**: Runs entirely in the browser

## Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or navigate to the project directory:
```bash
cd PharmLife
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Game Structure

### Stage 1: Receiving
- Verify patient identity (name + IC)
- Check drug allergies
- Validate prescription (signature, date, completeness)

### Stage 2: Typing
- Interpret medical abbreviations
- Create medication labels
- Select correct dosage form and frequency

### Stage 3: Picking & Packing
- Navigate pharmacy shelves organized by drug category
- Select correct medications and strengths
- Verify selections match prescription

### Stage 4: Dispensing
- Answer counseling questions
- Provide medication instructions
- Earn final points and complete level

## Medication Database

Includes 12 medications across 6 categories:
- **Analgesics**: Paracetamol, Ibuprofen
- **Gastrointestinal**: Omeprazole, Antacids
- **Cardiovascular**: Amlodipine, Atorvastatin
- **Respiratory**: Salbutamol, Cetirizine
- **Antimicrobials**: Amoxicillin, Azithromycin
- **Endocrine**: Metformin, Levothyroxine

## Folder Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Main screens (Menu, Year Selection, About)
├── stages/           # Game stages (Receiving, Typing, Picking, Dispensing)
├── store/            # Zustand state management
├── data/             # Medications, prescriptions, questions
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically

### Netlify
1. Run `npm run build`
2. Drag `dist/` folder to Netlify

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## Educational Use

This game is designed for pharmacy students to:
- Practice prescription validation skills
- Learn medical abbreviations
- Understand drug classifications
- Develop patient counseling abilities

Perfect for:
- Pharmacy schools
- Hospital training programs
- Self-directed learning
- Exam preparation

## License

Educational use. Modify as needed for your institution.

## Version

**1.0.0** - Initial Release

---

Built with ❤️ for pharmacy education
