/* IB modu · ortak parçalar: ikonlar, tarih araçları, sekme, pencere, çekmece, geri sayım, onay kutusu. */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSaat, useAnlik } from "./hareket.js";

/* ── tarih ── */
export const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const tarihNesne = (t) => new Date(String(t).slice(0, 10) + "T12:00:00");
export const gunEkle = (t, n) => { const d = tarihNesne(t); d.setDate(d.getDate() + n); return ymd(d); };
export const gunFarki = (a, b) => Math.round((tarihNesne(a) - tarihNesne(b)) / 86400000); /* a − b (gün) */
export const tarihKisa = (t) => (t ? tarihNesne(t).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : "–");
export const tarihUzun = (t) => (t ? tarihNesne(t).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "–");
export const tarihGun = (t) => (t ? tarihNesne(t).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }) : "–");
export const haftaBasi = (t) => { const d = tarihNesne(t); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return ymd(d); };
export const kalanYazi = (g) => (g == null ? "" : g === 0 ? "bugün" : g === 1 ? "yarın" : g === -1 ? "dün" : g > 0 ? (g >= 60 ? `${Math.round(g / 30.4)} ay sonra` : g >= 14 ? `${Math.round(g / 7)} hafta sonra` : `${g} gün sonra`) : `${-g} gün gecikti`);
export const kimlik = (on = "x") => on + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const saatYazi = (dk) => { const s = Math.floor(dk / 60), m = Math.round(dk % 60); return s ? (m ? `${s} sa ${m} dk` : `${s} sa`) : `${m} dk`; };

/* ── ikonlar: 24'lük çizgi ikonlar ── */
const YOL = {
  kokpit: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5 5-2Z",
  ders: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 21H20M9 7.5h7",
  cekirdek: "M12 2.5 20.2 7.3v9.4L12 21.5 3.8 16.7V7.3L12 2.5Zm0 9.5 8.2-4.7M12 12v9.5M12 12 3.8 7.3",
  ia: "M9 3h6v5l4.5 9.5A2.5 2.5 0 0 1 17.2 21H6.8a2.5 2.5 0 0 1-2.3-3.5L9 8V3Zm-1.5 0h9M7 15h10",
  takvim: "M4 6.5h16v13.5H4V6.5Zm0 4h16M8 3.5v4M16 3.5v4M8 14h2M14 14h2",
  olcum: "M3.5 19.5h17M6 16l4-5 3.5 3L19 6.5M19 6.5h-4M19 6.5v4",
  koc: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-4h.01",
  zihin: "M12 20.5S4 15.6 4 9.8A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 8 2.3c0 5.8-8 10.7-8 10.7Z",
  arac: "M5 3.5h14v17H5v-17Zm3 3.5h8v3H8V7Zm0 6.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01M16 17h.01",
  arti: "M12 5v14M5 12h14", kapat: "M6 6l12 12M18 6 6 18", tik: "M5 12.5l4.5 4.5L19 7.5",
  duzenle: "M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Zm10.5-13 3 3", sil: "M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13M10 11v5M14 11v5",
  sag: "M9 5l7 7-7 7", sol: "M15 5l-7 7 7 7", asagi: "M5 9l7 7 7-7", yukari: "M5 15l7-7 7 7",
  uyari: "M12 3.5 21.5 20h-19L12 3.5Zm0 6v5m0 3h.01", bilgi: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01",
  gunes: "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  ay: "M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z", oynat: "M7 4.5v15l12.5-7.5L7 4.5Z", saat: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2",
  bayrak: "M5 21V4m0 0h11l-2 4 2 4H5", kalem: "M4 20l1-5L16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 2Z", dis: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  indir: "M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M4.5 20h15", yildiz: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z",
  nefes: "M3 9h10a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3M3 11.5h17", kilit: "M6 11h12v9.5H6V11Zm2.5 0V7.5a3.5 3.5 0 0 1 7 0V11",
  hedef: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  kitap: "M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Zm0 0V20",
  dunya: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.500-3.8 9c-2.5-2.5-3.8-5.500-3.800-9S9.500 5.500 12 3Z",
  simsek: "M13 2.5 5 13.500h6l-1 8 8-11h-6l1-8Z", yazdir: "M7 8V3.5h10V8M7 17H4.5V8h15v9H17M7 14h10v6.5H7V14Z", liste: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  geri: "M9 14 4.500 9.500 9 5M4.500 9.500H15a5 5 0 0 1 0 10h-3", yonca: "M12 12c-2-3.500-6-3-6 0s4 3.500 6 0Zm0 0c3.500-2 3-6 0-6s-3.500 4 0 6Zm0 0c2 3.500 6 3 6 0s-4-3.500-6 0Zm0 0c-3.500 2-3 6 0 6s3.500-4 0-6Z",
};
export function Ik({ ad, boy = 20, kalin = 1.8, dolu = false, style, className }) {
  const d = YOL[ad]; if (!d) return null;
  return <svg width={boy} height={boy} viewBox="0 0 24 24" fill={dolu ? "currentColor" : "none"} stroke="currentColor" strokeWidth={kalin} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={style} className={className}><path d={d} /></svg>;
}

