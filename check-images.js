#!/usr/bin/env node
/*
 * check-images.js — flags image paths in the site code that point at a file
 * that isn't there.
 *
 * Finds every "/images/..." path written in src/ and makes sure the file
 * exists under public/. A renamed or deleted photo shows up here instead of
 * as a broken picture on the live site. (check-orphans.js checks the other
 * direction: files that nothing uses.)
 *
 *   npm run check-images
 *
 * Exits 0 if every path resolves, 1 if any are missing.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CODE_RE = /\.(tsx|ts|jsx|js|json|css|mjs)$/i;
// "/images/..." up to a quote, space, bracket or ${ — must end in an image extension.
const PATH_RE = /\/images\/[^"'`\s)(<>?#$]+?\.(?:jpg|jpeg|png|webp|avif|gif|svg)(?![\w])/gi;

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

const missing = new Map(); // image path -> files that mention it
let checked = 0;
for (const file of walk(path.join(ROOT, 'src'))) {
  if (!CODE_RE.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(PATH_RE)) {
    checked++;
    let rel = match[0];
    try { rel = decodeURIComponent(rel); } catch (e) { /* keep as written */ }
    if (fs.existsSync(path.join(ROOT, 'public', rel))) continue;
    if (!missing.has(match[0])) missing.set(match[0], new Set());
    missing.get(match[0]).add(path.relative(ROOT, file));
  }
}

console.log(`Checked ${checked} image path(s) in src/ against public/...\n`);
if (missing.size === 0) {
  console.log('All referenced images exist.');
  process.exit(0);
}
for (const [p, files] of missing) {
  console.log(`  missing: ${p}`);
  for (const f of files) console.log(`     in ${f}`);
}
console.log(`\n${missing.size} image path(s) point at a file that does not exist.`);
process.exit(1);
