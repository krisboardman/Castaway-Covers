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

console.log('Table cover — golden yardage cases:');
check('60x36x30 tablecloth',                CoverMath.tableCover({ length: 60, width: 36, height: 30, style: 'tablecloth' }).yards, 4);
check('30x20x18 tablecloth (small/single)', CoverMath.tableCover({ length: 30, width: 20, height: 18, style: 'tablecloth' }).yards, 2);
check('60x35x30 tablecloth (bolt-edge)',    CoverMath.tableCover({ length: 60, width: 35, height: 30, style: 'tablecloth' }).yards, 3);
check('48x24x28 full coverage',             CoverMath.tableCover({ length: 48, width: 24, height: 28, style: 'full' }).yards,       5);

console.log('\nCanonical constants:');
check('bolt width', CoverMath.CONST.BOLT_WIDTH, 55.25);
check('tablecloth drop', CoverMath.CONST.TABLE_DROP, 10);

console.log('\nWiring — both callers must use the shared module:');
const html  = fs.readFileSync(path.join(__dirname, 'calculators', 'table_cover_calculator_MFG.html'), 'utf8');
const react = fs.readFileSync(path.join(__dirname, 'src', 'components', 'MeasurementCalculator.tsx'), 'utf8');
check('standalone HTML uses CoverMath',
  /shared\/cover-math\.js/.test(html) && /CoverMath\.tableCover/.test(html), true);
check('website imports + uses CoverMath',
  /cover-math\.js/.test(react) && /CoverMath\.tableCover/.test(react), true);

if (failures) {
  console.log(`\n${failures} check(s) FAILED.`);
  process.exit(1);
}
console.log('\nAll calculator parity checks passed.');
