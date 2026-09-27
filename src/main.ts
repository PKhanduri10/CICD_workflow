import { SlotEventHandler } from "./events/SlotEventHandler";
import { SlotUI } from "./ui/SlotUI";

async function initApplication(): Promise<void> {
  // Initialize PixiJS View Layer
  const ui = new SlotUI();
  await ui.init();

  // Attach Event Controller to UI
  new SlotEventHandler(ui);

  console.log('🎰 Slot Game Initialized Successfully!');
}

initApplication().catch(console.error);