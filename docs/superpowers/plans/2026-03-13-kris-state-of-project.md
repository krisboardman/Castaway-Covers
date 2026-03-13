# Kris State-of-Project Document — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write a document Mike sends to Kris that preps her for a working session on the site's state and priorities.

**Architecture:** Single markdown file (`docs/kris-site-review.md`) with four sections: opening, questions, findings, and session agenda. Risk diagram PNG embedded inline. Written in Mike's voice — warm, direct, no AI slop.

**Tech Stack:** Markdown. Mermaid → PNG for diagram.

**Spec:** `docs/superpowers/specs/2026-03-13-kris-state-of-project-design.md`

---

## Chunk 1: Write the Document

### Task 1: Render the risk diagram to PNG

**Files:**
- Source: `docs/site-risk-diagram.md` (exists — contains Mermaid source)
- Create: `docs/images/site-risk-diagram.png`

- [ ] **Step 1: Install mmdc (Mermaid CLI) if not available**

Run: `npx @mermaid-js/mermaid-cli --version`

If not found: `npm install -g @mermaid-js/mermaid-cli`

Note: If mmdc cannot be installed or the Mermaid has syntax issues, Mike already has a rendered PNG from mermaid.ai. Use that instead — copy it to `docs/images/site-risk-diagram.png`. Mike's rendered version is at `/Users/mikeedwards/Downloads/Customer Order Fulfillment-2026-03-13-121029.png`.

- [ ] **Step 2: Extract the Mermaid block and render**

```bash
# Extract mermaid block from the markdown file
sed -n '/```mermaid/,/```/p' docs/site-risk-diagram.md | sed '1d;$d' > /tmp/risk-diagram.mmd
# Render to PNG
mmdc -i /tmp/risk-diagram.mmd -o docs/images/site-risk-diagram.png -w 1200
```

If mmdc fails on syntax, fall back to Mike's screenshot:
```bash
mkdir -p docs/images
cp "/Users/mikeedwards/Downloads/Customer Order Fulfillment-2026-03-13-121029.png" docs/images/site-risk-diagram.png
```

- [ ] **Step 3: Verify the PNG exists and is reasonable**

Run: `ls -la docs/images/site-risk-diagram.png`
Expected: File exists, size > 10KB

---

### Task 2: Write Section 1 — Opening

**Files:**
- Create: `docs/kris-site-review.md`

- [ ] **Step 1: Write the opening**

Write the full file starting with Section 1. This is Mike's voice — 3-4 sentences, no bullet lists, no headers. Warm note that frames the purpose.

Tone guide (from spec):
- Your site is solid — customers are ordering custom covers through it
- I reviewed it with Claude's help to understand how everything fits together
- The goal is to make it easier to maintain and improve going forward
- This doc preps you for a conversation — no surprises, just thinking out loud together

**Critical:** Do NOT write this in AI assistant voice. Write it like Mike is writing an email to a friend. Short sentences. Casual. No corporate language. No "I'd like to share some findings" — more like "I took a look under the hood."

- [ ] **Step 2: Review the opening against tone criteria**

Read it back. Check:
- Does it sound like a person wrote it? (not "I wanted to take a moment to...")
- Is it under 5 sentences?
- Does it make Kris feel good about what she built?
- Does it set up what's coming without making it sound scary?

---

### Task 3: Write Section 2 — Questions for You

**Files:**
- Modify: `docs/kris-site-review.md`

- [ ] **Step 1: Add the questions section**

5 questions, exactly as specified:

1. What do you want the site to do for your business in the next year? (More orders? Fewer headaches? Expand product types? Stay the same but work better?)
2. Where do you spend the most time on stuff the site should be handling for you?
3. What do customers get confused by or ask you about most?
4. Is the measurement service something you want to grow, or is it a convenience for local customers?
5. Anything about the site that bugs you that you haven't had time to fix?

Frame with a short intro line — something like "Before we sit down, I'd love you to think about a few things." Not "Please consider the following questions."

- [ ] **Step 2: Verify questions are business-language only**

No question should reference code, files, APIs, or technical systems. All 5 should be answerable by someone who thinks about covers, customers, and orders — not someone who thinks about TypeScript and Zustand.

---

### Task 4: Write Section 3 — What We Found

**Files:**
- Modify: `docs/kris-site-review.md`

