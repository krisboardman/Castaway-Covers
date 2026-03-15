# Framework Modernization — Design Spec

Consolidate Castaway Covers' framework from 5 markdown files into
3 artifacts: vision.md + principles.md + frontier.db. Align with
the pattern established in columbo and bostonstrong, right-sized
for a custom cover e-commerce site.

---

## What Changes

### Before

```
docs/framework/
  README.md              — reading order + authority model
  principles.md          — positive values (charter, quality hierarchy)
  product-science.md     — formulas, constants, SKU systems, pricing
  architecture.md        — four boundaries, env vars, dead code inventory
  order-lifecycle.md     — 14-step flow, error modes
  roadmap.md             — 4 prose milestones
```

### After

```
docs/framework/
  README.md              — updated reading order, query examples, authority model
  vision.md              — new: felt end-state, deliverable, language
  principles.md          — rewritten: 9 failure modes
  frontier.db            — new: structured roadmap (replaces roadmap.md)
```

### Deleted (content consumed into frontier.db or principles.md)

- `roadmap.md` — milestones, epics, features, site-polish → DB
- `product-science.md` — formulas, constants, known issues → DB comments
- `architecture.md` — boundaries, dead code, env vars → DB features
- `order-lifecycle.md` — 14-step flow, error modes → DB features/comments

---

## vision.md

```markdown
# Vision

Every cover fits — because the customer knew what to measure,
the site got the order to Kris complete, and Kris had everything
she needed to cut fabric the day it arrived.

## What a customer gets

A complete cover specification — furniture type, dimensions,
fabric yards, color, add-ons, contact info — that a first-time
buyer can produce without calling Kris, and that Kris can act on
without calling the customer.

The site knows which product types it handles, what measurements
each one needs, and where the math has been checked against real
covers Kris has built. Where it hasn't been checked, it says so.

## Earn it, then claim it

The roadmap tracks what the site has earned the right to promise.
A milestone is done when the site can honestly make a new claim —
not when the code exists, but when Kris has confirmed it against
covers she's actually cut and shipped.

Don't build the next thing because the last thing is built. Build
the next thing when there's evidence the last thing is right.

## Language

Terms that cause mistakes when used loosely:

- **product** — say cover type, Shopify product, or configured
  order. Each is a different object.
- **price** — say base price, total with add-ons, or Shopify
  variant price. These diverge when variant lookup fails.
- **measurements** — say customer inputs, calculated dimensions,
  or fabric yards. The customer enters inches; the calculator
  produces yards.
- **checkout** — say manual submission (active path) or Shopify
  checkout (dead code). Only one is live.
- **width/length** — check the product type. For sofas, the
  internal field `width` holds the sofa's length.
```

---

## principles.md

```markdown
# Principles

The feature works. The code is clean. Could the cover still
not fit?

This document lists the ways. Each section names a failure
that the roadmap's exit criteria can't catch on their own.
If any of these are true of your work, the vision isn't being
served regardless of what the tests say.

---

## It uses the right formula but the wrong label

The calculator is mathematically correct. The yard count
matches the test suite. But the customer measured "Depth" as
the full chair depth including the backrest, because that's
what depth means to a normal person. The field label says
"Depth" but means the horizontal floor projection from back
to front edge. The cover doesn't fit.

The sofa is worse: the internal field `width` holds the
sofa's length. The email template swaps the labels back. One
day someone will "fix" this inconsistency and break production.

Before building: for each measurement field, can a customer
who has never ordered measure correctly on the first attempt
using only the label and the diagram? If you're changing a
sofa field, do you know which direction the swap goes?

---

## It shows a price that didn't come from Shopify

The $45/yard fallback fires because variant lookup failed.
The customer sees a plausible price and configures add-ons.
The price came from a hardcoded constant, not the catalog.
Add-on prices ($20 snap straps, $20 handles, $35 split cover)
are hardcoded in three different files. If Kris changes a
price in Shopify, the site still shows the old number until
someone finds and updates each hardcoded instance.

Before building: for every dollar amount the customer sees,
can you trace it to one source? If the price exists in more
than one place, it will diverge.

---

## It says "order submitted" but the order can vanish

The submit-order API catches Resend failures and returns
`success: true` anyway. The cart is cleared. The customer sees
"Thank you!" The order exists in no database, no log file,
no email. It evaporated.

Before building: if Resend is down, does the order survive?
If the answer is "the email is the record," the order is one
API failure from gone.

---

## It changes a formula without Kris checking the cover

The floor clearance for chairs is 6 inches. For sofas it's 4.
For chaise lounges it's 3. These numbers aren't in the code
comments. Someone sees 6 and changes it to 4 for consistency.
The chair cover now drags on the ground.

Before building: has Kris confirmed this output against a
cover she actually cut and shipped? If the only evidence is
"the test passes," the formula is unearned. Tests derived from
code prove the code is consistent with itself, not that the
cover fits.

---

## It fails and nobody finds out

Shopify API version `2024-01` gets deprecated. Resend sandbox
domain gets flagged as spam. The Formspree form ID expires. The
failure isn't loud — no error page, no alert, no log entry. The
site looks fine. Orders stop arriving or land in spam. Kris
doesn't know until a customer calls.

Before building: if this external dependency fails, does
anyone find out before a customer does? If the answer is
"eventually," the failure is silent.

---

## It treats the sofa like every other product type

Code that reads `measurements.width` for a sofa is reading
the sofa's length. Code that reads `measurements.length` is
reading the sofa's depth. The email template at line 31 of
submit-order swaps the labels for display. The cart store
does not.

This is the single most dangerous trap in the codebase. Every
piece of code that touches sofa measurements must account for
the inversion. If you're not sure whether it does, it doesn't.

Before building: does this code touch measurements for sofas?
If yes, trace the field from customer input through cart
through email and confirm the label matches the dimension at
every step.

---

## It builds something Kris didn't ask for

Kris's manual Stripe invoicing works for her current volume.
Her measurement service process works. The contact form works.
Building automation around a process that isn't broken is
building infrastructure nobody reads from.

Before building: has Kris said this is a problem? If the
motivation is "it would be better" rather than "Kris needs
this," it's not earned.

---

## It mixes up the two SKU systems

Display SKU (`CHR-36x24x30`) identifies a configured order
for the customer. Shopify SKU (`chairs/recliners-4`) identifies
a pricing variant. Different formats, different consumers,
different purposes. The casing is also inconsistent —
`chairs/recliners` vs `Chaiselounges` vs `Ottomans`.

Before building: which SKU does this code use, and why? If
you can't answer instantly, the code probably conflates them.

---

## It hides a measurement behind "optional"

`backWidth` for chairs and `armLength` for chaise lounges are
optional fields. But for some furniture shapes, skipping them
produces a cover that doesn't fit. "Optional" means the
calculator doesn't require it, not that the cover doesn't
need it.

Before building: for each optional field, can the customer
tell whether it matters for their specific piece? If there's
no guidance, "optional" becomes "skipped" and the cover is
wrong.
```

