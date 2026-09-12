# Zau — Mega Evolution Design

Companion to [`STORY.md`](STORY.md). Mega Evolution is the game's signature mechanic *and* the plot's central idea (deep resonance with a bond and a revert, versus Verdanyx without either). This doc is where the mechanic meets the story: when the player gets it, what they get it with, and where every stone in the game comes from.

The battle mechanics themselves are already built (Phase 11): Key Stone + species-matched held stone, once per battle, no turn cost, reverts on faint/end. This doc changes *acquisition*, not rules.

## When the player gets it

**After Badge 3 (Thistle), before Signal District.** Team level ~28–32. See STORY.md beats K1–K5. Real games hand Mega Evolution over around the point a team is entering its thirties; this matches.

Current code grants `state.hasKeyStone` on beating Dario at the end of Act 1 — that is a placeholder and moves to beat K2. The Key Stone is **Elena Voss's**, found in her locker in the original excavation's cache behind the Ember Quarter's sealed service tunnel, brought there by her Absol.

## The gift Pokémon: Absol

Every player must have a Mega-eligible Pokémon at the moment the story needs one, regardless of what they caught. The Gen 9 starters can't Mega Evolve (only Gen 1–6 species ever got Megas), so the game gives one — the same solution ORAS used with Latias/Latios.

- **Species**: Absol. The disaster Pokémon that appears before calamity — it has been showing up on the Greenline Overlook before every storm (STORY.md G2/G3). It's Elena's, sent up as her messenger for years; it chooses the player.
- **Level**: 30 at the gift, above the curve for the moment so it's immediately usable.
- **Held item**: Absolite, already equipped.
- **Ability**: Super Luck (its real ability) — or Pressure; either is real.
- **Moves at gift**: Night Slash, Quick Attack, Bite, Swords Dance-equivalent when stat stages exist (Slash until then).
- **Stats — "good IVs."** The user wants it to genuinely be a strong individual, not just high-level. The honest mechanical answer: **the game has no IV system** (stats are computed with IV=0/EV=0/neutral nature, Phase 2.5). Two options, in order of preference:
  1. **Build a real IV system** (0–31 per stat, rolled on wild/gift creation, shown in the Party/Dex summary), then give the gift Absol perfect or near-perfect IVs. This is the real-game answer and also makes every caught Pokémon a little different, which "hours of gameplay" wants anyway. Small, contained change to `computeStats` + mon creation + a summary line. **Recommended, as its own phase before or alongside the Key Stone beat.**
  2. Until then: hand-author the gift Absol's stats above the formula's output (equivalent to perfect IVs) so the promise is kept from day one.
- **Nickname**: none by default; Elena never named it, deliberately. The player can.

## Where every stone comes from

No stone is sold in the Mart any more (they currently sit in the badge-5 tier — a placeholder to remove when this lands). Stones are found, earned, or given: side quests, caves and tunnels, big story moments, and a few required ones the story hands over.

| Stone | For | Source | Type | When |
|---|---|---|---|---|
| **Absolite** | Absol | Elena's cache (K2), with the gift Absol | **Required, story** | After Badge 3 |
| Gyaradosite | Gyarados | Harbormaster Rossi — *"The Ferry That Never Left"* side quest (drain the Drowned Stair) | Side quest | Post–Badge 4 |
| Lucarionite | Lucario | Foreman Kettering — *"The Last Line"* side quest (restore all three mill lines) | Side quest | Post–Badge 2 |
| Aggronite | Aggron | Deep in the Boiler Tunnels (E3 dungeon), behind a Rock Smash-tier boulder once field moves exist; until then, the tunnel's far branch | Cave | Post–Badge 2 |
| Cameruptite | Camerupt | Ashgrave — leader rematch reward | Postgame | Postgame |
| Houndoominite | Houndoom | The Old Lines (U1 dungeon), in a shrine the Warden left | Cave | Post–Badge 4 |
| Gardevoirite | Gardevoir | Old Sato — *"What Grows There"* side quest (Priya's samples, three cuttings) | Side quest | Post–Badge 3 |
| Heracronite | Heracross | The Allotments — *"The Orchard Bet"* side quest (win three trainer battles in the Allotments) | Side quest | Post–Badge 3 |
| Pinsirite | Pinsir | Thistle — leader rematch reward | Postgame | Postgame |
| Alakazite | Alakazam | Busker Talia — *"The Song She Can't Finish"* side quest (a Signal District recording) | Side quest | Post–Badge 4 |
| Gengarite | Gengar | Obsidian — after the badge, "you'll need it down there" | **Story-given** | Post–Badge 5 |
| Garchompite | Garchomp | The Skyline's highest weather station | Postgame | Postgame |

Big story moments as sources: Absolite (K2) and Gengarite (U2) are handed over by the plot. Everything else rewards playing the world.

## Trainer Megas

- **Dario** Mega Evolves from the Underlight onward (V2), and in every postgame rematch. Halloran gave him a stone as a gift; the story makes clear it was meant as one.
- **Vance** does not Mega Evolve. He has the energy and no bond; that's the point of him.
- **Gym leader rematches** (postgame) use Megas — Cameruptite/Pinsirite are *their* rewards for a reason.
- Requires the engine to support enemy Megas (currently player-only) — part of the implementation pass when Act 3 is built.

## Presentation (owed, part of the animation pass)

- A transformation sequence: flash, silhouette, form reveal, name banner "Absol Mega Evolved into Mega Absol!" — currently just a log line and a sprite swap.
- Key Stone glow on the battle HUD when Mega is available.
- The K2 cache scene and K5 first-Mega battle are both cutscene-worthy.
