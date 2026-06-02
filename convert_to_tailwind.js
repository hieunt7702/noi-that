const fs = require('fs');
const cheerio = require('cheerio');

const files = ['index.html', 'index-v2.html'];

function styleToTailwind(styleString) {
    if (!styleString) return '';
    const rules = styleString.split(';').map(r => r.trim()).filter(Boolean);
    const twClasses = [];
    
    rules.forEach(rule => {
        const [prop, ...valParts] = rule.split(':');
        if (!prop) return;
        const value = valParts.join(':').trim();
        
        switch (prop.trim()) {
            case 'width':
                twClasses.push(`w-[${value}]`);
                break;
            case 'height':
                twClasses.push(`h-[${value}]`);
                break;
            case 'margin-top':
                twClasses.push(`mt-[${value}]`);
                break;
            case 'margin-bottom':
                twClasses.push(`mb-[${value}]`);
                break;
            case 'margin-left':
                twClasses.push(`ml-[${value}]`);
                break;
            case 'margin-right':
                twClasses.push(`mr-[${value}]`);
                break;
            case 'padding-top':
                twClasses.push(`pt-[${value}]`);
                break;
            case 'padding-bottom':
                twClasses.push(`pb-[${value}]`);
                break;
            case 'padding-left':
                twClasses.push(`pl-[${value}]`);
                break;
            case 'padding-right':
                twClasses.push(`pr-[${value}]`);
                break;
            case 'color':
                twClasses.push(`text-[${value}]`);
                break;
            case 'background-color':
                twClasses.push(`bg-[${value}]`);
                break;
            case 'background-image':
                // simple handling for url
                twClasses.push(`bg-[${value.replace(/\s/g, '')}]`);
                break;
            case 'text-align':
                twClasses.push(`text-${value}`);
                break;
            case 'display':
                if (value === 'flex') twClasses.push('flex');
                if (value === 'grid') twClasses.push('grid');
                if (value === 'none') twClasses.push('hidden');
                if (value === 'block') twClasses.push('block');
                if (value === 'inline-block') twClasses.push('inline-block');
                break;
            // keep the rest in style if too complex? 
            // For now, let's aggressively convert simple ones
        }
    });
    
    return twClasses.join(' ');
}

function processFile(filename) {
    console.log(`Processing ${filename}...`);
    const html = fs.readFileSync(filename, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    let convertedCount = 0;

    // Convert inline styles
    $('[style]').each((i, el) => {
        const style = $(el).attr('style');
        if (style) {
            const twClass = styleToTailwind(style);
            if (twClass) {
                $(el).addClass(twClass);
                $(el).removeAttr('style');
                convertedCount++;
            }
        }
    });

    // Map common structural classes to Tailwind to reduce pure CSS layout reliance
    const classMappings = {
        'elementor-section-stretched': 'w-full relative',
        'elementor-container': 'max-w-7xl mx-auto flex flex-wrap',
        'elementor-row': 'flex w-full',
        'elementor-widget-wrap': 'flex flex-col w-full relative',
        'elementor-widget-heading': 'mb-4',
        // 'fat-nav' is handled via manual HTML overrides earlier
    };

    Object.entries(classMappings).forEach(([cssClass, twClasses]) => {
        $(`.${cssClass}`).each((i, el) => {
            $(el).addClass(twClasses);
            // Optionally, we could remove the original class, but we MUST keep it 
            // if JS relies on it (like elementor-section-stretched). 
            // We will leave the class to be safe with JS, but add Tailwind layout classes.
        });
    });

    fs.writeFileSync(filename, $.html());
    console.log(`Converted ${convertedCount} elements in ${filename}`);
}

files.forEach(processFile);
console.log('Done!');
