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

export function trainerFor(key) {
  const t = TRAINERS[key];
  if (!t) throw new Error(`Unknown trainer "${key}" — add it to data/trainers.js`);
  return t;
}
