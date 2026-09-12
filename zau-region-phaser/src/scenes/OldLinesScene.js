import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { OLDLINES_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { OLDLINES_NPCS, OLDLINES_SHRINE } from '../data/npcs.js';

// The Old Lines (STORY.md U1) — the transit tunnels between the Harbor's
// drained Drowned Stair (bottom) and the Undercity hub (top). Two
// tunnel-dweller chokepoints, the Warden's shrine in the alcove with the
// Houndoominite, and the dark.
const WILD_ENCOUNTER_CHANCE = 0.15;
const BOTTOM = { x: 2, y: 11 };
const TOP_ENTRY = { x: 2, y: 1 };

export default class OldLinesScene extends Phaser.Scene {
  constructor() {
    super('OldLines');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.oldlines ??= { ...BOTTOM };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, OLDLINES_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - OLDLINES_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, OLDLINES_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallStone' });
    const decor = [...OLDLINES_MAP.decor];
    if (!hasFlag('houndoominiteFound')) decor.push({ x: OLDLINES_MAP.shrineX, y: OLDLINES_MAP.shrineY, emoji: '🕯️' });
    drawDecor(this, decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 0, 'THE OLD LINES', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: OLDLINES_MAP, posRef: state.pos.oldlines, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.oldlines, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: OLDLINES_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.oldlines });

    setupFollowCamera(this, { mapDef: OLDLINES_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });
    this.add.rectangle(GAME_W / 2, this.offsetY + OLDLINES_MAP.h * TILE / 2, GAME_W * 3, OLDLINES_MAP.h * TILE * 3, 0x02010a, 1).setAlpha(0.55).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Harbor', onClick: () => this.leaveUp() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'THE OLD LINES' });
  }

  drawPlayer() {
    const pos = state.pos.oldlines;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leaveUp() {
    Object.assign(state.pos.oldlines, BOTTOM);
    saveGame();
    goToScene(this, 'Harbor');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === OLDLINES_MAP.topX && ny === OLDLINES_MAP.topY) {
      Object.assign(state.pos.oldlines, TOP_ENTRY);
      goToScene(this, 'Undercity');
      return;
    }
    if (nx === BOTTOM.x && ny === BOTTOM.y) { this.leaveUp(); return; }
    if (nx === OLDLINES_MAP.shrineX && ny === OLDLINES_MAP.shrineY && !hasFlag('houndoominiteFound')) {
      this.npcLayer.run(OLDLINES_SHRINE);
      return;
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'oldlines', returnTo: 'OldLines' });
    }
  }
}
