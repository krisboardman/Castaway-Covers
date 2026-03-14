# Castaway Covers Framework Concept Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write the `docs/framework/` directory — 6 durable reference documents that capture principles, architecture, domain science, order lifecycle, and roadmap for Castaway Covers. Plus update CLAUDE.md to route Claude Code sessions to the right framework doc.

**Architecture:** Six markdown files in `docs/framework/` plus a CLAUDE.md update. Each document is self-contained and can be written independently. The README references the other five by filename. Minimal code change (CLAUDE.md routing section only).

**Tech Stack:** Markdown files, git.

**Spec:** `docs/superpowers/specs/2026-03-13-framework-concept-design.md`

**Key references to read before writing:**
- `CLAUDE.md` — project operational reference (tech stack, pages, env vars)
- `src/components/MeasurementCalculator.tsx` — all calculation formulas live here
- `src/components/AddOnOptions.tsx` — add-on pricing and per-product-type availability
- `src/components/ColorSelector.tsx` — color system and premium upcharge
- `src/components/ShopifyBuyButton.tsx` — "Buy Now" / "Add to Cart" UI (misleadingly named — does NOT create Shopify checkouts)
- `src/lib/shopify-client.ts` — Shopify integration (uses Buy Button SDK as product API client, not for UI)
- `src/store/cartStore.ts` — Zustand cart store with localStorage persistence
- `src/app/api/submit-order/route.ts` — manual order submission (Resend email to Kris + customer confirmation, references Stripe for payment)
- `src/app/api/create-checkout/route.ts` — Shopify Cart API checkout (DEAD CODE — manual checkout hardcoded true)
- `src/app/cart/page.tsx` — cart page with manual checkout form, photo upload, edit-from-cart flow
- `src/app/products/[productType]/page.tsx` — product page with measurement confirmation checkbox

**Existing framework docs to use as tone/structure models:**
- `/Users/mikeedwards/BostonStrong/docs/framework/` — 5 docs (principles, science, architecture, system-map, roadmap)
- `/Users/mikeedwards/Columbo/docs/framework/` — 6 docs (principles, architecture, system-map, capability-model, query-contracts, roadmap)

**Writing style:** These docs are NOT for human reading. They are **Claude Code reasoning substrate.** Both Kris and Mike interact with this project through Claude Code sessions in the same repo. The docs must help Claude answer both Kris-type questions ("why is this order wrong?", "can we add a new color?") and Mike-type questions ("where does this break?", "what should I refactor?").

Write for Claude-as-reader: include the reasoning chains Claude needs to answer questions, not just bare facts. Every section should help Claude answer a class of questions. Direct, opinionated, no filler. Short sentences. Tables where they clarify. Match the voice of BostonStrong and Columbo framework docs but optimized for Claude Code consumption rather than human skimming.

---

## Chunk 1: README and Principles

### Task 1: Create docs/framework/ directory and README.md

**Files:**
- Create: `docs/framework/README.md`

- [ ] **Step 1: Create the directory and write README.md**

Write `docs/framework/README.md` with:
- One-sentence description: Castaway Covers makes custom-fit outdoor furniture covers — measured, cut, and sewn for one specific piece of furniture.
- What this folder is: durable thinking that outlives any one implementation. A thing belongs here only if: a fresh session must know it to think correctly, it will remain relevant across many iterations, it is more durable than any one spec or task.
- Reading order: principles.md → product-science.md → architecture.md → order-lifecycle.md → roadmap.md
- Authority hierarchy:
  - **Framework** is authoritative for durable truth
  - **CLAUDE.md** is operational reference (file paths, env vars, commands)
  - **Specs** (`docs/superpowers/specs/`) are frozen point-in-time design decisions
  - **Plans** (`docs/superpowers/plans/`) are execution scratch
  - **Kris** is final authority on all business decisions — framework captures her intent but she can override anything

- [ ] **Step 2: Commit**

```bash
git add docs/framework/README.md
git commit -m "Add framework README with reading order and authority hierarchy"
```

### Task 2: Write principles.md

**Files:**
- Create: `docs/framework/principles.md`

- [ ] **Step 1: Write principles.md**

Sections in order:

**Charter:** Castaway Covers makes custom-fit outdoor furniture covers from premium marine-grade vinyl — measured, cut, and sewn for one specific piece of furniture. Not mass-market, not one-size-fits-all. The site is the primary sales channel. The business promise is **fit** — a cover built for your specific chair, sofa, or table.

Every cover includes: heavy-duty marine vinyl (UV protected, fire retardant, mildew resistant), reinforced grommets, durable bungee cords with hooks and locking clips, custom corner cut-outs with waterproof liner, sealed inner edges, and Castaway's signature wavy edge design.

Two customer paths: (1) self-measure on the site, or (2) professional in-home measurement service ($75, Monmouth County NJ, credited toward $500+ orders).

