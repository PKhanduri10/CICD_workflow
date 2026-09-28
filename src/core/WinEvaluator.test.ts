import { describe, it, expect } from 'vitest';
import { WinEvaluator } from './WinEvaluator';
import { SymbolType } from '../config/SlotConfig';

describe('WinEvaluator Core Engine', () => {
  it('should return isWin: false when no matching paylines exist', () => {
    // Non-winning 3x3 matrix setup
    const noWinMatrix: SymbolType[][] = [
      ['SEVEN', 'CHERRY', 'BAR'],
      ['BAR', 'SEVEN', 'CHERRY'],
      ['CHERRY', 'BAR', 'SEVEN'],
    ];

    const result = WinEvaluator.evaluate(noWinMatrix);
    expect(result.isWin).toBe(false);
    expect(result.totalPayout).toBe(0);
    expect(result.lineWins.length).toBe(0);
  });

  it('should detect a winning payline across row 0 (Line 1 match)', () => {
    // Horizontal match on row 0
    const winningMatrix: SymbolType[][] = [
      ['SEVEN', 'CHERRY', 'BAR'],
      ['SEVEN', 'BAR', 'CHERRY'],
      ['SEVEN', 'CHERRY', 'BAR'],
    ];

    const result = WinEvaluator.evaluate(winningMatrix);
    expect(result.isWin).toBe(true);
    expect(result.totalPayout).toBeGreaterThan(0);
    expect(result.lineWins.length).toBeGreaterThanOrEqual(1);
    expect(result.lineWins[0].symbol).toBe('SEVEN');
    expect(result.lineWins[0].matchCount).toBe(3);
  });
});