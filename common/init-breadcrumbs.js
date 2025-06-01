// Import the breadcrumb component
import { createBreadcrumb } from './breadcrumb.js';

// Function to get the current page's breadcrumb data
function getBreadcrumbData() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment && segment !== 'pages');

    // Remove .html extension from the last segment
    const lastSegment = segments[segments.length - 1].replace('.html', '');
    segments[segments.length - 1] = lastSegment;

    // Create breadcrumb items
    const breadcrumbs = [
        { name: 'Home', url: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
        currentPath += '/' + segment;
        const name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        if (index === segments.length - 1) {
            breadcrumbs.push({ name, url: currentPath + '.html' });
        } else {
            breadcrumbs.push({ name, url: currentPath });
        }
    });

    return breadcrumbs;
}

// Initialize breadcrumbs when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const breadcrumbs = getBreadcrumbData();
    const breadcrumbNav = createBreadcrumb(breadcrumbs);
    const hero = document.querySelector('.hero');
    if (hero) {
        document.body.insertBefore(breadcrumbNav, hero);
    }
}); 