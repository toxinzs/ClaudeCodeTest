import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { GREENLINE_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState } from '../story.js';
import { GREENLINE_NPCS } from '../data/npcs.js';
import { addMonSpriteAt } from '../spriteLoader.js';

// Greenline Terraces — stratum 5 in WORLD.md, designed in
// zau-region/districts/greenline.md. Same shape as Harbor/Ember: Thistle's
// gym is a step trigger that runs the real league battle for leader
// index 2 (shared with the League hub via state.leagueBeaten[2]), the
// Seed Bank launches the Mart, and the remaining spots deliver the design
// doc's story hook (Meridian's irrigation intake and what it's doing to
// the plants) as flavor until Act 3 pays it off.
const WILD_ENCOUNTER_CHANCE = 0.12;
const THISTLE_IDX = 2;
const SPAWN = { x: 3, y: 7 };

const SPOTS = {
  gym:        { x: 7, y: 1 },
  seedbank:   { x: 1, y: 1 },
  irrigation: { x: 1, y: 3 },
  allotments: { x: 4, y: 3 },
  overlook:   { x: 7, y: 5 },
  stair:      { x: 7, y: 7 },
  lift:       { x: GREENLINE_MAP.liftX, y: GREENLINE_MAP.liftY }
};

const SPOT_TEXT = {
  irrigation: "Meridian Irrigation Works. The intake water comes up warm. A hydrologist smiles: \"Deep aquifer.\" The ferns by the pipe are twice the size of the ones ten metres away.",
  allotments: "The Allotments. Kids from the strata below, trainers between gyms, retirees with opinions about tomatoes. The Greenline's social floor.",
  overlook: "The Overlook. Old Sato doesn't look up from his bench: \"Planted every terrace here. Stopped planting near the pump. Nobody asked why, so I stopped saying.\" Below, storms gather over the Outskirts.",
  stair: "The Service Stair — up toward Signal District. The keycard reader blinks red. A gardener: \"Thistle's badge opens it. League courtesy.\""
};

export default class GreenlineScene extends Phaser.Scene {
  constructor() {
    super('Greenline');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    // Old saves predate this map and Object.assign(state, saved) replaces
    // the whole `pos` object, so the default from state.js can be missing.
    state.pos.greenline ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, GREENLINE_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - GREENLINE_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, GREENLINE_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'grass', blockedKey: 'tree' });
    drawDecor(this, GREENLINE_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'GREENLINE TERRACES', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: GREENLINE_MAP, posRef: state.pos.greenline, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.greenline, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: GREENLINE_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.greenline });

    setupFollowCamera(this, { mapDef: GREENLINE_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Ember', onClick: () => this.leaveToEmber() }
    ], GAME_H - 16);

    // STORY.md G3: the storm tint (world-space, under the HUD camera).
    this.stormRect = this.add.rectangle(GAME_W / 2, this.offsetY + GREENLINE_MAP.h * TILE / 2, GAME_W * 3, GREENLINE_MAP.h * TILE * 3, 0x0a1430, 1).setAlpha(0).setDepth(50);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'GREENLINE TERRACES' });
  }

  // ---- cutscene hooks used by GREENLINE_STORM (data/npcs.js) ----
  tileCenter(x, y) { return { x: this.offsetX + x * TILE + TILE / 2, y: this.offsetY + y * TILE + TILE / 2 }; }
  panTarget() { return this.tileCenter(GREENLINE_MAP.edgeX, GREENLINE_MAP.edgeY); }
  stormStart() { this.tweens.add({ targets: this.stormRect, alpha: 0.5, duration: 900 }); }
  stormEnd() {
    this.tweens.add({ targets: this.stormRect, alpha: 0, duration: 1200 });
    this.cameras.main.startFollow(this.playerCtrl.container, true, 0.12, 0.12);
  }
  showAbsol() {
    const { x, y } = this.panTarget();
    this.absol = addMonSpriteAt(this, x, y, { id: 359, emoji: '🐺', size: TILE * 1.3, hudCam: this.hudCam });
    this.absol.obj.setAlpha(0);
    this.tweens.add({ targets: this.absol.obj, alpha: 1, duration: 500 });
  }
  hideAbsol() {
    if (!this.absol) return;
    const a = this.absol.obj;
    this.tweens.add({ targets: a, alpha: 0, duration: 400, onComplete: () => a.destroy() });
    this.absol = null;
  }

  drawPlayer() {
    const pos = state.pos.greenline;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  // Leaving resets the spawn so re-entering off the lift starts beside it
  // instead of on the exit tile itself. Mutated in place — createWalker
  // holds the same object as its posRef.
  leaveToEmber() {
    Object.assign(state.pos.greenline, SPAWN);
    saveGame();
    goToScene(this, 'Ember');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('lift')) { this.leaveToEmber(); return; }
    if (at('gym')) {
      if (state.leagueBeaten[THISTLE_IDX]) {
        this.toastText.setText(`Thistle's Canopy Gym. You already beat ${LEAGUE_LEADERS[THISTLE_IDX].name} — they're deep in conversation with a Floragato and don't notice you come in.`);
      } else if (!state.party.length) {
        this.toastText.setText("Thistle's Canopy Gym. Thistle glances at your empty belt, then back to their Pokémon: \"Come back with someone to talk to.\"");
      } else {
        state.currentLeagueIdx = THISTLE_IDX;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'Greenline' });
      }
      return;
    }
    if (at('seedbank')) { this.toastText.setText('The Seed Bank — the old horticultural archive, now a shop. Every purchase is a small bet on the future.'); this.scene.launch('Mart'); return; }
    if (at('stair')) {
      if (state.leagueBeaten[THISTLE_IDX]) goToScene(this, 'Signal');
      else this.toastText.setText(SPOT_TEXT.stair);
      return;
    }
    for (const key of ['irrigation', 'allotments', 'overlook']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'greenline', returnTo: 'Greenline' });
    }
  }
}
