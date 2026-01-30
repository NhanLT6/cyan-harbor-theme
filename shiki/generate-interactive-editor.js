/**
 * Generates interactive theme editor with live preview
 */

const { createHighlighter } = require('shiki');
const fs = require('fs');

const cyanHarborTheme = require('./cyan-harbor-shiki-theme.json');
const themeData = require('./theme-data.json');
const comprehensiveSamples = require('./comprehensive-samples');

// Use comprehensive code examples that showcase ALL tokens
const codeExamples = comprehensiveSamples;

async function generateEditor() {
  console.log('🚀 Generating interactive theme editor...\n');

  const highlighter = await createHighlighter({
    themes: [cyanHarborTheme],
    langs: Object.keys(codeExamples)
  });

  const languages = Object.keys(codeExamples);
  const languageLabels = {
    csharp: 'C#', typescript: 'TypeScript', javascript: 'JavaScript',
    html: 'HTML', css: 'CSS', json: 'JSON', yaml: 'YAML',
    markdown: 'Markdown', bash: 'Bash', xml: 'XML', sql: 'SQL Server'
  };

  // Generate initial previews with CSS variables
  const initialPreviews = {};
  const colorMapping = new Map(); // Track which colors are used
  const colorUsageMap = new Map(); // Track which tokens use each color

  // Build color usage map
  Object.entries(themeData.languageConfigs).forEach(([lang, configs]) => {
    Object.entries(configs).forEach(([key, config]) => {
      const color = config.foreground;
      if (color) {
        if (!colorUsageMap.has(color)) {
          colorUsageMap.set(color, []);
        }
        colorUsageMap.get(color).push({
          lang: lang,
          key: key,
          label: config.label,
          fullLabel: lang === 'General' ? config.label : `${lang}: ${config.label}`
        });
      }
    });
  });

  console.log(`\n📊 Color usage analysis:`);
  console.log(`   Total unique colors: ${colorUsageMap.size}`);
  console.log(`   Colors used by multiple tokens: ${Array.from(colorUsageMap.values()).filter(tokens => tokens.length > 1).length}`);

  for (const lang of languages) {
    console.log(`Generating preview for ${lang}...`);
    let html = highlighter.codeToHtml(codeExamples[lang], {
      lang,
      theme: 'Cyan Harbor'
    });

    // Use per-token variables to decouple styling
    // We add data-token attribute for font-style switching and live color updates
    // Regex matches: style="... color: var(--token-KEY) ..." allowing other styles before/after
    html = html.replace(/<span ([^>]*)style="([^"]*)\bcolor:\s*var\(--token-([^)]+)\)([^"]*)"/g, (match, otherAttrs, preStyle, tokenKey, postStyle) => {
      // Reconstruct the span with the data-token attribute
      return `<span data-token="${tokenKey}" ${otherAttrs}style="${preStyle}color: var(--token-${tokenKey})${postStyle}"`;
    });

    initialPreviews[lang] = html;
  }

  // Generate Theme Palette Preview
  console.log('Generating Theme Palette...');
  let paletteHtml = `
    <div class="palette-container">
      <div class="palette-header">
        <h2 class="palette-title">Theme Color Palette</h2>
        <p class="palette-desc">A complete breakdown of every color used in the current theme. Hover to see exact token keys.</p>
      </div>
      <div class="palette-grid">
  `;

  // Sort colors to make them look nice (by usage count or hex?)
  const sortedColors = Array.from(colorUsageMap.keys()).sort((a, b) => {
    return colorUsageMap.get(b).length - colorUsageMap.get(a).length;
  });

  sortedColors.forEach(color => {
    const usages = colorUsageMap.get(color);
    paletteHtml += `
      <div class="palette-card">
        <div class="palette-swatch" style="background-color: var(--theme-color-${color.substring(1)})"></div>
        <div class="palette-info">
          <div class="palette-hex">${color}</div>
          <div class="palette-usage-count">${usages.length} tokens</div>
          <div class="palette-usage-list">
            ${usages.map(u => `
              <div class="palette-usage-item" title="${u.lang}.${u.key}">
                <span class="usage-lang-tag">${u.lang}</span>
                <span class="usage-label">${u.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  });
  paletteHtml += `</div></div>`;
  // Generate list of all token variables for :root
  const allTokens = [];
  Object.values(themeData.languageConfigs).forEach(configs => {
    Object.entries(configs).forEach(([key, config]) => {
      const cssVar = `token-${key.replace(/\./g, '_')}`;
      allTokens.push({ varName: cssVar, color: config.foreground });
    });
  });

  console.log(`\n📊 Generated ${allTokens.length} decoupled token variables`);

  // Create CSS variables for all tokens
  const cssVariables = allTokens
    .map(t => `  --${t.varName}: ${t.color};`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyan Harbor - Interactive Theme Editor</title>

  <!-- Pickr CSS -->
  <link rel="stylesheet" href="./node_modules/@simonwep/pickr/dist/themes/monolith.min.css">

  <style>
    /* Theme color CSS variables for live updates */
    :root {
${cssVariables}
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1a1f24;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header - Reduced height */
    .header {
      background: linear-gradient(135deg, #009688, #00695c);
      padding: 12px 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 48px;
    }

    .header h1 {
      color: white;
      font-size: 1.2em;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 6px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-primary {
      background: white;
      color: #009688;
    }

    .btn-primary:hover {
      background: #f0f0f0;
    }

    /* Main Layout */
    .main-container {
      display: grid;
      grid-template-columns: 350px 1fr;
      flex: 1;
      overflow: hidden;
    }

    /* Config Panel */
    .config-panel {
      background: #2e3c43;
      border-right: 1px solid #37474f;
      overflow-y: auto;
      padding: 20px;
    }

    .lang-selector {
      margin-bottom: 20px;
    }

    .lang-selector label {
      display: block;
      font-size: 0.85em;
      color: #80cbc4;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .lang-selector select {
      width: 100%;
      background: #263238;
      color: #d9e6e6;
      border: 1px solid #009688;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.9em;
      cursor: pointer;
    }

    .config-section {
      margin-bottom: 25px;
    }

    .config-section h3 {
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #009688;
      margin-bottom: 16px;
      border-bottom: 1px solid #37474f;
      padding-bottom: 8px;
    }

    /* Collapsible Section */
    .config-section-collapsible {
      margin-bottom: 24px;
    }

    .config-section-collapsible summary {
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 600;
      color: #009688;
      background: #1e272c;
      border: 1px solid #37474f;
      border-radius: 6px;
      user-select: none;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .config-section-collapsible summary::-webkit-details-marker {
      display: none;
    }

    .config-section-collapsible summary::after {
      content: '▼';
      font-size: 0.8em;
      transition: transform 0.2s;
    }

    .config-section-collapsible[open] summary::after {
      transform: rotate(180deg);
    }

    .config-section-collapsible[open] summary {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .collapsible-content {
      padding: 16px 0;
      border: 1px solid #37474f;
      border-top: none;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      background: rgba(30, 39, 44, 0.5);
      margin-top: -1px;
    }

    .config-item {
      margin-bottom: 16px;
      background: #263238;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #37474f;
    }

    .config-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .config-item-label {
      font-size: 0.85em;
      color: #b8c5d0;
      font-weight: 500;
    }

    .config-item-desc {
      font-size: 0.75em;
      color: #607d8b;
      margin-bottom: 8px;
    }

    .keyboard-hint {
      font-size: 0.7em;
      color: #546e7a;
      font-style: italic;
      margin-top: 12px;
      padding: 8px;
      background: rgba(0, 150, 136, 0.05);
      border-left: 2px solid #009688;
      border-radius: 3px;
    }

    .config-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .color-preview {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 2px solid #37474f;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .color-preview:hover {
      border-color: #009688;
    }

    .font-style-toggle {
      display: flex;
      gap: 4px;
    }

    .font-style-btn {
      background: #1e272c;
      border: 1px solid #37474f;
      color: #80cbc4;
      padding: 4px 8px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.75em;
      font-weight: 500;
      transition: all 0.2s;
    }

    .font-style-btn.active {
      background: #009688;
      color: white;
      border-color: #009688;
    }

    /* Preview Panel */
    .preview-panel {
      display: flex;
      flex-direction: column;
      background: #263238;
      overflow: hidden;
    }

    .preview-tabs {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
      border-bottom: 2px solid #37474f;
      background: #1e272c;
      flex-wrap: wrap;
    }

    .preview-tab {
      background: transparent;
      border: none;
      color: #80cbc4;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .preview-tab:hover {
      background: rgba(0, 150, 136, 0.1);
      color: #009688;
    }

    .preview-tab.active {
      color: #009688;
      border-bottom-color: #009688;
    }

    .preview-content {
      flex: 1;
      overflow: auto;
    }

    .preview-content pre {
      margin: 0 !important;
      padding: 24px !important;
      font-size: 13px;
      line-height: 1.6;
    }

    .preview-content code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    }

    /* Pickr Customization */
    .pcr-app {
      background: #263238 !important;
      border: 1px solid #009688 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    }

    .pcr-app .pcr-interaction .pcr-result {
      background: #1e272c !important;
      color: #b8c5d0 !important;
      border: 1px solid #37474f !important;
    }

    .pcr-app .pcr-interaction input {
      background: #1e272c !important;
      color: #b8c5d0 !important;
      border-color: #37474f !important;
    }

    .pcr-app .pcr-swatches {
      max-height: 200px;
      overflow-y: auto;
    }

    .pcr-app .pcr-swatches > button {
      margin: 2px;
      transition: transform 0.1s, box-shadow 0.1s;
    }

    .pcr-app .pcr-swatches > button:focus {
      outline: 2px solid #009688 !important;
      outline-offset: 2px;
      transform: scale(1.1);
      box-shadow: 0 0 8px rgba(0, 150, 136, 0.5);
    }

    /* Color info panel */
    .color-info-panel {
      background: #1e272c;
      padding: 12px;
      margin: 8px 0;
      border-radius: 4px;
      border: 1px solid #37474f;
      font-size: 0.8em;
    }

    .color-info-panel h4 {
      color: #80cbc4;
      font-size: 0.9em;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .color-info-panel .current-color {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      padding: 6px;
      background: #263238;
      border-radius: 3px;
    }

    .color-info-panel .current-color .color-box {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid #37474f;
    }

    .color-info-panel .current-color .color-hex {
      font-family: 'Consolas', monospace;
      color: #b8c5d0;
      font-weight: 500;
    }

    .color-info-panel .usage-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 150px;
      overflow-y: auto;
    }

    .color-info-panel .usage-list li {
      padding: 4px 6px;
      margin: 2px 0;
      background: rgba(0, 150, 136, 0.05);
      border-left: 2px solid #009688;
      border-radius: 2px;
      color: #b8c5d0;
      font-size: 0.9em;
    }

    .color-info-panel .usage-list li.current {
      background: rgba(0, 150, 136, 0.15);
      font-weight: 600;
    }

    .color-info-panel .no-usage {
      color: #607d8b;
      font-style: italic;
      padding: 4px;
    }

    /* Swatch tooltips */
    .pcr-app .pcr-swatches > button {
      position: relative;
    }

    .pcr-app .pcr-swatches > button:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #1e272c;
      color: #b8c5d0;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      border: 1px solid #009688;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pcr-app .pcr-swatches > button:hover::before {
      content: '';
      position: absolute;
      bottom: calc(100% + 2px);
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #009688;
      pointer-events: none;
      z-index: 1001;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #1e272c;
    }

    ::-webkit-scrollbar-thumb {
      background: #009688;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #00796b;
    }

    /* Export Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: #2e3c43;
      border: 1px solid #009688;
      border-radius: 8px;
      padding: 24px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-header h2 {
      color: #009688;
      font-size: 1.2em;
    }

    .modal-close {
      background: none;
      border: none;
      color: #80cbc4;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
    }

    .modal-body textarea {
      width: 100%;
      min-height: 300px;
      background: #263238;
      color: #b8c5d0;
      border: 1px solid #37474f;
      border-radius: 4px;
      padding: 12px;
      font-family: 'Consolas', monospace;
      font-size: 12px;
      resize: vertical;
    }

    .modal-footer {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    /* Palette Tab Styles */
    .palette-container {
      padding: 30px;
      color: #b8c5d0;
    }

    .palette-header {
      margin-bottom: 30px;
      border-bottom: 1px solid #37474f;
      padding-bottom: 15px;
    }

    .palette-title {
      color: #009688;
      font-size: 1.5em;
      margin-bottom: 8px;
    }

    .palette-desc {
      color: #607d8b;
      font-size: 0.9em;
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .palette-card {
      background: #1e272c;
      border: 1px solid #37474f;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .palette-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      border-color: #009688;
    }

    .palette-swatch {
      height: 100px;
      width: 100%;
      border-bottom: 1px solid #37474f;
    }

    .palette-info {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .palette-hex {
      font-family: 'Consolas', monospace;
      font-weight: bold;
      font-size: 1.1em;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .palette-usage-count {
      font-size: 0.8em;
      color: #009688;
      margin-bottom: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .palette-usage-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 150px;
      overflow-y: auto;
    }

    .palette-usage-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85em;
      background: rgba(0,0,0,0.2);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .usage-lang-tag {
      background: #2e3c43;
      color: #80cbc4;
      font-size: 0.75em;
      padding: 1px 4px;
      border-radius: 2px;
      font-weight: bold;
      min-width: 70px;
      text-align: center;
    }

    .usage-label {
      color: #b8c5d0;
    }

    @media (max-width: 1024px) {
      .main-container {
        grid-template-columns: 1fr;
      }

      .config-panel {
        border-right: none;
        border-bottom: 1px solid #37474f;
        max-height: 400px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌊 Cyan Harbor - Theme Editor</h1>
    <div class="header-actions">
      <button class="btn" onclick="resetTheme()">Reset</button>
      <button class="btn btn-primary" onclick="saveToXml()">Save to XML</button>
    </div>
  </div>

  <div class="main-container">
    <div class="config-panel">
      <div class="lang-selector">
        <label>Select Language:</label>
        <select id="languageSelect" onchange="switchLanguage()">
          ${Object.keys(themeData.languageConfigs).filter(lang => lang !== 'General').map(lang =>
    `<option value="${lang}">${languageLabels[lang] || lang}</option>`
  ).join('')}
        </select>
      </div>


      <div id="configList"></div>
    </div>
    <div class="preview-panel">
      <div class="preview-tabs">
        ${languages.map((lang, idx) => `
          <button id="tab-${lang}" class="preview-tab ${idx === 0 ? 'active' : ''}" onclick="switchPreview('${lang}')">
            ${languageLabels[lang]}
          </button>
        `).join('')}
        <button id="tab-palette" class="preview-tab" onclick="switchPreview('palette')">🎨 Palette</button>
      </div>
      <div class="preview-content" id="previewContent">
        ${Object.entries(initialPreviews).map(([lang, html], idx) => `
          <div id="preview-${lang}" class="preview-pane" style="display: ${idx === 0 ? 'block' : 'none'}">
            ${html}
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  </div>

  <!-- Pickr JS -->
  <script src="./node_modules/@simonwep/pickr/dist/pickr.min.js"></script>

  <script>
    // Theme data
    const themeData = ${JSON.stringify(themeData)};

    // Color usage map: which tokens use each color
    const colorUsageMap = ${JSON.stringify(Object.fromEntries(colorUsageMap))};

    // Map preview language IDs to config language keys
    const PREVIEW_TO_CONFIG_MAP = {
      'csharp': 'C#',
      'sql': 'SQL',
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'yaml': 'YAML',
      'markdown': 'Markdown',
      'bash': 'Bash',
      'xml': 'XML'
    };

    // Current theme state
    const currentTheme = JSON.parse(JSON.stringify(themeData.languageConfigs));
    const pickrInstances = {};
    let currentLanguage = 'C#';
    let currentPreview = '${languages[0]}';

    // Create mapping from token keys to their ORIGINAL colors (never changes)
    const tokenOriginalColorMap = new Map();
    Object.entries(themeData.languageConfigs).forEach(([lang, configs]) => {
      Object.entries(configs).forEach(([key, config]) => {
        const fullKey = \`\${lang}.\${key}\`;
        tokenOriginalColorMap.set(fullKey, config.foreground);
      });
    });

    // Initialize
    renderConfigList();

    function switchLanguage() {
      const select = document.getElementById('languageSelect');
      currentLanguage = select.value;
      
      // Update preview tab to match selected config language
      const previewLang = Object.keys(PREVIEW_TO_CONFIG_MAP).find(k => PREVIEW_TO_CONFIG_MAP[k] === currentLanguage);
      if (previewLang) {
        switchPreview(previewLang, false);
      }
      
      renderConfigList();
    }

    function getColorNameFromUsage(color) {
      const usage = colorUsageMap[color] || [];
      if (usage.length === 0) return 'Unused';
      if (usage.length === 1) return usage[0].label;
      return \`\${usage[0].label} +\${usage.length - 1}\`;
    }

    function renderConfigList() {
      const container = document.getElementById('configList');
      const generalConfigs = currentTheme['General'] || {};
      const specificConfigs = currentTheme[currentLanguage] || {};

      if (Object.keys(generalConfigs).length === 0 && Object.keys(specificConfigs).length === 0) {
        container.innerHTML = '<p style="color: #607d8b; font-size: 0.85em;">No configurations available.</p>';
        return;
      }

      let htmlContent = '';

      // Render General Tokens Section (Collapsible)
      if (Object.keys(generalConfigs).length > 0) {
        htmlContent += '<details class="config-section-collapsible">';
        htmlContent += '<summary>Global Tokens</summary>';
        htmlContent += '<div class="collapsible-content">';
        htmlContent += renderTokenList(generalConfigs, 'General');
        htmlContent += '</div></details>';
      }

      // Render Language Specific Section
      if (Object.keys(specificConfigs).length > 0) {
        htmlContent += \`<div class="config-section"><h3>\${currentLanguage} Tokens</h3>\`;
        htmlContent += renderTokenList(specificConfigs, currentLanguage);
        htmlContent += '</div>';
      }

      container.innerHTML = htmlContent;

      // Initialize color pickers for both sets
      Object.entries(generalConfigs).forEach(([key, config]) => initColorPicker(key, config, 'General'));
      Object.entries(specificConfigs).forEach(([key, config]) => initColorPicker(key, config, currentLanguage));
    }

    function renderTokenList(configs, sectionLang) {
      return Object.entries(configs).map(([key, config]) => {
        const id = \`\${sectionLang}_\${key}\`.replace(/\\./g, '_');
        const currentColor = config.foreground;
        const colorUsage = colorUsageMap[currentColor] || [];

        return \`
          <div class="config-item">
            <div class="config-item-header">
              <span class="config-item-label">\${config.label}</span>
            </div>
            <div class="config-item-desc">\${config.description}</div>

            <div class="color-info-panel">
              <h4>Current Color</h4>
              <div class="current-color">
                <div class="color-box" style="background-color: \${currentColor}"></div>
                <span class="color-hex">\${currentColor}</span>
              </div>
              <h4>Also used by:</h4>
              \${colorUsage.length > 0 ? \`
                <ul class="usage-list">
                  \${colorUsage.map(u => \`
                    <li class="\${u.lang === sectionLang && u.key === key ? 'current' : ''}">\${u.fullLabel}</li>
                  \`).join('')}
                </ul>
              \` : \`
                <div class="no-usage">No other tokens use this color</div>
              \`}
            </div>

            <div class="config-controls">
              <div class="color-preview" id="color-\${id}" style="background-color: \${currentColor}" title="Click to change color"></div>
              <div class="font-style-toggle">
                <button class="font-style-btn \${config.fontStyle?.includes('bold') ? 'active' : ''}"
                        onclick="toggleFontStyle('\${key}', 'bold', '\${sectionLang}')">B</button>
                <button class="font-style-btn \${config.fontStyle?.includes('italic') ? 'active' : ''}"
                        onclick="toggleFontStyle('\${key}', 'italic', '\${sectionLang}')" style="font-style: italic;">I</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function initColorPicker(key, config, sectionLang) {
      const id = \`\${sectionLang}_\${key}\`.replace(/\\./g, '_');
      const el = document.getElementById(\`color-\${id}\`);
      if (!el) return;

      const pickrKey = \`\${sectionLang}_\${key}\`;
      // Destroy existing instance
      if (pickrInstances[pickrKey]) {
        pickrInstances[pickrKey].destroyAndRemove();
      }

      const pickr = Pickr.create({
        el: el,
        theme: 'monolith',
        default: config.foreground,
        swatches: themeData.allColors,
        components: {
          preview: true,
          opacity: false,
          hue: true,
          interaction: {
            hex: true,
            input: true,
            save: true,
            cancel: true
          }
        }
      });

      pickrInstances[pickrKey] = pickr;

      const fullKey = \`\${sectionLang}.\${key}\`;
      const originalColor = tokenOriginalColorMap.get(fullKey);

      // Update preview immediately when color changes (swatch click, hex input, hue change)
      pickr.on('change', (color) => {
        // Use toHEXA().toString() to be safe, then ensure we have a hash
        let hex = color.toHEXA().toString();
        if (!hex.startsWith('#')) hex = '#' + hex;
        
        // Convert to 6-digit hex if it's 8-digit (remove alpha) for consistency
        if (hex.length === 9) hex = hex.substring(0, 7);

        // Update current theme data
        currentTheme[sectionLang][key].foreground = hex;

        // Update CSS variable (Decoupled)
        const tokenKeySanitized = key.replace(/\./g, '_');
        const cssVarName = '--token-' + tokenKeySanitized;
        document.documentElement.style.setProperty(cssVarName, hex);

        // Safety fallback: Update all spans matching this token across ALL tabs
        const allSpans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');
        allSpans.forEach(span => {
          span.style.color = hex;
        });

        // Update preview box in sidebar
        el.style.backgroundColor = hex;
        
        // Update labels in sidebar
        const itemEl = el.closest('.config-item');
        if (itemEl) {
          const hexLabel = itemEl.querySelector('.color-hex');
          const boxLabel = itemEl.querySelector('.color-box');
          if (hexLabel) hexLabel.innerText = hex.toUpperCase();
          if (boxLabel) boxLabel.style.backgroundColor = hex;
        }
        
        console.log('Live sync: ' + tokenKeySanitized + ' -> ' + hex);
      });

      // Save button confirms the color choice and closes picker
      pickr.on('save', (color) => {
        const hex = color.toHEXA().toString();

        // Update theme data permanently
        currentTheme[sectionLang][key].foreground = hex;

        console.log(\`✅ Saved \${key}: \${originalColor} → \${hex}\`);

        // Re-render config list to update color info panel
        pickr.hide();
        renderConfigList();
      });

      // If user cancels (closes without saving), revert to previous color
      pickr.on('cancel', () => {
        const currentColor = currentTheme[sectionLang][key].foreground;

        // Revert CSS variable to the saved color
        const tokenKeySanitized = key.replace(/\./g, '_');
        const cssVarName = '--token-' + tokenKeySanitized;
        document.documentElement.style.setProperty(cssVarName, currentColor);

        // Safety fallback
        const spans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');
        spans.forEach(span => {
          span.style.color = currentColor;
        });

        // Revert preview box
        el.style.backgroundColor = currentColor;

        // Re-render to ensure color info is current
        renderConfigList();
      });

      // Add keyboard navigation for swatches and tooltips
      pickr.on('show', () => {
        const pickerRoot = pickr.getRoot();
        const swatchesContainer = pickerRoot.app.querySelector('.pcr-swatches');

        if (swatchesContainer) {
          let currentSwatchIndex = -1;
          const swatchButtons = Array.from(swatchesContainer.querySelectorAll('button'));

          // Add tooltips to swatches showing which tokens use each color
          swatchButtons.forEach(button => {
            // Pickr sets background-color for swatches
            const colorStyle = button.style.backgroundColor || button.style.color;
            if (colorStyle) {
              // Convert rgb/rgba to hex
              let hexColor = colorStyle;
              if (colorStyle.startsWith('rgb')) {
                const rgb = colorStyle.match(/\\d+/g);
                if (rgb && rgb.length >= 3) {
                  hexColor = '#' + rgb.slice(0, 3).map(x => {
                    const hex = parseInt(x).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                  }).join('').toUpperCase();
                }
              } else if (colorStyle.startsWith('#')) {
                hexColor = colorStyle.toUpperCase();
              }

              const usage = colorUsageMap[hexColor] || [];
              if (usage.length > 0) {
                const colorName = getColorNameFromUsage(hexColor);
                const tooltip = usage.length === 1
                  ? \`\${hexColor} - \${usage[0].fullLabel}\`
                  : \`\${hexColor} - \${colorName} (\${usage.length} tokens)\`;
                button.setAttribute('data-tooltip', tooltip);
              } else {
                button.setAttribute('data-tooltip', hexColor);
              }
            }
          });

          const keyHandler = (e) => {
            if (!swatchButtons.length) return;

            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              currentSwatchIndex = (currentSwatchIndex + 1) % swatchButtons.length;
              swatchButtons[currentSwatchIndex].focus();
              swatchButtons[currentSwatchIndex].click();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              currentSwatchIndex = currentSwatchIndex <= 0 ? swatchButtons.length - 1 : currentSwatchIndex - 1;
              swatchButtons[currentSwatchIndex].focus();
              swatchButtons[currentSwatchIndex].click();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              pickr.applyColor();
              pickr.hide();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              // Trigger cancel event
              pickr._emit('cancel');
              pickr.hide();
            }
          };

          // Attach keyboard listener to picker
          pickerRoot.app.addEventListener('keydown', keyHandler);

          // Store handler for cleanup
          pickr._keyHandler = keyHandler;
          pickr._pickerRoot = pickerRoot;
        }
      });

      // Cleanup keyboard listener when picker closes
      pickr.on('hide', () => {
        if (pickr._keyHandler && pickr._pickerRoot) {
          pickr._pickerRoot.app.removeEventListener('keydown', pickr._keyHandler);
        }
      });

      // Store instance by both keys to ensure reliable cleanup/access
      pickrInstances[pickrKey] = pickr;
      pickrInstances[key] = pickr;
    }

    function toggleFontStyle(key, style, sectionLang) {
      const config = currentTheme[sectionLang][key];
      const currentStyles = (config.fontStyle || '').split(' ').filter(Boolean);
      const fullKey = \`\${currentLanguage}.\${key}\`;

      // Get the ORIGINAL color (used in HTML data-color attribute)
      const originalColor = tokenOriginalColorMap.get(fullKey);

      if (currentStyles.includes(style)) {
        config.fontStyle = currentStyles.filter(s => s !== style).join(' ');
      } else {
        currentStyles.push(style);
        config.fontStyle = currentStyles.join(' ');
      }

      if (key) {
        const tokenKeySanitized = key.replace(/\./g, '_');
        const spans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');

        spans.forEach(span => {
          // Update font-weight
          if (config.fontStyle.includes('bold')) {
            span.style.fontWeight = 'bold';
          } else {
            span.style.fontWeight = 'normal';
          }

          // Update font-style
          if (config.fontStyle.includes('italic')) {
            span.style.fontStyle = 'italic';
          } else {
            span.style.fontStyle = 'normal';
          }
        });
      }

      renderConfigList();
      console.log(\`✍️ Updated font style for \${key}: \${config.fontStyle || 'normal'}\`);
    }

    function switchPreview(lang, syncDropdown = true) {
      document.querySelectorAll('.preview-tab').forEach(tab => tab.classList.remove('active'));
      const activeTab = document.getElementById('tab-' + lang);
      if (activeTab) activeTab.classList.add('active');

      document.querySelectorAll('.preview-pane').forEach(pane => pane.style.display = 'none');
      document.getElementById('preview-' + lang).style.display = 'block';

      currentPreview = lang;

      if (syncDropdown) {
        const configLang = PREVIEW_TO_CONFIG_MAP[lang];
        if (configLang) {
          const select = document.getElementById('languageSelect');
          if (select.value !== configLang) {
            select.value = configLang;
            currentLanguage = configLang;
            renderConfigList();
          }
        }
      }
    }

    function updatePreview() {
      // Update CSS variables for live theme preview
      Object.entries(currentTheme).forEach(([lang, configs]) => {
        Object.entries(configs).forEach(([key, config]) => {
          const color = config.foreground;
          if (color) {
            const tokenKeySanitized = key.replace(/\./g, '_');
            const cssVarName = '--token-' + tokenKeySanitized;
            document.documentElement.style.setProperty(cssVarName, color);

            // Sync elements
            const spans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');
            spans.forEach(span => {
              span.style.color = color;
            });
          }
        });
      });
      console.log('✅ Preview updated with new theme colors');
    }

    function resetTheme() {
      if (!confirm('Reset all changes to default theme?')) return;

      // Reset theme data
      Object.keys(currentTheme).forEach(lang => {
        currentTheme[lang] = JSON.parse(JSON.stringify(themeData.languageConfigs[lang]));
      });

      // Reset all CSS variables to original colors
      Object.entries(themeData.languageConfigs).forEach(([lang, configs]) => {
        Object.entries(configs).forEach(([key, config]) => {
          if (config.foreground) {
            const tokenKeySanitized = key.replace(/\./g, '_');
            const cssVarName = '--token-' + tokenKeySanitized;
            document.documentElement.style.setProperty(cssVarName, config.foreground);

            // Sync elements
            const spans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');
            spans.forEach(span => {
              span.style.color = config.foreground;
            });
          }
        });
      });

      // Reset all font styles to defaults
      Object.entries(themeData.languageConfigs).forEach(([lang, configs]) => {
        Object.entries(configs).forEach(([key, config]) => {
          const tokenKeySanitized = key.replace(/\./g, '_');
          const spans = document.querySelectorAll('[data-token="' + tokenKeySanitized + '"]');

          spans.forEach(span => {
            const isBold = config.fontStyle?.includes('bold');
            const isItalic = config.fontStyle?.includes('italic');

            span.style.fontWeight = isBold ? 'bold' : 'normal';
            span.style.fontStyle = isItalic ? 'italic' : 'normal';
          });
        });
      });

      renderConfigList();
      console.log('🔄 Theme reset to defaults');
    }

    async function saveToXml() {
      const btn = document.querySelector('.btn-primary');
      const originalText = btn.innerText;
      
      try {
        btn.innerText = 'Saving...';
        btn.disabled = true;

        const response = await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentTheme)
        });

        const result = await response.json();
        
        if (result.success) {
          alert('✅ Theme saved successfully to cyan-harbor.xml!');
          // Optionally trigger a re-conversion of Shiki if needed, 
          // but we usually need to restart the editor for that since it's a Node process.
        } else {
          alert('❌ Error saving theme: ' + result.error);
        }
      } catch (err) {
        alert('❌ Server not running. Please start the editor using "npm run editor" and keep the terminal open.');
        console.error(err);
      } finally {
        btn.innerText = originalText;
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`;

  fs.writeFileSync('./theme-editor.html', html);
  console.log('\n✅ Interactive theme editor generated!');
  console.log('📄 Output: theme-editor.html');
  console.log('🌐 Open it in your browser to edit the theme!');
}

generateEditor().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
