import Phaser from 'phaser';
import { preloadTiles } from '../tiles.js';

// Loads shared assets once, before any gameplay scene needs them — Phaser's
// texture cache is shared across the whole Game instance, so this only
// needs to run once at startup, not per-scene.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    preloadTiles(this);
  }

  create() {
    this.scene.start('Home');
  }
}
