// Enhanced Navbar with Dynamic Path Resolution and Search
class EnhancedNavbar {
    constructor() {
        this.calculators = {
            'BigKidMath': {
                title: 'Big Kid Math',
                description: 'Practical calculators for adult life decisions',
                items: [
                    { name: 'Caffeine Half-Life Calculator', file: 'Caffeine Half-Life Calculator.html' },
                    { name: 'Car Ownership vs. Uber Cost Calculator', file: 'Car Ownership vs. Uber Cost Calculator.html' },
                    { name: 'Generational Timeline Calculator', file: 'Generational Timeline Calculator.html' }
                ]
            },
            'CipherLab': {
                title: 'Cipher Lab',
                description: 'Cryptography and encoding tools',
                items: [
                    { name: 'Morse Code Translator', file: 'Morse Code Translator_Encoder_Decoder.html' },
                    { name: 'Ogham Translator', file: 'Ogham Translator Encoder_Decoder.html' },
                    { name: 'Password Strength Calculator', file: 'Password Strength → Anger Scale Calculator.html' }
                ]
            },
            'GeekGalaxy': {
                title: 'Geek Galaxy',
                description: 'Sci-fi and fantasy calculators',
                items: [
                    { name: 'AI Doomsday Countdown', file: 'AI Doomsday Countdown.html' },
                    { name: 'Alien Communication Probability', file: 'Alien Communication Probability Calculator.html' },
                    { name: 'Lightsaber Battery Life', file: 'Lightsaber Battery Life Calculator.html' },
                    { name: 'Potion Brewer Calculator', file: 'Potion Brewer Calculator.html' },
                    { name: 'Space Travel Time Calculator', file: 'Space Travel Time Calculator.html' },
                    { name: 'Spaceship Fuel Calculator', file: 'Spaceship Fuel Calculator.html' },
                    { name: 'Star Trek Warp Speed Converter', file: 'Star Trek Warp Speed Converte.html' },
                    { name: 'Time Machine Paradox Detector', file: 'Time Machine Paradox Detector.html' },
                    { name: 'Zombie Apocalypse Survival', file: 'Zombie Apocalypse Survival Calculator.html' }
                ]
            },
            'LifeHacks': {
                title: 'Life Hacks',
                description: 'Optimize your daily life',
                items: [
                    { name: 'Coffee to Code Efficiency', file: 'Coffee to Code Efficiency Ratio Calculator.html' },
                    { name: 'Inflation Impact Calculator', file: 'Inflation Impact Calculator.html' },
                    { name: 'Procrastination ROI Calculator', file: 'Procrastination ROI Calculator.html' },
                    { name: 'Sleep Cycle Optimizer', file: 'Sleep Cycle Optimizer.html' },
                    { name: 'Social Media Addiction', file: 'Social Media Addiction Calculator.html' },
                    { name: 'Stress-to-Ice-Cream Ratio', file: 'Stress-to-Ice-Cream Ratio Calculator.html' },
                    { name: 'Time is Money Calculator', file: 'Time is Money Calculator.html' }
                ]
            },
            'Math_Magik': {
                title: 'Math Magik',
                description: 'Advanced mathematical tools and visualizations',
                items: [
                    { name: 'Double Pendulum Chaos', file: 'Double Pendulum Chaos.html' },
                    { name: 'Entropy and Feigenbaum\'s Constant', file: 'entropy and feigenbaums constant.html' },
                    { name: 'FIRE Number Calculator', file: 'FIRE Number Calculator.html' },
                    { name: 'Inflation Impact Calculator', file: 'Inflation Impact Calculator.html' },
                    { name: 'Pizza Pi Calculator', file: 'Pizza Pi Calculator.html' },
                    { name: 'Your Life Visualized', file: 'Your Life Visualized.html' }
                ]
            }
        };
            'Otaku_Ops': {
                title: 'Otaku Ops',
                description: 'Gaming and pop culture calculators',
                items: [
                    { name: 'Anime Training Montage Planner', file: 'Anime Training Montage Planner.html' },
                    { name: 'Conspiracy Theory Plausibility', file: 'Conspiracy Theory Plausibility Index.html' },
                    { name: 'Minecraft Portal Planner', file: 'MINECRAFT PORTAL PLANNER.html' }
                ]
            }
        };
        
