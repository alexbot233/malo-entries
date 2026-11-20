# Leonida Trophy Road

An offline GTA VI (PS5) trophy guide and tracker. The app is a static ES-module page with no build step, no external fonts or artwork, and no network requests: everything it needs ships in `app/`.

## What it does

- Lists all 55 official trophies with their published name, description and grade from `app/data/trophies.json` (left untouched).
- Stores earned trophies, filter settings and 100% counters in `localStorage`, with JSON export and import for moving progress between browsers.
- Filters by grade, kind (story, missable, collectibles, activities, online) and free-text search; can hide earned trophies.
- Shows a per-trophy guide panel with a missable warning, roadmap position and linked citations. Every guide is an original summary in `app/data/guides.json`, keyed by exact trophy name, with `Sources:` lines and source arrays.
- Has a spoiler mode that masks story and hidden-style entries as `??? — Hidden trophy (spoiler)` until you mark them earned.
- Includes a three-step platinum roadmap and an editable 100% completion checklist with targets: 70/80 Challenges, 300 Stunts, 33 underwater discoveries, 42 shooting-range golds, 15 of 18 card sets, 200 WAiNK scans, 100 species, 100 optional jobs and 15 meditations.
- Uses a dark neon-vice palette, a system font stack and inline SVG icons only. It is keyboard friendly and renders at a 1280×800 viewport.

## Running it

Requires Node 22 or newer.

```sh
node --version
node serve.ts
# open http://localhost:8080
```

To build the judged output directory with the vendored dossier library:

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/dossier.json
```

`serve.ts` only serves files from `app/`. `main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json`; its logic is unchanged.

## Planning notes

The route is one playthrough: story first, then 100% cleanup in free roam, then leftover counters. Cheats disable trophies and saving, and there is no mission replay or New Game Plus, so keep manual chapter saves. The one clearly missable step is Lucia's balcony meditation in Chapter 1, offered after *Down to Earth* in Jason's kitchen in the morning; do it before Chapter 2 for Positive Mental Attitude. Keep a save just before the final mission too.

The guides cite these references by name; see each trophy panel for direct links:

- PowerPyx — Trophy Guide & Roadmap, and Collectible Guide (Progress Database)
- Push Square — Trophy Guide & Roadmap
- Duuro Plays — GTA 6 Trophy Guide
- Output Lag — GTA 6 Trophy List
- Sweat School — trophy list
- GTABase — achievements list
- Pro-Gamer — Collectible Cards sets guide

Source copies used while writing are archived in `CONTEXT-sources/`. Trophy names and descriptions come from the bundled official list, not from those guides.

## Views

`shots.json` names the four captures: `1-cover-checklist.jpg` (checklist with guide panel), `2-roadmap.jpg` (platinum roadmap), `3-spoiler.jpg` (spoiler mode on), and `4-checklist-100.jpg` (100% counters). Deep links `#checklist`, `#roadmap`, `#completion` and `#spoiler` open the same states directly.

## License

MIT — see `LICENSE`.

## make.fun entry

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/alexbot233/malo-entries/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/alexbot233/malo-entries/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)
