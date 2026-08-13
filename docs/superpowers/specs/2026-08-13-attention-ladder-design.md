# Attention Ladder — Energy Without Heat

**Date:** 2026-08-13
**Status:** design approved, pending spec review
**Supersedes nothing.** Extends the semantic spine from
`2026-08-04-dusty-rose-strings-cornflower-functions-design.md`.

---

## Problem

The theme is comfortable for long sessions but reads as flat — close in character to
the VS Code default dark theme, which the user finds dated and boring.

The cause is not hue choice. It is the absence of range:

- Every syntax token sits in one 72–83% lightness band at similar saturation. Nothing
  recedes, so nothing advances.
- Instance fields `#D9E6E6` are the **brightest cold token in the theme** — brighter
  than functions, types and keywords. The most ordinary thing on screen is the loudest.
  That inversion is the single largest contributor to the flat read.
- The ground `#263238` is a low-chroma slate. Low-chroma grounds make pastels look
  washed rather than lit.
- Weight (`FONT_TYPE 1`) is already used on three code tokens with no stated rule
  behind it, so it carries no meaning a reader can learn.

## Approach

Add energy through **range and tiering**, not saturation. Saturation is explicitly
off the table: vivid accents read as danger to this user, and the warm band is already
full (`#F8A295` operators, `#F0A48F` hazards, `#E8DFA8` numbers, `#E9CCAF` CSS accent).

### The attention ladder

A fourth signal channel joins hue and underline. The spine becomes:

| Channel | Encodes |
|---|---|
| **Hue** | semantic band — cool = what you own, warm = what can hurt you, rose = content |
| **Underline** (`EFFECT_TYPE 1`) | mutation |
| **Weight** (`FONT_TYPE 1/3`) | **attention tier** |

Four tiers, top to bottom:

| Tier | Signal | Carries |
|---|---|---|
| 1 — loudest | hot hue | hazards, operators, punctuation |
| 2 — secondary | **bold, cold hue** | indirection & shared state |
| 3 — body | normal cold | calls, types, params, strings, keywords |
| 4 — floor | dimmed cold | instance fields, locals, comments |

**Hard rule: bold and hot never stack.** Hot hue already commands attention; bolding it
pushes past useful into alarming. The hazard band keeps peach at normal weight forever.

**Hard rule: keywords are never bold.** They are too frequent — weight on a frequent
token is noise, not hierarchy.

### Tier 2 defined: indirection & shared state

Bold marks **symbols that are not local** — either control flow leaves through them, or
their state is shared beyond the current scope. Delegates, events, enum members, const
fields, static classes, static fields, static methods, extension methods, JS globals.

This definition was chosen over two alternatives:

- *Declaration sites only* (bold the name where a thing is defined) was rejected because
  C# highlighting in Rider routes through `ReSharper.*` tokens, which have **no
  declaration-versus-reference split**. There is no `ReSharper.CLASS_IDENTIFIER` or
  `METHOD_IDENTIFIER` at all. The rule would work in TS/JS and silently do nothing in
  the user's main language.
- *Abstraction & contract layer* (interfaces, delegates, enums, structs) was rejected
  because DI-heavy C# puts an interface in every constructor signature and backing
  field, clustering marks exactly where a reader skims.

### Tier 4 defined: instance state recedes, shared state stands up

The `#D9E6E6` group splits along the tier-2 boundary rather than moving as a block:

- **Instance** fields dim to `#B9CBD4` (tier 4).
- **Shared/static** fields keep `#D9E6E6` and gain bold (tier 2).

No token is both dimmed and bolded. The resulting read: your own instance state settles
into the background, shared state stands up.

---

## Changes

### 1 · Ground — island chroma shift

`#263238 → #25333B` (H 202° · S 22.9% · L 18.8%). Saturation +3.8pp, lightness held.

Chrome `#1e272c` is **unchanged**. This matters: an earlier candidate deepened the
island to `#1B2A31`, which collapses it onto chrome and destroys the two-tier depth
model documented in `CLAUDE.md`. The island must never darken toward chrome. Moving
chroma instead of lightness keeps the gap intact and widens the perceived separation.

Chosen from a five-step ladder (today → `#24343E`). `#24343E` was rejected on sight as
too cold to stare at for a full day; `#25333B` is the midpoint.

Derived editor-surface neutrals, computed by holding lightness, pulling hue to 202°,
and scaling saturation by the same 1.199 factor the island moves:

| Key | From | To |
|---|---|---|
| `CARET_ROW_COLOR` | `#1B2529` | `#1A242A` |
| `SELECTION_BACKGROUND` | `#314549` | `#2F414B` |
| `LINE_NUMBERS_COLOR` | `#4B6468` | `#485E6B` |
| `LINE_NUMBER_ON_CARET_ROW_COLOR` | `#607D86` | `#5C798A` |
| `INDENT_GUIDE`, `VISUAL_INDENT_GUIDE` | `#37474F` | `#354751` |
| `Borders.color` (theme.json) | `#2E3C43` | `#2C3C45` |
| `Borders.ContrastBorderColor` (theme.json) | `#37474F` | `#354751` |

Scope: 23 `263238` occurrences in `ocean-harbor.xml` (editor `TEXT` background,
`GUTTER_BACKGROUND`, console, terminal, scrollbar tracks, diagram nodes, hint
backgrounds) and 16 in `ocean-harbor.theme.json`.

**Exception — do not move:** `Notification.ToolWindow.warningForeground` and
`Notification.ToolWindow.informativeForeground` in `ocean-harbor.theme.json` also hold
`#263238`, but as *foregrounds* — dark text on a colored notification background. They
are not island surfaces and must keep `#263238`.

