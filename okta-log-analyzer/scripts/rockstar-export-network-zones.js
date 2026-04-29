// ============================================================
// Okta Network Zones Export — for Rockstar Console
// ============================================================
//
// Purpose: Exports all Okta network zones (IPs, gateways,
// proxies) for use with the Okta Log Analyzer setup wizard.
//
// This lets the setup wizard automatically identify your
// VPN exit IPs, corporate proxy ranges, and trusted networks
// so the analyzer won't flag them as suspicious.
//
// How to use:
//   1. Open the Rockstar Console while on your Okta admin page
//   2. Navigate to Applications > Self-Service to avoid CSP errors
//      (the old Directory > People page now blocks the console)
//   3. Paste this script and press Enter
//   4. Click "Export JSON" when finished
//   5. Upload the JSON file to the setup wizard
//
// NOTE: Read-only — makes no changes to your Okta instance.
// ============================================================

zones = await getAll('/api/v1/zones')
log('Found', zones.length, 'zones')
results.innerHTML = zones.length + ' network zones found'
  + '<br><button id=exportZones class=button>Export JSON</button>'
table(zones.map(z => ({
  'Name': z.name,
  'Type': z.type,
  'Status': z.status,
  'Gateways': z.gateways ? z.gateways.length + ' ranges' : '0',
  'Proxies': z.proxies ? z.proxies.length + ' ranges' : '0',
  'Usage': z.usage || ''
})))
exportZones.onclick = () => {
  downloadFile(JSON.stringify(zones, null, 2), 'okta-network-zones.json', 'application/json')
}
log('Done.')
