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
    // Chair-cover constants (match chair_cover_calculator_snap_back_MFG_v2.html):
    CHAIR_HEM: 0,         // hem allowance (in)
    CHAIR_BOTTOM_MARGIN: 8, // front-flap bottom margin (in)
    CHAIR_SPLIT_FLAP_SEAM: 0.5, // per-half center join for a split front flap (in)
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

  /**
   * Chair / recliner snap-back cover yardage.
   * Faithful port of chair_cover_calculator_snap_back_MFG_v2.html — main side-to-side
   * panel + trapezoidal back piece, with split-back, split-flap, and waste-nesting
   * optimizations; returns the minimum bolt length found.
   *
   * @param {Object} p
   * @param {number} p.width          W  — overall width (arm to arm).
   * @param {number} p.depth          D  — front-to-back depth.
   * @param {number} p.height         H  — floor to top of backrest.
   * @param {number} p.armrestHeight  F2A — floor to top of armrest.
   * @param {number} p.backrestDepth  BR — backrest thickness at the top.
   * @param {number} [p.backWidth]    WB — back-panel width (defaults to width).
   * @param {number} [p.bolt]         Bolt width (in). Defaults to CONST.BOLT_WIDTH.
   * @param {number} [p.fc]           Floor clearance (in). Defaults to CONST.FLOOR_CLEARANCE.
   * @param {number} [p.hem]          Hem allowance (in). Defaults to CONST.CHAIR_HEM.
   * @param {number} [p.seam]         Seam allowance (in). Defaults to CONST.SEAM_OVERLAP.
   * @param {number} [p.bottomMargin] Front-flap bottom margin (in). Defaults to CONST.CHAIR_BOTTOM_MARGIN.
   * @returns {Object} { yards, totalLength, ML, totalFB, frontFlapNeeded,
   *                      useSplitBack, useSplitFlap, useWasteNesting, nestingStrategy }
   */
  function chairCover(p) {
    p = p || {};
    var W   = Math.max(0, Number(p.width)  || 0);
    var D   = Math.max(0, Number(p.depth)  || 0);
    var H   = Math.max(0, Number(p.height) || 0);
    var F2A = Math.max(0, Number(p.armrestHeight) || 0);
    var BR  = Math.max(0, Number(p.backrestDepth) || 0);
    var WB  = (p.backWidth != null && Number(p.backWidth) > 0) ? Number(p.backWidth) : W;
    var B   = (p.bolt != null)         ? Number(p.bolt)         : CONST.BOLT_WIDTH;
    var FC  = (p.fc != null)           ? Number(p.fc)           : CONST.FLOOR_CLEARANCE;
    var hem = (p.hem != null)          ? Number(p.hem)          : CONST.CHAIR_HEM;
    var seam = (p.seam != null)        ? Number(p.seam)         : CONST.SEAM_OVERLAP;
    var bottomMargin = (p.bottomMargin != null) ? Number(p.bottomMargin) : CONST.CHAIR_BOTTOM_MARGIN;
    var sideEase = 0, waveAllowance = 0;

    // Main piece (side-to-side wrap)
    var AT2F = Math.sqrt(Math.max(0, H - F2A) * Math.max(0, H - F2A) + Math.max(0, D - BR) * Math.max(0, D - BR));
    var sideDrop = H - FC;
    var frontExtDrop = F2A - FC;
    var ML = WB + 2 * sideDrop;
    var totalFB = hem + BR + AT2F + frontExtDrop;

    var backInset = hem + BR;
    var frontInset = F2A - FC;
    var taperZoneLength = Math.max(0, B - frontInset - backInset);
    var frontWidthAfterCut = W + 2 * frontExtDrop + 2 * sideEase;
    var markFromSideEdge = Math.max(0, (ML - frontWidthAfterCut) / 2);

    // Back piece (trapezoid)
    var backPieceTopWidth = ML;
    var backPieceBottomWidth = WB + 2 * hem;
    var backPieceHeight = H - FC;
    var backPieceLength = backPieceTopWidth; // along bolt
    var backPieceWidth = backPieceHeight;    // across bolt

    // Split-back nesting
    var splitBackHalfTop = backPieceTopWidth / 2 + seam;
    var splitBackHalfBot = backPieceBottomWidth / 2 + seam;
    var splitBackNestedWidth = splitBackHalfTop + splitBackHalfBot;
    var splitBackTaper = splitBackHalfTop - splitBackHalfBot;
    var splitBackMinOffset = splitBackNestedWidth <= B ? 0
      : splitBackTaper > 0 ? (splitBackNestedWidth - B) * backPieceHeight / splitBackTaper : Infinity;
    var splitBackFits = isFinite(splitBackMinOffset);
    var splitBackBoltLength = splitBackFits ? backPieceHeight + splitBackMinOffset : backPieceLength;
    var splitBackSavings = backPieceLength - splitBackBoltLength;

    // Front flap (trapezoid)
    var frontFlapNeeded = totalFB > B;
    var frontFlapShortage = frontFlapNeeded ? totalFB - B : 0;
    var frontFlapWidth = frontFlapNeeded ? frontFlapShortage + hem : 0;
    var flapTopWidth = frontFlapNeeded ? Math.max(W, W + 2 * (F2A - FC) - 2 * waveAllowance) : 0;
    var frontFlapLength = frontFlapNeeded ? flapTopWidth : 0;

    // Strategy A — full trapezoid back piece
    var totalA = ML + backPieceLength;
    if (frontFlapNeeded) {
      if (backPieceWidth + frontFlapWidth <= B) totalA = ML + Math.max(backPieceLength, frontFlapLength);
      else totalA = ML + backPieceLength + frontFlapLength;
    }

    // Strategy B — split-back nested
    var totalB = Infinity;
    if (splitBackFits && splitBackSavings > 1) {
      totalB = ML + splitBackBoltLength;
      if (frontFlapNeeded) {
        if (splitBackNestedWidth + frontFlapWidth <= B) totalB = ML + Math.max(splitBackBoltLength, frontFlapLength);
        else totalB = ML + splitBackBoltLength + frontFlapLength;
      }
    }

    var totalLength, nestingStrategy, useSplitBack;
    if (totalA <= totalB) { totalLength = totalA; useSplitBack = false; nestingStrategy = 'full-back'; }
    else { totalLength = totalB; useSplitBack = true; nestingStrategy = 'split-back'; }

    // Split front flap
    var useSplitFlap = false, splitSavings = 0, splitHalfLength = 0;
    if (frontFlapNeeded) {
      splitHalfLength = Math.ceil(frontFlapLength / 2) + CONST.CHAIR_SPLIT_FLAP_SEAM;
      var bothHalvesFit = backPieceWidth + 2 * frontFlapWidth <= B;
      var oneHalfFits = backPieceWidth + frontFlapWidth <= B;
      var splitTotalLength;
      if (bothHalvesFit) splitTotalLength = ML + Math.max(backPieceLength, splitHalfLength);
      else if (oneHalfFits) splitTotalLength = ML + Math.max(backPieceLength, splitHalfLength) + splitHalfLength;
      else splitTotalLength = ML + backPieceLength + 2 * splitHalfLength;
      splitSavings = totalLength - splitTotalLength;
      if (splitSavings > 0.5) { useSplitFlap = true; totalLength = splitTotalLength; nestingStrategy = 'split-flap'; }
    }

    // Waste nesting (alternative to split-flap)
    var useWasteNesting = false;
    if (frontFlapNeeded) {
      var preSplitTotalLength = useSplitFlap ? (totalLength + splitSavings) : totalLength;
      var wasteRectW = markFromSideEdge, wasteRectH = frontInset;
      var wasteTriBase = markFromSideEdge, wasteTriHeight = taperZoneLength;
      var fitsInCombinedWaste = function (w, h) {
        if (w > wasteRectW) return false;
        if (h <= wasteRectH) return true;
        var triPortion = h - wasteRectH;
        if (triPortion > wasteTriHeight) return false;
        var availAtTop = wasteTriHeight > 0 ? wasteTriBase * (wasteTriHeight - triPortion) / wasteTriHeight : 0;
        return availAtTop >= w;
      };
      var fullFitsA = fitsInCombinedWaste(frontFlapLength, frontFlapWidth);
      var fullFitsB = fitsInCombinedWaste(frontFlapWidth, frontFlapLength);
      var halfFitsA = fitsInCombinedWaste(splitHalfLength, frontFlapWidth);
      var halfFitsB = fitsInCombinedWaste(frontFlapWidth, splitHalfLength);
      var wasteTotalLength = ML + backPieceLength;
      if (fullFitsA || fullFitsB) {
        if (preSplitTotalLength - wasteTotalLength >= 0) {
          useWasteNesting = true; useSplitFlap = false; totalLength = wasteTotalLength; nestingStrategy = 'waste-nested';
        }
      } else if (halfFitsA || halfFitsB) {
        if (preSplitTotalLength - wasteTotalLength >= 0) {
          useWasteNesting = true; useSplitFlap = true; totalLength = wasteTotalLength; nestingStrategy = 'waste-nested-split';
        }
      }
    }

    return {
      yards: ceilYards(totalLength),
      totalLength: totalLength, ML: ML, totalFB: totalFB, bolt: B,
      frontFlapNeeded: frontFlapNeeded, useSplitBack: useSplitBack,
      useSplitFlap: useSplitFlap, useWasteNesting: useWasteNesting,
      nestingStrategy: nestingStrategy,
    };
  }

  /**
   * Sofa / loveseat snap-back cover yardage.
   * Faithful port of couch_cover_calculator_snap_back_MFG_v4.html — two main
   * panels run front-to-back and join at a center snap-seam; if the assembled
   * width exceeds the joined usable width, side extensions are added, but only
   * count as extra bolts when they don't fit in the main panels' scrap.
   *
   * @param {Object} p  width(W), depth(D), height(H), armrestHeight(F2A),
   *                    backrestDepth(BR), backWidth(WB, defaults to width),
   *                    plus optional bolt / fc / hem / seam overrides.
   * @returns {Object} { yards, totalLength, panelLen, totalBolts, extNeeded,
   *                      extBoltsNeeded, extensionsFitInScrap }
   */
  function sofaCover(p) {
    p = p || {};
    var W   = Math.max(0, Number(p.width)  || 0);
    var D   = Math.max(0, Number(p.depth)  || 0);
    var H   = Math.max(0, Number(p.height) || 0);
    var F2A = Math.max(0, Number(p.armrestHeight) || 0);
    var BR  = Math.max(0, Number(p.backrestDepth) || 0);
    var WB  = (p.backWidth != null && Number(p.backWidth) > 0) ? Number(p.backWidth) : W;
    var B   = (p.bolt != null) ? Number(p.bolt) : CONST.BOLT_WIDTH;
    var FC  = (p.fc != null)   ? Number(p.fc)   : CONST.FLOOR_CLEARANCE;
    var hem = (p.hem != null)  ? Number(p.hem)  : CONST.CHAIR_HEM; // v4 default 0
    var seam = (p.seam != null) ? Number(p.seam) : CONST.SEAM_OVERLAP;

    var AT2F = Math.sqrt(Math.max(0, H - F2A) * Math.max(0, H - F2A) + Math.max(0, D - BR) * Math.max(0, D - BR));
    var sideDrop = H - FC;
    var frontExtDrop = F2A - FC;

    var backInset = hem + BR;
    var frontInset = frontExtDrop;
    var totalFB = hem + BR + AT2F + frontExtDrop;
    var frontFlapShortage = Math.max(0, totalFB - B);
    var frontFlapWidth = frontFlapShortage > 0 ? frontFlapShortage + hem : 0;
    var taperLen = Math.max(0, B - backInset - frontInset);
    var frontStraight = frontInset + frontFlapWidth;
    var panelLen = sideDrop + backInset + taperLen + frontStraight;

    var assembledW = WB + 2 * sideDrop;
    var joinedUsableW = 2 * B - seam;           // v4: deduct the center seam once
    var extNeeded = assembledW > joinedUsableW;
    var extDeficit = Math.max(0, assembledW - joinedUsableW);
    var extSeam = 1;
    var extEachCut = extDeficit / 2 + extSeam;

    // Extension actual length = the y-span where the assembled silhouette's
    // half-width exceeds (B − extSeam).
    var extActualLen = panelLen;
    if (extNeeded) {
      var sideOff = B - extSeam;
      var halfBack = WB / 2 + hem, halfMid = assembledW / 2, halfFront = (W + 2 * frontExtDrop) / 2;
      var edge = [
        [0, halfBack],
        [sideDrop, halfMid],
        [sideDrop + backInset, halfMid],
        [sideDrop + backInset + taperLen, halfFront],
        [panelLen, halfFront],
      ];
      var entryY = null, exitY = null;
      for (var i = 0; i < edge.length - 1; i++) {
        var y1 = edge[i][0], h1 = edge[i][1], y2 = edge[i + 1][0], h2 = edge[i + 1][1];
        var in1 = h1 >= sideOff, in2 = h2 >= sideOff, t;
        if (entryY === null) {
          if (in1) entryY = y1;
          else if (in2) { t = (sideOff - h1) / (h2 - h1); entryY = y1 + t * (y2 - y1); }
        }
        if (entryY !== null) {
          if (in2) exitY = y2;
          else if (in1) { t = (sideOff - h1) / (h2 - h1); exitY = y1 + t * (y2 - y1); break; }
        }
      }
      if (entryY !== null && exitY !== null && exitY > entryY) extActualLen = exitY - entryY;
    }

    // Do the side extensions fit in the main panels' scrap (front strip or back triangle)?
    var extensionsFitInScrap = false;
    if (extNeeded) {
      var hb = WB / 2 + hem, hm = assembledW / 2, hf = (W + 2 * frontExtDrop) / 2;
      var yPB = sideDrop + backInset + taperLen;
      var xCross = (hb < B && hm > hb) ? Math.min(sideDrop, sideDrop * (B - hb) / (hm - hb)) : 0;
      var bSH = Math.max(0, B - hb), fSH = Math.max(0, B - hf), fSW = Math.max(0, panelLen - yPB);
      var cands = [{ w: extActualLen, h: extEachCut }, { w: extEachCut, h: extActualLen }];
      for (var k = 0; k < cands.length; k++) {
        var c = cands[k];
        if (c.w <= fSW && c.h <= fSH) { extensionsFitInScrap = true; break; }
        if (c.w > 0 && c.h > 0 && xCross > 0 && bSH > 0 && (c.w / xCross) + (c.h / bSH) <= 1) { extensionsFitInScrap = true; break; }
      }
    }

    var extBoltsNeeded = (extNeeded && !extensionsFitInScrap) ? (2 * extEachCut <= B ? 1 : 2) : 0;
    var totalBolts = 2 + extBoltsNeeded;
    var totalInches = totalBolts * panelLen;

    return {
      yards: ceilYards(totalInches),
      totalLength: totalInches, panelLen: panelLen, totalBolts: totalBolts,
      extNeeded: extNeeded, extBoltsNeeded: extBoltsNeeded, extensionsFitInScrap: extensionsFitInScrap,
    };
  }

  return { CONST: CONST, ceilYards: ceilYards, drapeFor: drapeFor, tableCover: tableCover, chairCover: chairCover, sofaCover: sofaCover };
}));
