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
    moves: [moveFor("Vise Grip"), moveFor("Double Hit")] }
];

// Wild encounter tables per zone (by index in WILD_SPECIES)
export const WILD_ZONE_TABLE = {
  outskirts: [0,1,2,3,4,5,6,7,23,24,25],
  underpass: [8,9,10,13],
  // Wingull/Buizel common (listed twice), Pelipper the rare "you got lucky" spawn.
  harbor: [26,26,27,28,29,30,31,31,7,32],
  // Slugma/Rolycoly common, Torkoal uncommon, Houndour the rare spawn.
  ember: [33,33,34,35,36,36,37,38,39,40],
  // Oddish/Hoppip common, Cutiefly (21) shared with the Outskirts,
  // Heracross uncommon, Pinsir the rare spawn.
  greenline: [41,41,42,42,43,44,45,46,21,47,48],
  district: [11,12,14,15,16,18,19,20,21,22]
};
