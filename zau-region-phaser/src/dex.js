import { state } from './state.js';
import { STARTER_CHAINS, WILD_SPECIES, zonesForSpecies, ZONE_LABELS } from './data/pokemon.js';
import { SPRITE_IDS } from './data/spriteIds.js';
import { allEvolutions } from './data/evolutions.js';
import { TRAINERS } from './data/trainers.js';

// The species Pokédex: a per-species record of what the player has SEEN
// (met in a battle) and CAUGHT (owned, or evolved into), keyed by proper
// species name. Until now "the Pokédex" was only a list of the Pokémon in
// your party and Box — it couldn't say what you'd met, what was left, or
// where to find it, which is what a 300+ species roster needs.
//
// state.dex = { seen: {Name: true}, caught: {Name: true}, migrated }.
// `migrated` is set once the dex has been seeded from an older save's
// party and Box, so a save from before the dex existed doesn't open on an
// empty book while holding a full team.

export function ensureDexState() {
  state.dex ??= { seen: {}, caught: {}, migrated: false };
  state.dex.seen ??= {};
  state.dex.caught ??= {};
  if (!state.dex.migrated) {
    state.dex.migrated = true;
    for (const mon of [...(state.party || []), ...(state.box || [])]) {
      if (mon.key) {
        // A starter line: every stage up to the current one was owned.
        const stages = STARTER_CHAINS[mon.key]?.stages || [];
        for (let i = 0; i <= mon.stageIdx && i < stages.length; i++) markCaught(stages[i].name);
      } else if (mon.speciesName) {
        markCaught(mon.speciesName);
      }
    }
  }
}

export function markSeen(name) {
  if (!name) return;
  ensureDexState();
  state.dex.seen[name] = true;
}

// Owning a species also means having seen it.
export function markCaught(name) {
  if (!name) return;
  ensureDexState();
  state.dex.seen[name] = true;
  state.dex.caught[name] = true;
}

// ---- species catalogue ----
// Proper-cased names, types and sources are scattered across the data
// files (the baseStats/spriteIds tables are lowercase-keyed), so collect
// them once. A species only needs to exist in SPRITE_IDS (its national dex
// number) to appear in the book.
let catalogue = null;

function buildCatalogue() {
  const names = {};   // lowercase -> Proper
  const types = {};   // lowercase -> "Type/Type"
  const learn = (name, type) => {
    if (!name) return;
    const k = name.toLowerCase();
    names[k] ??= name;
    if (type) types[k] ??= type;
  };
  for (const sp of WILD_SPECIES) learn(sp.name, sp.type);
  for (const chain of Object.values(STARTER_CHAINS)) for (const st of chain.stages) learn(st.name, chain.type);
  for (const e of allEvolutions()) learn(e.evolvesTo, e.type);
  for (const tr of Object.values(TRAINERS)) for (const t of tr.team) learn(t.speciesName, t.type);

  const from = {};    // lowercase -> [Proper pre-evolution names]
  for (const e of allEvolutions()) {
    const k = e.evolvesTo.toLowerCase();
    (from[k] ??= []).push(names[e.from] || e.from);
  }

  const list = Object.entries(SPRITE_IDS)
    .filter(([k]) => names[k])
    .map(([k, id]) => ({ id, name: names[k], type: types[k] || '???', evolvesFrom: from[k] || [] }))
    .sort((a, b) => a.id - b.id);
  // Verdanyx is the region's own legendary: no national number, listed last.
  list.push({ id: null, name: 'Verdanyx', type: 'Grass/Dragon', evolvesFrom: [], custom: true });
  return list;
}

export function dexCatalogue() {
  return (catalogue ??= buildCatalogue());
}

// Where a species can be met, as readable text for the detail line.
export function whereFound(entry) {
  if (entry.custom) return 'The Skyline, at rest (postgame)';
  if (Object.values(STARTER_CHAINS).some(c => c.stages[0].name === entry.name)) return 'Professor Priya\'s lab (starter)';
  const zones = zonesForSpecies(entry.name).map(z => ZONE_LABELS[z] || z);
  if (zones.length) return zones.join(', ');
  if (entry.evolvesFrom.length) return `Evolves from ${entry.evolvesFrom.join(' / ')}`;
  return 'Not found in the wild';
}

export function dexCounts() {
  ensureDexState();
  const cat = dexCatalogue();
  return {
    total: cat.length,
    seen: cat.filter(e => state.dex.seen[e.name]).length,
    caught: cat.filter(e => state.dex.caught[e.name]).length
  };
}

export function dexStatus(name) {
  ensureDexState();
  return state.dex.caught[name] ? 'caught' : state.dex.seen[name] ? 'seen' : 'unknown';
}
