# Principles

## Charter

Castaway Covers makes custom-fit outdoor furniture covers from premium marine-grade vinyl — measured, cut, and sewn for one specific piece of furniture. Not mass-market. Not one-size-fits-all. The site is the primary sales channel. The business promise is **fit** — a cover built for your specific chair, sofa, or table.

Every cover includes:
- Heavy-duty marine vinyl (UV protected, fire retardant, mildew resistant)
- Reinforced grommets
- Durable bungee cords with hooks and locking clips
- Custom corner cut-outs with waterproof liner
- Sealed inner edges
- Castaway's signature wavy edge design

Two customer paths:
1. Self-measure on the site
2. Professional in-home measurement service ($75, Monmouth County NJ, credited toward $500+ orders)

## What Castaway Covers Is Not

Not a marketplace — one vendor, one product type, many configurations.

Not a catalog site — every order is custom. Measurements define the product.

Not a subscription business.

Not a tech company. The tech serves the covers.

## Authority Model

Kris owns all business decisions: pricing, products, policies, customer communication.

Measurement formulas are domain science. Changes require Kris's validation against physical reality — real covers on real furniture. Never adjust a formula based on code logic alone.

Technical decisions (how to implement, what to refactor) can be made by whoever works on the code. But they must not change business behavior without Kris's approval.

## Quality Hierarchy

What matters most, in order:

1. **Measurement accuracy.** Wrong measurements = wrong cover = return. The calculators are the product.
2. **Order reliability.** Every order must flow from customer to Kris without dropping information.
3. **Customer clarity.** The site must make it easy to understand what to measure and how.
4. **Site stability.** No broken pages. No dead flows. No confusing errors.
5. **Aesthetics / polish.** Matters — but not at the expense of 1–4.

When a change improves #5 at the risk of #1, don't make it.

## Kris as Sensor

Kris is the domain expert. She knows what measurement mistakes customers actually make. She knows which product types are tricky. She knows where orders go wrong.

Her operational experience is the highest-trust data source.

When the site's logic and Kris's experience disagree, investigate. Don't assume the code is right.

## Language Discipline

Five terms that cause mistakes when used loosely. Always specify which you mean.

**"product"** — specify:
- Shopify product (a record in Shopify)
- Cover type (chair, sofa, chaise, etc.)
- Configured order (the specific dimensions a customer is buying)

**"price"** — specify:
- Base price
- Total with add-ons
- Shopify variant price

**"measurements"** — specify:
- Customer inputs (what the customer typed)
- Calculated dimensions (what the calculator derived)
- Fabric yards (what gets ordered)

**"checkout"** — specify:
- Manual form submission (active path)
- Shopify checkout (dormant)
- The customer-facing purchase experience (what the customer sees)

**"Width" / "Length"** — check which product type before using either. For sofas, the internal `width` field is labeled "Length" on screen, and vice versa. The field names and the labels do not match. This causes bugs.

## Scope

Castaway Covers is a single-product-type business with many configurations. The complexity is in the configuration — measurements → fabric — not the catalog.

Features and infrastructure should reflect this. Optimize for one product done well. Not a platform that supports many product types. Not a general e-commerce framework. The goal is covers that fit, orders that arrive, customers who understand what they're buying.
