import { Square } from '../types';
import { isPawnMove } from './pieces';

export const createEmptySquare = (): Square => ({ piece: '', color: null });

export const movePiece = (
  board: Square[][],
  fromRank: number,
  fromFile: number,
  toRank: number,
  toFile: number
): Square[][] => {
  const newBoard = board.map(row => [...row]);
  const movingPiece = newBoard[fromRank][fromFile];
  
  newBoard[fromRank][fromFile] = createEmptySquare();
  newBoard[toRank][toFile] = movingPiece;
  
  return newBoard;
};