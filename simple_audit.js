#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SiteAuditor {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.results = {
            structure: {},
            pages: [],
            issues: [],
            summary: {
                totalPages: 0,
                pagesWithNavbar: 0,
                pagesWithoutNavbar: 0,
                deadLinks: 0,
                orphanPages: 0,
                missingIndexPages: 0
            }
        };
        this.allPages = new Set();
        this.allLinks = new Set();
        this.pagesByCategory = {};
    }

    async audit() {
        console.log('🔍 Starting comprehensive site audit...\n');
        
        // Step 1: Map directory structure
        this.mapStructure();
        
        // Step 2: Analyze all pages
        await this.analyzeAllPages();
        
        // Step 3: Check for dead links
        this.checkDeadLinks();
        
        // Step 4: Check for orphaned pages
        this.checkOrphanPages();
        
        // Step 5: Generate report
        this.generateReport();
        
        return this.results;
    }

    mapStructure() {
        console.log('📁 Mapping directory structure...');
        
        const pagesDir = path.join(this.rootPath, 'pages');
        
        if (!fs.existsSync(pagesDir)) {
            this.results.issues.push({
                type: 'CRITICAL',
                message: 'Pages directory not found',
                path: pagesDir
            });
            return;
        }

        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        categories.forEach(category => {
            const categoryPath = path.join(pagesDir, category);
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html')
            );
            
            this.results.structure[category] = files;
            this.pagesByCategory[category] = files.map(file => 
                path.join(categoryPath, file)
            );
            
            // Check for index.html in each category
            if (!files.includes('index.html')) {
                this.results.issues.push({
                    type: 'WARNING',
                    message: 'Missing index.html in category',
                    path: categoryPath
                });
                this.results.summary.missingIndexPages++;
            }
        });

        console.log(`   Found ${categories.length} categories`);
        console.log(`   Categories: ${categories.join(', ')}\n`);
    }
    async analyzeAllPages() {
        console.log('📄 Analyzing all pages...');
        
        // Analyze root index
        const rootIndex = path.join(this.rootPath, 'index.html');
        if (fs.existsSync(rootIndex)) {
            await this.analyzePage(rootIndex, 'root');
        }

        // Analyze all category pages
        for (const [category, pages] of Object.entries(this.pagesByCategory)) {
            console.log(`   Analyzing ${category} pages...`);
            for (const pagePath of pages) {
                await this.analyzePage(pagePath, category);
            }
        }

        console.log(`   Analyzed ${this.results.summary.totalPages} total pages\n`);
    }

    async analyzePage(filePath, category) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            this.results.summary.totalPages++;
            this.allPages.add(filePath);

            const pageAnalysis = {
                path: filePath,
                category: category,
                filename: path.basename(filePath),
                title: this.extractTitle(content),
                hasNavbar: false,
                navbarType: 'none',
                links: [],
                internalLinks: [],
                externalLinks: [],
                issues: []
            };

            // Check for navbar
            const navbarIndicators = [
                'navbar-enhanced.css',
                'navbar.css',
                'navbar-enhanced.js',
                'navbar.js',
                '<nav',
                'class="navbar"',
                'id="navbar"'
            ];

            const hasNavbarCSS = navbarIndicators.some(indicator => 
                content.toLowerCase().includes(indicator.toLowerCase())
            );

            if (hasNavbarCSS) {
                pageAnalysis.hasNavbar = true;
                this.results.summary.pagesWithNavbar++;
                
                // Determine navbar type
                if (content.includes('navbar-enhanced')) {
                    pageAnalysis.navbarType = 'enhanced';
                } else {
                    pageAnalysis.navbarType = 'standard';
                }
            } else {
                this.results.summary.pagesWithoutNavbar++;
                pageAnalysis.issues.push('Missing navbar');
            }
            // Extract links using regex
            const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
                const href = match[1];
                pageAnalysis.links.push(href);
                this.allLinks.add(href);
                
                if (href.startsWith('http') || href.startsWith('//')) {
                    pageAnalysis.externalLinks.push(href);
                } else {
                    pageAnalysis.internalLinks.push(href);
                }
            }

            // Check for common issues
            if (!content.includes('<title>')) {
                pageAnalysis.issues.push('Missing title tag');
            }
            
            if (!content.includes('meta name="description"')) {
                pageAnalysis.issues.push('Missing meta description');
            }

            this.results.pages.push(pageAnalysis);

        } catch (error) {
            this.results.issues.push({
                type: 'ERROR',
                message: `Failed to analyze page: ${error.message}`,
                path: filePath
            });
        }
    }

    extractTitle(content) {
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : 'No title';
    }

    checkDeadLinks() {
        console.log('🔗 Checking for dead links...');
        
        this.results.pages.forEach(page => {
            page.internalLinks.forEach(link => {
                // Skip anchors, javascript, and external protocol links
                if (link.startsWith('#') || link.startsWith('javascript:') || 
                    link.startsWith('mailto:') || link.startsWith('tel:')) {
                    return;
                }

                // Resolve relative paths
                let resolvedPath;
                
                if (link.startsWith('/')) {
                    // Absolute path from root
                    resolvedPath = path.join(this.rootPath, link.substring(1));
                } else if (link.startsWith('../')) {
                    // Relative path going up
                    resolvedPath = path.resolve(path.dirname(page.path), link);
                } else {
                    // Relative path in same directory
                    resolvedPath = path.resolve(path.dirname(page.path), link);
                }

                // Remove URL fragments and query parameters
                resolvedPath = resolvedPath.split('#')[0].split('?')[0];
                
                // Check if file exists
                if (!fs.existsSync(resolvedPath)) {
                    // Try adding .html extension
                    if (!resolvedPath.endsWith('.html') && !fs.existsSync(resolvedPath + '.html')) {
                        this.results.issues.push({
                            type: 'WARNING',
                            message: `Dead link found: ${link}`,
                            path: page.path,
                            resolvedPath: resolvedPath
                        });
                        this.results.summary.deadLinks++;
                    }
                }
            });
        });

        console.log(`   Found ${this.results.summary.deadLinks} dead links\n`);
    }
    checkOrphanPages() {
        console.log('🏝️  Checking for orphaned pages...');
        
        // Create a set of all linked internal pages
        const linkedPages = new Set();
        
        this.results.pages.forEach(page => {
            page.internalLinks.forEach(link => {
                // Skip anchors and special links
                if (link.startsWith('#') || link.startsWith('javascript:') || 
                    link.startsWith('mailto:') || link.startsWith('tel:')) {
                    return;
                }

                // Convert link to file path
                let resolvedPath;
                if (link.startsWith('/')) {
                    resolvedPath = path.join(this.rootPath, link.substring(1));
                } else {
                    resolvedPath = path.resolve(path.dirname(page.path), link);
                }
                
                resolvedPath = resolvedPath.split('#')[0].split('?')[0];
                
                if (fs.existsSync(resolvedPath)) {
                    linkedPages.add(resolvedPath);
                }
            });
        });

        // Find pages that are never linked to
        this.allPages.forEach(pagePath => {
            // Skip root index
            const isRoot = pagePath === path.join(this.rootPath, 'index.html');
            
            if (!isRoot && !linkedPages.has(pagePath)) {
                this.results.issues.push({
                    type: 'INFO',
                    message: `Potentially orphaned page (not linked from other pages)`,
                    path: pagePath
                });
                this.results.summary.orphanPages++;
            }
        });

        console.log(`   Found ${this.results.summary.orphanPages} potentially orphaned pages\n`);
    }

    generateReport() {
        console.log('📊 Generating comprehensive report...\n');
        
        const report = `# COMPREHENSIVE SITE AUDIT REPORT
Generated: ${new Date().toISOString()}

## SUMMARY
- **Total Pages**: ${this.results.summary.totalPages}
- **Pages with Navbar**: ${this.results.summary.pagesWithNavbar}
- **Pages without Navbar**: ${this.results.summary.pagesWithoutNavbar}
- **Dead Links**: ${this.results.summary.deadLinks}
- **Orphaned Pages**: ${this.results.summary.orphanPages}
- **Missing Category Index Pages**: ${this.results.summary.missingIndexPages}

## SITE STRUCTURE
${Object.entries(this.results.structure).map(([category, files]) => 
    `### ${category}\n${files.map(f => `- ${f}`).join('\n')}`
).join('\n\n')}

## PAGES WITHOUT NAVBAR
${this.results.pages
    .filter(p => !p.hasNavbar)
    .map(p => `- ${p.path}`)
    .join('\n')}

## CRITICAL ISSUES
${this.results.issues
    .filter(i => i.type === 'CRITICAL')
    .map(i => `- **${i.message}**: ${i.path}`)
    .join('\n')}
        // Save report to file
        const reportPath = path.join(this.rootPath, 'SITE_AUDIT_REPORT.md');
        fs.writeFileSync(reportPath, report, 'utf8');
        
        console.log(`📄 Report saved to: ${reportPath}`);
        console.log('\n' + '='.repeat(60));
        console.log(report);
    }
}

// Run the audit
async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const auditor = new SiteAuditor(rootPath);
    
    try {
        await auditor.audit();
        console.log('\n✅ Audit completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Audit failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SiteAuditor;