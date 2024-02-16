var cacheName = "edu-sync-v1";
var cacheFiles = [
    "index.html",
];

// Install event
self.addEventListener('install', function(e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(cacheFiles)
            .catch(function(error) {
                console.error('Failed to cache files:', error);
            });
        })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    console.log('Service worker activated');
});

// Fetch event
self.addEventListener('fetch', function(e) {
    console.log('Fetching:', event.request.url);
    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            //if the file is in the cache, retrieve it from there
            if (cachedFile) {
                console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
            return cachedFile;
            } else {//if the file is not in the cache, download the file
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for: " +
                        e.request.url);
                        return response;
                    });
                });
            }
        })
    ); 
});