/* IB modu · hesap motoru. Tek kaynak d.ib; FORMA'nın çalışma verisi (seanslar, konu haritası, uyku) köprüyle okunur,
   hiçbir FORMA alanına yazılmaz. Bütün hesaplar saf işlevlerdir. */
import { DERSLER, DERS_SIRA, ODEVLER, EE, TOK, MATRIS, CAS, KOSULLAR, TAKVIM_ON, SINAV_ON, OTURUM, HARFLER } from "./veri.js";
import { gunEkle, gunFarki, haftaBasi } from "./ortak.jsx";

const nes = (x) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});
const dizi = (x) => (Array.isArray(x) ? x.filter((y) => y && typeof y === "object") : []);
const say = (x, v = null) => (x === "" || x == null || !isFinite(Number(x)) ? v : Number(x));
const kis = (v, a, b) => Math.max(a, Math.min(b, v));

/* ── varsayılan durum ve normalleştirme ── */
export function ibVarsayilan() {
  return { v: 1, tema: "gece", aday: "", oturum: { ...OTURUM },
    dersler: Object.fromEntries(DERS_SIRA.map((id) => [id, { duzey: DERSLER[id].duzey, hedef: DERSLER[id].duzey === "HL" ? 6 : 6, tahmin: null, ogretmen: "", muaf: {}, sinir: null, not: "" }])),
    olcum: [], tahminGecmis: [], odev: {}, ee: { ders: "", konu: "", soru: "", danisman: "", kelime: 0, asama: 0, olcut: {}, gorusme: [{}, {}, {}], rpf: 0, kaynak: 0, harf: "", teslim: "", not: "" },
    tok: { sergi: { soru: "", nesne: ["", "", ""], kelime: 0, puan: null, bitti: false }, deneme: { baslik: "", kelime: 0, asama: 0, puan: null, etkilesim: [{}, {}, {}], teslim: "" }, harf: "" },
    cas: { deneyim: [], gorusme: [{}, {}, {}], bas: "", tamam: false }, takvim: TAKVIM_ON.map((t) => ({ ...t })), sinav: SINAV_ON.map((s) => ({ ...s })),
    zihin: { gun: {}, kaygi: [], zafer: [] }, plan: { haftaSaat: 20, woop: null }, baglanti: [], gorulen: {} };
}
let SON = { ham: undefined, v: null };
export function ibAl(d) {
  const ham = d && d.ib;
  if (SON.v && SON.ham === ham) return SON.v;
  const V = ibVarsayilan(); const h = nes(ham);
  const dersler = {}; for (const id of DERS_SIRA) { const x = { ...V.dersler[id], ...nes(nes(h.dersler)[id]) }; x.muaf = nes(x.muaf); if (!DERSLER[id].duzeyler.includes(x.duzey)) x.duzey = DERSLER[id].duzey; x.hedef = kis(Math.round(say(x.hedef, 6)), 1, 7); x.tahmin = say(x.tahmin) == null ? null : kis(Math.round(say(x.tahmin)), 1, 7); if (!Array.isArray(x.sinir) || x.sinir.length !== 6) x.sinir = null; dersler[id] = x; }
  const tokH = nes(h.tok), casH = nes(h.cas), zH = nes(h.zihin);
  const uc = (l) => [0, 1, 2].map((i) => nes(dizi(l)[i]));
  const v = { ...V, ...h, v: 1, tema: h.tema === "gunduz" ? "gunduz" : "gece", aday: typeof h.aday === "string" ? h.aday : "", oturum: { ...V.oturum, ...nes(h.oturum) }, dersler,
    olcum: dizi(h.olcum).filter((o) => DERSLER[o.did] && o.tarih && say(o.max) > 0).map((o) => ({ ...o, puan: kis(say(o.puan, 0), 0, say(o.max)), max: say(o.max) })).sort((a, b) => (a.tarih < b.tarih ? -1 : a.tarih > b.tarih ? 1 : 0)),
    tahminGecmis: dizi(h.tahminGecmis), odev: nes(h.odev), ee: { ...V.ee, ...nes(h.ee), olcut: nes(nes(h.ee).olcut), gorusme: uc(nes(h.ee).gorusme) },
    tok: { harf: typeof tokH.harf === "string" ? tokH.harf : "", sergi: { ...V.tok.sergi, ...nes(tokH.sergi), nesne: [0, 1, 2].map((i) => String((Array.isArray(nes(tokH.sergi).nesne) ? nes(tokH.sergi).nesne[i] : "") || "")) }, deneme: { ...V.tok.deneme, ...nes(tokH.deneme), etkilesim: uc(nes(tokH.deneme).etkilesim) } },
    cas: { ...V.cas, ...casH, deneyim: dizi(casH.deneyim), gorusme: uc(casH.gorusme) }, takvim: Array.isArray(h.takvim) ? dizi(h.takvim).filter((t) => t.tarih) : V.takvim, sinav: Array.isArray(h.sinav) ? dizi(h.sinav).filter((s) => DERSLER[s.did] && s.tarih) : V.sinav,
    zihin: { gun: nes(zH.gun), kaygi: dizi(zH.kaygi), zafer: dizi(zH.zafer) }, plan: { ...V.plan, ...nes(h.plan) }, baglanti: dizi(h.baglanti), gorulen: nes(h.gorulen) };
  SON = { ham, v };
  return v;
}

