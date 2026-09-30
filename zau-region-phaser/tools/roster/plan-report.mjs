// Regenerates the tables in zau-region/ROSTER.md from PokeAPI data and plan-data.mjs.
//   node tools/roster/plan-report.mjs            -> the wave-1 tables (markdown)
//   node tools/roster/plan-report.mjs summary    -> totals, type and generation budgets
//   node tools/roster/plan-report.mjs summary all -> the same with wave 2 included
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S, byKey, membersOf, norm, method, typeStr } from './pokeapi-data.mjs';
import { ZONES, EXCLUDE } from './plan-data.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../src/data/');
const ours = new Set([...fs.readFileSync(DATA + 'baseStats.js', 'utf8').matchAll(/^\s{2}"?([^":\s]+)"?:\s*\{\s*hp:/gm)].map(m => norm(m[1])));
ours.delete('verdanyx');
const regional = new Set(EXCLUDE.regional);
const keep = s => !s.baby && !regional.has(s.key);   // babies: no breeding mechanic
const T = s => s.ident.split('-').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  .replace('Nidoran F', 'Nidoran♀').replace('Nidoran M', 'Nidoran♂').replace('Mr Mime', 'Mr. Mime').replace('Porygon Z', 'Porygon-Z');
const levelOf = id => { const x = /^Lv\.(\d+)/.exec(method(id)); return x ? +x[1] : Infinity; };
const mainPath = root => { const all = membersOf(root.chain).filter(keep); const p = []; let cur = all.find(s => !all.some(a => a.id === s.from)); while (cur) { p.push(cur); cur = all.find(s => s.from === cur.id); } return p; };
// "Enters as": the most evolved stage whose evolution level is <= the zone's lower band.
const entry = (b, lo) => { const p = mainPath(byKey[b]); let pick = p[0]; for (let i = 1; i < p.length; i++) { if (levelOf(p[i].id) <= lo) pick = p[i]; else break; } return T(pick); };
const chainNice = b => { const all = membersOf(byKey[b].chain).filter(keep); const kids = id => all.filter(s => s.from === id); const walk = s => { const k = kids(s.id); return k.length ? k.map(c => `${T(s)} →${method(c.id)} ${walk(c)}`).join(' ; ') : T(s); }; return walk(all.find(s => !all.some(a => a.id === s.from))); };

const mode = process.argv[2], wave = process.argv[3] === 'all' ? 'all' : 'w1';
const linesOf = z => wave === 'all' ? [...z.w1, ...z.w2] : z.w1;
const placed = new Map(); const special = {};
const classify = (s) => { const m = method(s.id); if (!m || S[s.from]?.baby) return; const cls = /^Lv\.\d+$/.test(m) ? null : /^Lv\./.test(m) ? 'conditional level (gender, time of day, place)' : m === 'trade' ? 'trade' : m === 'friendship' ? 'friendship' : /^hold /.test(m) ? 'held item' : m === 'knows a move' ? 'knows a move' : m === 'location' ? 'location' : m === 'special' ? 'special' : 'stone or item'; if (cls) (special[cls] ??= []).push(`${T(s)} (${m.replace('†', '')})`); };

const completions = [];
for (const ch of new Set([...ours].map(k => byKey[k]?.chain))) { const mem = membersOf(ch).filter(keep); const miss = mem.filter(m => !ours.has(m.key)); if (miss.length) { completions.push({ have: mem.filter(m => ours.has(m.key)), miss }); miss.forEach(m => { placed.set(m.key, 'completion'); classify(m); }); } }

const perZone = {}; 
for (const z of ZONES) { perZone[z.key] = []; for (const b of linesOf(z)) for (const m of membersOf(byKey[b].chain).filter(keep)) if (!ours.has(m.key) && !placed.has(m.key)) { placed.set(m.key, z.key); perZone[z.key].push(m); } }

if (mode === 'summary') {
  const nComp = completions.reduce((n, c) => n + c.miss.length, 0), nNew = placed.size - nComp;
  console.log(`existing ${ours.size} | completions ${nComp} | new-line species ${nNew} | TOTAL ${ours.size + placed.size}`);
  for (const z of ZONES) console.log(`  ${z.key.padEnd(10)} +${String(perZone[z.key].length).padStart(2)}`);
  const all = [...ours, ...placed.keys()], tally = {}, before = {}, gens = {};
  for (const k of ours) typeStr(byKey[k].id).split('/').forEach(x => before[x] = (before[x] || 0) + 1);
  for (const k of all) { typeStr(byKey[k].id).split('/').forEach(x => tally[x] = (tally[x] || 0) + 1); gens[byKey[k].gen] = (gens[byKey[k].gen] || 0) + 1; }
  console.log('TYPE (now -> planned):', Object.keys(tally).sort((a, b) => tally[b] - tally[a]).map(t => `${t} ${before[t] || 0}->${tally[t]}`).join(', '));
  console.log('GEN:', JSON.stringify(gens));
  process.exit(0);
}

const out = [];
out.push(`### A. Completions (${completions.reduce((n, c) => n + c.miss.length, 0)} species)\n\n| Line already in the game | Adds | How |\n|---|---|---|`);
for (const c of completions) out.push(`| ${c.have.map(T).join(' → ')} | ${c.miss.map(T).join(', ')} | ${c.miss.map(m => method(m.id)).join(', ')} |`);
out.push('\n### B. New lines by zone');
for (const z of ZONES) {
  const rows = z.w1.map(b => { const n = membersOf(byKey[b].chain).filter(m => keep(m) && placed.get(m.key) === z.key).length; return n ? `| ${chainNice(b)} | ${entry(b, z.band[0])} | ${n} |` : null; }).filter(Boolean);
  out.push(`\n#### ${z.name} (Lv.${z.band[0]}–${z.band[1]}): +${perZone[z.key].length}\n*${z.theme}*\n\n| Line († = also needs a time, gender or place) | Enters as | New |\n|---|---|---|\n${rows.join('\n')}`);
}
out.push('\n### C. Wave 2 candidate pool\n');
const w1placed = new Set(placed.keys());
for (const z of ZONES) { const pool = z.w2.filter(b => membersOf(byKey[b].chain).some(m => keep(m) && !ours.has(m.key) && !w1placed.has(m.key))).map(chainNice); if (pool.length) out.push(`- **${z.name}**: ${pool.join('; ')}`); }
out.push('\n### D. Evolutions that need a rule (completions and wave 1)\n');
for (const z of ZONES) for (const m of perZone[z.key]) classify(m);
for (const [k, v] of Object.entries(special).sort()) out.push(`- **${k}** (${[...new Set(v)].length}): ${[...new Set(v)].join(', ')}`);
console.log(out.join('\n'));
