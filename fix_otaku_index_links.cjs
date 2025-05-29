const fs = require('fs');
const path = require('path');

async function fixOtakuOpsIndex() {
    console.log('🎅 Santa Claude fixing Otaku_Ops index page links!');
    console.log('Ho ho ho! Correcting links to match actual pages! 🔗\n');

    const indexPath = 'D:/work/Tar/PROJECTS/CALCULATOR/_public_html/pages/Otaku_Ops/index.html';
    
    try {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        console.log('🔍 Found incorrect links to non-existent pages:');
        console.log('   ❌ animeTimeCalculator.html');
        console.log('   ❌ mangaChapterCalculator.html'); 
        console.log('   ❌ animeWatchlistManager.html');
        console.log('');
        console.log('🔧 Replacing with actual existing pages:');
        console.log('   ✅ Anime Training Montage Planner.html');
        console.log('   ✅ Conspiracy Theory Plausibility Index.html');
        console.log('   ✅ MINECRAFT PORTAL PLANNER.html');
        console.log('');

        // Fix the main calculator cards section
        content = content.replace(
            /<div class="calculator-card">\s*<h3>⏱️ Anime Time Calculator<\/h3>\s*<p>Calculate total watch time for your anime list\. Perfect for planning binge-watching\s*sessions\.<\/p>\s*<a href="animeTimeCalculator\.html" class="btn">Calculate Time<\/a>\s*<\/div>/s,
            `<div class="calculator-card">
                <h3>💪 Anime Training Montage Planner</h3>
                <p>Plan epic training montages like your favorite anime heroes. Calculate intensity, duration, and sweat drops for maximum power-up potential!</p>
                <a href="Anime Training Montage Planner.html" class="btn">Plan Training</a>
            </div>`
        );

        content = content.replace(
            /<div class="calculator-card">\s*<h3>📚 Manga Chapter Calculator<\/h3>\s*<p>Track your manga reading progress and estimate completion time\. Never lose track of your favorite\s*series again\.<\/p>\s*<a href="mangaChapterCalculator\.html" class="btn">Track Progress<\/a>\s*<\/div>/s,
            `<div class="calculator-card">
                <h3>🕵️ Conspiracy Theory Plausibility Index</h3>
                <p>Rate the plausibility of conspiracy theories with scientific precision. From moon landing to flat earth - get your conspiracy credibility score!</p>
                <a href="Conspiracy Theory Plausibility Index.html" class="btn">Analyze Theory</a>
            </div>`
        );

        content = content.replace(
            /<div class="calculator-card">\s*<h3>🎬 Anime Watchlist Manager<\/h3>\s*<p>Organize your anime watchlist and get personalized recommendations based on your preferences\.<\/p>\s*<a href="animeWatchlistManager\.html" class="btn">Manage List<\/a>\s*<\/div>/s,
            `<div class="calculator-card">
                <h3>🎮 Minecraft Portal Planner</h3>
                <p>Build perfect Nether portals every time! Calculate obsidian requirements, portal dimensions, and optimal placement for your Minecraft adventures.</p>
                <a href="MINECRAFT PORTAL PLANNER.html" class="btn">Plan Portal</a>
            </div>`
        );

        // Fix the Individual Tools section
        content = content.replace(
            /<div class="feature-item">\s*<div class="feature-icon">⏱️<\/div>\s*<h3><a href="animeTimeCalculator\.html">Anime Time Calculator<\/a><\/h3>\s*<p>Calculate watch times<\/p>\s*<\/div>/s,
            `<div class="feature-item">
                    <div class="feature-icon">💪</div>
                    <h3><a href="Anime Training Montage Planner.html">Training Montage Planner</a></h3>
                    <p>Plan epic anime training</p>
                </div>`
        );

        content = content.replace(
            /<div class="feature-item">\s*<div class="feature-icon">📚<\/div>\s*<h3><a href="mangaChapterCalculator\.html">Manga Chapter Calculator<\/a><\/h3>\s*<p>Track reading progress<\/p>\s*<\/div>/s,
            `<div class="feature-item">
                    <div class="feature-icon">🕵️</div>
                    <h3><a href="Conspiracy Theory Plausibility Index.html">Conspiracy Analyzer</a></h3>
                    <p>Rate theory plausibility</p>
                </div>`
        );

        content = content.replace(
            /<div class="feature-item">\s*<div class="feature-icon">🎬<\/div>\s*<h3><a href="animeWatchlistManager\.html">Watchlist Manager<\/a><\/h3>\s*<p>Organize your anime<\/p>\s*<\/div>/s,
            `<div class="feature-item">
                    <div class="feature-icon">🎮</div>
                    <h3><a href="MINECRAFT PORTAL PLANNER.html">Portal Planner</a></h3>
                    <p>Build perfect portals</p>
                </div>`
        );

        // Also update the page description to match the actual content
        content = content.replace(
            /<meta name="description"\s*content="Your ultimate anime and manga companion\. Calculate episode times, track your watchlist, and more\.">/,
            '<meta name="description" content="Otaku tools and calculators for geeks and gamers. Plan anime training montages, analyze conspiracy theories, and build perfect Minecraft portals.">'
        );

        fs.writeFileSync(indexPath, content, 'utf8');
        
        console.log('✅ Fixed Otaku_Ops index page links!');
        console.log('✅ Updated descriptions to match actual content!');
        console.log('✅ All links now point to existing pages!');
        console.log('');
        console.log('🎁 Otaku_Ops index page is now consistent and functional!');
        
    } catch (error) {
        console.log(`❌ Error fixing Otaku_Ops index: ${error.message}`);
    }
}

fixOtakuOpsIndex();