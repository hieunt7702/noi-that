const fs = require('fs');

const files = ['index.html', 'index-v2.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace the dark opaque background with a brighter, more transparent one
    // Old: background-color: rgba(20, 20, 20, 0.98) !important;
    // New: background-color: rgba(45, 45, 45, 0.75) !important;
    html = html.replace(/background-color:\s*rgba\(20,\s*20,\s*20,\s*0\.98\)\s*!important;/g, 'background-color: rgba(45, 45, 45, 0.75) !important;');
    
    // Also try matching any previous variations just in case
    html = html.replace(/background-color:\s*rgba\(25,\s*23,\s*22,\s*0\.95\)\s*!important;/g, 'background-color: rgba(45, 45, 45, 0.75) !important;');

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}: Made mobile menu background brighter.`);
});
