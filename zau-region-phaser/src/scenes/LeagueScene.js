import Phaser from 'phaser';
import { state } from '../state.js';
import { LEAGUE_MAP } from '../data/maps.js';
import { LEAGUE_LEADERS, DIRECTOR_VANCE } from '../data/story.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';

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

  create() {
    this.offsetX = Math.floor((GAME_W - LEAGUE_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, LEAGUE_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'grass', blockedKey: 'wallStone' });
    drawDecor(this, this.buildDecor(), { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    this.add.text(GAME_W / 2, 4, 'ZAU LEAGUE', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    const clearedCount = state.leagueBeaten.filter(Boolean).length;
    const initialToast = this.pendingToast || (clearedCount < 5 ? `${clearedCount}/5 leaders cleared` : '');
    this.toastText = this.add.text(GAME_W / 2, this.offsetY + LEAGUE_MAP.h * TILE + 12, initialToast, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: LEAGUE_MAP, posRef: state.pos.league, sprite: this.player,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny)
    });

    this.input.keyboard.on('keydown-UP', () => this.walker.tryMove(0, -1));
    this.input.keyboard.on('keydown-DOWN', () => this.walker.tryMove(0, 1));
    this.input.keyboard.on('keydown-LEFT', () => this.walker.tryMove(-1, 0));
    this.input.keyboard.on('keydown-RIGHT', () => this.walker.tryMove(1, 0));

    addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Mart', onClick: () => this.scene.launch('Mart') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') }
    ], GAME_H - 16);
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
    this.player = this.add.text(
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.avatar || '🧑🏾', { fontSize: '32px' }
    ).setOrigin(0.5);
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    const idx = LEADER_POS.findIndex(p => p.x === nx && p.y === ny);
    if (idx !== -1) {
      if (state.leagueBeaten[idx]) {
        this.toastText.setText(`You already beat ${LEAGUE_LEADERS[idx].name}.`);
      } else {
        state.currentLeagueIdx = idx;
        this.scene.start('Battle', { kind: 'league', returnTo: 'League' });
      }
      return;
    }
    if (nx === TOWER_POS.x && ny === TOWER_POS.y) {
      const clearedCount = state.leagueBeaten.filter(Boolean).length;
      if (clearedCount < 5) {
        this.toastText.setText('The tower is sealed until all 5 League Leaders are defeated.');
      } else if (!state.vanceBeaten) {
        this.scene.start('Battle', { kind: 'vance', returnTo: 'League' });
      } else if (!state.verdanyxBeaten) {
        this.scene.start('Battle', { kind: 'verdanyx', returnTo: 'League' });
      } else {
        this.toastText.setText('Zau has no more challenges left for you. Legendary run.');
      }
    }
  }
}
