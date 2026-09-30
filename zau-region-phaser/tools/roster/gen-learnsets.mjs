// Generates src/data/learnsets.js and src/data/movesGenerated.js from PokeAPI.
//
//   node tools/roster/gen-learnsets.mjs
//
// Every non-starter species in data/baseStats.js gets its real level-up learnset
// (Scarlet/Violet's where the species exists there, else the newest older game),
// restricted to moves the battle engine can actually model:
//   - damaging moves with a fixed base power, and
//   - status moves that inflict burn / poison / paralysis / sleep
// Pure stat-change moves (Growl, Swords Dance), weather, protection, and the
// self-faint / recharge / two-turn moves are left out rather than registered as
// something they are not (the engine resolves a move in one turn, with no
// recharge, no invulnerable turn, no accuracy and no priority).
// Moves already hand-registered in data/moves.js keep their entries; only the
// missing ones are generated. Re-run after adding species.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { csv, norm } from './pokeapi-data.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../src/data/');
const title = s => s.split('-').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

const KEEP_HYPHEN = {
  'u-turn': 'U-turn', 'double-edge': 'Double-Edge', 'x-scissor': 'X-Scissor', 'mud-slap': 'Mud-Slap',
  'wake-up-slap': 'Wake-Up Slap', 'freeze-dry': 'Freeze-Dry', 'v-create': 'V-create', 'power-up-punch': 'Power-Up Punch',
  'self-destruct': 'Self-Destruct', 'will-o-wisp': 'Will-O-Wisp', 'lock-on': 'Lock-On', 'trick-or-treat': 'Trick-or-Treat',
  'baby-doll-eyes': 'Baby-Doll Eyes', 'topsy-turvy': 'Topsy-Turvy', 'king-s-shield': "King's Shield"
};
const moveName = ident => KEEP_HYPHEN[ident] || title(ident);

// Moves whose defining behaviour the engine does not model; registering them as
// plain one-turn damage would make them strictly better than they are.
const EXCLUDE = new Set([
  'explosion', 'self-destruct', 'misty-explosion', 'final-gambit', 'memento',
  'future-sight', 'doom-desire', 'hyper-beam', 'giga-impact', 'blast-burn', 'hydro-cannon', 'frenzy-plant', 'roar-of-time', 'rock-wrecker', 'prismatic-laser', 'eternabeam', 'meteor-assault',
  'solar-beam', 'solar-blade', 'fly', 'dig', 'dive', 'bounce', 'skull-bash', 'sky-attack', 'razor-wind', 'phantom-force', 'shadow-force', 'freeze-shock', 'ice-burn', 'geomancy', 'meteor-beam', 'sky-drop', 'electro-shot',
  'focus-punch', 'dream-eater', 'last-resort', 'belch', 'counter', 'mirror-coat', 'metal-burst', 'endeavor', 'natural-gift', 'fling', 'mind-blown', 'chloroblast', 'shell-trap', 'beak-blast',
  'struggle', 'splash', 'present', 'magnitude', 'hidden-power', 'return', 'frustration', 'judgment', 'techno-blast', 'multi-attack'
]);
const STATUS_OF = { 1: 'paralyze', 2: 'sleep', 4: 'burn', 5: 'poison' };
const TYPE = { 1: 'Normal', 2: 'Fighting', 3: 'Flying', 4: 'Poison', 5: 'Ground', 6: 'Rock', 7: 'Bug', 8: 'Ghost', 9: 'Steel', 10: 'Fire', 11: 'Water', 12: 'Grass', 13: 'Electric', 14: 'Psychic', 15: 'Ice', 16: 'Dragon', 17: 'Dark', 18: 'Fairy' };
const CLASS = { 1: 'Status', 2: 'Physical', 3: 'Special' };

const [pokemon, moves, meta, pm] = await Promise.all(['pokemon.csv', 'moves.csv', 'move_meta.csv', 'pokemon_moves.csv'].map(csv));
const idOf = {}; for (const r of pokemon) if (r[7] === '1') idOf[norm(r[1])] = +r[0];
const metaOf = {}; for (const r of meta) metaOf[+r[0]] = { ailment: +r[2], chance: +r[10] || 0 };

// usable moves: id -> registry entry
const usable = {};
for (const r of moves) {
  const [id, ident, gen, typeId, power, , , , , cls] = r;
  if (EXCLUDE.has(ident) || +gen > 9) continue;
  const m = metaOf[+id] || { ailment: 0, chance: 0 };
  const status = STATUS_OF[m.ailment];
  if (+cls === 1) {
    if (!status) continue;              // pure stat / field / protection moves: not modelled
    usable[+id] = { name: moveName(ident), type: TYPE[typeId], power: 0, category: 'Status', status };
  } else {
    if (!power) continue;               // variable / fixed-damage / OHKO
    const e = { name: moveName(ident), type: TYPE[typeId], power: +power, category: CLASS[cls] };
    if (status && m.chance) { e.status = status; e.statusChance = m.chance / 100; }
    usable[+id] = e;
  }
}

