import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { EMBER_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState } from '../story.js';
import { EMBER_NPCS } from '../data/npcs.js';
import { hasFlag } from '../story.js';

// Ember Quarter — stratum 4 in WORLD.md, designed in
// zau-region/districts/ember.md. Same shape as HarborScene: Ashgrave's
// gym is a step trigger that runs the real league battle for leader
// index 1 (shared with the League hub via state.leagueBeaten[1]), the
// Scrapyard Exchange launches the Mart, and the remaining spots deliver
// the design doc's story hook (Meridian's substation bleeding the
// Quarter's grid) as flavor until Act 3 pays it off.
const WILD_ENCOUNTER_CHANCE = 0.12;
const ASHGRAVE_IDX = 1;
const SPAWN = { x: 4, y: 6 };

const SPOTS = {
  gym:        { x: 7, y: 1 },
  substation: { x: 1, y: 1 },
  exchange:   { x: 4, y: 3 },
  kilns:      { x: 1, y: 5 },
  lift:       { x: EMBER_MAP.liftX, y: EMBER_MAP.liftY },
  ramp:       { x: EMBER_MAP.rampX, y: EMBER_MAP.rampY }
};

const SPOT_TEXT = {
  substation: "Meridian Substation. New, clean, fenced. A technician taps a badge and doesn't look up: \"Grid stabilisation. That's all I'm cleared to say.\" The trunk cable runs down, not up.",
  kilns: "The Kilns. Foreman Kettering wipes his hands: \"Brownouts started the month that substation went live. We draw less than we did ten years ago. So who's drawing?\"",
  lift: "The Freight Lift — caged, the call button dead until you're badged. Stencilled above it: GREENLINE TERRACES. \"Ashgrave's badge opens it. Nothing else does.\""
};

export default class EmberScene extends Phaser.Scene {
  constructor() {
    super('Ember');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    // Old saves predate this map and Object.assign(state, saved) replaces
    // the whole `pos` object, so the default from state.js can be missing.
    state.pos.ember ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, EMBER_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - EMBER_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, EMBER_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallBrick' });
    drawDecor(this, EMBER_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'EMBER QUARTER', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: EMBER_MAP, posRef: state.pos.ember, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.ember, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: EMBER_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.ember });

    setupFollowCamera(this, { mapDef: EMBER_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Harbor', onClick: () => this.leaveToHarbor() }
    ], GAME_H - 16);

    // STORY.md E3: while the blackout is on, the Quarter is dark.
    this.blackoutRect = this.add.rectangle(GAME_W / 2, this.offsetY + EMBER_MAP.h * TILE / 2, GAME_W * 3, EMBER_MAP.h * TILE * 3, 0x05030a, 1)
      .setAlpha(0).setDepth(50);
    if (hasFlag('blackout') && !hasFlag('lineRestored')) this.blackoutRect.setAlpha(0.55);

    setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'EMBER QUARTER' });
  }

  setBlackout(on) {
    this.tweens.add({ targets: this.blackoutRect, alpha: on ? 0.55 : 0, duration: 400 });
  }

  drawPlayer() {
    const pos = state.pos.ember;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  // Leaving resets the spawn so re-entering up the ramp starts just inside
  // the district instead of on the exit tile itself. Mutated in place —
  // createWalker holds the same object as its posRef.
  leaveToHarbor() {
    Object.assign(state.pos.ember, SPAWN);
    saveGame();
    goToScene(this, 'Harbor');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('ramp')) { this.leaveToHarbor(); return; }
    if (at('gym')) {
      if (state.leagueBeaten[ASHGRAVE_IDX]) {
        this.toastText.setText(`Ashgrave's Foundry Gym. You already beat ${LEAGUE_LEADERS[ASHGRAVE_IDX].name} — the line keeps running; nobody stops it for a rematch either.`);
      } else if (!state.party.length) {
        this.toastText.setText("Ashgrave's Foundry Gym. Ashgrave doesn't stop the line for a trainer with no Pokémon.");
      } else {
        state.currentLeagueIdx = ASHGRAVE_IDX;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'Ember' });
      }
      return;
    }
    // The Freight Lift up to the Greenline Terraces — gated on Ashgrave's badge.
    if (at('lift')) {
      if (state.leagueBeaten[ASHGRAVE_IDX]) goToScene(this, 'Greenline');
      else this.toastText.setText(SPOT_TEXT.lift);
      return;
    }
    if (at('exchange')) { this.toastText.setText('The Scrapyard Exchange — everything off a pallet, the till a coffee tin.'); this.scene.launch('Mart'); return; }
    if (at('kilns') && hasFlag('blackout')) {
      goToScene(this, 'Boiler');
      return;
    }
    for (const key of ['substation', 'kilns']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'ember', returnTo: 'Ember' });
    }
  }
}
