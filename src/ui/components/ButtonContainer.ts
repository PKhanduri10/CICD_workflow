import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class ButtonUI extends Container {
  public buttonGraphic: Graphics;
  private buttonText: Text;

  constructor() {
    super();
    this.buttonGraphic = new Graphics();
    this.buttonGraphic.rect(0, 0, 160, 50).fill(0xff0000);
    this.buttonGraphic.eventMode = 'static';
    this.buttonGraphic.cursor = 'pointer';
    this.addChild(this.buttonGraphic);

    this.buttonText = new Text({
      text: 'SPIN',
      style: new TextStyle({ fontSize: 22, fill: '#ffffff', fontWeight: 'bold' }),
    });
    this.buttonText.x = 52;
    this.buttonText.y = 12;
    this.addChild(this.buttonText);
  }

  public setEnabled(enabled: boolean): void {
    this.buttonGraphic.eventMode = enabled ? 'static' : 'none';
    this.buttonGraphic.alpha = enabled ? 1.0 : 0.5;
  }
}