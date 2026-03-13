# Castaway Covers — Order Lifecycle

This document traces the complete customer journey from "I have furniture" to "cover arrives." When something goes wrong, walk this flow to find where.

There are two entry paths: self-measure (the common case) and measurement service (Monmouth County only). Both converge at step 10.

---

## Self-Measure Flow (14 Steps)

### Step 1 — Customer Arrives

**What happens:** Customer lands on homepage (`/`) or the design tool (`/design`). No state is created yet.

**What can go wrong:** Nothing order-critical at this step.

**Customer sees:** Hero carousel, product categories, "Design My Cover" CTA.

---

### Step 2 — Picks Furniture Type

**What happens:** Customer selects one of six product types from the design page, navigating to `/products/[productType]`. The product type is stored in `sessionStorage` as `lastProductType`.

**Supported types:**
- `chairs-recliners`
- `sofas-loveseats`
- `chaise-lounge` (also `chaise-lounges` — both resolve to the same page)
- `ottomans`
- `tables`
- `table-sets`

**What can go wrong:** An invalid product type in the URL renders a page with a generic title and no calculator fields — no error, just a broken experience.

**Customer sees:** Product photos, measurement form, color selector, add-on options.

---

### Step 3 — Enters Measurements

**What happens:** Customer fills in type-specific measurement fields. The MeasurementCalculator component manages field visibility per product type.

**Known label problems (active issues):**
- **Depth confusion (chairs):** The field labeled "Depth" means the front-to-back distance of the seat. Customers often measure the full chair depth including backrest.
- **Sofa label inversion:** What the product page calls "Width" (the longer dimension) is sent to the order email labeled as "Length," and vice versa. The submit-order API explicitly swaps these labels for sofas: `widthLabel = 'Length'`, `lengthLabel = 'Depth'`. The field names in the URL and cart store use the unswapped values.
- **Chaise Height:** Means seat height from the ground, not total height of the backrest.
- **Optional fields:** `backWidth` and `armLength` exist in the data schema but their display conditions are not consistently documented.

**Validation:** None. The form accepts any numeric input. There is no range check, no "does this seem right?" warning, and no unit reminder (all measurements are in inches).

**What can go wrong:** Customer enters wrong measurements. Nothing in the UI flags this. The error surfaces only after Kris produces the cover.

**Customer sees:** Input fields, a sketch diagram of the furniture type.

**Kris sees:** Nothing yet.

---

### Step 4 — Calculator Computes

**What happens:** As the customer types, the MeasurementCalculator component computes:
- Yard count (`yards`) — the amount of fabric needed
- Angle (`angle`) — the AT2F diagonal for seated furniture with backrests (chairs, sofas only — NOT chaise)
- Display SKU — shown in the order summary (e.g., `CH-48-36-30`)
- Shopify SKU — used to look up the variant in the Shopify catalog

When measurements change, the "Add to Cart" and "Buy Now" buttons pulse orange to indicate the result has updated.

Measurement confirmation checkbox is reset to unchecked whenever measurements change (`setMeasurementConfirmed(false)`).

**What can go wrong:** Formula produces wrong yard count. No test suite exists to catch this. See Milestone 1 in roadmap.

**Customer sees:** Live-updating SKU, yard count, and price in the order summary panel.

---

### Step 5 — Variant Lookup

**What happens:** The calculator calls into the Shopify Storefront API to find the variant matching the computed SKU. It tries SKU match first, then falls back to variant title match.

**What can go wrong — HARD FAILURE:** If no matching variant is found, an alert fires and all checkout buttons are disabled. There is no recovery path. The customer is stuck.

- "Add to Cart" is disabled (`disabled={!coverVariantId || ...}`)
- "Buy Now" is disabled
- No suggestion to contact Kris
- No way to proceed

**Customer sees:** Alert dialog, then disabled buttons with no explanation.

**Kris sees:** Nothing — the order never arrives.

**How to diagnose:** Check the Shopify catalog for a variant matching the computed SKU. The SKU format is derived from the measurement inputs; if the catalog doesn't have that exact SKU or variant title, the lookup fails silently until the alert fires.

---

### Step 6 — Configures Cover

**What happens:** Customer selects:
- **Color** — standard or premium (12 color options). Premium colors add $4 × yards × quantity.
- **Add-ons** — availability varies by product type:
  - Snap Straps: +$20 per cover
  - Handles: +$20 per cover
  - Split Cover with Snaps (labeled `magnets` in code): +$35 per cover — available for sofas/loveseats and table sets only
- **Quantity** — minimum 1, no maximum enforced

