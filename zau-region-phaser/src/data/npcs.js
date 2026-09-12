import { TOWN_MAP } from './maps.js';
import { goToScene } from '../transitions.js';
import { grantKeyStone } from '../keystone.js';

// Every placed character in the game, per map, straight from
// zau-region/CHARACTERS.md. An NPC is { id, name, x, y, facing, appearance,
// when?, script } where `script(state)` returns steps for script.js —
// so lines change as the story advances ("says when"), and `when(state)`
// decides whether the character is even present for the current beat.
// Story flags used here (state.story.*): introDone, marenTip, harborDario,
// cargoRow (Harbor H1–H3); emberHalloran, blackout, boilerIla, boilerDev,
// aggroniteFound, lineRestored, emberDarioPin (Ember E2–E3); priyaSamples,
// stormSeen (Greenline G2–G3); signalJuno, risersOduya, risersBrann,
// pulseDecoded, signalDario (Signal S1–S3); ferryAsked, ferryCrew,
// stairDrained, oldlinesNyx, oldlinesCass, houndoominiteFound,
// gengariteGiven, wardenMet, act2Close (Undercity U1–U3); sprawlDario,
// towerBadge, sloaneDecided, sprawlJae, towerOpen (Sprawl SP1–SP2);
// towerRask, towerMarlowe, vanceTalked, rigActivated, underlightDario,
// ending (Tower T1–T3, Underlight V1–V4); lastLine*, fern*, growsDone,
// orchard*, song* (side quests #3–#6, Phase 25).
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
      if (s.story.stairDrained) return [
        { say: ['Rossi', "Stair's dry. First time in eighteen years. Whatever's down there, it's yours now.", "And when this is over — I'm getting a boat back on the water. You'll be on it."] }
      ];
      if (s.story.ferryCrew) return [
        { say: ['Rossi', "Kettering's crew? On the pumps? Give me a minute—"] },
        { call: (scene) => scene.drainStair?.() },
        { shake: 700 },
        { wait: 400 },
        { say: ['Rossi', "…and that's twelve feet of water going back where it came from. The Drowned Stair's open.", "Here. Found it in the ferry's bilge twenty years ago and never knew what it was. Looks like something you'd know."] },
        { give: { item: 'gyaradosite' } },
        { say: ['', "Received the Gyaradosite!"] },
        { set: 'stairDrained' },
        { quest: { key: 'ferry', status: 'done' } }
      ];
      if (s.story.ferryAsked) return [
        { say: ['Rossi', "Kettering. Ember Quarter, the Kilns. Tell him it's for the pumps. He'll say no, then he'll say yes."] }
      ];
      if (badges(s) >= 4) return [
        { say: ['Rossi', "The Drowned Stair? It's twelve feet of water. My old ferry pumps could drain it — if I had a crew that could run them.", "Kettering's people up in the Quarter could. Broker that and I'll owe you."] },
        { set: 'ferryAsked' },
        { quest: { key: 'ferry', status: 'active' } }
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
  // SIDEQUESTS.md #3 — Ila quit when the line died; she's at the west end.
  {
    id: 'ilaQuit', name: 'Ila', x: 1, y: 6, facing: 'right',
    when: (s) => s.story.lastLineAsked && !s.story.lastLineIla,
    appearance: { skin: 'bronze', hair: 'ponytail', hairColor: 'black', outfit: 'sporty' },
    script: () => [
      { say: ['Ila', "Kettering sent you. Of course he did. He'd rather send you than ask.", "…Line's really back? All right. Tell him I want the day shift. And a chair that isn't a crate."] },
      { set: 'lastLineIla' }
    ]
  },
  {
    id: 'kettering', name: 'Foreman Kettering', x: 2, y: 5, facing: 'left',
    appearance: { skin: 'brown', hair: 'buzzcut', hairColor: 'gray', outfit: 'explorer' },
    script: (s) => {
      // SIDEQUESTS.md #3 — The Last Line (after the blackout is fixed).
      if (s.story.lineRestored && !s.story.lastLineDone) {
        if (s.story.lastLineTorkoal) return [
          { say: ['Kettering', "Part's in, Ila's back, Torkoal's on the brick instead of in the box. Three lines. Three.", "Ten years I've been running one. Here — found this in the slag pit the day the substation went in. Figured it was your kind of thing."] },
          { give: { item: 'lucarionite' } }, { say: ['', 'Received the Lucarionite!'] },
          { set: 'lastLineDone' }, { quest: { key: 'lastline', status: 'done' } }
        ];
        if (s.story.lastLineIla) return [
          { say: ['Kettering', "Last thing. There's a Torkoal living in furnace three. Likes the heat. Won't leave. I'm not going in there after it — you are."] },
          { battle: { trainerKey: 'kilnTorkoal', returnTo: 'Ember' } }
        ];
        if (s.story.lastLineAsked) return [
          { say: ['Kettering', "Relay from Bo at the Exchange. Ila, west end of the Quarter — she quit when the line died. Then we talk about the Torkoal."] }
        ];
        return [
          { say: ['Kettering', "Line's back. One line. I used to run three.", "Want to make yourself useful? I need a relay from Bo's scrapyard, I need Ila back — she quit when it died — and I need something done about the Torkoal in furnace three."] },
          { set: 'lastLineAsked' }, { quest: { key: 'lastline', status: 'active' } }
        ];
      }
      if (s.story.ferryCrew) return [
        { say: ['Kettering', "Crew's on the Harbor pumps. Tell Rossi he owes me a boat ride."] }
      ];
      if (s.story.ferryAsked) return [
        { say: ['Kettering', "Rossi wants my crew for his pumps? …Fine. You kept my furnace alive. He can have them for a day.", "Tell him: if they come back with so much as a wet boot, the deal's off."] },
        { set: 'ferryCrew' }
      ];
      if (s.story.lineRestored) return [
        { say: ['Kettering', "Line's back. Furnace held. You saw the cable down there, didn't you.", "Runs *down*. Not up to the Tower — down. So who's drawing?"] }
      ];
      if (s.story.blackout) return [
        { say: ['Kettering', "Breaker. Tunnels. Under the Kilns. The furnace cracks in an hour — go!"] }
      ];
      if (s.story.emberHalloran) return EMBER_BLACKOUT;
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
    script: (s) => [
      { if: (st) => st.story.lastLineAsked && !st.story.lastLinePart,
        then: [{ say: ['Bo', "A relay for Kettering's line? Pallet nine, under the tarp. Take it — he's been asking for a year and I've been pretending I didn't hear."] }, { set: 'lastLinePart' }],
        else: [{ say: ['Bo', "Everything off a pallet, till's a coffee tin. Meridian's paying for my new roof, so I'm not complaining. Out loud."] }] }
    ]
  },
  {
    id: 'halloran', name: 'Dr. Halloran', x: 5, y: 3, facing: 'left',
    when: (s) => badges(s) >= 1,
    appearance: { skin: 'olive', hair: 'bob', hairColor: 'ginger', outfit: 'formal' },
    script: (s) => [
      { say: ['Dr. Halloran', "Ines Halloran, Meridian community relations. We fund the Exchange's repairs, sponsor local trainers — the boring good stuff.", "You're the one clearing the League. I know your name. I make a point of it."] },
      { if: (st) => st.story.cargoRow, then: [
        { say: ['Dr. Halloran', "I heard there was an incident at the Harbor yard. Security overreacts. I'll have a word.", "And your friend Dario — a Voss, in the League. I'd like to see that go somewhere."] },
        { set: 'emberHalloran' }
      ] }
    ]
  },
  // STORY.md E2/E3 — Dario, being noticed for the first time; then the pin.
  {
    id: 'darioEmber', name: 'Dario Voss', x: 6, y: 3, facing: 'left',
    when: (s) => s.story.cargoRow && badges(s) >= 1 && !s.story.emberDarioPin,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: (s) => {
      if (s.story.lineRestored) return [
        { say: ['Dario', "Halloran offered me a sponsorship. A real one — funding, gear, the works.", "She said the name Voss like it was worth something. Nobody's ever said it like that.", "I said yes. Don't look at me like that. …Why are you looking at me like that?"] },
        { set: 'emberDarioPin' }
      ];
      if (s.story.blackout) return [
        { say: ['Dario', "Whole Quarter's dark. Kettering's yelling about a breaker. You going down there? …Bet you can't do it faster than I could."] }
      ];
      return [
        { say: ['Dario', "That's Halloran. Meridian. She knows my *name*. Knew it before I said it.", "She's funding the Exchange's roof. Sponsoring trainers. Real money."] },
        { set: 'emberHalloran' }
      ];
    }
  }
];

// STORY.md E3 — the Quarter goes dark mid-conversation.
export const EMBER_BLACKOUT = [
  { say: ['Kettering', "You want to know what the substation's really—"] },
  { call: (scene) => scene.setBlackout?.(true) },
  { flash: 120 },
  { shake: 500 },
  { wait: 400 },
  { say: ['Kettering', "—there it goes. Whole line. That's not a brownout, that's a *cut*.", "Furnace cracks in an hour without the line. The breaker's at the far end of the Boiler Tunnels — under the Kilns, ladder's behind me.", "Go. I'll keep the crew on the furnace."] },
  { set: 'blackout' }
];

export const BOILER_NPCS = [
  {
    id: 'ila', name: 'Ila', x: 2, y: 8, facing: 'down',
    when: (s) => !s.story.boilerIla,
    appearance: { skin: 'bronze', hair: 'ponytail', hairColor: 'black', outfit: 'sporty' },
    script: () => [
      { say: ['Ila', "Off shift, lights out, nothing to do. You want past? Earn it."] },
      { battle: { trainerKey: 'millIla', returnTo: 'Boiler' } }
    ]
  },
  {
    id: 'dev', name: 'Dev', x: 2, y: 4, facing: 'down',
    when: (s) => !s.story.boilerDev,
    appearance: { skin: 'black', hair: 'buzzcut', hairColor: 'black', outfit: 'explorer' },
    script: () => [
      { say: ['Dev', "Ila let you through? She's going soft. I'm not."] },
      { battle: { trainerKey: 'millDev', returnTo: 'Boiler' } }
    ]
  }
];

// The breaker at the tunnel's end — and the first sight of where the
// substation's trunk cable actually goes.
export const BOILER_BREAKER = [
  { say: ['', "The breaker panel. Every switch is down — thrown, not tripped."] },
  { call: (scene) => scene.throwBreaker?.() },
  { flash: 150 },
  { shake: 300 },
  { say: ['', "The line hums back to life.", "Behind the panel a trunk cable as thick as your arm runs on — *down* — through a door with a Meridian keycard reader. The reader blinks red."] },
  { set: 'lineRestored' },
  { call: (scene) => { Object.assign(scene.spawn(), {}); goToScene(scene, 'Ember', { toastMsg: "The Quarter's lights come back on, block by block." }); } }
];

export const BOILER_STONE = [
  { say: ['', "Wedged behind a cold pipe: a stone with a jagged steel-grey core. An Aggronite!"] },
  { give: { item: 'aggronite' } },
  { set: 'aggroniteFound' }
];

export const GREENLINE_NPCS = [
  // STORY.md G2 — Priya's samples, and the Absol before every storm.
  {
    id: 'priyaGreen', name: 'Priya', x: 4, y: 3, facing: 'down',
    when: (s) => badges(s) >= 2,
    appearance: { skin: 'amber', hair: 'braid', hairColor: 'black', outfit: 'casual' },
    script: (s) => {
      // SIDEQUESTS.md #5 — the Allotments' regulars want a match.
      if (s.story.stormSeen && !s.story.orchardOsei) {
        if (s.story.orchardPip) return [{ say: ['Priya', "Grandma Osei. Everyone here knows she's the strongest trainer in the district. Except her."] }, { battle: { trainerKey: 'osei', returnTo: 'Greenline' } }];
        if (s.story.orchardTomas) return [{ say: ['Priya', "Pip's next. Pip is eight. Do not go easy on Pip — Pip will know."] }, { battle: { trainerKey: 'pip', returnTo: 'Greenline' } }];
        if (s.story.orchardAsked) return [{ say: ['Priya', "Tomas first. He's been talking about his Sewaddle all week."] }, { battle: { trainerKey: 'tomas', returnTo: 'Greenline' } }];
        return [
          { say: ['Priya', "Oh — the Allotments have a bet going. Tomas, Pip and Grandma Osei each think they'd beat you. Osei's the real fight, whatever she says.", "Winner gets whatever Osei found under the old pear tree. She won't say what it is."] },
          { set: 'orchardAsked' }, { quest: { key: 'orchard', status: 'active' } }
        ];
      }
      if (s.story.orchardOsei && !s.story.orchardDone) return [
        { say: ['Priya', "You beat *Grandma Osei*. Nobody beats Grandma Osei. Here — she says it's yours."] },
        { give: { item: 'heracronite' } }, { say: ['', 'Received the Heracronite!'] },
        { set: 'orchardDone' }, { quest: { key: 'orchard', status: 'done' } }
      ];
      if (s.story.stormSeen) return [
        { say: ['Priya', "That wasn't a wild Pokémon. It looked at you. It *waited* for you.", "That was a message. I just don't know who from yet."] }
      ];
      if (s.story.priyaSamples) return [
        { say: ['Priya', "Talk to Sato at the Overlook. He's seen it too. And watch the edge when the sky goes green."] }
      ];
      return [
        { say: ['Priya', "The Allotments! Everyone's growing tomatoes and arguing about them. I love it here.", "Okay — the ferns by the pump intake. I took cuttings. They're *twice* the size they should be and the soil can't explain it.", "And there's this: a white Pokémon with a curved horn has been seen on the Overlook before every storm this year. An Absol. The disaster Pokémon.", "Sato's seen it. He says it looks at the Outskirts. Then it looks *down*."] },
        { set: 'priyaSamples' }
      ];
    }
  },
  {
    id: 'sato', name: 'Old Sato', x: 7, y: 5, facing: 'left',
    appearance: { skin: 'amber', hair: 'none', hairColor: 'white', outfit: 'explorer' },
    script: (s) => {
      // SIDEQUESTS.md #4 — What Grows There.
      if (s.story.stormSeen && !s.story.growsDone) {
        if (s.story.fern3) return [
          { say: ['Old Sato', "Three cuttings. Look at the stems — they're *warm*. Priya's girl will have a field day.", "Here. It was in the intake filter the first year. Didn't know what it was. Still don't. It's yours."] },
          { give: { item: 'gardevoirite' } }, { say: ['', 'Received the Gardevoirite!'] },
          { set: 'growsDone' }, { quest: { key: 'grows', status: 'done' } }
        ];
        if (s.story.growsAsked) return [{ say: ['Old Sato', "Kess is at the Irrigation Works. She'll pretend she doesn't know which ferns. She knows."] }];
        return [
          { say: ['Old Sato', "You want to know what grows there? Then bring me three cuttings from the ferns by the intake. Priya's girl wants them for her samples.", "Careful. The things living in that bed grew the same way the ferns did."] },
          { set: 'growsAsked' }, { quest: { key: 'grows', status: 'active' } }
        ];
      }
      if (s.story.stormSeen) return [
        { say: ['Old Sato', "It's never come that close before. It's never looked at anyone but me.", "Whatever it's waiting for — I think it's decided it's you."] }
      ];
      if (s.story.priyaSamples) return GREENLINE_STORM;
      return [
        { say: ['Old Sato', "The Overlook. From this bench you can watch the storms gather over the Outskirts before anyone down there knows it's raining.", "Planted every terrace here. Forty years. Stopped planting near the pump.", "Nobody asked why, so I stopped saying."] }
      ];
    }
  },
  {
    id: 'kess', name: 'Dr. Kess', x: 1, y: 3, facing: 'right',
    appearance: { skin: 'light', hair: 'pixie', hairColor: 'blonde', outfit: 'formal' },
    script: (s) => {
      if (s.story.growsAsked && !s.story.fern3) {
        const n = s.story.fern2 ? 3 : s.story.fern1 ? 2 : 1;
        return [
          { say: ['Dr. Kess', n === 1 ? "Cuttings. From *those* ferns. …Fine. The bed's right there. Something's living in it." : n === 2 ? "Another? The bigger one's further in. It's — it's bigger than it should be." : "The last one's right at the pipe. I've never gone that close. Nobody has."] },
          { battle: { trainerKey: `fern${n}`, returnTo: 'Greenline' } }
        ];
      }
      return [
        { say: ['Dr. Kess', "Meridian Irrigation Works. The intake feeds every terrace. Deep aquifer — mineral-rich, hence the warmth. Perfectly ordinary hydrology.", "…The ferns by the pipe? Twice the size, yes. I'm a hydrologist. Plants aren't my department."] }
      ];
    }
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

// STORY.md G3 — the storm on the Overlook. The game's first weather
// cutscene: the sky goes dark, lightning over the Outskirts, and the Absol
// on the terrace edge, watching the player. Scene hooks (GreenlineScene):
// stormStart/stormEnd (the tint), showAbsol/hideAbsol (a real sprite).
export const GREENLINE_STORM = [
  { say: ['Old Sato', "Priya's girl told you about the white one. Good. Then you'll want to see this.", "Sky's going green. Watch the edge."] },
  { call: (scene) => scene.stormStart?.() },
  { wait: 600 },
  { flash: 90 },
  { shake: 250 },
  { wait: 500 },
  { flash: 140 },
  { shake: 400 },
  { call: (scene) => scene.showAbsol?.() },
  { pan: { x: 0, y: 0, ms: 700, toEdge: true } },
  { wait: 1400 },
  { say: ['', "On the terrace edge, rain sheeting off its horn: an Absol. It looks at the Outskirts far below. Then it looks down — through the terraces, through the Quarter, through the harbor — at something under all of it.", "Then it looks at you."] },
  { flash: 120 },
  { call: (scene) => scene.hideAbsol?.() },
  { wait: 500 },
  { call: (scene) => scene.stormEnd?.() },
  { say: ['Old Sato', "…Forty years. It's never come that close.", "It wasn't looking at the storm, child. It was looking at *you*."] },
  { set: 'stormSeen' }
];

// STORY.md K1–K4 / MEGA.md — the Key Stone. After Badge 3, the Absol from
// the storm waits at the keycard door behind the Boiler Tunnels' breaker
// with an eighteen-year-old Meridian keycard in its mouth. Behind the
// door: the original excavation's cache and E. Voss's locker.
export const KEYSTONE_BEAT = [
  { say: ['', "The Absol from the Overlook is waiting at the keycard door. Something's in its mouth — a keycard, eighteen years old. MERIDIAN DYNAMICS · FIELD ENGINEERING."] },
  { call: (scene) => scene.openDoor?.() },
  { flash: 150 },
  { shake: 300 },
  { say: ['', "The reader blinks green. The door grinds open onto the old lines — and, just inside, a supply cache from the original excavation. Crates. A cold kettle. A field engineer's locker.", "The name plate on the locker: E. VOSS."] },
  { say: ['Note', "\"If you're reading this, it sent you. It only brings people it trusts.\"", "\"Take the stone. Learn what it does. Then come find me. — E.V.\""] },
  { say: ['', "Inside the locker: a Key Stone on a cord, and a stone with a black-and-white core. An Absolite.", "The Absol looks at you. It doesn't move. It's decided."] },
  { call: () => grantKeyStone() },
  { if: (s) => s.story.absolToBox,
    then: [{ say: ['', "You received the Key Stone! Absol joined you, holding the Absolite — it was sent to your PC Box (party's full)."] }],
    else: [{ say: ['', "You received the Key Stone! Absol joined your party, holding the Absolite."] }] },
  { say: ['Mabosso (call)', "…Alma called me. Said you'd gone under the Quarter and come back with something on a cord. A Key Stone. Then listen, because I was there.", "Meridian's division called it deep resonance. It's the energy Mega Stones are made of. A Key Stone lets a trainer's bond reach a Pokémon holding its own stone — and the Pokémon changes, past its natural form, for as long as the battle lasts.", "Then it comes back. That's the part that matters. It comes *back*.", "E. Voss was the engineer who ordered the drill stopped, eighteen years ago. She was blamed when it wasn't. I signed nothing and I left. I have never told Dario. Please — not yet.", "In battle, when your Absol's out and holding that stone, you'll see the Mega button light. Use it. And be careful who sees you use it."] },
  { set: 'mabossoExplained' }
];

export const SIGNAL_NPCS = [
  // STORY.md S1 — Prism's assistant; the data doesn't make sense.
  {
    id: 'juno', name: 'Juno', x: 5, y: 3, facing: 'left',
    appearance: { skin: 'olive', hair: 'pixie', hairColor: 'blue', outfit: 'sporty' },
    script: (s) => {
      if (s.story.pulseDecoded) return [
        { say: ['Juno', "A pulse. Prism's been staring at the waveform for an hour without blinking. That's — for Prism that's basically screaming."] }
      ];
      if (s.story.signalJuno) return [
        { say: ['Juno', "The data centre door's badge-tapped, but Marchetti lets Prism's people through. Tell him I sent you. He'll sigh. That's a yes."] }
      ];
      return [
        { say: ['Juno', "You're the challenger? Prism's… busy. Not gym busy. *Lab* busy.", "The storms have an electrical signature that matches nothing in the record. Not weather, not the grid. Prism doesn't care about Meridian. Prism cares that the numbers don't make sense.", "We need the raw feed from the data centre's risers. I used to work there. I'd rather not go back in. Would you?"] },
        { set: 'signalJuno' }
      ];
    }
  },
  {
    id: 'marchetti', name: 'Marchetti', x: 2, y: 1, facing: 'left',
    appearance: { skin: 'light', hair: 'buzzcut', hairColor: 'dark_brown', outfit: 'formal' },
    script: (s) => [
      { if: (st) => st.story.signalJuno && !st.story.pulseDecoded,
        then: [{ say: ['Marchetti', "Juno sent you. *Sigh.* The risers are through here. Don't touch the trunk fibre, don't ask me about power draw, and if anyone asks, you're a contractor."] }],
        else: [{ say: ['Marchetti', "Meridian Data Centre. Badge-tapped. And no, I don't know what the power draw is for. I'd like everyone to stop asking."] }] }
    ]
  },
  {
    id: 'ashren', name: 'Ash & Ren', x: 5, y: 1, facing: 'left',
    appearance: { skin: 'amber', hair: 'bob', hairColor: 'ginger', outfit: 'casual' },
    script: () => [
      { say: ['Ash', "Welcome to the Relay—"] },
      { say: ['Ren', "—where we sell everything that hums—"] },
      { say: ['Ash', "—and some things that shouldn't. Shop's right there."] },
      { call: (scene) => scene.scene.launch('Mart') }
    ]
  },
  {
    id: 'talia', name: 'Busker Talia', x: 6, y: 5, facing: 'right',
    appearance: { skin: 'brown', hair: 'long', hairColor: 'purple', outfit: 'casual' },
    script: (s) => {
      if (s.story.songDone) return [{ say: ['Talia', "♪ *Eleven seconds, then it turns; the city holds its breath and learns…* ♪", "Finished. It only took a heartbeat."] }];
      if (s.story.song3) return [
        { say: ['Talia', "Three points. Play them together — there. *There.* It's a bar of eleven. It repeats. It's been repeating the whole time.", "I couldn't finish it because it isn't finished. It's *waiting*.", "Here. A kid in the Outskirts traded me this for a song, years ago. It's been in my case ever since. You'll know what to do with it."] },
        { give: { item: 'alakazite' } }, { say: ['', 'Received the Alakazite!'] },
        { set: 'songDone' }, { quest: { key: 'song', status: 'done' } }
      ];
      if (s.story.songAsked) return [{ say: ['Talia', "Antenna Farm, the terminal in the Risers, and the bridge — where the wind is. Stand there and listen. That's all recording is."] }];
      return [
        { say: ['Talia', "♪ *Followed the thunder up the stairs, and the thunder had a tune…* ♪", "I can hear it up here. In the storms. A melody, almost. I've been trying to write it down for a month and I can't finish it.", "Would you listen for me? Three places where it's loudest: the Antenna Farm, the terminal in the Risers, the bridge. Just stand there. Listen."] },
        { set: 'songAsked' }, { quest: { key: 'song', status: 'active' } }
      ];
    }
  },
  // STORY.md S3 — rival battle 3, sponsored.
  {
    id: 'darioSignal', name: 'Dario Voss', x: 5, y: 5, facing: 'down',
    when: (s) => s.story.pulseDecoded && !s.story.signalDario,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: (s) => [
      { say: ['Dario', "There you are. New coat, new team, new *everything* — Meridian doesn't do things by halves.", "Halloran says the League's watching me now. Me. A Voss."] },
      { if: (st) => st.hasKeyStone,
        then: [{ say: ['Dario', "…What's that on your wrist. That's not a badge.", "Doesn't matter. Bet it doesn't help."] }],
        else: [{ say: ['Dario', "Bet your team's not ready for mine. Not this one."] }] },
      { battle: { trainerKey: 'darioSignal', returnTo: 'Signal' } }
    ]
  },
  {
    id: 'halloranSignal', name: 'Dr. Halloran', x: 6, y: 6, facing: 'up',
    when: (s) => s.story.pulseDecoded && !s.story.signalDario,
    appearance: { skin: 'olive', hair: 'bob', hairColor: 'ginger', outfit: 'formal' },
    script: () => [
      { say: ['Dr. Halloran', "I'm just here to watch. He asked me to. He's never asked anyone to watch him before — did you know that?"] }
    ]
  }
];

export const RISERS_NPCS = [
  {
    id: 'oduya', name: 'Oduya', x: 2, y: 6, facing: 'down',
    when: (s) => !s.story.risersOduya,
    appearance: { skin: 'black', hair: 'braid', hairColor: 'black', outfit: 'formal' },
    script: () => [
      { say: ['Oduya', "Contractor? You're not a contractor. Nobody's a contractor. Fine — you want up, you go through me."] },
      { battle: { trainerKey: 'techOduya', returnTo: 'Risers' } }
    ]
  },
  {
    id: 'brann', name: 'Brann', x: 2, y: 3, facing: 'down',
    when: (s) => !s.story.risersBrann,
    appearance: { skin: 'light', hair: 'ponytail', hairColor: 'blonde', outfit: 'formal' },
    script: () => [
      { say: ['Brann', "Oduya let you past. She owes me lunch. You owe me a battle."] },
      { battle: { trainerKey: 'techBrann', returnTo: 'Risers' } }
    ]
  },
  {
    id: 'priyaRisers', name: 'Priya', x: 1, y: 0, facing: 'right',
    when: (s) => !s.story.pulseDecoded,
    appearance: { skin: 'amber', hair: 'braid', hairColor: 'black', outfit: 'casual' },
    script: () => [{ say: ['Priya', "We got in through the roof. Don't ask. Step up to the terminal — Prism's ready."] }]
  },
  {
    id: 'prismRisers', name: 'Prism', x: 3, y: 0, facing: 'left',
    when: (s) => !s.story.pulseDecoded,
    appearance: { skin: 'taupe', hair: 'pixie', hairColor: 'white', outfit: 'formal' },
    script: () => [{ say: ['Prism', "Terminal. Feed. Now, please. I've been wrong about something for a month and I'd like to know what."] }]
  }
];

// STORY.md S2 — the storm signature, cleaned up.
export const RISERS_TERMINAL = [
  { say: ['Prism', "Raw feed's up. Every storm this year, stacked. Strip the grid noise, strip the weather… there."] },
  { flash: 100 },
  { wait: 400 },
  { say: ['Priya', "It's… regular. Slow. Every eleven seconds, exactly.", "Weather isn't *regular*."] },
  { say: ['Prism', "No. It isn't.", "That's not weather. That's a *pulse*."] },
  { shake: 400 },
  { say: ['Priya', "Something under the city has a heartbeat, and Meridian is running a cable to it.", "…Prism. Are you okay?"] },
  { say: ['Prism', "I'm *fascinated*. Come to the Tower when you're ready. I want to see what you do with this."] },
  { set: 'pulseDecoded' },
  { call: (scene) => { scene.spawn(); goToScene(scene, 'Signal', { toastMsg: 'Prism will be waiting at Signal Tower.' }); } }
];

export const OLDLINES_NPCS = [
  {
    id: 'nyx', name: 'Nyx', x: 2, y: 8, facing: 'down',
    when: (s) => !s.story.oldlinesNyx,
    appearance: { skin: 'taupe', hair: 'long', hairColor: 'black', outfit: 'explorer' },
    script: () => [
      { say: ['Nyx', "Up-top. You came down the wet stair. Nobody comes down the wet stair.", "You can pass. After."] },
      { battle: { trainerKey: 'dwellerNyx', returnTo: 'OldLines' } }
    ]
  },
  {
    id: 'cass', name: 'Cass', x: 2, y: 4, facing: 'down',
    when: (s) => !s.story.oldlinesCass,
    appearance: { skin: 'brown', hair: 'buzzcut', hairColor: 'black', outfit: 'explorer' },
    script: () => [
      { say: ['Cass', "Nyx let you through. She never lets anyone through. …Show me why."] },
      { battle: { trainerKey: 'dwellerCass', returnTo: 'OldLines' } }
    ]
  }
];

export const OLDLINES_SHRINE = [
  { say: ['', "A shrine in the alcove: a folded blanket, a cold kettle, and chalk marks on the wall — tallies, in groups of twelve. Eighteen groups.", "Tucked under the blanket: a stone with a smouldering black core. A Houndoominite."] },
  { give: { item: 'houndoominite' } },
  { set: 'houndoominiteFound' }
];

export const UNDERCITY_NPCS = [
  {
    id: 'halvard', name: 'Halvard', x: 2, y: 1, facing: 'left',
    appearance: { skin: 'light', hair: 'long', hairColor: 'white', outfit: 'formal' },
    script: (s) => [
      { say: ['Halvard', "Station master. Was. The lines ran through here — Harbor to the Tower in eleven minutes. Then they built over us and forgot.", "I mark the years in chalk. Someone should."] },
      { if: (st) => st.story.houndoominiteFound, then: [
        { say: ['Halvard', "You found one of her shrines. The Warden's. She leaves them where she's slept. Eighteen years of them, all the way down."] }
      ] }
    ]
  },
  {
    id: 'kestrel', name: 'Kestrel', x: 3, y: 1, facing: 'right',
    appearance: { skin: 'amber', hair: 'pixie', hairColor: 'gray', outfit: 'casual' },
    script: () => [
      { say: ['Kestrel', "Kestrel's Post. I know every rumour down here and sell about half of them. The other half's free: don't go past the Vault unless she sends for you.", "Shop's open. Everything's second-hand and most of it works."] },
      { call: (scene) => scene.scene.launch('Mart') }
    ]
  },
  // STORY.md U3 — the Warden. Present only once Obsidian has sent word.
  {
    id: 'elena', name: 'The Warden', x: 7, y: 5, facing: 'up',
    when: (s) => s.leagueBeaten[4] && !s.story.act2Close,
    appearance: { skin: 'light', hair: 'long', hairColor: 'gray', outfit: 'explorer' },
    script: (s) => WARDEN_BEAT
  }
];

// STORY.md U2 — Obsidian, after the badge, hands over the Gengarite and
// says the Warden's name for the first time.
export const OBSIDIAN_AFTER = [
  { say: ['Obsidian', "Five badges. Fine. You'll want this — you'll need it down there.", "It came up from below, years ago, in a kettle. I didn't ask."] },
  { give: { item: 'gengarite' } },
  { say: ['', "Received the Gengarite!"] },
  { say: ['Obsidian', "There's someone past the Vault. Been down here longer than the lines have been dark. We call her the Warden. She keeps the deep tunnels *quiet* — you've noticed they're quiet?", "She's asked for you. By name. I'd go."] },
  { set: 'gengariteGiven' }
];

// STORY.md U3 — the truth, and Act 2's close.
export const WARDEN_BEAT = [
  { say: ['The Warden', "You have my Absol. And my stone. Then it chose right, and I can stop waiting.", "My name is Elena Voss. I was the field engineer on Meridian's excavation, eighteen years ago. I'm the one the record blames."] },
  { say: ['Elena', "We hit a seam of something the division called deep resonance. I ordered the drill stopped. I was overruled. The seam vented, and a wild Pokémon in the zone — a Grass-type, small, ordinary — was caught in it.", "It didn't die. It *changed*. The way your Absol changes when you hold that stone — except nobody was holding anything. No bond. No way back.", "They sealed the tunnels and called it a write-off. I came down a year later because I couldn't leave it alone in the dark. I've been here since. I keep it calm. That's all a person can do."] },
  { say: ['Elena', "The storms are it, growing. Not anger. *Pain.* And that pulse your friend found — that's its heart.", "And now Meridian is running power to it. I can hear the rig through the rock. If it wakes fully—"] },
  { set: 'wardenMet' },
  { choice: { name: 'Elena', prompt: "…My son. Dario. Is he—", options: [
    { label: "He's alright. He's angry.", then: [{ say: ['Elena', "Good. Angry means he's still standing."] }] },
    { label: "Meridian's sponsoring him.", then: [{ say: ['Elena', "…Of course they are. Of course they are."] }] }
  ] } },
  { shake: 900 },
  { flash: 200 },
  { say: ['Elena', "That's the rig. First stage. They've started.", "Go up. Find whoever's doing this and stop them. And bring my son — if he'll come."] },
  { set: 'act2Close' }
];

export const SPRAWL_NPCS = [
  // STORY.md SP1 — the contract, and the truth he won't hear.
  {
    id: 'darioSprawl', name: 'Dario Voss', x: 2, y: 1, facing: 'left',
    when: (s) => s.story.act2Close && !s.story.sprawlDario,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: () => [
      { say: ['Dario', "Halloran's office. I'm signing the long one today — five years. Meridian funds a public review of the Incident. They clear the Voss name. *Publicly.*", "Eighteen years of people saying my mother was careless, and it ends with a press release. I'd sign it in blood."] },
      { choice: { name: 'Dario', prompt: "…Why are you looking at me like that. Say it.", options: [
        { label: "Your mother is alive. She's under the city.", then: [
          { say: ['Dario', "…That's not funny.", "That's not — she *left*. She left us. Everyone knows she left. You don't get to walk in here with a Key Stone and a story and—"] }
        ] },
        { label: "Meridian blamed her for something they did.", then: [
          { say: ['Dario', "You think I don't know what they said about her? I've read every line of it.", "And now they're the ones offering to *un*-say it. You want me to turn that down? On your word?"] }
        ] }
      ] } },
      { say: ['Dario', "Fine. You want to be right about my family? *Earn it.*"] },
      { battle: { trainerKey: 'darioSprawl', returnTo: 'Sprawl' } }
    ]
  },
  // STORY.md SP2 — Halloran, alone, and the badge.
  {
    id: 'halloranSprawl', name: 'Dr. Halloran', x: 1, y: 2, facing: 'up',
    when: (s) => s.story.act2Close && !s.story.towerBadge,
    appearance: { skin: 'olive', hair: 'bob', hairColor: 'ginger', outfit: 'formal' },
    script: (s) => {
      if (!s.story.sprawlDario) return [
        { say: ['Dr. Halloran', "He's inside. Signing. I've never seen him this happy — I'd like to keep it that way, if you're about to say something."] }
      ];
      return [
        { say: ['Dr. Halloran', "He walked out. Past me. Didn't sign. Didn't *look* at me.", "What did you tell him?"] },
        { choice: { name: 'Dr. Halloran', prompt: "What did you tell him?", options: [
          { label: "That his mother is alive, under the city.", then: [
            { say: ['Dr. Halloran', "…", "The review I offered him. It was real. I wrote it. I believed it.", "I didn't know. I want you to understand that I didn't *know*."] }
          ] },
          { label: "What Meridian is actually digging for.", then: [
            { say: ['Dr. Halloran', "I run community relations. I fund roofs. I—", "I didn't know. Do you understand? Nobody on my side of the building *knows*."] }
          ] }
        ] } },
        { say: ['Dr. Halloran', "Here. It's mine. Tower access, all floors. Don't ask me why I'm giving it to you, because I don't have an answer yet."] },
        { say: ['', "Received the Meridian Tower access badge!"] },
        { set: 'towerBadge' }
      ];
    }
  },
  // SIDEQUESTS.md #9 — Sloane's offer. Declining is the reward.
  {
    id: 'sloane', name: 'Sloane', x: 5, y: 3, facing: 'left',
    appearance: { skin: 'light', hair: 'ponytail', hairColor: 'blonde', outfit: 'formal' },
    script: (s) => {
      if (s.story.sloaneDecided) return [
        { say: ['Sloane', "The offer stands, for what it's worth. They always do. That's rather the point of them."] }
      ];
      return [
        { say: ['Sloane', "Sloane. Meridian talent. Five badges, a Key Stone, and the Voss boy trailing after you — you're the most interesting trainer in the stack, and I'd like to make you the best-funded one.", "Sponsorship. Gear, funding, a name that opens the doors that are currently closing in your face. Same deal Dario has. Better, honestly."] },
        { quest: { key: 'sponsored', status: 'active' } },
        { choice: { name: 'Sloane', prompt: "So. Shall I draw up the paperwork?", options: [
          { label: "No.", then: [{ say: ['Sloane', "…No. Just like that. Well.", "You'd be surprised how few people say it that quickly. I'll note it."] }] },
          { label: "I'm not for sale.", then: [{ say: ['Sloane', "Everyone's for sale; the interesting ones just have a higher price. I'll note yours as 'undisclosed'."] }] }
        ] } },
        { set: 'sloaneDecided' },
        { quest: { key: 'sponsored', status: 'done' } }
      ];
    }
  },
  {
    id: 'jae', name: 'Jae', x: 6, y: 1, facing: 'right',
    when: (s) => !s.story.sprawlJae,
    appearance: { skin: 'brown', hair: 'bob', hairColor: 'blue', outfit: 'sporty' },
    script: () => [
      { say: ['Jae', "Rooftop's mine — best view of the Tower in the Sprawl. You want it, you battle for it. House rules."] },
      { battle: { trainerKey: 'residentJae', returnTo: 'Sprawl' } }
    ]
  },
  {
    id: 'oyelaran', name: 'Mrs. Oyelaran', x: 3, y: 5, facing: 'down',
    appearance: { skin: 'black', hair: 'bob', hairColor: 'gray', outfit: 'casual' },
    script: () => [
      { say: ['Mrs. Oyelaran', "Building manager, forty years. Meridian's the landlord. Rent's fair, lifts work, heating's on. People up top say the company's up to something — down here it's just the name on the cheque.", "That's not a defence. It's just what it looks like from a kitchen window."] }
    ]
  }
];

export const TOWER_NPCS = [
  {
    id: 'rask', name: 'Rask', x: 2, y: 8, facing: 'down',
    when: (s) => !s.story.towerRask,
    appearance: { skin: 'bronze', hair: 'buzzcut', hairColor: 'black', outfit: 'formal' },
    script: () => [
      { say: ['Rask', "Site Security. That's a real badge — Dr. Halloran's, in fact. Which means I have to ask why you have it, and I'd rather not.", "Restricted floors. I'm going to have to ask you to leave. …After."] },
      { battle: { trainerKey: 'secRask', returnTo: 'Tower' } }
    ]
  },
  {
    id: 'marlowe', name: 'Marlowe', x: 2, y: 4, facing: 'down',
    when: (s) => !s.story.towerMarlowe,
    appearance: { skin: 'light', hair: 'buzzcut', hairColor: 'gray', outfit: 'formal' },
    script: () => [
      { say: ['Marlowe', "Executive floor. You're not on the calendar. I apologise in advance for winning — it's nothing personal, it's quarterly."] },
      { battle: { trainerKey: 'execMarlowe', returnTo: 'Tower' } }
    ]
  },
  {
    id: 'amara', name: 'Amara', x: 1, y: 1, facing: 'right',
    appearance: { skin: 'black', hair: 'braid', hairColor: 'black', outfit: 'formal' },
    script: (s) => {
      if (s.story.ending) return [{ say: ['Amara', "He resigned this morning. Wrote it himself, by hand. The fragment's gone from the desk.", "I've worked for him nine years. I think that's the first honest thing I've watched him do."] }];
      if (s.story.rigActivated) return [{ say: ['Amara', "The freight core's through his office. It goes all the way down. He had it built that way.", "Go. I'll keep the floor clear."] }];
      if (s.vanceBeaten) return [{ say: ['Amara', "…He's still in there."] }];
      return [{ say: ['Amara', "He's expecting you. He's been expecting you for about three districts.", "Go in. I'm not going to stop you, and I want you to notice that I'm not."] }];
    }
  }
];

// STORY.md T2 — the conversation. Not a reveal; an argument.
export const VANCE_TALK = [
  { say: ['Vance', "Sit, if you like. You won't. Nobody does.", "I know who you are. Five badges, Halloran's badge, and the Voss woman's Key Stone — yes, I know where you got it. I've known where she was for eleven years."] },
  { if: (s) => s.hasKeyStone, then: [
    { say: ['', "On the desk: a drill-bit fragment, resonance-scarred. It glows, faintly, the closer your Key Stone gets."] }
  ] },
  { say: ['Vance', "That's from the original bore. The day the division stopped drilling because one engineer lost her nerve.", "Eighteen years. Half this city stacked in the dark under the other half, because a company got frightened of the only thing that could have ended the divide. I've spent my career on one idea: they gave up too soon.", "The rig finishes what they started. Harness it — *safely*, this time — and the storms stop, the grid's free, and nobody stacks under anybody again. I think about the people at the bottom of this city every day. Do you believe that?"] },
  { choice: { name: 'Vance', prompt: "Well?", options: [
    { label: "It's not a what. It's a who.", then: [
      { say: ['Vance', "…What.", "No. Listen to me. It's a *what*. It's an energy event with a shape. Sentiment is exactly the mistake she made."] }
    ] },
    { label: "You can't harness a person.", then: [
      { say: ['Vance', "A *person*. …Eighteen years of data and you've decided it's a person.", "That's the word she used. In the last report she ever filed."] }
    ] }
  ] } },
  { say: ['Vance', "Then we disagree, and there's a way to settle that in this region."] },
  { set: 'vanceTalked' },
  { battle: { kind: 'vance', returnTo: 'Tower' } }
];

// STORY.md T3 — losing doesn't stop a man with a rig and a conviction.
export const TOWER_RIG = [
  { say: ['Vance', "Well argued. Genuinely.", "It changes nothing. The sequence is on the desk; it always was."] },
  { call: (scene) => scene.rigFlash?.() },
  { flash: 500 },
  { shake: 800 },
  { say: ['', "The Tower's windows go white. Far below, every district's lights stutter at once."] },
  { say: ['Vance', "If you're right about it — then go and be right. The freight core's through that door. It goes all the way down.", "I'll be here when the lights come back."] },
  { set: 'rigActivated' }
];

export const UNDERLIGHT_NPCS = [
  // STORY.md V2 — Dario found her. The scene is short because there's no time.
  {
    id: 'darioUnder', name: 'Dario Voss', x: 3, y: 4, facing: 'down',
    when: (s) => !s.story.underlightDario,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: () => [
      { say: ['Dario', "…You were right. I found her. She's at the controls with your friend — she looked at me for about one second and said \"later.\"", "*Later.* Eighteen years and I get *later*."] },
      { say: ['Elena', "Later, Dario. I mean it. It's waking up."] },
      { say: ['Dario', "…Yeah.", "No pin. Threw it in the core on the way down. Halloran gave me a stone though — turns out she meant it.", "Bet you can't do this without me."] },
      { call: (scene) => scene.showDarioMega?.() },
      { flash: 200 },
      { say: ['', "Dario's Lucario Mega Evolves. He doesn't look at it — he's looking at his mother."] },
      { set: 'underlightDario' }
    ]
  },
  {
    id: 'darioUnderAfter', name: 'Dario Voss', x: 1, y: 3, facing: 'right',
    when: (s) => s.story.underlightDario && !s.story.ending,
    appearance: { skin: 'taupe', hair: 'afro', hairColor: 'black', outfit: 'trainer' },
    script: () => [{ say: ['Dario', "I'll hold the rig's guards. You hold *that*. Go."] }]
  },
  {
    id: 'priyaUnder', name: 'Priya', x: 4, y: 2, facing: 'left',
    when: (s) => !s.story.ending,
    appearance: { skin: 'amber', hair: 'braid', hairColor: 'black', outfit: 'casual' },
    script: () => [{ say: ['Priya', "I've got the controls. Eleven seconds — it's faster now. Nine. Whatever you're going to do, do it before it's five."] }]
  },
  {
    id: 'elenaUnder', name: 'Elena', x: 2, y: 2, facing: 'right',
    when: (s) => !s.story.ending,
    appearance: { skin: 'light', hair: 'long', hairColor: 'gray', outfit: 'explorer' },
    script: () => [{ say: ['Elena', "The rig is *driving* it. Every second it runs, it hurts more, and it hits harder. Hold it until Priya can cut the feed. Don't try to win. Hold."] }]
  }
];

// STORY.md V3 — the battle is stopping the rig.
export const UNDERLIGHT_RIG = [
  { say: ['Priya', "Cutting the feed — it's fighting me. Thirty seconds. Keep it off the rig!"] },
  { say: ['Elena', "Here it comes. Hold it."] },
  { shake: 600 },
  { battle: { kind: 'verdanyx', returnTo: 'Underlight' } }
];

// STORY.md V4 — the revert. Not defeated. Held.
export const ENDING = [
  { say: ['Priya', "Feed's cut! Rig's — the rig's *dead*, it's—"] },
  { call: (scene) => scene.rigDies?.() },
  { shake: 900 },
  { flash: 300 },
  { say: ['', "The rig's hum drops out. What's left in the chamber is exhausted, enormous, and still transformed — a Pokémon that has been mid-change for eighteen years with nothing to change back to."] },
  { say: ['Elena', "Your Key Stone. Give it here — quickly.", "A Mega comes back because someone's holding the other end. It's never had anyone holding the other end. It's had me. That'll have to do."] },
  { call: (scene) => scene.revertStart?.() },
  { flash: 150 }, { wait: 300 }, { flash: 150 }, { wait: 300 }, { flash: 400 },
  { call: (scene) => scene.revertEnd?.() },
  { wait: 800 },
  { say: ['', "It doesn't become what it was. That's gone. It becomes *still* — a shape that holds, breathing slow, the green in it settling like a storm blowing out.", "Somewhere far above, over the Outskirts, it stops raining."] },
  { say: ['Elena', "…There. There you are.", "Keep the stone. It knows you now."] },
  { say: ['Dario', "Mum.", "…Later?"] },
  { say: ['Elena', "No. Now."] },
  { say: ['', "The truth surfaces: Prism's data, Priya's samples, Halloran's testimony, and Elena Voss — alive, and the only person in Zau who ever told Meridian to stop.", "Director Vance resigns rather than lie about it. It's the one honest thing he does, and he does it by hand.", "The Voss name is cleared by the truth instead of a press release. The ferry runs. Alma gets a phone call from the bottom of the city."] },
  { set: 'ending' },
  { call: (scene) => goToScene(scene, 'Credits') }
];
