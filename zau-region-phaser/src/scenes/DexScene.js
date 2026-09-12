import Phaser from 'phaser';
import { state } from '../state.js';
import { currentMonDisplay, ivSummary } from '../mon.js';
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
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aa0'
    }).setOrigin(0.5);

    // Every mon ever caught, whether it's on the active team or sitting in
    // the Box — being sent to storage for a full party shouldn't make a
    // catch vanish from the Pokédex.
    const all = [...state.party.map(m => ({ m, boxed: false })), ...state.box.map(m => ({ m, boxed: true }))];
    if (!all.length) {
      this.add.text(GAME_W / 2, GAME_H / 2, 'No Pokémon caught yet.', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5);
      return;
    }
    all.forEach(({ m, boxed }, i) => {
      const y = 68 + i * 40;
      const d = currentMonDisplay(m);
      addMonIcon(this, 36, y, d, 24);
      this.add.text(64, y - 10, d.name, { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0' });
      this.add.text(64, y + 7, `Lv.${m.level} · ${d.type} · ${m.ability.name} · IV ${ivSummary(m).total}${boxed ? ' · In Box' : ''}`, { fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#8a8aa0' });
    });
  }
}
