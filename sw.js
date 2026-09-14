// Service Worker de "Rando GPX".
// Rôle : mettre en cache la coquille de l'application (le HTML, Leaflet, les
// polices) pour qu'elle se recharge sans réseau, même après une fermeture
// complète de l'appli. Les tuiles de carte, elles, restent gérées séparément
// par la page elle-même via IndexedDB (bouton "Télécharger hors-ligne") :
// ce Service Worker les ignore volontairement.

const CACHE_NAME = 'rando-gpx-shell-v3';

// Ressources same-origin (servies par GitHub Pages, à côté de ce fichier)
const SAME_ORIGIN_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Ressources externes (CDN) : mises en cache en mode "no-cors" (réponse
// opaque). On ne peut pas lire leur contenu, mais le navigateur sait très
// bien les réutiliser telles quelles pour charger un <script> ou un <link>.
const CROSS_ORIGIN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      await Promise.all(SAME_ORIGIN_ASSETS.map(async function (url) {
        try { await cache.add(url); } catch (e) { /* non bloquant */ }
      }));
      await Promise.all(CROSS_ORIGIN_ASSETS.map(async function (url) {
        try {
          const resp = await fetch(url, { mode: 'no-cors' });
          await cache.put(url, resp);
        } catch (e) { /* non bloquant */ }
      }));
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;

  // Ne jamais intercepter les tuiles de carte : elles ont leur propre cache
  // (IndexedDB) géré directement par la page.
  if (req.url.indexOf('tile.openstreetmap.org') !== -1) return;

  // Uniquement les requêtes GET peuvent être mises en cache.
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;

      return fetch(req).then(function (resp) {
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, respClone); });
        return resp;
      }).catch(function () {
        // Hors-ligne et rien en cache pour cette requête : si c'est une
        // navigation vers la page, on retombe sur l'accueil en cache plutôt
        // que d'afficher l'écran d'erreur du navigateur.
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
