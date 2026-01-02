import { SuccessScreen } from './screens/SuccessScreen';

// ... (existing imports)

// Inside App component
const { currentYear, currentLevel, currentStage, setYear, setPrescription, resetLevel, isLevelComplete } = useGameStore();

// ...

{
  currentScreen === 'game' && (
    <motion.div
      key="game"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen space-y-6"
    >
      {isLevelComplete ? (
        <SuccessScreen onBackToHome={handleBackToHome} />
      ) : (
        <>
          <HUD onBackToHome={handleBackToHome} />
          <div className="pb-10">{renderStage()}</div>
        </>
      )}
    </motion.div>
  )
}
        </AnimatePresence >

  <footer className="py-4 text-center text-sm text-gray-500/60 font-medium">
    <p>Last Updated: {__COMMIT_DATE__}</p>
  </footer>
      </div >
    </div >
  );
}

export default App;
