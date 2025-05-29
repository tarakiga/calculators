const fs = require('fs');
const path = require('path');

class BreadcrumbRemover {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.results = {
            breadcrumbsRemoved: 0,
            deadLinks: [],
            issues: []
        };
    }

    async removeBreadcrumbs() {
        console.log('Removing breadcrumbs from category pages...\n');
        
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            const indexPath = path.join(pagesDir, category, 'index.html');
            
            if (fs.existsSync(indexPath)) {
                let content = fs.readFileSync(indexPath, 'utf8');
                
                // Remove breadcrumb navigation
                const breadcrumbRegex = /<nav class="breadcrumb"[^>]*>[\s\S]*?<\/nav>/gi;
                
                if (content.match(breadcrumbRegex)) {
                    content = content.replace(breadcrumbRegex, '');
                    fs.writeFileSync(indexPath, content, 'utf8');
                    this.results.breadcrumbsRemoved++;
                    console.log(`✅ Removed breadcrumb from ${category}/index.html`);
                } else {
                    console.log(`ℹ️  No breadcrumb found in ${category}/index.html`);
                }
            }
        }
        
        console.log(`\nBreadcrumb removal complete: ${this.results.breadcrumbsRemoved} removed\n`);
    }

    async checkDeadLinks() {
        console.log('Checking for dead links on category pages...\n');
        
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            console.log(`Checking links in ${category}...`);
            const categoryPath = path.join(pagesDir, category);
            
            // Check category index page
            const indexPath = path.join(categoryPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                await this.checkPageLinks(indexPath, category);
            }
            
            // Check all calculator pages in this category
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html') && file !== 'index.html'
            );
            
            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                await this.checkPageLinks(filePath, category);
            }
        }
        
        console.log(`\nDead link check complete: ${this.results.deadLinks.length} dead links found\n`);
    }

    async checkPageLinks(filePath, category) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            
            // Extract all href links
            const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
            let match;
            const pageDeadLinks = [];
            
            while ((match = linkRegex.exec(content)) !== null) {
                const href = match[1];
                
                // Skip external links, anchors, javascript, and special protocols
                if (href.startsWith('http') || href.startsWith('//') || 
                    href.startsWith('#') || href.startsWith('javascript:') || 
                    href.startsWith('mailto:') || href.startsWith('tel:')) {
                    continue;
                }
                
                // Resolve relative paths
                let resolvedPath;
                
                if (href.startsWith('/')) {
                    // Absolute path from root
                    resolvedPath = path.join(this.rootPath, href.substring(1));
                } else if (href.startsWith('../')) {
                    // Relative path going up
                    resolvedPath = path.resolve(path.dirname(filePath), href);
                } else {
                    // Relative path in same directory
                    resolvedPath = path.resolve(path.dirname(filePath), href);
                }

                // Remove URL fragments and query parameters
                resolvedPath = resolvedPath.split('#')[0].split('?')[0];
                
                // Check if file exists
                if (!fs.existsSync(resolvedPath)) {
                    // Try adding .html extension
                    if (!resolvedPath.endsWith('.html') && !fs.existsSync(resolvedPath + '.html')) {
                        pageDeadLinks.push({
                            link: href,
                            resolvedPath: resolvedPath,
                            page: fileName,
                            category: category
                        });
                    }
                }
            }
            
            if (pageDeadLinks.length > 0) {
                console.log(`   ⚠️  ${fileName}: ${pageDeadLinks.length} dead links found`);
                pageDeadLinks.forEach(deadLink => {
                    console.log(`      - ${deadLink.link} → ${deadLink.resolvedPath}`);
                });
                this.results.deadLinks.push(...pageDeadLinks);
            } else {
                console.log(`   ✅ ${fileName}: No dead links`);
            }

        } catch (error) {
            this.results.issues.push(`Failed to check links in ${filePath}: ${error.message}`);
            console.log(`   ❌ ${path.basename(filePath)}: Error checking links`);
        }
    }

    generateReport() {
        console.log('='.repeat(60));
        console.log('BREADCRUMB REMOVAL & DEAD LINK CHECK REPORT');
        console.log('='.repeat(60));
        
        console.log(`\n📊 SUMMARY:`);
        console.log(`- Breadcrumbs removed: ${this.results.breadcrumbsRemoved}`);
        console.log(`- Dead links found: ${this.results.deadLinks.length}`);
        console.log(`- Issues encountered: ${this.results.issues.length}`);
        
        if (this.results.deadLinks.length > 0) {
            console.log(`\n⚠️  DEAD LINKS FOUND:`);
            this.results.deadLinks.forEach(deadLink => {
                console.log(`- ${deadLink.category}/${deadLink.page}: ${deadLink.link}`);
                console.log(`  → Resolves to: ${deadLink.resolvedPath}`);
            });
        }
        
        if (this.results.issues.length > 0) {
            console.log(`\n❌ ISSUES:`);
            this.results.issues.forEach(issue => {
                console.log(`- ${issue}`);
            });
        }
        
        if (this.results.deadLinks.length === 0 && this.results.issues.length === 0) {
            console.log(`\n✅ All category pages have clean navigation!`);
        }
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const remover = new BreadcrumbRemover(rootPath);
    
    try {
        await remover.removeBreadcrumbs();
        await remover.checkDeadLinks();
        remover.generateReport();
        
        console.log('\n🎯 Task completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Task failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = BreadcrumbRemover;