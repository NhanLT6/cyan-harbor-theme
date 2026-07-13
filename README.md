# Ocean Harbor Theme

A pastel dark theme for JetBrains IDEs. Oceanic blues, kelp green, soft aqua — built for long coding sessions where nothing fights for attention.

## 🎨 Color Palette

### Syntax Colors

| Group      | Colors                                                                 | Usage                                                         |
|------------|------------------------------------------------------------------------|---------------------------------------------------------------|
| **Purple** | `#BAA1F3` (keywords), `#D0B8E0` (delegates)                            | Keywords, control flow, special types                         |
| **Blue**   | `#89B4F7`                                                              | HTML/XML/markup tag names, CSS functions — single shade, no variants |
| **Kelp green** | `#7FDD9A`                                                         | Code functions & methods (C#/JS/TS + server langs) — the living green layer |
| **Terracotta** | `#E1B28E`                                                         | String literals & literal values — warm surface content (took the color functions vacated) |
| **Aqua**   | `#A7DBD8`                                                              | Parameters — boundary data you own; also rainbow-bracket COLOR4 / format-string items |
| **Teal**   | `#80CBC4` (namespace) → `#6EC4BC` (class) → `#5FB8AA` (interface/enum) | Type hierarchy via lightness only; class references included  |
| **Green**  | `#9FE69B`                                                              | VCS file-status, console/log, debugger, rainbow brackets — no longer syntax strings |
| **Cyan**   | `#D9E6E6` (fields)                                                     | Field declarations — internal state you own (cool, stable) |
| **Identifier** | `#C3D3DE`                                                          | Local/global variables — no own color, inherit default identifier |
| **Yellow** | `#E8DFA8`                                                              | Numeric literals, type parameters                             |
| **Rose**   | `#F8A295` (operators/brackets), `#F0A48F` (runtime hazards)            | Operators, punctuation; peach = runtime hazards band (`this`/`super`/`null`/`undefined`, `TS.any`) |
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

### The semantic spine

Color carries meaning, not decoration. One depth axis governs every choice:

> **Depth = distance from the runtime surface. Cool sinks, warm floats.**

Deep = calm & cool, and dominant: types, fields, locals, params, keyword machinery — structure and the data you own, safe to skim. Your functions are the **living green layer** — the code that acts. Surface = warm & attention, the minority: string/literal content, operators, numbers, and runtime hazards float on top. Within warm, **redder bites harder**; danger rides on a red-shift, never on saturation — meaning stays calm. See `docs/superpowers/specs/2026-07-13-depth-spine-cool-anchor-design.md`.

Two orthogonal signal channels: **hue** encodes role / depth band (recolor); **underline** encodes mutation (`EFFECT_TYPE 1`, base color kept). They stack — a reassigned param reads aqua *and* underlined.

### Syntax

- **Type hierarchy:** Teal stays at hue 174°, sat 42%. Lightness steps down: namespace 65% → class 60% → interface 55%.
- **Living green layer (functions):** Code functions & methods (C#/JS/TS + other server langs, incl. C# extension methods / LINQ) use kelp green `#7FDD9A` — the code that acts. Hue ~137°, sat ~58% — saturated enough to hold against the purple keywords and terracotta strings, still clear of the teal types. CSS functions stay blue.
- **Params = cool boundary data:** Parameters use aqua `#A7DBD8` — data you own, sunk cool alongside fields and locals. One flat shade (Rider can't distinguish trusted from untrusted params, so no before/after-validation split). Shares the aqua with rainbow-bracket COLOR4 / format-string items, contextually distinct.
- **Mutation = underline:** Reassigned locals, reassigned params, and C# mutable locals get an underline (`EFFECT_TYPE 1`), not a recolor — matches the C# convention and adds no new hue. A reassigned param stacks cream + underline.
- **Blue = tags:** HTML/XML/markup tag names use `#89B4F7`. No second blue shade.
- **Runtime hazards band:** `this`, `super`, `null`, `undefined`, `!important`, and `TS.any` share peach `#F0A48F` — the reddest warm, "watch out" tokens grouped by color.
- **Strings = warm surface:** string literals & literal values use terracotta `#E1B28E` — the color functions vacated. Green `#9FE69B` is no longer syntax strings; it now marks only VCS file-status, console/log, debugger, and rainbow brackets. Local variables inherit the default identifier `#C3D3DE`; class references are teal.
- **Palette bounds:** Accent sat ≤ 87%, warm tones at 72-84% lightness. Keeps no single color from dominating.
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

### Preview

```bash
cd preview/
npm run editor       # regenerate preview/theme-editor.html
```

Open `preview/theme-editor.html` in a browser — a static syntax preview of 51
token types across 11 languages. No dependencies, no server.

See [BUILD.md](./BUILD.md) for details.
