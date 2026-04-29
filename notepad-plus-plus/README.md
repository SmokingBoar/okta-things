# Notepad++ Okta Expression Language Assets
This folder contains Notepad++ support files for Okta Expression Language:
- `userDefineLangs/Okta_Expression_Language_Base.xml` (syntax highlighting / UDL)
- `autoCompletion/Okta_Expression_Language_Base.xml` (autocomplete)

## Install syntax highlighting (UDL)
1. Open Notepad++.
2. Go to `Language` > `Define your language...`.
3. Click `Import` and select `userDefineLangs/Okta_Expression_Language_Base.xml`.
4. Restart Notepad++.
5. Open your Okta Expression file and select `Okta_Expression_Language_Base` from the `Language` menu.

## Install autocomplete
1. Copy `autoCompletion/Okta_Expression_Language_Base.xml` into your Notepad++ `autoCompletion` folder.
   - Usually: `C:\Program Files\Notepad++\autoCompletion\`
   - Or: `C:\Program Files (x86)\Notepad++\autoCompletion\`
2. Restart Notepad++.
3. In a file using `Okta_Expression_Language_Base` syntax highlighting, autocomplete will be available.

## Extend syntax highlighting
To add custom Okta attributes to syntax highlighting:
1. Open `userDefineLangs/Okta_Expression_Language_Base.xml`.
2. Find `Keywords8`.
3. Add your custom attributes in that section.

Example attribute names:
- `employeeType`
- `userPrincipalName`
- `customAttribute1`

## Extend autocomplete
To add custom Okta attributes to autocomplete:
1. Open `autoCompletion/Okta_Expression_Language_Base.xml`.
2. Add new `<KeyWord name='...'/>` entries near the end of the file, before `</AutoComplete>`.
3. Keep entries alphabetically sorted.

Example:
- `<KeyWord name='employeeType'/>`
- `<KeyWord name='userPrincipalName'/>`
- `<KeyWord name='customAttribute1'/>`

## Notes
- The autocomplete file is bound to `language='Okta_Expression_Language_Base'` and must match the UDL language name exactly.
