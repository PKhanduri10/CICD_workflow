import { describe, it, expect } from 'vitest';
import { WinEvaluator } from './WinEvaluator';
import { SymbolType } from '../config/SlotConfig';

describe('WinEvaluator Core Engine', () => {
  it('should return isWin: false when no matching paylines exist', () => {
    // Completely alternating matrix to ensure zero consecutive matches across any payline pattern
    const noWinMatrix: SymbolType[][] = [
      ['SEVEN', 'CHERRY', 'BAR'],
      ['BAR', 'SEVEN', 'CHERRY'],
      ['SEVEN', 'BAR', 'CHERRY'],
      ['BAR', 'CHERRY', 'SEVEN'],
      ['CHERRY', 'SEVEN', 'BAR'],
    ];

    const result = WinEvaluator.evaluate(noWinMatrix);
    expect(result.isWin).toBe(false);
    expect(result.totalPayout).toBe(0);
    expect(result.lineWins.length).toBe(0);
  });

  it('should detect a winning payline across row 0', () => {
    const winningMatrix: SymbolType[][] = [
      ['SEVEN', 'CHERRY', 'BAR'],
      ['SEVEN', 'BAR', 'CHERRY'],
      ['SEVEN', 'CHERRY', 'BAR'],
      ['SEVEN', 'BAR', 'CHERRY'],
      ['SEVEN', 'CHERRY', 'BAR'],
    ];

    const result = WinEvaluator.evaluate(winningMatrix);
    expect(result.isWin).toBe(true);
    expect(result.totalPayout).toBeGreaterThan(0);
    expect(result.lineWins.length).toBeGreaterThanOrEqual(1);
    expect(result.lineWins[0].symbol).toBe('SEVEN');
  });
});