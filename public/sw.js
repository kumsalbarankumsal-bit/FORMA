/* FORMA servis çalışanı: uygulama kabuğunu önbelleğe alır, internetsiz de açılır.
   Sayfa (HTML) her zaman önce ağdan istenir, böylece yeni sürüm hemen gelir. */
const KAP = "forma-v72";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(KAP).then((c) => c.addAll(["./", "./index.html", "./manifest.webmanifest"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((l) => Promise.all(l.filter((k) => k !== KAP).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (r.mode === "navigate") { e.respondWith(fetch(r).then((y) => { caches.open(KAP).then((c) => c.put("./index.html", y.clone())); return y; }).catch(() => caches.match("./index.html"))); return; }
  const yaziTipi = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (u.origin !== self.location.origin && !yaziTipi) return;
  e.respondWith(caches.match(r).then((v) => v || fetch(r).then((y) => { if (y && (y.ok || y.type === "opaque")) { const k = y.clone(); caches.open(KAP).then((c) => c.put(r, k)); } return y; })));
});
