// Permanent roster consistency check — run before committing any roster change:
//
//   node tools/audit-roster.mjs            # offline, data-file consistency
//   node tools/audit-roster.mjs --pokeapi  # also verify base stats + dex IDs against PokeAPI's CSVs
//
// Exits non-zero on any ERROR. Every species the game can meet must have base
// stats, a dex ID, an ability and a display type; every zone entry must name a
// real species (zone tables are keyed by name, see data/pokemon.js); every
// evolution must point at a real species and a real item; every species must
// be obtainable somehow. The Phase 29 audit found ten uncatchable species and
// seven trainer-only ones by hand — this is that audit, kept.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { STARTER_CHAINS, WILD_SPECIES, WILD_ZONE_TABLE, WILD_ZONE_LEVELS, SPECIES_BY_NAME, ZONE_LABELS } from '../src/data/pokemon.js';
import { baseStatsFor } from '../src/data/baseStats.js';
import { SPRITE_IDS } from '../src/data/spriteIds.js';
import { abilityFor } from '../src/data/abilities.js';
import { allEvolutions } from '../src/data/evolutions.js';
import { megaFor } from '../src/data/megas.js';
import { ITEMS } from '../src/data/items.js';
import { TRAINERS } from '../src/data/trainers.js';
import { TRAINER_LINEUP, RIVAL_DARIO, LEAGUE_LEADERS, DIRECTOR_VANCE, VERDANYX } from '../src/data/story.js';
import { dexCatalogue } from '../src/dex.js';

const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);
const has = (fn, name) => { try { fn(name); return true; } catch { return false; } };

// ---- 1. every species the game can field has its full data ----
const known = new Set();            // lowercase names
const sources = {};                 // lowercase -> how the game can produce it
const addSource = (name, why) => { const k = name.toLowerCase(); known.add(k); (sources[k] ??= new Set()).add(why); };

const seenWild = new Set();
for (const sp of WILD_SPECIES) {
  if (seenWild.has(sp.name)) err(`WILD_SPECIES lists ${sp.name} twice`);
  seenWild.add(sp.name);
  known.add(sp.name.toLowerCase());
  if (!sp.moves?.length) err(`${sp.name}: no moves`);
  if (!Array.isArray(sp.baseLvl) || sp.baseLvl[0] > sp.baseLvl[1]) err(`${sp.name}: bad baseLvl`);
  if (!sp.type || !sp.emoji) err(`${sp.name}: missing type/emoji`);
}
for (const chain of Object.values(STARTER_CHAINS)) chain.stages.forEach((st, i) => addSource(st.name, i === 0 ? 'starter' : 'starter line'));

const teams = [
  ...TRAINER_LINEUP.map(t => [t.name, t.team]), [RIVAL_DARIO.name, RIVAL_DARIO.team],
  ...LEAGUE_LEADERS.map(l => [l.name, l.team]), [DIRECTOR_VANCE.name, DIRECTOR_VANCE.team], [VERDANYX.name, VERDANYX.team],
  ...Object.entries(TRAINERS).map(([k, t]) => [t.name || k, t.team])
];
const fielded = new Set();
for (const [who, team] of teams) for (const t of team) { known.add(t.speciesName.toLowerCase()); fielded.add(t.speciesName); }
for (const e of allEvolutions()) { known.add(e.from); known.add(e.evolvesTo.toLowerCase()); }
for (const k of ['absol', 'verdanyx']) known.add(k);

const needData = [...known].sort();
for (const k of needData) {
  if (!has(baseStatsFor, k)) err(`${k}: no base stats (data/baseStats.js)`);
  if (!has(abilityFor, k)) err(`${k}: no ability (data/abilities.js)`);
  if (k !== 'verdanyx' && !SPRITE_IDS[k]) err(`${k}: no dex ID (data/spriteIds.js)`);
}
for (const k of Object.keys(SPRITE_IDS)) if (!known.has(k)) warn(`${k}: has a dex ID but the game never references it`);

// ---- 2. dex IDs unique ----
const byId = {};
for (const [k, id] of Object.entries(SPRITE_IDS)) (byId[id] ??= []).push(k);
for (const [id, ks] of Object.entries(byId)) if (ks.length > 1) err(`dex ID ${id} shared by ${ks.join(', ')}`);

