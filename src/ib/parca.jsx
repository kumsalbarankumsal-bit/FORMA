/* IB modu · ekranların ortak yapı taşları ve formlar. */
import React, { useEffect, useRef, useState } from "react";
import { Ik, Pencere, Alan, Onay, kimlik, tarihKisa, kalanYazi } from "./ortak.jsx";
import { bicim } from "./grafik.jsx";
import { useYay, kis } from "./hareket.js";
import { DERSLER, DERS_SIRA, OLCUM_TUR, KAYIP, TAKVIM_TUR, CAS } from "./veri.js";

export const Pafta = ({ baslik, alt, sag, children, className = "", style, id }) => <section id={id} className={"ib-pafta " + className} style={style}>
  {(baslik || sag) && <header className="ib-pafta-bas"><div>{baslik && <h3>{baslik}</h3>}{alt && <p>{alt}</p>}</div>{sag && <div className="ib-pafta-sag">{sag}</div>}</header>}
  {children}</section>;
export const Bos = ({ children, eylem, eylemAd }) => <div className="ib-bos"><span>{children}</span>{eylem && <button type="button" className="ib-dugme ib-dugme-ikincil" onClick={eylem}>{eylemAd}</button>}</div>;
export const Duzey = ({ z }) => <span className={"ib-duzey" + (z === "HL" ? " ib-duzey-hl" : "")}>{z}</span>;
export const DersNokta = ({ did, boy = 10 }) => <i className="ib-nokta" style={{ background: DERSLER[did] ? DERSLER[did].renk : "var(--murekkep-3)", width: boy, height: boy }} />;

/* − değer + */
export function Adim({ deger, degis, min = 0, max = 100, adim = 1, etiket, bos = "–", genis = 44 }) {
  const v = deger == null ? null : Number(deger);
  return <span className="ib-adim" role="group" aria-label={etiket}>
    <button type="button" aria-label="Azalt" disabled={v != null && v <= min} onClick={() => degis(v == null ? min : kis(v - adim, min, max))}><Ik ad="asagi" boy={16} /></button>
    <output style={{ minWidth: genis }} aria-live="polite">{v == null ? bos : bicim(v, adim < 1 ? 1 : 0)}</output>
    <button type="button" aria-label="Artır" disabled={v != null && v >= max} onClick={() => degis(v == null ? max : kis(v + adim, min, max))}><Ik ad="yukari" boy={16} /></button>
  </span>;
}
export function Kaydirak({ deger, degis, min = 0, max = 100, adim = 1, etiket }) {
  return <input type="range" className="ib-kaydirak" min={min} max={max} step={adim} value={deger} aria-label={etiket} onChange={(e) => degis(Number(e.target.value))} style={{ "--o": `${((deger - min) / (max - min)) * 100}%` }} />;
}
/* aşama hattı: tıklanan aşamaya kadar tamamlanır; aynı aşamaya yeniden dokunmak bir geri alır */
export function AsamaHatti({ asamalar, no, sec }) {
  return <div className="ib-asama" role="list" aria-label="Aşamalar">{asamalar.map((a, i) => { const d = i < no ? "bitti" : i === no ? "simdi" : "";
    return <button key={a} type="button" role="listitem" className="ib-asama-oge" data-d={d} onClick={() => sec && sec(i < no && i === no - 1 ? i : i + 1)} aria-label={`${a}: ${d === "bitti" ? "tamamlandı" : d === "simdi" ? "sıradaki" : "bekliyor"}`} disabled={!sec}>
      <span className="ib-asama-top">{d === "bitti" ? <Ik ad="tik" boy={13} kalin={3} /> : i + 1}</span><span>{a}</span></button>; })}</div>;
}
export function Cipler({ secenek, deger, degis, coklu = false, etiket }) {
  const acik = (id) => (coklu ? (deger || []).includes(id) : deger === id);
  return <div className="ib-sira" role={coklu ? "group" : "radiogroup"} aria-label={etiket} style={{ gap: 6 }}>{secenek.map((s) => <button key={s.id} type="button" className="ib-cip ib-cip-sec" role={coklu ? "checkbox" : "radio"} aria-checked={acik(s.id)}
    onClick={() => degis(coklu ? (acik(s.id) ? (deger || []).filter((x) => x !== s.id) : [...(deger || []), s.id]) : s.id)}>{s.renk && <i style={{ background: s.renk }} />}{s.ad}</button>)}</div>;
}
/* not rozeti: tam not büyük, kesir küçük */
export function NotSayi({ not, boy = 34, bos = "–" }) {
  const v = useYay(not == null ? 0 : not, { sertlik: 90, sonum: 16 });
  if (not == null) return <span className="ib-sayi" style={{ fontSize: boy, fontWeight: 800, lineHeight: 1, color: "var(--murekkep-3)" }}>{bos}</span>;
  const tam = Math.floor(kis(v, 1, 7) + 1e-6), k = Math.round((kis(v, 1, 7.99) - tam) * 10);
  return <span className="ib-sayi" style={{ fontSize: boy, fontWeight: 800, lineHeight: 1, letterSpacing: "-.02em" }}>{tam}<span style={{ fontSize: boy * 0.5, color: "var(--murekkep-3)", fontWeight: 700 }}>,{kis(k, 0, 9)}</span></span>;
}
export const yuzdeYazi = (y) => (y == null ? "–" : `%${bicim(y)}`);
export const dkYazi = (dk) => (dk >= 60 ? `${bicim(dk / 60, dk % 60 ? 1 : 0)} sa` : `${Math.round(dk)} dk`);

