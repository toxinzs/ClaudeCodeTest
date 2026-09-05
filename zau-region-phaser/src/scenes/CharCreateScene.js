import Phaser from 'phaser';
import { state } from '../state.js';
import { AVATAR_OPTIONS } from '../data/maps.js';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';

const COLS = 4;
const CELL = 80;

// Ported from the DOM version's ui/charCreate.js. The name field is a real
// DOM <input> overlaid on the canvas (Phaser's DOM Element game object) —
// canvas text can't be typed into directly.
export default class CharCreateScene extends Phaser.Scene {
  constructor() {
    super('CharCreate');
  }

  create() {
    fadeIn(this);
    this.selectedAvatar = AVATAR_OPTIONS[0];
    this.avatarBoxes = [];

    this.add.text(GAME_W / 2, 20, 'Choose Your Look', { fontFamily: 'sans-serif', fontSize: '16px', color: '#e8e8f0' }).setOrigin(0.5, 0);

    const offsetX = (GAME_W - COLS * CELL) / 2;
    const offsetY = 50;
    AVATAR_OPTIONS.forEach((a, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      const x = offsetX + col * CELL + CELL / 2;
      const y = offsetY + row * CELL + CELL / 2;
      const box = this.add.rectangle(x, y, CELL - 8, CELL - 8, 0x232640).setStrokeStyle(2, 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(x, y, a, { fontSize: '36px' }).setOrigin(0.5);
      box.on('pointerdown', () => this.pickAvatar(i, a));
      this.avatarBoxes.push(box);
    });
    this.pickAvatar(0, AVATAR_OPTIONS[0]);

    this.add.text(GAME_W / 2, offsetY + 3 * CELL + 20, 'Trainer Name', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);

    this.nameInput = this.add.dom(GAME_W / 2, offsetY + 3 * CELL + 46, 'input',
      'width: 220px; height: 30px; font-size: 15px; text-align: center; border-radius: 6px; border: 1px solid #3a3d5c; background: #12141f; color: #e8e8f0;'
    );
    this.nameInput.node.setAttribute('maxlength', '14');
    this.nameInput.node.setAttribute('placeholder', 'Enter your name');

    this.errorText = this.add.text(GAME_W / 2, offsetY + 3 * CELL + 86, '', {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#e57373'
    }).setOrigin(0.5, 0);

    const confirmY = offsetY + 3 * CELL + 120;
    const confirmBg = this.add.rectangle(GAME_W / 2, confirmY, 220, 38, 0x2d6a4f).setStrokeStyle(1, 0x3fa373).setInteractive({ useHandCursor: true });
    this.add.text(GAME_W / 2, confirmY, 'Confirm', { fontFamily: 'sans-serif', fontSize: '14px', color: '#e8e8f0' }).setOrigin(0.5);
    confirmBg.on('pointerdown', () => this.confirm());
  }

  pickAvatar(idx, a) {
    this.selectedAvatar = a;
    this.avatarBoxes.forEach((box, i) => box.setStrokeStyle(2, i === idx ? 0x8a8aff : 0x3a3d5c));
  }

  confirm() {
    const name = this.nameInput.node.value.trim();
    if (!name) {
      this.errorText.setText('Enter a trainer name first.');
      return;
    }
    state.player.name = name;
    state.player.avatar = this.selectedAvatar;
    goToScene(this, 'Home');
  }
}
