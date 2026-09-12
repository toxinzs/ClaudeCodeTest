export const MAX_PARTY = 6;

export const state = {
  player: { name: "", appearance: { skin: 'light', hair: 'buzzcut', hairColor: 'black', outfit: 'casual' } },
  starterKey: null,
  party: [],       // array of mon objects, [0] is not necessarily active, capped at MAX_PARTY
  box: [],         // overflow storage (PC Box) — unlimited, mons caught while party is full land here
  hasKeyStone: false, // granted by the story (beating Dario); required alongside a held Mega Stone to Mega Evolve
  activeIdx: 0,
  money: 300,
  items: { pokeball: 5, potion: 3 },
  pos: { home: {x:1,y:2}, town: {x:1,y:5}, trail: {x:2,y:11}, league: {x:3,y:6}, harbor: {x:4,y:3}, ember: {x:4,y:6} },
  trainerIndex: 0,
  darioBeaten: false,
  currentLeagueIdx: 0,
  leagueBeaten: [false,false,false,false,false],
  vanceBeaten: false,
  verdanyxBeaten: false,
  cutsceneIdx: 0,
  battle: null // active battle context object
};

export function activeMon() { return state.party[state.activeIdx]; }

export function firstHealthyIdx() {
  return state.party.findIndex(m => !m.fainted && m.hp > 0);
}
