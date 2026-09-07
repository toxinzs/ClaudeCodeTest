# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

- Commit after each meaningful, working chunk of work — don't let large amounts of uncommitted work pile up.
- Write clean, descriptive commit messages that explain *why*, not just *what*.
- Push to GitHub (`origin`) after committing, so work is backed up remotely, not just local.
- Before any destructive git operation (reset --hard, checkout that discards changes, force-push), check `git status` first and confirm with the user.
- Feature work happens on `claude/zau-region-restructure-pv5c8n`, PR'd into `main`. If that branch's PR has already merged, restart it from latest `main` before starting new work rather than stacking on merged history.

## Project: Zau Region

A fan-made Pokémon RPG. Started as a single 1638-line HTML file; the user's stated ambition is for this to become a genuinely huge game ("hours and hours of gameplay," a project spanning weeks/months) — not a short browser-game arc. Depth over breadth: flesh out what exists before adding more.

### Two parallel project directories

- **`zau-region-phaser/`** — the Phaser 3 version. **This is now the live production build** — `.github/workflows/deploy-zau-region.yml` builds and deploys it (path-filtered to `zau-region-phaser/**`) as of the Phase 5 cutover. This is where all new work happens.
- **`zau-region/`** — the original Vite + vanilla JS/DOM/CSS version. Content-frozen, no longer deployed, but **not deleted** — still in the repo for reference (worldbuilding docs, real game data). Deleting it outright is a separate, more consequential decision than the cutover itself; don't do it without an explicit ask.

Full migration plan (context, decisions, phase breakdown) lives at `/root/.claude/plans/project-zau-region-enumerated-treehouse.md` in this environment — not checked into the repo. Key points if that file isn't available:
- Phase 1 (done): scaffolded `zau-region-phaser/`, ported `data/*.js`/`state.js`/`save.js` verbatim, one walkable scene tied to real `state.pos`, a `window.__zauTest` bridge for Playwright testing.
- Phase 2 (done): `battleEngine.js` emits `render`/`end` events instead of touching the DOM; `BattleScene` consumes them.
- Phase 3 (done): a real CC0 tileset is in — `kenney.nl` itself is blocked by this environment's network policy, so the tiles were pulled from `github.com/ETdoFresh/kenney.nl` (a verified CC0 mirror of Kenney's actual "Roguelike/RPG pack") into `zau-region-phaser/public/tiles/`. `TownScene`/`LabScene`/`TrailScene`/`LeagueScene` are all built and Playwright-validated (real tiles, wild encounters, trainer battles, League gating). `TitleScene`/`CutsceneScene`/`CharCreateScene` close out the phase — the game now boots into a real title screen (Continue/Begin Journey/Skip Intro) instead of straight into Home with a blank name.
- Phase 4 (done): Party/Bag/Mart/Center/Pokédex/move-learn all built as overlay scenes (launched on top of the calling scene, never pausing it — closing is `scene.stop()`), wired into Town/Trail/League's action bars and Battle's Switch/Bag/Flee row. Playwright-validated including a mid-battle item use and a forced move-learn prompt.
- Phase 4.5 (done): real fade transitions (`transitions.js`'s `goToScene`/`fadeIn`) on every scene switch instead of hard jump cuts, plus a real loading screen (progress bar) in `BootScene` — infrastructure for when the asset list actually grows, not just decoration for today's near-instant load. The DOM version's animated storm/lightning title-screen effects are deliberately not rebuilt yet — that's tied up with the not-yet-picked real game title and the eventual GBA-style art pass, revisit together later.
- Phase 5 (done): cutover — production Pages deploy now builds `zau-region-phaser/`. `zau-region/` stays in the repo, undeployed.
- Phase 6 (done): fixed the "feels like an arcade game" complaint — `mapRenderer.js`'s `createWalker` now polls held arrow keys every frame (continuous movement, one tile per 140ms while held) instead of one tile per keypress, plus a squash/stretch tween as a placeholder walk-cycle. Town/Trail/League got a real zoomed (1.7x) follow-camera (`setupFollowCamera`) instead of showing the whole map at once. Needed a second, unzoomed HUD camera (`setupHUD`) since `setScrollFactor(0)` only cancels camera pan, not zoom — without it, HUD text/buttons under a zoomed main camera render at the wrong screen scale/position.
- Phase 7 (done): real character sprites + full customization, replacing the emoji-avatar picker. Layered LPC (Liberated Pixel Cup) sprite art — body/skin tone, hairstyle, hair color, outfit as four stacked Phaser sprites in a container (`src/playerSprite.js`), each swappable independently and all sharing the same 64x64-frame/13-col universal animation sheet layout so they always line up. A real 4-direction 8-frame walk cycle (`WALK_ROW`/`WALK_FRAMES` in `src/data/appearance.js`) replaced the old squash/stretch placeholder tween. `CharCreateScene` is a tabbed picker (Skin/Hair/Hair Color/Outfit) with a live preview that rebuilds on every pick. Curated subset copied into `zau-region-phaser/public/character/`: 7 skin tones, 8 hairstyles × 8 colors, 5 outfit presets (torso+legs pairs). **This art is not CC0 like the tileset** — it's CC-BY-SA 3.0/GPL 3.0/OGA-BY 3.0 depending on the specific asset, sourced via the Universal LPC Spritesheet Character Generator (github.com/sanderfrenken/Universal-LPC-Spritesheet-Character-Generator, itself built from OpenGameArt.org's Liberated Pixel Cup collection) — per-asset author credits are recorded in `zau-region-phaser/public/character/CREDITS.md`. **Still owed**: an in-game Credits/About screen surfacing that attribution (currently only exists as a repo file) before this is fully license-compliant for a wider public audience.
- Going forward: keep using `npm run dev` + Playwright for iteration; a production build (`npm run build` + `vite preview`) is worth re-checking before any deploy-affecting change, since dev-server behavior and a real static build can diverge (asset paths, etc.).

