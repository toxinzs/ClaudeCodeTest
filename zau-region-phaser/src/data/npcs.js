import { TOWN_MAP } from './maps.js';

// Every placed character in the game, per map, straight from
// zau-region/CHARACTERS.md. An NPC is { id, name, x, y, facing, appearance,
// when?, script } where `script(state)` returns steps for script.js —
// so lines change as the story advances ("says when"), and `when(state)`
// decides whether the character is even present for the current beat.
// Story flags used here (state.story.*): introDone, marenTip, harborDario,
// cargoRow — see STORY.md Act 2, Harbor beats H1–H3.
// Placement rule: a character must never stand in a one-tile corridor (the
// Greenline's rows are exactly that), so there they stand ON their landmark
// tile and carry its description — talking to Wren opens the Seed Bank.

const badges = (s) => s.leagueBeaten.filter(Boolean).length;

// First floor tile next to a landmark, so a character can stand beside
// the lab door without hand-picking a coordinate per map edit.
function beside(map, x, y) {
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (map.layout[ny]?.[nx] === 0) return { x: nx, y: ny };
  }
  return { x, y };
}

export const HOME_NPCS = [
  {
    id: 'alma', name: 'Alma', x: 3, y: 3, facing: 'down',
    appearance: { skin: 'brown', hair: 'bob', hairColor: 'dark_brown', outfit: 'explorer' },
    script: (s) => {
      if (!s.party.length) return [
        { say: ['Alma', "Mabosso's expecting you. The lab's across the way — don't make the man wait, he's got a queue.", "And take the bag. I fixed the strap. Store-bought ones fall apart in a month."] }
      ];
      if (!s.darioBeaten) return [
        { say: ['Alma', "You got your bag, you got your balls, you got a way to call me. Go on.", "Storm last night knocked the power out on three floors. Never used to do that."] }
      ];
      if (badges(s) === 0) return [
        { say: ['Alma', "The storm took the roof off the Underpass depot. The whole roof. That's never happened.", "Harbor's open to you now, I hear. Rossi's alright. Don't let him talk your ear off about the ferry."] }
      ];
      if (!s.hasKeyStone) return [
        { say: ['Alma', `${badges(s)} badge${badges(s) === 1 ? '' : 's'}. Your father would've made a whole speech. I'll just say: eat something.`] }
      ];
      return [
        { say: ['Alma', "A Key Stone. Where did you—", "…Elena Voss had one of those. Dario's mother. She fixed things too, you know. Then she was gone.", "Be careful with whatever that is."] }
      ];
    }
  }
];

// The game's first on-map cutscene: a fresh game opens with Alma walking
// over from the counter instead of a wall of text (STORY.md Act 1, beat 1).
export const HOME_INTRO = [
  { wait: 500 },
  { walk: { actor: 'alma', path: 'LU' } },
  { face: { actor: 'alma', dir: 'left' } },
  { face: { actor: 'player', dir: 'right' } },
  { say: ['Alma', "So today's the day.", "Mabosso's got a starter with your name on it, if you get there before the queue does."] },
  { choice: { name: 'Alma', prompt: 'You ready for this?', options: [
    { label: 'Ready.', then: [{ say: ['Alma', "Course you are. You've been ready since you were six."] }] },
    { label: 'Not even a little.', then: [{ say: ['Alma', "Good. The ones who say they're ready are the ones I worry about."] }] }
  ] } },
  { say: ['Alma', "Take the bag. I fixed the strap — store-bought ones fall apart in a month.", "You got your bag, you got a way to call me. Go on. Door's that way."] },
  { set: 'introDone' },
  { walk: { actor: 'alma', path: 'DR' } },
  { face: { actor: 'alma', dir: 'down' } }
];

export const TOWN_NPCS = [
  {
    id: 'priya', name: 'Priya', ...beside(TOWN_MAP, TOWN_MAP.labX, TOWN_MAP.labY), facing: 'down',
    appearance: { skin: 'amber', hair: 'braid', hairColor: 'black', outfit: 'casual' },
    script: (s) => {
      if (!s.party.length) return [
        { say: ['Priya', "You're here! Okay, don't panic, but Mabosso has THREE starters left and one of them keeps setting things on fire.", "I'm going with the Grass one. It's the only one that looks at me like it's thinking."] }
      ];
      if (!s.darioBeaten) return [
        { say: ['Priya', "Dario's at the far end of the Trail. He's been 'warming up' for two hours. Two. Hours.", "I'm not chasing badges — I want to actually watch these things. But the Trail's the only way anywhere, so… see you at the end?"] }
      ];
      return [
        { say: ['Priya', "I'll catch up with you at the Harbor. The lighthouse keeper apparently knows things nobody official will say. My favourite kind of person."] }
      ];
    }
  }
];

