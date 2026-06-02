const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const filesToProcess = [
    'index.html',
    'index-v2.html',
    'css/tailwind-compiled.css',
    'js/v1-bundle-head.js',
    'js/v1-bundle-footer.js',
    'js/v2-bundle-head.js',
    'js/v2-bundle-footer.js',
    'js/v1-gtm.js',
    'js/v2-gtm.js'
];

// Regexes for replacing the brand name
const replacements = [
    { regex: /bim-/g, replacement: 'noithat-' },
    { regex: /-bim/g, replacement: '-noithat' },
    { regex: /_bim/g, replacement: '_noithat' },
    { regex: /Bim/g, replacement: 'NoiThat' }, // usually text or Title case
    { regex: /bim_loader/g, replacement: 'noithat_loader' }
];

filesToProcess.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File not found - ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalLength = content.length;

    // 1. Remove fit-vids-style HTML wrapper block from HTML files
    if (file.endsWith('.html')) {
        content = content.replace(/<div class="fit-vids-style">[\s\S]*?<\/div>/g, '');
    }

    // 2. Remove Javascript injecting fit-vids-style
    if (file.endsWith('.js')) {
        // Find things like: div.className = 'fit-vids-style';
        content = content.replace(/div\.className\s*=\s*['"]fit-vids-style['"];/g, '');
        // Sometimes they append it to head or something, removing the class name assignment should break its effect or we can just nuke the block. 
        // Actually, replacing 'fit-vids-style' with '' in the JS prevents the class from being added.
        content = content.replace(/['"]fit-vids-style['"]/g, '""');
    }

    // 3. Rename Project ID 'bim' to 'noithat'
    replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${file} (Size diff: ${content.length - originalLength} bytes)`);
});

// 4. Rename physical files
const imagesDir = path.join(projectRoot, 'images', 'v2');
if (fs.existsSync(imagesDir)) {
    const loaderPath = path.join(imagesDir, 'bim_loader.svg');
    const newLoaderPath = path.join(imagesDir, 'noithat_loader.svg');
    
    if (fs.existsSync(loaderPath)) {
        fs.renameSync(loaderPath, newLoaderPath);
        console.log('Renamed bim_loader.svg to noithat_loader.svg');
    }
}

console.log('White-labeling complete.');
