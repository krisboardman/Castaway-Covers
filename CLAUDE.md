## Castaway Covers — Project Reference

### Live Site
- **Production URL:** https://castawaycovers.com
- **Vercel alias:** castaway-covers.vercel.app (301 redirects → castawaycovers.com)

### Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **State:** Zustand (cart store)
- **E-commerce:** Shopify Storefront API (Buy Button SDK + Admin API for scripts)
- **Email:** Resend (order confirmations, measurement requests)
- **Hosting:** Vercel (auto-deploys from `main` branch)

### Repository
- **GitHub:** https://github.com/krisboardman/Castaway-Covers.git
- **Branch:** `main` (only branch; auto-deploys to Vercel on push)

### Deployment Flow
1. Make changes locally
2. `git add` + `git commit` + `git push origin main`
3. Vercel detects the push and auto-builds/deploys
4. Live at castawaycovers.com within ~1 minute

### Key Directories
- `src/app/` — Pages (Next.js App Router)
- `src/components/` — React components (Header, Footer, calculators, color selectors, etc.)
- `src/lib/` — Utilities (Shopify client, metadata, structured data)
- `src/store/` — Zustand cart store
- `src/config/` — Site config (coming-soon mode toggle)
- `calculators/` — Standalone calculator HTML files
- `public/images/` — Product photos organized by category

### Environment Variables (in .env.local)
- `NEXT_PUBLIC_SHOPIFY_DOMAIN` — Shopify store domain
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` — Storefront API token
- `SHOPIFY_ADMIN_ACCESS_TOKEN` — Admin API token (for scripts)
- `NEXT_PUBLIC_COMING_SOON_MODE` — Set to "true" to enable coming-soon splash page
- `NEXT_PUBLIC_PREVIEW_TOKEN` — Preview mode token (used in `src/config/site.ts`)

### Pages
- `/` — Homepage (hero carousel, features, gallery)
- `/products/[productType]` — Product pages (chairs, sofas, etc.)
- `/design` — Design My Cover tool
- `/cart` — Shopping cart
- `/checkout/success` — Post-checkout confirmation
- `/chair-calculator` — Measurement calculator for chairs
- `/about`, `/contact`, `/faqs` — Info pages
- `/measurement-service` — In-home measurement service (Monmouth County)
- `/account` — Customer account page
- `/instructions` — Cover care and usage instructions
- `/portfolio` — Portfolio / gallery of completed work
- `/coming-soon` — Splash page (toggled via `NEXT_PUBLIC_COMING_SOON_MODE`)
- `/features`, `/warranty`, `/returns`, `/shipping`, `/privacy`, `/terms` — Policy pages

### Notes
- The `vercel.json` redirect ensures all traffic to `castaway-covers.vercel.app` goes to the custom domain
- Images are cached for 1 year via `next.config.mjs` headers
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection) are set
- TypeScript build errors are currently ignored (`ignoreBuildErrors: true` in next.config.mjs)

### Calculator Math — Single Source of Truth (READ BEFORE TOUCHING ANY CALCULATOR)

The cover **yardage math must live in exactly one place**: `calculators/shared/cover-math.js`.
Both the standalone HTML calculators in `calculators/` and the website calculator
(`src/components/MeasurementCalculator.tsx`) consume that same file. This exists because
the two used to have separate copies of the math and silently drifted apart (e.g. a 54" vs
55.25" bolt width that quietly changed prices).

Rules — follow these for ANY calculator work, including new calculators or a "version 2":

- **Never inline calculation math** in an HTML calculator or in the React component. Put it in
  `cover-math.js` (constants at the top, one function per product type) and call it from both sides.
- A new/renamed calculator (e.g. `*_v2.html`) must `<script src="shared/cover-math.js">` and call
  `CoverMath.*`, and the website must import the same file. Don't fork the formula.
- After changing any formula or constant, add/update a golden case in `check-calculators.js` so the
  change is intentional, and **redeploy** — the website only picks up `cover-math.js` changes on the
  next Vercel build (the standalone HTML updates live).
- `npm run check-calculators` is the guardrail and **runs automatically on every build** (`prebuild`
  in `package.json`). If it fails, the deploy fails. If you add a new calculator file, point the
  wiring check in `check-calculators.js` at it.

**Migration status:** Tables, table sets, and grill islands are unified — one website calculator and
one standalone calculator (`table_cover_calculator_MFG.html`) both drive off `cover-math.js`
(`tableCover` with drape modes tabletop/seats/full + multi-strip layout). Chairs, sofas, chaise, and
ottomans still have two copies and can still drift until they're migrated the same way.

### Framework

The `docs/framework/` directory contains durable reference docs.

- `vision.md` — what the site is for and what it earns
- `principles.md` — failure modes that tests can't catch
- `frontier.db` — the roadmap (query with sqlite3)
- `README.md` — reading order, query examples, authority model

Query the roadmap:

    sqlite3 docs/framework/frontier.db "SELECT code, title, status FROM milestones"

Read the relevant doc before answering questions or making changes
in its domain. When in doubt, check principles.md.