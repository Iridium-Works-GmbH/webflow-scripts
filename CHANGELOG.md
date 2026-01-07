# Changelog

## 2026-01-07 10:56

Refactored cookie consent implementation to use obfuscated class names and attributes for ad blocker resistance.

- Changed all CSS selectors from `iridium-cc-*` naming to short `ir-*` names (e.g., `.iridium-cc-banner_component` → `.ir-notice`)
- Renamed data attributes from `iridium-cc` and `iridium-cc-checkbox` to `ir-action` and `ir-toggle`
- Renamed internal category identifiers from semantic names (`analytics`, `marketing`, `personalized`) to generic component names (`component_a`, `component_b`, `component_c`)
- Shortened WebflowConsent enum to WFC for consistency
- Updated README with new class names, obfuscation rationale, and requirement that all UI elements start with `display: none`
- Modified UI initialization to only show needed elements (banner OR manager button) based on consent state
- All changes propagated to compiled dist/iridium-cookie-consent.html

## 2026-01-06 16:11

Updated cookie consent UI to use custom toggle switches instead of Webflow default checkboxes.

- Changed CSS selectors from `banner2/prefs2` to `banner/prefs` naming
- Replaced Webflow checkbox classes (`w-checkbox-input`, `w--redirected-checked`) with custom toggle classes (`switch-wrap`, `switch-checked`, `circle`, `circle-checked`)
- Added separate handling for toggle visual wrapper and toggle knub element
- Updated both TypeScript source and compiled output
