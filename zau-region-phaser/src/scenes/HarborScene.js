import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { HARBOR_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState } from '../story.js';
import { HARBOR_NPCS, HARBOR_CARGO_BREAKIN } from '../data/npcs.js';

// Harbor District — the first real district map (stratum 3 in WORLD.md,
// designed in zau-region/districts/harbor.md). Unlike the abstract League
// hub, Coral's gym lives here in her own district; the League hub still
// lists her too, both routes share state.leagueBeaten[0]. Sub-locations
// are step triggers on decor tiles; the ones that don't "do" anything yet
// (Ferry Terminal, Cargo Row, Drowned Stair) are the story hooks the
// design doc plants, delivered as flavor until their systems exist.
const WILD_ENCOUNTER_CHANCE = 0.12;
const CORAL_IDX = 0;

const SPOTS = {
  gym:        { x: 7, y: 1 },
  market:     { x: 4, y: 1 },
  cargo:      { x: 1, y: 1 },
  ferry:      { x: 7, y: 4 },
  lighthouse: { x: 1, y: 4 },
  stair:      { x: 4, y: 5 },
  ramp:       { x: HARBOR_MAP.rampX, y: HARBOR_MAP.rampY }
};

const SPOT_TEXT = {
  cargo: "Cargo Row. Meridian Dynamics fencing, cranes nobody local runs anymore. The trucks that come and go never stop at the market.",
  ferry: "The Ferry Terminal — boarded up. Harbormaster Rossi: \"Boats used to leave from here. They stopped. Nobody official will tell you why.\"",
  lighthouse: "Lighthouse Point. The keeper squints at you: \"Only thing here older than the stacking. Zau wasn't always up — it was down first.\"",
  stair: "The Drowned Stair. Water laps at the third step down. It clearly goes somewhere — just not yet."
};

export default class HarborScene extends Phaser.Scene {
  constructor() {
    super('Harbor');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    // Old saves predate this map and Object.assign(state, saved) replaces
    // the whole `pos` object, so the default from state.js can be missing.
    state.pos.harbor ??= { x: 4, y: 3 };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, HARBOR_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - HARBOR_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, HARBOR_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'water' });
    drawDecor(this, HARBOR_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'HARBOR DISTRICT', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: HARBOR_MAP, posRef: state.pos.harbor, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.harbor, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: HARBOR_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.harbor });

    setupFollowCamera(this, { mapDef: HARBOR_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Town', onClick: () => goToScene(this, 'Town') }
    ], GAME_H - 16);

    setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])]);
  }

  drawPlayer() {
    const pos = state.pos.harbor;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('gym')) {
      if (state.leagueBeaten[CORAL_IDX]) {
        this.toastText.setText(`Coral's Reef Gym. You already beat ${LEAGUE_LEADERS[CORAL_IDX].name} — the tanks glow quietly behind the empty battle floor.`);
      } else if (!state.party.length) {
        this.toastText.setText("Coral's Reef Gym. You'll need a Pokémon before Coral will even look at you.");
      } else {
        state.currentLeagueIdx = CORAL_IDX;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'Harbor' });
      }
      return;
    }
    // The Harbor Ramp up to the Ember Quarter — gated on Coral's badge,
    // the same "beat what's in front of you" rule as every other stratum.
    if (at('ramp')) {
      if (state.leagueBeaten[CORAL_IDX]) goToScene(this, 'Ember');
      else this.toastText.setText("The Harbor Ramp. Foundry security waves you off: \"Coral's badge or nothing. Quarter's not a shortcut.\"");
      return;
    }
    if (at('market')) { this.toastText.setText('The Fish Market — loud, crowded, alive.'); this.scene.launch('Mart'); return; }
    if (at('cargo')) {
      if (state.story.cargoRow) { this.toastText.setText("Cargo Row, locked down. Someone in a Meridian jacket photographs you from behind the fence."); return; }
      if (state.story.harborDario) { this.npcLayer.run(HARBOR_CARGO_BREAKIN); return; }
    }
    for (const key of ['cargo', 'ferry', 'lighthouse', 'stair']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'harbor', returnTo: 'Harbor' });
    }
  }
}
