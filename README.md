# Castaway Covers

Custom-fit outdoor furniture covers, made to order. This repo is the code behind
the business: the customer-facing website and the internal tools used to turn a
customer's measurements into a finished cover.

**Live site:** https://castawaycovers.com

## The business

Castaway Covers makes marine-vinyl covers for patio furniture: chairs, sofas,
chaise lounges, ottomans, tables, and custom one-offs like grill islands and
sectionals. Each cover is cut to the customer's actual furniture, with grommets,
snaps, and bungee tabs so it stays put in wind. I measure in the home, design the
pattern, cut, sew, and install.

## What I built

I run the business and built the software for it end to end.

- **Website** (Next.js, React, Zustand): product pages, a cover designer that
  prices a cover from the customer's dimensions, cart and checkout, an in-home
  measurement booking flow, and order and contact emails (Resend).
- **Cover calculators** (`calculators/`): one self-contained HTML tool per
  furniture type. Enter measurements and get fabric yardage, strip layout,
  hardware counts, and two diagrams:
  - a **cut diagram** showing only where the material is cut, and
  - an **assembly diagram** showing every snap, grommet, and bungee tab.
- **Conventions** (`calculators/CLAUDE.md`): a written rulebook for the
  diagrams (colors, hardware placement, what belongs on which diagram) so every
  calculator produces output the person cutting and sewing can follow without
  asking questions.
- **Quoting and profit tools**: pricing and profit calculators that tie fabric,
  labor, and hardware to a quote.

## Why it's here

It shows how I turn a messy, manual process (measure, sketch, calculate, cut)
into repeatable workflows with clear checklists and outputs that someone else
can act on.

## Running the website locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Configuration (preview token, email and Shopify
keys) comes from environment variables in `.env.local`, which is not committed.
