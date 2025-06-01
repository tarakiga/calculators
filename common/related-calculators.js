function createRelatedCalculators(relatedCalculators) {
    const container = document.createElement('section');
    container.className = 'related-calculators';

    const heading = document.createElement('h2');
    heading.className = 'related-calculators-heading';
    heading.textContent = 'Related Calculators';
    container.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'related-calculators-grid';

    relatedCalculators.forEach(calc => {
        const card = document.createElement('article');
        card.className = 'related-calculator-card';

        const link = document.createElement('a');
        link.href = calc.url;
        link.className = 'related-calculator-link';

        const title = document.createElement('h3');
        title.className = 'related-calculator-title';
        title.textContent = calc.name;

        const description = document.createElement('p');
        description.className = 'related-calculator-description';
        description.textContent = calc.description;

        link.appendChild(title);
        link.appendChild(description);
        card.appendChild(link);
        grid.appendChild(card);
    });

    container.appendChild(grid);
    return container;
}

// Add styles for related calculators
const style = document.createElement('style');
style.textContent = `
    .related-calculators {
        margin: 2rem 0;
        padding: 1rem;
        background: var(--surface-alt);
        border-radius: var(--radius);
    }
    
    .related-calculators-heading {
        font-size: 1.25rem;
        color: var(--text);
        margin-bottom: 1rem;
    }
    
    .related-calculators-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .related-calculator-card {
        background: var(--surface);
        border-radius: var(--radius);
        padding: 1rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .related-calculator-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .related-calculator-link {
        text-decoration: none;
        color: inherit;
    }
    
    .related-calculator-title {
        font-size: 1rem;
        color: var(--primary);
        margin: 0 0 0.5rem 0;
    }
    
    .related-calculator-description {
        font-size: 0.875rem;
        color: var(--text-light);
        margin: 0;
    }
`;

document.head.appendChild(style);

// Export the function
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createRelatedCalculators };
} 