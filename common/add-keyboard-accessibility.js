// Add keyboard accessibility script to all calculator pages
document.addEventListener('DOMContentLoaded', () => {
    // Create script element
    const script = document.createElement('script');
    script.src = '/common/keyboard-accessibility.js';
    script.async = true;

    // Add script to head if not already present
    if (!document.querySelector('script[src="/common/keyboard-accessibility.js"]')) {
        document.head.appendChild(script);
    }

    // Add skip navigation link if not present
    if (!document.querySelector('.skip-nav')) {
        const skipNav = document.createElement('a');
        skipNav.href = '#main-content';
        skipNav.className = 'skip-nav';
        skipNav.textContent = 'Skip to main content';
        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    // Add ARIA roles to main content areas
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
    }

    // Add ARIA roles to navigation
    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
    }

    // Add ARIA roles to search
    const search = document.querySelector('.nav-search');
    if (search && !search.hasAttribute('role')) {
        search.setAttribute('role', 'search');
    }

    // Add ARIA roles to search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        if (!searchInput.hasAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search calculators');
        }
        if (!searchInput.hasAttribute('aria-expanded')) {
            searchInput.setAttribute('aria-expanded', 'false');
        }
        if (!searchInput.hasAttribute('aria-controls')) {
            searchInput.setAttribute('aria-controls', 'search-results');
        }
    }

    // Add ARIA roles to search results
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        if (!searchResults.hasAttribute('role')) {
            searchResults.setAttribute('role', 'listbox');
        }
        if (!searchResults.hasAttribute('aria-label')) {
            searchResults.setAttribute('aria-label', 'Search results');
        }
    }

    // Add ARIA roles to navigation links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.hasAttribute('role')) {
        navLinks.setAttribute('role', 'menubar');
    }

    // Add ARIA roles to navigation items
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        if (!item.hasAttribute('role')) {
            item.setAttribute('role', 'none');
        }
    });

    // Add ARIA roles to navigation links
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        if (!link.hasAttribute('role')) {
            link.setAttribute('role', 'menuitem');
        }
    });

    // Add ARIA roles to mobile menu button
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        if (!mobileMenuBtn.hasAttribute('aria-label')) {
            mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
        }
        if (!mobileMenuBtn.hasAttribute('aria-expanded')) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
        if (!mobileMenuBtn.hasAttribute('aria-controls')) {
            mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
        }
    }
}); 