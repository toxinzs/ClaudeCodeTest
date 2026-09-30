import { moveFor } from './moves.js';

export const STARTER_CHAINS = {
  sprigatito: {
    type: "Grass",
    stages: [
      { name: "Sprigatito", emoji: "🐱", category: "Grass Cat Pokémon",
        desc: "It looks like a fresh sprout and always smells faintly sweet, but keep an eye on its claws — they're sharper than they look." },
      { name: "Floragato", emoji: "🐈", category: "Grass Cat Pokémon",
        desc: "More agile and sure of itself now, it can slice through thick vines with a single clean swipe." },
      { name: "Meowscarada", emoji: "🐆", category: "Magician Pokémon",
        desc: "A trickster that moves like a stage magician, weaving flower petals into dazzling, disorienting illusions." }
    ],
    learnset: [
      { lvl: 1, ...moveFor("Tackle") },
      { lvl: 1, ...moveFor("Growl") },
      { lvl: 6, ...moveFor("Leafage") },
      { lvl: 11, ...moveFor("Bite") },
      { lvl: 16, ...moveFor("Leaf Blade") },
      { lvl: 22, ...moveFor("Slash") },
      { lvl: 28, ...moveFor("Night Slash") },
      { lvl: 36, ...moveFor("Flower Trick") },
      { lvl: 42, ...moveFor("Leaf Storm") }
    ]
  },
  fuecoco: {
    type: "Fire",
    stages: [
      { name: "Fuecoco", emoji: "🐊", category: "Fire Croc Pokémon",
        desc: "The flame on its back tells you exactly how it's feeling — the more excited it gets, the higher it burns." },
      { name: "Crocalor", emoji: "🔥", category: "Fire Croc Pokémon",
        desc: "Its cracked, ember-like skin radiates constant heat, and it loves showing off flashy, showy moves." },
      { name: "Skeledirge", emoji: "💀", category: "Singer Pokémon",
        desc: "It sings a low, powerful song from deep in its throat that can calm a crowd — or completely unnerve one." }
    ],
    learnset: [
      { lvl: 1, ...moveFor("Tackle") },
      { lvl: 1, ...moveFor("Ember") },
      { lvl: 6, ...moveFor("Bite") },
      { lvl: 11, ...moveFor("Flame Charge") },
      { lvl: 16, ...moveFor("Flamethrower") },
      { lvl: 22, ...moveFor("Crunch") },
      { lvl: 28, ...moveFor("Slash") },
      { lvl: 36, ...moveFor("Torch Song") },
      { lvl: 42, ...moveFor("Flare Blitz") }
    ]
  },
  quaxly: {
    type: "Water",
    stages: [
      { name: "Quaxly", emoji: "🦆", category: "Duckling Pokémon",
        desc: "Meticulous about every feather, it practices its swimming strokes and footwork every single morning." },
      { name: "Quaxwell", emoji: "🦢", category: "Practicing Pokémon",
        desc: "It drills its footwork constantly, treating every single battle like it's a performance being judged." },
      { name: "Quaquaval", emoji: "💃", category: "Dancer Pokémon",
        desc: "A festival dancer at heart, its kicks land with just as much grace as they do devastating force." }
    ],
    learnset: [
      { lvl: 1, ...moveFor("Tackle") },
      { lvl: 1, ...moveFor("Water Gun") },
      { lvl: 6, ...moveFor("Quick Attack") },
      { lvl: 11, ...moveFor("Aqua Jet") },
      { lvl: 16, ...moveFor("Double Hit") },
      { lvl: 22, ...moveFor("Aerial Ace") },
      { lvl: 28, ...moveFor("Close Combat") },
      { lvl: 36, ...moveFor("Aqua Step") },
      { lvl: 42, ...moveFor("Hydro Pump") }
    ]
  }
};
export const EVOLVE_LEVEL_1 = 16;
export const EVOLVE_LEVEL_2 = 36;

