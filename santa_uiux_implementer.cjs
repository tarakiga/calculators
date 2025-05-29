const fs = require('fs');
const path = require('path');

class SantaUIUXImplementer {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.results = {
            pagesUpdated: 0,
            improvementsApplied: [],
            themePreservations: []
        };
        
        // Theme-based improvements for each category
        this.themeConfigs = {
            'BigKidMath': {
                colors: { primary: '#4A90E2', secondary: '#7ED321', accent: '#F5A623' },
                style: 'professional',
                interactions: 'subtle'
            },
            'CipherLab': {
                colors: { primary: '#2C3E50', secondary: '#E74C3C', accent: '#F39C12' },
                style: 'dark-tech',
                interactions: 'cyber'
            },
            'GeekGalaxy': {
                colors: { primary: '#9B59B6', secondary: '#3498DB', accent: '#E67E22' },
                style: 'sci-fi',
                interactions: 'futuristic'
            },
            'LifeHacks': {
                colors: { primary: '#27AE60', secondary: '#F39C12', accent: '#E74C3C' },
                style: 'modern-clean',
                interactions: 'smooth'
            },
            'Math_Magik': {
                colors: { primary: '#8E44AD', secondary: '#16A085', accent: '#F1C40F' },
                style: 'mystical',
                interactions: 'magical'
            },
            'Otaku_Ops': {
                colors: { primary: '#E91E63', secondary: '#FF5722', accent: '#FFC107' },
                style: 'anime-vibrant',
                interactions: 'playful'
            }
        };
    }

    async implementAllImprovements() {
        console.log('🎅 Santa Claude implementing UI/UX improvements!');
        console.log('Making each page beautiful while preserving its unique character! ✨\n');

        // Step 1: Create universal CSS improvements
        await this.createUniversalCSS();
        
        // Step 2: Update homepage
        await this.updateHomepage();
        
        // Step 3: Update all calculator pages
        await this.updateAllCalculatorPages();
        
        // Step 4: Update category index pages
        await this.updateCategoryIndexPages();
        
        this.generateReport();
    }

    async createUniversalCSS() {
        console.log('🎨 Creating universal CSS improvements...');
        
        const universalCSS = `
/* ===============================================
   🎅 SANTA CLAUDE'S UI/UX IMPROVEMENTS
   Universal styles while preserving themes
   =============================================== */

/* Mobile-First Responsive Design */
@media screen and (max-width: 768px) {
    .container {
        padding: 1rem !important;
        margin: 0 auto;
    }
    
    .calculator-container,
    .converter-container {
        padding: 1rem;
        margin: 0.5rem 0;
    }
    
    .input-group {
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
    
    .input-group input,
    .input-group select {
        width: 100%;
        padding: 0.75rem;
        font-size: 16px; /* Prevents zoom on iOS */
        border-radius: 6px;
        border: 2px solid #e0e0e0;
        transition: border-color 0.3s ease;
    }
    
    .buttons,
    .button-group {
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }
    
    .btn,
    button {
        width: 100%;
        padding: 0.875rem;
        font-size: 16px;
        min-height: 48px; /* Touch-friendly */
    }
    
    .results,
    .output {
        margin-top: 1.5rem;
        padding: 1rem;
        font-size: 14px;
    }
    
    /* Mobile Navigation */
    .nav-links {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
    }
    
    .mobile-menu-btn {
        display: block;
    }
}

/* Tablet Responsive */
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .container {
        max-width: 90%;
        margin: 0 auto;
    }
    
    .input-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
}

/* Enhanced Accessibility */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Focus indicators */
input:focus,
button:focus,
select:focus,
textarea:focus {
    outline: 3px solid #4A90E2;
    outline-offset: 2px;
}

/* Enhanced Form Styling */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color, #2c3e50);
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-input:focus {
    border-color: var(--primary-color, #4A90E2);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-help {
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.25rem;
}

/* Enhanced Button Styling */
.btn-primary {
    background: var(--primary-color, #4A90E2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateY(0);
    position: relative;
    overflow: hidden;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    filter: brightness(110%);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-primary:disabled,
.btn-primary.loading {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

/* Loading States */
.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-left: 0.5rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Enhanced Results Display */
.results-container {
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}

.results-container.show {
    opacity: 1;
    transform: translateY(0);
}

/* Performance Optimizations */
img {
    loading: lazy;
    max-width: 100%;
    height: auto;
}

/* Smooth Scrolling */
html {
    scroll-behavior: smooth;
}

/* Enhanced Visual Feedback */
.input-error {
    border-color: #e74c3c !important;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.input-success {
    border-color: #27ae60 !important;
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

/* Micro-interactions */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
`;

        const cssPath = path.join(this.rootPath, 'common', 'santa-improvements.css');
        fs.writeFileSync(cssPath, universalCSS, 'utf8');
        console.log('✅ Universal CSS improvements created!');
        this.results.improvementsApplied.push('Universal responsive CSS');
    }
    async updateHomepage() {
        console.log('🏠 Updating homepage with mobile improvements...');
        
        const indexPath = path.join(this.rootPath, 'index.html');
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Add Santa's CSS to head
        const cssLink = '    <link rel="stylesheet" href="common/santa-improvements.css">';
        if (!content.includes('santa-improvements.css')) {
            content = content.replace(
                /<link rel="stylesheet" href="common\/navbar-enhanced\.css">/,
                `<link rel="stylesheet" href="common/navbar-enhanced.css">\n${cssLink}`
            );
        }
        
        // Add viewport if missing
        if (!content.includes('viewport')) {
            content = content.replace(
                /<meta charset="UTF-8">/,
                `<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">`
            );
        }
        
        // Improve form accessibility
        content = content.replace(
            /<input type="text" id="calc-search" placeholder="Search calculators\.\.\." class="search-input">/,
            `<label for="calc-search" class="sr-only">Search calculators</label>
                <input type="text" id="calc-search" placeholder="Search calculators..." class="search-input" aria-label="Search calculators">`
        );
        
        // Add enhanced mobile styles specifically for homepage
        const mobileStyles = `
    <style>
        /* Homepage-specific mobile improvements */
        @media (max-width: 768px) {
            .more-calculators .calculator-categories {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .category-card {
                padding: 1.5rem !important;
            }
            
            .converter-select {
                margin: 1rem 0;
            }
            
            .converter-dropdown {
                width: 100%;
                padding: 0.75rem;
                font-size: 16px;
            }
            
            header h1 {
                font-size: 2rem;
            }
            
            header p {
                font-size: 1rem;
            }
        }
        
        /* Enhanced category card interactions */
        .category-btn:hover {
            background: rgba(255,255,255,0.3) !important;
            transform: scale(1.05);
        }
    </style>`;
        
        if (!content.includes('Homepage-specific mobile improvements')) {
            content = content.replace(
                /<\/head>/,
                `${mobileStyles}\n</head>`
            );
        }
        
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log('✅ Homepage updated with mobile and accessibility improvements!');
        this.results.pagesUpdated++;
        this.results.improvementsApplied.push('Homepage mobile optimization');
    }

    async updateAllCalculatorPages() {
        console.log('🧮 Updating all calculator pages...');
        
        const pagesDir = path.join(this.rootPath, 'pages');
        const categories = fs.readdirSync(pagesDir).filter(item => 
            fs.statSync(path.join(pagesDir, item)).isDirectory()
        );

        for (const category of categories) {
            console.log(`  Updating ${category} calculators...`);
            const categoryPath = path.join(pagesDir, category);
            
            const files = fs.readdirSync(categoryPath).filter(file => 
                file.endsWith('.html') && file !== 'index.html'
            );
            
            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                await this.updateCalculatorPage(filePath, category);
            }
        }
    }

    async updateCalculatorPage(filePath, category) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath);
            const themeConfig = this.themeConfigs[category];
            
            // Add Santa's CSS
            const cssLink = '    <link rel="stylesheet" href="../../common/santa-improvements.css">';
            if (!content.includes('santa-improvements.css')) {
                content = content.replace(
                    /<link rel="stylesheet" href="\.\.\/\.\.\/common\/navbar-enhanced\.css">/,
                    `<link rel="stylesheet" href="../../common/navbar-enhanced.css">\n${cssLink}`
                );
            }
            
            // Add viewport if missing
            if (!content.includes('viewport')) {
                content = content.replace(
                    /<meta charset="UTF-8">/,
                    `<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">`
                );
            }
            
            // Add theme-specific improvements
            const themeStyles = this.generateThemeStyles(category, themeConfig);
            if (!content.includes(`${category}-theme-improvements`)) {
                content = content.replace(
                    /<\/head>/,
                    `${themeStyles}\n</head>`
                );
            }
            
            // Improve form accessibility
            content = this.improveFormAccessibility(content);
            
            // Add loading states to buttons
            content = this.addLoadingStates(content);
            
            // Enhance results display
            content = this.enhanceResultsDisplay(content);
            
            fs.writeFileSync(filePath, content, 'utf8');
            this.results.pagesUpdated++;
            
        } catch (error) {
            console.log(`   ⚠️ Error updating ${path.basename(filePath)}: ${error.message}`);
        }
    }

    generateThemeStyles(category, themeConfig) {
        const styles = {
            'professional': `
        /* Professional theme enhancements */
        .btn-primary:hover { background: linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}); }
        .form-input:focus { border-color: ${themeConfig.colors.primary}; }
        .results-container { border-left: 4px solid ${themeConfig.colors.primary}; }`,
            
            'dark-tech': `
        /* Cyber/Tech theme enhancements */
        .btn-primary { 
            background: linear-gradient(45deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary});
            box-shadow: 0 0 20px rgba(231, 76, 60, 0.3);
        }
        .btn-primary:hover { 
            box-shadow: 0 0 30px rgba(231, 76, 60, 0.5);
            transform: translateY(-3px);
        }
        .form-input:focus { 
            border-color: ${themeConfig.colors.secondary};
            box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
        }`,
            
            'sci-fi': `
        /* Sci-Fi theme enhancements */
        .btn-primary {
            background: linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary});
            position: relative;
            overflow: hidden;
        }
        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        .btn-primary:hover::before { left: 100%; }
        .results-container {
            background: rgba(155, 89, 182, 0.1);
            border: 1px solid rgba(155, 89, 182, 0.3);
        }`,
            
            'modern-clean': `
        /* Modern clean theme enhancements */
        .btn-primary {
            background: ${themeConfig.colors.primary};
            border-radius: 25px;
        }
        .btn-primary:hover {
            background: ${themeConfig.colors.secondary};
            transform: translateY(-1px);
        }
        .form-input {
            border-radius: 12px;
            border: 2px solid #e8f5e8;
        }
        .form-input:focus {
            border-color: ${themeConfig.colors.primary};
            background: #f8fff8;
        }`,
            
            'mystical': `
        /* Mystical theme enhancements */
        .btn-primary {
            background: linear-gradient(45deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary});
            box-shadow: 0 4px 15px rgba(142, 68, 173, 0.4);
        }
        .btn-primary:hover {
            box-shadow: 0 6px 20px rgba(142, 68, 173, 0.6);
            filter: brightness(120%);
        }
        .results-container {
            background: radial-gradient(circle, rgba(142, 68, 173, 0.1), rgba(22, 160, 133, 0.1));
            border: 1px solid rgba(142, 68, 173, 0.3);
        }`,
            
            'anime-vibrant': `
        /* Anime/Vibrant theme enhancements */
        .btn-primary {
            background: linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary});
            transform: perspective(1px) translateZ(0);
        }
        .btn-primary:hover {
            animation: bounce 0.6s ease infinite alternate;
        }
        @keyframes bounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-8px); }
        }
        .form-input:focus {
            border-color: ${themeConfig.colors.primary};
            transform: scale(1.02);
        }`
        };
        
        return `
    <style>
        /* ${category}-theme-improvements */
        :root {
            --primary-color: ${themeConfig.colors.primary};
            --secondary-color: ${themeConfig.colors.secondary};
            --accent-color: ${themeConfig.colors.accent};
        }
        
        ${styles[themeConfig.style] || styles['professional']}
        
        /* Mobile-specific theme adjustments */
        @media (max-width: 768px) {
            .btn-primary {
                min-height: 48px;
                font-size: 16px;
            }
            
            .form-input {
                font-size: 16px;
                min-height: 48px;
            }
        }
    </style>`;
    }
}

async function main() {
    const rootPath = process.argv[2] || process.cwd();
    const implementer = new SantaUIUXImplementer(rootPath);
    
    try {
        await implementer.implementAllImprovements();
        console.log('\n🎅 Ho ho ho! Santa Claude has delivered all UI/UX improvements!');
        console.log('🎁 Your site is now more beautiful, accessible, and user-friendly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Santa\'s implementation sleigh encountered an issue:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = SantaUIUXImplementer;