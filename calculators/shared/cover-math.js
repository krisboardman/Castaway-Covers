/*!
 * cover-math.js — single source of truth for Castaway Covers yardage math.
 *
 * This file is consumed in TWO places, so it must stay dependency-free and in
 * plain JavaScript:
 *   1. The standalone HTML calculators (calculators/*.html) load it with a
 *      <script src="shared/cover-math.js"> tag and read window.CoverMath.
 *   2. The website calculator (src/components/MeasurementCalculator.tsx)
 *      imports it as a module.
 *
 * Edit a formula or a constant ONCE here and both update — no more porting,
 * no more drift between the calculators you build and the live site.
 *
 * ── PILOT SCOPE ────────────────────────────────────────────────────────────
 * Tables / table-sets only. Chairs, sofas, chaise, and ottomans still live in
 * their own files for now; they'll move here once this pattern is approved.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();           // Node / website build
  } else {
    root.CoverMath = factory();           // browser <script> → window.CoverMath
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── Canonical constants ───────────────────────────────────────────────────
  // The ONE place these values are defined. (Bolt width was previously 55.25"
  // in the standalone calculators but 54" in the website — that mismatch is
  // what caused price differences. It now lives here once.)
  var CONST = {
    BOLT_WIDTH: 55.25,    // usable fabric bolt width (in)
    TABLE_DROP: 10,       // "tabletop only" side drop (in)
    FLOOR_CLEARANCE: 3,   // "full coverage" clearance above the floor (in)
    BELOW_SEAT: 5,        // "over the seats" drop past the seat bottom (in) —
                          // covers the weave cut (~2-3") and leaves clearance
    SEAM_OVERLAP: 1.5,    // fabric consumed per join seam (in)
  };

  function ceilYards(inches) { return Math.ceil(inches / 36); }

  /**
   * Resolve side-drop (in) from a drape mode.
   * @param {string} mode    'tabletop' | 'seats' | 'full'
   * @param {number} height  Top of cover to floor (table top, or chair/grill top — whichever is higher).
   * @param {number} seatH   Floor to bottom of chair seat (only used by 'seats').
   */
  function drapeFor(mode, height, seatH) {
    if (mode === 'full')  return Math.max(0, height - CONST.FLOOR_CLEARANCE);            // ~3" off the floor
    if (mode === 'seats') return Math.max(0, (height - (Number(seatH) || 0)) + CONST.BELOW_SEAT); // 5" below seats
    return CONST.TABLE_DROP;                                                            // 'tabletop' → 10"
  }

  /**
   * Table / table-set / grill-island cover yardage and cut layout.
   * Splits into as many strips as the size needs (handles a bare table all the
   * way up to a full table set draped over the chairs).
   *
   * @param {Object} p
   * @param {number} p.length     Long side (chair-edge to chair-edge for a set).
   * @param {number} p.width      Short side (chair-edge to chair-edge for a set).
   * @param {number} p.height     Top of cover to floor (taller of table/chairs/grill).
   * @param {string} [p.dropMode] 'tabletop' (10") | 'seats' (5" below seats) | 'full' (3" off floor).
   * @param {number} [p.seatHeight] Floor to bottom of seat — required for 'seats'.
   * @param {number} [p.drop]     Explicit side-drop override (in). Wins over dropMode.
   * @param {number} [p.bolt]     Bolt-width override (in). Defaults to CONST.BOLT_WIDTH.
   * @returns {Object} { yards, totalBoltLen, CL, CW, drop, bolt, dropMode,
   *                      pieceCount, pieceL, pieceW, splitDir, fitsBolt }
   */
  function tableCover(p) {
    p = p || {};
    var length = Math.max(0, Number(p.length) || 0);
    var width  = Math.max(0, Number(p.width)  || 0);
    var height = Math.max(0, Number(p.height) || 0);
    // Back-compat: the old API used style: 'tablecloth' | 'full'.
    var mode   = p.dropMode || (p.style === 'full' ? 'full' : p.style === 'tablecloth' ? 'tabletop' : 'tabletop');
    var bolt   = (p.bolt != null)  ? Number(p.bolt)  : CONST.BOLT_WIDTH;
    var drop   = (p.drop != null)  ? Number(p.drop)  : drapeFor(mode, height, p.seatHeight);

    var CL = Math.max(0, length + 2 * drop); // cover length (long axis)
    var CW = Math.max(0, width  + 2 * drop); // cover width (short axis)

    var seamPerStrip = CONST.SEAM_OVERLAP / 2;
    // span = dimension cut ACROSS the bolt (split into N strips); len = strip length ALONG the bolt.
    function option(span, len) {
      var N = Math.max(1, Math.ceil((span - seamPerStrip) / (bolt - seamPerStrip)));
      return { pieces: N, stripW: (span + (N - 1) * seamPerStrip) / N, stripL: len, total: N * len };
    }
    var optLong  = option(CW, CL); // seams run parallel to the long axis
    var optShort = option(CL, CW); // seams run parallel to the short axis
    var chosen, splitDir;
    if (optLong.total < optShort.total)      { chosen = optLong;  splitDir = 'long'; }
    else if (optShort.total < optLong.total) { chosen = optShort; splitDir = 'short'; }
    else if (optLong.pieces <= optShort.pieces) { chosen = optLong;  splitDir = 'long'; }
    else                                     { chosen = optShort; splitDir = 'short'; }

    return {
      yards: ceilYards(chosen.total),
      totalBoltLen: chosen.total,
      CL: CL, CW: CW, drop: drop, bolt: bolt, dropMode: mode,
      pieceCount: chosen.pieces, pieceL: chosen.stripL, pieceW: chosen.stripW,
      seamCount: chosen.pieces - 1, seamOverlap: CONST.SEAM_OVERLAP,
      splitDir: splitDir, fitsBolt: chosen.stripW <= bolt,
    };
  }

  return { CONST: CONST, ceilYards: ceilYards, drapeFor: drapeFor, tableCover: tableCover };
}));
