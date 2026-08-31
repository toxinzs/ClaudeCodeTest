import { state, activeMon, firstHealthyIdx } from './state.js';
import { currentMonDisplay, monSpriteHtml, statHpForLevel, xpNeededForLevel, evolveIfReady, rollWildEncounter } from './mon.js';
import { STARTER_CHAINS } from './data/pokemon.js';
import { TRAINER_LINEUP, RIVAL_DARIO, LEAGUE_LEADERS, DIRECTOR_VANCE, VERDANYX, moneyRewardFor } from './data/story.js';
import { showScreen, openModal, closeModal } from './screens.js';
import { initTownMap } from './map.js';
import { renderTrail } from './ui/trail.js';
import { renderLeagueMap } from './ui/league.js';
import { openParty } from './ui/party.js';
import { showEnd } from './ui/end.js';

// ================== TYPE EFFECTIVENESS ==================
export function typeMultiplier(atkType, defType) {
  const STRONG = {
    Water:["Fire","Ground","Rock"], Fire:["Grass","Bug","Steel","Ice"], Grass:["Water","Ground","Rock"],
    Electric:["Water","Flying"], Ground:["Fire","Electric","Poison","Rock","Steel"], Rock:["Fire","Flying","Bug","Ice"],
    Flying:["Grass","Fighting","Bug"], Bug:["Grass","Psychic","Dark"], Psychic:["Fighting","Poison"],
    Dark:["Psychic","Ghost"], Ghost:["Psychic","Ghost"], Fighting:["Normal","Rock","Dark","Ice","Steel"],
    Ice:["Grass","Ground","Flying","Dragon"], Steel:["Rock","Ice","Fairy"], Dragon:["Dragon"], Fairy:["Fighting","Dragon","Dark"],
    Poison:["Grass","Fairy"], Normal:[]
  };
  const WEAK = {
    Water:["Water","Grass","Dragon"], Fire:["Fire","Water","Rock","Dragon"], Grass:["Grass","Fire","Poison","Flying","Bug"],
    Electric:["Electric","Grass","Dragon"], Ground:["Grass","Bug"], Rock:["Fighting","Ground","Steel"],
    Flying:["Electric","Rock","Steel"], Bug:["Fire","Fighting","Poison","Flying","Ghost","Steel"], Psychic:["Psychic","Steel"],
    Dark:["Fighting","Dark","Fairy"], Ghost:["Dark"], Fighting:["Flying","Poison","Psychic","Bug","Fairy"],
    Ice:["Fire","Water","Ice","Steel"], Steel:["Fire","Water","Electric","Steel"], Dragon:["Steel"], Fairy:["Fire","Poison","Steel"],
    Poison:["Poison","Ground","Rock","Ghost"], Normal:["Rock","Steel"]
  };
  const defTypes = defType.split("/");
  let mult = 1;
  defTypes.forEach(dt => {
    if ((STRONG[atkType]||[]).includes(dt)) mult *= 1.5;
    if ((WEAK[atkType]||[]).includes(dt)) mult *= 0.6;
  });
  return mult;
}

export function calcDamage(move, level, defType) {
  if (move.power === 0) return 0;
  const mult = typeMultiplier(move.type, defType);
  const variance = 0.85 + Math.random()*0.3;
  return Math.max(1, Math.round(move.power * (1 + level*0.06) * mult * variance));
}

// ================== BATTLE SETUP ==================
export function startTrainerBattle(ctx) {
  let enemyTeam, enemyName;
  if (ctx === 'lineup') { enemyTeam = TRAINER_LINEUP[state.trainerIndex].team; enemyName = TRAINER_LINEUP[state.trainerIndex].name; }
  if (ctx === 'dario') { enemyTeam = RIVAL_DARIO.team; enemyName = RIVAL_DARIO.name; }
  if (ctx === 'league') { enemyTeam = LEAGUE_LEADERS[state.currentLeagueIdx].team; enemyName = LEAGUE_LEADERS[state.currentLeagueIdx].name; }
  if (ctx === 'vance') { enemyTeam = DIRECTOR_VANCE.team; enemyName = DIRECTOR_VANCE.name; }
  if (ctx === 'verdanyx') { enemyTeam = VERDANYX.team; enemyName = VERDANYX.name; }

  const enemyMons = enemyTeam.map(t => ({
    isWild: false, speciesName: t.speciesName, emoji: t.emoji, type: t.type,
    level: t.level, hp: statHpForLevel(t.level), maxHp: statHpForLevel(t.level),
    moves: t.moves.map(m => ({...m}))
  }));

  state.battle = { ctx, enemyName, enemyMons, enemyIdx: 0, isWild: false, moneyReward: moneyRewardFor(ctx) };
  showScreen('battle');
  document.getElementById('battle-catch-btn').style.display = 'none';
  document.getElementById('battle-flee-btn').style.display = 'inline-block';
  renderBattle(`${enemyName} wants to battle!`);
}

