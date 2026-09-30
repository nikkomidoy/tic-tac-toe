import type { Board as BoardState } from '../game/logic';

interface BoardProps {
  board: BoardState;
  winningLine: readonly number[] | null;
  disabled: boolean;
  onPlay: (index: number) => void;
}

export function Board({ board, winningLine, disabled, onPlay }: BoardProps) {
  return (
    <div className="board">
      {board.map((cell, i) => {
        const classes = ['cell', cell, winningLine?.includes(i) ? 'win' : null]
          .filter(Boolean)
          .join(' ');
        return (
          <button
            // Board positions are fixed, so the index is a stable key.
            key={i}
            type="button"
            className={classes}
            disabled={disabled || cell !== null}
            aria-label={`Cell ${i + 1}: ${cell ?? 'empty'}`}
            onClick={() => onPlay(i)}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
