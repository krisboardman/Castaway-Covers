# Castaway Covers — Calculator Conventions

This file is the rulebook for every cover calculator in this folder. When you
work on any calculator HTML file here, follow these conventions unless the user
explicitly asks for an exception.

Each calculator produces two diagrams:

- **Cut diagram** — shows ONLY where the material gets cut. Panel outlines,
  notches, corner cutouts. No hardware. No snaps. No grommets. No bungee tabs.
- **Assembly diagram** — shows the finished cover laid flat with every piece of
  hardware placed: snaps, grommets, bungee tabs, seams, dimensions.

This split is strict. Never draw snap dots, grommet rings, or bungee tabs on
the cut diagram.

---

## Color palette

| Element | Fill | Stroke | Style |
|---|---|---|---|
| Fabric drape (cover polygon) | `#eef2ff` | `#0f172a` | solid 2px |
| Drape-zone grid lines | — | `#94a3b8` | dashed `6,4`, 1.5px |
| Furniture footprint zone (couch/grill/table footprint inside the cover) | `#f0fdf4` | `#16a34a` | dashed `6,4`, 1.5px, label in bold `#166534` |
| Corner drape indicators | — | `#94a3b8` | dashed `6,4` |
| Center seam | — | `#9333ea` | dashed `8,3`, 2.5px |
| Real cut lines | — | `#dc2626` | solid 2–3px |
| Reference lines (e.g. back table line — NOT a cut) | — | `#0891b2` | dashed `6,3`, 2px; always label "reference only — do not cut" |
| Grommets | none | `#b45309` | hollow ring r=6 with r=2 dot inside |
| Snap stud (male half) | `#22c55e` | `#166534` | solid circle r=4 or r=5 |
| Snap socket (female half) | `#db2777` | `#831843` | solid circle r=4 or r=5 |
| Bungee tab body | `#0ea5e9` @ 0.6 opacity | `#0369a1` | see "Bungee tab" section |
| Overlap flap | `#fde68a` @ 0.55 | `#d97706` | dashed `5,3`, 1.5px |
| Cut-line indicator (sectional) | — | `#f97316` (orange) | dashed `10,4`, 2.5px |
| Overall dimension labels | `#0f172a` (black) | — | bold 13px |
| Sub-dimension labels | `#64748b` (slate) | — | bold 10px |
| Hardware labels (grommet/snap/tab) | matching family color | — | bold 9px |

Colors NOT to use without checking first: anything that clashes with the above.
Especially avoid using a green other than `#22c55e/#166534` (reserved for snap
studs) or a magenta/pink other than `#db2777/#831843` (reserved for snap
sockets).

---

## Snap system

**Every snap is a mating pair: 1 stud + 1 socket.** ("Stud" is the male half
with the post; "socket" is the female half with the receiving ring. Use the
**stud** and **socket** labels in all user-facing text — never "male" or
"female" — these are the manufacturing terms the installer recognizes.)

- Stud = green (`#22c55e` fill / `#166534` stroke)
- Socket = magenta (`#db2777` fill / `#831843` stroke)

### Corner snap pairs (couch back corners, grill island corners, etc.)

- Each corner shows **two dots**: one stud, one socket. They mate when the
  corner folds inward.
- Convention: `sA` returned by `*CornerSnaps()` functions is the **stud**;
  `sB` is the **socket**. Keep this consistent so the dimension annotations
  line up.
- **Placement rule (standard)**: 2" in from the relevant dotted reference line,
  centered along that line.

### Multi-snap zones (connecting snaps)

When a strip of snaps connects two cover pieces:
- **Main piece carries the studs (green)**
- **Short / opposite piece carries the sockets (magenta)**

This applies to the sectional connecting snaps along the arm edge.

**Place connecting snaps CENTER-OUT, not evenly distributed.** The main piece's
studs run along the front over the cut-line distance; the short piece's sockets
run along the connecting side over its cushion depth. Those spans differ (e.g.
23" vs 37"), so distributing N snaps evenly across each span gives different
spacings that can't mate. Instead:
- Put one **center snap** at the middle of each piece's connection (main:
  midpoint of the cut-line→arm overlap; short: middle of the cushion depth).
