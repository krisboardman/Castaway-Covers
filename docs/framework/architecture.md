# Architecture

Architecture exists to answer one question — where does truth live? The current codebase has no clear answer. This document defines the boundaries.

---

## Four Boundaries

### Boundary 1 — Shopify (catalog only, NOT payment)

Shopify owns: product definitions (what cover types exist), variant inventory and availability, variant pricing.

Shopify does **not** handle checkout or payment. The site is on the $10/month Shopify plan. The Shopify Cart API checkout code in `src/app/api/create-checkout/route.ts` is **dead code** — it is never reached because `isManualCheckout` is hardcoded `true` in `src/app/cart/page.tsx` (line 32: `const manualMode = true`).

`@shopify/buy-button-js` (Buy Button SDK) is used solely as a product API client for variant lookups in `src/lib/shopify-client.ts`. It is not used for UI rendering.

**Should own but doesn't:**
- Base pricing: hardcoded `$45/yard` fallback in `MeasurementCalculator.tsx` (`calculatePrice`, line 301)
- SKU definitions: generated client-side via `generateShopifySKU()` in `MeasurementCalculator.tsx`

**Contract:** site reads from Shopify. Shopify is catalog of record.

---

### Boundary 2 — The Site (customer experience and measurement science)

The site owns: measurement input and validation (calculators), fabric yard calculations, add-on configuration (snap straps, handles, split cover with snaps), color selection and premium upcharge, cart state, photo upload, customer-facing content.

**Cart state:** Zustand store (`src/store/cartStore.ts`) persisted to localStorage under key `castaway-covers-cart`. Survives page reloads and browser sessions. The cart is **not** the order record — the order record is the email submitted via Resend.

**Edit-from-cart flow:** item stored in `sessionStorage` as `editCartItem`, navigates to product page in update mode.

**Checkout gate:** measurement confirmation checkbox must be checked before add-to-cart is enabled.

