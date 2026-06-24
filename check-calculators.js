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

console.log('\nCanonical constants:');
check('bolt width', CoverMath.CONST.BOLT_WIDTH, 55.25);
check('tabletop drop', CoverMath.CONST.TABLE_DROP, 10);
check('below-seat drop', CoverMath.CONST.BELOW_SEAT, 5);
check('floor clearance', CoverMath.CONST.FLOOR_CLEARANCE, 3);

console.log('\nWiring — both callers must use the shared module:');
const html  = fs.readFileSync(path.join(__dirname, 'calculators', 'table_cover_calculator_MFG.html'), 'utf8');
const react = fs.readFileSync(path.join(__dirname, 'src', 'components', 'MeasurementCalculator.tsx'), 'utf8');
// The standalone table tool shares the bolt/drape CONSTANTS (the thing that
// drifted before); the website uses the full multi-strip tableCover().
check('standalone HTML loads + uses CoverMath',
  /shared\/cover-math\.js/.test(html) && /CoverMath\.(drapeFor|CONST|tableCover)/.test(html), true);
check('website imports + uses CoverMath.tableCover',
  /cover-math\.js/.test(react) && /CoverMath\.tableCover/.test(react), true);

if (failures) {
  console.log(`\n${failures} check(s) FAILED.`);
  process.exit(1);
}
console.log('\nAll calculator parity checks passed.');
