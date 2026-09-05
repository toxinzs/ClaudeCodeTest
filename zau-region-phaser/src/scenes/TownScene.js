import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { TOWN_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';

const WILD_ENCOUNTER_CHANCE = 0.12;

export default class TownScene extends Phaser.Scene {
  constructor() {
    super('Town');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - TOWN_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, TOWN_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'grass', blockedKey: 'bush' });
    drawDecor(this, TOWN_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'ZAU OUTSKIRTS', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: TOWN_MAP, posRef: state.pos.town, sprite: this.player,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny)
    });

    setupFollowCamera(this, { mapDef: TOWN_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.player });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Mart', onClick: () => this.scene.launch('Mart') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Pokédex', onClick: () => this.scene.launch('Dex') }
    ], GAME_H - 16);

    const hudObjects = [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])];
    setupHUD(this, hudObjects);
  }

  drawPlayer() {
    const pos = state.pos.town;
    this.player = this.add.text(
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.avatar || '🧑🏾', { fontSize: '32px' }
    ).setOrigin(0.5);
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === TOWN_MAP.labX && ny === TOWN_MAP.labY) {
      goToScene(this, 'Lab');
      return;
    }
    if (nx === TOWN_MAP.trailX && ny === TOWN_MAP.trailY && state.party.length) {
      goToScene(this, 'Trail');
      return;
    }
    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'outskirts', returnTo: 'Town' });
    }
  }
}
