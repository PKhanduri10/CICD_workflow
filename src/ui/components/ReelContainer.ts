import { Container, Graphics, Ticker } from 'pixi.js';
import { GAME_CONFIG, SymbolType } from '../../config/SlotConfig';
import { SymbolUI } from './Symbols';

export class ReelContainer extends Container {
 private reelColumns: Container[] = [];
  private symbolMatrixUI: SymbolUI[][] = [];
  private isSpinning: boolean = false;

  private symbolHeight: number = 90;
  private symbolWidth: number = 110;

  constructor() {
    super();
    this.initReelsWithMask();
  }

  private initReelsWithMask(): void {
    const totalCols = GAME_CONFIG.reelsCount;
    const totalRows = GAME_CONFIG.rowsCount;

    // 1. Create Masking Frame so symbols scrolling outside grid are clipped
    const maskGraphic = new Graphics();
    maskGraphic.rect(0, 0, totalCols * this.symbolWidth, totalRows * this.symbolHeight).fill(0x000000);
    this.addChild(maskGraphic);
    this.mask = maskGraphic;

    // 2. Build Reel Columns & Symbols
    for (let col = 0; col < totalCols; col++) {
      const reelColumn = new Container();
      reelColumn.x = col * this.symbolWidth;
      this.addChild(reelColumn);
      this.reelColumns.push(reelColumn);

      this.symbolMatrixUI[col] = [];

      // Render visible symbols + 2 extra buffer symbols for smooth infinite loop scrolling
      for (let row = 0; row < totalRows + 2; row++) {
        const symbol = new SymbolUI();
        symbol.y = (row - 1) * this.symbolHeight; // Starts offset from top (-1)
        reelColumn.addChild(symbol);

        if (row < totalRows) {
          this.symbolMatrixUI[col][row] = symbol;
        }
      }
    }
  }

  // Physical Smooth Reel Spin Animation Loop
  public startSpinAnimation(targetMatrix: SymbolType[][], onComplete: () => void): void {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const totalCols = GAME_CONFIG.reelsCount;
    const totalRows = GAME_CONFIG.rowsCount;

    let completedCount = 0;

    for (let col = 0; col < totalCols; col++) {
      const reelCol = this.reelColumns[col];
      let speed = 35; // Initial spin speed (pixels per frame)
      let stopping = false;
      const staggerDelay = col * 300; // Staggered stop delay per reel (300ms)

      const spinTicker = (ticker: Ticker) => {
        const delta = ticker.deltaTime;

        // Shift all symbols downward vertically
        reelCol.children.forEach((child) => {
          child.y += speed * delta;

          // Recycle symbol to top when it moves beyond bottom viewport
          if (child.y >= totalRows * this.symbolHeight) {
            child.y -= (totalRows + 2) * this.symbolHeight;

            // Assign random symbol while spinning fast
            if (!stopping && child instanceof SymbolUI) {
              const randomSymbol = GAME_CONFIG.symbols[Math.floor(Math.random() * GAME_CONFIG.symbols.length)];
              child.setSymbol(randomSymbol);
            }
          }
        });
      };

      // Register spin loop on PixiJS Ticker
      Ticker.shared.add(spinTicker);

      // Trigger Stopping Phase for this reel
      setTimeout(() => {
        stopping = true;

        // Lock target symbols into exact position
        for (let row = 0; row < totalRows; row++) {
          if (this.symbolMatrixUI[col][row]) {
            this.symbolMatrixUI[col][row].setSymbol(targetMatrix[col][row]);
          }
        }

        // Decelerate & Snap positions
        const stopTimer = setInterval(() => {
          speed *= 0.75; // Gradual slowdown

          if (speed < 2) {
            clearInterval(stopTimer);
            Ticker.shared.remove(spinTicker);

            // Reset & Snap symbols to exact Y coordinates with small Bounce Effect
            for (let row = 0; row < reelCol.children.length; row++) {
              const child = reelCol.children[row];
              const targetY = (row - 1) * this.symbolHeight;
              child.y = targetY; // Snap to precise grid position
            }

            completedCount++;
            if (completedCount === totalCols) {
              this.isSpinning = false;
              onComplete(); // All reels stopped
            }
          }
        }, 50);
      }, 1200 + staggerDelay);
    }
  }
}