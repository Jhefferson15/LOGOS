const CACHE_NAME = 'logos-cache-v2';
const urlsToCache = [
  './', // Cache the root URL
  './index.html',
  './manifest.json',
  './views/game.html',
  './views/library.html',
  './views/philosophers.html',
  './views/play.html',
  './views/schools.html',
  './views/symposium.html',
  './css/main.css',
  './css/components/modal.css',
  './css/components/popup.css',
  './css/components/toast.css',
  './css/screens/game.css',
  './css/screens/library.css',
  './css/screens/philosophers.css',
  './css/screens/play.css',
  './css/screens/schools.css',
  './css/screens/symposium.css',
  './js/main.js',
  './js/data/arenas.js',
  './js/data/concepts.js',
  './js/data/gameConstants.js',
  './js/data/gameState.js',
  './js/data/login.js',
  './js/data/philosophers.js',
  './js/game/game.js',
  './js/screens/library.js',
  './js/screens/login.js',
  './js/screens/philosophers.js',
  './js/screens/play.js',
  './js/screens/schools.js',
  './js/screens/symposium.js',
  './js/ui/PopupManager.js',
  './js/ui/Toast.js',
  './js/ui/components/Card.js',
  './js/ui/components/Modal.js',
  './js/ui/components/Player.js',
  './assets/LOGOS.ico',
  './assets/LOGOS_CAPA.png',
  './assets/arenas/Arena_1_full.png',
  './assets/arenas/atenas.png',
  './assets/arenas/berco_do_pensamento.png',
  './assets/arenas/biblioteca_alexandria.png',
  './assets/arenas/catedral_escolastica.png',
  './assets/arenas/jardim_de_epicuro.png',
  './assets/game/audio/flipcard.mp3',
  './assets/game/audio/game_start.mp3',
  './assets/game/images/background/atenas.png',
  './assets/game/images/philosophers/aristoteles.png',
  './assets/game/images/philosophers/epicuro.png',
  './assets/game/images/philosophers/pitagoras.png',
  './assets/game/images/philosophers/platao.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use { cache: 'reload' } to bypass the HTTP cache for the request.
        const promises = urlsToCache.map(url => {
            return fetch(url, { cache: 'reload' }).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                return cache.put(url, response);
            });
        });
        return Promise.all(promises);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    // More robust fetch strategy: Network falling back to cache
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                // Optional: return a fallback page if nothing is found
            });
        })
    );
});
