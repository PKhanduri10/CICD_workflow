import { Container, Text, TextStyle } from 'pixi.js';
import { ReelContainer } from '../components/ReelContainer';
import { ButtonUI } from '../components/ButtonContainer';
import { BackgroundUI } from '../components/GameBackground';

export class MainContainerUI extends Container {
  public backgroundLayer: Container;
  public reelsLayer: Container;
  public uiLayer: Container;
  public foregroundLayer: Container;

  // Components
  public reelContainerUI: ReelContainer;
  public buttonUI: ButtonUI;
  public resultText: Text;

  constructor() {
    super();

    // 1. Initialize Z-Layer Containers
    this.backgroundLayer = new Container();
    this.reelsLayer = new Container();
    this.uiLayer = new Container();
    this.foregroundLayer = new Container();

    this.addChild(this.backgroundLayer);
    this.addChild(this.reelsLayer);
    this.addChild(this.uiLayer);
    this.addChild(this.foregroundLayer);

    // 2. Add Background
    const bg = new BackgroundUI();
    this.backgroundLayer.addChild(bg);

    // 3. Add Reel Container to Reels Layer
    this.reelContainerUI = new ReelContainer();
    this.reelContainerUI.x = 180;
    this.reelContainerUI.y = 120;
    this.reelsLayer.addChild(this.reelContainerUI);

    // 4. Add Buttons & Win Displays to UI Layer
    this.buttonUI = new ButtonUI();
    this.buttonUI.x = 370;
    this.buttonUI.y = 500;
    this.uiLayer.addChild(this.buttonUI);

    this.resultText = new Text({
      text: 'Press SPIN to Start!',
      style: new TextStyle({ fontSize: 24, fill: '#ffff00' }),
    });
    this.resultText.x = 260;
    this.resultText.y = 430;
    this.uiLayer.addChild(this.resultText);
  }
}