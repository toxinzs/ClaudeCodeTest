import Phaser from 'phaser';
import { state } from '../state.js';
import { CUTSCENE_SLIDES } from '../data/story.js';
import { GAME_W, GAME_H } from '../config.js';

// Ported from the DOM version's ui/title.js cutscene functions.
export default class CutsceneScene extends Phaser.Scene {
  constructor() {
    super('Cutscene');
  }

  create() {
    state.cutsceneIdx = 0;

    this.slideText = this.add.text(GAME_W / 2, 60, '', {
      fontFamily: 'sans-serif', fontSize: '15px', color: '#e8e8f0',
      wordWrap: { width: GAME_W - 80 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.dots = [];
    const dotsY = GAME_H - 90;
    const totalW = (CUTSCENE_SLIDES.length - 1) * 18;
    CUTSCENE_SLIDES.forEach((_, i) => {
      const x = GAME_W / 2 - totalW / 2 + i * 18;
      this.dots.push(this.add.circle(x, dotsY, 4, 0x3a3d5c));
    });

    const skipBg = this.add.rectangle(90, GAME_H - 40, 120, 34, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    this.add.text(90, GAME_H - 40, 'Skip', { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    skipBg.on('pointerdown', () => this.scene.start('CharCreate'));

    this.nextText = this.add.text(GAME_W - 90, GAME_H - 40, 'Next', { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    const nextBg = this.add.rectangle(GAME_W - 90, GAME_H - 40, 120, 34, 0x2d6a4f).setStrokeStyle(1, 0x3fa373).setInteractive({ useHandCursor: true });
    this.children.bringToTop(this.nextText);
    nextBg.on('pointerdown', () => this.nextSlide());

    this.renderSlide();
  }

  renderSlide() {
    this.slideText.setText(CUTSCENE_SLIDES[state.cutsceneIdx]);
    this.dots.forEach((d, i) => d.setFillStyle(i === state.cutsceneIdx ? 0x8a8aff : 0x3a3d5c));
    this.nextText.setText(state.cutsceneIdx === CUTSCENE_SLIDES.length - 1 ? 'Begin' : 'Next');
  }

  nextSlide() {
    if (state.cutsceneIdx < CUTSCENE_SLIDES.length - 1) {
      state.cutsceneIdx++;
      this.renderSlide();
    } else {
      this.scene.start('CharCreate');
    }
  }
}
