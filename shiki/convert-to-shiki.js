/**
 * Converts IntelliJ theme (ocean-harbor.xml) to Shiki-compatible TextMate theme
 *
 * Usage: node convert-to-shiki.js
 * Output: ocean-harbor-shiki-theme.json
 */

const fs = require('fs');
const path = require('path');

// Read and parse the XML file
const xmlContent = fs.readFileSync('../ocean-harbor.xml', 'utf-8');

/**
 * Extract color value from XML option tag
 * @param {string} name - The option name
 * @returns {string|null} - Hex color value or null
 */
function getColor(name) {
  const regex = new RegExp(`<option name="${name}"[^>]*value="([^"]+)"`, 'i');
  const match = xmlContent.match(regex);
  return match ? '#' + match[1] : null;
}

/**
 * Extract foreground color from attribute
 * @param {string} name - The attribute name
 * @returns {string|null} - Hex color value or null
 */
function getAttributeForeground(name) {
  const regex = new RegExp(`<option name="${name}">\\s*<value>\\s*<option name="FOREGROUND" value="([^"]+)"`, 'gs');
  const match = regex.exec(xmlContent);
  return match ? '#' + match[1] : null;
}

/**
 * Get font style from attribute
 * @param {string} name - The attribute name
 * @returns {string} - Font style: 'italic', 'bold', 'bold italic', or ''
 */
function getAttributeFontStyle(name) {
  const regex = new RegExp(`<option name="${name}">\\s*<value>[\\s\\S]*?<option name="FONT_TYPE" value="([^"]+)"`, 'gs');
  const match = regex.exec(xmlContent);
  if (!match) return '';

  const fontType = match[1];
  // IntelliJ font types: 0=normal, 1=bold, 2=italic, 3=bold+italic
  switch (fontType) {
    case '1': return 'bold';
    case '2': return 'italic';
    case '3': return 'bold italic';
    default: return '';
  }
}

/**
 * Create a token color entry
 * @param {string} name - Display name
 * @param {string|string[]} scope - TextMate scope(s)
 * @param {string} foreground - Hex color
 * @param {string} fontStyle - Font style
 * @returns {object} Token color object
 */
function createTokenColor(name, scope, foreground, fontStyle = '') {
  const settings = { foreground };
  if (fontStyle) settings.fontStyle = fontStyle;

  return {
    name,
    scope: Array.isArray(scope) ? scope : [scope],
    settings
  };
}

