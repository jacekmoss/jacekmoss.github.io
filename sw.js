'use strict';
/* Ekran wyboru gier – działanie bez internetu.
   Najpierw sieć (zawsze najnowsza wersja z GitHub Pages), a bez sieci kopia z pamięci urządzenia.
   Kopie gier robi index.html (cache „gry-gry”); każda gra ma też własny sw.js.
   Uwaga: usuwamy tylko stare wersje własnego cache, nigdy cache gier (wszystkie są pod tym samym adresem). */
const CACHE = 'gry-v1';
const FILES = [
  '/', '/index.html', '/games.js', '/home.js', '/manifest.webmanifest',
  '/icon.svg', '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png',
  '/icons/zwierzeta.svg', '/icons/pod-woda.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => /^gry-v\d+$/.test(k) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || (req.mode === 'navigate' ? caches.match('/index.html') : Response.error())))
  );
});