**What can go wrong:** Premium color charge is calculated as `yards * quantity * 4`. If yards is 0 (measurements not entered yet), the charge is $0 even if premium color is selected — it corrects when measurements are entered, but there is no warning.

**Customer sees:** Color swatches, add-on checkboxes, quantity controls, live-updating total.

---

### Step 7 — Confirms Measurements

**What happens:** A checkbox in the order summary reads: "I confirm my measurements are accurate and understand custom covers cannot be returned for sizing errors." Both "Add to Cart" and "Buy Now" buttons remain disabled until this checkbox is checked.

The checkbox is reset to unchecked whenever measurements change (step 4).

**What can go wrong:** The checkbox is a legal/responsibility mechanism, not a validation. It does not prevent submission of incorrect measurements.

**Customer sees:** Yellow-highlighted checkbox with confirmation text.

---

### Step 8 — Adds to Cart

**What happens:** Two buttons:
- **"Add to Cart"** — saves item to Zustand store (persisted to localStorage), shows a `window.confirm` dialog ("Item added to cart! Click OK to view cart or Cancel to continue shopping"), then redirects to `/cart` if confirmed.
- **"Buy Now"** — saves item to Zustand store, then immediately redirects to `/cart`.

Cart item stored in Zustand + localStorage includes: productType, coverSKU, coverVariantId, coverPrice, yards, angle, all measurements, snapStraps, handles, magnets, selectedColor, isPremiumColor, premiumColorCharge, quantity, total.

**Edit from cart:** Clicking "Edit" on a cart item stores the full item object in `sessionStorage` as `editCartItem` and navigates to `/products/[productType]`. The product page reads this on mount, populates all fields, and sets `editingItemId`. On "Add to Cart," `updateItem` is called instead of `addToCart`, and the page redirects back to `/cart`.

**What can go wrong:** If the browser tab is closed between clicking "Edit" and submitting the updated item, `sessionStorage` is cleared and the edit is silently dropped. The cart item retains its original values.

**Customer sees:** Confirm dialog (Add to Cart path) or direct redirect to cart (Buy Now path).

---

### Step 9 — Checkout Form

**What happens:** At `/cart`, `isManualCheckout` is hardcoded `true` (comment in source: "For now, hardcoded to true since we're on the $10/month plan"). The Shopify checkout path (`handleCheckout`) is dead code — present but unreachable.

Customer clicks "Place Order," which reveals the contact form:
- Name (required)
- Email (required, regex validated)
- Phone (optional)
- Additional Notes (optional)
- Photos of furniture (optional, 1–3 photos, max 10MB each, JPEG/PNG only)

**What can go wrong:**
- Photo exceeds 10MB: client-side check fires an alert and clears the file input. No photos attached.
- Customer provides wrong email: the invoice will go to the wrong address. No secondary confirmation.
- The shipping address is not collected in this form. Kris must ask separately.

**Customer sees:** Expanded contact form inline in the order summary panel.

---

### Step 10 — Order Submission

**What happens:** Customer clicks "Submit Order." The cart page sends a `POST` to `/api/submit-order` with a `FormData` body containing:
- `customerInfo` (JSON): name, email, phone, notes
- `items` (JSON): full cart item array
- `totalPrice`: sum of all item totals
- `photo0`, `photo1`, `photo2`: photo files if uploaded

The submit-order API route:
1. Parses the request
2. Formats two email bodies (one for Kris, one for customer)
3. Calls `resend.emails.send` twice — order notification to Kris, confirmation to customer
4. **Both emails send from `onboarding@resend.dev`** (Resend sandbox domain)
5. Returns `{ success: true }` regardless of whether emails succeeded (email errors are caught and logged, not surfaced)
6. On `success: true`, the cart page clears the Zustand store and redirects to `/`

**Critical gap:** If Resend fails, the API still returns `success: true`. The cart is cleared. There is no persistent order record — no database row, no log file, nothing. The order is gone.

**What can go wrong:**

| Problem | Customer sees | Kris sees | How to diagnose |
|---------|--------------|-----------|-----------------|
| Resend API key missing or invalid | Success message (cart cleared) | No email | Check `RESEND_API_KEY` env var in Vercel |
| Resend API call fails (rate limit, outage) | Success message (cart cleared) | No email | Check Resend dashboard for failed sends |
| Both emails go to spam | No confirmation in inbox | Order in spam | Sandbox domain issue — `onboarding@resend.dev` is not a verified custom domain |
| `NOTIFICATION_EMAIL` env var missing | Success message | Email goes to `support@castawaycovers.com` fallback | Check env var in Vercel |

**Customer sees:** Loading state, then success alert: "Thank you [name]! Your order has been received. We'll send you an invoice at [email] within 24 hours." Then redirect to homepage.

