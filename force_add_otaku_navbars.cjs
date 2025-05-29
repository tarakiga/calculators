const fs = require('fs');
const path = require('path');

async function addNavbarsToOtakuPages() {
    console.log('🚨 Santa Claude EMERGENCY navbar fix for Otaku_Ops pages!');
    console.log('Ho ho ho! Adding missing navbar HTML immediately! 🧭\n');

    const pages = [
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/Otaku_Ops/Conspiracy Theory Plausibility Index.html',
        'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/Otaku_Ops/Anime Training Montage Planner.html'
    ];

    for (const pagePath of pages) {
        await addNavbarToPage(pagePath);
    }

    console.log('\n🎅 Emergency navbar fix complete! ✨');
}

async function addNavbarToPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        console.log(`🔧 FORCE-ADDING navbar to ${fileName}...`);

        // Check if navbar HTML already exists
        if (content.includes('<nav class="main-nav">')) {
            console.log(`    ℹ️  ${fileName}: Navbar HTML already present`);
            return;
        }

        // Add required navbar CSS files
        const requiredCSS = [
            '    <link rel="stylesheet" href="../../common/navbar-enhanced.css">',
            '    <link rel="stylesheet" href="../../common/santa-improvements.css">'
        ];

        requiredCSS.forEach(css => {
            if (!content.includes(css.trim())) {
                content = content.replace(
                    /<\/head>/,
                    `${css}\n</head>`
                );
            }
        });

        // Add viewport if missing
        if (!content.includes('viewport')) {
            content = content.replace(
                /<meta charset="UTF-8">/,
                `<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">`
            );
        }

        // Add the complete navbar HTML structure right after <body>
        const navbarHTML = `    <!-- 🎅 Santa Claude's Complete Navigation Bar -->
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
                <li><a href="../GeekGalaxy/index.html" class="category-link">Geek Galaxy</a></li>
                <li><a href="../LifeHacks/index.html" class="category-link">Life Hacks</a></li>
                <li><a href="../Math_Magik/index.html" class="category-link">Math Magik</a></li>
                <li><a href="../Otaku_Ops/index.html" class="category-link active">Otaku Ops</a></li>
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

        // Insert navbar right after <body> tag
        content = content.replace(
            /(<body[^>]*>)/i,
            `$1\n${navbarHTML}`
        );

        // Ensure proper navbar JavaScript is present
        if (!content.includes('Santa Claude navbar loaded') && !content.includes('navbar-enhanced.js')) {
            const navbarJS = `
    <script>
        // 🎅 Santa Claude's Enhanced Navbar JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🎅 Santa Claude navbar loaded for ${fileName}');
            
            // Mobile menu toggle
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

            // Search functionality
            const searchInput = document.getElementById('calc-search');
            const searchResults = document.getElementById('search-results');
            
            if (searchInput && searchResults) {
                const calculators = [
                    {name: 'Back to Otaku Ops', path: './index.html'},
                    {name: 'Home', path: '../../index.html'},
                    {name: 'Training Montage Planner', path: './Anime Training Montage Planner.html'},
                    {name: 'Conspiracy Analyzer', path: './Conspiracy Theory Plausibility Index.html'},
                    {name: 'Minecraft Portal Planner', path: './MINECRAFT PORTAL PLANNER.html'}
                ];
                
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value.trim().toLowerCase();
                    if (query.length < 2) {
                        searchResults.style.display = 'none';
                        return;
                    }
                    
                    const matches = calculators.filter(calc => 
                        calc.name.toLowerCase().includes(query)
                    );
                    
                    if (matches.length > 0) {
                        searchResults.innerHTML = matches.map(match => 
                            \`<a href="\${match.path}" class="search-result-item">\${match.name}</a>\`
                        ).join('');
                        searchResults.style.display = 'block';
                    } else {
                        searchResults.innerHTML = '<div class="no-results">No results found</div>';
                        searchResults.style.display = 'block';
                    }
                });
                
                // Hide search results when clicking outside
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.nav-search')) {
                        searchResults.style.display = 'none';
                    }
                });
            }
        });
    </script>`;

            content = content.replace(
                /<\/body>/,
                `${navbarJS}\n</body>`
            );
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`    ✅ ${fileName}: NAVBAR SUCCESSFULLY FORCE-ADDED!`);
        
    } catch (error) {
        console.log(`    ❌ Error adding navbar to ${path.basename(filePath)}: ${error.message}`);
    }
}

addNavbarsToOtakuPages();