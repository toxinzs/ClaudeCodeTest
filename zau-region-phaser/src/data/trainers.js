import { moveFor } from './moves.js';

// NPC trainers outside the fixed Act 1 lineup / rival / League / Vance
// contexts — the story's "people you fight because of a beat" (Meridian
// Site Security, rival rematches, side-quest gardeners). Started via a
// script step { battle: { trainerKey, returnTo } } (script.js); on a win
// the engine sets `winFlag` in state.story so the scene that gets the
// player back can continue the beat. Keyed, so a beat can reference a
// trainer without carrying the team around.
export const TRAINERS = {
  // STORY.md H2 — Dario has been watching Cargo Row for two days.
  darioHarbor: {
    name: 'Dario Voss', emoji: '😎', reward: 150, winFlag: 'harborDario',
    winMsg: 'Dario, quiet for once: "…Okay. Okay. Tonight, then. The yard."',
    team: [
      { speciesName: 'Murkrow', emoji: '🐦‍⬛', type: 'Dark/Flying', level: 21, moves: [moveFor('Peck'), moveFor('Bite')] },
      { speciesName: 'Gible', emoji: '🦖', type: 'Dragon/Ground', level: 20, moves: [moveFor('Rock Throw'), moveFor('Bite')] },
      { speciesName: 'Raichu', emoji: '🐿️', type: 'Electric', level: 21, moves: [moveFor('Thunder Shock'), moveFor('Quick Attack')] }
    ]
  },
  // STORY.md H3 — the first time the player battles Meridian.
  siteSecurityHarbor: {
    name: 'Site Security Pell', emoji: '🧥', reward: 120, winFlag: 'cargoRow',
    winMsg: 'Pell backs off, radio up. Behind him, the open crate: drill housings, every one stencilled L-0.',
    team: [
      { speciesName: 'Growlithe', emoji: '🐕', type: 'Fire', level: 19, moves: [moveFor('Ember'), moveFor('Bite')] },
      { speciesName: 'Magnemite', emoji: '🧲', type: 'Electric/Steel', level: 20, moves: [moveFor('Thunder Shock'), moveFor('Tackle')] }
    ]
  }
};

// STORY.md E3 — off-shift mill workers in the Boiler Tunnels, battling
// because there's nothing else to do in a blackout.
TRAINERS.millIla = {
  name: 'Mill Worker Ila', emoji: '🔧', reward: 90, winFlag: 'boilerIla',
  winMsg: 'Ila shrugs, grinning: "Fine. Breaker\'s past Dev. He\'s worse than me."',
  team: [
    { speciesName: 'Slugma', emoji: '🌋', type: 'Fire', level: 22, moves: [moveFor('Ember'), moveFor('Rock Throw')] },
    { speciesName: 'Rolycoly', emoji: '🪨', type: 'Rock', level: 22, moves: [moveFor('Smack Down'), moveFor('Tackle')] }
  ]
};
TRAINERS.millDev = {
  name: 'Mill Worker Dev', emoji: '🔧', reward: 100, winFlag: 'boilerDev',
  winMsg: 'Dev, wiping his hands: "Breaker\'s at the end. Don\'t touch the big cable. Nobody knows where it goes."',
  team: [
    { speciesName: 'Aron', emoji: '🦏', type: 'Steel/Rock', level: 23, moves: [moveFor('Metal Claw'), moveFor('Headbutt')] },
    { speciesName: 'Torkoal', emoji: '🐢', type: 'Fire', level: 24, moves: [moveFor('Ember'), moveFor('Smog')] }
  ]
};

