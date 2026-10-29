/**
 * =========================================================================
 * AXIOM ZERO-LATENCY OFFLINE ENGINE (sw.js)
 * Service Worker Cache-First Runtime & Asset Pre-cacher
 * Ensures 100% offline functionality, instant reloads, and zero packet drop
 * =========================================================================
 */

const CACHE_NAME = 'neo-dethi-cache-v3.0.0';

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
  './img/logo-utt.png',
  './img/logo-ptit.png',
  './img/logo-ulsa.png',
  './js/api-config.js',
  './js/hihihaaaa.js',
  './js/script.js',
  './js/tuluan.js',
  './js/tuluan-data.js',
  './js/review.js',
  './js/flashcard.js',
  './js/fps120.js',
  './js/certificate.js',
  './filethi/NLQH.txt',
  './filethi/chu-nghia-xa-hoi-khoa-hoc-k76-utt.txt',
  './filethi/chu-nghia-xa-hoi-khoa-hoc-utt.txt',
  './filethi/dclg-qlccc-k76-utt.txt',
  './filethi/dia-ly-van-tai-utt.txt',
  './filethi/hoc-phan-1-quan-su-utt.txt',
  './filethi/hoc-phan-2-quan-su-utt.txt',
  './filethi/ke-toan-quan-tri-k76-utt.txt',
  './filethi/khoa-hoc-quan-ly-utt.txt',
  './filethi/kinh-te-chinh-tri-k76-utt.txt',
  './filethi/kinh-te-hoc.txt',
  './filethi/kinh-te-vi-mo-ulsa.txt',
  './filethi/lich-su-dang-utt.txt',
  './filethi/lsvm-the-gioi-utt.txt',
  './filethi/marketing-can-ban-ulsa.txt',
  './filethi/na-tath-ulsa.txt',
  './filethi/nguyen-li-thong-ke-utt.txt',
  './filethi/phap-luat-dai-cuong-k76-utt.txt',
  './filethi/phap-luat-dai-cuong-utt.txt',
  './filethi/phap-luat-kinh-te-utt.txt',
  './filethi/quan-tri-hoc-ulsa.txt',
  './filethi/tai-chinh-tien-te-utt.txt',
  './filethi/tcbm-ptcv-ulsa.txt',
  './filethi/thuong-mai-dien-tu-utt.txt',
  './filethi/tien-te-ngan-hang-k76-utt.txt',
  './filethi/tin-hoc-co-ban-utt.txt',
  './filethi/triet-hoc-ptit.txt',
  './filethi/triet-hoc-ulsa.txt',
  './filethi/tu-tuong-hcm-utt.txt',
  './filethi/van-hoa-doanh-nghiep-ulsa.txt'
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
