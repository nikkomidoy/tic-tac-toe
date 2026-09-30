import { applyMove, bestMove, emptyBoard, findWinningLine, isFull, type Board } from './logic';

const b = (s: string): Board => [...s].map((ch) => (ch === 'X' || ch === 'O' ? ch : null));

describe('findWinningLine', () => {
  it('returns null for an empty board', () => {
    expect(findWinningLine(emptyBoard())).toBeNull();
  });

  it('detects rows, columns and diagonals', () => {
    expect(findWinningLine(b('XXX......'))).toEqual([0, 1, 2]);
    expect(findWinningLine(b('O..O..O..'))).toEqual([0, 3, 6]);
    expect(findWinningLine(b('..X.X.X..'))).toEqual([2, 4, 6]);
  });
});

describe('applyMove', () => {
  it('does not mutate the original board', () => {
    const board = emptyBoard();
    const next = applyMove(board, 4, 'X');
    expect(board[4]).toBeNull();
    expect(next[4]).toBe('X');
  });

  it('rejects taken cells', () => {
    expect(() => applyMove(b('X........'), 0, 'O')).toThrow();
  });
});

describe('bestMove', () => {
  it('takes a winning move', () => {
    expect(bestMove(b('OO.XX....'), 'O')).toBe(2);
  });

  it('blocks an opponent win', () => {
    expect(bestMove(b('XX.O.....'), 'O')).toBe(2);
  });

  it('never loses against any sequence of X moves', () => {
    const explore = (board: Board): void => {
      const line = findWinningLine(board);
      if (line) {
        expect(board[line[0]]).not.toBe('X');
        return;
      }
      if (isFull(board)) {
        return;
      }
      board.forEach((cell, i) => {
        if (cell) {
          return;
        }
        const afterX = applyMove(board, i, 'X');
        if (findWinningLine(afterX)) {
          throw new Error('X won');
        }
        if (isFull(afterX)) {
          return;
        }
        explore(applyMove(afterX, bestMove(afterX, 'O'), 'O'));
      });
    };
    explore(emptyBoard());
  });
});
