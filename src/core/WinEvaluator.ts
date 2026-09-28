import { GAME_CONFIG, SymbolType } from '../config/SlotConfig';

export interface LineWin {
  paylineId: number;
  symbol: SymbolType;
  matchCount: number;
  payout: number;
}

export interface WinResult {
  totalPayout: number;
  lineWins: LineWin[];
  isWin: boolean;
}

export class WinEvaluator {
  public static evaluate(visibleMatrix: SymbolType[][]): WinResult {
    if (GAME_CONFIG.evaluationMode === 'PAYLINES') {
      return this.evaluatePaylines(visibleMatrix);
    } else {
      return this.evaluateWays(visibleMatrix);
    }
  }

  private static evaluatePaylines(matrix: SymbolType[][]): WinResult {
    const lineWins: LineWin[] = [];
    let totalPayout = 0;

    for (const payline of GAME_CONFIG.paylines) {
      const lineSymbols: SymbolType[] = [];

      for (let reelIdx = 0; reelIdx < GAME_CONFIG.reelsCount; reelIdx++) {
        const rowIdx = payline.pattern[reelIdx];
        lineSymbols.push(matrix[reelIdx][rowIdx]);
      }

      // Check left-to-right matching
      const firstSymbol = lineSymbols[0];
      let matchCount = 1;

      for (let i = 1; i < lineSymbols.length; i++) {
        if (lineSymbols[i] === firstSymbol || lineSymbols[i] === 'WILD') {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const payout = GAME_CONFIG.paytable[firstSymbol]?.[matchCount] || 0;
        if (payout > 0) {
          lineWins.push({
            paylineId: payline.id,
            symbol: firstSymbol,
            matchCount,
            payout,
          });
          totalPayout += payout;
        }
      }
    }

    return { totalPayout, lineWins, isWin: totalPayout > 0 };
  }

  private static evaluateWays(matrix: SymbolType[][]): WinResult {
    // 243 Ways / All Ways Win Evaluation Strategy
    let totalPayout = 0;
    const lineWins: LineWin[] = [];

    // Ways calculation logic
    return { totalPayout, lineWins, isWin: totalPayout > 0 };
  }
}
