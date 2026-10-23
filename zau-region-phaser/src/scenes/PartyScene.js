import Phaser from 'phaser';
import { state, activeMon, MAX_PARTY } from '../state.js';
import { currentMonDisplay, ivSummary } from '../mon.js';
import { saveGame } from '../save.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';
import { ITEMS } from '../data/items.js';
import { expAllActive } from '../expall.js';

// Same status colours the battle screen uses, so a condition reads the same
// everywhere.
const STATUS_BADGE = { burn: ['BRN', 0xe57373], poison: ['PSN', 0xba68c8], paralyze: ['PAR', 0xffca28], sleep: ['SLP', 0x90a4ae] };

// The game's own palette (title screen / modal chrome): deep navy panels, a
// periwinkle accent, a green for "on", gold for "this one".
const C = {
  card: 0x1b1f36, cardHover: 0x242a4a, cardFaint: 0x2a1a22,
  line: 0x3a3d5c, lineFaint: 0x6b3a44,
  accent: 0x8a8aff, accentFill: 0x2a3270,
  green: 0x3fa373, greenFill: 0x1f4a38,
  gold: 0xf2c14e,
  bar: 0x10121c, hpGood: 0x4cd07d, hpMid: 0xf2c14e, hpLow: 0xe5605a
};
const FONT = 'Nunito, sans-serif';
const CARD_X = 24, CARD_W = GAME_W - 48, CARD_H = 52, PITCH = 56, LIST_TOP = 76;
const ROWS_PER_PAGE = 6;
const FOOTER_Y = 430;

// Launched on top of whatever scene opened it (a map scene, or BattleScene
// during a switch/faint) — never pauses the caller, so closing is just
// this.scene.stop(). Ported from the DOM version's ui/party.js, extended
// with a Box tab (PC storage) for catches past the 6-mon party cap, and laid
// out as a proper party menu: one card per Pokémon with its icon, level,
// status, an HP bar and its ability / held item / IVs.
export default class PartyScene extends Phaser.Scene {
  constructor() {
    super('Party');
  }

  init(data) {
    this.switchMode = !!data?.switchMode;
    this.engine = data?.engine || null;
  }

  create() {
    this.tab = 'party';
    this.page = 0;
    this.render();
  }

  render() {
    this.children.removeAll(true);
    drawModalBackdrop(this, this.switchMode ? 'Choose your next Pokémon' : 'Your Party');
    addCloseButton(this, () => this.scene.stop());

    if (this.switchMode) {
      this.text(GAME_W / 2, 52, 'Tap a Pokémon to send it out.', { size: 11, color: '#8a8aa0' }).setOrigin(0.5);
    } else {
      this.drawTabs();
    }

    const list = this.tab === 'box' ? state.box : state.party;
    if (list.length === 0) {
      this.text(GAME_W / 2, GAME_H / 2, this.tab === 'box' ? 'Your Box is empty.' : "You don't have any Pokémon yet.", { size: 13, color: '#8a8aa0' }).setOrigin(0.5);
      return;
    }

    const start = this.page * ROWS_PER_PAGE;
    list.slice(start, start + ROWS_PER_PAGE).forEach((m, i) => this.drawCard(m, start + i, LIST_TOP + i * PITCH));

    if (list.length > ROWS_PER_PAGE) this.drawPager(list.length);
    else if (this.tab === 'party' && !this.switchMode && (state.items.expall || 0) > 0) this.drawExpAllSwitch();
  }

  // ---- small drawing helpers ----
  text(x, y, str, { size = 12, color = '#e8e8f0', bold = false } = {}) {
    return this.add.text(x, y, str, { fontFamily: FONT, fontSize: `${size}px`, color, fontStyle: bold ? 'bold' : 'normal' });
  }

  panel(x, y, w, h, fill, stroke, strokeW = 1, r = 7) {
    const g = this.add.graphics();
    g.fillStyle(fill, 1).fillRoundedRect(x, y, w, h, r);
    g.lineStyle(strokeW, stroke, 1).strokeRoundedRect(x, y, w, h, r);
    return g;
  }

