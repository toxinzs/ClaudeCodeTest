import Phaser from 'phaser';
import { state } from '../state.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { QUESTS, nextObjective } from '../quests.js';

// The Quests overlay — active and finished quests with their current
// objective, same modal chrome as Party/Bag/Center.
export default class QuestsScene extends Phaser.Scene {
  constructor() {
    super('Quests');
  }

  create() {
    drawModalBackdrop(this, 'Quests');
    addCloseButton(this, () => this.scene.stop());
    const entries = Object.entries(QUESTS).filter(([key]) => state.quests?.[key] === 'active' || state.quests?.[key] === 'done');
    if (!entries.length) {
      this.add.text(GAME_W / 2, GAME_H / 2, 'No quests yet. Talk to people — Zau is full of favours to do.', {
        fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0', wordWrap: { width: GAME_W - 80 }, align: 'center'
      }).setOrigin(0.5);
      return;
    }
    let y = 60;
    for (const [key, q] of entries) {
      const done = state.quests[key] === 'done';
      this.add.text(36, y, `${done ? '✅' : '📜'} ${q.name}`, { fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: done ? '#8a8aa0' : '#e8e8f0' });
      this.add.text(36, y + 20, `${q.giver} · ${q.district}`, { fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#6a6a80' });
      this.add.text(36, y + 36, q.summary, { fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#8a8aa0', wordWrap: { width: GAME_W - 72 } });
      const objY = y + 36 + 34;
      this.add.text(36, objY, done ? `Reward: ${q.reward}` : `▶ ${nextObjective(key)}`, { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: done ? '#7fc47f' : '#e8d27a', wordWrap: { width: GAME_W - 72 } });
      y = objY + 40;
    }
  }
}
