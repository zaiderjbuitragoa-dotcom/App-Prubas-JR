// sw.js - Service Worker Oficial J.R. v7.0
const CACHE_NAME = 'jr-carrozas-v7';

// Lista de archivos para funcionar offline
const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './panel_coordinador.html',
  './panel_conductor.html',
  './registro_salida.html',
  './registro_llegada.html',
  './reporte_averia.html',
  './solicitud_apoyo.html',
  './crear_apoyo.html',
  './flota.html',
  './taller.html',
  './mis_salidas.html',
  './mis_averias.html',
  './configuracion.html',
  './mapa_live.html',
  './tracking_conductor.html',
  './db.js',
  './config-aplicar.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Instalación: Guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Registrando caché...');
        // Usamos un bucle para que si un archivo falla (404), los demás sí se guarden
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => console.warn(`⚠️ No se pudo cachear: ${url}`));
          })
        );
      })
  );
});

// Activación: Limpia cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: Primero Red, si falla, busca en Caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