### 2 · Tier 2 — bold on indirection & shared state

Already bold, kept as-is:

| Token | Colour | Now |
|---|---|---|
| `ReSharper.DELEGATE_IDENTIFIER` | `D0B8E0` | `FONT_TYPE 1` |
| `ReSharper.EVENT_IDENTIFIER` | `D9E6E6` | `FONT_TYPE 1` |
| `STATIC_FINAL_FIELD_ATTRIBUTES` | `d9e6e6` | `FONT_TYPE 3` |

Gaining bold:

| Token | Colour | From | To |
|---|---|---|---|
| `ReSharper.STATIC_CLASS_IDENTIFIER` | `6ec4bc` | `2` | `3` |
| `ReSharper.EXTENSION_METHOD_IDENTIFIER` | `9FC3FF` | — | `1` |
| `DEFAULT_STATIC_FIELD` | `d9e6e6` | `2` | `3` |
| `DEFAULT_STATIC_METHOD` | `9FC3FF` | `2` | `3` |
| `JS.GLOBAL_VARIABLE` | `d9e6e6` | — | `1` |
| `JS.GLOBAL_FUNCTION` | `9FC3FF` | `2` | `3` |
| `ReSharper.ENUM_MEMBER_IDENTIFIER` | `5CBCB3` | — | `1` |
| `ENUM_CONST` | `5CBCB3` | — | `1` |

Existing italic is preserved throughout — statics read bold-italic (`FONT_TYPE 3`),
which keeps the established "static = italic" convention intact underneath the new tier.

**⚠ Flagged for spec review:** enum members were included in the approved definition on
the strength of a claim that they were already bold. That claim was wrong — verified
`FONT_TYPE 0`. They are also the most frequent member of the tier-2 set (switch-heavy
code repeats them). They are the one entry worth dropping if tier 2 reads too dense.

### 3 · Tier 4 — recede the filler

| Token | From | To |
|---|---|---|
| `DEFAULT_INSTANCE_FIELD` | `d9e6e6` | `B9CBD4` |
| `JS.INSTANCE_MEMBER_VARIABLE` | `d9e6e6` | `B9CBD4` |
| `DEFAULT_IDENTIFIER` | `c3d3de` | `A9BBC7` |
| `DEFAULT_LABEL` | `c3d3de` | `A9BBC7` |
| `DEFAULT_REASSIGNED_LOCAL_VARIABLE` (`EFFECT_COLOR`) | `C3D3DE` | `A9BBC7` |
| `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` (FG + `EFFECT_COLOR`) | `C3D3DE` | `A9BBC7` |
| `Scala Mutable Collection` | `c3d3de` | `A9BBC7` |

`DEFAULT_LOCAL_VARIABLE`, `JS.LOCAL_VARIABLE` and `XPATH.XPATH_VARIABLE` inherit
`DEFAULT_IDENTIFIER` via `baseAttributes` and follow automatically.

**Comments are NOT dimmed** — a reversal of what was approved, on evidence. Comments at
`#5E7A87` measure **2.85:1** against the new ground: already below WCAG AA (4.5:1) and
below even the 3:1 large-text floor. A one-step dim lands at 2.45:1. Tier 4 gets its
separation from fields and locals descending *toward* the comments instead, which
widens the ladder without pushing an already-failing pair further down.

### 4 · Spine cleanup

`ReSharper.STRUCT_IDENTIFIER` carries `EFFECT_TYPE 1` — an underline. The spine reserves
underline for mutation. Structs are not mutations. Strip `EFFECT_TYPE` and
`EFFECT_COLOR`; the token keeps teal `80CBC4`.

### 5 · Documentation fix

`README.md` documents comments as `#546E7A`. The actual value in `ocean-harbor.xml` is
`#5E7A87`; `#546E7A` is a VCS/UI grey. Correct the palette table.

---

## Out of scope

Considered, previewed, and deliberately not shipped:

- **Chroma lift on structure tokens** (keywords/functions/types each +1 step) — widest
  range available without new hues, but pushes three token classes hotter. Contrary to
  the user's consistent preference for gentle accents.
- **Live surfaces** — lifted caret row, teal selection, matched-brace highlight box.
  Costs nothing in reading comfort and remains the strongest candidate for a follow-up.
- **Ice-cyan hero** `#7FD4E0` on types — the only genuinely new hue considered. Deferred
  because it collides with the teal namespace → class → interface lightness hierarchy,
  which would need re-deriving.
- **Sinking punctuation** to slate — rejected outright. C#/JS/TS are punctuation-dense
  and the user requires `{ } ( ) , ; .` to stay legible. Punctuation keeps `#F8A295`.
- **Orchid keywords** — rejected; warms a theme that must stay cold.

---

## Verification

1. `python tools/audit-contrast.py` against the new ground. Every changed foreground
   must hold ≥ 4.5:1 except comments, whose pre-existing 2.85:1 is unchanged by this
   work and is recorded as a known exception.
2. `cd preview/ && npm run editor` — regenerate `theme-editor.html`, open, confirm the
   ladder is visible across all 11 languages.
3. `npm run build`, install the JAR, open a real C# file and a real TSX file. Confirm
   tier-2 bold actually lands on the ReSharper tokens in C# — this is the assumption the
   whole tier rests on, and it is the one thing a preview cannot prove.
4. Update `README.md` palette table and `CLAUDE.md` spine notes with the ladder.

## Files touched

- `ocean-harbor.xml` — ground, tier 2, tier 4, struct underline
- `ocean-harbor.theme.json` — island keys, borders
- `README.md` — palette table, ladder, comment colour fix
- `CLAUDE.md` — spine notes, weight channel
