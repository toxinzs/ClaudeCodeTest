import { state } from '../state.js';
import { openModal } from '../screens.js';
import { saveGame } from '../save.js';
import { ITEMS, itemIcon, availableItems } from '../data/items.js';

export function openMart() {
  const badgeCount = state.leagueBeaten.filter(Boolean).length;
  const keys = availableItems(badgeCount);
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Zau Poké Mart</h3>
    <p style="font-size:13px; color:var(--muted);">Balance: ₽${state.money}</p>
    <div class="party-list">
      ${keys.map(key => {
        const item = ITEMS[key];
        return `<div class="party-item">
          <div class="pemoji">${itemIcon(key)}</div>
          <div class="pinfo"><div class="pname">${item.name}</div><div style="font-size:11px; color:var(--muted);">₽${item.price} · Have: ${state.items[key] || 0}</div></div>
          <button onclick="buyItem('${key}',${item.price})">Buy</button>
        </div>`;
      }).join('')}
    </div>
  `);
}
export function buyItem(key, cost) {
  if (state.money < cost) return;
  state.money -= cost;
  state.items[key] = (state.items[key] || 0) + 1;
  saveGame(); // buying doesn't change screens, so it needs an explicit checkpoint
  openMart();
}
