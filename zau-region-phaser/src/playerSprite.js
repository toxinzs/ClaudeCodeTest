import { TILE } from './config.js';
import {
  FRAME_SIZE, SHEET_COLS, WALK_ROW, WALK_FRAMES,
  normalizeAppearance, bodyPath, hairPath, outfitTorsoPath, outfitLegsPath,
} from './data/appearance.js';

// The 64px LPC frame vs. our 52px tile — scaled down so the character
// reads as "standing on a tile" rather than dwarfing it, while still
// overflowing slightly above the tile (heads/hair extending past the top
// edge), same as most top-down JRPGs.
const CHAR_SCALE = TILE / FRAME_SIZE;

// Real layered character sprites (body/legs/torso/hair, each the same
// 832x1344 universal LPC sheet layout) replace the old single-emoji-glyph
// player. Every scene that walks the player around calls preloadPlayerLayers
// in preload() and createPlayerSprite in create() — texture keys are
// content-addressed by appearance value, so re-entering a scene (or a
// second scene) with the same appearance is a texture-cache hit, not a
// re-download.

function layerKeys(appearance) {
  const a = normalizeAppearance(appearance);
  const keys = { body: `char_body_${a.skin}`, torso: `char_torso_${a.outfit}`, legs: `char_legs_${a.outfit}` };
  if (a.hair !== 'none') keys.hair = `char_hair_${a.hair}_${a.hairColor}`;
  return keys;
}

export function preloadPlayerLayers(scene, appearance) {
  const a = normalizeAppearance(appearance);
  const sheetOpts = { frameWidth: FRAME_SIZE, frameHeight: FRAME_SIZE };
  const want = [
    [`char_body_${a.skin}`, bodyPath(a.skin)],
    [`char_torso_${a.outfit}`, outfitTorsoPath(a.outfit)],
    [`char_legs_${a.outfit}`, outfitLegsPath(a.outfit)],
  ];
  if (a.hair !== 'none') want.push([`char_hair_${a.hair}_${a.hairColor}`, hairPath(a.hair, a.hairColor)]);

  for (const [key, path] of want) {
    if (!scene.textures.exists(key)) scene.load.spritesheet(key, path, sheetOpts);
  }
}

function frameFor(direction, col) {
  return WALK_ROW[direction] * SHEET_COLS + col;
}

// Returns a controller wrapping a Phaser Container of stacked layer
// sprites (body < legs < torso < hair, back to front). x/y tween the
// container for tile movement; setDirection/startWalk/stopWalk drive the
// walk-cycle frame stepping independent of that tween.
export function createPlayerSprite(scene, x, y, appearance) {
  const keys = layerKeys(appearance);
  const container = scene.add.container(x, y);
  container.setScale(CHAR_SCALE);
  const sprites = {};
  for (const layer of ['body', 'legs', 'torso', 'hair']) {
    if (!keys[layer]) continue;
    const spr = scene.add.sprite(0, 0, keys[layer], frameFor('down', 0));
    container.add(spr);
    sprites[layer] = spr;
  }

  let direction = 'down';
  let walking = false;
  let elapsed = 0;
  const FRAME_MS = 90;

  function setAllFrames(col) {
    const frame = frameFor(direction, col);
    for (const key of Object.keys(sprites)) sprites[key].setFrame(frame);
  }

  const ctrl = {
    container,
    setDirection(dir) {
      if (WALK_ROW[dir] === undefined) return;
      const changed = direction !== dir;
      direction = dir;
      if (changed && !walking) setAllFrames(0);
    },
    startWalk() {
      walking = true;
    },
    stopWalk() {
      walking = false;
      elapsed = 0;
      setAllFrames(0);
    },
    // Advance the walk-cycle by dt (ms). Call every frame while moving.
    step(dt) {
      if (!walking) return;
      elapsed += dt;
      const col = 1 + Math.floor(elapsed / FRAME_MS) % WALK_FRAMES;
      setAllFrames(col);
    },
    destroy() {
      container.destroy();
    },
  };
  setAllFrames(0);
  return ctrl;
}
