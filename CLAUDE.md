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