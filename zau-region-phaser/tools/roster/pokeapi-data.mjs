// Loads the PokeAPI CSV tables the roster plan needs (cached in the OS temp dir,
// fetched from PokeAPI's GitHub on first use) and exposes species/chain helpers.
// Node >= 18 (global fetch, top-level await).
import fs from 'fs';
import os from 'os';
import path from 'path';

const BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const CACHE = path.join(os.tmpdir(), 'zau-pokeapi');
fs.mkdirSync(CACHE, { recursive: true });
export async function csv(name) {
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(BASE + name);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    fs.writeFileSync(file, await res.text());
  }
  return fs.readFileSync(file, 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
}
const [species, evolution, pokemon, pokemonTypes, typeRows, itemRows] = await Promise.all(
  ['pokemon_species.csv', 'pokemon_evolution.csv', 'pokemon.csv', 'pokemon_types.csv', 'types.csv', 'items.csv'].map(csv));

export const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const title = s => (s || '').split('-').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// species: id, identifier, generation, evolves_from, chain, ..., is_baby(11), is_legendary(16), is_mythical(17)
export const S = {};
for (const r of species) S[+r[0]] = { id: +r[0], key: norm(r[1]), ident: r[1], gen: +r[2], from: r[3] ? +r[3] : null, chain: +r[4], baby: r[11] === '1', legendary: r[16] === '1' || r[17] === '1' };
export const byKey = Object.fromEntries(Object.values(S).map(s => [s.key, s]));
export const membersOf = chain => Object.values(S).filter(s => s.chain === chain).sort((a, b) => a.id - b.id);

const defId = {}; for (const r of pokemon) if (r[7] === '1') defId[+r[2]] = +r[0];
const typeName = Object.fromEntries(typeRows.map(r => [r[0], title(r[1])]));
const typesOf = {}; for (const r of pokemonTypes) (typesOf[+r[0]] ??= []).push([+r[2], typeName[r[1]]]);
export const typeStr = sid => (typesOf[defId[sid]] || []).sort((a, b) => a[0] - b[0]).map(x => x[1]).join('/');

const items = Object.fromEntries(itemRows.map(r => [r[0], title(r[1])]));
const evo = {}; for (const r of evolution) (evo[+r[1]] ??= []).push(r);
const on = v => v !== undefined && v !== '' && v !== '0';

/** The plainest way a species evolves INTO it. PokeAPI keeps several rows per
 *  species (regional forms, alternate conditions), so rank them: a bare level,
 *  a stone, a trade, a conditional level, friendship, then the odd ones.
 *  A trailing dagger marks a level that also has a time/gender/place condition. */
export function method(sid) {
  const rows = evo[sid]; if (!rows) return '';
  const conds = r => [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].some(i => on(r[i]));
  const scored = rows.map(r => {
    const trig = +r[2]; const item = items[r[5]] || '';
    if (/galarica|auspicious|malicious|black augurite|peat block/i.test(item)) return [9, 'regional'];
    if (trig === 1 && r[6] && !conds(r)) return [0, `Lv.${r[6]}`];
    if (trig === 3) return [1, item || 'item'];
    if (trig === 2) return [2, 'trade'];
    if (trig === 1 && r[6]) return [3, `Lv.${r[6]}†`];
    if (trig === 1 && on(r[13])) return [4, 'friendship'];
    if (trig === 1 && on(r[9])) return [5, `hold ${items[r[9]]}`];
    if (trig === 1 && on(r[11])) return [5, 'knows a move'];
    if (trig === 1 && on(r[8])) return [6, 'location'];
    return [7, 'special'];
  }).sort((a, b) => a[0] - b[0]);
  return scored[0][1];
}
