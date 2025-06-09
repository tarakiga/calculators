// Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const numberOfParticles = 50;

            for (let i = 0; i < numberOfParticles; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random size
                const size = Math.random() * 4 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';

                // Random position
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';

                // Random animation delay
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';

                particlesContainer.appendChild(particle);
            }
        }

        // Conversion functions for each category
        const converters = {
            length: {
                mm: 1,
                cm: 10,
                meters: 1000,
                km: 1000000,
                inches: 25.4,
                feet: 304.8,
                yards: 914.4,
                miles: 1609344
            },
            weight: {
                mg: 1,
                g: 1000,
                kg: 1000000,
                tonnes: 1000000000,
                ounces: 28349.523125,
                pounds: 453592.37,
                stone: 6350293.18
            },
            area: {
                sqmm: 1,
                sqcm: 100,
                sqm: 1000000,
                sqkm: 1000000000000,
                sqin: 645.16,
                sqft: 92903.04,
                sqyd: 836127.36,
                acres: 4046856422.4,
                hectares: 10000000000
            },
            volume: {
                ml: 1,
                l: 1000,
                cubicm: 1000000,
                cubicin: 16.387064,
                cubicft: 28316.846592,
                usgal: 3785.411784,
                impgal: 4546.09,
                quarts: 946.352946,
                pints: 473.176473
            },
            speed: {
                mps: 1,
                kph: 0.277778,
                mph: 0.44704,
                knots: 0.514444,
                fps: 0.3048
            },
            data: {
                bits: 1,
                bytes: 8,
                kb: 8192,
                mb: 8388608,
                gb: 8589934592,
                tb: 8796093022208
            },
            energy: {
                joules: 1,
                kilojoules: 1000,
                calories: 4.184,
                kilocalories: 4184,
                btu: 1055.06,
                kwh: 3600000
            },
            power: {
                watts: 1,
                kilowatts: 1000,
                horsepower: 745.7
            },
            pressure: {
                pascals: 1,
                kilopascals: 1000,
                bar: 100000,
                psi: 6894.76,
                atmosphere: 101325
            },
            angle: {
                degrees: 1,
                radians: 57.2958,
                gradians: 0.9
            },
            density: {
                kgm3: 1,
                gcm3: 1000,
                lbft3: 16.0185
            },
            cooking: {
                cups: 236.588,
                tablespoons: 14.7868,
                teaspoons: 4.92892,
                fluidounces: 29.5735,
                milliliters: 1,
                grams: 1
            }
        };

        // Temperature conversion functions
        const temperatureConverters = {
            celsius: {
                fahrenheit: (c) => (c * 9 / 5) + 32,
                kelvin: (c) => c + 273.15,
                rankine: (c) => (c + 273.15) * 9 / 5
            },
            fahrenheit: {
                celsius: (f) => (f - 32) * 5 / 9,
                kelvin: (f) => (f - 32) * 5 / 9 + 273.15,
                rankine: (f) => f + 459.67
            },
            kelvin: {
                celsius: (k) => k - 273.15,
                fahrenheit: (k) => (k * 9 / 5) - 459.67,
                rankine: (k) => k * 9 / 5
            },
            rankine: {
                celsius: (r) => (r - 491.67) * 5 / 9,
                fahrenheit: (r) => r - 459.67,
                kelvin: (r) => r * 5 / 9
            }
        };

        // Time conversion
        const timeConverters = {
            seconds: 1,
            minutes: 60,
            hours: 3600,
            days: 86400,
            weeks: 604800,
            months: 2629746,
            years: 31556952
        };

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function clearInputs(category, sourceInput) {
            document.querySelectorAll(`#${category} input`).forEach(input => {
                if (input !== sourceInput) {
                    input.value = '';
                }
            });
        }

        function convert(value, fromUnit, category) {
            const inputs = document.querySelectorAll(`#${category} input`);

            if (category === 'temperature') {
                convertTemperature(value, fromUnit, inputs);
                return;
            }

            if (category === 'time') {
                convertTime(value, fromUnit, inputs);
                return;
            }

            if (category === 'fuel') {
                convertFuel(value, fromUnit, inputs);
                return;
            }

            const converter = converters[category];
            if (!converter) return;

            const baseValue = value * converter[fromUnit];

            inputs.forEach(input => {
                if (input.getAttribute('data-unit') !== fromUnit) {
                    const targetUnit = input.getAttribute('data-unit');
                    input.value = (baseValue / converter[targetUnit]).toFixed(8);
                }
            });
        }

        function convertTemperature(value, fromUnit, inputs) {
            inputs.forEach(input => {
                const targetUnit = input.getAttribute('data-unit');
                if (targetUnit !== fromUnit) {
                    input.value = temperatureConverters[fromUnit][targetUnit](value).toFixed(4);
                }
            });
        }

        function convertTime(value, fromUnit, inputs) {
            const baseSeconds = value * timeConverters[fromUnit];

            inputs.forEach(input => {
                const targetUnit = input.getAttribute('data-unit');
                if (targetUnit !== fromUnit) {
                    input.value = (baseSeconds / timeConverters[targetUnit]).toFixed(4);
                }
            });
        }

        function convertFuel(value, fromUnit, inputs) {
            const mpgToL100km = (mpg) => 235.215 / mpg;
            const l100kmToMpg = (l100km) => 235.215 / l100km;
            const kmlToMpg = (kml) => kml * 2.352;
            const mpgToKml = (mpg) => mpg / 2.352;
            const kmlToL100km = (kml) => 100 / kml;
            const l100kmToKml = (l100km) => 100 / l100km;

            inputs.forEach(input => {
                const targetUnit = input.getAttribute('data-unit');
                if (targetUnit === fromUnit) return;

                let result;
                if (fromUnit === 'mpg') {
                    if (targetUnit === 'l100km') result = mpgToL100km(value);
                    else if (targetUnit === 'kml') result = mpgToKml(value);
                } else if (fromUnit === 'l100km') {
                    if (targetUnit === 'mpg') result = l100kmToMpg(value);
                    else if (targetUnit === 'kml') result = l100kmToKml(value);
                } else if (fromUnit === 'kml') {
                    if (targetUnit === 'mpg') result = kmlToMpg(value);
                    else if (targetUnit === 'l100km') result = kmlToL100km(value);
                }

                input.value = result.toFixed(4);
            });
        }

        // Currency converter functionality
        let exchangeRates = {};
        let lastUpdateTime = null;
        let ratesLoaded = false;

        async function fetchExchangeRates() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();

                if (data.rates) {
                    exchangeRates = { ...data.rates, USD: 1 }; // Include USD as base
                    lastUpdateTime = new Date();
                    ratesLoaded = true;
                    updateCurrencySelects();
                    updateLastUpdateTime();
                    updateCurrencyConversion(); // Trigger conversion after rates load
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                // Fallback to basic rates if API fails
                exchangeRates = {
                    USD: 1,
                    EUR: 0.85,
                    GBP: 0.73,
                    JPY: 110,
                    AUD: 1.35,
                    CAD: 1.25,
                    CHF: 0.92,
                    CNY: 6.45
                };
                ratesLoaded = true;
                updateCurrencySelects();
                const result = document.getElementById('currencyResult');
                if (result) {
                    result.textContent = 'Using offline rates - limited currencies available';
                }
            }
        }

        function updateCurrencySelects() {
            const selects = document.querySelectorAll('.currency-select');
            if (!selects.length || !ratesLoaded) return;

            const currencies = Object.keys(exchangeRates).sort();

            selects.forEach(select => {
                const currentValue = select.value;
                const defaultValue = select.id === 'fromCurrency' ? 'USD' : 'EUR';

                select.innerHTML = currencies.map(currency =>
                    `<option value="${currency}" ${currency === (currentValue || defaultValue) ? 'selected' : ''}>
                    ${currency} - ${getCurrencyName(currency)}
                </option>`
                ).join('');
            });
        }

        function getCurrencyName(code) {
            const currencyNames = {
                USD: 'US Dollar',
                EUR: 'Euro',
                GBP: 'British Pound',
                JPY: 'Japanese Yen',
                AUD: 'Australian Dollar',
                CAD: 'Canadian Dollar',
                CHF: 'Swiss Franc',
                CNY: 'Chinese Yuan',
                INR: 'Indian Rupee',
            };
            return currencyNames[code] || code;
        }

        function updateLastUpdateTime() {
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement && lastUpdateTime) {
                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                lastUpdateElement.textContent = lastUpdateTime.toLocaleString(undefined, options);
            }
        }

        function setupCurrencyConverter() {
            // Initial fetch
            fetchExchangeRates();

            // Update rates every 30 minutes
            setInterval(fetchExchangeRates, 1800000);

            // Set up event listeners with delay to ensure elements exist
            setTimeout(() => {
                const amount = document.getElementById('amount');
                const fromCurrency = document.getElementById('fromCurrency');
                const toCurrency = document.getElementById('toCurrency');

                if (amount && fromCurrency && toCurrency) {
                    // Use shorter debounce for instant feel
                    amount.addEventListener('input', debounce(updateCurrencyConversion, 100));
                    fromCurrency.addEventListener('change', updateCurrencyConversion);
                    toCurrency.addEventListener('change', updateCurrencyConversion);

                    // Set default values
                    amount.value = '1';

                    // Force initial conversion display
                    setTimeout(() => {
                        const result = document.getElementById('currencyResult');
                        if (result && result.textContent === '0.00') {
                            result.textContent = '0.85'; // EUR default for 1 USD
                        }
                    }, 200);

                    // Trigger initial conversion once rates are loaded
                    if (ratesLoaded) {
                        updateCurrencyConversion();
                    }
                }
            }, 100);
        }

        function updateCurrencyConversion() {
            const amountInput = document.getElementById('amount');
            const fromCurrencySelect = document.getElementById('fromCurrency');
            const toCurrencySelect = document.getElementById('toCurrency');
            const result = document.getElementById('currencyResult');

            if (!amountInput || !fromCurrencySelect || !toCurrencySelect || !result) {
                return;
            }

            if (!ratesLoaded) {
                result.textContent = 'Loading rates...';
                return;
            }

            const amount = parseFloat(amountInput.value || '0');
            const fromCurrency = fromCurrencySelect.value;
            const toCurrency = toCurrencySelect.value;

            if (isNaN(amount) || amount === 0) {
                result.textContent = '0.00';
                return;
            }

            if (!fromCurrency || !toCurrency) {
                result.textContent = 'Select currencies';
                return;
            }

            if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
                result.textContent = 'Currency not available';
                return;
            }

            // Convert through USD as base currency
            let convertedAmount;
            if (fromCurrency === toCurrency) {
                convertedAmount = amount;
            } else if (fromCurrency === 'USD') {
                convertedAmount = amount * exchangeRates[toCurrency];
            } else if (toCurrency === 'USD') {
                convertedAmount = amount / exchangeRates[fromCurrency];
            } else {
                // Convert from source currency to USD, then to target currency
                const usdAmount = amount / exchangeRates[fromCurrency];
                convertedAmount = usdAmount * exchangeRates[toCurrency];
            }

            // Format the result with proper decimal places
            result.textContent = convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: convertedAmount < 1 ? 6 : 2
            });
        }

        // Newsletter form functionality
        function newsletterForm() {
            return {
                email: '',
                isSubmitting: false,
                showSuccess: false,
                async submitNewsletter() {
                    if (!this.email) return;

                    this.isSubmitting = true;

                    try {
                        console.log('Submitting newsletter subscription for:', this.email);

                        const response = await fetch('newsletter-handler.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: this.email,
                                source: 'homepage_newsletter'
                            })
                        });

                        console.log('Newsletter response status:', response.status);
                        const result = await response.json();
                        console.log('Newsletter response data:', result);

                        if (response.ok && result.success) {
                            this.showSuccess = true;
                            this.email = '';

                            setTimeout(() => {
                                this.showSuccess = false;
                            }, 5000);
                        } else {
                            throw new Error(result.error || `Server returned ${response.status}`);
                        }
                    } catch (error) {
                        console.error('Newsletter subscription error:', error);
                        alert(`Newsletter subscription failed: ${error.message}\n\nPlease check the browser console for more details.`);
                    } finally {
                        this.isSubmitting = false;
                    }
                }
            }
        }


        body: JSON.stringify({
            firstName: this.formData.name,
            lastName: '',
            email: this.formData.email,
            subject: this.formData.title,
            message: this.formData.description,
            type: 'feature',
            calculator: this.formData.type,
            priority: 'medium',
            source: 'homepage_calculator_request'
        })
                    });

        console.log('Calculator request response status:', response.status);
        const result = await response.json();
        console.log('Calculator request response data:', result);

        if (response.ok && result.success) {
            this.showConfirmation = true;

            // Reset form
            this.formData = {
                name: '',
                email: '',
                type: '',
                title: '',
                description: ''
            };
        } else {
            throw new Error(result.error || `Server returned ${response.status}`);
        }
                } catch (error) {
            console.error('Calculator request error:', error);
            alert(`Calculator request failed: ${error.message}\n\nPlease check the browser console for more details.`);
        } finally {
            this.isSubmitting = false;
        }
            },
        closeModal() {
            // Close the modal by setting showModal to false on the body context
            this.$root.showModal = false;
            this.showConfirmation = false;
        }
        }
    }

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

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Create floating particles
            createParticles();

            // Setup smooth scrolling
            setupSmoothScrolling();

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
			
			// Initialize converter select with mobile support
    const converterSelect = document.getElementById('converterSelect');
    if (converterSelect) {
        function handleConverterChange() {
            const selectedValue = this.value;
            const tabContents = document.querySelectorAll('.tab-content');
            
            // Hide all tab contents
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            const selectedTab = document.getElementById(selectedValue);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Force mobile browsers to redraw
            if ('ontouchstart' in window) {
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }
        }

        converterSelect.addEventListener('change', handleConverterChange);
        
        // Special handling for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            converterSelect.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.focus();
            }, {passive: false});
        }
    }
			// Initialize converter select
    const converterSelect = document.getElementById('converterSelect');
    if (converterSelect) {
        converterSelect.addEventListener('change', handleConverterChange);
        
        // Special handling for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            converterSelect.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.focus();
            }, {passive: false});
        }
        });

        // Add some gesture animations for mobile
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

        // Fetch and display blog posts
        async function fetchBlogPosts() async function fetchBlogPosts() {
            console.log("fetchBlogPosts() executing!");
            const blogPostsContainer = document.getElementById('blog-posts');
            if (!blogPostsContainer) return;

            // Show loading state
            blogPostsContainer.innerHTML = `
        <div class="blog-card loading">
            <div class="blog-image loading-shimmer"></div>
            <div class="blog-content">
                <div class="blog-title loading-shimmer" style="height: 24px; width: 80%;"></div>
                <div class="blog-date loading-shimmer" style="height: 16px; width: 40%;"></div>
            </div>
        </div>
        <div class="blog-card loading">
            <div class="blog-image loading-shimmer"></div>
            <div class="blog-content">
                <div class="blog-title loading-shimmer" style="height: 24px; width: 80%;"></div>
                <div class="blog-date loading-shimmer" style="height: 16px; width: 40%;"></div>
            </div>
        </div>
        <div class="blog-card loading">
            <div class="blog-image loading-shimmer"></div>
            <div class="blog-content">
                <div class="blog-title loading-shimmer" style="height: 24px; width: 80%;"></div>
                <div class="blog-date loading-shimmer" style="height: 16px; width: 40%;"></div>
            </div>
        </div>
    `;

            try {
                const response = await fetch('https://blog.docket.one/wp-json/wp/v2/posts?_embed&per_page=3');

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const posts = await response.json();
                blogPostsContainer.innerHTML = posts.map(post => `
            <a href="${post.link}" class="blog-card" target="_blank" rel="noopener noreferrer">
                <div class="blog-image" 
                     style="background-image: url('${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/600x400'}')">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title.rendered}</h3>
                    <p class="blog-date">${new Date(post.date).toLocaleDateString()}</p>
                </div>
            </a>
        `).join('');

            } catch (error) {
                console.error('Blog fetch error:', error);
                blogPostsContainer.innerHTML = `
            <div class="error-message">
                Couldn't load posts. <a href="https://blog.docket.one" target="_blank">Visit our blog directly</a>.
            </div>
        `;
            }
        }

        // Fetch blog posts when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, fetching blog posts...');
            fetchBlogPosts();
        });