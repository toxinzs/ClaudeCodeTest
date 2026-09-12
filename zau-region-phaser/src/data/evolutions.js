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
  wingull: { evolvesTo: 'Pelipper', type: 'Water/Flying', emoji: '🦆', method: 'level', level: 25 }
};

export function evolutionFor(speciesName) {
  return EVOLUTIONS[speciesName.toLowerCase()] || null;
}
