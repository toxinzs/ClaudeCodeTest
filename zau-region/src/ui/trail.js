import { state } from '../state.js';
import { TRAINER_LINEUP, RIVAL_DARIO } from '../data/story.js';
import { TRAIL_MAP } from '../data/maps.js';
import { showScreen } from '../screens.js';
import { renderMapGrid } from '../map.js';
import { startTrainerBattle } from '../battle.js';
import { enterLeagueMap } from './league.js';

// Trainers are placed one per row up a straight corridor (x=2), closest
// first; the corridor's far end (y=0) is Dario, then the league gate, once
// each is cleared — same progression state.trainerIndex/darioBeaten already
// tracked, just walked to instead of picked from a list.
const TRAIL_X = 2;
const TRAINER_Y = [10, 8, 6, 4, 2];
const END_Y = 0;

// Decor is progress-dependent (which trainers are already beaten, whether
// Dario or the league gate waits at the end), so it's built fresh on every
// render here rather than living as static data on TRAIL_MAP.
function buildTrailDecor() {
  const decor = TRAINER_LINEUP.map((t, i) => ({
    x: TRAIL_X, y: TRAINER_Y[i],
    emoji: i < state.trainerIndex ? '✅' : t.emoji
  }));
  let endEmoji = '⛔';
  if (state.trainerIndex >= TRAINER_LINEUP.length) {
    endEmoji = state.darioBeaten ? '🚪' : RIVAL_DARIO.emoji;
  }
  decor.push({ x: TRAIL_X, y: END_Y, emoji: endEmoji });
  return decor;
}

export function renderTrailMap() {
  renderMapGrid('trail-grid', { ...TRAIL_MAP, decor: buildTrailDecor() }, state.pos.trail);
}

export function enterTrail() {
  showScreen('trail');
  document.getElementById('header-title').textContent = "WILD ZONE TRAIL";
  renderTrailMap();
}

export function handleTrailStep(x, y) {
  if (x !== TRAIL_X) return;
  const trainerIdx = TRAINER_Y.indexOf(y);
  if (trainerIdx !== -1) {
    if (trainerIdx < state.trainerIndex) {
      document.getElementById('trail-toast').textContent = `You already beat ${TRAINER_LINEUP[trainerIdx].name}.`;
    } else if (trainerIdx === state.trainerIndex) {
      startTrainerBattle('lineup');
    } else {
      document.getElementById('trail-toast').textContent = `Beat the closer trainers first.`;
    }
    return;
  }
  if (y === END_Y) {
    if (state.trainerIndex < TRAINER_LINEUP.length) {
      document.getElementById('trail-toast').textContent = `Something's blocking the way ahead...`;
    } else if (!state.darioBeaten) {
      startTrainerBattle('dario');
    } else {
      enterLeagueMap();
    }
  }
}
