const fs = require('fs');
const path = require('path');

class UIUXAuditor {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.auditResults = {
            pages: [],
            commonIssues: [],
            recommendations: [],
            designPatterns: [],
            accessibility: [],
            performance: []
        };
    }

    async auditAll() {
        console.log('🎅 Santa Claude\'s UI/UX Audit Starting...');
        console.log('Checking if your site has been naughty or nice! 🎁\n');
        
        // Audit main homepage
        await this.auditPage(path.join(this.rootPath, 'index.html'), 'homepage');
        
        // Audit all category pages  
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            const categoryPath = path.join(pagesDir, category);
            
            // Audit category index
            const indexPath = path.join(categoryPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                await this.auditPage(indexPath, 'category-index', category);
            }
            
            // Audit calculator pages
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html') && file !== 'index.html'
            );
            
            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                await this.auditPage(filePath, 'calculator', category);
            }
        }

        this.analyzePatterns();
        this.generateReport();
    }

    async auditPage(filePath, pageType, category = '') {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            console.log(`🔍 Auditing ${pageType === 'homepage' ? '🏠 Homepage' : 
                        pageType === 'category-index' ? `📁 ${category} Category` : 
                        `🧮 ${fileName}`}...`);

            const pageAudit = {
                file: fileName,
                path: filePath,
                type: pageType,
                category: category,
                issues: [],
                strengths: [],
                accessibility: [],
                performance: [],
                mobile: [],
                design: []
            };

            // UI/UX Analysis
            this.checkVisualHierarchy(content, pageAudit);
            this.checkAccessibility(content, pageAudit);
            this.checkMobileResponsiveness(content, pageAudit);
            this.checkLoadingPerformance(content, pageAudit);
            this.checkUserExperience(content, pageAudit);
            this.checkDesignConsistency(content, pageAudit);
            this.checkInteractivity(content, pageAudit);

            this.auditResults.pages.push(pageAudit);

        } catch (error) {
            console.log(`❌ Error auditing ${filePath}: ${error.message}`);
        }
    }

    checkVisualHierarchy(content, audit) {
        // Check heading structure
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
        const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;

        if (h1Count === 0) {
            audit.issues.push('Missing H1 heading - poor SEO and hierarchy');
        } else if (h1Count > 1) {
            audit.issues.push('Multiple H1 headings - confusing hierarchy');
        } else {
            audit.strengths.push('Proper H1 heading structure');
        }

        if (h2Count > 0) {
            audit.strengths.push('Good use of H2 subheadings');
        }

        // Check for proper spacing and layout
        if (content.includes('margin') || content.includes('padding')) {
            audit.strengths.push('Custom spacing implemented');
        }

        // Check color contrast considerations
        if (content.includes('color:') && content.includes('background')) {
            audit.design.push('Custom color scheme implemented');
        }
    }

    checkAccessibility(content, audit) {
        // Alt text for images
        const images = content.match(/<img[^>]*>/gi) || [];
        const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
        
        if (imagesWithoutAlt.length > 0) {
            audit.accessibility.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // ARIA labels
        if (content.includes('aria-label') || content.includes('aria-describedby')) {
            audit.strengths.push('ARIA labels implemented');
        }

        // Form labels
        const inputs = content.match(/<input[^>]*>/gi) || [];
        const unlabeledInputs = inputs.filter(input => 
            !content.includes(`label`) || !input.includes('aria-label')
        );

        // Skip if no forms present
        if (inputs.length > 0 && unlabeledInputs.length > 0) {
            audit.accessibility.push('Some form inputs may lack proper labels');
        }

        // Color-only information
        if (content.includes('color:') && !content.includes('font-weight') && !content.includes('text-decoration')) {
            audit.accessibility.push('Consider adding non-color indicators (icons, text)');
        }
    }

    checkMobileResponsiveness(content, audit) {
        // Viewport meta tag
        if (!content.includes('viewport')) {
            audit.mobile.push('Missing viewport meta tag');
        } else {
            audit.strengths.push('Responsive viewport configured');
        }

        // Media queries
        if (content.includes('@media')) {
            audit.strengths.push('Media queries for responsive design');
        } else {
            audit.mobile.push('No media queries found - may not be mobile-optimized');
        }

        // Touch-friendly elements
        if (content.includes('button') || content.includes('btn')) {
            audit.strengths.push('Interactive buttons present');
        }

        // Mobile menu
        if (content.includes('mobile-menu') || content.includes('hamburger')) {
            audit.strengths.push('Mobile navigation implemented');
        }
    }
    checkLoadingPerformance(content, audit) {
        // External resources
        const externalCSS = (content.match(/href="http[^"]*\.css"/gi) || []).length;
        const externalJS = (content.match(/src="http[^"]*\.js"/gi) || []).length;
        
        if (externalCSS > 3) {
            audit.performance.push('Many external CSS files - consider bundling');
        }
        
        if (externalJS > 3) {
            audit.performance.push('Many external JS files - consider bundling');
        }

        // Inline styles
        const inlineStyles = (content.match(/style="/gi) || []).length;
        if (inlineStyles > 10) {
            audit.performance.push('Excessive inline styles - consider CSS classes');
        }

        // Large images without optimization hints
        if (content.includes('<img') && !content.includes('loading="lazy"')) {
            audit.performance.push('Consider lazy loading for images');
        }
    }

    checkUserExperience(content, audit) {
        // Loading states
        if (content.includes('loading') || content.includes('spinner')) {
            audit.strengths.push('Loading indicators present');
        }

        // Error handling
        if (content.includes('error') || content.includes('alert')) {
            audit.strengths.push('Error handling implemented');
        }

        // Input validation
        if (content.includes('required') || content.includes('pattern')) {
            audit.strengths.push('Form validation present');
        }

        // Search functionality
        if (content.includes('search') || content.includes('filter')) {
            audit.strengths.push('Search/filter functionality available');
        }

        // Help text or tooltips
        if (content.includes('help') || content.includes('tooltip') || content.includes('title=')) {
            audit.strengths.push('Help/tooltip guidance provided');
        }

        // Clear CTAs
        const buttons = content.match(/<button[^>]*>([^<]*)</gi) || [];
        const links = content.match(/<a[^>]*>([^<]*)</gi) || [];
        
        if (buttons.length === 0 && links.length === 0) {
            audit.issues.push('No clear call-to-action elements found');
        }
    }

    checkDesignConsistency(content, audit) {
        // CSS frameworks
        if (content.includes('bootstrap') || content.includes('tailwind')) {
            audit.strengths.push('CSS framework for consistency');
        }

        // Custom CSS
        if (content.includes('<style>') || content.includes('stylesheet')) {
            audit.design.push('Custom styling implemented');
        }

        // Color variables
        if (content.includes('--') || content.includes('var(')) {
            audit.strengths.push('CSS custom properties for consistency');
        }

        // Typography consistency
        if (content.includes('font-family') || content.includes('font-size')) {
            audit.design.push('Typography customization present');
        }
    }

    checkInteractivity(content, audit) {
        // JavaScript interactions
        if (content.includes('addEventListener') || content.includes('onclick')) {
            audit.strengths.push('Interactive elements present');
        }

        // Hover effects
        if (content.includes(':hover') || content.includes('transition')) {
            audit.strengths.push('Hover effects and transitions');
        }

        // Form interactions
        if (content.includes('input') && content.includes('change')) {
            audit.strengths.push('Dynamic form interactions');
        }

        // Animation
        if (content.includes('animation') || content.includes('keyframes')) {
            audit.strengths.push('CSS animations implemented');
        }
    }

    analyzePatterns() {
        console.log('\n🎯 Analyzing common patterns across all pages...');
        
        const allIssues = this.auditResults.pages.flatMap(page => page.issues);
        const allStrengths = this.auditResults.pages.flatMap(page => page.strengths);
        
        // Find most common issues
        const issueCount = {};
        allIssues.forEach(issue => {
            issueCount[issue] = (issueCount[issue] || 0) + 1;
        });

        const commonIssues = Object.entries(issueCount)
            .filter(([issue, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.auditResults.commonIssues = commonIssues;

        // Find most common strengths
        const strengthCount = {};
        allStrengths.forEach(strength => {
            strengthCount[strength] = (strengthCount[strength] || 0) + 1;
        });

        const commonStrengths = Object.entries(strengthCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.auditResults.designPatterns = commonStrengths;
    }
    generateReport() {
        console.log('\n' + '🎄'.repeat(20));
        console.log('🎅 SANTA CLAUDE\'S UI/UX AUDIT REPORT 🎁');
        console.log('🎄'.repeat(20));

        // Executive Summary
        const totalPages = this.auditResults.pages.length;
        const pagesWithIssues = this.auditResults.pages.filter(p => p.issues.length > 0).length;
        const averageIssues = this.auditResults.pages.reduce((sum, p) => sum + p.issues.length, 0) / totalPages;

        console.log(`\n🎯 EXECUTIVE SUMMARY:`);
        console.log(`- Total Pages Audited: ${totalPages}`);
        console.log(`- Pages with Issues: ${pagesWithIssues} (${Math.round((pagesWithIssues/totalPages)*100)}%)`);
        console.log(`- Average Issues per Page: ${averageIssues.toFixed(1)}`);

        // Most Common Issues
        if (this.auditResults.commonIssues.length > 0) {
            console.log(`\n🚨 MOST COMMON ISSUES:`);
            this.auditResults.commonIssues.forEach(([issue, count], index) => {
                console.log(`${index + 1}. ${issue} (${count} pages)`);
            });
        }

        // Design Strengths
        if (this.auditResults.designPatterns.length > 0) {
            console.log(`\n✨ DESIGN STRENGTHS:`);
            this.auditResults.designPatterns.forEach(([strength, count], index) => {
                console.log(`${index + 1}. ${strength} (${count} pages)`);
            });
        }

        // Santa's Priority Recommendations
        console.log(`\n🎅 SANTA'S PRIORITY RECOMMENDATIONS:`);
        this.generateRecommendations();

        // Detailed Page Analysis
        console.log(`\n📄 DETAILED PAGE ANALYSIS:`);
        this.auditResults.pages.forEach(page => {
            console.log(`\n--- ${page.file} (${page.type}) ---`);
            
            if (page.strengths.length > 0) {
                console.log(`✅ Strengths: ${page.strengths.slice(0, 3).join(', ')}`);
            }
            
            if (page.issues.length > 0) {
                console.log(`⚠️  Issues: ${page.issues.slice(0, 3).join(', ')}`);
            }
            
            if (page.accessibility.length > 0) {
                console.log(`♿ Accessibility: ${page.accessibility.slice(0, 2).join(', ')}`);
            }
            
            if (page.mobile.length > 0) {
                console.log(`📱 Mobile: ${page.mobile.slice(0, 2).join(', ')}`);
            }
            
            if (page.performance.length > 0) {
                console.log(`⚡ Performance: ${page.performance.slice(0, 2).join(', ')}`);
            }
        });

        // Save detailed report
        this.saveDetailedReport();
    }

    generateRecommendations() {
        const recommendations = [
            {
                priority: 'HIGH',
                title: 'Improve Accessibility',
                description: 'Add alt text to images, ensure proper form labels, improve color contrast',
                impact: 'Legal compliance, better user experience for disabled users'
            },
            {
                priority: 'HIGH', 
                title: 'Mobile Optimization',
                description: 'Ensure all pages are fully responsive with touch-friendly elements',
                impact: 'Better mobile user experience, improved SEO rankings'
            },
            {
                priority: 'MEDIUM',
                title: 'Performance Optimization',
                description: 'Minimize external resources, implement lazy loading, optimize images',
                impact: 'Faster page loads, better user retention'
            },
            {
                priority: 'MEDIUM',
                title: 'Visual Consistency',
                description: 'Standardize spacing, typography, and color schemes across all pages',
                impact: 'Professional appearance, better brand recognition'
            },
            {
                priority: 'LOW',
                title: 'Enhanced Interactivity',
                description: 'Add more hover effects, transitions, and micro-interactions',
                impact: 'More engaging user experience'
            }
        ];

        recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. [${rec.priority}] ${rec.title}`);
            console.log(`   📝 ${rec.description}`);
            console.log(`   💡 Impact: ${rec.impact}`);
        });
    }

    saveDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalPages: this.auditResults.pages.length,
                commonIssues: this.auditResults.commonIssues,
                designStrengths: this.auditResults.designPatterns
            },
            pages: this.auditResults.pages,
            recommendations: this.auditResults.recommendations
        };

        const reportPath = path.join(this.rootPath, 'SANTA_CLAUDE_UIUX_AUDIT.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        console.log(`\n🎁 Detailed report saved to: ${reportPath}`);
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const auditor = new UIUXAuditor(rootPath);
    
    try {
        await auditor.auditAll();
        console.log('\n🎅 Ho ho ho! Santa Claude\'s UI/UX audit complete!');
        console.log('🎁 Your site has been checked twice - now you know what\'s naughty and nice!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Santa\'s audit sleigh crashed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = UIUXAuditor;