// ---- 3. zones ----
for (const [zone, names] of Object.entries(WILD_ZONE_TABLE)) {
  if (!names.length) err(`zone ${zone}: empty table`);
  if (!ZONE_LABELS[zone]) err(`zone ${zone}: no ZONE_LABELS entry`);
  for (const n of names) {
    if (!SPECIES_BY_NAME[n]) err(`zone ${zone}: "${n}" is not in WILD_SPECIES`);
    else addSource(n, `wild:${zone}`);
  }
}
for (const z of Object.keys(WILD_ZONE_LEVELS)) if (!WILD_ZONE_TABLE[z]) err(`WILD_ZONE_LEVELS has "${z}" but no such zone`);
for (const sp of WILD_SPECIES) {
  const evolvedInto = allEvolutions().some(e => e.evolvesTo === sp.name);
  if (!evolvedInto && !Object.values(WILD_ZONE_TABLE).some(t => t.includes(sp.name))) warn(`${sp.name}: in WILD_SPECIES but in no zone table (fixed encounters aside, it can't be met)`);
}

// ---- 4. evolutions ----
const hasEvoIn = new Set(), hasEvoOut = new Set();
for (const e of allEvolutions()) {
  hasEvoOut.add(e.from); hasEvoIn.add(e.evolvesTo.toLowerCase());
  addSource(e.evolvesTo, `evolves from ${e.from}`);
  if (e.method === 'level' && !(e.level > 0)) err(`${e.from}→${e.evolvesTo}: level evolution without a level`);
  if (e.method === 'item' && !ITEMS[e.item]) err(`${e.from}→${e.evolvesTo}: unknown item "${e.item}"`);
  if (!e.type || !e.emoji) err(`${e.from}→${e.evolvesTo}: missing type/emoji`);
}

// ---- 5. megas ----
for (const k of known) {
  const m = megaFor(k);
  if (!m) continue;
  if (!ITEMS[m.stone]) err(`${k}: Mega stone "${m.stone}" is not in items.js`);
  if (!m.spriteId) err(`${k}: Mega has no spriteId`);
}

// ---- 6. obtainability ----
// Met in the wild, a starter, a gift/fixed encounter, or reached by evolving.
const GIFTS = new Set(['absol', 'verdanyx']);
for (const k of known) {
  const src = sources[k] || new Set();
  const wild = WILD_SPECIES.some(s => s.name.toLowerCase() === k) && Object.values(WILD_ZONE_TABLE).some(t => t.some(n => n.toLowerCase() === k));
  if (!wild && !src.size && !GIFTS.has(k)) err(`${k}: cannot be obtained (no zone, starter, gift or evolution path)`);
}
const isolated = [...known].filter(k => !hasEvoIn.has(k) && !hasEvoOut.has(k) && !['verdanyx'].includes(k));
console.log(`species: ${known.size} known · ${dexCatalogue().length} in the Pokédex · ${WILD_SPECIES.length} wild-catalogue entries · ${Object.keys(WILD_ZONE_TABLE).length} zones`);
console.log(`fielded by trainers: ${fielded.size} · with a Mega: ${[...known].filter(k => megaFor(k)).length} · no evolution in or out: ${isolated.length}`);

// ---- 7. optional: verify against PokeAPI ----
if (process.argv.includes('--pokeapi')) {
  const BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
  const CACHE = path.join(os.tmpdir(), 'zau-pokeapi');
  fs.mkdirSync(CACHE, { recursive: true });
  const csv = async name => {
    const f = path.join(CACHE, name);
    if (!fs.existsSync(f)) { const r = await fetch(BASE + name); if (!r.ok) throw new Error(`${name}: ${r.status}`); fs.writeFileSync(f, await r.text()); }
    return fs.readFileSync(f, 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
  };
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const [pokemon, stats] = await Promise.all([csv('pokemon.csv'), csv('pokemon_stats.csv')]);
  const idOf = {}; for (const r of pokemon) if (r[7] === '1') idOf[norm(r[1])] = +r[0];
  const st = {}; for (const r of stats) (st[+r[0]] ??= {})[+r[1]] = +r[2];
  let checked = 0;
  for (const k of known) {
    if (k === 'verdanyx') continue;
    const id = idOf[norm(k)];
    if (!id) { err(`${k}: not found in PokeAPI`); continue; }
    if (SPRITE_IDS[k] !== id) err(`${k}: dex ID ${SPRITE_IDS[k]} ≠ PokeAPI ${id}`);
    const b = baseStatsFor(k), p = st[id];
    const want = { hp: p[1], atk: p[2], def: p[3], spAtk: p[4], spDef: p[5], spe: p[6] };
    for (const key of Object.keys(want)) if (b[key] !== want[key]) err(`${k}: ${key} ${b[key]} ≠ PokeAPI ${want[key]}`);
    checked++;
  }
  console.log(`PokeAPI cross-check: ${checked} species compared`);
}

for (const w of warns) console.log('WARN  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(errors.length ? `\n${errors.length} error(s)` : '\nroster audit: OK');
process.exit(errors.length ? 1 : 0);
