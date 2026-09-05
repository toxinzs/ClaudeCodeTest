import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { makeStarterMon } from '../mon.js';
import { STARTER_CHAINS } from '../data/pokemon.js';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';

const STARTER_KEYS = ['sprigatito', 'fuecoco', 'quaxly'];

// Not a walkable grid — same as the DOM version's Lab screen, a static
// interior with a dialogue line and either the starter picker or a
// leave-to-town prompt, depending on whether the player has a starter yet.
export default class LabScene extends Phaser.Scene {
  constructor() {
    super('Lab');
  }

  create() {
    fadeIn(this);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x12192e);
    this.add.text(GAME_W / 2, 24, "Professor Mabosso's Lab", {
      fontFamily: 'sans-serif', fontSize: '16px', color: '#e8e8f0'
    }).setOrigin(0.5);

    const hasStarter = state.party.length > 0;
    const name = state.player.name || 'Trainer';
    const dialogue = hasStarter
      ? `Good to see you again, ${name}. Your team's looking solid — the Wild Zone trail is open whenever you're ready.`
      : `Ah, ${name}! Right on time. Every trainer heading into the Wild Zone needs a partner first. Take a look — which one calls out to you?`;
    this.add.text(GAME_W / 2, 60, dialogue, {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 60 }, align: 'center'
    }).setOrigin(0.5, 0);

    if (hasStarter) {
      this.makeButton(GAME_W / 2, GAME_H - 40, 220, 40, 'Head back to town', () => goToScene(this, 'Town'));
    } else {
      STARTER_KEYS.forEach((key, i) => {
        const chain = STARTER_CHAINS[key];
        const x = GAME_W / 2 + (i - 1) * 140;
        const y = GAME_H / 2 + 40;
        const box = this.add.rectangle(x, y, 120, 120, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
        this.add.text(x, y - 20, chain.stages[0].emoji, { fontSize: '44px' }).setOrigin(0.5);
        this.add.text(x, y + 38, chain.stages[0].name, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
        box.on('pointerdown', () => this.chooseStarter(key));
      });
    }
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.rectangle(x, y, w, h, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    bg.on('pointerdown', onClick);
  }

  chooseStarter(key) {
    const mon = makeStarterMon(key);
    state.party.push(mon);
    state.activeIdx = 0;
    state.starterKey = key;
    saveGame();
    this.scene.restart();
  }
}
