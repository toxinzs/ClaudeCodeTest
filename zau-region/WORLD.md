# Zau — World Reference

Living reference doc for the region's geography. This is where a future "add a zone / trainer / area" ask should slot into, instead of getting invented fresh each time. Edit this whenever the vision changes — it's meant to be argued with, not treated as locked.

Geography only — for the actual plot, history, and characters this world exists to serve, see [`STORY.md`](STORY.md) (the full act-by-act beat sheet), [`CHARACTERS.md`](CHARACTERS.md) (every named person, per district), [`MEGA.md`](MEGA.md) (when Mega Evolution unlocks and where every stone is), and [`SIDEQUESTS.md`](SIDEQUESTS.md). Any new district's story hook should be checked against those rather than invented independently. Every stratum now has a design doc in [`districts/`](districts/).

## The concept

Zau isn't a spread of separate towns connected by routes — it's **one city, built in stacked strata**, each layer constructed on top of (or dug beneath) the last. The intro already frames this: *"Wild Zones tangle beneath overpasses while glass towers climb into the fog above."* Going up the city means going up in wealth and control (Meridian Dynamics at the top); going down means going back in time, toward whatever the city was built over.

"Caves and tunnels" = the vertical shafts, stairwells, and maintenance tunnels connecting strata, plus the natural cave systems near the bottom that predate the city. "Water travel" = the Harbor District, which sits at the edge of the stack and opens out rather than up/down.

## The strata (top to bottom)

| # | Stratum | Status | What's there | Vibe / likely types |
|---|---------|--------|---------------|---------------------|
| 9 | **The Skyline** | Designed — [`districts/skyline.md`](districts/skyline.md) (postgame) | Above Meridian Tower. Antenna farms, sky bridges, weather stations. Where Verdanyx goes to rest; the hardest fights. | Flying, Electric, Dragon |
| 8 | **Meridian Tower** | Designed — [`districts/tower.md`](districts/tower.md); built as a battle only | Director Vance's HQ. Corporate, glass, sterile. Act 3's confrontation; the freight core down. | Steel, Psychic, Ground |
| 7 | **The Sprawl** | Designed — [`districts/sprawl.md`](districts/sprawl.md) | Mid-city residential/commercial layer where Meridian is ordinary — landlord, employer, sponsor. No gym. Act 3's first stop: Dario's choice, Halloran's office. | Normal, Fairy, mixed |
| 6 | **Signal District** | **Fully built** — [`districts/signal.md`](districts/signal.md) | Comms/tech hub bolted onto the stack's side — antennas, server farms, Meridian's data centre. Where the storms become a *pulse*. | Electric, Steel |
| 5 | **Greenline Terraces** | **Fleshed out** — see [`districts/greenline.md`](districts/greenline.md) | Literal stacked garden terraces — the city's one deliberate green layer, built to look like nature reclaimed the concrete. | Grass, Bug, Fairy |
| 4 | **Ember Quarter** | **Fleshed out** — see [`districts/ember.md`](districts/ember.md) | Old industrial/factory district, still running hot. | Fire, Rock, Steel |
| 3 | **Harbor District** | **Fleshed out** — see [`districts/harbor.md`](districts/harbor.md) | Where the city meets water — docks, piers, the one place that opens outward instead of stacking. Natural home for eventual water travel/surfing. | Water, Flying |
| 2 | **The Outskirts / Wild Zone** | **Fully built** — Zau Outskirts (start), Underpass Loop, Harbor Steps, Midblock Plaza, Rooftop District (Act 1 trail) | Street level, least developed, where wild Pokémon and unlicensed trainers cluster. Your starting point. | Whatever's currently in `WILD_SPECIES` — broad early-game mix |
| 1 | **The Undercity** | **Fully built** — [`districts/undercity.md`](districts/undercity.md) | Forgotten tunnels, old transit lines, sewers — the layer everyone built over and forgot. The Old Lines dungeon, Obsidian's Vault, and the Warden. Where the truth is. | Dark, Ghost, Poison, Ground |
| 0 | **The Underlight** | Built (as a battle) | Pre-city ruins, whatever Zau was actually built on top of. Verdanyx's domain. Final dungeon. | Grass/Dragon (Verdanyx), otherwise unknown |

## The player's route through the stack

