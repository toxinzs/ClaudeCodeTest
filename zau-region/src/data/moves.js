// Shared move registry — real type/power/category per official game data.
// Single source of truth so a balance change (or a fix like the Tackle
// power drift this replaced) happens in one place instead of N duplicated
// move literals scattered across species/trainer data.
const MOVES = {
  tackle:        { type: "Normal",   power: 40,  category: "Physical" },
  growl:         { type: "Normal",   power: 0,   category: "Status" },
  leafage:       { type: "Grass",    power: 40,  category: "Physical" },
  bite:          { type: "Dark",     power: 60,  category: "Physical" },
  "leaf blade":  { type: "Grass",    power: 90,  category: "Physical" },
  slash:         { type: "Normal",   power: 70,  category: "Physical" },
  "night slash": { type: "Dark",     power: 70,  category: "Physical" },
  "flower trick":{ type: "Grass",    power: 70,  category: "Physical" },
  "leaf storm":  { type: "Grass",    power: 130, category: "Special" },
  ember:         { type: "Fire",     power: 40,  category: "Special" },
  "flame charge":{ type: "Fire",     power: 50,  category: "Physical" },
  flamethrower:  { type: "Fire",     power: 90,  category: "Special" },
  crunch:        { type: "Dark",     power: 80,  category: "Physical" },
  "torch song":  { type: "Fire",     power: 80,  category: "Special" },
  "flare blitz": { type: "Fire",     power: 120, category: "Physical" },
  "water gun":   { type: "Water",    power: 40,  category: "Special" },
  "quick attack":{ type: "Normal",   power: 40,  category: "Physical" },
  "aqua jet":    { type: "Water",    power: 40,  category: "Physical" },
  "double hit":  { type: "Normal",   power: 35,  category: "Physical" },
  "aerial ace":  { type: "Flying",   power: 60,  category: "Physical" },
  "close combat":{ type: "Fighting", power: 120, category: "Physical" },
  "aqua step":   { type: "Water",    power: 80,  category: "Physical" },
  "hydro pump":  { type: "Water",    power: 110, category: "Special" },
  "string shot": { type: "Bug",      power: 0,   category: "Status" },
  "sand attack": { type: "Ground",   power: 0,   category: "Status" },
  headbutt:      { type: "Normal",   power: 70,  category: "Physical" },
  splash:        { type: "Normal",   power: 0,   category: "Status" },
  "rock throw":  { type: "Rock",     power: 50,  category: "Physical" },
  lick:          { type: "Ghost",    power: 30,  category: "Physical" },
  hypnosis:      { type: "Psychic",  power: 0,   category: "Status" },
  "bug bite":    { type: "Bug",      power: 60,  category: "Physical" },
  confusion:     { type: "Psychic",  power: 50,  category: "Special" },
  teleport:      { type: "Psychic",  power: 0,   category: "Status" },
  scratch:       { type: "Normal",   power: 40,  category: "Physical" },
  peck:          { type: "Flying",   power: 35,  category: "Physical" },
  "thunder shock":{ type: "Electric",power: 40,  category: "Special" },
  "poison sting":{ type: "Poison",   power: 15,  category: "Physical" },
  "mud slap":    { type: "Ground",   power: 20,  category: "Special" },
  "ice shard":   { type: "Ice",      power: 40,  category: "Physical" },
  "metal claw":  { type: "Steel",    power: 50,  category: "Physical" },
  "fairy wind":  { type: "Fairy",    power: 40,  category: "Special" },
  "dragon breath":{ type: "Dragon",  power: 60,  category: "Special" }
};

export function moveFor(name) {
  const m = MOVES[name.toLowerCase()];
  if (!m) throw new Error(`Unknown move "${name}" — add it to data/moves.js`);
  return { name, ...m };
}
