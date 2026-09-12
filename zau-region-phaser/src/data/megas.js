// Mega Evolution — the game's signature battle gimmick. Every entry here is
// a species' actual Mega form from the real games: real Mega base stats
// (always +100 BST over the base form, HP never changes), real Mega
// type, real Mega ability, and PokeAPI's real form IDs for the official
// Mega artwork. Keyed by base species name (lowercase); stone keys match
// data/items.js.
//
// Only Gen 1-6 species ever got Megas, which is why this roster is what
// Phase 10 deliberately seeded (Gyarados/Alakazam/Gengar/Lucario/
// Garchomp/Absol) and not the Gen 9 starters.
//
// Of the six Mega abilities, only Adaptability is wired mechanically (STAB
// 2x instead of 1.5x); the rest carry their real names flavor-only, same
// precedent as data/abilities.js.
const MEGAS = {
  gyarados: {
    megaName: 'Mega Gyarados', stone: 'gyaradosite', type: 'Water/Dark', spriteId: 10041,
    baseStats: { hp: 95, atk: 155, def: 109, spAtk: 70, spDef: 130, spe: 81 },
    ability: { name: 'Mold Breaker', effect: null }
  },
  alakazam: {
    megaName: 'Mega Alakazam', stone: 'alakazite', type: 'Psychic', spriteId: 10037,
    baseStats: { hp: 55, atk: 50, def: 65, spAtk: 175, spDef: 105, spe: 150 },
    ability: { name: 'Trace', effect: null }
  },
  gengar: {
    megaName: 'Mega Gengar', stone: 'gengarite', type: 'Ghost/Poison', spriteId: 10038,
    baseStats: { hp: 60, atk: 65, def: 80, spAtk: 170, spDef: 95, spe: 130 },
    ability: { name: 'Shadow Tag', effect: null }
  },
  lucario: {
    megaName: 'Mega Lucario', stone: 'lucarionite', type: 'Fighting/Steel', spriteId: 10059,
    baseStats: { hp: 70, atk: 145, def: 88, spAtk: 140, spDef: 70, spe: 112 },
    ability: { name: 'Adaptability', effect: 'adaptability' }
  },
  garchomp: {
    megaName: 'Mega Garchomp', stone: 'garchompite', type: 'Dragon/Ground', spriteId: 10058,
    baseStats: { hp: 108, atk: 170, def: 115, spAtk: 120, spDef: 95, spe: 92 },
    ability: { name: 'Sand Force', effect: null }
  },
  absol: {
    megaName: 'Mega Absol', stone: 'absolite', type: 'Dark', spriteId: 10057,
    baseStats: { hp: 65, atk: 150, def: 60, spAtk: 115, spDef: 60, spe: 115 },
    ability: { name: 'Magic Bounce', effect: null }
  }
};

export function megaFor(speciesName) {
  return MEGAS[speciesName.toLowerCase()] || null;
}
