import { state } from '../state.js';
import { STARTER_CHAINS } from '../data/pokemon.js';
import { movesKnownAtLevel, makeStarterMon, monSpriteHtml } from '../mon.js';
import { spriteUrlFor } from '../sprites.js';
import { showScreen, openModal, closeModal } from '../screens.js';
import { initTownMap } from '../map.js';
import { saveGame } from '../save.js';

export function enterLab() {
  showScreen('lab');
  const hasStarter = state.party.length > 0;
  document.getElementById('lab-dialogue-text').textContent = hasStarter
    ? `Good to see you again, ${state.player.name}. Your team's looking solid — the Wild Zone trail is open whenever you're ready.`
    : `Ah, ${state.player.name}! Right on time. Every trainer heading into the Wild Zone needs a partner first. Take a look — which one calls out to you?`;
  document.getElementById('lab-starter-picker').style.display = hasStarter ? 'none' : 'grid';
  document.getElementById('lab-continue-wrap').style.display = hasStarter ? 'block' : 'none';
}
export function leaveLab() {
  showScreen('map');
  initTownMap();
}

let pendingStarterKey = null;
export function openDex(key) {
  pendingStarterKey = key;
  const chain = STARTER_CHAINS[key];
  const base = chain.stages[0];
  const moves = movesKnownAtLevel(chain.learnset, 5);
  const display = { name: base.name, species: base.name, emoji: base.emoji, sprite: spriteUrlFor(base.name) };
  openModal(`
    <button class="close-x" onclick="closeModal()">✕</button>
    <div style="text-align:center;">${monSpriteHtml(display, 'dex-preview')}</div>
    <h3 style="text-align:center; margin-bottom:2px;">${base.name}</h3>
    <p style="text-align:center; color:var(--muted); font-size:12px; margin-top:0;">${base.category} · <span class="type-pill type-${chain.type}">${chain.type}</span></p>
    <p style="font-size:13px; line-height:1.5;">${base.desc}</p>
    <div style="margin:10px 0;">
      <div style="font-size:11px; color:var(--muted); text-transform:uppercase; margin-bottom:6px;">Starting Moves</div>
      ${moves.map(m => `<span class="type-pill type-${m.type}">${m.type}</span> ${m.name}<br>`).join('')}
    </div>
    <div class="field">
      <label>Nickname (optional)</label>
      <input type="text" id="input-nickname" maxlength="12" placeholder="${base.name}">
    </div>
    <button class="btn-primary" style="width:100%" onclick="confirmStarterChoice()">Choose ${base.name}</button>
  `);
}
export function confirmStarterChoice() {
  const nickInput = document.getElementById('input-nickname');
  const nickname = nickInput && nickInput.value.trim() ? nickInput.value.trim() : STARTER_CHAINS[pendingStarterKey].stages[0].name;
  const mon = makeStarterMon(pendingStarterKey);
  mon.nickname = nickname;
  state.party.push(mon);
  state.activeIdx = 0;
  state.starterKey = pendingStarterKey;
  closeModal();
  document.getElementById('lab-dialogue-text').textContent = `${nickname} chose you right back. Take care of each other out there — the Wild Zone trail starts just past town.`;
  document.getElementById('lab-starter-picker').style.display = 'none';
  document.getElementById('lab-continue-wrap').style.display = 'block';
  saveGame(); // getting a starter doesn't change screens, so it needs an explicit checkpoint
}
