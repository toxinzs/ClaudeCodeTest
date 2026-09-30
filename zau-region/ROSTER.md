# Zau — Roster Plan

Companion to [`WORLD.md`](WORLD.md) and [`MEGA.md`](MEGA.md). **Approved and being built (Phase 30).** It exists so the Pokémon roster is decided once, in one place. The two decisions that gated the build were answered: wave 1 stays as drawn (Gen 1–5-heavy) with **wave 2 tilting toward Generations 6–9**, and the **evolution rules in section 6 are approved**. Decisions 3–6 in section 10 are still open and default to the plan as drawn.

**Build status.** Built (into `src/data/rosterGenerated.js` by `tools/roster/build.mjs`): the 34 completions and every wave-1 zone that has a scene — Outskirts, Underpass, District, Harbor, Ember, Greenline, Signal, Undercity, Sprawl, Skyline — **284 real species in the game (was 145)**. Not built: the Underlight, Long Shoal and Drowned Archive batches (33 species), because those zones have no wild-encounter scenes yet; they go in with their scenes. Two deviations from the tables below, both deliberate: generated spawns use each zone's *shipped* level band (`SHIPPED_BANDS` in `tools/roster/plan-data.mjs`) rather than the bible's target bands, which is a one-line switch (`USE_PLAN_BANDS`) once the earlier tiers are rebalanced; and a line whose "Enters as" stage skips earlier stages also spawns those earlier stages rarely in the same zone, so every stage stays obtainable and the Pokédex can be completed (an over-leveled Shinx simply evolves on its next level-ups).

The tables in sections 5 to 7 are generated from PokeAPI's own data by `zau-region-phaser/tools/roster/plan-report.mjs`, so every evolution level, stone and trade in them is real, not typed from memory. To regenerate after editing the plan, run `node tools/roster/plan-report.mjs` from `zau-region-phaser/`.

## 1. Where the roster stands

A read-only audit (Phase 29) of every species in the game, cross-checked against PokeAPI:

| | |
|---|---|
| Real species in the game | 145, plus Verdanyx |
| Base stats and dex IDs that disagree with PokeAPI | 0 |
| Evolution lines that stop short of their real final form | 24 |
| Species the player could never catch (before Phase 29) | 10 |
| Species only trainers could field (before Phase 29) | 7 |
| Your stated target | 300 to 400 |

Phase 29 fixed the unobtainable and trainer-only species. What is left is the work this plan covers: lines that stop halfway, a type spread with Flying at 20 and Ice at 2, and a roster that is 63 percent Generation 1 to 3.

## 2. Rules this plan follows

- **One record per species, and every line is complete.** If Machop exists, so do Machoke and Machamp. Nothing in the game is a dead end except a real final form.
- **Babies are skipped.** There is no breeding, so Pichu, Cleffa, Igglybuff, Azurill, Budew, Togepi, Munchlax and the rest do not appear. A line starts at its first non-baby stage.
- **Regional-form evolutions are skipped.** Obstagoon, Perrserker, Cursola, Sirfetchd, Mr. Rime, Runerigus, Overqwil, Sneasler, Wyrdeer, Kleavor, Ursaluna, Basculegion, Annihilape and similar need forms the game does not have.
- **No legendaries except the two already planned.** Verdanyx is custom, and Latios is the single catchable encounter at the Drowned Archive (WORLD.md, islands.md).
- **Every zone keeps its type identity** from the district docs. The plan adds lines that fit each place, then checks the type budget in section 4.
- **Levels follow the bands in WORLD.md**, which are still a target, not what is shipped.

## 3. The size of the plan

| | Species |
|---|---|
| In the game today | 145 |
| Completions: finish the 24 incomplete lines | +34 |
| **Wave 1: new lines across 13 zones** | **+137** |
| **Total after wave 1** | **316** |
| Wave 2 candidate pool (pick roughly 85 to reach 400) | about 178 |

