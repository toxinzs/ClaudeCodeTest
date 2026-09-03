import { state } from './state.js';

const SAVE_KEY = 'zauRegionSave';
const SAVE_VERSION = 1;

export function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, state }));
  } catch (e) {
    console.error('Failed to save game', e);
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

// Mutates the existing `state` object in place (never reassigns it) — other
// modules hold a live binding to that exact object, so replacing it here
// would leave them pointing at the stale pre-load state.
export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) {
      console.warn(`Save is version ${parsed.version}, expected ${SAVE_VERSION} — ignoring.`);
      return false;
    }
    Object.assign(state, parsed.state);
    return true;
  } catch (e) {
    console.error('Failed to load save', e);
    return false;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
