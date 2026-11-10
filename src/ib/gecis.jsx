/* Mod geçişi · FORMA ↔ IB. İki dünya arasında kısa bir "tünel":
   düğmeden büyüyen bir daire ekranı kaplar, hedef dünyanın işareti çizilir, sonra perde açılır.
   Azaltılmış harekette yalnız kısa bir solma. */
import React, { useEffect, useState } from "react";
import { IB_BASLIK, IB_YAZI } from "./stil.js";
import { azMi } from "./hareket.js";

export const MOD_CSS = `
.mod-anahtar { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 3px; border-radius: 11px; border: none; cursor: pointer; font-family: ${IB_YAZI}; font-weight: 800; font-size: 13px; background: rgba(120,140,190,.16); box-shadow: inset 0 0 0 1px rgba(160,190,255,.3); color: inherit; min-height: 38px; flex: 0 0 auto; }
.mod-anahtar span { position: relative; z-index: 1; padding: 0 12px; display: grid; place-items: center; min-height: 32px; opacity: .62; transition: opacity .25s, color .25s; white-space: nowrap; }
.mod-anahtar span[data-a="1"] { opacity: 1; }
.mod-anahtar i { position: absolute; z-index: 0; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 8px; transition: transform .45s cubic-bezier(.2,.9,.25,1.15), background .3s; }
.mod-anahtar[data-mod="forma"] i { background: linear-gradient(135deg, #D7FF3A, #7CE04A); } .mod-anahtar[data-mod="forma"] span[data-a="1"] { color: #0B0D10; }
.mod-anahtar[data-mod="ib"] i { transform: translateX(100%); background: linear-gradient(135deg, #6FB1FF, #2F6FD0); } .mod-anahtar[data-mod="ib"] span[data-a="1"] { color: #04122B; }
.mod-anahtar:active i { filter: brightness(1.15); }
.mg-kok { position: fixed; inset: 0; z-index: 99990; display: grid; place-items: center; overflow: hidden; clip-path: circle(0px at var(--mx, 50%) var(--my, 50%)); transition: clip-path .52s cubic-bezier(.72,0,.18,1); pointer-events: all; contain: strict; }
.mg-kok[data-asama="ac"], .mg-kok[data-asama="tut"] { clip-path: circle(150vmax at var(--mx, 50%) var(--my, 50%)); }
.mg-kok[data-asama="kapan"] { clip-path: circle(150vmax at var(--mx, 50%) var(--my, 50%)); opacity: 0; transform: scale(1.06); transition: opacity .42s ease-out, transform .5s cubic-bezier(.23,1,.32,1); }
.mg-kok[data-hedef="ib"] { background: #06142E; color: #EEF4FF; }
.mg-kok[data-hedef="forma"] { background: #05060B; color: #F4F6FB; }
.mg-izgara { position: absolute; inset: 0; background-image: linear-gradient(rgba(120,170,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,.16) 1px, transparent 1px), linear-gradient(rgba(120,170,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,.07) 1px, transparent 1px);
  background-size: 160px 160px, 160px 160px, 32px 32px, 32px 32px; opacity: 0; animation: mgIzgara .9s .15s cubic-bezier(.23,1,.32,1) both; }
@keyframes mgIzgara { from { opacity: 0; transform: scale(1.18); } to { opacity: 1; transform: none; } }
.mg-isik { position: absolute; inset: 0; background: radial-gradient(60% 50% at 50% 46%, rgba(47,111,208,.55), transparent 70%); animation: mgIzgara 1s both; }
.mg-cizim path, .mg-cizim line, .mg-cizim circle { fill: none; stroke: #8FC1FF; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: mgCiz .8s cubic-bezier(.4,0,.2,1) both; }
@keyframes mgCiz { to { stroke-dashoffset: 0; } }
.mg-dolgu { fill: #F2C14E !important; stroke: none !important; opacity: 0; animation: mgBelir .35s both !important; stroke-dasharray: none !important; }
@keyframes mgBelir { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: none; } }
.mg-yazi { position: relative; display: grid; justify-items: center; gap: 6px; text-align: center; margin-top: 18px; }
.mg-ad { font-family: ${IB_BASLIK}; font-weight: 600; font-size: clamp(34px, 6vw, 64px); letter-spacing: -.02em; line-height: 1; display: flex; }
.mg-ad span { display: inline-block; opacity: 0; transform: translateY(.5em); animation: mgHarf .5s cubic-bezier(.2,.9,.25,1.15) both; white-space: pre; }
@keyframes mgHarf { to { opacity: 1; transform: none; } }
.mg-alt { font-family: ${IB_YAZI}; font-size: 16px; color: #B4C7EA; opacity: 0; animation: mgBelir2 .5s .62s both; }
@keyframes mgBelir2 { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.mg-koni { position: absolute; top: -20%; width: 70%; height: 150%; background: conic-gradient(from 180deg at 50% 0%, transparent 42%, rgba(215,255,58,.22) 49%, rgba(255,255,255,.3) 50%, rgba(215,255,58,.22) 51%, transparent 58%); filter: blur(6px); opacity: 0; animation: mgKoni 1s cubic-bezier(.23,1,.32,1) both; }
.mg-koni-1 { left: -18%; transform-origin: 50% 0; --a: 24deg; } .mg-koni-2 { right: -18%; transform-origin: 50% 0; --a: -24deg; animation-delay: .08s; }
@keyframes mgKoni { from { opacity: 0; transform: rotate(calc(var(--a) * 2.4)); } to { opacity: 1; transform: rotate(var(--a)); } }
.mg-forma { font-family: 'Big Shoulders Display','Big Shoulders','Arial Narrow',sans-serif; font-weight: 900; font-size: clamp(64px, 15vw, 190px); letter-spacing: .02em; line-height: .86; text-transform: uppercase; display: flex; position: relative; }
.mg-forma span { display: inline-block; opacity: 0; transform: translateY(40%) scaleY(1.5); animation: mgHarf .46s cubic-bezier(.2,.9,.25,1.2) both; }
.mg-serit { position: relative; height: 6px; width: min(46vw, 420px); margin-top: 14px; background: #D7FF3A; border-radius: 3px; transform-origin: 0 50%; transform: scaleX(0); animation: mgSerit .55s .38s cubic-bezier(.23,1,.32,1) forwards; box-shadow: 0 0 30px rgba(215,255,58,.6); }
@keyframes mgSerit { to { transform: scaleX(1); } }
.mg-kisa { clip-path: none !important; opacity: 0; animation: mgKisa .5s both; } @keyframes mgKisa { 0% { opacity: 0; } 40%, 60% { opacity: 1; } 100% { opacity: 0; } }
`;

