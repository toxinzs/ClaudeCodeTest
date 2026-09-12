import Phaser from 'phaser';
import { GAME_W, GAME_H } from './config.js';
import { inputLock } from './lock.js';

// The dialogue box — a real JRPG text box instead of toast text: a name
// plate, typewriter text, multi-page paging on Space/Enter/click, and a
// choice list. Runs as an overlay scene (like Party/Bag) so it renders on
// its own unzoomed camera above any zoomed map, and it's promise-based so
// scripts read top-to-bottom:
//   await say(scene, 'Alma', ['line one', 'line two']);
//   const i = await choose(scene, 'Alma', 'Ready?', ['Yes', 'Not yet']);
const BOX_H = 118;
const BOX_Y = GAME_H - 46 - BOX_H;   // sits above the map scenes' action bar
const PAD = 14;
const TYPE_MS = 16;

export function isDialogueOpen(scene) {
  return scene.scene.isActive('Dialogue');
}

export function say(scene, name, lines) {
  return open(scene, { name, lines: Array.isArray(lines) ? lines : [lines] });
}

export function choose(scene, name, prompt, options) {
  return open(scene, { name, lines: [prompt], options });
}

function open(scene, payload) {
  return new Promise(resolve => {
    inputLock.acquire();
    scene.scene.launch('Dialogue', { ...payload, onDone: (result) => { inputLock.release(); resolve(result); } });
  });
}

export default class DialogueScene extends Phaser.Scene {
  constructor() { super('Dialogue'); }

  init(data) {
    this.name = data.name || '';
    this.lines = data.lines || [''];
    this.options = data.options || null;
    this.onDone = data.onDone || (() => {});
    this.page = 0;
    this.typing = false;
    this.selected = 0;
  }

  create() {
    const w = GAME_W - 16;
    this.add.rectangle(GAME_W / 2, BOX_Y + BOX_H / 2, w, BOX_H, 0x0d0f18, 0.96).setStrokeStyle(2, 0x3a3d5c);
    if (this.name) {
      const plate = this.add.rectangle(8 + PAD, BOX_Y - 1, 10, 22, 0x232640).setOrigin(0, 1).setStrokeStyle(1, 0x3a3d5c);
      const nameText = this.add.text(8 + PAD + 8, BOX_Y - 12, this.name, { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#e8e8f0', fontStyle: 'bold' }).setOrigin(0, 0.5);
      plate.width = nameText.width + 16;
    }
    this.text = this.add.text(8 + PAD, BOX_Y + PAD, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#e8e8f0', wordWrap: { width: w - PAD * 2 }, lineSpacing: 4
    });
    this.cursor = this.add.text(GAME_W - 8 - PAD, BOX_Y + BOX_H - 10, '▼', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#8a8aa0' }).setOrigin(1, 1).setVisible(false);
    this.tweens.add({ targets: this.cursor, y: '+=3', duration: 400, yoyo: true, repeat: -1 });
    this.optionNodes = [];

    // Whole box is clickable to advance; keyboard too.
    this.add.rectangle(GAME_W / 2, BOX_Y + BOX_H / 2, w, BOX_H, 0xffffff, 0.001).setInteractive().on('pointerdown', () => this.advance());
    this.input.keyboard.on('keydown-SPACE', () => this.advance());
    this.input.keyboard.on('keydown-ENTER', () => this.advance());
    this.input.keyboard.on('keydown-Z', () => this.advance());
    this.input.keyboard.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.moveSelection(1));

    this.showPage();
  }

  showPage() {
    const full = this.lines[this.page];
    this.text.setText('');
    this.cursor.setVisible(false);
    this.typing = true;
    let i = 0;
    this.typeTimer = this.time.addEvent({
      delay: TYPE_MS, repeat: full.length - 1,
      callback: () => {
        i++;
        this.text.setText(full.slice(0, i));
        if (i >= full.length) this.finishTyping();
      }
    });
  }

  finishTyping() {
    if (this.typeTimer) this.typeTimer.remove(false);
    this.text.setText(this.lines[this.page]);
    this.typing = false;
    const lastPage = this.page === this.lines.length - 1;
    if (lastPage && this.options) this.showOptions();
    else this.cursor.setVisible(true);
  }

  showOptions() {
    const startY = BOX_Y + PAD + this.text.height + 10;
    this.options.forEach((label, i) => {
      const y = startY + i * 20;
      const t = this.add.text(8 + PAD + 16, y, label, { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#e8e8f0' })
        .setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => { this.selected = i; this.pick(); });
      t.on('pointerover', () => { this.selected = i; this.paintSelection(); });
      this.optionNodes.push(t);
    });
    this.pointer = this.add.text(8 + PAD + 2, startY, '▶', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#e8d27a' });
    this.paintSelection();
  }

  paintSelection() {
    if (!this.pointer) return;
    this.pointer.y = this.optionNodes[this.selected].y;
    this.optionNodes.forEach((n, i) => n.setColor(i === this.selected ? '#e8d27a' : '#e8e8f0'));
  }

  moveSelection(delta) {
    if (!this.optionNodes.length) return;
    this.selected = (this.selected + delta + this.options.length) % this.options.length;
    this.paintSelection();
  }

  advance() {
    if (this.typing) { this.finishTyping(); return; }
    if (this.optionNodes.length) { this.pick(); return; }
    if (this.page < this.lines.length - 1) { this.page++; this.showPage(); return; }
    this.close(null);
  }

  pick() { this.close(this.selected); }

  close(result) {
    const done = this.onDone;
    this.onDone = () => {};
    this.scene.stop();
    done(result);
  }
}
