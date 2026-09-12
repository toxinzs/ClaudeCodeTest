import { inputLock } from './lock.js';

// Escape / M opens the pause menu on a map scene — unless a dialogue,
// cutscene, or another overlay already owns the input.
export function enablePauseMenu(scene) {
  const open = () => {
    if (inputLock.locked) return;
    if (['Pause', 'Party', 'Bag', 'Mart', 'Center', 'Dex', 'Quests'].some(k => scene.scene.isActive(k))) return;
    scene.scene.launch('Pause', { parentKey: scene.scene.key });
  };
  scene.input.keyboard.on('keydown-ESC', open);
  scene.input.keyboard.on('keydown-M', open);
  scene.events.once('shutdown', () => { scene.input.keyboard.off('keydown-ESC', open); scene.input.keyboard.off('keydown-M', open); });
}
