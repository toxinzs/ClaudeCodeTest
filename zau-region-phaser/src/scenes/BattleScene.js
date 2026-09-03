import Phaser from 'phaser';
import { BattleEngine } from '../battleEngine.js';
import { loadMonSprite } from '../spriteLoader.js';
import { GAME_W, GAME_H } from '../config.js';

const HP_BAR_W = 180;

// A "how do I show this mon" visual: sprite image (loaded at runtime from
// the PokeAPI artwork URL) with an emoji-text fallback, a name/level label,
// and an HP bar — the Phaser-side counterpart of the DOM version's
// mon-card + monSpriteHtml markup.
class MonCard {
  constructor(scene, x, y, spriteY) {
    this.scene = scene;
    this.nameText = scene.add.text(x, y, '', { fontFamily: 'sans-serif', fontSize: '15px', color: '#e8e8f0' });
    this.hpBg = scene.add.rectangle(x, y + 22, HP_BAR_W, 10, 0x222430).setOrigin(0, 0.5);
    this.hpFill = scene.add.rectangle(x, y + 22, HP_BAR_W, 10, 0x4caf50).setOrigin(0, 0.5);
    this.emojiText = scene.add.text(x + HP_BAR_W / 2, spriteY, '❓', { fontSize: '64px' }).setOrigin(0.5);
    this.spriteImg = scene.add.image(x + HP_BAR_W / 2, spriteY, '__DEFAULT').setOrigin(0.5).setVisible(false);
    this.spriteImg.setDisplaySize(96, 96);
  }

  update(mon) {
    this.nameText.setText(`${mon.name}  Lv.${mon.level}`);
    const pct = Math.max(0, Math.min(1, mon.hp / mon.maxHp));
    this.hpFill.width = HP_BAR_W * pct;
    this.hpFill.fillColor = pct <= 0.2 ? 0xe53935 : pct <= 0.5 ? 0xffb300 : 0x4caf50;

    this.emojiText.setText(mon.emoji).setVisible(true);
    loadMonSprite(this.scene, mon.sprite, (key) => {
      if (key) {
        this.spriteImg.setTexture(key).setVisible(true);
        this.emojiText.setVisible(false);
      } else {
        this.spriteImg.setVisible(false);
        this.emojiText.setVisible(true);
      }
    });
  }
}

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  init(data) {
    this.battleKind = data.kind;        // 'wild' | trainer ctx string
    this.zoneKey = data.zoneKey;
    this.returnTo = data.returnTo || 'Home';
  }

  create() {
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x10121c);

    this.enemyCard = new MonCard(this, GAME_W - HP_BAR_W - 24, 24, 110);
    this.playerCard = new MonCard(this, 24, GAME_H - 150, GAME_H - 210);

    this.logText = this.add.text(GAME_W / 2, GAME_H - 150, 'What will you do?', {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 40 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.moveButtons = [0, 1, 2, 3].map(i => this.makeButton(
      24 + (i % 2) * 216, GAME_H - 108 + Math.floor(i / 2) * 48, 208, 40, '', () => this.engine.playerUseMove(i)
    ));

    this.runBtn = this.makeButton(GAME_W - 190, GAME_H - 30, 80, 26, 'Run', () => this.engine.tryFlee());
    this.catchBtn = this.makeButton(GAME_W - 100, GAME_H - 30, 80, 26, 'Catch', () => this.engine.throwPokeBall('pokeball'));

    this.engine = new BattleEngine();
    this.engine.on('render', (payload) => this.onRender(payload));
    this.engine.on('end', (payload) => this.onEnd(payload));

    const started = this.battleKind === 'wild'
      ? this.engine.startWildEncounter(this.zoneKey)
      : this.engine.startTrainerBattle(this.battleKind);

    if (!started) {
      // No healthy party member — mirrors the DOM version's fainted-party
      // guard. Bounce straight back rather than showing an empty battle UI.
      this.scene.start(this.returnTo);
    }
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.rectangle(x, y, w, h, 0x232640).setOrigin(0, 0.5).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    const text = this.add.text(x + w / 2, y, label, { fontFamily: 'sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    bg.on('pointerdown', onClick);
    return { bg, text };
  }

  onRender(payload) {
    this.playerCard.update(payload.player);
    this.enemyCard.update(payload.enemy);
    if (payload.log) this.logText.setText(payload.log);

    payload.player.moves.forEach((m, i) => {
      this.moveButtons[i].text.setText(m ? `${m.name} (${m.type})` : '');
      this.moveButtons[i].bg.setVisible(!!m);
      this.moveButtons[i].text.setVisible(!!m);
    });
    for (let i = payload.player.moves.length; i < 4; i++) {
      this.moveButtons[i].bg.setVisible(false);
      this.moveButtons[i].text.setVisible(false);
    }

    this.runBtn.bg.setVisible(payload.isWild);
    this.runBtn.text.setVisible(payload.isWild);
    this.catchBtn.bg.setVisible(payload.isWild);
    this.catchBtn.text.setVisible(payload.isWild);
  }

  onEnd(payload) {
    this.logText.setText(payload.msg || '');
    this.moveButtons.forEach(b => { b.bg.disableInteractive(); });
    this.runBtn.bg.disableInteractive();
    this.catchBtn.bg.disableInteractive();
    this.time.delayedCall(1200, () => this.scene.start(this.returnTo));
  }
}
