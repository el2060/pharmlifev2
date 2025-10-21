import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, XCircle, Award } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Hint } from '../../components/Hint';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { getQuestionsByMedicationId } from '../../data/questions';

export const Dispensing: React.FC = () => {
  const { currentPrescription, addScore, addRxPoints, resetLevel, score, rxPoints } =
    useGameStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);

  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  // Get all questions for medications in prescription
  const allQuestions = currentPrescription.medications
    .flatMap((medItem) => getQuestionsByMedicationId(medItem.medicationId))
    .slice(0, 3); // Limit to 3 questions

  if (allQuestions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  const medication = getMedicationById(currentQuestion.medicationId);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
      addScore(40);
      addRxPoints(15);
    }

    setQuestionsAnswered(questionsAnswered + 1);
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Show final result
      setShowFinalResult(true);
    }
  };

  const handleComplete = () => {
    resetLevel();
    // In a full implementation, this would navigate to next level or menu
  };

  return (
    <div className="container-custom mx-auto p-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Progress Bar */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-purple-600" />
              <span className="font-bold">Patient Counseling</span>
            </div>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} / {allQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
              }}
            />
          </div>
        </Card>

        {/* Patient Avatar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-4">
            <span className="text-6xl">👤</span>
          </div>
          <p className="text-gray-600">
            <strong>{currentPrescription.patientName}</strong> is waiting for counseling
          </p>
        </motion.div>

        {/* Medication Info Card */}
        {medication && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💊</span>
              <div>
                <h4 className="font-bold text-lg">{medication.genericName}</h4>
                <p className="text-sm text-gray-600">
                  {medication.strength} {medication.dosageForm}
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                  {medication.drugClass}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Hints - only show before answer is selected */}
        {selectedAnswer === null && (
          <Hint
            title="Need help counseling?"
            hints={[
              "Read the question category badge - it tells you what type of information is being asked (indication, dosage, warnings, side-effects)",
              "For 'indication' questions, think about what condition or symptom the medication treats",
              "For 'dosage' questions, consider how and when the patient should take the medication",
              "For 'warnings' questions, focus on important safety information and precautions",
              "The drug class shown above can give you a clue about what the medication does (e.g., 'Antihistamine' = treats allergies)"
            ]}
          />
        )}

        {/* Question Card */}
        <Card>
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
              {currentQuestion.category.toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{currentQuestion.question}</h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.01 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.99 : 1 }}
                onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                  selectedAnswer === null
                    ? 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50'
                    : selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : selectedAnswer !== null && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswer !== null &&
                        (index === currentQuestion.correctAnswer ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : selectedAnswer === index ? (
                          <XCircle size={16} className="text-white" />
                        ) : null)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation (shown after answer) */}
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {isCorrect ? '✓ Correct!' : 'ℹ️ Explanation:'}
              </p>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          {/* Continue Button */}
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button variant="primary" onClick={handleContinue} fullWidth className="py-4">
                {currentQuestionIndex < allQuestions.length - 1
                  ? 'Next Question →'
                  : 'Complete Stage →'}
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Final Result Modal */}
        <Modal isOpen={showFinalResult} onClose={() => {}} showCloseButton={false}>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4"
            >
              <Award size={56} className="text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Level Complete!</h2>
            <p className="text-gray-600 mb-6">
              You answered {correctAnswers} out of {allQuestions.length} questions correctly
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Level Score</p>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rx Points Earned</p>
                  <p className="text-2xl font-bold text-purple-600">+{rxPoints}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" onClick={handleComplete} fullWidth className="py-4">
                Continue to Next Level →
              </Button>
              <Button variant="secondary" onClick={handleComplete} fullWidth>
                Back to Menu
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};
