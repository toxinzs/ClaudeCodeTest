import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { HOME_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker } from '../mapRenderer.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';

// The first walkable scene ported to Phaser. Grid movement is tied to the
// real state.pos.home (not a scene-local throwaway) so save/load already
// works end-to-end here.
export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('Home');
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - HOME_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, HOME_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'wallStone' });
    drawDecor(this, HOME_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    this.dialogueText = this.add.text(GAME_W / 2, this.offsetY + HOME_MAP.h * TILE + 12, '', {
      fontFamily: 'sans-serif', fontSize: '14px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }
    }).setOrigin(0.5, 0);

    // Always available, same as the DOM version's "Head Outside" button —
    // not gated on standing at the door tile (that's flavor text only).
    const btn = this.add.rectangle(GAME_W / 2, GAME_H - 24, 200, 32, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    this.add.text(GAME_W / 2, GAME_H - 24, 'Head Outside', { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    btn.on('pointerdown', () => goToScene(this, 'Town'));

    this.walker = createWalker(this, {
      mapDef: HOME_MAP, posRef: state.pos.home, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: () => { this.updateDialogue(); saveGame(); }
    });

    this.updateDialogue();
  }

  drawPlayer() {
    const pos = state.pos.home;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
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
