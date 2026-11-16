import { useSceneMoment } from '../../scene/shiftScene';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { ArrowRight, CheckCircle, MessageCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useGameStore } from '../../store/gameStore';
import { getMedicationById } from '../../data/medications';
import { getQuestionsByMedicationId } from '../../data/questions';
import { CounselingQuestion } from '../../types/game.types';
import { ACTIVE_LEVEL_LIMIT } from '../../data/prescriptions';

export function Dispensing({ onBackToHome }: { onBackToHome: () => void }) {
  const { currentPrescription, addScore, addRxPoints, completeLevel, currentYear, currentLevel } = useGameStore();
  const isLastLevel = currentLevel >= ACTIVE_LEVEL_LIMIT[currentYear];
  const [counselingStarted, setCounselingStarted] = useState(false);
  const [counselingComplete, setCounselingComplete] = useState(false);

  const [isConversing, setIsConversing] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<CounselingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const conversationHeading = useRef<HTMLHeadingElement>(null);
  const handoverButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isConversing) conversationHeading.current?.focus();
    if (counselingStarted) handoverButton.current?.focus();
  }, [isConversing, currentQuestionIndex, counselingStarted]);

  useSceneMoment({
    stage: 'dispensing',
    speaker: currentPrescription?.patientName,
    caption: counselingComplete ? 'Thank you for explaining my medication.'
      : counselingStarted ? 'Thank you. I’m ready to collect my medication.'
        : showFeedback ? isAnswerCorrect ? 'Thanks, that helps.' : 'Could you explain that again?'
          : isConversing ? currentQuestions[currentQuestionIndex]?.question
          : 'Hello, I’m here to collect my medication.',
    actionLabel: counselingComplete ? 'View handover summary'
      : counselingStarted ? 'Hand over medication'
        : showFeedback ? currentQuestionIndex < currentQuestions.length - 1 ? 'Continue conversation' : 'Finish counselling'
        : isConversing ? 'Reply to the patient' : 'Speak with the patient',
    gesture: counselingComplete ? 'handover'
      : showFeedback ? isAnswerCorrect ? 'nod' : 'consider'
        : 'talk',
  }, handleSceneInteraction);

  function handleSceneInteraction() {
    if (counselingComplete) document.getElementById('handover-summary')?.focus();
    else if (showFeedback) handleNextQuestion();
    else if (isConversing) conversationHeading.current?.focus();
    else if (counselingStarted) handoverButton.current?.click();
    else handleStartCounseling();
  }


  if (!currentPrescription) {
    return <div>Loading...</div>;
  }

  const replies = currentQuestions[currentQuestionIndex]?.options.map((option, index) => ({ option, index })) ?? [];
  const replyOffset = replies.length ? (currentLevel + currentQuestionIndex) % replies.length : 0;
  const visibleReplies = [...replies.slice(replyOffset), ...replies.slice(0, replyOffset)];

  const handleStartCounseling = () => {
    // Collect all questions for the prescribed medications
    const allQuestions: CounselingQuestion[] = [];
    currentPrescription.medications.forEach((med) => {
      const questions = getQuestionsByMedicationId(med.medicationId);
      allQuestions.push(...questions);
    });

    if (allQuestions.length > 0) {
      setCurrentQuestions(allQuestions);
      setCurrentQuestionIndex(0);
      setIsConversing(true);
    } else {
      // If no questions, skip straight to complete
      setCounselingStarted(true);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;

    setSelectedAnswer(index);
    const correct = currentQuestions[currentQuestionIndex].correctAnswer === index;
    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    // Optional: Add small score for correct answer
    if (correct) {
      addScore(5);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finished all questions
      setIsConversing(false);
      setCounselingStarted(true);
    }
  };

  const handleCounselingComplete = () => {
    // Award points for successful handover and counseling
    addScore(40);
    addRxPoints(15);
    setCounselingComplete(true);
  };

  const handleComplete = () => {
    completeLevel();
  };

  return (
    <div className="container-custom mx-auto p-4 sm:p-6 lg:p-8 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {!counselingComplete && !isConversing && (
          <div className="collection-desk">
            {/* Patient Info Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <span className="text-5xl">👤</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{currentPrescription.patientName}</h3>
                  <p className="text-sm text-gray-600 mb-4">IC: {currentPrescription.patientIC}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">Medications to Dispense:</p>
                    <div className="space-y-1">
                      {currentPrescription.medications.map((med, idx) => {
                        const medication = getMedicationById(med.medicationId);
                        return (
                          <p key={idx} className="text-sm text-gray-700 ml-2">
                            • {medication?.genericName} ({medication?.strength})
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Counseling Instructions */}
            <div className="poke-textbox p-6 space-y-4" style={{ background: '#FFFFFF' }}>
              <p className="text-poke-black text-lg font-bold">
                PATIENT COUNSELING
              </p>
              <div className="text-poke-black text-sm space-y-3">
                <p>📋 For each medication, explain:</p>
                <ul className="ml-4 space-y-2 text-sm">
                  {currentPrescription.medications.map((med, idx) => {
                    const medication = getMedicationById(med.medicationId);
                    return (
                      <li key={idx} className="space-y-1">
                        <strong>✓ {medication?.genericName}:</strong>
                        <div className="ml-4 text-sm">
                          • What it's for: {medication?.commonUses?.[0] || 'Use as directed'}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="pt-2 border-t border-poke-black">
                  ✓ How to take it (frequency & duration)<br />
                  ✓ Storage instructions<br />
                  ✓ Potential side effects<br />
                  ✓ Important warnings
                </p>
              </div>
            </div>

            <button
              type="button"
              ref={handoverButton}
              className="shift-button collection-action"
              onClick={counselingStarted ? handleCounselingComplete : handleStartCounseling}
            >
              {counselingStarted ? 'Hand over medication' : 'Start counselling'}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        {counselingComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <CheckCircle size={120} className="text-pharm-green" />
            </motion.div>

            <div>
              <h2 id="handover-summary" tabIndex={-1} className="text-3xl font-bold text-pharm-green mb-2">MEDICATIONS DISPENSED!</h2>
              <p className="text-xl text-gray-700">Patient counseling complete</p>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Level Score</p>
                  <p className="text-3xl font-bold text-pharm-green">+40 pts</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rx Points</p>
                  <p className="text-3xl font-bold text-amber-600">+15 pts</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <motion.button
                onClick={handleComplete}
                className="btn-primary w-full text-lg py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLastLevel ? 'Finish shift →' : 'Call the next patient →'}
              </motion.button>
              <Button variant="secondary" onClick={onBackToHome} fullWidth>
                Back to Menu
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {isConversing && currentQuestions.length > 0 && (
        <motion.section
          className="counter-conversation"
          aria-label="Patient counselling"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="patient-dialogue">
            <span className="conversation-avatar"><MessageCircle size={21} aria-hidden="true" /></span>
            <div className="conversation-bubble">
              <p className="scene-kicker">{currentPrescription.patientName} <span aria-hidden="true">·</span> {getMedicationById(currentQuestions[currentQuestionIndex].medicationId)?.genericName}</p>
              <h2 ref={conversationHeading} tabIndex={-1}>{currentQuestions[currentQuestionIndex].question}</h2>
            </div>
          </div>
          <p className="conversation-label">Your reply</p>
            <div className="grid gap-3">
              {visibleReplies.map(({ option, index: idx }) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showFeedback}
                  className={`
                    conversation-reply w-full text-left p-4 rounded-lg border-2 transition-all
                    ${showFeedback
                      ? idx === currentQuestions[currentQuestionIndex].correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-900'
                        : idx === selectedAnswer
                          ? 'bg-red-100 border-red-500 text-red-900'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      : selectedAnswer === idx
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showFeedback && idx === currentQuestions[currentQuestionIndex].correctAnswer && (
                      <CheckCircle className="text-green-600" size={20} />
                    )}
                    {showFeedback && idx === selectedAnswer && idx !== currentQuestions[currentQuestionIndex].correctAnswer && (
                      <XCircle className="text-red-600" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${isAnswerCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {isAnswerCorrect ? (
                    <CheckCircle className="text-green-600 shrink-0 mt-1" />
                  ) : (
                    <CheckCircle className="text-red-600 shrink-0 mt-1" />
                  )}
                  <div>
                    <h4 className={`font-bold ${isAnswerCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isAnswerCorrect ? 'Correct!' : 'What to explain instead'}
                    </h4>
                    <p className={`text-base leading-relaxed mt-1 ${isAnswerCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {currentQuestions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < currentQuestions.length - 1 ? 'Continue conversation' : 'Finish counselling'}
                  </Button>
                </div>
              </motion.div>
            )}

            <p className="conversation-progress">Topic {currentQuestionIndex + 1} of {currentQuestions.length}</p>
            <div className="w-full bg-gray-200 h-2 rounded-full" aria-hidden="true">
              <div
                className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + (showFeedback ? 1 : 0)) / currentQuestions.length) * 100}%` }}
              />
            </div>
        </motion.section>
      )}


    </div >
  );
}
