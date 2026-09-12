import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../config.js';
import { loadMonSprite } from '../spriteLoader.js';
import { inputLock } from '../lock.js';
import { showBanner } from '../banner.js';

// The evolution sequence — "What? X is evolving!", the silhouette pulse,
// the flash, the reveal. Launched over the battle (a level-up evolution)
// or over the Bag (a Linking Cord). Holds the input lock so nothing under
// it moves; closes on Space/Enter/click after the reveal.
export default class EvolutionScene extends Phaser.Scene {
  constructor() { super('Evolve'); }

  init(data) {
    this.from = data.from; // { name, sprite, emoji }
    this.to = data.to;     // { name, sprite, emoji }
    this.onDone = data.onDone || (() => {});
  }

  create() {
    inputLock.acquire();
    (window.__zauAnims ??= []).push('evolve');
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05060c, 0.92);
    this.title = this.add.text(GAME_W / 2, 70, `What? ${this.from.name} is evolving!`, { fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#e8e8f0' }).setOrigin(0.5);
    this.holder = this.add.container(GAME_W / 2, 220);
    this.glyph = this.add.text(0, 0, this.from.emoji || '❓', { fontSize: '72px' }).setOrigin(0.5);
    this.img = this.add.image(0, 0, '__DEFAULT').setOrigin(0.5).setVisible(false).setDisplaySize(128, 128);
    this.holder.add([this.glyph, this.img]);
    this.flash = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xffffff, 1).setAlpha(0);
    this.hint = this.add.text(GAME_W / 2, GAME_H - 60, '', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(0.5);
    this.done = false;

    // The sequence starts on the glyph immediately; the artwork swaps in
    // whenever it arrives. A silhouette pulse must never wait on a network.
    this.show(this.from);
    (() => {
      // Silhouette: the sprite goes black and pulses faster and faster.
      this.time.delayedCall(500, () => {
        this.img.setTint(0x000000); this.glyph.setTint(0x000000);
        let d = 420;
        const pulse = (n) => {
          if (n === 0) { this.reveal(); return; }
          this.tweens.add({ targets: this.holder, scaleX: 1.25, scaleY: 1.25, duration: d, yoyo: true, ease: 'Sine.easeInOut', onComplete: () => pulse(n - 1) });
          d = Math.max(120, d * 0.7);
        };
        pulse(6);
      });
    })();
  }

  show(mon, then) {
    this.glyph.setText(mon.emoji || '❓').setVisible(true);
    this.img.setVisible(false);
    loadMonSprite(this, mon.sprite, (key) => {
      if (key) { this.img.setTexture(key).setDisplaySize(128, 128).setVisible(true); this.glyph.setVisible(false); }
      then?.();
    });
  }

  reveal() {
    this.tweens.add({ targets: this.flash, alpha: 1, duration: 200, yoyo: true, hold: 150, onYoyo: () => {
      this.img.clearTint(); this.glyph.clearTint();
      this.holder.setScale(1);
      this.show(this.to);
    }, onComplete: () => {
      this.title.setText(`${this.from.name} evolved into ${this.to.name}!`);
      showBanner(this, `${this.to.name}!`, { y: 300, hold: 1200, color: '#e8d27a', accent: 0x8a6a1a, size: 18 });
      this.hint.setText('Space / click to continue');
      this.done = true;
      (window.__zauAnims ??= []).push('evolve:reveal');
      this.input.keyboard.on('keydown-SPACE', () => this.close());
      this.input.keyboard.on('keydown-ENTER', () => this.close());
      this.input.once('pointerdown', () => this.close());
    } });
  }

  close() {
    if (!this.done) return;
    this.done = false;
    inputLock.release();
    const cb = this.onDone; this.onDone = () => {};
    this.scene.stop();
    cb();
  }
}
