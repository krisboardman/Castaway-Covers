#!/usr/bin/env node
/*
 * check-calculators.js — regression + parity guard for the shared cover math.
 *
 * Runs known table sizes through calculators/shared/cover-math.js and asserts
 * the yardage hasn't changed, and verifies that BOTH the standalone HTML
 * calculator and the website still call the shared module (so the single
 * source of truth can't silently drift apart again).
 *
 *   npm run check-calculators
 *
 * Exits 0 if everything matches, 1 on any mismatch.
 * PILOT SCOPE: tables. Add cases here as more product types move to the module.
 */
const fs = require('fs');
const path = require('path');
const CoverMath = require('./calculators/shared/cover-math.js');

let failures = 0;
function check(name, got, want) {
  const ok = got === want;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`);
  if (!ok) failures++;
}

console.log('Plain table — golden yardage cases (must stay unchanged):');
check('60x36x30 tabletop',                CoverMath.tableCover({ length: 60, width: 36, height: 30, dropMode: 'tabletop' }).yards, 4);
check('30x20x18 tabletop (small)',        CoverMath.tableCover({ length: 30, width: 20, height: 18, dropMode: 'tabletop' }).yards, 2);
check('60x35x30 tabletop (bolt-edge)',    CoverMath.tableCover({ length: 60, width: 35, height: 30, dropMode: 'tabletop' }).yards, 3);
check('48x24x28 full coverage',           CoverMath.tableCover({ length: 48, width: 24, height: 28, dropMode: 'full' }).yards,     5);
check('legacy style:"full" still maps',   CoverMath.tableCover({ length: 48, width: 24, height: 28, style: 'full' }).yards,       5);

console.log('\nTable set — multi-strip drape modes:');
check('set 96x54x36 tabletop',            CoverMath.tableCover({ length: 96, width: 54, height: 36, dropMode: 'tabletop' }).yards,            7);
check('set 96x54x36 over-seats (seat 17)',CoverMath.tableCover({ length: 96, width: 54, height: 36, dropMode: 'seats', seatHeight: 17 }).yards, 8);
check('set 96x54x36 full',                CoverMath.tableCover({ length: 96, width: 54, height: 36, dropMode: 'full' }).yards,                10);
check('big set 120x60x38 full (4 strips)', CoverMath.tableCover({ length: 120, width: 60, height: 38, dropMode: 'full' }).yards,            15);

console.log('\nChair cover — golden yardage cases (v2 split-back/split-flap/waste-nesting):');
check('recliner 30x32x40 arm24 br4 wb28', CoverMath.chairCover({ width: 30, depth: 32, height: 40, armrestHeight: 24, backrestDepth: 4, backWidth: 28 }).yards, 6);
check('dining 20x22x36 arm18 br3 wb18',    CoverMath.chairCover({ width: 20, depth: 22, height: 36, armrestHeight: 18, backrestDepth: 3, backWidth: 18 }).yards, 4);
check('lounge 34x38x34 arm20 br6 wb30',    CoverMath.chairCover({ width: 34, depth: 38, height: 34, armrestHeight: 20, backrestDepth: 6, backWidth: 30 }).yards, 6);
check('wide 40x30x42 arm26 br5 wb36',      CoverMath.chairCover({ width: 40, depth: 30, height: 42, armrestHeight: 26, backrestDepth: 5, backWidth: 36 }).yards, 7);

console.log('\nSofa / loveseat — golden yardage cases (v4: 2 panels + extension scrap-nesting):');
check('loveseat 54x38x34 arm20 br4 wb50', CoverMath.sofaCover({ width: 54, depth: 38, height: 34, armrestHeight: 20, backrestDepth: 4, backWidth: 50 }).yards, 5);
check('sofa 84x40x36 arm22 br5 wb80',      CoverMath.sofaCover({ width: 84, depth: 40, height: 36, armrestHeight: 22, backrestDepth: 5, backWidth: 80 }).yards, 8);
check('big sofa 96x42x38 arm24 br6 wb92',  CoverMath.sofaCover({ width: 96, depth: 42, height: 38, armrestHeight: 24, backrestDepth: 6, backWidth: 92 }).yards, 9);
check('sectional 120x44x36 arm22 br5 wb112',CoverMath.sofaCover({ width: 120, depth: 44, height: 36, armrestHeight: 22, backrestDepth: 5, backWidth: 112 }).yards, 11);

console.log('\nSofa panel-length fix (no length-direction bolt padding; take-up raises hems):');
{
  // Mike's couch. panelLen must equal true geometry = (H-FC) + BR + AT2F + (F2A-FC),
  // NOT the old (H-FC)+B = 86.25 which padded a full bolt into the length.
  var mike = { width: 47, depth: 31, height: 34, armrestHeight: 24, backrestDepth: 2, backWidth: 47 };
  check('sofa panelLen uses true diagonal (no bolt padding)', Math.round(CoverMath.sofaCover(mike).panelLen * 100) / 100, 84.68);
  // take-up of 2" must shorten the panel by 4" (2" off the back drop + 2" off the front drop).
  check('sofa take-up 2" shortens panel by 4"', Math.round((CoverMath.sofaCover(mike).panelLen - CoverMath.sofaCover(Object.assign({}, mike, { takeup: 2 })).panelLen) * 100) / 100, 4);
}

console.log('\nOttoman — golden yardage cases (drop to floor; single or main+strips):');
check('small 20x16x12',  CoverMath.ottomanCover({ length: 20, width: 16, height: 12 }).yards, 2);
check('medium 30x24x18', CoverMath.ottomanCover({ length: 30, width: 24, height: 18 }).yards, 2);
check('wide 48x40x20',   CoverMath.ottomanCover({ length: 48, width: 40, height: 20 }).yards, 4);
check('big 60x50x16',    CoverMath.ottomanCover({ length: 60, width: 50, height: 16 }).yards, 5);

console.log('\nChaise lounge — golden yardage cases (cushion-aware; single or main+extensions):');
check('no-cushion 75x28x16',   CoverMath.chaiseCover({ length: 75, width: 28, height: 16, cushionThickness: 0 }).yards, 3);
check('cushion 75x28x16 ct3',  CoverMath.chaiseCover({ length: 75, width: 28, height: 16, cushionThickness: 3 }).yards, 4);
check('wide 80x40x18 ct4',     CoverMath.chaiseCover({ length: 80, width: 40, height: 18, cushionThickness: 4 }).yards, 5);
check('narrow 60x22x14',       CoverMath.chaiseCover({ length: 60, width: 22, height: 14, cushionThickness: 0 }).yards, 3);

console.log('\nCanonical constants:');
check('bolt width', CoverMath.CONST.BOLT_WIDTH, 55.25);
check('chair hem', CoverMath.CONST.CHAIR_HEM, 0);
check('chair bottom margin', CoverMath.CONST.CHAIR_BOTTOM_MARGIN, 8);
check('tabletop drop', CoverMath.CONST.TABLE_DROP, 10);
check('below-seat drop', CoverMath.CONST.BELOW_SEAT, 5);
check('floor clearance', CoverMath.CONST.FLOOR_CLEARANCE, 3);

console.log('\nWiring — callers must use the shared module:');
const html  = fs.readFileSync(path.join(__dirname, 'calculators', 'table_cover_calculator_MFG.html'), 'utf8');
const chairHtml = fs.readFileSync(path.join(__dirname, 'calculators', 'chair_cover_calculator_snap_back_MFG_v2.html'), 'utf8');
const couchHtml = fs.readFileSync(path.join(__dirname, 'calculators', 'couch_cover_calculator_snap_back_MFG_v4.html'), 'utf8');
const ottomanHtml = fs.readFileSync(path.join(__dirname, 'calculators', 'ottoman_cover_calculator_MFG.html'), 'utf8');
const chaiseHtml = fs.readFileSync(path.join(__dirname, 'calculators', 'chaise_lounge_cover_calculator_MFG.html'), 'utf8');
const react = fs.readFileSync(path.join(__dirname, 'src', 'components', 'MeasurementCalculator.tsx'), 'utf8');
check('standalone table HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(html) && /CoverMath\.(drapeFor|CONST|tableCover)/.test(html), true);
check('standalone chair HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(chairHtml) && /CoverMath\.(chairCover|CONST)/.test(chairHtml), true);
check('standalone couch HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(couchHtml) && /CoverMath\.(sofaCover|CONST)/.test(couchHtml), true);
check('standalone ottoman HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(ottomanHtml) && /CoverMath\.(ottomanCover|CONST)/.test(ottomanHtml), true);
check('standalone chaise HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(chaiseHtml) && /CoverMath\.(chaiseCover|CONST)/.test(chaiseHtml), true);
check('website uses CoverMath.tableCover',
  /cover-math\.js/.test(react) && /CoverMath\.tableCover/.test(react), true);
check('website uses CoverMath.chairCover',
  /CoverMath\.chairCover/.test(react), true);
check('website uses CoverMath.sofaCover',
  /CoverMath\.sofaCover/.test(react), true);
check('website uses CoverMath.ottomanCover',
  /CoverMath\.ottomanCover/.test(react), true);
check('website uses CoverMath.chaiseCover',
  /CoverMath\.chaiseCover/.test(react), true);

if (failures) {
  console.log(`\n${failures} check(s) FAILED.`);
  process.exit(1);
}
console.log('\nAll calculator parity checks passed.');
