# Ocean Harbor Accent Refresh — Design

**Date:** 2026-06-10
**Status:** Approved pending final review
**Source of truth:** `ocean-harbor.xml`

## Problem

The theme is uniformly pastel. After long use everything blends — no token group
provides a focal point. Separately, green is overused: local variables, strings,
class references, and type parameters all sit in the green family, muddying the
palette.

## Goals

1. Break the pastel monotony with slightly richer accents (validated visually:
   "Soft" intensity — between the Subtle and Medium candidates).
2. Reduce greenery so green belongs to strings alone.
3. Make numbers a more neutral, lighter yellow.
4. Guarantee readability of git/diff colors (green-on-green, deleted text) with
   an automated contrast audit.

## Non-goals

- UI chrome changes (`ocean-harbor.theme.json` untouched).
- Shiki tooling: do **not** regenerate shiki artifacts (`theme-data.json`,
  shiki theme JSON, `theme-editor.html`). The user does not use them and plans
  to remove the tooling later.
- Control-flow keyword separation (Rider's scheme model cannot target
  `if`/`return` separately from other keywords).
- oh-my-posh prompt files under `prompt/`.

## 1. Accent shifts

Each hex is replaced at **every** occurrence in `ocean-harbor.xml`
(case-insensitive grep; counts are approximate and verified at implementation
time), preserving the theme's shared-color groups. Two exceptions are listed in
section 2.

| Group | From | To | Touches (≈) |
|---|---|---|---|
| Keywords | `C4B3F4` | `BAA1F3` | 11 — `DEFAULT_KEYWORD`, `CSS.PSEUDO`, `CUSTOM_KEYWORD3`, `JS.DEBUGGER_STMT`, `JSON.KEYWORD`, `MARKDOWN_HEADER_LEVEL_1..6` |
| Operators / punctuation | `F8B4AB` | `F8A295` | 27 — `DEFAULT_OPERATION_SIGN`, `CSHARP_OPERATOR_SIGN`, braces/brackets/parens/comma/dot/semicolon, `DEFAULT_VALID_STRING_ESCAPE`, rainbow level 2, JS control keywords (`JS.IF_ELSE`, `JS.TRY_CATCH`, `JS.YIELD`, `JS.MODULE_KEYWORD`), console cyan/user-input, `CSS.COLOR`, `CUSTOM_KEYWORD4`, `IGNORE.*`, `HTTP_REQUEST_PORT`, `MARKDOWN_LINK_DEFINITION`, `YAML_SCALAR_LIST` |
| Important (`this`/`null`/entities) | `F0B8A8` | `F0A48F` | 9 — `JS.THIS_SUPER`, `JS.NULL_UNDEFINED`, `CSS.IMPORTANT`, `DEFAULT_ENTITY`, HTML/XML/ASP entity refs, `REGEXP.CHAR_CLASS` |
| Numbers / yellow accents | `E3DE88` | `E8DFA8` | 15 — `DEFAULT_NUMBER`, `XPATH.NUMBER`, `TS.TYPE_PARAMETER`, `IMPLICIT_ANONYMOUS_CLASS_PARAMETER`, rainbow level 0, `CONSOLE_YELLOW_OUTPUT`, `JS.CONSOLE`, `CSS.IDENT`, `HTTP_REQUEST_PARAMETER_NAME`, `MARKDOWN_LINK_LABEL`, `DIAGRAM_GENERALIZATION_EDGE`, `DIAGRAM_HOT_SPOTS` |
| Strings / string-like values | `90D89F` | `9FE69B` | 26 — `DEFAULT_STRING`, `CSS.PROPERTY_VALUE`, `YAML_SCALAR_VALUE`, HTTP request values/input file, `JS.REGEXP`, `JS.MODULE_NAME`, `TS.MODULE_NAME`, ASP attribute values, rainbow level 1, console green, `LOG_VERBOSE_OUTPUT`, `DEBUGGER_INLINED_VALUES*`, `CONVENTIONAL_COMMIT_SCOPE`, `GIT_TOOLBOX.REMOTE_BRANCH`, `FILESTATUS_COPIED`, SVN external statuses, `Scala Predefined types`, `INFO_ATTRIBUTES` (effect) |

Rationale for moving whole hex groups: CLAUDE.md rule — colors are shared
across tokens; partial updates fragment the palette.

## 2. Green cleanup

Variables stop being green; they inherit the default identifier (`C3D3DE`).

