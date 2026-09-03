import { spriteIdFor } from './data/spriteIds.js';

const ARTWORK_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Returns an official-artwork sprite URL for a real species name, or null if the
// species has no known Pokédex ID (e.g. Verdanyx, or any future custom mon) —
// callers should fall back to the mon's emoji in that case.
export function spriteUrlFor(speciesName) {
  const id = spriteIdFor(speciesName);
  return id ? `${ARTWORK_BASE}/${id}.png` : null;
}
