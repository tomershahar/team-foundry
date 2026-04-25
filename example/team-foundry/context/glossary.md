---
purpose: Domain terms and acronyms — what words mean specifically in Clearline's context
read_when: When writing specs, reviewing copy, or any time a term might be ambiguous
last_updated: 2026-04-25
owner: Sarah
---

# Glossary

*Words that would confuse an outsider, or that our team uses in a specific way that differs from industry-standard usage.*

## Core terms

**Invoice** — in Clearline, always a vendor invoice (a bill sent to the customer by a supplier). Never a sales invoice (a bill we send to our customers). If we mean a sales invoice, we say "Clearline invoice" or "subscription invoice."

**Auto-approval** — an invoice that Clearline approves without a human reviewing and explicitly approving it. Requires the invoice to match a configured approval rule (vendor, amount range, PO match). Auto-approved invoices still appear in the approval log for audit purposes.

**Exception** — any flag raised by Clearline on an invoice that requires human review before the invoice can proceed. Exceptions are not errors. They are signals. An invoice with an exception is not broken — it's paused pending review.

**Tolerance** — a configurable percentage or fixed amount by which an invoice can differ from its matched PO without triggering an exception. E.g., a 2% tolerance means an invoice €100 above a €5,000 PO would auto-approve. Customers frequently misunderstand what tolerance applies to — always specify: tolerance on amount, or tolerance on quantity?

**AP** — Accounts Payable. The function (and team role) responsible for processing vendor invoices and managing vendor payments. When we say "AP Lead," we mean the person who works in Clearline daily.

**PO** — Purchase Order. A document issued by the customer to a vendor committing to a purchase. Invoices are typically matched against POs to verify the purchase was authorized.

**Three-way match** — the process of matching an invoice against both a PO and a goods receipt note (confirming delivery) before approving. Clearline currently does two-way match (invoice vs. PO). Three-way match is a roadmap item.

**Posting** — when an approved invoice is written to the accounting system (ERP) as a liability. In Clearline: the final step of the invoice workflow. An invoice that is approved but not posted is still "in flight."

## Internal shorthand

**NSM** — North Star Metric. Always refers to "% of invoices processed without manual intervention" unless explicitly stated otherwise.

**TTFAA** — Time-to-first-auto-approval. Defined in `data/metrics.md`.

**Design partner** — a customer we're working with closely on a specific feature, sharing designs and getting feedback before general availability. Currently: Kestrel Logistics (Mira) for exception UI v2.

**The trio** — Sarah, Marcus, Leo. The three-person leadership team for Clearline. Not to be confused with the full team (8 people).

## Terms we use inconsistently (known issues)

**"User" vs. "customer"** — in the codebase, "user" is a database entity (an individual login). In product conversations, "customer" usually means the company (the account), not the individual. We sometimes say "user" when we mean "customer account" — this causes confusion. When in doubt: "user" = individual login, "customer" = the company.

**"Dashboard"** — we have three different things called "dashboard" in different contexts (the invoice overview, the analytics view, and the approval queue). We're working on renaming these. Do not use "dashboard" in specs without specifying which one.
