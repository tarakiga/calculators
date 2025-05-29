const fs = require('fs');
const path = require('path');

// Full navbar HTML for calculator pages (with search functionality)
const fullNavbarHTML = `    <!-- Enhanced Navigation Bar -->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html">🧮 Docket One</a>
            </div>
            <div class="nav-search">
                <input type="text" id="calc-search" placeholder="Search calculators..." class="search-input">
                <div id="search-results" class="search-results"></div>
            </div>
            <ul class="nav-links">
                <li><a href="../BigKidMath/index.html" class="category-main-link">Big Kid Math</a></li>
                <li><a href="../CipherLab/index.html" class="category-main-link">Cipher Lab</a></li>
                <li><a href="../GeekGalaxy/index.html" class="category-main-link">Geek Galaxy</a></li>
                <li><a href="../LifeHacks/index.html" class="category-main-link">Life Hacks</a></li>
                <li><a href="../Math_Magik/index.html" class="category-main-link">Math Magik</a></li>
                <li><a href="../Otaku_Ops/index.html" class="category-main-link">Otaku Ops</a></li>
                <li><a href="../../index.html" class="home-link">Unit Converter</a></li>
            </ul>
            <button class="mobile-menu-btn" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    
`;

// Mobile menu JavaScript
const mobileMenuJS = `    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    mobileMenuBtn.classList.toggle('active');
                });
                document.addEventListener('click', function(event) {
                    if (!event.target.closest('.main-nav')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                });
            }
        });
    </script>`;

// Find all calculator HTML files (not index.html files)
function findCalculatorFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findCalculatorFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !file.includes('index.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const pagesDir = path.join(__dirname, 'pages');
const calculatorFiles = findCalculatorFiles(pagesDir);

console.log(`Found ${calculatorFiles.length} calculator files to update:`);

calculatorFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add enhanced CSS if not present
        if (!content.includes('navbar-enhanced.css')) {
            content = content.replace('</head>', '    <link rel="stylesheet" href="../../common/navbar-enhanced.css">\n</head>');
        }
        
        // Replace existing navbar with full navbar
        if (content.includes('main-nav')) {
            // Find and replace the existing navbar section
            const navbarStart = content.indexOf('<!-- Enhanced Navigation Bar -->');
            const navbarEnd = content.indexOf('</nav>') + 6;
            
            if (navbarStart !== -1 && navbarEnd > navbarStart) {
                const beforeNavbar = content.substring(0, navbarStart);
                const afterNavbar = content.substring(navbarEnd);
                content = beforeNavbar + fullNavbarHTML + afterNavbar;
            }
        } else {
            // Add navbar after <body> if not present
            content = content.replace('<body>', `<body>\n${fullNavbarHTML}`);
        }
        
        // Add or replace mobile menu JavaScript
        if (!content.includes('mobile-menu-btn') || content.includes('navbar-enhanced.js')) {
            // Remove old navbar JS references
            content = content.replace(/\s*<script src="[^"]*navbar[^"]*\.js"[^>]*><\/script>/g, '');
            // Add new JS before closing body
            if (!content.includes('mobile-menu-btn')) {
                content = content.replace('</body>', `${mobileMenuJS}\n</body>`);
            }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${path.basename(filePath)}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${path.basename(filePath)}:`, error.message);
    }
});

console.log('\n🎉 All calculator pages updated with full navigation!');
console.log('\nFeatures added to all calculator pages:');
console.log('✅ Full navbar with search functionality');
console.log('✅ Mobile hamburger menu');
console.log('✅ All category navigation links');
console.log('✅ Consistent styling with main page');
