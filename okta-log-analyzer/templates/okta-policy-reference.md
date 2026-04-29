# [YOUR_ORG] — Okta Policy Reference

All Okta policy types with rules, exported via Rockstar Console. Single authoritative reference for investigations.

<!-- Generated from Rockstar Console export. The Setup Wizard populates this automatically.
     If filling manually, export policies using scripts/rockstar-export-policies.js,
     then organize and add investigation notes per section. -->

**How policies interact:**
1. **MFA Enrollment (MFA_ENROLL)** — which authenticators a user can enroll
2. **Sign-On (OKTA_SIGN_ON)** — session lifetime and MFA at the Okta session level
3. **Access (ACCESS_POLICY)** — per-app MFA and re-auth frequency
4. **Password (PASSWORD)** — self-service reset and unlock

All policies evaluate top-down by priority. First matching policy applies.

**Duration key:** PT0S = every attempt · PT1H = 1hr · PT6H = 6hr · PT8H = 8hr · PT12H = 12hr · PT24H = 24hr · PT168H = 7 days · PT43800H = ~5 years

---

## Part 1 — MFA Enrollment Policies

<!-- For each policy, document: name, status, priority, WebAuthn status, Okta Verify status, group constraints -->

| Pri | Policy | Status | WebAuthn | Okta Verify | Key Constraint |
|---|---|---|---|---|---|
| | [Populate from export] | | | | |

**WebAuthn / FIDO2 / PKeyAuth severity check:**
- **Permitted (OPTIONAL):** [List policies]
- **NOT_ALLOWED:** [List policies]
- PKeyAuth in a NOT_ALLOWED group → **policy violation → HIGH**
- PKeyAuth in a permitted group → **MEDIUM, verify intent**

---

## Part 2 — Sign-On / Global Session Policies

<!-- For each policy: name, priority, status, group, then rules table with
     network conditions, MFA requirements, session idle/lifetime.
     Add investigation notes explaining log behavior. -->

[Populate from export]

---

## Part 3 — Access Policies (Per-Application)

<!-- For each app policy: name, ID, rules with action, auth requirements, re-auth interval.
     Note catch-all behavior (ALLOW vs DENY) and any unexpectedly weak configurations. -->

[Populate from export]

---

## Part 4 — Password Policies

<!-- Document SSPR access, password change, self-service unlock per rule. -->

[Populate from export]

---

## Part 5 — Policy Interaction Summary

<!-- 2-4 user archetypes showing combined policy experience -->

### Standard Employee
- **Enrollment:** [authenticators available]
- **Session:** [MFA frequency, session length]
- **Standard apps:** [requirements]
- **Sensitive apps:** [requirements]

---

## Part 6 — Rule Names Seen in Logs

| Rule Name in Log | Parent Policy | Meaning |
|---|---|---|
| [Populate from log data after first investigation] | | |

---

## Revision History

| Date | Change | Author |
|---|---|---|
| [Date] | Initial creation from Rockstar Console export | [Team] |
