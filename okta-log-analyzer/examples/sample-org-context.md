# Acme Corp — Okta Environment Context (EXAMPLE)

<!-- THIS IS AN EXAMPLE with fictional data showing what a completed file looks like. -->

---

## VPN / Secure Web Gateway

Acme Corp uses **Zscaler Internet Access (ZIA)** as its enterprise secure web gateway.

**What this means for log analysis:**
User traffic exits from Zscaler ZEN (enforcement nodes) in various data centers. IPs geolocate to Zscaler infrastructure — not user locations. A user in Chicago may appear as connecting from Dallas.

**VPN exit IP ranges:**

| CIDR Range | Notes |
|---|---|
| `165.225.0.0/17` | Primary Zscaler egress |
| `104.129.192.0/20` | Secondary range |
| `136.226.0.0/16` | Zscaler cloud range |

**VPN exit cities observed in Okta logs:**

| IP Address | Okta Geolocation | Notes |
|---|---|---|
| `165.225.112.40` | Dallas, TX | Zscaler ZEN — Dallas DC |
| `136.226.33.17` | Atlanta, GA | Zscaler ZEN — Atlanta DC |

---

## Network Infrastructure

### Primary Corporate Proxy / Egress

| IP Address | Okta Geolocation | Notes |
|---|---|---|
| `198.51.100.25` | Chicago, IL | Primary corporate egress. Acme HQ is in Chicago. |

---

## Okta Device Management Status

**Device management is deployed for COMPUTERS ONLY at Acme Corp.**

- [x] macOS (via Jamf Pro)
- [x] Windows (via Microsoft Intune)
- [ ] iOS — NOT managed
- [ ] Android — NOT managed

Implications:
- `managed: false` on Mac or Windows → **MEDIUM signal** — may be personal device
- `managed: false` on phone → **Always expected** — never flag
- `managed: true` → confirmed corporate-enrolled device

---

## Standard Device Patterns

### Corporate Mac (Jamf-managed)
- **UA:** `Jamf Connect/2.38 CFNetwork/macOS/15.x Darwin/24.x.0`
- **Notes:** Build `2.38` is standard. Darwin version increments with macOS updates.

### Corporate Windows (Intune-managed)
- **UA:** `Mozilla/5.0 (Windows NT 10.0; Win64; x64) ... Edg/12x.0.0.0`
- **Notes:** Edge is default browser. Version bumps are auto-updates.

### iPhone (Okta Verify)
- **UA:** `B7F62B65BN.com.okta.mobile/9.x.x OktaDeviceSDK/0.0.1 iOS/18.x Apple/iPhone16,x [UUID]`
- **Notes:** UUID persistent. All iPhones `managed: false` by design.

---

## Password Policy
- **Rotation:** 90 days (AD)
- **SSPR:** Enabled only during lockout

## Known SSO Targets
Workday, Office 365, Salesforce, Jira, ServiceNow, Slack, Tableau

## Team Reference
- Sarah Chen — IAM Lead
- Marcus Williams — IAM Engineer

---

## Revision History

| Date | Change | Author |
|---|---|---|
| 2026-03-11 | Example file | Template |
