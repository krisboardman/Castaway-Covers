# Framework Modernization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 5 markdown framework docs into vision.md + principles.md + frontier.db

**Architecture:** Create a SQLite frontier database with milestones, epics, unified items (features + ideas), blocks (dependencies), and comments. Consume domain knowledge from product-science.md, architecture.md, order-lifecycle.md, and roadmap.md into structured DB rows. Write vision.md and principles.md from approved spec text. Delete consumed files.

**Tech Stack:** SQLite, markdown

**Spec:** `docs/superpowers/specs/2026-03-15-framework-modernization-design.md`

---

## Chunk 1: Database Creation and Structure

### Task 1: Create frontier.db with schema

**Files:**
- Create: `docs/framework/frontier.db`

- [ ] **Step 1: Create the database with all tables**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
CREATE TABLE milestones (
    code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    unlocked_statement TEXT NOT NULL,
    rejection_example TEXT,
    status TEXT NOT NULL DEFAULT 'future'
        CHECK (status IN ('future','active','earned')),
    earned_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE epics (
    code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    milestone TEXT NOT NULL REFERENCES milestones(code),
    status TEXT NOT NULL DEFAULT 'inbox'
        CHECK (status IN ('inbox','backlog','active','earned','killed')),
    killed_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE items (
    code TEXT PRIMARY KEY,
    kind TEXT NOT NULL CHECK (kind IN ('feature', 'idea')),
    epic_code TEXT NOT NULL REFERENCES epics(code),
    title TEXT NOT NULL,
    problem TEXT NOT NULL,
    done_when TEXT,
    seq INTEGER UNIQUE,
    horizon TEXT CHECK (horizon IN ('near', 'medium', 'far')),
    size TEXT CHECK (size IN ('small', 'medium', 'large')),
    source TEXT CHECK (source IN (
        'principle', 'codebase', 'domain', 'kris', 'conversation'
    )),
    source_detail TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'inbox'
        CHECK (status IN ('inbox','backlog','active','earned','killed')),
    killed_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
    CHECK (kind = 'idea' OR done_when IS NOT NULL)
);

-- No FKs: blocker/blocked can reference items, epics, or milestones
CREATE TABLE blocks (
    blocker TEXT NOT NULL,
    blocked TEXT NOT NULL,
    note TEXT,
    PRIMARY KEY (blocker, blocked)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    target_code TEXT NOT NULL,
    target_kind TEXT NOT NULL
        CHECK (target_kind IN ('milestone', 'epic', 'item')),
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
SQL
```

- [ ] **Step 2: Verify schema**

Run: `sqlite3 docs/framework/frontier.db ".schema"`
Expected: All 5 tables with correct constraints.

- [ ] **Step 3: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: create frontier.db with schema"
```

---

### Task 2: Insert milestones

**Files:**
- Modify: `docs/framework/frontier.db`

- [ ] **Step 1: Insert 4 milestones**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO milestones (code, title, unlocked_statement, rejection_example, status) VALUES
('measure',
 'The calculator produces the right cover spec',
 'For any supported furniture type, given correct customer inputs, the calculator outputs the right yard count and the right price — validated against covers Kris has actually cut.',
 'A calculator whose output has never been compared to real production orders, or whose formulas were validated only against themselves, cannot claim this.',
 'future'),

('order',
 'Every submitted order reaches Kris complete',
 'When a customer submits an order, Kris receives every field she needs — measurements, add-ons, color, price, contact info, photos — in unambiguous format, and the record survives any single service failure.',
 'An order flow that returns success while silently losing the email, or that sends sofa measurements with swapped labels and no indication of the swap, cannot claim this.',
 'future'),

('guide',
 'A first-time customer can do this without help',
 'A customer who has never heard of a custom cover can identify their furniture type, measure correctly on the first attempt, understand the price, and complete checkout without needing to call or email Kris.',
 'A site where "Depth" means different things on different product pages, where variant lookup failure dead-ends with an alert and no recovery, or where the FAQ contradicts the measurement form, cannot claim this.',
 'future'),

('operate',
 'Routine orders flow without manual work beyond production',
 'Orders flow from customer submission through payment to Kris''s production queue without Kris manually creating invoices, separately collecting shipping addresses, or debugging site issues.',
 'A business where every order requires Kris to manually create a Stripe invoice, email for a shipping address, and cross-reference whether the sofa labels were swapped is not operating — it is being carried.',
 'future');
SQL
```

- [ ] **Step 2: Verify milestones**

Run: `sqlite3 docs/framework/frontier.db "SELECT code, title, status FROM milestones"`
Expected: 4 rows, all status `future`.

- [ ] **Step 3: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: insert 4 milestones into frontier.db"
```

---

### Task 3: Insert epics

**Files:**
- Modify: `docs/framework/frontier.db`

- [ ] **Step 1: Insert 12 epics across 4 milestones**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO epics (code, title, description, milestone, status) VALUES
-- measure
('formula_extraction',
 'Extract calc logic into pure testable functions',
 'Calculation logic is tangled in MeasurementCalculator.tsx with UI state, Shopify lookup, and SKU generation. Extract calculateYards, calculateAngle, calculatePrice, and per-model constants into pure functions with no side effects.',
 'measure', 'inbox'),

('formula_validation',
 'Validate formulas against real production orders',
 'No formula has been compared to a cover Kris actually cut. Test suite must use real examples — measurements in, yards out — validated by Kris against her production history.',
 'measure', 'inbox'),

('label_clarity',
 'Fix measurement label ambiguities across product types',
 'Depth means different things on different pages. Sofa width/length are inverted. Chaise height means seat height, not total. Optional fields have no guidance.',
 'measure', 'inbox'),

-- order
('order_completeness',
 'Every order has every field Kris needs',
 'Orders currently lack shipping address, order reference ID, and clear sofa label handling. Confirmation emails have no way to reference the order.',
 'order', 'inbox'),

('order_persistence',
 'Order record survives email failure',
 'If Resend fails, the API returns success: true, the cart clears, and the order is gone. No database, no log, no fallback. The email IS the record.',
 'order', 'inbox'),

('price_consolidation',
 'One source of truth for all prices',
 'Base price ($45/yard) is hardcoded in MeasurementCalculator.tsx. Add-on prices ($20, $20, $35) are hardcoded in AddOnOptions.tsx, product page, create-checkout, and create-draft-order. Premium color ($4/yard) in three files.',
 'order', 'inbox'),

-- guide
('customer_guidance',
 'Clear measurement instructions per product type',
 'Measurement diagrams are incomplete (don''t show backrest depth or back width). FAQs say "add 1 inch" but product page doesn''t. No guidance for furniture without armrests.',
 'guide', 'inbox'),

('graceful_failure',
 'Recover from variant lookup and other failures',
 'Variant lookup failure shows an alert and disables checkout with no recovery. No "contact us" fallback. No way to proceed.',
 'guide', 'inbox'),

('site_consistency',
 'Naming, colors, terminology alignment',
 'Nav says Craftsmanship, URL is /features. Contact button is blue, everything else is teal. Order summary shows empty parens before calculation.',
 'guide', 'inbox'),

-- operate
('payment_integration',
 'In-site Stripe payment',
 'Kris manually creates Stripe invoices for every order. In-site payment eliminates this step. Not needed until order reliability is earned.',
 'operate', 'inbox'),

('catalog_cleanup',
 'SKU consistency, dead code removal',
 'Dead Shopify checkout code (4 methods, ~150 lines). Inconsistent SKU casing. magnets variable name. Dead env vars. Shopify API version 2024-01 pinned.',
 'operate', 'inbox'),

('build_health',
 'TypeScript clean build, env var documentation',
 'next.config.mjs has ignoreBuildErrors: true. 6 files with any types. No .env.example. No test framework installed.',
 'operate', 'inbox');
SQL
```

- [ ] **Step 2: Verify epics**

Run: `sqlite3 docs/framework/frontier.db "SELECT e.code, e.milestone, e.status FROM epics e ORDER BY e.milestone"`
Expected: 12 rows across 4 milestones.

- [ ] **Step 3: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: insert 12 epics into frontier.db"
```

---

## Chunk 2: Insert Items (Features and Ideas)

### Task 4: Insert features

**Files:**
- Modify: `docs/framework/frontier.db`

Features are items with `kind='feature'` and a required `done_when`.
Derived from the requirements in roadmap.md, architecture.md, and order-lifecycle.md.

- [ ] **Step 1: Insert measure features**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO items (code, kind, epic_code, title, problem, done_when, seq, source, status) VALUES
-- formula_extraction
('MEASURE-EXT-01', 'feature', 'formula_extraction',
 'Extract calculateYards into pure function',
 'calculateYards is embedded in MeasurementCalculator.tsx (lines 160-298) with UI state. Cannot be tested independently.',
 'Pure function in its own module. Takes product type + measurements, returns yards. No React imports, no side effects. Imported by MeasurementCalculator.',
 1, 'codebase', 'inbox'),

('MEASURE-EXT-02', 'feature', 'formula_extraction',
 'Extract per-model constants into config',
 'Floor clearance (6/4/3), hem allowance (0.5/0.5/0), bolt width (54), and product field configs are scattered across calculateYards branches and productConfigs object.',
 'Single config object or module exporting per-product-type constants. Every magic number in calculateYards traces to this config.',
 2, 'codebase', 'inbox'),

('MEASURE-EXT-03', 'feature', 'formula_extraction',
 'Document each formula with rationale',
 'No comments explain why chairs have FC=6 while sofas have FC=4, or why the chaise bolt width check adds +2 for seam allowance.',
 'Each formula has a comment explaining the physical rationale. Kris has reviewed and confirmed the rationale is correct.',
 3, 'domain', 'inbox'),

-- formula_validation
('MEASURE-VAL-01', 'feature', 'formula_validation',
 'Test formulas against real production orders',
 'No test suite exists. Formulas have never been compared to covers Kris actually cut.',
 'Test suite with at least one real example per product type (6 minimum). Inputs are real customer measurements. Expected outputs are yards Kris actually used. Kris has validated each test case.',
 4, 'domain', 'inbox'),

('MEASURE-VAL-02', 'feature', 'formula_validation',
 'Validate clearance values per product type',
 'FC values (6/4/3/4/4/4) have no documented rationale. May be wrong.',
 'Kris has confirmed each clearance value is correct for its product type, or values have been corrected.',
 5, 'domain', 'inbox'),

-- label_clarity
('MEASURE-LBL-01', 'feature', 'label_clarity',
 'Fix depth label ambiguity for chairs',
 'Field labeled "Depth" means horizontal floor projection from back to front edge. Customers measure the full chair depth including backrest.',
 'Label and inline help text unambiguously communicate what to measure. Diagram shows the measurement. A customer who has never ordered can measure correctly on first attempt.',
 6, 'principle', 'inbox'),

('MEASURE-LBL-02', 'feature', 'label_clarity',
 'Document sofa label inversion',
 'Internal field width holds sofa length. Internal field length holds sofa depth. Email template swaps labels at submit-order line 31. This is the most dangerous domain trap.',
 'The inversion is documented in code comments at every touchpoint: productConfig, calculateYards sofa branch, submit-order email builder, and cart store. A developer cannot touch sofa measurements without seeing the warning.',
 7, 'principle', 'inbox'),

('MEASURE-LBL-03', 'feature', 'label_clarity',
 'Add guidance for optional fields',
 'backWidth (chairs) and armLength (chaise) are optional but affect cover fit for some shapes. No guidance on when to measure them.',
 'Each optional field has inline help text explaining when it matters. Customer can determine whether the field applies to their specific furniture.',
 8, 'principle', 'inbox');
SQL
```

- [ ] **Step 2: Insert order features**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO items (code, kind, epic_code, title, problem, done_when, seq, source, status) VALUES
-- order_completeness
('ORDER-CMP-01', 'feature', 'order_completeness',
 'Add order reference ID to both emails',
 'Neither Kris''s order email nor the customer confirmation contains an order ID. No way to reference a specific order in communication.',
 'Both emails include a shared reference ID (timestamp-based or sequential). Customer can quote this ID when contacting Kris.',
 9, 'codebase', 'inbox'),

('ORDER-CMP-02', 'feature', 'order_completeness',
 'Fix email sender domain',
 'Both emails send from onboarding@resend.dev (Resend sandbox). Emails land in spam and look illegitimate.',
 'Emails send from a verified @castawaycovers.com address. DKIM/SPF configured in Resend.',
 10, 'codebase', 'inbox'),

('ORDER-CMP-03', 'feature', 'order_completeness',
 'Collect shipping address at checkout',
 'Shipping address is not collected in the checkout form. Kris must email the customer separately to ask.',
 'Checkout form includes shipping address fields. Address is included in Kris''s order email.',
 11, 'codebase', 'inbox'),

-- order_persistence
('ORDER-PER-01', 'feature', 'order_persistence',
 'Persist order before sending email',
 'If Resend fails, submit-order returns success: true, cart clears, order is gone. No database, no log file, nothing.',
 'Order data is written to a persistent record (log file, DB row, or structured append) before calling Resend. If both emails fail, the order is recoverable.',
 12, 'codebase', 'inbox'),

('ORDER-PER-02', 'feature', 'order_persistence',
 'Surface email failure to customer',
 'submit-order catches Resend errors and returns success: true regardless. Customer sees success even if no email was sent.',
 'If email send fails, API returns an error status. Customer sees a message indicating the issue and is given a way to retry or contact Kris directly.',
 13, 'codebase', 'inbox'),

-- price_consolidation
('ORDER-PRC-01', 'feature', 'price_consolidation',
 'Consolidate add-on prices to one source',
 'Snap straps ($20), handles ($20), split cover ($35) are hardcoded in AddOnOptions.tsx, product page, create-checkout, and create-draft-order. Premium color ($4/yard) in three files.',
 'Each add-on price is defined in exactly one location. All consumers read from that source.',
 14, 'codebase', 'inbox'),

('ORDER-PRC-02', 'feature', 'price_consolidation',
 'Remove $45/yard hardcoded fallback or make it explicit',
 'calculatePrice() at MeasurementCalculator.tsx line 301 uses $45/yard. If Shopify variant lookup fails, this price is used but customer can''t add to cart anyway.',
 'Either: $45/yard fallback is removed and price comes only from Shopify, or the fallback is explicitly documented and visible to the customer as an estimate.',
 15, 'codebase', 'inbox');
SQL
```

- [ ] **Step 3: Insert guide features**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO items (code, kind, epic_code, title, problem, done_when, seq, source, status) VALUES
-- graceful_failure
('GUIDE-GRC-01', 'feature', 'graceful_failure',
 'Graceful variant lookup failure',
 'SKU lookup failure shows alert() and disables all checkout buttons. No recovery path. Customer is stuck.',
 'Failed lookup shows a non-blocking message with a contact-us fallback. Customer can still reach Kris with their measurements pre-filled.',
 16, 'codebase', 'inbox'),

-- customer_guidance
('GUIDE-CUS-01', 'feature', 'customer_guidance',
 'Reconcile FAQ measurement advice with product page',
 'FAQs say "add 1 inch to each measurement." Product page measurement form does not mention this. Contradiction will cause incorrect orders.',
 'FAQ and product page give consistent measurement guidance. Either the FAQ advice is incorporated into the calculator or the FAQ is corrected.',
 17, 'codebase', 'inbox'),

-- site_consistency
('GUIDE-CON-01', 'feature', 'site_consistency',
 'Align Craftsmanship vs Features naming',
 'Nav says "Craftsmanship," URL is /features, page title is "Craftsmanship Details." Three names for one page.',
 'One name used consistently across nav label, URL, page title, and docs.',
 18, 'codebase', 'inbox');
SQL
```

- [ ] **Step 4: Insert operate features**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO items (code, kind, epic_code, title, problem, done_when, seq, source, status) VALUES
-- catalog_cleanup
('OPER-CAT-01', 'feature', 'catalog_cleanup',
 'Remove dead Shopify checkout code',
 'handleCheckout, /api/create-checkout, /api/checkout, /api/create-draft-order are all unreachable behind isManualCheckout=true. ~150 lines of dead code. 4 dead env vars.',
 'Dead checkout code and dead API routes removed. Dead env vars (SNAP_STRAPS_VARIANT_ID, HANDLES_VARIANT_ID, MAGNETS_VARIANT_ID, COLOR_UPCHARGE_VARIANT_ID) documented as removed.',
 19, 'codebase', 'inbox'),

('OPER-CAT-02', 'feature', 'catalog_cleanup',
 'Update Shopify API version',
 'Dead checkout routes pin Shopify Storefront API to version 2024-01. If checkout is ever reactivated, this version will be deprecated.',
 'Shopify API version pinned to current stable in any remaining Shopify integration code.',
 20, 'codebase', 'inbox'),

-- build_health
('OPER-BLD-01', 'feature', 'build_health',
 'Fix TypeScript: turn off ignoreBuildErrors',
 'next.config.mjs has ignoreBuildErrors: true. 6 files with explicit any types. ~25-30 type annotations needed.',
 'ignoreBuildErrors removed from next.config.mjs. Build passes clean with strict TypeScript.',
 21, 'codebase', 'inbox'),

('OPER-BLD-02', 'feature', 'build_health',
 'Create .env.example',
 'No .env.example exists. Contributors must infer required environment variables from code.',
 '.env.example lists all required env vars with descriptions, what breaks if missing, and where to get the value.',
 22, 'codebase', 'inbox');
SQL
```

- [ ] **Step 5: Verify features**

Run: `sqlite3 docs/framework/frontier.db "SELECT code, title FROM items WHERE kind='feature' ORDER BY seq"`
Expected: 22 features, seq 1–22.

- [ ] **Step 6: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: insert 22 features into frontier.db"
```

---

### Task 5: Insert ideas

**Files:**
- Modify: `docs/framework/frontier.db`

Ideas are items with `kind='idea'` and no `done_when` required.
Derived from site polish items, deferred work, and known issues.

- [ ] **Step 1: Insert ideas**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO items (code, kind, epic_code, title, problem, seq, horizon, size, source, source_detail, status) VALUES
-- measure ideas
('MEASURE-EXT-I01', 'idea', 'formula_extraction',
 'Document floor clearance rationale',
 'Chairs use FC=6 while all other seated types use FC=4 and chaise uses FC=3. No explanation in code.',
 23, 'near', 'small', 'codebase', 'product-science.md known issues', 'inbox'),

('MEASURE-VAL-I01', 'idea', 'formula_validation',
 'Check rectangular bolt width edge case',
 'Model 3 (tables, ottomans, table-sets) does not check if width + 2*drop exceeds 54" bolt width. Wide pieces may be under-quoted.',
 24, 'near', 'small', 'codebase', 'product-science.md known issues', 'inbox'),

('MEASURE-EXT-I02', 'idea', 'formula_extraction',
 'Clarify armLength field purpose',
 'armLength is collected for chaise lounge but not used in calculateYards. Purpose undocumented.',
 25, 'near', 'small', 'codebase', 'product-science.md known issues', 'inbox'),

-- order ideas
('ORDER-CMP-I01', 'idea', 'order_completeness',
 'Edit-from-cart integrity',
 'Edit flow uses sessionStorage to pass item data. If tab closes between edit click and save, edit is silently dropped.',
 26, 'medium', 'medium', 'codebase', 'order-lifecycle.md step 8', 'inbox'),

('ORDER-PRC-I01', 'idea', 'price_consolidation',
 'Rename magnets variable to splitCoverSnaps',
 'State variable is called magnets but product is "Split Cover with Snaps." Config key is magneticClosure. Three names for one thing.',
 27, 'near', 'small', 'codebase', 'architecture.md, product-science.md', 'inbox'),

-- guide ideas
('GUIDE-CON-I01', 'idea', 'site_consistency',
 'Fix order summary empty parens before calculation',
 'Before clicking Calculate, order summary shows "Cover () x1 — $0.00." Empty parentheses look like a bug.',
 28, 'near', 'small', 'codebase', 'roadmap.md site polish', 'inbox'),

('GUIDE-CON-I02', 'idea', 'site_consistency',
 'Fix contact page button color',
 'Send Message button is blue. Every other CTA on site is teal/green.',
 29, 'near', 'small', 'codebase', 'roadmap.md site polish', 'inbox'),

('GUIDE-CUS-I01', 'idea', 'customer_guidance',
 'Add measurement validation ranges',
 'Form accepts any numeric input with no range check. No "does this seem right?" warning for extreme values.',
 30, 'medium', 'medium', 'codebase', 'order-lifecycle.md step 3', 'inbox'),

('GUIDE-GRC-I01', 'idea', 'graceful_failure',
 'Handle invalid product type in URL',
 'Invalid product type in URL renders a page with generic title and no calculator fields. No 404, just a broken experience.',
 31, 'near', 'small', 'codebase', 'order-lifecycle.md step 2', 'inbox'),

-- operate ideas
('OPER-CAT-I01', 'idea', 'catalog_cleanup',
 'Normalize SKU casing',
 'Shopify SKU prefixes use inconsistent casing: chairs/recliners (slash+lowercase), Chaiselounges (PascalCase), Ottomans (capitalized), tables (lowercase).',
 32, 'near', 'small', 'codebase', 'product-science.md SKU section', 'inbox'),

('OPER-PAY-I01', 'idea', 'payment_integration',
 'In-site Stripe payment',
 'Kris manually creates Stripe invoices for every order. Eliminates one manual step per order.',
 33, 'far', 'large', 'domain', 'roadmap.md milestone 4', 'inbox'),

('OPER-PAY-I02', 'idea', 'payment_integration',
 'Customer order status lookup',
 'No way for customer to check order status after submission. Must email Kris.',
 34, 'far', 'medium', 'domain', 'roadmap.md milestone 4', 'inbox');
SQL
```

- [ ] **Step 2: Verify ideas**

Run: `sqlite3 docs/framework/frontier.db "SELECT code, title FROM items WHERE kind='idea' ORDER BY seq"`
Expected: 12 ideas, seq 23–34.

- [ ] **Step 3: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: insert 12 ideas into frontier.db"
```

---

### Task 6: Insert blocks (dependencies)

**Files:**
- Modify: `docs/framework/frontier.db`

- [ ] **Step 1: Insert dependency edges**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
INSERT INTO blocks (blocker, blocked, note) VALUES
-- measure milestone blocks order work
('MEASURE-EXT-01', 'MEASURE-VAL-01', 'Can''t validate formulas that aren''t extracted yet'),
('MEASURE-EXT-02', 'MEASURE-VAL-02', 'Can''t validate clearances without config to point to'),
('MEASURE-VAL-01', 'MEASURE-LBL-01', 'Fix labels after formulas are validated — label changes may affect formula semantics'),

-- order features have internal dependencies
('ORDER-PER-01', 'ORDER-PER-02', 'Can''t surface email failure without persistent fallback'),
('ORDER-PRC-01', 'ORDER-PRC-02', 'Consolidate add-ons before addressing base price'),

-- milestone-level ordering
('measure', 'guide', 'Can''t guide customers if calculator is wrong'),
('order', 'operate', 'Can''t automate unreliable orders'),

-- cross-milestone
('ORDER-CMP-02', 'OPER-CAT-01', 'Fix email sender before removing dead checkout — both touch Resend/Shopify config'),
('MEASURE-EXT-01', 'OPER-BLD-01', 'Extract pure functions first — they need proper types, which helps fix ignoreBuildErrors');
SQL
```

- [ ] **Step 2: Verify blocks**

Run: `sqlite3 docs/framework/frontier.db "SELECT blocker, blocked, note FROM blocks"`
Expected: 9 dependency edges.

- [ ] **Step 3: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: insert dependency graph into frontier.db"
```

---

## Chunk 3: Consume Domain Knowledge as Comments

### Task 7: Insert comments from consumed docs

**Files:**
- Modify: `docs/framework/frontier.db`
- Read: `docs/framework/product-science.md`
- Read: `docs/framework/architecture.md`
- Read: `docs/framework/order-lifecycle.md`

Comments capture the dense domain knowledge from consumed docs.
Each comment references its source file so the knowledge is traceable.

- [ ] **Step 1: Read product-science.md and insert formula/constant comments**

Read `docs/framework/product-science.md`. For each section, insert a comment on the relevant item or milestone. Key content to capture:

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
-- Product type / calc model reference
INSERT INTO comments (target_code, target_kind, body) VALUES
('measure', 'milestone',
'Source: product-science.md

Six product types, three calc models:
- Model 1 (backrest): chairs-recliners (FC=6", hem=0.5", 1 lane, AT2F=yes), sofas-loveseats (FC=4", hem=0.5", 2 lanes, AT2F=yes)
- Model 2 (chaise): chaise-lounge (FC=3", no hem, bolt width 54" checked, AT2F=no)
- Model 3 (rectangular): ottomans, tables, table-sets (FC=4", no hem, no bolt check, AT2F=no)

SKU casing is inconsistent: chairs/recliners (slash+lowercase), Chaiselounges (PascalCase), Ottomans (capitalized), sofas-loveseats, tables, tablesets (lowercase).

Sofa label inversion: config maps field width → UI label "Length" and field length → UI label "Depth".
Chaise height means floor to bottom of seat, not overall height.');

-- Formula details for extraction
INSERT INTO comments (target_code, target_kind, body) VALUES
('MEASURE-EXT-01', 'item',
'Source: product-science.md

Model 1 (chairs/sofas):
  AT2F = sqrt((height - armrestHeight)^2 + length^2)
  ML = (height + backrestDepth + AT2F + armrestHeight) - (2 * FC)
  addLength = armrestHeight + AT2F + backrestDepth - FC + hem
  perLaneLength = ML + addLength
  Chairs: yards = ceil(perLaneLength / 36)
  Sofas: yards = ceil((perLaneLength / 36) * 2)  -- ceil AFTER multiplying by 2

Model 2 (chaise):
  mainLength = length + 2*(FTBS - 3)
  mainWidth = width + 2*(FTA - 3)
  additionalLength = mainWidth > 54 ? (mainWidth - 54) + 2 : 0
  yards = ceil((mainLength + additionalLength) / 36)

Model 3 (rectangular):
  drop = max(0, height - FC)
  ML = max(0, length + 2*drop)
  yards = ceil(ML / 36)
  Note: width collected but NOT used in yard calculation.
  Note: AT2F appears in both ML and addLength, so errors in depth or armrestHeight compound through three terms.');

-- Add-on matrix
INSERT INTO comments (target_code, target_kind, body) VALUES
('ORDER-PRC-01', 'item',
'Source: product-science.md

Add-on availability matrix (key=magneticClosure in AddOnOptions, magnets in cart/store):
  chairs-recliners: snapStraps=yes, handles=yes, splitCover=no
  sofas-loveseats: snapStraps=yes, handles=yes, splitCover=yes
  chaise-lounge: snapStraps=yes, handles=yes, splitCover=no
  ottomans: snapStraps=no, handles=yes, splitCover=no
  tables: snapStraps=no, handles=yes, splitCover=no
  table-sets: snapStraps=no, handles=yes, splitCover=yes

Pricing: snapStraps +$20, handles +$20, splitCover +$35
Premium color: +$4/yard (Diamond Pacific Blue, Diamond Red)
Base price: $45/yard (hardcoded in calculatePrice(), overridden by Shopify variant price if found)

Total = basePrice + premiumUpcharge + snapStraps + handles + splitCover');

-- Customer photos
INSERT INTO comments (target_code, target_kind, body) VALUES
('order_completeness', 'epic',
'Source: product-science.md + order-lifecycle.md

Customer photos: optional, 1-3 per order, max 10MB each, JPEG/PNG only.
Sent as Resend email attachments to Kris. Not stored server-side beyond email delivery.
Purpose: help verify measurements before production.
If photo.arrayBuffer() fails during attachment building, entire Promise.all fails — caught by outer try-catch, email sends without photos, no error surfaced.');

-- Gusset fabric
INSERT INTO comments (target_code, target_kind, body) VALUES
('measure', 'milestone',
'Source: product-science.md

Gusset fabric: separate, lighter-weight material used for structured panels/insets.
Profit calculator (calculators/profit_calculator.html) includes gusset fields: yards needed (default 0) and price per yard (default $6.00).
Relationship between customer order and gusset requirement is not computed — Kris determines this from order details.
Not part of the customer-facing calculator or ordering flow.');

-- Variant lookup chain
INSERT INTO comments (target_code, target_kind, body) VALUES
('GUIDE-GRC-01', 'item',
'Source: product-science.md + architecture.md

Variant lookup chain (MeasurementCalculator.tsx lines 319-376):
1. findVariantBySKU(shopifySKU) — direct SKU match via Storefront API (5-min cache)
2. If not found: fetch all products (max 250), search by handle/title containing product type
3. For each matched product, check variant title = "{yards} yards" (case-insensitive)
4. If still not found: alert() + variantId = '''' + onCalculate with $45 fallback price
5. Add to Cart button disabled when coverVariantId is empty

No graceful degradation. No "contact us" fallback.');
SQL
```

- [ ] **Step 2: Read architecture.md and insert boundary/env comments**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
-- Architecture boundaries
INSERT INTO comments (target_code, target_kind, body) VALUES
('order', 'milestone',
'Source: architecture.md

Four system boundaries:
1. Shopify — catalog only, NOT payment. Buy Button SDK used as product API client. $10/month plan.
2. The Site — measurement science, cart (Zustand/localStorage), customer experience.
3. Resend + Stripe — Resend sends order emails. Stripe invoicing is manual (Kris creates invoices).
4. Kris — order review, invoice creation, measurement verification, production, customer communication.

Contract: site delivers complete order. Kris should never need to call the customer.

Active env vars: NEXT_PUBLIC_SHOPIFY_DOMAIN, NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_ADMIN_ACCESS_TOKEN, RESEND_API_KEY, NOTIFICATION_EMAIL (fallback: support@castawaycovers.com), NEXT_PUBLIC_COMING_SOON_MODE, NEXT_PUBLIC_PREVIEW_TOKEN.
Dead env vars: SNAP_STRAPS_VARIANT_ID, HANDLES_VARIANT_ID, MAGNETS_VARIANT_ID, COLOR_UPCHARGE_VARIANT_ID, NEXT_PUBLIC_MANUAL_CHECKOUT (overridden by hardcoded true).

Key file map:
  Cart state: src/store/cartStore.ts
  Checkout: src/app/cart/page.tsx (handleManualOrder active, handleCheckout dead)
  Order email: src/app/api/submit-order/route.ts
  Variant lookup: src/lib/shopify-client.ts
  Yard calc: src/components/MeasurementCalculator.tsx
  $45 hardcode: MeasurementCalculator.tsx line 301
  Dead checkout: src/app/api/create-checkout/route.ts (entire file)
  Photo upload: cart/page.tsx lines 432-464 (client), submit-order lines 16-21 (server)');
SQL
```

- [ ] **Step 3: Read order-lifecycle.md and insert flow/error comments**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
-- Order lifecycle error modes
INSERT INTO comments (target_code, target_kind, body) VALUES
('order', 'milestone',
'Source: order-lifecycle.md

Error mode summary (14-step self-measure flow):
Step 3 — Wrong measurement: no validation, no range check, no "does this seem right?" warning
Step 5 — SKU lookup fails: alert + disabled buttons, no recovery path
Step 9 — Photo >10MB: alert, file input cleared, no photos attached
Step 10 — Resend fails: success message shown, cart cleared, order GONE (no persistent record)
Step 10 — Emails go to spam: sandbox domain onboarding@resend.dev, not verified custom domain
Step 10 — NOTIFICATION_EMAIL missing: falls back to support@castawaycovers.com
Step 12 — Stripe invoice total wrong: manual entry error, no automated check
MS — Formspree fails: error alert, no booking notification to Kris

Critical: Step 10 is the only unrecoverable failure. All others leave the cart intact for retry.');

-- Measurement service details
INSERT INTO comments (target_code, target_kind, body) VALUES
('guide', 'milestone',
'Source: order-lifecycle.md

Measurement service (/measurement-service):
- $75 fee, credited toward purchases $500+
- Monmouth County NJ only (~10 miles of Rumson)
- Browser geolocation detection (40.3723, -74.0018)
- Formspree endpoint: https://formspree.io/f/xblkwzzr (shared with contact form)
- Payment link: https://uhrtqs-jx.myshopify.com/products/measurement-service
- After booking: Kris visits, measures, enters order herself (skips steps 2-9)
- Risk: same Formspree endpoint for contact + measurement — distinguished only by email subject');
SQL
```

- [ ] **Step 4: Verify comments**

Run: `sqlite3 docs/framework/frontier.db "SELECT target_code, target_kind, substr(body, 1, 60) FROM comments"`
Expected: 9 comments across milestones, epics, and items.

- [ ] **Step 5: Commit**

```bash
git add docs/framework/frontier.db
git commit -m "feat: consume domain knowledge as comments in frontier.db"
```

---

## Chunk 4: Write Markdown Files

### Task 8: Write vision.md

**Files:**
- Create: `docs/framework/vision.md`

- [ ] **Step 1: Write vision.md**

Write the exact text from the approved spec (lines 46-88 of the design spec) to `docs/framework/vision.md`.

- [ ] **Step 2: Verify**

Run: `head -5 docs/framework/vision.md`
Expected: `# Vision` followed by "Every cover fits..."

- [ ] **Step 3: Commit**

```bash
git add docs/framework/vision.md
git commit -m "docs: add vision.md"
```

---

### Task 9: Write principles.md

**Files:**
- Create: `docs/framework/principles.md` (overwrites existing)

- [ ] **Step 1: Write principles.md**

Write the exact text from the approved spec (lines 94-242 of the design spec) to `docs/framework/principles.md`. This replaces the existing positive-values version.

- [ ] **Step 2: Verify**

Run: `head -5 docs/framework/principles.md`
Expected: `# Principles` followed by "The feature works..."

Run: `grep -c "^## " docs/framework/principles.md`
Expected: `9` (nine failure mode sections)

- [ ] **Step 3: Commit**

```bash
git add docs/framework/principles.md
git commit -m "docs: rewrite principles.md as failure modes"
```

---

### Task 10: Update README.md

**Files:**
- Modify: `docs/framework/README.md`

- [ ] **Step 1: Replace README.md content**

Write the exact text from the approved spec (lines 447-487 of the design spec) to `docs/framework/README.md`.

- [ ] **Step 2: Verify**

Run: `head -3 docs/framework/README.md`
Expected: `# Castaway Covers — Framework` followed by "Durable thinking..."

- [ ] **Step 3: Commit**

```bash
git add docs/framework/README.md
git commit -m "docs: update README.md for new framework structure"
```

---

### Task 11: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace the Framework section**

In `CLAUDE.md`, find the `### Framework` section (currently contains question-routing pointers) and replace with the text from the approved spec (lines 497-512). This replaces the question-routing pattern with direct file references.

- [ ] **Step 2: Verify**

Run: `grep -A 5 "### Framework" CLAUDE.md`
Expected: Shows "durable reference docs" and file list (vision.md, principles.md, frontier.db, README.md).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md framework pointers"
```

---

## Chunk 5: Cleanup and Validation

### Task 12: Validate consumption completeness

**Files:**
- Read: `docs/framework/frontier.db`

Before deleting source files, verify nothing was lost.

- [ ] **Step 1: Verify product-science.md coverage**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
-- Every known issue should have an item or comment
SELECT 'items' as source, code, title FROM items
WHERE source_detail LIKE '%product-science%'
UNION ALL
SELECT 'comments', target_code, substr(body, 1, 50) FROM comments
WHERE body LIKE '%product-science%';
SQL
```

Expected: Multiple rows covering formulas, constants, SKUs, add-ons, photos, gusset fabric.

- [ ] **Step 2: Verify architecture.md coverage**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
SELECT 'items' as source, code, title FROM items
WHERE problem LIKE '%dead%checkout%' OR problem LIKE '%hardcoded%' OR problem LIKE '%ignoreBuildErrors%' OR problem LIKE '%env%'
UNION ALL
SELECT 'comments', target_code, substr(body, 1, 50) FROM comments
WHERE body LIKE '%architecture%';
SQL
```

Expected: Dead checkout, hardcoded prices, TypeScript, env vars all have items. Boundaries and file map in comments.

- [ ] **Step 3: Verify order-lifecycle.md coverage**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
SELECT 'items' as source, code, title FROM items
WHERE problem LIKE '%Resend%' OR problem LIKE '%variant%lookup%' OR problem LIKE '%shipping%address%' OR problem LIKE '%reference ID%'
UNION ALL
SELECT 'comments', target_code, substr(body, 1, 50) FROM comments
WHERE body LIKE '%order-lifecycle%';
SQL
```

Expected: Error modes covered by items. Flow details and measurement service in comments.

- [ ] **Step 4: Summary counts**

```bash
sqlite3 docs/framework/frontier.db <<'SQL'
SELECT 'milestones' as tbl, COUNT(*) FROM milestones
UNION ALL SELECT 'epics', COUNT(*) FROM epics
UNION ALL SELECT 'features', COUNT(*) FROM items WHERE kind='feature'
UNION ALL SELECT 'ideas', COUNT(*) FROM items WHERE kind='idea'
UNION ALL SELECT 'blocks', COUNT(*) FROM blocks
UNION ALL SELECT 'comments', COUNT(*) FROM comments;
SQL
```

Expected: 4 milestones, 12 epics, 22 features, 12 ideas, 9 blocks, 9+ comments.

---

### Task 13: Delete consumed files

**Files:**
- Delete: `docs/framework/roadmap.md`
- Delete: `docs/framework/product-science.md`
- Delete: `docs/framework/architecture.md`
- Delete: `docs/framework/order-lifecycle.md`

- [ ] **Step 1: Delete consumed files**

```bash
git rm docs/framework/roadmap.md docs/framework/product-science.md docs/framework/architecture.md docs/framework/order-lifecycle.md
```

- [ ] **Step 2: Verify final directory structure**

```bash
ls docs/framework/
```

Expected:
```
README.md
frontier.db
principles.md
vision.md
```

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: delete consumed framework files — content now in frontier.db"
```

---

### Task 14: Final verification and summary commit

- [ ] **Step 1: Run scripts/check.sh**

```bash
bash scripts/check.sh
```

Expected: Build succeeds (framework changes are docs only, no code impact).

- [ ] **Step 2: Verify git log shows clean history**

```bash
git log --oneline -10
```

Expected: ~10 commits covering schema creation, milestone/epic/feature/idea/block/comment insertion, markdown writes, CLAUDE.md update, and file deletion.

- [ ] **Step 3: Verify the new framework is queryable**

```bash
sqlite3 docs/framework/frontier.db "SELECT m.code, m.title, COUNT(DISTINCT i.code) as items FROM milestones m LEFT JOIN epics e ON e.milestone=m.code LEFT JOIN items i ON i.epic_code=e.code GROUP BY m.code"
```

Expected: 4 milestones with item counts showing features+ideas distributed across them.
