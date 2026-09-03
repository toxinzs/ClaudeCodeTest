import Phaser from 'phaser';

// Phaser rewrite of the DOM version's monSpriteHtml: same behavior (show the
// real PokeAPI artwork when it loads, fall back to the emoji glyph when
// there's no sprite URL or the load fails), different mechanism (runtime
// texture load instead of an <img onerror>).
export function loadMonSprite(scene, url, applyFn) {
  if (!url) { applyFn(null); return; }
  const key = 'mon-' + url.replace(/[^a-zA-Z0-9]/g, '');
  if (scene.textures.exists(key)) { applyFn(key); return; }
  scene.load.image(key, url);
  scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
    applyFn(scene.textures.exists(key) ? key : null);
  });
  scene.load.start();
}
