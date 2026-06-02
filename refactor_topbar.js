const fs = require('fs');
const path = require('path');

const files = ['index.html', 'index-v2.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    const sectionRegex = /<section[^>]*data-id="764f6bf9"[\s\S]*?<\/section>/;

    const replacement = `<section class="elementor-section elementor-top-section elementor-element elementor-element-764f6bf9 elementor-hidden-tablet elementor-hidden-phone elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="764f6bf9" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
    <div class="elementor-container elementor-column-gap-default !max-w-7xl !mx-auto">
        <div class="w-full flex justify-center items-center py-2 gap-12 text-gray-300">
            
            <!-- Mail -->
            <div class="flex items-center gap-2 hover:text-[#ce9e51] transition-colors cursor-pointer">
                <i class="noithat-icon fa fa-envelope-o text-[#ce9e51] text-lg" aria-hidden="true"></i>
                <span class="text-sm font-light tracking-wide">hieunt270702@gmail.com</span>
            </div>

            <!-- Phone -->
            <div class="flex items-center gap-2 hover:text-[#ce9e51] transition-colors cursor-pointer">
                <i class="noithat-icon fa fa-phone text-[#ce9e51] text-lg" aria-hidden="true"></i>
                <span class="text-sm font-light tracking-wide">0334 689 521</span>
            </div>

            <!-- Address -->
            <div class="flex items-center gap-2 hover:text-[#ce9e51] transition-colors cursor-pointer">
                <i class="noithat-icon fa fa-map-marker text-[#ce9e51] text-lg" aria-hidden="true"></i>
                <span class="text-sm font-light tracking-wide">Hanoi, Vietnam</span>
            </div>

        </div>
    </div>
</section>`;

    if (sectionRegex.test(content)) {
        content = content.replace(sectionRegex, replacement);
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find section in ${file}`);
    }
});
