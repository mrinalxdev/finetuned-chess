import React from 'react';
import { Swords } from 'lucide-react';
import { Difficulty } from '../utils/ai';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect, onClose }) => {
  const difficulties: { level: Difficulty; description: string }[] = [
    { 
      level: 'easy', 
      description: 'Perfect for beginners. The AI makes random legal moves.' 
    },
    { 
      level: 'medium', 
      description: 'For intermediate players. The AI evaluates positions and makes strategic moves.' 
    },
    { 
      level: 'hard', 
      description: 'For advanced players. The AI plays more aggressively and unpredictably.' 
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Swords className="w-8 h-8 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Opponent</h2>
        </div>
        
        <div className="space-y-4">
          {difficulties.map(({ level, description }) => (
            <button
              key={level}
              onClick={() => {
                onSelect(level);
                onClose();
              }}
              className="w-full p-4 text-left rounded-lg border-2 border-amber-100 hover:border-amber-500 
                       hover:bg-amber-50 transition-all duration-200 group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold capitalize text-gray-900 group-hover:text-amber-700">
                  {level}
                </span>
                <Swords className={`w-5 h-5 
                  ${level === 'easy' ? 'text-green-500' : 
                    level === 'medium' ? 'text-amber-500' : 'text-red-500'}`} 
                />
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};