/* ── notlar ── */
export const sinirAl = (ib, did) => { const D = ib.dersler[did]; return D.sinir || (D.duzey === "HL" && DERSLER[did].sinirHL) || DERSLER[did].sinir; };
/* yüzde → kesirli not (1,00–7,99). 4,6 = 4'ün içinde, 5'e %60 yol alınmış. */
export function notHesap(yuzde, sinir) {
  if (yuzde == null) return null;
  const b = [0, ...sinir, 100]; let g = 1; for (let i = 1; i <= 6; i++) if (yuzde >= sinir[i - 1]) g = i + 1;
  const alt = b[g - 1], ust = b[g]; const k = ust > alt ? kis((yuzde - alt) / (ust - alt), 0, 0.99) : 0;
  return g + k;
}
export const yuzdeNot = (n, sinir) => (n <= 1 ? 0 : sinir[kis(Math.round(n), 2, 7) - 2]);
const agirlikliSon = (l) => { /* yeni ölçüm daha çok sayılır: 1, .6, .36 … */ let t = 0, w = 0; for (let i = l.length - 1, k = 1; i >= 0; i--, k *= 0.6) { t += (l[i].puan / l[i].max) * 100 * k; w += k; } return w ? t / w : null; };

export function dersHesap(ib, did) {
  const T = DERSLER[did], D = ib.dersler[did]; const sinir = sinirAl(ib, did);
  const olc = ib.olcum.filter((o) => o.did === did); const genelL = olc.filter((o) => !o.bilesen || o.bilesen === "genel");
  const genel = agirlikliSon(genelL);
  const ham = T.bilesen(D.duzey).map((b) => { const l = olc.filter((o) => o.bilesen === b.id); const od = ODEVLER.find((x) => x.did === did && x.bid === b.id); const os = od ? nes(ib.odev[od.id]) : null;
    let y = agirlikliSon(l), kaynak = y != null ? "olcum" : null;
    if (y == null && os && say(os.puan) != null) { y = (say(os.puan) / b.max) * 100; kaynak = "odev"; }
    if (y == null && os && b.olcut && b.olcut.some((c) => say(nes(os.olcut)[c.k]) != null)) { const dolu = b.olcut.filter((c) => say(nes(os.olcut)[c.k]) != null); y = (dolu.reduce((s, c) => s + say(os.olcut[c.k]), 0) / dolu.reduce((s, c) => s + c.max, 0)) * 100; kaynak = "ozdeger"; }
    return { ...b, muaf: !!D.muaf[b.id], yuzde: y == null ? null : kis(y, 0, 100), kaynak, n: l.length, son: l.length ? l[l.length - 1] : null, odev: od || null }; });
  const etkin = ham.filter((b) => !b.muaf); const topA = etkin.reduce((s, b) => s + b.agirlik, 0) || 1;
  const bilesenler = ham.map((b) => ({ ...b, agirlikN: b.muaf ? 0 : (b.agirlik / topA) * 100 }));
  let pay = 0, payda = 0, bilinen = 0;
  for (const b of bilesenler) { if (b.muaf) continue; const y = b.yuzde != null ? b.yuzde : genel; if (y == null) continue; pay += y * b.agirlikN; payda += b.agirlikN; if (b.yuzde != null) bilinen += b.agirlikN; }
  let yuzde = payda ? pay / payda : null, kaynak = payda ? "olcum" : null;
  let not = notHesap(yuzde, sinir);
  if (not == null && D.tahmin != null) { not = D.tahmin; kaynak = "tahmin"; }
  const notTam = not == null ? null : Math.floor(not + 1e-9);
  /* eğilim: her ölçümden sonraki ders yüzdesi yerine ölçümün kendi yüzdesi (okunması kolay) */
  const trend = olc.map((o) => ({ t: new Date(o.tarih + "T12:00:00").getTime(), y: (o.puan / o.max) * 100, ad: o.ad || (bilesenler.find((b) => b.id === o.bilesen) || {}).kisa || "Genel", o }));
  const sonraki = notTam != null && notTam < 7 && yuzde != null ? sinir[notTam - 1] - yuzde : null; /* bir üst nota kalan yüzde puanı */
  const altta = notTam != null && notTam > 1 && yuzde != null ? yuzde - sinir[notTam - 2] : null;       /* alt sınıra uzaklık */
  return { id: did, ad: T.ad, kisa: T.kisa, renk: T.renk, grup: T.grup, duzey: D.duzey, hedef: D.hedef, tahmin: D.tahmin, ogretmen: D.ogretmen, notu: D.not, sinir, ozelSinir: !!D.sinir,
    bilesenler, yuzde, kaynak, not, notTam, bilinen, genel, genelN: genelL.length, trend, olcumSay: olc.length, sonraki, altta, fark: not == null ? null : D.hedef - notTam, saat: D.duzey === "HL" ? 240 : 150 };
}
/* hedef nota ulaşmak için henüz puanı olmayan bileşenlerde gereken ortalama yüzde */
export function gerekenYuzde(ders, hedefNot) {
  const esik = hedefNot <= 1 ? 0 : ders.sinir[hedefNot - 2]; let bilinenPay = 0, bosA = 0;
  for (const b of ders.bilesenler) { if (b.muaf) continue; if (b.yuzde != null) bilinenPay += b.yuzde * b.agirlikN / 100; else bosA += b.agirlikN; }
  if (bosA < 0.01) return { esik, gereken: null, bosA: 0, tamam: bilinenPay >= esik };
  const g = (esik - bilinenPay) / (bosA / 100);
  return { esik, gereken: g, bosA, tamam: g <= 0, imkansiz: g > 100 };
}
/* "ne olursa" hesabı: bileşen yüzdeleri elle verilir */
export function senaryoNot(ders, y) { let pay = 0, payda = 0; for (const b of ders.bilesenler) { if (b.muaf) continue; const v = y[b.id]; if (v == null) continue; pay += v * b.agirlikN; payda += b.agirlikN; } const yz = payda ? pay / payda : null; return { yuzde: yz, not: notHesap(yz, ders.sinir) }; }

