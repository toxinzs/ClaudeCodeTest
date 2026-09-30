// Generates src/data/rosterGenerated.js — the roster expansion (ROSTER.md) —
// from PokeAPI's CSVs and the plan in plan-data.mjs. Deterministic and
// idempotent: it rebuilds the whole file from the hand-written 145-species
// baseline plus every batch listed in BUILT, so there is nothing to merge.
//
//   node tools/roster/build.mjs            # regenerate, then run tools/roster/gen-learnsets.mjs
//
// Real data only: base stats, dex IDs, types, first non-hidden ability, and
// real level thresholds come from PokeAPI. Evolution conditions the game has
// no mechanic for follow ROSTER.md section 6 (trade -> Linking Cord,
// friendship / knows-a-move -> a flat level, Eevee's extra forms -> stones).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S, byKey, membersOf, norm, method, typeStr, csv } from './pokeapi-data.mjs';
import { ZONES, EXCLUDE, BUILT, ZONE_TABLES, SHIPPED_BANDS } from './plan-data.mjs';

// false: spawn at the levels each zone really runs at today; true: the bible's target bands.
const USE_PLAN_BANDS = false;
const bandOf = z => (USE_PLAN_BANDS ? z.band : SHIPPED_BANDS[z.key] || z.band);

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../src/data/');
const read = f => fs.readFileSync(DATA + f, 'utf8');

// ---- baseline: the hand-written species (never regenerated) ----
const ours = new Set([...read('baseStats.js').matchAll(/^\s{2}"?([^":\s]+)"?:\s*\{\s*hp:/gm)].map(m => norm(m[1])));
ours.delete('verdanyx');
const regional = new Set(EXCLUDE.regional);
const keep = s => !s.baby && !regional.has(s.key);

const DISPLAY = { 'nidoran-f': 'Nidoran♀', 'nidoran-m': 'Nidoran♂', 'mr-mime': 'Mr. Mime', 'mime-jr': 'Mime Jr.', 'porygon-z': 'Porygon-Z', farfetchd: "Farfetch'd", 'ho-oh': 'Ho-Oh', 'jangmo-o': 'Jangmo-o', 'hakamo-o': 'Hakamo-o', 'kommo-o': 'Kommo-o', 'type-null': 'Type: Null', flabebe: 'Flabébé' };
const title = s => s.split('-').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const nameOf = s => DISPLAY[s.ident] || title(s.ident);

// ---- which species each BUILT batch adds ----
const levelOf = id => { const x = /^Lv\.(\d+)/.exec(method(id)); return x ? +x[1] : Infinity; };
const mainPath = root => { const all = membersOf(root.chain).filter(keep); const p = []; let cur = all.find(s => !all.some(a => a.id === s.from)); while (cur) { p.push(cur); cur = all.find(s => s.from === cur.id); } return p; };

const placed = new Map();   // key -> batch
const batches = {};         // batch -> [species]
const completions = [];
for (const ch of new Set([...ours].map(k => byKey[k]?.chain))) {
  for (const m of membersOf(ch).filter(keep)) if (!ours.has(m.key) && !placed.has(m.key)) { placed.set(m.key, 'completions'); completions.push(m); }
}
batches.completions = completions;
for (const z of ZONES) {
  batches[z.key] = [];
  for (const b of z.w1) for (const m of membersOf(byKey[b].chain).filter(keep)) if (!ours.has(m.key) && !placed.has(m.key)) { placed.set(m.key, z.key); batches[z.key].push(m); }
}
const built = BUILT.flatMap(b => { if (!batches[b]) throw new Error(`unknown batch "${b}"`); return batches[b].map(s => ({ s, batch: b })); });
const inGame = new Set([...ours, ...built.map(x => x.s.key)]);

// ---- PokeAPI details ----
const [pokemon, stats, abilities, pAbilities] = await Promise.all(['pokemon.csv', 'pokemon_stats.csv', 'abilities.csv', 'pokemon_abilities.csv'].map(csv));
const pidOfSpecies = {}; for (const r of pokemon) if (r[7] === '1') pidOfSpecies[+r[2]] = +r[0];   // default-form pokemon row (Oinkologne's is 'oinkologne-male')
const abilityName = Object.fromEntries(abilities.map(r => [r[0], r[1]]));
const effectByName = {};
for (const m of read('abilities.js').matchAll(/name: '([^']+)', effect: ('[^']+'|null)/g)) effectByName[m[1]] = m[2];
for (const m of read('abilities.js').matchAll(/name: '([^']+)', effect: ('[^']+'), boostType: '([^']+)'/g)) effectByName[m[1]] = `${m[2]}, boostType: '${m[3]}'`;

