// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Mobile gesture animations
function setupMobileGestures() {
    let startY = 0;
    let currentY = 0;

    document.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', function (e) {
        currentY = e.touches[0].clientY;
        const diff = startY - currentY;

        // Add subtle parallax effect to hero background
        const hero = document.querySelector('.hero');
        if (hero && Math.abs(diff) > 10) {
            hero.style.transform = `translateY(${diff * 0.1}px)`;
        }
    });

    document.addEventListener('touchend', function () {
        // Reset hero transform
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = 'translateY(0)';
        }
    });
}

// Fetch and display blog posts
function fetchBlogPosts() {
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) return;

    // Show loading state
    blogContainer.innerHTML = Array(3).fill(`
        <div class="blog-card loading">
            <div class="blog-image loading-shimmer"></div>
            <div class="blog-content">
                <div class="blog-title loading-shimmer"></div>
                <div class="blog-date loading-shimmer"></div>
            </div>
        </div>
    `).join('');

    fetch('https://blog.docket.one/wp-json/wp/v2/posts?_embed&per_page=3')
        .then(response => response.json())
        .then(posts => {
            blogContainer.innerHTML = posts.map(post => `
                <a href="${post.link}" class="blog-card" target="_blank" rel="noopener noreferrer">
                    <div class="blog-image" style="--blog-image: url('${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/600x400'}')"></div>
                    <div class="blog-content">
                        <h3 class="blog-title">${post.title.rendered}</h3>
                        <p class="blog-date">${new Date(post.date).toLocaleDateString()}</p>
                    </div>
                </a>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            blogContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load blog posts. Please try again later.</p>
                </div>
            `;
        });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create floating particles
    createParticles();

    // Setup smooth scrolling
    setupSmoothScrolling();

    // Setup mobile gestures
    setupMobileGestures();

    // Fetch blog posts
    fetchBlogPosts();

    // Set up listeners for all input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', debounce(function (e) {
            const value = parseFloat(e.target.value);
            const unit = e.target.getAttribute('data-unit');
            const parentTab = e.target.closest('.tab-content')?.id;

            if (!parentTab || isNaN(value)) {
                if (parentTab) clearInputs(parentTab, e.target);
                return;
            }

            convert(value, unit, parentTab);
        }, 100));
    });

    // Initialize mobile menu functionality
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}); 