export const HARBOR_NPCS = [
  {
    id: 'rossi', name: 'Harbormaster Rossi', x: 6, y: 4, facing: 'right',
    appearance: { skin: 'olive', hair: 'none', hairColor: 'gray', outfit: 'formal' },
    script: (s) => {
      if (badges(s) >= 4) return [
        { say: ['Rossi', "The Drowned Stair? It's twelve feet of water. My old ferry pumps could drain it — if I had a crew that could run them.", "Kettering's people up in the Quarter could. Broker that and I'll owe you."] }
      ];
      if (s.story.cargoRow) return [
        { say: ['Rossi', "Heard about the yard. Site Security's been in my office twice today asking about 'trespassers'.", "I told them the harbor's public. It is. Was."] }
      ];
      return [
        { say: ['Rossi', "Boats used to leave from here. Every morning. Then they stopped.", "Nobody official will tell you why. I'm official. Nobody told me either."] }
      ];
    }
  },
  {
    id: 'maren', name: 'Maren', x: 5, y: 2, facing: 'left',
    appearance: { skin: 'bronze', hair: 'pixie', hairColor: 'black', outfit: 'sporty' },
    script: (s) => {
      if (s.story.cargoRow) return [
        { say: ['Maren', "L-0. That's the old excavation code. My father's crew used it. I haven't seen it stencilled on anything in eighteen years.", "Whatever they're shipping, it isn't going out to sea."] }
      ];
      if (s.story.marenTip) return [
        { say: ['Maren', "Off the clock, I talk. On the clock, I don't. The yard's quieter after dark — if someone were curious."] }
      ];
      return [
        { say: ['Maren', "Cargo Row? I work it. Or I did — the trucks that come now don't stop at the market. Don't stop anywhere.", "The crates have dig codes on them. Old ones. My dad's time.", "Off the clock, I talk. That's all I'm saying."] },
        { set: 'marenTip' }
      ];
    }
  },
  {
    id: 'ambrose', name: 'Keeper Ambrose', x: 2, y: 4, facing: 'left',
    appearance: { skin: 'light', hair: 'long', hairColor: 'white', outfit: 'explorer' },
    script: (s) => [
      { say: ['Ambrose', "Only thing here older than the stacking. Me and the light.", "Zau wasn't always up. It was *down* first — tunnels, lines, the old harbor works. Then they built on top and forgot."] },
      { if: (st) => st.story.cargoRow, then: [{ say: ['Ambrose', "The storms used to come in off the sea. Ask anyone my age. They don't anymore.", "They come from under."] }] }
    ]
  },
  {
    id: 'dario', name: 'Dario Voss', x: 2, y: 2, facing: 'left',
    when: (s) => s.darioBeaten && !s.story.cargoRow,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: (s) => {
      if (!s.story.marenTip) return [
        { say: ['Dario', "Two days I've been watching that yard. Trucks in, trucks out, nothing to the market.", "Meridian sponsors trainers, you know. Real money. Bet they'd notice someone who noticed them.", "…Ask around the market. Somebody down here knows what's in those crates."] }
      ];
      if (!s.story.harborDario) return [
        { say: ['Dario', "You talked to the dockworker. I saw. So you're actually doing this.", "Fine. But I go first. Bet your team's not ready for mine now."] },
        { battle: { trainerKey: 'darioHarbor', returnTo: 'Harbor' } }
      ];
      return [
        { say: ['Dario', "The yard. Tonight. There's a gap in the fence behind the cranes.", "You coming, or do I get all the credit?"] }
      ];
    }
  },
  {
    id: 'priyaHarbor', name: 'Priya', x: 2, y: 3, facing: 'down',
    when: (s) => s.story.cargoRow,
    appearance: { skin: 'amber', hair: 'braid', hairColor: 'black', outfit: 'casual' },
    script: () => [
      { say: ['Priya', "Ambrose says the storms used to come from the sea. They don't anymore.", "They come from under. I've been writing down where the wild Pokémon run *from* when it thunders. It's always the same direction."] }
    ]
  }
];

