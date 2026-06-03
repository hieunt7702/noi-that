const fs = require('fs');

const htmlFiles = ['index.html', 'index-v2.html'];

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/<span class="word" data-word="Innovative"/g, '<span class="word" data-word="Innovative" data-i18n="slider.title1"');
    content = content.replace(/<span class="word" data-word="Modern"/g, '<span class="word" data-word="Modern" data-i18n="slider.title2"');
    content = content.replace(/<span class="word" data-word="Design"/g, '<span class="word" data-word="Design" data-i18n="slider.title3"');
    
    // Also remove the extra '&' and 'Works' words because slider.title3 covers 'Design & Works'
    content = content.replace(/<span class="whitespace">\s*<\/span>\s*<span class="word" data-word="&amp;">.*?<\/span>\s*<span class="whitespace">\s*<\/span>\s*<span class="word" data-word="Works">.*?<\/span>/g, '');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file} for slider titles.`);
});
