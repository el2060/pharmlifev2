import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface SuccessScreenProps {
    onBackToHome: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onBackToHome }) => {
    const { score, rxPoints, playerLevel } = useGameStore();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="game-card max-w-2xl w-full p-8 text-center space-y-8 bg-white border-4 border-poke-blue shadow-xl rounded-xl"
            >
                <div className="flex justify-center">
                    <motion.div
                        initial={{ rotate: -10, scale: 0 }}
                        animate={{ rotate: 0, scale: 1, transition: { type: 'spring', delay: 0.2 } }}
                        className="bg-yellow-100 p-6 rounded-full border-4 border-yellow-400"
                    >
                        <Trophy size={64} className="text-yellow-600" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-poke-blue font-header">LEVEL COMPLETE!</h1>
                    <p className="text-xl text-gray-600">You have successfully completed all scenarios for this year.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="poke-textbox bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-gray-500 uppercase font-bold mb-1">Total Score</p>
                        <p className="text-3xl font-bold text-poke-blue">{score}</p>
                    </div>
                    <div className="poke-textbox bg-green-50 p-4 rounded-lg border-2 border-green-200">
                        <p className="text-sm text-gray-500 uppercase font-bold mb-1">Rx Points</p>
                        <p className="text-3xl font-bold text-poke-green">{rxPoints}</p>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                    <p className="text-gray-600 mb-2 font-medium">Current Rank</p>
                    <p className="text-2xl font-bold text-purple-700">{playerLevel}</p>
                </div>

                <div className="pt-4 flex justify-center gap-4">
                    <button
                        onClick={onBackToHome}
                        className="poke-button bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <Home size={20} />
                        BACK TO MENU
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
