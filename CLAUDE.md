# Webflow Scripts

This project compiles TypeScript snippets into standalone JavaScript files for use in Webflow custom script tags.

## Stack

- **Runtime**: Bun
- **Build tool**: esbuild
- **Format**: CommonJS (CJS)
- **Target**: ES2020

## Structure

```
src/
  snippet-name/
    index.ts          # Entry point for snippet
build/
  snippet-name.js     # Intermediate compiled JS (CJS format)
dist/
  snippet-name.html   # Final HTML with <script> tags for copy-paste
build.ts              # Custom build script using esbuild
```

## Workflow

1. Create new snippet folder in `src/`
2. Add `index.ts` with your TypeScript code
3. Run `bun run build` to compile
4. Copy the contents of the `.html` file from `dist/` into Webflow custom code

## Commands

- `bun run build` - Compile all snippets
- `bun run dev` - Build and watch for changes
- `bun run build -- --minify` - Build with minification

## Output Format

- Each compiled script gets an "Iridium Webflow script" comment banner
- Scripts are bundled as CJS modules targeting ES2020
- No external dependencies - pure browser JavaScript output
- HTML files in `dist/` contain ready-to-paste `<script>` tags

## Staging Environment

Canonical staging environment for testing:
- Design mode: https://iridium-works-master-template.design.webflow.com/
- Published site: https://iridium-works-master-template.webflow.io/