/* basılı tutarak onay: geri dönüşü zor işler için */
export function BasiliTut({ children, onay, sure = 1100, className = "ib-dugme ib-dugme-tehlike" }) {
  const [p, setP] = useState(0); const r = useRef(0), t0 = useRef(0);
  const dur = () => { cancelAnimationFrame(r.current); setP(0); };
  const bas = () => { t0.current = performance.now(); const f = (t) => { const x = (t - t0.current) / sure; if (x >= 1) { setP(0); onay(); return; } setP(x); r.current = requestAnimationFrame(f); }; r.current = requestAnimationFrame(f); };
  useEffect(() => () => cancelAnimationFrame(r.current), []);
  return <button type="button" className={className} onPointerDown={bas} onPointerUp={dur} onPointerLeave={dur} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) bas(); }} onKeyUp={dur}
    style={{ position: "relative", overflow: "hidden" }} title="Onaylamak için basılı tut"><span style={{ position: "absolute", inset: 0, background: "currentColor", opacity: 0.18, transformOrigin: "0 50%", transform: `scaleX(${p})` }} aria-hidden="true" /><span style={{ position: "relative" }}>{children}</span></button>;
}

/* ── ölçüm formu ── */
export function OlcumFormu({ ib, bugun, on, kapat, kaydet, sil }) {
  const [f, setF] = useState(() => ({ did: "mat", bilesen: "genel", tur: "gecmis", tarih: bugun, puan: "", max: "", tahminOnce: "", sure: "", ad: "", not: "", kayip: [], ...(on || {}) }));
  const u = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const bil = DERSLER[f.did].bilesen(ib.dersler[f.did].duzey); const b = bil.find((x) => x.id === f.bilesen);
  const dersSec = (did) => setF((x) => ({ ...x, did, bilesen: "genel" }));
  const bilSec = (id) => { const y = bil.find((x) => x.id === id); setF((x) => ({ ...x, bilesen: id, max: y && !x.maxElle ? String(y.max) : x.max })); };
  const gecerli = Number(f.max) > 0 && f.puan !== "" && Number(f.puan) >= 0 && Number(f.puan) <= Number(f.max) && f.tarih;
  const yz = gecerli ? (Number(f.puan) / Number(f.max)) * 100 : null;
  return <Pencere baslik={on && on.id ? "Ölçümü düzelt" : "Ölçüm ekle"} alt="Deneme, geçmiş sınav kâğıdı, okul sınavı ya da puanlanan ödev" kapat={kapat}>
    <div className="ib-izg">
      <Alan etiket="Ders"><Cipler etiket="Ders" secenek={DERS_SIRA.map((id) => ({ id, ad: DERSLER[id].kisa, renk: DERSLER[id].renk }))} deger={f.did} degis={dersSec} /></Alan>
      <Alan etiket="Hangi bileşen"><Cipler etiket="Bileşen" secenek={[{ id: "genel", ad: "Genel (karma)" }, ...bil.map((x) => ({ id: x.id, ad: x.kisa }))]} deger={f.bilesen} degis={bilSec} /></Alan>
      {b && <p className="ib-kucuk ib-ikincil">{b.ad}: toplam notun %{b.agirlik} kadarı, {b.max} puan{b.sure ? `, ${b.sure} dakika` : ""}.</p>}
      <div className="ib-form">
        <Alan etiket="Tür"><select className="ib-secim" value={f.tur} onChange={(e) => u("tur", e.target.value)}>{OLCUM_TUR.map((t) => <option key={t.id} value={t.id}>{t.ad}</option>)}</select></Alan>
        <Alan etiket="Tarih"><input type="date" className="ib-girdi" value={f.tarih} max={bugun} onChange={(e) => u("tarih", e.target.value)} /></Alan>
        <Alan etiket="Aldığın puan"><input type="number" inputMode="decimal" className="ib-girdi" value={f.puan} min="0" onChange={(e) => u("puan", e.target.value)} autoFocus /></Alan>
        <Alan etiket="Tam puan"><input type="number" inputMode="decimal" className="ib-girdi" value={f.max} min="1" onChange={(e) => setF((x) => ({ ...x, max: e.target.value, maxElle: true }))} /></Alan>
        <Alan etiket="Sınavdan önceki tahminin (%)"><input type="number" inputMode="decimal" className="ib-girdi" value={f.tahminOnce} min="0" max="100" placeholder="boş bırakılabilir" onChange={(e) => u("tahminOnce", e.target.value)} /></Alan>
        <Alan etiket="Süre (dk)"><input type="number" inputMode="numeric" className="ib-girdi" value={f.sure} min="0" placeholder={b && b.sure ? String(b.sure) : ""} onChange={(e) => u("sure", e.target.value)} /></Alan>
        <Alan etiket="Ad" genis><input className="ib-girdi" value={f.ad} placeholder="örn. Kasım 2025 Paper 1" onChange={(e) => u("ad", e.target.value)} /></Alan>
      </div>
      <Alan etiket="Puan nerede gitti?"><Cipler coklu etiket="Kayıp nedenleri" secenek={KAYIP.map((k) => ({ id: k, ad: k }))} deger={f.kayip} degis={(v) => u("kayip", v)} /></Alan>
      <Alan etiket="Not"><textarea className="ib-alan" value={f.not} placeholder="Bir dahaki sefere neyi farklı yapacaksın?" onChange={(e) => u("not", e.target.value)} /></Alan>
      <div className="ib-sira" style={{ justifyContent: "space-between" }}>
        <span className="ib-ikincil">{yz != null ? <>Sonuç <b className="ib-sayi" style={{ color: "var(--murekkep)" }}>%{bicim(yz, 1)}</b></> : "Puanı ve tam puanı gir"}</span>
        <span className="ib-sira">{on && on.id && sil && <button type="button" className="ib-dugme ib-dugme-tehlike" onClick={() => { sil(on.id); kapat(); }}>Sil</button>}
          <button type="button" className="ib-dugme" disabled={!gecerli} onClick={() => { const { maxElle, ...t } = f; kaydet({ ...t, id: f.id || kimlik("o"), puan: Number(f.puan), max: Number(f.max), tahminOnce: f.tahminOnce === "" ? null : Number(f.tahminOnce), sure: f.sure === "" ? null : Number(f.sure) }); kapat(); }}>Kaydet</button></span>
      </div>
    </div></Pencere>;
}

