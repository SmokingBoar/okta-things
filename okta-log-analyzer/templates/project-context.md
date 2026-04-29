# Okta Log Analysis — Project Context

Build history, design decisions, improvement backlog, and investigation learnings. Update after each investigation.

---

## Project Purpose

Repeatable, policy-aware Okta log analysis for [YOUR_ORG]'s [YOUR_TEAM] team. Build baselines, detect anomalies, filter false positives, produce investigation reports, accumulate institutional knowledge.

---

## Build History

### Analysis Windows (30-day baseline / 9-day review)
Default windows. Configurable via intake. Middle period check strengthens anomaly significance.

### HTML Report Output
Self-contained HTML with inline CSS/JS. Five tabs. Shareable via email, Jira, or direct save.

### Rockstar Console for Data Export
Policies and network zones exported via Gabriel Sroka's Rockstar Console scripts. No API tokens or Python required.

---

## Improvement Backlog

### Tier 1 — High Impact
- **Post-investigation case close prompt** — auto-extract learnings and update knowledge files
- **Incident report generator (DOCX)** — formal document when findings escalate
- **Per-user false positive ledger** — prevent re-flagging verified patterns

### Tier 2 — Meaningful
- **Ticket integration** — formatted Jira/ServiceNow body from findings
- **Chat summary output** — 3–5 sentence summary for non-technical audience
- **User archetype baselines** — named reference profiles for comparison
- **DST-aware time conversion** — auto-detect UTC offset from log dates

### Tier 3 — Lower Priority
- **Admin action audit mode** — "what did the team do this week?"
- **Phone upgrade collision auto-detection** — pre-classify before escalating

---

## Investigation Learnings Log

| Date | User | Outcome | Key Lesson |
|---|---|---|---|
| *No investigations yet* | — | — | — |

---

## Known Environment Quirks

*Add as discovered through investigations.*

---

## File Inventory

| File | Purpose |
|---|---|
| `project-instructions.md` | System prompt (Project Instructions field) |
| `org-context.md` | Organization IPs, devices, policies, device management |
| `investigation-playbook.md` | Methodology, false positive checklist, known patterns |
| `okta-event-type-glossary.md` | Event type reference |
| `okta-policy-reference.md` | Policy reference from Rockstar Console export |
| `report-template.html` | HTML report format reference |
| `project-context.md` | This file |

---

## Revision History

| Date | Change | Author |
|---|---|---|
| [Date] | Initial creation | [Team] |