// Wild Pokémon roster (real Pokédex species, mixed gens)
export const WILD_SPECIES = [
  { name: "Caterpie", emoji: "🐛", type: "Bug", baseLvl: [2,5],
    moves: [moveFor("Tackle"), moveFor("String Shot")] },
  { name: "Pidgey", emoji: "🐦", type: "Normal/Flying", baseLvl: [2,6],
    moves: [moveFor("Tackle"), moveFor("Sand Attack")] },
  { name: "Rattata", emoji: "🐀", type: "Normal", baseLvl: [2,6],
    moves: [moveFor("Tackle"), moveFor("Quick Attack")] },
  { name: "Zigzagoon", emoji: "🦝", type: "Normal", baseLvl: [3,7],
    moves: [moveFor("Tackle"), moveFor("Headbutt")] },
  { name: "Bidoof", emoji: "🦫", type: "Normal", baseLvl: [3,7],
    moves: [moveFor("Tackle"), moveFor("Growl")] },
  { name: "Lechonk", emoji: "🐖", type: "Normal", baseLvl: [3,8],
    moves: [moveFor("Tackle"), moveFor("Growl")] },
  { name: "Starly", emoji: "🐤", type: "Normal/Flying", baseLvl: [4,9],
    moves: [moveFor("Tackle"), moveFor("Quick Attack")] },
  { name: "Magikarp", emoji: "🐟", type: "Water", baseLvl: [3,8],
    moves: [moveFor("Splash"), moveFor("Tackle")] },
  { name: "Geodude", emoji: "🪨", type: "Rock/Ground", baseLvl: [5,10],
    moves: [moveFor("Tackle"), moveFor("Rock Throw")] },
  { name: "Gastly", emoji: "👻", type: "Ghost/Poison", baseLvl: [7,13],
    moves: [moveFor("Lick"), moveFor("Hypnosis")] },
  { name: "Tarountula", emoji: "🕷️", type: "Bug", baseLvl: [6,11],
    moves: [moveFor("Bug Bite"), moveFor("String Shot")] },
  { name: "Abra", emoji: "🦊", type: "Psychic", baseLvl: [7,13],
    moves: [moveFor("Confusion"), moveFor("Teleport")] },
  { name: "Growlithe", emoji: "🐕", type: "Fire", baseLvl: [8,14],
    moves: [moveFor("Ember"), moveFor("Bite")] },
  { name: "Psyduck", emoji: "🦆", type: "Water", baseLvl: [8,14],
    moves: [moveFor("Water Gun"), moveFor("Scratch")] },
  { name: "Grubbin", emoji: "🪲", type: "Bug", baseLvl: [9,15],
    moves: [moveFor("Bug Bite"), moveFor("Tackle")] },
  { name: "Murkrow", emoji: "🐦‍⬛", type: "Dark/Flying", baseLvl: [10,16],
    moves: [moveFor("Peck"), moveFor("Bite")] },
  { name: "Pikachu", emoji: "🐿️", type: "Electric", baseLvl: [10,17],
    moves: [moveFor("Thunder Shock"), moveFor("Quick Attack")] },
  { name: "Ekans", emoji: "🐍", type: "Poison", baseLvl: [11,18],
    moves: [moveFor("Poison Sting"), moveFor("Bite")] },
  { name: "Sandshrew", emoji: "🐢", type: "Ground", baseLvl: [12,19],
    moves: [moveFor("Mud Slap"), moveFor("Scratch")] },
  { name: "Snorunt", emoji: "🧊", type: "Ice", baseLvl: [13,20],
    moves: [moveFor("Ice Shard"), moveFor("Headbutt")] },
  { name: "Bronzor", emoji: "🥉", type: "Steel/Psychic", baseLvl: [14,22],
    moves: [moveFor("Metal Claw"), moveFor("Confusion")] },
  { name: "Cutiefly", emoji: "🧚", type: "Bug/Fairy", baseLvl: [15,23],
    moves: [moveFor("Fairy Wind"), moveFor("Bug Bite")] },
  { name: "Bagon", emoji: "🐉", type: "Dragon", baseLvl: [18,26],
    moves: [moveFor("Ember"), moveFor("Bite")] },

  // Rarer mid-tier finds — each picked specifically because its final
  // evolution is a real Mega-Evolution-eligible species (see
  // data/evolutions.js), seeding a real Mega roster for later.
  { name: "Riolu", emoji: "🐾", type: "Fighting", baseLvl: [14,20],
    moves: [moveFor("Close Combat"), moveFor("Quick Attack")] },
  { name: "Gible", emoji: "🦖", type: "Dragon/Ground", baseLvl: [16,22],
    moves: [moveFor("Rock Throw"), moveFor("Bite")] },
  { name: "Absol", emoji: "🐺", type: "Dark", baseLvl: [18,25],
    moves: [moveFor("Night Slash"), moveFor("Bite")] },

  // Harbor District roster (zau-region/districts/harbor.md) — real
  // Water-district species, level band 14-22 (post-Act 1, pre-Coral).
  { name: "Wingull", emoji: "🕊️", type: "Water/Flying", baseLvl: [14,20],
    moves: [moveFor("Water Gun"), moveFor("Peck")] },
  { name: "Tentacool", emoji: "🪼", type: "Water/Poison", baseLvl: [15,21],
    moves: [moveFor("Poison Sting"), moveFor("Water Gun")] },
  { name: "Krabby", emoji: "🦀", type: "Water", baseLvl: [14,20],
    moves: [moveFor("Tackle"), moveFor("Water Gun")] },
  { name: "Horsea", emoji: "🐴", type: "Water", baseLvl: [15,21],
    moves: [moveFor("Water Gun"), moveFor("Tackle")] },
  { name: "Chinchou", emoji: "🔦", type: "Water/Electric", baseLvl: [16,22],
    moves: [moveFor("Thunder Shock"), moveFor("Water Gun")] },
  { name: "Buizel", emoji: "🦦", type: "Water", baseLvl: [14,20],
    moves: [moveFor("Aqua Jet"), moveFor("Quick Attack")] },
  { name: "Pelipper", emoji: "🦆", type: "Water/Flying", baseLvl: [19,22],
    moves: [moveFor("Water Gun"), moveFor("Aerial Ace")] },

  // Ember Quarter roster (indices 33-40) — real Fire/Rock/Steel species
  // for the industrial district, level band post-Coral/pre-Ashgrave per
  // zau-region/districts/ember.md. Aron, Numel and Houndour are the
  // district's Mega seeds (Aggron/Camerupt/Houndoom all have real Megas).
  { name: "Slugma", emoji: "🌋", type: "Fire", baseLvl: [17,23],
    moves: [moveFor("Ember"), moveFor("Rock Throw")] },
  { name: "Numel", emoji: "🐪", type: "Fire/Ground", baseLvl: [17,23],
    moves: [moveFor("Ember"), moveFor("Tackle")] },
  { name: "Aron", emoji: "🦏", type: "Steel/Rock", baseLvl: [18,24],
    moves: [moveFor("Metal Claw"), moveFor("Headbutt")] },
  { name: "Rolycoly", emoji: "🪨", type: "Rock", baseLvl: [16,22],
    moves: [moveFor("Smack Down"), moveFor("Tackle")] },
  { name: "Litwick", emoji: "🕯️", type: "Ghost/Fire", baseLvl: [18,24],
    moves: [moveFor("Ember"), moveFor("Astonish")] },
  { name: "Torkoal", emoji: "🐢", type: "Fire", baseLvl: [20,25],
    moves: [moveFor("Ember"), moveFor("Smog")] },
  { name: "Magnemite", emoji: "🧲", type: "Electric/Steel", baseLvl: [17,23],
    moves: [moveFor("Thunder Shock"), moveFor("Tackle")] },
  { name: "Houndour", emoji: "🐕‍🦺", type: "Dark/Fire", baseLvl: [19,25],
    moves: [moveFor("Ember"), moveFor("Bite")] },

  // Greenline Terraces roster (indices 41-48) — real Grass/Bug/Fairy
  // species for the garden stratum, level band post-Ashgrave/pre-Thistle
  // per zau-region/districts/greenline.md. Ralts, Heracross and Pinsir
  // are the district's Mega seeds.
  { name: "Oddish", emoji: "🍀", type: "Grass/Poison", baseLvl: [21,26],
    moves: [moveFor("Absorb"), moveFor("Acid")] },
  { name: "Hoppip", emoji: "🌸", type: "Grass/Flying", baseLvl: [21,26],
    moves: [moveFor("Tackle"), moveFor("Fairy Wind")] },
  { name: "Sewaddle", emoji: "🍃", type: "Bug/Grass", baseLvl: [22,27],
    moves: [moveFor("Bug Bite"), moveFor("Razor Leaf")] },
  { name: "Combee", emoji: "🐝", type: "Bug/Flying", baseLvl: [21,26],
    moves: [moveFor("Bug Bite"), moveFor("Gust")] },
  { name: "Flabébé", emoji: "🌼", type: "Fairy", baseLvl: [22,27],
    moves: [moveFor("Fairy Wind"), moveFor("Vine Whip")] },
  { name: "Ralts", emoji: "🧝", type: "Psychic/Fairy", baseLvl: [22,27],
    moves: [moveFor("Confusion"), moveFor("Disarming Voice")] },
  { name: "Heracross", emoji: "🪲", type: "Bug/Fighting", baseLvl: [24,28],
    moves: [moveFor("Horn Attack"), moveFor("Aerial Ace")] },
  { name: "Pinsir", emoji: "🦂", type: "Bug", baseLvl: [24,28],
    moves: [moveFor("Vise Grip"), moveFor("Double Hit")] },

  // Signal District roster (indices 49-55) — real Electric/Steel species
  // for the comms stratum, band post-Thistle/pre-Prism per
  // zau-region/districts/signal.md. Mareep and Electrike are the
  // district's Mega seeds (Ampharos/Manectric).
  { name: "Elekid", emoji: "🔌", type: "Electric", baseLvl: [28,33],
    moves: [moveFor("Thunder Shock"), moveFor("Quick Attack")] },
  { name: "Joltik", emoji: "🕷️", type: "Bug/Electric", baseLvl: [28,33],
    moves: [moveFor("Bug Bite"), moveFor("Thunder Wave")] },
  { name: "Klink", emoji: "⚙️", type: "Steel", baseLvl: [28,33],
    moves: [moveFor("Vise Grip"), moveFor("Thunder Shock")] },
  { name: "Pawniard", emoji: "🗡️", type: "Dark/Steel", baseLvl: [29,34],
    moves: [moveFor("Metal Claw"), moveFor("Scratch")] },
  { name: "Mareep", emoji: "🐑", type: "Electric", baseLvl: [28,33],
    moves: [moveFor("Thunder Shock"), moveFor("Tackle")] },
  { name: "Electrike", emoji: "🐕", type: "Electric", baseLvl: [29,34],
    moves: [moveFor("Spark"), moveFor("Quick Attack")] },
  { name: "Skarmory", emoji: "🦅", type: "Steel/Flying", baseLvl: [30,34],
    moves: [moveFor("Peck"), moveFor("Steel Wing")] },

  // Undercity roster (indices 56-61) — real Dark/Ghost/Poison/Ground
  // species for the forgotten stratum, band post-Prism/pre-Obsidian per
  // zau-region/districts/undercity.md. Sableye, Shuppet and Mawile are the
  // Mega seeds (Sableye/Banette/Mawile).
  { name: "Zubat", emoji: "🦇", type: "Poison/Flying", baseLvl: [31,35],
    moves: [moveFor("Bite"), moveFor("Astonish")] },
  { name: "Sableye", emoji: "💎", type: "Dark/Ghost", baseLvl: [32,36],
    moves: [moveFor("Shadow Sneak"), moveFor("Scratch")] },
  { name: "Drilbur", emoji: "🐹", type: "Ground", baseLvl: [31,35],
    moves: [moveFor("Mud Slap"), moveFor("Metal Claw")] },
  { name: "Koffing", emoji: "☁️", type: "Poison", baseLvl: [31,35],
    moves: [moveFor("Smog"), moveFor("Tackle")] },
  { name: "Shuppet", emoji: "🎭", type: "Ghost", baseLvl: [32,36],
    moves: [moveFor("Astonish"), moveFor("Shadow Sneak")] },
  { name: "Mawile", emoji: "🪤", type: "Steel/Fairy", baseLvl: [33,36],
    moves: [moveFor("Bite"), moveFor("Fairy Wind")] },

  // The Sprawl roster (indices 62-67) — the mid-city's ordinary Normal/
  // Fairy neighbours, band Act 3 per zau-region/districts/sprawl.md.
  // Audino and Kangaskhan are the Mega seeds.
  { name: "Eevee", emoji: "🦊", type: "Normal", baseLvl: [34,38],
    moves: [moveFor("Quick Attack"), moveFor("Tackle")] },
  { name: "Meowth", emoji: "🐱", type: "Normal", baseLvl: [34,38],
    moves: [moveFor("Scratch"), moveFor("Bite")] },
  { name: "Snubbull", emoji: "🐶", type: "Fairy", baseLvl: [34,38],
    moves: [moveFor("Bite"), moveFor("Headbutt")] },
  { name: "Audino", emoji: "🩷", type: "Normal", baseLvl: [35,38],
    moves: [moveFor("Take Down"), moveFor("Disarming Voice")] },
  { name: "Kangaskhan", emoji: "🦘", type: "Normal", baseLvl: [36,38],
    moves: [moveFor("Bite"), moveFor("Double Hit")] },
  { name: "Clefairy", emoji: "🌙", type: "Fairy", baseLvl: [34,38],
    moves: [moveFor("Disarming Voice"), moveFor("Pound")] },
  // ============ The Skyline (Phase 27, postgame — districts/skyline.md) ============
  // Real Flying/Dragon lines; Swablu and Bagon (22, shared with the
  // Outskirts) are the Mega-eligible seeds, Dratini the rare climb-reward.
  { name: "Swablu", emoji: "🕊️", type: "Normal/Flying", baseLvl: [48,52],
    moves: [moveFor("Peck"), moveFor("Astonish")] },
  { name: "Altaria", emoji: "☁️", type: "Dragon/Flying", baseLvl: [52,56],
    moves: [moveFor("Dragon Breath"), moveFor("Aerial Ace")] },
  { name: "Shelgon", emoji: "🐲", type: "Dragon", baseLvl: [50,54],
    moves: [moveFor("Dragon Claw"), moveFor("Headbutt")] },
  { name: "Salamence", emoji: "🐉", type: "Dragon/Flying", baseLvl: [56,58],
    moves: [moveFor("Dragon Claw"), moveFor("Wing Attack")] },
  { name: "Rotom", emoji: "💡", type: "Electric/Ghost", baseLvl: [48,52],
    moves: [moveFor("Thunder Shock"), moveFor("Astonish")] },
  { name: "Dratini", emoji: "🐍", type: "Dragon", baseLvl: [48,50],
    moves: [moveFor("Dragon Breath"), moveFor("Wrap")] },
  { name: "Dragonair", emoji: "🐉", type: "Dragon", baseLvl: [52,55],
    moves: [moveFor("Dragon Breath"), moveFor("Slam")] },
  { name: "Dragonite", emoji: "🐲", type: "Dragon/Flying", baseLvl: [56,60],
    moves: [moveFor("Dragon Claw"), moveFor("Wing Attack")] },
  // ============ The Terminus (Phase 28) ============
  // Ghost-leaning, per districts/undercity.md. Gastly (9), Shuppet (60)
  // and Murkrow (14) are shared with the Undercity; Duskull is new.
  { name: "Duskull", emoji: "👁️", type: "Ghost", baseLvl: [35,40],
    moves: [moveFor("Astonish"), moveFor("Lick")] },
  // Phase 29: Thistle fields Vivillon, so the line has to be catchable.
  { name: "Scatterbug", emoji: "🐛", type: "Bug", baseLvl: [9,14],
    moves: [moveFor("Tackle"), moveFor("String Shot")] }
];

