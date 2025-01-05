import { Square } from '../types';
import { movePiece } from './board';

export const initialBoard = [
  [
    { piece: '♜', color: 'black' }, { piece: '♞', color: 'black' }, { piece: '♝', color: 'black' },
    { piece: '♛', color: 'black' }, { piece: '♚', color: 'black' }, { piece: '♝', color: 'black' },
    { piece: '♞', color: 'black' }, { piece: '♜', color: 'black' }
  ],
  Array(8).fill(null).map(() => ({ piece: '♟', color: 'black' })),
  Array(8).fill(null).map(() => ({ piece: '', color: null })),
  Array(8).fill(null).map(() => ({ piece: '', color: null })),
  Array(8).fill(null).map(() => ({ piece: '', color: null })),
  Array(8).fill(null).map(() => ({ piece: '', color: null })),
  Array(8).fill(null).map(() => ({ piece: '♙', color: 'white' })),
  [
    { piece: '♖', color: 'white' }, { piece: '♘', color: 'white' }, { piece: '♗', color: 'white' },
    { piece: '♕', color: 'white' }, { piece: '♔', color: 'white' }, { piece: '♗', color: 'white' },
    { piece: '♘', color: 'white' }, { piece: '♖', color: 'white' }
  ]
];

export const parseAlgebraicNotation = (move: string): [number, number] | null => {
  const match = move.match(/^([NBRQK])?([a-h])([1-8])$/);
  if (!match) return null;

  const [, , file, rank] = match;
  const fileIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = 8 - parseInt(rank);
  
  return [rankIndex, fileIndex];
};

export const findPawnStart = (board: Square[][], toRank: number, toFile: number, color: 'white' | 'black'): [number, number] | null => {
  const direction = color === 'white' ? 1 : -1;
  const possibleFromRanks = [toRank + direction];
  
  // Check for initial two-square move
  if ((color === 'white' && toRank === 4) || (color === 'black' && toRank === 3)) {
    possibleFromRanks.push(toRank + (2 * direction));
  }
  
  for (const fromRank of possibleFromRanks) {
    if (fromRank >= 0 && fromRank < 8 && 
        board[fromRank][toFile].piece === (color === 'white' ? '♙' : '♟')) {
      return [fromRank, toFile];
    }
  }
  
  return null;
};

export const isValidMove = (move: string): boolean => {
  const basicMove = /^([NBRQK])?([a-h])([1-8])$/;
  return basicMove.test(move);
};