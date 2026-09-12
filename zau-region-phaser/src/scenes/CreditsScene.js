import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../config.js';
import { goToScene, fadeIn } from '../transitions.js';
import creditsMd from '../../public/character/CREDITS.md?raw';

// The credits — the end of the game, and the in-game attribution the
// character art's licenses have been owed since Phase 7. The LPC table is
// parsed straight out of public/character/CREDITS.md so the screen can't
// drift from the file of record.
const SPEED = 28; // px per second

function lpcRows() {
  return creditsMd.split('\n')
    .filter(l => l.startsWith('|') && !l.startsWith('|---') && !l.startsWith('| Asset'))
    .map(l => l.split('|').slice(1, -1).map(c => c.trim().replace(/`/g, '')))
    .filter(cells => cells.length >= 3);
}

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  init(data) {
    this.fromTitle = !!data?.fromTitle;
  }

  create() {
    fadeIn(this);
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x05060c);

    const lines = [];
    const h = (t, size = 20, color = '#e8e8f0', bold = true) => lines.push({ t, size, color, bold, gap: 10 });
    const p = (t, size = 12, color = '#8a8aa0') => lines.push({ t, size, color, bold: false, gap: 4 });
    const sp = (n = 18) => lines.push({ t: '', size: n, gap: 0 });

    if (!this.fromTitle) { h('ZAU', 30); p('Where the storm chooses you', 13, '#c8c8d8'); sp(30); }
    else { h('CREDITS', 24); sp(20); }
    h('A fan-made Pokémon game', 14, '#c8c8d8');
    p('Pokémon and all species, names and artwork are © Nintendo / Creatures Inc. / GAME FREAK inc.');
    p('This is a non-commercial fan project and is not affiliated with or endorsed by them.');
    sp();
    h('Story & world', 16); p('Zau: the stacked city, Meridian Dynamics, the Incident, Verdanyx.'); p('Alma · Priya · Dario Voss · Elena Voss · Director Vance · Professor Mabosso · Dr. Ines Halloran'); p('and everyone in every district who told you something true.');
    sp();
    h('Pokémon artwork', 16); p('Official artwork served from the PokeAPI sprites repository (github.com/PokeAPI/sprites).');
    sp();
    h('Tiles', 16); p("Kenney — Roguelike/RPG pack (kenney.nl), CC0 1.0. Thank you, Kenney.");
    sp();
    h('Character sprites — Liberated Pixel Cup', 16);
    p('Assembled with the Universal LPC Spritesheet Character Generator');
    p('(github.com/sanderfrenken/Universal-LPC-Spritesheet-Character-Generator), from art on OpenGameArt.org.');
    p('Each asset is credited to its authors under its own license, as those licenses require:', 12, '#c8c8d8');
    sp(10);
    for (const [asset, authors, license] of lpcRows()) {
      p(asset, 12, '#e8e8f0');
      p(`${authors} — ${license}`, 11);
      sp(6);
    }
    sp();
    h('Engine', 16); p('Phaser 3 · Vite');
    sp();
    h('Playtested by', 16); p('a very patient headless browser.');
    sp(40);
    h('Thank you for playing.', 18);
    sp(60);

    let y = GAME_H + 10;
    this.items = [];
    for (const l of lines) {
      if (l.t) {
        const txt = this.add.text(GAME_W / 2, y, l.t, { fontFamily: 'sans-serif', fontSize: `${l.size}px`, color: l.color, fontStyle: l.bold ? 'bold' : 'normal', wordWrap: { width: GAME_W - 60 }, align: 'center' }).setOrigin(0.5, 0);
        this.items.push(txt);
        y += txt.height + l.gap;
      } else {
        y += l.size;
      }
    }
    this.totalH = y;
    this.scrolled = 0;

    const btn = this.add.rectangle(GAME_W - 66, GAME_H - 22, 112, 26, 0x232640).setStrokeStyle(1, 0x3a3d5c).setInteractive({ useHandCursor: true }).setDepth(10);
    this.add.text(GAME_W - 66, GAME_H - 22, 'Back to Title', { fontFamily: 'sans-serif', fontSize: '11px', color: '#e8e8f0' }).setOrigin(0.5).setDepth(11);
    btn.on('pointerdown', () => goToScene(this, 'Title'));
    // Hold Space to scroll faster.
    this.fast = false;
    this.input.keyboard.on('keydown-SPACE', () => { this.fast = true; });
    this.input.keyboard.on('keyup-SPACE', () => { this.fast = false; });
  }

  update(_t, dt) {
    if (this.scrolled >= this.totalH) return;
    const step = SPEED * (this.fast ? 6 : 1) * dt / 1000;
    this.scrolled += step;
    this.items.forEach(i => { i.y -= step; });
  }
}
