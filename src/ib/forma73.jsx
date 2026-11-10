/* v73 · FORMA tarafı: lobideki Diploma kartı ve hareket katmanı (kaydırmayla beliren paneller, kaydırma çizgisi,
   sahne taraması). Hepsi yalnız transform ve opacity kullanır; "pil" ve "dengeli" grafik kademelerinde kapalıdır. */
import React from "react";
import { ibAl, ibHesap } from "./motor.js";
import { tarihKisa, kalanYazi } from "./ortak.jsx";

export const FORMA73_CSS = `
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    :where(.gq-ultra, .gq-yuksek) :where(.ar-ekran) .ar-cam { animation: f73Belir linear backwards; animation-timeline: view(); animation-range: entry 0% entry 36%; }
    :where(.gq-ultra, .gq-yuksek) .f73-kaydir { transform-origin: 0 50%; animation: f73Kaydir linear both; animation-timeline: scroll(root block); }
  }
}
@keyframes f73Belir { from { opacity: 0; translate: 0 28px; scale: .97; } }
.ar-ekran { position: relative; }
@keyframes f73Kaydir { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.f73-kaydir { position: fixed; left: 0; right: 0; top: 0; height: 2px; z-index: 60; background: linear-gradient(90deg, var(--vurgu, #D7FF3A), #3BE3FF); transform: scaleX(0); pointer-events: none; opacity: .9; }
.f73-tarama { position: absolute; left: 0; right: 0; top: 0; height: 2px; pointer-events: none; z-index: 5; background: linear-gradient(90deg, transparent, var(--vurgu, #D7FF3A) 40%, #fff 50%, var(--vurgu, #D7FF3A) 60%, transparent); transform: translateX(-100%); animation: f73Tara .8s cubic-bezier(.3,.7,.2,1) both; }
@keyframes f73Tara { 0% { transform: translateX(-100%); opacity: 1; } 80% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
:where(.gq-pil, .gq-dengeli) .f73-tarama, :where(.gq-pil, .gq-dengeli) .f73-kaydir { display: none; }
.f73-kart { position: relative; overflow: hidden; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 16px 20px; border-radius: 20px; border: 1px solid rgba(111,177,255,.32);
  background: radial-gradient(120% 140% at 0% 0%, rgba(47,111,208,.42), transparent 60%), linear-gradient(180deg, rgba(12,34,80,.92), rgba(6,20,46,.96)); color: #EEF4FF; cursor: pointer; text-align: left; width: 100%; font: inherit; transition: transform .25s cubic-bezier(.2,.9,.25,1.2), box-shadow .25s; }
.f73-kart::before { content: ""; position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(150,190,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(150,190,255,.10) 1px, transparent 1px); background-size: 28px 28px; mask-image: linear-gradient(90deg, #000, transparent 70%); -webkit-mask-image: linear-gradient(90deg, #000, transparent 70%); }
.f73-kart:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -18px rgba(47,111,208,.8); } .f73-kart:active { transform: scale(.985); }
.f73-kart > * { position: relative; }
.f73-h { animation: f73Yan .5s both; } @keyframes f73Yan { from { opacity: .08; } to { opacity: 1; } }
.f73-don { transform-origin: 60px 60px; animation: f73Don 90s linear infinite; } @keyframes f73Don { to { transform: rotate(360deg); } }
.f73-git { display: inline-flex; align-items: center; gap: 8px; min-height: 42px; padding: 0 16px; border-radius: 12px; font-weight: 800; font-size: 14px; background: linear-gradient(135deg, #6FB1FF, #2F6FD0); color: #04122B; white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .f73-h, .f73-don, .f73-tarama { animation: none; } }
`;

const RENK = ["#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9"];
const TAU = Math.PI * 2;
const dilim = (c, r0, r1, a0, a1) => { const p = (r, a) => `${(c + Math.cos(a) * r).toFixed(1)} ${(c + Math.sin(a) * r).toFixed(1)}`; return `M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`; };

function MiniPlan({ dersler, cekirdek }) {
  const c = 60; const acik = (TAU / 6) * 0.88;
  return <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" style={{ flex: "0 0 auto" }}>
    <g className="f73-don">{Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * TAU; return <line key={i} x1={c + Math.cos(a) * 58} y1={c + Math.sin(a) * 58} x2={c + Math.cos(a) * (i % 3 ? 56 : 54)} y2={c + Math.sin(a) * (i % 3 ? 56 : 54)} stroke="rgba(150,190,255,.5)" strokeWidth="1" />; })}</g>
    {dersler.map((x, i) => { const orta = -Math.PI / 2 + (i / 6) * TAU; return [1, 2, 3, 4, 5, 6, 7].map((k) => { const dolu = x.notTam != null && k <= x.notTam; const hedef = !dolu && k <= x.hedef;
      return <path key={i + "-" + k} d={dilim(c, 16 + (k - 1) * 5.2, 16 + (k - 1) * 5.2 + 4.1, orta - acik / 2, orta + acik / 2)} className={dolu ? "f73-h" : undefined} style={dolu ? { animationDelay: `${200 + k * 70 + i * 40}ms` } : undefined}
        fill={dolu ? RENK[i] : hedef ? RENK[i] : "rgba(150,190,255,.12)"} fillOpacity={dolu ? 1 : hedef ? 0.22 : 1} />; }); })}
    <circle cx={c} cy={c} r="11" fill={cekirdek ? "#F2C14E" : "rgba(150,190,255,.16)"} fillOpacity={cekirdek ? 0.35 + cekirdek * 0.2 : 1} stroke="rgba(150,190,255,.5)" />
  </svg>;
}

export function DiplomaKarti({ d, bugun, api, modDegis }) {
  let H = null; try { H = ibHesap(ibAl(d), bugun, api); } catch (e) { H = null; }
  if (!H) return null;
  const sonraki = [...H.takvim.geciken, ...H.takvim.acik].find((t) => t.tur !== "diger");
  return <button type="button" className="f73-kart ar-btn" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); modDegis("ib", { x: r.left + 80, y: r.top + r.height / 2 }); }} aria-label={`IB Diploma panosu: ${H.toplam} puan, hedef ${H.hedefToplam}. Aç`}>
    <MiniPlan dersler={H.dersler} cekirdek={H.cek.puan} />
    <span style={{ flex: "1 1 220px", minWidth: 0, display: "grid", gap: 4 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#B4C7EA" }}>IB Diploma panosu</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}><b style={{ fontSize: 40, fontWeight: 900, lineHeight: 0.95, letterSpacing: "-.02em" }}>{H.toplam}</b><span style={{ fontSize: 17, color: "#7F98C6", fontWeight: 700 }}>/ 45</span>
        <span style={{ fontSize: 13.5, color: "#B4C7EA" }}>hedef {H.hedefToplam}{H.eksikNot ? ` · ${H.eksikNot} derste veri bekleniyor` : ""}</span></span>
      <span style={{ fontSize: 13.5, color: "#B4C7EA" }}>İlk sınava <b style={{ color: "#EEF4FF" }}>{Math.max(0, H.kalanGun)} gün</b>{sonraki ? <> · sıradaki: <b style={{ color: sonraki.kalan <= 7 ? "#F2C14E" : "#EEF4FF" }}>{sonraki.ad}</b>, {sonraki.kalan < 0 ? kalanYazi(sonraki.kalan) : tarihKisa(sonraki.tarih)}</> : null}</span>
    </span>
    <span className="f73-git">IB moduna geç</span>
  </button>;
}