// STORY.md H3 — the Cargo Row break-in. Runs when the player steps onto
// the Cargo Row tile after beating Dario's rematch; the Site Security
// battle's winFlag ('cargoRow') is what marks the beat done.
export const HARBOR_CARGO_BREAKIN = [
  { say: ['Dario', "Gap's here. Keep low.", "…Drill housings. Pump sections. Who ships mining gear into a harbor that doesn't run boats?"] },
  { shake: 300 },
  { say: ['Site Security Pell', "This is a restricted area, and I'm going to have to ask you both to leave.", "…After."] },
  { battle: { trainerKey: 'siteSecurityHarbor', returnTo: 'Harbor' } }
];

export const EMBER_NPCS = [
  {
    id: 'kettering', name: 'Foreman Kettering', x: 2, y: 5, facing: 'left',
    appearance: { skin: 'brown', hair: 'buzzcut', hairColor: 'gray', outfit: 'explorer' },
    script: (s) => {
      if (badges(s) >= 4) return [
        { say: ['Kettering', "Rossi wants my crew for his pumps? Fine. He can have them the day my lights stay on for a whole night."] }
      ];
      return [
        { say: ['Kettering', "Brownouts started the month that substation went live. Every night, like clockwork.", "We draw less than we did ten years ago. So who's drawing?"] }
      ];
    }
  },
  {
    id: 'ozren', name: 'Ozren', x: 2, y: 1, facing: 'left',
    appearance: { skin: 'light', hair: 'ponytail', hairColor: 'dark_brown', outfit: 'formal' },
    script: () => [
      { say: ['Ozren', "Grid stabilisation. That's what the work order says, and that's all I'm cleared to say.", "…Off the clock? The trunk cable goes further down than any drawing I've been shown."] }
    ]
  },
  {
    id: 'bo', name: 'Bo', x: 3, y: 3, facing: 'right',
    appearance: { skin: 'black', hair: 'afro', hairColor: 'black', outfit: 'casual' },
    script: () => [
      { say: ['Bo', "Everything off a pallet, till's a coffee tin. Meridian's paying for my new roof, so I'm not complaining. Out loud."] }
    ]
  },
  {
    id: 'halloran', name: 'Dr. Halloran', x: 5, y: 3, facing: 'left',
    when: (s) => badges(s) >= 1,
    appearance: { skin: 'olive', hair: 'bob', hairColor: 'ginger', outfit: 'formal' },
    script: (s) => [
      { say: ['Dr. Halloran', "Ines Halloran, Meridian community relations. We fund the Exchange's repairs, sponsor local trainers — the boring good stuff.", "You're the one clearing the League. I know your name. I make a point of it."] },
      { if: (st) => st.story.cargoRow, then: [
        { say: ['Dr. Halloran', "I heard there was an incident at the Harbor yard. Security overreacts. I'll have a word.", "And your friend Dario — a Voss, in the League. I'd like to see that go somewhere."] }
      ] }
    ]
  }
];

export const GREENLINE_NPCS = [
  {
    id: 'sato', name: 'Old Sato', x: 7, y: 5, facing: 'left',
    appearance: { skin: 'amber', hair: 'none', hairColor: 'white', outfit: 'explorer' },
    script: (s) => [
      { say: ['Old Sato', "The Overlook. From this bench you can watch the storms gather over the Outskirts before anyone down there knows it's raining.", "Planted every terrace here. Forty years. Stopped planting near the pump.", "Nobody asked why, so I stopped saying."] },
      { if: (st) => badges(st) >= 3, then: [
        { say: ['Old Sato', "The white one with the horn. On the edge, before every storm this year. It looks at the Outskirts. Then it looks *down*."] }
      ] }
    ]
  },
  {
    id: 'kess', name: 'Dr. Kess', x: 1, y: 3, facing: 'right',
    appearance: { skin: 'light', hair: 'pixie', hairColor: 'blonde', outfit: 'formal' },
    script: () => [
      { say: ['Dr. Kess', "Meridian Irrigation Works. The intake feeds every terrace. Deep aquifer — mineral-rich, hence the warmth. Perfectly ordinary hydrology.", "…The ferns by the pipe? Twice the size, yes. I'm a hydrologist. Plants aren't my department."] }
    ]
  },
  {
    id: 'wren', name: 'Wren', x: 1, y: 1, facing: 'right',
    appearance: { skin: 'taupe', hair: 'long', hairColor: 'purple', outfit: 'casual' },
    script: () => [
      { say: ['Wren', "Welcome to the Seed Bank. Every purchase is a small bet on the future. Seeds especially."] },
      { call: (scene) => scene.scene.launch('Mart') }
    ]
  }
];
