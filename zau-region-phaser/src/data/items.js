// Real item roster — catch multipliers and heal amounts match official
// game values. Prices are our own economy (Poké Ball/Potion prices predate
// this file and are kept as-is; new tiers are priced relative to those).
export const ITEMS = {
  pokeball:    { name: "Poké Ball",   price: 200,  category: "ball",     catchMult: 1 },
  greatball:   { name: "Great Ball",  price: 500,  category: "ball",     catchMult: 1.5 },
  ultraball:   { name: "Ultra Ball",  price: 900,  category: "ball",     catchMult: 2 },

  potion:      { name: "Potion",       price: 150,  category: "medicine", heal: 20 },
  superpotion: { name: "Super Potion", price: 500,  category: "medicine", heal: 50 },
  hyperpotion: { name: "Hyper Potion", price: 900,  category: "medicine", heal: 200 },
  maxpotion:   { name: "Max Potion",   price: 1800, category: "medicine", heal: "full" },
  revive:      { name: "Revive",       price: 1000, category: "medicine", heal: "half", revive: true },
  maxrevive:   { name: "Max Revive",   price: 2500, category: "medicine", heal: "full", revive: true },

  // Held items — equipped on a party mon (see PartyScene/BagScene's give
  // flow), not consumed from the Bag on use like balls/medicine. Real
  // items with real effects: type-boost items give their matching move
  // type +20%, Lum Berry cures any status the instant one lands, Leftovers
  // heals 1/16 max HP every turn.
  charcoal:     { name: "Charcoal",     price: 1000, category: "held", effect: "type_boost", boostType: "Fire" },
  mysticwater:  { name: "Mystic Water", price: 1000, category: "held", effect: "type_boost", boostType: "Water" },
  miracleseed:  { name: "Miracle Seed", price: 1000, category: "held", effect: "type_boost", boostType: "Grass" },
  magnet:       { name: "Magnet",       price: 1000, category: "held", effect: "type_boost", boostType: "Electric" },
  blackbelt:    { name: "Black Belt",   price: 1000, category: "held", effect: "type_boost", boostType: "Fighting" },
  lumberry:     { name: "Lum Berry",    price: 800,  category: "held", effect: "cure_status" },
  leftovers:    { name: "Leftovers",    price: 2000, category: "held", effect: "leftovers" },

  // Mega Stones — one per real Mega-eligible species in the roster (see
  // data/megas.js). Held items, inert unless the holder is the matching
  // species and the player has the Key Stone; the Mega button in battle
  // does the rest.
  gyaradosite:  { name: "Gyaradosite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Gyarados" },
  alakazite:    { name: "Alakazite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Alakazam" },
  gengarite:    { name: "Gengarite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Gengar" },
  lucarionite:  { name: "Lucarionite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Lucario" },
  garchompite:  { name: "Garchompite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Garchomp" },
  absolite:     { name: "Absolite",     price: 5000, category: "held", effect: "mega_stone", megaFor: "Absol" },
  aggronite:    { name: "Aggronite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Aggron" },
  cameruptite:  { name: "Cameruptite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Camerupt" },
  houndoominite:{ name: "Houndoominite",price: 5000, category: "held", effect: "mega_stone", megaFor: "Houndoom" },
  gardevoirite: { name: "Gardevoirite", price: 5000, category: "held", effect: "mega_stone", megaFor: "Gardevoir" },
  heracronite:  { name: "Heracronite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Heracross" },
  pinsirite:    { name: "Pinsirite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Pinsir" },
  ampharosite:  { name: "Ampharosite",  price: 5000, category: "held", effect: "mega_stone", megaFor: "Ampharos" },
  manectite:    { name: "Manectite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Manectric" },
  sablenite:    { name: "Sablenite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Sableye" },
  banettite:    { name: "Banettite",    price: 5000, category: "held", effect: "mega_stone", megaFor: "Banette" },
  mawilite:     { name: "Mawilite",     price: 5000, category: "held", effect: "mega_stone", megaFor: "Mawile" },
  audinite:     { name: "Audinite",     price: 5000, category: "held", effect: "mega_stone", megaFor: "Audino" },
  kangaskhanite:{ name: "Kangaskhanite",price: 5000, category: "held", effect: "mega_stone", megaFor: "Kangaskhan" },

  // Evolution item — real item from Pokémon Legends: Arceus/Scarlet &
  // Violet, letting a real trade-evolution species (Kadabra->Alakazam,
  // Haunter->Gengar; see data/evolutions.js) evolve without an actual
  // trade partner. Used from the Bag, not equipped like a held item.
  linkingcord: { name: "Linking Cord", price: 3000, category: "evolution" }
};

// Which items the Mart carries at a given League badge count — same shape
// as real games gradually expanding the Mart's stock as you progress.
const MART_TIERS = [
  { minBadges: 0, items: ["pokeball", "potion"] },
  { minBadges: 1, items: ["greatball", "superpotion"] },
  { minBadges: 3, items: ["ultraball", "hyperpotion", "revive", "charcoal", "mysticwater", "miracleseed", "magnet", "blackbelt", "lumberry"] },
  // Mega Stones are never sold — each is found, earned or story-given
  // (MEGA.md has the source of every one).
  { minBadges: 5, items: ["maxpotion", "maxrevive", "leftovers", "linkingcord"] }
];

export function availableItems(badgeCount) {
  return MART_TIERS
    .filter(tier => badgeCount >= tier.minBadges)
    .flatMap(tier => tier.items);
}

export function itemIcon(key) {
  const item = ITEMS[key];
  if (item.category === 'ball') return '🔴';
  if (item.category === 'held') return item.effect === 'cure_status' ? '🍒' : item.effect === 'mega_stone' ? '🔮' : '💠';
  if (item.category === 'evolution') return '🔗';
  if (item.revive) return '✨';
  return '💊';
}
