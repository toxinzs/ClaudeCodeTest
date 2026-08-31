import { state } from '../state.js';
import { currentMonDisplay, monSpriteHtml } from '../mon.js';
import { openModal } from '../screens.js';

export function openDexBook() {
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Pokédex</h3>
    <p style="font-size:13px; color:var(--muted);">Money: ₽${state.money} · Poké Balls: ${state.items.pokeball}</p>
    <div class="party-list">
      ${state.party.map(m => {
        const d = currentMonDisplay(m);
        return `<div class="party-item"><div class="pemoji-wrap">${monSpriteHtml(d, 'pemoji')}</div><div class="pinfo"><div class="pname">${d.name}</div><div style="font-size:11px; color:var(--muted);">Lv.${m.level} · ${d.type} · ${m.moves.length} moves known</div></div></div>`;
      }).join('') || '<p style="color:var(--muted); font-size:13px;">No Pokémon caught yet.</p>'}
    </div>
  `);
}
