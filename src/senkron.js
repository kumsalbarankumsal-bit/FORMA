/* İstemci tarafı eşitleme: kayıt her yazıldığında birkaç saniye sonra buluta gönderilir;
   açılışta buluttaki daha yeniyse önce o yüklenir; açıkken başka cihaz yazarsa uyarı çıkar. */
import { depo } from "./storage.js";
export const KEY = "forma:td:v3";
const LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, String(v)); } catch (e) { return null; } };
export const kodAl = () => LS("forma:senkronKod");
export const kodYaz = (k) => LS("forma:senkronKod", k || null);
const cihaz = LS("forma:cihaz") || (LS("forma:cihaz", Math.random().toString(36).slice(2, 10)), LS("forma:cihaz"));
const yerelT = () => Number(LS("forma:senkronT")) || 0;
export const durum = { ad: "kapali", zaman: null, dinle: new Set(), yeniVar: false };
const bildir = (ad, ek = {}) => { Object.assign(durum, { ad, ...ek }); durum.dinle.forEach((f) => f({ ...durum })); };
export const yeniKod = () => { const a = new Uint8Array(12); crypto.getRandomValues(a); return Array.from(a, (b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("").replace(/(.{4})(?=.)/g, "$1-"); };
async function api(yol, ayar) { const r = await fetch("/api/sync" + yol, ayar); const j = await r.json().catch(() => ({})); if (!r.ok) { const e = new Error(j.hata || r.status); e.kod = r.status; e.j = j; throw e; } return j; }
let zaman = null, bekleyen = false;
export async function gonder(zorla = false) {
  const k = kodAl(); if (!k) return;
  const r = await depo.get(KEY); if (!r) return;
  bildir("gonderiyor");
  try { const t = Math.max(yerelT(), Date.now()); await api("", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ k, t, cihaz, v: r.value, zorla }) });
    LS("forma:senkronT", t); bekleyen = false; bildir("tamam", { zaman: Date.now(), yeniVar: false });
  } catch (e) { bildir(e.kod === 409 ? "cakisma" : "hata", { hata: e.message }); }
}
/* uygulamanın her kaydı buradan geçer */
export function kancaKur() {
  const set = depo.set;
  depo.set = async (k, v) => { const r = await set(k, v); if (k === KEY && kodAl() && !depo.__cekiyor) { LS("forma:senkronT", Date.now()); bekleyen = true; clearTimeout(zaman); zaman = setTimeout(() => gonder(), 4000); } return r; };
  window.addEventListener("pagehide", () => { if (bekleyen) gonder(); });
}
/* buluttakini indirip yerel kayda yazar (gönderme tetiklenmez) */
export async function cek() {
  const k = kodAl(); if (!k) return false;
  const j = await api(`?k=${encodeURIComponent(k)}`); if (!j.v) return false;
  depo.__cekiyor = true; try { await depo.set(KEY, j.v); } finally { depo.__cekiyor = false; }
  LS("forma:senkronT", j.t); bildir("tamam", { zaman: Date.now(), yeniVar: false }); return true;
}
/* açılışta: bulut daha yeniyse önce onu al; yereldeki daha yeniyse gönder */
export async function acilis() {
  if (!kodAl()) return bildir("kapali");
  try { const { t } = await api(`?k=${encodeURIComponent(kodAl())}&meta=1`);
    if (t > yerelT()) await cek(); else if (t < yerelT()) await gonder(); else bildir("tamam", { zaman: Date.now() });
  } catch (e) { bildir("hata", { hata: e.message }); }
}
/* açıkken: arada bir ve sekmeye dönünce kontrol */
export function izle() {
  const bak = async () => { if (!kodAl() || document.hidden) return;
    try { const { t } = await api(`?k=${encodeURIComponent(kodAl())}&meta=1`); if (t > yerelT() + 1000) bildir(durum.ad, { yeniVar: true }); } catch (e) {} };
  setInterval(bak, 60000); document.addEventListener("visibilitychange", bak);
}
