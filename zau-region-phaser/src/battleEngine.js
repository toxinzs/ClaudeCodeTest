import { state, activeMon, firstHealthyIdx, MAX_PARTY } from './state.js';
import { trainerFor } from './data/trainers.js';
import { setFlag } from './story.js';
import { currentMonDisplay, computeStats, statsForMon, evolveIfReady, rollWildEncounter, xpNeededForLevel, applyMega, revertMega } from './mon.js';
import { baseStatsFor } from './data/baseStats.js';
import { abilityFor } from './data/abilities.js';
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
  // Adaptability (Mega Lucario) is the real 2x STAB instead of 1.5x.
  const stab = attacker.type.split("/").includes(move.type) ? (attacker.ability?.effect === 'adaptability' ? 2 : 1.5) : 1;
  const hasGuts = attacker.ability?.effect === 'guts';
  const burnPenalty = (attacker.status === 'burn' && move.category === 'Physical' && !hasGuts) ? 0.5 : 1;
  const guts = hasGuts && attacker.status ? 1.5 : 1;
  const lowHpBoost = abilityLowHpBoost(attacker, move);
  const heldBoost = attacker.heldItem && ITEMS[attacker.heldItem]?.effect === 'type_boost' && ITEMS[attacker.heldItem].boostType === move.type ? 1.2 : 1;
  const flashFireBoost = attacker.flashFireActive && move.type === 'Fire' ? 1.5 : 1;
  const variance = 0.85 + Math.random()*0.15;
  return Math.max(1, Math.round(base * stab * mult * burnPenalty * guts * lowHpBoost * heldBoost * flashFireBoost * variance));
}

// Overgrow/Blaze/Torrent/Swarm (1.5x at 1/3 max HP or below) and Verdanyx's
// custom Verdant Surge (always-on, no HP condition) — same shape, different
// trigger, so one helper covers both.
function abilityLowHpBoost(attacker, move) {
  const ability = attacker.ability;
  if (!ability || ability.boostType !== move.type) return 1;
  if (ability.effect === 'low_hp_boost') return attacker.hp <= attacker.maxHp / 3 ? 1.5 : 1;
  if (ability.effect === 'verdant_surge') return 1.5;
  return 1;
}

// ================== STATUS CONDITIONS (burn/poison/paralyze/sleep) ==================
// Simplified to the four conditions actually reachable from data/moves.js
// today (no move in the current roster has a real freeze/confuse chance) —
// same "real mechanics, simplified formula" precedent as the stat/damage
// formulas. A mon can only hold one major status at a time, matching the
// real games.
const STATUS_MSG = {
  burn: (name) => `${name} was burned!`,
  poison: (name) => `${name} was poisoned!`,
  paralyze: (name) => `${name} was paralyzed! It may be unable to move!`,
  sleep: (name) => `${name} fell asleep!`
};

function applyStatus(mon, status) {
  mon.status = status;
  if (status === 'sleep') mon.sleepTurns = 1 + Math.floor(Math.random() * 3);
}

// Every status-inflicting path (a move's rollStatus, Static/Flame Body's
// on-contact roll) goes through here rather than applyStatus directly, so
// Lum Berry's "cures the instant one lands" real-game behavior is one
// choke point instead of duplicated at each call site.
function inflictStatus(mon, status) {
  if (mon.heldItem === 'lumberry') {
    mon.heldItem = null;
    return { applied: false, curedByBerry: true };
  }
  applyStatus(mon, status);
  return { applied: true, curedByBerry: false };
}

// Speed used for turn-order only — paralysis halves it in the real games
// without touching the mon's actual spe stat.
function effectiveSpeed(mon) {
  return mon.status === 'paralyze' ? mon.spe * 0.5 : mon.spe;
}

