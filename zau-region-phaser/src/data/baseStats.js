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
  riolu:        { hp: 40, atk: 70,  def: 40,  spAtk: 35,  spDef: 40,  spe: 60 },
  gible:        { hp: 58, atk: 70,  def: 45,  spAtk: 40,  spDef: 45,  spe: 42 },
  absol:        { hp: 65, atk: 130, def: 60,  spAtk: 75,  spDef: 60,  spe: 75 },

  // Evolutions of existing roster species (data/evolutions.js) — each
  // picked because it's a real Mega-Evolution-eligible species.
  gyarados:     { hp: 95, atk: 125, def: 79,  spAtk: 60,  spDef: 100, spe: 81 },
  alakazam:     { hp: 55, atk: 50,  def: 45,  spAtk: 135, spDef: 95,  spe: 120 },
  gengar:       { hp: 60, atk: 65,  def: 60,  spAtk: 130, spDef: 75,  spe: 110 },
  lucario:      { hp: 70, atk: 110, def: 70,  spAtk: 115, spDef: 70,  spe: 90 },
  gabite:       { hp: 68, atk: 90,  def: 65,  spAtk: 50,  spDef: 55,  spe: 82 },
  garchomp:     { hp: 108,atk: 130, def: 95,  spAtk: 80,  spDef: 85,  spe: 102 },

  // Harbor District roster
  wingull:      { hp: 40, atk: 30,  def: 30,  spAtk: 55,  spDef: 30,  spe: 85 },
  tentacool:    { hp: 40, atk: 40,  def: 35,  spAtk: 50,  spDef: 100, spe: 70 },
  krabby:       { hp: 30, atk: 105, def: 90,  spAtk: 25,  spDef: 25,  spe: 50 },
  horsea:       { hp: 30, atk: 40,  def: 70,  spAtk: 70,  spDef: 25,  spe: 60 },
  chinchou:     { hp: 75, atk: 38,  def: 38,  spAtk: 56,  spDef: 56,  spe: 67 },
  buizel:       { hp: 55, atk: 65,  def: 35,  spAtk: 60,  spDef: 30,  spe: 85 },
  pelipper:     { hp: 60, atk: 50,  def: 100, spAtk: 95,  spDef: 70,  spe: 65 },

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

  // Ember Quarter roster + evolutions
  slugma:       { hp: 40, atk: 40,  def: 40,  spAtk: 70,  spDef: 40,  spe: 20 },
  magcargo:     { hp: 60, atk: 50,  def: 120, spAtk: 90,  spDef: 80,  spe: 30 },
  numel:        { hp: 60, atk: 60,  def: 40,  spAtk: 65,  spDef: 45,  spe: 35 },
  camerupt:     { hp: 70, atk: 100, def: 70,  spAtk: 105, spDef: 75,  spe: 40 },
  aron:         { hp: 50, atk: 70,  def: 100, spAtk: 40,  spDef: 40,  spe: 30 },
  lairon:       { hp: 60, atk: 90,  def: 140, spAtk: 50,  spDef: 50,  spe: 40 },
  aggron:       { hp: 70, atk: 110, def: 180, spAtk: 60,  spDef: 60,  spe: 50 },
  rolycoly:     { hp: 30, atk: 40,  def: 50,  spAtk: 40,  spDef: 50,  spe: 30 },
  carkol:       { hp: 80, atk: 60,  def: 90,  spAtk: 60,  spDef: 70,  spe: 50 },
  coalossal:    { hp: 110,atk: 80,  def: 120, spAtk: 80,  spDef: 90,  spe: 30 },
  litwick:      { hp: 50, atk: 30,  def: 55,  spAtk: 65,  spDef: 55,  spe: 20 },
  lampent:      { hp: 60, atk: 40,  def: 60,  spAtk: 95,  spDef: 60,  spe: 55 },
  torkoal:      { hp: 70, atk: 85,  def: 140, spAtk: 85,  spDef: 70,  spe: 20 },
  magnemite:    { hp: 25, atk: 35,  def: 70,  spAtk: 95,  spDef: 55,  spe: 45 },
  magneton:     { hp: 50, atk: 60,  def: 95,  spAtk: 120, spDef: 70,  spe: 70 },
  houndour:     { hp: 45, atk: 60,  def: 30,  spAtk: 80,  spDef: 50,  spe: 65 },
  houndoom:     { hp: 75, atk: 90,  def: 50,  spAtk: 110, spDef: 80,  spe: 95 },

  // Greenline Terraces roster + evolutions
  oddish:       { hp: 45, atk: 50,  def: 55,  spAtk: 75,  spDef: 65,  spe: 30 },
  gloom:        { hp: 60, atk: 65,  def: 70,  spAtk: 85,  spDef: 75,  spe: 40 },
  hoppip:       { hp: 35, atk: 35,  def: 40,  spAtk: 35,  spDef: 55,  spe: 50 },
  skiploom:     { hp: 55, atk: 45,  def: 50,  spAtk: 45,  spDef: 65,  spe: 80 },
  jumpluff:     { hp: 75, atk: 55,  def: 70,  spAtk: 55,  spDef: 95,  spe: 110 },
  sewaddle:     { hp: 45, atk: 53,  def: 70,  spAtk: 40,  spDef: 60,  spe: 42 },
  swadloon:     { hp: 55, atk: 63,  def: 90,  spAtk: 50,  spDef: 80,  spe: 42 },
  leavanny:     { hp: 75, atk: 103, def: 80,  spAtk: 70,  spDef: 80,  spe: 92 },
  combee:       { hp: 30, atk: 30,  def: 42,  spAtk: 30,  spDef: 42,  spe: 70 },
  vespiquen:    { hp: 70, atk: 80,  def: 102, spAtk: 80,  spDef: 102, spe: 40 },
  flabébé:      { hp: 44, atk: 38,  def: 39,  spAtk: 61,  spDef: 79,  spe: 42 },
  floette:      { hp: 54, atk: 45,  def: 47,  spAtk: 75,  spDef: 98,  spe: 52 },
  ralts:        { hp: 28, atk: 25,  def: 25,  spAtk: 45,  spDef: 35,  spe: 40 },
  kirlia:       { hp: 38, atk: 35,  def: 35,  spAtk: 65,  spDef: 55,  spe: 50 },
  gardevoir:    { hp: 68, atk: 65,  def: 65,  spAtk: 125, spDef: 115, spe: 80 },
  heracross:    { hp: 80, atk: 125, def: 75,  spAtk: 40,  spDef: 95,  spe: 85 },
  pinsir:       { hp: 65, atk: 125, def: 100, spAtk: 55,  spDef: 70,  spe: 85 },

  // Signal District roster + evolutions
  elekid:       { hp: 45, atk: 63,  def: 37,  spAtk: 65,  spDef: 55,  spe: 95 },
  electabuzz:   { hp: 65, atk: 83,  def: 57,  spAtk: 95,  spDef: 85,  spe: 105 },
  joltik:       { hp: 50, atk: 47,  def: 50,  spAtk: 57,  spDef: 50,  spe: 65 },
  galvantula:   { hp: 70, atk: 77,  def: 60,  spAtk: 97,  spDef: 60,  spe: 108 },
  klink:        { hp: 40, atk: 55,  def: 70,  spAtk: 45,  spDef: 60,  spe: 30 },
  klang:        { hp: 60, atk: 80,  def: 95,  spAtk: 70,  spDef: 85,  spe: 50 },
  pawniard:     { hp: 45, atk: 85,  def: 70,  spAtk: 40,  spDef: 40,  spe: 60 },
  bisharp:      { hp: 65, atk: 125, def: 100, spAtk: 60,  spDef: 70,  spe: 70 },
  mareep:       { hp: 55, atk: 40,  def: 40,  spAtk: 65,  spDef: 45,  spe: 35 },
  flaaffy:      { hp: 70, atk: 55,  def: 55,  spAtk: 80,  spDef: 60,  spe: 45 },
  ampharos:     { hp: 90, atk: 75,  def: 85,  spAtk: 115, spDef: 90,  spe: 55 },
  electrike:    { hp: 40, atk: 45,  def: 40,  spAtk: 65,  spDef: 40,  spe: 65 },
  manectric:    { hp: 70, atk: 75,  def: 60,  spAtk: 105, spDef: 60,  spe: 105 },
  skarmory:     { hp: 65, atk: 80,  def: 140, spAtk: 40,  spDef: 70,  spe: 70 },

  // Undercity roster + evolutions
  zubat:        { hp: 40, atk: 45,  def: 35,  spAtk: 30,  spDef: 40,  spe: 55 },
  golbat:       { hp: 75, atk: 80,  def: 70,  spAtk: 65,  spDef: 75,  spe: 90 },
  sableye:      { hp: 50, atk: 75,  def: 75,  spAtk: 65,  spDef: 65,  spe: 50 },
  drilbur:      { hp: 60, atk: 85,  def: 40,  spAtk: 30,  spDef: 45,  spe: 68 },
  excadrill:    { hp: 110,atk: 135, def: 60,  spAtk: 50,  spDef: 65,  spe: 88 },
  koffing:      { hp: 40, atk: 65,  def: 95,  spAtk: 60,  spDef: 45,  spe: 35 },
  weezing:      { hp: 65, atk: 90,  def: 120, spAtk: 85,  spDef: 70,  spe: 60 },
  shuppet:      { hp: 44, atk: 75,  def: 35,  spAtk: 63,  spDef: 33,  spe: 45 },
  banette:      { hp: 64, atk: 115, def: 65,  spAtk: 83,  spDef: 63,  spe: 65 },
  mawile:       { hp: 50, atk: 85,  def: 85,  spAtk: 55,  spDef: 55,  spe: 50 },

  // The Sprawl roster + evolutions
  eevee:        { hp: 55, atk: 55,  def: 50,  spAtk: 45,  spDef: 65,  spe: 55 },
  meowth:       { hp: 40, atk: 45,  def: 35,  spAtk: 40,  spDef: 40,  spe: 90 },
  snubbull:     { hp: 60, atk: 80,  def: 50,  spAtk: 40,  spDef: 40,  spe: 30 },
  granbull:     { hp: 90, atk: 120, def: 75,  spAtk: 60,  spDef: 60,  spe: 45 },
  audino:       { hp: 103,atk: 60,  def: 86,  spAtk: 60,  spDef: 86,  spe: 50 },
  kangaskhan:   { hp: 105,atk: 95,  def: 80,  spAtk: 40,  spDef: 80,  spe: 90 },
  clefairy:     { hp: 70, atk: 45,  def: 48,  spAtk: 60,  spDef: 65,  spe: 35 },

  // Custom/fictional final legendary — not a real species, hand-authored
  verdanyx:     { hp: 100,atk: 110, def: 90,  spAtk: 120, spDef: 100, spe: 95 }
};

export function baseStatsFor(speciesName) {
  const s = BASE_STATS[speciesName.toLowerCase()];
  if (!s) throw new Error(`No base stats for "${speciesName}" — add it to data/baseStats.js`);
  return s;
}