| Zone | Band | Wave 1 adds |
|---|---|---|
| Outskirts (Town edge) | Lv.2–18 | +12 |
| Trail: Underpass stage | Lv.5–13 | +6 |
| Trail: District stage | Lv.9–18 | +6 |
| Harbor District | Lv.18–23 | +13 |
| Ember Quarter | Lv.23–28 | +12 |
| Greenline Terraces | Lv.28–32 | +12 |
| Signal District | Lv.33–38 | +11 |
| Undercity, Old Lines, Terminus | Lv.35–43 | +14 |
| The Sprawl | Lv.43–47 | +11 |
| The Underlight | Lv.53–60 | +9 |
| The Skyline (postgame) | Lv.55–65 | +7 |
| The Long Shoal (postgame island) | Lv.60–65 | +9 |
| The Drowned Archive (postgame island) | Lv.63–68 | +15 |

## 4. Type and generation budget

Counts include both types of a dual-type species.

| Type | Now | After wave 1 |
|---|---|---|
| Water | 15 | 47 |
| Flying | 20 | 37 |
| Ground | 10 | 34 |
| Normal | 11 | 33 |
| Psychic | 8 | 33 |
| Rock | 8 | 29 |
| Grass | 13 | 28 |
| Ghost | 14 | 27 |
| Bug | 17 | 27 |
| Poison | 13 | 27 |
| Electric | 18 | 26 |
| Steel | 16 | 25 |
| Fire | 17 | 24 |
| Dragon | 10 | 22 |
| Dark | 9 | 21 |
| Fairy | 12 | 18 |
| Fighting | 4 | 14 |
| Ice | 2 | 14 |

Ice and Fighting, the two starved types, are fixed. Water is now the biggest type because the Harbor and the Long Shoal are both water zones, which I think is right for a city built around a harbor.

| Generation | Now | After wave 1 | Wave 1 plus full pool |
|---|---|---|---|
| 1 | 46 | 100 | 120 |
| 2 | 18 | 37 | 44 |
| 3 | 27 | 56 | 68 |
| 4 | 16 | 35 | 47 |
| 5 | 15 | 44 | 80 |
| 6 | 6 | 17 | 41 |
| 7 | 3 | 8 | 20 |
| 8 | 3 | 6 | 26 |
| 9 | 11 | 13 | 48 |

**Wave 1 leans on Generations 1 to 5** (272 of 316), because those lines map cleanly onto the districts and the Mega plans. Generations 6 to 9 are only 14 percent. The wave 2 pool tilts the other way on purpose, so the final roster evens out. If you would rather balance it in wave 1, say so and I will swap lines.

## 5. The plan

How to read the tables: **Enters as** is the stage the wild table would spawn in that zone, the most evolved stage whose evolution level is at or below the zone's lower bound. A line that enters at a later stage skips its earlier ones, so those stages are only obtainable elsewhere. That rule is mechanical and easy to override. A dagger marks a level that in the real games also needs a time of day, gender or place.

### 5.1 Completions (34 species)

| Line already in the game | Adds | How |
|---|---|---|
| Caterpie | Metapod, Butterfree | Lv.7, Lv.10 |
| Pidgey | Pidgeotto, Pidgeot | Lv.18, Lv.36 |
| Rattata | Raticate | Lv.20 |
| Zigzagoon | Linoone | Lv.20 |
| Bidoof | Bibarel | Lv.15 |
| Lechonk | Oinkologne | Lv.18† |
| Starly | Staravia, Staraptor | Lv.14, Lv.34 |
| Geodude | Graveler, Golem | Lv.25, trade |
| Tarountula | Spidops | Lv.15 |
| Growlithe | Arcanine | Fire Stone |
| Grubbin → Charjabug | Vikavolt | Thunder Stone |
| Snorunt → Froslass | Glalie | Lv.42 |
| Cutiefly | Ribombee | Lv.25 |
| Tentacool | Tentacruel | Lv.30 |
| Krabby | Kingler | Lv.28 |
| Horsea | Seadra, Kingdra | Lv.32, trade |
| Chinchou | Lanturn | Lv.27 |
| Buizel | Floatzel | Lv.26 |
| Ralts → Kirlia → Gardevoir | Gallade | Dawn Stone |
| Electabuzz | Electivire | trade |
| Klink → Klang | Klinklang | Lv.49 |
| Zubat → Golbat | Crobat | friendship |
| Duskull → Dusclops | Dusknoir | trade |
| Eevee → Vaporeon → Jolteon → Flareon | Espeon, Umbreon, Leafeon, Glaceon, Sylveon | friendship, friendship, Leaf Stone, Ice Stone, friendship |
| Meowth | Persian | Lv.28 |

