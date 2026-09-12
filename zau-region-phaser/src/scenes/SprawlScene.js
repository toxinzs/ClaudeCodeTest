import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { SPRAWL_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag, setFlag } from '../story.js';
import { SPRAWL_NPCS } from '../data/npcs.js';

// The Sprawl — stratum 7 in WORLD.md, designed in
// zau-region/districts/sprawl.md. Act 3's first stop and the district
// whose job is to make Meridian ordinary right before the Tower. No gym:
// Halloran's office (SP1 Dario's choice, SP2 the access badge), the
// Concourse (shop), Sloane's offer, the rooftops, and the Tower lobby
// elevator that Halloran's badge opens.
const WILD_ENCOUNTER_CHANCE = 0.08;
const SPAWN = { x: 4, y: 7 };

const SPOTS = {
  office:    { x: 1, y: 1 },
  concourse: { x: 4, y: 1 },
  rooftops:  { x: 7, y: 1 },
  elevator:  { x: SPRAWL_MAP.elevatorX, y: SPRAWL_MAP.elevatorY },
  bridge:    { x: SPRAWL_MAP.bridgeX, y: SPRAWL_MAP.bridgeY }
};

const SPOT_TEXT = {
  office: "Halloran's Community Office. Funding applications on every surface, a coffee machine that works, a framed photo of the Scrapyard Exchange's new roof.",
  rooftops: "The Rooftops. Straight up: Meridian Tower, glass all the way to the fog. Straight down: everything else."
};

export default class SprawlScene extends Phaser.Scene {
  constructor() {
    super('Sprawl');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.sprawl ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, SPRAWL_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - SPRAWL_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, SPRAWL_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'wallBrick' });
    drawDecor(this, SPRAWL_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'THE SPRAWL', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: SPRAWL_MAP, posRef: state.pos.sprawl, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.sprawl, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: SPRAWL_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.sprawl });

    setupFollowCamera(this, { mapDef: SPRAWL_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Signal', onClick: () => this.leaveToSignal() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])]);
  }

  drawPlayer() {
    const pos = state.pos.sprawl;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leaveToSignal() {
    Object.assign(state.pos.sprawl, SPAWN);
    saveGame();
    goToScene(this, 'Signal');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('bridge')) { this.leaveToSignal(); return; }
    if (at('concourse')) { this.toastText.setText('The Concourse — the Sprawl\'s shops, under one glass roof.'); this.scene.launch('Mart'); return; }
    if (at('elevator')) {
      if (hasFlag('towerBadge')) {
        setFlag('towerOpen');
        goToScene(this, 'Tower');
      } else {
        this.toastText.setText('The Tower Lobby Elevator. Two Site Security guards, one badge reader, and a polite "Not today."');
      }
      return;
    }
    for (const key of ['office', 'rooftops']) {
      if (at(key)) { this.toastText.setText(SPOT_TEXT[key]); return; }
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'sprawl', returnTo: 'Sprawl' });
    }
  }
}
