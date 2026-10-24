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
| Strip seams (cut diagram, labeled S1, S2…) | — | `#7e22ce` | dotted, 2px |
| Wear patch (underside, where cover rubs a fixture) | `#7c2d12` @ 0.25 | `#7c2d12` | solid 1.5px |
| Second piece of a multi-piece custom cover | `#f5f5f4` | `#57534e` | solid 2px; never pink (too close to socket magenta) |
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
- **Exception: free-hanging drapes** (bars, islands, anything with no frame
  behind the drape): grommets go 6" above the hem, or 3" at a house-wall end.
- Keep every grommet at least 6" away from a strip seam and 5" from any cut or notch edge.
- Grommets sit on a doubled 5×5 patch.
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
- **Full bolt width, every design.** Strips are cut at the full bolt width;
  only one strip per panel is ripped narrower to take up the remainder. Never
  split the width evenly across strips (that means ripping every strip).
- Notches (sectional flap) and corner cutouts ARE material cuts — show them.
- **Every notch or cutout inside a strip is dimensioned on that strip**
  (width × depth), saying which edge each number is measured from. The cutter
  should never have to scale it off the drawing.
- **Tapers and slant cuts count too.** Label where the slant starts (e.g.
  "5" down" at the raw edge) and where it ends ("taper ends 17.5" in"), plus
  any end cut-away (e.g. "cut away 4" × 44""). Keep these labels clear of the
  strip's name box.
- **Each strip is cut only as long as the outline reaches inside it.** Label
  each strip's own length (e.g. A1 87", A2–A4 119"); don't default every strip
  to the panel's full length.
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
- **Connecting side drops only its standard FRONT grommet; it keeps a back
  grommet + a back bungee tab, and gains a FRONT JOINT grommet (G4).** A full
  front-to-back bungee is too long, so the bungee runs front-to-back on the
  **outer (free) side only** (front grommet → back tab → back grommet, as
  normal). The connecting side instead gets two short **joint bungees** that
  hook across the seam: a **back joint bungee** from this piece's connecting
  back grommet to the OTHER piece's back grommet, and a **front joint bungee**
  from this piece's G4 to the OTHER piece's G4, holding the two pieces together
  at both ends of the joint. So each sectional piece = **4 grommets + 2 back
  bungee tabs + 1 front-to-back bungee** (plus it shares the two joint
  bungees). Joint-bungee lengths are set on-site (they depend on the as-built
  gap), not computed.
  - **Outer side** (= opposite the connecting side): back grommet + front
    grommet + back tab, at the standard positions. Labels **G1** (back),
    **G2** (front), with full dimension lines.
  - **Connecting side**: back grommet + back tab, **no standard front
    grommet**. Labelled **G3**.
    - **Main piece**: connecting back grommet stays at the standard back-corner
      position (`gromBackHorizFromCenter` from center).
    - **Short piece**: connecting back grommet is the **JOINT grommet**,
      relocated to **5" inboard of the JOINT — i.e. the couch footprint edge
      `furnX` (where the connecting snaps sit), NOT the straight drape edge**
      (`furnX + 5"` or `furnX + furnW − 5"`), at the standard back inset. Its
      tab moves with it. Dimension it as `5" from joint edge`, not from center.
      (The drape edge `saLeftX`/`saRightX` is much further out than `furnX`; the
      grommet belongs near where the two couches actually meet.)
  - **Front joint grommet (G4)** — one per piece, at the standard front inset
    (1/3 side drop up from the floor edge), no tab. Drawn on the assembly
    diagram only, never the cut diagram.
    - **Main piece**: inboard of the cut line, **5" clear of the overlap
      flap's sewn hem edge** (= `flapWidth/2 + 5"` from the cut line; just
      5" from the cut line if there's no flap). Dimension it as
      `X" from cut line`.
    - **Short piece**: **5" inboard of the joint edge** (`furnX + 5"` or
      `furnX + furnW − 5"`) — vertically aligned with its G3 joint grommet.
      Dimension it as `5" from joint edge`.
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
| Front joint grommet (G4, sectional) | main: flap-width/2 + 5" inboard of the cut line; short: 5" in from the joint edge — both at the standard front inset |
| Overlap flap sew line | 1" in from the inner edge of the flap |
| Overlap flap outer edge | hangs free — no snaps (see Sectional rules) |
| Bungee tab hem | 2" into the back drape from the back fold line |
| Bungee tab length | ~3" (so the loop sits ~3" away from the hem, toward the ground) |
| Floor clearance | as input by the user (always honor this — don't hard-code) |
| Grommet, free-hanging drape | 6" above the hem (3" at a wall end), ≥6" off any seam |
| Wall upturn flap | 4", straight raw edge, drapes notched back |
| Wear patch | 8×8" doubled, underside, centered on the fixture |

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

## Custom one-off covers (bars, islands, L-shapes)

For a design that isn't one of the standard calculators, no calculator is
built. Deliver a cut diagram and an assembly diagram in this file's style.
First used on the L-shaped outdoor bar (Oct 2026).

