const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '../Frontend/assets');
const SIZES = {
    thumb: 150,
    medium: 400,
    large: 800
};

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
                // Skip if already a resized version
                if (file.includes('_thumb') || file.includes('_medium') || file.includes('_large')) {
                    continue;
                }

                console.log(`Processing: ${file}`);

                for (const [sizeName, width] of Object.entries(SIZES)) {
                    const newFileName = file.replace(ext, `_${sizeName}${ext}`);
                    const newPath = path.join(directory, newFileName);

                    if (!fs.existsSync(newPath)) {
                        try {
                            await sharp(fullPath)
                                .resize({ width: width, withoutEnlargement: true })
                                .toFile(newPath);
                            console.log(`  Created ${sizeName}: ${newFileName}`);
                        } catch (err) {
                            console.error(`  Error creating ${sizeName} for ${file}:`, err.message);
                        }
                    } else {
                        // console.log(`  Skipping ${sizeName}, already exists.`);
                    }
                }
            }
        }
    }
}

console.log('Starting image optimization...');
processDirectory(ASSETS_DIR)
    .then(() => console.log('Image optimization complete!'))
    .catch(err => console.error('Fatal error:', err));
