import { state } from '../state.js';
import { openModal } from '../screens.js';
import { saveGame } from '../save.js';

export function openHealCenter() {
  const needsHealing = state.party.some(m => m.hp < m.maxHp || m.fainted);
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Zau Pokémon Center</h3>
    <p style="font-size:13px; line-height:1.5; color:var(--muted);">
      ${needsHealing
        ? "Your Pokémon look tired. Want me to patch them up? No charge."
        : "Your team's already in great shape — nothing to heal right now."}
    </p>
    ${needsHealing ? `<button class="btn-primary" style="width:100%" onclick="healParty()">Heal my team</button>` : ''}
  `);
}

export function healParty() {
  state.party.forEach(m => {
    m.hp = m.maxHp;
    m.fainted = false;
  });
  saveGame();
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Zau Pokémon Center</h3>
    <p style="font-size:13px; line-height:1.5; color:var(--muted);">Your Pokémon are back to full health. Good luck out there.</p>
  `);
}
