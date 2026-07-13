# Ocean Harbor — Depth spine: cool sinks, warm floats

**Date:** 2026-07-13
**Status:** Design approved, pending spec review
**Supersedes:** the *organizing axis* of `2026-07-07-semantic-color-philosophy.md`
(warm = motion/action) and the method/param/string hex choices in
`2026-07-07-warm-anchor-accent-design.md` and
`2026-07-09-method-param-distinction-terracotta.md`. Those docs remain the
historical record. The two orthogonal-channel idea (hue = role, underline =
mutation) and the "redder bites harder" sub-rule survive unchanged.

---

## Problem

The warm-anchor spine put the most *frequent* tokens — functions, methods,
params, operators — on the warm half. Because those tokens are everywhere, a
code file reads warm-dominant. The owner's taste runs to green and cool; the
heat is tiring, not the meaning. The theme is named **Ocean Harbor**, yet the
palette fights the name: deep water should be cool and calm, not terracotta.

Goal: keep color carrying meaning, but change the axis so the calm cool/green
becomes the majority and warmth becomes a balancing minority reserved for the
surface — the few tokens worth noticing.

## The new spine

> **Depth = distance from the runtime surface. Cool sinks, warm floats.**
> Deep = calm & cool. Surface = attention & warm.

Warm water rises, cool water sinks. Map that onto code:

- **Deep cool (structure + the data you own) — dominant, safe to skim.**
  Types, fields, locals, params, keyword machinery. Teal / cyan / purple.
- **Living green layer (your active code).** Functions & methods = kelp — the
  code that grows and acts, the one green thing you read constantly.
- **Warm surface (floats, attend) — the minority.** String/literal content,
  operators, numbers, runtime hazards. Within warm, **redder bites harder**:
  strings are calm sun-warmed content, hazards are the red glint. They separate
  by hue, never by loudness — the surface stays gentle.

Temperature is no longer the primary axis (depth is), but warmth still *means*
"surface / notice me." This retroactively justifies what already sits correctly:
types cool (deep structure), hazards red (surface danger), comments gray (inert
deep), purple keywords (seafloor bedrock machinery).

## Two orthogonal channels (unchanged)

| Channel | Encodes | Mechanism |
|---|---|---|
| **Hue** | role / depth band | recolor |
| **Underline** | mutation state | `EFFECT_TYPE 1`, base color kept |

Reassigned locals / params / C# mutable locals keep their underline. Not touched
by this change.

## What actually changes — three token groups

Most tokens already sit where depth wants them, so a full "re-spine" is mostly a
philosophy rewrite plus three recolors.

### 1. Functions & methods: terracotta `#E1B28E` → kelp green `#93CDA1`

The living active layer. Raw string-green `#9FE69B` is too vivid on *every*
call (highlighter effect, and vivid reads as danger per owner preference), so
the function green is a calmer kelp. Candidate `#93CDA1` (H≈140, S≈38, L≈69) —
sits between the vivid green and the teal type family, giving the cool side a
green→teal continuum. **Tune live in the preview**; alternates considered:
`#A8D9A0` (soft), `#8FBF9E` (deeper muted).

7 tokens (`E1B28E` → new green):

| Token | Line |
|---|---|
| `DEFAULT_FUNCTION_CALL` | 628 |
| `DEFAULT_FUNCTION_DECLARATION` | 633 |
| `DEFAULT_INSTANCE_METHOD` | 655 |
| `DEFAULT_STATIC_METHOD` | 750 |
| `JS.GLOBAL_FUNCTION` | 1091 |
| `JS.INSTANCE_MEMBER_FUNCTION` | 1108 |
| `ReSharper.EXTENSION_METHOD_IDENTIFIER` | 1699 |

Existing `FONT_TYPE` italics (on `DEFAULT_STATIC_METHOD`, `JS.GLOBAL_FUNCTION`)
preserved. `ocean-harbor.theme.json` `"function"` key (line 183) mirrors the new
green. CSS functions stay blue `#89B4F7` (unchanged — they are markup, not code
behavior).

### 2. String literals: green `#9FE69B` → terracotta `#E1B28E`

