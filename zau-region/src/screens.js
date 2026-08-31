// Pure DOM leaf module — screen switching and the shared modal overlay.
import { saveGame } from './save.js';

// Screens where autosaving on entry would be pointless or actively harmful:
// title/cutscene/create happen before there's any meaningful progress to
// save (and saving on 'create' could clobber an existing save the instant
// character creation starts, before the player even confirms a name);
// battle is mid-turn state with in-flight setTimeout sequencing that isn't
// meant to be resumed from a page reload.
const NO_AUTOSAVE_SCREENS = new Set(['title', 'cutscene', 'create', 'battle']);

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  const wrap = document.getElementById('main-wrap');
  if (id === 'title') { wrap.classList.add('on-title-screen'); }
  else { wrap.classList.remove('on-title-screen'); }
  if (!NO_AUTOSAVE_SCREENS.has(id)) saveGame();
}

export function openModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('active');
}

export function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}
