import { GAME_CONFIG, SymbolType } from '../config/SlotConfig';

export interface ReelSpinResult {
  stopPositions: number[];        // Random stop index for each reel
  visibleMatrix: SymbolType[][];  // [reelIndex][rowIndex]
}

export class ReelEngine {
  public static generateSpin(): ReelSpinResult {
    const stopPositions: number[] = [];
    const visibleMatrix: SymbolType[][] = [];

    for (let reelIdx = 0; reelIdx < GAME_CONFIG.reelsCount; reelIdx++) {
      const strip = GAME_CONFIG.reelStrips[reelIdx];
      const stopPos = Math.floor(Math.random() * strip.length);
      stopPositions.push(stopPos);

      const reelSymbols: SymbolType[] = [];
      for (let rowIdx = 0; rowIdx < GAME_CONFIG.rowsCount; rowIdx++) {
        const symbolPos = (stopPos + rowIdx) % strip.length;
        reelSymbols.push(strip[symbolPos]);
      }
      visibleMatrix.push(reelSymbols);
    }

    return { stopPositions, visibleMatrix };
  }
}