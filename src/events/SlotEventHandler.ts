import { ReelEngine } from "../core/ReelEngine";
import { WinEvaluator } from "../core/WinEvaluator";
import { SlotUI } from "../ui/SlotUI";

export class SlotEventHandler {
  private ui: SlotUI;

  constructor(ui: SlotUI) {
    this.ui = ui;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.ui.mainContainer.buttonUI.buttonGraphic.on('pointerdown', () => this.handleSpin());
  }

  private handleSpin(): void {
    // 1. Disable Spin Button while reels are spinning
    this.ui.mainContainer.buttonUI.setEnabled(false);
    this.ui.showWinResult('Spinning...', false);

    // 2. Generate Random Spin Matrix from Engine
    const spinResult = ReelEngine.generateSpin();

    // 3. Trigger UI Animated Reel Spin
    this.ui.mainContainer.reelContainerUI.startSpinAnimation(
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
        this.ui.mainContainer.buttonUI.setEnabled(true);
      }
    );
  }
}