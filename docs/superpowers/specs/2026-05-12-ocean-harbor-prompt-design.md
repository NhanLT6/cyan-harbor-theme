# Ocean Harbor — oh-my-posh Prompt Design

**Date:** 2026-05-12
**Tool:** oh-my-posh (JSON config)
**Shells:** PowerShell 7+, Bash, Zsh, Fish, Cmd, Nushell
**Font required:** JetBrains Mono NF (or any Nerd Font)

---

## Overview

A minimal two-line prompt with a silent ocean surface replacing the blank line between command blocks. Colors are hardcoded hex values from the Ocean Harbor palette — independent of `ocean-harbor.xml` at runtime.

---

## Layout

Every command block is three lines:

```
__ 󰻈 _________________________     ← ocean surface (flat reflection, sail boat near left)
󰨊 CommissionFactory/src/Button · 󰘬 feature/ds-4151-new-…   ← info line
╰❯ _                               ← prompt line
```

---

## Segments

### 1. Ocean surface (divider line)

Segment type: `text`

A flat ocean surface using `_` underscores in 6 alternating water tones. No overall fade — consistent surface brightness. The sail boat (`nf-md-sail_boat`) sits ~2 chars from the left edge as the single teal focal point.

**Water tone palette:**

| Token | Hex | Role |
|-------|-----|------|
| boat | `#6EC4BC` | sail boat — teal peak |
| w3 | `#486878` | catch-light (reflection band peak) |
| w4 | `#3f5d6c` | shadow between ripple cycles |
| w6 | `#3d5968` | mid — settling water |
| w7 | `#354f5c` | mid-deep |
| w8 | `#2e4452` | deep |

**Reflection rhythm:** irregular alternation of catch-light and shadow bands — no mechanical repeat. Boat position: 2 underscores from left edge.

**Glyph:** `󰻈` (`nf-md-sail_boat`)

---

### 2. Shell icon

Segment type: `shell`

| Shell | Glyph | NF name |
|-------|-------|---------|
| `pwsh` / `powershell` | `󰨊` | `nf-md-powershell` |
| `bash` | `󱆃` | `nf-md-bash` |
| `zsh` | `󱆃` | `nf-md-bash` |
| `fish` | `󱐋` | `nf-md-fish` |
| `cmd` | `󰖳` | `nf-md-windows` |
| `nu` | `󰬦` | `nf-md-nushell` |
| anything else | `󰣛` | `nf-md-fedora` |

Color: `#6EC4BC` (teal — same as boat)

---

### 3. Path

Segment type: `path`

- **Style:** `agnoster_short`
- **Max depth:** 4
- **Folder separator:** `/` in `#65737E` via `folder_separator_template`
- **Truncation icon:** `…` via `folder_icon`
- **Config key:** `options`

**Per-folder color via format strings:**

| Format property | Color | Role |
|----------------|-------|------|
| `gitdir_format` | `#A7DBD8` | git root folder — bright |
| `folder_format` | `#546E7A` | all other folders — dim |

---

### 4. Path → git separator

`·` in `#65737E`. Only rendered when git segment is visible.

---

### 5. Git branch

Segment type: `git`

| Property | Value |
|----------|-------|
| Branch icon | `󰘬` (`nf-md-source_branch`) in `#89B4F7` |
| Branch name color | `#89B4F7` |
| Max length | 20 characters |
| Truncation suffix | `…` |
| `branch_icon` | `""` (empty — prevents duplicate icon) |
| `fetch_status` | `false` |

**Hidden when either env var is set:** `TERMINAL_EMULATOR=JetBrains-JediTerm`, `TERM_PROGRAM=vscode`

---

### 6. Prompt connector

Segment type: `status`

**Normal state:** `╰❯` in `#6EC4BC` (teal)

**Error state:** `󰅚 {{ .Code }}` in `#ff7597` (Ocean Harbor error red — `ERRORS_ATTRIBUTES`)

The `╰❯` is absent on error — the icon alone signals failure.

---

## Features

| Feature | Config |
|---------|--------|
| Transient prompt | `╰❯ ` in dim `#546E7A` |
| Blank line before prompt | Replaced by ocean surface divider |
| Execution time | Disabled |

---

## Color reference

| Token | Hex | Role |
|-------|-----|------|
| `#263238` | Background | Ocean Harbor base |
| `#6EC4BC` | Shell icon, boat, connector | teal-mid |
| `#A7DBD8` | Git root folder | cyan-whisper |
| `#546E7A` | Subdirs, transient prompt | gray-mid |
| `#65737E` | Path separator, `·`, doc tags | gray |
| `#486878` | Water catch-light | ocean w3 |
| `#3f5d6c` | Water shadow | ocean w4 |
| `#3d5968` | Water mid | ocean w6 |
| `#354f5c` | Water mid-deep | ocean w7 |
| `#2e4452` | Water deep | ocean w8 |
| `#89B4F7` | Branch icon + name | blue |
| `#ff7597` | Error state | diagnostic error |

---

## Files

| File | Purpose |
|------|---------|
| `prompt/ocean-harbor.omp.json` | oh-my-posh theme config |
| `prompt/README.md` | Install instructions |
| `prompt/preview.ps1` | Terminal preview script |
