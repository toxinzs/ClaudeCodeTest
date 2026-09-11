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
  leftovers:    { name: "Leftovers",    price: 2000, category: "held", effect: "leftovers" }
};

// Which items the Mart carries at a given League badge count — same shape
// as real games gradually expanding the Mart's stock as you progress.
const MART_TIERS = [
  { minBadges: 0, items: ["pokeball", "potion"] },
  { minBadges: 1, items: ["greatball", "superpotion"] },
  { minBadges: 3, items: ["ultraball", "hyperpotion", "revive", "charcoal", "mysticwater", "miracleseed", "magnet", "blackbelt", "lumberry"] },
  { minBadges: 5, items: ["maxpotion", "maxrevive", "leftovers"] }
];

export function availableItems(badgeCount) {
  return MART_TIERS
    .filter(tier => badgeCount >= tier.minBadges)
    .flatMap(tier => tier.items);
}

export function itemIcon(key) {
  const item = ITEMS[key];
  if (item.category === 'ball') return '🔴';
  if (item.category === 'held') return item.effect === 'cure_status' ? '🍒' : '💠';
  if (item.revive) return '✨';
  return '💊';
}