Strings take the color functions vacated — sun-warmed surface content. Zero new
hex for this pair; it is a clean handoff.

**Critical scoping:** `#9FE69B` is **not** strings-only in the current theme.
It is shared across VCS, console/log, debugger, git tooling, rainbow brackets,
and an effect color. Only genuine **code string-literal / literal-value** tokens
move. Everything else keeps green.

**MOVE → terracotta `#E1B28E`:**

| Token | Line | Note |
|---|---|---|
| `DEFAULT_STRING` | 756 | core string |
| `YAML_SCALAR_VALUE` | 2054 | YAML string scalar |
| `HTTP_REQUEST_INPUT_FILE` | 908 | HTTP client literal |
| `HTTP_REQUEST_PARAMETER_VALUE` | 918 | HTTP client literal |
| `ReSharper.ASP_NET_ATTRIBUTE_VALUE` | 1586 | markup attr value |
| `ReSharper.ASP_NET_RAZOR_ATTRIBUTE_VALUE` | 1644 | markup attr value |
| `ReSharper.ASP_NET_MVC_VIEW` | 1626 | view-name literal |
| `CSS.PROPERTY_VALUE` | 480 | CSS literal value |
| `JS.REGEXP` | 1147 | regex literal |

**KEEP green (semantic-green / tooling / decorative — NOT code string literals):**

| Token | Line | Why kept |
|---|---|---|
| `FILESTATUS_COPIED` | 68 | VCS status |
| `FILESTATUS_IDEA_SVN_FILESTATUS_EXTERNAL` | 76 | VCS status |
| `MT_FILESTATUS_IDEA_SVN_FILESTATUS_EXTERNAL` | 110 | VCS status |
| `CONSOLE_GREEN_OUTPUT` | 372 | ANSI green |
| `LOG_VERBOSE_OUTPUT` | 1229 | log green |
| `DEBUGGER_INLINED_VALUES` | 542 | debugger hint |
| `DEBUGGER_INLINED_VALUES_MODIFIED` | 547 | debugger hint |
| `GIT_TOOLBOX.REMOTE_BRANCH_ATTRIBUTES` | 881 | git tooling |
| `ANGLE_BRACKETS_RAINBOW_COLOR1` | 183 | rainbow bracket |
| `ROUND_BRACKETS_RAINBOW_COLOR1` | 1554 | rainbow bracket |
| `SQUARE_BRACKETS_RAINBOW_COLOR1` | 1815 | rainbow bracket |
| `SQUIGGLY_BRACKETS_RAINBOW_COLOR1` | 1840 | rainbow bracket |
| `INFO_ATTRIBUTES` (EFFECT_COLOR) | 1022 | effect underline |
| `Scala Predefined types` | 1880 | types, out of scope |

**Judgment calls — default KEEP green, confirm in review:**

| Token | Line | Question |
|---|---|---|
| `JS.MODULE_NAME` | 1125 | binding identifier vs module specifier string? Left green. |
| `TS.MODULE_NAME` | 1941 | same |
| `CONVENTIONAL_COMMIT_SCOPE` | 432 | textual content, but tooling-adjacent. Left green. |

Consequence: after this change, green is no longer "code strings"; it is
**functions (+ semantic-green VCS/console/tooling)**. Terracotta becomes the
string color. The old "green = strings-only" doctrine was already inaccurate;
this replaces it honestly.

### 3. Parameters: warm cream `#E4D9C6` → cool aqua `#A7DBD8`

Params are your boundary data — they sink cool with the rest of the data you
own. Reuses `#A7DBD8`, the aqua a prior change freed from params. It is currently
worn by 9 other tokens — rainbow-bracket COLOR4 (×4), `ANNOTATION_ATTRIBUTE_NAME_ATTRIBUTES`,
`MARKDOWN_STRIKETHROUGH`, and `ReSharper.FORMAT_STRING_ITEM` / `MATCHED_FORMAT_STRING_ITEM`
— all contextually distinct from a parameter identifier, and params shared this
exact aqua historically without issue. Acceptable; if the annotation/format-string
overlap ever grates, take the bluer fallback below.

