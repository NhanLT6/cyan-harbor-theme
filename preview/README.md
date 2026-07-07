# Ocean Harbor — Theme Preview

A static, multi-language syntax preview for the **Ocean Harbor** JetBrains theme.
It renders the theme's colors as hand-styled HTML so you can eyeball changes
without loading the theme into an IDE.

No dependencies, no server, no shiki — the pipeline uses only Node built-ins.

## Regenerate

```bash
npm run editor
```

This runs, in order:

- `extract-theme-colors.js` — reads `../ocean-harbor.xml` → writes `theme-data.json`
- `generate-interactive-editor.js` — reads `theme-data.json` → writes `theme-editor.html`

Then open `theme-editor.html` in a browser.

## Files

| File | Role |
|------|------|
| `extract-theme-colors.js` | Pulls token colors/font-styles from the source XML. |
| `generate-interactive-editor.js` | Builds the static preview HTML from `theme-data.json`. |
| `theme-data.json` | Extracted color data (generated). |
| `theme-editor.html` | The preview page (generated) — open in a browser. |

## Editing colors

Colors live in `../ocean-harbor.xml` (the source of truth). Edit there, then
regenerate. The preview is view-only — it does not write back to the XML.
