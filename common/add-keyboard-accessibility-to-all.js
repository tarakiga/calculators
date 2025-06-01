// Add keyboard accessibility to all calculator pages
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directories to process
const directories = [
    'pages/BigKidMath',
    'pages/CipherLab',
    'pages/GeekGalaxy',
    'pages/LifeHacks',
    'pages/Math_Magik',
    'pages/Otaku_Ops',
    'pages/support'
];

// Function to add keyboard accessibility script to a file
function addKeyboardAccessibility(filePath) {
    try {
        let content = readFileSync(filePath, 'utf8');

        // Check if the script is already added
        if (content.includes('add-keyboard-accessibility.js')) {
            console.log(`Skipping ${filePath} - script already exists`);
            return;
        }

        // Find the position to insert the script
        const insertPoint = content.indexOf('</head>');
        if (insertPoint === -1) {
            console.log(`Skipping ${filePath} - no </head> tag found`);
            return;
        }

        // Add the script
        const scriptTag = '\n    <script src="../../common/add-keyboard-accessibility.js"></script>';
        content = content.slice(0, insertPoint) + scriptTag + content.slice(insertPoint);

        // Write the modified content back to the file
        writeFileSync(filePath, content, 'utf8');
        console.log(`Added keyboard accessibility to ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Function to process a directory
function processDirectory(dir) {
    const fullPath = join(__dirname, '..', dir);

    try {
        const files = readdirSync(fullPath);

        files.forEach(file => {
            const filePath = join(fullPath, file);
            const stat = statSync(filePath);

            if (stat.isDirectory()) {
                // Recursively process subdirectories
                processDirectory(join(dir, file));
            } else if (file.endsWith('.html')) {
                // Process HTML files
                addKeyboardAccessibility(filePath);
            }
        });
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}

// Process all directories
directories.forEach(dir => {
    console.log(`Processing directory: ${dir}`);
    processDirectory(dir);
});

console.log('Finished adding keyboard accessibility to all pages'); 