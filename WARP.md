# Repository handling rule: sync + security gate
This repository (`okta things`) is the public mirror. It must stay in sync with the parent source repository while enforcing privacy and security checks before any push.

## Source of truth
- Source repository root: `../` (the parent folder containing `okta-expression-language/`, `okta-log-analyzer/`, `reusable-scripts/`, and `README.md`)
- Public mirror root: `./` (`okta things`)

## Required process for every update
1. Sync from source-of-truth content into this repository.
2. Run privacy/security checks.
3. Commit only if checks pass.
4. Push via branch + PR workflow (no direct merge to `main` without PR approval).

## Sync procedure (PowerShell)
Run from the parent directory that contains both repos.

```powershell
$root = "H:\Coding\Git repo\okta-nice-to-haves-and-skills"
$dst  = Join-Path $root "okta things"

# replace working tree content (keep destination .git)
Get-ChildItem -Force $dst | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force

# copy source projects (exclude nested git metadata)
robocopy (Join-Path $root "okta-expression-language") (Join-Path $dst "okta-expression-language") /E /XD .git
robocopy (Join-Path $root "okta-log-analyzer")      (Join-Path $dst "okta-log-analyzer")      /E /XD .git
robocopy (Join-Path $root "reusable-scripts")       (Join-Path $dst "reusable-scripts")       /E /XD .git
Copy-Item (Join-Path $root "README.md") (Join-Path $dst "README.md") -Force
```

## Mandatory security and privacy gate
Run all checks before commit/push from `okta things`:

```powershell
$repo = "H:\Coding\Git repo\okta-nice-to-haves-and-skills\okta things"

# identity must stay private
git -C $repo config --get user.name
git -C $repo config --get user.email
git --no-pager -C $repo log --format="%h %an <%ae> %s" -n 5

# no nested histories copied in
Get-ChildItem -Directory -Recurse -Force $repo | Where-Object { $_.Name -eq ".git" } | Select-Object -ExpandProperty FullName
```

And perform secret/proprietary scans across this repo for:
- keys/tokens/passwords/private keys
- company identifiers/internal domains/internal hostnames
- personal emails or sensitive internal references

If any sensitive content is found, do not commit or push until remediated.

## Commit and push rules
- Use the privacy-safe Git identity for commits.
- Keep changes reviewable; use feature branches and PRs for merges to `main`.

