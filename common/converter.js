// Initialize converter functionality
function initializeConverter() {
    const converterSelect = document.getElementById('converterSelect');

    // Only proceed if we have the required elements
    if (!converterSelect) {
        console.error('Required elements not found. Check your HTML structure.');
        return;
    }

    const tabContents = document.querySelectorAll('.tab-content');

    function updateContent() {
        // Hide all content sections
        tabContents.forEach(content => content.classList.remove('active'));

        // Show selected content
        const selectedTab = converterSelect.value;
        const selectedContent = document.getElementById(selectedTab);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
    }

    // Set up event listeners
    converterSelect.addEventListener('change', updateContent);

    // Show initial content
    updateContent();

    // Set up conversion listeners for all inputs
    setupConverters();
}

// Wait for DOM to be fully loaded before running any code
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConverter);
} else {
    initializeConverter();
} 