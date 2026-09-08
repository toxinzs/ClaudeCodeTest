import Phaser from 'phaser';
import { state } from '../state.js';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';
import { preloadPlayerLayers, createPlayerSprite } from '../playerSprite.js';
import { SKIN_TONES, HAIR_STYLES, HAIR_COLORS, OUTFITS, DEFAULT_APPEARANCE, normalizeAppearance } from '../data/appearance.js';

const CATEGORIES = [
  { key: 'skin', label: 'Skin', options: SKIN_TONES },
  { key: 'hair', label: 'Hair', options: HAIR_STYLES },
  { key: 'hairColor', label: 'Hair Color', options: HAIR_COLORS },
  { key: 'outfit', label: 'Outfit', options: OUTFITS },
];

const PREVIEW_X = GAME_W / 2;
const PREVIEW_Y = 80;
const PREVIEW_SCALE = 1.8;
const TAB_Y = 156;
const GRID_TOP = 174;
const GRID_COLS = 4;
const CELL = 70;

// Real layered character customization (replaces the old fixed emoji-avatar
// picker): skin tone / hairstyle / hair color / outfit, each swapping a
// real LPC sprite layer. A live preview re-renders on every pick so the
// player actually sees what they're building, tabbed by category since
// four full option grids don't fit on screen at once.
export default class CharCreateScene extends Phaser.Scene {
  constructor() {
    super('CharCreate');
  }

  preload() {
    // Preload every option's layer up front (not just the current pick) so
    // switching categories/values never has to wait mid-session on a load.
    for (const skin of SKIN_TONES) preloadPlayerLayers(this, { ...DEFAULT_APPEARANCE, skin: skin.id, hair: 'none' });
    for (const style of HAIR_STYLES) {
      if (style.id === 'none') continue;
      for (const color of HAIR_COLORS) preloadPlayerLayers(this, { ...DEFAULT_APPEARANCE, hair: style.id, hairColor: color.id });
    }
    for (const outfit of OUTFITS) preloadPlayerLayers(this, { ...DEFAULT_APPEARANCE, outfit: outfit.id, hair: 'none' });
  }

  create() {
    fadeIn(this);
    this.appearance = normalizeAppearance(state.player.appearance);
    this.categoryIdx = 0;

    this.add.text(GAME_W / 2, 8, 'Choose Your Look', { fontFamily: 'sans-serif', fontSize: '16px', color: '#e8e8f0' }).setOrigin(0.5, 0);

    this.previewCtrl = createPlayerSprite(this, PREVIEW_X, PREVIEW_Y, this.appearance);
    this.previewCtrl.container.setScale(PREVIEW_SCALE);

    this.tabTexts = [];
    const tabW = GAME_W / CATEGORIES.length;
    CATEGORIES.forEach((cat, i) => {
      const x = tabW * i + tabW / 2;
      const bg = this.add.rectangle(x, TAB_Y, tabW - 4, 22, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, TAB_Y, cat.label, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' }).setOrigin(0.5);
      bg.on('pointerdown', () => this.selectCategory(i));
      this.tabTexts.push({ bg, label });
    });

    this.gridGroup = this.add.container(0, 0);
    this.selectCategory(0);

    this.add.text(GAME_W / 2, GRID_TOP + 2 * CELL + 8, 'Trainer Name', { fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0' }).setOrigin(0.5, 0);
    this.nameInput = this.add.dom(GAME_W / 2, GRID_TOP + 2 * CELL + 34, 'input',
      'width: 220px; height: 28px; font-size: 15px; text-align: center; border-radius: 6px; border: 1px solid #3a3d5c; background: #12141f; color: #e8e8f0;'
    );
    this.nameInput.node.setAttribute('maxlength', '14');
    this.nameInput.node.setAttribute('placeholder', 'Enter your name');
    if (state.player.name) this.nameInput.node.value = state.player.name;

    this.errorText = this.add.text(GAME_W / 2, GRID_TOP + 2 * CELL + 66, '', {
      fontFamily: 'sans-serif', fontSize: '12px', color: '#e57373'
    }).setOrigin(0.5, 0);

    const confirmY = GRID_TOP + 2 * CELL + 96;
    const confirmBg = this.add.rectangle(GAME_W / 2, confirmY, 220, 34, 0x2d6a4f).setStrokeStyle(1, 0x3fa373).setInteractive({ useHandCursor: true });
    this.add.text(GAME_W / 2, confirmY, 'Confirm', { fontFamily: 'sans-serif', fontSize: '14px', color: '#e8e8f0' }).setOrigin(0.5);
    confirmBg.on('pointerdown', () => this.confirm());
  }

  selectCategory(idx) {
    this.categoryIdx = idx;
    this.tabTexts.forEach((t, i) => {
      t.bg.setStrokeStyle(1, i === idx ? 0x8a8aff : 0x3a3d5c);
      t.label.setColor(i === idx ? '#e8e8f0' : '#8a8aa0');
    });
    this.renderGrid();
  }

  renderGrid() {
    this.gridGroup.removeAll(true);
    const cat = CATEGORIES[this.categoryIdx];
    const offsetX = (GAME_W - GRID_COLS * CELL) / 2;
    cat.options.forEach((opt, i) => {
      const col = i % GRID_COLS, row = Math.floor(i / GRID_COLS);
      const x = offsetX + col * CELL + CELL / 2;
      const y = GRID_TOP + row * CELL + CELL / 2;
      const picked = this.appearance[cat.key] === opt.id;
      const box = this.add.rectangle(x, y, CELL - 8, CELL - 10, 0x232640).setStrokeStyle(2, picked ? 0x8a8aff : 0x3a3d5c).setInteractive({ useHandCursor: true });
      this.gridGroup.add(box);
      if (opt.swatch !== undefined) {
        this.gridGroup.add(this.add.circle(x, y - 8, 12, opt.swatch));
      }
      this.gridGroup.add(this.add.text(x, y + (opt.swatch !== undefined ? 14 : 0), opt.label, {
        fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0', align: 'center', wordWrap: { width: CELL - 12 }
      }).setOrigin(0.5));
      box.on('pointerdown', () => this.pick(cat.key, opt.id));
    });
  }

  pick(key, value) {
    this.appearance = { ...this.appearance, [key]: value };
    this.previewCtrl.destroy();
    this.previewCtrl = createPlayerSprite(this, PREVIEW_X, PREVIEW_Y, this.appearance);
    this.previewCtrl.container.setScale(PREVIEW_SCALE);
    this.renderGrid();
  }

  confirm() {
    const name = this.nameInput.node.value.trim();
    if (!name) {
      this.errorText.setText('Enter a trainer name first.');
      return;
    }
    state.player.name = name;
    state.player.appearance = this.appearance;
    goToScene(this, 'Home');
  }
}
