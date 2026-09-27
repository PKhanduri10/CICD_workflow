import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GAME_CONFIG, SymbolType } from '../../config/SlotConfig';

export class BackgroundUI extends Container {
  constructor() {
    super();
    this.createBackground();
    this.createHeader();
  }

  private createBackground(): void {
    const bg = new Graphics();
    bg.rect(0, 0, 900, 600).fill(0x1099bb);
    this.addChild(bg);
  }

  private createHeader(): void {
    const title = new Text({
      text: `🎰 ${GAME_CONFIG.reelsCount}x${GAME_CONFIG.rowsCount} Slot Engine 🎰`,
      style: new TextStyle({ fontSize: 32, fill: '#ffffff', fontWeight: 'bold' }),
    });
    title.x = 220;
    title.y = 30;
    this.addChild(title);
  }
}