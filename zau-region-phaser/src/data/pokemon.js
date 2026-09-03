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
    moves: [moveFor("Ember"), moveFor("Bite")] }
];

// Wild encounter tables per zone (by index in WILD_SPECIES)
export const WILD_ZONE_TABLE = {
  outskirts: [0,1,2,3,4,5,6,7],
  underpass: [8,9,10,13],
  harbor: [7,13,17,3],
  district: [11,12,14,15,16,18,19,20,21,22]
};
