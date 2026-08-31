import { STARTER_CHAINS, WILD_ZONE_TABLE, WILD_SPECIES, EVOLVE_LEVEL_1, EVOLVE_LEVEL_2 } from './data/pokemon.js';
import { baseStatsFor } from './data/baseStats.js';
import { spriteUrlFor } from './sprites.js';

export function xpNeededForLevel(lvl) { return 20 + lvl * 12; }

// Simplified real stat formula (IV=0, EV=0, neutral nature — an exact
// reduction of the official formula with those terms zeroed out).
export function computeStats(baseStats, level) {
  const other = (base) => Math.floor(2 * base * level / 100) + 5;
  const maxHp = Math.floor(2 * baseStats.hp * level / 100) + level + 10;
  return {
    maxHp,
    atk: other(baseStats.atk),
    def: other(baseStats.def),
    spAtk: other(baseStats.spAtk),
    spDef: other(baseStats.spDef),
    spe: other(baseStats.spe)
  };
}

export function movesKnownAtLevel(learnset, level) {
  return learnset.filter(e => e.lvl <= level).slice(-4).map(({ lvl, ...move }) => move);
}

export function makeStarterMon(key) {
  const chain = STARTER_CHAINS[key];
  const level = 5;
  const stats = computeStats(baseStatsFor(chain.stages[0].name), level);
  return {
    key: key,
    stageIdx: 0,
    nickname: chain.stages[0].name,
    type: chain.type,
    level: level,
    xp: 0,
    xpNext: xpNeededForLevel(level),
    hp: stats.maxHp,
    ...stats,
    moves: movesKnownAtLevel(chain.learnset, level),
    fainted: false
  };
}

export function buildWildMon(species, lvl) {
  const stats = computeStats(baseStatsFor(species.name), lvl);
  return {
    isWild: true,
    speciesName: species.name,
    emoji: species.emoji,
    type: species.type,
    level: lvl,
    hp: stats.maxHp,
    ...stats,
    moves: species.moves.map(m => ({...m})),
    caughtId: null
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
  if (mon.key) {
    const chain = STARTER_CHAINS[mon.key];
    const stage = chain.stages[mon.stageIdx];
    return { name: mon.nickname, species: stage.name, emoji: stage.emoji, type: chain.type, sprite: spriteUrlFor(stage.name) };
  }
  return { name: mon.speciesName, species: mon.speciesName, emoji: mon.emoji, type: mon.type, sprite: spriteUrlFor(mon.speciesName) };
}

// Recomputes a mon's atk/def/spAtk/spDef/spe/maxHp for its current species
// (post-evolution, if any) and level. Callers that need to preserve damage
// taken across a level-up must handle the HP delta themselves — this always
// returns the full fresh maxHp.
export function statsForMon(mon) {
  return computeStats(baseStatsFor(currentMonDisplay(mon).species), mon.level);
}

export function monSpriteHtml(display, className) {
  const emojiSpan = `<span class="${className} emoji-fallback"${display.sprite ? ' style="display:none"' : ''}>${display.emoji}</span>`;
  if (!display.sprite) return emojiSpan;
  const img = `<img src="${display.sprite}" alt="${display.species}" class="${className} sprite-img" onerror="this.style.display='none';this.nextElementSibling.style.display='';">`;
  return img + emojiSpan;
}

export function evolveIfReady(mon) {
  if (!mon.key) return;
  if (mon.stageIdx === 0 && mon.level >= EVOLVE_LEVEL_1) { mon.stageIdx = 1; }
  if (mon.stageIdx === 1 && mon.level >= EVOLVE_LEVEL_2) { mon.stageIdx = 2; }
}
