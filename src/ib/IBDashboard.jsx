/* IB Dashboard · FORMA'nın ikinci modu. Aynı kayıt (d.ib), aynı hesap, ayrı bir dünya: mavi kopya. */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IB_CSS, ibYaziYukle } from "./stil.js";
import { IB_CSS2 } from "./stil2.js";
import { IBOrtam, azMi } from "./hareket.js";
import { Ik, Pencere, useTost, tarihGun } from "./ortak.jsx";
import { Adim, Cipler, DersNokta, Duzey, OlcumFormu, TakvimFormu, CasFormu } from "./parca.jsx";
import { ModAnahtar } from "./gecis.jsx";
import { ibAl, ibHesap } from "./motor.js";
import { DERSLER, DERS_SIRA } from "./veri.js";
import { Kokpit, Dersler } from "./ekran1.jsx";
import { Cekirdek, IcDeger, Takvim } from "./ekran2.jsx";
import { Olcumler, Koc, Zihin, Araclar } from "./ekran3.jsx";

const EKRAN = [
  { id: "kokpit", ad: "Kokpit", ik: "kokpit", alt: (H, ib) => `${ib.oturum.ad} oturumu · ilk sınava ${Math.max(0, H.kalanGun)} gün` },
  { id: "dersler", ad: "Dersler", ik: "ders", alt: (H) => `Altı ders · ${H.dersPuan} / 42 puan` },
  { id: "cekirdek", ad: "Çekirdek", ik: "cekirdek", alt: () => "Bilgi Kuramı, Uzun Makale ve CAS" },
  { id: "ia", ad: "Ödevler", ik: "ia", alt: (H) => `${H.odevler.filter((o) => o.bitti).length} / ${H.odevler.length} tamamlandı` },
  { id: "takvim", ad: "Takvim", ik: "takvim", alt: (H) => `${H.takvim.acik.length} açık tarih` },
  { id: "olcum", ad: "Ölçümler", ik: "olcum", alt: (H, ib) => `${ib.olcum.length} kayıt` },
  { id: "koc", ad: "Koç", ik: "koc", alt: () => "Bu hafta neye, ne kadar" },
  { id: "zihin", ad: "Zihin", ik: "zihin", alt: () => "Kayıt, nefes, sınav öncesi" },
  { id: "arac", ad: "Araçlar", ik: "arac", alt: () => "Komut terimleri, not hesabı, veri" },
];
const oku = (k, v) => { try { return window.localStorage.getItem(k) || v; } catch (e) { return v; } };
const yazYerel = (k, v) => { try { window.localStorage.setItem(k, v); } catch (e) {} };

function Amblem() {
  return <svg width="38" height="38" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="70" fill="none" stroke="var(--cizgi-2)" strokeWidth="5" />
    <path d="M75 21 121.800 48v54L75 129 28.200 102V48Z" fill="none" stroke="var(--vurgu)" strokeWidth="7" strokeLinejoin="round" /><path d="M75 75 121.800 48M75 75v54M75 75 28.200 48" stroke="var(--vurgu)" strokeWidth="5" strokeLinecap="round" />
    <path d="M75 21 121.800 48 75 75 28.200 48Z" fill="var(--altin)" /></svg>;
}

