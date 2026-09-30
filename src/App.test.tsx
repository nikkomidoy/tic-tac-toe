import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const cell = (n: number) => screen.getByRole('button', { name: new RegExp(`^Cell ${n}:`) });

describe('App (two players)', () => {
  beforeEach(async () => {
    render(<App />);
    await userEvent.click(screen.getByLabelText(/play vs computer/i)); // switch off the AI
  });

  it('alternates turns', async () => {
    expect(screen.getByRole('status')).toHaveTextContent("X's turn");
    await userEvent.click(cell(1));
    expect(cell(1)).toHaveTextContent('X');
    expect(screen.getByRole('status')).toHaveTextContent("O's turn");
  });

  it('declares a winner and updates the score', async () => {
    for (const n of [1, 4, 2, 5, 3]) {
      await userEvent.click(cell(n));
    }
    expect(screen.getByRole('status')).toHaveTextContent('X wins!');
    expect(screen.getByText(/X: 1/)).toBeInTheDocument();
    expect(cell(6)).toBeDisabled();
  });

  it('starts a fresh board on New game', async () => {
    await userEvent.click(cell(1));
    await userEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(cell(1)).toHaveTextContent('');
    expect(screen.getByRole('status')).toHaveTextContent("X's turn");
  });
});

describe('App (vs computer)', () => {
  it('replies with a move for O', async () => {
    render(<App />);
    await userEvent.click(cell(1));
    await screen.findByText('O', { selector: 'button' });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent("X's turn"));
  });
});
