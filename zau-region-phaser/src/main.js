import Phaser from 'phaser';
import { installTestBridge } from './testBridge.js';
import { GAME_W, GAME_H } from './config.js';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import CutsceneScene from './scenes/CutsceneScene.js';
import CharCreateScene from './scenes/CharCreateScene.js';
import HomeScene from './scenes/HomeScene.js';
import TownScene from './scenes/TownScene.js';
import LabScene from './scenes/LabScene.js';
import TrailScene from './scenes/TrailScene.js';
import LeagueScene from './scenes/LeagueScene.js';
import BattleScene from './scenes/BattleScene.js';
import PartyScene from './scenes/PartyScene.js';
import BagScene from './scenes/BagScene.js';
import MartScene from './scenes/MartScene.js';
import DexScene from './scenes/DexScene.js';
import CenterScene from './scenes/CenterScene.js';
import MoveLearnScene from './scenes/MoveLearnScene.js';

// loadGame() is NOT called here — Continue vs. a fresh game are genuinely
// different starting points (matches the DOM version, where a save
// existing doesn't auto-resume until the player picks Continue on the
// title screen). TitleScene calls it when Continue is actually chosen.

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#0a0e1a',
  scale: {
    mode: Phaser.Scale.NONE,
    width: GAME_W,
    height: GAME_H
  },
  dom: {
    createContainer: true
  },
  scene: [
    BootScene, TitleScene, CutsceneScene, CharCreateScene,
    HomeScene, TownScene, LabScene, TrailScene, LeagueScene, BattleScene,
    PartyScene, BagScene, MartScene, DexScene, CenterScene, MoveLearnScene
  ]
});

installTestBridge(game);