/* ── takvim formu ── */
export function TakvimFormu({ bugun, on, kapat, kaydet, sil }) {
  const [f, setF] = useState(() => ({ ad: "", tarih: bugun, tur: "teslim", did: "", not: "", ...(on || {}) })); const u = (k, v) => setF((x) => ({ ...x, [k]: v }));
  return <Pencere baslik={on && on.id ? "Tarihi düzelt" : "Tarih ekle"} alt="Okulun iç teslim tarihleri, deneme sınavları, görüşmeler" kapat={kapat}>
    <div className="ib-izg">
      <Alan etiket="Ne"><input className="ib-girdi" value={f.ad} autoFocus placeholder="örn. Biyoloji İD ilk taslak" onChange={(e) => u("ad", e.target.value)} /></Alan>
      <div className="ib-form"><Alan etiket="Tarih"><input type="date" className="ib-girdi" value={f.tarih} onChange={(e) => u("tarih", e.target.value)} /></Alan>
        <Alan etiket="Ders"><select className="ib-secim" value={f.did || ""} onChange={(e) => u("did", e.target.value)}><option value="">Genel</option>{DERS_SIRA.map((id) => <option key={id} value={id}>{DERSLER[id].kisa}</option>)}</select></Alan></div>
      <Alan etiket="Tür"><Cipler etiket="Tür" secenek={TAKVIM_TUR} deger={f.tur} degis={(v) => u("tur", v)} /></Alan>
      <Alan etiket="Not"><textarea className="ib-alan" style={{ minHeight: 64 }} value={f.not || ""} onChange={(e) => u("not", e.target.value)} /></Alan>
      <div className="ib-sira" style={{ justifyContent: "flex-end" }}>{on && on.id && sil && <button type="button" className="ib-dugme ib-dugme-tehlike" onClick={() => { sil(on.id); kapat(); }}>Sil</button>}
        <button type="button" className="ib-dugme" disabled={!f.ad.trim() || !f.tarih} onClick={() => { kaydet({ ...f, id: f.id || kimlik("t"), ad: f.ad.trim(), did: f.did || null, tahmini: false }); kapat(); }}>Kaydet</button></div>
    </div></Pencere>;
}

