// Prints ready-to-paste data lines for species, straight from PokeAPI's own
// CSV data, so stats/dex IDs/abilities/types are checked against the source
// instead of typed from memory (the Phase 28 cross-check found the
// from-memory data was exact, but a 300-species roster shouldn't rely on that).
//
//   node tools/pokeapi-species.mjs scatterbug spewpa arbok
//
// Output blocks map 1:1 onto src/data/baseStats.js, spriteIds.js and
// abilities.js. Abilities use the species' first non-hidden slot; `effect` is
// copied from any existing abilities.js entry with the same ability name, so
// mechanically wired abilities (Shed Skin, Levitate, Insomnia...) stay wired.
// Node >= 18 (global fetch). CSVs are cached in the OS temp dir.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const CACHE = path.join(os.tmpdir(), 'zau-pokeapi');
const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/');
fs.mkdirSync(CACHE, { recursive: true });

async function csv(name) {
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(BASE + name);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    fs.writeFileSync(file, await res.text());
  }
  return fs.readFileSync(file, 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
}
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const title = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

const wanted = process.argv.slice(2).map(norm);
if (!wanted.length) { console.error('usage: node tools/pokeapi-species.mjs <species> [...]'); process.exit(1); }

const [pokemon, stats, abilities, pAbilities, pTypes, types] = await Promise.all(
  ['pokemon.csv', 'pokemon_stats.csv', 'abilities.csv', 'pokemon_abilities.csv', 'pokemon_types.csv', 'types.csv'].map(csv));
const id = {}; for (const r of pokemon) if (r[7] === '1') id[norm(r[1])] = +r[0];
const abilityName = Object.fromEntries(abilities.map(r => [r[0], r[1]]));
const typeName = Object.fromEntries(types.map(r => [r[0], r[1]]));
const effectByName = {};
for (const m of fs.readFileSync(DATA + 'abilities.js', 'utf8').matchAll(/name: '([^']+)', effect: ('[^']+'|null)/g)) effectByName[m[1]] = m[2];

const out = { base: [], sprite: [], ability: [], info: [] };
for (const w of wanted) {
  const pid = id[w];
  if (!pid) { console.error(`unknown species: ${w}`); process.exit(1); }
  const s = Object.fromEntries(stats.filter(r => +r[0] === pid).map(r => [+r[1], +r[2]]));
  const first = pAbilities.filter(r => +r[0] === pid && r[2] === '0').sort((a, b) => a[3] - b[3])[0];
  const aName = title(abilityName[first[1]]);
  const t = pTypes.filter(r => +r[0] === pid).sort((a, b) => a[2] - b[2]).map(r => title(typeName[r[1]])).join('/');
  out.base.push(`  ${w}: { hp: ${s[1]}, atk: ${s[2]}, def: ${s[3]}, spAtk: ${s[4]}, spDef: ${s[5]}, spe: ${s[6]} },`);
  out.sprite.push(`  ${w}: ${pid},`);
  out.ability.push(`  ${w}: { name: '${aName}', effect: ${effectByName[aName] ?? 'null'} },`);
  out.info.push(`  ${w}: #${pid}, ${t}, ability ${aName}`);
}
console.log('// baseStats.js\n' + out.base.join('\n'));
console.log('// spriteIds.js\n' + out.sprite.join('\n'));
console.log('// abilities.js\n' + out.ability.join('\n'));
console.log('// info (dex id, type, ability)\n' + out.info.join('\n'));
