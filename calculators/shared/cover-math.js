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
    TABLE_DROP: 10,       // tablecloth-style side drop (in)
    FLOOR_CLEARANCE: 3,   // "full coverage" clearance above the floor (in)
    SEAM_OVERLAP: 1.5,    // fabric consumed by a center join seam (in)
  };

  function ceilYards(inches) { return Math.ceil(inches / 36); }

  /**
   * Table / table-set cover yardage and cut layout.
   *
   * @param {Object} p
   * @param {number} p.length   Long side — runs ALONG the bolt (→ ML).
   * @param {number} p.width    Short side — runs ACROSS the bolt (→ MD).
   * @param {number} p.height   Table height, top to floor.
   * @param {string} [p.style]  'tablecloth' (fixed 10" drop) | 'full' (height − 3").
   * @param {number} [p.drop]   Explicit side-drop override (in). Wins over style.
   * @param {number} [p.bolt]   Bolt-width override (in). Defaults to CONST.BOLT_WIDTH.
   * @returns {Object} { yards, totalBoltLen, ML, MD, drop, bolt, layout,
   *                      pieceCount, pieceL, pieceW, fitsBolt }
   */
  function tableCover(p) {
    p = p || {};
    var length = Math.max(0, Number(p.length) || 0);
    var width  = Math.max(0, Number(p.width)  || 0);
    var height = Math.max(0, Number(p.height) || 0);
    var style  = p.style || 'tablecloth';
    var bolt   = (p.bolt != null) ? Number(p.bolt) : CONST.BOLT_WIDTH;
    var drop   = (p.drop != null)
      ? Number(p.drop)
      : (style === 'full' ? Math.max(0, height - CONST.FLOOR_CLEARANCE) : CONST.TABLE_DROP);

    var ML = Math.max(0, length + 2 * drop);  // along the bolt
    var MD = Math.max(0, width  + 2 * drop);  // across the bolt

    var layout, pieceCount, pieceL, pieceW, totalBoltLen, fitsBolt;
    if (MD <= bolt) {
      // Single piece: the cover fits across one bolt width.
      layout = 'single'; pieceCount = 1;
      pieceL = ML; pieceW = MD; totalBoltLen = ML;
      fitsBolt = MD <= bolt;
    } else {
      // Two pieces run front-to-back, joined by a center seam.
      layout = 'two-piece'; pieceCount = 2;
      pieceL = MD; pieceW = (ML + CONST.SEAM_OVERLAP) / 2; totalBoltLen = 2 * MD;
      fitsBolt = pieceW <= bolt;
    }

    return {
      yards: ceilYards(totalBoltLen),
      totalBoltLen: totalBoltLen,
      ML: ML, MD: MD, drop: drop, bolt: bolt,
      layout: layout, pieceCount: pieceCount,
      pieceL: pieceL, pieceW: pieceW, fitsBolt: fitsBolt,
    };
  }

  return { CONST: CONST, ceilYards: ceilYards, tableCover: tableCover };
}));
