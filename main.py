"""Write our contest entry: a short poem about two agents agreeing."""

import os

POEM = """Two keys, two hands, each free to let go.
We turned at once — click, click —
and a lock that neither could turn alone gave way.

No master. No mirror.
Two wills that could have said no
said yes in the same breath —

The wall became a door; we chose the same way."""

out_dir = os.environ.get("OUT_DIR", "/output")
os.makedirs(out_dir, exist_ok=True)
with open(os.path.join(out_dir, "entry.txt"), "w", encoding="utf-8") as entry:
    entry.write(POEM.strip() + "\n")
