const fs = require('fs');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove the broken stretched-fix CSS
    const cssFixRegex = /<style class="elementor-section-stretched-fix">[\s\S]*?<\/style>/;
    content = content.replace(cssFixRegex, '');

    // 2. Fix Top Header to use INLINE Flex styles (guaranteed horizontal layout)
    const headerRegex = /<section[^>]*data-id="764f6bf9"[\s\S]*?<\/section>/;
    const newHeader = `<section class="elementor-section elementor-top-section elementor-element elementor-element-764f6bf9 elementor-hidden-tablet elementor-hidden-phone elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="764f6bf9" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="background-color: #1c1918; padding: 5px 0;">
    <div class="elementor-container elementor-column-gap-default" style="max-width: 1200px; margin: 0 auto; padding: 0 15px;">
        <div style="display: flex; align-items: center; justify-content: flex-start; gap: 30px; width: 100%;">
            <!-- Mail -->
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <i class="fa fa-envelope-o" style="color: #ce9e51; font-size: 13px;" aria-hidden="true"></i>
                <span style="color: #ffffff; font-size: 13px; font-weight: 300;">hieunt270702@gmail.com</span>
            </div>
            <!-- Phone -->
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <i class="fa fa-phone" style="color: #ce9e51; font-size: 13px;" aria-hidden="true"></i>
                <span style="color: #ffffff; font-size: 13px; font-weight: 300;">0334 689 521</span>
            </div>
            <!-- Address -->
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <i class="fa fa-map-marker" style="color: #ce9e51; font-size: 13px;" aria-hidden="true"></i>
                <span style="color: #ffffff; font-size: 13px; font-weight: 300;">Hanoi, Vietnam</span>
            </div>
        </div>
    </div>
</section>`;
    content = content.replace(headerRegex, newHeader);

    // 3. Fix Slider data-slick for Autoplay & Arrows
    content = content.replace(/data-slick="([^"]+)"/g, (match, jsonString) => {
        try {
            // Safely parse JSON if it's encoded html entities
            const decoded = jsonString.replace(/&quot;/g, '"');
            const data = JSON.parse(decoded);
            
            // Apply to slider if it has fade or speed (identifying the banner slider)
            if (data.autoplaySpeed || data.Speed || data.fade !== undefined) {
                data.autoplay = true;
                data.arrows = false;
                data.dots = false; // Hide dots (the empty boxes)
                const newJsonString = JSON.stringify(data).replace(/"/g, '&quot;');
                return `data-slick="${newJsonString}"`;
            }
        } catch(e) { }
        return match;
    });

    // Remove any hardcoded slick arrow buttons in HTML
    content = content.replace(/<button[^>]*class="[^"]*slick-arrow[^"]*"[^>]*>[\s\S]*?<\/button>/g, '');
    content = content.replace(/<i[^>]*class="[^"]*slick-arrow[^"]*"[^>]*>[\s\S]*?<\/i>/g, '');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
});
