import Phaser from 'phaser';
import { preloadTiles } from '../tiles.js';
import { GAME_W, GAME_H } from '../config.js';

// Loads shared assets once, before any gameplay scene needs them — Phaser's
// texture cache is shared across the whole Game instance, so this only
// needs to run once at startup, not per-scene. Small today (11 tiles), but
// this is the real preload path future assets (a bigger tileset, music,
// character sprites) grow into — the progress bar isn't decorative filler
// for a near-instant load, it's the infrastructure for when that load
// isn't instant anymore.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x0a0e1a);
    this.add.text(GAME_W / 2, GAME_H / 2 - 30, 'ZAU', {
      fontFamily: 'sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#e8e8f0'
    }).setOrigin(0.5);

    const barW = 220, barH = 10;
    const barBg = this.add.rectangle(GAME_W / 2, GAME_H / 2, barW, barH, 0x232640).setStrokeStyle(1, 0x3a3d5c);
    const barFill = this.add.rectangle(GAME_W / 2 - barW / 2, GAME_H / 2, 1, barH, 0x8a8aff).setOrigin(0, 0.5);
    const pctText = this.add.text(GAME_W / 2, GAME_H / 2 + 22, 'Loading… 0%', {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      barFill.width = Math.max(1, barW * value);
      pctText.setText(`Loading… ${Math.round(value * 100)}%`);
    });

    preloadTiles(this);
  }

  create() {
    this.scene.start('Title');
  }
}
