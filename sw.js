const CACHE_NAME = 'cascade-v5';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './levels.js', './messages.js', './messages_bonus.js',
  './icon.svg', './manifest.json',
  './assets/desire.jpg', './assets/bg.jpg',
  './assets/gem_0.png', './assets/gem_1.png', './assets/gem_2.png', './assets/gem_3.png', './assets/gem_4.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    Promise.allSettled(ASSETS.map((url) => cache.add(url)))
  ));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: edits show up right away while online, cache is the offline fallback.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
