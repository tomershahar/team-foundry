---
purpose: Named customers, personas, jobs-to-be-done, and direct quotes
read_when: When discussing what to build, why something matters, or who we're solving for
last_updated: 2026-04-25
---

# Customers

## Named customers (reference accounts)

**Mira Halonen — AP Lead, Kestrel Logistics (Helsinki, 180 employees)**
Last contact: 2026-04-11 (Sarah + Leo, 45-min session)
Their situation: 300–400 invoices/month across 12 vendors. Two AP staff. Month-end takes 3.5 days.
What they want: "I need to be confident the system caught the problem, not just that it processed the invoice. Right now I double-check everything because I've been burned twice."
What they're trying not to do: hire a third AP person. They see Clearline as the alternative.
Pain that's real: mismatched POs slip through when amounts are within a configurable tolerance — Mira doesn't trust the tolerance setting because she doesn't know how it was chosen.

**James Okafor — Finance Manager, Verdant Supply Co. (Dublin, 340 employees)**
Last contact: 2026-03-28 (Sarah, 30-min call)
Their situation: 600–700 invoices/month. Three AP staff. Controller reviews exceptions manually.
What they want: "The approvers are the bottleneck. Half the time they approve things without reading them because there are too many. I want the system to tell them what to look at, not show them everything."
What they're trying not to do: replace the approval process — they need the paper trail for audits.
Pain that's real: approval fatigue. Too many low-stakes invoices in the queue make high-stakes ones invisible.

**Taru Nieminen — CFO, Brightway Facilities (Tampere, 90 employees)**
Last contact: 2026-04-18 (Sarah, 20-min check-in)
Their situation: 150 invoices/month. One AP person (part-time). Taru reviews exceptions personally.
What they want: "I want to stop being in the loop for invoices under €500. I trust the AP process for those. I don't have time."
Pain that's real: no tiered approval by amount. Everything routes to the same queue.

## Personas

### AP Lead / AP Specialist
The person who lives in Clearline daily. Uploads invoices, monitors exceptions, manages vendor relationships. Measures success by whether month-end closes on time and whether the audit trail is clean.

Jobs to be done:
- Process invoices without missing anything important
- Explain exceptions to their manager without embarrassment
- Not get blamed when something slips through

Fears: being held responsible for an incorrect auto-approval. Will err on the side of manual review if trust isn't established.

### Finance Manager / Controller
Owns the approval workflow. Doesn't do data entry, but has to sign off on anything above a threshold and review exception patterns.

Jobs to be done:
- Have a defensible audit trail
- Spend as little time on low-risk approvals as possible
- Know when something unusual is happening before it becomes a problem

Direct quote (James Okafor): "I don't need to see more dashboards. I need one view that tells me what I actually need to do."

### CFO (at smaller customers)
Occasional user. Mostly cares that the process is working, not that they're personally in it.

Jobs to be done:
- Know the AP process is under control without being in it
- Not be surprised at month-end

## Segments we're not building for (yet)

- **Enterprise (1000+ employees):** Different procurement complexity, different approval governance. Our multi-approver workflow isn't there yet.
- **Accounting firms processing on behalf of clients:** Different trust model (they're a proxy, not the end user). Not our ICP.
