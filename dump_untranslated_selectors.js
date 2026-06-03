const fs = require('fs');
const cheerio = require('cheerio');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    console.log(`=== ${file} ===`);
    
    $('*').each((i, el) => {
        if (el.tagName === 'script' || el.tagName === 'style' || el.tagName === 'noscript') return;
        if ($(el).closest('[data-i18n]').length > 0) return;
        if ($(el).closest('.slider-title').length > 0) return;
        
        const directTextNodes = $(el).contents().filter(function() {
            return this.type === 'text';
        });
        
        directTextNodes.each((i, textNode) => {
            const text = $(textNode).text().trim();
            if (text.length > 2 && /[a-zA-Z\u00C0-\u1EF9]/.test(text)) {
                // Get selector
                let selector = el.tagName;
                if ($(el).attr('class')) {
                    selector += '.' + $(el).attr('class').split(' ').join('.');
                }
                if ($(el).attr('id')) {
                    selector += '#' + $(el).attr('id');
                }
                console.log(`${selector} => "${text.replace(/\n/g, ' ')}"`);
            }
        });
    });
});
