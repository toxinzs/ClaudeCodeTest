import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { GAME_W } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';

// Ported from the DOM version's ui/healCenter.js — a free heal-on-demand,
// no charge, no cooldown.
export default class CenterScene extends Phaser.Scene {
  constructor() {
    super('Center');
  }

  create() {
    this.renderPrompt();
  }

  renderPrompt() {
    this.children.removeAll(true);
    drawModalBackdrop(this, 'Zau Pokémon Center');
    addCloseButton(this, () => this.scene.stop());
    const needsHealing = state.party.some(m => m.hp < m.maxHp || m.fainted);
    this.add.text(GAME_W / 2, 60, needsHealing
      ? "Your Pokémon look tired. Want me to patch them up? No charge."
      : "Your team's already in great shape — nothing to heal right now.",
      { fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8', wordWrap: { width: GAME_W - 60 }, align: 'center' }
    ).setOrigin(0.5, 0);

    if (needsHealing) {
      const bg = this.add.rectangle(GAME_W / 2, 130, 200, 34, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(GAME_W / 2, 130, 'Heal my team', { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
      bg.on('pointerdown', () => this.healParty());
    }
  }

  healParty() {
    state.party.forEach(m => { m.hp = m.maxHp; m.fainted = false; });
    saveGame();
    this.children.removeAll(true);
    drawModalBackdrop(this, 'Zau Pokémon Center');
    addCloseButton(this, () => this.scene.stop());
    this.add.text(GAME_W / 2, 60, 'Your Pokémon are back to full health. Good luck out there.', {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8', wordWrap: { width: GAME_W - 60 }, align: 'center'
    }).setOrigin(0.5, 0);
  }
}