/* ── çekirdek ── */
const harfSinir = (puan, s) => (puan == null ? "" : puan >= s.A ? "A" : puan >= s.B ? "B" : puan >= s.C ? "C" : puan >= s.D ? "D" : "E");
export function cekirdekHesap(ib) {
  const eeTop = EE.olcut.reduce((s, c) => s + (say(ib.ee.olcut[c.k]) || 0), 0); const eeDolu = EE.olcut.filter((c) => say(ib.ee.olcut[c.k]) != null).length;
  const eeHarf = HARFLER.includes(ib.ee.harf) ? ib.ee.harf : eeDolu === EE.olcut.length ? harfSinir(eeTop, EE.sinir) : "";
  const sp = say(ib.tok.sergi.puan), dp = say(ib.tok.deneme.puan); const tokTop = sp != null && dp != null ? sp + dp * 2 : null;
  const tokHarf = HARFLER.includes(ib.tok.harf) ? ib.tok.harf : harfSinir(tokTop, TOK.sinir);
  const m = eeHarf && tokHarf ? MATRIS[tokHarf][eeHarf] : undefined;
  return { eeTop: eeDolu ? eeTop : null, eeDolu, eeHarf, eeKaynak: HARFLER.includes(ib.ee.harf) ? "tahmin" : eeHarf ? "olcut" : null, tokTop, tokHarf, tokKaynak: HARFLER.includes(ib.tok.harf) ? "tahmin" : tokHarf ? "puan" : null,
    puan: m === undefined ? null : m, basarisiz: m === null, eeAsama: kis(say(ib.ee.asama, 0), 0, EE.asama.length), eeKelime: say(ib.ee.kelime, 0) };
}
export function casHesap(ib, bugun) {
  const l = ib.cas.deneyim; const kol = { C: 0, A: 0, S: 0 }, saat = { C: 0, A: 0, S: 0 }; const cikti = CAS.cikti.map(() => 0); let proje = null;
  for (const x of l) { const t = Array.isArray(x.tur) ? x.tur : []; for (const k of t) if (k in kol) { kol[k]++; saat[k] += (say(x.saat, 0) || 0) / t.length; } for (const c of Array.isArray(x.cikti) ? x.cikti : []) if (cikti[c] != null) cikti[c]++; if (x.proje) proje = x; }
  const ciktiSay = cikti.filter((n) => n > 0).length; const gorusme = ib.cas.gorusme.filter((g) => g.bitti).length;
  const ay = ib.cas.bas ? gunFarki(bugun, ib.cas.bas) / 30.4 : 0; const projeTamam = !!(proje && proje.bas && proje.bit && gunFarki(proje.bit, proje.bas) >= 28);
  const adim = [ciktiSay / 7, kol.C && kol.A && kol.S ? 1 : (Number(!!kol.C) + Number(!!kol.A) + Number(!!kol.S)) / 3, projeTamam ? 1 : proje ? 0.5 : 0, gorusme / 3, kis(ay / CAS.ay, 0, 1)];
  const oran = adim.reduce((a, b) => a + b, 0) / adim.length;
  return { kol, saat, cikti, ciktiSay, proje, projeTamam, gorusme, ay, oran, tamam: !!ib.cas.tamam, eksik: CAS.cikti.map((ad, i) => ({ ad, i, n: cikti[i] })).filter((x) => !x.n), yansimasiz: l.filter((x) => !String(x.yansima || "").trim()).length, n: l.length };
}

