// Real official abilities per species (same species-list precedent as
// data/baseStats.js/spriteIds.js). Every entry here is a species' actual
// in-game ability — nothing invented, matching this project's "real data,
// simplified mechanics" rule, except Verdanyx (custom/fictional, same
// precedent as its hand-authored stats/moveset/sprite).
//
// `effect` is a stable id the battle engine hooks into; most species carry
// a real ability that just isn't one of the handful this pass implements
// mechanically (e.g. Pickup, Sand Veil) — `effect: null` there. That's
// honest breadth: real flavor everywhere, mechanical depth where it's
// actually wired up.
const ABILITIES = {
  // Starters — the classic low-HP same-type-move boost, real for all three lines.
  sprigatito: { name: 'Overgrow', effect: 'low_hp_boost', boostType: 'Grass' },
  floragato: { name: 'Overgrow', effect: 'low_hp_boost', boostType: 'Grass' },
  meowscarada: { name: 'Overgrow', effect: 'low_hp_boost', boostType: 'Grass' },
  fuecoco: { name: 'Blaze', effect: 'low_hp_boost', boostType: 'Fire' },
  crocalor: { name: 'Blaze', effect: 'low_hp_boost', boostType: 'Fire' },
  skeledirge: { name: 'Blaze', effect: 'low_hp_boost', boostType: 'Fire' },
  quaxly: { name: 'Torrent', effect: 'low_hp_boost', boostType: 'Water' },
  quaxwell: { name: 'Torrent', effect: 'low_hp_boost', boostType: 'Water' },
  quaquaval: { name: 'Torrent', effect: 'low_hp_boost', boostType: 'Water' },

  // Wild Zone roster
  caterpie: { name: 'Shield Dust', effect: null },
  pidgey: { name: 'Keen Eye', effect: null },
  rattata: { name: 'Guts', effect: 'guts' },
  zigzagoon: { name: 'Pickup', effect: null },
  bidoof: { name: 'Simple', effect: null },
  lechonk: { name: 'Gluttony', effect: null },
  starly: { name: 'Keen Eye', effect: null },
  magikarp: { name: 'Swift Swim', effect: null },
  geodude: { name: 'Sturdy', effect: 'sturdy' },
  gastly: { name: 'Levitate', effect: 'levitate' },
  tarountula: { name: 'String Shot', effect: null },
  abra: { name: 'Synchronize', effect: 'synchronize' },
  growlithe: { name: 'Flash Fire', effect: 'flash_fire' },
  psyduck: { name: 'Damp', effect: null },
  grubbin: { name: 'Swarm', effect: 'low_hp_boost', boostType: 'Bug' },
  murkrow: { name: 'Insomnia', effect: 'insomnia' },
  pikachu: { name: 'Static', effect: 'static' },
  ekans: { name: 'Shed Skin', effect: 'shed_skin' },
  sandshrew: { name: 'Sand Veil', effect: null },
  snorunt: { name: 'Inner Focus', effect: null },
  bronzor: { name: 'Levitate', effect: 'levitate' },
  cutiefly: { name: 'Honey Gather', effect: null },
  bagon: { name: 'Rock Head', effect: null },
  riolu: { name: 'Steadfast', effect: null },
  gible: { name: 'Rough Skin', effect: null },
  absol: { name: 'Pressure', effect: null },

  // Evolutions of existing roster species (data/evolutions.js) — each
  // keeps a real ability option from its own species, not inherited
  // wholesale from the pre-evolution (Gyarados' real list is genuinely
  // different from Magikarp's, for instance).
  gyarados: { name: 'Intimidate', effect: null },
  alakazam: { name: 'Synchronize', effect: 'synchronize' },
  gengar: { name: 'Levitate', effect: 'levitate' },
  lucario: { name: 'Steadfast', effect: null },
  gabite: { name: 'Rough Skin', effect: null },
  garchomp: { name: 'Rough Skin', effect: null },

  // Harbor District roster
  wingull: { name: 'Keen Eye', effect: null },
  tentacool: { name: 'Clear Body', effect: null },
  krabby: { name: 'Hyper Cutter', effect: null },
  horsea: { name: 'Swift Swim', effect: null },
  chinchou: { name: 'Volt Absorb', effect: null },
  buizel: { name: 'Swift Swim', effect: null },
  pelipper: { name: 'Keen Eye', effect: null },

  // Trainers / rival / league leaders / Director Vance
  kadabra: { name: 'Synchronize', effect: 'synchronize' },
  charjabug: { name: 'Battery', effect: null },
  raichu: { name: 'Static', effect: 'static' },
  golduck: { name: 'Damp', effect: null },
  vivillon: { name: 'Compound Eyes', effect: null },
  bronzong: { name: 'Levitate', effect: 'levitate' },
  honchkrow: { name: 'Insomnia', effect: 'insomnia' },
  haunter: { name: 'Levitate', effect: 'levitate' },
  sandslash: { name: 'Sand Veil', effect: null },
  froslass: { name: 'Snow Cloak', effect: null },

  // Ember Quarter roster + evolutions
  slugma: { name: 'Flame Body', effect: 'flame_body' },
  magcargo: { name: 'Flame Body', effect: 'flame_body' },
  numel: { name: 'Oblivious', effect: null },
  camerupt: { name: 'Magma Armor', effect: null },
  aron: { name: 'Sturdy', effect: 'sturdy' },
  lairon: { name: 'Sturdy', effect: 'sturdy' },
  aggron: { name: 'Sturdy', effect: 'sturdy' },
  rolycoly: { name: 'Steam Engine', effect: null },
  carkol: { name: 'Steam Engine', effect: null },
  coalossal: { name: 'Steam Engine', effect: null },
  litwick: { name: 'Flash Fire', effect: 'flash_fire' },
  lampent: { name: 'Flash Fire', effect: 'flash_fire' },
  torkoal: { name: 'White Smoke', effect: null },
  magnemite: { name: 'Sturdy', effect: 'sturdy' },
  magneton: { name: 'Sturdy', effect: 'sturdy' },
  houndour: { name: 'Flash Fire', effect: 'flash_fire' },
  houndoom: { name: 'Flash Fire', effect: 'flash_fire' },

  // Greenline Terraces roster + evolutions
  oddish: { name: 'Chlorophyll', effect: null },
  gloom: { name: 'Chlorophyll', effect: null },
  hoppip: { name: 'Chlorophyll', effect: null },
  skiploom: { name: 'Chlorophyll', effect: null },
  jumpluff: { name: 'Chlorophyll', effect: null },
  sewaddle: { name: 'Swarm', effect: 'low_hp_boost', boostType: 'Bug' },
  swadloon: { name: 'Leaf Guard', effect: null },
  leavanny: { name: 'Swarm', effect: 'low_hp_boost', boostType: 'Bug' },
  combee: { name: 'Honey Gather', effect: null },
  vespiquen: { name: 'Pressure', effect: null },
  flabébé: { name: 'Flower Veil', effect: null },
  floette: { name: 'Flower Veil', effect: null },
  ralts: { name: 'Synchronize', effect: 'synchronize' },
  kirlia: { name: 'Synchronize', effect: 'synchronize' },
  gardevoir: { name: 'Synchronize', effect: 'synchronize' },
  heracross: { name: 'Guts', effect: 'guts' },
  pinsir: { name: 'Hyper Cutter', effect: null },

  // Signal District roster + evolutions (Static/Sturdy are the wired ones)
  elekid: { name: 'Static', effect: 'static' },
  electabuzz: { name: 'Static', effect: 'static' },
  joltik: { name: 'Compound Eyes', effect: null },
  galvantula: { name: 'Compound Eyes', effect: null },
  klink: { name: 'Plus', effect: null },
  klang: { name: 'Plus', effect: null },
  pawniard: { name: 'Defiant', effect: null },
  bisharp: { name: 'Defiant', effect: null },
  mareep: { name: 'Static', effect: 'static' },
  flaaffy: { name: 'Static', effect: 'static' },
  ampharos: { name: 'Static', effect: 'static' },
  electrike: { name: 'Static', effect: 'static' },
  manectric: { name: 'Static', effect: 'static' },
  skarmory: { name: 'Sturdy', effect: 'sturdy' },

  // Undercity roster + evolutions (Levitate/Insomnia are the wired ones)
  zubat: { name: 'Inner Focus', effect: null },
  golbat: { name: 'Inner Focus', effect: null },
  sableye: { name: 'Keen Eye', effect: null },
  drilbur: { name: 'Sand Rush', effect: null },
  excadrill: { name: 'Sand Rush', effect: null },
  koffing: { name: 'Levitate', effect: 'levitate' },
  weezing: { name: 'Levitate', effect: 'levitate' },
  shuppet: { name: 'Insomnia', effect: 'insomnia' },
  banette: { name: 'Insomnia', effect: 'insomnia' },
  mawile: { name: 'Hyper Cutter', effect: null },

  // The Sprawl roster + evolutions
  eevee: { name: 'Run Away', effect: null },
  meowth: { name: 'Pickup', effect: null },
  snubbull: { name: 'Intimidate', effect: null },
  granbull: { name: 'Intimidate', effect: null },
  audino: { name: 'Healer', effect: null },
  kangaskhan: { name: 'Scrappy', effect: null },
  clefairy: { name: 'Cute Charm', effect: null },

  // Custom/fictional final legendary — hand-authored, same precedent as its stats/moveset/sprite
  verdanyx: { name: 'Verdant Surge', effect: 'verdant_surge', boostType: 'Grass' }
};

export function abilityFor(speciesName) {
  const a = ABILITIES[speciesName.toLowerCase()];
  if (!a) throw new Error(`Unknown species "${speciesName}" — add it to data/abilities.js`);
  return a;
}
