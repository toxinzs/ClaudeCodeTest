import { state } from '../state.js';
import { AVATAR_OPTIONS } from '../data/maps.js';
import { showScreen } from '../screens.js';
import { initHomeMap } from '../map.js';

let selectedAvatar = AVATAR_OPTIONS[0];

export function skipToCharCreate() {
  showScreen('create');
  const grid = document.getElementById('avatar-grid');
  grid.innerHTML = AVATAR_OPTIONS.map((a,i) =>
    `<div class="avatar-opt ${a===selectedAvatar?'selected':''}" onclick="pickAvatar(this,'${a}')">${a}</div>`
  ).join('');
}
export function pickAvatar(el, a) {
  selectedAvatar = a;
  document.querySelectorAll('.avatar-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}
export function confirmCharCreate() {
  const name = document.getElementById('input-name').value.trim();
  if (!name) { alert("Enter a trainer name first."); return; }
  state.player.name = name;
  state.player.avatar = selectedAvatar;
  document.getElementById('header-sub').textContent = `Welcome, ${name}. Your room is just ahead.`;
  showScreen('home');
  initHomeMap();
}
