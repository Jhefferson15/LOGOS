const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');
const { execSync } = require('child_process');

const docsDir = path.join(__dirname, '../docs');
const sourceDir = path.join(__dirname, '../Frontend/js');

async function generateMarkdown() {
    console.log('Generating Markdown documentation...');
    try {
        const markdown = await jsdoc2md.render({ files: `${sourceDir}/**/*.js` });
        fs.writeFileSync(path.join(docsDir, 'documentation.md'), markdown);
        console.log('Markdown generated at docs/documentation.md');
    } catch (e) {
        console.error('Failed to generate Markdown:', e);
    }
}

function generateJSON() {
    console.log('Generating JSON data...');
    try {
        const jsdocPath = path.join(__dirname, '../node_modules/.bin/jsdoc');
        // Use -X to dump the parse tree
        // On Windows, we might need to handle the path differently or use 'npx jsdoc'
        // Let's try npx first as it's safer across environments if installed locally
        const cmdDump = `npx jsdoc -c jsdoc.json -X > "${path.join(docsDir, 'data.json')}"`;
        execSync(cmdDump, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log('JSON data generated at docs/data.json');
    } catch (e) {
        console.error('Failed to generate JSON:', e);
    }
}

function injectDownloadButton() {
    console.log('Injecting download buttons into HTML files...');
    if (!fs.existsSync(docsDir)) {
        console.log('Docs directory not found, skipping injection.');
        return;
    }

    const files = fs.readdirSync(docsDir);

    const buttonHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <button onclick="var m=document.getElementById('dl-menu'); m.style.display = m.style.display === 'none' ? 'block' : 'none'" 
                style="background: #444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
            Download Options
        </button>
        <div id="dl-menu" style="display: none; position: absolute; bottom: 100%; right: 0; background: #333; border: 1px solid #555; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); min-width: 160px; margin-bottom: 10px; overflow: hidden;">
            <a href="#" onclick="window.print(); return false;" style="display: block; padding: 10px; color: #eee; text-decoration: none; border-bottom: 1px solid #444;">Save as PDF</a>
            <a href="documentation.md" download="LOGOS_Docs.md" style="display: block; padding: 10px; color: #eee; text-decoration: none; border-bottom: 1px solid #444;">Download Markdown</a>
            <a href="data.json" download="LOGOS_Data.json" style="display: block; padding: 10px; color: #eee; text-decoration: none;">Download JSON</a>
        </div>
    </div>
    `;

    let injectedCount = 0;
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(docsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Avoid double injection
            if (!content.includes('id="dl-menu"') && content.includes('</body>')) {
                content = content.replace('</body>', `${buttonHTML}</body>`);
                fs.writeFileSync(filePath, content);
                injectedCount++;
            }
        }
    });
    console.log(`Download buttons injected into ${injectedCount} files.`);
}

async function main() {
    try {
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }

        await generateMarkdown();
        generateJSON();
        injectDownloadButton();

    } catch (error) {
        console.error('Error in enhance-docs script:', error);
        process.exit(1);
    }
}

main();
