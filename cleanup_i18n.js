const fs = require('fs');
const cheerio = require('cheerio');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    let removedCount = 0;
    
    $('[data-i18n]').each((i, el) => {
        // If this element contains child elements that are not just simple formatting (like a, div, section, ul, li)
        // actually, if it contains an 'a' tag, it should NOT have data-i18n directly unless the a tag IS the data-i18n element.
        // Even simpler: If it has children that ALSO have data-i18n, remove it from the parent.
        
        const childrenWithI18n = $(el).find('[data-i18n]');
        if (childrenWithI18n.length > 0) {
            $(el).removeAttr('data-i18n');
            removedCount++;
        } else {
            // Also if it's an <li> that contains an <a>, we shouldn't overwrite the <li>
            if (el.tagName === 'li' && $(el).find('a').length > 0) {
                $(el).removeAttr('data-i18n');
                removedCount++;
            }
        }
    });
    
    fs.writeFileSync(file, $.html());
    console.log(`Cleaned up ${removedCount} overlapping data-i18n tags in ${file}`);
});
