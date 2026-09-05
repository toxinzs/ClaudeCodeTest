import { GAME_W, GAME_H } from './config.js';

// Shared modal chrome + list-row + bottom action-bar layout, reused across
// every overlay scene (Party/Bag/Mart/Dex/Center/MoveLearn) and every map
// scene's action row — the Phaser-scene equivalent of the DOM version's
// openModal()/party-list markup, so each overlay isn't reinventing layout.

export function drawModalBackdrop(scene, title) {
  scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x0d0f18, 0.92);
  scene.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W - 24, GAME_H - 24, 0x171a2c).setStrokeStyle(1, 0x2f3350);
  scene.add.text(GAME_W / 2, 20, title, {
    fontFamily: 'sans-serif', fontSize: '15px', color: '#e8e8f0', wordWrap: { width: GAME_W - 80 }, align: 'center'
  }).setOrigin(0.5, 0);
}

export function addCloseButton(scene, onClose) {
  const btn = scene.add.text(GAME_W - 24, 18, '✕', { fontFamily: 'sans-serif', fontSize: '16px', color: '#c8c8d8' })
    .setOrigin(0.5).setInteractive({ useHandCursor: true });
  btn.on('pointerdown', onClose);
  return btn;
}

// A single list row: emoji/icon, title + subtitle, and either a labeled
// button on the right (Buy/Use) or the whole row is clickable (party switch,
// item-target picker).
export function addRow(scene, y, opts) {
  scene.add.text(36, y, opts.emoji || '', { fontSize: '20px' }).setOrigin(0, 0.5);
  scene.add.text(64, y - 8, opts.title, {
    fontFamily: 'sans-serif', fontSize: '13px', color: opts.dim ? '#6a6a7a' : '#e8e8f0'
  }).setOrigin(0, 0);
  if (opts.subtitle) {
    scene.add.text(64, y + 8, opts.subtitle, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' }).setOrigin(0, 0);
  }
  if (opts.buttonLabel) {
    const bw = 56, bh = 24;
    const bx = GAME_W - 24 - bw / 2 - 12, by = y;
    const bg = scene.add.rectangle(bx, by, bw, bh, 0x232640).setStrokeStyle(1, 0x3a3d5c);
    const label = scene.add.text(bx, by, opts.buttonLabel, { fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0' }).setOrigin(0.5);
    if (opts.onButton) {
      bg.setInteractive({ useHandCursor: true }).on('pointerdown', opts.onButton);
    } else {
      bg.setAlpha(0.35); label.setAlpha(0.35);
    }
  } else if (opts.onRowClick) {
    scene.add.rectangle(GAME_W / 2, y, GAME_W - 48, 34, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).on('pointerdown', opts.onRowClick);
  }
}

// The bottom action bar (Party/Mart/Bag/Center[/Dex], or Switch/Bag/Flee in
// battle) — an evenly-split row of buttons pinned to the reserved 40px strip
// at the bottom of the fixed canvas.
export function addActionBar(scene, buttons, y = GAME_H - 20) {
  const w = (GAME_W - 20) / buttons.length;
  const nodes = [];
  buttons.forEach((b, i) => {
    const x = 10 + w * i + w / 2;
    const bg = scene.add.rectangle(x, y, w - 6, 28, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true });
    const label = scene.add.text(x, y, b.label, { fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0' }).setOrigin(0.5);
    bg.on('pointerdown', b.onClick);
    nodes.push({ bg, label });
  });
  return nodes;
}
