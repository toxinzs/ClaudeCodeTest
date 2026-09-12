import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';

// STORY.md V1 — the freight core: one long elevator ride down the whole
// stack, every district's lights flickering past. Pure cutscene.
const STOPS = [
  'MERIDIAN TOWER', 'THE SPRAWL', 'SIGNAL DISTRICT', 'GREENLINE TERRACES',
  'EMBER QUARTER', 'HARBOR DISTRICT', 'THE OUTSKIRTS', 'THE UNDERCITY', 'THE UNDERLIGHT'
];
const STOP_MS = 620;

export default class DescentScene extends Phaser.Scene {
  constructor() {
    super('Descent');
  }

  create() {
    fadeIn(this);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x03040a);
    this.add.text(GAME_W / 2, 40, 'FREIGHT CORE', { fontFamily: 'sans-serif', fontSize: '12px', color: '#5a5a70', letterSpacing: 4 }).setOrigin(0.5);
    this.label = this.add.text(GAME_W / 2, GAME_H / 2, '', { fontFamily: 'sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#e8e8f0' }).setOrigin(0.5).setAlpha(0);
    this.depth = this.add.text(GAME_W / 2, GAME_H / 2 + 34, '', { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(0.5);
    // The elevator's rails: two lines that scroll upward while we drop.
    this.rails = [];
    for (let i = 0; i < 14; i++) {
      const y = i * 40;
      this.rails.push(this.add.rectangle(60, y, 3, 22, 0x2a2e48), this.add.rectangle(GAME_W - 60, y, 3, 22, 0x2a2e48));
    }
    this.railScroll = 0;

    let i = 0;
    const next = () => {
      if (i >= STOPS.length) { this.time.delayedCall(500, () => goToScene(this, 'Underlight')); return; }
      this.label.setText(STOPS[i]);
      this.depth.setText(`stratum ${Math.max(0, 8 - i)}`);
      this.label.setAlpha(0);
      this.tweens.add({ targets: this.label, alpha: 1, duration: 180, yoyo: true, hold: STOP_MS - 360 });
      this.cameras.main.shake(120, 0.004);
      // Every district's lights stutter.
      this.cameras.main.flash(80, 40, 44, 70);
      i++;
      this.time.delayedCall(STOP_MS, next);
    };
    next();

    const skip = this.add.text(GAME_W - 16, GAME_H - 16, 'Skip ▸', { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    skip.on('pointerdown', () => goToScene(this, 'Underlight'));
  }

  update(_t, dt) {
    this.railScroll = (this.railScroll + dt * 0.35) % 40;
    this.rails.forEach((r, idx) => { r.y = (Math.floor(idx / 2) * 40 - this.railScroll + 40) % (14 * 40); });
  }
}