        this.currentPath = this.detectCurrentPath();
        this.init();
    }

    detectCurrentPath() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');
        
        // Determine the relative path to root
        if (segments.includes('pages')) {
            const pagesIndex = segments.indexOf('pages');
            const depth = segments.length - pagesIndex - 1; // How deep we are from pages/
            return '../'.repeat(depth);
        }
        
        return './'; // We're at root
    }

    generateNavbarHTML() {
        const logoPath = this.currentPath === './' ? 'index.html' : `${this.currentPath}index.html`;
        
        // Create main navigation links for categories (no dropdowns)
        const categoryLinks = Object.keys(this.calculators).map(key => {
            const category = this.calculators[key];
            const categoryPath = `${this.currentPath}pages/${key}/index.html`;
            
            return `<li><a href="${categoryPath}" class="category-main-link">${category.title}</a></li>`;
        }).join('');

        return `
            <nav class="main-nav">
                <div class="nav-container">
                    <div class="nav-logo">
                        <a href="${logoPath}">🧮 Docket One</a>
                    </div>
                    <div class="nav-search">
                        <input type="text" id="calc-search" placeholder="Search calculators..." class="search-input">
                        <div id="search-results" class="search-results"></div>
                    </div>
                    <ul class="nav-links">
                        ${categoryLinks}
                        <li><a href="${logoPath}" class="home-link">Unit Converter</a></li>
                    </ul>
                    <button class="mobile-menu-btn" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>
        `;
    }

    init() {
        console.log('Enhanced Navbar initializing...');
        console.log('Current path detected:', this.currentPath);
        
        // Inject navbar HTML
        const navbar = document.createElement('div');
        navbar.innerHTML = this.generateNavbarHTML();
        
        console.log('Navbar HTML generated:', navbar.innerHTML);
        
        document.body.insertBefore(navbar.firstElementChild, document.body.firstChild);
        
        console.log('Navbar injected into DOM');

        // Initialize functionality
        this.initMobileMenu();
        this.initSearch();
        this.addBreadcrumbs();
        
        console.log('Enhanced Navbar initialization complete');
    }

    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.main-nav')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    initSearch() {
        const searchInput = document.getElementById('calc-search');
        const searchResults = document.getElementById('search-results');
        
        // Create flat list of all calculators for search
        const allCalculators = [];
        Object.keys(this.calculators).forEach(categoryKey => {
            const category = this.calculators[categoryKey];
            category.items.forEach(item => {
                allCalculators.push({
                    name: item.name,
                    category: category.title,
                    categoryKey: categoryKey,
                    file: item.file,
                    path: `${this.currentPath}pages/${categoryKey}/${encodeURIComponent(item.file)}`
                });
            });
        });

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                const matches = allCalculators.filter(calc => 
                    calc.name.toLowerCase().includes(query) ||
                    calc.category.toLowerCase().includes(query)
                ).slice(0, 8); // Limit results

                if (matches.length > 0) {
                    searchResults.innerHTML = matches.map(match => `
                        <a href="${match.path}" class="search-result-item">
                            <strong>${match.name}</strong>
                            <span class="category-tag">${match.category}</span>
                        </a>
                    `).join('');
                    searchResults.style.display = 'block';
                } else {
                    searchResults.innerHTML = '<div class="no-results">No calculators found</div>';
                    searchResults.style.display = 'block';
                }
            }, 300);
        });

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                searchResults.style.display = 'none';
            }
        });
    }

    addBreadcrumbs() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');
        
        if (segments.includes('pages')) {
            const breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.className = 'breadcrumbs';
            
            let breadcrumbHTML = `<a href="${this.currentPath}index.html">Home</a>`;
            
            const pagesIndex = segments.indexOf('pages');
            if (pagesIndex >= 0 && segments[pagesIndex + 1]) {
                const categoryKey = segments[pagesIndex + 1];
                const category = this.calculators[categoryKey];
                
                if (category) {
                    breadcrumbHTML += ` <span class="separator">›</span> <a href="${this.currentPath}pages/${categoryKey}/index.html">${category.title}</a>`;
                    
                    // If we're on a specific calculator page
                    if (segments[pagesIndex + 2]) {
                        const fileName = decodeURIComponent(segments[pagesIndex + 2]);
                        const calculator = category.items.find(item => item.file === fileName);
                        if (calculator) {
                            breadcrumbHTML += ` <span class="separator">›</span> <span class="current">${calculator.name}</span>`;
                        }
                    }
                }
            }
            
            breadcrumbContainer.innerHTML = breadcrumbHTML;
            
            // Insert breadcrumbs after navbar
            const navbar = document.querySelector('.main-nav');
            navbar.parentNode.insertBefore(breadcrumbContainer, navbar.nextSibling);
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Enhanced Navbar...');
    try {
        new EnhancedNavbar();
        console.log('Enhanced Navbar created successfully');
    } catch (error) {
        console.error('Error initializing Enhanced Navbar:', error);
    }
});
