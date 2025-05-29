// Navbar HTML template
const navbarHTML = `
<nav class="main-nav">
    <div class="nav-container">
        <div class="nav-logo">
            <a href="index.html">Docket One</a>
        </div>
        <ul class="nav-links">
            <li class="dropdown">
                <a href="pages/bigKidMath/">Big Kid Math</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/bigKidMath/caffeincedHalfLife.html">Caffeine Half-Life</a></li>
                    <li><a href="pages/bigKidMath/generationalTimelineCalculator.html">Generational Timeline</a></li>
                    <li><a href="pages/bigKidMath/carVsUber.html">Car vs Uber</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="pages/cipherLab/">Cipher Lab</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/cipherLab/oghamTranslatorEncoderDecoder.html">Ogham Translator</a></li>
                    <li><a href="pages/cipherLab/morseCodeTranslatorEncoderDecoder.html">Morse Code Translator</a></li>
                    <li><a href="pages/cipherLab/passwordStrengthAngerScaleCalculator.html">Password Strength</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="pages/geekGalaxy/">Geek Galaxy</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/geekGalaxy/zombieApocalypseSurvivalCalculator.html">Zombie Survival</a></li>
                    <li><a href="pages/geekGalaxy/timeMachineParadoxDetector.html">Time Machine Paradox</a></li>
                    <li><a href="pages/geekGalaxy/spaceshipFuelCalculator.html">Spaceship Fuel</a></li>
                    <li><a href="pages/geekGalaxy/alienCommunicationProbabilityCalculator.html">Alien Communication</a></li>
                    <li><a href="pages/geekGalaxy/lightsaberBatteryLife.html">Lightsaber Battery</a></li>
                    <li><a href="pages/geekGalaxy/starTrekWarpSpeedConverter.html">Warp Speed</a></li>
                    <li><a href="pages/geekGalaxy/doomsdayCountdown.html">Doomsday Countdown</a></li>
                    <li><a href="pages/geekGalaxy/potionBrewer.html">Potion Brewer</a></li>
                    <li><a href="pages/geekGalaxy/spaceTravelTimeCalculator.html">Space Travel Time</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="pages/lifeHacks/">Life Hacks</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/lifeHacks/socialMediaAddictionCalculator.html">Social Media Addiction</a></li>
                    <li><a href="pages/lifeHacks/stressToIceCreamRatioCalculator.html">Stress-to-Ice-Cream</a></li>
                    <li><a href="pages/lifeHacks/timeIsMoneyCalculator.html">Time is Money</a></li>
                    <li><a href="pages/lifeHacks/coffeeToCodeEfficiencyRatioCalculator.html">Coffee to Code</a></li>
                    <li><a href="pages/lifeHacks/procrastinationRoiCalculator.html">Procrastination ROI</a></li>
                    <li><a href="pages/lifeHacks/inflationImpact.html">Inflation Impact</a></li>
                    <li><a href="pages/lifeHacks/sleepAnalyzer.html">Sleep Analyzer</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="pages/mathMagik/">Math Magik</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/mathMagik/pizzaPiCalculator.html">Pizza Pi</a></li>
                    <li><a href="pages/mathMagik/fireNumber.html">Fire Number</a></li>
                    <li><a href="pages/mathMagik/lifespanInWeeks.html">Lifespan in Weeks</a></li>
                    <li><a href="pages/mathMagik/chaosTheoryPendulum.html">Chaos Theory</a></li>
                    <li><a href="pages/mathMagik/entropyAndFeigenbaumsConstant.html">Entropy & Feigenbaum</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="pages/otakuOps/">Otaku Ops</a>
                <ul class="dropdown-menu">
                    <li><a href="pages/otakuOps/conspiracyTheoryPlausibilityIndex.html">Conspiracy Theory</a></li>
                    <li><a href="pages/otakuOps/animeTrainingMontagePlanner.html">Training Montage</a></li>
                    <li><a href="pages/otakuOps/minecraftStackOptimizer.html">Minecraft Stack</a></li>
                </ul>
            </li>
        </ul>
        <button class="mobile-menu-btn" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
`;

// Log the navbarHTML for debugging
console.log(navbarHTML);

// Function to inject navbar
function injectNavbar() {
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = navbarHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const navbar = temp.firstElementChild;

    // Insert navbar at the beginning of the body
    document.body.insertBefore(navbar, document.body.firstChild);

    // Log the links to ensure they are set up correctly
    const links = navbar.querySelectorAll('a');
    links.forEach(link => {
        console.log('Link:', link.href);
    });

    // Add mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Handle dropdowns
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown on click
        link.addEventListener('click', function (e) {
            e.preventDefault();
            dropdown.classList.toggle('active');

            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        });
    });

    // Mobile menu button click handler
    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close menus when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
}

// Inject navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', injectNavbar); 