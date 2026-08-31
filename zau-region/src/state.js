export const state = {
  player: { name: "", avatar: "🧑🏾" },
  starterKey: null,
  party: [],       // array of mon objects, [0] is not necessarily active
  activeIdx: 0,
  money: 300,
  items: { pokeball: 5, potion: 3 },
  pos: { home: {x:1,y:2}, town: {x:1,y:5}, trail: {x:2,y:11} },
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
