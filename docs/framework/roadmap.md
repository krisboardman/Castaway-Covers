# Castaway Covers — Development Roadmap

This roadmap tracks proof obligations — what Castaway Covers can earn the right to claim, in what order.

**Principle:** Stabilize before extending.

**North-star:** Complete customer journey without manual intervention for routine orders, without data loss, without measurement errors.

---

## Current Frontier

Write framework docs → extract calculator logic → audit Shopify catalog

---

## Milestone 1 — Earn Measurement Trust

**Unlocked statement:** "For any supported furniture type, the calculator produces the correct yard count, and the customer understands what to measure."

**Why this order:** The calculators are the product. Every downstream failure — wrong cover size, wasted fabric, customer disappointment — traces back to step 3. Nothing else matters if the math is wrong or the instructions are ambiguous.

**Requires:**
- Extract calculation logic into pure functions (currently embedded in component state)
- Document each formula with rationale (why these dimensions, why this coefficient)
- Test formulas against known production orders — real examples, not invented ones
- Fix measurement label problems: "Depth" ambiguity for chairs, sofa field inversion (what the form calls Width is sent as Length and vice versa in the email), chaise Height meaning (seat height, not total)
- Validate clearance values — are the overages correct for each product type?
- Check the rectangular bolt width edge case — does the table calculator handle unusually wide material correctly?
- Make optional fields (backWidth, armLength) visible with clear guidance on when to measure them

**Exit criteria:**
- Test suite with real examples covering all six product types
- Kris validates output against production orders she's already filled
- Instructions on the product page are unambiguous — a customer who has never ordered can measure correctly on first attempt

**Failure branch:** If a product type cannot be made unambiguous (complex geometry, too many configurations), flag it explicitly, remove self-serve option for that type, and add a "contact us to measure" path.

---

## Milestone 2 — Earn Clean Boundaries

**Unlocked statement:** "Every external system has a clear role. No hardcoded prices, no fragile SKU mapping, no dead code."

**Why this order:** There are four undocumented system boundaries (Shopify Storefront API, Shopify Buy Button SDK, Resend, Formspree). Dead code from the abandoned Shopify checkout path still lives in cart/page.tsx. Prices exist in at least two places. None of this is fatal until you try to change something — then it becomes expensive.

**Requires:**
- Make a checkout decision: keep manual-only flow and remove the dead Shopify checkout code (handleCheckout, /api/create-checkout), or plan migration and leave it staged. Either way, there is currently one live path (isManualCheckout = true, hardcoded) and one dead path. Remove or commit.
- Audit all prices: cover price comes from the Shopify variant lookup; add-on prices ($20 snap straps, $20 handles, $35 split cover with snaps, $4/yard premium color) are hardcoded in component state and in the submit-order email template. One source of truth.
- Audit SKU mapping — the display SKU and the Shopify variant SKU are two different things. Document the mapping or collapse it.
- Fix TypeScript: next.config.mjs has `ignoreBuildErrors: true`. Clean up the `any` types in the calculator and cart store enough to turn this off.
- Document all environment variables: what each one does, what breaks if it's missing, where to get the value.
- Fix email sender domain: both order notification and customer confirmation send from `onboarding@resend.dev` (Resend sandbox). This means emails can land in spam and look illegitimate. Domain needs to be verified in Resend and sender address updated.
- Rename the `magnets` variable: the state variable is called `magnets`, but the product is "Split Cover with Snaps" — the name has diverged from the implementation.
- Update Shopify API version: check the version in use against current stable and pin it explicitly.

**Exit criteria:**
- One source of truth per concern (prices, SKUs, checkout path)
- One live checkout flow, dead code removed
- TypeScript builds clean without `ignoreBuildErrors`
- Emails send from a custom domain address
- All environment variables documented

**Failure branch:** If a concern cannot be collapsed to one source of truth (e.g., Shopify catalog structure resists clean SKU mapping), document the gap explicitly and create a thin mapping layer with a clear owner rather than leaving it implicit.

---

## Milestone 3 — Earn Order Reliability

**Unlocked statement:** "Every order arrives to Kris complete, unambiguous, and actionable."

**Why this order:** Boundaries must be clean before adding reliability guarantees. You cannot make a fragile pipeline reliable — you can only hide the fragility until production.

**Requires:**
- Define a complete order schema: every field an order needs to be actionable, typed, required vs. optional, and what "missing" means for each field
- Graceful variant lookup failure: currently a failed SKU lookup shows an alert and disables checkout with no recovery path. Add: suggest "contact us" with the measurements pre-filled, or allow manual SKU entry for Kris-assisted orders.
- Edit-from-cart integrity: the edit flow uses sessionStorage to pass item data back to the product page. If the session is lost (tab close, navigation), the edit is silently dropped. Needs a fallback.
- Confirmation emails: the customer confirmation currently contains no order ID, no way to reference the order, and no shipping estimate beyond "we'll invoice within 24 hours." Kris's copy contains no order ID either. Add a simple sequential or timestamp-based reference ID shared between both emails.
- Resend failure handling: currently the submit-order API catches email failures but still returns success=true. The cart is cleared. If both emails fail, the order is lost — not in Shopify, not in any database, gone. Add a persistent record (even a simple append to a log) before calling Resend.

**Exit criteria:**
- Zero ambiguous orders (no missing required fields in Kris's email)
- Accurate customer confirmations with a reference ID
- No dropped fields between product page and order email
- Graceful recovery when variant lookup fails
- Order record persists even if Resend is down

**Failure branch:** If a single email-based pipeline cannot carry all required attributes reliably (attachments, long measurement strings, multi-item orders), introduce a parallel order record as a backup — simple structured log, spreadsheet append, or minimal database row — so the email becomes a notification rather than the record of truth.

---

## Milestone 4 — Earn Operational Efficiency

**Unlocked statement:** "Routine operations complete without manual intervention beyond fabric cutting."

**Why this order:** Automation on a broken foundation amplifies bugs. Automating payment collection before order data is reliable creates wrong invoices at scale. Automating production scheduling before order reliability is proven creates production errors at scale.

**Intentionally less specified** — this is the far horizon. Shape it after M3 is complete and Kris's actual manual-intervention patterns are observed.

**Possible components:**
- In-site Stripe payment (customer pays at checkout, no manual invoice step)
- Order tracking visible to customer
- Self-service order status lookup
- Production queue visibility for Kris

**Exit criteria:** Defined after M3. Kris's remaining manual steps after M3 will determine what to automate and in what order.

---

## Site Polish (no milestone dependency)

Issues that don't block any milestone but affect customer experience:

- **"Craftsmanship" vs "Features" naming mismatch:** Nav says "Craftsmanship," URL is `/features`, page title is "Craftsmanship Details." Pick one name and align nav label, URL, page title, and docs.
- **Order summary empty parens before calculation:** Before the customer clicks "Calculate Cover Size & Price," the order summary shows `Cover () x1 — $0.00`. The empty parentheses look like a bug. Show a placeholder like "enter measurements above" or hide the summary until calculation runs.
- **Contact page button color:** "Send Message" button is blue; every other CTA on the site is teal/green. Should match the site's design system.

---

## Deferred (not on the roadmap)

These are real ideas but not in scope until the north-star is reached:

- New product types (sectionals, umbrellas, fire pit covers)
- Wholesale / dealer pricing
- Mobile app
- Analytics / conversion tracking
- Referral or loyalty program
