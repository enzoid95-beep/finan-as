// Controle 360 particular — cache do site separado dos outros perfis.
const RAIZ = self.registration.scope;
const PREFIXO = 'controle360-' + encodeURIComponent(RAIZ) + '-';
const CACHE = PREFIXO + 'v57';
const ARQUIVOS = ['./index.html', './app.js?v=57', './supabase.js?v=57', './config.js', './fontes-ui.css?v=57', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-horizontal.png'];
const ESTATICOS = new Set(ARQUIVOS.filter(a => !['./index.html', './config.js'].includes(a)).map(a => new URL(a, RAIZ).href));
// Excel é carregado e guardado somente quando a exportação for utilizada.
ESTATICOS.add(new URL('./xlsx.full.min.js', RAIZ).href);
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS.map(a => new URL(a, RAIZ).href))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIXO) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || !url.href.startsWith(RAIZ) || url.origin !== new URL(RAIZ).origin) return;
  // Recursos desta versão usam o cache exato, sem misturar versões de app.js.
  if (ESTATICOS.has(url.href) && e.request.mode !== 'navigate') {
    e.respondWith((async () => {
      const c = await caches.open(CACHE), r = await c.match(e.request);
      if (r) return r;
      try {
        const novo = await fetch(e.request, {cache:'no-cache'});
        if (novo.ok && novo.type !== 'opaque') await c.put(e.request, novo.clone());
        return novo;
      } catch (_) {
        return new Response('Sem conexão e sem cópia deste recurso.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  const rede = fetch(e.request, {cache:'no-cache'});
  e.waitUntil(rede.then(async r => {if(r.ok && r.type !== 'opaque'){const copia=r.clone();const c=await caches.open(CACHE);await c.put(e.request,copia)}}).catch(()=>{}));
  e.respondWith(rede.catch(async () => {
    const c=await caches.open(CACHE),r=await c.match(e.request);if(r)return r;
    // HTML é fallback somente para navegação, nunca para scripts, fontes ou imagens.
    if(e.request.mode==='navigate'){const pagina=await c.match(new URL('index.html',RAIZ).href);if(pagina)return pagina;}
    return new Response('Sem conexão e sem cópia deste recurso.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }));
});
