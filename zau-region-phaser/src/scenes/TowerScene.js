import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { TOWER_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { TOWER_NPCS, VANCE_TALK, TOWER_RIG } from '../data/npcs.js';

// Meridian Tower (STORY.md T1–T3) — glass, sterile, mostly full of people
// who don't know. The core corridor: Site Security and an Executive at the
// floor gates, Amara by the office door, and the Director's office at the
// top: the conversation, the battle, and — after — the rig, which turns
// the office into the way down.
const SPAWN = { x: 2, y: 11 };

export default class TowerScene extends Phaser.Scene {
  constructor() {
    super('Tower');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.tower ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, TOWER_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - TOWER_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, TOWER_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'wallStone' });
    drawDecor(this, TOWER_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 0, 'MERIDIAN TOWER', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: TOWER_MAP, posRef: state.pos.tower, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.tower, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: TOWER_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.tower });

    setupFollowCamera(this, { mapDef: TOWER_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });
    // Glass-and-fog white wash for the rig moment.
    this.whiteRect = this.add.rectangle(GAME_W / 2, this.offsetY + TOWER_MAP.h * TILE / 2, GAME_W * 3, TOWER_MAP.h * TILE * 3, 0xffffff, 1).setAlpha(0).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Sprawl', onClick: () => this.leave() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'MERIDIAN TOWER' });

    // T3: back from the Vance battle, he activates the rig anyway.
    if (state.vanceBeaten && !hasFlag('rigActivated')) this.npcLayer.run(TOWER_RIG);
  }

  rigFlash() {
    this.tweens.add({ targets: this.whiteRect, alpha: 0.6, duration: 300, yoyo: true, hold: 600 });
  }

  drawPlayer() {
    const pos = state.pos.tower;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leave() {
    Object.assign(state.pos.tower, SPAWN);
    saveGame();
    goToScene(this, 'Sprawl');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === TOWER_MAP.officeX && ny === TOWER_MAP.officeY) {
      if (hasFlag('ending')) { this.toastText.setText("Vance's office is empty. A resignation letter on the desk, handwritten. The drill-bit fragment is gone."); return; }
      if (hasFlag('rigActivated')) { goToScene(this, 'Descent'); return; }
      if (state.vanceBeaten) { this.toastText.setText("Vance's office. He's at the window, watching the lights."); return; }
      if (!state.party.length) { this.toastText.setText("The Director's office. Not without a team."); return; }
      this.npcLayer.run(VANCE_TALK);
      return;
    }
    if (nx === SPAWN.x && ny === SPAWN.y) { this.toastText.setText('The lobby elevator, back down to the Sprawl.'); }
  }
}
