import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { UNDERCITY_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { UNDERCITY_NPCS, OBSIDIAN_AFTER } from '../data/npcs.js';

// The Undercity — stratum 1 in WORLD.md, designed in
// zau-region/districts/undercity.md. Where the oddities resolve: Obsidian's
// Vault (league index 4) hands over the Gengarite and the Warden's name,
// and past the Vault the Warden herself — Elena Voss — tells the truth
// and closes Act 2 (U3). The Underlight below stays sealed until Act 3.
const WILD_ENCOUNTER_CHANCE = 0.1;
const OBSIDIAN_IDX = 4;
const SPAWN = { x: 4, y: 7 };

const SPOTS = {
  gym:        { x: 7, y: 1 },
  post:       { x: 4, y: 1 },
  platform:   { x: 1, y: 1 },
  reach:      { x: 7, y: 5 },
  underlight: { x: UNDERCITY_MAP.underlightX, y: UNDERCITY_MAP.underlightY },
  stair:      { x: UNDERCITY_MAP.stairX, y: UNDERCITY_MAP.stairY }
};

const SPOT_TEXT = {
  platform: "Halvard's Platform. The train is still here, doors open, eighteen years of chalk on the wall beside it.",
  reach: "The Warden's Reach. A kettle on a camp stove. The tunnels beyond are quiet in a way that feels like somebody's doing.",
  underlight: "A sealed hatch, warm to the touch. Beyond it the rock hums — slow, regular. Sealed. For now."
};

export default class UndercityScene extends Phaser.Scene {
  constructor() {
    super('Undercity');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.undercity ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, UNDERCITY_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - UNDERCITY_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, UNDERCITY_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallStone' });
    drawDecor(this, UNDERCITY_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'THE UNDERCITY', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: UNDERCITY_MAP, posRef: state.pos.undercity, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.undercity, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: UNDERCITY_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.undercity });

    setupFollowCamera(this, { mapDef: UNDERCITY_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });
    this.add.rectangle(GAME_W / 2, this.offsetY + UNDERCITY_MAP.h * TILE / 2, GAME_W * 3, UNDERCITY_MAP.h * TILE * 3, 0x03020a, 1).setAlpha(0.45).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Old Lines', onClick: () => this.leaveDown() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'THE UNDERCITY' });
  }

  drawPlayer() {
    const pos = state.pos.undercity;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leaveDown() {
    Object.assign(state.pos.undercity, SPAWN);
    saveGame();
    goToScene(this, 'OldLines');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('stair')) { this.leaveDown(); return; }
    if (at('gym')) {
      if (state.leagueBeaten[OBSIDIAN_IDX]) {
        if (!hasFlag('gengariteGiven')) this.npcLayer.run(OBSIDIAN_AFTER);
        else this.toastText.setText(`Undercity Vault. You already beat ${LEAGUE_LEADERS[OBSIDIAN_IDX].name} — the vault door stands open; she's reading.`);
      } else if (!state.party.length) {
        this.toastText.setText("Undercity Vault. Obsidian doesn't look up: \"Come back with a team.\"");
      } else {
        state.currentLeagueIdx = OBSIDIAN_IDX;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'Undercity' });
      }
      return;
    }
    if (at('post')) { this.toastText.setText("Kestrel's Post — every rumour down here, half of them for sale."); this.scene.launch('Mart'); return; }
    for (const key of ['platform', 'reach', 'underlight']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'undercity', returnTo: 'Undercity' });
    }
  }
}
