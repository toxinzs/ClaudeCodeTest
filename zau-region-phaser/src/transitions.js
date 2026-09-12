import Phaser from 'phaser';

const FADE_MS = 180;
const FADE_COLOR = [10, 14, 26]; // matches the canvas's own dark background, not pure black

// Every scene switch in the game goes through here instead of a bare
// this.scene.start() — a hard jump cut reads as broken in a real game.
// Pair with fadeIn(scene) at the top of the target scene's create().
// Overlay scenes (Phase 4) are launched on top of the calling scene and
// never pause it, so the player can step off a shop tile and walk straight
// into a wild battle with the Mart still open. An overlay belongs to the
// scene that launched it — close it with that scene.
const OVERLAY_SCENES = ['Party', 'Bag', 'Mart', 'Center', 'Dex', 'Dialogue'];

// Close every menu/shop overlay (not the dialogue box itself) — used by
// scene transitions and by the script runner, since a cutscene must not
// play out on top of an open Mart.
export function closeOverlays(scene, { keepDialogue = false } = {}) {
  OVERLAY_SCENES.forEach(k => {
    if (keepDialogue && k === 'Dialogue') return;
    if (scene.scene.isActive(k)) scene.scene.stop(k);
  });
}

export function goToScene(scene, key, data) {
  closeOverlays(scene);
  const cam = scene.cameras.main;
  cam.fadeOut(FADE_MS, ...FADE_COLOR);
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.scene.start(key, data);
  });
}

export function fadeIn(scene) {
  scene.cameras.main.fadeIn(FADE_MS, ...FADE_COLOR);
}
