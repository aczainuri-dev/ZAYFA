/* Service worker cangkang ZAYFA. Hanya menyimpan berkas cangkang (bukan data keuangan).
   Jaringan didahulukan supaya pembaruan cangkang langsung terpakai; cache hanya cadangan saat offline. */
const V = 'zayfa-cangkang-v2';
const ASET = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(ASET)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // permintaan ke Google tidak disentuh
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const salin = r.clone(); caches.open(V).then(c => c.put(e.request, salin)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
