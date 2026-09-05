import { state, activeMon, firstHealthyIdx } from './state.js';
import { currentMonDisplay, computeStats, statsForMon, evolveIfReady, rollWildEncounter, xpNeededForLevel } from './mon.js';
import { baseStatsFor } from './data/baseStats.js';
import { ITEMS } from './data/items.js';
import { STARTER_CHAINS } from './data/pokemon.js';
import { TRAINER_LINEUP, RIVAL_DARIO, LEAGUE_LEADERS, DIRECTOR_VANCE, VERDANYX, moneyRewardFor } from './data/story.js';
import { saveGame } from './save.js';

// ================== TYPE EFFECTIVENESS (full official 18-type chart) ==================
// Ported verbatim from zau-region/src/battle.js — pure data, no DOM coupling.
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

function buildBattleMon(speciesName, emoji, type, level, moves) {
  const stats = computeStats(baseStatsFor(speciesName), level);
  return { isWild: false, speciesName, emoji, type, level, hp: stats.maxHp, ...stats, moves: moves.map(m => ({...m})) };
}

// Minimal dependency-free emitter — battleEngine has no DOM/Phaser coupling
// of its own, matching the migration plan's "emit events, don't touch the
// DOM directly" goal. BattleScene is what turns these events into pixels.
class Emitter {
  constructor() { this.listeners = {}; }
  on(evt, fn) { (this.listeners[evt] ??= []).push(fn); return this; }
  off(evt, fn) { this.listeners[evt] = (this.listeners[evt] || []).filter(f => f !== fn); }
  emit(evt, payload) { (this.listeners[evt] || []).forEach(fn => fn(payload)); }
}

// Owns battle flow/decisions (turn order, damage, catching, XP, win/lose).
// state.battle is the same shared, save-relevant battle context the DOM
// version used — this class is the only thing that mutates it during a
// battle. Emits 'render' (redraw the current battle state + log line) and
// 'end' (battle over — scene should transition out) instead of writing to
// the DOM directly.
export class BattleEngine extends Emitter {
  startTrainerBattle(ctx) {
    if (firstHealthyIdx() === -1) return false;
    let enemyTeam, enemyName;
    if (ctx === 'lineup') { enemyTeam = TRAINER_LINEUP[state.trainerIndex].team; enemyName = TRAINER_LINEUP[state.trainerIndex].name; }
    if (ctx === 'dario') { enemyTeam = RIVAL_DARIO.team; enemyName = RIVAL_DARIO.name; }
    if (ctx === 'league') { enemyTeam = LEAGUE_LEADERS[state.currentLeagueIdx].team; enemyName = LEAGUE_LEADERS[state.currentLeagueIdx].name; }
    if (ctx === 'vance') { enemyTeam = DIRECTOR_VANCE.team; enemyName = DIRECTOR_VANCE.name; }
    if (ctx === 'verdanyx') { enemyTeam = VERDANYX.team; enemyName = VERDANYX.name; }

    const enemyMons = enemyTeam.map(t => buildBattleMon(t.speciesName, t.emoji, t.type, t.level, t.moves));
    state.battle = { ctx, enemyName, enemyMons, enemyIdx: 0, isWild: false, moneyReward: moneyRewardFor(ctx) };
    this.render(`${enemyName} wants to battle!`);
    return true;
  }

  startWildEncounter(zoneKey) {
    if (firstHealthyIdx() === -1) return false;
    const wild = rollWildEncounter(zoneKey);
    state.battle = { ctx: 'wild', enemyName: wild.speciesName, enemyMons: [wild], enemyIdx: 0, isWild: true, moneyReward: 0 };
    this.render(`A wild ${wild.speciesName} appeared!`);
    return true;
  }

  currentEnemy() { return state.battle.enemyMons[state.battle.enemyIdx]; }

  render(log) {
    // A delayed caller (e.g. the move-learn prompt, which waits on a user
    // choice) can fire after the battle has already advanced past its last
    // enemy or ended outright — nothing useful to render at that point.
    if (!state.battle || !this.currentEnemy()) return;
    const p = activeMon();
    const pd = currentMonDisplay(p);
    const e = this.currentEnemy();
    const ed = currentMonDisplay(e);
    this.emit('render', {
      log,
      isWild: state.battle.isWild,
      player: { name: pd.name, level: p.level, hp: p.hp, maxHp: p.maxHp, sprite: pd.sprite, emoji: pd.emoji, moves: p.moves },
      enemy: { name: e.speciesName, level: e.level, hp: e.hp, maxHp: e.maxHp, sprite: ed.sprite, emoji: ed.emoji }
    });
  }

