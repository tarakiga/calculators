// Keyboard Accessibility Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Handle keyboard navigation for calculator inputs
    const calculatorInputs = document.querySelectorAll('input[type="number"], input[type="text"], select');
    calculatorInputs.forEach(input => {
        // Add keyboard event listeners
        input.addEventListener('keydown', (e) => {
            // Allow Tab navigation
            if (e.key === 'Tab') return;

            // Handle Enter key for form submission
            if (e.key === 'Enter') {
                e.preventDefault();
                const form = input.closest('form');
                if (form) {
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton) submitButton.click();
                }
            }
        });

        // Add ARIA labels if missing
        if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                input.setAttribute('aria-label', label.textContent.trim());
            }
        }
    });

    // Handle keyboard navigation for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });

        // Add ARIA labels if missing
        if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
            const icon = button.querySelector('i, span[class*="icon"]');
            if (icon) {
                button.setAttribute('aria-label', icon.getAttribute('aria-label') || 'Button');
            }
        }
    });

    // Handle keyboard navigation for calculator results
    const resultElements = document.querySelectorAll('.calculator-result, .result-display');
    resultElements.forEach(result => {
        result.setAttribute('role', 'status');
        result.setAttribute('aria-live', 'polite');
    });

    // Handle keyboard navigation for tabs
    const tabButtons = document.querySelectorAll('[role="tab"]');
    tabButtons.forEach(tab => {
        tab.addEventListener('keydown', (e) => {
            const tabs = Array.from(tab.parentElement.children);
            const index = tabs.indexOf(tab);

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
                    prevTab.click();
                    prevTab.focus();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextTab = tabs[index + 1] || tabs[0];
                    nextTab.click();
                    nextTab.focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    tabs[0].click();
                    tabs[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    tabs[tabs.length - 1].click();
                    tabs[tabs.length - 1].focus();
                    break;
            }
        });
    });

    // Handle keyboard navigation for modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                const closeButton = modal.querySelector('[aria-label="Close"]');
                if (closeButton) closeButton.click();
            }
        });
    });
}); 