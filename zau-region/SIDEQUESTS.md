# Zau — Side Content

The list that makes "hours of gameplay" a list instead of a hope. Everything here is optional; several reward Mega Stones (see [`MEGA.md`](MEGA.md)). Each quest names its district, its unlock, what the player actually does, and the reward. Flags are the `state` keys the dialogue engine will key on.

## Side quests

| # | Name | District | Unlock | What you do | Reward |
|---|---|---|---|---|---|
| 1 | **The Keeper's Log** | Harbor | Badge 1 | Ambrose asks for three pre-city harbor markers: one in the Outskirts' Underpass, one at Lighthouse Point at low tide, one behind Cargo Row. | Old Rod (fishing) + Ambrose's history unlocks in dialogue |
| 2 | **The Ferry That Never Left** | Harbor ↔ Ember | Badge 4 | Rossi's ferry pumps could drain the Drowned Stair, but they need Kettering's crew to run. Broker it. Main-story gate for the Undercity, but the *full* quest (restoring the ferry itself) is optional. | Gyaradosite **and**, once all 8 badges are earned, the ferry actually runs — the postgame's only route to the Islands (`districts/islands.md`), not just flavor |
| 3 | **The Last Line** | Ember | Badge 2 | Restore all three mill lines: parts from the Scrapyard, a worker who quit, a Torkoal that won't leave the furnace. | Lucarionite |
| 4 | **What Grows There** | Greenline | Badge 3 | Three cuttings for Priya from the intake ferns, each guarded by a wild that's grown wrong (over-levelled Grass encounters). | Gardevoirite |
| 5 | **The Orchard Bet** | Greenline | Badge 3 | Beat Tomas, Pip, and Grandma Osei in the Allotments. Osei is a real fight. | Heracronite |
| 6 | **The Song She Can't Finish** | Signal | Badge 4 | Talia has followed a melody up from the Outskirts. Record the storm signal with Prism's gear at three points; the melody is the pulse. | Alakazite |
| 7 | **Chalk Years** | Undercity | Badge 5 | Halvard's shrines — find all seven, read the chalk. Each is a year, a kettle, a blanket. Piecing them together is Elena's timeline. | Houndoominite is in the last shrine |
| — | *(no side quest yet)* | Undercity — the Terminus | Badge 5 | Leader Halcyon's gym is main-story, not optional — see STORY.md's U2b. A Terminus-specific side quest (a lost timetable, a regular who missed their stop) is a natural future addition once this area is built. | — |
| 8 | **Lost in the Stack** | All | Rolling | A Pokémon lost in one district is found in another (a Sewaddle in the Boiler Tunnels, a Chinchou in the Signal risers). Return them. | Money, items, one evolution stone per return once stones exist |
| 9 | **Sponsored** | Sprawl | Act 3 | Sloane's offer. Declining is the reward. | A dialogue-only quest — the game respects the player |
| 10 | **The Keeper Above** | Skyline | Postgame | Iven's weather-station route to Verdanyx. | The Verdanyx encounter |

## Rematches and the League
- **Trail trainers** rematch at scaled levels after each badge (Reyes at Badge 1, all five by Badge 3). Ferro joins them.
- **Gym leaders** rematch postgame with full six-mon Mega teams — all **8** now: Coral, Ashgrave, Thistle, Prism, Obsidian, Halcyon, Fathom, Cairn. Cameruptite (Ashgrave) and Pinsirite (Thistle) are rematch rewards; Halcyon/Fathom/Cairn's stones come with their first badge instead (see MEGA.md).
- **Dario** rematches postgame with a full Mega team.
- **Postgame Verdanyx (unleashed)** past all 8 badges — the region's true final fight, STORY.md's postgame section.

## Caves and tunnels (dungeons)
| Dungeon | District | Story beat | Wilds |
|---|---|---|---|
| Boiler Tunnels | Ember | E3 | Fire/Rock; Aggronite at the far branch |
| Cable Risers | Signal | S2 | Electric/Steel |
| The Old Lines | Undercity | U1 | Ghost/Dark/Poison; the shrines; Houndoominite |
| The Terminus | Undercity, deeper | U2b | Ghost-leaning; Leader Halcyon; Banettite |
| The Underlight | Undercity, below | V1–V4 | Verdanyx |
| Weather Stations | Skyline | Postgame | Flying/Electric/Dragon |
| The Islands | Postgame, via the ferry | — | Water/Dark (Long Shoal, Fathom); Psychic/Steel/ruins (Drowned Archive, Cairn, wild Latios) |

## Systems this list assumes (not built yet)
- **Quest flags in `state`** (`state.quests.<key>`: `unavailable | available | active | done`), saved.
- **Fishing** (Old Rod from quest 1) — a small new encounter mechanic at water tiles.
- **Evolution stones** as items (Dusk/Thunder/Leaf/Sun/Shiny) — four lines currently stop short without them.
- **Field moves / gating** (Rock Smash-tier boulder for Aggronite, the Drowned Stair drain) — the classic progression gate, roadmap item 7.
- **IVs** (see MEGA.md) so "good IVs" on the gift Absol is literally true.
- **Trainer rematch scaling** — trainers with level tiers keyed on badge count.

## Cosmetics
- Outfits and hairstyles beyond the starting set unlock from badges (one per gym, in the leader's colours) and from side quests (Ambrose's keeper's coat, Kettering's work jacket). Purchasable extras at the Sprawl's shops. Ties into the existing LPC layered sprite system.
