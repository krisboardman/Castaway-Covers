# Castaway Covers Framework Concept — Design Spec

## Context

Castaway Covers is a custom outdoor furniture cover business run by Kris Boardman, selling through castawaycovers.com. The site is a Next.js 14 app with Shopify integration, deployed on Vercel. Mike Edwards is helping Kris manage and evolve the codebase.

The site works but is hacky — hardcoded prices alongside Shopify data, dead Shopify checkout code behind a hardcoded flag, fragile SKU mapping with inconsistent casing, measurement calculators tangled into UI components, TypeScript errors ignored, emails sent from Resend sandbox domain, and a legacy variable name (`magnets`) that no longer matches the product ("Split Cover with Snaps").

The actual production checkout flow is: customer fills a manual form → Resend emails order to Kris → Kris manually sends Stripe invoice. Shopify is used only as a product catalog, not for checkout or payment.

This spec defines a `docs/framework/` directory for Castaway Covers, modeled after the framework docs used in BostonStrong and Columbo — durable thinking that outlives any one implementation.

**Critical design decision:** These docs are NOT for human reading. They are **Claude Code reasoning substrate**. Both Kris and Mike interact with the project through Claude Code sessions in the same repo. The docs must help Claude answer Kris-type questions ("why is this order wrong?", "can we add a new color?") and Mike-type questions ("where does this break?", "what should I refactor first?") equally well.

This means: write for Claude-as-reader. Include the reasoning chains Claude needs, not just the facts. Every section should help Claude answer a class of questions.

## Deliverables

Six files in `docs/framework/` plus a CLAUDE.md update:

### 1. README.md

Short index file. Defines:

- What the framework folder is: durable thinking that a fresh session must know to think correctly about the project
- Reading order: principles → product-science → architecture → order-lifecycle → roadmap
- Authority hierarchy: framework is authoritative for durable truth; CLAUDE.md is operational reference; specs/plans are execution artifacts; Kris is final authority on all business decisions

### 2. principles.md

The value system and operating rules.

**Charter:** Custom-fit outdoor furniture covers — measured, cut, sewn for one piece. Business promise is fit. Two customer paths: self-measure online or $75 in-home measurement service (Monmouth County NJ, credited toward $500+ orders). Every cover includes signature features: wavy edge design, marine-grade vinyl, reinforced grommets, bungee cord system.

**What Castaway Covers is not:** Marketplace, catalog site, subscription, tech company.

**Authority model:** Kris owns business decisions. Measurement formulas are domain science requiring Kris's validation. Tech decisions must not change business behavior without approval.

**Quality hierarchy:** (1) Measurement accuracy, (2) Order reliability, (3) Customer clarity, (4) Site stability, (5) Aesthetics.

**Kris as sensor:** Domain expert, highest-trust data source for operational experience.

**Language discipline:** Five terms: product, price, measurements, checkout, width/length (sofa label inversion).

### 3. architecture.md

Source-of-truth boundaries and contracts between four systems.

**Boundary 1 — Shopify (catalog only, not payment):**
- Owns product definitions, variant inventory, variant pricing
- Does NOT handle checkout or payment (site is on $10/month plan)
- Buy Button SDK used solely as product API client for variant lookups
- Should own but doesn't: base pricing (hardcoded $45/yard fallback), SKU definitions (generated client-side)

**Boundary 2 — The Site:**
- Owns measurement science, add-on config, color selection, cart state (Zustand + localStorage persistence), photo upload (1-3 photos as email attachments), customer content
- Cart persists in localStorage — not ephemeral, but not the order record either
- Measurement confirmation checkbox required before checkout enabled
- Edit-from-cart flow via sessionStorage

**Boundary 3 — Payment and Email (Stripe + Resend):**
- Resend sends order email to Kris + confirmation to customer (currently from sandbox domain)
- Stripe: Kris manually sends invoice after reviewing order
- Dormant Shopify checkout code has 4 fallback methods (all dead behind hardcoded flag)
- Undocumented env vars for dormant path

**Boundary 4 — Manual Operations (Kris):**
- Order review, Stripe invoicing, measurement verification, production, exception handling
- Measurement service ($75) is a separate entry path

**Architectural rules:** Prices in Shopify, formulas in tested functions, orders complete at submission, cart is convenience not record, graceful degradation on lookup failure.

**Current state vs. target table** with corrections: checkout is "manual hardcoded true, Shopify dead code" → "decide and remove dead path"; email from sandbox → custom domain; display SKU vs Shopify SKU both documented.

### 4. product-science.md

Domain knowledge: furniture dimensions → fabric covers.

**Six product types, three calculation models** with full table: product type, URL slug, Shopify SKU prefix (inconsistent casing documented), calc model, field count, and notes on label inversions and meaning differences.

**Per-model constants table:** floor clearance, hem, bolt width constraint, lanes, angle — by product type. Rationale for different clearance values is undocumented.

**Three calculation models** with complete formulas:
- Model 1 (seated w/ backrest): AT2F angle, ML, addLength, perLaneLength. Chairs single-lane, sofas double-lane with ceil-after-multiply note.
- Model 2 (chaise): bolt width constraint, seam panel when mainWidth > 54"
- Model 3 (rectangular): simple drop formula. Note: does not check if width exceeds bolt width.