- Step out symmetric pairs at a **fixed spacing** (currently `SNAP_SPACING_IN`
  = 6").
- **Cap the count by the narrower connection** (the main's cut-line distance):
  `eachSide = max(1, floor((cutLineDist/2) / spacing))`, total
  `1 + 2*eachSide`. Both pieces use the same count + spacing, so the installer
  just aligns the two center snaps and every pair lines up 1:1.

**Note: the overlap flap on a sectional has NO outer-edge snaps.** It is sewn
to the main cover at its inner edge only; its outer edge hangs free over the
joint. The flap's weight + draping directs water away on its own. If a customer
reports the flap lifting in wind, snaps can be added during a follow-up visit
once the as-built alignment can be marked directly — they're not added during
manufacturing because the horizontal alignment between main and short pieces
isn't precise enough to pre-mark.

### Where snaps appear

- **Assembly diagram**: yes, with proper colors and dimension annotations.
- **Cut diagram**: no. Never. If you see snap-drawing code in a cut diagram
  function, it's a bug — remove it.

### Snap descriptions in the results card

When writing snap counts or instructions in the right-hand results card, use
inline color pills that match the dots:

```html
<strong style='color:#166534'>studs</strong>
<strong style='color:#831843'>sockets</strong>
```

This lets the user match descriptions to dots in the diagram at a glance.

---

## Grommet system

- Visual: hollow amber ring (r=6, stroke `#b45309` width 2.5) with a small
  filled center dot (r=2, fill `#b45309`).
- Labels: `G1`, `G2`, `G3`, `G4` on the left side only (right mirrors left).
- **Standard placement**: 5" from the nearest corner along the hem, 2/3 of the
  drape depth in from the hem (or 1/3 of the drape depth, depending on which
  end is being measured — match the calculator's existing convention).
- Lives on the assembly diagram only.

---

## Bungee tab

A bungee tab is a folded strip of fabric forming a loop, hemmed (sewn) to the
cover. The bungee threads through the loop.

**Orientation matters:**
- **Hem end** (the sewn edge) faces the cushion-top side of the drape.
- **Loop end** (where the bungee threads through) faces the ground side.

In a flat layout where the back hem of the cover is at the top of the diagram
(ground side when worn), the loop end is drawn at smaller y (top of the tab
shape) and the hem end at larger y (bottom).

**Visual:**
- Vertical strip, ~14 px wide, ~18 px tall.
- **Hem end**: thick horizontal line (stroke 2px) with three short stitch ticks
  just below it.
- **Loop end**: rounded arch with a small horizontal white ellipse inside
  showing where the bungee passes through.
- Body color: `#0ea5e9` at 0.6 opacity, stroke `#0369a1` 1.2px.
- Labels on the LEFT tab only (right mirrors): "loop" near the top, "BT" in
  the middle (bold 10px), "hem" near the bottom.

Do NOT use a symmetric diamond. That was the old shape; it didn't convey
orientation.

---

## Real cuts vs reference lines

This distinction matters because the manufacturer reads these diagrams and
acts on them.

- **Red `#dc2626` solid 2px** = cut this. Material gets removed.
- **Teal `#0891b2` dashed `6,3` 2px** = reference line. Material stays
  intact. The line marks where something is (a table edge, a furniture
  feature, etc.) so the installer can orient the cover correctly.

When you draw a reference line, the surrounding UI (legend, results-card row,
descriptive note) must explicitly say "reference only — do not cut" or similar.
Don't rely on the color alone — write it in words too.

---

## Furniture footprint zone

The rectangle inside the cover polygon representing the furniture (couch top,
grill island top, table top, etc.):

- Fill `#f0fdf4`, stroke `#16a34a` dashed `6,4` 1.5px.
- Label inside: piece type in bold dark green `#166534`, dimensions below
  (e.g., `COUCH` / `50" × 30"`).
- Distinct from drape-zone grid lines (which are plain gray dashed at
  `#94a3b8`). The footprint is a CONTAINER for the furniture; the grid lines
  are subdivisions of the drape areas.

---

## Cut diagram rules

The cut diagram shows the bolt layout — fabric bolts as outer rectangles,
panel polygons inside.

- Red lines = the actual cut path. The polygon outline determines this.
- Scrap = the part of the bolt outside the polygon, shaded gray
  `#cbd5e1` at 0.8 opacity.
- Notches (sectional flap) and corner cutouts ARE material cuts — show them.
- Hardware (snaps, grommets, tabs) is NOT a material cut — do not show them.
- Zone labels along the panel ("side drop", "back inset", "taper", "front")
  in slate `#64748b` bold 10px.

---

## Sectional / two-piece covers

For an L-shape sectional with a main piece and a short piece:

- **Main piece's connecting side = same side as the short arm** (right or
  left, per the user's `sideSelector`). Annotations go on the matching bolt.
- **Short piece's connecting side = OPPOSITE of main.** This means
  `boltIndex` for the short piece is the **opposite** of what it is for the
  main piece. Flip it.
- **Main piece's connecting side is STRAIGHT in BOTH diagrams.** The connecting
  half drapes flat down the short couch — no taper, no front-corner diagonal.
  The outer edge widens from the back to full mid-width over the side drop, then
  holds that width straight to the front floor (a clean 90° corner at the
  bottom). The assembly diagram does this via `mainArmStraight*`; the cut
  diagram must match it on the connecting bolt (and its extension, which becomes
  a near-rectangle running all the way to the front floor, not the tapered
  free-side extension shape). The OUTER (free) side keeps the normal taper +
  front-corner diagonal.
- **Connecting bolt's polygon shape** on the short piece is an **L-shape**
  (rectangle minus the front-outer corner cutout) — NOT the tapered shape with
  diagonal cuts. The straight edge matches the assembly diagram's straight
  connecting edge.
- **Connecting side drops only its FRONT grommet; it keeps a back grommet + a
  back bungee tab.** A full front-to-back bungee is too long, so the bungee runs
  front-to-back on the **outer (free) side only** (front grommet → back tab →
  back grommet, as normal). The connecting side instead gets a short **joint
  bungee** that hooks across the seam, from this piece's connecting back grommet
  to the OTHER piece's back grommet, securing the back corner of the joint. So
  each sectional piece = **3 grommets + 2 back bungee tabs + 1 front-to-back
  bungee** (plus it shares the joint bungee). Joint-bungee length is set on-site
  (it depends on the as-built gap), not computed.
  - **Outer side** (= opposite the connecting side): back grommet + front
    grommet + back tab, at the standard positions. Labels **G1** (back),
    **G2** (front), with full dimension lines.
  - **Connecting side**: back grommet + back tab, **no front grommet**.
    Labelled **G3**.
    - **Main piece**: connecting back grommet stays at the standard back-corner
      position (`gromBackHorizFromCenter` from center).
    - **Short piece**: connecting back grommet is the **JOINT grommet**,
      relocated to **5" inboard of the JOINT — i.e. the couch footprint edge
      `furnX` (where the connecting snaps sit), NOT the straight drape edge**
      (`furnX + 5"` or `furnX + furnW − 5"`), at the standard back inset. Its
      tab moves with it. Dimension it as `5" from joint edge`, not from center.
      (The drape edge `saLeftX`/`saRightX` is much further out than `furnX`; the
      grommet belongs near where the two couches actually meet.)
  - Connecting side for the main = `sideSelector`; for the short = the opposite.
- **Mating snaps**: main carries studs, short carries sockets
  (see "Multi-snap zones" above).
- **Overlap flap**: sewn (NOT snapped) 1" in from the inner edge of the flap
  on the main piece. **No outer-edge snaps** — the flap hangs free over the
  joint and is held by gravity / fabric weight. See the "Multi-snap zones"
  note above for the reasoning.

---

## Layout rules

- **Mirror-aware dimensions**: grommet dimensions on the LEFT side, snap
  dimensions on the RIGHT side. Each measurement is shown once; the user
  understands the right side mirrors the left.
- **Overall dimensions** (assembled width, panel length, etc.) on the outer
  perimeter of the diagram with arrow markers.
- **Sub-dimensions** (back drop, taper, front) on the same edge as separate
  smaller-font slate arrows.
- **Orientation**: every diagram must label which side is FRONT and which is
  BACK. Use `▲` / `▼` arrows pointing TOWARD the side being labeled
  (e.g., `▲ BACK` at the top, `▼ FRONT` at the bottom, or whatever orientation
  the calculator uses — just make sure the labels are unambiguous).
- **Center seam**: vertical dashed purple line down the middle when the cover
  is split into two mirrored halves, labeled with the seam overlap inches.

---

## Standard placement measurements (cheat sheet)

| Hardware | Position |
|---|---|
| Corner snap (each half) | 2" in perpendicular from the dotted reference line, centered along it |
| Grommet | 5" from the nearest corner, 1/3 or 2/3 of the drape depth in from the hem |
| Overlap flap sew line | 1" in from the inner edge of the flap |
| Overlap flap outer edge | hangs free — no snaps (see Sectional rules) |
| Bungee tab hem | 2" into the back drape from the back fold line |
| Bungee tab length | ~3" (so the loop sits ~3" away from the hem, toward the ground) |
| Floor clearance | as input by the user (always honor this — don't hard-code) |

---

## Hem allowance — default to 0

Production covers don't use hems. Bottom edges are cut with wave-pattern
scissors instead, which prevents fraying without folding any material under.

Every calculator that exposes a "Hem allowance" input must default it to `0`
so the formulas (which still add `hem` in many places) contribute zero on a
fresh quote. Keep the input field around for back-compat — don't delete it —
because some formulas reference `hem` and yanking it would require touching a
lot of math. Setting the default to 0 gets the same result without disturbing
the formulas.

If you create a new calculator, don't add a "Hem allowance" input at all.
Drop `hem` from any formula in new code.

---

## Common UI elements

- **Legend** beneath each diagram showing a chip per concept matching the
  drawn colors. Always include separate chips for snap studs and snap sockets
  when any are drawn.
- **Results card** on the right-hand side with rows for each measurement /
  count, with inline color pills for snap mentions, and an explanatory note
  beneath each row.

### Grommet description (standard format, every calculator)

Always tell the user **how many grommets** there are and **how long** the
bungee is (if a bungee is used). Format:

```html
<div class='row'><span>Total grommets</span><strong>8 — 4 per long side</strong></div>
<div class='row'><span>Bungee length</span><strong>2 pieces × 64"</strong></div>
```

If the layout uses one bungee per side (the standard), say so. If it differs
(one bungee around the whole cover, no bungee at all, etc.), call that out
explicitly.

### Corner snap description (standard format, every calculator)

Always tell the user, in this order: (1) one set per corner, (2) one stud,
(3) one socket, (4) how many sets total, (5) how many individual pieces total.
Format:

```html
<div class='row'><span>Snap sets per corner</span><strong>1 set (1 stud + 1 socket)</strong></div>
<div class='row'><span>Total snap sets / total pieces</span><strong>4 sets / 8 pieces</strong></div>
<div class='note' style='margin-top:6px;'>
  Each snap is one mating pair —
  one <strong style='color:#166534'>stud (green dot)</strong>
  and one <strong style='color:#831843'>socket (magenta dot)</strong>
  that press together. [calculator-specific sentence about how they mate,
  e.g. across the diagonal cut, when the corner flap folds inward, etc.]
</div>
```

This format is mandatory on every calculator that has corner snaps. Use
**stud** and **socket** — never "male" or "female" — in user-facing text.

---

## Things to NOT include

These are deliberately removed across all calculators. If you see them in old
code, remove them. If you're tempted to add them, don't.

### No bungee path lines

Do not draw dashed lines tracing the bungee route between grommets. The
grommet positions alone communicate where the bungee goes; a drawn path adds
visual noise without helping the installer. This includes any "Bungee paths"
legend chip — drop it.

The bungee TAB (the BT element with hem and loop) is fine and stays — that's
a hardware annotation, not a path.

### No wavy edges in diagrams

Wavy / scalloped / bezier-curve edges around cover perimeters are not drawn in
any production calculator. Remove any code that draws them, remove references
to them in instructions, and remove any "wave allowance" input controls. The
diagrams always show straight edges.

(Manufacturing detail, not a drawing convention: the maker cuts the bottom
floor edge with wave-pattern scissors as a fraying-prevention technique. The
wave amplitude is small — up to ~2" deeper than the floor-clearance baseline
at the peaks of the wave, baseline at the lows. The diagram still shows a
straight edge at the floor-clearance line; the wavy cut happens at the table
when the panel is trimmed to its final length. Do NOT model the wave in code.)

### No assembly instructions list

The numbered `<ol>` "how to assemble this cover" list at the bottom of older
calculators is not needed. The results-card notes (the explanatory paragraphs
under each measurement) already cover what the installer needs. Remove the
list and any "Assembly Instructions" section header.

### No formula / calculation details in the results

When showing a computed value, show **the rounded value** and nothing else.
Do NOT show the formula or the unrounded value. Older calculators have rows
like this:

```js
['Diagonal drape (AT2F)', `${fmtInch(AT2F,rounded)}"`, `√[(H−F2A)²+(D−BR)²] = ${fmtExact(AT2F)}`]
```

The third field — the `√[(H−F2A)²+(D−BR)²] = ...` part — gets dropped. Same
goes for `<div class="formula">` blocks anywhere in the results. Rule of
thumb: the installer doesn't need to see the math, they need the number.

---

## Archive folder is frozen

Anything inside an `archive/` subfolder (at any depth under `calculators/`) is
historical reference only. **Never modify those files**, even when applying
conventions globally — including blanket requests like "fix the snap colors
everywhere" or "audit every calculator." If a user request would touch the
archive, ask them to confirm first and treat the answer as opt-in per file.

---

## When in doubt

- If a calculator existing in this folder contradicts something in this guide,
  this guide wins for new work. Ask before retrofitting an old calculator.
- If the user invents a new concept mid-conversation (e.g. a new piece of
  hardware), add it to this file before the conversation ends so the next
  session doesn't have to re-discover it.
- If a color or measurement isn't covered here, ask before picking one rather
  than guessing.
