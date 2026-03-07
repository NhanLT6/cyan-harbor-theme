# Ocean Harbor — Theme Docs

**Last Updated:** 2026-03-07
**Source of truth:** `ocean-harbor.xml`

---

## Vibe

Pastel dark theme for JetBrains IDEs. Oceanic blues, soft aqua, gentle rose accents. Built for long coding sessions — nothing fights for attention.

- Accent saturation: 39-87%. Lightness: 55-83%. Nothing overpowers.
- Teal family creates type hierarchy via lightness alone (same hue + sat).
- Warm peach (`#F0B8A8`) groups all semantically "important" tokens.
- Single blue (`#89B4F7`) covers functions, methods, and tags — no competing shades.

---

## Color Palette

**Syntax:**
- **Purple:** `#C4B3F4` (keywords), `#D0B8E0` (delegates)
- **Blue:** `#89B4F7` (functions / tags / methods)
- **Teal:** `#80CBC4` (namespace) → `#6EC4BC` (class) → `#5FB8AA` (interface / enum)
- **Green:** `#90D89F` (strings, property values)
- **Cyan:** `#A7DBD8` (parameters), `#D9E6E6` (fields)
- **Gold:** `#EAD2A4` (numbers)
- **Rose:** `#F8B4AB` (operators / brackets), `#F0B8A8` (this / super, !important, null / undefined)
- **Gray:** `#546E7A` (comments), `#65737E` (doc tags)
- **Accent:** `#E9CCAF` (CSS classes)

**VCS:**
- Added: `#90D89F` | Modified: `#F0E0C0` | Deleted: `#E8A8A8`

### Design Rules
- **Type hierarchy:** Teal stays at hue 174°, sat 42%. Lightness steps down: namespace 65% → class 60% → interface 55%.
- **Unified blue:** Functions, methods, tags all on `#89B4F7`. No second blue shade.
- **Important group:** `this`, `super`, `!important`, `null`, `undefined` share `#F0B8A8`.
- **Palette bounds:** Accent sat ≤ 87%, warm tones at 78-82% lightness. Prevents any color from overpowering.
- **Cross-language consistency:** CSS/HTML/XML tag selectors all resolve to blue `#89B4F7`.

---

## Project Structure

```
ocean-harbor.xml                    ← source theme (edit colors here)
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

## UI Depth Philosophy — Islands in the Ocean

The theme uses a two-tier depth model inspired by the JetBrains Islands Dark parent theme.

**Deep ocean** `#1e272c` — the window chrome. Nothing interactive lives here permanently.
- `MainWindow.background`, `MainToolbar`, `NavBar`, `Toolbar`, `ToolWindow.Stripe`

**Island surface** `#263238` — all content panels. Editor and tool windows sit at the same level.
- `ToolWindow.background`, `ToolWindow.Header.*`, `EditorTabs`, `DefaultTabs`, `Island.borderColor`

The contrast between the two tiers (~4% lightness) is intentional and subtle — islands float, not pop.

**Borderless islands:** `Island.borderColor` matches the island surface (`#263238`) so panel outlines are invisible. Internal borders (`Borders.color: #2e3c43`, `Borders.ContrastBorderColor: #37474f`) remain to provide structure within panels without drawing attention.

**Key pitfall to avoid:** `#2f3d45` is lighter (22.7%) than `#263238` (18.4%). Using it for chrome areas (toolbars, sidebars) makes them appear brighter than the content panels — the opposite of the intended depth. Always verify a new chrome color is darker than the island surface before applying it.

---

## Notes for Claude

- `ocean-harbor.xml` is the single source of truth. Everything else is generated.
- When changing a color, grep the hex first — colors are shared across tokens. Update all occurrences.
- Respect palette bounds when picking new colors: sat ≤ 87%, lightness 55-83% for syntax tokens. Follow the teal hierarchy pattern (same hue + sat, vary lightness) for related token groups.
- UI depth: chrome keys must stay darker than `#263238`. When in doubt, use `#1e272c` for chrome and `#263238` for content.
- Commit messages: 1-2 sentences, focus on "why" not "what".
- The live editor uses CSS variables (`var(--theme-color-HEX)`) so color updates in the preview are instant — no regeneration needed.
