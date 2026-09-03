// National Pokédex IDs for every real species referenced anywhere in the game
// (starter chains + all evolution stages, wild roster, trainer/leader/rival/Vance teams).
// Used to build PokeAPI official-artwork sprite URLs. Verdanyx is a custom/fictional
// legendary and is deliberately absent — sprite lookups fall back to its emoji.
export const SPRITE_IDS = {
  // Starters — Sprigatito line
  sprigatito: 906,
  floragato: 907,
  meowscarada: 908,
  // Starters — Fuecoco line
  fuecoco: 909,
  crocalor: 910,
  skeledirge: 911,
  // Starters — Quaxly line
  quaxly: 912,
  quaxwell: 913,
  quaquaval: 914,

  // Wild Zone roster
  caterpie: 10,
  pidgey: 16,
  rattata: 19,
  zigzagoon: 263,
  bidoof: 399,
  lechonk: 915,
  starly: 396,
  magikarp: 129,
  geodude: 74,
  gastly: 92,
  tarountula: 917,
  abra: 63,
  growlithe: 58,
  psyduck: 54,
  grubbin: 736,
  murkrow: 198,
  pikachu: 25,
  ekans: 23,
  sandshrew: 27,
  snorunt: 361,
  bronzor: 436,
  cutiefly: 742,
  bagon: 371,

  // Trainers, rival, league leaders, Director Vance
  kadabra: 64,
  charjabug: 737,
  raichu: 26,
  golduck: 55,
  vivillon: 666,
  bronzong: 437,
  honchkrow: 430,
  haunter: 93,
  sandslash: 28,
  froslass: 478
};

export function spriteIdFor(speciesName) {
  return SPRITE_IDS[speciesName.toLowerCase()] ?? null;
}
