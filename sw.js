// Controle 360 · service worker
// Sempre confere com a internet se há versão nova (revalida o cache do navegador) e só usa a cópia salva sem conexão.
const CACHE = 'pf-v51';
const ARQUIVOS = ['./', './index.html', './app.js', './supabase.js', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './logo-horizontal.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // Supabase passa direto
  e.respondWith(
    // "no-cache" = pergunta ao servidor se mudou, em vez de confiar nos 10 minutos de cache do GitHub Pages
    fetch(e.request, { cache: 'no-cache' }).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {}); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
