const fs = require('fs');
const cheerio = require('cheerio');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    let updated = false;

    // Fix slider-text
    $('.slider-text').each((i, el) => {
        if (!$(el).attr('data-i18n')) {
            $(el).attr('data-i18n', 'slider.text');
            updated = true;
        }
    });

    // Fix feature buttons
    $('.feature-btn').each((i, el) => {
        if (!$(el).attr('data-i18n')) {
            $(el).attr('data-i18n', 'feature1.btn'); // generic learn more
            updated = true;
        }
    });

    // Fix process descriptions (p.desc inside work-process)
    $('.work-process .box-cont p.desc').each((i, el) => {
        // Find which process it is
        const h3 = $(el).siblings('h3');
        const h3i18n = h3.attr('data-i18n'); // e.g. process1.title
        if (h3i18n && h3i18n.includes('.title')) {
            const descI18n = h3i18n.replace('.title', '.desc');
            if (!$(el).attr('data-i18n')) {
                $(el).attr('data-i18n', descI18n);
                updated = true;
            }
        }
    });

    // Fix Smart planing of Work process (index-v2.html)
    // We already have 'workprocess.subtitle' for 'Smart planing of <span...>Work process</span>'
    // Let's find it. It's usually a div containing a span
    $('*').each((i, el) => {
        let text = $(el).text().trim().replace(/\s+/g, ' ');
        if (text === 'Smart planing of Work process' || text === 'Smart planing of') {
            if (!$(el).attr('data-i18n')) {
                $(el).closest('.elementor-widget-container').find('.elementor-text-editor, .title-sub').attr('data-i18n', 'workprocess.subtitle');
                updated = true;
            }
        }
    });

    // Fix Innovation Banner
    $('p:contains("BIM has been giving best consultation")').each((i, el) => {
        const parent = $(el).parent();
        if (!parent.attr('data-i18n')) {
            parent.attr('data-i18n', 'innovation.title');
            updated = true;
        }
    });

    // Fix imgbox-text and icon-title
    $('.imgbox-text').each((i, el) => {
        if (!$(el).attr('data-i18n')) {
            $(el).attr('data-i18n', 'service.general.desc');
            updated = true;
        }
    });
    
    // Monthly Revenue
    $('.elementor-counter-title:contains("Monthly Revenue")').each((i, el) => {
        if (!$(el).attr('data-i18n')) {
            $(el).attr('data-i18n', 'about.stat4.label');
            updated = true;
        }
    });

    // Feature titles (Visualize your ideas, etc.)
    $('.icon-title:contains("Visualize your ideas")').attr('data-i18n', 'feature1.title');
    $('.icon-title:contains("Render 3D works")').attr('data-i18n', 'feature2.title');
    $('.icon-title:contains("Gain a perspective")').attr('data-i18n', 'feature3.title');
    
    if (updated) {
        fs.writeFileSync(file, $.html());
        console.log(`Patched remaining untranslated elements in ${file}`);
    }
});
