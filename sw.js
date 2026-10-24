/**
 * =========================================================================
 * AXIOM ZERO-LATENCY OFFLINE ENGINE (sw.js)
 * Service Worker Cache-First Runtime & Asset Pre-cacher
 * Ensures 100% offline functionality, instant reloads, and zero packet drop
 * =========================================================================
 */

const CACHE_NAME = 'neo-dethi-cache-v1.6.0';

const PRECACHE_MANIFEST = [
  './',
  './index.html',
  './product.html',
  './thi.html',
  './tuluan.html',
  './ontap.html',
  './onsai.html',
  './flashcard.html',
  './css/style.css',
  './css/thi-premium.css',
  './js/api-config.js',
  './js/hihihaaaa.js',
  './js/script.js',
  './js/tuluan.js',
  './js/tuluan-data.js',
  './js/review.js',
  './js/flashcard.js',
  './js/fps120.js',
  './js/certificate.js',
  './filethi/KTCQ.txt',
  './filethi/NLQH.txt',
  './img/kcxdcb/9162b2edeaa0ecbf7e14f5613eb2f45b517726be.png',
  './img/kcxdcb/e58ab7a6c371906d2adf85702ec75dd4674c7316.png',
  './img/kcxdcb/1bb7388ff0284f35bef7d3bcf91a92b274a25087.png',
  './img/kcxdcb/efb0cbd9aa9e672e533fac5581319c3f0a65b991.png',
  './img/kcxdcb/6e37f3300b3ce76767735ece39b67468656878af.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_MANIFEST.map((url) =>
          fetch(new Request(url, { cache: 'no-cache' }))
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Stale-While-Revalidate for HTML Documents
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network-First for dynamic config/manifests (hihihaaaa.js, api-config.js)
  const reqUrl = req.url || '';
  if (reqUrl.includes('hihihaaaa.js') || reqUrl.includes('api-config.js')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const cloned = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, cloned));
          }
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-First with Background Sync for Static Assets & Text Question Banks
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(req).then((networkRes) => {
        if (!networkRes || networkRes.status !== 200) {
          return networkRes;
        }
        const cloned = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, cloned));
        return networkRes;
      });
    })
  );
});
