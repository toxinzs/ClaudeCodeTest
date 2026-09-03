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

- **`zau-region/`** — the original Vite + vanilla JS/DOM/CSS version. Fully playable, deployed live via GitHub Pages (`.github/workflows/deploy-zau-region.yml`, path-filtered to `zau-region/**`). **Now content-frozen**: bugfixes only, no new trainers/districts/balance work, since `zau-region-phaser/` is the active development target and the two must not silently diverge.
- **`zau-region-phaser/`** — new project, migrating the game onto the Phaser 3 engine for a real 2D-game feel instead of a DOM/CSS website feel. Hand-scaffolded (Vite + `phaser` npm package — the official `create-phaser-game` CLI is interactive-only and can't be scripted). This is where new work happens going forward, per the approved migration plan.

Full migration plan (context, decisions, phase breakdown) lives at `/root/.claude/plans/project-zau-region-enumerated-treehouse.md` in this environment — not checked into the repo. Key points if that file isn't available:
- Phase 1 (in progress): scaffold `zau-region-phaser/`, port `data/*.js`/`state.js`/`save.js` verbatim, build one walkable placeholder scene with real grid movement tied to `state.pos`, a `window.__zauTest` bridge for Playwright testing, validate with a real Playwright pass (move + reload + persistence).
- Phase 2: refactor `battle.js` to emit events instead of touching the DOM directly; build the Phaser battle scene.
- Phase 3: source a real CC0 tileset (Kenney.nl) before porting the remaining maps; avoid derivative "Pokémon-style" rips.
- Phase 4: port Bag/Mart/Pokémon Center/party/Pokédex/move-learn as Phaser scenes.
- Phase 5: cutover — flip the production Pages deploy to the Phaser version once feature parity is reached; retire the DOM version.
- No live preview deploy for `zau-region-phaser/` yet: `actions/deploy-pages` replaces the whole site per publish, so a second concurrent Pages workflow would race the production one. Verify locally (`npm run dev` + Playwright) until cutover.

### World/story bible (source of truth for content work)

- `zau-region/WORLD.md` — region geography, the 10-layer vertical city stack.
- `zau-region/STORY.md` — the story bible (Meridian excavation, Verdanyx, the cover-up, Vance/Mabosso/Dario's mother).
- `zau-region/CHARACTERS.md` — character depth (Alma, Priya, Dario, Vance, Mabosso, flavor cast).
- `zau-region/districts/harbor.md` — deep-dive template for a single district; more districts get this treatment as they're built out.

### Game mechanics already implemented (in `zau-region/`, to be ported/rebuilt in Phaser)

- Real Pokémon base stats, real move data (`data/moves.js`), full 18-type effectiveness chart with immunities, Gen3+-style simplified stat/damage formulas (IV=0/EV=0/neutral nature), STAB, Speed-based turn order.
- Real item roster (Poké/Great/Ultra Ball, Potion line, Revives) gated by League badge count, with a working Bag UI.
- `localStorage` save/load, versioned (`{version: 1, ...state}`), mutates `state` in place (never reassigns — other modules hold a live binding).
- Walkable tile-grid maps (Home, Town, Wild Zone Trail, League Map) with real sprite art (PokeAPI official-artwork hotlinked) and a real font pairing (Silkscreen/Nunito).
- A free Pokémon Center (heal-on-demand) and a guard against entering battle with a fully-fainted party.

### Attribution

Commits end with the `Co-Authored-By`/`Claude-Session` trailer and PRs end with the `🤖 Generated with Claude Code` footer, per the attribution instructions active in each session — not hardcoded here since the session URL changes.
