import Phaser from 'phaser';
import { BattleEngine } from '../battleEngine.js';
import { loadMonSprite } from '../spriteLoader.js';
import { GAME_W } from '../config.js';
import { addActionBar } from '../uiHelpers.js';
import { goToScene, fadeIn } from '../transitions.js';
import { showBanner } from '../banner.js';
import { typeColor } from '../data/typeColors.js';

const HP_BAR_W = 180;
const STATUS_BADGE = { burn: ['BRN', '#e57373'], poison: ['PSN', '#ba68c8'], paralyze: ['PAR', '#ffca28'], sleep: ['SLP', '#90a4ae'] };

// A "how do I show this mon" visual: sprite image (loaded at runtime from
// the PokeAPI artwork URL) with an emoji-text fallback, a name/level label,
// and an HP bar — the Phaser-side counterpart of the DOM version's
// mon-card + monSpriteHtml markup.
class MonCard {
  constructor(scene, x, y, spriteY) {
    this.scene = scene;
    this.nameText = scene.add.text(x, y, '', { fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#e8e8f0' });
    this.abilityText = scene.add.text(x, y + 30, '', { fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#6a6a80' });
    this.statusText = scene.add.text(x + HP_BAR_W, y, '', { fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontStyle: 'bold' }).setOrigin(1, 0);
    this.hpBg = scene.add.rectangle(x, y + 22, HP_BAR_W, 10, 0x222430).setOrigin(0, 0.5);
    this.hpFill = scene.add.rectangle(x, y + 22, HP_BAR_W, 10, 0x4caf50).setOrigin(0, 0.5);
    // The sprite lives in a container so lunges, hit-flashes, faints and
    // the Mega pulse can tween one thing.
    this.baseX = x + HP_BAR_W / 2; this.baseY = spriteY;
    this.holder = scene.add.container(this.baseX, this.baseY);
    this.emojiText = scene.add.text(0, 0, '❓', { fontSize: '64px' }).setOrigin(0.5);
    this.spriteImg = scene.add.image(0, 0, '__DEFAULT').setOrigin(0.5).setVisible(false);
    this.spriteImg.setDisplaySize(96, 96);
    this.holder.add([this.emojiText, this.spriteImg]);
    this.lastName = null;
  }

  resetHolder() {
    this.scene.tweens.killTweensOf(this.holder);
    this.holder.setPosition(this.baseX, this.baseY).setAlpha(1).setScale(1);
  }

  update(mon) {
    const label = `${mon.name}  Lv.${mon.level}`;
    if (label !== this.lastName) { this.lastName = label; this.resetHolder(); }
    this.nameText.setText(label);
    this.abilityText.setText(mon.ability || '');
    const badge = STATUS_BADGE[mon.status];
    if (badge) { this.statusText.setText(badge[0]).setColor(badge[1]); } else { this.statusText.setText(''); }
    const pct = Math.max(0, Math.min(1, mon.hp / mon.maxHp));
    // HP drains instead of snapping.
    this.scene.tweens.killTweensOf(this.hpFill);
    this.scene.tweens.add({ targets: this.hpFill, width: HP_BAR_W * pct, duration: 420, ease: 'Sine.easeOut' });
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
    this.trainerKey = data.trainerKey;  // for kind 'trainer' (data/trainers.js)
    this.returnTo = data.returnTo || 'Home';
  }

  create() {
    fadeIn(this);
    this.add.rectangle(GAME_W / 2, 230, GAME_W, 460, 0x10121c);

    this.enemyCard = new MonCard(this, GAME_W - HP_BAR_W - 24, 24, 110);
    this.playerCard = new MonCard(this, 24, 258, 196);

    this.logText = this.add.text(GAME_W / 2, 296, 'What will you do?', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#c8c8d8',
      wordWrap: { width: GAME_W - 40 }, align: 'center'
    }).setOrigin(0.5, 0);

    this.moveButtons = [0, 1, 2, 3].map(i => this.makeButton(
      24 + (i % 2) * 216, 336 + Math.floor(i / 2) * 44, 208, 36, '', () => this.engine.playerUseMove(i)
    ));

    // Switch/Bag/Flee are always visible — matches the DOM version, where
    // tryFlee() itself refuses on a trainer battle rather than the button
    // being hidden. Catching is now a Bag→ball-item flow, not a shortcut
    // button, same as the DOM version.
    // Mega only lights up when the engine says it's legal (Key Stone +
    // matching held Mega Stone + not yet used this battle) — see onRender.
    const [megaBar, switchBar, bagBar, fleeBar] = addActionBar(this, [
      { label: 'Mega', onClick: () => this.engine.megaEvolve() },
      { label: 'Switch', onClick: () => this.openParty() },
      { label: 'Bag', onClick: () => this.openBag() },
      { label: 'Flee', onClick: () => this.engine.tryFlee() }
    ], 428);
    this.megaButton = megaBar;
    this.actionButtons = [megaBar, switchBar, bagBar, fleeBar];

    this.engine = new BattleEngine();
    this.engine.on('render', (payload) => this.onRender(payload));
    this.engine.on('anim', (evt) => this.onAnim(evt));
    this.flashRect = this.add.rectangle(GAME_W / 2, 230, GAME_W, 460, 0xffffff, 1).setAlpha(0).setDepth(100);
    this.engine.on('end', (payload) => this.onEnd(payload));
    this.engine.on('moveLearnPrompt', (payload) => {
      this.scene.launch('MoveLearn', { ...payload, engine: this.engine });
    });

    const started = this.battleKind === 'wild'
      ? this.engine.startWildEncounter(this.zoneKey)
      : this.engine.startTrainerBattle(this.battleKind, this.trainerKey);

    if (!started) {
      // No healthy party member — mirrors the DOM version's fainted-party
      // guard. Bounce straight back rather than showing an empty battle UI.
      goToScene(this, this.returnTo, { toastMsg: 'Your Pokémon need to recover before you can battle again!' });
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
    const text = this.add.text(x + w / 2, y, label, { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0' }).setOrigin(0.5);
    bg.on('pointerdown', onClick);
    return { bg, text };
  }

  onRender(payload) {
    this.playerCard.update(payload.player);
    this.enemyCard.update(payload.enemy);
    if (payload.log) this.logText.setText(payload.log);

    const canMega = !!payload.canMega;
    this.megaButton.bg.setAlpha(canMega ? 1 : 0.35);
    this.megaButton.label.setAlpha(canMega ? 1 : 0.35);
    if (canMega) this.megaButton.bg.setInteractive({ useHandCursor: true }); else this.megaButton.bg.disableInteractive();

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

  // ---- presentation: every engine 'anim' event becomes motion ----
  onAnim(evt) {
    if (evt.type !== 'evolve') (window.__zauAnims ??= []).push(evt.type); // the Evolve scene logs itself
    const card = (side) => side === 'player' ? this.playerCard : this.enemyCard;
    if (evt.type === 'intro') {
      const h = this.enemyCard.holder;
      h.x = this.enemyCard.baseX + 220;
      this.tweens.add({ targets: h, x: this.enemyCard.baseX, duration: 420, ease: 'Cubic.easeOut' });
      showBanner(this, evt.wild ? `A wild ${evt.name} appeared!` : `${evt.name} wants to battle!`, { y: 230, hold: 900 });
    } else if (evt.type === 'hit') {
      const a = card(evt.attacker).holder, d = card(evt.defender).holder;
      const dir = evt.attacker === 'player' ? 1 : -1;
      this.tweens.add({ targets: a, x: a.x + 26 * dir, y: a.y - 18 * dir, duration: 110, yoyo: true, ease: 'Quad.easeOut' });
      this.time.delayedCall(110, () => {
        this.tweens.add({ targets: d, alpha: 0.15, duration: 55, yoyo: true, repeat: 2 });
        this.tweens.add({ targets: d, x: d.x + 7, duration: 40, yoyo: true, repeat: 3 });
        if (evt.effectiveness >= 2) this.cameras.main.shake(160, 0.006);
      });
      // Move-effect layer: a type-coloured burst on the defender.
      this.time.delayedCall(100, () => {
        const c = this.add.circle(d.x, d.y, 12, typeColor(evt.moveType), 0.85).setDepth(60);
        this.tweens.add({ targets: c, radius: 64, alpha: 0, duration: 380, ease: 'Quad.easeOut', onUpdate: () => c.setRadius(c.radius), onComplete: () => c.destroy() });
        (window.__zauAnims ??= []).push(`fx:${evt.moveType}`);
      });
    } else if (evt.type === 'evolve') {
      this.scene.launch('Evolve', { from: evt.from, to: evt.to });
    } else if (evt.type === 'faint') {
      const h = card(evt.side).holder;
      this.tweens.add({ targets: h, y: h.y + 44, alpha: 0, duration: 420, ease: 'Quad.easeIn' });
    } else if (evt.type === 'mega') {
      const h = this.playerCard.holder;
      this.tweens.add({ targets: this.flashRect, alpha: 0.95, duration: 220, yoyo: true, hold: 180 });
      this.tweens.add({ targets: h, scaleX: 1.35, scaleY: 1.35, duration: 260, yoyo: true, ease: 'Back.easeOut' });
      this.cameras.main.shake(300, 0.005);
      showBanner(this, 'MEGA EVOLUTION', { y: 230, hold: 900, color: '#e8d27a', accent: 0x8a6a1a, size: 18 });
    } else if (evt.type === 'ball') {
      const from = this.playerCard.holder, to = this.enemyCard.holder;
      this.ball = this.add.text(from.x, from.y, '🔴', { fontSize: '26px' }).setOrigin(0.5).setDepth(50);
      this.tweens.add({ targets: this.ball, x: to.x, duration: 480, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: this.ball, y: to.y - 90, duration: 240, ease: 'Quad.easeOut', yoyo: true, onComplete: () => {
        this.tweens.add({ targets: to, scaleX: 0, scaleY: 0, duration: 160 });
        this.tweens.add({ targets: this.ball, angle: -22, duration: 200, yoyo: true, repeat: 5, ease: 'Sine.easeInOut', delay: 200 });
      } });
    } else if (evt.type === 'catch') {
      const to = this.enemyCard.holder;
      if (this.ball) { this.tweens.killTweensOf(this.ball); this.ball.setAngle(0); }
      if (evt.caught) {
        const s = this.add.text(to.x, to.y - 40, '✨', { fontSize: '28px' }).setOrigin(0.5).setDepth(51);
        this.tweens.add({ targets: s, y: s.y - 30, alpha: 0, duration: 900, onComplete: () => s.destroy() });
      } else {
        if (this.ball) { this.ball.destroy(); this.ball = null; }
        this.tweens.add({ targets: to, scaleX: 1, scaleY: 1, duration: 220, ease: 'Back.easeOut' });
      }
    }
  }

  onEnd(payload) {
    (window.__zauAnims ??= []).push(`end:${payload.outcome}:${payload.ctx}`);
    this.logText.setText(payload.msg || '');
    this.moveButtons.forEach(b => { b.bg.disableInteractive(); });
    this.actionButtons.forEach(b => { b.bg.disableInteractive(); });
    let wait = 1200;
    if (payload.ctx === 'league' && payload.outcome === 'win') {
      showBanner(this, `🏅 ${payload.leaderName || 'Gym'} Badge earned!`, { y: 230, hold: 1400, color: '#e8d27a', accent: 0x8a6a1a });
      wait = 2200;
    }
    this.time.delayedCall(wait, () => goToScene(this, this.returnTo, { toastMsg: payload.msg }));
  }
}