export function startWildEncounter(zoneKey) {
  const wild = rollWildEncounter(zoneKey);
  state.battle = { ctx: 'wild', enemyName: wild.speciesName, enemyMons: [wild], enemyIdx: 0, isWild: true, moneyReward: 0 };
  showScreen('battle');
  document.getElementById('battle-catch-btn').style.display = 'inline-block';
  document.getElementById('battle-flee-btn').style.display = 'inline-block';
  renderBattle(`A wild ${wild.speciesName} appeared!`);
}

export function currentEnemy() { return state.battle.enemyMons[state.battle.enemyIdx]; }

// ================== RENDERING ==================
export function renderBattle(logMsg) {
  const p = activeMon();
  const pd = currentMonDisplay(p);
  const e = currentEnemy();
  const ed = currentMonDisplay(e);
  document.getElementById('battle-player-name').textContent = pd.name;
  document.getElementById('battle-player-lvl').textContent = "Lv. " + p.level;
  document.getElementById('battle-player-emoji').innerHTML = monSpriteHtml(pd, 'mon-emoji');
  setHpBar('battle-player-hp', p.hp, p.maxHp);

  document.getElementById('battle-enemy-name').textContent = e.speciesName;
  document.getElementById('battle-enemy-lvl').textContent = "Lv. " + e.level;
  document.getElementById('battle-enemy-emoji').innerHTML = monSpriteHtml(ed, 'mon-emoji');
  setHpBar('battle-enemy-hp', e.hp, e.maxHp);

  if (logMsg) document.getElementById('battle-log').textContent = logMsg;

  const moveGrid = document.getElementById('battle-moves');
  moveGrid.innerHTML = p.moves.map((m,i) => `
    <button class="move-btn" onclick="playerUseMove(${i})">
      <span class="mname">${m.name}</span>
      <span class="type-pill type-${m.type}">${m.type}</span>
    </button>
  `).join('');
}

function setHpBar(id, hp, maxHp) {
  const pct = Math.max(0, Math.min(100, (hp/maxHp)*100));
  const el = document.getElementById(id);
  el.style.width = pct + "%";
  el.className = 'hp-bar-fill' + (pct <= 20 ? ' low' : pct <= 50 ? ' mid' : '');
}

// ================== TURNS ==================
export function playerUseMove(idx) {
  const p = activeMon();
  const e = currentEnemy();
  // Guards a move button click landing during the brief win/faint transition
  // (after the last enemy mon's HP hits 0 but before the screen routes away),
  // where the stale move-grid buttons are still in the DOM but the battle has
  // already moved past this enemy — currentEnemy() can be undefined here.
  if (!e || e.hp <= 0) return;
  const move = p.moves[idx];

  if (move.power === 0) {
    renderBattle(`${currentMonDisplay(p).name} used ${move.name}! It had no direct effect this turn.`);
    setTimeout(() => enemyTurn(), 700);
    return;
  }

  const dmg = calcDamage(move, p.level, e.type);
  e.hp = Math.max(0, e.hp - dmg);
  const mult = typeMultiplier(move.type, e.type);
  let msg = `${currentMonDisplay(p).name} used ${move.name}!`;
  if (mult > 1) msg += " It's super effective!";
  if (mult < 1) msg += " It's not very effective...";
  renderBattle(msg);

  if (e.hp <= 0) {
    setTimeout(() => handleEnemyFainted(), 500);
    return;
  }
  setTimeout(() => enemyTurn(), 700);
}

