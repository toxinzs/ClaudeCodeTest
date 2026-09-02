import { state, activeMon } from '../state.js';
import { currentMonDisplay, monSpriteHtml } from '../mon.js';
import { openModal, closeModal } from '../screens.js';
import { saveGame } from '../save.js';
import { ITEMS, itemIcon } from '../data/items.js';
import { throwPokeBall, currentEnemy, enemyTurn, renderBattle } from '../battle.js';

export function openBag() {
  const inBattle = !!state.battle;
  const owned = Object.keys(state.items).filter(key => state.items[key] > 0);
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Bag</h3>
    <div class="party-list">
      ${owned.length ? owned.map(key => renderItemRow(key, inBattle)).join('')
        : '<p style="color:var(--muted); font-size:13px;">Your bag is empty.</p>'}
    </div>
  `);
}

function renderItemRow(key, inBattle) {
  const item = ITEMS[key];
  const isBall = item.category === 'ball';
  const canUseBall = isBall && inBattle && state.battle.isWild;
  const canUseHere = isBall ? canUseBall : true;
  const note = isBall && inBattle && !state.battle.isWild ? ' <span style="color:var(--muted);">(wild only)</span>' : '';
  return `
    <div class="party-item">
      <div class="pemoji">${itemIcon(key)}</div>
      <div class="pinfo">
        <div class="pname">${item.name}${note}</div>
        <div style="font-size:11px; color:var(--muted);">Have: ${state.items[key]}</div>
      </div>
      ${canUseHere ? `<button onclick="useItem('${key}')">Use</button>` : ''}
    </div>
  `;
}

export function useItem(key) {
  const item = ITEMS[key];
  if (item.category === 'ball') {
    closeModal();
    throwPokeBall(key);
    return;
  }
  openItemTargetPicker(key);
}

function openItemTargetPicker(key) {
  const item = ITEMS[key];
  const eligible = (mon) => item.revive ? mon.hp <= 0 : (mon.hp > 0 && mon.hp < mon.maxHp);
  const anyEligible = state.party.some(eligible);
  if (!anyEligible) {
    openModal(`
      <button class="close-x" onclick="closeModal()">✕</button>
      <p style="text-align:center; color:var(--muted); font-size:13px;">No Pokémon need that right now.</p>
      <button style="width:100%" onclick="openBag()">Back</button>
    `);
    return;
  }
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <h3>Use ${item.name} on...</h3>
    <div class="party-list">
      ${state.party.map((m, i) => {
        const can = eligible(m);
        const d = currentMonDisplay(m);
        return `<div class="party-item ${can ? '' : 'fainted'}" ${can ? `onclick="applyItem('${key}',${i})"` : ''}>
          <div class="pemoji-wrap">${monSpriteHtml(d, 'pemoji')}</div>
          <div class="pinfo">
            <div class="pname">${d.name}</div>
            <div style="font-size:11px; color:var(--muted);">${m.hp}/${m.maxHp} HP</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `);
}

export function applyItem(key, idx) {
  const item = ITEMS[key];
  const mon = state.party[idx];
  if (item.revive) {
    mon.hp = item.heal === 'full' ? mon.maxHp : Math.floor(mon.maxHp / 2);
    mon.fainted = false;
  } else {
    const healAmt = item.heal === 'full' ? mon.maxHp : item.heal;
    mon.hp = Math.min(mon.maxHp, mon.hp + healAmt);
  }
  state.items[key]--;
  closeModal();

  if (state.battle) {
    document.getElementById('battle-log').textContent = `Used ${item.name} on ${currentMonDisplay(mon).name}!`;
    renderBattle();
    // using an item mid-battle costs the turn, same as switching
    if (currentEnemy() && currentEnemy().hp > 0 && activeMon() && activeMon().hp > 0) {
      setTimeout(() => enemyTurn(), 700);
    }
  } else {
    saveGame(); // no screen transition to trigger the usual autosave
  }
}
