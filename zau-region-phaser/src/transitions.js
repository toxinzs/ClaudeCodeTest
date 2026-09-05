import Phaser from 'phaser';

const FADE_MS = 180;
const FADE_COLOR = [10, 14, 26]; // matches the canvas's own dark background, not pure black

// Every scene switch in the game goes through here instead of a bare
// this.scene.start() — a hard jump cut reads as broken in a real game.
// Pair with fadeIn(scene) at the top of the target scene's create().
export function goToScene(scene, key, data) {
  const cam = scene.cameras.main;
  cam.fadeOut(FADE_MS, ...FADE_COLOR);
  cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.scene.start(key, data);
  });
}

export function fadeIn(scene) {
  scene.cameras.main.fadeIn(FADE_MS, ...FADE_COLOR);
}