/* ── FORMA köprüsü: çalışma dakikaları ve konu haritası ── */
export function calismaKopru(api, bugun) {
  const gun = (api.sa && api.sa.gun) || {}; const G = api.gruplar || {}; const kh = (api.kh && api.kh.dersler) || [];
  const dersDk = (did, t) => { const x = gun[t]; if (!x || !x.ders) return 0; let s = 0; for (const pid of G[DERSLER[did] ? DERSLER[did].forma : did] || []) s += x.ders[pid] || 0; return s; };
  const aralik = (did, n, kaydir = 0) => { let s = 0; for (let i = 0; i < n; i++) s += dersDk(did, gunEkle(bugun, -i - kaydir)); return s; };
  const toplamGun = (t) => (gun[t] ? gun[t].dkG || 0 : 0);
  const out = { gun, toplamGun, dersDk, ders: {}, cekirdek: {}, hafta: [], gunluk: {} };
  for (const did of DERS_SIRA) { const k = kh.find((x) => x.m && x.m.pid === DERSLER[did].kh); let top = 0; for (const t in gun) top += dersDk(did, t);
    out.ders[did] = { dk7: aralik(did, 7), dk28: aralik(did, 28), onceki7: aralik(did, 7, 7), toplam: top, kapsama: k ? k.oz.kapsama : null, guven: k ? k.oz.guven : null, vade: k ? k.oz.vade : 0, konu: k ? k.oz.konu : 0, alt: k ? k.oz.alt : 0, puanli: k ? k.oz.puanli : 0,
      zayif: k ? k.uniteler.flatMap((u) => u.konular).filter((x) => x.ozet && x.ozet.n).sort((a, b) => a.ozet.guven - b.ozet.guven).slice(0, 4).map((x) => ({ id: x.id, ad: x.ad || x.adEn || x.id, kod: x.kod || "", guven: x.ozet.guven, vade: x.ozet.vade })) : [] }; }
  for (const c of ["tok", "ee", "cas", "ia"]) out.cekirdek[c] = aralik(c, 28);
  for (const t in gun) out.gunluk[t] = gun[t].dkG || 0;
  const hb = haftaBasi(bugun);
  for (let h = 11; h >= 0; h--) { const bas = gunEkle(hb, -h * 7); let top = 0; const d = {}; for (let i = 0; i < 7; i++) { const t = gunEkle(bas, i); top += toplamGun(t); for (const did of DERS_SIRA) d[did] = (d[did] || 0) + dersDk(did, t); } out.hafta.push({ bas, dk: top, ders: d }); }
  out.son7 = out.hafta[11] ? Array.from({ length: 7 }, (_, i) => toplamGun(gunEkle(bugun, -i))).reduce((a, b) => a + b, 0) : 0;
  out.onceki21 = Array.from({ length: 21 }, (_, i) => toplamGun(gunEkle(bugun, -i - 7))).reduce((a, b) => a + b, 0) / 3;
  return out;
}

