import { Square } from '../types';
import { findPawnStart, parseAlgebraicNotation } from './chess';
import { getPieceFromSymbol } from './pieces';

export type Difficulty = 'easy' | 'medium' | 'hard';

const PIECE_VALUES = {
  'P': 1,
  'N': 3,
  'B': 3,
  'R': 5,
  'Q': 9,
  'K': 0
};

export const evaluatePosition = (board: Square[][]): number => {
  let score = 0;

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = board[rank][file];
      if (square.piece) {
        const pieceType = getPieceFromSymbol(square.piece);
        if (pieceType) {
          const value = PIECE_VALUES[pieceType] * (square.color === 'white' ? 1 : -1);
          score += value;
        }
      }
    }
  }

  return score;
};

const getPossibleMoves = (board: Square[][], color: 'white' | 'black'): string[] => {
  const moves: string[] = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const direction = color === 'black' ? 1 : -1;
  const startRank = color === 'black' ? 1 : 6;

  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const square = board[rank][file];
      if (square.color === color && square.piece === (color === 'black' ? '♟' : '♙')) {
        if (rank + direction >= 0 && rank + direction < 8 &&
            !board[rank + direction][file].piece) {
          moves.push(`${files[file]}${8 - (rank + direction)}`);
          if (rank === startRank && !board[rank + (2 * direction)][file].piece) {
            moves.push(`${files[file]}${8 - (rank + (2 * direction))}`);
          }
        }
      }
    }
  }

  return moves;
};

export const getAIMove = (
  board: Square[][],
  difficulty: Difficulty
): string | null => {
  const possibleMoves = getPossibleMoves(board, 'black');

  if (possibleMoves.length === 0) return null;

  switch (difficulty) {
    case 'easy':
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    case 'medium': {
      const moveScores = possibleMoves.map(move => {
        const [toRank, toFile] = parseAlgebraicNotation(move) || [0, 0];
        const from = findPawnStart(board, toRank, toFile, 'black');
        if (!from) return { move, score: -Infinity };
        const tempBoard = board.map(row => [...row]);
        if (from) {
          const [fromRank, fromFile] = from;
          tempBoard[toRank][toFile] = tempBoard[fromRank][fromFile];
          tempBoard[fromRank][fromFile] = { piece: '', color: null };
        }

        return { move, score: evaluatePosition(tempBoard) };
      });

      moveScores.sort((a, b) => b.score - a.score);
      return moveScores[0]?.move || null;
    }

    case 'hard': {
      const moveScores = possibleMoves.map(move => {
        const [toRank, toFile] = parseAlgebraicNotation(move) || [0, 0];
        const from = findPawnStart(board, toRank, toFile, 'black');
        if (!from) return { move, score: -Infinity };

        const tempBoard = board.map(row => [...row]);
        if (from) {
          const [fromRank, fromFile] = from;
          tempBoard[toRank][toFile] = tempBoard[fromRank][fromFile];
          tempBoard[fromRank][fromFile] = { piece: '', color: null };
        }

        const randomFactor = Math.random() * 0.2;
        return { move, score: evaluatePosition(tempBoard) + randomFactor };
      });

      moveScores.sort((a, b) => b.score - a.score);
      return moveScores[0]?.move || null;
    }

    default:
      return null;
  }
};