function buildBattleMon(speciesName, emoji, type, level, moves) {
  const stats = computeStats(baseStatsFor(speciesName), level);
  return { isWild: false, speciesName, emoji, type, level, hp: stats.maxHp, ...stats, moves: moves.map(m => ({...m})), status: null, heldItem: null, ability: abilityFor(speciesName) };
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
  // Flash Fire's boost is a real "for the rest of this battle" flag, not a
  // permanent one — party mons persist across battles via save, so it has
  // to be cleared at the start of every new one or it'd leak forward.
  resetBattleFlags() {
    state.party.forEach(m => { m.flashFireActive = false; revertMega(m); });
  }

  // ================== MEGA EVOLUTION ==================
  // Real rules: the trainer needs the Key Stone, the mon must hold its own
  // species' Mega Stone, and it's once per battle. Transforming doesn't
  // cost the turn — the player still picks a move afterward, same as the
  // real games' "Mega Evolve, then attack" flow.
  canMegaEvolve() {
    if (!state.battle || state.battle.megaUsed || !state.hasKeyStone) return false;
    const p = activeMon();
    if (!p || p.hp <= 0 || p.megaActive || !p.heldItem) return false;
    const item = ITEMS[p.heldItem];
    return item?.effect === 'mega_stone' && item.megaFor === currentMonDisplay(p).species;
  }

  megaEvolve() {
    if (!this.canMegaEvolve()) return;
    const p = activeMon();
    const before = currentMonDisplay(p).name;
    const mega = applyMega(p);
    if (!mega) return;
    state.battle.megaUsed = true;
    this.render(`${before} Mega Evolved into ${mega.megaName}!`);
  }

  revertAllMegas() {
    state.party.forEach(m => revertMega(m));
  }

  startTrainerBattle(ctx, trainerKey) {
    if (firstHealthyIdx() === -1) return false;
    this.resetBattleFlags();
    let enemyTeam, enemyName, trainer = null;
    if (ctx === 'trainer') { trainer = trainerFor(trainerKey); enemyTeam = trainer.team; enemyName = trainer.name; }
    if (ctx === 'lineup') { enemyTeam = TRAINER_LINEUP[state.trainerIndex].team; enemyName = TRAINER_LINEUP[state.trainerIndex].name; }
    if (ctx === 'dario') { enemyTeam = RIVAL_DARIO.team; enemyName = RIVAL_DARIO.name; }
    if (ctx === 'league') { enemyTeam = LEAGUE_LEADERS[state.currentLeagueIdx].team; enemyName = LEAGUE_LEADERS[state.currentLeagueIdx].name; }
    if (ctx === 'vance') { enemyTeam = DIRECTOR_VANCE.team; enemyName = DIRECTOR_VANCE.name; }
    if (ctx === 'verdanyx') { enemyTeam = VERDANYX.team; enemyName = VERDANYX.name; }

    const enemyMons = enemyTeam.map(t => buildBattleMon(t.speciesName, t.emoji, t.type, t.level, t.moves));
    state.battle = { ctx, trainerKey, enemyName, enemyMons, enemyIdx: 0, isWild: false, moneyReward: trainer ? trainer.reward : moneyRewardFor(ctx) };
    this.render(`${enemyName} wants to battle!`);
    return true;
  }

  startWildEncounter(zoneKey) {
    if (firstHealthyIdx() === -1) return false;
    this.resetBattleFlags();
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
      canMega: this.canMegaEvolve(),
      player: { name: pd.name, level: p.level, hp: p.hp, maxHp: p.maxHp, sprite: pd.sprite, emoji: pd.emoji, moves: p.moves, status: p.status, ability: p.ability?.name },
      enemy: { name: e.speciesName, level: e.level, hp: e.hp, maxHp: e.maxHp, sprite: ed.sprite, emoji: ed.emoji, status: e.status, ability: e.ability?.name }
    });
  }

  // Mechanical, attacker/defender-agnostic: resolves one move, mutates HP,
  // renders the result, and reports whether the defender fainted. Does not
  // decide win/lose routing — callers own that. A move's status/statusChance
  // (data/moves.js) can inflict a condition on the defender, whether or not
  // the move itself deals damage — real games' status moves (Hypnosis) and
  // damaging moves with a secondary chance (Ember, Thunder Shock) both work
  // this way.
  executeMove(attacker, defender, move) {
    const attackerName = currentMonDisplay(attacker).name;
    const defenderName = currentMonDisplay(defender).name;

    // Flash Fire / Levitate: real full-immunity abilities, checked before
    // anything else — a Fire/Ground move against them never lands at all,
    // damage or status.
    if (move.type === 'Fire' && defender.ability?.effect === 'flash_fire') {
      defender.flashFireActive = true;
      this.render(`${attackerName} used ${move.name}! ${defenderName}'s Flash Fire absorbed it!`);
      return { fainted: false };
    }
    if (move.type === 'Ground' && defender.ability?.effect === 'levitate' && move.power > 0) {
      this.render(`${attackerName} used ${move.name}! It doesn't affect ${defenderName} (Levitate)!`);
      return { fainted: false };
    }

    let msg = `${attackerName} used ${move.name}!`;

    if (move.power === 0) {
      const result = this.rollStatus(defender, move);
      msg += result.msg || ' It had no direct effect this turn.';
      msg += this.applySynchronize(attacker, defender, result.status);
      this.render(msg);
      return { fainted: false };
    }

    const mult = typeMultiplier(move.type, defender.type);
    let dmg = calcDamage(move, attacker, defender);
    // Sturdy: survive a hit that would otherwise KO from full HP, matching
    // the real ability exactly (not a percentage chance).
    let sturdyTriggered = false;
    if (defender.ability?.effect === 'sturdy' && defender.hp === defender.maxHp && dmg >= defender.hp) {
      dmg = defender.hp - 1;
      sturdyTriggered = true;
    }
    defender.hp = Math.max(0, defender.hp - dmg);
    if (defender.hp <= 0) { defender.fainted = true; defender.status = null; }
    if (mult === 0) msg += " It has no effect...";
    else if (mult > 1) msg += " It's super effective!";
    else if (mult < 1) msg += " It's not very effective...";
    if (sturdyTriggered) msg += ` ${defenderName} hung on with Sturdy!`;
    if (defender.hp > 0) {
      const result = this.rollStatus(defender, move);
      msg += result.msg;
      msg += this.applySynchronize(attacker, defender, result.status);
      msg += this.rollContactAbility(attacker, defender, move);
    }
    this.render(msg);
    return { fainted: defender.hp <= 0 };
  }

  // Rolls a move's secondary/primary status chance against the defender.
  // Lum Berry cures the status the instant it lands (real games), which is
  // why this goes through inflictStatus rather than setting mon.status
  // directly — status/msg reflect what actually stuck, not what was rolled.
  rollStatus(defender, move) {
    if (!move.status || defender.status) return { msg: '', status: null };
    if (Math.random() >= (move.statusChance ?? 1)) return { msg: '', status: null };
    const result = inflictStatus(defender, move.status);
    const name = currentMonDisplay(defender).name;
    if (result.curedByBerry) return { msg: ` ${name}'s Lum Berry cured the ${move.status}!`, status: null };
    return { msg: ` ${STATUS_MSG[move.status](name)}`, status: move.status };
  }

  // Synchronize: if the mon that just got statused (burn/poison/paralyze —
  // real games exclude sleep) has it, the status passes back to whoever
  // caused it, unless they're already statused themselves.
  applySynchronize(attacker, defender, status) {
    if (!status || status === 'sleep') return '';
    if (defender.ability?.effect !== 'synchronize' || attacker.status) return '';
    const result = inflictStatus(attacker, status);
    return result.applied ? ` ${currentMonDisplay(attacker).name}'s Synchronize passed it back!` : '';
  }

  // Static/Flame Body: a Physical hit against them has a real 30% chance
  // of statusing the attacker on contact.
  rollContactAbility(attacker, defender, move) {
    if (move.category !== 'Physical' || attacker.status) return '';
    const effect = defender.ability?.effect;
    const statusToApply = effect === 'static' ? 'paralyze' : effect === 'flame_body' ? 'burn' : null;
    if (!statusToApply || Math.random() >= 0.3) return '';
    const result = inflictStatus(attacker, statusToApply);
    if (!result.applied) return '';
    const abilityName = defender.ability.name;
    return ` ${currentMonDisplay(attacker).name} was ${statusToApply === 'burn' ? 'burned' : 'paralyzed'} by ${abilityName}!`;
  }

  // Sleep/paralysis can stop a mon from acting at all this turn. Sleep's
  // turn counter ticks down here — hitting 0 wakes the mon up in time to
  // still act this turn, matching the real games.
  canAct(mon) {
    if (mon.status === 'sleep') {
      mon.sleepTurns--;
      if (mon.sleepTurns <= 0) { mon.status = null; return { can: true }; }
      return { can: false, msg: `${currentMonDisplay(mon).name} is fast asleep.` };
    }
    if (mon.status === 'paralyze' && Math.random() < 0.25) {
      return { can: false, msg: `${currentMonDisplay(mon).name} is paralyzed! It can't move!` };
    }
    return { can: true };
  }

  // End-of-turn burn/poison damage — real games' fractional-maxHP chip
  // damage, applied after both sides have acted (or tried to).
  tickStatus(mon) {
    if (!mon.status || mon.hp <= 0) return { fainted: false, msg: null };
    if (mon.status !== 'burn' && mon.status !== 'poison') return { fainted: false, msg: null };
    const frac = mon.status === 'burn' ? 1 / 16 : 1 / 8;
    const dmg = Math.max(1, Math.floor(mon.maxHp * frac));
    const label = mon.status === 'burn' ? 'burn' : 'poison';
    mon.hp = Math.max(0, mon.hp - dmg);
    if (mon.hp <= 0) { mon.fainted = true; mon.status = null; }
    return { fainted: mon.hp <= 0, msg: `${currentMonDisplay(mon).name} is hurt by its ${label}!` };
  }

  // Runs one mon's action (can-act gate, then executeMove) and either
  // diverts to faint-handling or continues via onDone. Shared by both
  // halves of a full turn.
  runMove(attacker, defender, move, attackerIsPlayer, onDone) {
    const gate = this.canAct(attacker);
    if (!gate.can) {
      this.render(gate.msg);
      onDone();
      return;
    }
    const result = this.executeMove(attacker, defender, move);
    if (result.fainted) {
      setTimeout(() => attackerIsPlayer ? this.handleEnemyFainted() : this.handlePlayerFainted(), 500);
      return;
    }
    onDone();
  }

  // End-of-turn status ticks, run once both sides have acted (or a single
  // side acted, for enemyTurnOnly's after-a-failed-catch case).
  endOfTurn() {
    const p = activeMon();
    const e = this.currentEnemy();
    if (!e) return;
    const msgs = [];
    const pTick = this.tickStatus(p);
    if (pTick.msg) msgs.push(pTick.msg);
    const eTick = this.tickStatus(e);
    if (eTick.msg) msgs.push(eTick.msg);
    if (!pTick.fainted) { const m = this.rollShedSkin(p); if (m) msgs.push(m); }
    if (!eTick.fainted) { const m = this.rollShedSkin(e); if (m) msgs.push(m); }
    if (!pTick.fainted) { const m = this.tickLeftovers(p); if (m) msgs.push(m); }
    if (!eTick.fainted) { const m = this.tickLeftovers(e); if (m) msgs.push(m); }
    if (msgs.length) this.render(msgs.join(' '));
    if (pTick.fainted) { setTimeout(() => this.handlePlayerFainted(), 600); return; }
    if (eTick.fainted) { setTimeout(() => this.handleEnemyFainted(), 600); return; }
  }

  // Shed Skin: a real 1-in-3 chance per turn to shake off any status.
  rollShedSkin(mon) {
    if (!mon.status || mon.hp <= 0 || mon.ability?.effect !== 'shed_skin') return null;
    if (Math.random() >= 1 / 3) return null;
    mon.status = null;
    return `${currentMonDisplay(mon).name}'s Shed Skin cured its status!`;
  }

  // Leftovers: real 1/16-max-HP heal every turn, held rather than an
  // ability — same end-of-turn checkpoint as status ticks/Shed Skin.
  tickLeftovers(mon) {
    if (mon.heldItem !== 'leftovers' || mon.hp <= 0 || mon.hp >= mon.maxHp) return null;
    mon.hp = Math.min(mon.maxHp, mon.hp + Math.max(1, Math.floor(mon.maxHp / 16)));
    return `${currentMonDisplay(mon).name} restored a little HP with its Leftovers!`;
  }

  // Orchestrates a full turn: picks the enemy's move, resolves Speed-based
  // order (paralysis halves effective speed; tie -> coin flip), sequences
  // both attacks — skipping the slower mon's move if the faster one's hit
  // already ended the battle — then ticks end-of-turn status damage.
  playerUseMove(idx) {
    const p = activeMon();
    const e = this.currentEnemy();
    if (!e || e.hp <= 0) return;
    const move = p.moves[idx];
    const enemyMove = e.moves[Math.floor(Math.random() * e.moves.length)];

    const playerFirst = effectiveSpeed(p) > effectiveSpeed(e) || (effectiveSpeed(p) === effectiveSpeed(e) && Math.random() < 0.5);
    const [first, firstMove, firstIsPlayer, second, secondMove] = playerFirst
      ? [p, move, true, e, enemyMove]
      : [e, enemyMove, false, p, move];

    this.runMove(first, second, firstMove, firstIsPlayer, () => {
      if (first.hp <= 0 || second.hp <= 0) return;
      setTimeout(() => {
        this.runMove(second, first, secondMove, !firstIsPlayer, () => {
          if (first.hp <= 0 || second.hp <= 0) return;
          setTimeout(() => this.endOfTurn(), 500);
        });
      }, 700);
    });
  }

  // A single unanswered enemy move — used after a failed catch attempt,
  // where the player's turn was spent throwing a ball instead of attacking.
  enemyTurnOnly() {
    const p = activeMon();
    const e = this.currentEnemy();
    if (!e || e.hp <= 0 || !p || p.hp <= 0) return;
    const move = e.moves[Math.floor(Math.random() * e.moves.length)];
    this.runMove(e, p, move, false, () => {
      if (p.hp <= 0 || e.hp <= 0) return;
      setTimeout(() => this.endOfTurn(), 600);
    });
  }

  handlePlayerFainted() {
    revertMega(activeMon()); // a fainted Mega reverts, matching the real games
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
    evolveIfReady(mon);

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
    // Real games boost catch odds against a statused target — sleep/freeze
    // more than the others; we only have the four conditions below, so
    // sleep gets the bigger bonus and burn/poison/paralyze share the lesser one.
    const statusMult = e.status === 'sleep' ? 2 : e.status ? 1.5 : 1;
    const catchChance = Math.min(0.95, (0.9 - hpPct*0.7) * ITEMS[ballKey].catchMult * statusMult);
    this.render(`You throw a ${ITEMS[ballKey].name}...`);
    setTimeout(() => {
      if (Math.random() < catchChance) {
        const caughtMon = {
          speciesName: e.speciesName, emoji: e.emoji, type: e.type, level: e.level,
          xp: 0, xpNext: xpNeededForLevel(e.level),
          hp: e.hp, maxHp: e.maxHp, atk: e.atk, def: e.def, spAtk: e.spAtk, spDef: e.spDef, spe: e.spe,
          moves: e.moves.map(m => ({...m})), nickname: e.speciesName, fainted: false,
          isWild: false, status: e.status || null, sleepTurns: e.sleepTurns,
          heldItem: null, ability: e.ability
        };
        // Real games keep a full party at 6 and send anything caught past
        // that straight to the PC — the player picks it up from the Box
        // overlay rather than losing the catch or being forced to swap.
        if (state.party.length < MAX_PARTY) {
          state.party.push(caughtMon);
          this.render(`Gotcha! ${e.speciesName} was caught!`);
        } else {
          state.box.push(caughtMon);
          this.render(`Gotcha! ${e.speciesName} was caught and sent to your PC Box (party's full).`);
        }
        setTimeout(() => this.winBattle(true), 1300);
      } else {
        this.render(`${e.speciesName} broke free!`);
        setTimeout(() => this.enemyTurnOnly(), 900);
      }
    }, 900);
  }

  tryFlee() {
    if (state.battle.isWild) {
      this.revertAllMegas();
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
      state.hasKeyStone = true;
      msg = `You beat Dario Voss! He tosses you a Key Stone — "You'll need this more than me." The Zau League is open.`;
    } else if (ctx === 'trainer') {
      const t = trainerFor(state.battle.trainerKey);
      if (t.winFlag) setFlag(t.winFlag);
      msg = t.winMsg || `Beat ${t.name}! +₽${t.reward}`;
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
    this.revertAllMegas();
    saveGame();
    this.emit('end', { outcome: 'win', ctx, msg });
  }

  loseBattle() {
    const ctx = state.battle.ctx;
    // Fainting itself clears status (matches the real games) — a party
    // member that just survived the loss keeps whatever status it had.
    state.party.forEach(m => { if (m.fainted) { m.fainted = false; m.hp = Math.floor(m.maxHp*0.4); m.status = null; } });
    state.activeIdx = firstHealthyIdx() === -1 ? 0 : firstHealthyIdx();
    this.revertAllMegas();
    saveGame();
    this.emit('end', { outcome: 'lose', ctx, msg: 'Your team was outmatched. Regroup and try again.' });
  }
}
