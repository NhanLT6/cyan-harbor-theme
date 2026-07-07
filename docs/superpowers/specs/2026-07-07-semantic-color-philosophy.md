# Ocean Harbor — Semantic Color Philosophy

**Date:** 2026-07-07
**Status:** Design approved, pending spec review
**Supersedes:** the implicit/accidental semantics documented in `README.md` (teal hierarchy, green-strings-only, warm-anchor). Those rules survive as *sub-rules* of the spine defined here.

---

## Problem

Colors in this theme were picked for prettiness, then checked "is that nice?" — no organizing intent. That leaves no way to decide the *next* color, and it wastes the theme's most useful job: a color that carries meaning lets a developer read intent at a glance, the way complexity/allocation extensions surface information Rider already knows.

Goal: establish a philosophy where **color encodes meaning**, while preserving the calm/balance/seamless feel that makes the theme good for long sessions. Meaning must ride on **hue**, never on loudness — the user reads vivid saturation as alarm.

## The spine

**One temperature axis, one meaning:**

> **Warm = motion, action, caution. Cool = structure, rest, data.**

- **Cool half = nouns** — what things *are*. Types, stable data you own, literal content. Safe to skim.
- **Warm half = verbs & hazards** — what things *do* / where it moves / what needs care. Within warm, **redder = bites harder** (a small red-shift is the only "danger" dial; saturation stays gentle throughout).

This retroactively justifies the existing warm-anchor decision (functions = action = warm) and extends the same logic to hazards.

## Two orthogonal signal channels

| Channel | Encodes | Mechanism |
|---|---|---|
| **Hue** | role / trust category | recolor |
| **Underline** | mutation state | `EFFECT_TYPE 1`, base color kept |

They stack: a reassigned param = warm color (external) **+** underline (mutated) = "external *and* you're mutating it," for free.

## Buildability constraints (recorded — these bound the design)

Rider colors **token types**, not analysis results. This kills part of the original idea and is why the design landed where it did:

- **Trust-by-param is impossible.** There is one `DEFAULT_PARAMETER` token — every param, one color. Rider cannot distinguish an external/untrusted param from an internal one, nor "before validation" from "after." **Accepted:** params get one flat "this is external, handle it" color. No before/after split.
- **Mutation-by-hazard is fully buildable** — and currently wasted. `DEFAULT_REASSIGNED_LOCAL_VARIABLE`, `DEFAULT_REASSIGNED_PARAMETER`, `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER`, `TS.ANY` all exist; the theme currently renders them ~identically to their calm neighbors. This is where the "take action on it" instinct actually lands.
- **Mutation uses underline, not recolor** — matches the C# convention most themes use and keeps the palette from gaining another warm hue.

## Band map

**COOL — structure & stable data (skim):**

| Band | Tokens | Color | Change |
|---|---|---|---|
| Language machinery | keywords, control flow, delegates | purple `#BAA1F3` / `#D0B8E0` | keep |
| Type system | namespace → class → interface → enum | teal hierarchy | keep |
| Stable data (yours) | locals, fields, identifiers | gray/cyan `#C3D3DE` / `#D9E6E6` | keep |
| Literal content | strings green `#9FE69B`, numbers/type-params yellow `#E8DFA8` | keep |

**WARM — motion, action & caution (attend). Redder = bites harder:**

| Band | Tokens | Color | Change |
|---|---|---|---|
| Actions | functions / methods | rose-gold `#E9BCAB` | keep (done previously) |
| Operations | operators, brackets, punctuation | rose `#F8A295` | keep |
| **Boundary data** | **params** | **warm cream `#E6D8C0`** | **moves out of cyan `#A7DBD8`** |
| Runtime hazards | `this` / `super` / `null` / `undefined`, `TS.ANY` | peach `#F0A48F` | rename band; `TS.ANY` recolored in |

**EFFECT — mutation (orthogonal to hue):**

