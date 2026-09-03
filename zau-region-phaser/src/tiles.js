// CC0 tile art (Kenney's Roguelike/RPG pack, kenney.nl) — see public/tiles/LICENSE.txt.
// A small curated subset, not the full 1700-tile pack: just enough distinct
// tile types to cover the game's current floor/wall/decor vocabulary.
export const TILE_KEYS = [
  'grass', 'dirt', 'water', 'wallStone', 'wallBrick',
  'floorIndoor', 'bush', 'tree', 'door', 'window', 'roof'
];

export function preloadTiles(scene) {
  TILE_KEYS.forEach(key => scene.load.image(key, `tiles/${key}.png`));
}
