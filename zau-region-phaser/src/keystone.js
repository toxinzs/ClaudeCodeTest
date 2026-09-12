import { state, MAX_PARTY } from './state.js';
import { makeGiftMon, perfectIVs } from './mon.js';
import { moveFor } from './data/moves.js';
import { setFlag } from './story.js';

// STORY.md K2–K3 / MEGA.md: Elena Voss's Key Stone and her Absol. The
// Absol is the guaranteed Mega-eligible Pokémon (the Gen 9 starters can't
// Mega Evolve), built with perfect IVs and its Absolite already held so
// the player can Mega Evolve in the very next battle. Goes to the Box if
// the party is full, same routing as a catch.
export function grantKeyStone() {
  state.hasKeyStone = true;
  const absol = makeGiftMon({
    speciesName: 'Absol', emoji: '🐺', type: 'Dark', level: 30,
    moves: [moveFor('Night Slash'), moveFor('Quick Attack'), moveFor('Bite'), moveFor('Slash')],
    ivs: perfectIVs(), heldItem: 'absolite'
  });
  const toBox = state.party.length >= MAX_PARTY;
  (toBox ? state.box : state.party).push(absol);
  setFlag('absolToBox', toBox);
  setFlag('keyStone');
}
