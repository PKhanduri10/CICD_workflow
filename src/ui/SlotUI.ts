import { Application } from 'pixi.js';
import { SymbolType } from '../config/SlotConfig';
import { MainContainerUI } from './gameLayer/GameLayer';

export class SlotUI {
  public app: Application;
  public mainContainer!: MainContainerUI;

  constructor() {
    this.app = new Application();
  }

  public async init(): Promise<void> {
    await this.app.init({ width: 900, height: 600 });
    document.body.appendChild(this.app.canvas);

    this.mainContainer = new MainContainerUI();
    this.app.stage.addChild(this.mainContainer);
  }

  public renderMatrix(matrix: SymbolType[][]): void {
    this.mainContainer.reelContainerUI.renderMatrix(matrix);
  }

  public showWinResult(message: string, isWin: boolean): void {
    this.mainContainer.resultText.text = message;
    this.mainContainer.resultText.style.fill = isWin ? '#00ff00' : '#ff0000';
  }
}