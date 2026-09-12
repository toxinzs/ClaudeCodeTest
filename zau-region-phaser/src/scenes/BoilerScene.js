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
import { BOILER_NPCS, BOILER_BREAKER, BOILER_STONE, KEYSTONE_BEAT } from '../data/npcs.js';
import { badgeCount } from '../story.js';
import { addMonSpriteAt } from '../spriteLoader.js';

// Boiler Tunnels — the first real dungeon (STORY.md E3), under the Ember
// Quarter's Kilns. A Trail-style corridor: two mill-worker chokepoints
// (they stand in one-tile gaps and leave once beaten), the breaker at the
// far end, and the Aggronite in the alcove beside it (MEGA.md: a cave
// stone). Dark: the Quarter's power is out while you're down here.
const WILD_ENCOUNTER_CHANCE = 0.15;
const SPAWN = { x: 2, y: 11 };
const DOOR = { x: 1, y: 0 }; // the Meridian keycard door beside the breaker

function keyStoneReady() {
  return hasFlag('lineRestored') && badgeCount() >= 3 && !hasFlag('keyStone');
}

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
    decor.push({ x: DOOR.x, y: DOOR.y, emoji: hasFlag('keyStone') ? '🚪' : '🔒' });
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

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'BOILER TUNNELS' });

    // STORY.md K1: after Badge 3 the Absol waits at the door.
    if (keyStoneReady()) {
      this.absol = addMonSpriteAt(this, this.offsetX + DOOR.x * TILE + TILE / 2, this.offsetY + DOOR.y * TILE + TILE / 2,
        { id: 359, emoji: '🐺', size: TILE * 1.2, hudCam: this.hudCam });
    }
  }

  openDoor() {
    this.tweens.add({ targets: this.darkRect, alpha: 0, duration: 300 });
    if (this.absol) { const a = this.absol.obj; this.tweens.add({ targets: a, alpha: 0, duration: 600, delay: 1200, onComplete: () => a.destroy() }); this.absol = null; }
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
    const atDoor = nx === DOOR.x && ny === DOOR.y;
    const atBreaker = nx === BOILER_MAP.breakerX && ny === BOILER_MAP.breakerY;
    if ((atDoor || atBreaker) && keyStoneReady()) { this.npcLayer.run(KEYSTONE_BEAT); return; }
    if (atDoor) {
      this.toastText.setText(hasFlag('keyStone')
        ? "E. Voss's locker stands open and empty. The old lines beyond are dark, and quiet in a way that feels like somebody's doing."
        : (hasFlag('lineRestored') ? 'A Meridian keycard door. The reader blinks red at you.' : 'A sealed door in the dark.'));
      return;
    }
    if (atBreaker) {
      if (hasFlag('lineRestored')) this.toastText.setText('The breaker hums. The keycard door beside it ' + (hasFlag('keyStone') ? 'stands open.' : 'still blinks red.'));
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
