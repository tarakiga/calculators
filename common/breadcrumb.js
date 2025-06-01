export function createBreadcrumb(breadcrumbs) {
    const breadcrumbContainer = document.createElement('nav');
    breadcrumbContainer.setAttribute('aria-label', 'breadcrumb');
    breadcrumbContainer.className = 'breadcrumb-nav';

    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb-list';

    breadcrumbs.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'breadcrumb-item';

        if (index === breadcrumbs.length - 1) {
            // Current page
            listItem.setAttribute('aria-current', 'page');
            listItem.textContent = item.name;
        } else {
            // Link to other pages
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            listItem.appendChild(link);
        }

        breadcrumbList.appendChild(listItem);
    });

    breadcrumbContainer.appendChild(breadcrumbList);
    return breadcrumbContainer;
}

// Add styles for breadcrumbs
const style = document.createElement('style');
style.textContent = `
    .breadcrumb-nav {
        padding: 0.5rem 0 0.5rem 2rem;
        margin: 0;
    }
    
    .breadcrumb-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    
    .breadcrumb-item {
        display: flex;
        align-items: center;
        color: var(--text-light);
        font-size: 0.875rem;
    }
    
    .breadcrumb-item:not(:last-child)::after {
        content: '/';
        margin: 0 0.5rem;
        color: var(--text-muted);
    }
    
    .breadcrumb-item a {
        color: var(--primary);
        text-decoration: none;
    }
    
    .breadcrumb-item a:hover {
        text-decoration: underline;
    }
    
    .breadcrumb-item[aria-current="page"] {
        color: var(--text);
        font-weight: 500;
    }
`;

document.head.appendChild(style);

// Export the function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createBreadcrumb };
} 