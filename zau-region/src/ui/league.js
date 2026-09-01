import { state } from '../state.js';
import { LEAGUE_LEADERS, DIRECTOR_VANCE } from '../data/story.js';
import { LEAGUE_MAP } from '../data/maps.js';
import { showScreen } from '../screens.js';
import { renderMapGrid } from '../map.js';
import { startTrainerBattle } from '../battle.js';

// Unlike the Trail, leaders can be challenged in any order, so they're
// placed around a hub rather than along a corridor. TOWER_POS starts sealed,
// opens to Director Vance once all 5 are beaten, then to the Underlight
// (Verdanyx) once Vance is beaten too.
const LEADER_POS = [
  { x: 1, y: 1 }, { x: 5, y: 1 },
  { x: 1, y: 5 }, { x: 5, y: 5 },
  { x: 3, y: 3 }
];
const TOWER_POS = { x: 3, y: 1 };

function buildLeagueDecor() {
  const decor = LEAGUE_LEADERS.map((l, i) => ({
    x: LEADER_POS[i].x, y: LEADER_POS[i].y,
    emoji: state.leagueBeaten[i] ? '✅' : l.emoji
  }));
  const clearedCount = state.leagueBeaten.filter(Boolean).length;
  let towerEmoji = '🏙️';
  if (clearedCount >= 5) {
    towerEmoji = !state.vanceBeaten ? DIRECTOR_VANCE.emoji : (!state.verdanyxBeaten ? '🕳️' : '🏆');
  }
  decor.push({ x: TOWER_POS.x, y: TOWER_POS.y, emoji: towerEmoji });
  return decor;
}

export function renderLeagueMap() {
  const clearedCount = state.leagueBeaten.filter(Boolean).length;
  document.getElementById('league-toast').textContent = clearedCount < 5 ? `${clearedCount}/5 leaders cleared` : '';
  renderMapGrid('league-grid', { ...LEAGUE_MAP, decor: buildLeagueDecor() }, state.pos.league);
}

export function enterLeagueMap() {
  showScreen('league-map');
  document.getElementById('header-title').textContent = "ZAU LEAGUE";
  renderLeagueMap();
}

export function selectLeagueLeader(i) {
  state.currentLeagueIdx = i;
  startTrainerBattle('league');
}

export function handleLeagueStep(x, y) {
  const idx = LEADER_POS.findIndex(p => p.x === x && p.y === y);
  if (idx !== -1) {
    if (state.leagueBeaten[idx]) {
      document.getElementById('league-toast').textContent = `You already beat ${LEAGUE_LEADERS[idx].name}.`;
    } else {
      selectLeagueLeader(idx);
    }
    return;
  }
  if (x === TOWER_POS.x && y === TOWER_POS.y) {
    const clearedCount = state.leagueBeaten.filter(Boolean).length;
    if (clearedCount < 5) {
      document.getElementById('league-toast').textContent = `The tower is sealed until all 5 League Leaders are defeated.`;
    } else if (!state.vanceBeaten) {
      startTrainerBattle('vance');
    } else if (!state.verdanyxBeaten) {
      startTrainerBattle('verdanyx');
    } else {
      document.getElementById('league-toast').textContent = `Zau has no more challenges left for you. Legendary run.`;
    }
  }
}
