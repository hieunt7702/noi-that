const fs = require('fs');
const cheerio = require('cheerio');

const files = ['index.html', 'index-v2.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    // First, fix literal "\n" in the HTML string before cheerio parsing
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/\\n<div class="item slide clearfix">/g, '\n<div class="item slide clearfix">');
    
    const $ = cheerio.load(html, { decodeEntities: false });

    // Move theme switch to the bottom
    const themeSwitchBtn = $('.fat-nav__wrapper .theme-switch-btn');
    if (themeSwitchBtn.length > 0) {
        // Move it after the contact info
        themeSwitchBtn.css({
            'margin-bottom': '0',
            'margin-top': '20px'
        });
        $('.fat-nav__wrapper').append(themeSwitchBtn);
    }
    
    // Move contact info to the bottom (just to be sure it's at the bottom)
    const contactInfo = $('.mobile-menu-contact');
    if (contactInfo.length > 0) {
        $('.fat-nav__wrapper').append(contactInfo);
    }
    
    // Ensure theme switch is after contact info if both exist at the bottom
    if (themeSwitchBtn.length > 0) {
        $('.fat-nav__wrapper').append(themeSwitchBtn);
    }

    fs.writeFileSync(file, $.html());
    console.log(`Updated ${file}: Fixed \\n and moved theme switch to bottom.`);
});