3 tokens / 4 occurrences (`E4D9C6` → `A7DBD8`):

| Token | Line |
|---|---|
| `DEFAULT_PARAMETER` | 705 |
| `DEFAULT_REASSIGNED_PARAMETER` | 732 (FG) + 733 (EFFECT_COLOR) |
| `JS.PARAMETER` | 1137 |

`EFFECT_TYPE 1` underline on `DEFAULT_REASSIGNED_PARAMETER` preserved.

**Tuning risk:** `#A7DBD8` shares hue (~176°) with namespace teal `#80CBC4`;
params are lighter (L76 vs 65). If they blur in practice, push params bluer
toward cyan (candidate `#A9D4DE`, H≈190) to clear the teal type family. Verify
in the preview against a file with both.

## Unchanged (already correct under depth)

Types teal hierarchy, keywords/delegates purple, **operators/brackets rose
`#F8A295`** (kept warm deliberately — surface motion, balances the cool mass),
runtime hazards peach `#F0A48F`, numbers/type-params yellow `#E8DFA8`, fields
cyan `#D9E6E6`, locals `#C3D3DE`, comments gray, blue markup tags, CSS class
accent `#E9CCAF`, all mutation underlines. VCS colors untouched.

The owner's directive: cool/green is the main vibe, but keep some warm to
balance — operators, strings, numbers, and hazards supply that warm minority.

## Doc changes

- **`README.md`** — rewrite "The semantic spine" section from warm=motion to the
  depth spine. Palette table: Terracotta row → "String literals (surface
  content)"; add a "Kelp green `#93CDA1` — functions & methods" row; Green row →
  "functions + VCS/console/tooling" (no longer strings-only); move params from
  warm cream to aqua `#A7DBD8`. Update design-rule bullets (warm anchor → living
  green layer; params = cool boundary data; strings = warm surface content;
  drop "green is strings-only", replace with the accurate scoping).
- **`CLAUDE.md`** — Notes-for-Claude: point to this spec; record functions =
  `#93CDA1` (grep for it), strings = `#E1B28E` (was functions), params =
  `#A7DBD8`; add the caution that `9FE69B` is shared (VCS/console/etc.) so a
  string change must use the MOVE list here, not a blind grep-replace.
- **`ocean-harbor.theme.json`** — `"function"` key → new green.

## Non-goals

- Not recoloring operators, types, keywords, hazards, numbers, fields, locals,
  comments, or blue tags.
- Not touching VCS, console, debugger, git-tooling, or rainbow-bracket greens.
- No per-param trust split; mutation stays underline.
- Not redefining the mutation/underline channel.
- Preview regeneration: `theme-editor.html` is hand-maintained per prior specs;
  refresh its `--token-*` / `--theme-color-*` vars to match, or regenerate via
  `npm run editor` if the generator is still the source — verify which before
  committing generated output.

## Verification

1. `grep -c E1B28E ocean-harbor.xml` → 9 after change (was 7): the 9 MOVE string
   tokens now terracotta, the 7 function tokens no longer terracotta. (Net: −7
   functions, +9 strings = 9 total. Confirm none of the original 7 function
   lines still read `E1B28E`.)
2. `grep -c 93CDA1 ocean-harbor.xml` → 7 (the function tokens) + 1 in theme.json.
3. `grep A7DBD8 ocean-harbor.xml` → params (4 occurrences) **plus** the
   pre-existing rainbow/format-string users; confirm the 4 param lines are among
   them.
4. `grep 9FE69B ocean-harbor.xml` → only the KEEP set (VCS, console, debugger,
   git, rainbow, effect, Scala, module names, commit scope) still match; none of
   the 9 MOVE tokens do.
5. `E4D9C6` → 0 in the XML (all params moved).
6. Rebuild JAR; load in Rider on a real C# + TS + CSS file: functions read
   kelp-green, strings terracotta, params aqua, operators/hazards still warm,
   types teal — and the screen reads cool-green dominant with warm accents,
   calm not alarming. Confirm params don't blur into namespace teal; if they do,
   apply the bluer aqua fallback.
