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
