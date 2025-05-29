const fs = require('fs');
const path = require('path');

class SiteFixer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.results = {
            deadLinksFixed: 0,
            linksAdded: 0,
            issues: []
        };
    }

    async fixSite() {
        console.log('Starting site fixes...\n');
        
        // Fix the dead link first
        await this.fixDeadLinks();
        
        // Add proper linking structure
        await this.improveNavigation();
        
        console.log('\nFix Summary:');
        console.log(`- Dead links fixed: ${this.results.deadLinksFixed}`);
        console.log(`- Navigation links added: ${this.results.linksAdded}`);
        console.log(`- Issues encountered: ${this.results.issues.length}`);
        
        if (this.results.issues.length > 0) {
            console.log('\nIssues:');
            this.results.issues.forEach(issue => console.log(`- ${issue}`));
        }
    }

    async fixDeadLinks() {
        console.log('Fixing dead links...');
        
        // The audit showed a dead link in the root index.html
        const indexPath = path.join(this.rootPath, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            let content = fs.readFileSync(indexPath, 'utf8');
            
            // Look for common problematic patterns
            const fixes = [
                {
                    search: /href\s*=\s*["']([^"']*\$\{[^}]*\}[^"']*)["']/g,
                    description: 'Template literal in href'
                }
            ];
            
            fixes.forEach(fix => {
                const matches = content.match(fix.search);
                if (matches) {
                    console.log(`Found ${matches.length} instances of: ${fix.description}`);
                    // For now, we'll just report these - manual fixing may be needed
                    this.results.issues.push(`Found problematic links: ${fix.description}`);
                }
            });
        }
    }

    async improveNavigation() {
        console.log('Improving site navigation...');
        
        // Add breadcrumb navigation to category index pages
        await this.addBreadcrumbs();
        
        // Add "Related Calculators" sections to individual calculator pages
        await this.addRelatedLinks();
    }

    async addBreadcrumbs() {
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            const indexPath = path.join(pagesDir, category, 'index.html');
            
            if (fs.existsSync(indexPath)) {
                let content = fs.readFileSync(indexPath, 'utf8');
                
                // Add breadcrumb navigation after the opening body tag
                const breadcrumbHTML = `
        <nav class="breadcrumb" style="padding: 1rem; background: rgba(255,255,255,0.1); margin-bottom: 1rem;">
            <a href="../../index.html" style="color: white; text-decoration: none;">🏠 Home</a>
            <span style="margin: 0 0.5rem; color: white;">></span>
            <span style="color: white;">${this.formatCategoryName(category)}</span>
        </nav>`;
                
                if (!content.includes('class="breadcrumb"')) {
                    content = content.replace(
                        /(<body[^>]*>)/i,
                        `$1${breadcrumbHTML}`
                    );
                    
                    fs.writeFileSync(indexPath, content, 'utf8');
                    this.results.linksAdded++;
                    console.log(`Added breadcrumb navigation to ${category}/index.html`);
                }
            }
        }
    }

    async addRelatedLinks() {
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            const categoryPath = path.join(pagesDir, category);
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html') && file !== 'index.html'
            );
            
            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Add related links section before closing body tag
                const relatedLinksHTML = this.generateRelatedLinksHTML(category, files, file);
                
                if (!content.includes('related-calculators')) {
                    content = content.replace(
                        /(<\/body>)/i,
                        `${relatedLinksHTML}$1`
                    );
                    
                    fs.writeFileSync(filePath, content, 'utf8');
                    this.results.linksAdded++;
                    console.log(`Added related links to ${category}/${file}`);
                }
            }
        }
    }

    generateRelatedLinksHTML(category, allFiles, currentFile) {
        const otherFiles = allFiles.filter(f => f !== currentFile).slice(0, 3);
        
        const linksHTML = otherFiles.map(file => {
            const displayName = file.replace('.html', '').replace(/[-_]/g, ' ');
            return `<a href="./${file}" style="display: block; padding: 0.5rem; margin: 0.25rem 0; background: rgba(255,255,255,0.1); border-radius: 4px; text-decoration: none; color: inherit;">${displayName}</a>`;
        }).join('');
        
        return `
    <div class="related-calculators" style="margin-top: 2rem; padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 8px;">
        <h3 style="margin-top: 0;">Related ${this.formatCategoryName(category)} Tools</h3>
        ${linksHTML}
        <a href="./index.html" style="display: block; padding: 0.5rem; margin-top: 1rem; background: rgba(74,144,226,0.2); border-radius: 4px; text-decoration: none; color: inherit; font-weight: bold;">← Back to ${this.formatCategoryName(category)} Hub</a>
    </div>
`;
    }

    formatCategoryName(category) {
        const nameMap = {
            'BigKidMath': 'Big Kid Math',
            'CipherLab': 'Cipher Lab',
            'GeekGalaxy': 'Geek Galaxy',
            'LifeHacks': 'Life Hacks',
            'Math_Magik': 'Math Magik',
            'Otaku_Ops': 'Otaku Ops'
        };
        
        return nameMap[category] || category;
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const fixer = new SiteFixer(rootPath);
    
    try {
        await fixer.fixSite();
        console.log('\nSite fixes completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Site fixes failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SiteFixer;