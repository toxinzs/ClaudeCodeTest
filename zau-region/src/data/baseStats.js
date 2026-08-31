// National-dex base stats (HP/Atk/Def/SpAtk/SpDef/Spe) for every real species
// referenced anywhere in the game — same species list as data/spriteIds.js,
// sourced from official game data. Verdanyx is custom/fictional and gets a
// hand-authored legendary-tier spread instead, same precedent as its sprite
// and moveset already being hand-authored.
const BASE_STATS = {
  // Starters — Sprigatito line
  sprigatito:   { hp: 40, atk: 61,  def: 54,  spAtk: 45,  spDef: 45,  spe: 65 },
  floragato:    { hp: 61, atk: 80,  def: 63,  spAtk: 60,  spDef: 63,  spe: 83 },
  meowscarada:  { hp: 76, atk: 110, def: 70,  spAtk: 81,  spDef: 70,  spe: 123 },
  // Starters — Fuecoco line
  fuecoco:      { hp: 67, atk: 45,  def: 59,  spAtk: 63,  spDef: 40,  spe: 36 },
  crocalor:     { hp: 81, atk: 55,  def: 78,  spAtk: 90,  spDef: 58,  spe: 49 },
  skeledirge:   { hp: 104,atk: 75,  def: 100, spAtk: 110, spDef: 75,  spe: 66 },
  // Starters — Quaxly line
  quaxly:       { hp: 55, atk: 65,  def: 45,  spAtk: 50,  spDef: 45,  spe: 50 },
  quaxwell:     { hp: 70, atk: 85,  def: 65,  spAtk: 65,  spDef: 60,  spe: 65 },
  quaquaval:    { hp: 85, atk: 120, def: 80,  spAtk: 85,  spDef: 75,  spe: 85 },

  // Wild Zone roster
  caterpie:     { hp: 45, atk: 30,  def: 35,  spAtk: 20,  spDef: 20,  spe: 45 },
  pidgey:       { hp: 40, atk: 45,  def: 40,  spAtk: 35,  spDef: 35,  spe: 56 },
  rattata:      { hp: 30, atk: 56,  def: 35,  spAtk: 25,  spDef: 35,  spe: 72 },
  zigzagoon:    { hp: 38, atk: 30,  def: 41,  spAtk: 30,  spDef: 41,  spe: 60 },
  bidoof:       { hp: 59, atk: 45,  def: 40,  spAtk: 35,  spDef: 40,  spe: 31 },
  lechonk:      { hp: 54, atk: 45,  def: 40,  spAtk: 35,  spDef: 45,  spe: 35 },
  starly:       { hp: 40, atk: 55,  def: 30,  spAtk: 30,  spDef: 30,  spe: 60 },
  magikarp:     { hp: 20, atk: 10,  def: 55,  spAtk: 15,  spDef: 20,  spe: 80 },
  geodude:      { hp: 40, atk: 80,  def: 100, spAtk: 30,  spDef: 30,  spe: 20 },
  gastly:       { hp: 30, atk: 35,  def: 30,  spAtk: 100, spDef: 35,  spe: 80 },
  tarountula:   { hp: 35, atk: 41,  def: 45,  spAtk: 29,  spDef: 40,  spe: 20 },
  abra:         { hp: 25, atk: 20,  def: 15,  spAtk: 105, spDef: 55,  spe: 90 },
  growlithe:    { hp: 55, atk: 70,  def: 45,  spAtk: 70,  spDef: 50,  spe: 60 },
  psyduck:      { hp: 50, atk: 52,  def: 48,  spAtk: 65,  spDef: 50,  spe: 55 },
  grubbin:      { hp: 47, atk: 62,  def: 45,  spAtk: 55,  spDef: 45,  spe: 46 },
  murkrow:      { hp: 60, atk: 85,  def: 42,  spAtk: 85,  spDef: 42,  spe: 91 },
  pikachu:      { hp: 35, atk: 55,  def: 40,  spAtk: 50,  spDef: 50,  spe: 90 },
  ekans:        { hp: 35, atk: 60,  def: 44,  spAtk: 40,  spDef: 54,  spe: 55 },
  sandshrew:    { hp: 50, atk: 75,  def: 85,  spAtk: 20,  spDef: 30,  spe: 40 },
  snorunt:      { hp: 50, atk: 50,  def: 50,  spAtk: 50,  spDef: 50,  spe: 50 },
  bronzor:      { hp: 57, atk: 24,  def: 86,  spAtk: 24,  spDef: 86,  spe: 23 },
  cutiefly:     { hp: 40, atk: 45,  def: 40,  spAtk: 55,  spDef: 40,  spe: 84 },
  bagon:        { hp: 45, atk: 75,  def: 60,  spAtk: 40,  spDef: 30,  spe: 50 },

  // Trainers, rival, league leaders, Director Vance
  kadabra:      { hp: 40, atk: 35,  def: 30,  spAtk: 120, spDef: 70,  spe: 105 },
  charjabug:    { hp: 57, atk: 82,  def: 95,  spAtk: 55,  spDef: 75,  spe: 36 },
  raichu:       { hp: 60, atk: 90,  def: 55,  spAtk: 90,  spDef: 80,  spe: 110 },
  golduck:      { hp: 80, atk: 82,  def: 78,  spAtk: 95,  spDef: 80,  spe: 85 },
  vivillon:     { hp: 80, atk: 52,  def: 50,  spAtk: 90,  spDef: 50,  spe: 89 },
  bronzong:     { hp: 67, atk: 89,  def: 116, spAtk: 79,  spDef: 116, spe: 33 },
  honchkrow:    { hp: 100,atk: 125, def: 52,  spAtk: 105, spDef: 52,  spe: 71 },
  haunter:      { hp: 45, atk: 50,  def: 45,  spAtk: 115, spDef: 55,  spe: 95 },
  sandslash:    { hp: 75, atk: 100, def: 110, spAtk: 45,  spDef: 55,  spe: 65 },
  froslass:     { hp: 70, atk: 80,  def: 70,  spAtk: 80,  spDef: 70,  spe: 110 },

  // Custom/fictional final legendary — not a real species, hand-authored
  verdanyx:     { hp: 100,atk: 110, def: 90,  spAtk: 120, spDef: 100, spe: 95 }
};

export function baseStatsFor(speciesName) {
  const s = BASE_STATS[speciesName.toLowerCase()];
  if (!s) throw new Error(`No base stats for "${speciesName}" — add it to data/baseStats.js`);
  return s;
}
