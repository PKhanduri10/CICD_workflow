import { describe, it, expect } from 'vitest';
import { WinEvaluator } from './WinEvaluator';
import { SymbolType } from '../config/SlotConfig';

describe('Win Evaluator Engine', () => {
  it('should detect a 5-of-a-kind SEVEN payline win', () => {
    // Matrix with 5 SEVENs on middle row (index 1)
    const mockMatrix: SymbolType[][] = [
      ['CHERRY', 'SEVEN', 'BAR'],
      ['LEMON',  'SEVEN', 'BAR'],
      ['CHERRY', 'SEVEN', 'LEMON'],
      ['BAR',    'SEVEN', 'CHERRY'],
      ['LEMON',  'SEVEN', 'BAR'],
    ];

    const result = WinEvaluator.evaluate(mockMatrix);
    expect(result.isWin).toBe(true);
    expect(result.totalPayout).toBeGreaterThan(0);
  });
});