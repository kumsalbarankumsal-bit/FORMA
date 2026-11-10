/* IB modu · grafik ilkelleri. Hepsi düz SVG/HTML; çizgiler kendini çizer, halkalar yayla dolar.
   Kurallar: ince işaretler, 2px çizgi, yüzey boşluğu, tek eksen, renk yalnız işarette (metin mürekkep renginde),
   her grafikte dokunma/üzerine gelme katmanı, iki ve üzeri seride lejant. */
import React, { useMemo, useRef, useState, useId } from "react";
import { useYay, useIlerleme, useGorunur, useGenislik, useSayim, useOrtam, kis, yumusak } from "./hareket.js";

const TR = "tr-TR";
export const bicim = (v, ondalik = 0) => (isFinite(v) ? Number(v).toLocaleString(TR, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }) : "–");

/* ── akan sayı ── */
export function Sayi({ v, ondalik = 0, sure = 800, gecikme = 0, acik = true, on = "", son = "" }) {
  const x = useSayim(Number(v) || 0, { sure, gecikme, acik });
  return <span className="ib-sayi">{on}{bicim(x, ondalik)}{son}</span>;
}

/* ── ipucu kutusu: kapsayıcı position:relative olmalı ── */
export function Ipucu({ x, y, w, gor, children }) {
  if (!gor) return null;
  const sag = x > w * 0.62;
  return <div className="ib-ipucu" role="status" style={{ left: sag ? undefined : x + 12, right: sag ? w - x + 12 : undefined, top: Math.max(4, y - 10) }}>{children}</div>;
}
export const IpucuSatir = ({ renk, ad, deger }) => <div className="ib-ipucu-satir">{renk && <i style={{ background: renk }} />}<b>{deger}</b><span>{ad}</span></div>;

/* ── lejant ── */
export function Lejant({ ogeler, cizgi = true }) {
  return <div className="ib-lejant">{ogeler.map((o) => <span key={o.ad} className="ib-lejant-oge">
    <i className={cizgi ? "ib-anahtar-cizgi" : "ib-anahtar-kare"} style={{ background: o.renk, opacity: o.soluk ? 0.45 : 1 }} />{o.ad}</span>)}</div>;
}

