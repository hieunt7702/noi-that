const fs = require('fs');
const cheerio = require('cheerio');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    
    const untranslated = new Set();
    
    $('*').each((i, el) => {
        // Skip script, style, noscript tags
        if (el.tagName === 'script' || el.tagName === 'style' || el.tagName === 'noscript') return;
        
        // Skip elements that have data-i18n or are children of data-i18n elements
        if ($(el).closest('[data-i18n]').length > 0) return;
        if ($(el).closest('.slider-title').length > 0) return; // Ignore splitted titles we handled
        
        // Find direct text nodes
        const directTextNodes = $(el).contents().filter(function() {
            return this.type === 'text';
        });
        
        directTextNodes.each((i, textNode) => {
            const text = $(textNode).text().trim();
            // Match strings with words, ignore just symbols or numbers or very short strings
            if (text.length > 2 && /[a-zA-Z\u00C0-\u1EF9]/.test(text)) {
                untranslated.add(text);
            }
        });
    });
    
    console.log(`=== ${file} ===`);
    Array.from(untranslated).sort().forEach(text => {
        console.log(text.replace(/\n/g, ' '));
    });
});
