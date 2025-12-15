# Webflow Scripts

TypeScript utilities compiled to standalone JavaScript for Webflow custom code.

## Development

**Prerequisites**: [Bun](https://bun.sh)

```bash
# Install dependencies
bun install

# Build all scripts
bun run build

# Build with minification
bun run build -- --minify
```

Compiled scripts are output to:
- `build/` - JavaScript files (CJS format)
- `dist/` - HTML files with `<script>` tags ready to paste into Webflow

---

## Scripts

### Cookie Consent Manager

**File**: `dist/iridium-cookie-consent.html`

A GDPR-compliant cookie consent system for Webflow that manages analytics, marketing, and personalized tracking preferences.

#### Features

- Initial consent banner on first visit
- Granular control over analytics, marketing, and personalized tracking
- LocalStorage-based consent persistence
- Integration with Webflow's native tracking API
- Support for Intellimize tracking controls
- Settings manager accessible via floating button

#### Required Webflow Components

Your Webflow project must include HTML elements with these attributes:

**Consent Banner** (shown on first visit):
- `.iridium-cc-banner2_component` - Main banner container
- `a.iridium-cc-banner2_button_decline` - Decline all button
- `.iridium-cc-banner2_button[iridium-cc="allow"]` - Accept all button

**Settings Manager** (shown after initial choice):
- `.iridium-cc-manager2_button` - Floating button to open preferences
- `.iridium-cc-prefs2_component` - Preferences panel container
- `.iridium-cc-preferences2_close-icon` - Close button

**Preference Controls**:
- `.iridium-cc-prefs2_option` - Wrapper for each checkbox option
- `[iridium-cc-checkbox="analytics"]` - Analytics checkbox input
- `[iridium-cc-checkbox="marketing"]` - Marketing checkbox input
- `[iridium-cc-checkbox="personalized"]` - Personalized checkbox input
- `.w-checkbox-input` - Webflow's visual checkbox element

**Preference Actions**:
- `a.iridium-cc-prefs2_button[iridium-cc="deny"]` - Disable all button
- `a.iridium-cc-prefs2_button[iridium-cc="allow"]` - Allow all button
- `a.iridium-cc-prefs2_submit.w-button[iridium-cc="submit"]` - Save settings button

#### Installation

1. Build the script: `bun run build`
2. Copy the contents of `dist/iridium-cookie-consent.html`
3. In Webflow, go to **Project Settings → Custom Code**
4. Paste into the **Footer Code** section (before `</body>`)
5. Ensure your Webflow site has the required HTML components (see above)
6. Publish your site

#### How It Works

1. On first visit, the consent banner (`.iridium-cc-banner2_component`) is displayed
2. User can accept all, decline all, or open preferences for granular control
3. Choices are saved to LocalStorage with keys prefixed `iridium-cc:`
4. After initial choice, a floating button (`.iridium-cc-manager2_button`) appears
5. Users can modify preferences anytime via the settings manager
6. The script integrates with Webflow's tracking API and manages Intellimize consent

#### Technical Details

- Retries initialization with exponential backoff to handle DOM race conditions
- Compatible with Webflow's `wf.ready()` API
- Stores consent as `WebflowConsent.ALLOW` or `WebflowConsent.DENY` values
- Necessary cookies are always enabled and cannot be disabled

---

## License

MIT License - see [LICENSE](LICENSE) file for details.