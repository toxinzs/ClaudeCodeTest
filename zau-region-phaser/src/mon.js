import { STARTER_CHAINS, WILD_ZONE_TABLE, WILD_SPECIES, EVOLVE_LEVEL_1, EVOLVE_LEVEL_2 } from './data/pokemon.js';
import { baseStatsFor } from './data/baseStats.js';
import { abilityFor } from './data/abilities.js';
import { evolutionFor } from './data/evolutions.js';
import { megaFor } from './data/megas.js';
import { spriteUrlFor, spriteUrlForId } from './sprites.js';

export function xpNeededForLevel(lvl) { return 20 + lvl * 12; }

// Individual Values — the real games' hidden 0–31 per-stat roll that makes
// two Pokémon of the same species differ. Rolled once when a Pokémon is
// created (wild, starter, trainer, gift) and kept for life; a caught
// Pokémon keeps the roll it had in the wild. Story gifts can be given
// perfect IVs (MEGA.md: the Key Stone Absol). Old saves' Pokémon have no
// ivs field and are treated as all-zero, which is exactly the stats they
// were computed with before this existed — nothing shifts on load.
export const STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'spe'];
export const ZERO_IVS = Object.freeze({ hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 });
export const MAX_IV_TOTAL = 31 * 6;

export function rollIVs() {
  const ivs = {};
  for (const k of STAT_KEYS) ivs[k] = Math.floor(Math.random() * 32);
  return ivs;
}

export function perfectIVs() {
  const ivs = {};
  for (const k of STAT_KEYS) ivs[k] = 31;
  return ivs;
}

export function ivsFor(mon) {
  return mon.ivs || ZERO_IVS;
}

// The real games' judge phrasing for the total, so a summary can say
// "Outstanding" instead of a bare number.
export function ivSummary(mon) {
  const ivs = ivsFor(mon);
  const total = STAT_KEYS.reduce((n, k) => n + ivs[k], 0);
  const word = total >= 151 ? 'Outstanding' : total >= 121 ? 'Very good' : total >= 91 ? 'Pretty good' : total >= 61 ? 'Decent' : 'Average';
  return { total, word };
}

// Real stat formula with IVs (EV=0, neutral nature — an exact reduction of
// the official formula with those two terms zeroed out).
export function computeStats(baseStats, level, ivs = ZERO_IVS) {
  const other = (base, iv) => Math.floor((2 * base + iv) * level / 100) + 5;
  const maxHp = Math.floor((2 * baseStats.hp + ivs.hp) * level / 100) + level + 10;
  return {
    maxHp,
    atk: other(baseStats.atk, ivs.atk),
    def: other(baseStats.def, ivs.def),
    spAtk: other(baseStats.spAtk, ivs.spAtk),
    spDef: other(baseStats.spDef, ivs.spDef),
    spe: other(baseStats.spe, ivs.spe)
  };
}

// A story-gift Pokémon: fully built like a caught one, with chosen IVs and
// (optionally) a held item already equipped. Used by the Key Stone beat.
export function makeGiftMon({ speciesName, emoji, type, level, moves, ivs = rollIVs(), heldItem = null }) {
  const stats = computeStats(baseStatsFor(speciesName), level, ivs);
  return {
    speciesName, emoji, type, level, ivs,
    xp: 0, xpNext: xpNeededForLevel(level),
    hp: stats.maxHp, ...stats,
    moves: moves.map(m => ({ ...m })),
    nickname: speciesName, fainted: false, isWild: false, status: null,
    heldItem, ability: abilityFor(speciesName)
  };
}

export function movesKnownAtLevel(learnset, level) {
  return learnset.filter(e => e.lvl <= level).slice(-4).map(({ lvl, ...move }) => move);
}

export function makeStarterMon(key) {
  const chain = STARTER_CHAINS[key];
  const level = 5;
  const ivs = rollIVs();
  const stats = computeStats(baseStatsFor(chain.stages[0].name), level, ivs);
  return {
    key: key,
    stageIdx: 0,
    ivs,
    nickname: chain.stages[0].name,
    type: chain.type,
    level: level,
    xp: 0,
    xpNext: xpNeededForLevel(level),
    hp: stats.maxHp,
    ...stats,
    moves: movesKnownAtLevel(chain.learnset, level),
    fainted: false,
    status: null,
    heldItem: null,
    ability: abilityFor(chain.stages[0].name)
  };
}

export function buildWildMon(species, lvl) {
  const ivs = rollIVs();
  const stats = computeStats(baseStatsFor(species.name), lvl, ivs);
  return {
    isWild: true,
    ivs,
    speciesName: species.name,
    emoji: species.emoji,
    type: species.type,
    level: lvl,
    hp: stats.maxHp,
    ...stats,
    moves: species.moves.map(m => ({...m})),
    caughtId: null,
    status: null,
    heldItem: null,
    ability: abilityFor(species.name)
  };
}

export function rollWildEncounter(zoneKey) {
  const table = WILD_ZONE_TABLE[zoneKey] || WILD_ZONE_TABLE.outskirts;
  const speciesIdx = table[Math.floor(Math.random() * table.length)];
  const species = WILD_SPECIES[speciesIdx];
  const lvl = species.baseLvl[0] + Math.floor(Math.random() * (species.baseLvl[1]-species.baseLvl[0]+1));
  return buildWildMon(species, lvl);
}

