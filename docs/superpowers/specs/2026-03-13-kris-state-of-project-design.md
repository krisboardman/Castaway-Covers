# Spec: State-of-Project Document for Kris

## What This Is

A document Mike sends to Kris (Kristen) — the business owner who built the Castaway Covers site — to prep her for a working session. The document has two halves:

1. **Top half (Kris reads before the meeting):** Orients her on what Mike and Claude found, asks her to think about where she wants the business and site to go.
2. **Bottom half (agenda for the session):** What they'll do together — clarify her vision, walk the system diagram, prioritize what to work on.

The document also serves as input for future Claude sessions — when Kris and Mike sit down to work, they'll feed this (with Kris's answers) to Claude so it has context on what she cares about.

## Audience & Tone

**Reader:** Kris. She built the site herself. She knows how it works day-to-day but may not know about hidden failure modes in the code.

**Tone:** Warm, collaborative, respectful. This is not an audit report. It's a friend who knows tech saying "I took a look and I have some thoughts — let's talk." Kris should feel good about what she built, not defensive.

- Frame findings as observations, not verdicts
- "We noticed X — is this something you've seen?" not "X is broken"
- Business language first, technical footnotes where helpful
- No AI slop — human voice, concise, direct

## Document Structure

### Section 1: Opening

Short paragraph from Mike. Sets the frame:

- Your site is solid — customers are ordering custom covers through it
- I reviewed it with Claude's help to understand how everything fits together
- The goal is to make it easier to maintain and improve going forward
- This doc preps you for a conversation — no surprises, just thinking out loud together

Keep to 3-4 sentences. No bullet lists, no headers. Just a warm note.

### Section 2: Questions for You

5 open-ended questions for Kris to think about before the meeting. Not a quiz — prompts to surface what she cares about so the working session builds from her priorities.

1. What do you want the site to do for your business in the next year? (More orders? Fewer headaches? Expand product types? Stay the same but work better?)
2. Where do you spend the most time on stuff the site should be handling for you?
3. What do customers get confused by or ask you about most?
4. Is the measurement service something you want to grow, or is it a convenience for local customers?
5. Anything about the site that bugs you that you haven't had time to fix?

These are deliberately business questions, not tech questions. Her answers drive the priority conversation in the working session.

### Section 3: What We Found

Framed as "we looked at the site and the code — here are things we noticed that we'd love your take on."

Organized by the quality hierarchy from principles.md (measurement accuracy → order reliability → customer clarity → stability). The ordering itself communicates priority.

**Measurement accuracy:**
- No validation on measurement inputs — a customer can type 0 or 999 and nothing flags it. Is that intentional, or would guardrails help?
- The "Depth" label on chairs is ambiguous — does it mean seat depth or full chair depth? Customers might measure differently.
- Sofa measurements get swapped between what the customer sees and what arrives in Kris's email. The submit-order API explicitly relabels them. Has this caused confusion?

**Order reliability:**
- If the order email fails to send, the customer still sees "success" and the cart is cleared. The order isn't saved anywhere else. Has she ever had a customer say they ordered but she didn't get an email?
  - *Technical note: the submit-order API catches Resend errors but returns success:true regardless. No persistent record exists outside the email.*
- Order emails send from a Resend sandbox address (onboarding@resend.dev), not castawaycovers.com — could land in spam.
  - *Technical note: requires verifying castawaycovers.com in Resend and updating the sender address.*

**Customer clarity:**
- The nav says "Craftsmanship" but the URL is /features — minor naming mismatch
- Before calculating, the order summary shows empty parentheses and $0.00 — could look like something's broken
- Contact page button is blue while every other button on the site is teal

**Site stability:**
- Dead Shopify checkout code still lives in the codebase — it was abandoned but never removed. Not dangerous, but adds confusion if anyone touches the cart code.
- The Shopify variant lookup has no fallback — if a SKU isn't found, the customer hits a dead end with no way to proceed or contact support.

**Cleanup (aesthetics/polish and maintainability):**
- Some internal naming inconsistencies (e.g., the code calls a feature "magnets" but the site calls it "Split Cover with Snaps")
- A few pages exist but aren't documented

**Visual: System & Risk Map**

The risk-annotated diagram from `docs/site-risk-diagram.md` is rendered to a PNG image and embedded in the document. The image is also attached to the email for Kris to view in any client. The Mermaid source stays in the repo for future updates.

### Section 4: Working Session Agenda

What Mike and Kris do when they sit down together.

**1. Kris shares her vision (15-20 min)**
Walk through her answers to the section 2 questions. Mike listens, takes notes. The goal: capture what she wants the business and site to do, in her words.

**2. Walk the diagram together (10 min)**
Use the risk map as a visual anchor. Follow the customer path top to bottom. At each yellow/red node, pause: "Have you seen this cause a problem?" Some she'll confirm, some she'll dismiss, some might be an "oh, that explains it" moment.

**3. Prioritize together (15-20 min)**
Based on what she cares about and what the diagram surfaced, sort the issues:
- **Fix now** — things that could lose orders or confuse customers today
- **Fix soon** — things that create manual work or could bite later
- **Park it** — real issues but not worth time right now

**4. Next steps (5 min)**
What gets worked on first, who does what. Likely: Mike sets up Claude with the agreed priorities, Kris validates the measurement formulas against real production orders, and the first chunk of work begins.

## What This Document Is NOT

- Not a replacement for the framework docs (principles.md, architecture.md, etc.) — those remain the durable reference
- Not a task list or project plan — the working session produces that
- Not a technical audit report — it's a conversation starter

## Deliverable

A single markdown file that Mike emails to Kris (or renders to PDF). Written in Mike's voice, not Claude's. The risk diagram is rendered to PNG and embedded inline.

File location: `docs/kris-site-review.md`

## Success Criteria

- Kris reads it and feels informed, not judged
- She arrives at the working session with thoughts on her 5 questions
- The session produces a prioritized list of what to work on
- That list becomes input for Claude to begin work