// Wild encounter tables per zone, keyed by species NAME (resolved through
// SPECIES_BY_NAME). They used to be positions in WILD_SPECIES, which is how
// Murkrow/Grubbin got swapped in the Old Lines and a stray Shelgon got into
// the Skyline — inserting or reordering a species silently re-pointed every
// table after it. Names can't drift. A name listed twice is twice as
// common; tools/audit-roster.mjs checks every name resolves.
// A zone's own level band, where it has one. Several species appear in
// more than one district (Bagon in the Outskirts and again on the Skyline,
// Skarmory in Signal and again on the Skyline), and a species' own
// baseLvl is the band of the *first* place it was written for — so a
// postgame zone has to say what level its encounters are, or the Skyline
// would spawn the Outskirts' Lv.18 Bagon next to a Lv.60 Verdanyx.
// Zones without an entry just use each species' own baseLvl.
export const WILD_ZONE_LEVELS = {
  skyline: [48, 60],
  terminus: [35, 40],
  // The Wild Zone Trail's two stages (TrailScene): Act 1 is 5-18.
  underpass: [5, 13],
  district: [9, 18],
  // Undercity band per districts/undercity.md (31-36): its shared species
  // (Gastly, Murkrow) otherwise spawn at their Outskirts levels.
  oldlines: [31, 36],
  undercity: [31, 36]
};

