# Dusty rose strings, cornflower functions

**Date:** 2026-08-04
**Status:** implemented
**Supersedes:** `2026-07-13-depth-spine-cool-anchor-design.md`
**History:** `2026-07-09-method-param-distinction-terracotta.md`, `2026-07-07-semantic-color-philosophy.md`

---

## Problem

Two tokens from the depth-spine change failed in daily use.

**Strings — terracotta `#E1B28E`.** After living with it, it read as dated: "old Visual Studio, aging, low tech." The association is real, not vague. `#E1B28E` is a lighter cousin of VS Code Dark+'s string color `#CE9178`, and both sit in the same salmon-tan family that shipped in Visual Studio for a decade. Any theme using it inherits that era's feel.

Terracotta was not chosen because it was good. It was what remained. The warm band was already full — operators `#F8A295`, runtime hazards `#F0A48F`, numbers `#E8DFA8`, CSS class accent `#E9CCAF` — so the only unoccupied warm slot was muddy tan, and it went to the highest-volume token on screen. The design rule ("strings are warm surface content") had produced the one warm color nobody would pick on its own.

**Functions — kelp green `#87D49D`.** Reported as "nothing good, just not familiar for methods/functions." Green functions is a minority convention: Dracula does it, almost nothing else does. One Dark, Tokyo Night, Catppuccin, Material and GitHub Dark all put calls in blue; Rider and Visual Studio use khaki `#DCDCAA` natively. Whichever of those a developer has absorbed, green is not it — so every call site costs a beat of recognition.

## Decision

| Token group | From | To | Tokens |
|---|---|---|---|
| Strings & literal values | `#E1B28E` terracotta | **`#E6A9B4` dusty rose** | 9 |
| Functions & methods | `#87D49D` kelp green | **`#9FC3FF` cornflower** | 7 |

Mirrored in `ocean-harbor.theme.json` (`"string"`, `"function"`).

### Why dusty rose `#E6A9B4`

Hue ~347°. Pink rather than warm — it carries none of the tan/salmon history that made terracotta feel dated, while staying soft enough not to read as an alert. Contrast on the editor background `#263238` is **6.7:1** — clear WCAG AA.

Both this and soft orchid `#DFA7C4` were shortlisted from a live preview and lived with side by side. Orchid had the better numbers: at hue ~325° it occupies the only genuinely empty region of this palette's wheel, so it could not blur into any neighbour. Rose was chosen anyway, on preference, after seeing both against real C#, TypeScript and JSX.

**The known cost, recorded deliberately:** rose sits ~20° from operator rose `#F8A295`, and operators appear inside and beside string-heavy lines constantly. The two are held apart by lightness and saturation, not by hue — a thinner margin than every other adjacent pair in this palette. It reads fine today. But it means neither color can be retuned in isolation: any future change to strings or operators must re-check the pair, and neither may move toward the other. If string-heavy code ever starts to feel muddy, this is the first place to look, and the fix is to shift strings toward orchid rather than to desaturate operators.

### Why cornflower `#9FC3FF`

Hue ~217°, squarely in the blue that most modern themes use for calls — the familiarity the previous green lacked.

The cost is proximity to markup-tag blue `#89B4F7`. Cornflower is deliberately one lightness step above it (relative luminance 0.546 vs 0.454). JSX and TSX are the only file types where function calls and tag names appear side by side; the separation was checked there directly against a `useState`/`useEffect` + `<section>`/`<TideChart>` sample and holds. Contrast on `#263238` is **7.5:1**.

Khaki gold `#DCDCAA` — Rider and Visual Studio's own method color, and therefore the maximum-familiarity option — was rejected because it is nearly identical to numbers `#E8DFA8`, and moving numbers to make room is a larger change than this problem justifies.

**Escape hatch:** if the cornflower/tag-blue gap proves too thin in real TSX work, move markup tags to teal `#80CBC4` (tags are structure; teal is the structure hue). Do not resolve it by darkening cornflower toward the tag blue — that reintroduces the collision from the other side.

## The spine, rewritten

The depth spine — *cool sinks, warm floats* — does not survive these two moves. With functions cool and strings out of the warm band entirely, warm would be left holding only operators, numbers and hazards, which is not a depth statement.

The replacement is a three-band rule that describes what the palette now actually does:

> **Cool = what you own. Warm = what can hurt you. Rose = content.**

- **Cool, and dominant** — keywords, functions, params, types, fields, locals. Structure and the code you wrote. Safe to skim; most of the screen.
- **Warm, and minority** — operators, numbers, runtime hazards. Friction and things that bite. Within warm, **redder bites harder**; danger rides on a red-shift, never on saturation, so meaning stays calm.
- **Dusty rose, standing alone** — string and literal content. Data that came from outside the program, so it belongs to neither band.

This is a better fit than the depth axis for a further reason: it explains *why* the warm band must stay small. Warm now means hazard, so every warm token spent on something harmless dilutes the signal. Terracotta strings were exactly that mistake.

Unchanged: the two orthogonal signal channels. **Hue** encodes role/band (recolor); **underline** encodes mutation (`EFFECT_TYPE 1`, base color kept). They stack — a reassigned param reads aqua *and* underlined.

## Token inventory

**Strings → `#E6A9B4`** (9, all in `ocean-harbor.xml`)

`DEFAULT_STRING` · `YAML_SCALAR_VALUE` · `CSS.PROPERTY_VALUE` · `JS.REGEXP` · `HTTP_REQUEST_INPUT_FILE` · `HTTP_REQUEST_PARAMETER_VALUE` · `ReSharper.ASP_NET_ATTRIBUTE_VALUE` · `ReSharper.ASP_NET_MVC_VIEW` · `ReSharper.ASP_NET_RAZOR_ATTRIBUTE_VALUE`

**Functions → `#9FC3FF`** (7, all in `ocean-harbor.xml`)

`DEFAULT_FUNCTION_CALL` · `DEFAULT_FUNCTION_DECLARATION` · `DEFAULT_INSTANCE_METHOD` · `DEFAULT_STATIC_METHOD` · `JS.GLOBAL_FUNCTION` · `JS.INSTANCE_MEMBER_FUNCTION` · `ReSharper.EXTENSION_METHOD_IDENTIFIER`

Both old hexes were exclusive to their token sets, so a global hex replace within `ocean-harbor.xml` was safe. This is not generally true — `9FE69B` in particular is shared across VCS file-status, console/log, debugger and rainbow brackets, and must never be blind-replaced.

`ocean-harbor.theme.json` also had `"string": "#90d89f"` — a stale green never migrated during the 2026-07-13 change. Corrected to `#E6A9B4` as part of this work.

## Deliberately not done

The `"colors"` block in `ocean-harbor.theme.json` has drifted from the XML beyond the two keys touched here: `number` is `#6FD9E8` against the XML's `#E8DFA8`, `className` `#A5E8DD` against `#6EC4BC`, `keyword` `#BFA7FF` against `#BAA1F3`, `operator` `#F8B4AB` against `#F8A295`. These keys feed IDE chrome rather than the editor, so the drift is not visible in code, but it is wrong. Left for a separate sync pass rather than widened into this change.

## Verification

- Contrast on `#263238`: rose 6.7:1, cornflower 7.5:1 — both above the 4.5:1 AA threshold.
- Neither new hex collided with any existing value in `ocean-harbor.xml` or `ocean-harbor.theme.json` before the change.
- Both colors were chosen from a live side-by-side preview against C#, TypeScript and JSX samples rendered in the full palette, not from hex values in isolation.
