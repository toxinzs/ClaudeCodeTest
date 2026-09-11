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

  // Custom/fictional final legendary — hand-authored, same precedent as its stats/moveset/sprite
  verdanyx: { name: 'Verdant Surge', effect: 'verdant_surge', boostType: 'Grass' }
};

export function abilityFor(speciesName) {
  const a = ABILITIES[speciesName.toLowerCase()];
  if (!a) throw new Error(`Unknown species "${speciesName}" — add it to data/abilities.js`);
  return a;
}
