import Phaser from 'phaser';
import { state, activeMon } from '../state.js';
import { currentMonDisplay } from '../mon.js';
import { saveGame } from '../save.js';
import { ITEMS, itemIcon } from '../data/items.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton, addRow } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';

// Ported from the DOM version's ui/bag.js. `engine` is only passed when
// opened mid-battle (from BattleScene) — that's what gates ball-throwing
// and the "using an item costs the turn" follow-up.
export default class BagScene extends Phaser.Scene {
  constructor() {
    super('Bag');
  }

  init(data) {
    this.engine = data?.engine || null;
  }

  create() {
    this.renderList();
  }

  renderList() {
    this.children.removeAll(true);
    drawModalBackdrop(this, 'Bag');
    addCloseButton(this, () => this.scene.stop());

    const inBattle = !!state.battle;
    const owned = Object.keys(state.items).filter(k => state.items[k] > 0);
    if (!owned.length) {
      this.add.text(GAME_W / 2, GAME_H / 2, 'Your bag is empty.', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5);
      return;
    }
    owned.forEach((key, i) => {
      const item = ITEMS[key];
      const isBall = item.category === 'ball';
      const canUseBall = isBall && inBattle && state.battle.isWild;
      const canUseHere = isBall ? canUseBall : true;
      const note = isBall && inBattle && !state.battle.isWild ? ' (wild only)' : '';
      addRow(this, 56 + i * 40, {
        emoji: itemIcon(key),
        title: item.name + note,
        subtitle: `Have: ${state.items[key]}`,
        buttonLabel: canUseHere ? 'Use' : null,
        onButton: canUseHere ? () => this.useItem(key) : null
      });
    });
  }

  useItem(key) {
    const item = ITEMS[key];
    if (item.category === 'ball') {
      this.scene.stop();
      this.engine.throwPokeBall(key);
      return;
    }
    this.renderTargetPicker(key);
  }

  renderTargetPicker(key) {
    this.children.removeAll(true);
    const item = ITEMS[key];
    drawModalBackdrop(this, `Use ${item.name} on...`);
    addCloseButton(this, () => this.scene.stop());
    const eligible = (mon) => item.revive ? mon.hp <= 0 : (mon.hp > 0 && mon.hp < mon.maxHp);
    const anyEligible = state.party.some(eligible);
    if (!anyEligible) {
      this.add.text(GAME_W / 2, GAME_H / 2, 'No Pokémon need that right now.', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5);
      return;
    }
    state.party.forEach((m, i) => {
      const y = 56 + i * 40;
      const can = eligible(m);
      const d = currentMonDisplay(m);
      addMonIcon(this, 36, y, d, 22);
      this.add.text(64, y - 10, d.name, { fontFamily: 'sans-serif', fontSize: '13px', color: can ? '#e8e8f0' : '#5a5a6a' });
      this.add.text(64, y + 7, `${m.hp}/${m.maxHp} HP`, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' });
      if (can) {
        this.add.rectangle(GAME_W / 2, y, GAME_W - 48, 34, 0xffffff, 0.001)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.applyItem(key, i));
      }
    });
  }

  applyItem(key, idx) {
    const item = ITEMS[key];
    const mon = state.party[idx];
    if (item.revive) {
      mon.hp = item.heal === 'full' ? mon.maxHp : Math.floor(mon.maxHp / 2);
      mon.fainted = false;
    } else {
      const healAmt = item.heal === 'full' ? mon.maxHp : item.heal;
      mon.hp = Math.min(mon.maxHp, mon.hp + healAmt);
    }
    state.items[key]--;
    this.scene.stop();

    if (this.engine) {
      this.engine.render(`Used ${item.name} on ${currentMonDisplay(mon).name}!`);
      // using an item mid-battle costs the turn, same as switching
      const e = this.engine.currentEnemy();
      if (e && e.hp > 0 && activeMon() && activeMon().hp > 0) {
        setTimeout(() => this.engine.enemyTurnOnly(), 700);
      }
    } else {
      saveGame(); // no screen transition to trigger the usual autosave
    }
  }
}
