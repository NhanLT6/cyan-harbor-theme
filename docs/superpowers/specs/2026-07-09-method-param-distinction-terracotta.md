# Method ↔ param distinction: rose-gold → terracotta

**Date:** 2026-07-09
**Status:** accepted
**Supersedes (partially):** the method/param hex choices in
`2026-07-07-warm-anchor-accent-design.md` and `2026-07-07-semantic-color-philosophy.md`.
Those docs remain the historical record and the rationale for the *semantic spine*
itself; only the two hex values below change.

## Problem

In daily use, method names and parameter names read as nearly the same color.
Both are warm pastels at high lightness, ~22° apart in hue:

| token | old hex | H | S | L |
|---|---|---|---|---|
| method | `#E9BCAB` | 16° | 58% | 79% |
| param  | `#E6D8C0` | 38° | 43% | 83% |

At a glance the eye can't separate them.

## Why not just raise method saturation

The obvious fix — make the method more saturated so it stands apart — is the wrong
lever, and it fights the spine two ways:

1. **Peach collision.** The runtime-hazard band (`any` / `null` / `this` / `super`)
   is peach `#F0A48F` at hue **13°, sat 76%**. The method at 16° is only 3° away in
   hue; the *only* thing keeping method distinct from the hazard band is that method
   is *less* saturated. Raising method saturation slides it into the hazard color.
2. **Spine rule.** "Danger rides on hue, never saturation." Saturation isn't the
   channel that's supposed to carry this distinction anyway.

Deepening method lightness fails the same way — it marches the method's RGB toward
peach from the other axis.

## Constraint: functions must stay warm

Functions are executable *action* = motion → **warm** (spine). Cool families
(blue/teal/purple/green) mean structure/data/rest and are off-limits for functions.
So the entire design space is the warm arc, red→yellow. Within it, "redder bites
harder," so the reddest end is caution/danger and functions belong in the warm
*middle* — not the hot edge, not cool.

Occupancy of the warm arc before this change:

- ~0–10° red — danger / caution (reserved)
- ~11–17° peach — runtime hazards (taken)
- ~22–32° terracotta — **open**
- ~35–48° amber/cream — params (taken)
- ~50–55° yellow — attention edge

## Decision

Move the method into the open terracotta slot and pull the param's saturation down
slightly so the two read as two distinct warm steps — a monotonic gradient
**red → orange → gold = hazard → action → boundary-data**:

| token | new hex | H | S | L | change |
|---|---|---|---|---|---|
| method | `#E1B28E` | 26° | 58% | 72% | hue 16→26 (into open slot), L 79→72 |
| param  | `#E4D9C6` | 38° | 36% | 84% | sat 43→36 (calmer), hue unchanged |

Method now sits 13° clear of the peach hazard band (was 3°) and stays the only
chromatic identifier next to the calmer param.

### Rejected alternatives

- **Rose / pink method (hue → ~350°).** Distinct, but pink functions are the
  Dracula signature (`#FF79C6`); once functions go pink the theme reads as a dim
  Dracula clone. Off-brand.
- **Grey the param to near-neutral parchment (`#E2D9CB`, sat 28).** Biggest raw
  contrast, but the param loses its "warm boundary data" meaning and reads
  passive/disabled. We took the midpoint (`#E4D9C6`, sat 36) instead — keeps a
  whisper of warmth, still gains separation.
- **Push param to gold `#E6CE9E` (40°).** Cleanest gradient story, but a bigger
  shift than needed once the method moved; the calmer cream already separates.

## Token changes

Method — 7 tokens, `#E9BCAB` → `#E1B28E`:
`DEFAULT_FUNCTION_CALL`, `DEFAULT_FUNCTION_DECLARATION`, `DEFAULT_INSTANCE_METHOD`,
`DEFAULT_STATIC_METHOD`, `JS.GLOBAL_FUNCTION`, `JS.INSTANCE_MEMBER_FUNCTION`,
`ReSharper.EXTENSION_METHOD_IDENTIFIER`. Existing `FONT_TYPE` (italic on
`DEFAULT_STATIC_METHOD` and `JS.GLOBAL_FUNCTION`) preserved.

Param — 3 tokens / 4 occurrences, `#E6D8C0` → `#E4D9C6`:
`DEFAULT_PARAMETER`, `JS.PARAMETER`, `DEFAULT_REASSIGNED_PARAMETER`
(FOREGROUND + EFFECT_COLOR; `EFFECT_TYPE 1` underline preserved).

## Files touched

- `ocean-harbor.xml` — source, 7 + 4 swaps.
- `ocean-harbor.theme.json` — `"function"` UI key mirrors the syntax method color.
- `README.md` — palette row rename Rose-gold → Terracotta, hexes, design-rule notes,
  palette-bounds lightness range 78-82 → 72-84.
- `CLAUDE.md` — notes-for-Claude: hexes, grep hints (`E1B28E` / `E4D9C6`), rationale
  pointer to this spec.
- `preview/theme-data.json`, `preview/theme-editor.html` — regenerated via
  `npm run editor`.

## Verification

- `grep -c E1B28E ocean-harbor.xml` → 7; `grep -c E4D9C6 ocean-harbor.xml` → 4.
- `grep -c E9BCAB` and `grep -c E6D8C0` across the repo → 0 outside the historical
  2026-07-07 docs.
- Regenerated `theme-editor.html` shows terracotta methods, calmer-cream params.
