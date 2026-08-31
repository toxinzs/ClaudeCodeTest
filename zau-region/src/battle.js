import { state, activeMon, firstHealthyIdx } from './state.js';
import { currentMonDisplay, monSpriteHtml, computeStats, statsForMon, evolveIfReady, rollWildEncounter, xpNeededForLevel } from './mon.js';
import { baseStatsFor } from './data/baseStats.js';
import { STARTER_CHAINS } from './data/pokemon.js';
import { TRAINER_LINEUP, RIVAL_DARIO, LEAGUE_LEADERS, DIRECTOR_VANCE, VERDANYX, moneyRewardFor } from './data/story.js';
import { showScreen, openModal, closeModal } from './screens.js';
import { initTownMap } from './map.js';
import { renderTrailMap } from './ui/trail.js';
import { renderLeagueMap } from './ui/league.js';
import { openParty } from './ui/party.js';
import { showEnd } from './ui/end.js';

// ================== TYPE EFFECTIVENESS (full official 18-type chart) ==================
const TYPE_CHART = {
  Normal:   { Rock:0.5, Steel:0.5, Ghost:0 },
  Fire:     { Grass:2, Ice:2, Bug:2, Steel:2, Fire:0.5, Water:0.5, Rock:0.5, Dragon:0.5 },
  Water:    { Fire:2, Ground:2, Rock:2, Water:0.5, Grass:0.5, Dragon:0.5 },
  Electric: { Water:2, Flying:2, Electric:0.5, Grass:0.5, Dragon:0.5, Ground:0 },
  Grass:    { Water:2, Ground:2, Rock:2, Fire:0.5, Grass:0.5, Poison:0.5, Flying:0.5, Bug:0.5, Dragon:0.5, Steel:0.5 },
  Ice:      { Grass:2, Ground:2, Flying:2, Dragon:2, Fire:0.5, Water:0.5, Ice:0.5, Steel:0.5 },
  Fighting: { Normal:2, Ice:2, Rock:2, Dark:2, Steel:2, Poison:0.5, Flying:0.5, Psychic:0.5, Bug:0.5, Fairy:0.5, Ghost:0 },
  Poison:   { Grass:2, Fairy:2, Poison:0.5, Ground:0.5, Rock:0.5, Ghost:0.5, Steel:0 },
  Ground:   { Fire:2, Electric:2, Poison:2, Rock:2, Steel:2, Grass:0.5, Bug:0.5, Flying:0 },
  Flying:   { Grass:2, Fighting:2, Bug:2, Electric:0.5, Rock:0.5, Steel:0.5 },
  Psychic:  { Fighting:2, Poison:2, Psychic:0.5, Steel:0.5, Dark:0 },
  Bug:      { Grass:2, Psychic:2, Dark:2, Fire:0.5, Fighting:0.5, Poison:0.5, Flying:0.5, Ghost:0.5, Steel:0.5, Fairy:0.5 },
  Rock:     { Fire:2, Ice:2, Flying:2, Bug:2, Fighting:0.5, Ground:0.5, Steel:0.5 },
  Ghost:    { Psychic:2, Ghost:2, Dark:0.5, Normal:0 },
  Dragon:   { Dragon:2, Steel:0.5, Fairy:0 },
  Dark:     { Psychic:2, Ghost:2, Fighting:0.5, Dark:0.5, Fairy:0.5 },
  Steel:    { Ice:2, Rock:2, Fairy:2, Fire:0.5, Water:0.5, Electric:0.5, Steel:0.5 },
  Fairy:    { Fighting:2, Dragon:2, Dark:2, Fire:0.5, Poison:0.5, Steel:0.5 }
};

export function typeMultiplier(atkType, defType) {
  const defTypes = defType.split("/");
  let mult = 1;
  defTypes.forEach(dt => {
    const m = TYPE_CHART[atkType]?.[dt];
    mult *= (m === undefined ? 1 : m);
  });
  return mult;
}

// ================== DAMAGE ==================
export function calcDamage(move, attacker, defender) {
  if (move.power === 0) return 0;
  const mult = typeMultiplier(move.type, defender.type);
  if (mult === 0) return 0;
  const atkStat = move.category === 'Special' ? attacker.spAtk : attacker.atk;
  const defStat = move.category === 'Special' ? defender.spDef : defender.def;
  const base = Math.floor(Math.floor(Math.floor(2*attacker.level/5 + 2) * move.power * atkStat/defStat) / 50 + 2);
  const stab = attacker.type.split("/").includes(move.type) ? 1.5 : 1;
  const variance = 0.85 + Math.random()*0.15;
  return Math.max(1, Math.round(base * stab * mult * variance));
}

// ================== BATTLE SETUP ==================
function buildBattleMon(speciesName, emoji, type, level, moves) {
  const stats = computeStats(baseStatsFor(speciesName), level);
  return { isWild: false, speciesName, emoji, type, level, hp: stats.maxHp, ...stats, moves: moves.map(m => ({...m})) };
}

