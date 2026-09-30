import { state } from './state.js';

// Story + quest flags — the thing dialogue keys on so a character says
// different lines as the plot advances ("says when" in CHARACTERS.md).
// state.story holds beat flags (cargoRow, introDone…), state.quests holds
// per-quest status. Both live in the save; ensureStoryState() guards old
// saves, since Object.assign(state, saved) drops defaults that predate them.
// Badges in the main story: Coral, Ashgrave, Thistle, Prism, Obsidian, and
// Halcyon (Phase 28). The two postgame island leaders come later, on top.
export const MAIN_BADGES = 6;

export function ensureStoryState() {
  state.story ??= {};
  state.quests ??= {};
  // A save from before the Terminus has five entries; Object.assign(state,
  // saved) replaces the array wholesale. Pad rather than grandfather: a
  // player already past Act 2 just has Halcyon still to meet, optionally.
  state.leagueBeaten ??= [];
  while (state.leagueBeaten.length < MAIN_BADGES) state.leagueBeaten.push(false);
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