// learnsets: group rows by species, pick the newest usable version group
const SKIP_GROUPS = new Set([24, 30, 31, 32]); // Legends: Arceus (different level scheme), Z-A, Mega Dimension, Champions: incomplete
const rows = {};
for (const r of pm) if (r[3] === '1') (rows[+r[0]] ??= []).push([+r[1], +r[2], +r[4], +r[5]]);

const baseSrc = fs.readFileSync(DATA + 'baseStats.js', 'utf8');
const species = [...baseSrc.matchAll(/^\s{2}"?([^":\s]+)"?:\s*\{\s*hp:/gm)].map(m => m[1]);
const starters = new Set(['sprigatito', 'floragato', 'meowscarada', 'fuecoco', 'crocalor', 'skeledirge', 'quaxly', 'quaxwell', 'quaquaval', 'verdanyx']);

const learnsets = {}; const needed = {};
let noData = [];
for (const sp of species) {
  if (starters.has(sp)) continue;
  const pid = idOf[norm(sp)];
  if (!pid || !rows[pid]) { noData.push(sp); continue; }
  const groups = [...new Set(rows[pid].map(x => x[0]))].filter(g => !SKIP_GROUPS.has(g)).sort((a, b) => b - a);
  const g = groups[0];
  const list = rows[pid].filter(x => x[0] === g && usable[x[1]]).sort((a, b) => a[2] - b[2] || a[3] - b[3]);
  const seen = new Set(), out = [];
  for (const [, mid, lvl] of list) { if (seen.has(mid)) continue; seen.add(mid); out.push([Math.max(1, lvl), usable[mid].name]); needed[usable[mid].name.toLowerCase()] = usable[mid]; }
  learnsets[sp] = out;
}

// which moves are already hand-registered?
const movesSrc = fs.readFileSync(DATA + 'moves.js', 'utf8');
const hand = new Set([...movesSrc.matchAll(/^\s{2}(?:"([^"]+)"|([a-z]+)):\s*\{\s*type:/gm)].map(m => (m[1] || m[2]).toLowerCase()));
const generated = Object.entries(needed).filter(([k]) => !hand.has(k)).sort(([a], [b]) => a.localeCompare(b));

const fmtMove = e => `{ type: "${e.type}", power: ${e.power}, category: "${e.category}"${e.status ? `, status: "${e.status}"${e.statusChance ? `, statusChance: ${e.statusChance}` : ''}` : ''} }`;
fs.writeFileSync(DATA + 'movesGenerated.js',
`// GENERATED by tools/roster/gen-learnsets.mjs from PokeAPI — do not edit by hand.
// Real type/power/category (and burn/poison/paralysis/sleep effects) for every
// learnset move that data/moves.js does not already register by hand.
// Hand-registered entries in moves.js take precedence over these.
export const GENERATED_MOVES = {
${generated.map(([k, e]) => `  ${JSON.stringify(k)}: ${fmtMove(e)}`).join(',\n')}
};
`);

const lines = Object.entries(learnsets).sort(([a], [b]) => a.localeCompare(b))
  .map(([sp, ls]) => `  ${JSON.stringify(sp)}: ${JSON.stringify(ls).replace(/\],\[/g, '],[')}`);
fs.writeFileSync(DATA + 'learnsets.js',
`// GENERATED by tools/roster/gen-learnsets.mjs from PokeAPI — do not edit by hand.
// Real level-up learnsets (Scarlet/Violet where the species exists there),
// limited to moves the battle engine models: damaging moves with a fixed base
// power, and moves that inflict burn, poison, paralysis or sleep.
// Entry: [level, move name]. Starters keep their hand-authored learnsets in
// data/pokemon.js.
const LEARNSETS = {
${lines.join(',\n')}
};

export function learnsetFor(speciesName) {
  return LEARNSETS[speciesName.toLowerCase()] || null;
}

// The up-to-four most recently learned moves at a level — how a wild
// Pokémon of that level is armed.
export function movesAtLevel(speciesName, level) {
  const ls = learnsetFor(speciesName);
  if (!ls) return [];
  const names = [];
  for (const [lvl, name] of ls) if (lvl <= level && !names.includes(name)) names.push(name);
  return names.slice(-4);
}

// Moves a species learns at exactly this level (level-up learning).
export function learnedAtLevel(speciesName, level) {
  const ls = learnsetFor(speciesName);
  return ls ? ls.filter(([lvl]) => lvl === level).map(([, name]) => name) : [];
}
`);
console.log(`species ${Object.keys(learnsets).length} · usable moves ${Object.keys(needed).length} · newly registered ${generated.length} · hand-registered ${hand.size}`);
if (noData.length) console.log('no learnset data:', noData.join(', '));
const empty = Object.entries(learnsets).filter(([, l]) => !l.length).map(([s]) => s);
if (empty.length) console.log('empty learnsets:', empty.join(', '));
