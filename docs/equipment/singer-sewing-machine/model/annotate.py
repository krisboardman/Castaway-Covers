# /// script
# dependencies = ["pillow"]
# ///
"""Draw callout labels with leader lines onto a render from build_bu7.py.

  uv run annotate.py renders/bu7_exploded.png   ->  renders/bu7_exploded_labeled.png

Reads <render>.labels.json (part name + normalized image position). Labels go in
the left or right margin, whichever side the part is on, spread so none overlap.
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

src = Path(sys.argv[1])
anchors = json.loads(src.with_suffix(".labels.json").read_text())
img = Image.open(src).convert("RGB")
W, H = img.size
draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 26)
except OSError:
    font = ImageFont.load_default()

MARGIN, GAP, LINE = 40, 44, (90, 90, 90)
for side in ("left", "right"):
    group = sorted((a for a in anchors if (a["x"] < 0.5) == (side == "left")), key=lambda a: a["y"])
    ys, prev = [], -1e9
    for a in group:  # push labels down until they no longer overlap
        y = max(a["y"] * H, prev + GAP, MARGIN)
        ys.append(y)
        prev = y
    overflow = (ys[-1] if ys else 0) - (H - MARGIN)
    if overflow > 0:  # shift the whole column up if it ran off the bottom
        ys = [y - overflow for y in ys]
    for a, y in zip(group, ys):
        ax, ay = a["x"] * W, a["y"] * H
        text = a["name"].replace(" (front)", "")
        tw = draw.textlength(text, font=font)
        tx = MARGIN if side == "left" else W - MARGIN - tw
        elbow = tx + tw + 12 if side == "left" else tx - 12
        draw.line([(elbow, y), (ax, ay)], fill=LINE, width=2)
        draw.ellipse([ax - 5, ay - 5, ax + 5, ay + 5], fill=LINE)
        draw.text((tx, y), text, font=font, fill=(25, 25, 25), anchor="lm")

out = src.with_name(src.stem + "_labeled.png")
img.save(out)
print("LABELED", out)
