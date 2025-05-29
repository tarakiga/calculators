const fs = require('fs');
const path = require('path');

class SiteVerifier {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.verification = {
            navbarCheck: { passed: 0, total: 0 },
            breadcrumbCheck: { passed: 0, total: 0 },
            relatedLinksCheck: { passed: 0, total: 0 },
            categoryIndexCheck: { passed: 0, total: 0 }
        };
    }

    async verify() {
        console.log('='.repeat(60));
        console.log('FINAL SITE VERIFICATION');
        console.log('='.repeat(60));
        
        await this.verifyNavbars();
        await this.verifyBreadcrumbs();
        await this.verifyRelatedLinks();
        await this.verifyCategoryIndexes();
        
        this.generateFinalReport();
    }

    async verifyNavbars() {
        console.log('\n1. Verifying Navbar Implementation...');
        
        const allPages = this.getAllPages();
        
        allPages.forEach(pagePath => {
            const content = fs.readFileSync(pagePath, 'utf8');
            this.verification.navbarCheck.total++;
            
            if (content.includes('navbar-enhanced.css') || content.includes('navbar.css')) {
                this.verification.navbarCheck.passed++;
                console.log(`   ✅ ${path.basename(pagePath)} - Navbar present`);
            } else {
                console.log(`   ❌ ${path.basename(pagePath)} - Navbar missing`);
            }
        });
    }

    async verifyBreadcrumbs() {
        console.log('\n2. Verifying Breadcrumb Navigation...');
        
        const categoryIndexes = this.getCategoryIndexes();
        
        categoryIndexes.forEach(indexPath => {
            const content = fs.readFileSync(indexPath, 'utf8');
            this.verification.breadcrumbCheck.total++;
            
            if (content.includes('class="breadcrumb"')) {
                this.verification.breadcrumbCheck.passed++;
                console.log(`   ✅ ${path.basename(path.dirname(indexPath))} - Breadcrumb added`);
            } else {
                console.log(`   ❌ ${path.basename(path.dirname(indexPath))} - Breadcrumb missing`);
            }
        });
    }

    async verifyRelatedLinks() {
        console.log('\n3. Verifying Related Links...');
        
        const calculatorPages = this.getCalculatorPages();
        
        calculatorPages.forEach(pagePath => {
            const content = fs.readFileSync(pagePath, 'utf8');
            this.verification.relatedLinksCheck.total++;
            
            if (content.includes('related-calculators')) {
                this.verification.relatedLinksCheck.passed++;
                console.log(`   ✅ ${path.basename(pagePath)} - Related links added`);
            } else {
                console.log(`   ❌ ${path.basename(pagePath)} - Related links missing`);
            }
        });
    }

    async verifyCategoryIndexes() {
        console.log('\n4. Verifying Category Index Pages...');
        
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );
        
        categories.forEach(category => {
            const indexPath = path.join(pagesDir, category, 'index.html');
            this.verification.categoryIndexCheck.total++;
            
            if (fs.existsSync(indexPath)) {
                this.verification.categoryIndexCheck.passed++;
                console.log(`   ✅ ${category} - Index page exists`);
            } else {
                console.log(`   ❌ ${category} - Index page missing`);
            }
        });
    }

    getAllPages() {
        const pages = [];
        
        // Add root index
        const rootIndex = path.join(this.rootPath, 'index.html');
        if (fs.existsSync(rootIndex)) {
            pages.push(rootIndex);
        }
        
        // Add all pages in categories
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );
        
        categories.forEach(category => {
            const categoryPath = path.join(pagesDir, category);
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html')
            );
            
            files.forEach(file => {
                pages.push(path.join(categoryPath, file));
            });
        });
        
        return pages;
    }

    getCategoryIndexes() {
        const indexes = [];
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );
        
        categories.forEach(category => {
            const indexPath = path.join(pagesDir, category, 'index.html');
            if (fs.existsSync(indexPath)) {
                indexes.push(indexPath);
            }
        });
        
        return indexes;
    }

    getCalculatorPages() {
        const calculators = [];
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );
        
        categories.forEach(category => {
            const categoryPath = path.join(pagesDir, category);
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html') && file !== 'index.html'
            );
            
            files.forEach(file => {
                calculators.push(path.join(categoryPath, file));
            });
        });
        
        return calculators;
    }

    generateFinalReport() {
        console.log('\n' + '='.repeat(60));
        console.log('FINAL VERIFICATION RESULTS');
        console.log('='.repeat(60));
        
        const results = [
            {
                name: 'Navbar Implementation',
                passed: this.verification.navbarCheck.passed,
                total: this.verification.navbarCheck.total
            },
            {
                name: 'Breadcrumb Navigation',
                passed: this.verification.breadcrumbCheck.passed,
                total: this.verification.breadcrumbCheck.total
            },
            {
                name: 'Related Links',
                passed: this.verification.relatedLinksCheck.passed,
                total: this.verification.relatedLinksCheck.total
            },
            {
                name: 'Category Index Pages',
                passed: this.verification.categoryIndexCheck.passed,
                total: this.verification.categoryIndexCheck.total
            }
        ];
        
        results.forEach(result => {
            const percentage = Math.round((result.passed / result.total) * 100);
            const status = percentage === 100 ? '✅ PERFECT' : percentage >= 90 ? '⚠️ GOOD' : '❌ NEEDS WORK';
            console.log(`${result.name}: ${result.passed}/${result.total} (${percentage}%) ${status}`);
        });
        
        const overallPassed = results.reduce((sum, r) => sum + r.passed, 0);
        const overallTotal = results.reduce((sum, r) => sum + r.total, 0);
        const overallPercentage = Math.round((overallPassed / overallTotal) * 100);
        
        console.log('\n' + '-'.repeat(60));
        console.log(`OVERALL SITE HEALTH: ${overallPassed}/${overallTotal} (${overallPercentage}%)`);
        
        if (overallPercentage === 100) {
            console.log('🎉 PERFECT! Site audit and fixes completed successfully!');
        } else if (overallPercentage >= 95) {
            console.log('✅ EXCELLENT! Site is in great shape with minor improvements made.');
        } else {
            console.log('⚠️ GOOD! Most issues resolved, some areas may need attention.');
        }
        
        console.log('\n📁 Generated Files:');
        console.log('   - SITE_AUDIT_REPORT.md (Detailed audit report)');
        console.log('   - SITE_AUDIT_SUMMARY.md (Executive summary)');
        console.log('   - site_audit_clean.cjs (Audit tool)');
        console.log('   - site_fixer.cjs (Site improvement tool)');
        console.log('\n🎯 Mission Accomplished!');
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const verifier = new SiteVerifier(rootPath);
    
    try {
        await verifier.verify();
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SiteVerifier;