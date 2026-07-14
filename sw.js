/**
 * @file sw.js
 * @description Service Worker for StadiumIQ.
 *              Cache-first for static assets.
 *              Network-first for HTML documents.
 *              Enables offline PWA installation.
 *              Fans can access key info without connectivity.
 * @author StadiumIQ
 * @version 1.0.0
 */

const CACHE_NAME = 'stadiumiq-v3';

/** Static assets to pre-cache on install */
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/components.css',
  '/css/animations.css',
  '/js/utils.js',
  '/js/analytics.js',
  '/js/firebase.js',
  '/js/charts.js',
  '/js/data.js',
  '/js/navigation.js',
  '/js/crowd.js',
  '/js/transport.js',
  '/js/main.js',
  '/js/chatbot.js',
  '/js/tests.js',
  '/assets/stadium.svg',
  '/manifest.json'
];

/**
 * @description Install event — pre-caches all static assets
 * @param {ExtendableEvent} event - SW install event
 * @returns {void}
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(STATIC_ASSETS); })
      .then(function() { return self.skipWaiting(); })
      .catch(function() { return self.skipWaiting(); })
  );
});

/**
 * @description Activate event — removes old cache versions
 * @param {ExtendableEvent} event - SW activate event
 * @returns {void}
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

/**
 * @description Fetch event — serves from cache when available.
 *              HTML uses network-first for fresh content.
 *              Assets use cache-first for fast loads.
 * @param {FetchEvent} event - The fetch event
 * @returns {void}
 */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(c) { c.put(event.request, clone); });
          return response;
        })
        .catch(function() {
          return caches.match('/index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME)
          .then(function(c) { c.put(event.request, clone); });
        return response;
      }).catch(function() {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
