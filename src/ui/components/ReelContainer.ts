import { Container, Graphics, Ticker } from 'pixi.js';
import { GAME_CONFIG, SymbolType } from '../../config/SlotConfig';
import { SymbolUI } from './Symbols';
export type ReelState = 'STOPPED' | 'STARTING' | 'SPINNING' | 'STOPPING' | 'DECELERATING';

export class ReelContainer extends Container {
  private reels: Container[] = [];
  public symbolMatrixUI: SymbolUI[][] = [];
  public reelStates: ReelState[] = [];

  private symbolHeight: number = 90;
  private symbolWidth: number = 110;

  constructor() {
    super();
    this.initReelsWithMask();
  }

  private initReelsWithMask(): void {
    const totalCols = GAME_CONFIG.reelsCount;
    const totalRows = GAME_CONFIG.rowsCount;

    // Grid viewport mask
    const maskGraphic = new Graphics();
    maskGraphic.rect(0, 0, totalCols * this.symbolWidth, totalRows * this.symbolHeight).fill(0x000000);
    this.addChild(maskGraphic);
    this.mask = maskGraphic;

    for (let col = 0; col < totalCols; col++) {
      const reel = new Container();
      reel.x = col * this.symbolWidth;
      this.addChild(reel);
      this.reels.push(reel);

      this.symbolMatrixUI[col] = [];
      this.reelStates[col] = 'STOPPED';

      // 3 visible rows + 3 buffer rows (total 6 per column) for continuous downward streaming
      for (let row = 0; row < totalRows + 3; row++) {
        const symbol = new SymbolUI();
        symbol.y = (row - 1) * this.symbolHeight;
        reel.addChild(symbol);

        if (row >= 1 && row <= totalRows) {
          this.symbolMatrixUI[col][row - 1] = symbol;
        }
      }
    }
  }

  public renderMatrix(matrix: SymbolType[][]): void {
    for (let col = 0; col < GAME_CONFIG.reelsCount; col++) {
      for (let row = 0; row < GAME_CONFIG.rowsCount; row++) {
        if (this.symbolMatrixUI[col] && this.symbolMatrixUI[col][row]) {
          this.symbolMatrixUI[col][row].setSymbol(matrix[col][row]);
        }
      }
    }
  }

  public startSpinAnimation(targetMatrix: SymbolType[][], onComplete: () => void): void {
    const totalCols = GAME_CONFIG.reelsCount;
    const totalRows = GAME_CONFIG.rowsCount;
    let totalStopped = 0;


    for (let col = 0; col < totalCols; col++) {
      const reelCol = this.reels[col];
      this.reelStates[col] = 'STARTING';

      const maxSpeed = 25;
      const minStoppingSpeed = 6;
      let currentSpeed = maxSpeed;

      let targetQueue: SymbolType[] = [];
      let targetIndex = 0;
      const staggerDelay = col * 350;

      const spinTicker = (ticker: Ticker) => {
        const delta = ticker.deltaTime;

        if (this.reelStates[col] === 'STARTING') {
          this.reelStates[col] = 'SPINNING';
        }

        // Deceleration Phase
        if (this.reelStates[col] === 'STOPPING') {
          if (currentSpeed > minStoppingSpeed) {
            currentSpeed *= 0.84;
          }
        }

        // Shift symbols downward
        reelCol.children.forEach((child) => {
          child.y += currentSpeed * delta;

          // Wrap around boundary check
          if (child.y >= (totalRows + 1) * this.symbolHeight) {
            child.y -= (totalRows + 3) * this.symbolHeight;

            if (child instanceof SymbolUI) {
              if (
                (this.reelStates[col] === 'STOPPING' || this.reelStates[col] === 'DECELERATING') &&
                targetIndex < targetQueue.length
              ) {
                child.setSymbol(targetQueue[targetIndex]);
                targetIndex++;
              } else {
                const randomSym = GAME_CONFIG.symbols[Math.floor(Math.random() * GAME_CONFIG.symbols.length)];
                child.setSymbol(randomSym);
              }
            }
          }
        });

        // Final Landing & Alignment Lock Phase
        if (
          (this.reelStates[col] === 'STOPPING' || this.reelStates[col] === 'DECELERATING') &&
          targetIndex >= targetQueue.length
        ) {
          this.reelStates[col] = 'DECELERATING';
          currentSpeed *= 0.78;

          if (currentSpeed < 1.5) {
            currentSpeed = 0;
            this.reelStates[col] = 'STOPPED';
            Ticker.shared.remove(spinTicker);

            // FIX 1: Exact Y-Position Snapping to prevent misalignment
            reelCol.children.forEach((child) => {
              const nearestRow = Math.round(child.y / this.symbolHeight);
              child.y = nearestRow * this.symbolHeight;
            });

            // FIX 2: Sort children by exact position and map to visible viewport
            const childrenSorted = [...reelCol.children].sort((a, b) => a.y - b.y);

            for (let row = 0; row < totalRows; row++) {
              // Index offset adjusted for top buffer symbol (row + 1)
              const visibleChild = childrenSorted[row + 1];
              if (visibleChild instanceof SymbolUI) {
                this.symbolMatrixUI[col][row] = visibleChild;
              }
            }

            // FIX 3: Global callback trigger when ALL reels stop
            totalStopped++;
            if (totalStopped === totalCols) {
              onComplete();
            }
          }
        }
      };

      Ticker.shared.add(spinTicker);

      // Trigger Stopping Phase
      setTimeout(() => {
        targetQueue = [];

        // Load symbols from top row to bottom row for natural downward entry
        for (let row = 0; row < totalRows; row++) {
          targetQueue.push(targetMatrix[col][row]);
        }

        // Buffer symbol for seamless wrap-around top padding
        targetQueue.push(GAME_CONFIG.symbols[Math.floor(Math.random() * GAME_CONFIG.symbols.length)]);

        this.reelStates[col] = 'STOPPING';
      }, 900 + staggerDelay);
    }
  }
}