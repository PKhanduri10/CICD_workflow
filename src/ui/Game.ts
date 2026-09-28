import { Application, Container } from 'pixi.js';
import { SymbolType } from '../config/SlotConfig';
import { GameContainer } from './gameLayer/GameLayer';

export class Game {
  public gameContainer!: GameContainer;
 
  public init(stage:Container): void {
    this.gameContainer = new GameContainer();
    stage.addChild(this.gameContainer);
  }

  public renderMatrix(matrix: SymbolType[][]): void {
    this.gameContainer.reelContainerUI.renderMatrix(matrix);
  }

  public showWinResult(message: string, isWin: boolean): void {
    this.gameContainer.resultText.text = message;
    this.gameContainer.resultText.style.fill = isWin ? '#00ff00' : '#ff0000';
  }
}