const { createHighlighter } = require('shiki');
const fs = require('fs');

(async () => {
    const theme = require('./ocean-harbor-shiki-theme.json');
    const highlighter = await createHighlighter({
        themes: [theme],
        langs: ['markdown']
    });

    const markdown = `- bullet item
1. numbered item`;

    const html = highlighter.codeToHtml(markdown, {
        lang: 'markdown',
        theme: 'Ocean Harbor'
    });

    console.log('===== SHIKI OUTPUT =====');
    console.log(html);
    console.log('\\n===== TOKEN CHECK =====');

    // Check if list markers are present
    if (html.includes('var(--token-')) {
        console.log('✅ CSS variables found in output');
    } else {
        console.log('❌ No CSS variables in output - Shiki resolved them');
    }

    if (html.match(/\u003cspan[^>]*>-\u003c\/span>/)) {
        console.log('✅ Dash marker found');
    }

    if (html.match(/\u003cspan[^>]*>1\.\u003c\/span>/)) {
        console.log('✅ Number marker found');
    }

    // Save to file
    fs.writeFileSync('./test-markdown-shiki-output.html', html);
    console.log('\\nSaved to test-markdown-shiki-output.html');
})();
