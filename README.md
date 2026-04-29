# okta-things
## Executive summary
`okta-things` is a practical toolkit for IAM and security teams working with Okta. It combines editor productivity assets and investigation templates so teams can move faster on day-to-day identity engineering and security analysis.

This repository currently includes:
- **Okta Expression Language authoring support** for Notepad++ (syntax highlighting + autocomplete)
- **Okta log analysis framework** with setup guides, investigation playbooks, report templates, and Rockstar Console export scripts

The goal is simple: reduce setup friction, improve consistency, and provide reusable building blocks for Okta-focused operational work.

## What’s in this repository
### `okta-expression-language/`
Notepad++ assets for writing and maintaining Okta Expression Language:
- UDL syntax highlighting definition
- Autocomplete catalog for common functions and attributes
- Instructions for installation and customization

### `okta-log-analyzer/`
Template-driven workflow for investigating Okta authentication logs:
- Setup instructions (manual and wizard paths)
- Organization and policy context templates
- Investigation playbook and event glossary
- HTML report template for case documentation
- Rockstar Console scripts for policy and network-zone export

## Who this is for
- IAM engineers
- Identity security analysts
- Okta administrators building repeatable investigation and automation workflows

## Quick start
1. Use `okta-expression-language/` to improve Okta EL editing in Notepad++.
2. Use `okta-log-analyzer/` to stand up a reusable investigation workflow for Okta auth logs.

