import { STARTER_CHAINS, WILD_ZONE_TABLE, WILD_SPECIES, EVOLVE_LEVEL_1, EVOLVE_LEVEL_2 } from './data/pokemon.js';
import { spriteUrlFor } from './sprites.js';

export function xpNeededForLevel(lvl) { return 20 + lvl * 12; }

export function statHpForLevel(lvl) {
  return 26 + lvl * 3;
}

export function movesKnownAtLevel(learnset, level) {
  return learnset.filter(e => e.lvl <= level).slice(-4).map(e => ({ name: e.name, type: e.type, power: e.power }));
}

export function makeStarterMon(key) {
  const chain = STARTER_CHAINS[key];
  const level = 5;
  const hp = statHpForLevel(level);
  return {
    key: key,
    stageIdx: 0,
    nickname: chain.stages[0].name,
    type: chain.type,
    level: level,
    xp: 0,
    xpNext: xpNeededForLevel(level),
    hp: hp,
    maxHp: hp,
    moves: movesKnownAtLevel(chain.learnset, level),
    fainted: false
  };
}

export function buildWildMon(species, lvl) {
  const hp = statHpForLevel(lvl);
  return {
    isWild: true,
    speciesName: species.name,
    emoji: species.emoji,
    type: species.type,
    level: lvl,
    hp: hp,
    maxHp: hp,
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
export function currentMonDisplay(mon) {
  if (mon.key) {
    const chain = STARTER_CHAINS[mon.key];
    const stage = chain.stages[mon.stageIdx];
    return { name: mon.nickname, species: stage.name, emoji: stage.emoji, type: chain.type, sprite: spriteUrlFor(stage.name) };
  }
  return { name: mon.speciesName, species: mon.speciesName, emoji: mon.emoji, type: mon.type, sprite: spriteUrlFor(mon.speciesName) };
}

// Renders a mon's sprite as an <img>, with a same-position emoji fallback that
// reveals itself if the image 404s (no sprite ID / offline / bad name). When
// there's no sprite URL at all (Verdanyx), only the emoji is rendered.
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
