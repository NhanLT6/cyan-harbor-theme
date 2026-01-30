/**
 * Extracts all unique colors and language configs from cyan-harbor.xml
 */

const fs = require('fs');

const xmlContent = fs.readFileSync('../cyan-harbor.xml', 'utf-8');

// Extract all hex colors
const colorMatches = xmlContent.matchAll(/value="([0-9A-Fa-f]{6})"/g);
const colors = new Set();

for (const match of colorMatches) {
  colors.add('#' + match[1].toUpperCase());
}

// Extract language configurations with their colors
const languageConfigs = {
  'General': {},
  'CSS': {},
  'HTML': {},
  'JavaScript': {},
  'TypeScript': {},
  'JSON': {},
  'YAML': {},
  'Markdown': {},
  'Bash': {},
  'XML': {},
  'C#': {},
  'SQL': {}
};

// Helper to extract color and font style
function extractAttributeData(name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const optionPattern = `<option name="${escapedName}">\\s*<value>[\\s\\S]*?</value>\\s*</option>`;
  const foregroundPattern = /<option name="FOREGROUND" value="([^"]+)"/;
  const fontTypePattern = /<option name="FONT_TYPE" value="([^"]+)"/;

  const optionMatch = xmlContent.match(new RegExp(optionPattern, 'gs'));
  if (!optionMatch) return null;

  const optionBlock = optionMatch[0];
  const fgMatch = optionBlock.match(foregroundPattern);
  const ftMatch = optionBlock.match(fontTypePattern);

  const foreground = fgMatch ? '#' + fgMatch[1].toUpperCase() : null;
  const fontType = ftMatch ? ftMatch[1] : '0';

  let fontStyle = '';
  switch (fontType) {
    case '1': fontStyle = 'bold'; break;
    case '2': fontStyle = 'italic'; break;
    case '3': fontStyle = 'bold italic'; break;
  }

  return { foreground, fontStyle };
}

// General/Default tokens
const generalTokens = [
  // Core syntax
  { key: 'DEFAULT_KEYWORD', label: 'Keywords', desc: 'Language keywords (if, for, class, etc.)' },
  { key: 'DEFAULT_STRING', label: 'Strings', desc: 'String literals' },
  { key: 'DEFAULT_NUMBER', label: 'Numbers', desc: 'Numeric literals' },
  { key: 'DEFAULT_OPERATION_SIGN', label: 'Operators', desc: 'Operators (+, -, *, etc.)' },

  // Comments
  { key: 'DEFAULT_LINE_COMMENT', label: 'Line Comments', desc: 'Single-line comments (//)' },
  { key: 'DEFAULT_BLOCK_COMMENT', label: 'Block Comments', desc: 'Multi-line comments (/* */)' },
  { key: 'DEFAULT_DOC_COMMENT', label: 'Doc Comments', desc: 'Documentation comments (///)' },

  // Structure
  { key: 'DEFAULT_CLASS_NAME', label: 'Class Names', desc: 'Class identifiers' },
  { key: 'DEFAULT_INTERFACE_NAME', label: 'Interface Names', desc: 'Interface identifiers' },
  { key: 'DEFAULT_FUNCTION_DECLARATION', label: 'Function Declarations', desc: 'Function definitions' },
  { key: 'DEFAULT_FUNCTION_CALL', label: 'Function Calls', desc: 'Function invocations' },

  // Data
  { key: 'DEFAULT_LOCAL_VARIABLE', label: 'Local Variables', desc: 'Local variable names' },
  { key: 'DEFAULT_PARAMETER', label: 'Parameters', desc: 'Function parameters' },
  { key: 'DEFAULT_INSTANCE_FIELD', label: 'Instance Fields', desc: 'Object properties' },
  { key: 'DEFAULT_STATIC_FIELD', label: 'Static Fields', desc: 'Static properties' },
  { key: 'DEFAULT_INSTANCE_METHOD', label: 'Instance Methods', desc: 'Object methods' },
  { key: 'DEFAULT_STATIC_METHOD', label: 'Static Methods', desc: 'Static methods' },

  // Punctuation
  { key: 'DEFAULT_BRACES', label: 'Braces', desc: 'Curly braces { }' },
  { key: 'DEFAULT_BRACKETS', label: 'Brackets', desc: 'Square brackets [ ]' },
  { key: 'DEFAULT_PARENTHS', label: 'Parentheses', desc: 'Round brackets ( )' },
  { key: 'DEFAULT_COMMA', label: 'Commas', desc: 'Comma separators' },
  { key: 'DEFAULT_DOT', label: 'Dots', desc: 'Dot accessor' },
  { key: 'DEFAULT_SEMICOLON', label: 'Semicolons', desc: 'Statement terminators' }
];

generalTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.General[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// CSS specific
const cssTokens = [
  { key: 'CSS.TAG_NAME', label: 'Tag Selectors', desc: 'div, span, etc.' },
  { key: 'CSS.CLASS_NAME', label: 'Class Names', desc: '.className' },
  { key: 'CSS.HASH', label: 'IDs', desc: '#id' },
  { key: 'CSS.PSEUDO', label: 'Pseudo Classes/Elements', desc: ':hover, ::before' },
  { key: 'CSS.PROPERTY_NAME', label: 'Property Names', desc: 'color, padding, etc.' },
  { key: 'CSS.PROPERTY_VALUE', label: 'Property Values', desc: 'Property values' },
  { key: 'CSS.FUNCTION', label: 'Functions', desc: 'calc(), rgb(), etc.' }
];

cssTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.CSS[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// HTML specific
const htmlTokens = [
  { key: 'HTML_TAG_NAME', label: 'Tag Names', desc: '<div>, <span>' },
  { key: 'DEFAULT_ATTRIBUTE', label: 'Attribute Names', desc: 'class, id, src' }
];

htmlTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.HTML[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// JavaScript specific
const jsTokens = [
  { key: 'JS.THIS_SUPER', label: 'this/super', desc: 'Special keywords' },
  { key: 'JS.NULL_UNDEFINED', label: 'null/undefined', desc: 'Null values' },
  { key: 'JS.MODULE_KEYWORD', label: 'Module Keywords', desc: 'import, export' },
  { key: 'JS.REGEXP', label: 'Regular Expressions', desc: 'RegExp literals' }
];

jsTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.JavaScript[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// TypeScript specific
const tsTokens = [
  { key: 'TS.TYPE_PARAMETER', label: 'Type Parameters', desc: 'Generic type params <T>' }
];

tsTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.TypeScript[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// JSON specific
const jsonTokens = [
  { key: 'JSON.PROPERTY_KEY', label: 'Property Keys', desc: 'Object keys' },
  { key: 'JSON.KEYWORD', label: 'Keywords', desc: 'true, false, null' }
];

jsonTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.JSON[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// YAML specific
const yamlTokens = [
  { key: 'YAML_SCALAR_KEY', label: 'Keys', desc: 'YAML keys' },
  { key: 'YAML_SCALAR_VALUE', label: 'Values', desc: 'YAML values' }
];

yamlTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.YAML[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// Markdown specific
const mdTokens = [
  { key: 'MARKDOWN_HEADER_LEVEL_1', label: 'Headers', desc: '# Headers' },
  { key: 'MARKDOWN_BOLD', label: 'Bold Text', desc: '**bold**' },
  { key: 'MARKDOWN_ITALIC', label: 'Italic Text', desc: '*italic*' },
  { key: 'MARKDOWN_STRIKETHROUGH', label: 'Strikethrough', desc: '~~strike~~' },
  { key: 'MARKDOWN_CODE_SPAN', label: 'Inline Code', desc: '`code`' },
  { key: 'MARKDOWN_BLOCK_QUOTE', label: 'Block Quote', desc: '> quote' },
  { key: 'MARKDOWN_LINK_TEXT', label: 'Link Text', desc: '[text](url)' },
  { key: 'MARKDOWN_HRULE', label: 'Horizontal Rule', desc: '---' },
  { key: 'MARKDOWN_LIST_MARKER', label: 'List Marker', desc: '- or 1.' }
];

mdTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.Markdown[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// Bash specific
const bashTokens = [
  { key: 'BASH.EXTERNAL_COMMAND', label: 'Commands', desc: 'Shell commands' }
];

bashTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.Bash[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// XML specific
const xmlTokens = [
  { key: 'XML_TAG_NAME', label: 'Tag Names', desc: '<tag>' }
];

xmlTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.XML[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// C# specific
const csharpTokens = [
  { key: 'ReSharper.NAMESPACE_IDENTIFIER', label: 'Namespaces', desc: 'Namespace names' },
  { key: 'ReSharper.CLASS_IDENTIFIER', label: 'Classes', desc: 'C# Class names' },
  { key: 'ReSharper.INTERFACE_IDENTIFIER', label: 'Interfaces', desc: 'C# Interface names' },
  { key: 'ReSharper.STRUCT_IDENTIFIER', label: 'Structs', desc: 'C# Struct names' },
  { key: 'ReSharper.ENUM_IDENTIFIER', label: 'Enums', desc: 'Enum types' },
  { key: 'ENUM_CONST', label: 'Enum Members', desc: 'Enum member values' },
  { key: 'ReSharper.DELEGATE_IDENTIFIER', label: 'Delegates', desc: 'Delegate types' },
  { key: 'CSHARP_OPERATOR_SIGN', label: 'C# Operators', desc: 'C# specific operators' }
];

csharpTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs['C#'][token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  }
});

// SQL specific
const sqlTokens = [
  { key: 'SQL_KEYWORD', label: 'SQL Keywords', desc: 'SELECT, FROM, WHERE, etc.' },
  { key: 'SQL_IDENTIFIER', label: 'SQL Identifiers', desc: 'table or column names' },
  { key: 'SQL_PARAMETER', label: 'SQL Parameters', desc: '@variable' },
  { key: 'SQL_STRING', label: 'SQL Strings', desc: "'string'" },
  { key: 'SQL_NUMBER', label: 'SQL Numbers', desc: '123' },
  { key: 'SQL_COMMENT', label: 'SQL Comments', desc: '-- single line or /* multi-line */' }
];

sqlTokens.forEach(token => {
  const data = extractAttributeData(token.key);
  if (data && data.foreground) {
    languageConfigs.SQL[token.key] = {
      label: token.label,
      description: token.desc,
      ...data
    };
  } else {
    // Fallback to General for SQL if not specifically defined
    let fallbackKey = '';
    if (token.key === 'SQL_KEYWORD') fallbackKey = 'DEFAULT_KEYWORD';
    else if (token.key === 'SQL_STRING') fallbackKey = 'DEFAULT_STRING';
    else if (token.key === 'SQL_NUMBER') fallbackKey = 'DEFAULT_NUMBER';
    else if (token.key === 'SQL_COMMENT') fallbackKey = 'DEFAULT_LINE_COMMENT';

    if (fallbackKey) {
      const fallbackData = extractAttributeData(fallbackKey);
      if (fallbackData) {
        languageConfigs.SQL[token.key] = {
          label: token.label,
          description: token.desc,
          ...fallbackData
        };
      }
    }
  }
});

// Output results
const output = {
  allColors: Array.from(colors).sort(),
  languageConfigs: languageConfigs
};

fs.writeFileSync('./theme-data.json', JSON.stringify(output, null, 2));

console.log('✅ Theme data extracted!');
console.log(`🎨 Total unique colors: ${colors.size}`);
console.log(`📄 Output: theme-data.json`);

Object.entries(languageConfigs).forEach(([lang, configs]) => {
  const count = Object.keys(configs).length;
  if (count > 0) {
    console.log(`   ${lang}: ${count} tokens`);
  }
});