**What Castaway Covers is not:** Not a marketplace (one vendor, one product type, many configurations). Not a catalog site (every order is custom — measurements define the product). Not a subscription business. Not a tech company — the tech serves the covers.

**Authority model:**
- Kris owns all business decisions: pricing, products, policies, customer communication
- Measurement formulas are domain science — changes require Kris's validation against physical reality (real covers on real furniture)
- Technical decisions (how to implement, what to refactor) can be made by whoever works on the code, but must not change business behavior without Kris's approval

**Quality hierarchy** (what matters most, in order):
1. Measurement accuracy — wrong measurements = wrong cover = return. The calculators are the product.
2. Order reliability — every order must flow from customer to Kris without dropping information
3. Customer clarity — the site must make it easy to understand what to measure and how
4. Site stability — no broken pages, no dead flows, no confusing errors
5. Aesthetics / polish — matters, but not at the expense of 1–4

**Kris as sensor:** Kris is the domain expert. She knows what measurement mistakes customers actually make, which product types are tricky, where orders go wrong. Her operational experience is the highest-trust data source. When the site's logic and Kris's experience disagree, investigate — don't assume the code is right.

**Language discipline** — five terms that cause mistakes when used loosely:
- Do not say "product" without specifying: Shopify product, cover type, or configured order
- Do not say "price" without specifying: base price, total with add-ons, or Shopify variant price
- Do not say "measurements" without specifying: customer inputs, calculated dimensions, or fabric yards
- Do not say "checkout" without specifying: manual form submission (active), Shopify checkout (dormant), or the customer-facing purchase experience
- Do not say "Width" or "Length" without checking which product type — for sofas, the internal `width` field is labeled "Length" and vice versa on screen

**Scope:** Castaway Covers is a single-product-type business with many configurations. The complexity is in the configuration (measurements → fabric), not the catalog. Features and infrastructure should reflect this — optimize for one product done well, not a platform that supports many.

- [ ] **Step 2: Commit**

```bash
git add docs/framework/principles.md
git commit -m "Add framework principles: charter, authority, quality hierarchy"
```

---

## Chunk 2: Architecture

### Task 3: Write architecture.md

**Files:**
- Create: `docs/framework/architecture.md`

Read before writing:
- `src/components/MeasurementCalculator.tsx` — to see how calculator, SKU generation, and Shopify lookup are currently tangled
- `src/lib/shopify-client.ts` — to understand the Shopify integration surface
- `src/store/cartStore.ts` — to see the cart data model and persistence (localStorage, NOT ephemeral)
- `src/app/api/submit-order/route.ts` — to understand the ACTIVE checkout path (Resend + Stripe)
- `src/app/api/create-checkout/route.ts` — to understand the DORMANT Shopify checkout path
- `src/app/cart/page.tsx` — to see manual checkout form, photo upload, and `isManualCheckout = true` hardcoding

- [ ] **Step 1: Write architecture.md**

Open with: Architecture exists to answer one question — where does truth live? The current codebase has no clear answer. Prices exist in both Shopify and hardcoded in components. SKU generation happens client-side. External services are undocumented. This document defines the boundaries.

**Four boundaries** (not three — the red-team found Stripe):

**Boundary 1 — Shopify (catalog):**
- Shopify owns: product definitions (what types exist), variant inventory and availability, variant pricing
- Shopify should own but currently doesn't clearly: base pricing (hardcoded $45/yard fallback in `MeasurementCalculator.tsx:calculatePrice()`), SKU definitions (generated client-side in `generateShopifySKU()`)
- Shopify does NOT handle checkout or payment in the current production flow. The site is on the $10/month Shopify plan. The Shopify Cart API checkout code exists (`create-checkout/route.ts`) but is dead code behind `isManualCheckout = true` (hardcoded in `cart/page.tsx:23`).
- The Shopify Buy Button SDK (`@shopify/buy-button-js`) is used solely as a product API client for variant lookups — not for any buy-button UI rendering.
- Contract: the site reads product/variant data from Shopify. If a price or product changes, it changes in Shopify first. The site is a read-only consumer of the catalog.

**Boundary 2 — The Site (customer experience and measurement science):**
- The site owns: measurement input and validation (calculators), fabric yard calculations (domain science), add-on configuration (snap straps, handles, split cover with snaps), color selection and premium upcharge, cart state (Zustand with localStorage persistence), customer-facing content (FAQs, instructions, policies), photo upload (1-3 furniture photos, sent as email attachments)
- The cart persists in localStorage (key: `castaway-covers-cart`). It survives page reloads and browser sessions. It is NOT ephemeral — but it is also not the order record. The order record is the email sent via Resend.
- Cart items can be edited: the cart stores the item in sessionStorage as `editCartItem`, navigates back to the product page, which loads those values in update mode.
- A measurement confirmation checkbox ("I confirm my measurements are accurate and understand custom covers cannot be returned for sizing errors") must be checked before buy/add-to-cart buttons are enabled.
- Contract between site and payment: site computes the cover spec (measurements → yards → price), collects customer info (name, email, address, phone, optional photos), and submits the complete order via the manual checkout API.

