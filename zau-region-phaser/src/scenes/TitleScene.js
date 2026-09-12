import Phaser from 'phaser';
import { state } from '../state.js';
import { hasSave, loadGame } from '../save.js';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';

const INTRO_TEXT = "Thunder does not fall on Zau by chance. It answers something in you — and tonight, it's answering back.";

// The title screen for Pokémon: Zau Storme — a storm over the stacked
// city: rain (particles), rolling cloud banks, and lightning that draws a
// real jagged bolt, flashes the screen and shakes the camera. The logo
// draws the logo in the Silkscreen display face (loaded by BootScene),
// so first paint never waits on it. loadGame() is deliberately NOT called
// at boot — Continue vs. a fresh game are different starting points.
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    fadeIn(this);
    this.buildStorm();

    // ---- logo ----
    this.pokemonText = this.add.text(GAME_W / 2, 38, 'POKÉMON', {
      fontFamily: 'Silkscreen, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#c8c8d8', letterSpacing: 4
    }).setOrigin(0.5).setDepth(20);
    this.logo = this.add.text(GAME_W / 2, 78, 'ZAU STORME', {
      fontFamily: 'Silkscreen, sans-serif', fontSize: '30px', fontStyle: 'bold', color: '#e8d27a',
      stroke: '#1a3a6a', strokeThickness: 7, shadow: { offsetX: 0, offsetY: 3, color: '#000', blur: 8, fill: true }
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: this.logo, scaleX: 1.03, scaleY: 1.03, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.text(GAME_W / 2, 116, 'Where The Storm Chooses You', {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a9ab8', fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(20);

    this.introText = this.add.text(GAME_W / 2, 146, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 90 }, align: 'center'
    }).setOrigin(0.5, 0).setDepth(20);
    this.startTypewriter();

    // ---- menu ----
    const menu = [];
    if (hasSave()) menu.push({ label: 'Continue', onClick: () => this.continueGame() });
    menu.push({ label: 'Begin Journey', onClick: () => goToScene(this, 'Cutscene') });
    menu.push({ label: 'Skip Intro', onClick: () => goToScene(this, 'CharCreate') });
    menu.push({ label: 'Credits', onClick: () => goToScene(this, 'Credits', { fromTitle: true }) });

    menu.forEach((m, i) => {
      const y = 260 + i * 48;
      const bg = this.add.rectangle(GAME_W / 2, y, 240, 38, 0x141a2c, 0.92).setStrokeStyle(1, 0x3a4a7c).setInteractive({ useHandCursor: true }).setDepth(20);
      this.add.text(GAME_W / 2, y, m.label, { fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#e8e8f0' }).setOrigin(0.5).setDepth(21);
      bg.on('pointerover', () => bg.setFillStyle(0x1e2a48, 0.95));
      bg.on('pointerout', () => bg.setFillStyle(0x141a2c, 0.92));
      bg.on('pointerdown', m.onClick);
    });
  }

  buildStorm() {
    // Sky: a dark gradient, drawn as stacked bands.
    const g = this.add.graphics().setDepth(0);
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(6, 9, 22), new Phaser.Display.Color(16, 22, 46), 11, i);
      g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
      g.fillRect(0, t * GAME_H, GAME_W, GAME_H / 11 + 1);
    }
    // The stacked city as a silhouette along the bottom: stepped blocks.
    const city = this.add.graphics().setDepth(2);
    city.fillStyle(0x090c18, 1);
    let x = 0;
    while (x < GAME_W) {
      const w = 22 + Math.floor(Math.random() * 30), h = 40 + Math.floor(Math.random() * 90);
      city.fillRect(x, GAME_H - h, w, h);
      // a few lit windows
      city.fillStyle(0x3a4a7c, 0.8);
      for (let k = 0; k < 3; k++) if (Math.random() < 0.6) city.fillRect(x + 4 + Math.floor(Math.random() * (w - 8)), GAME_H - h + 6 + Math.floor(Math.random() * (h - 12)), 3, 3);
      city.fillStyle(0x090c18, 1);
      x += w + 2;
    }
    // Rolling cloud banks: soft ellipses drifting on two layers.
    this.clouds = [];
    for (let layer = 0; layer < 2; layer++) {
      for (let i = 0; i < 5; i++) {
        const c = this.add.ellipse(Math.random() * GAME_W, 30 + layer * 40 + Math.random() * 40, 220 + Math.random() * 160, 60 + Math.random() * 30, layer ? 0x1a2240 : 0x121a34, 0.55).setDepth(1);
        c.speed = (layer ? 8 : 4) + Math.random() * 6;
        this.clouds.push(c);
      }
    }
    // Rain: a generated 2x12 streak texture, emitted across the top.
    if (!this.textures.exists('rain')) {
      const rg = this.make.graphics({ x: 0, y: 0, add: false });
      rg.fillStyle(0xbcd0ff, 1); rg.fillRect(0, 0, 2, 12);
      rg.generateTexture('rain', 2, 12);
    }
    this.rain = this.add.particles(0, -14, 'rain', {
      x: { min: -40, max: GAME_W + 40 }, lifespan: 1100,
      speedY: { min: 520, max: 780 }, speedX: -70,
      alpha: { start: 0.55, end: 0.05 }, scaleY: { start: 1.2, end: 0.7 },
      quantity: 3, frequency: 18, rotate: 6
    }).setDepth(3);
    // Lightning.
    this.flash = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xdfe8ff, 1).setAlpha(0).setDepth(10);
    this.bolt = this.add.graphics().setDepth(9);
    this.scheduleLightning(1200);
  }

  scheduleLightning(delay) {
    this.time.delayedCall(delay, () => {
      if (!this.scene.isActive()) return;
      this.strike();
      this.scheduleLightning(2200 + Math.random() * 4000);
    });
  }

  strike() {
    const b = this.bolt;
    b.clear();
    let x = 60 + Math.random() * (GAME_W - 120), y = 0;
    const endY = 150 + Math.random() * 150;
    const pts = [[x, y]];
    while (y < endY) { y += 14 + Math.random() * 22; x += (Math.random() - 0.5) * 44; pts.push([x, y]); }
    const draw = (width, alpha, color) => {
      b.lineStyle(width, color, alpha); b.beginPath(); b.moveTo(pts[0][0], pts[0][1]);
      for (const [px, py] of pts.slice(1)) b.lineTo(px, py);
      b.strokePath();
    };
    draw(9, 0.25, 0x9ab8ff); draw(4, 0.6, 0xcfe0ff); draw(1.5, 1, 0xffffff);
    // a fork
    if (Math.random() < 0.7) {
      const k = Math.floor(pts.length / 2); let fx = pts[k][0], fy = pts[k][1];
      b.lineStyle(1.5, 0xffffff, 0.9); b.beginPath(); b.moveTo(fx, fy);
      for (let i = 0; i < 4; i++) { fx += (Math.random() - 0.2) * 40; fy += 18 + Math.random() * 16; b.lineTo(fx, fy); }
      b.strokePath();
    }
    b.setAlpha(1);
    this.tweens.add({ targets: b, alpha: 0, duration: 380, delay: 90, ease: 'Quad.easeOut' });
    this.flash.setAlpha(0.7);
    this.tweens.add({ targets: this.flash, alpha: 0, duration: 260 });
    this.cameras.main.shake(110, 0.004);
    (window.__zauAnims ??= []).push('title:lightning');
  }

  update(_t, dt) {
    if (!this.clouds) return;
    for (const c of this.clouds) {
      c.x += c.speed * dt / 1000;
      if (c.x - c.width / 2 > GAME_W) c.x = -c.width / 2;
    }
  }

  startTypewriter() {
    let i = 0;
    const type = () => {
      if (!this.introText?.active) return;
      if (i < INTRO_TEXT.length) {
        i++;
        this.introText.setText(INTRO_TEXT.slice(0, i));
        this.time.delayedCall(28, type);
      }
    };
    this.time.delayedCall(400, type);
  }

  continueGame() {
    if (!loadGame()) return;
    goToScene(this, state.party.length === 0 ? 'Home' : 'Town');
  }
}
