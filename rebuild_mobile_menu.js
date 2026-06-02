const fs = require('fs');
const cheerio = require('cheerio');

const files = ['index.html', 'index-v2.html'];

const contactHTML = `
<div class="mobile-menu-contact" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); width: 100%; display: flex; justify-content: center;">
    <div style="display: flex; flex-direction: column; gap: 15px; align-items: flex-start;">
        <a href="mailto:hieunt270702@gmail.com" style="display: flex; align-items: center; gap: 12px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(206, 158, 81, 0.1); display: flex; align-items: center; justify-content: center;">
                <i class="fa fa-envelope-o" style="color: #ce9e51; font-size: 14px;" aria-hidden="true"></i>
            </div>
            <span style="color: #ffffff; font-size: 14px; font-weight: 300;">hieunt270702@gmail.com</span>
        </a>
        <a href="tel:0334689521" style="display: flex; align-items: center; gap: 12px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(206, 158, 81, 0.1); display: flex; align-items: center; justify-content: center;">
                <i class="fa fa-phone" style="color: #ce9e51; font-size: 14px;" aria-hidden="true"></i>
            </div>
            <span style="color: #ffffff; font-size: 14px; font-weight: 300;">0334 689 521</span>
        </a>
        <div style="display: flex; align-items: center; gap: 12px; text-decoration: none; border-bottom: none !important; padding: 0 !important;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(206, 158, 81, 0.1); display: flex; align-items: center; justify-content: center;">
                <i class="fa fa-map-marker" style="color: #ce9e51; font-size: 14px;" aria-hidden="true"></i>
            </div>
            <span style="color: #ffffff; font-size: 14px; font-weight: 300;">Hanoi, Vietnam</span>
        </div>
    </div>
</div>
`;

const closeBtnHTML = `
<a href="#" class="fat-nav-close" style="position: absolute; top: 30px; right: 30px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 50%; text-decoration: none; transition: background 0.3s ease;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
</a>
`;

const customJS = `
<script id="mobile-menu-custom-js">
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.mobile-wrapper .hamburger');
    const fatNav = document.querySelector('.fat-nav');
    const closeBtn = document.querySelector('.fat-nav-close');
    const navLinks = document.querySelectorAll('.fat-nav a');

    if (hamburger && fatNav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fatNav.classList.add('active');
            document.body.classList.add('nav-active');
        });
    }

    function closeNav(e) {
        if(e) e.preventDefault();
        if(fatNav) fatNav.classList.remove('active');
        document.body.classList.remove('nav-active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });
});
</script>
`;

const styleBlock = `
<style id="mobile-menu-xinxo">
    /* Reset elementor container affecting viewport */
    body.nav-active {
        overflow: hidden !important;
    }

    /* Glassmorphism Mobile Menu */
    .fat-nav {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(20, 20, 20, 0.98) !important;
        backdrop-filter: blur(25px) !important;
        -webkit-backdrop-filter: blur(25px) !important;
        transition: opacity 0.5s ease, visibility 0.5s ease !important;
        display: block !important;
        opacity: 0;
        visibility: hidden;
        z-index: 9999999 !important;
    }
    .fat-nav.active {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .fat-nav__wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; /* Center horizontally */
        width: 100%;
        height: 100%;
        padding: 40px 30px !important;
        box-sizing: border-box;
        position: relative;
    }
    
    .fat-nav-close:hover {
        background: rgba(255,255,255,0.15) !important;
    }
    
    /* Menu Typography and Animation */
    .fat-nav ul.mob-nav {
        padding: 0 !important;
        display: flex;
        flex-direction: column;
        align-items: center; /* Center items */
        width: 100%;
    }
    .fat-nav li {
        text-align: center !important;
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        width: 100%;
    }
    .fat-nav.active li {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Staggered delay */
    .fat-nav.active li:nth-child(1) { transition-delay: 0.1s; }
    .fat-nav.active li:nth-child(2) { transition-delay: 0.15s; }
    .fat-nav.active li:nth-child(3) { transition-delay: 0.2s; }
    .fat-nav.active li:nth-child(4) { transition-delay: 0.25s; }
    .fat-nav.active li:nth-child(5) { transition-delay: 0.3s; }
    
    .fat-nav li > a {
        border-bottom: none !important;
        font-size: 32px !important;
        font-weight: 300 !important;
        color: #ffffff !important;
        text-transform: capitalize !important;
        padding: 15px 0 !important;
        transition: color 0.3s ease, transform 0.3s ease !important;
        display: inline-block !important;
    }
    .fat-nav li > a:hover {
        color: #ce9e51 !important;
        transform: translateY(-2px);
    }
    
    /* Contact Block Animation */
    .mobile-menu-contact {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s;
    }
    .fat-nav.active .mobile-menu-contact {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Remove my old hamburger animation, keep it basic since we have an X button inside */
</style>
`;

files.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log(`File ${file} not found.`);
        return;
    }
    
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // 1. Clean up old injections
    $('#mobile-menu-xinxo').remove();
    $('#mobile-menu-custom-js').remove();
    $('.fat-nav-close').remove();
    $('.mobile-menu-contact').remove(); // ensure no duplicates in fat-nav__wrapper

    // 2. Find fat-nav and move it directly to body to escape any CSS containment/transform
    const fatNav = $('.fat-nav');
    if (fatNav.length > 0) {
        // Move to body
        $('body').append(fatNav);
    }
    
    // 3. Inject new style and script
    $('head').append(styleBlock);
    $('body').append(customJS);
    
    // 4. Inject contact info and close button into .fat-nav__wrapper
    $('.fat-nav__wrapper').append(contactHTML);
    $('.fat-nav__wrapper').prepend(closeBtnHTML);
    
    // 5. The theme switch was already moved in the last script run. 
    // Ensure it's centered if it exists.
    const themeSwitchBtn = $('.fat-nav__wrapper .theme-switch-btn');
    if (themeSwitchBtn.length > 0) {
        themeSwitchBtn.css({
            'justify-content': 'center',
            'width': '100%',
            'margin-bottom': '30px'
        });
    }

    fs.writeFileSync(file, $.html());
    console.log(`Updated ${file} with centered mobile menu, body appended.`);
});