| Tokens | Signal | Change |
|---|---|---|
| reassigned local | underline | already correct, keep |
| reassigned param | underline | keep underline, recolor to cream |
| C# mutable local | underline | **add underline** (today: none) |

## Exact token changes (`ocean-harbor.xml`)

**Recolor (hue):**

| Token | Line | Before | After |
|---|---|---|---|
| `DEFAULT_PARAMETER` | 705 | `A7DBD8` | `E6D8C0` |
| `JS.PARAMETER` | 1137 | `A7DBD8` | `E6D8C0` |
| `DEFAULT_REASSIGNED_PARAMETER` | 732 `FOREGROUND`, 733 `EFFECT_COLOR` | `A7DBD8` | `E6D8C0` (keep `EFFECT_TYPE 1`) |
| `TS.ANY` | 1930 | `b2ccd6` | `F0A48F` |

**Add underline:**

| Token | Line | Before | After |
|---|---|---|---|
| `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` | 1714 | `baseAttributes="DEFAULT_LOCAL_VARIABLE"` (no effect) | explicit `<value>`: `FOREGROUND C3D3DE` + `EFFECT_COLOR C3D3DE` + `EFFECT_TYPE 1` |

**Unchanged but now doctrine (verify only):** `DEFAULT_REASSIGNED_LOCAL_VARIABLE` (already underlined), `this`/`super`/`null`/`undefined` (already peach `#F0A48F`), functions rose-gold, operators rose, teal hierarchy, green strings.

**Cyan `#A7DBD8` after this change** is no longer a param color. Remaining users — rainbow brackets (`ANGLE_BRACKETS_RAINBOW_COLOR4`, `ROUND_BRACKETS_RAINBOW_COLOR4`), `ANNOTATION_ATTRIBUTE_NAME_ATTRIBUTES`, `MARKDOWN_STRIKETHROUGH`, `ReSharper.FORMAT_STRING_ITEM` / `MATCHED_FORMAT_STRING_ITEM` — are **out of scope**, left as-is.

## Doc changes

- **`README.md`** — Design Rules § : add the **spine** rule, **Params = boundary** rule, **Mutation = underline** rule; rename "Important group" → **Runtime hazards band** and add `TS.ANY` to it. Palette table: add a **Warm cream `#E6D8C0` — parameters (external boundary data)** row; update the Cyan row (params removed; cyan now = rainbow brackets / format-string items only).
- **`CLAUDE.md`** — Notes-for-Claude: add a pointer to this philosophy; record param = `#E6D8C0`, `TS.ANY` = peach, mutation = underline (`EFFECT_TYPE 1`); add the caution "params moved off cyan — grep `E6D8C0`, cyan `A7DBD8` is no longer params."

## Non-goals

- Not touching CSS/HTML/markup coloring (blue tags, CSS functions stay).
- No per-param trust coloring and no before/after-validation split (impossible / too much).
- Not recoloring fields, locals, or the cyan format-string/bracket tokens.
- Not regenerating `preview/theme-editor.html` via the generator (hand-maintained) — hand-edit its `--token-*` vars to match if a preview refresh is wanted.

## Verification

1. `grep A7DBD8` → the 3 param tokens no longer match; the 4 out-of-scope tokens still do.
2. `grep E6D8C0` → exactly 3 params (`DEFAULT_PARAMETER`, `JS.PARAMETER`, `DEFAULT_REASSIGNED_PARAMETER` FG+EFFECT — 4 hits across 3 tokens).
3. `TS.ANY` = `F0A48F`; `ReSharper.MUTABLE_LOCAL_VARIABLE_IDENTIFIER` has `EFFECT_TYPE 1`.
4. Reassigned param shows cream **and** underline; C# mutable local shows local color **and** underline.
5. Rebuild JAR; load in Rider; confirm on a real C# + TS file that params read warm-cream, `any`/`null` peach, mutated vars underlined, and the editor still feels calm (heat acceptable, not alarming).
