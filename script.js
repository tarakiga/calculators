// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Handle dropdowns on mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Initialize converter
    initializeConverter();
});

function initializeConverter() {
    const converterSelect = document.getElementById('converterSelect');
    console.log('Initializing converter with select element:', converterSelect);

    // Only proceed if we have the required elements
    if (!converterSelect) {
        console.error('Required elements not found. Check your HTML structure.');
        return;
    }

    const tabContents = document.querySelectorAll('.tab-content');
    console.log('Found tab contents:', tabContents.length);

    function updateContent() {
        const currentValue = converterSelect.value;
        console.log('Updating content for selection:', currentValue);

        // Hide all content sections
        tabContents.forEach(content => {
            content.classList.remove('active');
            console.log('Removing active class from:', content.id);
        });

        // Show selected content
        const selectedContent = document.getElementById(currentValue);
        console.log('Selected content element:', selectedContent);

        if (selectedContent) {
            selectedContent.classList.add('active');
            console.log('Added active class to:', currentValue);

            // If switching to currency, trigger conversion
            if (currentValue === 'currency') {
                setTimeout(updateCurrencyConversion, 100);
            }
        }
    }

    // Set up event listeners
    converterSelect.addEventListener('change', function (e) {
        console.log('Select changed to:', e.target.value);
        updateContent();
    });

    // Show initial content
    updateContent();

    // Set up conversion listeners for all inputs
    setupConverters();
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
        stone: 6350293.18,
        ustons: 907184740,
        imperialtons: 1016046908.8
    },
    area: {
        sqmm: 1,
        sqcm: 100,
        sqm: 1000000,
        sqkm: 1000000000000,
        acres: 4046856422.4,
        hectares: 10000000000,
        sqin: 645.16,
        sqft: 92903.04,
        sqyd: 836127.36,
        sqmiles: 2589988110336
    },
    volume: {
        ml: 1,
        l: 1000,
        cubicm: 1000000,
        cubicin: 16.387064,
        cubicft: 28316.846592,
        cubicyd: 764554.857984,
        usgal: 3785.411784,
        impgal: 4546.09,
        quarts: 946.352946,
        pints: 473.176473,
        cups: 236.588236
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
        ounces: 29.5735,
        grams: 1,
        milliliters: 1
    }
};

// Temperature conversion functions (special case due to non-linear conversions)
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

// Time conversion (special case due to varying month lengths)
const timeConverters = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2629746, // Average month (30.44 days)
    years: 31556952 // Average year (365.24 days)
};

function setupConverters() {
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

    // Set up currency converter
    setupCurrencyConverter();
}

function convert(value, fromUnit, category) {
    const inputs = document.querySelectorAll(`#${category} input`);

    // Special handling for temperature
    if (category === 'temperature') {
        convertTemperature(value, fromUnit, inputs);
        return;
    }

    // Special handling for time
    if (category === 'time') {
        convertTime(value, fromUnit, inputs);
        return;
    }

    // Special handling for fuel consumption
    if (category === 'fuel') {
        convertFuel(value, fromUnit, inputs);
        return;
    }

    // Handle regular conversions
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

function clearInputs(category, exceptInput) {
    document.querySelectorAll(`#${category} input`).forEach(input => {
        if (input !== exceptInput) {
            input.value = '';
        }
    });
}

// Debounce function to limit the rate of conversions
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

// Currency converter functionality
let exchangeRates = {};
let lastUpdateTime = null;

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        if (data.rates) {
            exchangeRates = data.rates;
            lastUpdateTime = new Date();
            updateCurrencySelects();
            updateLastUpdateTime();
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        document.getElementById('currencyResult').textContent = 'Error fetching rates. Please try again later.';
    }
}

function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdate');
    if (element && lastUpdateTime) {
        element.textContent = lastUpdateTime.toLocaleString();
    }
}

function updateCurrencySelects() {
    const selects = document.querySelectorAll('.currency-select');
    const currencies = Object.keys(exchangeRates).sort();

    selects.forEach(select => {
        // Set default values
        const defaultValue = select.id === 'fromCurrency' ? 'USD' : 'EUR';

        select.innerHTML = currencies.map(currency =>
            `<option value="${currency}" ${currency === defaultValue ? 'selected' : ''}>
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
        // Add more common currencies here
    };
    return currencyNames[code] || code;
}

function setupCurrencyConverter() {
    const amount = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const result = document.getElementById('currencyResult');

    if (amount && fromCurrency && toCurrency) {
        [amount, fromCurrency, toCurrency].forEach(element => {
            element.addEventListener('input', updateCurrencyConversion);
        });

        // Initial fetch
        fetchExchangeRates();

        // Update rates every 30 minutes
        setInterval(fetchExchangeRates, 1800000);
    }
}

function updateCurrencyConversion() {
    const amount = parseFloat(document.getElementById('amount')?.value || '0');
    const fromCurrency = document.getElementById('fromCurrency')?.value;
    const toCurrency = document.getElementById('toCurrency')?.value;
    const result = document.getElementById('currencyResult');

    if (!result || isNaN(amount) || !fromCurrency || !toCurrency) {
        if (result) result.textContent = '0.00';
        return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        result.textContent = 'Currency rate not available';
        return;
    }

    // Convert through USD as base currency
    const toUSD = amount / exchangeRates[fromCurrency];
    const finalAmount = toUSD * exchangeRates[toCurrency];

    result.textContent = finalAmount.toFixed(2);
}