### 5.2 New lines by zone

#### Outskirts (Town edge) (Lv.2–18): +12
*Street-level mix: Normal, Flying, Bug, Poison, early Fighting.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Weedle →Lv.7 Kakuna →Lv.10 Beedrill | Weedle | 3 |
| Machop →Lv.28 Machoke →trade Machamp | Machop | 3 |
| Lillipup →Lv.16 Herdier →Lv.32 Stoutland | Lillipup | 3 |
| Fletchling →Lv.17 Fletchinder →Lv.35 Talonflame | Fletchling | 3 |

#### Wild Zone Trail: Underpass stage (Lv.5–13): +6
*Sewers and underpasses: Poison, Ground.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Grimer →Lv.38 Muk | Grimer | 2 |
| Diglett →Lv.26 Dugtrio | Diglett | 2 |
| Trubbish →Lv.36 Garbodor | Trubbish | 2 |

#### Wild Zone Trail: District stage (Lv.9–18): +6
*Rooftops and plazas: Psychic, Electric, Flying.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Drowzee →Lv.26 Hypno | Drowzee | 2 |
| Natu →Lv.25 Xatu | Natu | 2 |
| Voltorb →Lv.30 Electrode | Voltorb | 2 |

#### Harbor District (Lv.18–23): +13
*Water, Ice (the fish market cold store), Flying.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Staryu →Water Stone Starmie | Staryu | 2 |
| Shellder →Water Stone Cloyster | Shellder | 2 |
| Slowpoke →Lv.37 Slowbro ; Slowpoke →trade Slowking | Slowpoke | 3 |
| Spheal →Lv.32 Sealeo →Lv.44 Walrein | Spheal | 3 |
| Swinub →Lv.33 Piloswine →knows a move Mamoswine | Swinub | 3 |

#### Ember Quarter (Lv.23–28): +12
*Fire, Rock, Steel, Ground.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Vulpix →Fire Stone Ninetales | Vulpix | 2 |
| Ponyta →Lv.40 Rapidash | Ponyta | 2 |
| Rhyhorn →Lv.42 Rhydon →trade Rhyperior | Rhyhorn | 3 |
| Onix →trade Steelix | Onix | 2 |
| Roggenrola →Lv.25 Boldore →trade Gigalith | Roggenrola | 3 |

#### Greenline Terraces (Lv.28–32): +12
*Grass, Bug, Fairy.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Bellsprout →Lv.21 Weepinbell →Leaf Stone Victreebel | Weepinbell | 3 |
| Roselia →Shiny Stone Roserade | Roselia | 2 |
| Shroomish →Lv.23 Breloom | Breloom | 2 |
| Scyther →trade Scizor | Scyther | 2 |
| Bounsweet →Lv.18 Steenee →knows a move Tsareena | Steenee | 3 |

#### Signal District (Lv.33–38): +11
*Electric, Steel, Psychic.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Shinx →Lv.15 Luxio →Lv.30 Luxray | Luxray | 3 |
| Porygon →trade Porygon2 →trade Porygon-Z | Porygon | 3 |
| Elgyem →Lv.42 Beheeyem | Elgyem | 2 |
| Solosis →Lv.32 Duosion →Lv.41 Reuniclus | Duosion | 3 |

#### Undercity / Old Lines / Terminus (Lv.35–43): +14
*Dark, Ghost, Poison, Ground.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Sneasel →hold Razor Claw Weavile | Sneasel | 2 |
| Sandile →Lv.29 Krokorok →Lv.40 Krookodile | Krokorok | 3 |
| Yamask →Lv.34 Cofagrigus | Cofagrigus | 2 |
| Phantump →trade Trevenant | Phantump | 2 |
| Cubone →Lv.28 Marowak | Marowak | 2 |
| Honedge →Lv.35 Doublade →Dusk Stone Aegislash | Doublade | 3 |

