// Self-hosted web fonts (public/fonts/, SIL Open Font License 1.1 — see
// public/fonts/OFL-*.txt and the in-game Credits screen).
//
// Loaded through the FontFace API rather than a <link>/@font-face so the URLs
// stay relative to the page like every other asset (the game deploys under a
// Pages subpath), and so BootScene can await them before any scene draws text:
// Phaser measures a Text object once at creation, so a font arriving later
// would leave already-drawn text in the fallback face.

const FACES = [
  ['Silkscreen', 'fonts/Silkscreen-400.woff2', { weight: '400' }],
  ['Silkscreen', 'fonts/Silkscreen-700.woff2', { weight: '700' }],
  ['Nunito', 'fonts/Nunito-var.woff2', { weight: '400 700' }],
];

export const BODY_FONT = 'Nunito, sans-serif';
export const DISPLAY_FONT = 'Silkscreen, sans-serif';

let promise = null;

/** Resolves once every face has loaded (or failed — never rejects, never hangs past `timeoutMs`). */
export function loadFonts(timeoutMs = 3000) {
  if (promise) return promise;
  if (typeof FontFace === 'undefined' || !document.fonts) return (promise = Promise.resolve(false));
  const loads = FACES.map(([family, url, desc]) => {
    const face = new FontFace(family, `url(${url})`, desc);
    document.fonts.add(face);
    return face.load().then(() => true, () => false);
  });
  const timeout = new Promise((r) => setTimeout(() => r(false), timeoutMs));
  promise = Promise.race([Promise.all(loads).then((ok) => ok.every(Boolean)), timeout]);
  return promise;
}
