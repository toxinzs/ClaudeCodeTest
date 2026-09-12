import Phaser from 'phaser';
import { state } from '../state.js';
import { LEAGUE_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS, DIRECTOR_VANCE } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';

// Unlike the Trail, leaders can be challenged in any order, so they're
// placed around a hub rather than along a corridor. The tower starts
// sealed, opens to Director Vance once all 5 are beaten, then to the
// Underlight (Verdanyx) once Vance is beaten too — ported from
// the DOM version's ui/league.js.
const LEADER_POS = [
  { x: 1, y: 1 }, { x: 5, y: 1 },
  { x: 1, y: 5 }, { x: 5, y: 5 },
  { x: 3, y: 3 }
];
const TOWER_POS = { x: 3, y: 1 };

export default class LeagueScene extends Phaser.Scene {
  constructor() {
    super('League');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - LEAGUE_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, LEAGUE_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'grass', blockedKey: 'wallStone' });
    drawDecor(this, this.buildDecor(), { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'ZAU LEAGUE', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    const clearedCount = state.leagueBeaten.filter(Boolean).length;
    const initialToast = this.pendingToast || (clearedCount < 5 ? `${clearedCount}/5 leaders cleared` : '');
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, initialToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: LEAGUE_MAP, posRef: state.pos.league, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny)
    });

    setupFollowCamera(this, { mapDef: LEAGUE_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Mart', onClick: () => this.scene.launch('Mart') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') }
    ], GAME_H - 16);

    const hudObjects = [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])];
    setupHUD(this, hudObjects);
  }

  buildDecor() {
    const decor = LEAGUE_LEADERS.map((l, i) => ({
      x: LEADER_POS[i].x, y: LEADER_POS[i].y,
      emoji: state.leagueBeaten[i] ? '✅' : l.emoji
    }));
    const clearedCount = state.leagueBeaten.filter(Boolean).length;
    let towerEmoji = '🏙️';
    if (clearedCount >= 5) {
      towerEmoji = !state.vanceBeaten ? DIRECTOR_VANCE.emoji : (!state.verdanyxBeaten ? '🕳️' : '🏆');
    }
    decor.push({ x: TOWER_POS.x, y: TOWER_POS.y, emoji: towerEmoji });
    return decor;
  }

  drawPlayer() {
    const pos = state.pos.league;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    const idx = LEADER_POS.findIndex(p => p.x === nx && p.y === ny);
    if (idx !== -1) {
      if (state.leagueBeaten[idx]) {
        this.toastText.setText(`You already beat ${LEAGUE_LEADERS[idx].name}.`);
      } else {
        state.currentLeagueIdx = idx;
        goToScene(this, 'Battle', { kind: 'league', returnTo: 'League' });
      }
      return;
    }
    if (nx === TOWER_POS.x && ny === TOWER_POS.y) {
      const clearedCount = state.leagueBeaten.filter(Boolean).length;
      if (clearedCount < 5) {
        this.toastText.setText('The tower is sealed until all 5 League Leaders are defeated.');
      } else if (!state.verdanyxBeaten) {
        this.toastText.setText("Meridian Tower's real door is the Sprawl's lobby elevator. Halloran's badge opens it.");
      } else {
        this.toastText.setText('Zau has no more challenges left for you. Legendary run.');
      }
    }
  }
}
