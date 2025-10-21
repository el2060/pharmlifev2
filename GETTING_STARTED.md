# Getting Started with Pharm Life

## 🎉 Your Game is Ready!

The Pharm Life game has been successfully built and is running on your development server.

## 🚀 Quick Start

### The game is currently running at:
**http://localhost:3001**

Open your browser and navigate to this URL to start playing!

## 📱 Testing Mobile Responsiveness

### Option 1: Browser DevTools
1. Open the game in your browser
2. Press `F12` to open Developer Tools
3. Click the device toggle icon (or press `Ctrl+Shift+M`)
4. Select different devices (iPhone, iPad, etc.) to test

### Option 2: Your Phone
1. Find your computer's local IP address:
   - Windows: Open CMD and run `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
2. On your phone's browser, go to `http://YOUR_IP:3001`
3. Make sure your phone and computer are on the same WiFi network

## 🎮 How to Play

### Main Menu
- **START GAME**: Choose your year level and begin
- **ABOUT**: Learn about the game and its stages

### Year Selection
- **Year 1**: Basic difficulty - Learn prescription basics
- **Year 2**: Intermediate - Drug classes and counseling
- **Year 3**: Advanced - Complex scenarios

### Game Stages

#### Stage 1: Receiving
1. Check patient identity (Name + IC)
2. Verify drug allergies
3. Validate the prescription
4. Identify any issues (missing signature, expired date, etc.)

#### Stage 2: Typing
1. Read the prescription abbreviations
2. Build the medication label
3. Select correct quantity, dosage form, and frequency
4. Print the label

#### Stage 3: Picking & Packing
1. View prescription items needed
2. Navigate pharmacy shelves by drug category
3. Select the exact medications required
4. Verify your selections

#### Stage 4: Dispensing
1. Answer patient counseling questions
2. Provide medication instructions
3. Explain side effects and warnings
4. Complete the level!

## 🎯 Scoring System

- **Receiving Stage**: 10-75 points
- **Typing Stage**: 60 points per medication
- **Picking Stage**: 70 points
- **Dispensing Stage**: 40 points per question

### Rx Points (Experience)
- Earning Rx Points levels you up:
  - 0-99: Pharmacy Trainee
  - 100-299: Junior Pharmacist
  - 300-599: Pharmacist
  - 600-999: Senior Pharmacist
  - 1000+: Chief Pharmacist

## 🛠️ Development Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/      # Reusable UI (Button, Modal, Card, HUD)
├── screens/         # Main screens (Menu, Year Selection, About)
├── stages/          # Game stages (Receiving, Typing, Picking, Dispensing)
├── store/           # Game state management (Zustand)
├── data/            # Medications, prescriptions, questions
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🎨 Customization Tips

### Adding New Medications
Edit `src/data/medications.ts` and add new medication objects.

### Adding New Questions
Edit `src/data/questions.ts` and add counseling questions.

### Creating New Levels
Edit `src/data/prescriptions.ts` and create new prescription scenarios.

### Changing Colors
Edit `tailwind.config.js` to modify the color palette.

## 📱 Mobile Features

✅ Touch-friendly buttons (minimum 44x44px)
✅ Responsive layouts (mobile-first design)
✅ Swipe gestures supported
✅ Works on all screen sizes
✅ Optimized for tablets and phones

## 🐛 Troubleshooting

### Server won't start
- Make sure port 3000 or 3001 is not in use
- Try `npm install` again
- Check for any error messages

### CSS not loading
- Clear your browser cache
- Restart the dev server
- Check the browser console for errors

### Game stuck on loading
- Check browser console for errors
- Verify all files are present
- Restart the dev server

## 📦 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy automatically!

### Deploy to Netlify
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder to Netlify
4. Done!

## 🎓 Educational Use

This game covers:
- ✓ Prescription validation
- ✓ Medical abbreviation interpretation
- ✓ Drug classification
- ✓ Patient counseling
- ✓ Medication safety

Perfect for pharmacy students in Years 1-3!

## 💡 Next Steps

1. **Play through all 3 year levels**
2. **Test on mobile devices**
3. **Customize medications for your curriculum**
4. **Deploy online for students to access**
5. **Add more levels and scenarios**

## 📞 Support

For issues or questions:
- Check the [README.md](README.md)
- Review the [DESIGN_TREATMENT.md](DESIGN_TREATMENT.md)
- Check browser console for errors

---

**Happy Gaming! 🎮💊**

Start playing now at **http://localhost:3001**
