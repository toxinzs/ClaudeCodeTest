import { moveFor } from './moves.js';

// ================== ACT 1: WILD ZONE TRAINERS ==================
export const TRAINER_LINEUP = [
  { name: "Camper Reyes", locationName: "Zau Outskirts", emoji: "🧢", team: [
    { speciesName: "Rattata", emoji: "🐀", type: "Normal", level: 5, moves: [moveFor("Tackle"), moveFor("Quick Attack")] }
  ]},
  { name: "Cyclist Dana", locationName: "Underpass Loop", emoji: "🚲", team: [
    { speciesName: "Pikachu", emoji: "🐿️", type: "Electric", level: 7, moves: [moveFor("Thunder Shock"), moveFor("Quick Attack")] }
  ]},
  { name: "Skater Milo", locationName: "Harbor Steps", emoji: "🛹", team: [
    { speciesName: "Psyduck", emoji: "🦆", type: "Water", level: 9, moves: [moveFor("Water Gun"), moveFor("Scratch")] }
  ]},
  { name: "Busker Talia", locationName: "Midblock Plaza", emoji: "🎸", team: [
    { speciesName: "Kadabra", emoji: "🥄", type: "Psychic", level: 11, moves: [moveFor("Confusion"), moveFor("Teleport")] }
  ]},
  { name: "Courier Zeke", locationName: "Rooftop District", emoji: "📦", team: [
    { speciesName: "Charjabug", emoji: "🪲", type: "Bug/Electric", level: 13, moves: [moveFor("Bug Bite"), moveFor("Thunder Shock")] }
  ]}
];

// ================== RIVAL ==================
export const RIVAL_DARIO = { name: "Dario Voss", emoji: "😎", locationName: "Rival Battle", team: [
  { speciesName: "Murkrow", emoji: "🐦‍⬛", type: "Dark/Flying", level: 16, moves: [moveFor("Bite"), moveFor("Peck")] },
  { speciesName: "Raichu", emoji: "🐿️", type: "Electric", level: 16, moves: [moveFor("Thunder Shock"), moveFor("Quick Attack")] }
]};

// ================== ACT 2: ZAU LEAGUE ==================
export const LEAGUE_LEADERS = [
  { name: "Leader Coral", locationName: "Harbor Gym", emoji: "🌊", type: "Water", team: [
    { speciesName: "Golduck", emoji: "🐟", type: "Water", level: 20, moves: [moveFor("Water Gun"), moveFor("Scratch")] },
    { speciesName: "Quaxwell", emoji: "🦢", type: "Water", level: 22, moves: [moveFor("Aqua Jet"), moveFor("Double Hit")] }
  ]},
  { name: "Leader Ashgrave", locationName: "Ember Quarter", emoji: "🔥", type: "Fire", team: [
    { speciesName: "Growlithe", emoji: "🔥", type: "Fire", level: 24, moves: [moveFor("Ember"), moveFor("Bite")] },
    { speciesName: "Crocalor", emoji: "🔥", type: "Fire", level: 26, moves: [moveFor("Flame Charge"), moveFor("Bite")] }
  ]},
  { name: "Leader Thistle", locationName: "Greenline Terraces", emoji: "🌿", type: "Grass", team: [
    { speciesName: "Floragato", emoji: "🐈", type: "Grass", level: 27, moves: [moveFor("Leaf Blade"), moveFor("Bite")] },
    { speciesName: "Vivillon", emoji: "🦋", type: "Bug/Flying", level: 28, moves: [moveFor("Bug Bite"), moveFor("Aerial Ace")] }
  ]},
  { name: "Leader Prism", locationName: "Signal Tower", emoji: "⚡", type: "Electric", team: [
    { speciesName: "Raichu", emoji: "🐿️", type: "Electric", level: 29, moves: [moveFor("Thunder Shock"), moveFor("Quick Attack")] },
    { speciesName: "Bronzong", emoji: "🥉", type: "Steel/Psychic", level: 30, moves: [moveFor("Metal Claw"), moveFor("Confusion")] }
  ]},
  { name: "Leader Obsidian", locationName: "Undercity Vault", emoji: "🌑", type: "Dark", team: [
    { speciesName: "Honchkrow", emoji: "🐦‍⬛", type: "Dark/Flying", level: 32, moves: [moveFor("Bite"), moveFor("Peck")] },
    { speciesName: "Haunter", emoji: "👻", type: "Ghost/Poison", level: 33, moves: [moveFor("Lick"), moveFor("Hypnosis")] }
  ]}
];

// ================== ACT 3: MERIDIAN DYNAMICS ==================
export const DIRECTOR_VANCE = { name: "Director Vance", emoji: "🕴️", locationName: "Meridian Tower", team: [
  { speciesName: "Bronzong", emoji: "🥉", type: "Steel/Psychic", level: 38, moves: [moveFor("Metal Claw"), moveFor("Confusion")] },
  { speciesName: "Sandslash", emoji: "🐢", type: "Ground", level: 39, moves: [moveFor("Mud Slap"), moveFor("Scratch")] },
  { speciesName: "Froslass", emoji: "🧊", type: "Ice/Ghost", level: 40, moves: [moveFor("Ice Shard"), moveFor("Lick")] }
]};

export const VERDANYX = { name: "Verdanyx", emoji: "🐲", locationName: "The Underlight", team: [
  { speciesName: "Verdanyx", emoji: "🐲", type: "Grass/Dragon", level: 45,
    moves: [moveFor("Leaf Storm"), moveFor("Dragon Breath"), moveFor("Slash")] }
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
