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

export function trainerFor(key) {
  const t = TRAINERS[key];
  if (!t) throw new Error(`Unknown trainer "${key}" — add it to data/trainers.js`);
  return t;
}
