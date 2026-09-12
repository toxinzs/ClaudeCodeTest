import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { goToScene } from '../transitions.js';
import { inputLock } from '../lock.js';

// The pause menu — Escape or M on any map. One place for Party / Bag /
// Pokédex / Quests / Save / Title, so a player never has to hunt an
// action bar for a screen.
export default class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  init(data) { this.parentKey = data?.parentKey; }

  create() {
    inputLock.acquire();
    this.events.once('shutdown', () => inputLock.release());
    drawModalBackdrop(this, 'Menu');
    addCloseButton(this, () => this.scene.stop());
    this.add.text(GAME_W / 2, 44, `${state.player.name || 'Trainer'} · ₽${state.money} · ${(state.leagueBeaten || []).filter(Boolean).length} badge${(state.leagueBeaten || []).filter(Boolean).length === 1 ? '' : 's'}`, {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0'
    }).setOrigin(0.5, 0);

    const items = [
      ['Party', () => this.open('Party')],
      ['Bag', () => this.open('Bag')],
      ['Pokédex', () => this.open('Dex')],
      ['Quests', () => this.open('Quests')],
      ['Save', () => { saveGame(); this.saved.setText('Saved.'); }],
      ['Resume', () => this.scene.stop()],
      ['Back to Title', () => { const parent = this.scene.get(this.parentKey); this.scene.stop(); if (parent) goToScene(parent, 'Title'); }]
    ];
    items.forEach(([label, fn], i) => {
      const y = 92 + i * 44;
      const bg = this.add.rectangle(GAME_W / 2, y, 220, 34, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(GAME_W / 2, y, label, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
      bg.on('pointerdown', fn);
    });
    this.saved = this.add.text(GAME_W / 2, 92 + items.length * 44, '', { fontFamily: 'sans-serif', fontSize: '12px', color: '#7fc47f' }).setOrigin(0.5);
    this.input.keyboard.on('keydown-ESC', () => this.scene.stop());
  }

  open(key) {
    this.scene.stop();
    this.scene.launch(key);
  }
}
