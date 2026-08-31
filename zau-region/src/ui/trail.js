import { state } from '../state.js';
import { TRAINER_LINEUP } from '../data/story.js';
import { showScreen } from '../screens.js';

export function enterTrail() {
  showScreen('trail');
  document.getElementById('header-title').textContent = "WILD ZONE TRAIL";
  renderTrail();
}
export function renderTrail() {
  const list = document.getElementById('trail-list');
  if (state.trainerIndex >= TRAINER_LINEUP.length) {
    if (!state.darioBeaten) {
      list.innerHTML = `<p style="text-align:center;">All 5 trainers cleared! Someone's waiting up ahead...</p>
        <button class="btn-primary" style="width:100%" onclick="startTrainerBattle('dario')">Face Dario Voss</button>`;
    } else {
      list.innerHTML = `<p style="text-align:center;">The Wild Zone Trial is complete. The Zau League gates are open.</p>
        <button class="btn-primary" style="width:100%" onclick="enterLeagueMap()">Enter the Zau League</button>`;
    }
    return;
  }
  const t = TRAINER_LINEUP[state.trainerIndex];
  list.innerHTML = `
    <p style="text-align:center; color:var(--muted); font-size:12px;">Trainer ${state.trainerIndex+1} of ${TRAINER_LINEUP.length}</p>
    <div style="text-align:center; font-size:40px;">${t.emoji}</div>
    <h3 style="text-align:center;">${t.name}</h3>
    <p style="text-align:center; color:var(--muted); font-size:13px;">${t.locationName}</p>
    <button class="btn-primary" style="width:100%" onclick="startTrainerBattle('lineup')">Battle</button>
  `;
}
