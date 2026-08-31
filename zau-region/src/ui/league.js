import { state } from '../state.js';
import { LEAGUE_LEADERS } from '../data/story.js';
import { showScreen } from '../screens.js';
import { startTrainerBattle } from '../battle.js';

export function enterLeagueMap() {
  showScreen('league-map');
  document.getElementById('header-title').textContent = "ZAU LEAGUE";
  renderLeagueMap();
}
export function renderLeagueMap() {
  const list = document.getElementById('league-list');
  const clearedCount = state.leagueBeaten.filter(Boolean).length;
  if (clearedCount >= 5) {
    if (!state.vanceBeaten) {
      list.innerHTML = `<p style="text-align:center;">All 5 League Leaders defeated! Meridian Tower is open.</p>
        <button class="btn-primary" style="width:100%" onclick="startTrainerBattle('vance')">Enter Meridian Tower</button>`;
    } else if (!state.verdanyxBeaten) {
      list.innerHTML = `<p style="text-align:center;">The Underlight has opened beneath the city. Something ancient is down there.</p>
        <button class="btn-primary" style="width:100%" onclick="startTrainerBattle('verdanyx')">Descend into the Underlight</button>`;
    } else {
      list.innerHTML = `<p style="text-align:center;">Zau has no more challenges left for you. Legendary run.</p>`;
    }
    return;
  }
  document.getElementById('league-toast').textContent = `${clearedCount}/5 leaders cleared`;
  list.innerHTML = LEAGUE_LEADERS.map((l,i) => `
    <div class="party-item ${state.leagueBeaten[i] ? 'fainted' : ''}" onclick="${state.leagueBeaten[i] ? '' : `selectLeagueLeader(${i})`}">
      <div class="pemoji">${l.emoji}</div>
      <div class="pinfo">
        <div class="pname">${l.name}</div>
        <div style="font-size:11px; color:var(--muted);">${l.locationName} · <span class="type-pill type-${l.type}">${l.type}</span></div>
      </div>
      <div>${state.leagueBeaten[i] ? '✅' : '▶️'}</div>
    </div>
  `).join('');
}
export function selectLeagueLeader(i) {
  state.currentLeagueIdx = i;
  startTrainerBattle('league');
}
