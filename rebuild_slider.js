const fs = require('fs');
const cheerio = require('cheerio');

// Load v1.html and extract its slides
const v1Html = fs.readFileSync('../v1.html', 'utf8');
const $v1 = cheerio.load(v1Html);
const v1Slides = [];
$v1('.home-slider .item.slide:not(.slick-cloned)').each((i, el) => {
    // Remove slick-specific classes
    $v1(el).removeClass('slick-slide slick-current slick-active');
    $v1(el).removeAttr('data-slick-index aria-hidden style tabindex role aria-describedby');
    v1Slides.push($v1.html(el));
});

// Load index-v2.html and extract its slides
const v2Html = fs.readFileSync('index-v2.html', 'utf8');
const $v2 = cheerio.load(v2Html);
const v2Slides = [];
$v2('.home-slider .item.slide:not(.slick-cloned)').each((i, el) => {
    // Remove slick-specific classes
    $v2(el).removeClass('slick-slide slick-current slick-active');
    $v2(el).removeAttr('data-slick-index aria-hidden style tabindex role aria-describedby');
    v2Slides.push($v2.html(el));
});

// Combine slides (2 from v2, 2 from v1)
const combinedSlides = [...v2Slides, ...v1Slides];

// Replace background image paths
combinedSlides[0] = combinedSlides[0].replace(/background-image:url\([^)]+\)/g, "background-image:url(./images/v2/1.jpg)");
combinedSlides[1] = combinedSlides[1].replace(/background-image:url\([^)]+\)/g, "background-image:url(./images/v2/2.jpg)");
combinedSlides[2] = combinedSlides[2].replace(/background-image:url\([^)]+\)/g, "background-image:url(./images/v2/3.jpg)");
combinedSlides[3] = combinedSlides[3].replace(/background-image:url\([^)]+\)/g, "background-image:url(./images/v2/4.jpg)");

// Rebuild the slider DOM for index-v2.html and index.html
const cleanSliderHtml = `
<div class="slider home-slider ani-slider clearfix slider-style-2" data-slick="{&quot;autoplaySpeed&quot;: 5000, &quot;fade&quot;: true, &quot;speed&quot;: 1000, &quot;autoplay&quot;: true, &quot;arrows&quot;: false, &quot;dots&quot;: false}">
    ${combinedSlides.join('\\n')}
</div>
`;

['index.html', 'index-v2.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the entire slider container
    const sliderRegex = /<div class="slider home-slider ani-slider[^>]*>[\s\S]*?<!-- end slider container -->/g;
    
    // Actually, regex to match <div class="slider home-slider... and its contents is hard.
    // Better to use Cheerio to replace it, but we want to preserve the rest of the HTML exact formatting.
    // Let's use Cheerio to find the outer HTML of the home-slider, then string replace.
    const $ = cheerio.load(content);
    const oldSliderHtml = $.html($('.home-slider'));
    
    if (oldSliderHtml) {
        content = content.replace(oldSliderHtml, cleanSliderHtml);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated slider in ${file}`);
    } else {
        console.log(`Could not find slider in ${file}`);
    }
});