### Workflow: measure diagram first
1. Kristen sends photos of what's being covered.
2. Make a printable **measure diagram** first: a simple top-down outline (plus
   a side view if anything sticks up) with a lettered blank (A, B, C…) on every
   dimension the design needs, each showing where it starts and stops.
   Include every column, faucet, tap or other obstruction: its size,
   its height, and its distance from a fixed edge. Also include drop heights to
   the deck/floor.
3. List every assumption on it as a blank too, rather than guessing.
4. Only after the filled-in sheet comes back, check that the numbers agree
   with each other, then draw the cut and assembly diagrams.

### Allowances
- **Fixture tent.** When the cover drapes over a tap, faucet or other raised
  fixture, add length both ways. Across the width, add the extra drape the tent
  uses up on each side. Along the run, add the length the tent uses up (about
  +14" for a 23" tap plus a 15" faucet ~20" apart, 17" from the wall). Work it
  out as the sum of the slope extras (each rise over its run, including the
  drop from the last fixture to the wall), then add ~3" slack so the cover
  drapes instead of pulling taut. Measure each fixture's height, its distance
  from the wall, the spacing between fixtures, and where it sits across the
  counter. Carry the full across-width extra from the wall back past the LAST
  fixture before tapering to the join, or the hem rides up there.
- **Counter step bridge.** When the cover spans two counter heights, it bridges
  the step on a slant rather than following it down. Add the slant length to
  the top panel (about +1" for a 6" step).
- **Wall upturn flap.** Where a cover meets a house wall, add a 4" upturn flap
  with a straight raw edge (no wave cut). Notch the drapes back so it lies flat.
- **Hemmed notch around a column/post.** 1" single-fold hem on both notch
  edges: cut the notch 1" smaller each way than the finished size, clip the
  inside corner, and sew a 5"×5" doubled patch over it.
- **Sewn joins between pieces:** 1" seam allowance on each piece (Kristen's
  default, a bit more than ¾"). No join snaps unless the customer buys the
  two-piece option.
- **Derived dimensions.** A dimension calculated instead of measured (e.g. run
  = outside length − width) is labeled "derived" on the cut diagram and in the
  build notes.

### Measurements: pin down start and end points
- For every length, record where it starts and stops (e.g. "outside long side
  to the column face" vs "to the end of the bar"). A column or post inside the
  footprint: record its size and its distance from the end.
- Sanity-check lengths against each other (outside − inside = the other run's
  ledge depth; 31.5" + 14" column ≈ 46" width) and flag anything that doesn't
  close.

### Strip math (cut diagram)
- Each seam uses the FULL overlap: strips n = ceil((span − overlap)/(bolt −
  overlap)). All strips are full bolt width except one, which is ripped to
  span − (n−1)·(bolt − overlap). Check the widths minus (n−1)·overlap = span
  before delivering.
- **Use the full bolt width.** Cut every strip at full bolt width and rip only
  ONE strip narrower to take up the remainder, so the cutter isn't ripping
  every strip. Pick which strip gets ripped so no seam lands within 6" of a
  grommet or notch edge.
- **Don't cut fabric that's all notch.** If a notch runs the full width of a
  strip, start that strip at the notch edge instead of cutting it full length
  and throwing the notch away (A4 on the L-bar: 67" instead of 119").
- Yardage: total of the actual strip lengths, then round up to whole yards plus
  ~1 yd spare for squaring ends.

### Diagrams
- Strip seams on the cut diagram: dotted `#7e22ce`, labeled S1, S2…, plus a
  small "How it sews together" map with numbered steps on the same page.
- Orientation arrows on every diagram; hardware counts and bungee lengths shown
  on the assembly diagram.
- A bungee-route sketch is allowed only as a separate explainer, never on the
  production diagrams (see "No bungee path lines").
- Dimension labels must add up as written. If an allowance sits inside an
  overall dimension, say so; don't write "(+2")" when it isn't added on top.

### Hardware
- Corner snaps can be skipped on a corner a bungee already pulls tight. Use
  them on outside corners that would otherwise gap.
- Two-piece join snaps: placed center-out at 6", studs on piece A, sockets on B.
- Grommets: at least 5" from any cut or notch edge (measured from the finished
  hem line) and at least 6" from any strip seam.
- U-hooks: screw into the bar's baseboard, through to the framing behind it. At
  a house wall, use trim or a solid strip. **Never into vinyl siding.**

### Materials
- Marine vinyl: shingle the top seams (uphill strip laps over downhill), then
  seal them.
- Confirm the bolt width before cutting. Marine vinyl is often 54", not 55.25",
  and the narrower bolt can change the strip count.

### Before delivering a revision
- Re-run the whole check, not just the changed number: panel widths and lengths
  add up, join edges on both pieces match, strip widths close with the
  overlaps, grommets clear seams and edges, notch sizes are labeled, yardage
  is current.
- Carry every change into ALL outputs (cut diagram, assembly diagram, build
  notes, customer text). Name any output that is now out of date (e.g. old
  mockups) instead of leaving it silently stale.

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
