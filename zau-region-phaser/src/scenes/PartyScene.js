import Phaser from 'phaser';
import { state, activeMon } from '../state.js';
import { currentMonDisplay } from '../mon.js';
import { GAME_W, GAME_H } from '../config.js';
import { drawModalBackdrop, addCloseButton } from '../uiHelpers.js';
import { addMonIcon } from '../spriteLoader.js';

// Launched on top of whatever scene opened it (a map scene, or BattleScene
// during a switch/faint) — never pauses the caller, so closing is just
// this.scene.stop(). Ported from the DOM version's ui/party.js.
export default class PartyScene extends Phaser.Scene {
  constructor() {
    super('Party');
  }

  init(data) {
    this.switchMode = !!data?.switchMode;
    this.engine = data?.engine || null;
  }

  create() {
    drawModalBackdrop(this, this.switchMode ? 'Choose your next Pokémon' : 'Your Party');
    addCloseButton(this, () => this.scene.stop());

    if (state.party.length === 0) {
      this.add.text(GAME_W / 2, GAME_H / 2, "You don't have any Pokémon yet.", {
        fontFamily: 'sans-serif', fontSize: '13px', color: '#8a8aa0'
      }).setOrigin(0.5);
      return;
    }

    state.party.forEach((m, i) => {
      const y = 56 + i * 40;
      const d = currentMonDisplay(m);
      const isFainted = m.hp <= 0;
      const isActive = i === state.activeIdx && !this.switchMode;
      const clickable = this.switchMode ? (!isFainted && i !== state.activeIdx) : false;

      addMonIcon(this, 36, y, d, 24);
      const label = `${d.name}${isFainted ? ' (Fainted)' : ''}${isActive ? ' ★' : ''}`;
      this.add.text(64, y - 10, label, { fontFamily: 'sans-serif', fontSize: '13px', color: isFainted ? '#e57373' : '#e8e8f0' });
      this.add.text(64, y + 7, `Lv.${m.level} · ${d.type} · ${m.hp}/${m.maxHp} HP`, { fontFamily: 'sans-serif', fontSize: '11px', color: '#8a8aa0' });

      if (clickable) {
        this.add.rectangle(GAME_W / 2, y, GAME_W - 48, 34, 0xffffff, 0.001)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.switchToMon(i));
      }
    });
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