export function enemyTurn() {
  const p = activeMon();
  const e = currentEnemy();
  const move = e.moves[Math.floor(Math.random()*e.moves.length)];

  if (move.power === 0) {
    renderBattle(`${e.speciesName} used ${move.name}! It had no direct effect this turn.`);
    return;
  }

  const dmg = calcDamage(move, e.level, p.type);
  p.hp = Math.max(0, p.hp - dmg);
  const mult = typeMultiplier(move.type, p.type);
  let msg = `${e.speciesName} used ${move.name}!`;
  if (mult > 1) msg += " It's super effective!";
  if (mult < 1) msg += " It's not very effective...";
  renderBattle(msg);

  if (p.hp <= 0) {
    p.fainted = true;
    setTimeout(() => handlePlayerFainted(), 600);
  }
}

function handlePlayerFainted() {
  const nextIdx = firstHealthyIdx();
  if (nextIdx === -1) {
    document.getElementById('battle-log').textContent = `${currentMonDisplay(activeMon()).name} fainted. Your whole team is down...`;
    setTimeout(() => loseBattle(), 1200);
  } else {
    document.getElementById('battle-log').textContent = `${currentMonDisplay(activeMon()).name} fainted! Choose your next Pokémon.`;
    setTimeout(() => openParty(true), 800);
  }
}

function handleEnemyFainted() {
  const p = activeMon();
  const e = currentEnemy();
  const xpGain = 12 + e.level * 4;
  document.getElementById('battle-log').textContent = `${e.speciesName} fainted! ${currentMonDisplay(p).name} gained ${xpGain} XP.`;
  gainXp(p, xpGain);

  state.battle.enemyIdx++;
  if (state.battle.enemyIdx < state.battle.enemyMons.length) {
    setTimeout(() => renderBattle(`${state.battle.enemyName} sends out ${currentEnemy().speciesName}!`), 1000);
  } else {
    setTimeout(() => winBattle(), 1200);
  }
}

// ================== XP / LEVELING ==================
export function gainXp(mon, amount) {
  mon.xp += amount;
  while (mon.xp >= mon.xpNext) {
    mon.xp -= mon.xpNext;
    levelUpMon(mon);
  }
}

function levelUpMon(mon) {
  mon.level++;
  const newMax = statHpForLevel(mon.level);
  const gained = newMax - mon.maxHp;
  mon.maxHp = newMax;
  mon.hp = Math.min(mon.maxHp, mon.hp + gained);
  mon.xpNext = xpNeededForLevel(mon.level);

  if (mon.key) {
    const chain = STARTER_CHAINS[mon.key];
    evolveIfReady(mon);
    const newMoveEntry = chain.learnset.find(e => e.lvl === mon.level);
    if (newMoveEntry) {
      const already = mon.moves.some(m => m.name === newMoveEntry.name);
      if (!already) {
        if (mon.moves.length < 4) {
          mon.moves.push({name:newMoveEntry.name, type:newMoveEntry.type, power:newMoveEntry.power});
        } else {
          queueMoveLearnPrompt(mon, newMoveEntry);
        }
      }
    }
  }
}

let pendingMoveLearn = null;
function queueMoveLearnPrompt(mon, newMove) {
  pendingMoveLearn = { mon, newMove };
  openModal(`
    <h3>${currentMonDisplay(mon).name} wants to learn ${newMove.name}!</h3>
    <p style="font-size:13px; color:var(--muted);">But it already knows 4 moves. Forget one to make room, or skip learning ${newMove.name}.</p>
    <div class="party-list">
      ${mon.moves.map((m,i) => `<div class="party-item" onclick="confirmForgetMove(${i})"><div class="pinfo"><div class="pname">${m.name}</div><span class="type-pill type-${m.type}">${m.type}</span></div></div>`).join('')}
    </div>
    <button style="width:100%; margin-top:10px;" onclick="skipMoveLearn()">Don't learn ${newMove.name}</button>
  `);
}
export function confirmForgetMove(idx) {
  pendingMoveLearn.mon.moves[idx] = {name:pendingMoveLearn.newMove.name, type:pendingMoveLearn.newMove.type, power:pendingMoveLearn.newMove.power};
  closeModal();
  pendingMoveLearn = null;
  renderBattle();
}
export function skipMoveLearn() {
  closeModal();
  pendingMoveLearn = null;
  renderBattle();
}

