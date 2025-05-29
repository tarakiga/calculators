const fs = require('fs');
const path = require('path');

// Navigation HTML template for individual calculator pages
function getCalculatorNavbarHTML() {
    return `    <!-- Enhanced Navigation Bar -->
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
}

// Enhanced CSS link
const enhancedCSS = '    <link rel="stylesheet" href="../../common/navbar-enhanced.css">';

// JavaScript for mobile menu
const navJS = `    <script>
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

// Function to find all HTML files recursively
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !file.includes('index.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Update individual calculator files
const pagesDir = path.join(__dirname, 'pages');
const htmlFiles = findHtmlFiles(pagesDir);

console.log(`Found ${htmlFiles.length} calculator files to update...`);

htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add enhanced CSS if not present
        if (!content.includes('navbar-enhanced.css')) {
            content = content.replace('</head>', `${enhancedCSS}\n</head>`);
        }
        
        // Add navbar after <body> tag if not present
        if (!content.includes('main-nav')) {
            const navbarHTML = getCalculatorNavbarHTML();
            content = content.replace('<body>', `<body>\n${navbarHTML}`);
        }
        
        // Add or replace navigation JavaScript
        if (!content.includes('mobile-menu-btn') || content.includes('navbar-enhanced.js')) {
            // Remove old navbar JS
            content = content.replace(/\s*<script src="[^"]*navbar[^"]*\.js"[^>]*><\/script>/g, '');
            // Add new JS before closing body
            content = content.replace('</body>', `${navJS}\n</body>`);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${path.basename(filePath)}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
});

console.log('\n🎉 All calculator pages updated with navigation!');
