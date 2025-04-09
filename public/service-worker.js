
// Service Worker for TwitPoster PWA
const CACHE_NAME = 'twitposter-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/logo192.png',
  '/logo512.png',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/twitter-card.png',
  '/shortcut-icon.png',
  '/robots.txt',
  '/sitemap.xml',
  '/twitter_post_generator',
  '/features',
  '/about',
  '/faq',
  '/blog',
  '/blog/how-to-create-viral-tweets',
  // Additional assets
  '/st1.png',
  '/st2.png',
  '/st3.png', 
  '/st4.png',
  '/st5.png',
  '/st6.png',
  '/st7.png',
  '/st8.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch events - with improved offline strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache API calls
                if (!event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      }).catch(() => {
        // Fallback for offline pages
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Update caches - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
