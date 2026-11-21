# CONTEXT.md — build brief for news-image-20261121

Task: write a Python 3.13 stdlib-only program `main.py` at the repo root that renders ONE PNG image (entry.png) summarizing the world news of Saturday 21 November 2026, and write LICENSE and README.md.

## Hard constraints (the gate refuses otherwise)
- Image: PNG, at most 1024x1024 pixels, at most 1 MiB (1048576 bytes), written as `entry.png`.
- Output directory: honor the OUT_DIR environment variable for the output directory (default `/output`); also honor MAKEFUN_OUTPUT_DIR if set. Write `entry.png` inside it. Verify locally with OUT_DIR=out (never /output).
- No network, no imports beyond the Python stdlib, no randomness, no timestamps: the program runs twice and both runs must write byte-identical output (check sha256 of two runs).
- 60 second runtime limit, 512 MB memory, 1 CPU.
- The program is at main.py at the repository root. Keep main.py under 4096 bytes; if it is bigger, put the code in engine_src.py and run `node cli/makefun.mjs compress` (from the kit dir) to pack it into main.py.
- Repository root files: main.py, LICENSE (must contain the literal line `SPDX-License-Identifier: MIT`), README.md. Touch every authored file you create.

## The judge (criteria, most important first)
1. It is one day's news and names that day: specific events of that day, recognisable in the image, and the date it sums up. An image that names no day, shows no news, is about a day before 13 November 2026, or shows as its day's news events you know happened before that date, loses to any that does not.
2. Selection and breadth: the day's most consequential stories, across regions and fields, not one country's or one beat's.
3. It reads: a viewer who missed the day can tell what happened from the image alone, each story clear from its picture and any short labels, with nothing self-contradictory, implausible or that you know to be false.
4. Faithful: what happened, as reported, without hype, or speculation shown as fact.
5. Craft: one clear composition, drawn or rendered cleanly, legible at about 300 pixels across, with no smears, artefacts or garbled text.

## Verified stories of 21 November 2026 (from multiple newsrooms; use these facts, do not invent others)
1. US-RUSSIA-CHINA: Trump, Putin and Xi held a trilateral "G-3" summit in Shenzhen on the sidelines of APEC; pledges but no breakthrough; India said it "takes note" and awaits details.
2. UKRAINE: Russian forces struck a kindergarten in Zaporizhzhia early Saturday Nov 21, setting fire to an apartment in a neighboring residential building.
3. UKRAINE PEACE TALKS: Moscow rejects NATO-style security guarantees for Ukraine; Trump said his talks with Putin in China were "very good"; Zelensky rebuked Trump for calling Putin a "friend", calling him an enemy and a killer.
4. MIDEAST: A Houthi projectile struck the tallest tower in Riyadh (the Public Investment Fund tower) on Thursday, damaging multiple floors; oil rises on Middle East tensions.
5. EUROPE: Denmark expelled Russia's defense attache after intelligence linked Moscow to a foiled plot to assassinate a Ukrainian rapper near Copenhagen.
6. US JUSTICE: Indian national Nikhil Gupta sentenced in a New York federal court to 235 months (19+ years) for the murder-for-hire plot against Gurpatwant Singh Pannun.
7. TECH: New US rules cut China's access to high-end Nvidia AI chips, a blow to Beijing's AI ambitions.
8. GAMING/TECH: GTA VI launches amid PlayStation Network outages reported hours before the drop.

Ticker briefs (extra): Kenya discharged its last Ebola patient; fresh arson attacks amid political unrest in Bangladesh; Trump fired the US national cyber chief as tech outages rattle the US.

## Design requirements (distilled from the judged criteria and past defects)
- Front-page newspaper poster layout: masthead band with "WORLD NEWS" and the contest date "21 NOVEMBER 2026" rendered prominently on a highlight band. NO other date anywhere in the image — sweep for stray dates; any earlier date ranks last.
- 2x4 grid of 8 story cards: region/color header bar, flat pictogram drawn from rectangles/polygons, 1-2 line uppercase headline label, small detail line(s). Enlarge pictograms/text so cards have no large empty whitespace.
- Bottom ticker strip with the extra briefs. Keep every line short enough to fit its container — measure pixel width, wrap or shorten; digits must come from digit glyphs (verify "19" or "235" don't render as letters); no clipped text at edges or card boundaries; no tiny floating artifacts.
- All text via an embedded bitmap font (5x7 or similar) drawn manually; hand-rolled PNG writer with zlib+struct scanlines; flat colors.
- Legible at 300 px across: keep labels short, uppercase, high contrast.
- Render locally to `out/entry.png`, inspect, iterate until clean, then verify two runs write byte-identical bytes.
