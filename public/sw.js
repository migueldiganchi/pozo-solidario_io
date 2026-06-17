const CACHE_NAME = 'pozo-solidario-v1';

self.addEventListener('install', (event) => {
  // Salta el tiempo de espera para activar el sw inmediatamente
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Manejador de fetch básico necesario para cumplir con los criterios de PWA
  event.respondWith(fetch(event.request));
});