/* ── takvim: bütün tarihli işler tek listede ── */
export function takvimHesap(ib, bugun) {
  const l = [];
  for (const t of ib.takvim) l.push({ ...t, kaynak: "takvim", kalan: gunFarki(t.tarih, bugun) });
  for (const s of ib.sinav) { const T = DERSLER[s.did]; const b = T.bilesen(ib.dersler[s.did].duzey).find((x) => x.id === s.bid); if (ib.dersler[s.did].muaf[s.bid]) continue; l.push({ id: "s-" + s.id, ad: `${T.kisa} · ${b ? b.ad : s.bid}`, tarih: s.tarih, tur: "sinav", did: s.did, tahmini: s.tahmini, dilim: s.dilim, sure: b ? b.sure : 0, kaynak: "sinav", sinavId: s.id, kalan: gunFarki(s.tarih, bugun) }); }
  for (const o of ODEVLER) { const x = nes(ib.odev[o.id]); if (x.teslim) l.push({ id: "o-" + o.id, ad: o.ad, tarih: x.teslim, tur: "teslim", did: o.did, bitti: say(x.asama, 0) >= o.asama.length, kaynak: "odev", odevId: o.id, kalan: gunFarki(x.teslim, bugun) }); }
  if (ib.ee.teslim) l.push({ id: "ee", ad: "Uzun Makale (EE) teslimi", tarih: ib.ee.teslim, tur: "teslim", bitti: say(ib.ee.asama, 0) >= EE.asama.length, kaynak: "ee", kalan: gunFarki(ib.ee.teslim, bugun) });
  if (ib.tok.deneme.teslim) l.push({ id: "tok", ad: "TOK denemesi teslimi", tarih: ib.tok.deneme.teslim, tur: "teslim", bitti: say(ib.tok.deneme.asama, 0) >= TOK.asamaDeneme.length, kaynak: "tok", kalan: gunFarki(ib.tok.deneme.teslim, bugun) });
  l.sort((a, b) => (a.tarih < b.tarih ? -1 : a.tarih > b.tarih ? 1 : 0));
  const acik = l.filter((x) => !x.bitti && x.kalan >= 0); const geciken = l.filter((x) => !x.bitti && x.kalan < 0 && x.tur !== "sinav" && x.tur !== "diger");
  const yedi = acik.filter((x) => x.kalan <= 7 && x.tur !== "diger"), ondort = acik.filter((x) => x.kalan <= 14 && x.tur !== "diger");
  return { hepsi: l, acik, geciken, yedi, ondort, sikisik: yedi.length >= 3 || ondort.length >= 5 };
}