#### The Sprawl (Lv.43–47): +11
*Ordinary city life: Normal, Fairy, Fighting, Psychic.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Timburr →Lv.25 Gurdurr →trade Conkeldurr | Gurdurr | 3 |
| Meditite →Lv.37 Medicham | Medicham | 2 |
| Buneary →friendship Lopunny | Buneary | 2 |
| Jigglypuff →Moon Stone Wigglytuff | Jigglypuff | 2 |
| Marill →Lv.18 Azumarill | Azumarill | 2 |

#### The Underlight (Lv.53–60): +9
*Pre-city deep dark: Rock, Ground, Dark, ancient Dragons.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Larvitar →Lv.30 Pupitar →Lv.55 Tyranitar | Pupitar | 3 |
| Trapinch →Lv.35 Vibrava →Lv.45 Flygon | Flygon | 3 |
| Deino →Lv.50 Zweilous →Lv.64 Hydreigon | Zweilous | 3 |

#### The Skyline (postgame) (Lv.55–65): +7
*Flying, Dragon, Electric.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Noibat →Lv.48 Noivern | Noivern | 2 |
| Dreepy →Lv.50 Drakloak →Lv.60 Dragapult | Drakloak | 3 |
| Rufflet →Lv.54 Braviary | Braviary | 2 |

#### The Long Shoal (postgame island) (Lv.60–65): +9
*Open ocean: Water, Dark.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Carvanha →Lv.30 Sharpedo | Sharpedo | 2 |
| Wailmer →Lv.40 Wailord | Wailord | 2 |
| Feebas →trade Milotic | Feebas | 2 |
| Frillish →Lv.40 Jellicent | Jellicent | 2 |
| Lapras | Lapras | 1 |

#### The Drowned Archive (postgame island) (Lv.63–68): +15
*Ruins: Psychic, Steel, ancient fossils.*

| Line († = also needs a time, gender or place) | Enters as | New |
|---|---|---|
| Beldum →Lv.20 Metang →Lv.45 Metagross | Metagross | 3 |
| Baltoy →Lv.36 Claydol | Claydol | 2 |
| Lunatone | Lunatone | 1 |
| Solrock | Solrock | 1 |
| Omanyte →Lv.40 Omastar | Omastar | 2 |
| Kabuto →Lv.40 Kabutops | Kabutops | 2 |
| Lileep →Lv.40 Cradily | Cradily | 2 |
| Aerodactyl | Aerodactyl | 1 |
| Latios | Latios | 1 |

## 6. Evolution rules

The real games use conditions this game does not have: friendship, trade, time of day, gender, held items, known moves. The existing precedent is to simplify them (Riolu evolves at a flat level, trades use the Linking Cord, stones are items). This plan extends that precedent, and the decisions below are the ones to check.

| Real condition | Proposed rule |
|---|---|
| Trade, with or without a held item (15 species) | Linking Cord. One item covers all of them. |
| Friendship | A flat level near the line's other thresholds: Crobat Lv.36, Lopunny Lv.30. |
| Eevee's five extra forms | Stones, like the three it already has: Espeon Sun Stone, Umbreon Dusk Stone, Leafeon Leaf Stone, Glaceon Ice Stone, Sylveon Shiny Stone. |
| Knows a move | A flat level: Mamoswine Lv.44, Tsareena Lv.28. |
| Held item (Weavile) | Dusk Stone. |
| Gender or time of day | Ignored. Oinkologne evolves at Lv.18; Gallade and Froslass use the Dawn Stone. |
| Stones | Already in the game except the Ice Stone, which is the only new item this plan needs. |

### 6.1 What needs a rule

