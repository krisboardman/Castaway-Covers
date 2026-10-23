---
title: Singer 66 (serial AB759762) — reference index
updated: 2026-10-23
status: model identified from serial; physical check pending
---

# Singer 66, serial AB759762

Start here. This folder is the working reference for Kristen's antique Singer and
the motor that was taken off it. It is written for agents (Claude, Codex) helping
her repair it, often while watching through the OBSBOT camera.

## How to read these files

Every fact is tagged with where it came from:

- **[source N]** — a numbered entry in [sources.md](sources.md)
- **[observed]** — seen on the camera on 2026-10-23
- **[inferred]** — reasoning from the above, not stated anywhere; verify before acting on it
- **[unverified]** — plausible but nothing confirms it yet

When the machine contradicts a document, trust the machine and update these files.

## Quick facts

| Item | Value | Confidence |
|---|---|---|
| Serial number | AB759762, read off the silver plate by Kristen | given |
| Model | **Singer 66** (full size, drop-in bobbin) | high: block AB713676–AB763675 was allotted to class 66 [source 1] |
| Serial allotment date | July 28, 1927 [source 1] | high; built on or after this, usually within a year or two [source 2] |
| Earlier labels | "15-91, 1934" and serial "AB769762" (a misread digit, which pointed to a model 128) | both **ruled out**, see [identity.md](identity.md) |
| Hook / bobbin | horizontal oscillating hook, drop-in **Class 66** bobbin [source 3] [source 4] | high |
| Needles | **15x1** (sold also as 130/705H, HAx1) [source 3] | high |
| Presser feet | low shank; early 66s are **back-clamping** (screw at the back of the foot), later ones side-clamping [source 3] [source 4] | high; check which this one has before buying feet |
| Reverse / drop feed | none: no reverse, feed dogs don't drop [source 4] | high |
| Motor | separate belt motor on an L-bracket, currently removed [observed] | see [motor.md](motor.md) |

## Files

| File | Use it when |
|---|---|
| [identity.md](identity.md) | confirming what the machine is, or someone says "15-91" again |
| [motor.md](motor.md) | anything about the removed motor: inspect, clean, brushes, wiring, refit |
| [troubleshooting.md](troubleshooting.md) | a symptom: won't run, slow, sparks, hums, skips stitches, thread nests |
| [sources.md](sources.md) | checking where a fact came from and how much to trust it |

## Camera presets (OBSBOT, set 2026-10-23)

The camera sits beside the machine on a small tripod. Use `camera_preset go <name>`:

| Preset | View |
|---|---|
| `sewing machine` | needle, presser foot and bed, seen from the pillar side |
| `motor` | the removed motor, its cord, and the L-bracket on the green towel |

If the camera is moved, these go stale: re-aim and re-save them.

## Open questions

1. Read the motor's data plate (model letters such as BR or BY, volts, amps).
   It decides brush size and parts. See [motor.md](motor.md).
2. Back-clamping or side-clamping presser foot? Decides which feet and
   attachments fit.
3. The serial is normally stamped into the bed; Kristen read it from a silver
   plate. Note where it is. ISMACS-linked guidance treats silver badges as a
   possible sign of a refinished machine [source 4].
4. What is the goal: clean and run, rewire, or full restoration?
