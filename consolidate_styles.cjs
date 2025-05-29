const fs = require('fs');
const path = require('path');

// Mapping of files to their specific themes
const themeMapping = {
    'Pizza Pi Calculator.html': 'pizza-theme.css',
    'Caffeine Half-Life Calculator.html': 'coffee-theme.css',
    'Zombie Apocalypse Survival Calculator.html': 'dark-theme.css',
    // Add more theme mappings as needed
};

// Find all calculator HTML files
function findCalculatorFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findCalculatorFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !file.includes('index.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function updateCalculatorPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        console.log(`\n📄 Processing: ${fileName}`);
        
        // Add global calculator CSS
        if (!content.includes('global-calculator.css')) {
            content = content.replace(
                '</head>',
                '    <link rel="stylesheet" href="../../common/global-calculator.css">\n</head>'
            );
            console.log('  ✅ Added global calculator CSS');
        }
        
        // Add theme-specific CSS if mapping exists
        const themeFile = themeMapping[fileName];
        if (themeFile && !content.includes(themeFile)) {
            content = content.replace(
                '</head>',
                `    <link rel="stylesheet" href="../../common/themes/${themeFile}">\n</head>`
            );
            console.log(`  ✅ Added theme CSS: ${themeFile}`);
        }
        
        // Remove inline styles (but preserve some special cases)
        const styleStart = content.indexOf('<style>');
        const styleEnd = content.indexOf('</style>') + 8;
        
        if (styleStart !== -1 && styleEnd > styleStart) {
            const inlineStyles = content.substring(styleStart, styleEnd);
            
            // Check if this has Tailwind or special external dependencies
            if (content.includes('tailwindcss.com') || content.includes('alpinejs')) {
                console.log('  ⚠️  Preserving Tailwind/Alpine.js setup');
                // Only remove basic CSS variables and common styles
                const cleanedStyles = inlineStyles.replace(
                    /:root\s*{[^}]*}/g, ''
                ).replace(
                    /body\s*{[^}]*}/g, ''
                ).replace(
                    /header\s*{[^}]*}/g, ''
                ).replace(
                    /h1\s*{[^}]*}/g, ''
                ).replace(
                    /\.calculator\s*{[^}]*}/g, ''
                );
                
                if (cleanedStyles.trim() === '<style>\n\n</style>' || cleanedStyles.trim() === '<style></style>') {
                    // Remove empty style block
                    const beforeStyles = content.substring(0, styleStart);
                    const afterStyles = content.substring(styleEnd);
                    content = beforeStyles + afterStyles;
                    console.log('  ✅ Removed empty inline styles');
                } else {
                    // Replace with cleaned styles
                    const beforeStyles = content.substring(0, styleStart);
                    const afterStyles = content.substring(styleEnd);
                    content = beforeStyles + cleanedStyles + afterStyles;
                    console.log('  ✅ Cleaned inline styles (kept framework-specific)');
                }
            } else {
                // Remove all inline styles for regular pages
                const beforeStyles = content.substring(0, styleStart);
                const afterStyles = content.substring(styleEnd);
                content = beforeStyles + afterStyles;
                console.log('  ✅ Removed all inline styles');
            }
        }
        
        // Ensure navbar CSS is present
        if (!content.includes('navbar-enhanced.css')) {
            content = content.replace(
                '</head>',
                '    <link rel="stylesheet" href="../../common/navbar-enhanced.css">\n</head>'
            );
            console.log('  ✅ Added navbar CSS');
        }
        
        // Clean up multiple empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Successfully updated: ${fileName}`);
        
    } catch (error) {
        console.error(`  ❌ Error updating ${path.basename(filePath)}:`, error.message);
    }
}

// Process all calculator files
const pagesDir = path.join(__dirname, 'pages');
const calculatorFiles = findCalculatorFiles(pagesDir);

console.log(`🎨 CONSOLIDATING STYLES FOR ${calculatorFiles.length} CALCULATOR PAGES`);
console.log('=' .repeat(60));

calculatorFiles.forEach(updateCalculatorPage);

console.log('\n' + '='.repeat(60));
console.log('🎉 STYLE CONSOLIDATION COMPLETE!');
console.log('\n📋 What was done:');
console.log('✅ Added global-calculator.css to all pages');
console.log('✅ Added theme-specific CSS where needed');
console.log('✅ Removed redundant inline styles');
console.log('✅ Preserved framework-specific styles (Tailwind, etc.)');
console.log('✅ Ensured navbar CSS is present');
console.log('\n🎨 Benefits:');
console.log('• Consistent styling across all calculators');  
console.log('• Easier maintenance and updates');
console.log('• Smaller file sizes');
console.log('• Better caching');
console.log('• Centralized theme management');