- **conditional level (gender, time of day, place)** (1): Oinkologne (Lv.18)
- **friendship** (5): Crobat (friendship), Espeon (friendship), Umbreon (friendship), Sylveon (friendship), Lopunny (friendship)
- **held item** (1): Weavile (hold Razor Claw)
- **knows a move** (2): Mamoswine (knows a move), Tsareena (knows a move)
- **stone or item** (12): Arcanine (Fire Stone), Vikavolt (Thunder Stone), Gallade (Dawn Stone), Leafeon (Leaf Stone), Glaceon (Ice Stone), Starmie (Water Stone), Cloyster (Water Stone), Ninetales (Fire Stone), Victreebel (Leaf Stone), Roserade (Shiny Stone), Aegislash (Dusk Stone), Wigglytuff (Moon Stone)
- **trade** (15): Golem (trade), Kingdra (trade), Electivire (trade), Dusknoir (trade), Machamp (trade), Slowking (trade), Rhyperior (trade), Steelix (trade), Gigalith (trade), Scizor (trade), Porygon2 (trade), Porygon-Z (trade), Trevenant (trade), Conkeldurr (trade), Milotic (trade)

## 7. Wave 2 candidate pool

- **Outskirts (Town edge)**: Nidoran♀ →Lv.16 Nidorina →Moon Stone Nidoqueen; Nidoran♂ →Lv.16 Nidorino →Moon Stone Nidoking; Spearow →Lv.20 Fearow; Sentret →Lv.15 Furret; Hoothoot →Lv.20 Noctowl; Taillow →Lv.22 Swellow; Pidove →Lv.21 Tranquill →Lv.32 Unfezant; Mankey →Lv.28 Primeape; Pikipek →Lv.14 Trumbeak →Lv.28 Toucannon; Yungoos →Lv.20† Gumshoos; Rookidee →Lv.18 Corvisquire →Lv.38 Corviknight; Skwovet →Lv.24 Greedent; Wooloo →Lv.24 Dubwool
- **Wild Zone Trail: Underpass stage**: Shroodle →Lv.28 Grafaiai; Wiglett →Lv.26 Wugtrio
- **Wild Zone Trail: District stage**: Woobat →friendship Swoobat; Tandemaus →special Maushold; Yamper →Lv.25 Boltund
- **Harbor District**: Poliwag →Lv.25 Poliwhirl →Water Stone Poliwrath ; Poliwhirl →trade Politoed; Goldeen →Lv.33 Seaking; Mareanie →Lv.38 Toxapex; Cetoddle →Ice Stone Cetitan; Binacle →Lv.39 Barbaracle; Wiglett →Lv.26 Wugtrio
- **Ember Quarter**: Larvesta →Lv.59 Volcarona; Salandit →Lv.33† Salazzle; Litleo →Lv.35 Pyroar; Sizzlipede →Lv.28 Centiskorch; Varoom →Lv.40 Revavroom; Capsakid →Fire Stone Scovillain
- **Greenline Terraces**: Seedot →Lv.14 Nuzleaf →Leaf Stone Shiftry; Petilil →Sun Stone Lilligant; Foongus →Lv.39 Amoonguss; Exeggcute →Leaf Stone Exeggutor; Paras →Lv.24 Parasect; Kricketot →Lv.10 Kricketune; Smoliv →Lv.25 Dolliv →Lv.35 Arboliva; Blipbug →Lv.10 Dottler →Lv.30 Orbeetle; Gossifleur →Lv.20 Eldegoss
- **Signal District**: Blitzle →Lv.27 Zebstrika; Tynamo →Lv.39 Eelektrik →Thunder Stone Eelektross; Helioptile →Sun Stone Heliolisk; Klefki; Dedenne; Tadbulb →Thunder Stone Bellibolt; Tinkatink →Lv.24 Tinkatuff →Lv.38 Tinkaton; Hatenna →Lv.32 Hattrem →Lv.42 Hatterene
- **Undercity / Old Lines / Terminus**: Poochyena →Lv.18 Mightyena; Purrloin →Lv.20 Liepard; Scraggy →Lv.39 Scrafty; Misdreavus →Dusk Stone Mismagius; Skorupi →Lv.40 Drapion; Hippopotas →Lv.34 Hippowdon; Greavard →Lv.30† Houndstone; Glimmet →Lv.35 Glimmora; Maschiff →Lv.30 Mabosstiff
- **The Sprawl**: Pancham →Lv.32† Pangoro; Minccino →Shiny Stone Cinccino; Togetic →Shiny Stone Togekiss; Snorlax; Stufful →Lv.27 Bewear; Spritzee →trade Aromatisse; Swirlix →trade Slurpuff; Falinks
- **The Underlight**: Ferroseed →Lv.40 Ferrothorn; Tyrunt →Lv.39† Tyrantrum; Amaura →Lv.39† Aurorus; Goomy →Lv.40 Sliggoo →Lv.50† Goodra; Frigibax →Lv.35 Arctibax →Lv.54 Baxcalibur; Orthworm
- **The Skyline (postgame)**: Vullaby →Lv.54 Mandibuzz; Hawlucha; Tropius; Flittle →Lv.35 Espathra; Bombirdier
- **The Long Shoal (postgame island)**: Corphish →Lv.30 Crawdaunt; Skrelp →Lv.48 Dragalge; Alomomola; Finizen →Lv.38† Palafin; Dhelmise
- **The Drowned Archive (postgame island)**: Anorith →Lv.40 Armaldo; Cranidos →Lv.30 Rampardos; Shieldon →Lv.30 Bastiodon; Tirtouga →Lv.37 Carracosta; Archen →Lv.37 Archeops; Sigilyph; Golett →Lv.43 Golurk; Munna →Moon Stone Musharna