export const WILD_ZONE_TABLE = {
  outskirts: ["Caterpie", "Pidgey", "Rattata", "Zigzagoon", "Bidoof", "Lechonk", "Starly", "Magikarp", "Riolu", "Gible", "Absol"],
    underpass: ["Geodude", "Gastly", "Tarountula", "Psyduck", "Ekans"],
  // Wingull/Buizel common (listed twice), Pelipper the rare "you got lucky" spawn.
  harbor: ["Wingull", "Wingull", "Tentacool", "Krabby", "Horsea", "Chinchou", "Buizel", "Buizel", "Magikarp", "Pelipper"],
  // Slugma/Rolycoly common, Torkoal uncommon, Houndour the rare spawn.
  ember: ["Slugma", "Slugma", "Numel", "Aron", "Rolycoly", "Rolycoly", "Litwick", "Torkoal", "Magnemite", "Houndour"],
  // Oddish/Hoppip common, Cutiefly shared with the Outskirts,
  // Heracross uncommon, Pinsir the rare spawn.
  greenline: ["Oddish", "Oddish", "Hoppip", "Hoppip", "Sewaddle", "Combee", "Flabébé", "Ralts", "Cutiefly", "Heracross", "Pinsir"],
  // Boiler Tunnels: the Ember roster's cave-dwellers, no Numel/Magnemite/Houndour.
  boiler: ["Slugma", "Slugma", "Rolycoly", "Rolycoly", "Aron", "Litwick", "Torkoal"],
  // Signal: Magnemite shared with Ember; Electrike rare, Skarmory rarer.
  signal: ["Elekid", "Joltik", "Klink", "Pawniard", "Mareep", "Mareep", "Magnemite", "Magnemite", "Electrike", "Skarmory"],
  // The Cable Risers: the data centre's shafts — Klink/Magnemite country.
  risers: ["Klink", "Klink", "Magnemite", "Magnemite", "Joltik", "Pawniard"],
  // The Old Lines (dungeon) and the Undercity hub: Gastly and Murkrow
  // shared; Shuppet uncommon, Mawile rare.
  oldlines: ["Zubat", "Zubat", "Sableye", "Drilbur", "Koffing", "Gastly", "Murkrow", "Shuppet", "Mawile"],
  undercity: ["Zubat", "Sableye", "Koffing", "Gastly", "Shuppet", "Mawile"],
  // The Sprawl: mostly a place, not a hunting ground — Kangaskhan rare.
  sprawl: ["Eevee", "Eevee", "Meowth", "Meowth", "Snubbull", "Audino", "Clefairy", "Clefairy", "Kangaskhan"],
  // The Skyline (postgame, band 48-60): Swablu common, Bagon shared
  // with the Outskirts, Skarmory shared with Signal, Dratini rare.
  skyline: ["Swablu", "Swablu", "Swablu", "Bagon", "Bagon", "Skarmory", "Rotom", "Rotom", "Dratini"],
  // The Terminus: Gastly/Shuppet common, Duskull the local specialty, Murkrow rare.
  terminus: ["Gastly", "Gastly", "Shuppet", "Shuppet", "Duskull", "Duskull", "Murkrow"],
  district: ["Abra", "Growlithe", "Grubbin", "Murkrow", "Pikachu", "Sandshrew", "Snorunt", "Bronzor", "Cutiefly", "Bagon", "Scatterbug"]
};

export const SPECIES_BY_NAME = Object.fromEntries(WILD_SPECIES.map(sp => [sp.name, sp]));

// Every zone a species spawns in, for the Pokédex's "where found" line.
export function zonesForSpecies(name) {
  return Object.keys(WILD_ZONE_TABLE).filter(z => WILD_ZONE_TABLE[z].includes(name));
}

// Display names for the Pokédex's "where found" line.
export const ZONE_LABELS = {
  outskirts: 'Town Outskirts',
  underpass: 'Wild Zone Trail (Underpass)',
  district: 'Wild Zone Trail (District)',
  harbor: 'Harbor District',
  ember: 'Ember Quarter',
  boiler: 'Boiler Tunnels',
  greenline: 'Greenline Terraces',
  signal: 'Signal District',
  risers: 'Cable Risers',
  oldlines: 'The Old Lines',
  undercity: 'The Undercity',
  terminus: 'The Terminus',
  sprawl: 'The Sprawl',
  skyline: 'The Skyline'
};