  // Mechanical, attacker/defender-agnostic: resolves one move, mutates HP,
  // renders the result, and reports whether the defender fainted. Does not
  // decide win/lose routing — callers own that.
  executeMove(attacker, defender, move) {
    const attackerName = currentMonDisplay(attacker).name;
    if (move.power === 0) {
      this.render(`${attackerName} used ${move.name}! It had no direct effect this turn.`);
      return { fainted: false };
    }
    const mult = typeMultiplier(move.type, defender.type);
    const dmg = calcDamage(move, attacker, defender);
    defender.hp = Math.max(0, defender.hp - dmg);
    if (defender.hp <= 0) defender.fainted = true;
    let msg = `${attackerName} used ${move.name}!`;
    if (mult === 0) msg += " It has no effect...";
    else if (mult > 1) msg += " It's super effective!";
    else if (mult < 1) msg += " It's not very effective...";
    this.render(msg);
    return { fainted: defender.hp <= 0 };
  }

  // Orchestrates a full turn: picks the enemy's move, resolves Speed-based
  // order (tie -> coin flip), and sequences both attacks — skipping the
  // slower mon's move if the faster one's hit already ended the battle.
  playerUseMove(idx) {
    const p = activeMon();
    const e = this.currentEnemy();
    if (!e || e.hp <= 0) return;
    const move = p.moves[idx];
    const enemyMove = e.moves[Math.floor(Math.random() * e.moves.length)];

    const playerFirst = p.spe > e.spe || (p.spe === e.spe && Math.random() < 0.5);
    const [first, firstMove, firstIsPlayer, second, secondMove] = playerFirst
      ? [p, move, true, e, enemyMove]
      : [e, enemyMove, false, p, move];

    const firstResult = this.executeMove(first, second, firstMove);
    if (firstResult.fainted) {
      setTimeout(() => firstIsPlayer ? this.handleEnemyFainted() : this.handlePlayerFainted(), 500);
      return;
    }
    setTimeout(() => {
      const secondResult = this.executeMove(second, first, secondMove);
      if (secondResult.fainted) {
        setTimeout(() => firstIsPlayer ? this.handlePlayerFainted() : this.handleEnemyFainted(), 500);
      }
    }, 700);
  }

  // A single unanswered enemy move — used after a failed catch attempt,
  // where the player's turn was spent throwing a ball instead of attacking.
  enemyTurnOnly() {
    const p = activeMon();
    const e = this.currentEnemy();
    if (!e || e.hp <= 0 || !p || p.hp <= 0) return;
    const move = e.moves[Math.floor(Math.random() * e.moves.length)];
    const result = this.executeMove(e, p, move);
    if (result.fainted) setTimeout(() => this.handlePlayerFainted(), 600);
  }

  handlePlayerFainted() {
    const nextIdx = firstHealthyIdx();
    if (nextIdx === -1) {
      this.render(`${currentMonDisplay(activeMon()).name} fainted. Your whole team is down...`);
      setTimeout(() => this.loseBattle(), 1200);
    } else {
      // Phase 2 scope: auto-switch to the next healthy party member — a
      // manual switch choice returns once the Phase 4 party UI exists here.
      state.activeIdx = nextIdx;
      setTimeout(() => this.render(`${currentMonDisplay(activeMon()).name}, go!`), 800);
    }
  }

  handleEnemyFainted() {
    const p = activeMon();
    const e = this.currentEnemy();
    const xpGain = 12 + e.level * 4;
    this.render(`${e.speciesName} fainted! ${currentMonDisplay(p).name} gained ${xpGain} XP.`);
    this.gainXp(p, xpGain);

    state.battle.enemyIdx++;
    if (state.battle.enemyIdx < state.battle.enemyMons.length) {
      setTimeout(() => this.render(`${state.battle.enemyName} sends out ${this.currentEnemy().speciesName}!`), 1000);
    } else {
      setTimeout(() => this.winBattle(), 1200);
    }
  }