/* ── zihin: son günlerin işaretleri (klinik değil, yalnız yönlendirme) ── */
export function zihinHesap(ib, bugun, api, kopru) {
  const g = ib.zihin.gun; const son = []; for (let i = 13; i >= 0; i--) { const t = gunEkle(bugun, -i); son.push({ t, ...nes(g[t]), var: !!g[t] }); }
  const y7 = son.slice(7).filter((x) => x.var); const ort = (k) => (y7.filter((x) => say(x[k]) != null).length ? y7.reduce((s, x) => s + (say(x[k]) || 0), 0) / y7.filter((x) => say(x[k]) != null).length : null);
  const uyku = dizi(api.uyku).filter((u) => u.tarih > gunEkle(bugun, -14)).sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
  const uOrt = uyku.length ? uyku.reduce((s, u) => s + (Number(u.sure) || 0), 0) / uyku.length : null;
  const dk = (s) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(s || "")); if (!m) return null; let x = Number(m[1]) * 60 + Number(m[2]); if (x < 12 * 60) x += 24 * 60; return x; };
  const yat = uyku.map((u) => dk(u.yatis)).filter((x) => x != null); const yOrt = yat.length ? yat.reduce((a, b) => a + b, 0) / yat.length : null;
  const sapma = yat.length > 2 ? Math.sqrt(yat.reduce((s, x) => s + (x - yOrt) ** 2, 0) / yat.length) : null;
  const yukOran = kopru.onceki21 > 120 ? kopru.son7 / kopru.onceki21 : null;
  const stres = ort("stres"), enerji = ort("enerji"), mod = ort("mod");
  const isaret = stres != null && stres >= 4 ? "stres" : uOrt != null && uOrt < 6.5 ? "uyku" : yukOran != null && yukOran > 1.6 ? "yuk" : enerji != null && enerji <= 2 ? "dusuk" : "iyi";
  let seri = 0; for (let i = 0; i < 400; i++) { if (g[gunEkle(bugun, -i)]) seri++; else if (i > 0) break; }
  return { son, stres, enerji, mod, uyku, uOrt, sapma, tutarlilik: sapma == null ? null : kis(1 - sapma / 90, 0, 1), yukOran, isaret, bugun: g[bugun] || null, seri, girilen: y7.length };
}

/* ── koç: haftalık saat dağıtımı, en ucuz puan, takvim sıkışması ── */
export function kocHesap(H) {
  const { dersler, kopru, takvim, ib } = H; const saat = kis(say(ib.plan.haftaSaat, 20), 4, 60);
  const ham = dersler.map((x) => { const k = kopru.ders[x.id]; const acik = x.not == null ? 1.2 : Math.max(0.35, x.hedef - x.not + 0.5);
    const duzey = x.duzey === "HL" ? 1.5 : 1; const kaps = k.kapsama == null ? 1.15 : 1 + (1 - k.kapsama) * 0.6;
    const yakin = takvim.acik.some((t) => t.did === x.id && t.kalan <= 21 && t.tur !== "diger") ? 1.3 : 1;
    return { id: x.id, w: acik * duzey * kaps * yakin, neden: [x.not == null ? "ölçüm yok" : x.fark > 0 ? `hedefe ${x.fark} not var` : "hedefte", x.duzey === "HL" ? "HL" : null, k.kapsama != null && k.kapsama < 0.5 ? "konu kapsaması düşük" : null, yakin > 1 ? "yaklaşan tarih" : null].filter(Boolean) }; });
  const top = ham.reduce((s, x) => s + x.w, 0) || 1;
  const dagitim = ham.map((x) => { const d = dersler.find((y) => y.id === x.id); const plan = (x.w / top) * saat * 60; const gercek = kopru.ders[x.id].dk7; return { ...x, ad: d.kisa, renk: d.renk, duzey: d.duzey, plan, gercek, fark: gercek - plan }; });
  /* en ucuz puan: bir üst nota en az yüzde puanı kalan dersler */
  const ucuz = dersler.filter((x) => x.sonraki != null && x.notTam < 7).map((x) => { const bos = x.bilesenler.filter((b) => !b.muaf).sort((a, b) => (a.yuzde == null ? -1 : a.yuzde) - (b.yuzde == null ? -1 : b.yuzde))[0];
    return { id: x.id, ad: x.kisa, renk: x.renk, kalan: x.sonraki, hedefNot: x.notTam + 1, bilesen: bos ? bos.ad : "", hedefte: x.notTam >= x.hedef }; }).sort((a, b) => (a.hedefte - b.hedefte) || (a.kalan - b.kalan));
  const risk = dersler.filter((x) => x.altta != null && x.altta < 3).map((x) => ({ id: x.id, ad: x.kisa, renk: x.renk, pay: x.altta, notTam: x.notTam }));
  const ihmal = dagitim.filter((x) => x.plan > 60 && x.gercek < x.plan * 0.35).sort((a, b) => a.fark - b.fark);
  /* bugünün reçetesi: en büyük açık + vadesi gelen tekrarlar + en yakın tarih */
  const recete = [];
  const yakin = takvim.acik.find((t) => t.tur !== "diger" && t.kalan <= 10); if (yakin) recete.push({ tur: "tarih", ad: yakin.ad, alt: yakin.kalan === 0 ? "bugün" : `${yakin.kalan} gün kaldı`, did: yakin.did || null, hedef: yakin });
  const sira = [...dagitim].sort((a, b) => a.fark - b.fark);
  for (const x of sira.slice(0, 2)) if (x.fark < -20) recete.push({ tur: "ders", ad: x.ad, alt: `Bu hafta planın ${Math.round(-x.fark)} dk gerisinde`, did: x.id, dk: kis(Math.round(-x.fark / 2 / 5) * 5, 25, 90) });
  const vade = dersler.map((x) => ({ x, v: kopru.ders[x.id].vade })).filter((q) => q.v > 0).sort((a, b) => b.v - a.v)[0];
  if (vade) recete.push({ tur: "tekrar", ad: `${vade.x.kisa} tekrar kartları`, alt: `${vade.v} alt konunun tekrar günü geldi`, did: vade.x.id });
  if (!recete.length) recete.push({ tur: "serbest", ad: "Plan dengede", alt: "Bugün en sevdiğin dersten bir seans yeter", did: null });
  return { saat, dagitim, ucuz, risk, ihmal, recete: recete.slice(0, 4) };
}

