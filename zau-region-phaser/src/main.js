import Phaser from 'phaser';
import { loadGame } from './save.js';
import { installTestBridge } from './testBridge.js';
import HomeScene from './scenes/HomeScene.js';

loadGame();

const TILE = 52;
const HOME_W = 5, HOME_H = 5;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#0a0e1a',
  scale: {
    mode: Phaser.Scale.NONE,
    width: HOME_W * TILE,
    height: HOME_H * TILE + 40
  },
  scene: [HomeScene]
});

installTestBridge(game);
