const fs = require('fs');
const path = require('path');

const htmlFiles = ['index.html', 'index-v2.html'];

const translations = {
        // ===== HERO / SLIDER =====
        'slider.subtitle': 'The choice around the world',
        'slider.text': 'The final design package as per latest approval and client dreams, meeting all aesthetic and technical requirements.',
        'slider.btn.start': 'Get Started',
        'slider.btn.more': 'View More',
        'slider.btn.more2': 'View More',

        // ===== FEATURES =====
        'feature1.title': 'Visualize Your Ideas',
        'feature1.text': 'The best render of drawing by hand. The ease of super smart soft machines.',
        'feature1.btn': 'Learn More',

        'feature2.title': 'Render 3D Works',
        'feature2.text': 'Modeling of your project as perfect drafting package for clients final decision.',
        'feature2.btn': 'Learn More',

        'feature3.title': 'Gain a Perspective',
        'feature3.text': 'The joy of drawing by hand. The ease of super-smart software and development.',
        'feature3.btn': 'Learn More',

        // ===== WORK PROCESS =====
        'workprocess.title': 'This including consulting multi disciplinary consulting work with design and engineering, our world branches giving full support for executing professional work.',
        'process1.title': 'Conceptual',
        'process1.desc': 'Providing proposals to the client for the preliminary with the full models and rendering the reality.',
        'process2.title': 'Schematic',
        'process2.desc': 'Enhancement proposals to the client for the preliminary with the full models and rendering the approved.',
        'process3.title': 'Development',
        'process3.desc': 'Finalized proposals to the client for the preliminary with the full models and changes are sufficient.',

        // ===== INNOVATION BANNER =====
        'innovation.subtitle': 'INNOVATION STARTS HERE',
        'innovation.title': "BIM has been giving best consultation to top USA's Engineering companies since 1975",
        'innovation.btn': 'Know More',

        // ===== SERVICES =====
        'services.subtitle': 'What We Do',
        'services.title': 'Our Services',
        'services.desc': 'This including consulting multi disciplinary consulting work with design and engineering, our world branches giving full support for executing professional work.',
        'service1.title': 'Interior Design',
        'service1.desc': 'Premium living and workspace design, tailored to your style and needs.',
        'service1.btn': 'View Details',
        'service2.title': 'Architecture & Construction',
        'service2.desc': 'Comprehensive architectural solutions from concept to construction, ensuring quality and aesthetics.',
        'service2.btn': 'View Details',
        'service3.title': '3D Design & Rendering',
        'service3.desc': 'Space modeling and visualization with the most advanced 3D technology.',
        'service3.btn': 'View Details',
        'service4.title': 'Consulting & Project Management',
        'service4.desc': 'Accompanying you from the planning stage to project completion.',
        'service4.btn': 'View Details',

        // ===== ABOUT =====
        'about.subtitle': 'About Us',
        'about.title': 'Creating Premium Living Spaces',
        'about.desc': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
        'about.btn': 'Know More',
        'about.stat1.label': 'Projects Completed',
        'about.stat2.label': 'Happy Clients',
        'about.stat3.label': 'Years Experience',

        // ===== PORTFOLIO =====
        'portfolio.subtitle': 'Our Portfolio',
        'portfolio.title': 'Featured Works',
        'portfolio.filter.all': 'All',
        'portfolio.filter.interior': 'Interior',
        'portfolio.filter.architecture': 'Architecture',
        'portfolio.filter.3d': '3D & Render',

        // ===== TEAM =====
        'team.subtitle': 'Our Team',
        'team.title': 'Meet Our Experts',
        'team.member1.role': 'CEO | ARCHITECT',
        'team.member2.role': 'Researcher | ARCHITECT',
        'team.member3.role': 'Designer | ARCHITECT',

        // ===== BLOG =====
        'blog.subtitle': 'Our Blog',
        'blog.title': 'Latest News',
        'blog.readmore': 'Read More',
        'blog.nocomments': 'No Comments',
        'blog.post1.title': 'In Good Taste: Mark Finlay Architects and Interiors',
        'blog.post2.title': 'Five Things You Should Know About Modern Furniture.',

        // ===== CONTACT =====
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Send a Message',
        'contact.name': 'Full Name',
        'contact.email': 'Email Address',
        'contact.phone': 'Phone Number',
        'contact.subject': 'Subject',
        'contact.message': 'Your Message',
        'contact.send': 'Send Message',
        'contact.address.label': 'Address',
        'contact.phone.label': 'Phone',
        'contact.email.label': 'Email',
        'contact.hours.label': 'Working Hours',

        // ===== FOOTER =====
        'footer.connect': "Let's Connect",
        'footer.recent.title': 'Recent Posts',
        'footer.services.title': 'Our Services',
        'footer.gallery.title': 'Our Gallery',
        'footer.service1': 'Interior Design',
        'footer.service2': 'Architecture Modeling',
        'footer.service3': 'Rendering Buildings',
        'footer.service4': 'Landscape Works',
        'footer.terms': 'Terms of use | Privacy Environmental Policy'
};

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let replacedCount = 0;
    
    Object.entries(translations).forEach(([key, text]) => {
        if (!text) return;
        
        let escapedText = text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Handle whitespace explicitly
        escapedText = escapedText.replace(/ /g, '\\s+');
        
        let regex = new RegExp(`(<[a-zA-Z0-9]+(?:\\s+[^>]+?)?>)\\s*(${escapedText})\\s*(<\\/[a-zA-Z0-9]+>)`, 'g');
        
        content = content.replace(regex, (match, p1, p2, p3) => {
            if (p1.includes('data-i18n=')) return match; // Already has it
            
            let newP1 = p1.replace(/>$/, ` data-i18n="${key}">`);
            replacedCount++;
            return newP1 + p2 + p3;
        });
    });
    
    fs.writeFileSync(file, content);
    console.log(`File ${file}: Replaced ${replacedCount} elements.`);
});
