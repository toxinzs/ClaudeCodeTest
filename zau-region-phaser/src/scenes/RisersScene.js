import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { RISERS_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { RISERS_NPCS, RISERS_TERMINAL } from '../data/npcs.js';

// The Cable Risers (STORY.md S2) — the Meridian data centre's maintenance
// shafts, the district's dungeon. Same shape as the Boiler Tunnels: two
// technician chokepoints, and at the top the signal terminal where Priya
// and Prism decode the storms into a pulse.
const WILD_ENCOUNTER_CHANCE = 0.12;
const SPAWN = { x: 2, y: 9 };

export default class RisersScene extends Phaser.Scene {
  constructor() {
    super('Risers');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.risers ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, RISERS_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - RISERS_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, RISERS_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'wallStone' });
    drawDecor(this, RISERS_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 0, 'CABLE RISERS', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: RISERS_MAP, posRef: state.pos.risers, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.risers, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: RISERS_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.risers });

    setupFollowCamera(this, { mapDef: RISERS_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    // Server-hall blue: a cold wash over the shafts.
    this.add.rectangle(GAME_W / 2, this.offsetY + RISERS_MAP.h * TILE / 2, GAME_W * 3, RISERS_MAP.h * TILE * 3, 0x0a1a3a, 1).setAlpha(0.28).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Climb Down', onClick: () => this.leave() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])]);
  }

  drawPlayer() {
    const pos = state.pos.risers;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  spawn() { Object.assign(state.pos.risers, SPAWN); return state.pos.risers; }

  leave() {
    this.spawn();
    saveGame();
    goToScene(this, 'Signal');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === RISERS_MAP.terminalX && ny === RISERS_MAP.terminalY) {
      if (hasFlag('pulseDecoded')) this.toastText.setText('The terminal loops the waveform. Every eleven seconds, exactly.');
      else this.npcLayer.run(RISERS_TERMINAL);
      return;
    }
    if (nx === SPAWN.x && ny === SPAWN.y) {
      this.toastText.setText('The hatch down to the data centre floor.');
      return;
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'risers', returnTo: 'Risers' });
    }
  }
}
