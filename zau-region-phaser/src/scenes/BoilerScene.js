import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { BOILER_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { BOILER_NPCS, BOILER_BREAKER, BOILER_STONE } from '../data/npcs.js';

// Boiler Tunnels — the first real dungeon (STORY.md E3), under the Ember
// Quarter's Kilns. A Trail-style corridor: two mill-worker chokepoints
// (they stand in one-tile gaps and leave once beaten), the breaker at the
// far end, and the Aggronite in the alcove beside it (MEGA.md: a cave
// stone). Dark: the Quarter's power is out while you're down here.
const WILD_ENCOUNTER_CHANCE = 0.15;
const SPAWN = { x: 2, y: 11 };

export default class BoilerScene extends Phaser.Scene {
  constructor() {
    super('Boiler');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.boiler ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, BOILER_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - BOILER_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, BOILER_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallBrick' });
    const decor = [...BOILER_MAP.decor];
    if (!hasFlag('aggroniteFound')) decor.push({ x: BOILER_MAP.stoneX, y: BOILER_MAP.stoneY, emoji: '💎' });
    drawDecor(this, decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 0, 'BOILER TUNNELS', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: BOILER_MAP, posRef: state.pos.boiler, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.boiler, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: BOILER_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.boiler });

    setupFollowCamera(this, { mapDef: BOILER_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    // Lights out — a dark wash over the tunnel until the breaker's thrown.
    this.darkRect = this.add.rectangle(GAME_W / 2, this.offsetY + BOILER_MAP.h * TILE / 2, GAME_W * 3, BOILER_MAP.h * TILE * 3, 0x03020a, 0.5).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Climb Out', onClick: () => this.leave() }
    ], GAME_H - 16);

    setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])]);
  }

  drawPlayer() {
    const pos = state.pos.boiler;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  spawn() { Object.assign(state.pos.boiler, SPAWN); return state.pos.boiler; }

  throwBreaker() {
    this.tweens.add({ targets: this.darkRect, alpha: 0, duration: 500 });
  }

  leave() {
    this.spawn();
    saveGame();
    goToScene(this, 'Ember');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === BOILER_MAP.breakerX && ny === BOILER_MAP.breakerY) {
      if (hasFlag('lineRestored')) this.toastText.setText('The breaker hums. The keycard door beside it still blinks red.');
      else this.npcLayer.run(BOILER_BREAKER);
      return;
    }
    if (nx === BOILER_MAP.stoneX && ny === BOILER_MAP.stoneY && !hasFlag('aggroniteFound')) {
      this.npcLayer.run(BOILER_STONE);
      return;
    }
    if (nx === SPAWN.x && ny === SPAWN.y) {
      this.toastText.setText('The ladder up to the Kilns.');
      return;
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'boiler', returnTo: 'Boiler' });
    }
  }
}
