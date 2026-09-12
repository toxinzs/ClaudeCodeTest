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
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1]
  ],
  decor: [
    {x:7,y:1,emoji:"🐠",tileKey:"door"},   // Coral's Reef Gym
    {x:4,y:1,emoji:"🐟",tileKey:"window"}, // Fish Market
    {x:1,y:1,emoji:"📦",tileKey:"wallBrick"}, // Cargo Row
    {x:7,y:4,emoji:"⛵"},                   // Ferry Terminal
    {x:1,y:4,emoji:"🗼"},                   // Lighthouse Point
    {x:4,y:5,emoji:"🌀"}                    // Drowned Stair
  ]
};