/* ── halka: oran 0..1, yayla dolar; iz aynı tonun açık adımı ── */
export function Halka({ oran = 0, boy = 96, kalin = 8, renk = "var(--vurgu)", gecikme = 0, children, hedef = null, etiket, ucNokta = false }) {
  const ref = useRef(null); const gor = useGorunur(ref);
  const p = useYay(gor ? kis(oran, 0, 1) : 0, { sertlik: 60, sonum: 15, gecikme, bas: 0 });
  const r = (boy - kalin) / 2, c = 2 * Math.PI * r, o = kis(p, 0, 1.02);
  const a = -Math.PI / 2 + o * 2 * Math.PI;
  return <span ref={ref} className="ib-halka" style={{ width: boy, height: boy }} role="img" aria-label={etiket || `%${Math.round(oran * 100)}`}>
    <svg width={boy} height={boy} viewBox={`0 0 ${boy} ${boy}`}>
      <circle cx={boy / 2} cy={boy / 2} r={r} fill="none" stroke={`color-mix(in srgb, ${renk} 18%, transparent)`} strokeWidth={kalin} />
      <circle cx={boy / 2} cy={boy / 2} r={r} fill="none" stroke={renk} strokeWidth={kalin} strokeLinecap="round"
        strokeDasharray={`${c * o} ${c}`} transform={`rotate(-90 ${boy / 2} ${boy / 2})`} />
      {hedef != null && (() => { const ha = -Math.PI / 2 + kis(hedef, 0, 1) * 2 * Math.PI; const x1 = boy / 2 + Math.cos(ha) * (r - kalin / 2 - 2), y1 = boy / 2 + Math.sin(ha) * (r - kalin / 2 - 2), x2 = boy / 2 + Math.cos(ha) * (r + kalin / 2 + 2), y2 = boy / 2 + Math.sin(ha) * (r + kalin / 2 + 2);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--murekkep)" strokeWidth="2" />; })()}
      {ucNokta && o > 0.02 && <circle cx={boy / 2 + Math.cos(a) * r} cy={boy / 2 + Math.sin(a) * r} r={kalin / 2 + 1.5} fill={renk} stroke="var(--yuzey)" strokeWidth="2" />}
    </svg>
    {children != null && <span className="ib-halka-ic">{children}</span>}
  </span>;
}

/* ── kıvılcım: 12-noktalık küçük eğilim; son nokta vurgulu ── */
export function Kivilcim({ veri, w = 96, h = 28, renk = "var(--vurgu)", min, max }) {
  const ref = useRef(null); const gor = useGorunur(ref); const p = useIlerleme(gor ? 1 : 0, { sure: 900, acik: gor });
  if (!veri || veri.length < 2) return <span ref={ref} className="ib-kivilcim-bos" style={{ width: w, height: h }} />;
  const lo = min != null ? min : Math.min(...veri), hi = max != null ? max : Math.max(...veri); const ar = hi - lo || 1;
  const X = (i) => 4 + (i / (veri.length - 1)) * (w - 8), Y = (v) => h - 4 - ((v - lo) / ar) * (h - 8);
  const d = veri.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  return <svg ref={ref} width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="ib-kivilcim" aria-hidden="true">
    <path d={d} fill="none" stroke="var(--murekkep-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
    <circle cx={X(veri.length - 1)} cy={Y(veri[veri.length - 1])} r="4" fill={renk} stroke="var(--yuzey)" strokeWidth="2" opacity={p > 0.9 ? 1 : 0} />
  </svg>;
}

/* ── çizgi grafiği: seriler [{id, ad, renk, noktalar:[{t, y, ad?}]}] · t sayısal (ms ya da sıra) ── */
export function CizgiGrafik({ seriler, yMin = 0, yMax = 100, yCizgi, yBicim = (v) => bicim(v), xBicim = (t) => String(t), yukseklik = 220, bantlar = [], alan = true, birim = "", bos = "Henüz veri yok." }) {
  const kap = useRef(null); const w = useGenislik(kap, 640); const gor = useGorunur(kap);
  const p = useIlerleme(seriler.map((s) => s.noktalar.length).join(","), { sure: 1100, acik: gor });
  const [iz, setIz] = useState(null); const kimlik = useId();
  const dolu = seriler.filter((s) => s.noktalar.length);
  const tum = useMemo(() => [...new Set(dolu.flatMap((s) => s.noktalar.map((n) => n.t)))].sort((a, b) => a - b), [seriler]);
  const sol = 38, sag = 46, ust = 12, alt = 26; const iw = Math.max(60, w - sol - sag), ih = yukseklik - ust - alt;
  if (!tum.length) return <div ref={kap} className="ib-grafik-bos" style={{ height: yukseklik }}>{bos}</div>;
  const t0 = tum[0], t1 = tum[tum.length - 1]; const X = (t) => sol + (t1 === t0 ? iw / 2 : ((t - t0) / (t1 - t0)) * iw); const Y = (v) => ust + ih - ((kis(v, yMin, yMax) - yMin) / (yMax - yMin)) * ih;
  const cizgiler = yCizgi || [0, 1, 2, 3, 4].map((i) => yMin + ((yMax - yMin) * i) / 4);
  /* x etiketleri: çakışmasın diye en çok ~6 */
  const adim = Math.max(1, Math.ceil(tum.length / Math.max(2, Math.floor(iw / 86))));
  const xEt = tum.filter((_, i) => i % adim === 0 || i === tum.length - 1).filter((t, i, l) => i === l.length - 1 || X(l[l.length - 1]) - X(t) > 60 || t === l[l.length - 1]);
  const hareket = (e) => { const r = kap.current.getBoundingClientRect(); const olcek = r.width / w || 1; const mx = (e.clientX - r.left) / olcek; let en = tum[0], fark = Infinity; for (const t of tum) { const f = Math.abs(X(t) - mx); if (f < fark) { fark = f; en = t; } } setIz({ t: en, y: (e.clientY - r.top) / olcek }); };
  return <div ref={kap} className="ib-grafik" style={{ height: yukseklik }} onPointerMove={hareket} onPointerDown={hareket} onPointerLeave={() => setIz(null)}>
    <svg width={w} height={yukseklik} viewBox={`0 0 ${w} ${yukseklik}`} role="img" aria-label={`Çizgi grafiği: ${dolu.map((s) => s.ad).join(", ")}`}>
      <defs>{dolu.map((s, i) => <linearGradient key={s.id} id={`${kimlik}-a${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.renk} stopOpacity="0.16" /><stop offset="1" stopColor={s.renk} stopOpacity="0" /></linearGradient>)}</defs>
      {cizgiler.map((v) => <g key={v}><line x1={sol} x2={sol + iw} y1={Y(v)} y2={Y(v)} className="ib-izgara" /><text x={sol - 8} y={Y(v) + 4} textAnchor="end" className="ib-eksen">{yBicim(v)}</text></g>)}
      {bantlar.map((b) => <g key={b.etiket}><line x1={sol} x2={sol + iw} y1={Y(b.y)} y2={Y(b.y)} className="ib-bant" /><text x={sol + iw + 6} y={Y(b.y) + 4} className="ib-eksen ib-eksen-bant">{b.etiket}</text></g>)}
      {xEt.map((t) => <text key={t} x={X(t)} y={yukseklik - 7} textAnchor={t === t1 && tum.length > 1 ? "end" : t === t0 && tum.length > 1 ? "start" : "middle"} className="ib-eksen">{xBicim(t)}</text>)}
      {dolu.map((s, i) => { const d = s.noktalar.map((n, k) => `${k ? "L" : "M"}${X(n.t).toFixed(1)} ${Y(n.y).toFixed(1)}`).join(" "); const son = s.noktalar[s.noktalar.length - 1], ilk = s.noktalar[0];
        return <g key={s.id}>
          {alan && dolu.length === 1 && s.noktalar.length > 1 && <path d={`${d} L${X(son.t)} ${ust + ih} L${X(ilk.t)} ${ust + ih} Z`} fill={`url(#${kimlik}-a${i})`} opacity={p} />}
          <path d={d} fill="none" stroke={s.renk} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
          {s.noktalar.length === 1 && <circle cx={X(son.t)} cy={Y(son.y)} r="4.5" fill={s.renk} stroke="var(--yuzey)" strokeWidth="2" />}
          {s.noktalar.length > 1 && <circle cx={X(son.t)} cy={Y(son.y)} r="4.5" fill={s.renk} stroke="var(--yuzey)" strokeWidth="2" opacity={p > 0.94 ? 1 : 0} />}
          {dolu.length <= 4 && !bantlar.length && <text x={X(son.t) + 9} y={Y(son.y) + 4} className="ib-uc-etiket" opacity={p > 0.94 ? 1 : 0}>{yBicim(son.y)}{birim}</text>}
        </g>; })}
      {iz && <g pointerEvents="none"><line x1={X(iz.t)} x2={X(iz.t)} y1={ust} y2={ust + ih} className="ib-imlec" />
        {dolu.map((s) => { const n = s.noktalar.find((q) => q.t === iz.t); return n ? <circle key={s.id} cx={X(n.t)} cy={Y(n.y)} r="5" fill={s.renk} stroke="var(--yuzey)" strokeWidth="2" /> : null; })}</g>}
    </svg>
    <Ipucu x={iz ? X(iz.t) : 0} y={iz ? iz.y : 0} w={w} gor={!!iz}>
      <div className="ib-ipucu-bas">{iz ? xBicim(iz.t) : ""}</div>
      {iz && dolu.map((s) => { const n = s.noktalar.find((q) => q.t === iz.t); return n ? <IpucuSatir key={s.id} renk={s.renk} deger={`${yBicim(n.y)}${birim}`} ad={n.ad || s.ad} /> : null; })}
    </Ipucu>
  </div>;
}

/* ── yatay sıralı çubuklar: [{id, ad, deger, renk, ek, hedef, alt}] · değer uçta, isim solda ── */
export function YatayCubuk({ veri, max, degerBicim = (v) => bicim(v), kalin = 14, adGen = 132, onSec, secili }) {
  const kap = useRef(null); const gor = useGorunur(kap); const tavan = max || Math.max(1, ...veri.map((v) => Math.max(v.deger || 0, v.hedef || 0)));
  const [uz, setUz] = useState(null);
  return <div ref={kap} className="ib-cubuklar" role="list">{veri.map((v, i) => { const oran = kis((v.deger || 0) / tavan, 0, 1); const Et = onSec ? "button" : "div";
    return <Et key={v.id || v.ad} type={onSec ? "button" : undefined} role="listitem" className={"ib-cubuk-satir" + (onSec ? " ib-tik" : "") + (secili === v.id ? " ib-secili" : "")} onClick={onSec ? () => onSec(v.id) : undefined}
      onPointerEnter={() => setUz(v.id || v.ad)} onPointerLeave={() => setUz(null)} style={{ gridTemplateColumns: `${adGen}px minmax(0,1fr) auto` }}>
      <span className="ib-cubuk-ad">{v.ad}{v.alt && <small>{v.alt}</small>}</span>
      <span className="ib-cubuk-ray" style={{ height: kalin }}>
        <span className="ib-cubuk-dolgu" style={{ width: gor ? `${oran * 100}%` : 0, background: v.renk || "var(--vurgu)", transitionDelay: `${i * 55}ms`, filter: uz === (v.id || v.ad) ? "brightness(1.15)" : undefined }} />
        {v.hedef != null && <span className="ib-cubuk-hedef" style={{ left: `${kis(v.hedef / tavan, 0, 1) * 100}%` }} title={`Hedef ${degerBicim(v.hedef)}`} />}
      </span>
      <span className="ib-cubuk-deger">{degerBicim(v.deger)}{v.ek && <small>{v.ek}</small>}</span>
    </Et>; })}</div>;
}

/* ── dikey sütunlar (zaman): [{ad, deger, ek}] · ≤24px, uç yuvarlak, taban düz ── */
export function Sutunlar({ veri, yukseklik = 150, renk = "var(--vurgu)", degerBicim = (v) => bicim(v), hedef = null, vurguSon = true, birim = "" }) {
  const kap = useRef(null); const w = useGenislik(kap, 420); const gor = useGorunur(kap); const [uz, setUz] = useState(null);
  const max = Math.max(1, hedef || 0, ...veri.map((v) => v.deger || 0)); const sol = 30, alt = 22, ust = 10; const iw = Math.max(40, w - sol - 6), ih = yukseklik - alt - ust;
  const bw = Math.min(24, Math.max(6, (iw / Math.max(1, veri.length)) - 6)); const X = (i) => sol + (iw / veri.length) * (i + 0.5);
  const tavan = Math.ceil(max / 4) * 4 || 4; const Y = (v) => ust + ih - (v / tavan) * ih; const adim = Math.max(1, Math.ceil(veri.length / Math.floor(iw / 46)));
  return <div ref={kap} className="ib-grafik" style={{ height: yukseklik }} onPointerLeave={() => setUz(null)}>
    <svg width={w} height={yukseklik} viewBox={`0 0 ${w} ${yukseklik}`} role="img" aria-label="Sütun grafiği">
      {[0, 0.5, 1].map((k) => <g key={k}><line x1={sol} x2={sol + iw} y1={Y(tavan * k)} y2={Y(tavan * k)} className="ib-izgara" /><text x={sol - 6} y={Y(tavan * k) + 4} textAnchor="end" className="ib-eksen">{degerBicim(tavan * k)}</text></g>)}
      {hedef != null && <g><line x1={sol} x2={sol + iw} y1={Y(hedef)} y2={Y(hedef)} className="ib-bant" /></g>}
      {veri.map((v, i) => { const h = Math.max(0, (v.deger / tavan) * ih); const hh = gor ? h : 0; const son = vurguSon && i === veri.length - 1;
        return <g key={i} onPointerEnter={() => setUz(i)} onPointerDown={() => setUz(i)}>
          <rect x={X(i) - iw / veri.length / 2} y={ust} width={iw / veri.length} height={ih + alt} fill="transparent" />
          <path d={`M${X(i) - bw / 2} ${ust + ih} v${-Math.max(0, hh - 4)} q0 -4 4 -4 h${Math.max(0, bw - 8)} q4 0 4 4 v${Math.max(0, hh - 4)} Z`} fill={renk} opacity={hh < 1 ? 0 : son || uz === i ? 1 : 0.55}
            style={{ transition: `d .7s cubic-bezier(.2,.8,.2,1) ${i * 40}ms, opacity .2s` }} />
          {((i % adim === 0 && (veri.length - 1 - i) * (iw / veri.length) > 44) || i === veri.length - 1) && <text x={X(i)} y={yukseklik - 6} textAnchor="middle" className="ib-eksen">{v.ad}</text>}
        </g>; })}
    </svg>
    <Ipucu x={uz != null ? X(uz) : 0} y={uz != null ? Y(veri[uz].deger) : 0} w={w} gor={uz != null}>
      {uz != null && <><div className="ib-ipucu-bas">{veri[uz].uzun || veri[uz].ad}</div><IpucuSatir renk={renk} deger={`${degerBicim(veri[uz].deger)}${birim}`} ad={veri[uz].ek || ""} /></>}
    </Ipucu>
  </div>;
}

/* ── radar: eksenler [{ad, deger 0..1, hedef 0..1, yazi}] · iki seri (şimdi, hedef) ── */
export function Radar({ eksenler, boy = 260, renk = "var(--vurgu)", adlar = ["Şimdi", "Hedef"] }) {
  const kap = useRef(null); const gor = useGorunur(kap); const p = useYay(gor ? 1 : 0, { sertlik: 70, sonum: 14, bas: 0 }); const [uz, setUz] = useState(null);
  const n = eksenler.length, c = boy / 2, R = boy / 2 - 34; const A = (i) => -Math.PI / 2 + (i / n) * 2 * Math.PI;
  const nokta = (i, v) => [c + Math.cos(A(i)) * R * v, c + Math.sin(A(i)) * R * v];
  const cokgen = (f) => eksenler.map((e, i) => nokta(i, kis(f(e), 0, 1) * p).map((x) => x.toFixed(1)).join(",")).join(" ");
  return <div ref={kap} className="ib-grafik ib-radar" style={{ width: boy, height: boy }} onPointerLeave={() => setUz(null)}>
    <svg width={boy} height={boy} viewBox={`0 0 ${boy} ${boy}`} role="img" aria-label="Radar grafiği: derslere göre şimdiki durum ve hedef">
      {[0.25, 0.5, 0.75, 1].map((k) => <polygon key={k} points={eksenler.map((_, i) => nokta(i, k).map((x) => x.toFixed(1)).join(",")).join(" ")} fill="none" className="ib-izgara" />)}
      {eksenler.map((e, i) => { const [x, y] = nokta(i, 1); const [tx, ty] = nokta(i, 1.17); return <g key={e.ad}><line x1={c} y1={c} x2={x} y2={y} className="ib-izgara" />
        <text x={tx} y={ty + 4} textAnchor={Math.abs(tx - c) < 8 ? "middle" : tx > c ? "start" : "end"} className="ib-eksen ib-eksen-ad">{e.ad}</text></g>; })}
      <polygon points={cokgen((e) => e.hedef)} fill="none" stroke="var(--murekkep-3)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points={cokgen((e) => e.deger)} fill={renk} fillOpacity="0.12" stroke={renk} strokeWidth="2" strokeLinejoin="round" />
      {eksenler.map((e, i) => { const [x, y] = nokta(i, kis(e.deger, 0, 1) * p); return <g key={e.ad} onPointerEnter={() => setUz(i)} onPointerDown={() => setUz(i)}>
        <circle cx={x} cy={y} r="14" fill="transparent" /><circle cx={x} cy={y} r={uz === i ? 5.5 : 4} fill={e.renk || renk} stroke="var(--yuzey)" strokeWidth="2" /></g>; })}
    </svg>
    <Ipucu x={uz != null ? nokta(uz, eksenler[uz].deger)[0] : 0} y={uz != null ? nokta(uz, eksenler[uz].deger)[1] : 0} w={boy} gor={uz != null}>
      {uz != null && <><div className="ib-ipucu-bas">{eksenler[uz].uzun || eksenler[uz].ad}</div><IpucuSatir renk={renk} deger={eksenler[uz].yazi || bicim(eksenler[uz].deger * 100) + "%"} ad={adlar[0]} /><IpucuSatir renk="var(--murekkep-3)" deger={eksenler[uz].hedefYazi || bicim(eksenler[uz].hedef * 100) + "%"} ad={adlar[1]} /></>}
    </Ipucu>
  </div>;
}

/* ── ısı takvimi: gunler {YYYY-MM-DD: değer}, son N hafta · tek tonlu sıralı rampa ── */
export function IsiTakvim({ gunler, bitis, hafta = 16, esikler = [1, 60, 120, 180, 240], bicimle = (v) => `${Math.round(v)} dk`, hucre = 15 }) {
  const kap = useRef(null); const gor = useGorunur(kap); const [uz, setUz] = useState(null);
  const son = new Date(bitis + "T12:00:00"); const gunNo = (son.getDay() + 6) % 7; const bas = new Date(son); bas.setDate(son.getDate() - gunNo - (hafta - 1) * 7);
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const sutun = []; for (let h = 0; h < hafta; h++) { const g = []; for (let k = 0; k < 7; k++) { const d = new Date(bas); d.setDate(bas.getDate() + h * 7 + k); const t = ymd(d); g.push({ t, v: gunler[t] || 0, gelecek: d > son, ay: d.getDate() <= 7 && k === 0 ? d.toLocaleDateString(TR, { month: "short" }) : null }); } sutun.push(g); }
  const kademe = (v) => { let k = 0; for (const e of esikler) if (v >= e) k++; return k; };
  const bosluk = 3, W = hafta * (hucre + bosluk), H = 7 * (hucre + bosluk) + 16;
  return <div ref={kap} className="ib-grafik ib-isi" style={{ width: W + 22, height: H }} onPointerLeave={() => setUz(null)}>
    <svg width={W + 22} height={H} viewBox={`0 0 ${W + 22} ${H}`} role="img" aria-label="Çalışma ısı takvimi">
      {["Pt", "Ça", "Cu", "Pz"].map((g, i) => <text key={g} x="0" y={16 + (i * 2) * (hucre + bosluk) + hucre - 3} className="ib-eksen">{g}</text>)}
      {sutun.map((g, h) => <g key={h} transform={`translate(${22 + h * (hucre + bosluk)},0)`}>
        {g[0].ay && <text x="0" y="10" className="ib-eksen">{g[0].ay}</text>}
        {g.map((x, k) => x.gelecek ? null : <rect key={x.t} x="0" y={16 + k * (hucre + bosluk)} width={hucre} height={hucre} rx="3" className={`ib-isi-${kademe(x.v)}`}
          style={{ opacity: gor ? 1 : 0, transform: gor ? "none" : "scale(.4)", transformOrigin: `${hucre / 2}px ${16 + k * (hucre + bosluk) + hucre / 2}px`, transition: `opacity .35s ${h * 22 + k * 8}ms, transform .45s cubic-bezier(.2,1.2,.3,1) ${h * 22 + k * 8}ms`, stroke: uz && uz.t === x.t ? "var(--murekkep)" : "none", strokeWidth: 1.5 }}
          onPointerEnter={() => setUz({ ...x, h, k })} onPointerDown={() => setUz({ ...x, h, k })} />)}
      </g>)}
    </svg>
    <Ipucu x={uz ? 22 + uz.h * (hucre + bosluk) + hucre : 0} y={uz ? 16 + uz.k * (hucre + bosluk) : 0} w={W + 22} gor={!!uz}>
      {uz && <><div className="ib-ipucu-bas">{new Date(uz.t + "T12:00:00").toLocaleDateString(TR, { day: "numeric", month: "long", weekday: "short" })}</div><IpucuSatir deger={bicimle(uz.v)} ad="" /></>}
    </Ipucu>
  </div>;
}
export const IsiOlcek = ({ az = "Az", cok = "Çok" }) => <span className="ib-isi-olcek">{az}{[0, 1, 2, 3, 4, 5].map((k) => <i key={k} className={`ib-isi-${k}`} />)}{cok}</span>;

/* ── gösterge: 1–7 not yayı, iğne yayla döner ── */
export function Gosterge({ deger, hedef, boy = 200, min = 1, max = 7, renk = "var(--vurgu)", alt }) {
  const kap = useRef(null); const gor = useGorunur(kap); const v = useYay(gor && deger != null ? deger : min, { sertlik: 55, sonum: 9, bas: min });
  const c = boy / 2, R = boy / 2 - 16, kalin = 10; const A = (x) => Math.PI + ((kis(x, min, max) - min) / (max - min)) * Math.PI;
  const yay = (a0, a1, r) => `M${c + Math.cos(a0) * r} ${c + Math.sin(a0) * r} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${c + Math.cos(a1) * r} ${c + Math.sin(a1) * r}`;
  const ig = A(v); const ek = alt ? 74 : 30;
  return <div ref={kap} className="ib-gosterge" style={{ width: boy, height: c + ek }} role="img" aria-label={deger != null ? `Not ${bicim(deger, 1)}${hedef ? `, hedef ${hedef}` : ""}` : "Not verisi yok"}>
    <svg width={boy} height={c + 30} viewBox={`0 0 ${boy} ${c + 30}`}>
      <path d={yay(Math.PI, 2 * Math.PI, R)} fill="none" stroke={`color-mix(in srgb, ${renk} 18%, transparent)`} strokeWidth={kalin} strokeLinecap="round" />
      {deger != null && <path d={yay(Math.PI, Math.max(Math.PI + 0.001, ig), R)} fill="none" stroke={renk} strokeWidth={kalin} strokeLinecap="round" />}
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => { const a = A(n); return <g key={n}>
        <line x1={c + Math.cos(a) * (R - 12)} y1={c + Math.sin(a) * (R - 12)} x2={c + Math.cos(a) * (R - 18)} y2={c + Math.sin(a) * (R - 18)} stroke="var(--murekkep-3)" strokeWidth="1.5" />
        <text x={c + Math.cos(a) * (R - 30)} y={c + Math.sin(a) * (R - 30) + 4} textAnchor="middle" className="ib-eksen">{n}</text></g>; })}
      {hedef != null && (() => { const a = A(hedef); return <path d={`M${c + Math.cos(a) * (R + 9)} ${c + Math.sin(a) * (R + 9)} l${Math.cos(a + 0.5) * 9} ${Math.sin(a + 0.5) * 9} l${Math.cos(a - Math.PI / 2) * 9} ${Math.sin(a - Math.PI / 2) * 9} Z`} fill="var(--altin)" />; })()}
      {deger != null && <g transform={`rotate(${(ig * 180) / Math.PI} ${c} ${c})`}><path d={`M${c} ${c - 3.5} L${c + R - 16} ${c} L${c} ${c + 3.5} Z`} fill="var(--murekkep)" /></g>}
      <circle cx={c} cy={c} r="7" fill="var(--yuzey)" stroke="var(--murekkep)" strokeWidth="2" />
    </svg>
    {alt && <div className="ib-gosterge-alt">{alt}</div>}
  </div>;
}

/* ── bölümlü ince çubuk: bir bütünün parçaları ── */
export function Bolumlu({ parcalar, kalin = 8, toplam }) {
  const kap = useRef(null); const gor = useGorunur(kap); const t = toplam || parcalar.reduce((a, p) => a + (p.deger || 0), 0) || 1;
  return <div ref={kap} className="ib-bolumlu" style={{ height: kalin }} role="img" aria-label={parcalar.map((p) => `${p.ad} ${bicim((p.deger / t) * 100)}%`).join(", ")}>
    {parcalar.filter((p) => p.deger > 0).map((p, i) => <span key={p.ad} title={`${p.ad}: ${p.yazi || bicim(p.deger)}`} style={{ flexGrow: gor ? p.deger : 0.0001, background: p.renk, transitionDelay: `${i * 70}ms` }} />)}
  </div>;
}

/* ── düz ilerleme çubuğu (ölçer): dolgu durumu taşır, iz aynı tonun açığı ── */
export function Olcer({ oran, renk = "var(--vurgu)", kalin = 8, isaret = null, etiket }) {
  const kap = useRef(null); const gor = useGorunur(kap);
  return <span ref={kap} className="ib-olcer" style={{ height: kalin, background: `color-mix(in srgb, ${renk} 16%, transparent)` }} role="progressbar" aria-valuenow={Math.round(kis(oran, 0, 1) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={etiket}>
    <span style={{ width: gor ? `${kis(oran, 0, 1) * 100}%` : 0, background: renk }} />
    {isaret != null && <i style={{ left: `${kis(isaret, 0, 1) * 100}%` }} />}
  </span>;
}

/* ── grafik kartı: başlık, alt yazı, lejant, tablo görünümü ── */
export function GrafikKart({ baslik, alt, lejant, tablo, sag, children, className = "" }) {
  const [t, setT] = useState(false);
  return <section className={"ib-pafta " + className}>
    <header className="ib-pafta-bas"><div><h3>{baslik}</h3>{alt && <p>{alt}</p>}</div>
      <div className="ib-pafta-sag">{sag}{tablo && <button type="button" className="ib-dugme ib-dugme-ince" aria-pressed={t} onClick={() => setT(!t)}>{t ? "Grafik" : "Tablo"}</button>}</div></header>
    {lejant && !t && <Lejant ogeler={lejant} />}
    {t && tablo ? <div className="ib-tablo-kap"><table className="ib-tablo"><thead><tr>{tablo.bas.map((b) => <th key={b}>{b}</th>)}</tr></thead>
      <tbody>{tablo.satir.map((s, i) => <tr key={i}>{s.map((h, k) => <td key={k}>{h}</td>)}</tr>)}</tbody></table></div> : children}
  </section>;
}
