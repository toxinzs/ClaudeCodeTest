// Shared move registry — real type/power/category per official game data.
// Single source of truth so a balance change (or a fix like the Tackle
// power drift this replaced) happens in one place instead of N duplicated
// move literals scattered across species/trainer data.
//
// status/statusChance mirror each move's real secondary/primary status
// effect (burn/poison/paralyze/sleep — the four conditions the battle
// engine implements; statusChance omitted means "always", matching a pure
// status move like Hypnosis). Moves whose real effect is a stat-stage
// change (Growl, Sand Attack, String Shot, Mud Slap) or a non-implemented
// condition (flinch, confusion) are left without one — that's a separate,
// not-yet-built system, not a data gap.
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
  ember:         { type: "Fire",     power: 40,  category: "Special",   status: "burn",    statusChance: 0.1 },
  "flame charge":{ type: "Fire",     power: 50,  category: "Physical" },
  flamethrower:  { type: "Fire",     power: 90,  category: "Special",   status: "burn",    statusChance: 0.1 },
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
  hypnosis:      { type: "Psychic",  power: 0,   category: "Status",    status: "sleep" },
  "bug bite":    { type: "Bug",      power: 60,  category: "Physical" },
  confusion:     { type: "Psychic",  power: 50,  category: "Special" },
  teleport:      { type: "Psychic",  power: 0,   category: "Status" },
  scratch:       { type: "Normal",   power: 40,  category: "Physical" },
  peck:          { type: "Flying",   power: 35,  category: "Physical" },
  "thunder shock":{ type: "Electric",power: 40,  category: "Special",   status: "paralyze", statusChance: 0.1 },
  "poison sting":{ type: "Poison",   power: 15,  category: "Physical",  status: "poison",  statusChance: 0.3 },
  "mud slap":    { type: "Ground",   power: 20,  category: "Special" },
  "ice shard":   { type: "Ice",      power: 40,  category: "Physical" },
  "metal claw":  { type: "Steel",    power: 50,  category: "Physical" },
  "fairy wind":  { type: "Fairy",    power: 40,  category: "Special" },
  "dragon breath":{ type: "Dragon",  power: 60,  category: "Special",   status: "paralyze", statusChance: 0.3 },
  smog:          { type: "Poison",   power: 30,  category: "Special",   status: "poison",  statusChance: 0.4 },
  astonish:      { type: "Ghost",    power: 30,  category: "Physical" },
  "smack down":  { type: "Rock",     power: 50,  category: "Physical" },
  absorb:        { type: "Grass",    power: 20,  category: "Special" },
  acid:          { type: "Poison",   power: 40,  category: "Special" },
  "razor leaf":  { type: "Grass",    power: 55,  category: "Physical" },
  gust:          { type: "Flying",   power: 40,  category: "Special" },
  "vine whip":   { type: "Grass",    power: 45,  category: "Physical" },
  "disarming voice":{ type: "Fairy", power: 40,  category: "Special" },
  "horn attack": { type: "Normal",   power: 65,  category: "Physical" },
  "vise grip":   { type: "Normal",   power: 55,  category: "Physical" }
};

export function moveFor(name) {
  const m = MOVES[name.toLowerCase()];
  if (!m) throw new Error(`Unknown move "${name}" — add it to data/moves.js`);
  return { name, ...m };
}
