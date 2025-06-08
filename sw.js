// Service Worker with Enhanced Cache Management
const CACHE_VERSION = 'v2'; // Update this with each deployment
const CACHE_NAME = `calculator-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Precached core assets
const STATIC_RESOURCES = [
  '/offline.html',
  '/common/navbar-enhanced.css',
  '/common/global-calculator.css',
  '/common/themes/dark-theme.css',
  '/styles/bigkid.css',
  '/images/logo.png'
];

// Installation - Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`[Service Worker] Caching core assets v${CACHE_VERSION}`);
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Removing old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[Service Worker] Activated v${CACHE_VERSION}`);
      return self.clients.claim();
    })
  );
});

// Fetch - Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin assets
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests separately
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For all other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Always fetch from network in background
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache if valid response
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {}); // Silent fail if offline

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});