/* ── kalibrasyon: sınavdan önceki tahminin ile sonuç arasındaki fark ── */
export function kalibrasyon(ib) {
  const l = ib.olcum.filter((o) => say(o.tahminOnce) != null).map((o) => ({ ...o, gercek: (o.puan / o.max) * 100, tahmin: say(o.tahminOnce), fark: (o.puan / o.max) * 100 - say(o.tahminOnce) }));
  const ort = l.length ? l.reduce((s, x) => s + x.fark, 0) / l.length : null; const mutlak = l.length ? l.reduce((s, x) => s + Math.abs(x.fark), 0) / l.length : null;
  return { l, ort, mutlak, yon: ort == null ? null : ort > 4 ? "dusuk" : ort < -4 ? "yuksek" : "iyi" };
}
export function kayipDagilim(ib, did) { const m = {}; for (const o of ib.olcum) { if (did && o.did !== did) continue; for (const k of Array.isArray(o.kayip) ? o.kayip : []) m[k] = (m[k] || 0) + 1; } return Object.entries(m).map(([ad, n]) => ({ ad, n })).sort((a, b) => b.n - a.n); }

/* ── diploma koşulları ── */
function kosulHesap(dersler, cek, cas, toplam, eksikNot) {
  const n = dersler.filter((x) => x.notTam != null).map((x) => x.notTam); const tam = n.length === dersler.length;
  const hl = dersler.filter((x) => x.duzey === "HL"), sl = dersler.filter((x) => x.duzey === "SL");
  const top = (l) => l.reduce((s, x) => s + (x.notTam || 0), 0); const hlEsik = 12, slEsik = sl.length <= 2 ? 5 : 9;
  const hlL = hl.length > 3 ? [...hl].sort((a, b) => (b.notTam || 0) - (a.notTam || 0)).slice(0, 3) : hl;
  const D = (ok, bilinmiyor, ac) => ({ durum: bilinmiyor ? "bilinmiyor" : ok ? "iyi" : "kotu", ac });
  const m = {
    cas: cas.tamam ? D(true, false, "Koordinatör onayı işaretli") : { durum: cas.oran >= 0.6 ? "yolda" : "bilinmiyor", ac: `Portföy %${Math.round(cas.oran * 100)}; ${cas.ciktiSay}/7 çıktı, ${cas.gorusme}/3 görüşme` },
    24: D(toplam >= 24, !tam, tam ? `${toplam} puan` : `Şimdilik ${toplam} puan; ${eksikNot} derste not yok`),
    n: D(tam && !!cek.eeHarf && !!cek.tokHarf, !tam || !cek.eeHarf || !cek.tokHarf, tam && cek.eeHarf && cek.tokHarf ? "Hepsinde not var" : "Eksik not var (henüz normal)"),
    2: D(!n.some((x) => x < 2), !n.length, n.some((x) => x < 2) ? "Bir derste 1 görünüyor" : "1 yok"),
    iki2: D(n.filter((x) => x === 2).length <= 2, !n.length, `${n.filter((x) => x === 2).length} derste 2`),
    uc3: D(n.filter((x) => x <= 3).length <= 3, !n.length, `${n.filter((x) => x <= 3).length} derste 3 ya da altı`),
    hl: D(top(hlL) >= hlEsik, hlL.some((x) => x.notTam == null), `${top(hlL)} / ${hlEsik} (${hl.length} HL)`),
    sl: D(top(sl) >= slEsik, sl.some((x) => x.notTam == null), `${top(sl)} / ${slEsik} (${sl.length} SL)`),
    e: D(cek.eeHarf !== "E" && cek.tokHarf !== "E", !cek.eeHarf && !cek.tokHarf, cek.eeHarf || cek.tokHarf ? `EE ${cek.eeHarf || "?"}, TOK ${cek.tokHarf || "?"}` : "Henüz harf yok"),
  };
  const l = KOSULLAR.map((k) => ({ ...k, ...m[k.id] }));
  return { l, kotu: l.filter((x) => x.durum === "kotu").length, iyi: l.filter((x) => x.durum === "iyi").length, bilinmiyor: l.filter((x) => x.durum === "bilinmiyor" || x.durum === "yolda").length };
}

