const fs = require('fs');
const cheerio = require('cheerio');

const htmlFiles = ['index.html', 'index-v2.html'];

const mappings = {
    'Home': 'nav.home',
    'About': 'nav.about',
    'Portfolio': 'nav.portfolio',
    'Team': 'nav.team',
    'Blog': 'nav.blog',
    'Discover More': 'nav.discover',
    'BIM has been giving best consultation to top USA’s': 'innovation.title_part1',
    'Engineering companies since 1975': 'innovation.title_part2',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.': 'about.desc',
    'Luctus nec ullamcorper mattis:': 'about.desc2',
    'Completed Projects': 'about.stat1.label',
    'Satisfied Clients': 'about.stat2.label',
    'Creative Team': 'about.stat3.label', // Or whatever it is
    'Awards Won': 'about.stat4.label',
    'Recent Work': 'portfolio.subtitle',
    'Show More': 'portfolio.btn',
    'Council are celebrating the incredible achievement of the Companies and Stakeholders. Due to BIM’s fast invasion in all over the world specially in the North America Region, we are one of the top 10 nominated Consultants for Council Archit...': 'blog.post1.desc',
    'August 28, 2019': 'blog.post1.date',
    'February 26, 2020': 'blog.post2.date',
    '2 Comments': 'blog.comments',
    'No Comments': 'blog.nocomments',
    'hieunt270702@gmail.com': 'contact.email.val',
    'Cầu Giấy, Hà Nội, Việt Nam': 'footer.address',
    'Hanoi, Vietnam': 'topbar.address',
    'Mon - Fri / 9:00 AM - 6:00 PM': 'footer.hours',
    'Toggle Theme': 'theme.toggle'
};

// Also let's handle the split texts using cheerio
htmlFiles.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    $('*').each((i, el) => {
        if (el.tagName === 'script' || el.tagName === 'style') return;
        
        // Skip if already has data-i18n
        if ($(el).attr('data-i18n')) return;
        
        // Get text
        let text = $(el).text().trim();
        // Compress multiple spaces/newlines
        let compressedText = text.replace(/\s+/g, ' ');
        
        for (let [engText, key] of Object.entries(mappings)) {
            if (compressedText === engText) {
                $(el).attr('data-i18n', key);
                break;
            }
        }
    });
    
    fs.writeFileSync(file, $.html());
    console.log(`Updated ${file}`);
});
