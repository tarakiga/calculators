// This script will be included in all calculator pages
document.addEventListener('DOMContentLoaded', () => {
    // Add the breadcrumb script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/common/init-breadcrumbs.js';
    document.head.appendChild(script);
}); 