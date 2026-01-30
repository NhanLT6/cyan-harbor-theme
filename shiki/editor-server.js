/**
 * Simple Node server to serve the theme editor and handle XML saving
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const XML_PATH = path.join(__dirname, '../cyan-harbor.xml');
const HTML_FILE = 'theme-editor.html';

const server = http.createServer((req, res) => {
    // Handle Save Endpoint
    if (req.method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const themeConfigs = JSON.parse(body);
                const success = updateXml(themeConfigs);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success }));
            } catch (err) {
                console.error('Error in save:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Handle Static Files
    let filePath = req.url === '/' ? HTML_FILE : req.url.substring(1);
    // Security check: only allow files in this directory
    filePath = path.join(__dirname, filePath);

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.json') contentType = 'application/json';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

/**
 * Updates the XML file with new foreground colors and font styles
 */
function updateXml(languageConfigs) {
    let xmlContent = fs.readFileSync(XML_PATH, 'utf-8');

    // Flatten all configs into a single map of key -> { foreground, fontStyle }
    const flatConfig = {};
    Object.values(languageConfigs).forEach(configs => {
        Object.entries(configs).forEach(([key, data]) => {
            flatConfig[key] = data;
        });
    });

    // For each token, update its block in the XML
    Object.entries(flatConfig).forEach(([key, data]) => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Pattern to match the specific option block: <option name="KEY">...</option>
        // We update both FOREGROUND and FONT_TYPE if they exist.
        const optionBlockRegex = new RegExp(`(<option name="${escapedKey}">\\s*<value>\\s*[\\s\\S]*?\\s*</value>\\s*</option>)`, 'g');

        xmlContent = xmlContent.replace(optionBlockRegex, (match) => {
            let updatedBlock = match;

            // Update FOREGROUND
            if (data.foreground) {
                const hex = data.foreground.substring(1).toLowerCase(); // XML uses lowercase hex without #
                updatedBlock = updatedBlock.replace(
                    /(<option name="FOREGROUND" value=")([^"]+)(")/,
                    `$1${hex}$3`
                );
            }

            // Update FONT_TYPE
            // IntelliJ font types: 0=normal, 1=bold, 2=italic, 3=bold+italic
            let fontType = '0';
            const styles = data.fontStyle || '';
            const isBold = styles.includes('bold');
            const isItalic = styles.includes('italic');

            if (isBold && isItalic) fontType = '3';
            else if (isItalic) fontType = '2';
            else if (isBold) fontType = '1';

            if (updatedBlock.includes('FONT_TYPE')) {
                updatedBlock = updatedBlock.replace(
                    /(<option name="FONT_TYPE" value=")([^"]+)(")/,
                    `$1${fontType}$3`
                );
            } else if (fontType !== '0') {
                // If FONT_TYPE doesn't exist but we need it, inject it inside the <value> tag
                updatedBlock = updatedBlock.replace(
                    /(<\/value>)/,
                    `  <option name="FONT_TYPE" value="${fontType}" />\n        $1`
                );
            }

            return updatedBlock;
        });
    });

    fs.writeFileSync(XML_PATH, xmlContent, 'utf-8');
    console.log('✅ Updated ' + XML_PATH);
    return true;
}

server.listen(PORT, () => {
    console.log(`\n🚀 Theme Editor Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving ${HTML_FILE}`);
    console.log('💡 Keep this terminal open while editing. Press Ctrl+C to stop.');

    // Use 'start' (Windows) to open browser
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`);
});