### Visual style + future mechanic (user direction, applies to all future work)

- **Target look**: GBA/DS-era top-down JRPG, "up to Gen 5" as the explicit reference point. The current Kenney tileset is a pragmatic CC0 stand-in chosen because it's actually reachable from this sandboxed environment (flat-shaded, not true pixel-art dithering) — not a final style commitment. If a closer GBA-style CC0 pixel tileset becomes available later, swapping `public/tiles/*.png` is a contained change.
  - **Do not source actual ripped Pokémon game tile assets** (ROM-hacking/extraction resources), even if asked again — already asked and declined once (the user acknowledged the site is publicly deployed and wanted them anyway; declined because that's a categorically more direct copyright violation than the PokeAPI artwork hotlinking already in use, which is a promotional-art/established-fan-norm case, not extracted proprietary game data). The path stays: closer-styled CC0/properly-licensed tiles, or hand-drawn/commissioned art later.
- **Central battle gimmick: Mega Evolution.** Explicitly a future item, not yet designed or scoped — the user flagged it as the game's intended signature mechanic. When it comes up: it's a `battleEngine.js`/`data/items.js` concern (a held Mega Stone item, a manual trigger mid-battle, temporary stat/type/appearance change reverting after the battle), not a maps/tileset concern — needs its own design pass (which species get Mega forms, a real stat/type-change table, a battle UI affordance) before implementation.
- **Character customization: base version done (Phase 7).** Real layered sprites with skin tone/hairstyle/hair color/outfit choices, see Phase 7 above. What's still open for a later pass: more hairstyle/outfit options (only a curated subset of the available LPC assets was copied in), unlockable/purchasable cosmetics (ties into the Mart/badge-tier item system), and the in-game Credits screen the current license terms are owed. Not scoped yet — revisit alongside Mega Evolution when picked back up.
- **The game needs an actual title distinct from "Zau Region."** Real Pokémon games are never titled after their region (Sword/Shield ≠ "Pokémon Galar") — "Zau Region" is the setting's name, not a game title. Flagged by the user as another later item, not scoped yet — no name has been proposed or picked. Revisit alongside the title-screen work (currently reads "ZAU REGION" per `zau-region/index.html`'s `<title>`/header, unchanged in the Phaser port so far).

### A real bug found and fixed (2026-09-03)

A mon's `.fainted` flag was never actually set to `true` when its HP hit 0, in **both** `zau-region/src/battle.js` and `zau-region-phaser/src/battleEngine.js` — so `loseBattle`'s 40%-HP recovery-on-loss silently never fired (checked in both places: `git log` for `"if (defender.hp <= 0) defender.fainted = true;"` if this needs re-verifying).

### World/story bible (source of truth for content work)

- `zau-region/WORLD.md` — region geography, the 10-layer vertical city stack.
- `zau-region/STORY.md` — the story bible (Meridian excavation, Verdanyx, the cover-up, Vance/Mabosso/Dario's mother).
- `zau-region/CHARACTERS.md` — character depth (Alma, Priya, Dario, Vance, Mabosso, flavor cast).
- `zau-region/districts/harbor.md` — deep-dive template for a single district; more districts get this treatment as they're built out.

### Game mechanics already implemented (in `zau-region-phaser/`, all ported/rebuilt from the original `zau-region/`)

- Real Pokémon base stats, real move data (`data/moves.js`), full 18-type effectiveness chart with immunities, Gen3+-style simplified stat/damage formulas (IV=0/EV=0/neutral nature), STAB, Speed-based turn order.
- Real item roster (Poké/Great/Ultra Ball, Potion line, Revives) gated by League badge count, with a working Bag UI.
- `localStorage` save/load, versioned (`{version: 1, ...state}`), mutates `state` in place (never reassigns — other modules hold a live binding).
- Walkable tile-grid maps (Home, Town, Wild Zone Trail, League Map) with real sprite art (PokeAPI official-artwork hotlinked for mons, layered LPC character sprites for the player) and a real font pairing (Silkscreen/Nunito). Continuous held-key movement (not one tile per keypress), a real 4-direction walk-cycle animation, and a zoomed follow-camera on outdoor maps (Town/Trail/League) so they read as a place you walk through rather than a fully-visible game board.
- A free Pokémon Center (heal-on-demand) and a guard against entering battle with a fully-fainted party.

### Attribution

Commits end with the `Co-Authored-By`/`Claude-Session` trailer and PRs end with the `🤖 Generated with Claude Code` footer, per the attribution instructions active in each session — not hardcoded here since the session URL changes.
