import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MainMenu } from './screens/MainMenu';
import { YearSelection } from './screens/YearSelection';
import { About } from './screens/About';
import { HUD } from './components/HUD';
import { Receiving } from './stages/Receiving/Receiving';
import { Typing } from './stages/Typing/Typing';
import { Picking } from './stages/Picking/Picking';
import { Dispensing } from './stages/Dispensing/Dispensing';
import { useGameStore } from './store/gameStore';
import { levels } from './data/prescriptions';
import { YearLevel } from './types/game.types';

type Screen = 'menu' | 'year-selection' | 'about' | 'game';

// Helper function to get level data based on year and chapter number
const getLevelData = (year: YearLevel, chapterNumber: number) => {
  return levels.find((l) => l.year === year && l.chapterNumber === chapterNumber);
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const { currentYear, currentLevel, currentStage, setYear, setPrescription, resetLevel } = useGameStore();

  const handleStartGame = () => {
    setCurrentScreen('year-selection');
  };

  const handleShowAbout = () => {
    setCurrentScreen('about');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleBackToHome = () => {
    resetLevel(); // Reset game state
    setCurrentScreen('menu');
  };

  const handleSelectYear = (year: YearLevel) => {
    setYear(year);

    // Load first level for selected year (Chapter 1)
    const levelData = getLevelData(year, 1);
    if (levelData) {
      setPrescription(levelData.prescription);
      setCurrentScreen('game');
    }
  };

  // Load prescription when currentLevel changes
  React.useEffect(() => {
    if (currentScreen === 'game') {
      const levelData = getLevelData(currentYear, currentLevel);
      if (levelData) {
        setPrescription(levelData.prescription);
      }
    }
  }, [currentLevel, currentScreen, currentYear, setPrescription]);

  const renderStage = () => {
    switch (currentStage) {
      case 'receiving':
        return <Receiving />;
      case 'typing':
        return <Typing />;
      case 'picking':
        return <Picking />;
      case 'dispensing':
        return <Dispensing />;
      default:
        return <Receiving />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MainMenu onStartGame={handleStartGame} onShowAbout={handleShowAbout} />
          </motion.div>
        )}

        {currentScreen === 'year-selection' && (
          <motion.div
            key="year-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <YearSelection onSelectYear={handleSelectYear} onBack={handleBackToMenu} />
          </motion.div>
        )}

        {currentScreen === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <About onBack={handleBackToMenu} />
          </motion.div>
        )}

        {currentScreen === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            <HUD onBackToHome={handleBackToHome} />
            <div className="py-6">{renderStage()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
