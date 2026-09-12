import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { UNDERLIGHT_MAP } from '../data/maps.js';
import { TILE, GAME_W, GAME_H } from '../config.js';
import { drawTiles, drawDecor, createWalker, setupFollowCamera, setupHUD } from '../mapRenderer.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { preloadNPCLayers, placeNPCs, makeActor } from '../npcs.js';
import { ensureStoryState, hasFlag } from '../story.js';
import { addMonSpriteAt } from '../spriteLoader.js';
import { UNDERLIGHT_NPCS, UNDERLIGHT_RIG, ENDING } from '../data/npcs.js';

// The Underlight (STORY.md V1–V4) — the old excavation, lit by Meridian's
// rig. Dario is here first (V2, with his Mega); Elena and Priya are at the
// controls; the rig tile starts the Verdanyx battle (V3, the point is
// stopping the rig); back from it, the ENDING runs (V4, the revert).
const SPAWN = { x: 3, y: 5 };

export default class UnderlightScene extends Phaser.Scene {
  constructor() {
    super('Underlight');
  }

  init(data) {
    this.pendingToast = data?.toastMsg || '';
    ensureStoryState();
    state.pos.underlight ??= { ...SPAWN };
  }

  preload() {
    preloadPlayerLayers(this, state.player.appearance);
    preloadNPCLayers(this, UNDERLIGHT_NPCS);
  }

  create() {
    fadeIn(this);
    this.offsetX = Math.floor((GAME_W - UNDERLIGHT_MAP.w * TILE) / 2);
    this.offsetY = 20;

    drawTiles(this, UNDERLIGHT_MAP, { offsetX: this.offsetX, offsetY: this.offsetY, floorKey: 'dirt', blockedKey: 'wallStone' });
    drawDecor(this, UNDERLIGHT_MAP.decor, { offsetX: this.offsetX, offsetY: this.offsetY });
    this.drawPlayer();

    const header = this.add.text(GAME_W / 2, 4, 'THE UNDERLIGHT', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.toastText = this.add.text(GAME_W / 2, GAME_H - 52, this.pendingToast, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0', wordWrap: { width: GAME_W - 20 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.walker = createWalker(this, {
      mapDef: UNDERLIGHT_MAP, posRef: state.pos.underlight, sprite: this.playerCtrl.container, playerCtrl: this.playerCtrl,
      offsetX: this.offsetX, offsetY: this.offsetY,
      onStep: (nx, ny) => this.handleStep(nx, ny),
      isBlocked: (x, y) => this.npcLayer?.isBlocked(x, y) || (x === UNDERLIGHT_MAP.verdanyxX && y === UNDERLIGHT_MAP.verdanyxY)
    });

    const playerActor = makeActor(this, this.playerCtrl, state.pos.underlight, this.offsetX, this.offsetY);
    this.npcLayer = placeNPCs(this, { npcs: UNDERLIGHT_NPCS, offsetX: this.offsetX, offsetY: this.offsetY, player: playerActor, walker: this.walker, posRef: state.pos.underlight });

    setupFollowCamera(this, { mapDef: UNDERLIGHT_MAP, offsetX: this.offsetX, offsetY: this.offsetY, player: this.playerCtrl.container, zoom: 1.4 });

    // The rig's light: a sick green wash that dies with the rig.
    this.glow = this.add.rectangle(GAME_W / 2, this.offsetY + UNDERLIGHT_MAP.h * TILE / 2, GAME_W * 3, UNDERLIGHT_MAP.h * TILE * 3, 0x1a5a2a, 1).setAlpha(hasFlag('ending') ? 0 : 0.28).setDepth(50);

    const bar = addActionBar(this, [
      { label: 'Party', onClick: () => this.scene.launch('Party') },
      { label: 'Bag', onClick: () => this.scene.launch('Bag') },
      { label: 'Center', onClick: () => this.scene.launch('Center') }
    ], GAME_H - 16);

    this.hudCam = setupHUD(this, [header, this.toastText, ...bar.flatMap(b => [b.bg, b.label])], { banner: 'THE UNDERLIGHT' });

    // Verdanyx — no artwork exists for a custom species; the glyph stands.
    const vx = this.tileCenter(UNDERLIGHT_MAP.verdanyxX, UNDERLIGHT_MAP.verdanyxY);
    this.verdanyx = addMonSpriteAt(this, vx.x, vx.y - 6, { id: null, emoji: '🐲', size: TILE * 1.9, hudCam: this.hudCam, depth: 30 });
    if (!hasFlag('ending')) this.breathe = this.tweens.add({ targets: this.verdanyx.obj, scaleX: 1.08, scaleY: 1.08, duration: 550, yoyo: true, repeat: -1 });
    else this.verdanyx.obj.setAlpha(0.7);

    // V4: back from the battle, the revert.
    if (state.verdanyxBeaten && !hasFlag('ending')) this.npcLayer.run(ENDING);
  }

  tileCenter(x, y) { return { x: this.offsetX + x * TILE + TILE / 2, y: this.offsetY + y * TILE + TILE / 2 }; }

  // ---- cutscene hooks ----
  showDarioMega() {
    const p = this.tileCenter(2, 4);
    const m = addMonSpriteAt(this, p.x, p.y, { id: 10059, emoji: '🥋', size: TILE * 1.1, hudCam: this.hudCam, depth: 35 });
    this.time.delayedCall(2500, () => { const o = m.obj; this.tweens.add({ targets: o, alpha: 0, duration: 500, onComplete: () => o.destroy() }); });
  }
  rigDies() {
    this.tweens.add({ targets: this.glow, alpha: 0, duration: 1200 });
    if (this.breathe) { this.breathe.stop(); this.breathe = null; }
    this.tweens.add({ targets: this.verdanyx.obj, scaleX: 0.9, scaleY: 0.9, duration: 1200 });
  }
  revertStart() { this.tweens.add({ targets: this.verdanyx.obj, alpha: 0.35, duration: 900 }); }
  revertEnd() {
    this.tweens.add({ targets: this.verdanyx.obj, alpha: 0.7, scaleX: 1, scaleY: 1, duration: 1400 });
    this.breathe = this.tweens.add({ targets: this.verdanyx.obj, scaleX: 1.03, scaleY: 1.03, duration: 2600, yoyo: true, repeat: -1 });
  }

  drawPlayer() {
    const pos = state.pos.underlight;
    this.playerCtrl = createPlayerSprite(
      this,
      this.offsetX + pos.x * TILE + TILE * 0.5, this.offsetY + pos.y * TILE + TILE * 0.5,
      state.player.appearance
    );
  }

  handleStep(nx, ny) {
    this.toastText.setText('');
    saveGame();
    if (nx === UNDERLIGHT_MAP.rigX && ny === UNDERLIGHT_MAP.rigY) {
      if (hasFlag('ending')) { this.toastText.setText("The rig, dead and cooling. Beyond it, something enormous breathes slow."); return; }
      if (!hasFlag('underlightDario')) { this.toastText.setText("The rig's controls. Elena, without looking up: \"Your friend first. He's earned one second.\""); return; }
      if (!state.verdanyxBeaten) { this.npcLayer.run(UNDERLIGHT_RIG); return; }
      return;
    }
    if (nx === SPAWN.x && ny === SPAWN.y && hasFlag('ending')) {
      this.toastText.setText('The freight core. It goes all the way up.');
    }
  }
}
