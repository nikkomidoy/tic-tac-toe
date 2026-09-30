import { Board } from './components/Board';
import { useTicTacToe } from './game/useTicTacToe';

function statusText(winner: string | null, draw: boolean, turn: string): string {
  if (winner) {
    return `${winner} wins!`;
  }
  return draw ? "It's a draw!" : `${turn}'s turn`;
}

export default function App() {
  const game = useTicTacToe();

  return (
    <main className="app">
      <h1>Tic Tac Toe</h1>
      <div role="status" aria-live="polite" className="status">
        {statusText(game.winner, game.draw, game.turn)}
      </div>
      <Board
        board={game.board}
        winningLine={game.winningLine}
        disabled={game.over}
        onPlay={game.play}
      />
      <div className="controls">
        <button type="button" className="ctl" onClick={game.reset}>
          New game
        </button>
        <label>
          <input type="checkbox" checked={game.vsComputer} onChange={game.toggleVsComputer} />
          Play vs computer (O)
        </label>
      </div>
      <div className="score">
        X: {game.score.X} · O: {game.score.O} · Draws: {game.score.draws}
      </div>
    </main>
  );
}