## 8. Mega seeds

Wave 1 brings in fourteen species that have real Mega forms: Beedrill, Pidgeot, Slowbro, Steelix, Scizor, Tyranitar, Medicham, Lopunny, Sharpedo, Metagross, Aerodactyl, Glalie, Gallade and Latios. This plan only makes the species available. Each Mega still needs its data in `data/megas.js`, a stone, and a placement under MEGA.md's rules. The bible already commits Sharpedo and Metagross (Fathom's and Cairn's aces) and Latios (the Archive's single catch). The other eleven are options, not commitments.

## 9. What building this involves

Adding species is the easy part. These are the real dependencies:

- **Built (Phase 30):** the Pokédex, name-keyed zone tables, the permanent audit (`tools/audit-roster.mjs`), real learnsets and the move registry. What follows is the original problem statement.
- **The Pokédex is not a Pokédex.** `DexScene` lists the Pokémon you currently own and nothing else: no per-species seen and caught record, no paging. At 300 species it needs a real species dex, with seen and caught flags, dex numbers, paging, and a "where found" line drawn from this plan. That needs a new `state.dex`, with a migration that seeds it from an old save's party and box.
- **Zone tables are position-based.** They index into one flat species array, which caused Phase 28's Grubbin and Murkrow mix-up. They should be keyed by species name before 137 species go in.
- **Moves.** Each species spawns with two real moves from `data/moves.js`, which has about 60. Real learnsets mean growing that registry. PokeAPI has the move data, so the same tool approach works, but the engine only models four status conditions, so moves with other effects would be plain damage moves for now.
- **Level bands.** The bands in section 3 are the target. Shipped earlier tiers (Obsidian is Lv.32) have not moved up to meet them yet, and that rebalance is its own pass.

Proposed order once approved: the foundation first (name-keyed zones, the real Pokédex, a permanent roster audit check), then the 34 completions, then one zone at a time in story order, each with a spawn test. Each batch is generated with `tools/pokeapi-species.mjs` and verified against PokeAPI.

## 10. Decisions

1. **Wave 1 as drawn**, or rebalance toward Generations 6 to 9 now? — *Answered: wave 1 as drawn; wave 2 tilts toward Generations 6–9.*
2. **The evolution rules in section 6**, especially trades all using the Linking Cord and Eevee evolving by stones. — *Answered: approved.*
3. **Which Mega seeds** to actually build beyond Sharpedo, Metagross and Latios.
4. **Fossils as wild spawns** at the Drowned Archive. The game has no revival mechanic, so this is the simple version.
5. **"Enters as"**: keep the mechanical rule, or keep every stage of a line obtainable somewhere?
6. **Newer species.** Legends Z-A content is not in this plan. Its new Mega forms would not come from PokeAPI, so they would be hand-entered and checked separately. Say if you want them scoped.
