import Phaser from 'phaser';
import { BattleEngine } from '../battleEngine.js';
import { loadMonSprite } from '../spriteLoader.js';
import { GAME_W } from '../config.js';
import { addActionBar } from '../uiHelpers.js';

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
    this.add.rectangle(GAME_W / 2, 230, GAME_W, 460, 0x10121c);

    this.enemyCard = new MonCard(this, GAME_W - HP_BAR_W - 24, 24, 110);
    this.playerCard = new MonCard(this, 24, 258, 196);

    this.logText = this.add.text(GAME_W / 2, 296, 'What will you do?', {
      fontFamily: 'sans-serif', fontSize: '13px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 40 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.moveButtons = [0, 1, 2, 3].map(i => this.makeButton(
      24 + (i % 2) * 216, 336 + Math.floor(i / 2) * 44, 208, 36, '', () => this.engine.playerUseMove(i)
    ));

    // Switch/Bag/Flee are always visible — matches the DOM version, where
    // tryFlee() itself refuses on a trainer battle rather than the button
    // being hidden. Catching is now a Bag→ball-item flow, not a shortcut
    // button, same as the DOM version.
    const [switchBar, bagBar, fleeBar] = addActionBar(this, [
      { label: 'Switch', onClick: () => this.openParty() },
      { label: 'Bag', onClick: () => this.openBag() },
      { label: 'Flee', onClick: () => this.engine.tryFlee() }
    ], 428);
    this.actionButtons = [switchBar, bagBar, fleeBar];

    this.engine = new BattleEngine();
    this.engine.on('render', (payload) => this.onRender(payload));
    this.engine.on('end', (payload) => this.onEnd(payload));
    this.engine.on('moveLearnPrompt', (payload) => {
      this.scene.launch('MoveLearn', { ...payload, engine: this.engine });
    });

    const started = this.battleKind === 'wild'
      ? this.engine.startWildEncounter(this.zoneKey)
      : this.engine.startTrainerBattle(this.battleKind);

    if (!started) {
      // No healthy party member — mirrors the DOM version's fainted-party
      // guard. Bounce straight back rather than showing an empty battle UI.
      this.scene.start(this.returnTo, { toastMsg: 'Your Pokémon need to recover before you can battle again!' });
    }
  }

  openParty() {
    this.scene.launch('Party', { switchMode: true, engine: this.engine });
  }

  openBag() {
    this.scene.launch('Bag', { engine: this.engine });
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
  }

  onEnd(payload) {
    this.logText.setText(payload.msg || '');
    this.moveButtons.forEach(b => { b.bg.disableInteractive(); });
    this.actionButtons.forEach(b => { b.bg.disableInteractive(); });
    this.time.delayedCall(1200, () => this.scene.start(this.returnTo, { toastMsg: payload.msg }));
  }
}