---

## Frontier DB Schema

```sql
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
```

### Schema rationale vs columbo/bostonstrong

| Decision | Rationale |
|----------|-----------|
| No `proofs` table | No testing infrastructure to feed it. Add when earned. |
| No `prior_art` table | Dead-code lessons go into principles (failure modes). |
| No `anti_dilution` on epics | principles.md serves this role. |
| No `layers` on items | No L1/L2/L3 concept in this domain. |
| No `superseded_by` on items | Item lineage tracking not needed at this scale. |
| Source includes `'kris'` | Replaces `'mike'`. No `'ai_futures'` or `'cross_repo'`. |
| Horizons `near/medium/far` | No `'moonshot'` — this is a cover business. |
| Sizes `small/medium/large` | No `'epic'` size — features stay decomposed. |

---

## Milestones

Four milestones, strictly ordered. Each depends on the one before.

### measure — "The calculator produces the right cover spec"

**Unlocked statement:** For any supported furniture type, given
correct customer inputs, the calculator outputs the right yard
count and the right price — validated against covers Kris has
actually cut.

**Rejection:** A calculator whose output has never been compared
to real production orders, or whose formulas were validated only
against themselves, cannot claim this.

**Status:** future (frontier — formulas exist but haven't been
validated against Kris's production history)

### order — "Every submitted order reaches Kris complete"

**Unlocked statement:** When a customer submits an order, Kris
receives every field she needs — measurements, add-ons, color,
price, contact info, photos — in unambiguous format, and the
record survives any single service failure.

**Rejection:** An order flow that returns success while silently
losing the email, or that sends sofa measurements with swapped
labels and no indication of the swap, cannot claim this.

**Status:** future

### guide — "A first-time customer can do this without help"

**Unlocked statement:** A customer who has never heard of a
custom cover can identify their furniture type, measure correctly
on the first attempt, understand the price, and complete checkout
without needing to call or email Kris.

**Rejection:** A site where "Depth" means different things on
different product pages, where variant lookup failure dead-ends
with an alert and no recovery, or where the FAQ contradicts the
measurement form, cannot claim this.

**Status:** future

### operate — "Routine orders flow without manual work beyond production"

**Unlocked statement:** Orders flow from customer submission
through payment to Kris's production queue without Kris manually
creating invoices, separately collecting shipping addresses, or
debugging site issues.

**Rejection:** A business where every order requires Kris to
manually create a Stripe invoice, email for a shipping address,
and cross-reference whether the sofa labels were swapped is not
operating — it's being carried.

**Status:** future

---

## Consumption Plan

### Content consumed into frontier.db

**From roadmap.md:**
- 4 milestones → `milestones` table (rethought, not ported)
- Milestone requirements → `epics` + `items` (kind=feature)
- Site Polish section → `items` (kind=idea)
- Deferred section → killed or omitted

**From product-science.md:**
- Six product types, three calc models → comments on measure features
- Per-model constants (FC, hem, bolt width) → comments on measure features
- AT2F formula and derivation → comments on formula_extraction features
- Two SKU systems → comments on catalog_cleanup features
- Add-on availability matrix → comments on relevant features
- Color system and pricing → comments on price_consolidation features
- Known issues (8 documented) → items (kind=feature or idea)
- Variant lookup chain → comments on order features
- Customer photos (upload flow, size limits, email attachment) → comment on order_completeness
- Gusset fabric (separate material, pricing, profit calculator) → comment on measure milestone

**From architecture.md:**
- Four boundaries → comments on milestone-level context
- Dead Shopify checkout path → feature under operate
- Hardcoded prices inventory → feature under order
- Env var documentation → comments on relevant features
- Current State vs Target table → features across milestones
- Key File Map → comment on milestone or README

**From order-lifecycle.md:**
- 14-step self-measure flow → comments on order features
- Error Mode Summary → features under order and guide
- Measurement service flow → comment on guide milestone (include Formspree form ID, Shopify payment URL, geolocation behavior)
- Critical gaps (Resend failure, sofa swap, missing shipping) → features

### Files deleted

- `docs/framework/roadmap.md`
- `docs/framework/product-science.md`
- `docs/framework/architecture.md`
- `docs/framework/order-lifecycle.md`
- `docs/framework/principles.md` (replaced by new version)

### Files created

- `docs/framework/vision.md`
- `docs/framework/principles.md` (rewritten)
- `docs/framework/frontier.db`

### Files updated

- `docs/framework/README.md`
- `CLAUDE.md` (update framework section pointers)

---

## README.md

```markdown
# Castaway Covers — Framework

Durable thinking that outlives any one implementation.

## Reading Order

1. `vision.md` — what the site is for and what it earns
2. `principles.md` — failure modes that tests can't catch
3. `frontier.db` — the roadmap: milestones, epics, items, dependencies

## Querying the Roadmap

    sqlite3 docs/framework/frontier.db

    -- Current milestone status
    SELECT code, title, status FROM milestones;

    -- Active work
    SELECT code, title, problem FROM items WHERE status = 'active';

    -- What blocks what
    SELECT b.blocker, b.blocked, b.note FROM blocks b;

    -- Features for a milestone
    SELECT i.code, i.title, i.status
    FROM items i
    JOIN epics e ON i.epic_code = e.code
    WHERE e.milestone = 'measure' AND i.kind = 'feature';

## Authority

| Source | Role |
|---|---|
| **Kris** | Final authority on all business decisions |
| **Framework** (`docs/framework/`) | Durable truth — domain model, values, roadmap |
| **CLAUDE.md** | Operational reference — file paths, env vars, commands |
| **Specs** (`docs/superpowers/specs/`) | Frozen design decisions |
| **Plans** (`docs/superpowers/plans/`) | Execution scratch; discard after work is done |

When sources conflict: Kris > Framework > Specs > Plans.
```

---

## CLAUDE.md Updates

Replace the current `### Framework` section with pointers to the
new structure:

```markdown
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
```

---

## Epics (Initial Structure)

Epics will be populated during implementation. Preliminary
structure based on analysis of existing docs and codebase:

### Under measure

- `formula_extraction` — Extract calc logic into pure testable functions
- `formula_validation` — Validate formulas against real production orders
- `label_clarity` — Fix measurement label ambiguities across product types

### Under order

- `order_completeness` — Every order has every field Kris needs
- `order_persistence` — Order record survives email failure
- `price_consolidation` — One source of truth for all prices

### Under guide

- `customer_guidance` — Clear measurement instructions per product type
- `graceful_failure` — Recover from variant lookup and other failures
- `site_consistency` — Naming, colors, terminology alignment

### Under operate

- `payment_integration` — In-site Stripe payment
- `catalog_cleanup` — SKU consistency, dead code removal
- `build_health` — TypeScript clean build, env var documentation

These epics and their features will be fully specified and
populated into frontier.db during implementation. The consumption
of product-science.md, architecture.md, and order-lifecycle.md
content will produce the specific feature items and comments.

---

## Implementation Sequence

1. Create frontier.db with schema
2. Insert milestones
3. Insert epics
4. Read each consumed doc, extract items and comments, insert
5. Write vision.md
6. Write principles.md
7. Update README.md
8. Update CLAUDE.md framework section (replaces question-routing pointers with direct file references)
9. Delete consumed files
10. Commit

---

## Risk: Domain Knowledge Loss

The consumed docs contain dense domain knowledge (formulas,
constants, SKU mappings, error modes). The risk is that this
knowledge becomes harder to find in DB comments than it was in
dedicated markdown files.

**Mitigation:** During consumption, every formula, constant, and
known issue gets a comment attached to a specific item. The
comment references the original source location. Query examples
in README.md show how to retrieve domain knowledge by milestone
or epic.

**Validation:** After consumption, run queries to confirm:
- Every known issue from product-science.md has a corresponding item or comment
- Every error mode from order-lifecycle.md has a corresponding item or comment
- Every "Current State vs Target" row from architecture.md has a corresponding item
