import Phaser from 'phaser';
import { spriteUrlForId } from './sprites.js';

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

// A small mon icon for list rows (Party/Bag-target-picker/Pokédex) — starts
// as the emoji glyph, swaps to the real sprite if/when it loads.
export function addMonIcon(scene, x, y, display, size = 28) {
  const emojiText = scene.add.text(x, y, display.emoji, { fontSize: `${size}px` }).setOrigin(0.5);
  loadMonSprite(scene, display.sprite, (key) => {
    if (key) {
      scene.add.image(x, y, key).setOrigin(0.5).setDisplaySize(size, size);
      emojiText.destroy();
    }
  });
}

// A Pokémon standing on the map for a cutscene (the storm Absol, the Absol
// at the keycard door): emoji glyph immediately, real artwork when it
// loads. `hudCam` must be the scene's HUD camera when the object is
// created after setupHUD(), or the HUD camera draws it a second time.
export function addMonSpriteAt(scene, x, y, { id, emoji, size = 64, hudCam = null, depth = 40 }) {
  const holder = { obj: scene.add.text(x, y, emoji, { fontSize: `${Math.round(size * 0.55)}px` }).setOrigin(0.5).setDepth(depth) };
  if (hudCam) hudCam.ignore(holder.obj);
  loadMonSprite(scene, spriteUrlForId(id), (key) => {
    if (!key || !holder.obj?.active) return;
    const img = scene.add.image(x, y, key).setOrigin(0.5).setDisplaySize(size, size).setDepth(depth).setAlpha(holder.obj.alpha);
    if (hudCam) hudCam.ignore(img);
    holder.obj.destroy();
    holder.obj = img;
  });
  return holder;
}