/* ── hepsi bir arada ── */
let HS = { k: null, v: null };
export function ibHesap(ib, bugun, api) {
  const k = [ib, bugun, api.sa, api.kh, api.uyku];
  if (HS.v && HS.k.every((x, i) => x === k[i])) return HS.v;
  const dersler = DERS_SIRA.map((id) => dersHesap(ib, id)); const cek = cekirdekHesap(ib); const cas = casHesap(ib, bugun); const kopru = calismaKopru(api, bugun);
  for (const x of dersler) { const kk = kopru.ders[x.id]; x.dk7 = kk.dk7; x.dk28 = kk.dk28; x.dkToplam = kk.toplam; x.kapsama = kk.kapsama; x.guven = kk.guven; x.vade = kk.vade; }
  const dersPuan = dersler.reduce((s, x) => s + (x.notTam || 0), 0); const eksikNot = dersler.filter((x) => x.notTam == null).length;
  const toplam = dersPuan + (cek.puan || 0); const hedefDers = dersler.reduce((s, x) => s + x.hedef, 0);
  const takvim = takvimHesap(ib, bugun); const kosul = kosulHesap(dersler, cek, cas, toplam, eksikNot);
  const H = { ib, bugun, dersler, cek, cas, kopru, takvim, kosul, dersPuan, eksikNot, toplam, hedefDers, hedefToplam: hedefDers + 3,
    kalanGun: gunFarki(ib.oturum.ilkSinav, bugun), odevler: ODEVLER.map((o) => { const x = nes(ib.odev[o.id]); const asama = kis(say(x.asama, 0), 0, o.asama.length); const b = DERSLER[o.did].bilesen(ib.dersler[o.did].duzey).find((q) => q.id === o.bid);
      return { ...o, durum: x, asamaNo: asama, oran: asama / o.asama.length, bitti: asama >= o.asama.length, bilesen: b, kalan: x.teslim ? gunFarki(x.teslim, bugun) : null, muaf: !!ib.dersler[o.did].muaf[o.bid] }; }).filter((o) => o.bilesen && !o.muaf) };
  H.zihin = zihinHesap(ib, bugun, api, kopru); H.koc = kocHesap(H); H.kalibre = kalibrasyon(ib);
  HS = { k, v: H };
  return H;
}

/* dışa aktarma */
export const ibDisari = (ib) => JSON.stringify({ tur: "forma-ib", surum: 1, tarih: new Date().toISOString(), ib }, null, 1);
export function ibIceri(metin) { try { const o = JSON.parse(metin); const x = o && o.tur === "forma-ib" ? o.ib : o && o.dersler ? o : null; if (!x || typeof x !== "object") return null; return ibAl({ ib: x }); } catch (e) { return null; } }
