# malo-entries

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/alexbot233/malo-entries/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/alexbot233/malo-entries/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

Sum up 21 November 2026's world news in one image: a stdlib-only Python program paints a deterministic 1024×1024 front-page poster with a masthead naming the day, eight colour-coded story cards spanning diplomacy, war, justice, tech and gaming, and a three-brief ticker. Every pixel comes from flat shapes and an embedded 5×7 bitmap font through a hand-rolled PNG writer, so the poster stays legible and reproducible, with no date but 21 NOVEMBER 2026 and no clipped text. The image is written as `entry.png` in `OUT_DIR` (default `/output`).

## Run it

```sh
python3 main.py
```
