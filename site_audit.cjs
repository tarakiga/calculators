const fs = require('fs');
const path = require('path');

class SiteAuditor {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.allPages = [];
        this.categoryPages = {};
        this.calculatorPages = {};
        this.deadLinks = [];
        this.navbarIssues = [];
        this.linkingIssues = [];
        this.orphanedPages = [];
    }

    // Find all HTML files
    findAllPages() {
        console.log('🔍 SCANNING ALL PAGES...\n');
        
        // Main index page
        const mainIndex = path.join(this.rootDir, 'index.html');
        if (fs.existsSync(mainIndex)) {
            this.allPages.push({
                path: mainIndex,
                relativePath: 'index.html',
                type: 'main',
                category: null
            });
        }

        // Category and calculator pages
        const pagesDir = path.join(this.rootDir, 'pages');
        if (fs.existsSync(pagesDir)) {
            const categories = fs.readdirSync(pagesDir);
            
            categories.forEach(category => {
                const categoryPath = path.join(pagesDir, category);
                if (fs.statSync(categoryPath).isDirectory()) {
                    
                    // Category index page
                    const categoryIndex = path.join(categoryPath, 'index.html');
                    if (fs.existsSync(categoryIndex)) {
                        const pageInfo = {
                            path: categoryIndex,
                            relativePath: `pages/${category}/index.html`,
                            type: 'category',
                            category: category
                        };
                        this.allPages.push(pageInfo);
                        this.categoryPages[category] = pageInfo;
                    }

                    // Calculator pages in category
                    const files = fs.readdirSync(categoryPath);
                    files.forEach(file => {
                        if (file.endsWith('.html') && file !== 'index.html') {
                            const pageInfo = {
                                path: path.join(categoryPath, file),
                                relativePath: `pages/${category}/${file}`,
                                type: 'calculator',
                                category: category,
                                fileName: file
                            };
                            this.allPages.push(pageInfo);
                            
                            if (!this.calculatorPages[category]) {
                                this.calculatorPages[category] = [];
                            }
                            this.calculatorPages[category].push(pageInfo);
                        }
                    });
                }
            });
        }

        console.log(`📊 FOUND ${this.allPages.length} TOTAL PAGES:`);
        console.log(`   • 1 Main page`);
        console.log(`   • ${Object.keys(this.categoryPages).length} Category pages`);
        console.log(`   • ${this.allPages.filter(p => p.type === 'calculator').length} Calculator pages`);
        console.log(`   • Categories: ${Object.keys(this.categoryPages).join(', ')}\n`);
    }

    // Check if page has proper navbar
    checkNavbar(pageInfo) {
        try {
            const content = fs.readFileSync(pageInfo.path, 'utf8');
            const issues = [];

            // Check for navbar HTML
            if (!content.includes('main-nav')) {
                issues.push('Missing navbar HTML');
            }

            // Check for navbar CSS
            if (!content.includes('navbar-enhanced.css')) {
                issues.push('Missing navbar CSS');
            }

            // Check for search functionality (should be on main and category pages)
            if (pageInfo.type !== 'calculator' && !content.includes('nav-search')) {
                issues.push('Missing search functionality');
            }

            // Check for mobile menu
            if (!content.includes('mobile-menu-btn')) {
                issues.push('Missing mobile menu');
            }

            // Check for all category links
            const expectedLinks = [
                'BigKidMath', 'CipherLab', 'GeekGalaxy', 
                'LifeHacks', 'Math_Magik', 'Otaku_Ops'
            ];
            
            expectedLinks.forEach(cat => {
                if (!content.includes(`pages/${cat}/index.html`) && !content.includes(`../${cat}/index.html`)) {
                    issues.push(`Missing link to ${cat}`);
                }
            });

            if (issues.length > 0) {
                this.navbarIssues.push({
                    page: pageInfo.relativePath,
                    issues: issues
                });
            }

        } catch (error) {
            this.navbarIssues.push({
                page: pageInfo.relativePath,
                issues: [`Error reading file: ${error.message}`]
            });
        }
    }

    // Check if calculator pages are linked in their category index
    checkCategoryLinking() {
        console.log('🔗 CHECKING CATEGORY LINKING...\n');

        Object.keys(this.calculatorPages).forEach(category => {
            const categoryIndexPath = this.categoryPages[category]?.path;
            if (categoryIndexPath) {
                try {
                    const categoryContent = fs.readFileSync(categoryIndexPath, 'utf8');
                    
                    this.calculatorPages[category].forEach(calc => {
                        const encodedFileName = encodeURIComponent(calc.fileName);
                        const normalFileName = calc.fileName;
                        
                        if (!categoryContent.includes(encodedFileName) && 
                            !categoryContent.includes(normalFileName)) {
                            this.linkingIssues.push({
                                category: category,
                                calculator: calc.fileName,
                                issue: 'Calculator not linked in category index page'
                            });
                        }
                    });
                } catch (error) {
                    this.linkingIssues.push({
                        category: category,
                        calculator: 'N/A',
                        issue: `Cannot read category index: ${error.message}`
                    });
                }
            }
        });
    }

    // Check for dead links
    checkDeadLinks(pageInfo) {
        try {
            const content = fs.readFileSync(pageInfo.path, 'utf8');
            const linkRegex = /href=["']([^"']+)["']/g;
            let match;

            while ((match = linkRegex.exec(content)) !== null) {
                const link = match[1];
                
                // Skip external links, anchors, and special protocols
                if (link.startsWith('http') || link.startsWith('#') || 
                    link.startsWith('mailto:') || link.startsWith('tel:')) {
                    continue;
                }

                // Resolve relative path
                let fullPath;
                if (link.startsWith('../')) {
                    fullPath = path.resolve(path.dirname(pageInfo.path), link);
                } else if (link.startsWith('./')) {
                    fullPath = path.resolve(path.dirname(pageInfo.path), link.substring(2));
                } else {
                    fullPath = path.resolve(path.dirname(pageInfo.path), link);
                }

                // Check if file exists
                if (!fs.existsSync(fullPath)) {
                    this.deadLinks.push({
                        page: pageInfo.relativePath,
                        link: link,
                        resolvedPath: fullPath
                    });
                }
            }
        } catch (error) {
            console.error(`Error checking links in ${pageInfo.relativePath}:`, error.message);
        }
    }

    // Run complete audit
    async runAudit() {
        console.log('🔍 STARTING COMPREHENSIVE SITE AUDIT');
        console.log('='.repeat(60));
        
        // Find all pages
        this.findAllPages();

        // Check navbar on all pages
        console.log('🧭 CHECKING NAVBAR CONSISTENCY...\n');
        this.allPages.forEach(page => this.checkNavbar(page));

        // Check category linking
        this.checkCategoryLinking();

        // Check for dead links
        console.log('🔗 CHECKING FOR DEAD LINKS...\n');
        this.allPages.forEach(page => this.checkDeadLinks(page));

        // Generate report
        this.generateReport();
    }

    // Generate comprehensive report
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📋 COMPREHENSIVE SITE AUDIT REPORT');
        console.log('='.repeat(60));

        // Site Structure Summary
        console.log('\n📊 SITE STRUCTURE:');
        console.log(`Total Pages: ${this.allPages.length}`);
        console.log(`Categories: ${Object.keys(this.categoryPages).length}`);
        
        Object.keys(this.calculatorPages).forEach(cat => {
            console.log(`  • ${cat}: ${this.calculatorPages[cat].length} calculators`);
        });

        // Navbar Issues
        console.log('\n🧭 NAVBAR ISSUES:');
        if (this.navbarIssues.length === 0) {
            console.log('✅ All pages have proper navbar setup!');
        } else {
            console.log(`❌ Found ${this.navbarIssues.length} pages with navbar issues:`);
            this.navbarIssues.forEach(issue => {
                console.log(`\n📄 ${issue.page}:`);
                issue.issues.forEach(i => console.log(`   • ${i}`));
            });
        }

        // Linking Issues
        console.log('\n🔗 CATEGORY LINKING:');
        if (this.linkingIssues.length === 0) {
            console.log('✅ All calculators are properly linked in their categories!');
        } else {
            console.log(`❌ Found ${this.linkingIssues.length} linking issues:`);
            this.linkingIssues.forEach(issue => {
                console.log(`   • ${issue.category}/${issue.calculator}: ${issue.issue}`);
            });
        }

        // Dead Links
        console.log('\n💀 DEAD LINKS:');
        if (this.deadLinks.length === 0) {
            console.log('✅ No dead links found!');
        } else {
            console.log(`❌ Found ${this.deadLinks.length} dead links:`);
            this.deadLinks.forEach(link => {
                console.log(`   • ${link.page} → ${link.link}`);
            });
        }

        // Site Map
        this.generateSiteMap();

        // Action Items
        this.generateActionItems();
    }

    // Generate site map
    generateSiteMap() {
        console.log('\n🗺️  COMPLETE SITE MAP:');
        console.log('├── 🏠 index.html (Main Unit Converter)');
        
        Object.keys(this.categoryPages).forEach((cat, index) => {
            const isLast = index === Object.keys(this.categoryPages).length - 1;
            const prefix = isLast ? '└──' : '├──';
            console.log(`${prefix} 📁 ${cat}/`);
            console.log(`${isLast ? '    ' : '│   '}├── 📋 index.html (Category Page)`);
            
            if (this.calculatorPages[cat]) {
                this.calculatorPages[cat].forEach((calc, calcIndex) => {
                    const calcIsLast = calcIndex === this.calculatorPages[cat].length - 1;
                    const calcPrefix = calcIsLast ? '└──' : '├──';
                    console.log(`${isLast ? '    ' : '│   '}${calcPrefix} 🧮 ${calc.fileName}`);
                });
            }
        });
    }

    // Generate action items
    generateActionItems() {
        console.log('\n📝 ACTION ITEMS:');
        
        const totalIssues = this.navbarIssues.length + this.linkingIssues.length + this.deadLinks.length;
        
        if (totalIssues === 0) {
            console.log('🎉 NO ISSUES FOUND! Your site is perfectly organized!');
            return;
        }

        console.log(`⚠️  ${totalIssues} issues need attention:\n`);

        if (this.navbarIssues.length > 0) {
            console.log(`1. 🧭 Fix ${this.navbarIssues.length} navbar issues`);
            console.log('   Run: node fix_calculator_navbars.cjs');
        }

        if (this.linkingIssues.length > 0) {
            console.log(`2. 🔗 Fix ${this.linkingIssues.length} category linking issues`);
            console.log('   Add missing calculator links to category index pages');
        }

        if (this.deadLinks.length > 0) {
            console.log(`3. 💀 Fix ${this.deadLinks.length} dead links`);
            console.log('   Update or remove broken links');
        }

        console.log('\n✨ RECOMMENDED NEXT STEPS:');
        console.log('1. Run navbar fix script');
        console.log('2. Update category index pages with missing calculators');
        console.log('3. Test all navigation paths');
        console.log('4. Re-run audit to verify fixes');
    }
}

// Run the audit
const rootDir = __dirname;
const auditor = new SiteAuditor(rootDir);
auditor.runAudit();
