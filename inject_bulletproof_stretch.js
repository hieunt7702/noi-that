const fs = require('fs');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Bulletproof Elementor Stretch CSS
    const bulletproofFix = `<style class="bulletproof-elementor-stretch">
        .elementor-section-stretched {
            width: 100vw !important;
            position: relative !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-width: 100vw !important;
        }
        body { overflow-x: hidden !important; }
    </style>\n</head>`;

    if (!content.includes('bulletproof-elementor-stretch')) {
        content = content.replace('</head>', bulletproofFix);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Injected bulletproof stretch CSS into ${file}`);
    } else {
        console.log(`CSS already present in ${file}`);
    }
});
