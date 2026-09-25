/* service-worker.js — cache do app shell para uso 100% offline */

const CACHE_VERSION = 'financeiro-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/dashboard.css',
  './css/responsive.css',
  './js/db.js',
  './js/utils.js',
  './js/finance.js',
  './js/categories.js',
  './js/ui.js',
  './js/charts.js',
  './js/accounts.js',
  './js/creditCards.js',
  './js/invoices.js',
  './js/recurring.js',
  './js/transactions.js',
  './js/loans.js',
  './js/investments.js',
  './js/goals.js',
  './js/calendar.js',
  './js/reports.js',
  './js/projection.js',
  './js/patrimonio.js',
  './js/backup.js',
  './js/settings.js',
  './js/seed.js',
  './js/dashboard.js',
  './js/search.js',
  './js/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        const cacheavel = response && (response.status === 200 || response.type === 'opaque');
        if (cacheavel) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