- [ ] **Step 1: Write the section intro**

One or two sentences framing this as observations, not verdicts. Something like: "Here's what stood out when we looked at the site and the code. Some of this you probably already know. Some might be new. We'd love your take on what actually matters."

- [ ] **Step 2: Write Measurement Accuracy findings**

Three items from spec. Each one:
- Business-language description of what we noticed
- Question to Kris ("Is this something you've seen?", "Has this caused problems?")
- Technical footnote in italics only where it adds value (not on every item)

Items:
1. No measurement validation — any number accepted
2. Chair "Depth" label ambiguity
3. Sofa measurement label swap between site and email

- [ ] **Step 3: Write Order Reliability findings**

Two items from spec:
1. Silent email failure — customer sees success, order could be lost
   - Include technical footnote (this one needs it — "the system catches the error but reports success anyway")
2. Sandbox email domain — emails might hit spam
   - Include technical footnote (straightforward fix, worth noting)

- [ ] **Step 4: Write Customer Clarity findings**

Three items from spec:
1. "Craftsmanship" vs "/features" naming mismatch
2. Empty parentheses in order summary before calculation
3. Contact page blue button vs. site teal

These are lighter — don't need technical footnotes. Keep them brief.

- [ ] **Step 5: Write Site Stability findings**

Two items from spec:
1. Dead Shopify checkout code in codebase
2. Variant lookup dead end — no fallback for customers

- [ ] **Step 6: Write Cleanup findings**

Two items from spec:
1. "magnets" vs "Split Cover with Snaps" naming
2. Undocumented pages

- [ ] **Step 7: Embed the risk diagram**

Add the PNG image inline:
```markdown
![Castaway Covers — System & Risk Map](images/site-risk-diagram.png)
```

Add a brief note: "This shows the full path a customer takes from landing on the site to receiving a cover. Yellow flags are things we want your take on. Red flags are spots where something could silently go wrong."

Add the legend:
- Yellow = potential issue — needs your confirmation
- Red = failure mode with no recovery
- Gray dashed = dead code (exists but never runs)
- Green = happy ending

- [ ] **Step 8: Read the full section back for tone**

Check every finding against the tone criteria:
- Is it framed as an observation + question, not a verdict?
- Would Kris feel defensive reading this? If yes, rewrite.
- Is business language leading, with tech as footnotes only?
- Does the priority ordering (measurement → reliability → clarity → stability → cleanup) feel natural?

---

### Task 5: Write Section 4 — Working Session Agenda

**Files:**
- Modify: `docs/kris-site-review.md`

- [ ] **Step 1: Write the agenda**

Four parts with time estimates:

1. **Your vision (15-20 min)** — Walk through your answers to the questions above. I'll take notes.
2. **Walk the diagram (10 min)** — Follow the customer path together. At each flag, you tell me if it's a real problem or not.
3. **Prioritize (15-20 min)** — Sort everything into: fix now / fix soon / park it.
4. **Next steps (5 min)** — Who does what. I'll set up Claude with what we agree on, you validate the measurement formulas against real orders you've filled.

Frame with a short intro: "Here's what I'm thinking for when we sit down."

- [ ] **Step 2: Verify the agenda is actionable**

Each agenda item should make clear: what Kris does, what Mike does, and what the output is. No vague "discuss the findings" — specific actions with specific outputs.

---

### Task 6: Final review and commit

**Files:**
- Review: `docs/kris-site-review.md`
- Review: `docs/images/site-risk-diagram.png`

- [ ] **Step 1: Full document read-through**

Read `docs/kris-site-review.md` top to bottom. Check:
- Does it flow naturally from opening → questions → findings → agenda?
- Is it under 2 pages when rendered? (This is an email, not a report)
- Does every sentence sound like Mike, not Claude?
- Is the diagram reference working (relative path correct)?
- No orphaned technical jargon outside of footnotes?

- [ ] **Step 2: Verify against spec success criteria**

From the spec:
- [ ] Kris would feel informed, not judged
- [ ] The 5 questions are clear and answerable
- [ ] The findings are framed as observations + questions
- [ ] The session agenda has clear structure and outputs
- [ ] The risk diagram is embedded and legible

- [ ] **Step 3: Commit**

```bash
git add docs/kris-site-review.md docs/images/site-risk-diagram.png
git commit -m "Add state-of-project document for Kris working session"
```
