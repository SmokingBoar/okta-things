// ============================================================
// Okta Policy & Rules Export — for Rockstar Console
// ============================================================
//
// Purpose: Exports all Okta policies, rules, conditions,
// actions, and settings for use with the Okta Log Analyzer.
//
// How to use:
//   1. Install Rockstar: https://gabrielsroka.github.io/rockstar/
//      Or open Console: https://gabrielsroka.github.io/console/
//   2. Navigate to Applications > Self-Service in the Okta admin
//      console (the old Directory > People page now blocks the
//      console with Content Security Policy errors)
//   3. Paste this script into the Rockstar Console and press Enter
//   4. Click "Export Full JSON" when finished
//   5. Upload the JSON file to the Okta Log Analyzer setup wizard
//
// Output: JSON file matching the Okta API shape — one top-level
// key per policy type, each containing an array of policies with
// their rules nested under `rules`. Conditions, settings, and
// actions are preserved as native JSON (not stringified).
//
// NOTE: This script only reads data — it makes no changes
// to your Okta instance.
// ============================================================

policyTypes = [
  'OKTA_SIGN_ON',
  'PASSWORD',
  'MFA_ENROLL',
  'ACCESS_POLICY',
  'PROFILE_ENROLLMENT',
  'IDP_DISCOVERY'
]
output = {}
errors = []
totalPolicies = 0
totalRules = 0
for (type of policyTypes) {
  log('Fetching:', type)
  policies = []
  try {
    res = await getAll('/api/v1/policies?type=' + type)
    if (res && res.errorCode) {
      log('  Error:', res.errorSummary)
      errors.push(type + ': ' + res.errorSummary)
    } else if (!Array.isArray(res)) {
      log('  Unexpected response for', type)
    } else {
      policies = res
      log('  Found', policies.length, 'policies')
    }
  } catch (e) {
    log('  Skipping', type, '-', e.message || e)
    errors.push(type + ': ' + (e.message || e))
  }
  for (policy of policies) {
    log('  Policy:', policy.name)
    try {
      rules = await getJson('/api/v1/policies/' + policy.id + '/rules')
      policy.rules = Array.isArray(rules) ? rules : []
    } catch (e) {
      log('    Could not fetch rules:', e.message || e)
      policy.rules = []
    }
    totalRules += policy.rules.length
  }
  totalPolicies += policies.length
  output[type] = policies
}

// Build a flat view for the preview table and CSV export.
tableRows = []
for (type of policyTypes) {
  for (policy of (output[type] || [])) {
    baseRow = {
      policyType: type,
      policyId: policy.id,
      policyName: policy.name,
      policyStatus: policy.status,
      policyPriority: policy.priority,
      policySystem: policy.system,
      policyDescription: policy.description || ''
    }
    if (!policy.rules || policy.rules.length == 0) {
      tableRows.push({...baseRow,
        ruleId: '', ruleName: '', ruleStatus: '',
        rulePriority: '', ruleSystem: ''
      })
    } else {
      for (rule of policy.rules) {
        tableRows.push({...baseRow,
          ruleId: rule.id,
          ruleName: rule.name,
          ruleStatus: rule.status,
          rulePriority: rule.priority,
          ruleSystem: rule.system
        })
      }
    }
  }
}

log('')
log('Total policies:', totalPolicies, ' rules:', totalRules)
if (errors.length) log('Errors:', errors.join('; '))
results.innerHTML = totalPolicies + ' policies, ' + totalRules + ' rules exported'
  + (errors.length ? '<br>Errors: ' + errors.join('; ') : '')
  + '<br><button id=exportCSV class=button>Export CSV</button>'
  + ' <button id=exportJSON class=button>Export Full JSON</button>'
table(tableRows.map(r => ({
  'Type': r.policyType,
  'Policy': r.policyName,
  'P.Status': r.policyStatus,
  'Sys': r.policySystem ? 'Y' : '',
  'Rule': r.ruleName,
  'R.Status': r.ruleStatus
})))
exportCSV.onclick = () => downloadCSV(csv(tableRows), 'okta-policies-and-rules')
exportJSON.onclick = () => {
  downloadFile(JSON.stringify(output, null, 2), 'okta-policies-and-rules.json', 'application/json')
}
log('Done.')
