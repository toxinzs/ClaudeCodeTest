import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { HOME_MAP } from '../data/maps.js';

const TILE = 52;
const MOVE_MS = 120;

// The single walkable proof-of-concept scene for Phase 1 of the Phaser
// migration. Grid movement is tied to the real state.pos.home (not a
// scene-local throwaway) so save/load already works end-to-end here.
export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('Home');
  }

  create() {
    this.moving = false;
    this.drawMap();
    this.drawDecor();
    this.drawPlayer();
    this.dialogueText = this.add.text(HOME_MAP.w * TILE / 2, HOME_MAP.h * TILE + 16, '', {
      fontFamily: 'sans-serif', fontSize: '14px', color: '#e8e8f0', wordWrap: { width: HOME_MAP.w * TILE }
    }).setOrigin(0.5, 0);

    const cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-UP', () => this.tryMove(0, -1));
    this.input.keyboard.on('keydown-DOWN', () => this.tryMove(0, 1));
    this.input.keyboard.on('keydown-LEFT', () => this.tryMove(-1, 0));
    this.input.keyboard.on('keydown-RIGHT', () => this.tryMove(1, 0));

    this.updateDialogue();
  }

  drawMap() {
    this.add.rectangle(
      HOME_MAP.w * TILE / 2, HOME_MAP.h * TILE / 2,
      HOME_MAP.w * TILE, HOME_MAP.h * TILE,
      Phaser.Display.Color.HexStringToColor(HOME_MAP.bg).color
    );
    const g = this.add.graphics();
    for (let y = 0; y < HOME_MAP.h; y++) {
      for (let x = 0; x < HOME_MAP.w; x++) {
        const blocked = HOME_MAP.layout[y][x] === 1;
        g.fillStyle(blocked ? 0x0a0e1a : 0x000000, blocked ? 1 : 0);
        g.fillRect(x * TILE, y * TILE, TILE, TILE);
        g.lineStyle(1, 0xffffff, 0.04);
        g.strokeRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
  }

  drawDecor() {
    (HOME_MAP.decor || []).forEach(d => {
      this.add.text(d.x * TILE + TILE * 0.5, d.y * TILE + TILE * 0.5, d.emoji, { fontSize: '28px' }).setOrigin(0.5);
    });
  }

  drawPlayer() {
    const pos = state.pos.home;
    this.player = this.add.text(
      pos.x * TILE + TILE * 0.5, pos.y * TILE + TILE * 0.5,
      state.player.avatar || '🧑🏾', { fontSize: '32px' }
    ).setOrigin(0.5);
  }

  tryMove(dx, dy) {
    if (this.moving) return;
    const pos = state.pos.home;
    const nx = pos.x + dx, ny = pos.y + dy;
    if (nx < 0 || ny < 0 || nx >= HOME_MAP.w || ny >= HOME_MAP.h) return;
    if (HOME_MAP.layout[ny][nx] === 1) return;

    pos.x = nx; pos.y = ny;
    this.moving = true;
    this.tweens.add({
      targets: this.player,
      x: nx * TILE + TILE * 0.5,
      y: ny * TILE + TILE * 0.5,
      duration: MOVE_MS,
      onComplete: () => { this.moving = false; }
    });
    this.updateDialogue();
    saveGame();
  }

  updateDialogue() {
    const pos = state.pos.home;
    if (pos.x === HOME_MAP.doorX && pos.y === HOME_MAP.doorY) {
      this.dialogueText.setText('The door out is right here. Ready to head into Zau?');
    } else {
      this.dialogueText.setText('');
    }
  }
}
