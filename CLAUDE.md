# Cyan Harbor Theme - Development Documentation

**Last Updated:** 2026-01-18
**Project:** IntelliJ Theme with Web Preview & Interactive Editor

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Development History](#development-history)
4. [Technical Implementation](#technical-implementation)
5. [Key Features](#key-features)
6. [Build & Development](#build--development)
7. [Future Improvements](#future-improvements)

---

## 📖 Project Overview

**Cyan Harbor** is a pastel dark theme for JetBrains IDEs (IntelliJ, Rider, etc.) with oceanic blues, soft aqua, and gentle rose accents. It's designed for long coding sessions with harmonious colors that complement each other.

### Core Philosophy
- **Pastel Colors**: All syntax colors are soft and easy on the eyes (65-75% lightness)
- **Cool Base + Warm Accent**: Oceanic blues/cyans with soft rose operators
- **No Fighting Colors**: Every color supports others, nothing overpowers
- **Clear Structure**: Operators and methods are easily scannable

### Color Palette
- **Background**: `#263238` (dark blue-gray)
- **Foreground**: `#b8c5d0` (light gray-blue)
- **Primary Accent**: `#009688` (teal)
- **Methods**: `#7B9CE7` (pastel blue)
- **Keywords**: `#BFA7FF` (pastel purple)
- **Operators**: `#F8B4AB` (soft rose)
- **Strings**: `#90d89f` (soft green)
- **Class Names**: `#ffd97d` (soft yellow)

---

## 📁 Project Structure

```
cyan-harbor-theme/
├── shiki/                              # Web preview & interactive editor
│   ├── extract-theme-colors.js        # Extracts colors + token configs from XML
│   ├── convert-to-shiki.js            # IntelliJ XML → Shiki JSON converter
│   ├── generate-interactive-editor.js # Builds the editor interface
│   ├── editor-server.js               # Local server for serving UI and saving to XML
│   ├── comprehensive-samples.js       # Code samples for preview tabs
│   ├── cyan-harbor-shiki-theme.json   # Generated preview theme
│   ├── theme-data.json                # Extracted theme metadata
│   ├── theme-editor.html              # ⭐ Interactive theme editor UI
│   ├── package.json                   # Command: npm run editor
│   ├── package-lock.json
│   ├── node_modules/                  # .gitignored
│   └── README.md
│
├── releases/                          # Build artifacts
│   └── cyan-harbor.theme.jar
│
├── META-INF/                          # IntelliJ plugin metadata
│   └── plugin.xml
│
├── cyan-harbor.xml                    # ⭐ Source theme (IntelliJ format)
├── cyan-harbor.theme.json             # IntelliJ theme JSON
├── README.md                          # Main documentation
├── CLAUDE.md                          # This file
└── .gitignore
```

---

## 🕐 Development History

### Initial Setup
1. **IntelliJ Theme Created**
   - Base theme: Islands Dark (rounded corners, modern UI)
   - Custom syntax highlighting with pastel colors
   - 130+ color configurations
   - VCS integration (git status colors)
   - Optimized for C#, JavaScript, TypeScript, HTML, CSS, JSON, YAML, Markdown, Bash, XML

2. **Manual HTML Preview**
   - Created `theme-preview-old.html`
   - Manual HTML `<span>` tags for syntax highlighting
   - Interactive color customization with JavaScript
   - Color schema switcher (Teal Family, Morning Harbor, Sunset)
   - Complex to maintain, not using industry-standard tools

### Migration to Shiki (2026-01-18)

#### Problem
- Manual syntax highlighting was tedious and error-prone
- No easy way to preview theme on web
- Wanted to use industry-standard tools

#### Solution: Shiki
**Research Phase:**
- Evaluated: Prism.js, Highlight.js, Monaco Editor, CodeMirror, Shiki
- **Chose Shiki** because:
  - Uses TextMate grammars (same as VS Code)
  - Supports 190+ languages
  - Zero runtime JavaScript (generates static HTML with inline styles)
  - Can load custom themes programmatically
  - Perfect accuracy (VS Code's grammar engine)

**Complexity Assessment:**
- Installation: Very Easy (1 command: `npm install shiki`)
- Basic Usage: Very Easy (async shorthand or reusable instance)
- Custom Theme: Moderate (need to map IntelliJ → TextMate scopes)
- Overall Time: 3-6 hours to map theme

#### Implementation Steps

1. **Conversion Script** (`convert-to-shiki.js`)
   - Reads `cyan-harbor.xml`
   - Extracts colors and font styles
   - Maps IntelliJ token names → TextMate scopes
   - Example mappings:
     ```
     IntelliJ                    → TextMate Scope
     DEFAULT_KEYWORD             → keyword, storage.type
     DEFAULT_STRING              → string, string.quoted
     CSS.PROPERTY_NAME           → support.type.property-name.css
     JS.FUNCTION_CALL            → entity.name.function
     ```
   - Generates `cyan-harbor-shiki-theme.json` (61 token rules)

2. **Demo Generator** (`shiki-demo.js`)
   - Simple examples for 5 languages
   - Generates `shiki-preview.html` (for testing)

**Note:** Standalone preview feature removed in favor of integrated live preview in the interactive editor.

### Interactive Theme Editor (2026-01-18)

#### Problem
- Preview was read-only
- Wanted editing capabilities like the old manual preview
- Needed dropdown color pickers with theme colors + hex input
- Needed export functionality

### Live Theme Preview Updates (2026-01-19)

#### Problem
- Theme changes didn't reflect in preview without regenerating HTML
- User wanted real-time updates to see color/style changes instantly
- Previous assumption: Shiki couldn't do this due to static HTML generation

#### Solution: CSS Variables Approach
**Research findings:**
- Shiki v1.0+ supports CSS variables for dynamic theme switching
- Can generate HTML once with CSS variable references
- Update theme by changing CSS variable values
- No HTML regeneration needed!

#### Enhanced UX Features (2026-01-19)

**Immediate Preview Updates:**
- `change` event: Updates preview instantly when clicking swatches or adjusting hue
- `save` event: Confirms color choice and closes picker
- `cancel` event: Reverts to previous color if user closes without saving

**Keyboard Navigation:**
- Arrow Right/Down: Navigate to next swatch
- Arrow Left/Up: Navigate to previous swatch
- Enter: Save color and close picker
- Escape: Cancel changes and revert color
- Visual focus indicator with teal outline and scale animation

**Color Information & Discovery (2026-01-19):**
- **Color Usage Panel**: Each token shows which other tokens use the same color
- **Swatch Tooltips**: Hover over any swatch to see its hex code and which tokens use it
- **Color Name System**: Colors are labeled by their primary token usage
- **Reverse Mapping**: Easily find and reuse colors across different token types
- **Usage Statistics**: 18 unique colors, 9 shared across multiple tokens
- Example: Want to use the same color as HTML tags for CSS class names? Just look at the "Also used by" panel!

#### Implementation Steps

1. **Modified HTML Generation** (`generate-interactive-editor.js:31-42`)
   - Parse Shiki-generated HTML to extract inline color styles
   - Replace `color: #HEX` with `color: var(--theme-color-HEX)`
   - Add `data-color="HEX"` attributes to track which token uses which color
   - Track all unique colors used in the preview

2. **CSS Variables Injection** (`generate-interactive-editor.js:50-54`)
   - Generate CSS `:root` block with all color variables
   - Format: `--theme-color-BFA7FF: #BFA7FF;`
   - Inject into `<style>` tag at document root
   - Example:
     ```css
     :root {
       --theme-color-BFA7FF: #BFA7FF;
       --theme-color-90D89F: #90D89F;
       /* ... 18 colors total */
     }
     ```

3. **Real-Time Color Updates** (`generate-interactive-editor.js:564-576`)
   - When user picks a new color via Pickr:
     - Get old color from theme data
     - Update CSS variable: `document.documentElement.style.setProperty('--theme-color-OLD', newColor)`
     - Browser instantly re-renders all elements using that variable
     - No HTML regeneration needed!

4. **Font Style Updates** (`generate-interactive-editor.js:575-603`)
   - When user toggles bold/italic:
     - Query all spans with matching `data-color` attribute
     - Update `font-weight` and `font-style` directly on elements
     - Changes apply instantly across all preview tabs

5. **Reset Functionality** (`generate-interactive-editor.js:606-639`)
   - Reset all CSS variables to original theme colors
   - Reset all font styles to defaults
   - Query spans by `data-color` and restore original styling

#### Technical Details

**Color Mapping:**
- 18 unique colors detected in Shiki output
- Each color gets a CSS variable: `--theme-color-{HEX}`
- HTML references variables instead of hard-coded colors

**Font Style Application:**
- Uses `data-color` attribute as selector
- Applies `font-weight: bold` / `normal`
- Applies `font-style: italic` / `normal`
- Works across all 10 language previews simultaneously

**Performance:**
- CSS variable updates are instant (browser-native)
- No HTML parsing or regeneration
- No need for Shiki runtime in browser
- Lightweight: only CSS property changes

#### Benefits
✅ **Real-time preview** - Changes visible instantly
✅ **No regeneration** - No need to call Shiki again
✅ **Cross-language** - Updates all preview tabs at once
✅ **Browser-native** - Uses CSS variables (fast)
✅ **Maintainable** - Clean separation of data and presentation

#### Research: Color Picker Libraries
**Evaluated:**
- vanilla-picker (simple, alpha support)
- **Pickr by @simonwep** ✅ CHOSEN
  - 20KB minified
  - Zero dependencies
  - Supports custom swatches (perfect for theme colors)
  - Manual hex input
  - Multiple themes (using 'nano')
  - Active maintenance
- Coloris (lightweight, vanilla ES6)
- jscolor (single file)
- vanilla-colorful (2.7KB, web component)

**Chose Pickr** because:
- Perfect balance of features and size
- Excellent swatch support for our 108 theme colors
- Clean API
- Good documentation
- Using "monolith" theme for spacious interface

#### Implementation

1. **Color Extraction** (`extract-theme-colors.js`)
   - Parses `cyan-harbor.xml`
   - Extracts all 108 unique hex colors
   - Maps 51 token configurations across 11 language categories:
     ```
     General (23 tokens):
     - Keywords, strings, numbers, comments
     - Functions, classes, interfaces
     - Variables, parameters, fields
     - Operators, braces, brackets, parentheses

     Language-Specific:
     - CSS (7): Classes, IDs, properties, pseudo-classes
     - HTML (2): Tags, attributes
     - JavaScript (4): this/super, null/undefined, modules, regex
     - TypeScript (1): Type parameters
     - JSON (2): Keys, keywords
     - YAML (2): Keys, values
     - Markdown (5): Headers, bold, italic, code, links
     - Bash (1): Commands
     - XML (1): Tags
     - C# (3): Namespaces, enums, delegates
     ```
   - Outputs `theme-data.json`

2. **Interactive Editor Generator** (`generate-interactive-editor.js`)
   - Embeds Pickr color picker library
   - Creates HTML with:
     - **Left Panel**: Language selector + token configuration controls
     - **Right Panel**: Live syntax-highlighted preview (10 languages)
     - **Header**: Reduced to toolbar height (48px), Reset + Export buttons
   - Each token has:
     - Color picker with 108 swatches
     - Hex input field
     - Bold/Italic toggle buttons
   - Export modal with:
     - JSON preview
     - Copy to clipboard
     - Download as file

3. **Package Updates**
   - Added `@simonwep/pickr` dependency
   - Added npm scripts:
     ```json
     {
       "convert": "node convert-to-shiki.js",
       "theme-preview": "node generate-theme-preview.js",
       "editor": "node extract-theme-colors.js && node generate-interactive-editor.js && start theme-editor.html"
     }
     ```

---

## 🔧 Technical Implementation

### IntelliJ Theme Format (cyan-harbor.xml)

```xml
<scheme name="Cyan Harbor" version="142" parent_scheme="Islands Dark">
  <colors>
    <option name="TEXT" value="263238" />
    <option name="CARET_COLOR" value="e6cc00" />
    <option name="SELECTION_BACKGROUND" value="314549" />
    <!-- ... 130+ color definitions -->
  </colors>

  <attributes>
    <option name="DEFAULT_KEYWORD">
      <value>
        <option name="FOREGROUND" value="bfa7ff" />
        <option name="FONT_TYPE" value="2" /> <!-- 0=normal, 1=bold, 2=italic, 3=bold+italic -->
      </value>
    </option>
    <!-- ... token definitions -->
  </attributes>
</scheme>
```

### Shiki Theme Format (cyan-harbor-shiki-theme.json)

```json
{
  "name": "Cyan Harbor",
  "type": "dark",
  "colors": {
    "editor.background": "#263238",
    "editor.foreground": "#b8c5d0"
  },
  "tokenColors": [
    {
      "name": "Keyword",
      "scope": ["keyword", "storage.type"],
      "settings": {
        "foreground": "#bfa7ff",
        "fontStyle": "italic"
      }
    }
  ]
}
```

### Export Format (theme-editor.html → JSON)

```json
{
  "name": "Cyan Harbor (Custom)",
  "timestamp": "2026-01-18T15:30:00.000Z",
  "configurations": {
    "General": {
      "DEFAULT_KEYWORD": {
        "label": "Keywords",
        "description": "Language keywords (if, for, class, etc.)",
        "foreground": "#BFA7FF",
        "fontStyle": "italic"
      }
    },
    "CSS": { /* ... */ },
    "JavaScript": { /* ... */ }
  }
}
```

---

## ✨ Key Features

### IntelliJ Theme
- ✅ Pastel color philosophy
- ✅ 130+ color configurations
- ✅ Islands Dark parent (rounded corners)
- ✅ VCS integration
- ✅ Supports 18+ languages
- ✅ Optimized for C#, TypeScript, JavaScript

### Interactive Theme Editor with Live Preview
- ✅ Edit 51 token types across 11 languages
- ✅ Pickr color picker with 108 theme swatches
- ✅ Manual hex color input
- ✅ Bold/Italic font style toggles
- ✅ **Live preview for 10 languages** (instant updates via CSS variables)
- ✅ **Real-time color changes** (no HTML regeneration needed)
- ✅ **Real-time font style changes** (bold/italic apply instantly)
- ✅ Export to JSON
- ✅ Copy to clipboard
- ✅ Download as file
- ✅ Reset to defaults

---

## 🛠️ Build & Development

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Setup
```bash
cd shiki/
npm install
```

### Development Commands

**Launch interactive editor with live preview:**
```bash
cd shiki/
npm run editor
# 1. Extracts data → 2. Converts theme → 3. Builds UI → 4. Starts Save-to-XML server
```

### Updating the Theme
1. Run `npm run editor`.
2. Tweak colors/styles in the browser.
3. Click "Save to XML" to update `cyan-harbor.xml`.
4. Refresh browser (or restart `npm run editor`) to see changes fully synced.

---

## 🚀 Future Improvements

### Short-term
- [ ] Import custom theme JSON back into editor
- [ ] Undo/redo functionality
- [ ] Color history (recently used colors)
- [ ] Search/filter tokens

### Medium-term
- [ ] Preset theme variations (light mode, high contrast)
- [ ] Accessibility checker (WCAG contrast ratios)
- [ ] Side-by-side comparison mode

---

## 📚 Resources

### Documentation
- [Shiki Documentation](https://shiki.style/)
- [Shiki Themes Gallery](https://shiki.style/themes)
- [Load Custom Themes](https://shiki.style/guide/load-theme)
- [Pickr Documentation](https://github.com/simonwep/pickr)
- [TextMate Grammars](https://github.com/shikijs/textmate-grammars-themes)
- [VS Code Color Theme Guide](https://code.visualstudio.com/api/extension-guides/color-theme)

### Conversion Tools
- [JetBrains colorSchemeTool](https://github.com/JetBrains/colorSchemeTool)
- [themecreator](https://mswift42.github.io/themecreator/)
- [code-theme-converter](https://github.com/tobiastimm/code-theme-converter)

### Related Projects
- [VSCode to Prism Converter](https://prism.dotenv.dev/)
- [TextMate Grammar Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)

---

## 🎯 Key Learnings

### What Worked Well
1. **Shiki Choice**: Perfect for static HTML generation with accurate highlighting
2. **Pickr Library**: Excellent color picker with swatch support
3. **JSON Export**: Simple, portable format for theme customization
4. **Two-tier Structure**: Read-only preview + interactive editor
5. **Color Extraction**: Automated extraction from XML saved time

### Challenges & Solutions
1. **Challenge**: Mapping IntelliJ tokens to TextMate scopes
   - **Solution**: Created comprehensive mapping table, referenced VS Code docs

2. **Challenge**: RegEx escaping in Node.js for parsing XML
   - **Solution**: Used proper escaping with `replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`

3. **Challenge**: Managing 108 colors across 51 tokens
   - **Solution**: Extracted to JSON, used as single source of truth

4. **Challenge**: Keeping preview in sync with edits
   - **Note**: Currently using initial state, full re-rendering would require server or bundler

### Best Practices Established
- Keep IntelliJ XML as source of truth
- Generate all web artifacts from XML
- Use npm scripts for consistent workflows
- Document all conversions and mappings
- Separate concerns: extraction → generation → presentation
- Use CSS variables for dynamic theme updates (no runtime JS needed)
- Add data attributes for targeted DOM manipulation
- Leverage browser-native features over complex JS solutions

---

## 📝 Notes for Future Sessions

### When Returning to This Project

1. **Understanding the Flow:**
   ```
   cyan-harbor.xml (source)
   ↓ [extract-theme-colors.js]
   theme-data.json (metadata)
   ↓ [convert-to-shiki.js]
   cyan-harbor-shiki-theme.json (preview theme)
   ↓ [generate-interactive-editor.js]
   theme-editor.html (UI)
   ↓ [editor-server.js]
   XML saving capability
   ```

2. **Common Tasks:**
   - Edit colors: Modify `cyan-harbor.xml`, run `npm run convert`
   - Add language: Update all 3 generators + convert script
   - Test changes: `npm run editor`

3. **File Locations:**
   - Source: `cyan-harbor.xml` (root)
   - Generators: `shiki/*.js`
   - Output: `shiki/*.html`

4. **Important:** Always edit via the **Interactive Editor** or directly in `cyan-harbor.xml`.

### Active Issues
- None currently

### Questions for Next Session
- Export back to IntelliJ XML format?
- Add more language categories?
- Import custom theme JSON back into editor?

---

**Generated by:** Claude (Anthropic)
**Session Date:** 2026-01-18
**Status:** Active Development
```
