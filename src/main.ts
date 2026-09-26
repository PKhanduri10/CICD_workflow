import { Application, Container, Graphics, Text } from 'pixi.js';

// Configuration
const REEL_COUNT = 3;
const SYMBOL_SIZE = 100;
const REEL_WIDTH = 120;
const SYMBOLS = ['🍎', '🍋', '🍒', '🔔', '💎', '7️⃣'];

interface Reel {
  container: Container;
  symbols: Text[];
  position: number;
}

async function initSlotGame(): Promise<void> {
  // 1. Initialize PixiJS App
  const app = new Application();
  await app.init({
    width: REEL_COUNT * REEL_WIDTH,
    height: SYMBOL_SIZE * 3,
    backgroundColor: 0x0f172a,
  });

  const container = document.getElementById('game-container');
  if (container) {
    container.appendChild(app.canvas as HTMLCanvasElement);
  }

  // 2. Create Reels Container
  const reelsContainer = new Container();
  app.stage.addChild(reelsContainer);

  const reels: Reel[] = [];

  // 3. Build Reels & Symbols
  for (let i = 0; i < REEL_COUNT; i++) {
    const reelContainer = new Container();
    reelContainer.x = i * REEL_WIDTH + (REEL_WIDTH - SYMBOL_SIZE) / 2;
    reelsContainer.addChild(reelContainer);

    const reel: Reel = {
      container: reelContainer,
      symbols: [],
      position: 0,
    };

    // Add 4 symbols per reel
    for (let j = 0; j < 4; j++) {
      const symbolText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      
      const symbol = new Text({
        text: symbolText,
        style: {
          fontSize: 60,
        },
      });

      symbol.y = j * SYMBOL_SIZE;
      symbol.x = (SYMBOL_SIZE - symbol.width) / 2;

      reel.symbols.push(symbol);
      reelContainer.addChild(symbol);
    }

    reels.push(reel);
  }

  // 4. Spin Logic Function
  let running = false;

  function spin(): void {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extraSpins = Math.floor(Math.random() * 3) + 3;
      const targetPosition = r.position + 10 + i * 5 + extraSpins;
      const time = 2500 + i * 600;

      const startTime = Date.now();
      const startPosition = r.position;

      const animate = (): void => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / time, 1);
        
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        r.position = startPosition + (targetPosition - startPosition) * ease;

        // Update Symbol Positions
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (i === reels.length - 1) {
          running = false; // Spin finished
        }
      };

      animate();
    }
  }

  // 5. Create Spin Button
  const button = new Graphics()
    .rect(0, 0, 160, 50)
    .fill(0x22c55e);
  
  button.eventMode = 'static';
  button.cursor = 'pointer';
  button.x = (app.screen.width - 160) / 2;
  button.y = app.screen.height - 60;

  const btnText = new Text({
    text: 'SPIN',
    style: {
      fill: 0xffffff,
      fontSize: 24,
      fontWeight: 'bold',
    },
  });
  btnText.x = (160 - btnText.width) / 2;
  btnText.y = (50 - btnText.height) / 2;
  button.addChild(btnText);

  app.stage.addChild(button);
  button.on('pointerdown', spin);
}

initSlotGame();