/* ── durum rozeti: renk + ikon + yazı (renk tek başına anlam taşımaz) ── */
const DURUM = { iyi: ["var(--iyi)", "tik"], uyari: ["var(--uyari)", "bilgi"], ciddi: ["var(--ciddi)", "uyari"], kritik: ["var(--kritik)", "uyari"], bilgi: ["var(--vurgu)", "bilgi"] };
export function Durum({ tur = "bilgi", children, boy = 16 }) {
  const [renk, ik] = DURUM[tur] || DURUM.bilgi;
  return <span className="ib-durum"><span style={{ color: renk, display: "inline-flex" }}><Ik ad={ik} boy={boy} kalin={2.2} /></span><span>{children}</span></span>;
}

/* ── kayan haplı sekmeler ── */
export function Sekmeler({ ogeler, secili, sec, etiket = "Görünüm" }) {
  const kap = useRef(null); const [hap, setHap] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => { const el = kap.current && kap.current.querySelector('[aria-selected="true"]'); if (el) setHap({ x: el.offsetLeft, w: el.offsetWidth }); }, [secili, ogeler.length]);
  return <div className="ib-sekmeler" role="tablist" aria-label={etiket} ref={kap}>
    <span className="ib-sekme-hap" style={{ transform: `translateX(${hap.x}px)`, width: hap.w }} aria-hidden="true" />
    {ogeler.map((o) => <button key={o.id} type="button" role="tab" aria-selected={secili === o.id} onClick={() => sec(o.id)}>{o.ad}{o.say != null && <span style={{ opacity: 0.7, marginLeft: 6 }}>{o.say}</span>}</button>)}
  </div>;
}

/* ── pencere ve çekmece ── */
function useKapat(kapat) { useEffect(() => { const f = (e) => { if (e.key === "Escape") { e.stopPropagation(); kapat(); } }; window.addEventListener("keydown", f, true); return () => window.removeEventListener("keydown", f, true); }, [kapat]); }
export function Pencere({ baslik, alt, kapat, children, genis }) {
  useKapat(kapat);
  return <div className="ib-perde ib-pencere-kap" onClick={kapat}><div className="ib-pencere" role="dialog" aria-modal="true" aria-label={baslik} onClick={(e) => e.stopPropagation()} style={genis ? { width: "min(860px, 100%)" } : undefined}>
    <div className="ib-pafta-bas"><div><h3 style={{ fontSize: 19 }}>{baslik}</h3>{alt && <p>{alt}</p>}</div><button type="button" className="ib-ikon-dugme" onClick={kapat} aria-label="Kapat"><Ik ad="kapat" /></button></div>
    {children}</div></div>;
}
export function Cekmece({ baslik, alt, kapat, children }) {
  useKapat(kapat);
  return <div className="ib-perde" onClick={kapat}><aside className="ib-cekmece" role="dialog" aria-modal="true" aria-label={baslik} onClick={(e) => e.stopPropagation()}>
    <div className="ib-pafta-bas"><div><h3 style={{ fontSize: 19 }}>{baslik}</h3>{alt && <p>{alt}</p>}</div><button type="button" className="ib-ikon-dugme" onClick={kapat} aria-label="Kapat"><Ik ad="kapat" /></button></div>
    {children}</aside></div>;
}

