// ================== ACT 1: WILD ZONE TRAINERS ==================
export const TRAINER_LINEUP = [
  { name: "Camper Reyes", locationName: "Zau Outskirts", emoji: "🧢", team: [
    { speciesName: "Rattata", emoji: "🐀", type: "Normal", level: 5, moves: [{name:"Tackle",type:"Normal",power:12},{name:"Quick Attack",type:"Normal",power:16}] }
  ]},
  { name: "Cyclist Dana", locationName: "Underpass Loop", emoji: "🚲", team: [
    { speciesName: "Pikachu", emoji: "🐿️", type: "Electric", level: 7, moves: [{name:"Thunder Shock",type:"Electric",power:18},{name:"Quick Attack",type:"Normal",power:16}] }
  ]},
  { name: "Skater Milo", locationName: "Harbor Steps", emoji: "🛹", team: [
    { speciesName: "Psyduck", emoji: "🦆", type: "Water", level: 9, moves: [{name:"Water Gun",type:"Water",power:18},{name:"Scratch",type:"Normal",power:14}] }
  ]},
  { name: "Busker Talia", locationName: "Midblock Plaza", emoji: "🎸", team: [
    { speciesName: "Kadabra", emoji: "🥄", type: "Psychic", level: 11, moves: [{name:"Confusion",type:"Psychic",power:24},{name:"Teleport",type:"Psychic",power:0}] }
  ]},
  { name: "Courier Zeke", locationName: "Rooftop District", emoji: "📦", team: [
    { speciesName: "Charjabug", emoji: "🪲", type: "Bug/Electric", level: 13, moves: [{name:"Bug Bite",type:"Bug",power:20},{name:"Thunder Shock",type:"Electric",power:18}] }
  ]}
];

// ================== RIVAL ==================
export const RIVAL_DARIO = { name: "Dario Voss", emoji: "😎", locationName: "Rival Battle", team: [
  { speciesName: "Murkrow", emoji: "🐦‍⬛", type: "Dark/Flying", level: 16, moves: [{name:"Bite",type:"Dark",power:20},{name:"Peck",type:"Flying",power:14}] },
  { speciesName: "Raichu", emoji: "🐿️", type: "Electric", level: 16, moves: [{name:"Thunder Shock",type:"Electric",power:18},{name:"Quick Attack",type:"Normal",power:16}] }
]};

// ================== ACT 2: ZAU LEAGUE ==================
export const LEAGUE_LEADERS = [
  { name: "Leader Coral", locationName: "Harbor Gym", emoji: "🌊", type: "Water", team: [
    { speciesName: "Golduck", emoji: "🐟", type: "Water", level: 20, moves: [{name:"Water Gun",type:"Water",power:18},{name:"Scratch",type:"Normal",power:14}] },
    { speciesName: "Quaxwell", emoji: "🦢", type: "Water", level: 22, moves: [{name:"Aqua Jet",type:"Water",power:20},{name:"Double Hit",type:"Normal",power:22}] }
  ]},
  { name: "Leader Ashgrave", locationName: "Ember Quarter", emoji: "🔥", type: "Fire", team: [
    { speciesName: "Growlithe", emoji: "🔥", type: "Fire", level: 24, moves: [{name:"Ember",type:"Fire",power:18},{name:"Bite",type:"Dark",power:20}] },
    { speciesName: "Crocalor", emoji: "🔥", type: "Fire", level: 26, moves: [{name:"Flame Charge",type:"Fire",power:22},{name:"Bite",type:"Dark",power:20}] }
  ]},
  { name: "Leader Thistle", locationName: "Greenline Terraces", emoji: "🌿", type: "Grass", team: [
    { speciesName: "Floragato", emoji: "🐈", type: "Grass", level: 27, moves: [{name:"Leaf Blade",type:"Grass",power:28},{name:"Bite",type:"Dark",power:20}] },
    { speciesName: "Vivillon", emoji: "🦋", type: "Bug/Flying", level: 28, moves: [{name:"Bug Bite",type:"Bug",power:20},{name:"Aerial Ace",type:"Flying",power:26}] }
  ]},
  { name: "Leader Prism", locationName: "Signal Tower", emoji: "⚡", type: "Electric", team: [
    { speciesName: "Raichu", emoji: "🐿️", type: "Electric", level: 29, moves: [{name:"Thunder Shock",type:"Electric",power:18},{name:"Quick Attack",type:"Normal",power:16}] },
    { speciesName: "Bronzong", emoji: "🥉", type: "Steel/Psychic", level: 30, moves: [{name:"Metal Claw",type:"Steel",power:22},{name:"Confusion",type:"Psychic",power:20}] }
  ]},
  { name: "Leader Obsidian", locationName: "Undercity Vault", emoji: "🌑", type: "Dark", team: [
    { speciesName: "Honchkrow", emoji: "🐦‍⬛", type: "Dark/Flying", level: 32, moves: [{name:"Bite",type:"Dark",power:20},{name:"Peck",type:"Flying",power:14}] },
    { speciesName: "Haunter", emoji: "👻", type: "Ghost/Poison", level: 33, moves: [{name:"Lick",type:"Ghost",power:16},{name:"Hypnosis",type:"Psychic",power:0}] }
  ]}
];

// ================== ACT 3: MERIDIAN DYNAMICS ==================
export const DIRECTOR_VANCE = { name: "Director Vance", emoji: "🕴️", locationName: "Meridian Tower", team: [
  { speciesName: "Bronzong", emoji: "🥉", type: "Steel/Psychic", level: 38, moves: [{name:"Metal Claw",type:"Steel",power:22},{name:"Confusion",type:"Psychic",power:20}] },
  { speciesName: "Sandslash", emoji: "🐢", type: "Ground", level: 39, moves: [{name:"Mud Slap",type:"Ground",power:18},{name:"Scratch",type:"Normal",power:14}] },
  { speciesName: "Froslass", emoji: "🧊", type: "Ice/Ghost", level: 40, moves: [{name:"Ice Shard",type:"Ice",power:20},{name:"Lick",type:"Ghost",power:16}] }
]};

export const VERDANYX = { name: "Verdanyx", emoji: "🐲", locationName: "The Underlight", team: [
  { speciesName: "Verdanyx", emoji: "🐲", type: "Grass/Dragon", level: 45,
    moves: [{name:"Leaf Storm",type:"Grass",power:42},{name:"Dragon Breath",type:"Dragon",power:24},{name:"Slash",type:"Normal",power:26}] }
]};

// ================== CUTSCENE ==================
export const CUTSCENE_SLIDES = [
  "The city of Zau rises in stacked districts, one built on top of the last — Wild Zones tangle beneath overpasses while glass towers climb into the fog above.",
  "Down in the Outskirts, wild Pokémon have run loose for generations, mostly ignored by the corporations that own the skyline.",
  "That's starting to change. Meridian Dynamics has been buying up land near the old transit tunnels, chasing rumors of something asleep beneath the city.",
  "Professor Mabosso runs the last independent lab in Zau, handing starter Pokémon to anyone willing to head into the Wild Zone and prove themselves.",
  "Today, that's you. Your journey through Zau — and whatever's really underneath it — starts now."
];

export function moneyRewardFor(ctx) {
  if (ctx === 'lineup') return 40;
  if (ctx === 'dario') return 100;
  if (ctx === 'league') return 90;
  if (ctx === 'vance') return 200;
  return 0;
}
