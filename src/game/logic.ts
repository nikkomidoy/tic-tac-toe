export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly Cell[];

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const emptyBoard = (): Board => Array<Cell>(9).fill(null);

export const otherPlayer = (player: Player): Player => (player === 'X' ? 'O' : 'X');

/** Returns the winning line, or null if nobody has won. */
export function findWinningLine(board: Board): readonly [number, number, number] | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const first = board[a];
    if (first && first === board[b] && first === board[c]) {
      return line;
    }
  }
  return null;
}

export const isFull = (board: Board): boolean => board.every(Boolean);

export function applyMove(board: Board, index: number, player: Player): Board {
  if (board[index]) {
    throw new Error(`Cell ${index} is already taken`);
  }
  return board.map((cell, i) => (i === index ? player : cell));
}

/** Score from O's perspective: +1 O wins, -1 X wins, 0 draw. `toMove` plays next. */
function minimax(board: Board, toMove: Player): number {
  if (findWinningLine(board)) {
    return toMove === 'O' ? -1 : 1; // the previous mover won
  }
  if (isFull(board)) {
    return 0;
  }
  const scores = board.flatMap((cell, i) =>
    cell ? [] : [minimax(applyMove(board, i, toMove), otherPlayer(toMove))],
  );
  return toMove === 'O' ? Math.max(...scores) : Math.min(...scores);
}

/** Best move for `player` (unbeatable). Returns -1 if the board is full. */
export function bestMove(board: Board, player: Player): number {
  let best = -1;
  let bestScore = -Infinity;
  board.forEach((cell, i) => {
    if (cell) {
      return;
    }
    const raw = minimax(applyMove(board, i, player), otherPlayer(player));
    const score = player === 'O' ? raw : -raw;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}
