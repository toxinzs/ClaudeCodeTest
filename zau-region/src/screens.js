// Pure DOM leaf module — screen switching and the shared modal overlay.
// No game-logic dependencies, so every other module can import this safely.

export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  const wrap = document.getElementById('main-wrap');
  if (id === 'title') { wrap.classList.add('on-title-screen'); }
  else { wrap.classList.remove('on-title-screen'); }
}

export function openModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('active');
}

export function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}
