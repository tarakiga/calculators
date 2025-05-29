const fs = require('fs');
const path = require('path');

// Navigation HTML template for category pages
function getNavbarHTML(currentCategory) {
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
                <li><a href="../BigKidMath/index.html" class="category-main-link${currentCategory === 'BigKidMath' ? ' current' : ''}">Big Kid Math</a></li>
                <li><a href="../CipherLab/index.html" class="category-main-link${currentCategory === 'CipherLab' ? ' current' : ''}">Cipher Lab</a></li>
                <li><a href="../GeekGalaxy/index.html" class="category-main-link${currentCategory === 'GeekGalaxy' ? ' current' : ''}">Geek Galaxy</a></li>
                <li><a href="../LifeHacks/index.html" class="category-main-link${currentCategory === 'LifeHacks' ? ' current' : ''}">Life Hacks</a></li>
                <li><a href="../Math_Magik/index.html" class="category-main-link${currentCategory === 'Math_Magik' ? ' current' : ''}">Math Magik</a></li>
                <li><a href="../Otaku_Ops/index.html" class="category-main-link${currentCategory === 'Otaku_Ops' ? ' current' : ''}">Otaku Ops</a></li>
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

// JavaScript template for navigation functionality
const navJS = `    <script>
        // Simple mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    mobileMenuBtn.classList.toggle('active');
                });

                // Close mobile menu when clicking outside
                document.addEventListener('click', function(event) {
                    if (!event.target.closest('.main-nav')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                });
            }
        });
    </script>`;

// Categories to update
const categories = ['CipherLab', 'GeekGalaxy', 'LifeHacks', 'Math_Magik', 'Otaku_Ops'];

categories.forEach(category => {
    const filePath = path.join(__dirname, 'pages', category, 'index.html');
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add navbar after <body> tag
        const navbarHTML = getNavbarHTML(category);
        content = content.replace('<body>', `<body>\n${navbarHTML}`);
        
        // Replace or add navigation JavaScript
        if (content.includes('navbar-enhanced.js')) {
            content = content.replace(/\s*<script src="[^"]*navbar-enhanced\.js"><\/script>/, navJS);
        } else {
            // Add before closing </body> tag
            content = content.replace('</body>', `${navJS}\n</body>`);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated navigation for ${category}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${category}:`, error.message);
    }
});

console.log('\n🎉 Category navigation update complete!');