// Extract editor colors
const editorBackground = getColor('TEXT')?.match(/#([^"]+)/)?.[0] || '#263238';
const editorForeground = getColor('TEXT')?.match(/FOREGROUND" value="([^"]+)/)?.[1]
  ? '#' + getColor('TEXT').match(/FOREGROUND" value="([^"]+)/)[1]
  : '#b8c5d0';

// Build the theme object
const theme = {
  name: 'Ocean Harbor',
  type: 'dark',
  colors: {
    'editor.background': getColor('TEXT')?.split('"')[3] ? '#' + getColor('TEXT').split('"')[3] : '#263238',
    'editor.foreground': getAttributeForeground('TEXT') || '#b8c5d0',
    'editor.lineHighlightBackground': getColor('CARET_ROW_COLOR') || '#1B2529',
    'editor.selectionBackground': getColor('SELECTION_BACKGROUND') || '#314549',
    'editorCursor.foreground': getColor('CARET_COLOR') || '#FFCC00',
    'editorLineNumber.foreground': getColor('LINE_NUMBERS_COLOR') || '#475F63',
    'editorLineNumber.activeForeground': getColor('LINE_NUMBER_ON_CARET_ROW_COLOR') || '#607D86',
    'editorIndentGuide.background': getColor('INDENT_GUIDE') || '#37474F',
    'editorIndentGuide.activeBackground': getColor('SELECTED_INDENT_GUIDE') || '#009688',
    'editorWhitespace.foreground': getColor('WHITESPACES') || '#65737E',
  },
  tokenColors: []
};

// IntelliJ to TextMate scope mappings
const mappings = [
  // Comments
  {
    name: 'Comment',
    intellij: 'DEFAULT_LINE_COMMENT',
    scopes: ['comment.line', 'punctuation.definition.comment']
  },
  {
    name: 'Block Comment',
    intellij: 'DEFAULT_BLOCK_COMMENT',
    scopes: ['comment.block']
  },
  {
    name: 'Doc Comment',
    intellij: 'DEFAULT_DOC_COMMENT',
    scopes: ['comment.block.documentation']
  },

  // Keywords & Language Constructs
  {
    name: 'Keyword',
    intellij: 'DEFAULT_KEYWORD',
    scopes: ['keyword', 'storage.type', 'storage.modifier']
  },
  {
    name: 'Operator',
    intellij: 'DEFAULT_OPERATION_SIGN',
    scopes: ['keyword.operator', 'punctuation.operator']
  },

  // Strings & Numbers
  {
    name: 'String',
    intellij: 'DEFAULT_STRING',
    scopes: ['string', 'string.quoted']
  },
  {
    name: 'String Escape',
    intellij: 'DEFAULT_VALID_STRING_ESCAPE',
    scopes: ['constant.character.escape']
  },
  {
    name: 'Number',
    intellij: 'DEFAULT_NUMBER',
    scopes: ['constant.numeric']
  },
  {
    name: 'Constant',
    intellij: 'DEFAULT_CONSTANT',
    scopes: ['constant.language', 'constant.other']
  },

  // Functions & Methods
  {
    name: 'Function Call',
    intellij: 'DEFAULT_FUNCTION_CALL',
    scopes: ['entity.name.function', 'support.function']
  },
  {
    name: 'Function Declaration',
    intellij: 'DEFAULT_FUNCTION_DECLARATION',
    scopes: ['entity.name.function', 'meta.function']
  },
  {
    name: 'Method',
    intellij: 'DEFAULT_INSTANCE_METHOD',
    scopes: ['entity.name.function.member']
  },
  {
    name: 'Static Method',
    intellij: 'DEFAULT_STATIC_METHOD',
    scopes: ['entity.name.function.static']
  },

  // Classes & Types
  {
    name: 'Class Name',
    intellij: 'DEFAULT_CLASS_NAME',
    scopes: ['entity.name.class', 'entity.name.type.class', 'support.class']
  },
  {
    name: 'Class Reference',
    intellij: 'DEFAULT_CLASS_REFERENCE',
    scopes: ['entity.name.type', 'support.type']
  },
  {
    name: 'Interface Name',
    intellij: 'DEFAULT_INTERFACE_NAME',
    scopes: ['entity.name.type.interface']
  },
  {
    name: 'Abstract Class',
    intellij: 'ABSTRACT_CLASS_NAME_ATTRIBUTES',
    scopes: ['entity.name.type.class.abstract']
  },

  // Variables & Parameters
  {
    name: 'Variable',
    intellij: 'DEFAULT_IDENTIFIER',
    scopes: ['variable', 'variable.other']
  },
  {
    name: 'Local Variable',
    intellij: 'DEFAULT_LOCAL_VARIABLE',
    scopes: ['variable.other.local']
  },
  {
    name: 'Parameter',
    intellij: 'DEFAULT_PARAMETER',
    scopes: ['variable.parameter']
  },
  {
    name: 'Instance Field',
    intellij: 'DEFAULT_INSTANCE_FIELD',
    scopes: ['variable.other.property', 'variable.other.member']
  },
  {
    name: 'Static Field',
    intellij: 'DEFAULT_STATIC_FIELD',
    scopes: ['variable.other.constant']
  },

  // Punctuation
  {
    name: 'Braces',
    intellij: 'DEFAULT_BRACES',
    scopes: ['punctuation.section.braces', 'punctuation.definition.block']
  },
  {
    name: 'Brackets',
    intellij: 'DEFAULT_BRACKETS',
    scopes: ['punctuation.section.brackets', 'punctuation.definition.array']
  },
  {
    name: 'Parentheses',
    intellij: 'DEFAULT_PARENTHS',
    scopes: ['punctuation.section.parens', 'punctuation.definition.parameters']
  },
  {
    name: 'Comma',
    intellij: 'DEFAULT_COMMA',
    scopes: ['punctuation.separator.comma']
  },
  {
    name: 'Dot',
    intellij: 'DEFAULT_DOT',
    scopes: ['punctuation.accessor', 'punctuation.separator.period']
  },
  {
    name: 'Semicolon',
    intellij: 'DEFAULT_SEMICOLON',
    scopes: ['punctuation.terminator.statement']
  },

  // Annotations & Decorators
  {
    name: 'Annotation',
    intellij: 'ANNOTATION_NAME_ATTRIBUTES',
    scopes: ['storage.type.annotation', 'punctuation.definition.annotation']
  },
  {
    name: 'Annotation Attribute',
    intellij: 'ANNOTATION_ATTRIBUTE_NAME_ATTRIBUTES',
    scopes: ['variable.annotation']
  },

  // HTML/XML
  {
    name: 'HTML Tag',
    intellij: 'HTML_TAG_NAME',
    scopes: ['entity.name.tag.html', 'entity.name.tag']
  },
  {
    name: 'HTML Attribute',
    intellij: 'DEFAULT_ATTRIBUTE',
    scopes: ['entity.other.attribute-name']
  },
  {
    name: 'XML Tag',
    intellij: 'XML_TAG_NAME',
    scopes: ['entity.name.tag.xml']
  },

  // CSS
  {
    name: 'CSS Class',
    intellij: 'CSS.CLASS_NAME',
    scopes: ['entity.other.attribute-name.class.css']
  },
  {
    name: 'CSS ID',
    intellij: 'CSS.HASH',
    scopes: ['entity.other.attribute-name.id.css']
  },
  {
    name: 'CSS Property',
    intellij: 'CSS.PROPERTY_NAME',
    scopes: ['support.type.property-name.css']
  },
  {
    name: 'CSS Property Value',
    intellij: 'CSS.PROPERTY_VALUE',
    scopes: ['support.constant.property-value.css', 'meta.property-value.css']
  },
  {
    name: 'CSS Function',
    intellij: 'CSS.FUNCTION',
    scopes: ['support.function.css']
  },
  {
    name: 'CSS Tag',
    intellij: 'CSS.TAG_NAME',
    scopes: ['entity.name.tag.css']
  },
  {
    name: 'CSS Pseudo Element',
    intellij: 'CSS.PSEUDO',
    scopes: ['entity.other.attribute-name.pseudo-element.css', 'entity.other.attribute-name.pseudo-class.css']
  },

  // JavaScript/TypeScript
  {
    name: 'JS This/Super',
    intellij: 'JS.THIS_SUPER',
    scopes: ['variable.language.this', 'variable.language.super']
  },
  {
    name: 'JS Null/Undefined',
    intellij: 'JS.NULL_UNDEFINED',
    scopes: ['constant.language.null', 'constant.language.undefined']
  },
  {
    name: 'JS Module Keyword',
    intellij: 'JS.MODULE_KEYWORD',
    scopes: ['keyword.control.import', 'keyword.control.export', 'keyword.control.from']
  },
  {
    name: 'JS RegExp',
    intellij: 'JS.REGEXP',
    scopes: ['string.regexp']
  },
  {
    name: 'TS Type Parameter',
    intellij: 'TS.TYPE_PARAMETER',
    scopes: ['entity.name.type.parameter']
  },

  // JSON
  {
    name: 'JSON Property Key',
    intellij: 'JSON.PROPERTY_KEY',
    scopes: ['support.type.property-name.json', 'meta.structure.dictionary.key.json']
  },
  {
    name: 'JSON Keyword',
    intellij: 'JSON.KEYWORD',
    scopes: ['constant.language.json']
  },

  // YAML
  {
    name: 'YAML Key',
    intellij: 'YAML_SCALAR_KEY',
    scopes: ['entity.name.tag.yaml']
  },
  {
    name: 'YAML Value',
    intellij: 'YAML_SCALAR_VALUE',
    scopes: ['string.unquoted.yaml']
  },

  // Markdown
  {
    name: 'Markdown Heading',
    intellij: 'MARKDOWN_HEADER_LEVEL_1',
    scopes: ['markup.heading', 'entity.name.section.markdown', 'punctuation.definition.heading.markdown']
  },
  {
    name: 'Markdown Text',
    intellij: 'MARKDOWN.TEXT',
    scopes: ['text.html.markdown']
  },
  {
    name: 'Markdown Bold',
    intellij: 'MARKDOWN_BOLD',
    scopes: ['markup.bold']
  },
  {
    name: 'Markdown Italic',
    intellij: 'MARKDOWN_ITALIC',
    scopes: ['markup.italic']
  },
  {
    name: 'Markdown Strikethrough',
    intellij: 'MARKDOWN_STRIKETHROUGH',
    scopes: ['markup.strikethrough']
  },
  {
    name: 'Markdown Blockquote',
    intellij: 'MARKDOWN_BLOCK_QUOTE',
    scopes: ['markup.quote', 'punctuation.definition.quote.begin.markdown']
  },
  {
    name: 'Markdown Code',
    intellij: 'MARKDOWN_CODE_SPAN',
    scopes: ['markup.inline.raw', 'markup.fenced_code.block.markdown', 'markup.raw.block.markdown']
  },
  {
    name: 'Markdown Link',
    intellij: 'MARKDOWN_LINK_TEXT',
    scopes: ['markup.underline.link', 'string.other.link.title.markdown']
  },
  {
    name: 'Markdown HRule',
    intellij: 'MARKDOWN_HRULE',
    scopes: ['meta.separator.markdown']
  },
  {
    name: 'Markdown List Marker',
    intellij: 'MARKDOWN_LIST_MARKER',
    scopes: ['punctuation.definition.list.begin.markdown']
  },

  // Bash
  {
    name: 'Bash Command',
    intellij: 'BASH.EXTERNAL_COMMAND',
    scopes: ['support.function.builtin.shell']
  },

  // C#
  {
    name: 'C# Namespace',
    intellij: 'ReSharper.NAMESPACE_IDENTIFIER',
    scopes: ['entity.name.type.namespace.cs']
  },
  {
    name: 'C# Class',
    intellij: 'ReSharper.CLASS_IDENTIFIER',
    fallback: 'DEFAULT_CLASS_NAME',
    scopes: ['entity.name.type.class.cs']
  },
  {
    name: 'C# Interface',
    intellij: 'ReSharper.INTERFACE_IDENTIFIER',
    fallback: 'DEFAULT_INTERFACE_NAME',
    scopes: ['entity.name.type.interface.cs']
  },
  {
    name: 'C# Struct',
    intellij: 'ReSharper.STRUCT_IDENTIFIER',
    fallback: 'DEFAULT_CLASS_NAME',
    scopes: ['entity.name.type.struct.cs']
  },
  {
    name: 'C# Enum',
    intellij: 'ReSharper.ENUM_IDENTIFIER',
    fallback: 'DEFAULT_CLASS_NAME',
    scopes: ['entity.name.type.enum.cs']
  },
  {
    name: 'C# Delegate',
    intellij: 'ReSharper.DELEGATE_IDENTIFIER',
    fallback: 'DEFAULT_CLASS_NAME',
    scopes: ['entity.name.type.delegate.cs']
  },
  {
    name: 'C# Operator',
    intellij: 'CSHARP_OPERATOR_SIGN',
    fallback: 'DEFAULT_OPERATION_SIGN',
    scopes: ['keyword.operator.cs']
  },
  {
    name: 'Enum Member',
    intellij: 'ENUM_CONST',
    scopes: ['variable.other.enummember.cs', 'constant.other.enum.cs', 'variable.other.constant.cs', 'entity.name.variable.enum-member.cs']
  },

  // Documentation
  {
    name: 'Doc Comment Tag',
    intellij: 'DEFAULT_DOC_COMMENT_TAG',
    scopes: ['storage.type.class.jsdoc', 'keyword.other.documentation']
  },
  {
    name: 'Doc Comment Tag Value',
    intellij: 'DEFAULT_DOC_COMMENT_TAG_VALUE',
    scopes: ['variable.other.jsdoc']
  },

  // SQL (with fallbacks)
  {
    name: 'SQL Keyword',
    intellij: 'SQL_KEYWORD',
    fallback: 'DEFAULT_KEYWORD',
    scopes: ['keyword.sql', 'keyword.other.sql', 'support.function.sql']
  },
  {
    name: 'SQL String',
    intellij: 'SQL_STRING',
    fallback: 'DEFAULT_STRING',
    scopes: ['string.quoted.single.sql', 'string.quoted.double.sql']
  },
  {
    name: 'SQL Number',
    intellij: 'SQL_NUMBER',
    fallback: 'DEFAULT_NUMBER',
    scopes: ['constant.numeric.sql']
  },
  {
    name: 'SQL Comment',
    intellij: 'SQL_COMMENT',
    fallback: 'DEFAULT_LINE_COMMENT',
    scopes: ['comment.line.sql', 'comment.block.sql', 'comment.line.double-dash.sql']
  },
  {
    name: 'SQL Parameter',
    intellij: 'SQL_PARAMETER',
    scopes: ['variable.parameter.sql']
  },
  {
    name: 'SQL Identifier',
    intellij: 'SQL_IDENTIFIER',
    scopes: ['variable.other.sql', 'entity.name.section.sql']
  },
];

// Process mappings and build tokenColors
mappings.forEach(mapping => {
  let foreground = getAttributeForeground(mapping.intellij);
  let fontStyle = getAttributeFontStyle(mapping.intellij);

  // If language-specific token is missing, attempt fallback to general token
  if (!foreground && mapping.fallback) {
    foreground = getAttributeForeground(mapping.fallback);
    fontStyle = getAttributeFontStyle(mapping.fallback);
  }

  if (foreground) {
    // USE CSS VARIABLE for live preview decoupling
    // We keep the original logic for generating the JSON, 
    // but the editor will now use these variable names.
    const cssVar = `var(--token-${mapping.intellij.replace(/\./g, '_')})`;

    theme.tokenColors.push(createTokenColor(
      mapping.name,
      mapping.scopes,
      cssVar, // Use variable instead of hardcoded hex
      fontStyle
    ));
  }
});

// Write the output
const outputPath = './ocean-harbor-shiki-theme.json';
fs.writeFileSync(outputPath, JSON.stringify(theme, null, 2), 'utf-8');

console.log('✅ Conversion complete!');
console.log(`📄 Output: ${outputPath}`);
console.log(`🎨 Theme name: ${theme.name}`);
console.log(`🔢 Token colors: ${theme.tokenColors.length} rules`);
console.log('\nNext steps:');
console.log('1. Review the generated theme file');
console.log('2. Import it in your Shiki setup:');
console.log('   const theme = require("./ocean-harbor-shiki-theme.json");');
console.log('   const highlighter = await createHighlighter({ themes: [theme], langs: [...] });');
