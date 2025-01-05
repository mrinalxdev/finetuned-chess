import React, { useState, useEffect } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { DifficultySelector } from './components/DifficultySelector';
import { initialBoard, isValidMove, parseAlgebraicNotation, findPawnStart } from './utils/chess';
import { movePiece } from './utils/board';
import { getAIMove, Difficulty } from './utils/ai';
import { Settings, History, HelpCircle } from 'lucide-react';

function App() {
  const [board, setBoard] = useState<Square[][]>(initialBoard);
  const [moveInput, setMoveInput] = useState('');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && currentPlayer === 'black') {
      const aiMove = getAIMove(board, difficulty);
      if (aiMove) {
        setTimeout(() => {
          handleMoveInternal(aiMove);
        }, 500);
      }
    }
  }, [currentPlayer, gameStarted]);

  const handleMoveInternal = (move: string) => {
    if (!isValidMove(move)) {
      setError('Invalid move format. Use algebraic notation (e.g., "e4", "Nf3")');
      return;
    }

    const to = parseAlgebraicNotation(move);
    if (!to) {
      setError('Invalid move format');
      return;
    }

    const [toRank, toFile] = to;
    const from = findPawnStart(board, toRank, toFile, currentPlayer);

    if (!from) {
      setError('Invalid move or piece not found');
      return;
    }

    const newBoard = movePiece(board, from[0], from[1], toRank, toFile);
    setBoard(newBoard);
    setMoveHistory([...moveHistory, move]);
    setMoveInput('');
    setError('');
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };

  const handleMove = (e: React.FormEvent) => {
    e.preventDefault();
    handleMoveInternal(moveInput);
  };

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900">Algebraic Chess</h1>
          <button
            onClick={() => setShowDifficultySelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-amber-50 
                     transition-colors shadow-sm border border-amber-200"
          >
            <Settings className="w-5 h-5 text-amber-600" />
            <span className="capitalize">{difficulty} Mode</span>
          </button>
        </div>
        
        {showDifficultySelector && !gameStarted ? (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            onClose={() => setShowDifficultySelector(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-4 text-lg font-semibold flex items-center justify-between">
                  <span className={`${currentPlayer === 'white' ? 'text-amber-600' : 'text-gray-600'}`}>
                    {currentPlayer === 'white' ? 'Your Turn' : 'AI Thinking...'}
                  </span>
                </div>
                <div className="flex justify-center">
                  <ChessBoard board={board} />
                </div>
                
                <form onSubmit={handleMove} className="mt-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={moveInput}
                      onChange={(e) => setMoveInput(e.target.value)}
                      placeholder="Enter move (e.g., e4)"
                      disabled={currentPlayer === 'black'}
                      className="flex-1 px-4 py-2 border border-amber-200 rounded-lg focus:outline-none 
                               focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={currentPlayer === 'black'}
                      className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 
                               focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-400 
                               disabled:cursor-not-allowed transition-colors"
                    >
                      Move
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-red-600 text-sm">{error}</p>
                  )}
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold">Move History</h2>
                </div>
                {moveHistory.length === 0 ? (
                  <p className="text-gray-500">No moves yet</p>
                ) : (
                  <ol className="space-y-2">
                    {moveHistory.map((move, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-8 text-gray-500">{Math.floor(index / 2) + 1}.</span>
                        <span className="font-mono">{move}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-semibold">How to Play</h2>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-mono bg-amber-50 px-2 py-0.5 rounded">e4</span>
                    <span>Move pawn to e4</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono bg-amber-50 px-2 py-0.5 rounded">Nf3</span>
                    <span>Move knight to f3</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono bg-amber-50 px-2 py-0.5 rounded">Bc4</span>
                    <span>Move bishop to c4</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;