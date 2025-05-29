const fs = require('fs');
const path = require('path');

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Function to calculate relative path to common directory
function getRelativePathToCommon(filePath) {
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'common'));
    return relativePath.replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes
}

// Function to update a single HTML file
function updateHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = getRelativePathToCommon(filePath);

    // Check if the file already has our navbar
    if (content.includes('common/navbar.css') && content.includes('common/navbar.js')) {
        console.log(`Skipping ${filePath} - already updated`);
        return;
    }

    // Add navbar CSS link in head
    if (!content.includes('common/navbar.css')) {
        content = content.replace(
            /<head>([\s\S]*?)<\/head>/,
            `<head>$1    <link rel="stylesheet" href="${relativePath}/navbar.css">\n</head>`
        );
    }

    // Add navbar JS script before closing body tag
    if (!content.includes('common/navbar.js')) {
        content = content.replace(
            /<\/body>/,
            `    <script src="${relativePath}/navbar.js"></script>\n</body>`
        );
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

// Main execution
const pagesDir = path.join(__dirname, 'pages');
const htmlFiles = findHtmlFiles(pagesDir);

console.log('Found HTML files:', htmlFiles.length);

htmlFiles.forEach(file => {
    try {
        updateHtmlFile(file);
    } catch (error) {
        console.error(`Error updating ${file}:`, error);
    }
});

console.log('Update complete!'); 