The story doesn't go straight up. It climbs, then drops, then climbs to the top, then drops to the bottom — because Meridian's head is at the top and its excavation is at the bottom.

| Order | Stratum | Gate | Team level | Story beat |
|---|---|---|---|---|
| 1 | Outskirts / Wild Zone Trail | — | 5–18 | Act 1, Dario |
| 2 | Harbor District | Dario beaten (Harbor Steps) | 18–22 | *cargo* — Cargo Row break-in; Badge 1 |
| 3 | Ember Quarter | Badge 1 (Harbor Ramp) | 22–26 | *power* — the blackout, Boiler Tunnels; Badge 2 |
| 4 | Greenline Terraces | Badge 2 (Freight Lift) | 26–29 | *water* — the storm on the Overlook, the Absol; Badge 3 |
| 5 | The Key Stone | Badge 3 | 28–32 | Elena's cache behind the Ember service tunnel; the gift Absol; Mega Evolution unlocks |
| 6 | Signal District | Badge 3 (Service Stair) | 30–34 | *signal* — the pulse; Dario sponsored; Badge 4 |
| 7 | The Undercity | Badge 4 + the Drowned Stair drained | 33–36 | *the truth* — the Old Lines, Obsidian, the Warden; Badge 5 |
| 8 | The Sprawl | Badge 5 (Sprawl Bridge) | 36–38 | Dario's choice; Halloran |
| 9 | Meridian Tower | Halloran's badge | 38–42 | Vance |
| 10 | The Underlight | The freight core | 42–48 | Verdanyx |
| 11 | The Skyline | Ending | 50+ | Postgame |

## How they connect

- **Vertically, mostly**: elevators, stairwells, freight lifts, and maintenance shafts link adjacent strata. Going from The Sprawl to Meridian Tower means a guarded lobby elevator; going from the Outskirts down to the Undercity means finding an unlocked access tunnel, not a front door.
- **Harbor is the one horizontal exception** — it's the edge of the stack, where the city meets open water. Everything else stacks; Harbor spreads out.
- **The caves and tunnels are a network, not a list.** The Boiler Tunnels (Ember), the Ember service tunnel (Key Stone cache), the Cable Risers (Signal), the Drowned Stair (Harbor) and the Old Lines (Undercity) all connect into the same pre-city tunnel system, and every Meridian installation in every district — the cargo, the trunk cable, the pump intake, the fibre trunk — runs down into it. That's the region's one big secret told as geography: four districts, four different oddities, one hole.
- Skipping strata isn't really possible — you can't get from the Outskirts to Meridian Tower without passing through the districts in between, mirroring the existing League's "beat what's in front of you" structure.

## Built vs. named vs. new

- **Fully built (walkable + battles)**: Outskirts/Wild Zone (Act 1), Harbor District (walkable map in the Phaser build — Coral's gym, Fish Market, and the other sub-locations from [`districts/harbor.md`](districts/harbor.md) as step triggers; its story-hook spots are flavor until the Undercity/water-travel systems exist), Ember Quarter (same treatment — Ashgrave's Foundry Gym, the Scrapyard Exchange, and the hooks from [`districts/ember.md`](districts/ember.md); reached up the Harbor Ramp behind Coral's badge), Greenline Terraces (same again — Thistle's Canopy Gym, the Seed Bank, and the hooks from [`districts/greenline.md`](districts/greenline.md); reached up the Ember Freight Lift behind Ashgrave's badge), Signal District (Prism's tower, the Relay, the Data Centre → Cable Risers dungeon, the Antenna Farm, with its cast and beats S1–S3 from day one; reached up the Greenline Service Stair behind Thistle's badge), The Undercity (the Old Lines dungeon down from the drained Drowned Stair, Kestrel's Post, Halvard's Platform, Obsidian's Vault, the Warden's Reach — beats U1–U3 and Act 2's close; the Underlight hatch sealed until Act 3), The Underlight (final battle only, not walkable yet).
- **Named + has a gym battle, still just a name otherwise**: Meridian Tower. (The League hub map currently represents all 5 gyms as one shared space — eventually each could get its own real district map.)
- **Brand new, not in the game at all yet**: The Sprawl, The Skyline.

## Using this doc

When a future ask is "add a new zone / gym / area," the first question is which stratum it belongs to (or whether it's a genuinely new one), not whether to invent a new region from scratch. Keeps growth additive instead of scattered.
