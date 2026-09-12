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
    },
    // Test-only: mutates the live state object directly (not a clone), so
    // Playwright can set up scenarios — a full party + boxed catches, an
    // inflicted status — without grinding real encounters for each one.
    mutateState: (fn) => { fn(state); },
    // Test-only navigation. Late-game maps (the Tower, the Skyline) sit
    // behind five or six real map transitions; a test that only wants to
    // exercise what happens *there* shouldn't have to walk the whole
    // region to get there. Stops whatever is running first, so no overlay
    // or previous map is left rendering underneath.
    goTo: (key, data) => {
      game.scene.getScenes(true).forEach(s => { if (s.scene.key !== key) game.scene.stop(s.scene.key); });
      game.scene.start(key, data);
    }
  };
}