// STORY.md S2 — Meridian technicians in the Cable Risers. Not unkind,
// not curious; they'd rather you stopped asking about power draw.
TRAINERS.techOduya = {
  name: 'Technician Oduya', emoji: '🧑‍💻', reward: 110, winFlag: 'risersOduya',
  winMsg: 'Oduya, resetting a breaker with her foot: "Fine. Go up. Don\'t touch the trunk fibre."',
  team: [
    { speciesName: 'Klink', emoji: '⚙️', type: 'Steel', level: 29, moves: [moveFor('Vise Grip'), moveFor('Thunder Shock')] },
    { speciesName: 'Magnemite', emoji: '🧲', type: 'Electric/Steel', level: 30, moves: [moveFor('Thunder Shock'), moveFor('Tackle')] }
  ]
};
TRAINERS.techBrann = {
  name: 'Technician Brann', emoji: '🧑‍💻', reward: 120, winFlag: 'risersBrann',
  winMsg: 'Brann shrugs: "The terminal\'s at the top. Whatever it shows you, I didn\'t see it."',
  team: [
    { speciesName: 'Joltik', emoji: '🕷️', type: 'Bug/Electric', level: 30, moves: [moveFor('Bug Bite'), moveFor('Thunder Wave')] },
    { speciesName: 'Pawniard', emoji: '🗡️', type: 'Dark/Steel', level: 31, moves: [moveFor('Metal Claw'), moveFor('Scratch')] }
  ]
};
// STORY.md S3 — Dario, sponsored, in Meridian colours, better than he's
// ever been. His Murkrow evolved (a Dusk Stone was the first thing the
// sponsorship bought).
TRAINERS.darioSignal = {
  name: 'Dario Voss', emoji: '😎', reward: 220, winFlag: 'signalDario',
  winMsg: 'Dario stares at your Absol\'s stone, not at you. "Where did you get that." Behind him, Halloran writes something down.',
  team: [
    { speciesName: 'Honchkrow', emoji: '🐦‍⬛', type: 'Dark/Flying', level: 31, moves: [moveFor('Bite'), moveFor('Peck')] },
    { speciesName: 'Gabite', emoji: '🐲', type: 'Dragon/Ground', level: 30, moves: [moveFor('Dragon Breath'), moveFor('Bite')] },
    { speciesName: 'Raichu', emoji: '🐿️', type: 'Electric', level: 31, moves: [moveFor('Thunder Shock'), moveFor('Quick Attack')] }
  ]
};

// STORY.md U1 — tunnel dwellers. They chose down over up.
TRAINERS.dwellerNyx = {
  name: 'Tunnel Dweller Nyx', emoji: '🕯️', reward: 130, winFlag: 'oldlinesNyx',
  winMsg: 'Nyx relights her candle. "First one from up top who asked instead of told. Go on. Halvard\'s past the second gate."',
  team: [
    { speciesName: 'Zubat', emoji: '🦇', type: 'Poison/Flying', level: 32, moves: [moveFor('Bite'), moveFor('Astonish')] },
    { speciesName: 'Sableye', emoji: '💎', type: 'Dark/Ghost', level: 33, moves: [moveFor('Shadow Sneak'), moveFor('Scratch')] }
  ]
};
TRAINERS.dwellerCass = {
  name: 'Tunnel Dweller Cass', emoji: '🕯️', reward: 140, winFlag: 'oldlinesCass',
  winMsg: 'Cass shrugs: "The Vault\'s up the platform stairs. Obsidian already knows you\'re coming. She always does."',
  team: [
    { speciesName: 'Koffing', emoji: '☁️', type: 'Poison', level: 33, moves: [moveFor('Smog'), moveFor('Tackle')] },
    { speciesName: 'Drilbur', emoji: '🐹', type: 'Ground', level: 34, moves: [moveFor('Mud Slap'), moveFor('Metal Claw')] }
  ]
};

// STORY.md SP1 — rival battle 4, the angriest one. Told his mother is
// alive, he doesn't believe it, and fights like it.
TRAINERS.darioSprawl = {
  name: 'Dario Voss', emoji: '😎', reward: 300, winFlag: 'sprawlDario',
  winMsg: 'Dario goes quiet and short, the way he does when something lands. "…Where." You tell him. He leaves without another word.',
  team: [
    { speciesName: 'Honchkrow', emoji: '🐦‍⬛', type: 'Dark/Flying', level: 37, moves: [moveFor('Bite'), moveFor('Aerial Ace')] },
    { speciesName: 'Gabite', emoji: '🐲', type: 'Dragon/Ground', level: 36, moves: [moveFor('Dragon Breath'), moveFor('Bite')] },
    { speciesName: 'Lucario', emoji: '🥋', type: 'Fighting/Steel', level: 36, moves: [moveFor('Close Combat'), moveFor('Metal Claw')] },
    { speciesName: 'Raichu', emoji: '🐿️', type: 'Electric', level: 37, moves: [moveFor('Thunder Shock'), moveFor('Quick Attack')] }
  ]
};
// Sprawl residents — Meridian is their landlord, and they like it fine.
TRAINERS.residentJae = {
  name: 'Resident Jae', emoji: '🏙️', reward: 150, winFlag: 'sprawlJae',
  winMsg: 'Jae laughs: "Okay, okay. Rooftop\'s yours. Best view of the Tower in the Sprawl — and the storms, when they come."',
  team: [
    { speciesName: 'Meowth', emoji: '🐱', type: 'Normal', level: 35, moves: [moveFor('Scratch'), moveFor('Bite')] },
    { speciesName: 'Eevee', emoji: '🦊', type: 'Normal', level: 35, moves: [moveFor('Quick Attack'), moveFor('Tackle')] }
  ]
};

export function trainerFor(key) {
  const t = TRAINERS[key];
  if (!t) throw new Error(`Unknown trainer "${key}" — add it to data/trainers.js`);
  return t;
}
