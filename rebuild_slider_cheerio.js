const fs = require('fs');
const cheerio = require('cheerio');

// Load v1.html and extract its slides
const v1Html = fs.readFileSync('../v1.html', 'utf8');
const $v1 = cheerio.load(v1Html);
const v1Slides = [];
$v1('.home-slider .item.slide:not(.slick-cloned)').each((i, el) => {
    // We want the outerHTML of the slide
    const slide = $v1(el).clone();
    slide.removeClass('slick-slide slick-current slick-active');
    slide.removeAttr('data-slick-index aria-hidden style tabindex role aria-describedby');
    let html = $v1.html(slide);
    // Replace background URL
    if (i === 0) html = html.replace(/url\([^)]+\)/g, "url(./images/v2/3.jpg)");
    if (i === 1) html = html.replace(/url\([^)]+\)/g, "url(./images/v2/4.jpg)");
    v1Slides.push(html);
});

// Load index-v2.html and extract its slides
const v2Html = fs.readFileSync('index-v2.html', 'utf8');
const $v2 = cheerio.load(v2Html);
const v2Slides = [];
$v2('.home-slider .item.slide:not(.slick-cloned)').each((i, el) => {
    const slide = $v2(el).clone();
    slide.removeClass('slick-slide slick-current slick-active');
    slide.removeAttr('data-slick-index aria-hidden style tabindex role aria-describedby');
    let html = $v2.html(slide);
    if (i === 0) html = html.replace(/url\([^)]+\)/g, "url(./images/v2/1.jpg)");
    if (i === 1) html = html.replace(/url\([^)]+\)/g, "url(./images/v2/2.jpg)");
    v2Slides.push(html);
});

const combinedSlides = [...v2Slides, ...v1Slides];

const cleanSliderHtml = `
<div class="slider home-slider ani-slider clearfix slider-style-2" data-slick="{&quot;autoplaySpeed&quot;: 5000, &quot;fade&quot;: true, &quot;speed&quot;: 1000, &quot;autoplay&quot;: true, &quot;arrows&quot;: false, &quot;dots&quot;: false}">
    ${combinedSlides.join('\\n')}
</div>
`;

['index.html', 'index-v2.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    $('.home-slider').replaceWith(cleanSliderHtml);
    fs.writeFileSync(file, $.html(), 'utf8');
    console.log(`Replaced slider in ${file} using Cheerio.`);
});
