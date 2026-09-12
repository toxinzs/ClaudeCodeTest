// Mega Evolution — the game's signature battle gimmick. Every entry here is
// a species' actual Mega form from the real games: real Mega base stats
// (always +100 BST over the base form, HP never changes), real Mega
// type, real Mega ability, and PokeAPI's real form IDs for the official
// Mega artwork. Keyed by base species name (lowercase); stone keys match
// data/items.js.
//
// Only Gen 1-6 species ever got Megas, which is why this roster is what
// Phase 10 deliberately seeded (Gyarados/Alakazam/Gengar/Lucario/
// Garchomp/Absol) and not the Gen 9 starters. Phase 13's Ember Quarter
// added Aggron/Camerupt/Houndoom the same way, and Phase 14's Greenline
// Terraces added Gardevoir/Heracross/Pinsir.
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
  },
  // Ember Quarter lines (Phase 13) — Aron/Numel/Houndour seeded there.
  aggron: {
    megaName: 'Mega Aggron', stone: 'aggronite', type: 'Steel', spriteId: 10053,
    baseStats: { hp: 70, atk: 140, def: 230, spAtk: 60, spDef: 80, spe: 50 },
    ability: { name: 'Filter', effect: null }
  },
  camerupt: {
    megaName: 'Mega Camerupt', stone: 'cameruptite', type: 'Fire/Ground', spriteId: 10087,
    baseStats: { hp: 70, atk: 120, def: 100, spAtk: 145, spDef: 105, spe: 20 },
    ability: { name: 'Sheer Force', effect: null }
  },
  houndoom: {
    megaName: 'Mega Houndoom', stone: 'houndoominite', type: 'Dark/Fire', spriteId: 10048,
    baseStats: { hp: 75, atk: 90, def: 90, spAtk: 140, spDef: 90, spe: 115 },
    ability: { name: 'Solar Power', effect: null }
  },
  // Greenline Terraces lines (Phase 14) — Ralts/Heracross/Pinsir seeded there.
  gardevoir: {
    megaName: 'Mega Gardevoir', stone: 'gardevoirite', type: 'Psychic/Fairy', spriteId: 10051,
    baseStats: { hp: 68, atk: 85, def: 65, spAtk: 165, spDef: 135, spe: 100 },
    ability: { name: 'Pixilate', effect: null }
  },
  heracross: {
    megaName: 'Mega Heracross', stone: 'heracronite', type: 'Bug/Fighting', spriteId: 10047,
    baseStats: { hp: 80, atk: 185, def: 115, spAtk: 40, spDef: 105, spe: 75 },
    ability: { name: 'Skill Link', effect: null }
  },
  pinsir: {
    megaName: 'Mega Pinsir', stone: 'pinsirite', type: 'Bug/Flying', spriteId: 10040,
    baseStats: { hp: 65, atk: 155, def: 120, spAtk: 65, spDef: 90, spe: 105 },
    ability: { name: 'Aerilate', effect: null }
  },
  // Signal District lines (Phase 19) — Mareep/Electrike seeded there.
  ampharos: {
    megaName: 'Mega Ampharos', stone: 'ampharosite', type: 'Electric/Dragon', spriteId: 10045,
    baseStats: { hp: 90, atk: 95, def: 105, spAtk: 165, spDef: 110, spe: 45 },
    ability: { name: 'Mold Breaker', effect: null }
  },
  manectric: {
    megaName: 'Mega Manectric', stone: 'manectite', type: 'Electric', spriteId: 10055,
    baseStats: { hp: 70, atk: 75, def: 80, spAtk: 135, spDef: 80, spe: 135 },
    ability: { name: 'Intimidate', effect: null }
  },
  // Undercity lines (Phase 20) — Sableye/Shuppet/Mawile seeded there.
  sableye: {
    megaName: 'Mega Sableye', stone: 'sablenite', type: 'Dark/Ghost', spriteId: 10066,
    baseStats: { hp: 50, atk: 85, def: 125, spAtk: 85, spDef: 115, spe: 20 },
    ability: { name: 'Magic Bounce', effect: null }
  },
  banette: {
    megaName: 'Mega Banette', stone: 'banettite', type: 'Ghost', spriteId: 10056,
    baseStats: { hp: 64, atk: 165, def: 75, spAtk: 93, spDef: 83, spe: 75 },
    ability: { name: 'Prankster', effect: null }
  },
  mawile: {
    megaName: 'Mega Mawile', stone: 'mawilite', type: 'Steel/Fairy', spriteId: 10052,
    baseStats: { hp: 50, atk: 105, def: 125, spAtk: 55, spDef: 95, spe: 50 },
    ability: { name: 'Huge Power', effect: null }
  }
};

export function megaFor(speciesName) {
  return MEGAS[speciesName.toLowerCase()] || null;
}
