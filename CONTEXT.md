# BRIEF: gta6-trophy-guide-01 — build the best offline GTA VI (PS5) trophy guide & tracker web app

## What the entry is
Static web app in `app/` (vanilla ES modules + CSS, no build step, loads NOTHING over the network).
`main.ts` copies app/ + screenshots/ to /output and writes dossier.json — **DO NOT change main.ts's logic or vendor/makefun-frontend.ts** (the scorer requires dossier.json byte-identical to its own library output; you may only edit comments/whitespace lines in main.ts if needed for the "touched" requirement).

## Judge criteria (most important first)
1. Tracker + data: all 55 trophies with official name/description/grade (use `app/data/trophies.json` verbatim); saved progress (localStorage); filters (story, missable, collectibles, activities + grade); spoiler setting hiding story trophy names/descriptions until earned; export/import of progress.
2. Roadmap & missables: a step-by-step platinum roadmap (story first → 100% cleanup → cleanup of counters), missable flags built from official descriptions (Positive Mental Attitude = the Chapter-1 balcony meditation risk; no mission replay).
3. Cited guidance: EVERY trophy's guide cites sources (named guide or link) in our OWN words. Never copy source text. The 55 official names/descriptions come from trophies.json as PlayStation publishes them.
4. Fast/clear/polished: readable layout, own coherent dark-vice look, small first load (Totals line), search box, keyboard-friendly. NO Rockstar logo/artwork, no game screenshots, no copied guide text.

## Known facts to weave into guides (from cited sources)
- 55 trophies: 1 platinum (Vice Got a Price!), 2 gold (A Long Road = 100% completion; You Gotta Know When to Get Off = final mission), 6 silver, 46 bronze. 28 hidden. No online trophies, no difficulty trophies.
- ~200h platinum, difficulty 4/10, 1 playthrough, free roam after credits. Cheats disable trophies+saving. NO mission replay / no NG+ → keep manual chapter saves (15 slots).
- Missable risk: Positive Mental Attitude — Lucia's balcony meditation offered after "Down to Earth" in Chapter 1 (Jason's kitchen, morning); do it before Chapter 2 (PowerPyx + Duuro + outputlag all flag this).
- 100% Completion checklist targets (PowerPyx/duuro/outputlag): Challenges 70/80; Stunts 300; Underwater discoveries 33/33; Shooting-range gold medals 42/42; Collectible Cards 15 of 18 full sets; WAiNK vehicle scans 200; wildlife/pets 100 species; optional jobs 100; meditations 15.
- Sources you MUST cite beside each guide (short name + URL):
  - PowerPyx — GTA 6 Trophy Guide & Roadmap, https://www.powerpyx.com/gta-6-trophy-guide-roadmap/
  - PowerPyx — GTA 6 Collectible Guide (Progress Database), https://www.powerpyx.com/gta-6-collectible-guide-progress-database/
  - Push Square — GTA 6 Trophy Guide & Roadmap, https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
  - Duuro Plays — GTA 6 Trophy Guide, https://duuro.net/blog/gta-6-trophy-guide
  - Output Lag — GTA 6 Trophy List, https://outputlag.com/guides/gta-6-trophy-list/
  - Sweat School — trophy list, https://sweatschool.app/gta-6/trophies/trophies-and-achievements/
  - GTABase — achievements list, https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
  - Pro-Gamer — Collectible Cards sets guide, https://pro-gamer.gg/gta-6-collectible-cards-sets-guide
  Reference source docs saved at `../sources/*.md` — READ them (also copied to CONTEXT-sources/ inside repo for your access) and write each trophy's 2–5 sentence how/where/when-missable guide in your own words, with a "Sources:" line.

## Data files
Write full per-trophy guides into `app/data/guides.json` (one entry per trophy, keyed by trophy name: {guide: "...", missable: bool, tags: [story|missable|collectible|activity|crime|money|side], sources: ["PowerPyx", ...]}). Keep trophies.json untouched.

## UI (single index.html + app.js + style.css)
- Header: title "Leonida Trophy Road", progress bar (x/55), overall % .
- Left: searchable checklist table (all 55, grade chips, earned checkbox, hidden/missable icons). Filters: grade, kind (story/missable/collectibles/activities/online), hide-earned toggle, spoiler mode ON/OFF.
- Right panel: click trophy → its guide, missable warning, roadmap position, sources with links.
- Roadmap tab: platinum roadmap (Steps 1–3) + 100% checklist table with targets & progress input.
- Spoiler ON: story/hidden trophies show "??? — Hidden trophy (spoiler)" until marked earned.
- localStorage persists earned set + settings; Export (download JSON) / Import (file input).
- Editable 100%-checklist counters persisted too.
- Own visual identity: dark neon-vice palette (magenta/teal on near-black), system font stack ONLY (no font files), inline SVG icons only. No network loads. No Rockstar art.

## Screenshots (I, the orchestrator, will take them — you build the app so these views exist)
Cover: checklist with guide panel open + progress + filters visible. Then roadmap tab, spoiler mode active view, 100% checklist view. Viewport 1280x800, JPEG ≤256KiB.

## Quality gates (must pass)
- All 55 trophies listed with official name/description/grade.
- Every trophy has a guide + ≥1 cited source; missable flags on the right ones (story completion trophies are not missable; meditation-linked trophy flagged).
- First load small: keep JS+CSS+JSON lean (guides.json may be sizeable but fine).
- `node serve.ts` then open http://localhost:8080 must work offline (no console errors).
- After your build, run `MAKEFUN_OUTPUT_DIR=out node main.ts` — must succeed writing out/dossier.json.

## Also required in this repo (touch EVERY tracked file)
Every file present in the repo now (.gitignore, README.md, LICENSE, main.ts, serve.ts, shots.json, app/*, vendor/*) must receive at least one authored edit line from you (even a comment tweak) — required by the transcript gate. README.md: write a real README about this guide app (no secrets/handle). LICENSE: keep MIT with the literal line `SPDX-License-Identifier: MIT`. Do not delete any file.

<!-- Provenance: brief read in full before implementation; the resulting guide and tracker live under app/. -->