// Single chokepoint for "how do I show this mon" — branches on mon.key to tell
// starter-chain mons (which evolve/rename) apart from wild/trainer mons, and
// resolves the real sprite URL (null falls back to emoji at the call site).
// Also the canonical place to resolve a mon's CURRENT species name, since a
// starter's species changes across evolution stages.
export function currentMonDisplay(mon) {
  let d;
  if (mon.key) {
    const chain = STARTER_CHAINS[mon.key];
    const stage = chain.stages[mon.stageIdx];
    d = { name: mon.nickname, species: stage.name, emoji: stage.emoji, type: chain.type, sprite: spriteUrlFor(stage.name) };
  } else {
    d = { name: mon.speciesName, species: mon.speciesName, emoji: mon.emoji, type: mon.type, sprite: spriteUrlFor(mon.speciesName) };
  }
  // While Mega Evolved, the mon shows its Mega name/type/art — `species`
  // deliberately stays the base species so baseStats/ability lookups
  // keyed on it keep working.
  if (mon.megaActive) {
    const mega = megaFor(d.species);
    if (mega) { d.name = mega.megaName; d.type = mega.type; d.sprite = spriteUrlForId(mega.spriteId); }
  }
  return d;
}

// Recomputes a mon's atk/def/spAtk/spDef/spe/maxHp for its current species
// (post-evolution, if any) and level — Mega base stats while Mega Evolved.
// Callers that need to preserve damage taken across a level-up must handle
// the HP delta themselves — this always returns the full fresh maxHp.
export function statsForMon(mon) {
  const species = currentMonDisplay(mon).species;
  const mega = mon.megaActive ? megaFor(species) : null;
  return computeStats(mega ? mega.baseStats : baseStatsFor(species), mon.level, ivsFor(mon));
}

// Mega Evolution transform/revert. HP is untouched (a Mega form's HP base
// stat is always identical to the base form's in the real games), so only
// the other five stats, type, and ability change. Battle-scoped: the
// engine reverts at battle end and on faint.
export function applyMega(mon) {
  const mega = megaFor(currentMonDisplay(mon).species);
  if (!mega || mon.megaActive) return null;
  mon.megaRestore = { type: mon.type, ability: mon.ability };
  mon.megaActive = true;
  mon.type = mega.type;
  mon.ability = mega.ability;
  Object.assign(mon, pickBattleStats(statsForMon(mon)));
  return mega;
}

export function revertMega(mon) {
  if (!mon.megaActive) return;
  mon.megaActive = false;
  if (mon.megaRestore) { mon.type = mon.megaRestore.type; mon.ability = mon.megaRestore.ability; }
  delete mon.megaRestore;
  Object.assign(mon, pickBattleStats(statsForMon(mon)));
}

function pickBattleStats(s) {
  return { atk: s.atk, def: s.def, spAtk: s.spAtk, spDef: s.spDef, spe: s.spe };
}

// Mutates a non-starter mon into its evolved species in place — species
// name, type, emoji, ability all move together, and the nickname updates
// too since a caught mon's "nickname" is always just a snapshot of its
// species name (there's no custom-nickname feature to preserve here).
function applyEvolution(mon, evo) {
  mon.speciesName = evo.evolvesTo;
  mon.nickname = evo.evolvesTo;
  mon.type = evo.type;
  mon.emoji = evo.emoji;
  mon.ability = abilityFor(evo.evolvesTo);
}

export function evolveIfReady(mon) {
  if (mon.key) {
    if (mon.stageIdx === 0 && mon.level >= EVOLVE_LEVEL_1) { mon.stageIdx = 1; }
    if (mon.stageIdx === 1 && mon.level >= EVOLVE_LEVEL_2) { mon.stageIdx = 2; }
    // Every starter line keeps the same ability across all 3 stages today,
    // but resolving it fresh off the current species (rather than assuming
    // that) is what actually keeps this correct if that ever changes.
    mon.ability = abilityFor(currentMonDisplay(mon).species);
    return;
  }
  // Non-starter species evolve via data/evolutions.js — only the
  // level-triggered ones happen automatically here; item-triggered ones
  // (real trade evolutions, e.g. Kadabra->Alakazam) are player-initiated
  // from the Bag, see evolveWithItem below.
  const evo = evolutionFor(mon.speciesName);
  if (evo && evo.method === 'level' && mon.level >= evo.level) applyEvolution(mon, evo);
}

// Item-triggered evolution (a Linking Cord used from the Bag). Returns the
// evolved-to species name on success, or null if this mon/item don't
// match a real evolution (caller shouldn't be able to reach this case
// from the UI, but it's a plain function, not a UI assertion).
export function evolveWithItem(mon, itemKey) {
  if (mon.key) return null;
  const evo = evolutionFor(mon.speciesName);
  if (!evo || evo.method !== 'item' || evo.item !== itemKey) return null;
  applyEvolution(mon, evo);
  return evo.evolvesTo;
}
