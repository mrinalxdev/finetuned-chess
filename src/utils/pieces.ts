type PieceType = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

export const getPieceFromSymbol = (symbol: string): PieceType | null => {
  const mapping: { [key: string]: PieceType } = {
    '♙': 'P', '♟': 'P',
    '♘': 'N', '♞': 'N',
    '♗': 'B', '♝': 'B',
    '♖': 'R', '♜': 'R',
    '♕': 'Q', '♛': 'Q',
    '♔': 'K', '♚': 'K'
  };
  return mapping[symbol] || null;
};

export const isPawnMove = (from: number[], to: number[], color: 'white' | 'black'): boolean => {
  const direction = color === 'white' ? -1 : 1;
  const startRank = color === 'white' ? 6 : 1;
  
  // Regular one square move
  if (from[1] + direction === to[1] && from[0] === to[0]) {
    return true;
  }
  
  // Initial two square move
  if (from[1] === startRank && 
      from[1] + (2 * direction) === to[1] && 
      from[0] === to[0]) {
    return true;
  }
  
  return false;
};