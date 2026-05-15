# Reusable Scripts Index

## Source: `reusable-scripts/`

### `remove-users-from-destination-group.js`
Removes users from a destination Okta group if they are members of a source group.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/).
2. Set `srcGroupId` and `dstGroupId` in the script.
3. Run the script.

### `remove-inactive-deprovisioned-group-members.js`
Removes users from a specified group when their status is `INACTIVE` or `DEPROVISIONED`.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/).
2. Set `id` in the script to your target group ID.
3. Run the script.

### `export-all-profile-mappings-to-csv.js`
Exports all Okta profile mappings (including property-level expressions and map refs) to CSV.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/).
2. Run the script.
3. Use **Copy to Clipboard** or **Download CSV**.

### `bulk-reset-passwords-from-csv.js`
Bulk-resets Okta user passwords using `oktaId,password` rows from a selected CSV file.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/).
2. Prepare your CSV using [`bulk-password-reset-template.csv`](bulk-password-reset-template.csv).
3. Run the script and select your CSV file when prompted.

### Warning
- CSV parsing is simple (`split(',')`), so quoted commas/newlines in values can break parsing.
- Passwords are handled as <span style="font-size: 1.2em;"><strong><u>plaintext in the CSV</u></strong></span>.
- The script does not validate missing `oktaId` or `password` values before API calls.

## Source: `okta-log-analyzer/scripts/`

### [`rockstar-export-policies.js`](../okta-log-analyzer/scripts/rockstar-export-policies.js)
Exports Okta policy types, policies, and nested rules from the analyzer workflow to JSON and CSV outputs.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/) from your Okta admin page.
2. Paste and run the script from `okta-log-analyzer/scripts/rockstar-export-policies.js`.
3. Use **Export CSV** or **Export Full JSON**.

### [`rockstar-export-network-zones.js`](../okta-log-analyzer/scripts/rockstar-export-network-zones.js)
Exports Okta network zones (including gateways and proxies) used by the analyzer workflow.

### Usage
1. Open [Gabriel Sroka Console](https://gabrielsroka.github.io/console/) from your Okta admin page.
2. Paste and run the script from `okta-log-analyzer/scripts/rockstar-export-network-zones.js`.
3. Use **Export JSON**.