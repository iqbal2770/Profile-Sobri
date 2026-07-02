const CACHE_NAME = 'profil-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/images/iqbal.jpeg',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/manifest.json'
];

// Tahap Install: Menyimpan aset ke cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assetsToCache);
        })
    );
});

// Tahap Fetch: Mengambil aset dari cache jika offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});