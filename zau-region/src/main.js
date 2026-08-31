import { closeModal } from './screens.js';
import { tryMove, headOutside } from './map.js';
import { startCutscene, nextCutsceneSlide, startTitleTypewriter, continueGame, refreshContinueVisibility } from './ui/title.js';
import { skipToCharCreate, pickAvatar, confirmCharCreate } from './ui/charCreate.js';
import { openDex, confirmStarterChoice, leaveLab } from './ui/lab.js';
import { openParty, switchToMon } from './ui/party.js';
import { openMart, buyItem } from './ui/mart.js';
import { openDexBook } from './ui/dexBook.js';
import { enterLeagueMap, selectLeagueLeader } from './ui/league.js';
import { restartGame } from './ui/end.js';
import {
  playerUseMove, throwPokeBall, tryFlee, startTrainerBattle,
  confirmForgetMove, skipMoveLearn
} from './battle.js';

// Every function referenced from an inline onclick="..." attribute (static HTML
// markup or dynamically-generated template strings) must live here, since ES
// module top-level declarations are not implicitly global. This table is the
// single audit point of "everything reachable from HTML" — keep it in sync
// whenever a screen gains a new inline handler.
Object.assign(window, {
  // screens.js
  closeModal,
  // map.js
  tryMove, headOutside,
  // ui/title.js
  startCutscene, nextCutsceneSlide, continueGame,
  // ui/charCreate.js
  skipToCharCreate, pickAvatar, confirmCharCreate,
  // ui/lab.js
  openDex, confirmStarterChoice, leaveLab,
  // ui/party.js
  openParty, switchToMon,
  // ui/mart.js
  openMart, buyItem,
  // ui/dexBook.js
  openDexBook,
  // ui/league.js
  enterLeagueMap, selectLeagueLeader,
  // ui/end.js
  restartGame,
  // battle.js
  playerUseMove, throwPokeBall, tryFlee, startTrainerBattle,
  confirmForgetMove, skipMoveLearn
});

// ================== INIT ==================
// screen-title already carries class="screen active" in the markup itself, so
// there's no explicit showScreen('title') call here — matches original boot order.
document.getElementById('main-wrap').classList.add('on-title-screen');
refreshContinueVisibility();
startTitleTypewriter();