**Two SKU systems:** Display SKU (human-readable) and Shopify SKU (variant lookup). Both documented.

**Variant lookup chain:** 5 steps ending in hard failure (alert + disabled buttons), NOT graceful fallback.

**Add-on availability matrix:** Per-product-type availability table with correct names. "Split Cover with Snaps" is the product name; `magnets` is the legacy variable name.

**Color system:** 10 standard, 2 premium (+$4/yard).

**Customer photos:** 1-3 photos, max 10MB, sent as email attachments.

**Gusset fabric:** Referenced in profit calculator, relationship to online ordering undocumented.

**Known issues:** AT2F error compounding, Depth confusion, sofa label inversion, SKU casing, $45 fallback, optional field impact undocumented, floor clearance rationale missing, rectangular model bolt width unchecked, magnets variable name.

### 5. order-lifecycle.md

The diagnostic reasoning trace — what happens step by step from "customer has furniture" to "cover arrives." This is the doc Claude reaches for first when something went wrong.

**Voice:** Written as a trace Claude can walk through to diagnose any question about a specific order or customer issue. Each step states: what happens, what data transforms, what can go wrong, and what the customer vs Kris sees.

**The complete flow:**

1. **Customer discovers Castaway** → arrives at site or measurement service
2. **Picks furniture type** → `/design` page, 6 types with sketch icons
3. **Enters measurements** → product page, type-specific fields with labels (note sofa inversion)
4. **Calculator computes** → yards, AT2F angle (if applicable), display SKU, Shopify SKU
5. **Variant lookup** → Shopify SKU → variant title fallback → hard failure with alert()
6. **Configures cover** → color (standard/premium), add-ons (type-specific availability), quantity
7. **Confirms measurements** → checkbox required before buy/add-to-cart
8. **Cart** → Zustand + localStorage, can edit items (sessionStorage round-trip)
9. **Checkout form** → name, email, phone, address, optional photos (1-3, max 10MB each), special instructions
10. **Order submission** → `submit-order` API → Resend email to Kris (with photos) + confirmation to customer (from sandbox domain)
11. **Kris reviews** → reads email, verifies measurements (photos help), checks for issues
12. **Payment** → Kris manually sends Stripe invoice to customer email
13. **Production** → Kris cuts fabric, sews cover
14. **Fulfillment** → ships to customer

**Error modes at each step** — what goes wrong and what Claude should check:
- Step 3: wrong measurement (especially Depth), sofa width/length confusion
- Step 5: SKU lookup failure (casing mismatch, missing Shopify variant) → customer stuck
- Step 6: customer picks add-on not available for their product type (shouldn't happen if UI is correct)
- Step 8: edit-from-cart loses data through sessionStorage
- Step 9: photos too large, missing required fields
- Step 10: Resend API failure, email goes to spam (sandbox domain)
- Step 12: Stripe invoice amount doesn't match site total (manual entry by Kris)

**Two entry paths:**
- Self-measure (steps 1-14 above)
- Measurement service ($75): customer books via form → Kris visits → Kris measures and enters order directly → steps 10-14

### 6. roadmap.md

Earning sequence.

**Milestone 1 — Earn measurement trust:** Extract formulas, test against production, improve labels, validate clearance values, verify bolt width edge case.

**Milestone 2 — Earn clean boundaries:** Checkout decision (keep manual or migrate to Shopify, remove dead code), audit prices/SKUs, fix TypeScript, document all env vars, fix email domain, address legacy naming, update pinned API version.

**Milestone 3 — Earn order reliability:** Complete order schema, graceful variant lookup failure, edit-from-cart data integrity, confirmation emails.

**Milestone 4 — Earn operational efficiency:** Far-horizon, defined after M3. Possible: in-site Stripe, order tracking, self-service.

### 7. CLAUDE.md update

Add a `### Framework` section to CLAUDE.md that routes Claude Code sessions to the right framework doc:

- **"Should we..." / "What matters..." / "Is this OK..."** → `docs/framework/principles.md`
- **"How many yards..." / "What price..." / "What add-ons..." / "What color..."** → `docs/framework/product-science.md`
- **"Where does... live?" / "What service..." / "What env var..."** → `docs/framework/architecture.md`
- **"Why did this order..." / "What went wrong..." / "What does the customer see..."** → `docs/framework/order-lifecycle.md`
- **"What should we fix..." / "What's the priority..."** → `docs/framework/roadmap.md`

## Non-Goals

- No new product types — focus on stabilizing what exists
- No visual redesign
- No migration away from Shopify or Next.js
- No automated testing infrastructure beyond calculator unit tests initially

## Risks

- **Kris buy-in:** Drafted for her to react to. She may see things differently.
- **Shopify data gap:** Haven't inspected the actual Shopify product catalog. If Shopify data is also messy, the boundary model needs adjustment.
- **Formula validation:** Formulas documented from code, not validated against production. Could be wrong in ways code can't reveal.
- **Stripe integration undocumented:** The manual Stripe invoicing process is entirely in Kris's workflow, not in any code. Understanding this requires talking to Kris.
- **Gusset fabric:** Referenced in profit calculator but relationship to ordering flow unknown.