  // A rounded button with a centred label; returns nothing, just wires onClick.
  button(cx, cy, w, h, label, { onClick, fill = C.card, stroke = C.line, color = '#e8e8f0' }) {
    this.panel(cx - w / 2, cy - h / 2, w, h, fill, stroke, 1, 5);
    this.text(cx, cy, label, { size: 10, color, bold: true }).setOrigin(0.5);
    this.add.rectangle(cx, cy, w, h, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  }

  drawTabs() {
    [['party', `Party  ${state.party.length}/${MAX_PARTY}`], ['box', `Box  ${state.box.length}`]].forEach(([key, label], i) => {
      const cx = GAME_W / 2 + (i === 0 ? -82 : 82);
      const on = this.tab === key;
      this.panel(cx - 74, 40, 148, 24, on ? C.accentFill : C.card, on ? C.accent : C.line, 1, 12);
      this.text(cx, 52, label, { size: 11, color: on ? '#ffffff' : '#8a8aa0', bold: true }).setOrigin(0.5);
      this.add.rectangle(cx, 52, 148, 24, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => { this.tab = key; this.page = 0; this.render(); });
    });
  }

  drawCard(m, idx, top) {
    const d = currentMonDisplay(m);
    const fainted = m.hp <= 0;
    const cy = top + CARD_H / 2;
    const inParty = this.tab === 'party';
    const isActive = inParty && idx === state.activeIdx;

    const stroke = fainted ? C.lineFaint : isActive ? C.gold : C.line;
    const card = this.panel(CARD_X, top, CARD_W, CARD_H, fainted ? C.cardFaint : C.card, stroke, isActive ? 2 : 1, 9);

    // icon in a dark round badge
    this.add.circle(CARD_X + 28, cy, 21, C.bar).setStrokeStyle(1, C.line);
    addMonIcon(this, CARD_X + 28, cy, d, 32);

    // name · Lv · status
    const nameTxt = this.text(82, top + 5, `${d.name}${isActive && !this.switchMode ? ' ★' : ''}`, { size: 13, color: fainted ? '#e57373' : (isActive ? '#ffe9a8' : '#ffffff'), bold: true });
    let x = nameTxt.x + nameTxt.width + 8;
    const lv = this.text(x, top + 7, `Lv.${m.level}`, { size: 11, color: '#a8a8c0' });
    x += lv.width + 8;
    const badge = fainted ? ['FAINTED', 0xe57373] : STATUS_BADGE[m.status];
    if (badge) {
      const w = badge[0].length * 6 + 10;
      this.panel(x, top + 6, w, 15, 0x10121c, badge[1], 1, 4);
      this.text(x + w / 2, top + 13.5, badge[0], { size: 9, color: `#${badge[1].toString(16).padStart(6, '0')}`, bold: true }).setOrigin(0.5);
    }

    // HP bar + numbers
    const barX = 82, barY = top + 26, barW = 128, barH = 8;
    this.panel(barX, barY, barW, barH, C.bar, C.line, 1, 4);
    const ratio = Phaser.Math.Clamp(m.hp / m.maxHp, 0, 1);
    if (ratio > 0) {
      const g = this.add.graphics();
      g.fillStyle(ratio > 0.5 ? C.hpGood : ratio > 0.2 ? C.hpMid : C.hpLow, 1).fillRoundedRect(barX + 1, barY + 1, Math.max(4, (barW - 2) * ratio), barH - 2, 3);
    }
    this.text(barX + barW + 8, barY - 3, `${m.hp}/${m.maxHp}`, { size: 11, color: '#c8c8d8' });

    // type · ability · item · IV
    const held = m.heldItem ? ` · ${ITEMS[m.heldItem].name}` : '';
    const iv = ivSummary(m);
    this.text(82, top + 37, `${d.type} · ${m.ability.name}${held} · IV ${iv.total}`, { size: 10, color: '#7a7a96' });

    // actions
    if (this.switchMode) {
      const clickable = !fainted && idx !== state.activeIdx;
      if (idx === state.activeIdx) this.text(CARD_X + CARD_W - 12, cy, 'In battle', { size: 10, color: '#8a8aa0' }).setOrigin(1, 0.5);
      if (clickable) {
        this.add.rectangle(GAME_W / 2, cy, CARD_W, CARD_H, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
          .on('pointerover', () => card.setAlpha(0.8)).on('pointerout', () => card.setAlpha(1))
          .on('pointerdown', () => this.switchToMon(idx));
      }
      return;
    }

    if (inParty) {
      if ((state.items.expall || 0) > 0) this.drawExpToggle(m, top + 14);
      if (state.party.length > 1) this.button(426, top + 14, 54, 20, 'Box', { onClick: () => this.depositToBox(idx) });
      if (m.heldItem) this.button(426, top + 38, 54, 20, 'Take', { onClick: () => this.takeItem(idx) });
    } else if (state.party.length < MAX_PARTY) {
      this.button(410, cy, 86, 24, 'Withdraw', { onClick: () => this.withdrawFromBox(idx), stroke: C.accent, fill: C.accentFill });
    }
  }

  // Per-Pokémon opt-out for Exp. All (dim while the master switch is off).
  drawExpToggle(m, cy) {
    const off = !!m.noExp, live = expAllActive();
    this.button(358, cy, 62, 20, off ? 'EXP ✗' : 'EXP ✓', {
      onClick: () => { m.noExp = !off; saveGame(); this.render(); },
      fill: !off && live ? C.greenFill : C.card,
      stroke: !off && live ? C.green : C.line,
      color: off ? '#e57373' : (live ? '#a8e6c4' : '#6a6a80')
    });
  }

  // Exp. All's master switch, centred under the list.
  drawExpAllSwitch() {
    const on = !!state.expAll?.on;
    this.panel(GAME_W / 2 - 160, FOOTER_Y - 14, 320, 28, on ? C.greenFill : C.card, on ? C.green : C.line, 1, 14);
    this.text(GAME_W / 2, FOOTER_Y, `📘  Exp. All  ${on ? 'ON — the team shares XP' : 'OFF — only the fighter earns XP'}`, { size: 11, color: on ? '#a8e6c4' : '#8a8aa0', bold: true }).setOrigin(0.5);
    this.add.rectangle(GAME_W / 2, FOOTER_Y, 320, 28, 0xffffff, 0.001).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { state.expAll.on = !on; saveGame(); this.render(); });
  }

  takeItem(idx) {
    const mon = state.party[idx];
    state.items[mon.heldItem] = (state.items[mon.heldItem] || 0) + 1;
    mon.heldItem = null;
    saveGame();
    this.render();
  }

  drawPager(total) {
    const maxPage = Math.ceil(total / ROWS_PER_PAGE) - 1;
    if (this.page > 0) this.button(GAME_W / 2 - 80, FOOTER_Y, 64, 22, '‹ Prev', { onClick: () => { this.page--; this.render(); }, stroke: C.accent });
    this.text(GAME_W / 2, FOOTER_Y, `Page ${this.page + 1} / ${maxPage + 1}`, { size: 11, color: '#8a8aa0' }).setOrigin(0.5);
    if (this.page < maxPage) this.button(GAME_W / 2 + 80, FOOTER_Y, 64, 22, 'Next ›', { onClick: () => { this.page++; this.render(); }, stroke: C.accent });
  }

  // Party always keeps at least one member — matches the real games'
  // PC rule that you can never empty your active team entirely.
  depositToBox(idx) {
    const [mon] = state.party.splice(idx, 1);
    state.box.push(mon);
    if (state.activeIdx >= state.party.length) state.activeIdx = state.party.length - 1;
    saveGame();
    this.render();
  }

  withdrawFromBox(idx) {
    const [mon] = state.box.splice(idx, 1);
    state.party.push(mon);
    saveGame();
    this.render();
  }

  switchToMon(idx) {
    state.activeIdx = idx;
    this.scene.stop();
    if (this.engine) {
      this.engine.render(`Go, ${currentMonDisplay(activeMon()).name}!`);
      // switching mid-battle (not from a faint) costs the turn
      const e = this.engine.currentEnemy();
      if (e && e.hp > 0 && activeMon().hp > 0) {
        setTimeout(() => this.engine.enemyTurnOnly(), 700);
      }
    }
  }
}
