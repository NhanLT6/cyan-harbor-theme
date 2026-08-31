# Ocean Harbor — Claude Docs

**Last Updated:** 2026-08-13
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

**Island surface** `#25333B` (moved from `#263238` 2026-08-13 — chroma shift only, H 202° · S 22.9% · L 18.8% held) — all content panels.
- `ToolWindow.background`, `ToolWindow.Header.*`, `EditorTabs`, `DefaultTabs`

**`Island.borderColor` is not an island color:** it's `#00000000` (fully transparent), not a fill matching the surface. Panel outlines are invisible because the border has no alpha, not because it tracks `#25333B` — don't give it a hex value.

**Grep-safety:** `Notification.ToolWindow.warningForeground` and `Notification.ToolWindow.informativeForeground` in `ocean-harbor.theme.json` intentionally still hold `#263238` — they're foregrounds (dark text on a colored notification background), not surfaces, and must NOT move to `#25333B`. A blind grep-replace of `263238` in theme.json will silently break notification text.

**Pitfall:** `#2f3d45` is lighter (22.7%) than `#25333B` (18.8%). Assigning it to chrome areas makes them brighter than content panels — the opposite of the intended depth. Always verify a new chrome color is darker than `#25333B` before applying it.

---

## Notes for Claude

- `ocean-harbor.xml` is the single source of truth for syntax colors. `ocean-harbor.theme.json` owns UI chrome. Everything else is generated.
- When changing a color in the XML, grep the hex first — colors are shared across tokens. Update all occurrences.
- Respect palette bounds when picking new colors: sat ≤ 87%, lightness 55-83% for syntax tokens. Follow the teal hierarchy pattern (same hue + sat, vary lightness) for related token groups.
- **Semantic spine** (governs every color choice): **three bands — cool = what you own, warm = what can hurt you, green = content.** Keywords, functions, params, types, fields, locals = cool & dominant; operators, numbers & runtime hazards = the warm minority (redder bites harder; danger rides on hue, never saturation); strings/literals = grass green, its own band because the data came from outside the program. Supersedes the depth spine (cool sinks / warm floats) — full rationale in `docs/superpowers/specs/2026-08-04-dusty-rose-strings-cornflower-functions-design.md`, extended by `docs/superpowers/specs/2026-08-13-attention-ladder-design.md` (history: `2026-07-13-depth-spine-cool-anchor-design.md`, `2026-07-07-semantic-color-philosophy.md`). **2026-08-26: strings reverted rose `#E6A9B4` → grass green `#9FE69B`** — rose sat only 4° off error red `#ff7597`, read as a washed-out error rather than a deliberate hue; the spine's "warm minority" framing still holds, this is a hue swap within the content band, not a philosophy change. Three channels: hue = role/band (recolor), underline = mutation (`EFFECT_TYPE 1`), weight = attention tier (`FONT_TYPE 1`, bold).
- **Attention ladder** (weight channel, added 2026-08-13): four tiers top to bottom — 1 loudest (hot hue: hazards, operators, punctuation), 2 secondary (**bold** + cold hue: indirection & shared state), 3 body (normal cold: calls, types, params, strings, keywords), 4 floor (dimmed cold: instance fields, locals). Two hard rules, treat as constraints when adding or touching any token: **bold and hot never stack** (hot hue already commands attention; bolding a warm/hazard token overshoots into alarming — the hazard band stays normal weight forever), and **keywords are never bold** (too frequent — weight on a frequent token reads as noise, not hierarchy).
- **Tier-2 token list** (bold, `FONT_TYPE 1` or `3` if already italic) — know this before adding or removing bold on any token: `ReSharper.DELEGATE_IDENTIFIER`, `ReSharper.EVENT_IDENTIFIER`, `STATIC_FINAL_FIELD_ATTRIBUTES`, `ReSharper.STATIC_CLASS_IDENTIFIER`, `ReSharper.EXTENSION_METHOD_IDENTIFIER`, `DEFAULT_STATIC_FIELD`, `DEFAULT_STATIC_METHOD`, `JS.GLOBAL_VARIABLE`, `JS.GLOBAL_FUNCTION`, `ReSharper.ENUM_MEMBER_IDENTIFIER`, `ENUM_CONST`. All are cold-hue tokens representing indirection or shared/static state. Existing italic is preserved (statics read bold-italic) — don't strip italic when adding bold.
- **`#D9E6E6` / `#C3D3DE` split — do not blind grep-replace:** these used to be single flat colors; they now split along the tier-2/tier-4 boundary and each hex appears on both sides. `#D9E6E6` stays on static/shared fields (tier 2, bold) but instance fields moved off it to `#CDDEDE` (tier 4, dimmed). `#C3D3DE` moved to `#B6C9D7` (tier 4) for locals/labels/mutable-locals, but check each match individually — grepping `d9e6e6` or `c3d3de` and replacing every hit will re-merge the split the ladder depends on. No token is ever both dimmed and bolded.
- **Comment contrast is a known exception, not a bug:** comments `#5E7A87` measure 2.85:1 against the island ground — already below WCAG AA (4.5:1) and below the 3:1 large-text floor. This is pre-existing and intentional; comments are deliberately excluded from the tier-4 dim (a further step would land at ~2.45:1, worse). Do not "fix" this by dimming comments — tier 4's separation from the floor comes from fields and locals descending toward the comments, not the comments moving.
- Functions = cornflower `#9FC3FF` (hue ~217° — the near-universal modern convention for calls; deliberately one lightness step above markup-tag blue `#89B4F7` so both survive in JSX/TSX, the only place they meet — 7 tokens: the `DEFAULT_*` function/method tokens, `JS.INSTANCE_MEMBER_FUNCTION`, `JS.GLOBAL_FUNCTION`, `ReSharper.EXTENSION_METHOD_IDENTIFIER`). Was kelp green `#87D49D` (retired 2026-08-04 — green functions is a minority convention and read as unfamiliar), before that terracotta `#E1B28E`. Also mirrored in `ocean-harbor.theme.json` `"function"`. Blue `#89B4F7` is markup tags + CSS functions only. When touching function color, grep `9FC3FF` and update all 7 (+ theme.json). **If the cornflower/tag-blue gap ever proves too thin in real TSX, move tags to teal `#80CBC4` — do not darken cornflower into the tag blue.**
- Params = cool aqua `#A7DBD8` (boundary data you own — sinks cool with the rest of the data). 3 tokens / 4 occurrences: `DEFAULT_PARAMETER`, `JS.PARAMETER`, `DEFAULT_REASSIGNED_PARAMETER` (FG + EFFECT_COLOR; `EFFECT_TYPE 1` underline kept). Was warm cream `#E4D9C6`. `A7DBD8` is also worn by annotations / format-string items, so a grep returns params **plus** those — the param lines are the 3 named tokens. (Was also worn by rainbow-bracket COLOR4 before that plugin's tokens were removed 2026-08-26 — see below.)
- Strings = grass green `#9FE69B` (hue ~117°, back from dusty rose `#E6A9B4` as of 2026-08-26 — rose sat only ~4° off error red `#ff7597` and read as a washed-out error rather than a deliberate hazard-adjacent hue, which made the theme feel dated rather than calm). Before rose it was terracotta `#E1B28E` (retired 2026-08-04 — same salmon-tan family as VS Code Dark+ `#CE9178`). 9 genuine code-string tokens carry it (`DEFAULT_STRING`, `YAML_SCALAR_VALUE`, `CSS.PROPERTY_VALUE`, `JS.REGEXP`, the HTTP + ASP.NET value tokens; mirrored in `ocean-harbor.theme.json` `"string"`) — grep `9FE69B` returns those **plus** the other green tokens below, since the hex is shared. **Shared-hex tokens (not strings, don't move without checking each site):** `FILESTATUS_COPIED`, `FILESTATUS_IDEA_SVN_FILESTATUS_EXTERNAL` (+ `MT_` variant), `CONSOLE_GREEN_OUTPUT`, `CONVENTIONAL_COMMIT_SCOPE`, `DEBUGGER_INLINED_VALUES` (+ `_MODIFIED`), `GIT_TOOLBOX.REMOTE_BRANCH_ATTRIBUTES`, `INFO_ATTRIBUTES` (EFFECT_COLOR), `JS.MODULE_NAME`, `TS.MODULE_NAME`, `LOG_VERBOSE_OUTPUT` — VCS file-status, console/log, debugger, git-tooling, module names, judgment calls kept green. Never blind grep-replace `9FE69B`. **Watch:** operator rose `#F8A295` sits ~64° away from green now, well clear — the tight-neighbor problem that forced rose out doesn't recur here.
- **Rainbow Brackets plugin tokens removed 2026-08-26:** `ANGLE_BRACKETS_RAINBOW_COLOR0-4`, `ROUND_BRACKETS_RAINBOW_COLOR0-4`, `SQUARE_BRACKETS_RAINBOW_COLOR0-4`, `SQUIGGLY_BRACKETS_RAINBOW_COLOR0-4` (20 tokens) deleted from `ocean-harbor.xml` — these belong to the third-party "Rainbow Brackets" plugin, not the JetBrains platform, and one of them (`COLOR1` = `#9FE69B`) collided with strings once strings moved back to green. `INDENT_RAINBOW_COLOR_1-4` / `INDENT_RAINBOW_ERROR` are a separate (also third-party) indent-guide feature and were left alone — don't conflate the two when grepping "rainbow".
- The warm band is full: operators `#F8A295`, hazards `#F0A48F`, numbers `#E8DFA8`, CSS class accent `#E9CCAF`. A new warm token has nowhere to go without collision — that crowding is what forced strings into muddy tan in the first place. Reach for the empty magenta/orchid region or a lightness step on an existing hue instead.
- Mutation = underline, not recolor: `DEFAULT_REASSIGNED_LOCAL_VARIABLE`, `DEFAULT_REASSIGNED_PARAMETER`, `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` carry `EFFECT_TYPE 1` in their own base color. Underline is reserved for mutation only — `ReSharper.STRUCT_IDENTIFIER` had `EFFECT_TYPE 1` stripped 2026-08-13 because structs aren't mutations; it keeps teal `#80CBC4` at normal weight (tier 3), no underline.
- `TS.ANY` is a type hazard → peach `#F0A48F` (runtime hazards band, with `this`/`super`/`null`/`undefined`).
- UI depth: chrome keys must stay darker than `#25333B` (the island). When in doubt, use `#1e272c` for chrome and `#25333B` for content.
- **VCS blame annotation ramp** (`VCS_ANNOTATIONS_COLOR_1..5`): these are gutter *backgrounds* behind `ANNOTATIONS_COLOR` (`#FFFBF7`, near-white) text — they need to stay dark. `_4`/`_5` were previously both `#6EC4BC`, a bright teal at 1.98:1 contrast against the white text (fixed 2026-08-26 → `#2A4F52` / `#1B3538`, both >8:1). If you touch this ramp, check contrast against `#FFFBF7`, not against the island.
- Commit messages: 1-2 sentences, focus on "why" not "what".
- The live editor uses CSS variables (`var(--theme-color-HEX)`) so color updates in the preview are instant — no regeneration needed.
