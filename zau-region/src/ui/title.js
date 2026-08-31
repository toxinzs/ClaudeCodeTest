import { state } from '../state.js';
import { CUTSCENE_SLIDES } from '../data/story.js';
import { showScreen } from '../screens.js';
import { skipToCharCreate } from './charCreate.js';

let titleTypeStarted = false;
export function startTitleTypewriter() {
  if (titleTypeStarted) return;
  titleTypeStarted = true;
  const fullText = "Thunder does not fall on Zau by chance. It answers something in you — and tonight, it's answering back.";
  const el = document.getElementById('titleTypedText');
  const cursor = document.getElementById('titleCursor');
  const menu = document.getElementById('titleMenu');
  let i = 0;
  function type() {
    if (i < fullText.length) {
      el.insertBefore(document.createTextNode(fullText[i]), cursor);
      i++;
      setTimeout(type, 28);
    } else {
      menu.classList.add('ready');
    }
  }
  setTimeout(type, 600);
}

export function startCutscene() {
  state.cutsceneIdx = 0;
  showScreen('cutscene');
  renderCutsceneSlide();
}
function renderCutsceneSlide() {
  document.getElementById('cutscene-text').textContent = CUTSCENE_SLIDES[state.cutsceneIdx];
  const dots = document.getElementById('cutscene-dots');
  dots.innerHTML = CUTSCENE_SLIDES.map((_,i)=>`<span class="${i===state.cutsceneIdx?'active':''}"></span>`).join('');
  document.getElementById('cutscene-next-btn').textContent = (state.cutsceneIdx === CUTSCENE_SLIDES.length-1) ? "Begin" : "Next";
}
export function nextCutsceneSlide() {
  if (state.cutsceneIdx < CUTSCENE_SLIDES.length - 1) {
    state.cutsceneIdx++;
    renderCutsceneSlide();
  } else {
    skipToCharCreate();
  }
}