**Kris sees:** Email with subject "New Order from [name] - $[total]" with order details and photos attached. Next-steps block in email body instructs: (1) send Stripe invoice, (2) begin production after payment, (3) contact customer to confirm details.

---

### Step 11 — Kris Reviews

**What happens:** Kris reads the order email. She verifies the measurements make sense, cross-references the photos (if provided) against the stated dimensions, and checks the SKU is producible.

**What can go wrong:**
- Measurements are wrong but photos are not provided — no cross-reference possible
- Measurements are wrong and photos don't match — Kris must contact customer
- SKU is in the email but does not match a variant she can produce — manual lookup required
- Shipping address was not collected — Kris must email customer to ask

**Kris sees:** Plain-text email with all measurement fields, add-ons, color, SKU, yard count, and a next-steps block.

---

### Step 12 — Payment

**What happens:** Kris manually creates and sends a Stripe invoice to the customer's email address for the order total. This step is entirely manual — there is no automated payment trigger, no Stripe integration in the web app, and no order ID linking the invoice to the web order.

**What can go wrong:**
- Kris enters wrong amount (add-ons or premium color charge miscounted)
- Customer's email address was typed incorrectly in the order form — invoice goes to wrong address
- Customer doesn't receive or ignores the invoice — no automated follow-up

**Customer sees:** Stripe invoice email from Kris.

**Kris sees:** Stripe dashboard with pending invoice.

---

### Step 13 — Production

**What happens:** After payment is confirmed, Kris cuts fabric and sews the cover to the ordered specifications.

**What can go wrong:** Wrong dimensions used if the measurement email contained swapped labels (sofa width/length inversion) and Kris applies them without adjustment.

---

### Step 14 — Fulfillment

**What happens:** Kris ships the completed cover to the customer. Shipping cost was not collected at order time — it's added to the Stripe invoice manually based on location and order size.

**Customer sees:** Tracking information (if provided manually by Kris).

---

## Alternate Entry: Measurement Service

**Entry point:** `/measurement-service`

**Who it's for:** Customers in Monmouth County, NJ (approximately within 10 miles of Rumson). The page uses browser geolocation to detect proximity and shows a service-area banner, but the form is shown regardless of location.

**Form fields:** Name (required), phone (required), email (required), street address + city + ZIP (required), furniture types to measure (checkbox list, at least one required), preferred date, preferred time, additional notes.

**What happens on submit:** Form data is sent to Formspree (`https://formspree.io/f/xblkwzzr`) — not to the same `/api/submit-order` endpoint used by the self-measure flow. Formspree forwards the submission to Kris.

**After submission:** Customer sees a success screen with a "Pay Now ($75)" button linking to the measurement service product on the Shopify storefront (`uhrtqs-jx.myshopify.com/products/measurement-service`). The $75 fee is credited toward orders of $500 or more.

**Flow divergence:** Kris visits the customer, measures all furniture, and enters the order herself. This skips steps 2–9 of the self-measure flow and resumes at step 10 — except Kris submits the order manually (likely directly creating the email or using the product page herself), not through the customer-facing cart form.

**What can go wrong:**
- Formspree is a separate service with separate credentials — if `xblkwzzr` form ID is misconfigured or the Formspree account lapses, submissions are silently dropped
- The $75 payment link goes to the Shopify storefront directly, bypassing the main site
- No geolocation fallback error state — if geolocation is denied, the form shows with no location context

---

## Error Mode Summary

| Step | What goes wrong | Customer sees | Kris sees | How to diagnose |
|------|----------------|---------------|-----------|-----------------|
| 3 | Wrong measurement entered | Nothing (no validation) | Wrong cover after production | Compare stated measurements to photos |
| 5 | SKU lookup fails | Alert + disabled checkout buttons | Nothing (order never arrives) | Check Shopify catalog for variant matching the SKU |
| 9 | Photo exceeds 10MB | Alert, file input cleared | No photos attached | Check file size before upload |
| 10 | Resend API fails | Success message, cart cleared | No order email | Check `RESEND_API_KEY` in Vercel; check Resend dashboard |
| 10 | Both emails go to spam | No confirmation in inbox | Order in spam folder | Sandbox sender domain — migrate to custom domain in Resend |
| 10 | `NOTIFICATION_EMAIL` missing | Success message | Email goes to `support@castawaycovers.com` fallback | Check env var |
| 12 | Stripe invoice total wrong | Invoice mismatch | Manual entry error | Compare order email total to Stripe invoice line items |
| MS | Formspree submission fails | Error alert | No booking notification | Check Formspree dashboard for form `xblkwzzr` |
