import { state } from './state.js';
import { ensureDexState } from './dex.js';
import { ensureExpAll } from './expall.js';

const SAVE_KEY = 'zauRegionSave';
const SAVE_VERSION = 1;

export function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, state }));
  } catch (e) {
    console.error('Failed to save game', e);
  }
}

// Browser storage can throw (blocked site data, a sandboxed frame), so every
// access is guarded: without it the game still runs, it just can't save.
export function hasSave() {
  try { return localStorage.getItem(SAVE_KEY) !== null; } catch { return false; }
}

// Mutates the existing `state` object in place (never reassigns it) — other
// modules hold a live binding to that exact object, so replacing it here
// would leave them pointing at the stale pre-load state.
export function loadGame() {
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch { return false; }
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) {
      console.warn(`Save is version ${parsed.version}, expected ${SAVE_VERSION} — ignoring.`);
      return false;
    }
    Object.assign(state, parsed.state);
    ensureDexState();
    ensureExpAll();
    return true;
  } catch (e) {
    console.error('Failed to load save', e);
    return false;
  }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* storage unavailable */ }
}
