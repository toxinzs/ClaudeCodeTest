import { TILE } from './config.js';

// Draws every floor/wall tile in a map's layout grid, real Kenney art
// instead of placeholder rectangles. blockedKey/floorKey let each scene
// pick a tile vocabulary appropriate to its setting (indoor stone vs.
// outdoor grass-and-hedge).
export function drawTiles(scene, mapDef, { offsetX, offsetY, floorKey, blockedKey }) {
  for (let y = 0; y < mapDef.h; y++) {
    for (let x = 0; x < mapDef.w; x++) {
      const cx = offsetX + x * TILE + TILE / 2, cy = offsetY + y * TILE + TILE / 2;
      // Floor always goes down first — several of the "blocked" tiles (bush,
      // tree) are icons with transparent margins, not full-bleed tiles, so
      // without a floor underneath their gaps would show raw canvas black.
      scene.add.image(cx, cy, floorKey).setDisplaySize(TILE, TILE);
      if (mapDef.layout[y][x] === 1) {
        scene.add.image(cx, cy, blockedKey).setDisplaySize(TILE, TILE);
      }
    }
  }
}

// Decor entries carry either a tileKey (real art) or an emoji (no good
// tile match yet, e.g. indoor furniture) — this renders whichever is set.
export function drawDecor(scene, decor, { offsetX, offsetY }) {
  return (decor || []).map(d => {
    const x = offsetX + d.x * TILE + TILE / 2;
    const y = offsetY + d.y * TILE + TILE / 2;
    if (d.tileKey) return scene.add.image(x, y, d.tileKey).setDisplaySize(TILE * 0.85, TILE * 0.85);
    return scene.add.text(x, y, d.emoji, { fontSize: '28px' }).setOrigin(0.5);
  });
}

// Shared grid-walker: bounds/wall checks, a tween glide matching the DOM
// version's feel, and a per-scene onStep callback for step-specific logic
// (door dialogue, battle triggers, screen transitions). Movement writes
// straight to state.pos[mapKey], the same shared/save-relevant position
// every scene and the save system read from.
export function createWalker(scene, { mapDef, posRef, sprite, offsetX, offsetY, onStep }) {
  const MOVE_MS = 120;
  const walker = { moving: false };

  walker.tryMove = (dx, dy) => {
    if (walker.moving) return;
    const nx = posRef.x + dx, ny = posRef.y + dy;
    if (nx < 0 || ny < 0 || nx >= mapDef.w || ny >= mapDef.h) return;
    if (mapDef.layout[ny][nx] === 1) return;

    posRef.x = nx; posRef.y = ny;
    walker.moving = true;
    scene.tweens.add({
      targets: sprite,
      x: offsetX + nx * TILE + TILE / 2,
      y: offsetY + ny * TILE + TILE / 2,
      duration: MOVE_MS,
      onComplete: () => { walker.moving = false; }
    });
    if (onStep) onStep(nx, ny);
  };

  return walker;
}