const harfler = (s, gecikme = 0, adim = 34) => s.split("").map((c, i) => <span key={i} style={{ animationDelay: `${gecikme + i * adim}ms` }}>{c}</span>);

export function ModGecis({ hedef, kaynak, ortada, bitti, altYazi }) {
  const az = azMi();
  const [asama, setAsama] = useState("bas");
  useEffect(() => {
    const z = [];
    if (az) { z.push(setTimeout(ortada, 220), setTimeout(bitti, 520)); return () => z.forEach(clearTimeout); }
    z.push(setTimeout(() => setAsama("ac"), 20), setTimeout(() => { ortada(); setAsama("tut"); }, 560), setTimeout(() => setAsama("kapan"), 1500), setTimeout(bitti, 2000));
    return () => z.forEach(clearTimeout);
  }, []);
  const stil = { "--mx": kaynak ? kaynak.x + "px" : "50%", "--my": kaynak ? kaynak.y + "px" : "50%" };
  if (az) return <div className="mg-kok mg-kisa" data-hedef={hedef} aria-hidden="true" />;
  return <div className="mg-kok" data-hedef={hedef} data-asama={asama} style={stil} role="status" aria-label={hedef === "ib" ? "IB moduna geçiliyor" : "FORMA moduna geçiliyor"} onClick={() => { ortada(); bitti(); }}>
    {hedef === "ib" ? <>
      <div className="mg-isik" /><div className="mg-izgara" />
      <div style={{ position: "relative", display: "grid", justifyItems: "center" }}>
        <svg className="mg-cizim" width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
          <circle cx="75" cy="75" r="70" pathLength="1" style={{ animationDelay: ".1s" }} />
          <path d="M75 21 121.8 48v54L75 129 28.2 102V48Z" pathLength="1" style={{ animationDelay: ".22s" }} />
          <path d="M75 75 121.8 48M75 75v54M75 75 28.2 48" pathLength="1" style={{ animationDelay: ".4s" }} />
          {[0, 1, 2, 3, 4, 5].map((k) => { const a = -Math.PI / 2 + (k / 6) * Math.PI * 2 + Math.PI / 6; return <line key={k} x1={75 + Math.cos(a) * 58} y1={75 + Math.sin(a) * 58} x2={75 + Math.cos(a) * 70} y2={75 + Math.sin(a) * 70} pathLength="1" style={{ animationDelay: `${0.5 + k * 0.04}s` }} />; })}
          <path className="mg-dolgu" d="M75 21 121.8 48 75 75 28.2 48Z" style={{ animationDelay: ".78s", transformOrigin: "75px 48px", transformBox: "view-box" }} />
        </svg>
        <div className="mg-yazi"><div className="mg-ad">{harfler("Diploma Programı", 380)}</div><div className="mg-alt">{altYazi}</div></div>
      </div></> : <>
      <div className="mg-koni mg-koni-1" /><div className="mg-koni mg-koni-2" />
      <div style={{ position: "relative", display: "grid", justifyItems: "center" }}>
        <div className="mg-forma">{harfler("FORMA", 240, 60)}</div><div className="mg-serit" />
        <div className="mg-alt" style={{ color: "#A9B0C6", marginTop: 14 }}>{altYazi}</div>
      </div></>}
  </div>;
}

/* İki konumlu anahtar: FORMA | IB */
export function ModAnahtar({ mod, degis, kucuk }) {
  return <button type="button" className="mod-anahtar" data-mod={mod} role="switch" aria-checked={mod === "ib"} aria-label={mod === "ib" ? "FORMA moduna geç" : "IB moduna geç"} title="Mod değiştir (kısayol: M)"
    onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); degis(mod === "ib" ? "forma" : "ib", { x: r.left + r.width / 2, y: r.top + r.height / 2 }); }} style={kucuk ? { minHeight: 34, fontSize: 12 } : undefined}>
    <i aria-hidden="true" /><span data-a={mod === "forma" ? 1 : 0}>FORMA</span><span data-a={mod === "ib" ? 1 : 0}>IB</span>
  </button>;
}
