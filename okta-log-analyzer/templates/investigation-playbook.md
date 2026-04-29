# Okta Log Investigation Playbook

Step-by-step methodology for Okta authentication log investigations, including false positive checklist, device fingerprinting, and known patterns.

---

## Standard Investigation Workflow

### Step 1: Initial Data Orientation
- Date range of the log
- Users present (filter `actor.alternate_id`; exclude `system@okta.com`)
- Total event counts per user
- Event type mix (confirm auth events present, not just provisioning)

### Step 2: Define Analysis Windows
- **Baseline:** First 30 days (default)
- **Review:** Last 9 days (default)
- **Middle period:** If gap exists, verify it's clean. Clean middle period strengthens review-window anomaly significance.

### Step 3: Filter to Auth-Relevant Events

**Exclude:** `app.user_management`, `system.import.user.update`, `app.realtimesync.*`, `application.provision.user.*`, `group.user_membership.*`, `user.account.update_profile`

**Exclude admin actions** (check `actor.alternate_id`): `user.lifecycle.suspend`, `user.lifecycle.deactivate`, `user.session.clear` / `universal_logout` when actor ≠ subject user

**Include:** `policy.evaluate_sign_on`, `user.authentication.verify`, `user.authentication.auth_via_mfa`, `user.authentication.auth_via_AD_agent`, `user.authentication.sso`, `user.session.start`, `system.push.send_factor_verify_push`, `system.email.new_device_notification.sent_message`, `user.mfa.factor.*`, `user.account.reset_password`, `system.agent.ad.reset_user_password`

### Step 4: Build the Baseline Profile

| Dimension | How to Measure |
|---|---|
| Sessions per day | `user.session.start` SUCCESS / baseline days |
| MFA events per day | `user.authentication.auth_via_mfa` SUCCESS / baseline days |
| MFA challenge rate | MFA sessions / total sessions |
| Unique IPs | Distinct `client.ip_address` values |
| Geolocations | Distinct cities — note which are VPN/proxy |
| OS/platform | `client.user_agent.os` value counts |
| Browsers | `client.user_agent.browser` value counts |
| Raw user agents | Unique `raw_user_agent` values |
| Auth methods | Event type breakdown |
| SSO targets | `target0.display_name` for SSO events |
| Typical session hours | Hour-of-day distribution (local time) |
| Failures / Abandoned | Count non-SUCCESS outcomes |

### Step 5: Identify Deviations
Compare every baseline dimension against the review window.

### Step 6: Apply the False Positive Checklist

#### IP / Geolocation Deviations

<!-- CUSTOMIZE: Replace with your VPN ranges and known-good IPs from org-context.md -->

- [ ] Is the IP within your VPN provider's exit IP ranges? → **VPN exit node — geolocation reflects VPN infrastructure, not user location. Not suspicious.**
- [ ] Is the IP your corporate proxy/egress IP? → **On-network. Not suspicious.**
- [ ] Does the geolocation match a known VPN exit city from org-context.md? → **VPN data center city. Not a real location signal.**
- [ ] Is the geo consistent with known user travel or office locations? → **Likely legitimate — verify with user**
- [ ] Is the geo an unexpected international location from a non-VPN IP? → **High priority — investigate**

#### New Device / User Agent Deviations

- [ ] Chrome or Edge version bump (e.g., 141 → 143) on same OS? → **Browser auto-update, not a new device**
- [ ] Different browser same OS and IP? → **Same machine, different browser**
- [ ] MDM agent version bump (Jamf Connect, Darwin, etc.)? → **OS update, not suspicious**
- [ ] Okta Verify new version with same device UUID? → **App update, not suspicious**
- [ ] New device notification corresponding to browser version update? → **False positive**
- [ ] UA is `PKeyAuth/1.0`? → **FIDO2/certificate enrollment. Check enrollment policy: OPTIONAL → MEDIUM (verify intent); NOT_ALLOWED → HIGH (policy violation)**
- [ ] UA is mobile Safari on iPhone when user always uses Okta app? → **Genuine new device fingerprint — verify**
- [ ] Two browser sessions same OS/IP/city? → **Almost certainly same physical machine — state as "likely same device"**
- [ ] New OS is Linux alongside Mac/Windows? → **Definitively a different physical machine**

#### Managed Device Flag

<!-- CUSTOMIZE: Choose the block matching your device management status from org-context.md -->

<!-- OPTION A: Device management NOT deployed -->
- [ ] Device shows `managed: false`? → **ALL devices show this — never a finding. Ignore managed status entirely.**

<!-- OPTION B: Device management deployed for computers only -->
<!--
- [ ] Mac or Windows device shows `managed: false`? → **MEDIUM — may be a personal or unregistered computer. Verify with user. Cross-reference Rockstar device export if available.**
- [ ] Phone shows `managed: false`? → **Always expected — phones are not managed. Not a finding.**
- [ ] Device shows `managed: true`? → **Confirmed corporate-enrolled device. High confidence.**
-->

<!-- OPTION C: Device management deployed for all types -->
<!--
- [ ] Any device shows `managed: false`? → **MEDIUM — may be personal or unregistered. Verify with user.**
- [ ] Device shows `managed: true`? → **Confirmed corporate-enrolled device.**
-->

#### MFA Factor Updates

- [ ] Factor updates from a known enrolled device? → **Okta Verify automatic sync**
- [ ] Updates cluster in a 30-minute window? → **Normal sync pattern**
- [ ] Updates coincide with Okta Verify version change? → **Expected**
- [ ] Updates occur 3–14 days after new device enrollment? → **Expected post-enrollment sync**

