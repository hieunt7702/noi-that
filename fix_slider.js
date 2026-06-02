const fs = require('fs');

const jsFiles = ['js/v1-bundle-footer.js', 'js/v2-bundle-footer.js'];

jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Add unslick logic before initializing slick
    if (content.includes("$('.home-slider').slick({") && !content.includes("$('.home-slider').slick('unslick')")) {
        content = content.replace(/\$\('\.home-slider'\)\.slick\(\{/g, "try { $('.home-slider').slick('unslick'); } catch(e) {}\n\t\t$('.home-slider').slick({");
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Unslick already present or home-slider not found in ${file}`);
    }
});
