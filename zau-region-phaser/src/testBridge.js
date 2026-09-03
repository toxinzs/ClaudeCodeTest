import { state } from './state.js';

// Single audit point for what Playwright (or any external driver) can
// observe about a running game — mirrors the old DOM version's
// window-export table, repointed at test introspection instead of
// onclick handlers. Extend this as new scenes/systems come online rather
// than reaching into scene internals directly from tests.
export function installTestBridge(game) {
  window.__zauTest = {
    getState: () => JSON.parse(JSON.stringify(state)),
    getScene: (key) => {
      const scene = game.scene.getScene(key);
      if (!scene) return null;
      return { key, active: game.scene.isActive(key) };
    }
  };
}
