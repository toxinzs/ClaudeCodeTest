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
      { lvl: 1, name: "Tackle", type: "Normal", power: 14 },
      { lvl: 1, name: "Growl", type: "Normal", power: 8 },
      { lvl: 6, name: "Leafage", type: "Grass", power: 18 },
      { lvl: 11, name: "Bite", type: "Dark", power: 20 },
      { lvl: 16, name: "Leaf Blade", type: "Grass", power: 28 },
      { lvl: 22, name: "Slash", type: "Normal", power: 26 },
      { lvl: 28, name: "Night Slash", type: "Dark", power: 30 },
      { lvl: 36, name: "Flower Trick", type: "Grass", power: 38 },
      { lvl: 42, name: "Leaf Storm", type: "Grass", power: 42 }
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
      { lvl: 1, name: "Tackle", type: "Normal", power: 14 },
      { lvl: 1, name: "Ember", type: "Fire", power: 18 },
      { lvl: 6, name: "Bite", type: "Dark", power: 20 },
      { lvl: 11, name: "Flame Charge", type: "Fire", power: 22 },
      { lvl: 16, name: "Flamethrower", type: "Fire", power: 28 },
      { lvl: 22, name: "Crunch", type: "Dark", power: 26 },
      { lvl: 28, name: "Slash", type: "Normal", power: 28 },
      { lvl: 36, name: "Torch Song", type: "Fire", power: 38 },
      { lvl: 42, name: "Flare Blitz", type: "Fire", power: 44 }
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
      { lvl: 1, name: "Tackle", type: "Normal", power: 14 },
      { lvl: 1, name: "Water Gun", type: "Water", power: 18 },
      { lvl: 6, name: "Quick Attack", type: "Normal", power: 16 },
      { lvl: 11, name: "Aqua Jet", type: "Water", power: 20 },
      { lvl: 16, name: "Double Hit", type: "Normal", power: 22 },
      { lvl: 22, name: "Aerial Ace", type: "Flying", power: 26 },
      { lvl: 28, name: "Close Combat", type: "Fighting", power: 32 },
      { lvl: 36, name: "Aqua Step", type: "Water", power: 38 },
      { lvl: 42, name: "Hydro Pump", type: "Water", power: 44 }
    ]
  }
};
export const EVOLVE_LEVEL_1 = 16;
export const EVOLVE_LEVEL_2 = 36;

// Wild Pokémon roster (real Pokédex species, mixed gens)
export const WILD_SPECIES = [
  { name: "Caterpie", emoji: "🐛", type: "Bug", baseLvl: [2,5],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"String Shot",type:"Bug",power:8}] },
  { name: "Pidgey", emoji: "🐦", type: "Normal/Flying", baseLvl: [2,6],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Sand Attack",type:"Ground",power:8}] },
  { name: "Rattata", emoji: "🐀", type: "Normal", baseLvl: [2,6],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Quick Attack",type:"Normal",power:16}] },
  { name: "Zigzagoon", emoji: "🦝", type: "Normal", baseLvl: [3,7],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Headbutt",type:"Normal",power:18}] },
  { name: "Bidoof", emoji: "🦫", type: "Normal", baseLvl: [3,7],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Growl",type:"Normal",power:8}] },
  { name: "Lechonk", emoji: "🐖", type: "Normal", baseLvl: [3,8],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Growl",type:"Normal",power:8}] },
  { name: "Starly", emoji: "🐤", type: "Normal/Flying", baseLvl: [4,9],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Quick Attack",type:"Normal",power:16}] },
  { name: "Magikarp", emoji: "🐟", type: "Water", baseLvl: [3,8],
    moves: [{name:"Splash",type:"Water",power:0},{name:"Tackle",type:"Normal",power:12}] },
  { name: "Geodude", emoji: "🪨", type: "Rock/Ground", baseLvl: [5,10],
    moves: [{name:"Tackle",type:"Normal",power:12},{name:"Rock Throw",type:"Rock",power:20}] },
  { name: "Gastly", emoji: "👻", type: "Ghost/Poison", baseLvl: [7,13],
    moves: [{name:"Lick",type:"Ghost",power:16},{name:"Hypnosis",type:"Psychic",power:0}] },
  { name: "Tarountula", emoji: "🕷️", type: "Bug", baseLvl: [6,11],
    moves: [{name:"Bug Bite",type:"Bug",power:20},{name:"String Shot",type:"Bug",power:8}] },
  { name: "Abra", emoji: "🦊", type: "Psychic", baseLvl: [7,13],
    moves: [{name:"Confusion",type:"Psychic",power:20},{name:"Teleport",type:"Psychic",power:0}] },
  { name: "Growlithe", emoji: "🐕", type: "Fire", baseLvl: [8,14],
    moves: [{name:"Ember",type:"Fire",power:18},{name:"Bite",type:"Dark",power:20}] },
  { name: "Psyduck", emoji: "🦆", type: "Water", baseLvl: [8,14],
    moves: [{name:"Water Gun",type:"Water",power:18},{name:"Scratch",type:"Normal",power:14}] },
  { name: "Grubbin", emoji: "🪲", type: "Bug", baseLvl: [9,15],
    moves: [{name:"Bug Bite",type:"Bug",power:20},{name:"Tackle",type:"Normal",power:12}] },
  { name: "Murkrow", emoji: "🐦‍⬛", type: "Dark/Flying", baseLvl: [10,16],
    moves: [{name:"Peck",type:"Flying",power:14},{name:"Bite",type:"Dark",power:20}] },
  { name: "Pikachu", emoji: "🐿️", type: "Electric", baseLvl: [10,17],
    moves: [{name:"Thunder Shock",type:"Electric",power:18},{name:"Quick Attack",type:"Normal",power:16}] },
  { name: "Ekans", emoji: "🐍", type: "Poison", baseLvl: [11,18],
    moves: [{name:"Poison Sting",type:"Poison",power:16},{name:"Bite",type:"Dark",power:20}] },
  { name: "Sandshrew", emoji: "🐢", type: "Ground", baseLvl: [12,19],
    moves: [{name:"Mud Slap",type:"Ground",power:18},{name:"Scratch",type:"Normal",power:14}] },
  { name: "Snorunt", emoji: "🧊", type: "Ice", baseLvl: [13,20],
    moves: [{name:"Ice Shard",type:"Ice",power:20},{name:"Headbutt",type:"Normal",power:18}] },
  { name: "Bronzor", emoji: "🥉", type: "Steel/Psychic", baseLvl: [14,22],
    moves: [{name:"Metal Claw",type:"Steel",power:22},{name:"Confusion",type:"Psychic",power:20}] },
  { name: "Cutiefly", emoji: "🧚", type: "Bug/Fairy", baseLvl: [15,23],
    moves: [{name:"Fairy Wind",type:"Fairy",power:18},{name:"Bug Bite",type:"Bug",power:20}] },
  { name: "Bagon", emoji: "🐉", type: "Dragon", baseLvl: [18,26],
    moves: [{name:"Ember",type:"Fire",power:18},{name:"Bite",type:"Dark",power:20}] }
];

// Wild encounter tables per zone (by index in WILD_SPECIES)
export const WILD_ZONE_TABLE = {
  outskirts: [0,1,2,3,4,5,6,7],
  underpass: [8,9,10,13],
  harbor: [7,13,17,3],
  district: [11,12,14,15,16,18,19,20,21,22]
};
