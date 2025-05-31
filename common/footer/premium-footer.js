// Premium Footer System JavaScript for Docket.One
// Updated to use PHP backend for form submissions

function newsletterForm() {
    return {
        email: '',
        isSubmitting: false,
        showSuccess: false,
        showError: false,
        errorMessage: '',

        async submitNewsletter() {
            if (!this.email) return;
            
            this.isSubmitting = true;
            this.showError = false;
            
            try {
                const response = await fetch('/newsletter-handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: this.email,
                        timestamp: new Date().toISOString(),
                        source: 'footer_newsletter'
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    this.showSuccess = true;
                    this.email = '';
                    
                    // Auto-hide success message after 5 seconds
                    setTimeout(() => {
                        this.showSuccess = false;
                    }, 5000);
                } else {
                    throw new Error(result.error || 'Failed to subscribe');
                }

            } catch (error) {
                console.error('Newsletter subscription failed:', error);
                this.errorMessage = error.message;
                this.showError = true;
                
                // Auto-hide error message after 5 seconds
                setTimeout(() => {
                    this.showError = false;
                }, 5000);
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}

function calculatorRequestForm() {
    return {
        showConfirmation: false,
        isSubmitting: false,
        showError: false,
        errorMessage: '',
        formData: {
            name: '',
            email: '',
            type: 'feature',  // Default to feature request
            title: '',
            description: '',
            category: '',
            priority: 'medium',
            useCase: ''
        },

        closeModal() {
            // Close the modal by dispatching event
            this.$dispatch('close-modal');
            this.resetForm();
        },

        resetForm() {
            this.showConfirmation = false;
            this.isSubmitting = false;
            this.showError = false;
            this.errorMessage = '';
            this.formData = {
                name: '',
                email: '',
                type: 'feature',
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                useCase: ''
            };
        },

        async submitRequest() {
            if (!this.validateForm()) return;
            
            this.isSubmitting = true;
            this.showError = false;
            
            try {
                // Prepare form data for contact handler
                const contactData = {
                    firstName: this.formData.name,
                    email: this.formData.email,
                    type: this.formData.type,
                    subject: `Calculator Request: ${this.formData.title}`,
                    message: this.formatRequestMessage(),
                    calculator: this.formData.category,
                    priority: this.formData.priority,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                const response = await fetch('/contact-handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Show confirmation
                    this.showConfirmation = true;
                } else {
                    throw new Error(result.error || 'Failed to submit request');
                }

            } catch (error) {
                console.error('Request submission failed:', error);
                this.errorMessage = error.message;
                this.showError = true;
            } finally {
                this.isSubmitting = false;
            }
        },

        validateForm() {
            const required = ['name', 'email', 'type', 'title', 'description'];
            const missing = required.filter(field => !this.formData[field].trim());
            
            if (missing.length > 0) {
                this.errorMessage = `Please fill in: ${missing.join(', ')}`;
                this.showError = true;
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.formData.email)) {
                this.errorMessage = 'Please enter a valid email address';
                this.showError = true;
                return false;
            }
            
            return true;
        },

        formatRequestMessage() {
            let message = `CALCULATOR REQUEST DETAILS:\n\n`;
            message += `Request Type: ${this.formData.type}\n`;
            message += `Calculator Title: ${this.formData.title}\n`;
            message += `Preferred Category: ${this.formData.category || 'Not specified'}\n`;
            message += `Priority Level: ${this.formData.priority}\n\n`;
            message += `DESCRIPTION:\n${this.formData.description}\n\n`;
            
            if (this.formData.useCase) {
                message += `USE CASE / WHY IT'S NEEDED:\n${this.formData.useCase}\n\n`;
            }
            
            message += `---\nSubmitted via Calculator Request Form`;
            
            return message;
        }
    }
}

// Global event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Close modal event listener
    document.addEventListener('close-modal', function() {
        // Find the Alpine component with showModal and set it to false
        const body = document.querySelector('body');
        if (body && body._x_dataStack) {
            body._x_dataStack[0].showModal = false;
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const body = document.querySelector('body');
            if (body && body._x_dataStack && body._x_dataStack[0].showModal) {
                body._x_dataStack[0].showModal = false;
            }
        }
    });
});

// Utility function to show status messages
function showGlobalMessage(message, type = 'info') {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles if not already added
    if (!document.querySelector('#global-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'global-notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
