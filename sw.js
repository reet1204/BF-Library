const CACHE_NAME = 'bf-library-v2';

self.addEventListener('install', function(e) {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', function(e) {
  // Always fetch from network, fall back to cache only if offline
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Cache a copy for offline use
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          if(e.request.method === 'GET') cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
