# Ocean Harbor Theme

A pastel dark theme for JetBrains IDEs. Soft colors designed for comfortable long coding sessions.

## 🎨 Color Palette

### Color Groups
Colors are organized by semantic meaning to create visual harmony.

| Group | Colors | Usage |
|-------|--------|-------|
| **Purple** | `#BFA7FF` (keywords), `#D0B8E0` (delegates) | Keywords, control flow, special types |
| **Blue** | `#89B4F7` (functions/tags), `#7B9CE7` (methods) | Functions, methods, HTML/XML tags, IDs |
| **Teal** | `#80CBC4` (namespace), `#6EC4BC` (class), `#5FB8AA` (interface/enum) | Type hierarchy - namespace → class → interface |
| **Green** | `#90D89F` (strings), property values, regex | String literals, content values |
| **Cyan** | `#A7DBD8` (parameters), `#D9E6E6` (fields) | Variables, parameters, field declarations |
| **Gold** | `#F0E0C0` (numbers) | Numeric literals, type parameters |
| **Rose** | `#F8B4AB` (operators/brackets), `#F0B8A8` (this/super) | All operators, punctuation, special keywords |
| **Gray** | `#546E7A` (comments), `#65737E` (doc tags) | Comments, documentation |
| **Accent** | `#E8C5A0` (CSS classes) | CSS class names, special emphasis |

### VCS Colors
| Type | Color | Usage |
|------|-------|-------|
| Added | `#90D89F` | New lines (green) |
| Modified | `#F0E0C0` | Changed lines (gold) |
| Deleted | `#E8A8A8` | Removed lines (soft red) |

## 🔧 Building

### Create JAR File
```bash
npm install          # First time only
npm run build        # Build ocean-harbor-{version}.jar
```

Output: `releases/ocean-harbor-{version}.jar`

To update version: Edit `package.json` version field, then run `npm run build`.

### Interactive Theme Editor
```bash
cd shiki/
npm install
npm run editor       # Open theme-editor.html in browser
```

Edit 51 token types across 11 languages with live preview.

See [BUILD.md](./BUILD.md) for details.
