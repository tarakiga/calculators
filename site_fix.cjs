const fs = require('fs');
const path = require('path');

class SiteFixer {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.fixedPages = [];
        this.errors = [];
    }

    // Fix navbar on all pages
    fixNavbars() {
        console.log('🔧 FIXING NAVBAR ISSUES...\n');

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

        // Process all HTML files
        this.findAllHtmlFiles().forEach(filePath => {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                let modified = false;
                const relativePath = path.relative(this.rootDir, filePath);

                // Add enhanced CSS if missing
                if (!content.includes('navbar-enhanced.css')) {
                    const cssPath = relativePath.includes('pages/') ? '../../common/navbar-enhanced.css' : 'common/navbar-enhanced.css';
                    content = content.replace('</head>', `    <link rel="stylesheet" href="${cssPath}">\n</head>`);
                    modified = true;
                }

                // Add global calculator CSS if missing (for calculator pages)
                if (relativePath.includes('pages/') && !relativePath.includes('index.html') && !content.includes('global-calculator.css')) {
                    content = content.replace('</head>', '    <link rel="stylesheet" href="../../common/global-calculator.css">\n</head>');
                    modified = true;
                }

                // Fix or add navbar HTML
                if (content.includes('main-nav')) {
                    // Replace existing navbar with full version
                    const navStart = content.indexOf('<!-- Enhanced Navigation Bar -->');
                    const navEnd = content.indexOf('</nav>') + 6;
                    
                    if (navStart !== -1 && navEnd > navStart) {
                        const beforeNav = content.substring(0, navStart);
                        const afterNav = content.substring(navEnd);
                        content = beforeNav + fullNavbarHTML + afterNav;
                        modified = true;
                    }
                } else {
                    // Add navbar after <body>
                    content = content.replace('<body>', `<body>\n${fullNavbarHTML}`);
                    modified = true;
                }

                // Add mobile menu JavaScript if missing
                if (!content.includes('mobile-menu-btn') || !content.includes('addEventListener')) {
                    content = content.replace('</body>', `${mobileMenuJS}\n</body>`);
                    modified = true;
                }

                if (modified) {
                    fs.writeFileSync(filePath, content);
                    this.fixedPages.push(relativePath);
                    console.log(`✅ Fixed navbar: ${relativePath}`);
                }

            } catch (error) {
                this.errors.push(`Error fixing ${filePath}: ${error.message}`);
                console.log(`❌ Error fixing: ${path.relative(this.rootDir, filePath)}`);
            }
        });
    }

    // Update category index pages with missing calculator links
    fixCategoryLinks() {
        console.log('\n🔗 FIXING CATEGORY LINKS...\n');

        const categories = ['BigKidMath', 'CipherLab', 'GeekGalaxy', 'LifeHacks', 'Math_Magik', 'Otaku_Ops'];
        
        categories.forEach(category => {
            const categoryDir = path.join(this.rootDir, 'pages', category);
            const categoryIndex = path.join(categoryDir, 'index.html');
            
            if (fs.existsSync(categoryIndex)) {
                try {
                    let content = fs.readFileSync(categoryIndex, 'utf8');
                    const calculators = this.getCalculatorsInCategory(categoryDir);
                    
                    calculators.forEach(calc => {
                        const encodedName = encodeURIComponent(calc);
                        if (!content.includes(encodedName) && !content.includes(calc)) {
                            console.log(`⚠️  Missing link in ${category}: ${calc}`);
                        }
                    });
                    
                } catch (error) {
                    this.errors.push(`Error checking category ${category}: ${error.message}`);
                }
            }
        });
    }

    // Get all calculator files in a category
    getCalculatorsInCategory(categoryDir) {
        const calculators = [];
        if (fs.existsSync(categoryDir)) {
            const files = fs.readdirSync(categoryDir);
            files.forEach(file => {
                if (file.endsWith('.html') && file !== 'index.html') {
                    calculators.push(file);
                }
            });
        }
        return calculators;
    }

    // Find all HTML files
    findAllHtmlFiles() {
        const htmlFiles = [];
        
        // Main index
        const mainIndex = path.join(this.rootDir, 'index.html');
        if (fs.existsSync(mainIndex)) {
            htmlFiles.push(mainIndex);
        }

        // Pages directory
        const pagesDir = path.join(this.rootDir, 'pages');
        if (fs.existsSync(pagesDir)) {
            const categories = fs.readdirSync(pagesDir);
            categories.forEach(category => {
                const categoryPath = path.join(pagesDir, category);
                if (fs.statSync(categoryPath).isDirectory()) {
                    const files = fs.readdirSync(categoryPath);
                    files.forEach(file => {
                        if (file.endsWith('.html')) {
                            htmlFiles.push(path.join(categoryPath, file));
                        }
                    });
                }
            });
        }

        return htmlFiles;
    }

    // Run all fixes
    async runFixes() {
        console.log('🔧 RUNNING COMPREHENSIVE SITE FIXES');
        console.log('='.repeat(50));
        
        this.fixNavbars();
        this.fixCategoryLinks();
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ FIXES COMPLETED!');
        console.log(`📄 Pages fixed: ${this.fixedPages.length}`);
        
        if (this.fixedPages.length > 0) {
            console.log('\n📝 Fixed pages:');
            this.fixedPages.forEach(page => console.log(`   • ${page}`));
        }
        
        if (this.errors.length > 0) {
            console.log(`\n❌ Errors: ${this.errors.length}`);
            this.errors.forEach(error => console.log(`   • ${error}`));
        }
        
        console.log('\n🎉 Run site audit again to verify all fixes!');
        console.log('Command: node site_audit.cjs');
    }
}

// Run the fixes
const rootDir = __dirname;
const fixer = new SiteFixer(rootDir);
fixer.runFixes();
