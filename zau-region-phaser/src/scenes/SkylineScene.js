import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { SKYLINE_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag, setFlag } from '../story.js';
import { SKYLINE_NPCS, SKYLINE_VERDANYX } from '../data/npcs.js';
import { addMonSpriteAt } from '../spriteLoader.js';
import { setQuestStatus } from '../quests.js';

// The Skyline — stratum 10, designed in zau-region/districts/skyline.md.
// The postgame map, and the only one that opens *after* the credits: a
// climb of sky bridges above Meridian Tower, with Iven's three weather
// stations as the route (SIDEQUESTS.md #10) and Verdanyx asleep at the
// top. The Sky Bridges platform is where the League's rematches will
// stand; today it says so and nothing more.
const WILD_ENCOUNTER_CHANCE = 0.12;
const SPAWN = { x: SKYLINE_MAP.stairX, y: SKYLINE_MAP.stairY };

const SPOTS = {
  highest: { x: 4, y: 1 },
  cyr:     { x: 2, y: 3 },
  bridges: { x: 6, y: 3 },
  ana:     { x: 2, y: 5 },
  bel:     { x: 6, y: 5 },
  stair:   { x: SKYLINE_MAP.stairX, y: SKYLINE_MAP.stairY }
};

// Each station is a reading, and the readings are the quest: all three
// agree on where the air stands still, which is the top station.
const STATIONS = {
  ana: { flag: 'stationAna', text: 'Station Ana. Wind west-north-west, falling. The pen has drawn the same flat line for eighteen years — except the last fortnight, where it stops dead.' },
  bel: { flag: 'stationBel', text: 'Station Bel. Same flat line, same dead stop. Someone has pencilled in the margin, in a careful old hand: "it is not the instrument."' },
  cyr: { flag: 'stationCyr', text: 'Station Cyr. The third agreement. Where the three lines cross, the air above the top station is not moving at all.' }
};

export default class SkylineScene extends Phaser.Scene {
  constructor() {
    super('Skyline');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.skyline ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, SKYLINE_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - SKYLINE_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, SKYLINE_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'floorIndoor', blockedKey: 'water' });
    drawDecor(this, SKYLINE_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'THE SKYLINE', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: SKYLINE_MAP, posRef: state.pos.skyline, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.skyline, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: SKYLINE_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.skyline });

    setupFollowCamera(this, { mapDef: SKYLINE_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container });

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') },
      { label: 'Quests', onClick: () => this.scene.launch('Quests') },
      { label: 'Tower', onClick: () => this.leaveToTower() }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'THE SKYLINE' });

    // Coming back from the catch is what closes the quest: the engine sets
    // the flag inside the battle, and the quest's last step reads it.
    if (hasFlag('verdanyxCaught')) setQuestStatus('keeper', 'done');

    // Verdanyx stays on the top station once it's been found and not
    // caught — it went back to sleep, it didn't leave.
    if (hasFlag('verdanyxRested') && !hasFlag('verdanyxCaught')) this.showVerdanyx();
  }

  drawPlayer() {
    const pos = state.pos.skyline;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  // Called from SKYLINE_VERDANYX: the shape on the east rail resolves.
  showVerdanyx() {
    if (this.verdanyxSprite) return;
    const s = SPOTS.highest;
    this.verdanyxSprite = addMonSpriteAt(this, this.offsetX + s.x * TILE + TILE * 0.5, this.offsetY + (s.y - 0.6) * TILE, {
      id: null, emoji: '🐲', size: TILE * 1.6, hudCam: this.hudCam, depth: 40
    });
    // addMonSpriteAt returns a holder whose .obj is swapped when (if) the
    // artwork arrives — tween the object, not the holder.
    this.tweens.add({ targets: this.verdanyxSprite.obj, scaleX: 1.06, scaleY: 1.06, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  leaveToTower() {
    Object.assign(state.pos.skyline, SPAWN);
    saveGame();
    goToScene(this, 'Tower');
  }

  routeRead() {
    return hasFlag('stationAna') && hasFlag('stationBel') && hasFlag('stationCyr');
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    const at = (s) => SPOTS[s].x === nx && SPOTS[s].y === ny;

    if (at('stair')) { this.leaveToTower(); return; }

    for (const key of ['ana', 'bel', 'cyr']) {
      if (!at(key)) continue;
      const st = STATIONS[key];
      this.toastText.setText(st.text);
      if (!hasFlag(st.flag)) {
        setFlag(st.flag);
        if (this.routeRead()) this.toastText.setText(st.text + ' All three agree: the top station.');
        saveGame();
      }
      return;
    }

    if (at('bridges')) {
      this.toastText.setText('The Sky Bridges. Wide enough for two trainers and a long drop. Iven says the League used to come up here when they wanted a fight nobody would write about.');
      return;
    }

    if (at('highest')) {
      if (hasFlag('verdanyxCaught')) {
        this.toastText.setText("The Highest Station. The gauges turn again — ordinary wind, over an ordinary city. Verdanyx is with you now.");
        return;
      }
      if (!this.routeRead()) {
        this.toastText.setText("The wind up the last flight stands like a wall. Iven, from below: \"Read the three stations first. The air's wrong up here otherwise.\"");
        return;
      }
      if (!state.party.length) { this.toastText.setText('The Highest Station. Not without a team.'); return; }
      setQuestStatus('keeper', 'active');
      setFlag('verdanyxRested');
      this.npcLayer.run(SKYLINE_VERDANYX);
      return;
    }

    if (state.party.length && Math.random() < WILD_ENCOUNTER_CHANCE) {
      goToScene(this, 'Battle', { kind: 'wild', zoneKey: 'skyline', returnTo: 'Skyline' });
    }
  }
}
