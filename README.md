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
- Ad blocker resistant design using obfuscated class names

#### Required Webflow Components

Your Webflow project must include HTML elements with these classes and attributes. **Important**: All consent UI elements should have `display: none` set by default in Webflow designer. The script will show the appropriate element on successful initialization.

**Consent Banner** (shown on first visit):
- `.ir-notice` - Main banner container
- `a.ir-notice-decline` - Decline all button
- `.ir-notice-accept[ir-action="allow"]` - Accept all button

**Settings Manager** (shown after initial choice):
- `.ir-manager` - Floating button to open preferences
- `.ir-settings` - Preferences panel container
- `.ir-settings-close` - Close button

**Preference Controls**:
- `.ir-option` - Wrapper for each toggle option
- `[ir-toggle="component_a"]` - Analytics toggle input
- `[ir-toggle="component_b"]` - Marketing toggle input
- `[ir-toggle="component_c"]` - Personalized tracking toggle input
- `.switch-wrap` - Custom toggle wrapper (visual state)
- `.circle` - Toggle knub element

**Preference Actions**:
- `a.ir-settings-button[ir-action="deny"]` - Disable all button
- `a.ir-settings-button[ir-action="allow"]` - Allow all button
- `a.ir-settings-submit.w-button[ir-action="submit"]` - Save settings button

#### Component Name Mappings

The script uses obfuscated component names to avoid ad blocker detection:
- `component_a` = Analytics tracking
- `component_b` = Marketing tracking
- `component_c` = Personalized tracking

#### Installation

1. Build the script: `bun run build`
2. Copy the contents of `dist/iridium-cookie-consent.html`
3. In Webflow, go to **Project Settings → Custom Code**
4. Paste into the **Footer Code** section (before `</body>`)
5. Ensure your Webflow site has the required HTML components (see above)
6. Publish your site

#### How It Works

1. On first visit, the consent banner (`.ir-notice`) is displayed
2. User can accept all, decline all, or open preferences for granular control
3. Choices are saved to LocalStorage with keys prefixed `iridium-cc:`
4. After initial choice, a floating button (`.ir-manager`) appears
5. Users can modify preferences anytime via the settings manager
6. The script integrates with Webflow's tracking API and manages Intellimize consent

#### Technical Details

- Retries initialization with exponential backoff to handle DOM race conditions
- Compatible with Webflow's `wf.ready()` API
- Stores consent as `WebflowConsent.ALLOW` or `WebflowConsent.DENY` values
- Necessary cookies are always enabled and cannot be disabled
- Uses obfuscated class names and attributes to avoid ad blocker interference
- All UI elements start hidden (`display: none`) and are revealed by the script to gracefully handle ad blocker scenarios

---

## License

MIT License - see [LICENSE](LICENSE) file for details.