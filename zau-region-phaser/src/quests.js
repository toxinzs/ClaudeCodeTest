import { state } from './state.js';
import { ensureStoryState } from './story.js';

// Quests — SIDEQUESTS.md made mechanical. A quest's status lives in
// state.quests[key] ('available' | 'active' | 'done'); its progress is
// read off ordinary story flags, so NPC scripts never have to know about
// the quest system beyond a `{ quest: { key, status } }` step. The
// Quests overlay (QuestsScene) lists active/done quests with the first
// unmet objective.
export const QUESTS = {
  ferry: {
    name: 'The Ferry That Never Left',
    giver: 'Harbormaster Rossi', district: 'Harbor District',
    summary: "Rossi's old ferry pumps could drain the Drowned Stair — if he had a crew to run them.",
    steps: [
      { flag: 'ferryAsked', text: 'Ask Rossi about the ferry pumps.' },
      { flag: 'ferryCrew', text: "Get Foreman Kettering to lend his crew (Ember Quarter, the Kilns)." },
      { flag: 'stairDrained', text: 'Return to Rossi at the Ferry Terminal.' }
    ],
    reward: 'Gyaradosite'
  },
  // SIDEQUESTS.md #9 — dialogue-only. Declining is the reward.
  sponsored: {
    name: 'Sponsored',
    giver: 'Sloane (Meridian recruiter)', district: 'The Sprawl',
    summary: "Meridian would like to sponsor you, the way they sponsor Dario. Funding, gear, a name that opens doors.",
    steps: [
      { flag: 'sloaneDecided', text: "Decide about Sloane's offer." }
    ],
    reward: 'Your own name'
  }
};

export function questStatus(key) {
  ensureStoryState();
  return state.quests[key] || null;
}

export function setQuestStatus(key, status) {
  ensureStoryState();
  state.quests[key] = status;
}

export function nextObjective(key) {
  const q = QUESTS[key];
  const step = q.steps.find(s => !state.story?.[s.flag]);
  return step ? step.text : 'Complete.';
}
