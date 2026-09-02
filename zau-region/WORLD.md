# Zau — World Reference

Living reference doc for the region's geography. This is where a future "add a zone / trainer / area" ask should slot into, instead of getting invented fresh each time. Edit this whenever the vision changes — it's meant to be argued with, not treated as locked.

## The concept

Zau isn't a spread of separate towns connected by routes — it's **one city, built in stacked strata**, each layer constructed on top of (or dug beneath) the last. The intro already frames this: *"Wild Zones tangle beneath overpasses while glass towers climb into the fog above."* Going up the city means going up in wealth and control (Meridian Dynamics at the top); going down means going back in time, toward whatever the city was built over.

"Caves and tunnels" = the vertical shafts, stairwells, and maintenance tunnels connecting strata, plus the natural cave systems near the bottom that predate the city. "Water travel" = the Harbor District, which sits at the edge of the stack and opens out rather than up/down.

## The strata (top to bottom)

| # | Stratum | Status | What's there | Vibe / likely types |
|---|---------|--------|---------------|---------------------|
| 9 | **The Skyline** | *New — postgame idea* | Above Meridian Tower. Antenna farms, sky bridges, weather stations. Where you'd fight anything post-Verdanyx. | Flying, Electric, Dragon |
| 8 | **Meridian Tower** | Built (as a battle, not a walkable map yet) | Director Vance's HQ. Corporate, glass, sterile. | Steel, Psychic, Ground |
| 7 | **The Sprawl** | *New* | Mid-city residential/commercial layer between the towers and the gyms below — apartments, shops, the "Meet the Rivals" screen would live here. Connective tissue, not a single gym. | Normal, Fairy, mixed |
| 6 | **Signal District** | Named only (Signal Tower, Leader Prism) | Comms/tech hub built up the side of the district — antennas, server farms. | Electric, Steel |
| 5 | **Greenline Terraces** | Named only (Leader Thistle) | Literal stacked garden terraces — the city's one deliberate green layer, built to look like nature reclaimed the concrete. | Grass, Bug, Fairy |
| 4 | **Ember Quarter** | Named only (Leader Ashgrave) | Old industrial/factory district, still running hot. | Fire, Rock, Steel |
| 3 | **Harbor District** | **Fleshed out** — see [`districts/harbor.md`](districts/harbor.md) | Where the city meets water — docks, piers, the one place that opens outward instead of stacking. Natural home for eventual water travel/surfing. | Water, Flying |
| 2 | **The Outskirts / Wild Zone** | **Fully built** — Zau Outskirts (start), Underpass Loop, Harbor Steps, Midblock Plaza, Rooftop District (Act 1 trail) | Street level, least developed, where wild Pokémon and unlicensed trainers cluster. Your starting point. | Whatever's currently in `WILD_SPECIES` — broad early-game mix |
| 1 | **The Undercity** | Named only (Undercity Vault, Leader Obsidian) | Forgotten tunnels, old transit lines, sewers — the layer everyone built over and forgot about. Natural cave/tunnel network connecting down toward the Underlight. | Dark, Ghost, Poison, Ground |
| 0 | **The Underlight** | Built (as a battle) | Pre-city ruins, whatever Zau was actually built on top of. Verdanyx's domain. Final dungeon. | Grass/Dragon (Verdanyx), otherwise unknown |

## How they connect

- **Vertically, mostly**: elevators, stairwells, freight lifts, and maintenance shafts link adjacent strata. Going from The Sprawl to Meridian Tower means a guarded lobby elevator; going from the Outskirts down to the Undercity means finding an unlocked access tunnel, not a front door.
- **Harbor is the one horizontal exception** — it's the edge of the stack, where the city meets open water. Everything else stacks; Harbor spreads out.
- Skipping strata isn't really possible — you can't get from the Outskirts to Meridian Tower without passing through the districts in between, mirroring the existing League's "beat what's in front of you" structure.

## Built vs. named vs. new

- **Fully built (walkable + battles)**: Outskirts/Wild Zone (Act 1), The Underlight (final battle only, not walkable yet).
- **Fleshed out on paper, no walkable map yet**: Harbor District (see [`districts/harbor.md`](districts/harbor.md) — sub-locations, NPCs, wild Pokémon, a story hook).
- **Named + has a gym battle, still just a name otherwise**: Ember Quarter, Greenline Terraces, Signal District, Undercity, Meridian Tower. (The League hub map currently represents all 5 gyms as one shared space — eventually each could get its own real district map.)
- **Brand new, not in the game at all yet**: The Sprawl, The Skyline.

## Using this doc

When a future ask is "add a new zone / gym / area," the first question is which stratum it belongs to (or whether it's a genuinely new one), not whether to invent a new region from scratch. Keeps growth additive instead of scattered.