/* ── CAS deneyimi formu ── */
export function CasFormu({ bugun, on, kapat, kaydet, sil }) {
  const [f, setF] = useState(() => ({ ad: "", tur: [], bas: bugun, bit: "", saat: "", cikti: [], yansima: "", kanit: "", proje: false, ...(on || {}) })); const u = (k, v) => setF((x) => ({ ...x, [k]: v }));
  return <Pencere baslik={on && on.id ? "Deneyimi düzelt" : "CAS deneyimi ekle"} kapat={kapat} genis>
    <div className="ib-izg">
      <Alan etiket="Deneyim"><input className="ib-girdi" value={f.ad} autoFocus placeholder="örn. Okul münazara kulübü" onChange={(e) => u("ad", e.target.value)} /></Alan>
      <Alan etiket="Kol (birden çok olabilir)"><Cipler coklu etiket="Kol" secenek={CAS.kollar} deger={f.tur} degis={(v) => u("tur", v)} /></Alan>
      <div className="ib-form"><Alan etiket="Başlangıç"><input type="date" className="ib-girdi" value={f.bas} onChange={(e) => u("bas", e.target.value)} /></Alan>
        <Alan etiket="Bitiş"><input type="date" className="ib-girdi" value={f.bit} onChange={(e) => u("bit", e.target.value)} /></Alan>
        <Alan etiket="Saat (yaklaşık)"><input type="number" inputMode="decimal" className="ib-girdi" value={f.saat} min="0" onChange={(e) => u("saat", e.target.value)} /></Alan></div>
      <Alan etiket="Hangi öğrenme çıktılarına kanıt?"><div className="ib-izg" style={{ gap: 6 }}>{CAS.cikti.map((c, i) => <label key={c} className="ib-sira" style={{ gap: 10, flexWrap: "nowrap", cursor: "pointer", fontWeight: 500, color: "var(--murekkep)" }}>
        <Onay isaretli={f.cikti.includes(i)} degis={(v) => u("cikti", v ? [...f.cikti, i] : f.cikti.filter((x) => x !== i))} etiket={c} /><span>{i + 1}. {c}</span></label>)}</div></Alan>
      <Alan etiket="Yansıma"><textarea className="ib-alan" value={f.yansima} placeholder="Ne oldu, ne hissettin, ne öğrendin, bundan sonra ne yapacaksın?" onChange={(e) => u("yansima", e.target.value)} /></Alan>
      <Alan etiket="Kanıt bağlantısı"><input className="ib-girdi" value={f.kanit} placeholder="fotoğraf, belge ya da ManageBac bağlantısı" onChange={(e) => u("kanit", e.target.value)} /></Alan>
      <label className="ib-sira" style={{ gap: 10, cursor: "pointer" }}><Onay isaretli={!!f.proje} degis={(v) => u("proje", v)} etiket="CAS projesi" /><span>Bu benim CAS projem (en az bir ay, beş aşamalı, ekip çalışması)</span></label>
      <div className="ib-sira" style={{ justifyContent: "flex-end" }}>{on && on.id && sil && <button type="button" className="ib-dugme ib-dugme-tehlike" onClick={() => { sil(on.id); kapat(); }}>Sil</button>}
        <button type="button" className="ib-dugme" disabled={!f.ad.trim() || !f.tur.length} onClick={() => { kaydet({ ...f, id: f.id || kimlik("c"), ad: f.ad.trim(), saat: f.saat === "" ? null : Number(f.saat) }); kapat(); }}>Kaydet</button></div>
    </div></Pencere>;
}

/* tarih satırı: takvim listelerinde ortak */
export function TarihSatir({ x, tikla, isaretle }) {
  const T = TAKVIM_TUR.find((t) => t.id === x.tur) || TAKVIM_TUR[4]; const acil = !x.bitti && x.kalan <= 7 && x.kalan >= 0; const gecti = !x.bitti && x.kalan < 0 && x.tur !== "diger" && x.tur !== "sinav";
  return <div className="ib-satir">
    {isaretle ? <Onay isaretli={!!x.bitti} degis={(v) => isaretle(x, v)} etiket={`${x.ad} tamamlandı`} /> : <i className="ib-nokta" style={{ background: T.renk }} />}
    <button type="button" className="ib-satir-ana ib-duz" onClick={tikla ? () => tikla(x) : undefined} style={{ opacity: x.bitti ? 0.55 : 1 }}>
      <div className="ib-satir-ad" style={{ textDecoration: x.bitti ? "line-through" : "none" }}>{x.ad}</div>
      <div className="ib-satir-alt">{tarihKisa(x.tarih)}{x.dilim ? ` · ${x.dilim}` : ""} · {T.ad}{x.tahmini ? " · tahminî" : ""}</div></button>
    <span className="ib-kucuk ib-kalin" style={{ color: gecti ? "var(--kritik)" : acil ? "var(--altin)" : "var(--murekkep-2)", whiteSpace: "nowrap" }}>{x.bitti ? "bitti" : kalanYazi(x.kalan)}</span>
  </div>;
}
