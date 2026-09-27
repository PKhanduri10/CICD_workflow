export type SymbolType = 'CHERRY' | 'LEMON' | 'SEVEN' | 'BAR' | 'WILD';

export type EvaluationMode = 'PAYLINES' | 'WAYS';

export interface Payline {
  id: number;
  pattern: number[]; // e.g. [row_r1, row_r2, row_r3, row_r4, row_r5]
}

export interface SlotConfig {
  reelsCount: number;         // Columns (e.g. 5 reels)
  rowsCount: number;          // Rows per reel (e.g. 3 rows)
  evaluationMode: EvaluationMode;
  paylines: Payline[];
  symbols: SymbolType[];
  paytable: Record<SymbolType, Record<number, number>>; // symbol -> { matchCount: payoutMultiplier }
  reelStrips: SymbolType[][]; // Pre-defined reel strips for each reel
}

export const GAME_CONFIG: SlotConfig = {
  reelsCount: 5,
  rowsCount: 3,
  evaluationMode: 'PAYLINES', // Change to 'WAYS' if needed
  symbols: ['CHERRY', 'LEMON', 'SEVEN', 'BAR', 'WILD'],

  // Define custom Payline Patterns (Row indices 0, 1, 2 for 3 rows)
  paylines: [
    { id: 1, pattern: [1, 1, 1, 1, 1] }, // Middle row straight
    { id: 2, pattern: [0, 0, 0, 0, 0] }, // Top row straight
    { id: 3, pattern: [2, 2, 2, 2, 2] }, // Bottom row straight
    { id: 4, pattern: [0, 1, 2, 1, 0] }, // V-Shape
    { id: 5, pattern: [2, 1, 0, 1, 2] }, // Inverted V-Shape
  ],

  paytable: {
    'SEVEN':  { 3: 5,  4: 20, 5: 100 },
    'BAR':    { 3: 3,  4: 10, 5: 50 },
    'CHERRY': { 3: 2,  4: 5,  5: 20 },
    'LEMON':  { 3: 1,  4: 3,  5: 10 },
    'WILD':   { 3: 10, 4: 50, 5: 250 },
  },

  // Reel strips for stop-position calculations
  reelStrips: [
    ['CHERRY', 'LEMON', 'SEVEN', 'BAR', 'WILD', 'CHERRY', 'LEMON', 'BAR'],
    ['LEMON', 'SEVEN', 'BAR', 'WILD', 'CHERRY', 'SEVEN', 'LEMON', 'BAR'],
    ['SEVEN', 'BAR', 'WILD', 'CHERRY', 'LEMON', 'BAR', 'CHERRY', 'SEVEN'],
    ['BAR', 'WILD', 'CHERRY', 'LEMON', 'SEVEN', 'LEMON', 'CHERRY', 'BAR'],
    ['WILD', 'CHERRY', 'LEMON', 'SEVEN', 'BAR', 'SEVEN', 'BAR', 'LEMON'],
  ]
};