/* ── onay kutusu: tik kendini çizer ── */
export function Onay({ isaretli, degis, etiket }) {
  return <button type="button" role="checkbox" aria-checked={!!isaretli} aria-label={etiket} className="ib-onay" onClick={(e) => { e.stopPropagation(); degis(!isaretli); }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></button>;
}

/* ── geri sayım: rakam şeritleri kayar ── */
function Rakam({ n, buyuk }) {
  const h = buyuk ? 62 : 44;
  return <span className={"ib-rakam" + (buyuk ? " ib-rakam-b" : "")} aria-hidden="true"><span className="ib-rakam-serit" style={{ transform: `translateY(${-n * h}px)` }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <span key={k}>{k}</span>)}</span></span>;
}
export function Rakamlar({ deger, hane = 2, buyuk }) { const s = String(Math.max(0, Math.floor(deger))).padStart(hane, "0"); return <span className="ib-rakamlar">{s.split("").map((c, i) => <Rakam key={s.length - i} n={Number(c)} buyuk={buyuk} />)}</span>; }
export function GeriSayim({ hedefMs, buyuk = false, saniye = false }) {
  const simdi = useSaat(saniye ? 1000 : 20000); const f = Math.max(0, hedefMs - simdi);
  const gun = Math.floor(f / 86400000), sa = Math.floor((f % 86400000) / 3600000), dk = Math.floor((f % 3600000) / 60000), sn = Math.floor((f % 60000) / 1000);
  return <span className="ib-sayac" role="timer" aria-label={`${gun} gün ${sa} saat ${dk} dakika kaldı`}>
    <span className="ib-sayac-grup"><Rakamlar deger={gun} hane={Math.max(3, String(gun).length)} buyuk={buyuk} /><small>gün</small></span>
    <span className="ib-sayac-grup"><Rakamlar deger={sa} buyuk={buyuk} /><small>saat</small></span>
    <span className="ib-sayac-grup"><Rakamlar deger={dk} buyuk={buyuk} /><small>dakika</small></span>
    {saniye && <span className="ib-sayac-grup"><Rakamlar deger={sn} buyuk={buyuk} /><small>saniye</small></span>}
  </span>;
}

/* ── damga: tamamlanan işin üstüne vurulur ── */
export function Damga({ children, vur, renk }) { return <span className={"ib-damga" + (vur ? " ib-damga-vur" : "")} style={renk ? { color: renk } : undefined}>{children}</span>; }

/* ── form alanı ── */
export const Alan = ({ etiket, children, genis }) => <label className="ib-etiket" style={genis ? { gridColumn: "1 / -1" } : undefined}><span>{etiket}</span>{children}</label>;

/* ── bildirim (geri al düğmeli) ── */
export function useTost() {
  const [t, setT] = useState(null); const z = useRef(0);
  const goster = (metin, geriAl) => { setT({ metin, geriAl, k: Date.now() }); clearTimeout(z.current); z.current = setTimeout(() => setT(null), geriAl ? 6000 : 2600); };
  useEffect(() => () => clearTimeout(z.current), []);
  const el = t ? <div className="ib-tost" role="status" key={t.k}>{t.metin}{t.geriAl && <button type="button" onClick={() => { t.geriAl(); setT(null); }}>Geri al</button>}</div> : null;
  return [el, goster];
}
export { useAnlik };
