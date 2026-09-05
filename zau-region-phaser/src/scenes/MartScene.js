import Phaser from 'phaser';
import { state } from '../state.js';
import { saveGame } from '../save.js';
import { ITEMS, itemIcon, availableItems } from '../data/items.js';
import { GAME_W } from '../config.js';
import { drawModalBackdrop, addCloseButton, addRow } from '../uiHelpers.js';

// Ported from the DOM version's ui/mart.js — stock tiers by League badge
// count via data/items.js's availableItems(), unchanged from the DOM version.
export default class MartScene extends Phaser.Scene {
  constructor() {
    super('Mart');
  }

  create() {
    this.renderList();
  }

  renderList() {
    this.children.removeAll(true);
    drawModalBackdrop(this, 'Zau Poké Mart');
    addCloseButton(this, () => this.scene.stop());
    this.add.text(GAME_W / 2, 42, `Balance: ₽${state.money}`, { fontFamily: 'sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(0.5);

    const badgeCount = state.leagueBeaten.filter(Boolean).length;
    const keys = availableItems(badgeCount);
    keys.forEach((key, i) => {
      const item = ITEMS[key];
      addRow(this, 68 + i * 36, {
        emoji: itemIcon(key),
        title: item.name,
        subtitle: `₽${item.price} · Have: ${state.items[key] || 0}`,
        buttonLabel: 'Buy',
        onButton: () => this.buyItem(key, item.price)
      });
    });
  }

  buyItem(key, cost) {
    if (state.money < cost) return;
    state.money -= cost;
    state.items[key] = (state.items[key] || 0) + 1;
    saveGame(); // buying doesn't change screens, so it needs an explicit checkpoint
    this.renderList();
  }
}
