import Phaser from 'phaser';
import { state } from '../state.js';
import { currentMonDisplay } from '../mon.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';

// Ported from the DOM version's ui/dexBook.js.
export default class DexScene extends Phaser.Scene {
  constructor() {
    super('Dex');
  }

  create() {
    drawModalBackdrop(this, 'Pokédex');
    addCloseButton(this, () => this.scene.stop());
    this.add.text(GAME_W / 2, 42, `Money: ₽${state.money} · Poké Balls: ${state.items.pokeball || 0}`, {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0'
    }).setOrigin(0.5);

    if (!state.party.length) {
      this.add.text(GAME_W / 2, GAME_H / 2, 'No Pokémon caught yet.', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5);
      return;
    }
    state.party.forEach((m, i) => {
      const y = 68 + i * 40;
      const d = currentMonDisplay(m);
      addMonIcon(this, 36, y, d, 24);
      this.add.text(64, y - 10, d.name, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' });
      this.add.text(64, y + 7, `Lv.${m.level} · ${d.type} · ${m.moves.length} moves known`, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' });
    });
  }
}
