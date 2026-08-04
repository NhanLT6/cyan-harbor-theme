# Ocean Harbor — Claude Docs

**Last Updated:** 2026-08-04
**Source of truth:** `ocean-harbor.xml`

> Color palette and design rules live in `README.md`. This file covers project structure, operational workflow, and guidelines for making changes.

---

## Project Structure

```
ocean-harbor.xml                    ← source theme (edit colors here)
ocean-harbor.theme.json             ← UI chrome colors (JetBrains theme keys)
preview/
  extract-theme-colors.js          ← XML → theme-data.json
  generate-interactive-editor.js   ← theme-data.json → theme-editor.html
  theme-data.json                  ← extracted color data (generated)
  theme-editor.html                ← static multi-language preview (generated)
releases/
  ocean-harbor-{version}.jar        ← built theme JAR
```

**Data flow:**
```
ocean-harbor.xml
  → extract-theme-colors.js        → theme-data.json
  → generate-interactive-editor.js → theme-editor.html   (open in a browser)
```

---

## How to Build & Edit

**Prerequisites:** Node 18+ (no npm dependencies — the preview pipeline uses only Node built-ins)

**Regenerate the preview:**
```bash
cd preview/
npm run editor # extract-theme-colors.js → generate-interactive-editor.js
```
Outputs `preview/theme-editor.html` — a static, multi-language syntax preview.
Open it in a browser. No server, no third-party highlighter, no color pickers; colors are edited in
the XML (see below), not in the browser.

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
- **Semantic spine** (governs every color choice): **three bands — cool = what you own, warm = what can hurt you, rose = content.** Keywords, functions, params, types, fields, locals = cool & dominant; operators, numbers & runtime hazards = the warm minority (redder bites harder; danger rides on hue, never saturation); strings/literals = dusty rose, its own band because the data came from outside the program. Supersedes the depth spine (cool sinks / warm floats) — full rationale in `docs/superpowers/specs/2026-08-04-dusty-rose-strings-cornflower-functions-design.md` (history: `2026-07-13-depth-spine-cool-anchor-design.md`, `2026-07-07-semantic-color-philosophy.md`). Two channels: hue = role/band (recolor), underline = mutation (`EFFECT_TYPE 1`).
- Functions = cornflower `#9FC3FF` (hue ~217° — the near-universal modern convention for calls; deliberately one lightness step above markup-tag blue `#89B4F7` so both survive in JSX/TSX, the only place they meet — 7 tokens: the `DEFAULT_*` function/method tokens, `JS.INSTANCE_MEMBER_FUNCTION`, `JS.GLOBAL_FUNCTION`, `ReSharper.EXTENSION_METHOD_IDENTIFIER`). Was kelp green `#87D49D` (retired 2026-08-04 — green functions is a minority convention and read as unfamiliar), before that terracotta `#E1B28E`. Also mirrored in `ocean-harbor.theme.json` `"function"`. Blue `#89B4F7` is markup tags + CSS functions only. When touching function color, grep `9FC3FF` and update all 7 (+ theme.json). **If the cornflower/tag-blue gap ever proves too thin in real TSX, move tags to teal `#80CBC4` — do not darken cornflower into the tag blue.**
- Params = cool aqua `#A7DBD8` (boundary data you own — sinks cool with the rest of the data). 3 tokens / 4 occurrences: `DEFAULT_PARAMETER`, `JS.PARAMETER`, `DEFAULT_REASSIGNED_PARAMETER` (FG + EFFECT_COLOR; `EFFECT_TYPE 1` underline kept). Was warm cream `#E4D9C6`. `A7DBD8` is also worn by rainbow-bracket COLOR4 / annotations / format-string items, so a grep returns params **plus** those — the param lines are the 3 named tokens.
- Strings = dusty rose `#E6A9B4` (hue ~347° — pink, not warm, so it reads as content not hazard). Was terracotta `#E1B28E`, retired 2026-08-04: it sat in the same salmon-tan family as VS Code Dark+ `#CE9178` and read as dated. 9 genuine code-string tokens carry it (`DEFAULT_STRING`, `YAML_SCALAR_VALUE`, `CSS.PROPERTY_VALUE`, `JS.REGEXP`, the HTTP + ASP.NET value tokens) — grep `E6A9B4` returns exactly those. **Watch:** operator rose `#F8A295` is only ~20° away — strings and operators are separated by lightness/saturation, not hue. Any retune of either must re-check that pair; do not move them closer. **Caution:** `9FE69B` is NOT strings — it is VCS file-status, console/log, debugger, git-tooling, and rainbow brackets. Never blind grep-replace `9FE69B`. js/ts `MODULE_NAME` and `CONVENTIONAL_COMMIT_SCOPE` left green (judgment call).
- The warm band is full: operators `#F8A295`, hazards `#F0A48F`, numbers `#E8DFA8`, CSS class accent `#E9CCAF`. A new warm token has nowhere to go without collision — that crowding is what forced strings into muddy tan in the first place. Reach for the empty magenta/orchid region or a lightness step on an existing hue instead.
- Mutation = underline, not recolor: `DEFAULT_REASSIGNED_LOCAL_VARIABLE`, `DEFAULT_REASSIGNED_PARAMETER`, `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` carry `EFFECT_TYPE 1` in their own base color.
- `TS.ANY` is a type hazard → peach `#F0A48F` (runtime hazards band, with `this`/`super`/`null`/`undefined`).
- UI depth: chrome keys must stay darker than `#263238`. When in doubt, use `#1e272c` for chrome and `#263238` for content.
- Commit messages: 1-2 sentences, focus on "why" not "what".
- The live editor uses CSS variables (`var(--theme-color-HEX)`) so color updates in the preview are instant — no regeneration needed.
