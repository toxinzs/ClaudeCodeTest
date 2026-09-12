// 0 = floor/walkable, 1 = wall/blocked
export const HOME_MAP = {
  w: 5, h: 5,
  bg: "#241a2e",
  layout: [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,0,1,1]
  ],
  doorX: 2, doorY: 4,
  decor: [
    {x:1,y:1,emoji:"🛏️"}, {x:3,y:1,emoji:"🖼️"}, {x:1,y:2,emoji:"🪴"}, {x:3,y:2,emoji:"📺"}
  ]
};

// Wild Zone Trail — a straight walkable corridor (walls at x=0/4) the 5
// lineup trainers stand along; see ui/trail.js for placement/progression.
export const TRAIL_MAP = {
  w: 5, h: 12,
  bg: "#141b2c",
  layout: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ]
};

// Zau League — a hub map (same wall shape as TOWN_MAP) with the 5 leaders
// placed around a locked central tower; unlike the Trail, leaders can be
// challenged in any order. See ui/league.js for placement/progression.
export const LEAGUE_MAP = {
  w: 7, h: 7,
  bg: "#171224",
  layout: [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,0,0,0,1,1],
    [1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1]
  ]
};

export const TOWN_MAP = {
  w: 7, h: 7,
  bg: "#101a30",
  layout: [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,0,0,0,1,1],
    [1,0,0,0,0,0,1],
    [1,1,1,0,1,1,1]
  ],
  labX: 5, labY: 1,
  homeX: 1, homeY: 5,
  trailX: 3, trailY: 6,
  harborX: 5, harborY: 5,
  decor: [
    {x:5,y:1,emoji:"🔬",tileKey:"window"}, {x:1,y:5,emoji:"🏠",tileKey:"door"}, {x:3,y:6,emoji:"🌲",tileKey:"tree"},
    {x:5,y:5,emoji:"⚓",tileKey:"water"}
  ]
};

// Harbor District — the one flat district: a shelf of docks ringed by open
// water (blocked tiles render as water). Sub-location coordinates live in
// HarborScene's SPOTS; the design is zau-region/districts/harbor.md.
export const HARBOR_MAP = {
  w: 9, h: 7,
  bg: "#0e1a2a",
  layout: [
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0],  // (8,2): the Harbor Ramp up to the Ember Quarter
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1]
  ],
  rampX: 8, rampY: 2,
  decor: [
    {x:8,y:2,emoji:"🛤️"},                   // Harbor Ramp (to Ember Quarter)
    {x:7,y:1,emoji:"🐠",tileKey:"door"},   // Coral's Reef Gym
    {x:4,y:1,emoji:"🐟",tileKey:"window"}, // Fish Market
    {x:1,y:1,emoji:"📦",tileKey:"wallBrick"}, // Cargo Row
    {x:7,y:4,emoji:"⛵"},                   // Ferry Terminal
    {x:1,y:4,emoji:"🗼"},                   // Lighthouse Point
    {x:4,y:5,emoji:"🌀"}                    // Drowned Stair
  ]
};

// Ember Quarter (stratum 4, zau-region/districts/ember.md) — the first
// stratum that stacks instead of spreading. Brick mill blocks split the
// floor into three haul-roads; the district's exit is the Harbor Ramp at
// the bottom edge, its (locked) way up is the Freight Lift.
export const EMBER_MAP = {
  w: 9, h: 9,
  bg: "#1a0e0a",
  layout: [
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1]
  ],
  rampX: 4, rampY: 7,
  liftX: 7, liftY: 5,
  decor: [
    {x:7,y:1,emoji:"🔥",tileKey:"door"},    // Ashgrave's Foundry Gym
    {x:1,y:1,emoji:"⚡",tileKey:"window"},  // Meridian Substation
    {x:4,y:3,emoji:"🛠️",tileKey:"window"},  // The Scrapyard Exchange
    {x:1,y:5,emoji:"🧱"},                    // The Kilns (Foreman Kettering)
    {x:7,y:5,emoji:"🛗"},                    // The Freight Lift (locked)
    {x:4,y:7,emoji:"🛤️"}                     // The Harbor Ramp (exit)
  ]
};

// Greenline Terraces (stratum 5, zau-region/districts/greenline.md) —
// four garden terraces stepping up the stratum face, each hedge row
// (tree tiles) broken by a single ramp so the walk zigzags upward. The
// exit down is the Freight Lift at the bottom-left; the way up is the
// (locked) Service Stair at the bottom-right.
export const GREENLINE_MAP = {
  w: 9, h: 9,
  bg: "#0a1a0e",
  layout: [
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0],  // (8,5): the terrace edge past the Overlook — where the Absol stands
    [1,1,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1]
  ],
  liftX: 1, liftY: 7,
  edgeX: 8, edgeY: 5,
  decor: [
    {x:7,y:1,emoji:"🌿",tileKey:"door"},    // Thistle's Canopy Gym
    {x:1,y:1,emoji:"🌱",tileKey:"window"},  // The Seed Bank
    {x:1,y:3,emoji:"💧",tileKey:"window"},  // Meridian Irrigation Works
    {x:4,y:3,emoji:"🥕"},                    // The Allotments
    {x:7,y:5,emoji:"🌩️"},                    // The Overlook (Old Sato)
    {x:7,y:7,emoji:"🪜"},                    // The Service Stair (locked)
    {x:1,y:7,emoji:"🛗"}                     // The Freight Lift (exit)
  ]
};

// Boiler Tunnels (STORY.md E3) — the game's first real dungeon: the steam
// tunnels under the Ember Quarter's Kilns, a Trail-style corridor with two
// one-tile chokepoints where the off-shift mill workers stand (rows 8 and
// 4), the breaker at the far end, and a side alcove with the Aggronite.
export const BOILER_MAP = {
  w: 5, h: 12,
  bg: "#120a06",
  layout: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  breakerX: 2, breakerY: 0,
  stoneX: 3, stoneY: 1,
  decor: [
    {x:2,y:0,emoji:"🔌"},   // the breaker panel
    {x:2,y:11,emoji:"🪜"}   // the ladder back up to the Kilns
  ]
};