const TYPE_EMOJI = { Normal: '🐾', Fire: '🔥', Water: '💧', Grass: '🌿', Electric: '⚡', Ice: '❄️', Fighting: '🥊', Poison: '☠️', Ground: '⛰️', Flying: '🪶', Psychic: '🔮', Bug: '🐛', Rock: '🪨', Ghost: '👻', Dragon: '🐉', Dark: '🌑', Steel: '⚙️', Fairy: '✨' };
const emojiOf = t => TYPE_EMOJI[t.split('/')[0]] || '🐾';

// ---- evolution rules (ROSTER.md section 6) ----
const ITEM_KEY = { 'Fire Stone': 'firestone', 'Water Stone': 'waterstone', 'Thunder Stone': 'thunderstone', 'Leaf Stone': 'leafstone', 'Sun Stone': 'sunstone', 'Moon Stone': 'moonstone', 'Dusk Stone': 'duskstone', 'Shiny Stone': 'shinystone', 'Dawn Stone': 'dawnstone', 'Ice Stone': 'icestone' };
const FRIENDSHIP_LEVEL = { crobat: 36, lopunny: 30 };
const KNOWS_MOVE_LEVEL = { mamoswine: 44, tsareena: 28 };
const FORCED = { espeon: 'sunstone', umbreon: 'duskstone', sylveon: 'shinystone', weavile: 'duskstone' };
function ruleFor(to) {
  const m = method(to.id);
  if (FORCED[to.key]) return { method: 'item', item: FORCED[to.key] };
  let x;
  if ((x = /^Lv\.(\d+)/.exec(m))) return { method: 'level', level: +x[1] };
  if (m === 'trade') return { method: 'item', item: 'linkingcord' };
  if (m === 'friendship') { const l = FRIENDSHIP_LEVEL[to.key]; if (!l) throw new Error(`friendship evolution for ${to.key} needs a level in FRIENDSHIP_LEVEL`); return { method: 'level', level: l }; }
  if (m === 'knows a move') { const l = KNOWS_MOVE_LEVEL[to.key]; if (!l) throw new Error(`knows-a-move evolution for ${to.key} needs a level in KNOWS_MOVE_LEVEL`); return { method: 'level', level: l }; }
  if (ITEM_KEY[m]) return { method: 'item', item: ITEM_KEY[m] };
  throw new Error(`no evolution rule for ${to.key}: "${m}"`);
}

// ---- emit species data ----
const G = { stats: {}, sprite: {}, ability: {}, evo: {}, species: [], zones: {} };
const typeOf = {};
for (const { s } of built) {
  const id = pidOfSpecies[s.id];
  if (!id) throw new Error(`not in PokeAPI: ${s.ident}`);
  if (id !== s.id) console.log(`note: ${s.ident} default form is pokemon #${id} (species #${s.id})`);
  const key = nameOf(s).toLowerCase();
  const st = Object.fromEntries(stats.filter(r => +r[0] === id).map(r => [+r[1], +r[2]]));
  const first = pAbilities.filter(r => +r[0] === id && r[2] === '0').sort((a, b) => a[3] - b[3])[0];
  const aName = title(abilityName[first[1]]);
  G.stats[key] = `{ hp: ${st[1]}, atk: ${st[2]}, def: ${st[3]}, spAtk: ${st[4]}, spDef: ${st[5]}, spe: ${st[6]} }`;
  G.sprite[key] = id;
  G.ability[key] = `{ name: '${aName}', effect: ${effectByName[aName] ?? 'null'} }`;
  typeOf[s.key] = typeStr(s.id);
}
// evolutions: any in-game species whose pre-evolution is in game
for (const { s: to } of built) {
  const from = S[to.from];
  if (!from || !inGame.has(from.key)) continue;
  const r = ruleFor(to);
  const e = { evolvesTo: nameOf(to), type: typeOf[to.key], emoji: emojiOf(typeOf[to.key]), ...r };
  (G.evo[nameOf(from).toLowerCase()] ??= []).push(e);
}
// A species already in the game can also gain a NEW evolution from a built species' chain (e.g. Kirlia -> Gallade).
// Covered above: `to` is new and `from` may be a baseline species.

