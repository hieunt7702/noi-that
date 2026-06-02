const fs = require('fs');
const path = require('path');

const htmlFiles = ['index.html', 'index-v2.html'];
const jsFiles = ['js/v1-bundle-footer.js', 'js/v2-bundle-footer.js'];

// 1. Fix HTML files
htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // a. Top header refactor (clean flex layout)
    const headerRegex = /<section[^>]*data-id="764f6bf9"[\s\S]*?<\/section>/;
    const cleanHeader = `<section class="elementor-section elementor-top-section elementor-element elementor-element-764f6bf9 elementor-hidden-tablet elementor-hidden-phone elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="764f6bf9" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
    <div class="elementor-container elementor-column-gap-default !max-w-[1200px] !mx-auto !px-4">
        <div class="flex items-center justify-start gap-12 w-full py-[5px]">
            <!-- Mail -->
            <div class="flex items-center gap-2 group cursor-pointer">
                <i class="fa fa-envelope-o text-[#ce9e51] text-[12px] group-hover:bg-transparent" aria-hidden="true"></i>
                <span class="text-white text-[13px] font-light group-hover:text-[#ce9e51] transition-colors">hieunt270702@gmail.com</span>
            </div>
            <!-- Phone -->
            <div class="flex items-center gap-2 group cursor-pointer">
                <i class="fa fa-phone text-[#ce9e51] text-[12px] group-hover:bg-transparent" aria-hidden="true"></i>
                <span class="text-white text-[13px] font-light group-hover:text-[#ce9e51] transition-colors">0334 689 521</span>
            </div>
            <!-- Address -->
            <div class="flex items-center gap-2 group cursor-pointer">
                <i class="fa fa-map-marker text-[#ce9e51] text-[12px] group-hover:bg-transparent" aria-hidden="true"></i>
                <span class="text-white text-[13px] font-light group-hover:text-[#ce9e51] transition-colors">Hanoi, Vietnam</span>
            </div>
        </div>
    </div>
</section>`;
    content = content.replace(headerRegex, cleanHeader);

    // b. Add overflow-x-hidden to body
    content = content.replace(/<body([^>]*)class="([^"]*)"/i, (match, before, classes) => {
        if (!classes.includes('overflow-x-hidden')) {
            return `<body${before}class="${classes} overflow-x-hidden"`;
        }
        return match;
    });

    // c. Add CSS fix for stretched sections if not already there
    if (!content.includes('elementor-section-stretched-fix')) {
        const fixStyle = `\n<style class="elementor-section-stretched-fix">
        .elementor-section-stretched {
            width: 100vw !important;
            left: 50% !important;
            right: 50% !important;
            margin-left: -50vw !important;
            margin-right: -50vw !important;
        }
        </style>\n</head>`;
        content = content.replace('</head>', fixStyle);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated HTML: ${file}`);
});

// 2. Fix JS files (slider auto-play and hide arrows)
jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace slick init for home-slider
    // Original might have:
    // nextArrow: '<i class="fa fa-angle-right"></i>',
    // prevArrow: '<i class="fa fa-angle-left"></i>',
    
    // We can just add arrows: false to the config and remove next/prevArrow
    
    // Regex to match the block:
    const sliderRegex = /(\$\('.home-slider'\)\.slick\(\{[\s\S]*?)nextArrow:[^\n]*\n\s*prevArrow:[^\n]*\n/g;
    
    if (sliderRegex.test(content)) {
        content = content.replace(sliderRegex, `$1arrows: false,\n`);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated JS: ${file}`);
    } else {
        // If it doesn't match the arrows, let's just forcefully inject arrows: false right after autoplay: true
        if (content.includes("$('.home-slider').slick({")) {
            content = content.replace(/(\$\('\.home-slider'\)\.slick\(\{[\s\S]*?autoplay:\s*true,)/, '$1\n\t\t\tarrows: false,');
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated JS (fallback): ${file}`);
        } else {
            console.log(`Could not find home-slider in ${file}`);
        }
    }
});
