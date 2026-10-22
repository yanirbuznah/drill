/* Drill service worker — app shell cache-first, fonts cached on first use. */
const VERSION = "drill-english-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  "./apple-touch-icon.png", "./favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (/generativelanguage\.googleapis\.com|api\.openai\.com|api\.anthropic\.com/.test(url.host)) return;
  const isFont = /fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.host);
  const sameOrigin = url.origin === location.origin;
  if (!isFont && !sameOrigin) return;
  e.respondWith(caches.match(req).then(hit => {
    if (hit) {
      if (sameOrigin) fetch(req).then(res => {
        if (res && res.ok) caches.open(VERSION).then(c => c.put(req, res.clone()));
      }).catch(() => {});
      return hit;
    }
    return fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match("./index.html"));
  }));
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
