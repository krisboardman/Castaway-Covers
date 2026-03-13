# Castaway Covers — System & Risk Map

```mermaid
flowchart TD
    Customer([Customer arrives])

    Customer --> Design["/design\nPick furniture type"]
    Customer --> MeasService["/measurement-service\nBook in-home visit"]

    %% ── Self-measure path ──
    Design --> Measure["/products/[type]\nEnter measurements"]
    Measure --> NoValidation["⚠️ No input validation\nAny number accepted — no warnings"]:::warning
    NoValidation --> Calc["Calculator: yards, SKU, price"]
    Calc --> PriceFallback["⚠️ If Shopify price missing\n$45/yard hardcode kicks in"]:::warning
    Calc --> Lookup{"Shopify\nvariant lookup"}

    Lookup -->|"found"| Configure["Pick color, add-ons, quantity\nConfirm measurements ☑"]
    Lookup -->|"not found"| Dead1["⛔ DEAD END\nAlert fires, buttons disabled\nNo fallback, no contact-us"]:::danger

    Configure --> Cart["/cart — Review & checkout"]

    %% ── Dead checkout path ──
    Cart -.->|"dead code in codebase\nnever reached"| DeadCheckout["Shopify checkout\n4 methods, API v2024-01\nAll behind hardcoded flag"]:::dead

    Cart --> Form["Submit: name, email,\nphone, photos"]

    %% ── Measurement service path ──
    MeasService --> Formspree["Formspree\nSeparate service + credentials"]
    Formspree --> KrisVisit["Kris visits home\nmeasures furniture"]
    KrisVisit --> Form

    %% ── Order submission ──
    Form --> Submit["/api/submit-order"]
    Submit --> LabelSwap["⚠️ Sofa orders: Width↔Length\nswapped in email vs. site"]:::warning

    Submit --> Resend{"Resend sends\n2 emails"}

    Resend -->|"works"| Emails["📧 Order → Kris\n📧 Confirm → Customer"]
    Resend -->|"fails SILENTLY"| Lost["⛔ ORDER LOST\nReturns success, clears cart\nNo database, no log, nothing"]:::danger

    Emails --> Spam["⚠️ Sends from sandbox domain\nonboarding@resend.dev\nMay land in spam"]:::warning

    Emails --> Kris["Kris reviews order"]
    Kris --> Stripe["Kris sends Stripe\ninvoice manually"]
    Stripe --> Sew["Cuts & sews cover"]
    Sew --> Ship(["📦 Ship to customer"]):::good

    %% ── Shopify ──
    Lookup <-.-> Shopify[("Shopify\ncatalog only\nNOT payment")]

    %% ── Styles ──
    classDef danger fill:#fee2e2,stroke:#dc2626,color:#991b1b
    classDef warning fill:#fef3c7,stroke:#d97706,color:#92400e
    classDef dead fill:#f3f4f6,stroke:#9ca3af,color:#6b7280,stroke-dasharray: 5 5
    classDef good fill:#d1fae5,stroke:#059669,color:#065f46
```

**Legend**
- 🟡 Yellow = potential issue — needs Kris's confirmation
- 🔴 Red = failure mode with no recovery
- ⬜ Gray dashed = dead code (exists but never runs)
- 🟢 Green = happy ending
