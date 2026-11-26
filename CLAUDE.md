# Castaway Covers

Next.js 14 (`src/`), TypeScript, and Tailwind CSS storefront with Shopify Buy Button integration, plus standalone HTML manufacturing calculators in `calculators/`.

## Calculator Rulebook
- **Read [`calculators/CLAUDE.md`](calculators/CLAUDE.md) first** before editing any calculator HTML file, `calculators/shared/cover-math.js`, or custom one-off cover diagrams. It is the single source of truth for cut vs. assembly diagrams, color palette, snap/grommet/bungee rules, sectionals, strip math, 54.5" bolt width, and auto-clearance.

## Key Scripts & Commands
- `npm run dev` / `npm run lint` / `npm run build` — local Next.js dev server, ESLint, and production build (`prebuild` automatically runs `check-calculators.js`).
- `node check-calculators.js` (`npm run check-calculators`) — golden yardage regression and parity guard verifying standalone HTML calculators and the storefront both call `calculators/shared/cover-math.js`.
- `node check-orphans.js` (`npm run check-orphans`) — scans `src/` and `calculators/` to flag unreferenced product gallery images in `public/images/`.
- `./deploy.sh` — runs `npm run build`, commits changes, and prints GitHub / Vercel deployment steps (pushing to `main` triggers Vercel auto-deploy).
- `node shopify-helpers.js <list|check-skus|export|validate>` — Shopify SKU/product helpers (`npm run shopify:*`).

## Guardrails
- **Archive folders are frozen:** Never modify files inside any `archive/` subfolder (including `calculators/archive calculators/` or `old-images/`) — even on blanket cleanup requests — unless explicitly confirmed per file.
- **Shared cover math:** Keep yardage and cut math in `calculators/shared/cover-math.js` and verify with `node check-calculators.js` after any calculation change.
- **Do not duplicate calculator rules here:** Add any new calculator conventions directly to `calculators/CLAUDE.md`.
