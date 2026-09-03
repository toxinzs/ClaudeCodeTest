import Phaser from 'phaser';
import { loadGame } from './save.js';
import { installTestBridge } from './testBridge.js';
import { GAME_W, GAME_H } from './config.js';
import BootScene from './scenes/BootScene.js';
import HomeScene from './scenes/HomeScene.js';
import TownScene from './scenes/TownScene.js';
import LabScene from './scenes/LabScene.js';
import TrailScene from './scenes/TrailScene.js';
import LeagueScene from './scenes/LeagueScene.js';
import BattleScene from './scenes/BattleScene.js';

loadGame();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#0a0e1a',
  scale: {
    mode: Phaser.Scale.NONE,
    width: GAME_W,
    height: GAME_H
  },
  scene: [BootScene, HomeScene, TownScene, LabScene, TrailScene, LeagueScene, BattleScene]
});

installTestBridge(game);
