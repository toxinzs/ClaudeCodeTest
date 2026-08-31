import { state } from '../state.js';
import { openModal } from '../screens.js';
import { saveGame } from '../save.js';

export function openMart() {
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Zau Poké Mart</h3>
    <p style="font-size:13px; color:var(--muted);">Balance: ₽${state.money}</p>
    <div class="party-list">
      <div class="party-item">
        <div class="pemoji">🔴</div>
        <div class="pinfo"><div class="pname">Poké Ball</div><div style="font-size:11px; color:var(--muted);">₽200 · Have: ${state.items.pokeball}</div></div>
        <button onclick="buyItem('pokeball',200)">Buy</button>
      </div>
      <div class="party-item">
        <div class="pemoji">💊</div>
        <div class="pinfo"><div class="pname">Potion</div><div style="font-size:11px; color:var(--muted);">₽150 · Have: ${state.items.potion}</div></div>
        <button onclick="buyItem('potion',150)">Buy</button>
      </div>
    </div>
  `);
}
export function buyItem(key, cost) {
  if (state.money < cost) return;
  state.money -= cost;
  state.items[key]++;
  saveGame(); // buying doesn't change screens, so it needs an explicit checkpoint
  openMart();
}
