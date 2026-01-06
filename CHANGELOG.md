# Changelog

## 2026-01-06 16:11

Updated cookie consent UI to use custom toggle switches instead of Webflow default checkboxes.

- Changed CSS selectors from `banner2/prefs2` to `banner/prefs` naming
- Replaced Webflow checkbox classes (`w-checkbox-input`, `w--redirected-checked`) with custom toggle classes (`switch-wrap`, `switch-checked`, `circle`, `circle-checked`)
- Added separate handling for toggle visual wrapper and toggle knub element
- Updated both TypeScript source and compiled output
