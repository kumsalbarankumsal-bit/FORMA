/* window.storage uyarlayıcısı
   Uygulama, claude.ai artifact ortamındaki window.storage API'si için yazıldı
   (get/set/delete/list, sonuç { key, value }). Tarayıcıda aynı arayüzü
   IndexedDB üzerine kurar: veri yalnız bu cihazda, bu sitenin deposunda kalır.
   IndexedDB açılamazsa (gizli sekme vb.) localStorage'a düşer. */
const DB = "forma", STORE = "kv";
let dbSoz = null;
function db() {
  if (dbSoz) return dbSoz;
  dbSoz = new Promise((coz, red) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => coz(r.result);
    r.onerror = () => red(r.error);
  });
  return dbSoz;
}
async function islem(kip, f) {
  const d = await db();
  return new Promise((coz, red) => {
    const t = d.transaction(STORE, kip); const s = t.objectStore(STORE); let sonuc;
    Promise.resolve(f(s)).then((r) => { if (r && "onsuccess" in r) r.onsuccess = () => { sonuc = r.result; }; });
    t.oncomplete = () => coz(sonuc); t.onerror = () => red(t.error); t.onabort = () => red(t.error);
  });
}
const yedek = {
  get: (k) => { const v = localStorage.getItem("forma:" + k); return v == null ? null : { key: k, value: v }; },
  set: (k, v) => { localStorage.setItem("forma:" + k, v); return { key: k, value: v }; },
  delete: (k) => { localStorage.removeItem("forma:" + k); return { key: k, deleted: true }; },
  list: (p = "") => ({ keys: Object.keys(localStorage).filter((k) => k.startsWith("forma:" + p)).map((k) => k.slice(6)) }),
};
let idbVar = typeof indexedDB !== "undefined";
const guvenli = (ad, f) => async (...a) => { if (idbVar) { try { return await f(...a); } catch (e) { idbVar = false; } } return yedek[ad](...a); };
export const depo = {
  get: guvenli("get", async (key) => { const v = await islem("readonly", (s) => s.get(key)); return v == null ? null : { key, value: v }; }),
  set: guvenli("set", async (key, value) => { await islem("readwrite", (s) => s.put(String(value), key)); return { key, value }; }),
  delete: guvenli("delete", async (key) => { await islem("readwrite", (s) => s.delete(key)); return { key, deleted: true }; }),
  list: guvenli("list", async (prefix = "") => { const k = await islem("readonly", (s) => s.getAllKeys()); return { keys: (k || []).map(String).filter((x) => x.startsWith(prefix)), prefix }; }),
};
export function depoKur() {
  if (typeof window === "undefined" || window.storage) return;
  window.storage = depo;
  /* tarayıcının bu siteyi "kalıcı" saymasını iste: depolama baskısında veriler silinmesin */
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
}
