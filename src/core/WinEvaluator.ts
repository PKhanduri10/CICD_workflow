import { GAME_CONFIG, SymbolType } from '../config/SlotConfig';

export interface LineWin {
  lineIndex: number;
  symbol: SymbolType;
  matchCount: number;
  payoutMultiplier: number;
  paylinePositions: number[];
}

export interface WinResult {
  isWin: boolean;
  totalPayout: number;
  lineWins: LineWin[];
}

export class WinEvaluator {
  public static evaluate(matrix: SymbolType[][]): WinResult {
    const lineWins: LineWin[] = [];
    let totalPayout = 0;

    const paylines = GAME_CONFIG.paylines;
    const paytable = GAME_CONFIG.paytable;

    paylines.forEach((payline, lineIndex) => {
      // Support both array pattern or object with pattern property
      const pattern: number[] = Array.isArray(payline) ? payline : (payline as any).pattern;
      if (!pattern) return;

      const lineSymbols: SymbolType[] = [];

      for (let colIdx = 0; colIdx < pattern.length; colIdx++) {
        const rowIdx = pattern[colIdx];
        
        // Bounds check to prevent reading undefined
        if (matrix[colIdx] && matrix[colIdx][rowIdx] !== undefined) {
          lineSymbols.push(matrix[colIdx][rowIdx]);
        }
      }

      if (lineSymbols.length === 0) return;

      const firstSymbol = lineSymbols[0];
      let matchCount = 1;

      for (let i = 1; i < lineSymbols.length; i++) {
        if (lineSymbols[i] === firstSymbol) {
          matchCount++;
        } else {
          break;
        }
      }

      const symbolPayouts = paytable[firstSymbol];
      if (symbolPayouts && symbolPayouts[matchCount] && symbolPayouts[matchCount] > 0) {
        const payoutMultiplier = symbolPayouts[matchCount];
        totalPayout += payoutMultiplier;

        lineWins.push({
          lineIndex,
          symbol: firstSymbol,
          matchCount,
          payoutMultiplier,
          paylinePositions: pattern,
        });
      }
    });

    return {
      isWin: lineWins.length > 0,
      totalPayout,
      lineWins,
    };
  }
}