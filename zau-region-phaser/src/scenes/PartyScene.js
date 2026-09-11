import Phaser from 'phaser';
import { state, activeMon, MAX_PARTY } from '../state.js';
import { currentMonDisplay } from '../mon.js';
import { saveGame } from '../save.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';

const STATUS_LABEL = { burn: 'BRN', poison: 'PSN', paralyze: 'PAR', sleep: 'SLP' };
const ROWS_PER_PAGE = 6;
const ROW_H = 40;
const LIST_TOP = 56;

// Launched on top of whatever scene opened it (a map scene, or BattleScene
// during a switch/faint) — never pauses the caller, so closing is just
// this.scene.stop(). Ported from the DOM version's ui/party.js, extended
// with a Box tab (PC storage) for catches past the 6-mon party cap.
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
    const title = this.switchMode ? 'Choose your next Pokémon' : 'Your Party';
    drawModalBackdrop(this, title);
    addCloseButton(this, () => this.scene.stop());

    if (!this.switchMode) this.drawTabs();

    const list = this.tab === 'box' ? state.box : state.party;
    if (list.length === 0) {
      this.add.text(GAME_W / 2, GAME_H / 2, this.tab === 'box' ? 'Your Box is empty.' : "You don't have any Pokémon yet.", {
        fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0'
      }).setOrigin(0.5);
      return;
    }

    const start = this.page * ROWS_PER_PAGE;
    const pageItems = list.slice(start, start + ROWS_PER_PAGE);
    pageItems.forEach((m, i) => {
      const idx = start + i;
      const y = LIST_TOP + i * ROW_H;
      this.drawRow(m, idx, y);
    });

    if (list.length > ROWS_PER_PAGE) this.drawPager(list.length);
  }

  drawTabs() {
    const tabs = [['party', `Party (${state.party.length}/${MAX_PARTY})`], ['box', `Box (${state.box.length})`]];
    tabs.forEach(([key, label], i) => {
      const x = GAME_W / 2 + (i === 0 ? -90 : 90);
      const bg = this.add.rectangle(x, 40, 160, 22, 0x232640).setStrokeStyle(1, this.tab === key ? 0x8a8aff : 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.add.text(x, 40, label, { fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0' }).setOrigin(0.5);
      bg.on('pointerdown', () => { this.tab = key; this.page = 0; this.render(); });
    });
  }

  drawRow(m, idx, y) {
    const d = currentMonDisplay(m);
    const isFainted = m.hp <= 0;
    const isActive = this.tab === 'party' && idx === state.activeIdx && !this.switchMode;
    const statusTag = STATUS_LABEL[m.status] ? ` [${STATUS_LABEL[m.status]}]` : '';

    addMonIcon(this, 36, y, d, 24);
    const label = `${d.name}${isFainted ? ' (Fainted)' : ''}${statusTag}${isActive ? ' ★' : ''}`;
    this.add.text(64, y - 10, label, { fontFamily: 'sans-serif', fontSize: '13px', color: isFainted ? '#e57373' : '#e8e8f0' });
    this.add.text(64, y + 7, `Lv.${m.level} · ${d.type} · ${m.hp}/${m.maxHp} HP`, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' });

    if (this.switchMode) {
      const clickable = !isFainted && idx !== state.activeIdx;
      if (clickable) {
        this.add.rectangle(GAME_W / 2, y, GAME_W - 48, 34, 0xffffff, 0.001)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.switchToMon(idx));
      }
      return;
    }

    if (this.tab === 'party' && state.party.length > 1) {
      this.drawRowButton(y, 'Box', () => this.depositToBox(idx));
    } else if (this.tab === 'box' && state.party.length < MAX_PARTY) {
      this.drawRowButton(y, 'Withdraw', () => this.withdrawFromBox(idx));
    }
  }

  drawRowButton(y, label, onClick) {
    const bw = 64, bh = 24;
    const bx = GAME_W - 24 - bw / 2 - 12;
    const bg = this.add.rectangle(bx, y, bw, bh, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    this.add.text(bx, y, label, { fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0' }).setOrigin(0.5);
    bg.on('pointerdown', onClick);
  }

  drawPager(total) {
    const maxPage = Math.ceil(total / ROWS_PER_PAGE) - 1;
    const y = GAME_H - 40;
    if (this.page > 0) {
      const prev = this.add.text(GAME_W / 2 - 60, y, '< Prev', { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      prev.on('pointerdown', () => { this.page--; this.render(); });
    }
    this.add.text(GAME_W / 2, y, `Page ${this.page + 1}/${maxPage + 1}`, { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(0.5);
    if (this.page < maxPage) {
      const next = this.add.text(GAME_W / 2 + 60, y, 'Next >', { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      next.on('pointerdown', () => { this.page++; this.render(); });
    }
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