**Boundary 3 — Payment and Email services (Stripe + Resend):**
- **Resend** handles all email: order notification to Kris, confirmation email to customer. Uses `RESEND_API_KEY` env var. Currently sends from `onboarding@resend.dev` (Resend sandbox domain — not `castawaycovers.com`).
- **Stripe** handles payment. Kris manually sends a Stripe invoice to the customer email after reviewing the order. The site itself does not process payment — it tells Kris to "Send Stripe invoice to [email] for $[total]."
- Additional undocumented env vars needed for Shopify checkout path (currently dormant): `SNAP_STRAPS_VARIANT_ID`, `HANDLES_VARIANT_ID`, `MAGNETS_VARIANT_ID`, `COLOR_UPCHARGE_VARIANT_ID`.
- The dormant Shopify checkout uses Cart API (`cartCreate` mutation) pinned to API version `2024-01`. Shopify deprecates API versions — this will need updating if ever reactivated.

**Boundary 4 — Manual Operations (Kris):**
- Kris owns: order review, Stripe invoice creation and sending, measurement verification (especially for measurement-service orders), fabric cutting and production, customer communication beyond automated emails, exception handling (unusual sizes, custom requests)
- The measurement service ($75, Monmouth County NJ) is a separate customer entry path — Kris visits the home, measures the furniture, and creates the order. The $75 fee is credited toward purchases of $500+.
- Contract: the site must deliver a complete, unambiguous order to Kris. No dropped fields, no ambiguous measurements. Customer photos (when provided) help Kris verify the furniture type and spot measurement issues.

**Architectural rules:**
1. Prices live in Shopify. The site reads them, never hardcodes them.
2. Measurement formulas live in documented, tested functions — not tangled into UI components.
3. Every order must be complete at the point of submission — no field should require Kris to call the customer.
4. Cart state (Zustand/localStorage) is a convenience for the customer, not the order record. The order record is the submitted email.
5. The site should degrade gracefully if Shopify variant lookup fails — currently it shows an `alert()` and disables checkout, which is a hard failure, not graceful degradation.

**Current state vs. target** (table format):

| Concern | Current State | Target State |
|---------|--------------|--------------|
| Base pricing | Hardcoded fallback in `calculatePrice()` ($45/yard) | Read from Shopify variant prices; fail explicitly if lookup fails |
| SKU mapping | Generated client-side in `generateShopifySKU()`, inconsistent casing across types | Defined in Shopify, looked up by site with consistent format |
| Checkout | Manual checkout hardcoded `true`. Shopify checkout is dead code with 4 fallback methods. | Decide: keep manual (simpler) or migrate to Shopify (more automated). Remove dead code for whichever path is not chosen. |
| Measurement logic | Tangled into `MeasurementCalculator.tsx` (calc + UI + Shopify lookup + SKU generation) | Pure functions in their own module, tested independently |
| Order data | Manual form collects name/email/address/phone + cart items + optional photos → Resend email | Single complete order schema with validation before submission |
| Email sender | `onboarding@resend.dev` (Resend sandbox) | Custom domain (`castawaycovers.com`) for brand and deliverability |
| Display SKU | Generated as `{TYPE}-{L}x{W}x{H}-{backHeight}` for display, separate from Shopify SKU | Document both SKU formats and their purposes |

- [ ] **Step 2: Commit**

```bash
git add docs/framework/architecture.md
git commit -m "Add framework architecture: four boundaries, current vs target state"
```

---

## Chunk 3: Product Science

### Task 4: Write product-science.md

**Files:**
- Create: `docs/framework/product-science.md`

Read before writing:
- `src/components/MeasurementCalculator.tsx` — all formulas: `calculateYards()`, `calculateAngle()`, `calculatePrice()`, `generateShopifySKU()`, `calculateSKU()`, and `productConfigs`
- `src/components/AddOnOptions.tsx` — add-on types, pricing, AND per-product-type availability matrix (lines 30-37)
- `src/components/ColorSelector.tsx` — color list, premium flag, upcharge logic

- [ ] **Step 1: Write product-science.md**

Open with: This document captures the domain knowledge that makes Castaway Covers work — how furniture dimensions become fabric covers. Any session modifying calculators, pricing, or product configuration must read this first.

Note provenance: "Formulas documented from source code as of 2026-03-13. Not yet validated against Kris's production experience."

**The fundamental problem:** A customer has a piece of furniture with physical dimensions. Castaway needs to determine how many yards of 54"-wide marine vinyl bolt fabric to cut so that, when sewn, the cover fits that specific piece of furniture. The calculation accounts for furniture geometry, floor clearance, seam allowances, and bolt width constraints.

