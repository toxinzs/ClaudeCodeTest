import Phaser from 'phaser';
import { state } from '../state.js';
import { TRAIL_MAP } from '../data/maps.js';
import { TRAINER_LINEUP, RIVAL_DARIO } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker } from '../mapRenderer.js';

// Trainers are placed one per row up a straight corridor (x=2), closest
// first; the corridor's far end (y=0) is Dario, then the league gate, once
// each is cleared — ported from the DOM version's ui/trail.js.
const TRAIL_X = 2;
const TRAINER_Y = [10, 8, 6, 4, 2];
const END_Y = 0;

export default class TrailScene extends Phaser.Scene {
  constructor() {
    super('Trail');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
  }

  create() {
    this.offsetX = Math.floor((GAME_W - TRAIL_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, TRAIL_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'bush' });
    drawDecor(this, this.buildDecor(), { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    // The corridor (12 rows) is taller than the canvas — scroll the camera
    // to follow the player instead of shrinking tiles to force a fit.
    const contentH = TRAIL_MAP.h * TILE + this.offsetY * 2;
    this.cameras.main.setBounds(0, 0, GAME_W, contentH);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

    this.add.text(GAME_W / 2, 0, 'WILD ZONE TRAIL', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0).setScrollFactor(0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 20, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0).setScrollFactor(0);

    this.walker = createWalker(this, {
      mapDef: TRAIL_MAP, posRef: state.pos.trail, sprite: this.player,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny)
    });

    this.input.keyboard.on('keydown-UP', () => this.walker.tryMove(0, -1));
    this.input.keyboard.on('keydown-DOWN', () => this.walker.tryMove(0, 1));
    this.input.keyboard.on('keydown-LEFT', () => this.walker.tryMove(-1, 0));
    this.input.keyboard.on('keydown-RIGHT', () => this.walker.tryMove(1, 0));
  }

  // Progress-dependent, so it's rebuilt fresh each time the scene starts
  // rather than living as static data on TRAIL_MAP.
  buildDecor() {
    const decor = TRAINER_LINEUP.map((t, i) => ({
      x: TRAIL_X, y: TRAINER_Y[i],
      emoji: i < state.trainerIndex ? '✅' : t.emoji
    }));
    let endEmoji = '⛔';
    if (state.trainerIndex >= TRAINER_LINEUP.length) {
      endEmoji = state.darioBeaten ? '🚪' : RIVAL_DARIO.emoji;
    }
    decor.push({ x: TRAIL_X, y: END_Y, emoji: endEmoji });
    return decor;
  }

  drawPlayer() {
    const pos = state.pos.trail;
    this.player = this.add.text(
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.avatar || '🧑🏾', { fontSize: '32px' }
    ).setOrigin(0.5);
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    if (nx !== TRAIL_X) return;
    const trainerIdx = TRAINER_Y.indexOf(ny);
    if (trainerIdx !== -1) {
      if (trainerIdx < state.trainerIndex) {
        this.toastText.setText(`You already beat ${TRAINER_LINEUP[trainerIdx].name}.`);
      } else if (trainerIdx === state.trainerIndex) {
        this.scene.start('Battle', { kind: 'lineup', returnTo: 'Trail' });
      } else {
        this.toastText.setText('Beat the closer trainers first.');
      }
      return;
    }
    if (ny === END_Y) {
      if (state.trainerIndex < TRAINER_LINEUP.length) {
        this.toastText.setText("Something's blocking the way ahead...");
      } else if (!state.darioBeaten) {
        this.scene.start('Battle', { kind: 'dario', returnTo: 'Trail' });
      } else {
        this.scene.start('League');
      }
    }
  }
}
