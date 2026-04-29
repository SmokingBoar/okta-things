# [YOUR_ORG] — Okta Environment Context

This file documents organization-specific known-good patterns, infrastructure details, and organizational context for use in authentication log analysis. Update this file as new verified context is established.

<!-- ============================================================
     INSTRUCTIONS: Fill in every section below.
     The Setup Wizard (setup-wizard-instructions.md) can generate
     this file automatically from your Okta exports and answers.
     
     If filling in manually, see SETUP-GUIDE.md for guidance.
     ============================================================ -->

---

## VPN / Secure Web Gateway

<!-- Replace with your VPN solution. Common options:
     Zscaler (ZIA/ZPA), Palo Alto GlobalProtect/Prisma Access,
     Cisco AnyConnect/Secure Client, Netskope, Cloudflare WARP,
     or "No VPN — direct connection"
-->

[YOUR_ORG] uses **[VPN_PRODUCT_NAME]** as its enterprise VPN / secure web gateway.

**What this means for log analysis:**
<!-- Describe how your VPN affects what Okta sees. Key points:
     - User IPs resolve to VPN exit nodes, not their physical location
     - Geolocations in Okta logs will show VPN data center cities
     - Split-tunnel: some traffic may bypass VPN
-->

[Describe VPN behavior]

**VPN exit IP ranges:**

<!-- These come from your network zone export, VPN admin console,
     or your network team. -->

| CIDR Range | Notes |
|---|---|
| `[RANGE_1]` | [Description — e.g., "US-East exit nodes"] |
| `[RANGE_2]` | [Description] |

**Key rule:** Before flagging an IP as suspicious, check whether it falls within these ranges. If it does, the geolocation is a VPN infrastructure city, not the user's actual location.

**VPN exit cities observed in Okta logs:**

<!-- These are the cities Okta shows for your VPN exit IPs.
     They are VPN data center locations, NOT user locations. -->

| IP Address | Okta Geolocation | Notes |
|---|---|---|
| `[IP]` | [City, State] | VPN exit node — [VPN_PRODUCT_NAME] [datacenter/PoP] |

---

## Network Infrastructure

### Primary Corporate Proxy / Egress

<!-- The IP(s) Okta sees when users are on your corporate network.
     From your network zone export or: curl ifconfig.me from a corporate machine. -->

