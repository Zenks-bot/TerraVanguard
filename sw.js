/* TerraVanguard offline app shell.
   Caches the site's own pages/scripts/styles so the app still opens and shows
   whatever was already saved (parcels, diagnoses, plans) without a connection.
   NASA/Supabase/map-tile requests are left alone: they need the network and
   fail gracefully in the app's own code when offline. */
const CACHE = 'tv-farm-v3-nav-20261114';
const SHELL = [
  'gestion.html','assets/css/farm.css','assets/js/international.js','assets/js/farm-model.js','assets/js/farm-store.js','assets/js/farm-services.js','assets/js/farm-monitor.js','assets/js/farm-widgets.js','assets/js/farm-ui.js','assets/data/crop-management.json','assets/vendor/supabase.js',
  'assets/img/terravanguard-logo.png', 'assets/img/favicon.svg',
  'observatorio.html', 'cuaderno.html', 'assets/js/geo.js', 'assets/js/global-services.js', 'assets/js/evidence.js', 'assets/js/observatory.js', 'assets/js/journal.js', 'assets/vendor/geotiff.js', 'assets/vendor/proj4.js', 'assets/data/gaez-v5.json', 'index.html', 'mapa.html', 'rotacion.html', 'plantacion.html', 'experiencias.html', 'asistente.html', 'acceso.html', 'parcelas.html',
  'assets/css/app.css',
  'assets/js/config.js', 'assets/js/core.js', 'assets/js/engine.js', 'assets/js/map.js', 'assets/js/rotation.js',
  'assets/js/plantation.js', 'assets/js/experiences.js', 'assets/js/assistant.js', 'assets/js/home.js', 'assets/js/account.js', 'assets/js/pdf.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // only the app's own shell; CDN/API calls go straight to the network

  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      // Prefer current application code online; preserve the cached shell offline.
      return fresh.then(res => res || cached || new Response('Sin conexión / Offline', {status:503}));
    })
  );
});
