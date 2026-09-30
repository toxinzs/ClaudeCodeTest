import Phaser from 'phaser';
import { state } from '../state.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';
import { spriteUrlFor } from '../sprites.js';
import { dexCatalogue, dexCounts, dexStatus, whereFound } from '../dex.js';

// The species Pokédex (dex.js): every species in the game in national-dex
// order, paged. Unmet species are "???"; met ones show their type, where
// they can be found, and — once caught — a marker. Replaces the old list
// of owned Pokémon (Party/Box already carry a mon's level/IV/ability).
const ROWS_PER_PAGE = 7;
const ROW_H = 46;
const TOP = 88;

export default class DexScene extends Phaser.Scene {
  constructor() {
    super('Dex');
  }

  create() {
    this.page = 0;
    this.render();
    this.input.keyboard?.on('keydown-LEFT', () => this.turn(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.turn(1));
  }

  turn(dir) {
    const maxPage = Math.ceil(dexCatalogue().length / ROWS_PER_PAGE) - 1;
    const next = Phaser.Math.Clamp(this.page + dir, 0, maxPage);
    if (next === this.page) return;
    this.page = next;
    this.render();
  }

  render() {
    this.children.removeAll(true);
    drawModalBackdrop(this, 'Pokédex');
    addCloseButton(this, () => this.scene.stop());

    const cat = dexCatalogue();
    const { seen, caught, total } = dexCounts();
    this.add.text(GAME_W / 2, 42, `Seen ${seen} · Caught ${caught} · of ${total}`, {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aa0'
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, 60, `Money: ₽${state.money} · Poké Balls: ${state.items.pokeball || 0}`, {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#6a6a7a'
    }).setOrigin(0.5);

    const start = this.page * ROWS_PER_PAGE;
    cat.slice(start, start + ROWS_PER_PAGE).forEach((entry, i) => {
      const y = TOP + i * ROW_H;
      const status = dexStatus(entry.name);
      const num = entry.id ? `#${String(entry.id).padStart(3, '0')}` : '#???';
      this.add.text(22, y - 8, num, { fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#6a6a7a' });
      if (status === 'unknown') {
        this.add.text(84, y - 8, '???', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#4a4d6c' });
        return;
      }
      addMonIcon(this, 64, y, { species: entry.name, emoji: '❔', sprite: spriteUrlFor(entry.name) }, 26);
      const mark = status === 'caught' ? '●' : '○';
      this.add.text(84, y - 12, `${mark} ${entry.name}`, { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: status === 'caught' ? '#e8e8f0' : '#a8a8c0' });
      this.add.text(84, y + 4, `${entry.type} · ${whereFound(entry)}`, {
        fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#8a8aa0', wordWrap: { width: GAME_W - 120 }
      });
    });

    const maxPage = Math.ceil(cat.length / ROWS_PER_PAGE) - 1;
    const y = GAME_H - 34;
    if (this.page > 0) {
      this.add.text(GAME_W / 2 - 70, y, '< Prev', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.turn(-1));
    }
    this.add.text(GAME_W / 2, y, `Page ${this.page + 1}/${maxPage + 1}`, { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(0.5);
    if (this.page < maxPage) {
      this.add.text(GAME_W / 2 + 70, y, 'Next >', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aff' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.turn(1));
    }
  }
}
