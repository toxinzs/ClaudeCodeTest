import { GAME_W } from './config.js';

// Slide-in banners — "HARBOR DISTRICT" on map entry, "wants to battle!",
// "MEGA EVOLUTION", "Badge earned!". A dark strip with a text slides in
// from the right, holds, and slides back out. Returns the objects so a
// map scene can hand them to setupHUD (they must render on the HUD
// camera, unzoomed) — battle scenes have a single camera and can ignore
// the return value.
export function showBanner(scene, text, { y = 56, hold = 1100, color = '#e8e8f0', accent = 0x3a3d5c, size = 16 } = {}) {
  const w = Math.min(GAME_W - 40, text.length * (size * 0.62) + 60);
  const startX = GAME_W + w / 2 + 10;
  const bg = scene.add.rectangle(startX, y, w, size + 22, 0x0d0f18, 0.94).setStrokeStyle(2, accent).setDepth(200);
  const stripe = scene.add.rectangle(startX - w / 2 + 3, y, 4, size + 22, accent).setDepth(201);
  const label = scene.add.text(startX, y, text, { fontFamily: 'Nunito, sans-serif', fontSize: `${size}px`, fontStyle: 'bold', color, letterSpacing: 2 }).setOrigin(0.5).setDepth(202);
  const objects = [bg, stripe, label];
  const dx = -(GAME_W / 2 + w / 2 + 10); // land centred
  scene.tweens.add({ targets: objects, x: `+=${dx}`, duration: 320, ease: 'Cubic.easeOut' });
  scene.time.delayedCall(320 + hold, () => {
    if (!bg.active) return;
    scene.tweens.add({ targets: objects, x: `-=${GAME_W + w}`, duration: 320, ease: 'Cubic.easeIn', onComplete: () => objects.forEach(o => o.destroy()) });
  });
  (window.__zauAnims ??= []).push(`banner:${text}`);
  return { objects };
}
