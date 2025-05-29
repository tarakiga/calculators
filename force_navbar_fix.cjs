const fs = require('fs');
const path = require('path');

// Force add navbars to specific pages
async function forceAddNavbars() {
    console.log('🚨 FORCE ADDING NAVBARS - No more Mr. Nice Santa! 🚨\n');

    const pages = [
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/GeekGalaxy/Spaceship Fuel Calculator.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/GeekGalaxy/Time Machine Paradox Detector.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/GeekGalaxy/Zombie Apocalypse Survival Calculator.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/LifeHacks/Coffee to Code Efficiency Ratio Calculator.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/LifeHacks/Social Media Addiction Calculator.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/LifeHacks/Stress-to-Ice-Cream Ratio Calculator.html'
    ];

    for (const filePath of pages) {
        await forceAddSingleNavbar(filePath);
    }

    console.log('\n🎅 FORCE MISSION COMPLETE! All navbars added! ✨');
}

async function forceAddSingleNavbar(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        const category = filePath.includes('GeekGalaxy') ? 'GeekGalaxy' : 'LifeHacks';
        
        console.log(`🔨 FORCE adding navbar to ${fileName}...`);

        // FORCE check - look for actual nav element
        if (content.includes('<nav class="main-nav">')) {
            console.log(`    ✅ ${fileName}: Already has navbar HTML structure`);
            return;
        }

        // Add navbar HTML right after body tag
        const navbarHTML = `    <!-- 🎅 Santa Claude's Force-Added Navigation Bar -->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html">🧮 Docket One</a>
            </div>
            <div class="nav-search">
                <input type="text" id="calc-search" placeholder="Search calculators..." class="search-input" aria-label="Search calculators">
                <div id="search-results" class="search-results"></div>
            </div>
            <ul class="nav-links">
                <li><a href="../BigKidMath/index.html" class="category-link">Big Kid Math</a></li>
                <li><a href="../CipherLab/index.html" class="category-link">Cipher Lab</a></li>
                <li><a href="../GeekGalaxy/index.html" class="category-link ${category === 'GeekGalaxy' ? 'active' : ''}">Geek Galaxy</a></li>
                <li><a href="../LifeHacks/index.html" class="category-link ${category === 'LifeHacks' ? 'active' : ''}">Life Hacks</a></li>
                <li><a href="../Math_Magik/index.html" class="category-link">Math Magik</a></li>
                <li><a href="../Otaku_Ops/index.html" class="category-link">Otaku Ops</a></li>
                <li><a href="../../index.html" class="home-link">🏠 Home</a></li>
            </ul>
            <button class="mobile-menu-btn" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

`;

        // Force insert right after <body> tag
        content = content.replace(
            /(<body[^>]*>)/i,
            `$1\n${navbarHTML}`
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`    ✅ ${fileName}: NAVBAR FORCE-ADDED!`);
        
    } catch (error) {
        console.log(`    ❌ Force add failed for ${path.basename(filePath)}: ${error.message}`);
    }
}

// Run the force add
forceAddNavbars();