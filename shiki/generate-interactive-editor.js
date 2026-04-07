'use strict';
/**
 * Generates a static theme preview HTML from theme-data.json.
 * No shiki, no color pickers. Run after extract-theme-colors.js.
 * Output: theme-editor.html — open directly in a browser.
 */

const fs = require('fs');
const themeData = require('./theme-data.json');

function generatePreview() {
  // ── CSS variables from theme data ────────────────────────────────────────
  const cssVarLines = [];
  const fontStyleRules = [];

  Object.values(themeData.languageConfigs).forEach(configs => {
    Object.entries(configs).forEach(([key, config]) => {
      const k = key.replace(/\./g, '_');
      if (config.foreground) cssVarLines.push(`  --token-${k}: ${config.foreground};`);
      if (config.fontStyle) {
        const b = config.fontStyle.includes('bold')   ? 'font-weight:bold;'   : '';
        const i = config.fontStyle.includes('italic') ? 'font-style:italic;'  : '';
        fontStyleRules.push(`[data-token="${k}"]{${b}${i}}`);
      }
    });
  });

  const cssVars     = cssVarLines.join('\n');
  const fontStyleCSS = fontStyleRules.join('\n');

  // ── Token span helpers ───────────────────────────────────────────────────
  const t  = (key, text) => `<span data-token="${key.replace(/\./g,'_')}" style="color:var(--token-${key.replace(/\./g,'_')})">${text}</span>`;

  // General
  const kw  = s => t('DEFAULT_KEYWORD', s);
  const str = s => t('DEFAULT_STRING', s);
  const num = s => t('DEFAULT_NUMBER', s);
  const lc  = s => t('DEFAULT_LINE_COMMENT', s);
  const bc  = s => t('DEFAULT_BLOCK_COMMENT', s);
  const dc  = s => t('DEFAULT_DOC_COMMENT', s);
  const cls = s => t('DEFAULT_CLASS_NAME', s);
  const ifc = s => t('DEFAULT_INTERFACE_NAME', s);
  const fn  = s => t('DEFAULT_FUNCTION_DECLARATION', s);
  const fnc = s => t('DEFAULT_FUNCTION_CALL', s);
  const lv  = s => t('DEFAULT_LOCAL_VARIABLE', s);
  const prm = s => t('DEFAULT_PARAMETER', s);
  const sf  = s => t('DEFAULT_STATIC_FIELD', s);
  const inf = s => t('DEFAULT_INSTANCE_FIELD', s);
  const sm  = s => t('DEFAULT_STATIC_METHOD', s);
  const im  = s => t('DEFAULT_INSTANCE_METHOD', s);
  const op  = s => t('DEFAULT_OPERATION_SIGN', s);
  const br  = s => t('DEFAULT_BRACES', s);
  const pa  = s => t('DEFAULT_PARENTHS', s);
  const bk  = s => t('DEFAULT_BRACKETS', s);
  const cm  = s => t('DEFAULT_COMMA', s);
  const dt  = s => t('DEFAULT_DOT', s);
  const sc  = s => t('DEFAULT_SEMICOLON', s);
  // C# / ReSharper
  const ns  = s => t('ReSharper_NAMESPACE_IDENTIFIER', s);
  const en  = s => t('ReSharper_ENUM_IDENTIFIER', s);
  const ec  = s => t('ENUM_CONST', s);
  const del = s => t('ReSharper_DELEGATE_IDENTIFIER', s);
  const stk = s => t('ReSharper_STRUCT_IDENTIFIER', s);
  const cop = s => t('CSHARP_OPERATOR_SIGN', s);
  // SQL
  const sqk = s => t('SQL_KEYWORD', s);
  const sqs = s => t('SQL_STRING', s);
  const sqn = s => t('SQL_NUMBER', s);
  const sqc = s => t('SQL_COMMENT', s);
  // JavaScript extras
  const jmk = s => t('JS_MODULE_KEYWORD', s);
  const jnu = s => t('JS_NULL_UNDEFINED', s);
  const jth = s => t('JS_THIS_SUPER', s);
  const jre = s => t('JS_REGEXP', s);

  // Inlay hints
  const inlay  = s => `<span data-token="INLAY_DEFAULT" style="color:var(--token-INLAY_DEFAULT);background:#1e272c80;border-radius:3px;padding:0 4px;font-size:0.85em">${s}</span>`;
  const inlayx = s => `<span data-token="INLAY_TEXT_WITHOUT_BACKGROUND" style="color:var(--token-INLAY_TEXT_WITHOUT_BACKGROUND);font-size:0.85em;padding:0 2px">${s}</span>`;

  // Identifier-under-caret highlights
  const cr = s => `<span class="caret-read">${s}</span>`;
  const cw = s => `<span class="caret-write">${s}</span>`;

  // ── Line builder ─────────────────────────────────────────────────────────
  let n = 0;
  function ln(git, content, cls = '') {
    n++;
    const gb = git
      ? `<span class="gb gb-${git}"></span>`
      : `<span class="gb"></span>`;
    const extra = cls ? ` ${cls}` : '';
    return `<div class="cl${extra}"><span class="lnum">${String(n).padStart(3)}</span>${gb}<span class="cd">${content}</span></div>`;
  }
  function blank() { n++; return `<div class="cl"><span class="lnum">${String(n).padStart(3)}</span><span class="gb"></span><span class="cd"></span></div>`; }

  // ── C# section ───────────────────────────────────────────────────────────
  const csharpLines = [
    ln('', `${dc('///')} ${dc('<summary>')}${dc('Payment service — Rider semantic tokens')}${dc('</summary>')}`),
    ln('', `${kw('using')} System${sc(';')}`),
    ln('', `${kw('using')} System${dt('.')}Collections${dt('.')}Generic${sc(';')}`),
    blank(),
    ln('', `${kw('namespace')} ${ns('PaymentService')}${dt('.')}${ns('Core')}`),
    ln('', `${br('{')}`),

    ln('add', `    ${kw('public')} ${kw('enum')} ${en('PaymentStatus')}`),
    ln('add', `    ${br('{')}`),
    ln('add', `        ${ec('Pending')}${cm(',')}   ${lc('// default')}`),
    ln('',    `        ${ec('Completed')}${cm(',')}`),
    ln('',    `        ${ec('Failed')}`),
    ln('',    `    ${br('}')}`),
    blank(),

    ln('', `    ${kw('public')} ${kw('delegate')} ${kw('void')} ${del('PaymentHandler')}${pa('(')}${cls('PaymentEventArgs')} ${prm('e')}${pa(')')}${sc(';')}`),
    blank(),

    ln('', `    ${bc('/* Interface contract */')}`),
    ln('', `    ${kw('public')} ${kw('interface')} ${ifc('IProcessor')}`),
    ln('', `    ${br('{')}`),
    ln('', `        ${cls('Task')}<${kw('decimal')}> ${fn('Process')}${pa('(')}${kw('decimal')} ${prm('amount')}${cm(',')} ${kw('string')} ${prm('currency')}${pa(')')}${sc(';')}`),
    ln('', `    ${br('}')}`),
    blank(),

    ln('mod', `    ${kw('public')} ${kw('class')} ${cls('PaymentProcessor')} ${cop(':')} ${ifc('IProcessor')}`),
    ln('mod', `    ${br('{')}`),
    ln('mod', `        ${kw('private')} ${kw('static')} ${kw('readonly')} ${kw('decimal')} ${sf('_rate')} ${op('=')} ${num('2.5m')}${sc(';')}`),
    ln('',    `        ${kw('private')} ${kw('decimal')} ${inf('_commission')}${sc(';')}`),
    blank(),
    ln('', `        ${kw('public')} ${kw('static')} ${kw('bool')} ${sm('IsValid')}${pa('(')}${kw('decimal')} ${prm('amount')}${pa(')')}`),
    ln('', `        ${br('{')}`),
    ln('', `            ${kw('return')} ${prm('amount')} ${op('>')} ${num('0')}${sc(';')}`),
    ln('', `        ${br('}')}`),
    blank(),
    ln('', `        ${kw('public')} ${kw('async')} ${cls('Task')}<${kw('decimal')}> ${im('Process')}${pa('(')}${kw('decimal')} ${prm('amount')}${cm(',')} ${kw('string')} ${prm('currency')}${pa(')')}`),
    ln('', `        ${br('{')}`),
    ln('', `            ${kw('var')} ${lv('result')}${inlay(' :decimal')} ${op('=')} ${num('0m')}${sc(';')}   ${lc('// local var + inlay hint (INLAY_DEFAULT)')}`),
    ln('', `            ${kw('var')} ${lv('results')}${inlayx(' :IEnumerable&lt;Order&gt;')} ${op('=')} ${cls('Enumerable')}${dt('.')}${fnc('Empty')}<${cls('Order')}>()${sc(';')}   ${lc('// no-background inlay hint')}`),
    ln('', `            ${kw('var')} ${lv('status')} ${op('=')} ${en('PaymentStatus')}${dt('.')}${ec('Pending')}${sc(';')}`),
    ln('', `            ${kw('var')} ${lv('fees')} ${op('=')} ${kw('new')}${bk('[')}${bk(']')} ${br('{')} ${num('10')}${cm(',')} ${num('20')}${cm(',')} ${num('30')} ${br('}')}${sc(';')}`),
    blank(),
    ln('', `            ${kw('if')} ${pa('(')}${prm('amount')} ${op('>')} ${num('0')}${pa(')')}`),
    ln('', `            ${br('{')}`),
    ln('', `                ${lv('result')} ${op('=')} ${prm('amount')} ${op('*')} ${sf('_rate')}${sc(';')}`),
    ln('', `                ${inf('_commission')} ${op('=')} ${lv('result')} ${op('*')} ${num('0.01m')}${sc(';')}`),
    ln('', `            ${br('}')}`),
    ln('', `            ${kw('return')} ${lv('result')}${sc(';')}`),
    ln('', `        ${br('}')}`),
    ln('', `    ${br('}')}`),
    ln('', `${br('}')}`),
  ].join('\n');

  // ── SQL section ──────────────────────────────────────────────────────────
  n = 0;
  const sqlLines = [
    ln('', `${sqc('-- Line comment')}`),
    ln('', `${sqc('/* Block comment */')}`),
    blank(),
    ln('add', `${sqk('SELECT')}   u${dt('.')}Id${cm(',')} u${dt('.')}Username${cm(',')} ${sqk('COUNT')}${pa('(')}o${dt('.')}Id${pa(')')} ${sqk('AS')} OrderCount`),
    ln('add', `${sqk('FROM')}     Users u`),
    ln('',    `${sqk('INNER JOIN')} Orders o ${sqk('ON')} u${dt('.')}Id ${op('=')} o${dt('.')}UserId`),
    ln('mod', `${sqk('WHERE')}    u${dt('.')}IsActive ${op('=')} ${sqn('1')}`),
    ln('mod', `  ${sqk('AND')}    u${dt('.')}Name ${sqk('LIKE')} ${sqs("'%admin%'")}`),
    ln('',    `${sqk('ORDER BY')} u${dt('.')}CreatedAt ${sqk('DESC')}${sc(';')}`),
    blank(),
    ln('', `${sqk('DECLARE')} @amount ${sqk('DECIMAL')} ${op('=')} ${sqn('99.99')}${sc(';')}`),
    ln('', `${sqk('INSERT INTO')} Orders ${pa('(')}UserId${cm(',')} Amount${pa(')')} ${sqk('VALUES')} ${pa('(')}@userId${cm(',')} @amount${pa(')')}${sc(';')}`),
  ].join('\n');

  // ── JavaScript section ───────────────────────────────────────────────────
  n = 0;
  const jsLines = [
    ln('', `${lc('// Line comment')}`),
    ln('', `${bc('/* Block comment */')}`),
    ln('', `${jmk('import')} ${br('{')} ${cls('EventEmitter')} ${br('}')} ${jmk('from')} ${str("'events'")}${sc(';')}`),
    blank(),
    ln('add', `${jmk('export')} ${jmk('default')} ${kw('class')} ${cls('Controller')} ${kw('extends')} ${cls('EventEmitter')} ${br('{')}`),
    ln('add', `    ${kw('static')} ${sf('BASE')} ${op('=')} ${str("'https://api.example.com'")}${sc(';')}`),
    ln('',    `    ${inf('#privateField')} ${op('=')} ${num('42')}${sc(';')}`),
    ln('',    `    ${inf('isLoading')} ${op('=')} ${kw('false')}${sc(';')}`),
    blank(),
    ln('', `    ${fn('constructor')}${pa('(')}${prm('apiKey')}${pa(')')} ${br('{')}`),
    ln('', `        ${kw('super')}${pa('(')}${pa(')')}${sc(';')}`),
    ln('', `        ${jth('this')}${dt('.')}${inf('apiKey')} ${op('=')} ${prm('apiKey')}${sc(';')}`),
    ln('', `    ${br('}')}`),
    blank(),
    ln('mod', `    ${kw('async')} ${im('load')}${pa('(')}${prm('userId')}${pa(')')} ${br('{')}`),
    ln('mod', `        ${kw('const')} ${lv('url')} ${op('=')} ${str('`${Controller.BASE}/${userId}`')}${sc(';')}`),
    ln('',    `        ${kw('let')}   ${lv('data')} ${op('=')} ${jnu('null')}${sc(';')}`),
    ln('',    `        ${kw('const')} ${lv('re')}   ${op('=')} ${jre('/^\\\\w+$/')}${sc(';')}`),
    ln('',    `        ${kw('return')} ${jth('this')}${dt('.')}${inf('isLoading')} ${op('?')} ${jnu('undefined')} ${op(':')} ${lv('data')}${sc(';')}`),
    ln('',    `    ${br('}')}`),
    ln('',    `${br('}')}`),
  ].join('\n');

  // ── IDE Chrome demo section ───────────────────────────────────────────────
  const chromeSection = `
<div class="chrome-grid">

  <div class="chrome-item">
    <div class="chrome-label">Selection background</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${lv('result')} ${op('=')} ${prm('amount')} ${op('*')} ${sf('_rate')}${sc(';')}</span></div>
      <div class="cl sel"><span class="lnum">  2</span><span class="gb"></span><span class="cd">${inf('_commission')} ${op('=')} ${lv('result')} ${op('*')} ${num('0.01m')}${sc(';')}</span></div>
      <div class="cl"><span class="lnum">  3</span><span class="gb"></span><span class="cd">${kw('return')} ${lv('result')}${sc(';')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Caret row</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${lv('result')} ${op('=')} ${prm('amount')} ${op('*')} ${sf('_rate')}${sc(';')}</span></div>
      <div class="cl car"><span class="lnum">  2</span><span class="gb"></span><span class="cd">${kw('return')} ${lv('result')}${sc(';')}   <span style="color:#37474f;font-size:0.85em">← caret here</span></span></div>
      <div class="cl"><span class="lnum">  3</span><span class="gb"></span><span class="cd">${br('}')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Identifier under caret — read</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${kw('var')} ${cr(lv('result'))} ${op('=')} ${num('0m')}${sc(';')}</span></div>
      <div class="cl"><span class="lnum">  2</span><span class="gb"></span><span class="cd">${kw('return')} ${cr(lv('result'))}${sc(';')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Identifier under caret — write</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${cw(lv('result'))} ${op('=')} ${prm('amount')} ${op('*')} ${sf('_rate')}${sc(';')}</span></div>
      <div class="cl"><span class="lnum">  2</span><span class="gb"></span><span class="cd">${kw('return')} ${lv('result')}${sc(';')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Inlay hint — with background (INLAY_DEFAULT)</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${kw('var')} ${lv('slackUserIds')}${inlay(' :List&lt;int?&gt;')} ${op('=')} ${lv('recipients')}${dt('.')}${fnc('Select')}${pa('(')}${prm('r')} ${cop('=>')} ${prm('r')}${dt('.')}${inf('UserId')}${pa(')')}${dt('.')}${fnc('ToList')}${pa('(')}${pa(')')}${sc(';')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Inlay hint — no background (INLAY_TEXT_WITHOUT_BACKGROUND)</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb"></span><span class="cd">${kw('var')} ${lv('results')}${inlayx(' :IQueryable&lt;Notification&gt;')} ${op('=')} ${lv('db')}${dt('.')}${inf('Notifications')}${dt('.')}${fnc('Where')}${pa('(')}${prm('x')} ${cop('=>')} ${prm('x')}${dt('.')}${inf('IsRead')} ${op('==')} ${kw('false')}${pa(')')}${sc(';')}</span></div>
    </div>
  </div>

  <div class="chrome-item">
    <div class="chrome-label">Git gutter indicators</div>
    <div class="chrome-demo code-font">
      <div class="cl"><span class="lnum">  1</span><span class="gb gb-add"></span><span class="cd">${kw('public')} ${kw('async')} ${cls('Task')}&lt;${kw('decimal')}&gt; ${im('Process')}${pa('(')}...${pa(')')} ${lc('// added line')}</span></div>
      <div class="cl"><span class="lnum">  2</span><span class="gb gb-mod"></span><span class="cd">${lv('result')} ${op('=')} ${prm('amount')} ${op('*')} ${sf('_rate')}${sc(';')} ${lc('// modified line')}</span></div>
      <div class="cl"><span class="lnum">  3</span><span class="gb gb-del"></span><span class="cd">${kw('return')} ${lv('result')}${sc(';')} ${lc('// deleted (indicator above)')}</span></div>
    </div>
  </div>

</div>
`;

  // ── HTML template ─────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ocean Harbor — Theme Preview</title>
  <style>
    :root {
${cssVars}
    }
    ${fontStyleCSS}

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1a1f24;
      color: #b8c5d0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #009688, #00695c);
      padding: 10px 24px;
      color: white;
      font-weight: 600;
      font-size: 1.1em;
      flex-shrink: 0;
      border-bottom: 1px solid #00695c;
    }
    .header span {
      font-weight: 400;
      opacity: 0.7;
      font-size: 0.85em;
      margin-left: 12px;
    }

    /* Editor view */
    .editor-view {
      flex: 1;
      overflow-y: auto;
      background: #263238;
    }

    .section-label {
      background: #1e272c;
      color: #009688;
      padding: 6px 20px;
      font-size: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      font-weight: 600;
      border-top: 1px solid #37474f;
      border-bottom: 1px solid #37474f;
      margin-top: 8px;
    }
    .section-label:first-child { margin-top: 0; }

    .code-block { padding: 8px 0; }

    /* Code line layout */
    .code-font {
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 13px;
      line-height: 1.65;
    }

    .cl {
      display: flex;
      align-items: stretch;
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 13px;
      line-height: 1.65;
    }
    .cl:hover { background: rgba(255,255,255,0.02); }
    .cl.sel   { background: #314549; }
    .cl.car   { background: #1B2529; }

    .lnum {
      color: #37474f;
      min-width: 44px;
      text-align: right;
      padding-right: 12px;
      user-select: none;
      font-size: 11px;
      line-height: inherit;
      flex-shrink: 0;
    }

    .gb {
      width: 3px;
      flex-shrink: 0;
      margin-right: 14px;
      align-self: stretch;
    }
    .gb-add { background: #75C486; }
    .gb-mod { background: #CDB790; }
    .gb-del { background: #C88080; }

    .cd {
      flex: 1;
      white-space: pre;
      padding-right: 32px;
    }

    /* Identifier-under-caret highlights */
    .caret-read  { outline: 1px solid #3D8F87; border-radius: 1px; }
    .caret-write { outline: 1px solid #3F7D77; border-radius: 1px; }

    /* IDE Chrome section */
    .chrome-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(540px, 1fr));
      gap: 1px;
      background: #37474f;
      border-top: 1px solid #37474f;
    }

    .chrome-item {
      background: #263238;
      padding: 16px 20px;
    }

    .chrome-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #546e7a;
      font-weight: 600;
      margin-bottom: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .chrome-demo {
      background: #263238;
      border: 1px solid #37474f;
      border-radius: 4px;
      padding: 6px 0;
    }
    .chrome-demo .cl { font-size: 12.5px; }
    .chrome-demo .lnum { min-width: 36px; font-size: 10.5px; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #1e272c; }
    ::-webkit-scrollbar-thumb { background: #37474f; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #009688; }
  </style>
</head>
<body>
  <div class="header">
    Ocean Harbor — Theme Preview
    <span>Edit colors in ocean-harbor.xml, then run <code>npm run editor</code> to regenerate</span>
  </div>

  <div class="editor-view">

    <div class="section-label">C# — Rider / ReSharper semantic tokens</div>
    <div class="code-block">
${csharpLines}
    </div>

    <div class="section-label">SQL</div>
    <div class="code-block">
${sqlLines}
    </div>

    <div class="section-label">JavaScript</div>
    <div class="code-block">
${jsLines}
    </div>

    <div class="section-label">IDE Chrome — selection, caret, inlay hints, git gutter</div>
    ${chromeSection}

  </div>
</body>
</html>`;

  fs.writeFileSync('./theme-editor.html', html);
  console.log('Theme preview generated: theme-editor.html');
  console.log('Open it directly in a browser.');
}

generatePreview();
