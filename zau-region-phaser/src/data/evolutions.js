// Non-starter evolution chains — starters evolve via STARTER_CHAINS'
// stageIdx (data/pokemon.js), but a caught wild mon just carries a flat
// speciesName with no chain of its own. This is that chain, for the
// handful of species deliberately picked because their final form is a
// real Mega-Evolution-eligible species (see CLAUDE.md's Mega Evolution
// note) — keyed by current species name (lowercase).
//
// Two real evolution methods:
// - "level": a level-up threshold, same real numbers as the games.
// - "item": Kadabra->Alakazam and Haunter->Gengar are real TRADE
//   evolutions — no trading partner exists in a single-player game, so
//   these use the Linking Cord, the actual item Pokémon Legends: Arceus
//   and Scarlet/Violet introduced specifically to let trade-evolution
//   species evolve via item instead. Real solution to a real constraint,
//   not an invented shortcut.
const EVOLUTIONS = {
  magikarp: { evolvesTo: 'Gyarados', type: 'Water/Flying', emoji: '🐲', method: 'level', level: 20 },
  abra: { evolvesTo: 'Kadabra', type: 'Psychic', emoji: '🥄', method: 'level', level: 16 },
  kadabra: { evolvesTo: 'Alakazam', type: 'Psychic', emoji: '🥄', method: 'item', item: 'linkingcord' },
  gastly: { evolvesTo: 'Haunter', type: 'Ghost/Poison', emoji: '👻', method: 'level', level: 25 },
  haunter: { evolvesTo: 'Gengar', type: 'Ghost/Poison', emoji: '👻', method: 'item', item: 'linkingcord' },
  // Riolu->Lucario's real condition is high friendship, not a level — no
  // friendship stat exists here, so this simplifies to a flat level
  // threshold, same precedent as the starter chains' level-only evolution.
  riolu: { evolvesTo: 'Lucario', type: 'Fighting/Steel', emoji: '🥋', method: 'level', level: 20 },
  gible: { evolvesTo: 'Gabite', type: 'Dragon/Ground', emoji: '🐲', method: 'level', level: 24 },
  gabite: { evolvesTo: 'Garchomp', type: 'Dragon/Ground', emoji: '🦈', method: 'level', level: 48 },
  wingull: { evolvesTo: 'Pelipper', type: 'Water/Flying', emoji: '🦆', method: 'level', level: 25 },

  // Ember Quarter lines — real level thresholds. Lampent->Chandelure
  // (Dusk Stone) and Magneton->Magnezone (Thunder Stone in SV) are real
  // stone evolutions with no stone item in the game yet, so those two
  // lines stop at their middle stage until evolution stones exist.
  slugma: { evolvesTo: 'Magcargo', type: 'Fire/Rock', emoji: '🌋', method: 'level', level: 38 },
  numel: { evolvesTo: 'Camerupt', type: 'Fire/Ground', emoji: '🐪', method: 'level', level: 33 },
  aron: { evolvesTo: 'Lairon', type: 'Steel/Rock', emoji: '🦏', method: 'level', level: 32 },
  lairon: { evolvesTo: 'Aggron', type: 'Steel/Rock', emoji: '🦏', method: 'level', level: 42 },
  rolycoly: { evolvesTo: 'Carkol', type: 'Rock/Fire', emoji: '🪨', method: 'level', level: 18 },
  carkol: { evolvesTo: 'Coalossal', type: 'Rock/Fire', emoji: '🌋', method: 'level', level: 34 },
  litwick: { evolvesTo: 'Lampent', type: 'Ghost/Fire', emoji: '🕯️', method: 'level', level: 41 },
  magnemite: { evolvesTo: 'Magneton', type: 'Electric/Steel', emoji: '🧲', method: 'level', level: 30 },
  houndour: { evolvesTo: 'Houndoom', type: 'Dark/Fire', emoji: '🐕‍🦺', method: 'level', level: 24 },

  // Greenline Terraces lines — real level thresholds. Gloom->Vileplume/
  // Bellossom (Leaf/Sun Stone) and Floette->Florges (Shiny Stone) are
  // real stone evolutions with no stone item yet, so those lines stop
  // there for now. Swadloon->Leavanny is a real friendship evolution,
  // simplified to a level like Riolu.
  oddish: { evolvesTo: 'Gloom', type: 'Grass/Poison', emoji: '🥀', method: 'level', level: 21 },
  hoppip: { evolvesTo: 'Skiploom', type: 'Grass/Flying', emoji: '🌸', method: 'level', level: 18 },
  skiploom: { evolvesTo: 'Jumpluff', type: 'Grass/Flying', emoji: '🌾', method: 'level', level: 27 },
  sewaddle: { evolvesTo: 'Swadloon', type: 'Bug/Grass', emoji: '🍃', method: 'level', level: 20 },
  swadloon: { evolvesTo: 'Leavanny', type: 'Bug/Grass', emoji: '🦗', method: 'level', level: 30 },
  combee: { evolvesTo: 'Vespiquen', type: 'Bug/Flying', emoji: '🐝', method: 'level', level: 21 },
  flabébé: { evolvesTo: 'Floette', type: 'Fairy', emoji: '🌼', method: 'level', level: 19 },
  ralts: { evolvesTo: 'Kirlia', type: 'Psychic/Fairy', emoji: '🧝', method: 'level', level: 20 },
  kirlia: { evolvesTo: 'Gardevoir', type: 'Psychic/Fairy', emoji: '👗', method: 'level', level: 30 },

  // Signal District lines — real level thresholds (Electabuzz->Electivire
  // and Klang->Klinklang are stone/level-later evolutions left for now).
  elekid: { evolvesTo: 'Electabuzz', type: 'Electric', emoji: '🔌', method: 'level', level: 30 },
  joltik: { evolvesTo: 'Galvantula', type: 'Bug/Electric', emoji: '🕷️', method: 'level', level: 36 },
  klink: { evolvesTo: 'Klang', type: 'Steel', emoji: '⚙️', method: 'level', level: 38 },
  pawniard: { evolvesTo: 'Bisharp', type: 'Dark/Steel', emoji: '🗡️', method: 'level', level: 52 },
  mareep: { evolvesTo: 'Flaaffy', type: 'Electric', emoji: '🐑', method: 'level', level: 15 },
  flaaffy: { evolvesTo: 'Ampharos', type: 'Electric', emoji: '🐑', method: 'level', level: 30 },
  electrike: { evolvesTo: 'Manectric', type: 'Electric', emoji: '🐕', method: 'level', level: 26 },

  // Undercity lines — real level thresholds (Golbat->Crobat is friendship,
  // left for now).
  zubat: { evolvesTo: 'Golbat', type: 'Poison/Flying', emoji: '🦇', method: 'level', level: 22 },
  drilbur: { evolvesTo: 'Excadrill', type: 'Ground/Steel', emoji: '🐹', method: 'level', level: 31 },
  koffing: { evolvesTo: 'Weezing', type: 'Poison', emoji: '☁️', method: 'level', level: 35 },
  shuppet: { evolvesTo: 'Banette', type: 'Ghost', emoji: '🎭', method: 'level', level: 37 },

  snubbull: { evolvesTo: 'Granbull', type: 'Fairy', emoji: '🐶', method: 'level', level: 23 },

  // Evolution stones (Phase 25) — the real stone for each real evolution.
  // A species with several stone options (Gloom, Eevee) lists them all;
  // the Bag offers whichever stone the player is holding.
  lampent: { evolvesTo: 'Chandelure', type: 'Ghost/Fire', emoji: '🕯️', method: 'item', item: 'duskstone' },
  magneton: { evolvesTo: 'Magnezone', type: 'Electric/Steel', emoji: '🧲', method: 'item', item: 'thunderstone' },
  gloom: [
    { evolvesTo: 'Vileplume', type: 'Grass/Poison', emoji: '🌺', method: 'item', item: 'leafstone' },
    { evolvesTo: 'Bellossom', type: 'Grass', emoji: '🌼', method: 'item', item: 'sunstone' }
  ],
  floette: { evolvesTo: 'Florges', type: 'Fairy', emoji: '💐', method: 'item', item: 'shinystone' },
  eevee: [
    { evolvesTo: 'Vaporeon', type: 'Water', emoji: '🐬', method: 'item', item: 'waterstone' },
    { evolvesTo: 'Jolteon', type: 'Electric', emoji: '⚡', method: 'item', item: 'thunderstone' },
    { evolvesTo: 'Flareon', type: 'Fire', emoji: '🔥', method: 'item', item: 'firestone' }
  ],
  murkrow: { evolvesTo: 'Honchkrow', type: 'Dark/Flying', emoji: '🐦‍⬛', method: 'item', item: 'duskstone' },
  clefairy: { evolvesTo: 'Clefable', type: 'Fairy', emoji: '🌙', method: 'item', item: 'moonstone' }
};

function entries(speciesName) {
  const e = EVOLUTIONS[speciesName.toLowerCase()];
  if (!e) return [];
  return Array.isArray(e) ? e : [e];
}

// The level-up evolution for a species (or, if it only has one item
// evolution, that one — the Bag checks `method` before using it).
export function evolutionFor(speciesName) {
  const all = entries(speciesName);
  return all.find(e => e.method === 'level') || all[0] || null;
}

// Every item-triggered evolution for a species (stones, the Linking Cord).
export function itemEvolutionsFor(speciesName) {
  return entries(speciesName).filter(e => e.method === 'item');
}
