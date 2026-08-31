import { state, activeMon } from '../state.js';
import { currentMonDisplay, monSpriteHtml } from '../mon.js';
import { openModal, closeModal } from '../screens.js';
import { renderBattle, currentEnemy, enemyTurn } from '../battle.js';

export function openParty(switchMode) {
  if (state.party.length === 0) {
    openModal(`<button class="close-x" onclick="closeModal()">✕</button><h3>Party</h3><p style="color:var(--muted); font-size:13px;">You don't have any Pokémon yet.</p>`);
    return;
  }
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>${switchMode ? 'Choose your next Pokémon' : 'Your Party'}</h3>
    <div class="party-list">
      ${state.party.map((m,i) => {
        const d = currentMonDisplay(m);
        const isFainted = m.hp <= 0;
        const isActive = i === state.activeIdx && !switchMode;
        const clickable = switchMode ? (!isFainted && i !== state.activeIdx) : false;
        return `<div class="party-item ${isActive?'active-mon':''} ${isFainted?'fainted':''}" ${clickable?`onclick="switchToMon(${i})"`:''}>
          <div class="pemoji-wrap">${monSpriteHtml(d, 'pemoji')}</div>
          <div class="pinfo">
            <div class="pname">${d.name} ${isFainted?'(Fainted)':''}</div>
            <div style="font-size:11px; color:var(--muted);">Lv.${m.level} · ${d.type}</div>
            <div class="hp-bar-bg" style="margin-top:4px;"><div class="hp-bar-fill${(m.hp/m.maxHp)<=0.2?' low':(m.hp/m.maxHp)<=0.5?' mid':''}" style="width:${Math.max(0,(m.hp/m.maxHp)*100)}%"></div></div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `);
}
export function switchToMon(idx) {
  state.activeIdx = idx;
  closeModal();
  if (state.battle) {
    document.getElementById('battle-log').textContent = `Go, ${currentMonDisplay(activeMon()).name}!`;
    renderBattle();
    // switching mid-battle (not from faint) costs the turn
    if (currentEnemy() && currentEnemy().hp > 0 && activeMon().hp > 0) {
      setTimeout(() => enemyTurn(), 700);
    }
  }
}
