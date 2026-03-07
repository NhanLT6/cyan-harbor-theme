# Ocean Harbor — Claude Docs

**Last Updated:** 2026-03-07
**Source of truth:** `ocean-harbor.xml`

> Color palette and design rules live in `README.md`. This file covers project structure, operational workflow, and guidelines for making changes.

---

## Project Structure

```
ocean-harbor.xml                    ← source theme (edit colors here)
ocean-harbor.theme.json             ← UI chrome colors (JetBrains theme keys)
shiki/
  extract-theme-colors.js          ← XML → theme-data.json
  convert-to-shiki.js              ← XML → shiki theme JSON
  generate-interactive-editor.js   ← builds theme-editor.html
  editor-server.js                 ← serves editor + saves back to XML
  theme-editor.html                ← interactive editor UI (generated)
releases/
  ocean-harbor-{version}.jar        ← built theme JAR
```

**Data flow:**
```
ocean-harbor.xml
  → extract-theme-colors.js  → theme-data.json
  → convert-to-shiki.js      → ocean-harbor-shiki-theme.json
  → generate-interactive-editor.js → theme-editor.html
  → editor-server.js         → saves edits back to XML
```

---

## How to Build & Edit

**Prerequisites:** Node 18+, npm 9+

**Interactive editor (primary workflow):**
```bash
cd shiki/
npm install    # first time only
npm run editor # extract → convert → build → start server
```
Tweak colors in the browser, click "Save to XML". Done.

**Build JAR for release:**
```bash
npm run build  # outputs releases/ocean-harbor-{version}.jar
```
Bump version: update `version` in root `package.json`, then run build.

**Edit colors directly in XML:**
```xml
<option name="DEFAULT_KEYWORD">
  <value>
    <option name="FOREGROUND" value="C4B3F4" />
    <option name="FONT_TYPE" value="2" /> <!-- 0=normal 1=bold 2=italic 3=bold+italic -->
  </value>
</option>
```

---

## UI Depth Guidelines

The theme uses a two-tier depth model — see `README.md` for the full philosophy. Key rules when editing `ocean-harbor.theme.json`:

**Deep ocean** `#1e272c` — window chrome only.
- `MainWindow.background`, `MainToolbar`, `NavBar`, `Toolbar`, `ToolWindow.Stripe`

**Island surface** `#263238` — all content panels.
- `ToolWindow.background`, `ToolWindow.Header.*`, `EditorTabs`, `DefaultTabs`, `Island.borderColor`

**Pitfall:** `#2f3d45` is lighter (22.7%) than `#263238` (18.4%). Assigning it to chrome areas makes them brighter than content panels — the opposite of the intended depth. Always verify a new chrome color is darker than `#263238` before applying it.

---

## Notes for Claude

- `ocean-harbor.xml` is the single source of truth for syntax colors. `ocean-harbor.theme.json` owns UI chrome. Everything else is generated.
- When changing a color in the XML, grep the hex first — colors are shared across tokens. Update all occurrences.
- Respect palette bounds when picking new colors: sat ≤ 87%, lightness 55-83% for syntax tokens. Follow the teal hierarchy pattern (same hue + sat, vary lightness) for related token groups.
- UI depth: chrome keys must stay darker than `#263238`. When in doubt, use `#1e272c` for chrome and `#263238` for content.
- Commit messages: 1-2 sentences, focus on "why" not "what".
- The live editor uses CSS variables (`var(--theme-color-HEX)`) so color updates in the preview are instant — no regeneration needed.
