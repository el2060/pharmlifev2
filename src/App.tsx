import React, { useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { MainMenu } from './screens/MainMenu';
import { About } from './screens/About';
import { SuccessScreen } from './screens/SuccessScreen';
import { HUD } from './components/HUD';
import { Modal, ShiftRestartContext } from './components/Modal';
import { Button } from './components/Button';
import { ShiftSceneProvider } from './scene/shiftScene';
import { Receiving } from './stages/Receiving/Receiving';
import { Typing } from './stages/Typing/Typing';
import { Picking } from './stages/Picking/Picking';
import { Dispensing } from './stages/Dispensing/Dispensing';
import { useGameStore, type ShiftStartingStats } from './store/gameStore';
import { levels } from './data/prescriptions';
import { YearLevel } from './types/game.types';

type Screen = 'menu' | 'about' | 'game';
const startingYear: YearLevel = 1;
const startingYearCaseCount = levels.filter(({ year }) => year === startingYear).length;

// Helper function to get level data based on year and chapter number with safe fallback
const getLevelData = (year: YearLevel, chapterNumber: number) => {
  const yearLevels = levels
    .filter((l) => l.year === year)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  if (!yearLevels.length) return undefined;

  return yearLevels.find((l) => l.chapterNumber === chapterNumber) ?? yearLevels[0];
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [showRestart, setShowRestart] = useState(false);
  const [shiftRevision, setShiftRevision] = useState(0);
  const startingStats = useRef<ShiftStartingStats>({ rxPoints: 0, playerLevel: 'Pharmacy Trainee' });

  function rememberStartingStats() {
    const { rxPoints, playerLevel } = useGameStore.getState();
    startingStats.current = { rxPoints, playerLevel };
  }
  const {
    currentYear,
    currentLevel,
    currentStage,
    setYear,
    setPrescription,
    resetLevel,
    restartShift,
    isLevelComplete
  } = useGameStore();

  const handleStartGame = () => {
    const firstCase = getLevelData(startingYear, 1);
    if (!firstCase) return;

    rememberStartingStats();
    setYear(startingYear);
    restartShift(firstCase.prescription, startingStats.current);
    setCurrentScreen('game');
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

  function handleRestart() {
    const firstCase = getLevelData(currentYear, 1);
    if (!firstCase) return;

    if (isLevelComplete) rememberStartingStats();
    setShowRestart(false);
    restartShift(firstCase.prescription, startingStats.current);
    setShiftRevision((revision) => revision + 1);
  }

  // Load prescription when currentLevel changes
  React.useEffect(() => {
    if (currentScreen === 'game') {
      const levelData = getLevelData(currentYear, currentLevel);
      if (levelData) {
        setPrescription(levelData.prescription);
      }
    }
  }, [currentLevel, currentScreen, currentYear, setPrescription]);

  // Scroll to top when stage changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStage, currentLevel, currentScreen, shiftRevision]);

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
    <MotionConfig reducedMotion="user">
      <div className="pharmacy-app">
        <AnimatePresence mode="wait">
          {currentScreen === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MainMenu caseCount={startingYearCaseCount} onStartGame={handleStartGame} onShowAbout={handleShowAbout} />
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
              className="shift-game"
            >
              {isLevelComplete ? (
                <SuccessScreen onBackToHome={handleBackToHome} onPlayAgain={handleRestart} />
              ) : (
                <ShiftRestartContext.Provider value={{ requestRestart: () => setShowRestart(true), restartOpen: showRestart }}>
                  <ShiftSceneProvider key={shiftRevision}>
                    <HUD onBackToHome={handleBackToHome} onRestart={() => setShowRestart(true)} caseCount={levels.filter(({ year }) => year === currentYear).length}>
                      <main id="workstation" tabIndex={-1} className={`workstation ${currentStage}-workstation`}>{renderStage()}</main>
                    </HUD>
                  </ShiftSceneProvider>
                </ShiftRestartContext.Provider>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <Modal isOpen={showRestart} onClose={() => setShowRestart(false)} title="Restart this shift?">
          <div className="space-y-4">
            <p>You’ll return to the first patient. Your case progress and any Rx points earned during this shift will be reset.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="danger" onClick={handleRestart}>Restart shift</Button>
              <Button variant="secondary" onClick={() => setShowRestart(false)}>Keep playing</Button>
            </div>
          </div>
        </Modal>


      </div>
    </MotionConfig>
  );
}

export default App;
