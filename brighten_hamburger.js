const fs = require('fs');

const files = ['index.html', 'index-v2.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // Add CSS to force the hamburger icon to be pure bright white
    const hamburgerFix = `
    /* Force Hamburger icon to be bright white */
    .hamburger__icon, 
    .hamburger__icon::before, 
    .hamburger__icon::after {
        background-color: #ffffff !important;
        box-shadow: 0 0 2px rgba(255, 255, 255, 0.5) !important;
    }
    .hamburger:hover .hamburger__icon, 
    .hamburger:hover .hamburger__icon::before, 
    .hamburger:hover .hamburger__icon::after {
        background-color: #ce9e51 !important;
    }
    </style>
    `;
    
    // Inject right before the closing </style> of #mobile-menu-xinxo
    html = html.replace(/<\/style>\s*<\/head>/, hamburgerFix + '</head>');

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}: Made hamburger icon bright white.`);
});
