// Enhanced Navbar Search Functionality
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
                    { name: 'Caesar Cipher Calculator', file: 'Caesar Cipher Calculator.html' },
                    { name: 'Morse Code Translator', file: 'morseCodeTranslatorEncoderDecoder.html' },
                    { name: 'NATO Phonetic Alphabet Converter', file: 'NATO Phonetic Alphabet Converter.html' },
                    { name: 'Ogham Translator', file: 'oghamTranslatorEncoderDecoder.html' },
                    { name: 'Pigpen Cipher Calculator', file: 'Pigpen Cipher Calculator.html' },
                    { name: 'Password Strength Calculator', file: 'passwordStrengthAngerScaleCalculator.html' }
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
                    { name: 'Pizza Pi Calculator', file: 'Pizza Pi Calculator.html' },
                    { name: 'Your Life Visualized', file: 'Your Life Visualized.html' }
                ]
            },
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
        this.ensureNavbarStructure();
        this.initSearch();
        this.initMobileMenu();
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

    init() {
        console.log('Enhanced Navbar Search initializing...');
        console.log('Current path detected:', this.currentPath);

        // Ensure navbar structure exists
        this.ensureNavbarStructure();

        // Initialize functionality
        this.initSearch();
        this.initMobileMenu();

        console.log('Enhanced Navbar Search initialization complete');
    }

    ensureNavbarStructure() {
        // Check if navbar exists
        let navbar = document.querySelector('.main-nav');
        if (!navbar) {
            console.error('Navbar not found, creating one...');
            navbar = document.createElement('nav');
            navbar.className = 'main-nav';
            navbar.setAttribute('role', 'navigation');
            navbar.setAttribute('aria-label', 'Main navigation');
            navbar.innerHTML = `
                <div class="nav-container">
                    <div class="nav-logo">
                        <a href="${this.currentPath}index.html" aria-label="Home">🧮 Docket One</a>
                    </div>
                    <div class="nav-search" role="search">
                        <input type="text" 
                               id="calc-search" 
                               placeholder="Search calculators..." 
                               class="search-input" 
                               aria-label="Search calculators"
                               aria-expanded="false"
                               aria-controls="search-results">
                        <div id="search-results" 
                             class="search-results" 
                             role="listbox" 
                             aria-label="Search results"
                             aria-hidden="true">
                        </div>
                    </div>
                    <button class="mobile-menu-btn" 
                            aria-label="Toggle menu" 
                            aria-expanded="false"
                            aria-controls="nav-links">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </button>
                    <ul class="nav-links" role="menu" aria-label="Main menu">
                        <li role="none"><a href="${this.currentPath}pages/BigKidMath/index.html" class="category-link" role="menuitem">Big Kid Math</a></li>
                        <li role="none"><a href="${this.currentPath}pages/CipherLab/index.html" class="category-link" role="menuitem">Cipher Lab</a></li>
                        <li role="none"><a href="${this.currentPath}pages/GeekGalaxy/index.html" class="category-link" role="menuitem">Geek Galaxy</a></li>
                        <li role="none"><a href="${this.currentPath}pages/LifeHacks/index.html" class="category-link" role="menuitem">Life Hacks</a></li>
                        <li role="none"><a href="${this.currentPath}pages/Math_Magik/index.html" class="category-link" role="menuitem">Math Magik</a></li>
                        <li role="none"><a href="${this.currentPath}pages/Otaku_Ops/index.html" class="category-link" role="menuitem">Otaku Ops</a></li>
                    </ul>
                </div>
            `;
            document.body.insertBefore(navbar, document.body.firstChild);
        }

        // Initialize mobile menu button
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                menuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', !isExpanded);
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active') &&
                    !e.target.closest('.nav-links') &&
                    !e.target.closest('.mobile-menu-btn')) {
                    menuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });

            // Close menu when window is resized above mobile breakpoint
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    menuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    initSearch() {
        const searchInput = document.getElementById('calc-search');
        const searchResults = document.getElementById('search-results');

        if (!searchInput || !searchResults) {
            console.error('Search elements not found');
            return;
        }

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

        // Add main categories to search
        Object.keys(this.calculators).forEach(categoryKey => {
            const category = this.calculators[categoryKey];
            allCalculators.push({
                name: category.title,
                category: 'Category',
                categoryKey: categoryKey,
                description: category.description,
                path: `${this.currentPath}pages/${categoryKey}/index.html`
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
                    (calc.description && calc.description.toLowerCase().includes(query)) ||
                    calc.category.toLowerCase().includes(query)
                ).slice(0, 8); // Limit results

                if (matches.length > 0) {
                    const resultsList = document.createElement('ul');
                    resultsList.className = 'search-results-list';

                    matches.forEach(match => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = match.path;

                        const title = document.createElement('div');
                        title.className = 'result-title';
                        title.textContent = match.name;

                        const description = document.createElement('div');
                        description.className = 'result-description';
                        description.textContent = match.description || match.category;

                        link.appendChild(title);
                        link.appendChild(description);
                        listItem.appendChild(link);
                        resultsList.appendChild(listItem);
                    });

                    searchResults.innerHTML = '';
                    searchResults.appendChild(resultsList);
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

    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (menuBtn && navLinks) {
            // Add loading state
            navLinks.classList.add('loading');

            try {
                // Toggle menu on button click
                menuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                    menuBtn.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    menuBtn.setAttribute('aria-expanded', !isExpanded);

                    // Prevent body scroll when menu is open
                    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (navLinks.classList.contains('active') &&
                        !e.target.closest('.nav-links') &&
                        !e.target.closest('.mobile-menu-btn')) {
                        menuBtn.classList.remove('active');
                        navLinks.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                });

                // Close menu when window is resized above mobile breakpoint
                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768) {
                        menuBtn.classList.remove('active');
                        navLinks.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                });

                // Remove loading state after initialization
                navLinks.classList.remove('loading');
            } catch (error) {
                console.error('Error initializing mobile menu:', error);
                // Fallback behavior
                menuBtn.style.display = 'none';
                navLinks.style.display = 'flex';
            }
        } else {
            console.error('Mobile menu elements not found:', { menuBtn, navLinks });
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Enhanced Navbar Search...');
    try {
        new EnhancedNavbar();
        console.log('Enhanced Navbar Search created successfully');
    } catch (error) {
        console.error('Error initializing Enhanced Navbar Search:', error);
    }
});
