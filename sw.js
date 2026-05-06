// Chronicle PWA — Service Worker
// Cachuje všetky súbory pre offline použitie

const CACHE_NAME = 'chronicle-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './mobile.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './js/achievements.js',
  './js/archive.js',
  './js/asi-tracker.js',
  './js/battle.js',
  './js/calendar.js',
  './js/combat.js',
  './js/companions.js',
  './js/crafting.js',
  './js/data.js',
  './js/databases.js',
  './js/db_invocations.js',
  './js/db_items.js',
  './js/db_psionics.js',
  './js/db_spells.js',
  './js/init.js',
  './js/maps.js',
  './js/multiclass.js',
  './js/notes-quicktab.js',
  './js/notes.js',
  './js/priority-hud.js',
  './js/render.js',
  './js/rolls.js',
  './js/session-notes.js',
  './js/spells.js',
  './js/themes.js',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IM+Fell+English:ital@0;1&display=swap'
];

// Install — cachuj všetko
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(err) {
        console.warn('SW: niektoré assets sa nepodarilo cachovať', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate — vymaž staré cache
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — Cache first, fallback na network
self.addEventListener('fetch', function(e) {
  // Preskočí chrome-extension a iné non-http requesty
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Cachuj nové requesty dynamicky
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback
        return caches.match('./index.html');
      });
    })
  );
});
