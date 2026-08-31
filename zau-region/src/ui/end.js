import { state } from '../state.js';
import { showScreen } from '../screens.js';
import { refreshContinueVisibility } from './title.js';

export function showEnd() {
  showScreen('end');
  document.getElementById('end-emoji').textContent = "🏆";
  document.getElementById('end-title').textContent = "Zau Region: Cleared!";
  document.getElementById('end-sub').textContent = `${state.player.name} beat Verdanyx and uncovered the truth beneath the city. Legendary run.`;
}
export function restartGame() {
  refreshContinueVisibility();
  showScreen('title');
}
