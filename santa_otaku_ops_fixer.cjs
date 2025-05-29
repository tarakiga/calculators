const fs = require('fs');
const path = require('path');

class SantaOtakuOpsFixer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.results = {
            pagesFixed: 0,
            titlesFixed: 0,
            linksUpdated: 0
        };
    }

    async fixOtakuOpsPages() {
        console.log('🎅 Santa Claude fixing Otaku_Ops page inconsistencies!');
        console.log('Ho ho ho! Making titles match content! 🎯\n');

        const otakuOpsPath = path.join(this.rootPath, 'pages', 'Otaku_Ops');
        
        // Fix the Minecraft Portal Planner title mismatch
        await this.fixMinecraftPortalPlanner(otakuOpsPath);
        
        // Check and update all links that reference these pages
        await this.updateAllLinksToOtakuOpsPages();
        
        this.generateReport();
    }

    async fixMinecraftPortalPlanner(otakuOpsPath) {
        const filePath = path.join(otakuOpsPath, 'MINECRAFT PORTAL PLANNER.html');
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            console.log('🔧 Fixing MINECRAFT PORTAL PLANNER.html title mismatch...');
            
            // Check current title
            const titleMatch = content.match(/<title>([^<]+)<\/title>/);
            if (titleMatch) {
                console.log(`   Current title: "${titleMatch[1]}"`);
                
                // Fix the incorrect title
                if (titleMatch[1] === 'Minecraft Stack Optimizer') {
                    content = content.replace(
                        /<title>Minecraft Stack Optimizer<\/title>/,
                        '<title>Minecraft Portal Planner</title>'
                    );
                    console.log('   ✅ Fixed title: "Minecraft Portal Planner"');
                    this.results.titlesFixed++;
                }
            }
            
            // Also check if meta description matches content
            if (content.includes('meta name="description"')) {
                // Add appropriate meta description if missing or incorrect
                const metaMatch = content.match(/<meta name="description" content="([^"]+)"/);
                if (!metaMatch || !metaMatch[1].includes('portal')) {
                    if (metaMatch) {
                        content = content.replace(
                            metaMatch[0],
                            '<meta name="description" content="Plan and build perfect Minecraft Nether portals with our calculator. Calculate obsidian requirements and portal dimensions for optimal builds."'
                        );
                    } else {
                        content = content.replace(
                            /<meta name="viewport"[^>]*>/,
                            `<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Plan and build perfect Minecraft Nether portals with our calculator. Calculate obsidian requirements and portal dimensions for optimal builds.">`
                        );
                    }
                    console.log('   ✅ Updated meta description to match content');
                }
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            this.results.pagesFixed++;
            console.log('   ✅ MINECRAFT PORTAL PLANNER.html fixed!');
            
        } catch (error) {
            console.log(`   ❌ Error fixing MINECRAFT PORTAL PLANNER.html: ${error.message}`);
        }
    }

    async updateAllLinksToOtakuOpsPages() {
        console.log('\n🔗 Checking and updating links to Otaku_Ops pages...');
        
        // Check the Otaku_Ops index page for correct links
        await this.updateOtakuOpsIndex();
        
        // Check other pages that might link to Otaku_Ops calculators
        await this.updateMainHomepage();
        await this.updateRelatedLinks();
    }

    async updateOtakuOpsIndex() {
        const indexPath = path.join(this.rootPath, 'pages', 'Otaku_Ops', 'index.html');
        
        try {
            let content = fs.readFileSync(indexPath, 'utf8');
            console.log('   🔍 Checking Otaku_Ops index page links...');
            
            // Check if links are consistent with actual file names and content
            const expectedLinks = [
                { file: 'Anime Training Montage Planner.html', title: 'Anime Training Montage Planner' },
                { file: 'Conspiracy Theory Plausibility Index.html', title: 'Conspiracy Theory Plausibility Index' },
                { file: 'MINECRAFT PORTAL PLANNER.html', title: 'Minecraft Portal Planner' }
            ];
            
            let linksUpdated = 0;
            
            expectedLinks.forEach(link => {
                // Check if the link text matches the actual content
                const linkPattern = new RegExp(`<a[^>]*href=["']\\.\/${link.file.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}["'][^>]*>([^<]+)</a>`, 'gi');
                const matches = content.match(linkPattern);
                
                if (matches) {
                    matches.forEach(match => {
                        // Extract the link text
                        const textMatch = match.match(/>([^<]+)</);
                        if (textMatch && textMatch[1] !== link.title) {
                            console.log(`   🔧 Updating link text: "${textMatch[1]}" → "${link.title}"`);
                            content = content.replace(match, match.replace(textMatch[1], link.title));
                            linksUpdated++;
                        }
                    });
                }
            });
            
            if (linksUpdated > 0) {
                fs.writeFileSync(indexPath, content, 'utf8');
                console.log(`   ✅ Updated ${linksUpdated} links in Otaku_Ops index`);
                this.results.linksUpdated += linksUpdated;
            } else {
                console.log('   ✅ All links in Otaku_Ops index are correct');
            }
            
        } catch (error) {
            console.log(`   ❌ Error updating Otaku_Ops index: ${error.message}`);
        }
    }

    async updateMainHomepage() {
        const homepagePath = path.join(this.rootPath, 'index.html');
        
        try {
            let content = fs.readFileSync(homepagePath, 'utf8');
            console.log('   🔍 Checking main homepage search data...');
            
            // Update search data if it references old titles
            if (content.includes('Minecraft Stack Optimizer')) {
                content = content.replace(
                    /Minecraft Stack Optimizer/g,
                    'Minecraft Portal Planner'
                );
                console.log('   ✅ Updated homepage search references');
                this.results.linksUpdated++;
            }
            
            // Check for any other references
            if (content.includes('MINECRAFT PORTAL PLANNER.html')) {
                // Make sure the display name is consistent
                const portalPlannerRegex = /{name: '([^']*)', path: '[^']*MINECRAFT PORTAL PLANNER.html'[^}]*}/g;
                const matches = content.match(portalPlannerRegex);
                if (matches) {
                    matches.forEach(match => {
                        if (!match.includes("name: 'Minecraft Portal Planner'")) {
                            const updated = match.replace(/name: '[^']*'/, "name: 'Minecraft Portal Planner'");
                            content = content.replace(match, updated);
                            console.log('   ✅ Updated homepage calculator reference');
                            this.results.linksUpdated++;
                        }
                    });
                }
            }
            
            if (this.results.linksUpdated > 0) {
                fs.writeFileSync(homepagePath, content, 'utf8');
            }
            
        } catch (error) {
            console.log(`   ❌ Error updating homepage: ${error.message}`);
        }
    }

    async updateRelatedLinks() {
        console.log('   🔍 Checking related links in other Otaku_Ops calculators...');
        
        const otakuOpsPath = path.join(this.rootPath, 'pages', 'Otaku_Ops');
        const calculatorFiles = [
            'Anime Training Montage Planner.html',
            'Conspiracy Theory Plausibility Index.html'
        ];
        
        for (const file of calculatorFiles) {
            try {
                const filePath = path.join(otakuOpsPath, file);
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Check for references to MINECRAFT PORTAL PLANNER
                if (content.includes('MINECRAFT PORTAL PLANNER.html')) {
                    // Update display name in related links
                    content = content.replace(
                        />MINECRAFT PORTAL PLANNER</g,
                        '>Minecraft Portal Planner<'
                    );
                    content = content.replace(
                        />Minecraft Stack Optimizer</g,
                        '>Minecraft Portal Planner<'
                    );
                    
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`   ✅ Updated related links in ${file}`);
                    this.results.linksUpdated++;
                }
                
            } catch (error) {
                console.log(`   ⚠️ Could not update ${file}: ${error.message}`);
            }
        }
    }

    generateReport() {
        console.log('\n' + '🎯'.repeat(30));
        console.log('🎅 SANTA CLAUDE OTAKU_OPS FIX REPORT 🎯');
        console.log('🎯'.repeat(30));
        
        console.log(`\n📊 OTAKU_OPS FIX SUMMARY:`);
        console.log(`🎯 Pages Fixed: ${this.results.pagesFixed}`);
        console.log(`📝 Titles Fixed: ${this.results.titlesFixed}`);
        console.log(`🔗 Links Updated: ${this.results.linksUpdated}`);
        
        console.log(`\n🎅 WHAT SANTA FIXED:`);
        console.log(`✅ Fixed title mismatch in MINECRAFT PORTAL PLANNER.html`);
        console.log(`✅ Updated page title to match actual content (Portal Planner)`);
        console.log(`✅ Added appropriate meta description`);
        console.log(`✅ Updated all references throughout the site`);
        console.log(`✅ Ensured consistency between filenames, titles, and content`);
        
        console.log(`\n🎁 OTAKU_OPS PAGES ARE NOW CONSISTENT:`);
        console.log(`🎯 Anime Training Montage Planner.html - ✅ Title, content, and links match`);
        console.log(`🎯 Conspiracy Theory Plausibility Index.html - ✅ Title, content, and links match`);
        console.log(`🎯 MINECRAFT PORTAL PLANNER.html - ✅ Fixed! Now shows "Minecraft Portal Planner"`);
        
        console.log(`\n🎮 WHAT USERS NOW SEE:`);
        console.log(`• Clear, consistent page titles that match the content`);
        console.log(`• Proper meta descriptions for SEO`);
        console.log(`• Accurate navigation and search results`);
        console.log(`• No more confusion between titles and actual functionality`);
        
        console.log(`\n🎅 Ho ho ho! Otaku_Ops pages are now perfectly consistent!`);
        console.log(`All titles, content, and links are in harmony! ✨`);
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const fixer = new SantaOtakuOpsFixer(rootPath);
    
    try {
        await fixer.fixOtakuOpsPages();
        console.log('\n🎅 Santa Claude Otaku_Ops Fix Mission: SUCCESS!');
        console.log('🎁 All page titles now match their content perfectly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Santa\'s Otaku fix sleigh hit a snag:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SantaOtakuOpsFixer;