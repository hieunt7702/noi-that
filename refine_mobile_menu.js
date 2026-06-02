const fs = require('fs');
const cheerio = require('cheerio');

const files = ['index.html', 'index-v2.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // 1. Refine the CSS in #mobile-menu-xinxo
    let styleBlock = $('#mobile-menu-xinxo').html();
    if (styleBlock) {
        // Remove border-bottom from menu items and adjust typography
        styleBlock = styleBlock.replace(/border-bottom: none !important;/g, 'border-bottom: none !important; text-decoration: none !important;');
        
        // Remove any old border-bottom rules if they existed in different formats
        styleBlock = styleBlock.replace(/border-bottom:.*?;/g, 'border-bottom: none !important;');

        // Add specific CSS for the refined UI
        const newCssRules = `
    /* New refined UI Rules */
    .fat-nav li > a {
        font-size: 36px !important;
        font-weight: 300 !important;
        letter-spacing: 1px;
        color: #ffffff !important;
        text-transform: capitalize !important;
        padding: 10px 0 !important;
        transition: color 0.3s ease, transform 0.3s ease !important;
        display: inline-block !important;
        border: none !important;
        text-decoration: none !important;
    }
    .fat-nav li > a:hover {
        color: #ce9e51 !important;
        transform: scale(1.05);
    }
    .fat-nav ul.mob-nav {
        gap: 15px;
    }
    
    .fat-nav-close {
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        transition: all 0.3s ease !important;
    }
    .fat-nav-close:hover {
        background: #ffffff !important;
        border-color: #ffffff !important;
    }
    .fat-nav-close:hover svg line {
        stroke: #1a1a1a !important;
    }

    /* Theme switch positioned top left */
    .theme-switch-btn.menu-theme-btn {
        position: absolute;
        top: 30px;
        left: 30px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #ce9e51 !important;
        text-decoration: none !important;
        transition: all 0.3s ease;
        z-index: 100;
    }
    .theme-switch-btn.menu-theme-btn span {
        display: none; /* Hide text, icon only */
    }
    .theme-switch-btn.menu-theme-btn:hover {
        background: #ce9e51;
        color: #1a1a1a !important;
    }
    .theme-switch-btn.menu-theme-btn i {
        font-size: 18px;
    }
    
    .mobile-menu-contact {
        margin-top: 60px;
        padding-top: 40px;
        border-top: 1px solid rgba(255,255,255,0.05) !important;
        width: 80%;
    }
    .mobile-menu-contact .contact-item {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .mobile-menu-contact .contact-item:hover {
        opacity: 0.8;
        transform: translateX(5px);
    }
        `;
        
        // Append new rules
        $('#mobile-menu-xinxo').html(styleBlock + newCssRules);
    }

    // 2. Fix the contact info HTML to add .contact-item and center correctly
    const contactInfo = $('.mobile-menu-contact');
    if (contactInfo.length > 0) {
        // Re-write the contact info HTML for cleaner UI
        const newContactHTML = `
        <div class="mobile-menu-contact" style="width: 100%; display: flex; justify-content: center;">
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start;">
                <a href="mailto:hieunt270702@gmail.com" class="contact-item" style="display: flex; align-items: center; gap: 15px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
                    <i class="fa fa-envelope-o" style="color: #ce9e51; font-size: 18px; width: 20px; text-align: center;" aria-hidden="true"></i>
                    <span style="color: #aaaaaa; font-size: 15px; font-weight: 300; letter-spacing: 0.5px;">hieunt270702@gmail.com</span>
                </a>
                <a href="tel:0334689521" class="contact-item" style="display: flex; align-items: center; gap: 15px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
                    <i class="fa fa-phone" style="color: #ce9e51; font-size: 18px; width: 20px; text-align: center;" aria-hidden="true"></i>
                    <span style="color: #aaaaaa; font-size: 15px; font-weight: 300; letter-spacing: 0.5px;">0334 689 521</span>
                </a>
                <div class="contact-item" style="display: flex; align-items: center; gap: 15px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
                    <i class="fa fa-map-marker" style="color: #ce9e51; font-size: 18px; width: 20px; text-align: center;" aria-hidden="true"></i>
                    <span style="color: #aaaaaa; font-size: 15px; font-weight: 300; letter-spacing: 0.5px;">Hanoi, Vietnam</span>
                </div>
            </div>
        </div>
        `;
        contactInfo.replaceWith(newContactHTML);
    }
    
    // 3. Move Theme Toggle to absolute top left
    const themeSwitchBtn = $('.fat-nav__wrapper .theme-switch-btn');
    if (themeSwitchBtn.length > 0) {
        // Strip inline styles that force it to be at the bottom
        themeSwitchBtn.removeAttr('style');
        themeSwitchBtn.addClass('menu-theme-btn');
        // Prepend it to fat-nav wrapper so it gets picked up by absolute positioning
        $('.fat-nav__wrapper').prepend(themeSwitchBtn);
    }

    fs.writeFileSync(file, $.html());
    console.log(`Updated ${file}: Refined mobile menu UI, moved theme switch to top-left.`);
});
