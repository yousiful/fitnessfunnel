// Health Club app: keep the app shell available offline. API calls always go to the network.
const CACHE = 'ihc-app-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/.netlify/')) return;
  const isPage = e.request.mode === 'navigate';
  if (isPage || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/app/')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(isPage ? '/app/' : e.request, copy)); return res; })
        .catch(() => caches.match(isPage ? '/app/' : e.request))
    );
  }
});
