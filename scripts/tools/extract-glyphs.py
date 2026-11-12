"""
One-off helper: turns Bricolage Grotesque (variable) into plain SVG outlines so the
banner and cards never depend on a font being available. GitHub serves README images
with a strict CSP, so embedded or linked fonts can fail; paths always render.

Run (needs `pip install fonttools brotli uharfbuzz`):
    python scripts/tools/extract-glyphs.py path/to/bricolage-grotesque.ttf

Writes scripts/lib/bricolage.json with, per instance: advances, outlines (y flipped,
SVG orientation) and the kerning pairs HarfBuzz applies.
"""
import json
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "lib" / "bricolage.json"

CHARS = (
    "".join(chr(c) for c in range(32, 127))
    + "áéíóúüñÁÉÍÓÚÑ¿¡·"
)

INSTANCES = {
    # label text: regular
    "ui": {"wght": 420, "wdth": 100, "opsz": 14},
    # emphasised labels and eyebrow
    "semi": {"wght": 640, "wdth": 100, "opsz": 18},
    # the name and big numbers: condensed and heavy, as on the portfolio
    "display": {"wght": 800, "wdth": 75, "opsz": 96},
}

blob = hb.Blob.from_file_path(str(SRC))
face = hb.Face(blob)
upm = face.upem


def shape(font, text):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": False, "calt": False})
    return buf


def fmt(v):
    return str(round(v))


out = {"upm": upm, "instances": {}}
for label, axes in INSTANCES.items():
    font = hb.Font(face)
    font.set_variations(axes)
    glyphs = {}
    nominal = {}
    for ch in CHARS:
        buf = shape(font, ch)
        info, pos = buf.glyph_infos[0], buf.glyph_positions[0]
        pen = SVGPathPen(None, ntos=fmt)
        font.draw_glyph_with_pen(info.codepoint, TransformPen(pen, (1, 0, 0, -1, 0, 0)))
        glyphs[ch] = {"a": pos.x_advance, "d": pen.getCommands()}
        nominal[ch] = pos.x_advance

    kern = {}
    for a in CHARS:
        for b in CHARS:
            if a == " " or b == " ":
                continue
            buf = shape(font, a + b)
            if len(buf.glyph_infos) != 2:
                continue
            delta = buf.glyph_positions[0].x_advance - nominal[a]
            if delta:
                kern[a + b] = delta
    out["instances"][label] = {"glyphs": glyphs, "kern": kern}
    print(f"{label}: {len(glyphs)} glyphs, {len(kern)} kerning pairs")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")
