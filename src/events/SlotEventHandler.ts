import { ReelEngine } from "../core/ReelEngine";
import { WinEvaluator } from "../core/WinEvaluator";
import { Game } from "../ui/Game";

export class SlotEventHandler {
  private ui: Game;

  constructor(ui: Game) {
    this.ui = ui;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.ui.gameContainer.buttonUI.buttonGraphic.on('pointerdown', () => this.handleSpin());
  }

  private handleSpin(): void {
    // 1. Disable Spin Button while reels are spinning
    this.ui.gameContainer.buttonUI.setEnabled(false);
    this.ui.showWinResult('Spinning...', false);

    // 2. Generate Random Spin Matrix from Engine
    const spinResult = ReelEngine.generateSpin();

    // 3. Trigger UI Animated Reel Spin
    this.ui.gameContainer.reelContainerUI.startSpinAnimation(
      spinResult.visibleMatrix,
      () => {
        // Callback executed ONLY when all reels stop spinning
        const winResult = WinEvaluator.evaluate(spinResult.visibleMatrix);

        if (winResult.isWin) {
          this.ui.showWinResult(
            `WIN! Total Payout: x${winResult.totalPayout} (${winResult.lineWins.length} lines)`,
            true
          );
        } else {
          this.ui.showWinResult('No Win. Try Again!', false);
        }

        // Re-enable Spin Button
        this.ui.gameContainer.buttonUI.setEnabled(true);
      }
    );
  }
}