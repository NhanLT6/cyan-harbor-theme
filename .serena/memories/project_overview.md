# Ocean Harbor — Project Overview

**Purpose:** A custom dark color theme for JetBrains IDEs (primarily Rider/IntelliJ). Distributed as a `.jar` plugin.

**Source of truth:** `ocean-harbor.xml` — all syntax/semantic token colors live here.  
**UI chrome:** `ocean-harbor.theme.json` — JetBrains theme keys for editor chrome (tabs, toolbars, etc.)

## Key files
- `ocean-harbor.xml` — syntax highlight colors (~2000 lines of XML)
- `ocean-harbor.theme.json` — UI chrome colors
- `shiki/extract-theme-colors.js` — XML → `shiki/theme-data.json`
- `shiki/generate-interactive-editor.js` — `theme-data.json` → `shiki/theme-editor.html` (static preview)
- `shiki/theme-editor.html` — generated preview, open directly in browser (never edit)
- `shiki/theme-data.json` — generated color data, never edit
- `releases/` — built `.jar` files
- `package.json` (root) — version number for releases

## Color palette rules
- Sat ≤ 87%, lightness 55–83% for syntax tokens
- UI depth: chrome keys must be darker than `#263238` (use `#1e272c` for chrome, `#263238` for content)
- Two-tier depth model: Deep ocean `#1e272c` (window chrome) / Island surface `#263238` (content panels)