| IP Address | Okta Geolocation | Notes |
|---|---|---|
| `[PROXY_IP]` | [City, State] | Primary corporate egress. [Note if geolocation doesn't match HQ.] |

### Other Known-Good IPs

<!-- Grows over time as you verify IPs through investigations. -->

| IP Address | Okta Geolocation | Notes |
|---|---|---|
| | | |

---

## Okta Device Management Status

<!-- THIS SECTION IS CRITICAL. It determines how the analyzer interprets
     the `managed` field on Okta device records.
     
     Choose the option that matches your environment and DELETE the others. -->

<!-- ===== OPTION A: Device management NOT deployed ===== -->

**Device management is NOT currently deployed at [YOUR_ORG].**

Implications for investigation work:

- The `managed` field on any Okta device record will be `false` for ALL users and ALL device types — this is expected and should **never** be treated as a finding or anomaly
- `deviceBound: REQUIRED` constraints in access policies cannot be enforced at the platform level
- Do not use "unmanaged device" as a severity label — it is meaningless in this environment
- When device management is deployed in the future, update this section

**Device anomaly detection approach:**
- For phones: Focus on UUID changes (new physical device) and unexpected auth methods (Safari vs. Okta app) — not managed status
- For computers: MDM agent presence in the user agent string (e.g., Jamf Connect, Intune compliance) is the practical indicator of a corporate device, not the Okta managed flag

<!-- ===== OPTION B: Device management IS deployed (computers only) ===== -->

<!--
**Device management is deployed for COMPUTERS ONLY at [YOUR_ORG].**

Managed device types:
- [x] macOS (via [Jamf/Mosyle/Kandji])
- [x] Windows (via [Intune/SCCM/Workspace ONE])
- [ ] iOS — NOT managed
- [ ] Android — NOT managed

Implications for investigation work:

- `managed: true` on a Mac or Windows device means it is enrolled in the MDM and has been verified by Okta
- `managed: false` on a Mac or Windows device IS a meaningful signal — it may indicate a personal or unregistered computer. Flag as MEDIUM severity and verify with the user.
- `managed: false` on a phone (iOS/Android) is ALWAYS expected — phones are not in scope for device management. Never flag phone managed status.
- `deviceBound: REQUIRED` constraints are enforced for managed computers but not for phones
-->

<!-- ===== OPTION C: Device management deployed for all device types ===== -->

<!--
**Device management is deployed for ALL device types at [YOUR_ORG].**

Managed device types:
- [x] macOS (via [MDM])
- [x] Windows (via [MDM])
- [x] iOS (via [MDM])
- [x] Android (via [MDM])

Implications for investigation work:

- `managed: false` on ANY device type is a meaningful signal — flag as MEDIUM severity
- `deviceBound: REQUIRED` constraints are fully enforceable
- An unmanaged device authenticating to a policy with deviceBound: REQUIRED is a HIGH severity finding
-->

---

## Standard Device Patterns

### Corporate [Mac/Windows] (Primary Work Device)

- **User Agent pattern:** `[Your MDM agent UA pattern]`
- **Authentication:** [How this device authenticates]
- **Device type in logs:** `Computer`
- **OS in logs:** `[Mac OS X / Windows / etc.]`
- **Notes:** [MDM build string consistency, OS version change behavior, etc.]

### Mobile Device (Okta Verify)

- **User Agent pattern:** `[Okta Verify UA pattern with UUID]`
- **Authentication:** Okta Verify mobile app
- **Device type in logs:** `Mobile`
- **OS in logs:** `[iOS / Android]`
- **Notes:** UUID at end of UA string is persistent. If UUID changes, a new phone was enrolled. [State managed status expectation based on device management option above.]
- **Observed Okta Verify versions:** [List]

### Standard Browser

- **User Agent pattern:** `Mozilla/5.0 ([OS]) AppleWebKit/537.36 ... Chrome/[version] Safari/537.36`
- **Notes:** Chrome/Edge auto-update. Version number changes are NOT new devices. May trigger Okta new device notifications — these are false positives.

### Notable / Non-Standard User Agents

| User Agent Fragment | What It Means | Suspicious? |
|---|---|---|
| `PKeyAuth/1.0` | FIDO2/certificate enrollment | Notable if first appearance — verify with user. Check enrollment policy for severity. |
| `Safari/604.1` on iPhone | Mobile Safari (not Okta app) | Notable — different trust posture. Verify. |
| `Windows-AzureAD-Authentication-Provider/1.0` | Azure AD background agent | Normal. Not interactive. |
| `Azuqua` | Okta Workflows | Not a user device. Exclude from inventory. |

---

## Authentication Policies (Quick Reference)

<!-- Full policy details are in okta-policy-reference.md. This is a quick lookup. -->

| Policy / Rule Name | Meaning | Expected MFA Behavior |
|---|---|---|
| [Rule name from logs] | [What it means] | [Expected behavior] |

### MFA Challenge Rate Context

<!-- Document what MFA rates are normal for your user populations. -->

[Describe normal MFA challenge rates for different policy groups.]

---

## Password Policy

- **Rotation period:** [NUMBER] days ([Active Directory / Okta] policy)
- **Self-service reset (SSPR):** [Enabled for all / Enabled only during lockout / Disabled]
- **Expected expiration sequence:**
  1. `auth_via_AD_agent` FAILURE "password has expired" (1–2 times)
  2. `system.agent.ad.reset_user_password` SUCCESS
  3. `user.account.reset_password` SUCCESS
  4. Multiple SUCCESS events as services pick up new password
  5. Possible `new_device_notification` if reset triggers new device context
  6. Multiple `session.start` FAILURE (INVALID_CREDENTIALS) from cached credentials — resolves in hours

**Verification:** If a log spans ~[NUMBER] days and a reset occurs near the end with no prior reset, this is the natural expiration.

---

## Okta Verify Behavior

### Automatic Factor Updates

`user.mfa.factor.update` events are auto-generated by Okta Verify during: post-enrollment sync, app updates, token renewal, network changes, OS updates. A cluster of 5–10 events in 30 minutes from the same device is normal — not evidence of MFA manipulation.

**Reference:** https://support.okta.com/help/s/article/understanding-user-mfa-factor-update-events

### Device Fingerprinting

- **Okta Device ID** (`guo1...`) — persistent across network/app changes
- **Hardware UUID** — in mobile UA string, persistent across app updates
- **Hardware model** — in UA (e.g., `Apple/iPhone16,2` = iPhone 15 Pro Max)

---

## Known SSO Targets (Normal)

<!-- List standard corporate apps -->
- [App 1]
- [App 2]

**First-appearance apps worth noting:**
- [App — context for why first appearance matters]

---

## Service and Integration Agents (Not User Devices)

| Agent | What It Is |
|---|---|
| `Azuqua` | Okta Workflows. Background. |
| `Windows-AzureAD-Authentication-Provider/1.0` | Azure AD SSO. Background. |

Exclude from device inventory.

---

## Team Reference

- [Name] — [Role]

**System actors:**
- `system@okta.com` / `Okta System` — Automated provisioning

---

## Revision History

| Date | Change | Author |
|---|---|---|
| [Date] | Initial creation | [Team] |
