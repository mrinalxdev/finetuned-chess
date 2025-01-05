import React from 'react';
import { Square } from '../types';

type BoardState = Square[][];

export const ChessBoard: React.FC<{
  board: BoardState;
}> = ({ board }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="inline-block bg-amber-900 p-4 rounded-lg shadow-xl">
      <div className="grid grid-cols-9 gap-0.5 bg-amber-800">
        {/* File labels (top) */}
        <div className="w-8 h-8"></div>
        {files.map((file) => (
          <div key={file} className="w-16 h-8 flex items-center justify-center font-bold text-amber-100">
            {file}
          </div>
        ))}

        {ranks.map((rank, rankIndex) => (
          <React.Fragment key={rank}>
            {/* Rank label */}
            <div className="w-8 h-16 flex items-center justify-center font-bold text-amber-100">
              {rank}
            </div>

            {/* Board squares */}
            {files.map((file, fileIndex) => (
              <div
                key={`${file}${rank}`}
                className={`w-16 h-16 flex items-center justify-center text-4xl transition-colors
                  ${(fileIndex + rankIndex) % 2 === 0 
                    ? 'bg-amber-50 hover:bg-amber-100' 
                    : 'bg-amber-600 hover:bg-amber-500'}`}
              >
                {board[rankIndex][fileIndex].piece && (
                  <span 
                    className={`
                      ${board[rankIndex][fileIndex].color === 'white' 
                        ? 'text-slate-100 drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]' 
                        : 'text-slate-900 drop-shadow-[0_2px_1px_rgba(255,255,255,0.3)]'}
                      transform transition-transform hover:scale-110
                    `}
                  >
                    {board[rankIndex][fileIndex].piece}
                  </span>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};