// ---- wild spawns: each zone batch's lines, at the stage the zone's level band calls for ----
const zoneRows = {};
const windowFor = (band, i, n, minLvl, nextLvl) => {
  const [zlo, zhi] = band;
  const staggered = n > 1 ? zlo + Math.round(i * Math.max(0, zhi - zlo - 4) / (n - 1)) : zlo;
  let lo = Math.min(Math.max(staggered, minLvl), zhi - 2); if (lo < zlo) lo = zlo;
  let hi = Math.min(zhi, lo + 5);
  // A stage that evolves at level L never spawns at or above L.
  if (nextLvl !== Infinity) { hi = Math.min(hi, nextLvl - 1); lo = Math.min(lo, hi); if (hi - lo < 2) lo = Math.max(zlo, hi - 3); }
  return [lo, Math.max(lo, hi)];
};
for (const z of ZONES) {
  if (!BUILT.includes(z.key)) continue;
  const lines = z.w1.map(b => mainPath(byKey[b])).filter(p => p.some(sp => placed.get(sp.key) === z.key));
  const n = lines.length;
  lines.forEach((p, i) => {
    const band = bandOf(z);
    let pick = 0; for (let k = 1; k < p.length; k++) { if (levelOf(p[k].id) <= band[0]) pick = k; else break; }
    const rows = [];
    // the entry stage spawns normally; any earlier stages spawn rarely so every stage stays obtainable
    const minLvl = pick > 0 ? levelOf(p[pick].id) : 1;
    const next = p[pick + 1] ? levelOf(p[pick + 1].id) : Infinity;
    rows.push({ s: p[pick], band: windowFor(band, i, n, minLvl, next), copies: 2 });
    for (let k = 0; k < pick; k++) rows.push({ s: p[k], band: [band[0], Math.min(band[1], band[0] + 5)], copies: 1, early: true });
    for (const r of rows) {
      if (!inGame.has(r.s.key)) continue;
      const t = typeOf[r.s.key] ?? typeStr(r.s.id);
      (zoneRows[z.key] ??= []).push({ name: nameOf(r.s), type: t, band: r.band, copies: r.copies, key: r.s.key });
    }
  });
}
const speciesSeen = new Set();
for (const z of ZONES) for (const r of zoneRows[z.key] || []) {
  if (!speciesSeen.has(r.name)) { speciesSeen.add(r.name); G.species.push({ name: r.name, emoji: emojiOf(r.type), type: r.type, baseLvl: r.band }); }
  for (const tk of ZONE_TABLES[z.key] || [z.key]) {
    if (tk.filter && !tk.types.some(t => r.type.split('/').includes(t))) continue;
    (G.zones[tk.zone || tk] ??= []);
    const zk = tk.zone || tk;
    for (let c = 0; c < r.copies; c++) G.zones[zk].push(r.name);
  }
}

const q = JSON.stringify;
const out = `// GENERATED by tools/roster/build.mjs from PokeAPI — do not edit by hand.
// The roster expansion (zau-region/ROSTER.md): real base stats, dex IDs and
// abilities, evolutions under ROSTER.md section 6's rules, and the wild
// catalogue entries and zone-table additions that place them. Merged into
// the hand-written data by baseStats.js / spriteIds.js / abilities.js /
// evolutions.js / pokemon.js. Batches built so far: ${BUILT.join(', ') || '(none)'}.

export const GEN_BASE_STATS = {
${Object.entries(G.stats).map(([k, v]) => `  ${q(k)}: ${v}`).join(',\n')}
};

export const GEN_SPRITE_IDS = {
${Object.entries(G.sprite).map(([k, v]) => `  ${q(k)}: ${v}`).join(',\n')}
};

export const GEN_ABILITIES = {
${Object.entries(G.ability).map(([k, v]) => `  ${q(k)}: ${v}`).join(',\n')}
};

// Keyed by the species that evolves; an array because some evolve several ways
// (merged with data/evolutions.js's hand-written entries for the same species).
export const GEN_EVOLUTIONS = {
${Object.entries(G.evo).map(([k, v]) => `  ${q(k)}: ${JSON.stringify(v)}`).join(',\n')}
};

// Wild catalogue entries (moves come from data/learnsets.js).
export const GEN_SPECIES = [
${G.species.map(sp => `  ${JSON.stringify(sp)}`).join(',\n')}
];

// Appended to the hand-written WILD_ZONE_TABLE in data/pokemon.js; a name listed twice is twice as common.
export const GEN_ZONE_TABLE = {
${Object.entries(G.zones).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`).join(',\n')}
};
`;
fs.writeFileSync(DATA + 'rosterGenerated.js', out);
const tally = Object.fromEntries(Object.entries(batches).map(([k, v]) => [k, v.length]));
console.log(`built batches: ${BUILT.join(', ') || '(none)'} -> ${built.length} species (${G.species.length} wild entries, ${Object.keys(G.evo).length} evolving lines)`);
console.log('batch sizes:', JSON.stringify(tally));
