const CACHE_NAME = 'bcn-water-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js'
  // adicione aqui outros arquivos .js/.css/.json/.csv que seu projeto usa
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((r) => r || fetch(event.request)));
});