| Token | Current | New |
|---|---|---|
| `DEFAULT_LOCAL_VARIABLE` | `B0D7B8` | unset foreground (inherit `DEFAULT_IDENTIFIER`) |
| `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` | `B0D7B8` | unset foreground |
| `DEFAULT_REASSIGNED_LOCAL_VARIABLE` | `B0D7B8` fg + green underline | no foreground; underline kept, effect color `C3D3DE` |
| `DEFAULT_REASSIGNED_PARAMETER` | `A7DBD8` fg + cyan underline | unchanged (cyan, not green) |
| `JS.LOCAL_VARIABLE` | `EEFFE3` | unset foreground |
| `DEFAULT_GLOBAL_VARIABLE` | `EEFFE3` | unset foreground |
| `ReSharper.EVENT_IDENTIFIER` | `EEFFE3` | `D9E6E6` (field family — events are member-like) |
| `DEFAULT_CLASS_REFERENCE` (exception 1) | `90D89F` | `6EC4BC` (teal — matches documented class color) |
| `ReSharper.TYPE_PARAMETER_IDENTIFIER` (exception 2) | `90D89F` italic | `E8DFA8` italic (yellow family — matches type parameter rule) |

"Unset" mechanism: replace the explicit `FOREGROUND` with inheritance —
either `baseAttributes="DEFAULT_IDENTIFIER"` on the option or an empty value
block, whichever Rider honors for that attribute (verify in implementation;
the scheme already uses both patterns).

## 3. Contrast audit tool

Port `E:\repos\nebula-haze\tools\audit-contrast.py` to `tools/audit-contrast.py`:

- Theme path: `ocean-harbor.xml` (repo root).
- Constants: `EDITOR_BG = "263238"`, `EDITOR_FG = "b8c5d0"`.
- Keep both check categories (explicit FG/BG attribute pairs; implied pairs).
- Adapt `INTENTIONAL_DIMS` to this theme's quiet tokens (e.g.
  `INLINE_PARAMETER_HINT`, line numbers) as failures surface.
- **Extend `IMPLIED_PAIRS` with git/diff cases:**
  - `DIFF_INSERTED` bg (`264b33`) vs `EDITOR_FG` and vs new string green
    `9FE69B` (the green-on-green case) — threshold 4.5.
  - `DIFF_MODIFIED` bg (`12404b`) vs `EDITOR_FG` and vs string green — 4.5.
  - `DIFF_DELETED` bg (`41454b`) vs `EDITOR_FG` — 4.5.
  - `DIFF_CONFLICT` bg (`4b1515`) vs `EDITOR_FG` — 4.5.
  - `FILESTATUS_ADDED` / `_MODIFIED` / `_DELETED` / `_COPIED` foregrounds vs
    island background `263238` — 4.5 (file tree text).
- Run the audit after the color changes; **fix any failures** by adjusting the
  failing color minimally (keep hue, move lightness) and re-run until exit 0.
  Pre-computed spot checks suggest diff backgrounds already pass (~6.5:1), so
  expected fixes are small or none.

## 4. Docs & release

- README palette tables: update keyword/operator/string rows; **fix the stale
  number row** (README claims `EAD2A4`; actual `DEFAULT_NUMBER` was `E3DE88`,
  becomes `E8DFA8`); remove green from the variable rows; note class
  references are teal.
- CLAUDE.md: no structural rule changes expected; touch only if a palette
  bound moves (new accents stay within sat ≤ 87%, lightness 55–83%).
- Bump `version` in root `package.json`, run `npm run build`, deliver
  `releases/ocean-harbor-{version}.jar` for installation and a real-IDE vibe
  check (the agreed acceptance step).

## Error handling / risks

- **Color drift between preview and IDE:** browser mockups approximate Rider
  rendering; final judgment happens in Rider via the built JAR. Colors are
  trivially tunable afterward (single-file XML edits).
- **Inheritance surprises:** unsetting a foreground may fall back to a
  platform default rather than `DEFAULT_IDENTIFIER` for some attributes;
  verify each unset token renders as `C3D3DE` in Rider, otherwise set the
  color explicitly to `C3D3DE`.
- **Audit false positives:** intentionally dim tokens go into
  `INTENTIONAL_DIMS` rather than being brightened.

## Testing

1. `python tools/audit-contrast.py` exits 0.
2. Grep verification: zero remaining occurrences of `C4B3F4`, `F8B4AB`,
   `F0B8A8`, `E3DE88`, `90D89F`, `B0D7B8`, `EEFFE3` in `ocean-harbor.xml`
   (except any documented keeps).
3. JAR builds cleanly; user installs and confirms vibe in Rider with real
   C#/TS code, including a git diff view.
