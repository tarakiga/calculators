// Premium Cookie Consent Banner & Modal (Flat, Clean Design)
(function() {
  // Banner & Modal HTML
  const bannerHTML = `
    <div id="cookie-banner" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col gap-4 transition-all shadow-none" role="dialog" aria-modal="true" aria-labelledby="cookie-banner-title" tabindex="-1" style="display:none;">
      <div class="flex items-center gap-3">
        <svg class="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h2 id="cookie-banner-title" class="text-lg font-semibold">🍪 Cookie Preferences</h2>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-200">
        We use cookies for essential site functions, analytics, and personalized ads. <a href="/pages/support/privacy.html#cookies" class="underline text-blue-600 dark:text-blue-400" target="_blank" rel="noopener">Learn more</a>.
      </p>
      <form id="cookie-form" class="flex flex-col gap-2" aria-label="Cookie Preferences">
        <label class="flex items-center gap-2">
          <input type="checkbox" checked disabled class="accent-blue-600" aria-checked="true" aria-disabled="true" />
          <span class="text-sm">Essential Cookies (Always Active)</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" id="analytics-cookies" class="accent-blue-600" aria-checked="true" />
          <span class="text-sm">Analytics Cookies</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" id="ad-cookies" class="accent-blue-600" aria-checked="true" />
          <span class="text-sm">Advertising Cookies</span>
        </label>
      </form>
      <div class="flex flex-wrap gap-2 justify-end mt-2">
        <button id="cookie-reject" class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-none">Reject All</button>
        <button id="cookie-customize" class="px-4 py-2 rounded-lg bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-none">Customize</button>
        <button id="cookie-accept" class="px-4 py-2 rounded-lg bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold shadow-none">Accept All</button>
      </div>
    </div>
    <div id="cookie-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-all" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" tabindex="-1">
      <div class="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-8 relative border border-gray-200 dark:border-gray-700 shadow-none">
        <button id="cookie-modal-close" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h2 id="cookie-modal-title" class="text-xl font-bold mb-4">Customize Cookie Preferences</h2>
        <form id="cookie-modal-form" class="flex flex-col gap-4">
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked disabled class="accent-blue-600" aria-checked="true" aria-disabled="true" />
              <span class="font-medium">Essential Cookies</span>
            </label>
            <p class="text-xs text-gray-500 ml-7">Required for site functionality. Always active.</p>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" id="modal-analytics-cookies" class="accent-blue-600" />
              <span class="font-medium">Analytics Cookies</span>
            </label>
            <p class="text-xs text-gray-500 ml-7">Help us understand usage patterns (Google Analytics, anonymized).</p>
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" id="modal-ad-cookies" class="accent-blue-600" />
              <span class="font-medium">Advertising Cookies</span>
            </label>
            <p class="text-xs text-gray-500 ml-7">Enable personalized ads (Google Ads, see <a href="https://policies.google.com/technologies/ads" target="_blank" class="underline">details</a>).</p>
          </div>
          <div class="flex gap-2 justify-end mt-2">
            <button type="button" id="cookie-modal-save" class="px-4 py-2 rounded-lg bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-none">Save Preferences</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Inject HTML on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = bannerHTML;
    document.body.appendChild(wrapper);
    setupCookieBanner();
  });

  function setConsent(consent) {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
  }
  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem('cookieConsent'));
    } catch { return null; }
  }
  function showBanner() {
    document.getElementById('cookie-banner').style.display = '';
    document.getElementById('cookie-banner').focus();
  }
  function hideBanner() {
    document.getElementById('cookie-banner').style.display = 'none';
  }
  function showModal() {
    document.getElementById('cookie-modal').style.display = 'flex';
    document.getElementById('cookie-modal').focus();
    document.getElementById('modal-analytics-cookies').checked = document.getElementById('analytics-cookies').checked;
    document.getElementById('modal-ad-cookies').checked = document.getElementById('ad-cookies').checked;
  }
  function hideModal() {
    document.getElementById('cookie-modal').style.display = 'none';
  }
  function updateBannerFromConsent(consent) {
    document.getElementById('analytics-cookies').checked = !!consent.analytics;
    document.getElementById('ad-cookies').checked = !!consent.ads;
  }

  function setupCookieBanner() {
    var consent = getConsent();
    if (!consent) showBanner();
    else updateBannerFromConsent(consent);

    document.getElementById('cookie-accept').onclick = function() {
      setConsent({ analytics: true, ads: true });
      hideBanner();
    };
    document.getElementById('cookie-reject').onclick = function() {
      setConsent({ analytics: false, ads: false });
      hideBanner();
    };
    document.getElementById('cookie-customize').onclick = function() {
      showModal();
    };
    document.getElementById('cookie-modal-close').onclick = hideModal;
    document.getElementById('cookie-modal-save').onclick = function() {
      var analytics = document.getElementById('modal-analytics-cookies').checked;
      var ads = document.getElementById('modal-ad-cookies').checked;
      setConsent({ analytics, ads });
      updateBannerFromConsent({ analytics, ads });
      hideModal();
      hideBanner();
    };
    document.getElementById('analytics-cookies').onchange = function(e) {
      document.getElementById('modal-analytics-cookies').checked = e.target.checked;
    };
    document.getElementById('ad-cookies').onchange = function(e) {
      document.getElementById('modal-ad-cookies').checked = e.target.checked;
    };
    // Accessibility: trap focus in modal
    document.getElementById('cookie-modal').addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        const focusable = this.querySelectorAll('button, [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
      if (e.key === 'Escape') hideModal();
    });
    document.getElementById('cookie-banner').addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        const focusable = this.querySelectorAll('button, [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
      if (e.key === 'Escape') hideBanner();
    });
  }
})(); 