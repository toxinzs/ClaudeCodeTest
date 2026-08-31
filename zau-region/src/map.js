import { state } from './state.js';
import { HOME_MAP, TOWN_MAP, TRAIL_MAP } from './data/maps.js';
import { showScreen } from './screens.js';
import { startWildEncounter } from './battle.js';
import { enterLab } from './ui/lab.js';
import { enterTrail, handleTrailStep } from './ui/trail.js';

const GRID_ID = { home: 'home-grid', town: 'town-grid', trail: 'trail-grid' };
const MAP_DEF = { home: HOME_MAP, town: TOWN_MAP, trail: TRAIL_MAP };

export function tileSize() { return window.innerWidth < 480 ? 42 : 52; }

export function renderMapGrid(gridId, mapDef, playerPos) {
  const ts = tileSize();
  const grid = document.getElementById(gridId);
  grid.style.gridTemplateColumns = `repeat(${mapDef.w}, ${ts}px)`;
  grid.style.gridTemplateRows = `repeat(${mapDef.h}, ${ts}px)`;
  grid.style.background = mapDef.bg;
  grid.style.width = (mapDef.w*ts)+"px";
  grid.style.margin = "0 auto";
  let html = "";
  for (let y=0;y<mapDef.h;y++) {
    for (let x=0;x<mapDef.w;x++) {
      const blocked = mapDef.layout[y][x] === 1;
      html += `<div class="map-tile" style="width:${ts}px;height:${ts}px;background:${blocked?'#0a0e1a':'transparent'};border:1px solid rgba(255,255,255,.04);"></div>`;
    }
  }
  grid.innerHTML = html;
  (mapDef.decor||[]).forEach(d => {
    const el = document.createElement('div');
    el.className = 'map-npc';
    el.style.left = (d.x*ts + ts*0.15) + "px";
    el.style.top = (d.y*ts + ts*0.1) + "px";
    el.textContent = d.emoji;
    grid.appendChild(el);
  });
  const p = document.createElement('div');
  p.className = 'map-player';
  p.id = gridId + '-player';
  p.style.width = ts+"px"; p.style.height = ts+"px";
  p.style.left = (playerPos.x*ts) + "px";
  p.style.top = (playerPos.y*ts) + "px";
  p.textContent = state.player.avatar;
  grid.appendChild(p);
}

export function initHomeMap() {
  renderMapGrid('home-grid', HOME_MAP, state.pos.home);
}
export function initTownMap() {
  renderMapGrid('town-grid', TOWN_MAP, state.pos.town);
}

export function tryMove(which, dx, dy) {
  const mapDef = MAP_DEF[which];
  const pos = state.pos[which];
  const nx = pos.x + dx, ny = pos.y + dy;
  if (nx < 0 || ny < 0 || nx >= mapDef.w || ny >= mapDef.h) return;
  if (mapDef.layout[ny][nx] === 1) return;
  pos.x = nx; pos.y = ny;
  const ts = tileSize();
  const p = document.getElementById(GRID_ID[which] + '-player');
  p.style.left = (nx*ts)+"px"; p.style.top = (ny*ts)+"px";

  if (which === 'home') {
    if (nx === HOME_MAP.doorX && ny === HOME_MAP.doorY) {
      document.getElementById('home-dialogue').style.display = 'block';
      document.getElementById('home-dialogue-text').textContent = "The door out is right here. Ready to head into Zau?";
    } else {
      document.getElementById('home-dialogue').style.display = 'none';
    }
  }
  if (which === 'town') {
    document.getElementById('map-toast').textContent = "";
    if (nx === TOWN_MAP.labX && ny === TOWN_MAP.labY) {
      enterLab();
    } else if (nx === TOWN_MAP.trailX && ny === TOWN_MAP.trailY && state.party.length) {
      enterTrail();
    } else {
      // random wild encounter chance while walking open ground
      if (state.party.length && Math.random() < 0.12) {
        startWildEncounter('outskirts');
      }
    }
  }
  if (which === 'trail') {
    document.getElementById('trail-toast').textContent = "";
    handleTrailStep(nx, ny);
  }
}

// keyboard controls
document.addEventListener('keydown', (e) => {
  const activeId = document.querySelector('.screen.active').id;
  let which = null;
  if (activeId === 'screen-home') which = 'home';
  if (activeId === 'screen-map') which = 'town';
  if (activeId === 'screen-trail') which = 'trail';
  if (!which) return;
  if (e.key === 'ArrowUp') tryMove(which,0,-1);
  if (e.key === 'ArrowDown') tryMove(which,0,1);
  if (e.key === 'ArrowLeft') tryMove(which,-1,0);
  if (e.key === 'ArrowRight') tryMove(which,1,0);
});

export function headOutside() {
  showScreen('map');
  initTownMap();
  document.getElementById('header-title').textContent = "ZAU OUTSKIRTS";
  document.getElementById('header-sub').textContent = "Walk to the lab (🔬) to meet Professor Mabosso.";
}
