import { Application } from "pixi.js";
import { SlotEventHandler } from "./events/SlotEventHandler";
import { Game } from "./ui/Game";

async function initApplication(): Promise<void> {
  // Initialize PixiJS View Layer
  const app = new Application();
  await app.init({ width: 900, height: 600 });
  document.body.appendChild(app.canvas);

  const game = new Game();
  game.init(app.stage);

  // Attach Event Controller to UI
  new SlotEventHandler(game);

  console.log('🎰 Slot Game Initialized Successfully!');
}

initApplication().catch(console.error);