/* ilk kurulum: hedefler ve varsa öğretmen tahminleri */
function Kurulum({ ib, yaz, kapat }) {
  const dY = (id, p) => yaz((s) => ({ ...s, dersler: { ...s.dersler, [id]: { ...s.dersler[id], ...p } } }));
  return <Pencere baslik="IB panon hazır" alt="Bir dakikalık kurulum. Hepsi sonradan değiştirilebilir." kapat={kapat} genis>
    <div className="ib-izg">
      <label className="ib-etiket" style={{ maxWidth: 320 }}><span>Planın antetinde görünecek adın</span><input className="ib-girdi" value={ib.aday} autoFocus onChange={(e) => yaz((s) => ({ ...s, aday: e.target.value }))} /></label>
      <div className="ib-tablo-kap"><table className="ib-tablo"><thead><tr><th>Ders</th><th>Düzey</th><th>Hedef not</th><th>Öğretmen tahmini (varsa)</th></tr></thead><tbody>{DERS_SIRA.map((id) => { const D = ib.dersler[id], T = DERSLER[id];
        return <tr key={id}><td><span className="ib-sira" style={{ gap: 8, flexWrap: "nowrap" }}><DersNokta did={id} boy={12} /><b>{T.ad}</b></span></td>
          <td>{T.duzeyler.length > 1 ? <Cipler etiket="Düzey" secenek={T.duzeyler.map((z) => ({ id: z, ad: z }))} deger={D.duzey} degis={(z) => dY(id, { duzey: z })} /> : <Duzey z={D.duzey} />}</td>
          <td><Adim etiket={`${T.kisa} hedef`} deger={D.hedef} min={1} max={7} degis={(v) => dY(id, { hedef: v })} /></td>
          <td><span className="ib-sira" style={{ gap: 6, flexWrap: "nowrap" }}><Adim etiket={`${T.kisa} tahmin`} deger={D.tahmin} min={1} max={7} bos="yok" degis={(v) => dY(id, { tahmin: v })} />{D.tahmin != null && <button type="button" className="ib-ikon-dugme" aria-label="Sil" onClick={() => dY(id, { tahmin: null })}><Ik ad="kapat" boy={15} /></button>}</span></td></tr>; })}</tbody></table></div>
      <p className="ib-kucuk ib-ikincil" style={{ maxWidth: "70ch" }}>Toplam hedefin <b className="ib-sayi" style={{ color: "var(--murekkep)" }}>{DERS_SIRA.reduce((s, id) => s + ib.dersler[id].hedef, 0) + 3} / 45</b>. Tahminî not yoksa boş bırak; ilk ölçümünü girdiğinde plan kendiliğinden dolmaya başlar. Çalışma dakikaların ve konu haritan FORMA'dan okunur, ayrıca girmen gerekmez.</p>
      <div className="ib-sira" style={{ justifyContent: "flex-end" }}><button type="button" className="ib-dugme" onClick={kapat}>Panoyu aç</button></div>
    </div></Pencere>;
}

