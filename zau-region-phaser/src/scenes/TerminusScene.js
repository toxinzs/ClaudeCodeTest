import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { TERMINUS_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { TERMINUS_NPCS, HALCYON_AFTER } from '../data/npcs.js';

// The Terminus (STORY.md U2b) — a dead-end transit platform past Obsidian's
// Vault that nobody sealed, because nobody who runs Zau remembers it is
// there. Two Regulars hold the one-tile chokepoints, Halcyon (league index
// 5, Badge 6) keeps the platform at the top, and the only way out is back
// the way you came. The Warden's Reach, back on the Undercity map, opens
// once Halcyon's badge is won.
const WILD_ENCOUNTER_CHANCE = 0.12;
const BOTTOM = { x: TERMINUS_MAP.exitX, y: TERMINUS_MAP.exitY };

const SPOT_TEXT = {
  board: "A destination board, still lit. Every row reads TERMINUS. The times beside them are all the same minute, eighteen years ago.",
  shrine: "Another of her shrines — a folded blanket, a cold kettle, chalk tallies in groups of twelve. Whoever slept here kept the platform company.",
  platform: "Platform one. The rails end in a buffer stop, polished by years of someone's sleeve."
};

export default class TerminusScene extends Phaser.Scene {
  constructor() {
    super('Terminus');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.terminus ??= { ...BOTTOM };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, TERMINUS_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - TERMINUS_MAP.w * TILE) / 2);
    this.offsetY = 12;

    drawTiles(this, TERMINUS_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallStone' });
    drawDecor(this, TERMINUS_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 0, 'THE TERMINUS', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: TERMINUS_MAP, posRef: state.pos.terminus, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.terminus, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: TERMINUS_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.terminus });

    setupFollowCamera(this, { mapDef: TERMINUS_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });
    // A violet-dark wash: lighter than the Old Lines (the destination boards are still lit).
    this.add.rectangle(GAME_W / 2, this.offsetY + TERMINUS_MAP.h * TILE / 2, GAME_W * 3, TERMINUS_MAP.h * TILE * 3, 0x0a0620, 1).setAlpha(0.42).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Vault', onClick: () => this.leaveUp() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'THE TERMINUS' });

    // Back from the gym battle: Halcyon breaks cadence and hands over the stone.
    if (state.leagueBeaten[5] && !hasFlag('banettiteGiven')) this.npcLayer.run(HALCYON_AFTER);
  }

  drawPlayer() {
    const pos = state.pos.terminus;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  leaveUp() {
    Object.assign(state.pos.terminus, BOTTOM);
    Object.assign(state.pos.undercity, { x: 7, y: 2 });
    saveGame();
    goToScene(this, 'Undercity');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === BOTTOM.x && ny === BOTTOM.y) { this.leaveUp(); return; }
    if (nx === TERMINUS_MAP.boardX && ny === TERMINUS_MAP.boardY) { this.toastText.setText(SPOT_TEXT.board); return; }
    if (nx === TERMINUS_MAP.shrineX && ny === TERMINUS_MAP.shrineY) { this.toastText.setText(SPOT_TEXT.shrine); return; }
    if (nx === TERMINUS_MAP.platformX && ny === TERMINUS_MAP.platformY) { this.toastText.setText(SPOT_TEXT.platform); return; }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'terminus', returnTo: 'Terminus' });
    }
  }
}
