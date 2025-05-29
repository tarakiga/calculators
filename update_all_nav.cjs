const fs = require('fs');
const path = require('path');

// Find all HTML files in pages directories (excluding index.html)
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

const pagesDir = path.join(__dirname, 'pages');
const calculatorFiles = findCalculatorFiles(pagesDir);

console.log(`Found ${calculatorFiles.length} calculator files to update:`);
calculatorFiles.forEach(file => console.log('  -', path.basename(file)));

// Navigation HTML for calculator pages
const navbarHTML = `    <!-- Enhanced Navigation Bar -->
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html">🧮 Docket One</a>
            </div>
            <ul class="nav-links">
                <li><a href="../BigKidMath/index.html">Big Kid Math</a></li>
                <li><a href="../CipherLab/index.html">Cipher Lab</a></li>
                <li><a href="../GeekGalaxy/index.html">Geek Galaxy</a></li>
                <li><a href="../LifeHacks/index.html">Life Hacks</a></li>
                <li><a href="../Math_Magik/index.html">Math Magik</a></li>
                <li><a href="../Otaku_Ops/index.html">Otaku Ops</a></li>
                <li><a href="../../index.html">Unit Converter</a></li>
            </ul>
            <button class="mobile-menu-btn" aria-label="Toggle menu">☰</button>
        </div>
    </nav>
    
`;

calculatorFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add CSS link if missing
        if (!content.includes('navbar-enhanced.css')) {
            content = content.replace('</head>', '    <link rel="stylesheet" href="../../common/navbar-enhanced.css">\n</head>');
        }
        
        // Add navbar after <body> if missing
        if (!content.includes('main-nav')) {
            content = content.replace('<body>', `<body>\n${navbarHTML}`);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ Error: ${path.basename(filePath)} - ${error.message}`);
    }
});

console.log('\n🎉 Update complete!');
