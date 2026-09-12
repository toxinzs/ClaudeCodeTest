import { state } from './state.js';
import { ensureStoryState } from './story.js';

// Quests — SIDEQUESTS.md made mechanical. A quest's status lives in
// state.quests[key] ('available' | 'active' | 'done'); its progress is
// read off ordinary story flags, so NPC scripts never have to know about
// the quest system beyond a `{ quest: { key, status } }` step. The
// Quests overlay (QuestsScene) lists active/done quests with the first
// unmet objective.
export const QUESTS = {
  // SIDEQUESTS.md #10 — the postgame route to Verdanyx.
  keeper: {
    name: 'The Keeper Above',
    giver: 'Iven (weather-station keeper)', district: 'The Skyline',
    summary: "Iven's three weather stations read the air above Zau. Read all three and they'll say where it stands still — and that's where Verdanyx is sleeping.",
    steps: [
      { flag: 'stationAna', text: 'Read Station Ana (the low west bridge).' },
      { flag: 'stationBel', text: 'Read Station Bel (the low east bridge).' },
      { flag: 'stationCyr', text: 'Read Station Cyr (the upper west bridge).' },
      { flag: 'verdanyxCaught', text: 'Climb to the Highest Station.' }
    ],
    reward: 'Verdanyx, and the Garchompite'
  },
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
  },
  // SIDEQUESTS.md #3
  lastline: {
    name: 'The Last Line',
    giver: 'Foreman Kettering', district: 'Ember Quarter',
    summary: "Kettering wants all three mill lines running again: a part, a worker who quit, and a Torkoal that won't leave the furnace.",
    steps: [
      { flag: 'lastLinePart', text: 'Find a relay at the Scrapyard Exchange (ask Bo).' },
      { flag: 'lastLineIla', text: 'Talk Ila into coming back (she\'s at the west end of the Quarter, by the haul road).' },
      { flag: 'lastLineTorkoal', text: 'Move the Torkoal out of the furnace (talk to Kettering).' },
      { flag: 'lastLineDone', text: 'Report to Kettering.' }
    ],
    reward: 'Lucarionite'
  },
  // SIDEQUESTS.md #4
  grows: {
    name: 'What Grows There',
    giver: 'Old Sato', district: 'Greenline Terraces',
    summary: "Three cuttings from the ferns by the pump intake, for Priya. Each is guarded by something that grew wrong.",
    steps: [
      { flag: 'fern1', text: 'Take the first cutting (Dr. Kess, at the Irrigation Works).' },
      { flag: 'fern2', text: 'Take the second cutting.' },
      { flag: 'fern3', text: 'Take the third cutting.' },
      { flag: 'growsDone', text: 'Bring the cuttings to Old Sato.' }
    ],
    reward: 'Gardevoirite'
  },
  // SIDEQUESTS.md #5
  orchard: {
    name: 'The Orchard Bet',
    giver: 'Priya (the Allotments)', district: 'Greenline Terraces',
    summary: "Beat Tomas, Pip and Grandma Osei. Osei is a real fight — everyone knows it but her.",
    steps: [
      { flag: 'orchardTomas', text: 'Beat Tomas.' },
      { flag: 'orchardPip', text: 'Beat Pip.' },
      { flag: 'orchardOsei', text: 'Beat Grandma Osei.' }
    ],
    reward: 'Heracronite'
  },
  // SIDEQUESTS.md #6
  song: {
    name: "The Song She Can't Finish",
    giver: 'Busker Talia', district: 'Signal District',
    summary: "Talia hears a melody in the storms. Record it at three points: the Antenna Farm, the Cable Risers terminal, and the Sprawl Bridge.",
    steps: [
      { flag: 'song1', text: 'Record at the Antenna Farm.' },
      { flag: 'song2', text: 'Record at the Cable Risers terminal.' },
      { flag: 'song3', text: 'Record at the Sprawl Bridge.' },
      { flag: 'songDone', text: 'Bring the recording to Talia.' }
    ],
    reward: 'Alakazite'
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