**CartItem schema** (from `src/store/cartStore.ts`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `Date.now().toString()` |
| `productType` | string | e.g. `chairs-recliners`, `sofas-loveseats` |
| `coverSKU` | string | Display SKU: `{TYPE}-{L}x{W}x{H}-{backHeight}` |
| `coverVariantId` | string | Shopify numeric variant ID |
| `coverPrice` | number | Dollars |
| `yards` | number | Computed by calculator |
| `angle` | number? | Degrees; chairs only |
| `measurements` | object | `width`, `length`, `height`, `backrestDepth?`, `armrestHeight?` |
| `snapStraps` | boolean | +$20 |
| `handles` | boolean | +$20 |
| `magnets` | boolean | Split cover with snaps, +$35 |
| `selectedColor` | string | Color name |
| `isPremiumColor` | boolean | |
| `premiumColorCharge` | number | `yards × $4` |
| `quantity` | number | |
| `total` | number | All-in price for item |

**Photo upload** (`src/app/cart/page.tsx`, lines 432–464): 1–3 photos, JPEG/PNG, max 10MB each. Sent as email attachments to Kris.

**Contract:** site computes cover spec, collects customer info, submits order via manual checkout API.

---

### Boundary 3 — Payment and Email (Stripe + Resend)

**Resend** handles all transactional email (`src/app/api/submit-order/route.ts`). Two emails per order:
1. Order notification to Kris — includes full spec, measurements, angle, add-ons, photos as attachments
2. Order confirmation to customer — same spec, no angle (omitted from customer copy)

Currently sends from `onboarding@resend.dev` (Resend sandbox). Not `castawaycovers.com`. Recipient address for Kris reads from `NOTIFICATION_EMAIL` env var, falling back to `support@castawaycovers.com`.

**Stripe** handles payment. Kris manually sends a Stripe invoice to the customer after reviewing the order email. **The site does not process payment.**

**Dead Shopify checkout path** (`src/app/cart/page.tsx`, lines 128–271, and `src/app/api/create-checkout/route.ts`): four fallback methods, all unreachable behind `isManualCheckout = true`:
1. `cartCreate` mutation → `/api/create-checkout` → Shopify Storefront API
2. AJAX cart: `POST /cart/clear.js` → `POST /cart/add.js` → redirect to `/cart`
3. (method 3 label skipped in code; jumps directly to method 4)
4. Permalink: `/{domain}/cart/{variantId}:{qty}?note=...`

**Env vars for dead path only** (not needed while manual checkout is active):

| Var | Purpose |
|-----|---------|
| `SNAP_STRAPS_VARIANT_ID` | Shopify variant ID for snap straps add-on |
| `HANDLES_VARIANT_ID` | Shopify variant ID for handles add-on |
| `MAGNETS_VARIANT_ID` | Shopify variant ID for magnetic closure add-on |
| `COLOR_UPCHARGE_VARIANT_ID` | Shopify variant ID for premium color upcharge |

Dead Shopify checkout code calls Storefront API pinned to version `2024-01` (`create-checkout/route.ts`, line 162). Shopify deprecates old API versions — this will break if the dead path is ever reactivated without updating the version.

---

### Boundary 4 — Manual Operations (Kris)

Kris owns: order review, Stripe invoice creation, measurement verification, fabric cutting and production, customer communication beyond automated emails, exception handling.

**Measurement service** (`/measurement-service`): $75 fee, Monmouth County NJ. Kris visits the customer's home, measures the furniture, enters the order directly. Fee is credited toward purchases of $500 or more.

**Contract:** site delivers a complete, unambiguous order. No field should require Kris to call the customer.

---

## Active Env Vars

| Var | Owner | Used By |
|-----|-------|---------|
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | Shopify | `shopify-client.ts`, `create-checkout/route.ts` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify | `shopify-client.ts`, `create-checkout/route.ts` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Shopify | Admin API scripts (not in app runtime) |
| `RESEND_API_KEY` | Resend | `submit-order/route.ts` |
| `NOTIFICATION_EMAIL` | Config | `submit-order/route.ts` — Kris's order notification address |
| `NEXT_PUBLIC_COMING_SOON_MODE` | Config | Coming-soon splash toggle |
| `NEXT_PUBLIC_PREVIEW_TOKEN` | Config | Preview mode token (`src/config/site.ts`) |
| `NEXT_PUBLIC_MANUAL_CHECKOUT` | Config | Currently overridden by hardcoded `true`; env var not read |

---

## Current State vs. Target

| Concern | Current State | Target State |
|---------|--------------|--------------|
| Base pricing | Hardcoded fallback `calculatePrice()` at $45/yard in `MeasurementCalculator.tsx` | Read from Shopify variant prices; fail explicitly if lookup fails |
| SKU mapping | `generateShopifySKU()` generates client-side with inconsistent casing (`chairs/recliners`, `Chaiselounges`, `tables`) | Defined in Shopify, looked up by site with consistent format |
| Checkout | `isManualCheckout` hardcoded `true`; Shopify checkout is dead code with 4 unreachable fallbacks | Decide: keep manual or migrate to Shopify. Remove dead path either way. |
| Measurement logic | Tangled in `MeasurementCalculator.tsx` — calc + UI + Shopify lookup + SKU generation in one component | Pure functions in own module, tested independently |
| Order data | Manual form fields → Resend plain-text email | Single complete order schema with validation before submission |
| Email sender | `onboarding@resend.dev` (sandbox) | Custom domain sender (`castawaycovers.com`) |
| Display SKU vs. Shopify SKU | Two formats: display `{TYPE}-{L}x{W}x{H}-{backHeight}`, Shopify `{productType}-{yards}` | Both formats documented; purposes explicit |

---

## Architectural Rules

1. **Prices live in Shopify.** The site reads them, never hardcodes them. The $45/yard fallback is a bug, not a feature.
2. **Measurement formulas live in documented, tested functions** — not tangled into UI components.
3. **Every order must be complete at submission.** No field should require Kris to call the customer.
4. **Cart state (Zustand/localStorage) is convenience for the customer, not the order record.** The order record is the submitted email.
5. **The site must degrade gracefully if Shopify variant lookup fails.** Current behavior is `alert()` + disabled checkout (hard failure at `MeasurementCalculator.tsx`, line 374). Should show an explicit, non-blocking error with a fallback path.

---

## Key File Map

| Question | Answer |
|----------|--------|
| Where does cart state live? | `src/store/cartStore.ts` → `localStorage['castaway-covers-cart']` |
| Where is checkout triggered? | `src/app/cart/page.tsx` — `handleManualOrder()` for active path, `handleCheckout()` for dead Shopify path |
| Where is order email built and sent? | `src/app/api/submit-order/route.ts` |
| Where is Shopify variant lookup? | `src/lib/shopify-client.ts` → `findVariantBySKU()` |
| Where are yard calculations? | `src/components/MeasurementCalculator.tsx` → `calculateYards()` |
| Where is the $45/yard hardcode? | `src/components/MeasurementCalculator.tsx` → `calculatePrice()`, line 301 |
| Where is dead checkout code? | `src/app/api/create-checkout/route.ts` (entire file), `src/app/cart/page.tsx` lines 128–271 |
| Where is photo upload handled? | `src/app/cart/page.tsx` lines 432–464 (client), `src/app/api/submit-order/route.ts` lines 16–21 (server) |
| Where is edit-from-cart stored? | `sessionStorage['editCartItem']` |
