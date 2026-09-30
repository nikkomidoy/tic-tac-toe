import { useCallback, useEffect, useState } from 'react';
import {
  applyMove,
  bestMove,
  emptyBoard,
  findWinningLine,
  isFull,
  otherPlayer,
  type Board,
  type Player,
} from './logic';

export interface Score {
  X: number;
  O: number;
  draws: number;
}

const COMPUTER: Player = 'O';
const COMPUTER_DELAY_MS = 300;

export function useTicTacToe() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Player>('X');
  const [vsComputer, setVsComputer] = useState(true);
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draws: 0 });

  const winningLine = findWinningLine(board);
  const winner = winningLine ? (board[winningLine[0]] ?? null) : null;
  const draw = !winner && isFull(board);
  const over = winner !== null || draw;

  const play = useCallback(
    (index: number) => {
      if (over || board[index]) {
        return;
      }
      const next = applyMove(board, index, turn);
      setBoard(next);
      if (findWinningLine(next)) {
        setScore((s) => ({ ...s, [turn]: s[turn] + 1 }));
      } else if (isFull(next)) {
        setScore((s) => ({ ...s, draws: s.draws + 1 }));
      } else {
        setTurn(otherPlayer(turn));
      }
    },
    [board, over, turn],
  );

  useEffect(() => {
    if (!vsComputer || over || turn !== COMPUTER) {
      return;
    }
    const timer = setTimeout(() => play(bestMove(board, COMPUTER)), COMPUTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [board, over, play, turn, vsComputer]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setTurn('X');
  }, []);

  const toggleVsComputer = useCallback(() => {
    setVsComputer((v) => !v);
    reset();
  }, [reset]);

  return {
    board,
    turn,
    winner,
    winningLine,
    draw,
    over,
    score,
    vsComputer,
    play,
    reset,
    toggleVsComputer,
  };
}
