# Okta Log Analyzer

A repeatable, policy-aware workflow for analyzing Okta system log exports using a Claude AI Project. Builds user behavioral baselines, identifies authentication anomalies, applies organization-specific false positive filters, and produces shareable HTML investigation reports.

## What This Is

This is an **AI-powered investigation assistant** built as a [Claude Project](https://support.anthropic.com/en/articles/9517075-what-are-projects). You upload Okta system log CSVs, and the Project:

1. Builds a behavioral baseline from the first 30 days of the log
2. Compares a review window against that baseline
3. Applies your organization's known-good patterns before flagging anything
4. Cross-references behavior against your actual Okta policy configurations
5. Produces a self-contained HTML report suitable for Jira tickets, email, or presentations

The key value is **reducing false positives**. Generic SIEM rules flag every new IP and every MFA failure. This Project knows your VPN exit nodes, your corporate proxy IPs, your password rotation schedule, and your enrollment policies — so it only surfaces what actually matters.

## What's Included

```
├── README.md                            # This file
├── SETUP-GUIDE.md                       # Step-by-step instructions
├── LICENSE                              # MIT License
├── templates/
│   ├── setup-wizard-instructions.md     # Upload to a Claude Project → it walks you through setup
│   ├── project-instructions.md          # Template for the investigation Project system prompt
│   ├── org-context.md                   # Template for your org's environment context
│   ├── okta-policy-reference.md         # Template for your Okta policies (generated from export)
│   ├── okta-event-type-glossary.md      # Event type reference (mostly universal)
│   ├── investigation-playbook.md        # Methodology, false positive checklist, known patterns
│   ├── report-template.html             # Reference HTML report showing expected output format
│   └── project-context.md              # Build history, backlog, learnings — grows over time
├── scripts/
│   ├── rockstar-export-policies.js      # Rockstar Console script to export Okta policies
│   └── rockstar-export-network-zones.js # Rockstar Console script to export Okta network zones
├── examples/
│   └── sample-org-context.md            # Example with fictional data
└── .github/
    └── CONTRIBUTING.md                  # Contribution guidelines
```

## Quick Start

### Prerequisites

- A [Claude Pro, Team, or Enterprise](https://claude.ai) account with Projects access
- Okta admin console access (read-only is fine)
- The [Rockstar browser extension](https://gabrielsroka.github.io/rockstar/) or access to the [Rockstar Console](https://gabrielsroka.github.io/console/) by Gabriel Sroka

### Two Ways to Set Up

#### Option A: Setup Wizard (Recommended, ~30 minutes)

The easiest way. A Claude Project walks you through everything interactively:

1. Create a new Claude Project
2. Paste the contents of `templates/setup-wizard-instructions.md` into the Project Instructions field
3. Start a conversation — the wizard will guide you through exporting your Okta data and generating all the files you need
4. Once the wizard generates your files, create a second Project for actual investigations using those files

#### Option B: Manual Setup (~45–60 minutes)

If you prefer to fill in templates yourself:

1. **Export Okta policies** — Run `scripts/rockstar-export-policies.js` in the Rockstar Console
2. **Fill in org context** — Copy `templates/org-context.md` and populate with your environment details
3. **Create a Claude Project** — Paste `templates/project-instructions.md` into Project Instructions
4. **Upload knowledge files** — Add the completed files as Project knowledge

See **[SETUP-GUIDE.md](SETUP-GUIDE.md)** for detailed manual instructions.

## How It Works

### The Analysis Workflow

Every investigation follows the same methodology:

1. **Intake** — Structured questions: who, what triggered it, and what context you have
2. **Log coverage check** — Validates the log covers your full password rotation cycle
3. **Baseline** — Quantifies normal: sessions/day, MFA/day, IPs, device fingerprints, SSO targets
4. **Deviation detection** — Compares review window against baseline on every dimension
5. **False positive filtering** — Applies your org-specific checklist before surfacing any finding
6. **Device correlation** — Fingerprints via Okta Verify UUIDs, MDM agent UAs, browser heuristics
7. **Report generation** — Tabbed HTML report with findings, timeline, and recommended actions

### What Makes It Different from a SIEM Rule

| SIEM Alert | This Project |
|---|---|
| "New IP detected" | "New IP — but it's a VPN exit node, geolocation is meaningless" |
| "MFA failure" | "13 abandoned MFA pushes in 40 min — but coincides with password expiry + phone upgrade" |
| "New device" | "New device notification from Chrome auto-update 143→144 on same machine — false positive" |
| "Unmanaged device" | Knows whether your org uses device management — ignores `managed: false` when appropriate |

### Report Output

Five-tab HTML report: Overview, Baseline vs. Review, Findings, Timeline, Actions. Self-contained (inline CSS/JS, no dependencies) — save locally, email, or attach to tickets.

## Tools Used

### Rockstar Browser Extension

[gabrielsroka.github.io/rockstar](https://gabrielsroka.github.io/rockstar/)

A browser extension by Gabriel Sroka that adds powerful features to the Okta admin console. Used in this project for:
- Exporting user device inventories
- Quick access to API data that isn't in the admin console UI

### Rockstar Console

[gabrielsroka.github.io/console](https://gabrielsroka.github.io/console/)

A browser-based JavaScript console for the Okta API. Used in this project for:
- Exporting all policies, rules, conditions, and settings
- Exporting network zones
- Any custom API queries needed during setup

Both tools are read-only — they don't modify your Okta instance.

## Customization

| File | What to Customize |
|---|---|
| `org-context.md` | Your IPs, VPN config, device patterns, password policy |
| `okta-policy-reference.md` | Generated from your Okta instance via Rockstar Console |
| `project-instructions.md` | Intake questions, severity thresholds, output format |
| `investigation-playbook.md` | Your known patterns and completed investigation summaries |
| `project-context.md` | Your design decisions and improvement backlog |

## Limitations

- **Not real-time** — analyzes exported CSV logs, not live streams. For investigations, not alerting.
- **Claude context window** — very large logs may need pre-filtering. The Project focuses on auth-relevant events.
- **No automated remediation** — produces findings and recommendations; a human decides what to do.
- **Policy accuracy depends on your export** — re-export quarterly or after significant changes.

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). Contributions welcome for: additional known patterns, event type documentation, report template improvements, and alternative VPN configurations.

## License

MIT — see [LICENSE](LICENSE).
