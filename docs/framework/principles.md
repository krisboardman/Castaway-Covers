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