**Six product types, three calculation models:**

| Product Type | URL slug | Shopify SKU prefix | Calc Model | Fields |
|---|---|---|---|---|
| Chairs / Recliners | `chairs-recliners` | `chairs/recliners` | Seated w/ backrest | 6 (width, depth, height, backrestDepth, armrestHeight, backWidth*) |
| Sofas / Loveseats | `sofas-loveseats` | `sofas-loveseats` | Seated w/ backrest (doubled) | 5 (width†, depth†, height, backrestDepth, armrestHeight) |
| Chaise Lounges | `chaise-lounge` | `Chaiselounges` | Chaise | 5 (width, length, height‡, armrestHeight, armLength*) |
| Tables | `tables` | `tables` | Simple rectangular | 3 (width, length, height) |
| Table Sets | `table-sets` | `tablesets` | Simple rectangular | 3 (width, length, height) |
| Ottomans | `ottomans` | `Ottomans` | Simple rectangular | 3 (width, length, height) |

\* Optional field — not used in yard calculation, passed to Kris as construction note
† **Label inversion for sofas:** internal field `width` is labeled "Length" on screen, internal `length` is labeled "Depth". The submit-order email also uses these inverted labels. This is a known confusion source.
‡ For chaise lounges, "Height" means "Floor to Bottom of Seat", not top of backrest.

Note: URL accepts both `chaise-lounge` (singular) and `chaise-lounges` (plural) — both map to the same product page.

**Per-model constants:**

| Constant | Chairs | Sofas | Chaise | Tables/Sets/Ottomans |
|----------|--------|-------|--------|---------------------|
| Floor clearance | 6" | 4" | 3" | 4" |
| Hem allowance | 0.5" | 0.5" | none | none |
| Bolt width constraint | no | no | yes (54") | no |
| Lanes | 1 | 2 (center seam) | 1 | 1 |
| Angle (AT2F) | yes | yes | no | no |

Rationale for per-type floor clearance values is undocumented — needs validation with Kris.

**Model 1: Seated furniture with backrests** (chairs/recliners, sofas/loveseats)

Customer inputs:
- Width (front, arm to arm) — for sofas, labeled "Length" on screen
- Depth (back of furniture to ground, then horizontal to front edge — NOT seat depth) — labeled "Depth" with explanation on screen
- Height (top of backrest to ground)
- Backrest Depth (thickness of the backrest)
- Armrest Height (ground to top of armrest)
- Back Width (chairs only, optional — if narrower than front width)

Derived value — AT2F (Armrest-Top to Front):
```
AT2F = √[(Height - ArmrestHeight)² + Depth²]
```
This is the diagonal from the top of the armrest to the front edge, following the seat surface slope. It models the fabric path over the seat. Customers do not directly measure this — it is derived from Height, ArmrestHeight, and Depth. Errors in any of those three inputs compound through the square root.

Main length:
```
ML = (Height + BackrestDepth + AT2F + ArmrestHeight) - (2 × FloorClearance)
```
Floor clearance is subtracted twice — the cover doesn't reach the floor on either the front or back side.

Additional length (armrest/backrest overhang):
```
addLength = ArmrestHeight + AT2F + BackrestDepth - FloorClearance + hem
```

Per-lane fabric length:
```
perLaneLength = ML + addLength
```

For **chairs** (single-piece cut, FC=6", hem=0.5"):
```
yards = ceil(perLaneLength / 36)
```

For **sofas** (two-lane cut with center seam, FC=4", hem=0.5"):
```
yards = ceil((perLaneLength / 36) × 2)
```
Note: rounding happens AFTER multiplying by 2, not before. `ceil(yardsPerLane × 2)` ≠ `ceil(yardsPerLane) × 2`.

**Model 2: Chaise lounges** (unique geometry)

Customer inputs:
- Width (arm to arm)
- Length (folded down)
- Height (floor to bottom of seat — NOT top of backrest)
- Armrest Height (floor to top of armrest)
- Arm Length (optional — not used in yard calc)

No angle calculation. Constants: bolt width = 54", clearance = 3"

```
mainLength = Length + 2 × (Height - 3)
mainWidth = Width + 2 × (ArmrestHeight - 3)

if mainWidth > 54:
    additionalLength = (mainWidth - 54) + 2
else:
    additionalLength = 0

totalLength = mainLength + additionalLength
yards = ceil(totalLength / 36)
```

The key constraint: if the computed mainWidth exceeds the 54" bolt width, extra fabric length is needed for a seam panel. The `+ 2` in `additionalLength` is seam allowance.

**Model 3: Simple rectangular** (tables, table sets, ottomans)

Customer inputs: Width, Length, Height. All three types use identical formula.

```
drop = max(0, Height - 4)
totalLength = Length + 2 × drop
yards = ceil(totalLength / 36)
```

FloorClearance = 4" for all three types. Note: `Width` is used in the physical cover but not in the yard calculation — the fabric bolt (54") is assumed wide enough. If width + 2×drop exceeds 54", additional fabric would be needed, but this is not currently checked.