export default function IBDashboard({ d, kaydet, bugun, api, mod, modDegis }) {
  const ib = ibAl(d); const dRef = useRef(d); dRef.current = d;
  const yaz = useCallback((f) => { const cur = dRef.current; const eski = ibAl(cur); const yeni = typeof f === "function" ? f(eski) : { ...eski, ...f }; const y = { ...cur, ib: yeni }; dRef.current = y; kaydet(y); }, [kaydet]);
  const H = ibHesap(ib, bugun, api);
  const [ekran, setEkran] = useState(() => { const e = oku("forma:ib:ekran", "kokpit"); return EKRAN.some((x) => x.id === e) ? e : "kokpit"; });
  const [arg, setArg] = useState(null); const [pen, setPen] = useState(null); const [hizli, setHizli] = useState(false); const [tostEl, tost] = useTost();
  const az = useMemo(() => azMi() || (d.ayarlar && d.ayarlar.hareket === false), [d.ayarlar && d.ayarlar.hareket]);
  const kok = useRef(null); const ray = useRef(null); const [isaretY, setIsaretY] = useState(0);
  useEffect(() => { ibYaziYukle(); }, []);
  /* gövde zemini: kaydırma taşmasında FORMA'nın siyahı görünmesin */
  useEffect(() => { const b = document.body; const eski = b.style.background; b.style.background = ib.tema === "gunduz" ? "#EEF3FA" : "#06142E"; const ust = kok.current && kok.current.closest("[data-arena-kok]"); const eu = ust && ust.style.background; if (ust) ust.style.background = b.style.background; document.documentElement.style.background = b.style.background; const m = document.querySelector('meta[name="theme-color"]'); const em = m && m.getAttribute("content"); if (m) m.setAttribute("content", ib.tema === "gunduz" ? "#EEF3FA" : "#06142E");
    return () => { b.style.background = eski; if (ust) ust.style.background = eu || ""; document.documentElement.style.background = ""; if (m && em) m.setAttribute("content", em); }; }, [ib.tema]);
  const git = useCallback((id, a) => { setArg(a || null); setEkran(id); yazYerel("forma:ib:ekran", id); setHizli(false); try { api.ses("dokun"); } catch (e) {} try { window.scrollTo({ top: 0 }); } catch (e) {} }, [api]);
  useLayoutEffect(() => { const el = ray.current && ray.current.querySelector('[aria-current="page"]'); if (el) setIsaretY(el.offsetTop); }, [ekran]);
  /* imleç ışığı: panelin üstünde gezinen yumuşak parlama (yalnız fare) */
  useEffect(() => { const k = kok.current; if (!k || az) return; let son = null, r = 0, ev = null;
    const f = (e) => { if (e.pointerType && e.pointerType !== "mouse") return; ev = e; if (r) return; r = requestAnimationFrame(() => { r = 0; const p = ev.target && ev.target.closest ? ev.target.closest(".ib-pafta") : null; if (son && son !== p) { son.style.removeProperty("--ix"); son.style.removeProperty("--iy"); }
      if (p) { const b = p.getBoundingClientRect(); const o = b.width / p.offsetWidth || 1; p.style.setProperty("--ix", `${(ev.clientX - b.left) / o}px`); p.style.setProperty("--iy", `${(ev.clientY - b.top) / o}px`); } son = p; }); };
    k.addEventListener("pointermove", f, { passive: true }); return () => { k.removeEventListener("pointermove", f); cancelAnimationFrame(r); }; }, [az]);
  /* kısayollar: 1–9 ekranlar, N ölçüm, T tema */
  useEffect(() => { const f = (e) => { const t = e.target && e.target.tagName; if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(t || "") || pen) return;
    if (/^[1-9]$/.test(e.key)) { const x = EKRAN[Number(e.key) - 1]; if (x) { e.preventDefault(); git(x.id); } } else if (e.key === "n" || e.key === "N") { e.preventDefault(); setPen({ tur: "olcum" }); } else if (e.key === "t" || e.key === "T") { e.preventDefault(); yaz((s) => ({ ...s, tema: s.tema === "gece" ? "gunduz" : "gece" })); } };
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, [git, pen, yaz]);
  useEffect(() => { if (!ib.gorulen.kurulum) setPen({ tur: "kurulum" }); }, []);
  const ac = useCallback((p) => { setHizli(false); setPen(p); }, []);
  const E = EKRAN.find((x) => x.id === ekran) || EKRAN[0];
  const rozet = { takvim: H.takvim.yedi.length + H.takvim.geciken.length || null, ia: H.odevler.filter((o) => !o.bitti && o.kalan != null && o.kalan <= 14).length || null, zihin: H.zihin.bugun ? null : "•" };
  const ortak = { H, ib, yaz, bugun, api, git, ac, arg, tost };
  const olcumKaydet = (o) => { const yeni = !ib.olcum.some((q) => q.id === o.id); yaz((s) => ({ ...s, olcum: [...s.olcum.filter((q) => q.id !== o.id), o] })); tost(yeni ? "Ölçüm kaydedildi" : "Ölçüm güncellendi"); try { api.ses(yeni ? "odul" : "tik"); } catch (e) {} };
  const silGeri = (anahtar, id, ad) => { const eski = ib[anahtar]; yaz((s) => ({ ...s, [anahtar]: s[anahtar].filter((q) => q.id !== id) })); tost(`${ad} silindi`, () => yaz((s) => ({ ...s, [anahtar]: eski }))); };
  const temaDegis = () => yaz((s) => ({ ...s, tema: s.tema === "gece" ? "gunduz" : "gece" }));
  const baslik = ekran === "dersler" && arg && arg.did && DERSLER[arg.did] ? DERSLER[arg.did].ad : E.ad;
  return <IBOrtam.Provider value={{ tema: ib.tema, kalite: 2, az }}>
    <div ref={kok} className="ib-kok" data-tema={ib.tema} data-az={az ? 1 : 0} style={{ "--olcek": (d.ayarlar && d.ayarlar.olcek) || 1 }}>
      <style>{IB_CSS + IB_CSS2}</style>
      <div className="ib-iskelet">
        <nav className="ib-ray" aria-label="IB bölümleri" ref={ray}>
          <div className="ib-amblem"><Amblem /><div><div className="ib-amblem-ad">Diploma</div><div className="ib-amblem-alt">{ib.oturum.ad}</div></div></div>
          <div style={{ position: "relative", display: "grid", gap: 4 }}>
            <span className="ib-ray-isaret" style={{ transform: `translateY(${isaretY}px)` }} aria-hidden="true" />
            {EKRAN.map((x, i) => <button key={x.id} type="button" className="ib-ray-oge" aria-current={ekran === x.id ? "page" : undefined} onClick={() => git(x.id)} title={`${x.ad} · ${i + 1}`}><Ik ad={x.ik} boy={20} />{x.ad}{rozet[x.id] ? <span className="ib-ray-rozet">{rozet[x.id]}</span> : null}</button>)}
          </div>
          <div className="ib-ray-alt">
            <button type="button" className="ib-ray-oge" onClick={temaDegis} aria-label={ib.tema === "gece" ? "Gündüz temasına geç" : "Gece temasına geç"}><Ik ad={ib.tema === "gece" ? "gunes" : "ay"} boy={20} />{ib.tema === "gece" ? "Gündüz" : "Gece"}</button>
            <ModAnahtar mod={mod} degis={modDegis} />
          </div>
        </nav>
        <div className="ib-ana">
          <header className="ib-ust">
            <div className="ib-ust-bas"><h1 className="ib-baslik" key={baslik}>{baslik}</h1><div className="ib-altbaslik">{ekran === "kokpit" ? `${tarihGun(bugun)} · ` : ""}{E.alt(H, ib)}</div></div>
            <div className="ib-sira ib-ust-sag" style={{ flexWrap: "nowrap" }}>
              <span className="ib-ekle-kap"><button type="button" className="ib-dugme ib-ekle" aria-label="Ekle" aria-expanded={hizli} aria-haspopup="menu" onClick={() => setHizli(!hizli)}><Ik ad="arti" boy={17} kalin={2.4} /><span>Ekle</span></button>
                {hizli && <><span className="ib-ekle-perde" onClick={() => setHizli(false)} /><div className="ib-ekle-menu" role="menu">
                  <button type="button" role="menuitem" className="ib-hizli-oge" onClick={() => ac({ tur: "olcum", on: ekran === "dersler" && arg && arg.did ? { did: arg.did } : null })}><Ik ad="olcum" boy={18} />Ölçüm<kbd>N</kbd></button>
                  <button type="button" role="menuitem" className="ib-hizli-oge" style={{ animationDelay: "40ms" }} onClick={() => ac({ tur: "takvim" })}><Ik ad="takvim" boy={18} />Tarih</button>
                  <button type="button" role="menuitem" className="ib-hizli-oge" style={{ animationDelay: "80ms" }} onClick={() => ac({ tur: "cas" })}><Ik ad="yonca" boy={18} />CAS deneyimi</button></div></>}</span>
              <span className="ib-toplam" title="Bugünkü toplam / hedef"><b className="ib-sayi">{H.toplam}</b><small>/ {H.hedefToplam}</small></span>
              <button type="button" className="ib-ikon-dugme ib-yalniz-dar" onClick={temaDegis} aria-label="Temayı değiştir"><Ik ad={ib.tema === "gece" ? "gunes" : "ay"} /></button>
              <span className="ib-yalniz-dar"><ModAnahtar mod={mod} degis={modDegis} kucuk /></span>
            </div>
          </header>
          <main id="icerik" key={ekran + (arg && arg.did ? arg.did : "")}>
            {ekran === "kokpit" && <Kokpit {...ortak} />}
            {ekran === "dersler" && <Dersler {...ortak} />}
            {ekran === "cekirdek" && <Cekirdek {...ortak} />}
            {ekran === "ia" && <IcDeger {...ortak} />}
            {ekran === "takvim" && <Takvim {...ortak} />}
            {ekran === "olcum" && <Olcumler {...ortak} />}
            {ekran === "koc" && <Koc {...ortak} />}
            {ekran === "zihin" && <Zihin {...ortak} />}
            {ekran === "arac" && <Araclar {...ortak} />}
          </main>
        </div>
      </div>
      <nav className="ib-dock" aria-label="IB bölümleri">{EKRAN.map((x) => <button key={x.id} type="button" aria-current={ekran === x.id ? "page" : undefined} onClick={() => git(x.id)}><Ik ad={x.ik} boy={21} />{x.ad}</button>)}</nav>
      {pen && pen.tur === "olcum" && <OlcumFormu ib={ib} bugun={bugun} on={pen.on} kapat={() => setPen(null)} kaydet={olcumKaydet} sil={(id) => silGeri("olcum", id, "Ölçüm")} />}
      {pen && pen.tur === "takvim" && <TakvimFormu bugun={bugun} on={pen.on} kapat={() => setPen(null)} kaydet={(t) => { yaz((s) => ({ ...s, takvim: [...s.takvim.filter((q) => q.id !== t.id), t] })); tost("Takvime yazıldı"); }} sil={(id) => silGeri("takvim", id, "Tarih")} />}
      {pen && pen.tur === "cas" && <CasFormu bugun={bugun} on={pen.on} kapat={() => setPen(null)} kaydet={(c) => { yaz((s) => ({ ...s, cas: { ...s.cas, bas: s.cas.bas || c.bas, deneyim: [...s.cas.deneyim.filter((q) => q.id !== c.id), c] } })); tost("Deneyim kaydedildi"); }}
        sil={(id) => { const eski = ib.cas; yaz((s) => ({ ...s, cas: { ...s.cas, deneyim: s.cas.deneyim.filter((q) => q.id !== id) } })); tost("Deneyim silindi", () => yaz((s) => ({ ...s, cas: eski }))); }} />}
      {pen && pen.tur === "kurulum" && <Kurulum ib={ib} yaz={yaz} kapat={() => { yaz((s) => ({ ...s, gorulen: { ...s.gorulen, kurulum: true } })); setPen(null); }} />}
      {tostEl}
    </div>
  </IBOrtam.Provider>;
}
