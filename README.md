# Ocean Harbor Theme

A pastel dark theme for JetBrains IDEs. Oceanic blues, soft aqua, gentle rose accents — built for long coding sessions where nothing fights for attention.

## 🎨 Color Palette

### Syntax Colors

| Group      | Colors                                                                 | Usage                                                         |
|------------|------------------------------------------------------------------------|---------------------------------------------------------------|
| **Purple** | `#BAA1F3` (keywords), `#D0B8E0` (delegates)                            | Keywords, control flow, special types                         |
| **Blue**   | `#89B4F7`                                                              | Functions, methods, HTML/XML tags — single shade, no variants |
| **Teal**   | `#80CBC4` (namespace) → `#6EC4BC` (class) → `#5FB8AA` (interface/enum) | Type hierarchy via lightness only; class references included  |
| **Green**  | `#9FE69B`                                                              | String literals and string-like values — green is strings-only |
| **Cyan**   | `#A7DBD8` (parameters), `#D9E6E6` (fields)                             | Parameters, field declarations                                |
| **Identifier** | `#C3D3DE`                                                          | Local/global variables — no own color, inherit default identifier |
| **Yellow** | `#E8DFA8`                                                              | Numeric literals, type parameters                             |
| **Rose**   | `#F8A295` (operators/brackets), `#F0A48F` (this/super/null/undefined)  | Operators, punctuation, semantically "important" tokens       |
| **Gray**   | `#546E7A` (comments), `#65737E` (doc tags)                             | Comments, documentation                                       |
| **Accent** | `#E9CCAF`                                                              | CSS class names                                               |

### VCS Colors

| Type     | File status | Gutter marker |
|----------|-------------|---------------|
| Added    | `#C3E887`   | `#75C486`     |
| Modified | `#80CBC4`   | `#CDB790`     |
| Deleted  | `#F77669`   | `#C88080`     |

### UI Depth Colors

| Role           | Color                 | Used for                                                     |
|----------------|-----------------------|--------------------------------------------------------------|
| Deep ocean     | `#1e272c`             | Window chrome — `MainToolbar`, `NavBar`, `ToolWindow.Stripe` |
| Island surface | `#263238`             | All content panels — editor, tool windows, tab bars          |
| Subtle border  | `#2e3c43` / `#37474f` | Internal separators within panels                            |

---

## 📐 Design Rules

### Syntax

- **Type hierarchy:** Teal stays at hue 174°, sat 42%. Lightness steps down: namespace 65% → class 60% → interface 55%.
- **Unified blue:** Functions, methods, and HTML/XML tags all use `#89B4F7`. No second blue shade.
- **Important group:** `this`, `super`, `!important`, `null`, `undefined` share `#F0A48F` (warm peach) — semantically "watch out" tokens grouped by color.
- **Green is strings-only:** local variables, globals, mutable locals, and class references carry no green — variables inherit the default identifier `#C3D3DE`, class references are teal. Strings own the green channel.
- **Palette bounds:** Accent sat ≤ 87%, warm tones at 78-82% lightness. Keeps no single color from dominating.
- **Cross-language consistency:** CSS/HTML/XML tag selectors all resolve to blue `#89B4F7`.

### UI Depth — Islands in the Ocean

The window chrome (`#1e272c`) is the ocean floor. Content panels (`#263238`) are islands floating above it. The ~4% lightness gap is intentional and subtle — islands lift, not pop.

- `Island.borderColor` matches the island surface (`#263238`) so panel outlines are invisible — seamless, borderless.
- Internal borders (`Borders.color: #2e3c43`, `Borders.ContrastBorderColor: #37474f`) provide quiet structure within panels without drawing attention.

---

## 🔧 Building

### Create JAR File
```bash
npm install          # First time only
npm run build        # Build ocean-harbor-{version}.jar
```

Output: `releases/ocean-harbor-{version}.jar`

To update version: edit the `version` field in `package.json`, then run `npm run build`.

### Interactive Theme Editor
```bash
cd shiki/
npm install
npm run editor       # Open theme-editor.html in browser
```

Edit 51 token types across 11 languages with live preview.

See [BUILD.md](./BUILD.md) for details.