**Two SKU systems:**

1. **Display SKU** (`calculateSKU()`): `{TYPE}-{L}x{W}x{H}-{backHeight}` — shown in cart, order emails, Shopify custom attributes. Human-readable.
2. **Shopify SKU** (`generateShopifySKU()`): `{product-type}-{yards}` — used for variant lookup. Machine-readable.

SKU casing is inconsistent across types: `chairs/recliners`, `sofas-loveseats`, `Chaiselounges`, `Ottomans`, `tables`, `tablesets`. This causes lookup failures.

**Variant lookup and pricing:**

Lookup chain when customer clicks "Calculate Cover Size & Price":
1. Calculate yards from measurements
2. Generate Shopify SKU: `{product-type}-{yards}`
3. Look up Shopify variant by SKU → get price and variant ID
4. If SKU lookup fails, try matching by variant title (e.g., "4 yards", "4 Yards")
5. If BOTH fail: **hard failure** — `alert('Product variant not found. Please contact support.')` and checkout buttons are disabled (empty variantId). The customer is stuck.

The `calculatePrice()` function returns `yards × $45` but this value is only used as a display fallback in the failure case — it does NOT enable checkout when the Shopify lookup fails.

**Add-ons** (flat per-cover charges, defined in AddOnOptions.tsx):

| Add-On | Price | Available For | Internal Variable |
|--------|-------|---------------|-------------------|
| Snap Straps | +$20/cover | chairs-recliners, sofas-loveseats, chaise-lounge | `snapStraps` |
| Handles | +$20/cover | ALL product types | `handles` |
| Split Cover with Snaps | +$35/cover | sofas-loveseats, table-sets | `magnets` (legacy name) |

Note: The third add-on is called "Split Cover with Snaps" in the UI (two-piece cover connected with marine-grade snaps). The internal variable is still named `magnets` — this is a legacy artifact from when it was "Magnetic Closures." All code references use `magnets` but all customer-facing text says "Split Cover with Snaps."

**Color system** (defined in ColorSelector.tsx):

Standard colors (no upcharge): Classic Blue, Cream, Green, Grey, Lemon, Light Brown, Mist Grey, Navy, Sand Dune, Wine

Premium colors (+$4 per yard): Diamond Pacific Blue, Diamond Red

Premium upcharge: $4 × yards × quantity.

**Total order price:**
```
total = (basePrice × quantity) + (addOnCharges × quantity) + premiumColorUpcharge
```

Where basePrice comes from Shopify variant lookup, addOnCharges is sum of selected add-ons, and premiumColorUpcharge is $4 × yards × quantity if a premium color is selected.

**Customer-provided photos:**

Customers can upload 1-3 photos of their furniture (max 10MB each) on the cart page. Photos are sent as email attachments to Kris via Resend. This helps Kris verify the furniture type and spot potential measurement issues before cutting fabric.

**Gusset fabric:**

The profit calculator (`calculators/profit_calculator.html`) references "gusset fabric" as a separate material from vinyl fabric. Gusset fabric is a production concern — its relationship to the online ordering flow and yard calculations is undocumented and needs clarification from Kris.

