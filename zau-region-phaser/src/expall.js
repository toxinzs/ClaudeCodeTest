import { state } from './state.js';

// Exp. All: a key item that shares a knockout's XP with the rest of the party.
// On for everyone by default; the Party screen has a switch for the whole item
// (`state.expAll.on`) and a per-Pokémon toggle (`mon.noExp = true` opts one out),
// so a team can level together or be chosen one by one. Benched Pokémon earn
// half of what the fighter earns.
export const EXP_ALL_SHARE = 0.5;

// Gives the item once, to any save that has a Pokémon (a new game's starter, or
// an older save loading for the first time). Safe to call repeatedly.
export function ensureExpAll() {
  state.expAll ??= { on: true, given: false };
  if (state.party.length && !state.expAll.given) {
    state.expAll.given = true;
    state.items.expall = Math.max(1, state.items.expall || 0);
  }
}

export function expAllActive() {
  return !!state.expAll?.on && (state.items.expall || 0) > 0;
}

// Party members that share a KO's XP: not the fighter, not fainted, not opted out.
export function expShareRecipients(fighter) {
  if (!expAllActive()) return [];
  return state.party.filter(m => m !== fighter && m.hp > 0 && !m.noExp);
}
