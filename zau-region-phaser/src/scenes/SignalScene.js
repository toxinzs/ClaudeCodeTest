import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { SIGNAL_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { SIGNAL_NPCS } from '../data/npcs.js';

// Signal District — stratum 6 in WORLD.md, designed in
// zau-region/districts/signal.md, and the first district built with its
// cast in place from day one (Phase 19). Signal Tower is Prism's gym
// (league index 3); the Relay is the Mart; the Data Centre leads into the
// Cable Risers dungeon once Juno asks (S1); the Antenna Farm is where
// Dario's sponsored rematch happens after the pulse is decoded (S3).
const WILD_ENCOUNTER_CHANCE = 0.12;
const PRISM_IDX = 3;
const SPAWN = { x: 4, y: 7 };

const SPOTS = {
  gym:        { x: 7, y: 1 },
  relay:      { x: 4, y: 1 },
  datacentre: { x: 1, y: 1 },
  antenna:    { x: 7, y: 5 },
  bridge:     { x: SIGNAL_MAP.bridgeX, y: SIGNAL_MAP.bridgeY },
  stair:      { x: SIGNAL_MAP.stairX, y: SIGNAL_MAP.stairY }
};

const SPOT_TEXT = {
  antenna: "The Antenna Farm. The district's edge, where the wind is. Up here the storms are audible before they're visible — a low hum under the thunder.",
  bridge: "The Sprawl Bridge — a sky bridge up to the mid-city. Meridian security at the far end waves you off: League business ends at five badges."
};

export default class SignalScene extends Phaser.Scene {
  constructor() {
    super('Signal');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.signal ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, SIGNAL_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - SIGNAL_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, SIGNAL_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'wallStone' });
    drawDecor(this, SIGNAL_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'SIGNAL DISTRICT', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: SIGNAL_MAP, posRef: state.pos.signal, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.signal, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: SIGNAL_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.signal });

    setupFollowCamera(this, { mapDef: SIGNAL_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Greenline', onClick: () => this.leaveToGreenline() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])]);
  }

  drawPlayer() {
    const pos = state.pos.signal;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leaveToGreenline() {
    Object.assign(state.pos.signal, SPAWN);
    saveGame();
    goToScene(this, 'Greenline');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('stair')) { this.leaveToGreenline(); return; }
    if (at('gym')) {
      if (state.leagueBeaten[PRISM_IDX]) {
        this.toastText.setText(`Signal Tower. You already beat ${LEAGUE_LEADERS[PRISM_IDX].name} — they're re-running the loss frame by frame, delighted.`);
      } else if (!state.party.length) {
        this.toastText.setText("Signal Tower. Prism, without looking up: \"Come back with a variable I can measure.\"");
      } else {
        state.currentLeagueIdx = PRISM_IDX;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'Signal' });
      }
      return;
    }
    if (at('relay')) { this.toastText.setText('The Relay — everything that hums, and some things that shouldn\'t.'); this.scene.launch('Mart'); return; }
    if (at('datacentre')) {
      if (hasFlag('signalJuno')) goToScene(this, 'Risers');
      else this.toastText.setText('Meridian Data Centre. The door is badge-tapped, and the man beside it would like you to stop looking at it.');
      return;
    }
    for (const key of ['antenna', 'bridge']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'signal', returnTo: 'Signal' });
    }
  }
}