// ================== CATCHING / FLEEING ==================
export function throwPokeBall() {
  if (state.items.pokeball <= 0) {
    document.getElementById('battle-log').textContent = "You're out of Poké Balls! Grab more at the Mart.";
    return;
  }
  const e = currentEnemy();
  if (!e || e.hp <= 0) return;
  state.items.pokeball--;
  const hpPct = e.hp / e.maxHp;
  const catchChance = Math.min(0.95, 0.9 - hpPct*0.7);
  document.getElementById('battle-log').textContent = "You throw a Poké Ball...";
  setTimeout(() => {
    if (Math.random() < catchChance) {
      const caughtMon = {
        speciesName: e.speciesName, emoji: e.emoji, type: e.type, level: e.level,
        xp: 0, xpNext: xpNeededForLevel(e.level), hp: e.hp, maxHp: e.maxHp,
        moves: e.moves.map(m => ({...m})), nickname: e.speciesName, fainted: false, isWild: false
      };
      state.party.push(caughtMon);
      document.getElementById('battle-log').textContent = `Gotcha! ${e.speciesName} was caught!`;
      setTimeout(() => winBattle(true), 1300);
    } else {
      document.getElementById('battle-log').textContent = `${e.speciesName} broke free!`;
      setTimeout(() => enemyTurn(), 900);
    }
  }, 900);
}

export function tryFlee() {
  if (state.battle.isWild) {
    const toast = document.getElementById('map-toast');
    if (toast) toast.textContent = "Got away safely.";
    returnToPreviousScreen();
  } else {
    document.getElementById('battle-log').textContent = "You can't flee a trainer battle!";
  }
}

// ================== OUTCOMES ==================
export function winBattle(caughtNotDefeated) {
  const ctx = state.battle.ctx;
  if (state.battle.moneyReward) {
    state.money += state.battle.moneyReward;
  }

  if (ctx === 'wild') {
    returnToPreviousScreen(caughtNotDefeated ? `Added to your party!` : `You defeated the wild ${state.battle.enemyName}!`);
    return;
  }
  if (ctx === 'lineup') {
    state.trainerIndex++;
    showScreen('trail');
    renderTrail();
    document.getElementById('trail-toast').textContent = `Beat ${state.battle.enemyName}! +₽${moneyRewardFor('lineup')}`;
    return;
  }
  if (ctx === 'dario') {
    state.darioBeaten = true;
    showScreen('trail');
    renderTrail();
    document.getElementById('trail-toast').textContent = `You beat Dario Voss! The Zau League is open.`;
    return;
  }
  if (ctx === 'league') {
    state.leagueBeaten[state.currentLeagueIdx] = true;
    const cleared = state.leagueBeaten.filter(Boolean).length;
    showScreen('league-map');
    renderLeagueMap();
    document.getElementById('league-toast').textContent = cleared >= 5
      ? `All 5 League Leaders defeated! Meridian Tower is open.`
      : `${LEAGUE_LEADERS[state.currentLeagueIdx].locationName} cleared! (${cleared}/5 leaders)`;
    return;
  }
  if (ctx === 'vance') {
    state.vanceBeaten = true;
    showScreen('league-map');
    renderLeagueMap();
    document.getElementById('league-toast').textContent = `You beat Director Vance! The Underlight has opened beneath the city.`;
    return;
  }
  if (ctx === 'verdanyx') {
    state.verdanyxBeaten = true;
    showEnd();
    return;
  }
}

export function loseBattle() {
  const ctx = state.battle.ctx;
  // heal party a bit and send back
  state.party.forEach(m => { if (m.fainted) { m.fainted = false; m.hp = Math.floor(m.maxHp*0.4); } });
  state.activeIdx = firstHealthyIdx() === -1 ? 0 : firstHealthyIdx();
  if (ctx === 'wild') { returnToPreviousScreen(`Your team pulled back to safety.`); return; }
  if (ctx === 'lineup' || ctx === 'dario') { showScreen('trail'); renderTrail(); document.getElementById('trail-toast').textContent = `Your team was outmatched. Regroup and try again.`; return; }
  if (ctx === 'league' || ctx === 'vance' || ctx === 'verdanyx') { showScreen('league-map'); renderLeagueMap(); document.getElementById('league-toast').textContent = `Your team was outmatched. Regroup and try again.`; return; }
}

function returnToPreviousScreen(msg) {
  // wild encounters can happen from the town map or the trail; default back to town
  showScreen('map');
  initTownMap();
  document.getElementById('header-title').textContent = "ZAU OUTSKIRTS";
  if (msg) document.getElementById('map-toast').textContent = msg;
}
