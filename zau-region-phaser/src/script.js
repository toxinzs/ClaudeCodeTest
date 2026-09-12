import { state } from './state.js';
import { saveGame } from './save.js';
import { setFlag } from './story.js';
import { inputLock } from './lock.js';
import { say, choose } from './dialogue.js';
import Phaser from 'phaser';
import { goToScene, closeOverlays } from './transitions.js';

// The cutscene/dialogue script runner. A script is an array of steps, run
// top to bottom, each awaited — so writing a scene reads like stage
// directions instead of callback chains:
//
//   [ { walk: { actor: 'alma', path: 'LL' } },
//     { face: { actor: 'alma', dir: 'right' } },
//     { say: ['Alma', "You got your bag?"] },
//     { choice: { name: 'Alma', prompt: 'Ready?', options: [
//         { label: 'Yes', then: [ { say: ['Alma', 'Go on then.'] } ] },
//         { label: 'Not yet', then: [ { say: ['Alma', "Take your time."] } ] } ] } },
//     { set: 'introDone' } ]
//
// Steps: say, choice, if, set, give, money, heal, walk, face, wait, pan,
// flash, shake, call, battle. NPC scripts in data/npcs.js are functions of
// state so a character's lines change as the story advances; `if` handles
// branching inside one script. `battle` ends the script (the outcome is
// recorded via the trainer's winFlag, and the scene it returns to reads
// that flag), which is how a beat continues after a fight.
//
// `actors` maps ids to { ctrl, pos, offsetX, offsetY, moveTile } — the
// player and every placed NPC (see npcs.js). Movement in scripts bypasses
// the walker's onStep on purpose: a scripted walk must not roll encounters.
export async function runScript(scene, steps, actors = {}) {
  inputLock.acquire();
  closeOverlays(scene, { keepDialogue: true });
  try {
    await runSteps(scene, steps, actors);
  } finally {
    inputLock.release();
    saveGame();
  }
}

async function runSteps(scene, steps, actors) {
  for (const step of steps) {
    // Bail if the scene was left mid-script (a battle transition stops it).
    // Not isActive(): a cutscene launched from create() runs while the
    // scene's status is still CREATING, which isActive() reports as false.
    const status = scene.sys.settings.status;
    if (status === Phaser.Scenes.SHUTDOWN || status === Phaser.Scenes.DESTROYED) return;
    if (step.say) {
      const [name, ...lines] = step.say;
      await say(scene, name, lines.flat());
    } else if (step.choice) {
      const { name, prompt, options } = step.choice;
      const idx = await choose(scene, name, prompt, options.map(o => o.label));
      if (options[idx]?.then) await runSteps(scene, options[idx].then, actors);
    } else if (step.if) {
      const branch = step.if(state) ? step.then : step.else;
      if (branch) await runSteps(scene, branch, actors);
    } else if (step.set) {
      setFlag(step.set, step.value ?? true);
    } else if (step.give) {
      const { item, n = 1 } = step.give;
      state.items[item] = (state.items[item] || 0) + n;
    } else if (step.money !== undefined) {
      state.money += step.money;
    } else if (step.heal) {
      state.party.forEach(m => { m.hp = m.maxHp; m.fainted = false; m.status = null; });
    } else if (step.walk) {
      await walkActor(scene, actors[step.walk.actor], step.walk.path);
    } else if (step.face) {
      actors[step.face.actor]?.ctrl.setDirection(step.face.dir);
    } else if (step.wait) {
      await delay(scene, step.wait);
    } else if (step.pan) {
      const cam = scene.cameras.main;
      const target = step.pan.toEdge && scene.panTarget ? scene.panTarget() : step.pan;
      cam.stopFollow();
      cam.pan(target.x, target.y, step.pan.ms ?? 600, 'Sine.easeInOut');
      await delay(scene, step.pan.ms ?? 600);
    } else if (step.flash) {
      scene.cameras.main.flash(step.flash, 255, 255, 255);
      await delay(scene, step.flash);
    } else if (step.shake) {
      scene.cameras.main.shake(step.shake, 0.01);
      await delay(scene, step.shake);
    } else if (step.call) {
      await step.call(scene, actors);
    } else if (step.battle) {
      const { trainerKey, returnTo } = step.battle;
      goToScene(scene, 'Battle', { kind: 'trainer', trainerKey, returnTo });
      return;
    }
  }
}

const DIRS = { U: [0, -1, 'up'], D: [0, 1, 'down'], L: [-1, 0, 'left'], R: [1, 0, 'right'] };

async function walkActor(scene, actor, path) {
  if (!actor) return;
  for (const ch of path.toUpperCase()) {
    const d = DIRS[ch];
    if (!d) continue;
    await actor.moveTile(d[0], d[1], d[2]);
  }
}

function delay(scene, ms) {
  return new Promise(res => scene.time.delayedCall(ms, res));
}
