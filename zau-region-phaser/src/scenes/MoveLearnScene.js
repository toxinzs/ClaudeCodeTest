import Phaser from 'phaser';
import { GAME_W } from '../config.js';
import { drawModalBackdrop } from '../uiHelpers.js';

// Ported from the DOM version's battle.js queueMoveLearnPrompt/
// confirmForgetMove/skipMoveLearn — a level-up learned a new move but the
// mon already knows 4, so the player picks one to forget (or skips).
// Launched on top of BattleScene without pausing it, same as the other
// overlays — matches the DOM version's own quirk where the "next enemy or
// win" timer set by handleEnemyFainted keeps running underneath while this
// prompt is up.
export default class MoveLearnScene extends Phaser.Scene {
  constructor() {
    super('MoveLearn');
  }

  init(data) {
    this.mon = data.mon;
    this.newMove = data.newMove;
    this.engine = data.engine;
  }

  create() {
    drawModalBackdrop(this, `${this.mon.nickname} wants to learn ${this.newMove.name}!`);
    this.add.text(GAME_W / 2, 46, 'But it already knows 4 moves. Forget one to make room, or skip.', {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0', wordWrap: { width: GAME_W - 60 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.mon.moves.forEach((m, i) => {
      const y = 90 + i * 36;
      const bg = this.add.rectangle(GAME_W / 2, y, GAME_W - 48, 30, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(GAME_W / 2, y, `${m.name} (${m.type})`, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
      bg.on('pointerdown', () => this.confirmForget(i));
    });

    const skipY = 90 + this.mon.moves.length * 36 + 12;
    const skipBg = this.add.rectangle(GAME_W / 2, skipY, GAME_W - 48, 30, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    this.add.text(GAME_W / 2, skipY, `Don't learn ${this.newMove.name}`, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    skipBg.on('pointerdown', () => this.finish());
  }

  confirmForget(idx) {
    this.mon.moves[idx] = { ...this.newMove };
    this.finish();
  }

  finish() {
    this.scene.stop();
    if (this.engine) this.engine.render();
  }
}
