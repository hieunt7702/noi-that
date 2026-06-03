const fs = require('fs');
const cheerio = require('cheerio');

const finalMappings = [
    { text: "Visualize your ideas", key: "feature1.title", eng: "Visualize Your Ideas", vi: "Hiện Thực Hóa Ý Tưởng" },
    { text: "Render 3D works", key: "feature2.title", eng: "Render 3D Works", vi: "Mô Hình 3D" },
    { text: "Gain a perspective", key: "feature3.title", eng: "Gain a Perspective", vi: "Góc Nhìn Toàn Diện" },
    
    { text: "Architecture Studio", key: "cat.architecture", eng: "Architecture Studio", vi: "Xưởng Kiến Trúc" },
    { text: "Cinema Dar", key: "cat.cinema", eng: "Cinema Dar", vi: "Rạp Chiếu Phim" },
    { text: "Culture Library", key: "cat.culture", eng: "Culture Library", vi: "Thư Viện Văn Hóa" },
    { text: "Decoration art", key: "cat.decoration", eng: "Decoration Art", vi: "Nghệ Thuật Trang Trí" },
    { text: "Design", key: "cat.design", eng: "Design", vi: "Thiết Kế" },
    { text: "Engineering works", key: "cat.engineering", eng: "Engineering Works", vi: "Công Trình Kỹ Thuật" },
    { text: "GIS & Planning", key: "cat.gis", eng: "GIS & Planning", vi: "GIS & Quy Hoạch" },
    { text: "Home style", key: "cat.homestyle", eng: "Home Style", vi: "Phong Cách Sống" },
    { text: "Hospitality", key: "cat.hospitality", eng: "Hospitality", vi: "Khách Sạn & Nghỉ Dưỡng" },
    { text: "Hospitality / Interior / Royal", key: "cat.hosp_int_royal", eng: "Hospitality / Interior / Royal", vi: "Nghỉ Dưỡng / Nội Thất / Hoàng Gia" },
    { text: "Hospitality / Libraries", key: "cat.hosp_lib", eng: "Hospitality / Libraries", vi: "Nghỉ Dưỡng / Thư Viện" },
    { text: "Hospitality / Residential", key: "cat.hosp_res", eng: "Hospitality / Residential", vi: "Nghỉ Dưỡng / Dân Dụng" },
    { text: "Hotels in wooden", key: "cat.hotel_wooden", eng: "Hotels in Wooden", vi: "Khách Sạn Gỗ" },
    { text: "Libraries", key: "cat.libraries", eng: "Libraries", vi: "Thư Viện" },
    { text: "Modern", key: "cat.modern", eng: "Modern", vi: "Hiện Đại" },
    { text: "Ocean house", key: "cat.ocean", eng: "Ocean House", vi: "Nhà Hướng Biển" },
    { text: "Porcelain & Metal Ducts", key: "cat.porcelain", eng: "Porcelain & Metal Ducts", vi: "Sứ & Ống Kim Loại" },
    { text: "Residential", key: "cat.residential", eng: "Residential", vi: "Dân Dụng" },
    { text: "Royal", key: "cat.royal", eng: "Royal", vi: "Hoàng Gia" },
    { text: "Royal Palace", key: "cat.royal_palace", eng: "Royal Palace", vi: "Cung Điện Hoàng Gia" },
    { text: "Theaters", key: "cat.theaters", eng: "Theaters", vi: "Nhà Hát" },
    { text: "Landscape works", key: "cat.landscape", eng: "Landscape Works", vi: "Công Trình Cảnh Quan" }
];

// Update i18n.js
let i18nContent = fs.readFileSync('js/i18n.js', 'utf8');

// Build injection strings for keys that aren't feature1/2/3
let newEnStr = '\n        // ===== CATEGORIES =====\n';
let newViStr = '\n        // ===== CATEGORIES =====\n';

for (let map of finalMappings) {
    if (!map.key.startsWith('feature')) {
        newEnStr += `        "${map.key}": "${map.eng}",\n`;
        newViStr += `        "${map.key}": "${map.vi}",\n`;
    }
}

// Inject into vi
i18nContent = i18nContent.replace(/"lang\.switch\.tooltip": "Switch to English",?/, `"lang.switch.tooltip": "Switch to English",\n` + newViStr);

// Inject into en
i18nContent = i18nContent.replace(/"lang\.switch\.tooltip": "Chuyển sang tiếng Việt",?/, `"lang.switch.tooltip": "Chuyển sang tiếng Việt",\n` + newEnStr);

fs.writeFileSync('js/i18n.js', i18nContent);
console.log('Updated i18n.js');

// Update HTML files
const htmlFiles = ['index.html', 'index-v2.html'];
htmlFiles.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    let patched = 0;
    
    $('*').each((i, el) => {
        if (el.tagName === 'script' || el.tagName === 'style') return;
        if ($(el).attr('data-i18n')) return;
        
        const directTextNodes = $(el).contents().filter(function() {
            return this.type === 'text';
        });
        
        let text = directTextNodes.text().replace(/\s+/g, ' ').trim();
        
        for (let map of finalMappings) {
            let matchText = map.text.replace(/\s+/g, ' ');
            if (text.toLowerCase() === matchText.toLowerCase()) {
                $(el).attr('data-i18n', map.key);
                patched++;
                break;
            }
        }
    });
    
    fs.writeFileSync(file, $.html());
    console.log(`Patched ${patched} elements in ${file}`);
});
