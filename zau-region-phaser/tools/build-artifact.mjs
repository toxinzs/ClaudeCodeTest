// Packs the production build for a hosted single-page viewer (a claude.ai
// artifact), where only one HTML page plus files published beside it exist.
//
//   npm run build && node tools/build-artifact.mjs <outDir>
//
// Writes <outDir>/play.html (the page FRAGMENT to publish: title, style,
// #game-root and the whole game bundle inlined), <outDir>/test.html (the same
// wrapped in a full document, for checking locally over http), and copies
// dist/{tiles,character,fonts} beside them. The game's own asset URLs are
// relative, so published beside the page they resolve unchanged.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const out = process.argv[2];
if (!out) { console.error('usage: node tools/build-artifact.mjs <outDir>'); process.exit(1); }
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const bundle = /src="\.?\/?(assets\/[^"]+\.js)"/.exec(html)?.[1];
if (!bundle) throw new Error('no bundle script found in dist/index.html');
// `</script` inside the JS would end the inline tag early.
const js = fs.readFileSync(path.join(dist, bundle), 'utf8').replace(/<\/script/gi, '<\\/script');

const fragment = `<title>Zau Storme</title>
<style>
  html, body { height: 100%; margin: 0; padding: 0; background: #0a0e1a; color-scheme: dark; }
  body { overflow: hidden; }
  #game-root { display: flex; justify-content: center; align-items: center; height: 100%; }
</style>
<div id="game-root"></div>
<script type="module">
${js}
</script>
`;
fs.writeFileSync(path.join(out, 'play.html'), fragment);
fs.writeFileSync(path.join(out, 'test.html'), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${fragment}</body></html>`);

const copy = (src, dst) => {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copy(s, d) : fs.copyFileSync(s, d);
  }
};
for (const dir of ['tiles', 'character', 'fonts']) copy(path.join(dist, dir), path.join(out, dir));

const files = [];
const walk = (d, rel = '') => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const r = rel ? `${rel}/${e.name}` : e.name; e.isDirectory() ? walk(path.join(d, e.name), r) : files.push(r); } };
walk(out);
console.log(`play.html ${(fs.statSync(path.join(out, 'play.html')).size / 1024).toFixed(0)} KB, ${files.length} files total`);
