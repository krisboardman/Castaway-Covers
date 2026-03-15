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