**Known issues and open questions:**
- AT2F is derived, not directly measured — errors in Height, ArmrestHeight, or Depth compound through the square root
- "Depth" is the most confusing measurement label — not seat depth, but back-to-ground horizontal. Label includes explanation but customers still get it wrong
- Sofa label inversion (internal `width` = screen "Length") creates confusion for anyone reading the code
- SKU casing inconsistency causes variant lookup failures
- $45/yard fallback price can diverge from Shopify but is only displayed in failure mode (checkout is blocked)
- Optional fields `backWidth` (chairs) and `armLength` (chaise) are passed through to the order but not used in yard calculation — their impact on the physical cover is undocumented
- Floor clearance values (6", 4", 3") differ by product type with no documented rationale
- Simple rectangular model does not check if width + 2×drop exceeds bolt width (54")
- The `magnets` variable name throughout the codebase no longer matches the product name ("Split Cover with Snaps")

- [ ] **Step 2: Commit**

```bash
git add docs/framework/product-science.md
git commit -m "Add framework product-science: measurement formulas, pricing, and add-on matrix"
```

---

## Chunk 4: Roadmap

### Task 5: Write roadmap.md

**Files:**
- Create: `docs/framework/roadmap.md`

- [ ] **Step 1: Write roadmap.md**

Open with: This roadmap tracks proof obligations — what Castaway Covers can earn the right to claim, in what order. Architecture tracks boundaries. Product-science tracks formulas. This doc tracks what gets built and why.

**Roadmap principle:** Stabilize before extending. Don't add new product types or features until the existing flow is reliable and the boundaries are clean.

**North-star capability:** Castaway Covers should be able to handle the complete customer journey — from "I have a chair" to "here's your fitted cover" — without manual intervention for routine orders, without data loss, and without measurement errors.

**Milestone 1 — Earn measurement trust**

Unlocked statement: "For any supported furniture type, the calculator produces the correct fabric yard count, and the customer understands what to measure."

Why first: Wrong measurements = wrong covers = returns. The calculators are the product. Everything downstream depends on this.

Requires:
- Extract calculation logic from `MeasurementCalculator.tsx` into pure, testable functions (currently tangled with UI + Shopify lookup + SKU generation)
- Document every formula with physical rationale (why this math models this shape) — product-science.md begins this
- Test against known-good measurements from Kris's production history
- Improve measurement labels (especially "Depth" and the sofa width/length inversion)
- Validate floor clearance values (6"/4"/3") with Kris — rationale is undocumented
- Verify simple rectangular model handles wide furniture (width + 2×drop > 54")
- Validate the measurement confirmation checkbox provides adequate protection

Exit criteria:
- Every formula has a test suite with real-world examples validated by Kris
- Kris can run a measurement through the calculator and confirm the yard count matches her production experience
- Measurement instructions are unambiguous for each product type
- Photo upload is documented as a verification aid

Failure branch: If a formula can't be validated against production data, flag the product type and add a "contact us for custom sizing" path rather than shipping a cover from an unvalidated calculation.

**Milestone 2 — Earn clean boundaries**

Unlocked statement: "Every external system has a clear role. No hardcoded prices, no fragile SKU mapping, no dead code."

Why second: The codebase has four external service boundaries (Shopify, Resend, Stripe, Vercel) but only Shopify is documented. Dead Shopify checkout code with 4 fallback methods creates confusion. Prices exist in two places.

Requires:
- **Checkout decision:** Manual checkout is the active path (Resend email + Stripe invoice). Shopify checkout is dead code behind a hardcoded flag. Decide: keep manual (simpler, works today) or migrate to Shopify (more automated, requires higher plan). Remove the dead path.
- Audit every hardcoded price and SKU against Shopify's actual product catalog
- Make the site read product/variant data from Shopify consistently
- Fix TypeScript (remove `ignoreBuildErrors: true` from next.config.mjs) so the type system guards boundaries
- Document all env vars including: `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, and the dormant Shopify variant IDs (`SNAP_STRAPS_VARIANT_ID`, etc.)
- Rename `magnets` variable to match current product name ("Split Cover with Snaps") or at minimum add code comments explaining the legacy name
- Address Resend sender domain (`onboarding@resend.dev` → custom domain)
- Remove or update the Shopify Buy Button SDK dependency if only used for product API calls (consider using Storefront API directly)
- If Shopify checkout is kept: update pinned API version `2024-01` before Shopify deprecates it

Exit criteria:
- One source of truth for each concern (product definition, pricing, variant identity)
- One checkout flow with the dead path removed
- TypeScript builds without ignored errors
- All external services documented with their env vars
- Customer emails sent from `castawaycovers.com` domain

Failure branch: If Shopify's data model can't cleanly support the site's needs, document the gap and create a minimal, explicit mapping layer rather than silently hardcoding.

**Milestone 3 — Earn order reliability**

Unlocked statement: "Every order arrives to Kris complete, unambiguous, and actionable — no dropped fields, no follow-up calls needed."

Why third: Boundaries must be clean (Milestone 2) before the order flow can be simplified. Otherwise you're patching around a broken integration.

Requires:
- Define a complete order schema (all measurements including optional fields, color, add-ons with correct names, quantities, calculated yards, both SKU formats, customer info, photos)
- Ensure the checkout path delivers the full schema to Kris in every case
- Handle the variant lookup failure gracefully — currently it's an `alert()` that blocks the customer with no recovery path
- Validate order data before submission (all required fields present, measurements within reasonable bounds)
- Ensure the edit-from-cart flow preserves all data through the sessionStorage round-trip
- Add order confirmation emails that accurately reflect what was ordered

Exit criteria:
- Kris receives zero ambiguous or incomplete orders
- Customer gets confirmation that matches what they'll receive
- No field is ever silently dropped between cart and order submission
- Variant lookup failure has a graceful recovery (e.g., queue for manual pricing)

Failure branch: If the order schema can't carry all custom attributes through a single path, create a parallel order record that captures the full spec.

**Milestone 4 — Earn operational efficiency**

Unlocked statement: "The site handles routine operations without manual intervention beyond fabric cutting."

Why fourth: Automation on top of broken boundaries amplifies bugs. Clean data flow comes first.

This milestone is intentionally less specified than 1–3 — it's far-horizon and the specifics depend on what Kris's actual workflow looks like after the first three milestones clean things up.

Possible work:
- Automated payment (Stripe integration in-site instead of manual invoicing)
- Order tracking / fulfillment status updates
- Reduced manual steps in Kris's order processing workflow
- Better customer self-service (order status, measurement guides, reorder)
- Inventory management integration

Exit criteria will be defined when Milestone 3 is complete and Kris's operational pain points are re-assessed.

**Current frontier:**
1. Write the framework docs (this plan)
2. Extract calculator logic into testable pure functions (first technical work)
3. Audit Shopify product catalog against hardcoded values in site code

**Deferred work** (not yet the bottleneck):
- New product types
- Wholesale / B2B channel
- Mobile app
- Advanced analytics / customer insights

- [ ] **Step 2: Commit**

```bash
git add docs/framework/roadmap.md
git commit -m "Add framework roadmap: four milestones from measurement trust to operational efficiency"
```

---

## Chunk 5: Order Lifecycle and CLAUDE.md

### Task 6: Write order-lifecycle.md

**Files:**
- Create: `docs/framework/order-lifecycle.md`

Read before writing:
- `src/app/products/[productType]/page.tsx` — the full product page flow from measurement to add-to-cart
- `src/components/MeasurementCalculator.tsx` — calculation trigger and Shopify lookup
- `src/app/cart/page.tsx` — cart display, edit flow, photo upload, manual checkout form, the hardcoded `isManualCheckout = true`
- `src/app/api/submit-order/route.ts` — what happens on order submit, what Kris receives
- `src/app/measurement-service/page.tsx` — the alternate entry path

- [ ] **Step 1: Write order-lifecycle.md**

Open with: This document traces the complete customer journey from "I have furniture" to "cover arrives." It is the diagnostic reasoning trace — when something goes wrong, walk this flow to find where.

**Voice:** Written as a trace Claude can step through. Each step states: what happens, what data transforms, what can go wrong, what the customer sees vs what Kris sees.

**The complete self-measure flow** (14 steps):

**Step 1 — Customer arrives at site.** Homepage or `/design` page. Sees 6 furniture types with sketch icons: Chairs/Recliners (most popular), Sofas/Loveseats, Chaise Lounges, Tables, Table Sets, Ottomans. Also sees Monmouth County measurement service banner.

**Step 2 — Picks furniture type.** Navigates to `/products/{type}`. Product page loads with gallery photos, measurement form, add-on options, color selector, feature list, and order summary.

**Step 3 — Enters measurements.** Type-specific fields (see product-science.md for full field list per type). Key confusion points:
- "Depth" for chairs/sofas means back-to-ground then horizontal to front — NOT seat depth. Label includes explanation but customers still get it wrong.
- For sofas, internal `width` is labeled "Length" on screen (the long dimension), and internal `length` is labeled "Depth." The submit-order email uses the same inverted labels.
- For chaise lounges, "Height" means floor to bottom of seat, NOT top of backrest.
- `backWidth` (chairs) and `armLength` (chaise) are optional. They don't affect yard calculation but are passed to Kris as construction notes.

**Step 4 — Calculator computes.** Customer clicks "Calculate Cover Size & Price" (button pulses orange when measurements change and haven't been recalculated). The calculator:
- Computes fabric yards using the product-type-specific formula (see product-science.md)
- Computes AT2F angle for chairs/sofas (derived, not measured by customer)
- Generates display SKU: `{TYPE}-{L}x{W}x{H}-{backHeight}` (human-readable, shown in cart and order)
- Generates Shopify SKU: `{product-type}-{yards}` (machine-readable, for variant lookup)

**Step 5 — Variant lookup.** Using the Shopify SKU, the calculator queries Shopify via the Buy Button SDK:
1. Look up variant by SKU string match
2. If miss: fetch ALL products (up to 250), search by product handle/title + variant title match (`"4 yards"`)
3. If BOTH miss: **hard failure** — `alert('Product variant not found for X yards. Please contact support.')` and checkout is disabled (empty variantId disables buy/add-to-cart buttons). Customer is stuck. No recovery path.
4. If found: variant price and ID are returned. Price from Shopify overrides the $45/yard fallback.

**Step 6 — Configures cover.** Customer selects:
- Color: 10 standard (no upcharge) or 2 premium (+$4/yard). Default: none selected (required).
- Add-ons (product-type-specific availability):
  - Snap Straps (+$20): chairs, sofas, chaise only
  - Handles (+$20): all types
  - Split Cover with Snaps (+$35): sofas, table-sets only. (Code variable: `magnets` — legacy name.)
- Quantity: default 1, adjustable with +/- buttons.

**Step 7 — Confirms measurements.** Checkbox: "I confirm my measurements are accurate and understand custom covers cannot be returned for sizing errors." Must be checked before buy/add-to-cart buttons are enabled.

**Step 8 — Adds to cart.** Two buttons:
- "Add to Cart" — adds item to Zustand store (persisted in localStorage, key: `castaway-covers-cart`), shows confirmation dialog.
- "Buy Now" — same as Add to Cart but immediately redirects to `/cart`.

Cart item contains: productType, coverSKU (display), coverVariantId, coverPrice, yards, angle (if applicable), all measurements, snapStraps/handles/magnets booleans, selectedColor, isPremiumColor, premiumColorCharge, quantity, total.

Items can be edited from cart: cart stores item in sessionStorage as `editCartItem`, navigates to product page, which loads those values in update mode.

**Step 9 — Checkout form.** Cart page (`/cart`) shows:
- Line items with all details (type, measurements, color, add-ons, price)
- Manual checkout form (always active — `isManualCheckout = true` hardcoded because site is on Shopify $10/month plan):
  - Required: Full Name, Email, Phone, Street Address, City, State, ZIP
  - Optional: Special Instructions (textarea)
  - Optional: Photo Upload (1-3 photos, max 10MB each, drag-and-drop or click)
- Order total with breakdown

**Step 10 — Order submission.** Customer clicks "Place Order." `submit-order` API:
- Validates required fields
- Sends Kris an email via Resend containing: all items with measurements, color, add-ons, customer info, special instructions, and photos as attachments. Email includes: "Send Stripe invoice to [email] for $[total]."
- Sends customer a confirmation email via Resend.
- Both emails sent from `onboarding@resend.dev` (Resend sandbox — NOT castawaycovers.com).
- Cart is cleared on success.

**Step 11 — Kris reviews.** Kris reads the order email. Verifies measurements against photos (if provided). Checks for unusual sizes or potential errors.

**Step 12 — Payment.** Kris manually creates and sends a Stripe invoice to the customer's email for the order total. This is entirely manual — not automated by the site.

**Step 13 — Production.** Kris cuts fabric and sews the cover based on the order measurements.

**Step 14 — Fulfillment.** Ships to customer.

**Alternate entry: Measurement service.**
- Customer fills form at `/measurement-service` (name, phone, email, address, furniture count, preferred date)
- Submits → Resend email to Kris via `send-measurement-request` API
- Kris visits home, measures furniture, enters order directly (skips steps 2-9)
- Resumes at step 10 with Kris entering the order
- Service fee: $75, credited toward purchases of $500+

**Error mode summary table:**

| Step | What goes wrong | What customer sees | What Kris sees | How to diagnose |
|------|----------------|-------------------|---------------|-----------------|
| 3 | Wrong measurement entered | Nothing (no validation) | Wrong cover after production | Compare measurements to photos |
| 5 | SKU lookup fails (casing, missing variant) | Alert + disabled checkout | Nothing (order never arrives) | Check Shopify product catalog for variant |
| 9 | Photo too large | Upload error | No photos attached | Check file size limit (10MB) |
| 10 | Resend API fails | Error message | No order email | Check RESEND_API_KEY, Resend dashboard |
| 10 | Email goes to spam | Never sees confirmation | Order email may be in spam too | Sandbox domain issue |
| 12 | Stripe amount wrong | Invoice doesn't match site | Manual entry error | Compare order email total to Stripe invoice |

- [ ] **Step 2: Commit**

```bash
git add docs/framework/order-lifecycle.md
git commit -m "Add framework order-lifecycle: complete diagnostic trace from customer to cover"
```

### Task 7: Update CLAUDE.md with framework routing

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add framework routing section to CLAUDE.md**

Add a `### Framework` section after the `### Notes` section in CLAUDE.md:

```markdown
### Framework
The `docs/framework/` directory contains durable reference docs. Read the relevant doc before answering questions or making changes in its domain:

- **"Should we..." / "What matters..." / authority questions** → `docs/framework/principles.md`
- **"How many yards..." / "What price..." / "What add-ons..." / product questions** → `docs/framework/product-science.md`
- **"Where does X live?" / "What service..." / "What env var..." / system questions** → `docs/framework/architecture.md`
- **"Why did this order..." / "What went wrong..." / diagnostic questions** → `docs/framework/order-lifecycle.md`
- **"What should we fix..." / "What's the priority..." / planning questions** → `docs/framework/roadmap.md`
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Add framework doc routing to CLAUDE.md for Claude Code sessions"
```

### Task 8: Final verification

- [ ] **Step 1: Verify all 6 files exist**

Run: `ls docs/framework/`
Expected: `README.md  architecture.md  order-lifecycle.md  principles.md  product-science.md  roadmap.md`

- [ ] **Step 2: Run scripts/check.sh to verify build still passes**

Run: `scripts/check.sh`
Expected: Build succeeds (CLAUDE.md change doesn't affect build, docs don't affect build)
