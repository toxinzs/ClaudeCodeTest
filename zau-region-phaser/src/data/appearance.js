// Character customization options. Sprite art is a curated subset of the
// Universal LPC Spritesheet Character Generator (CC-BY-SA 3.0 / GPL 3.0,
// per-file credits in CREDITS.md at the repo root) — every sheet here is
// the same 832x1344 "universal animation sheet" layout (13 cols x 21 rows,
// 64x64 frames), so body/hair/outfit layers always line up frame-for-frame.

export const FRAME_SIZE = 64;
export const SHEET_COLS = 13;

// Row index (0-based) of each facing's walk cycle within the universal
// sheet. Column 0 of a row is the standing pose; columns 1-8 are the
// 8-frame walk cycle.
export const WALK_ROW = { up: 8, left: 9, down: 10, right: 11 };
export const WALK_FRAMES = 8;

// zPos mirrors the source generator's own layer-ordering convention —
// lower draws first (further back). Keeps body/legs/torso/hair stacking
// correct regardless of which options a player picks.
export const LAYER_ORDER = ['body', 'legs', 'torso', 'hair'];

export const SKIN_TONES = [
  { id: 'light', label: 'Light' },
  { id: 'amber', label: 'Amber' },
  { id: 'olive', label: 'Olive' },
  { id: 'taupe', label: 'Taupe' },
  { id: 'bronze', label: 'Bronze' },
  { id: 'brown', label: 'Brown' },
  { id: 'black', label: 'Deep' },
];

// Capped at 8 (2 rows of 4 in CharCreateScene's grid) so every category's
// grid is the same fixed height regardless of which tab is open.
export const HAIR_STYLES = [
  { id: 'none', label: 'Bald' },
  { id: 'buzzcut', label: 'Buzzcut' },
  { id: 'bob', label: 'Bob' },
  { id: 'pixie', label: 'Pixie' },
  { id: 'afro', label: 'Afro' },
  { id: 'braid', label: 'Braid' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'long', label: 'Long' },
];

export const HAIR_COLORS = [
  { id: 'black', label: 'Black', swatch: 0x1c1c1c },
  { id: 'dark_brown', label: 'Brown', swatch: 0x4a2f1c },
  { id: 'blonde', label: 'Blonde', swatch: 0xe8d27a },
  { id: 'ginger', label: 'Ginger', swatch: 0xb75c2e },
  { id: 'gray', label: 'Gray', swatch: 0x9a9a9a },
  { id: 'white', label: 'White', swatch: 0xf0f0f0 },
  { id: 'blue', label: 'Blue', swatch: 0x3a5fa0 },
  { id: 'purple', label: 'Purple', swatch: 0x7a4ea0 },
];

export const OUTFITS = [
  { id: 'casual', label: 'Casual' },
  { id: 'explorer', label: 'Explorer' },
  { id: 'trainer', label: 'Trainer Coat' },
  { id: 'sporty', label: 'Sporty' },
  { id: 'formal', label: 'Formal' },
];

export const DEFAULT_APPEARANCE = {
  skin: 'light',
  hair: 'buzzcut',
  hairColor: 'black',
  outfit: 'casual',
};

export function normalizeAppearance(appearance) {
  return { ...DEFAULT_APPEARANCE, ...(appearance || {}) };
}

export function bodyPath(skin) {
  return `character/body/${skin}.png`;
}

export function hairPath(style, color) {
  return `character/hair/${style}/${color}.png`;
}

export function outfitTorsoPath(outfit) {
  return `character/outfits/${outfit}_torso.png`;
}

export function outfitLegsPath(outfit) {
  return `character/outfits/${outfit}_legs.png`;
}
