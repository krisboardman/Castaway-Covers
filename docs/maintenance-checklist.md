# Castaway Covers — Maintenance Checklist

A practical cadence for keeping the site healthy. Check off items as you
complete them and update the "Last checked" date so you can see at a
glance when you last did a pass.

---

## Monthly (~15 minutes)

Quick health check. The goal is catching regressions early, before they
compound into traffic or revenue loss.

| Done | Task | Last checked |
| :-: | :-- | :-- |
| ☐ | **PageSpeed Insights** — run both mobile + desktop at pagespeed.web.dev. Note the scores. A drop of >10 points vs. last month deserves investigation. |  |
| ☐ | **Search Console → Indexing → Pages** — scan for new errors (404s, crawl failures, "Crawled – currently not indexed"). Click "Validate fix" on anything resolved. |  |
| ☐ | **Search Console → Performance** — eyeball the clicks and impressions curve for surprise drops. |  |
| ☐ | **Vercel Dashboard** — confirm the most recent production deploy is green and no builds have been failing. |  |
| ☐ | **Checkout spot check** — add a product to cart, walk through checkout, confirm the order-confirmation email arrives. |  |
| ☐ | **Resend dashboard** — scan for bounces or delivery failures on order confirmations and measurement-request emails. |  |

---

## Quarterly (~1 hour)

Deeper audit. The goal is finding things that are slowly drifting —
outdated content, stale dependencies, oversized new images, etc.

| Done | Task | Last checked |
| :-: | :-- | :-- |
| ☐ | **`npm audit`** — run in repo root. Fix high/critical vulnerabilities. Batch moderate ones. |  |
| ☐ | **Sitemap resubmit** — Search Console → Sitemaps → resubmit `sitemap.xml`. Add any new pages. Bump `<lastmod>` dates on pages with substantive changes. |  |
| ☐ | **Image optimization sweep** — for any images added this quarter (hero, product, portfolio), confirm they're WebP, reasonably sized, and using `next/image`. Oversized 1920px images served to phones is the pattern to watch for. |  |
| ☐ | **Content freshness** — read About, FAQs, Warranty, Returns, Shipping, Measurement Service. Any stale prices, outdated claims, or policy drift? |  |
| ☐ | **Real-device mobile testing** — open the site on actual phones (not just browser resize). Walk through the full design/measure/checkout flow. |  |
| ☐ | **Redirects review** — open `next.config.mjs`. Retire any 301 for a URL with zero Search Console traffic in 12+ months. |  |
| ☐ | **Security headers** — run securityheaders.com against castawaycovers.com. Aim for A+. Investigate any grade drop. |  |
| ☐ | **Competitor scan** — 20 minutes on Covers & All, Outdoor Covers, and local competitors. Note pricing, new features, warranty terms, tactics worth borrowing. |  |

---

## Annual

Low-frequency but high-cost-if-missed items.

| Done | Task | Last checked |
| :-: | :-- | :-- |
| ☐ | **Domain auto-renew** — confirm castawaycovers.com auto-renew is on at your registrar. Lapsed domains are the #1 "took us down for a week" story. |  |
| ☐ | **Rotate access tokens** — regenerate `SHOPIFY_ADMIN_ACCESS_TOKEN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Update them in Vercel env vars. |  |
| ☐ | **Dependency major-version upgrades** — bump Next.js, React, and Tailwind to current major versions. Annual cadence hurts less than multi-year leaps. |  |

---

## When a task finds a problem

If a check turns up something real, file it as a new commit rather than
fixing it in-place during the audit. That way each fix shows up in git
history and the audit itself stays quick.

Keep commit messages in the style used in this repo:
`<Topic>: <brief description>` — e.g., `SEO cleanup: fix 404s from Google Search Console audit`.

## Reference — recent performance baseline

Captured April 2026 after the perf pass; use as a comparison target:

- Mobile PageSpeed: **95** (Performance), **94** (Accessibility), **100** (Best Practices), **92** (SEO)
- Desktop PageSpeed: **100**
- Search Console: 11 indexed pages, 6 commits worth of SEO / perf fixes landed
