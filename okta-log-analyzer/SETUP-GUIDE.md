# Setup Guide

This guide walks you through configuring the Okta Log Analyzer for your organization.

---

## Two Setup Paths

### Path A: Setup Wizard (Recommended)

The fastest way. A Claude Project interviews you, parses your Okta exports, and generates all the files automatically.

**Time:** ~30 minutes
**What you need:** Okta admin access + Rockstar extension or Console

1. Create a new Claude Project (any name — "Okta Setup Wizard" works)
2. Paste the contents of `templates/setup-wizard-instructions.md` into the **Project Instructions** field
3. Start a conversation — the wizard walks you through everything:
   - Exports your Okta policies via Rockstar Console script
   - Optionally exports your network zones (VPN IPs, proxy ranges)
   - Asks about your VPN, password policy, device management, and team
   - Generates all 7 knowledge files customized for your organization
4. Download the generated files
5. Create a **second** Claude Project for actual investigations
6. Paste `project-instructions.md` into Project Instructions, upload the other 6 files as knowledge

You're done. Upload an Okta system log CSV and start investigating.

### Path B: Manual Setup

Fill in templates yourself using the guidance below.

**Time:** ~45–60 minutes
**What you need:** Okta admin access + Rockstar extension or Console + a text editor

---

## Prerequisites (Both Paths)

**Claude access:**
- Claude Pro, Team, or Enterprise account with Projects

**Okta access:**
- Okta admin console access (read-only is sufficient)

**Rockstar tools (one of these):**
- **Rockstar Browser Extension** — [Install from here](https://gabrielsroka.github.io/rockstar/). Works in Chrome and Edge. Click the Rockstar icon while on your Okta admin console to access features.
- **Rockstar Console** — [Open here](https://gabrielsroka.github.io/console/). A standalone browser-based console for Okta API queries.

Both tools are by [Gabriel Sroka](https://gabrielsroka.github.io/) and are read-only — they don't modify your Okta instance.

---

## Manual Setup Steps

### 1. Export Your Okta Policies

The policy reference is the backbone of the analysis — it tells the Project which authenticators are permitted, what MFA behavior to expect, and what session lifetimes are normal.

1. Open the Rockstar Console (or click Rockstar extension icon → Console)
2. **Navigate to Applications → Self-Service** in the Okta admin console first — this avoids Content Security Policy errors (the old Directory → People page now blocks the console)
3. Copy the contents of `scripts/rockstar-export-policies.js` and paste into the console
4. Press Enter and wait for it to finish
5. Click **"Export Full JSON"** (preferred) or "Export CSV"

JSON is recommended because it matches the native Okta API shape — policies grouped by type with rules nested under each policy, and conditions/settings/actions preserved as native JSON objects (not stringified).

### 2. Export Your Network Zones (Optional but Recommended)

Network zones define which IPs are "corporate" vs. "external." Exporting them lets the analyzer automatically identify VPN, proxy, and trusted IPs.

1. In the Rockstar Console, paste the contents of `scripts/rockstar-export-network-zones.js`
2. Press Enter
3. Click **"Export JSON"**

If you skip this step, you'll need to manually document your VPN and proxy IPs in the org-context file.

### 3. Get Device Information via Rockstar Extension

The Rockstar extension can show you a user's enrolled Okta devices directly in the admin console. To document your standard device patterns:

1. With the Rockstar extension installed, navigate to a user's profile in the Okta admin console
2. Rockstar adds extra UI showing the user's devices, factors, and other details
3. Note the user agent patterns, device models, and Okta Verify versions you see

This helps you fill in the "Standard Device Patterns" section of the org-context file.

### 4. Fill In Your Organization Context

Copy `templates/org-context.md` and fill in each section:

- **VPN configuration** — Your VPN type and exit IP ranges
- **Corporate proxy IPs** — IPs Okta sees when users are on your corporate network
- **Password policy** — Rotation period (e.g., 90 days) or "no expiration"
- **Device management status** — Whether Okta device management is deployed, and for which device types
- **Standard device patterns** — Expected user agent strings for your MDM, Okta Verify, and browsers
- **Known SSO targets** — Standard apps accessed through Okta
- **Team reference** — IAM/security team members whose admin actions appear in logs

See `examples/sample-org-context.md` for a completed example with fictional data.

### 5. Generate Your Policy Reference

Using the policy export from Step 1, populate `templates/okta-policy-reference.md`:

- Organize policies by type (Enrollment, Sign-On, Access, Password)
- For each policy, document the rules, conditions, and actions
- Add investigation notes explaining what each policy means in practice
- Build the WebAuthn/PKeyAuth severity check from your enrollment policies
- Create the "Rule Names Seen in Logs" mapping table

This is the most time-intensive step. The Setup Wizard (Path A) automates it entirely.

### 6. Create the Claude Project

1. Go to [claude.ai](https://claude.ai) → Projects → Create Project
2. Name it (e.g., "Okta Log Analyzer")
3. Paste your customized `project-instructions.md` into **Project Instructions**
4. Upload these files as **Project Knowledge**:
   - `org-context.md`
   - `okta-policy-reference.md`
   - `okta-event-type-glossary.md`
   - `investigation-playbook.md`
   - `report-template.html`
   - `project-context.md`

### 7. Verify It Works

Start a conversation. The Project should ask:

> "What would you like to do today?"
> - Analysis / Improvement / Question

Try: "What is our password rotation policy?" — it should answer from your org-context file.

---

## First Investigation Tips

- Export a system log covering your full password rotation cycle (e.g., 90 days) filtered to one user
- The first run will likely surface some patterns you haven't documented yet — update knowledge files as you learn
- After each closed investigation, add a summary to the playbook's investigation reference section

---

## Ongoing Maintenance

- **After each investigation:** Add learnings to `investigation-playbook.md` and `project-context.md`
- **Quarterly:** Re-export Okta policies via Rockstar Console (policies drift)
- **When VPN changes:** Update the IP ranges in `org-context.md`
- **When team changes:** Update the team reference section
