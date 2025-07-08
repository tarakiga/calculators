// Dynamic Footer Injector for Docket.One
// Injects the newsletter bar and footer at the end of <body> if not already present

class FooterInjector {
    constructor() {
        this.newsletterBarHTML = `<!-- Newsletter Bar - Injected -->\n<div class=\"newsletter-bar\" x-data=\"newsletterForm()\">\n    <div class=\"newsletter-container\">\n        <div class=\"newsletter-content\">\n            <div class=\"newsletter-info\">\n                <h3>&#127881; Join Our Calculator Community!</h3>\n                <p>Get updates on new fun calculators and practical tools</p>\n            </div>\n            <form class=\"newsletter-form\" @submit.prevent=\"submitNewsletter()\" x-show=\"!showSuccess\">\n                <input \
                    type=\"email\" \
                    class=\"newsletter-input\"\
                    placeholder=\"Enter your email for calculator updates\"\
                    x-model=\"email\"\
                    required\
                >\
                <button \
                    type=\"submit\" \
                    class=\"newsletter-submit\"\
                    :disabled=\"isSubmitting\"\
                >\
                    <span x-show=\"isSubmitting\" class=\"loading-spinner\"></span>\
                    <span x-text=\"isSubmitting ? 'Subscribing...' : '&#128640; Subscribe'\"></span>\
                </button>\
            </form>\
            <div x-show=\"showSuccess\" class=\"newsletter-success\" style=\"display: none;\">\
                <p style=\"color: var(--accent-light); font-weight: 600;\">\
                    &#9989; Awesome! You'll get updates on the coolest new calculators!\
                </p>\
            </div>\
        </div>\
    </div>\
</div>`;

        this.footerHTML = `<!-- Main Footer - Injected -->\n<footer class=\"footer\">\n    <div class=\"footer-container\">\n        <div class=\"footer-content\">\n            <div class=\"footer-section\">\n                <h4>&#127919; About Docket.One</h4>\n                <p>Making life easier (and more fun) with calculators that actually matter. From figuring out if you\
                    should buy a car or just Uber everywhere, to calculating your caffeine half-life, we've got the\
                    tools for modern life.</p>\
                <p>Practical meets playful. Because adulting is hard enough.</p>\
                <p><a href=\"https://docket.one/pages/support/about.html\" class=\"footer-about-link\" aria-label=\"About Docket.One\"><span class=\"calculator-emoji\">&#8505;</span> Learn more about us</a></p>\
            </div>\

            <div class=\"footer-section\">\
                <h4>&#127914; Calculator Categories</h4>\
                <ul class=\"footer-links\">\
                    <li><a href=\"https://docket.one/pages/BigKidMath/index.html\"><span class=\"calculator-emoji\">&#129518;</span>\
                            BigKidMath - Adult Life Tools</a></li>\
                    <li><a href=\"https://docket.one/pages/CipherLab/index.html\"><span class=\"calculator-emoji\">&#128272;</span>\
                            CipherLab - Secret Codes & Security</a></li>\
                    <li><a href=\"https://docket.one/pages/GeekGalaxy/index.html\"><span class=\"calculator-emoji\">&#128640;</span>\
                            GeekGalaxy - Sci-Fi & Fantasy Fun</a></li>\
                    <li><a href=\"https://docket.one/pages/LifeHacks/index.html\"><span class=\"calculator-emoji\">&#9889;</span>\
                            LifeHacks - Productivity & Wellness</a></li>\
                    <li><a href=\"https://docket.one/pages/Math_Magik/index.html\"><span class=\"calculator-emoji\">&#127917;</span>\
                            Math Magik - Mathematical Wizardry</a></li>\
                    <li><a href=\"https://docket.one/pages/Otaku_Ops/index.html\"><span class=\"calculator-emoji\">&#127999;</span>\
                            Otaku Ops - Anime & Culture</a></li>\
                </ul>\
            </div>\

            <div class=\"footer-section\">\
                <h4>&#128172; Support & Info</h4>\
                <ul class=\"footer-links\">
                    <li><a href=\"https://docket.one/pages/support/about.html\"><span class=\"calculator-emoji\">&#8505;</span> About Docket.One</a></li>\
                    <li><a href=\"https://docket.one/pages/support/help.html\"><span class=\"calculator-emoji\">&#10067;</span>\
                            Help &\
                            FAQ</a></li>\
                    <li><a href=\"https://docket.one/pages/support/privacy.html\"><span\
                                class=\"calculator-emoji\">&#128274;</span>\
                            Privacy Policy</a></li>\
                    <li><a href=\"https://docket.one/pages/support/terms.html\"><span class=\"calculator-emoji\">&#128203;</span>\
                            Terms of\
                            Service</a></li>\
                    <li><a href=\"https://docket.one/pages/support/accessibility.html\"><span\
                                class=\"calculator-emoji\">&#9855;</span>\
                            Accessibility</a></li>\
                    <li><a href=\"https://docket.one/pages/support/contact.html\"><span\
                                class=\"calculator-emoji\">&#128231;</span>\
                            Contact Us</a></li>\
                    <li><a href=\"https://docket.one/pages/support/contact.html#support\"><span\
                                class=\"calculator-emoji\">&#128075;</span> Get\
                            Support</a></li>\
                    <li><a href=\"https://docket.one/pages/support/contact.html#bug\"><span\
                                class=\"calculator-emoji\">&#128027;</span>\
                            Report Bug</a></li>\
                    <li><a href=\"https://docket.one/pages/support/contact.html#feature\"><span\
                                class=\"calculator-emoji\">&#128161;</span>\
                            Request Calculator</a></li>\
                </ul>\
            </div>\
        </div>\

        <div class=\"footer-bottom\">\
            <div class=\"footer-logo\">&#129518; Docket.One</div>\
            <div class=\"footer-copyright\">\
                © 2025 Docket.One. All rights reserved. Making calculations fun since... well, recently!\
            </div>\
            <div class=\"social-links\">\
                <a href=\"#\" class=\"social-link\" aria-label=\"Twitter\">𝕏</a>\
                <a href=\"#\" class=\"social-link\" aria-label=\"LinkedIn\">&#128188;</a>\
                <a href=\"#\" class=\"social-link\" aria-label=\"GitHub\">&#128025;</a>\
                <a href=\"https://docket.one/pages/support/contact.html#business\" class=\"social-link\"\
                    aria-label=\"Contact\">&#128231;</a>\
            </div>\
        </div>\
    </div>\
</footer>`;
    }

    inject() {
        if (document.querySelector('.footer')) {
            console.log('[FooterInjector] Footer already present, skipping injection.');
            return;
        }
        // Inject newsletter bar before footer
        document.body.insertAdjacentHTML('beforeend', this.newsletterBarHTML);
        document.body.insertAdjacentHTML('beforeend', this.footerHTML);
        console.log('[FooterInjector] Footer and newsletter bar injected.');
    }
}

// Auto-inject on DOMContentLoaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const injector = new FooterInjector();
        injector.inject();
    });
} 