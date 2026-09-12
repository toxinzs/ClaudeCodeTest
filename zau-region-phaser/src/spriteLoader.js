import { spriteUrlForId } from './sprites.js';

// Phaser rewrite of the DOM version's monSpriteHtml: same behavior (show the
// real PokeAPI artwork when it loads, fall back to the emoji glyph when
// there's no sprite URL or the load fails), different mechanism (runtime
// texture load instead of an <img onerror>).
// In-flight loads keyed by texture key, so two callers racing on the same
// species (BattleScene's MonCard re-renders on every 'render' event, which
// fires many times per turn) share one Image/one addImage call instead of
// each starting a parallel fetch. Two addImage() calls for the same key
// is the real bug this fixes: Phaser's TextureManager removes and rebuilds
// the texture on the second call, and a GameObject already displaying the
// first one is left holding a Frame whose internals just got nulled out —
// the next size/UV recompute (Frame.setSize -> ... -> updateUVs) then
// reads a null `.data` and throws. One load per key removes the race.
const inFlight = new Map();

export function loadMonSprite(scene, url, applyFn) {
  if (!url) { applyFn(null); return; }
  const key = 'mon-' + url.replace(/[^a-zA-Z0-9]/g, '');
  if (scene.textures.exists(key)) { applyFn(key); return; }

  let entry = inFlight.get(key);
  if (!entry) {
    entry = { waiters: [] };
    inFlight.set(key, entry);

    // Fetched through a plain Image rather than Phaser's loader on purpose.
    // This environment's egress to the sprite CDN resets often, and a
    // truncated response can still fire onload with a zero-size image —
    // handing that to Phaser throws inside Frame.updateUVs (a null canvas
    // in drawImage). Checking naturalWidth first, and adding the texture
    // ourselves, keeps a bad sprite as a silent fall back to the emoji
    // glyph instead of a page error.
    let settled = false;
    const settle = (result) => {
      if (settled) return;
      settled = true;
      inFlight.delete(key);
      entry.waiters.forEach((fn) => fn(result));
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) { settle(null); return; }
      try {
        if (!scene.textures.exists(key)) scene.textures.addImage(key, img);
        settle(scene.textures.exists(key) ? key : null);
      } catch { settle(null); }
    };
    img.onerror = () => settle(null);
    img.src = url;
    // Watchdog: a stalled request must not leave a cutscene waiting forever.
    setTimeout(() => settle(null), 4000);
  }
  entry.waiters.push(applyFn);
}

// A small mon icon for list rows (Party/Bag-target-picker/Pokédex) — starts
// as the emoji glyph, swaps to the real sprite if/when it loads.
export function addMonIcon(scene, x, y, display, size = 28) {
  const emojiText = scene.add.text(x, y, display.emoji, { fontSize: `${size}px` }).setOrigin(0.5);
  loadMonSprite(scene, display.sprite, (key) => {
    // The overlay this icon belongs to (Party/Bag/Dex) can be closed
    // before a slow sprite fetch resolves.
    if (key && emojiText.active) {
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
  if (!id) return holder; // custom species (Verdanyx) — no artwork exists
  loadMonSprite(scene, spriteUrlForId(id), (key) => {
    if (!key || !holder.obj?.active) return;
    const img = scene.add.image(x, y, key).setOrigin(0.5).setDisplaySize(size, size).setDepth(depth).setAlpha(holder.obj.alpha);
    if (hudCam) hudCam.ignore(img);
    holder.obj.destroy();
    holder.obj = img;
  });
  return holder;
}
