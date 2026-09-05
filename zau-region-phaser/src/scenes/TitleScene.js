import Phaser from 'phaser';
import { state } from '../state.js';
import { hasSave, loadGame } from '../save.js';
import { GAME_W, GAME_H } from '../config.js';

const INTRO_TEXT = "Thunder does not fall on Zau by chance. It answers something in you — and tonight, it's answering back.";

// Ported from the DOM version's ui/title.js. loadGame() is deliberately NOT
// called at boot (main.js doesn't call it either) — Continue vs. a fresh
// game are genuinely different starting points, same as the DOM version:
// a save existing doesn't auto-resume until the player picks Continue.
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.add.text(GAME_W / 2, 40, 'POKÉMON: ZAU', {
      fontFamily: 'sans-serif', fontSize: '26px', fontStyle: 'bold', color: '#e8e8f0'
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, 74, 'Where The Storm Chooses You', {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0', fontStyle: 'italic'
    }).setOrigin(0.5);

    this.introText = this.add.text(GAME_W / 2, 110, '', {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 80 }, align: 'center'
    }).setOrigin(0.5, 0);
    this.startTypewriter();

    const menu = [];
    if (hasSave()) menu.push({ label: 'Continue', onClick: () => this.continueGame() });
    menu.push({ label: 'Begin Journey', onClick: () => this.scene.start('Cutscene') });
    menu.push({ label: 'Skip Intro', onClick: () => this.scene.start('CharCreate') });

    menu.forEach((m, i) => {
      const y = 260 + i * 48;
      const bg = this.add.rectangle(GAME_W / 2, y, 240, 38, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(GAME_W / 2, y, m.label, { fontFamily: 'sans-serif', fontSize: '14px', color: '#e8e8f0' }).setOrigin(0.5);
      bg.on('pointerdown', m.onClick);
    });
  }

  startTypewriter() {
    let i = 0;
    const type = () => {
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
    this.scene.start(state.party.length === 0 ? 'Home' : 'Town');
  }
}