  // ================== XP / LEVELING ==================
  gainXp(mon, amount) {
    mon.xp += amount;
    while (mon.xp >= mon.xpNext) {
      mon.xp -= mon.xpNext;
      this.levelUpMon(mon);
    }
  }

  levelUpMon(mon) {
    mon.level++;
    if (mon.key) evolveIfReady(mon);

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
            this.emit('moveLearnPrompt', { mon, newMove: moveData });
          }
        }
      }
    }
  }

  // ================== CATCHING / FLEEING ==================
  throwPokeBall(ballKey = 'pokeball') {
    if (!state.items[ballKey] || state.items[ballKey] <= 0) {
      this.render("You don't have any of those! Grab more at the Mart.");
      return;
    }
    const e = this.currentEnemy();
    if (!e || e.hp <= 0) return;
    state.items[ballKey]--;
    const hpPct = e.hp / e.maxHp;
    const catchChance = Math.min(0.95, (0.9 - hpPct*0.7) * ITEMS[ballKey].catchMult);
    this.render(`You throw a ${ITEMS[ballKey].name}...`);
    setTimeout(() => {
      if (Math.random() < catchChance) {
        const caughtMon = {
          speciesName: e.speciesName, emoji: e.emoji, type: e.type, level: e.level,
          xp: 0, xpNext: xpNeededForLevel(e.level),
          hp: e.hp, maxHp: e.maxHp, atk: e.atk, def: e.def, spAtk: e.spAtk, spDef: e.spDef, spe: e.spe,
          moves: e.moves.map(m => ({...m})), nickname: e.speciesName, fainted: false, isWild: false
        };
        state.party.push(caughtMon);
        this.render(`Gotcha! ${e.speciesName} was caught!`);
        setTimeout(() => this.winBattle(true), 1300);
      } else {
        this.render(`${e.speciesName} broke free!`);
        setTimeout(() => this.enemyTurnOnly(), 900);
      }
    }, 900);
  }

  tryFlee() {
    if (state.battle.isWild) {
      this.emit('end', { outcome: 'flee', ctx: state.battle.ctx, msg: 'Got away safely.' });
    } else {
      this.render("You can't flee a trainer battle!");
    }
  }

  // ================== OUTCOMES ==================
  winBattle(caughtNotDefeated) {
    const ctx = state.battle.ctx;
    if (state.battle.moneyReward) state.money += state.battle.moneyReward;

    let msg = null;
    if (ctx === 'wild') {
      msg = caughtNotDefeated ? 'Added to your party!' : `You defeated the wild ${state.battle.enemyName}!`;
    } else if (ctx === 'lineup') {
      state.trainerIndex++;
      msg = `Beat ${state.battle.enemyName}! +₽${moneyRewardFor('lineup')}`;
    } else if (ctx === 'dario') {
      state.darioBeaten = true;
      msg = `You beat Dario Voss! The Zau League is open.`;
    } else if (ctx === 'league') {
      state.leagueBeaten[state.currentLeagueIdx] = true;
      const cleared = state.leagueBeaten.filter(Boolean).length;
      msg = cleared >= 5
        ? `All 5 League Leaders defeated! Meridian Tower is open.`
        : `${LEAGUE_LEADERS[state.currentLeagueIdx].locationName} cleared! (${cleared}/5 leaders)`;
    } else if (ctx === 'vance') {
      state.vanceBeaten = true;
      msg = `You beat Director Vance! The Underlight has opened beneath the city.`;
    } else if (ctx === 'verdanyx') {
      state.verdanyxBeaten = true;
      msg = `You defeated Verdanyx!`; // the real end-screen flow lands in a later phase
    }
    saveGame();
    this.emit('end', { outcome: 'win', ctx, msg });
  }

  loseBattle() {
    const ctx = state.battle.ctx;
    state.party.forEach(m => { if (m.fainted) { m.fainted = false; m.hp = Math.floor(m.maxHp*0.4); } });
    state.activeIdx = firstHealthyIdx() === -1 ? 0 : firstHealthyIdx();
    saveGame();
    this.emit('end', { outcome: 'lose', ctx, msg: 'Your team was outmatched. Regroup and try again.' });
  }
}
