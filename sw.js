const CACHE = "closu-pwa-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/app.css",
  "/assets/app.js",
  "/agent/",
  "/staff/",
  "/icons/icon.svg",
  "/icons/apple-touch-icon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))));
    self.clients.claim();
  })());
});

// كاش للواجهة فقط (لن يؤثر على Apps Script داخل iframe لأنه cross-origin)
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try{
      const fresh = await fetch(req);
      // خزّن فقط ملفات نفس الدومين
      if (new URL(req.url).origin === location.origin) {
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
      }
      return fresh;
    }catch{
      const offline = await caches.match("/offline.html");
      return offline || new Response("Offline", { status: 200 });
    }
  })());
});
