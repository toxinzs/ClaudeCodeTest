import { state } from './state.js';

// Story + quest flags — the thing dialogue keys on so a character says
// different lines as the plot advances ("says when" in CHARACTERS.md).
// state.story holds beat flags (cargoRow, introDone…), state.quests holds
// per-quest status. Both live in the save; ensureStoryState() guards old
// saves, since Object.assign(state, saved) drops defaults that predate them.
export function ensureStoryState() {
  state.story ??= {};
  state.quests ??= {};
}

export function hasFlag(key) {
  ensureStoryState();
  return !!state.story[key];
}

export function setFlag(key, value = true) {
  ensureStoryState();
  state.story[key] = value;
}

export function badgeCount() {
  return (state.leagueBeaten || []).filter(Boolean).length;
}
