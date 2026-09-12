import Phaser from 'phaser';
import { state } from './state.js';
import { TILE } from './config.js';
import { preloadPlayerLayers, createPlayerSprite } from './playerSprite.js';
import { inputLock } from './lock.js';
import { runScript } from './script.js';

// NPC runtime: real walking-sprite characters on the map (the same layered
// LPC art as the player, so every named person in CHARACTERS.md is one
// appearance object away from existing), standing on tiles the walker
// treats as blocked, facing the player when spoken to. Talk by pressing
// Space/Enter/Z while facing an NPC, or by clicking one that's adjacent.
// Each NPC's `script` is a function of state returning steps for
// script.js — that's the "says when" in CHARACTERS.md made mechanical.
const MOVE_MS = 140;
const DELTA = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function preloadNPCLayers(scene, npcs) {
  npcs.forEach(n => preloadPlayerLayers(scene, n.appearance));
}

// Builds an actor record the script runner can move: { ctrl, pos, moveTile }.
export function makeActor(scene, ctrl, pos, offsetX, offsetY) {
  return {
    ctrl, pos,
    moveTile(dx, dy, dir) {
      ctrl.setDirection(dir);
      pos.x += dx; pos.y += dy;
      ctrl.startWalk();
      return new Promise(res => scene.tweens.add({
        targets: ctrl.container,
        x: offsetX + pos.x * TILE + TILE / 2, y: offsetY + pos.y * TILE + TILE / 2,
        duration: MOVE_MS,
        onComplete: () => { ctrl.stopWalk(); res(); }
      }));
    }
  };
}

// Places NPCs, wires interaction, and returns { actors, isBlocked, npcs }.
// `player` is the actor record for the player (see makeActor); `walker` is
// the scene's createWalker result (for facing). Filters NPCs by `when`
// (a state predicate) so a character can be present only during a beat.
export function placeNPCs(scene, { npcs, offsetX, offsetY, player, walker, posRef }) {
  const placed = [];
  function spawn(def) {
    const pos = { x: def.x, y: def.y };
    const ctrl = createPlayerSprite(scene, offsetX + pos.x * TILE + TILE / 2, offsetY + pos.y * TILE + TILE / 2, def.appearance);
    ctrl.setDirection(def.facing || 'down');
    ctrl.container.setInteractive(new Phaser.Geom.Rectangle(-32, -32, 64, 64), Phaser.Geom.Rectangle.Contains);
    const npc = { def, pos, ctrl, actor: makeActor(scene, ctrl, pos, offsetX, offsetY) };
    ctrl.container.on('pointerdown', () => { if (isAdjacent(posRef, pos)) talk(npc); });
    if (scene.hudCam) scene.hudCam.ignore(ctrl.container);
    placed.push(npc);
    actors[def.id] = npc.actor;
    return npc;
  }
  // Presence (`when`) is re-evaluated after every script, so a character
  // whose beat just ended leaves the map now — not after the next scene
  // load — and one whose beat just began appears.
  function refresh() {
    for (const npc of [...placed]) {
      if (npc.def.when && !npc.def.when(state)) {
        npc.ctrl.destroy();
        placed.splice(placed.indexOf(npc), 1);
        delete actors[npc.def.id];
      }
    }
    for (const def of npcs) {
      if (placed.some(n => n.def === def)) continue;
      if (!def.when || def.when(state)) spawn(def);
    }
  }
  const actors = { player: player };
  npcs.filter(n => !n.when || n.when(state)).forEach(spawn);

  // Draw order: lower on the map = drawn later, so a character walking
  // below another overlaps correctly. Player is included via its container.
  const sortDepth = () => {
    placed.forEach(n => n.ctrl.container.setDepth(n.pos.y));
    player.ctrl.container.setDepth(posRef.y + 0.5);
  };
  sortDepth();
  scene.events.on('update', sortDepth);

  async function talk(npc) {
    if (inputLock.locked) return;
    // Face each other.
    const dx = posRef.x - npc.pos.x, dy = posRef.y - npc.pos.y;
    const toward = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    npc.ctrl.setDirection(toward);
    player.ctrl.setDirection(OPPOSITE[toward]);
    const steps = typeof npc.def.script === 'function' ? npc.def.script(state) : npc.def.script;
    await runScript(scene, steps, actors);
    if (scene.sys.settings.status !== Phaser.Scenes.SHUTDOWN) { if (npc.ctrl.container.active) npc.ctrl.setDirection(npc.def.facing || 'down'); refresh(); }
  }

  const onInteract = () => {
    if (inputLock.locked) return;
    const [dx, dy] = DELTA[walker.facing || 'down'];
    const target = placed.find(n => n.pos.x === posRef.x + dx && n.pos.y === posRef.y + dy);
    if (target) talk(target);
  };
  scene.input.keyboard.on('keydown-SPACE', onInteract);
  scene.input.keyboard.on('keydown-ENTER', onInteract);
  scene.input.keyboard.on('keydown-Z', onInteract);
  scene.events.once('shutdown', () => {
    scene.events.off('update', sortDepth);
    scene.input.keyboard.off('keydown-SPACE', onInteract);
    scene.input.keyboard.off('keydown-ENTER', onInteract);
    scene.input.keyboard.off('keydown-Z', onInteract);
  });

  return {
    actors,
    npcs: placed,
    isBlocked: (x, y) => placed.some(n => n.pos.x === x && n.pos.y === y),
    // Run a scene-level script (an on-map cutscene) with these actors.
    run: async (steps) => { await runScript(scene, steps, actors); if (scene.sys.settings.status !== Phaser.Scenes.SHUTDOWN) refresh(); },
    refresh
  };
}

function isAdjacent(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}
