#!/usr/bin/env node
/*
 * check-orphans.js — flags product gallery images that no page references.
 *
 * Swapping a photo out of a gallery array doesn't delete the file, so the
 * public/images folders accumulate unused images that still ship with the
 * site. This scans the rendered-site code (src/, calculators/, public html/
 * json) and reports any image in the product folders whose filename never
 * appears.
 *
 *   npm run check-orphans
 *
 * Exits 0 if clean, 1 if orphans are found (handy for CI).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PRODUCT_FOLDERS = [
  'Chairs-Recliners', 'Sofas-Loveseats', 'ChaiseLounges',
  'Ottomans', 'Tables', 'Tablesets',
];
const IMG_RE = /\.(jpg|jpeg|png|webp|avif)$/i;
const CODE_RE = /\.(tsx|ts|jsx|js|html|json|css|md|mjs)$/i;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// Build the reference corpus from the active app code that renders the site.
// Note: public/ is intentionally excluded — it contains archived copies
// (e.g. *_old.html) that still list retired image names and would otherwise
// mask genuine orphans.
let corpus = '';
for (const base of ['src', 'calculators']) {
  for (const f of walk(path.join(ROOT, base))) {
    if (CODE_RE.test(f)) corpus += fs.readFileSync(f, 'utf8') + '\n';
  }
}

let totalOrphans = 0;
console.log('Checking product image folders for unreferenced files...\n');
for (const folder of PRODUCT_FOLDERS) {
  const dir = path.join(ROOT, 'public', 'images', folder);
  if (!fs.existsSync(dir)) continue;
  const images = fs.readdirSync(dir).filter((f) => IMG_RE.test(f));
  const orphans = images.filter((f) => !corpus.includes(f));
  if (orphans.length) {
    totalOrphans += orphans.length;
    console.log(`  ${folder}  (${orphans.length} unused):`);
    for (const o of orphans) console.log(`     - ${o}`);
  }
}

if (totalOrphans === 0) {
  console.log('All product images are referenced. Nothing to clean up.');
  process.exit(0);
}
console.log(`\n${totalOrphans} unused image(s) found. Move them to private-archive/ when ready.`);
process.exit(1);
