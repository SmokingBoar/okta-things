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