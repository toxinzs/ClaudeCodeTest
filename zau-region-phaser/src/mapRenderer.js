import { TILE, GAME_W, GAME_H } from './config.js';

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
// version's feel, a small walk-bob so movement doesn't read as a sprite
// sliding on rails, and continuous movement while a direction is held
// (polled every frame) instead of one tile per keypress — the "arcade
// button-mashing" feel came from needing to tap once per tile. A per-scene
// onStep callback still handles step-specific logic (door dialogue, battle
// triggers, screen transitions). Movement writes straight to
// state.pos[mapKey], the same shared/save-relevant position every scene
// and the save system read from.
export function createWalker(scene, { mapDef, posRef, sprite, offsetX, offsetY, onStep }) {
  const MOVE_MS = 140;
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
    // A faked walk-cycle (squash on the down-step) — no sprite frames to
    // animate yet, but a static glyph gliding with zero body movement is
    // what makes it read as "sliding" rather than "walking".
    scene.tweens.add({
      targets: sprite, scaleY: 0.82, scaleX: 1.08,
      duration: MOVE_MS / 2, yoyo: true, ease: 'Sine.easeInOut'
    });
    if (onStep) onStep(nx, ny);
  };

  const cursors = scene.input.keyboard.createCursorKeys();
  const onUpdate = () => {
    if (walker.moving) return;
    if (cursors.up.isDown) walker.tryMove(0, -1);
    else if (cursors.down.isDown) walker.tryMove(0, 1);
    else if (cursors.left.isDown) walker.tryMove(-1, 0);
    else if (cursors.right.isDown) walker.tryMove(1, 0);
  };
  scene.events.on('update', onUpdate);
  scene.events.once('shutdown', () => scene.events.off('update', onUpdate));

  return walker;
}

// Zooms the camera in and follows the player so the map reads as a real
// place you're walking through rather than a fully-visible game-board —
// used on every outdoor/hub map (Town, Trail, League); Home stays
// unzoomed since a single small room fits the screen fine either way.
export function setupFollowCamera(scene, { mapDef, offsetX, offsetY, player, zoom = 1.7 }) {
  const contentW = mapDef.w * TILE + offsetX * 2;
  const contentH = mapDef.h * TILE + offsetY * 2;
  scene.cameras.main.setZoom(zoom);
  scene.cameras.main.setBounds(0, 0, contentW, contentH);
  scene.cameras.main.startFollow(player, true, 0.12, 0.12);
}

// A second, unzoomed camera for HUD elements (header text, toast, action
// bar) that must render at their literal screen coordinates regardless of
// the main camera's zoom/pan. setScrollFactor(0) alone only cancels pan,
// not zoom — under a zoomed main camera, HUD objects would still render
// scaled and shifted by that zoom, landing them at the wrong screen
// position (and wrong click position for buttons). Call this once at the
// end of create(), after every HUD object already exists.
export function setupHUD(scene, hudObjects) {
  scene.cameras.main.ignore(hudObjects);
  const hudCam = scene.cameras.add(0, 0, GAME_W, GAME_H);
  const worldObjects = scene.children.list.filter(o => !hudObjects.includes(o));
  hudCam.ignore(worldObjects);
  return hudCam;
}