#### Abandoned MFA Pushes

- [ ] Single ABANDONED event? → **Likely accidental dismissal, low concern**
- [ ] 2–4 ABANDONED events over a workday? → **May be legitimate troubleshooting — ask user**
- [ ] 5+ ABANDONED AND same day shows password expiry + UUID change? → **Password Expiry + Phone Upgrade Collision — see Known Patterns — verify via phone call**
- [ ] 5+ ABANDONED with no password expiry or device change? → **HIGH — consistent with push-bombing/MFA fatigue attack**

#### Password Events

<!-- CUSTOMIZE: Replace [PASSWORD_ROTATION_DAYS] -->
- [ ] Log spans ~[PASSWORD_ROTATION_DAYS] days and reset occurs near end with no prior reset? → **Expected expiration, not suspicious**
- [ ] Reset occurs mid-log not near rotation mark? → **May be legitimate — verify**
- [ ] INVALID_CREDENTIALS immediately after reset? → **Background services propagating new credential, 1–6 hours**

---

### Step 7: Device Fingerprint Correlation

| Client Type | Identifier | Confidence |
|---|---|---|
| Okta Verify (mobile) | Persistent UUID + Device ID + hardware model | **High** |
| Okta Verify (desktop) | Okta Device ID | **High** |
| MDM agent (Jamf Connect, etc.) | Consistent UA + overlapping IPs | **Medium** |
| Browser | None — IP + OS + location only | **Low** |

**Browser session identification:** No hardware fingerprint available. Same OS + same IP + same city + overlapping timeframes = "likely same device" (never "confirmed").

**Different OS = different machine:** Linux alongside Mac/Windows is definitively different hardware.

**Multi-IP heuristic:** Many IPs from consistent device fingerprints = one laptop on different networks, not multiple devices.

**Rockstar device export:** When available from the Rockstar extension, cross-reference the user's enrolled devices against what appears in logs. This can resolve "likely same device" to higher confidence.

---

### Step 8: Verify with the User

Key questions:
- Did you get a new phone recently?
- Were you traveling to [location] on [date]?
- Did you notice push notifications you didn't request?
- Did you set up a new sign-in method (passkey, certificate)?
- Do you use any VPN other than the corporate one?
- Do you have a personal device you use for work access?

Document all verifications — what was verified, who confirmed, and date.

---

### Step 9: Produce the Report

- Lead findings with specific log evidence
- Distinguish verified from unverified findings
- State middle period status when applicable
- State device confidence levels explicitly
- Priority: URGENT / HIGH / MEDIUM / LOW

---

## Known Patterns

### Pattern: Password Expiry + Phone Upgrade Collision

**When to recognize:** Password expiration at the rotation mark coincides with new phone enrollment on the same day.

**What you'll see:**

| Signal | Innocent Explanation |
|---|---|
| `auth_via_AD_agent` FAILURE "password has expired" | Natural rotation expiry |
| Password reset SUCCESS | Self-service reset |
| UUID mismatch (baseline ≠ new) | Old phone replaced by new phone |
| `new_device_notification` × 2–3 | New phone enrollment |
| iPhone Safari in logs | Okta enrollment web flow before Okta Verify app is configured |
| `Okta Account Management Policy` in `policy.evaluate_sign_on` | Confirms enrollment flow, not app SSO |
| `PKeyAuth/1.0` first appearance | FastPass passkey setup during phone enrollment |
| 5–15 `auth_via_mfa ABANDONED` | Re-auth cascade + Okta Verify mid-enrollment |
| `session.start FAILURE INVALID_CREDENTIALS` × 4–6 | MDM agent cached old password |

**Root cause:** Password expiry and phone upgrade same day → reset triggers re-auth cascade while Okta Verify is mid-enrollment → abandoned pushes look like push-bombing but aren't.

**How to confirm:**
1. Log spans full rotation period, no prior reset (confirms natural expiry)
2. UUID change matches a logical upgrade
3. Call user directly — ask identity-specific questions. "Did you get a new phone?" + "Did your password expire?"
4. No successful sessions from unexpected IP during the abandoned window

**Do not escalate unless:** User can't confirm phone upgrade, abandoned pushes from unexpected IP, or reset occurred well before rotation mark.

---

## Completed Investigation Reference

*Add summaries here after each closed investigation.*

<!--
### Investigation: [First Name] — [Month Year]

**Log span:** [Start] – [End] ([N] days)
**Final outcome:** [CLOSED / ESCALATED]

**Key findings:** [Brief summary]
**Key lesson:** [What you learned]
-->

---

## Investigation Quality Checklist

- [ ] Applied all false positive filters
- [ ] Checked new IPs against VPN ranges
- [ ] Checked middle period (clean/dirty)
- [ ] Correlated device fingerprints for "new device" findings
- [ ] Distinguished confirmed vs. pending verification
- [ ] Confirmed password timing against rotation policy
- [ ] Checked `user.mfa.factor.update` against Okta Verify version history
- [ ] Verified geolocation isn't VPN/proxy before flagging
- [ ] Calibrated severity appropriately
- [ ] Included prioritized action items
- [ ] Stated browser session confidence honestly
- [ ] Distinguished admin actions from user logins (check actor)
- [ ] Applied multi-IP traveling laptop heuristic
- [ ] Excluded service agents from device inventory
- [ ] Applied correct managed device interpretation per org-context

---

## Revision History

| Date | Change | Author |
|---|---|---|
| [Date] | Initial creation | [Team] |
