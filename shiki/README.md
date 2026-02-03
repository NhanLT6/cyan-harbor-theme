# Ocean Harbor - Interactive Theme Editor

This directory contains the interactive web editor for the **Ocean Harbor** IntelliJ theme. It allows you to fine-tune colors and font styles with a live syntax-highlighted preview and save them directly back to your source XML.

## 🚀 Quick Start

1. **Install Dependencies** (First time only):
   ```bash
   npm install
   ```

2. **Launch the Editor**:
   ```bash
   npm run editor
   ```
   This command will:
   - Extract colors and configuration from `../ocean-harbor.xml`.
   - Convert the IntelliJ theme to Shiki format for the preview.
   - Generate the `theme-editor.html` interface.
   - Start a local server and open your browser automatically.

## 📝 Features

*   **Live Preview**: Real-time syntax highlighting for 10+ languages (C#, SQL, TypeScript, etc.).
*   **Synchronized Selection**: Click a language tab in the preview to auto-switch the configuration sidebar.
*   **Save to XML**: Click the **"Save to XML"** button to write your changes directly back to `ocean-harbor.xml`.
*   **🎨 Palette Tab**: View a complete breakdown of every color used in your theme and which tokens use them.
*   **Color Tracking**: Hover over any color swatch to see exactly where it's being used across all languages.
*   **Keyboard Friendly**: Navigate color swatches using arrow keys and confirm with Enter.

## 📁 Core Files

*   `extract-theme-colors.js` - Pulls data from source XML.
*   `convert-to-shiki.js` - Maps IntelliJ tokens to TextMate scopes for web preview.
*   `generate-interactive-editor.js` - Builds the editor HTML.
*   `editor-server.js` - Handles the file-system "Save" operation.
*   `comprehensive-samples.js` - Code samples for the preview tabs.

## 🏗️ Workflow

To update your theme:
1. Run `npm run editor`.
2. Adjust colors or font styles (bold/italic) in the sidebar.
3. Observe changes in the live preview.
4. Click **"Save to XML"** to apply changes to your IntelliJ source file.
