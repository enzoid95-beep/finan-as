// Controle 360 — cada endereço tem seu próprio cache.
const RAIZ = self.registration.scope;
const PREFIXO = 'controle360-' + encodeURIComponent(RAIZ) + '-';
const CACHE = PREFIXO + 'v58';
const ARQUIVOS = ['./', './index.html', './app.js', './supabase.js', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './logo-horizontal.png', './fonts.css', './xlsx.full.min.js', './barlow-latin-400-normal.woff2', './barlow-latin-500-normal.woff2', './barlow-latin-600-normal.woff2', './barlow-latin-700-normal.woff2', './barlow-condensed-latin-600-normal.woff2', './barlow-condensed-latin-700-normal.woff2', './barlow-condensed-latin-800-normal.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS.map(a => new URL(a, RAIZ).href))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIXO) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || !url.href.startsWith(RAIZ) || url.origin !== new URL(RAIZ).origin) return;
  const rede = fetch(e.request, {cache:'no-cache'});
  e.waitUntil(rede.then(async r => {if(r.ok && r.type !== 'opaque'){const copia=r.clone();const c=await caches.open(CACHE);await c.put(e.request,copia)}}).catch(()=>{}));
  e.respondWith(rede.catch(async () => {
    const c=await caches.open(CACHE),r=await c.match(e.request,{ignoreSearch:true});if(r)return r;
    // HTML é fallback somente para navegação, nunca para scripts, fontes ou imagens.
    if(e.request.mode==='navigate'){const pagina=await c.match(new URL('index.html',RAIZ).href);if(pagina)return pagina;}
    return new Response('Sem conexão e sem cópia deste recurso.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }));
});
