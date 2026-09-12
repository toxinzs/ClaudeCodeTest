// One colour per type for move-effect bursts and type badges — the real
// games' conventional palette, not invented hues.
export const TYPE_COLORS = {
  Normal: 0xa8a878, Fire: 0xf08030, Water: 0x6890f0, Electric: 0xf8d030, Grass: 0x78c850,
  Ice: 0x98d8d8, Fighting: 0xc03028, Poison: 0xa040a0, Ground: 0xe0c068, Flying: 0xa890f0,
  Psychic: 0xf85888, Bug: 0xa8b820, Rock: 0xb8a038, Ghost: 0x705898, Dragon: 0x7038f8,
  Dark: 0x705848, Steel: 0xb8b8d0, Fairy: 0xee99ac
};
export function typeColor(type) { return TYPE_COLORS[type] ?? 0xffffff; }
