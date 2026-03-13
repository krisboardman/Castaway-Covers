# Castaway Covers — Framework

Castaway Covers makes custom-fit outdoor furniture covers — measured, cut, and sewn for one specific piece of furniture.

## What This Folder Is

Durable thinking that outlives any one implementation. Not specs. Not tasks. Not how-to guides.

A thing belongs here only if:
- A fresh session must know it to think correctly
- It will remain relevant across many iterations
- It is more durable than any one spec or task

When something changes here, it changes the reasoning baseline for every future session.

## Reading Order

1. `principles.md` — the value system; what matters and why
2. `product-science.md` — how measurements become covers (the domain model)
3. `architecture.md` — how the site is built and why it's built that way
4. `order-lifecycle.md` — what happens from customer input to Kris receiving an order
5. `roadmap.md` — directional intent; what comes next and what doesn't

Read in order for a first session. Jump directly to the relevant file when you already have context.

## Authority Hierarchy

| Source | Role |
|---|---|
| **Framework** (`docs/framework/`) | Authoritative for durable truth — domain model, values, architecture intent |
| **CLAUDE.md** | Operational reference — file paths, env vars, commands, deployment flow |
| **Specs** (`docs/superpowers/specs/`) | Frozen point-in-time design decisions; reflects what was decided, not necessarily what's currently built |
| **Plans** (`docs/superpowers/plans/`) | Execution scratch; discard after the work is done |
| **Kris** | Final authority on all business decisions — framework captures her intent, but she can override anything here |

When sources conflict: Kris > Framework > Specs > Plans. CLAUDE.md is a separate axis (operational, not conceptual) and doesn't conflict with framework — it complements it.
