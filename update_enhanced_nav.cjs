const fs = require('fs');
const path = require('path');

// Enhanced update script for the new navigation system
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && !file.includes('index.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Function to calculate relative path to common directory
function getRelativePathToCommon(filePath) {
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'common'));
    return relativePath.replace(/\\/g, '/');
}

// Function to update a single HTML file with enhanced navigation
function updateHtmlFileWithEnhancedNav(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = getRelativePathToCommon(filePath);

    // Remove old navbar references
    content = content.replace(/<link rel="stylesheet" href="[^"]*navbar\.css"[^>]*>/g, '');
    content = content.replace(/<script src="[^"]*navbar\.js"[^>]*><\/script>/g, '');

    // Add enhanced navbar CSS link in head (if not already present)
    if (!content.includes('navbar-enhanced.css')) {
        content = content.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>$1    <link rel="stylesheet" href="${relativePath}/navbar-enhanced.css">\n</head>`
        );
    }

    // Add enhanced navbar JS script before closing body tag (if not already present)
    if (!content.includes('navbar-enhanced.js')) {
        content = content.replace(
            /<\/body>/,
            `    <script src="${relativePath}/navbar-enhanced.js"></script>\n</body>`
        );
    }

    // Remove any existing navbar injection comment
    content = content.replace(/<!-- Navbar will be injected here by.*?-->/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Enhanced navigation updated: ${filePath}`);
}

// Main execution
const pagesDir = path.join(__dirname, 'pages');
const htmlFiles = findHtmlFiles(pagesDir);

console.log('Found HTML files:', htmlFiles.length);
console.log('Updating files with enhanced navigation system...');

htmlFiles.forEach(file => {
    try {
        updateHtmlFileWithEnhancedNav(file);
    } catch (error) {
        console.error(`Error updating ${file}:`, error);
    }
});

// Also update the main index.html
try {
    updateHtmlFileWithEnhancedNav(path.join(__dirname, 'index.html'));
    console.log('Updated main index.html');
} catch (error) {
    console.error('Error updating main index.html:', error);
}

console.log('\n✅ Enhanced navigation system update complete!');
console.log('\nNew features added:');
console.log('- Dynamic path resolution');
console.log('- Search functionality');
console.log('- Breadcrumb navigation');
console.log('- Category landing pages');
console.log('- Improved mobile experience');
console.log('- Enhanced visual design');
