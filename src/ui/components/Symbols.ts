import { Container, Text, TextStyle } from 'pixi.js';
import { SymbolType } from '../../config/SlotConfig';

export class SymbolUI extends Container {
  private symbolText: Text;

  private emojiMap: Record<SymbolType, string> = {
    'CHERRY': '🍒',
    'LEMON':  '🍋',
    'SEVEN':  '💎',
    'BAR':    '🍫',
    'WILD':   '⭐',
  };

  constructor() {
    super();
    const style = new TextStyle({ fontSize: 48 });
    this.symbolText = new Text({ text: '❓', style });
    this.addChild(this.symbolText);
  }

  public setSymbol(symbol: SymbolType): void {
    this.symbolText.text = this.emojiMap[symbol] || '❓';
  }
}