export function startTrainerBattle(ctx) {
  let enemyTeam, enemyName;
  if (ctx === 'lineup') { enemyTeam = TRAINER_LINEUP[state.trainerIndex].team; enemyName = TRAINER_LINEUP[state.trainerIndex].name; }
  if (ctx === 'dario') { enemyTeam = RIVAL_DARIO.team; enemyName = RIVAL_DARIO.name; }
  if (ctx === 'league') { enemyTeam = LEAGUE_LEADERS[state.currentLeagueIdx].team; enemyName = LEAGUE_LEADERS[state.currentLeagueIdx].name; }
  if (ctx === 'vance') { enemyTeam = DIRECTOR_VANCE.team; enemyName = DIRECTOR_VANCE.name; }
  if (ctx === 'verdanyx') { enemyTeam = VERDANYX.team; enemyName = VERDANYX.name; }

  const enemyMons = enemyTeam.map(t => buildBattleMon(t.speciesName, t.emoji, t.type, t.level, t.moves));

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
// Mechanical, attacker/defender-agnostic: resolves one move, mutates HP,
// renders the result, and reports whether the defender fainted. Does not
// decide win/lose routing — callers own that, since "the enemy fainted" and
// "the player fainted" are genuinely different flows (next-enemy-mon/win vs
// switch-prompt/lose).
function executeMove(attacker, defender, move) {
  const attackerName = currentMonDisplay(attacker).name;
  if (move.power === 0) {
    renderBattle(`${attackerName} used ${move.name}! It had no direct effect this turn.`);
    return { fainted: false };
  }
  const mult = typeMultiplier(move.type, defender.type);
  const dmg = calcDamage(move, attacker, defender);
  defender.hp = Math.max(0, defender.hp - dmg);
  let msg = `${attackerName} used ${move.name}!`;
  if (mult === 0) msg += " It has no effect...";
  else if (mult > 1) msg += " It's super effective!";
  else if (mult < 1) msg += " It's not very effective...";
  renderBattle(msg);
  return { fainted: defender.hp <= 0 };
}

// Orchestrates a full turn: picks the enemy's move, resolves Speed-based
// order (tie -> coin flip), and sequences both attacks — skipping the
// slower mon's move if the faster one's hit already ended the battle.
// Still the function bound to each move button's onclick.
export function playerUseMove(idx) {
  const p = activeMon();
  const e = currentEnemy();
  // Guards a move button click landing during the brief win/faint transition
  // (after the last enemy mon's HP hits 0 but before the screen routes away),
  // where the stale move-grid buttons are still in the DOM but the battle has
  // already moved past this enemy — currentEnemy() can be undefined here.
  if (!e || e.hp <= 0) return;
  const move = p.moves[idx];
  const enemyMove = e.moves[Math.floor(Math.random() * e.moves.length)];

  const playerFirst = p.spe > e.spe || (p.spe === e.spe && Math.random() < 0.5);
  const [first, firstMove, firstIsPlayer, second, secondMove] = playerFirst
    ? [p, move, true, e, enemyMove]
    : [e, enemyMove, false, p, move];

  const firstResult = executeMove(first, second, firstMove);
  if (firstResult.fainted) {
    setTimeout(() => firstIsPlayer ? handleEnemyFainted() : handlePlayerFainted(), 500);
    return;
  }
  setTimeout(() => {
    const secondResult = executeMove(second, first, secondMove);
    if (secondResult.fainted) {
      setTimeout(() => firstIsPlayer ? handlePlayerFainted() : handleEnemyFainted(), 500);
    }
  }, 700);
}

// A single unanswered enemy move — used when the player's turn was spent
// switching (voluntary or forced) instead of attacking, so there's no
// player move to sequence against it.
export function enemyTurn() {
  const p = activeMon();
  const e = currentEnemy();
  if (!e || e.hp <= 0 || !p || p.hp <= 0) return;
  const move = e.moves[Math.floor(Math.random() * e.moves.length)];
  const result = executeMove(e, p, move);
  if (result.fainted) {
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
  if (mon.key) evolveIfReady(mon);

  // Recompute stats for the current (possibly post-evolution) species/level.
  // HP preserves the delta gained rather than healing to full; the other
  // stats have no "current" value to preserve and are flatly overwritten.
  const newStats = statsForMon(mon);
  const gained = newStats.maxHp - mon.maxHp;
  mon.maxHp = newStats.maxHp;
  mon.hp = Math.min(mon.maxHp, mon.hp + gained);
  mon.atk = newStats.atk;
  mon.def = newStats.def;
  mon.spAtk = newStats.spAtk;
  mon.spDef = newStats.spDef;
  mon.spe = newStats.spe;
  mon.xpNext = xpNeededForLevel(mon.level);

  if (mon.key) {
    const chain = STARTER_CHAINS[mon.key];
    const learned = chain.learnset.find(e => e.lvl === mon.level);
    if (learned) {
      const { lvl, ...moveData } = learned;
      const already = mon.moves.some(m => m.name === moveData.name);
      if (!already) {
        if (mon.moves.length < 4) {
          mon.moves.push(moveData);
        } else {
          queueMoveLearnPrompt(mon, moveData);
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
  pendingMoveLearn.mon.moves[idx] = {...pendingMoveLearn.newMove};
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
        xp: 0, xpNext: xpNeededForLevel(e.level),
        hp: e.hp, maxHp: e.maxHp, atk: e.atk, def: e.def, spAtk: e.spAtk, spDef: e.spDef, spe: e.spe,
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
    renderTrailMap();
    document.getElementById('trail-toast').textContent = `Beat ${state.battle.enemyName}! +₽${moneyRewardFor('lineup')}`;
    return;
  }
  if (ctx === 'dario') {
    state.darioBeaten = true;
    showScreen('trail');
    renderTrailMap();
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
  if (ctx === 'lineup' || ctx === 'dario') { showScreen('trail'); renderTrailMap(); document.getElementById('trail-toast').textContent = `Your team was outmatched. Regroup and try again.`; return; }
  if (ctx === 'league' || ctx === 'vance' || ctx === 'verdanyx') { showScreen('league-map'); renderLeagueMap(); document.getElementById('league-toast').textContent = `Your team was outmatched. Regroup and try again.`; return; }
}

function returnToPreviousScreen(msg) {
  // wild encounters can happen from the town map or the trail; default back to town
  showScreen('map');
  initTownMap();
  document.getElementById('header-title').textContent = "ZAU OUTSKIRTS";
  if (msg) document.getElementById('map-toast').textContent = msg;
}
