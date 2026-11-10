/* Diploma Planı · kahraman çizim.
   45 hücrelik bir kat planı: altı dersin her biri 7 hücrelik bir kanat (7 puan), ortadaki küpün üç yüzü çekirdeğin
   (TOK + EE) üç puanı. Yanan her hücre kazanılmış bir puan; çerçeveli hücreler hedefe kadar kalan yol.
   Açılışta hücreler içten dışa yanar, sayaç onlarla birlikte sayar. */
import React, { useMemo, useRef, useState } from "react";
import { useIlerleme, useGorunur, useOrtam, kis } from "./hareket.js";

const TAU = Math.PI * 2;
const dilim = (cx, cy, r0, r1, a0, a1) => {
  const p = (r, a) => `${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  return `M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
};

export function DiplomaPlani({ dersler, cekirdekPuan, casOran = 0, sec, uz, setUz, aday, oturum }) {
  const kap = useRef(null); const gor = useGorunur(kap, { esik: 0.1 }); const { az } = useOrtam();
  const p = useIlerleme(gor ? 1 : 0, { sure: 2100, egri: (t) => t, acik: gor });
  const W = 640, H = 524, cx = 320, cy = 262, R0 = 72, KAL = 18, BOS = 2.4, N = dersler.length || 6;
  const acik = (TAU / N) * 0.9, bosA = (TAU / N) * 0.1;
  /* hücre sırası: halka halka içten dışa; her hücre kendi anında yanar */
  const an = (i, k) => 0.12 + ((k - 1) * N + i) / (7 * N) * 0.74;
  const hucreler = useMemo(() => dersler.map((d, i) => {
    const orta = -Math.PI / 2 + (i / N) * TAU; const a0 = orta - acik / 2, a1 = orta + acik / 2;
    const g = d.not == null ? 0 : d.not; const tam = Math.floor(g + 1e-6), kesir = g - tam;
    return { d, i, orta, a0, a1, hucre: [1, 2, 3, 4, 5, 6, 7].map((k) => ({ k, yol: dilim(cx, cy, R0 + (k - 1) * (KAL + BOS), R0 + (k - 1) * (KAL + BOS) + KAL, a0, a1),
      durum: k <= tam ? "yanik" : k === tam + 1 && kesir >= 0.25 ? "yarim" : d.hedef && k <= d.hedef ? "hedef" : "bos", kesir })) };
  }), [dersler]);
  const yanan = hucreler.reduce((s, w) => s + w.hucre.filter((h) => h.durum === "yanik" && p >= an(w.i, h.k)).length, 0) + (p > 0.9 ? cekirdekPuan || 0 : 0);
  const toplam = dersler.reduce((s, d) => s + Math.floor((d.not || 0) + 1e-6), 0) + (cekirdekPuan || 0);
  const hedefToplam = dersler.reduce((s, d) => s + (d.hedef || 0), 0) + 3;
  /* çekirdek: altıgen üç eşkenar dörtgene bölünür (küp) */
  const kose = (k, r = 54) => [cx + Math.cos(-Math.PI / 2 + (k / 6) * TAU) * r, cy + Math.sin(-Math.PI / 2 + (k / 6) * TAU) * r];
  const yuz = [[0, 1, 2], [2, 3, 4], [4, 5, 0]].map(([a, b, c]) => [kose(a), kose(b), kose(c), [cx, cy]].map((q) => q.map((x) => x.toFixed(1)).join(",")).join(" "));
  const casR = 63, casC = TAU * casR;
  return <div ref={kap} className="ib-plan">
    <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Diploma planı: toplam ${toplam} puan, hedef ${hedefToplam}`}>
      {/* pusula halkası */}
      <g className="ib-plan-pusula" opacity={kis(p * 3, 0, 1) * 0.55}>
        <circle cx={cx} cy={cy} r="252" className="ib-plan-cizgi" opacity=".5" />
        {Array.from({ length: 72 }, (_, t) => { const a = (t / 72) * TAU, u = t % 6 === 0; return <line key={t} x1={cx + Math.cos(a) * 252} y1={cy + Math.sin(a) * 252} x2={cx + Math.cos(a) * (u ? 242 : 247)} y2={cy + Math.sin(a) * (u ? 242 : 247)} className="ib-plan-cizgi" />; })}
      </g>
      {/* eksen çizgileri: plan kâğıdının yardımcı hatları */}
      {hucreler.map((w) => <line key={"e" + w.i} x1={cx + Math.cos(w.orta + (acik + bosA) / 2) * 60} y1={cy + Math.sin(w.orta + (acik + bosA) / 2) * 60} x2={cx + Math.cos(w.orta + (acik + bosA) / 2) * 236} y2={cy + Math.sin(w.orta + (acik + bosA) / 2) * 236}
        className="ib-plan-cizgi" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - kis(p * 4, 0, 1)} opacity=".6" />)}
      {/* kanatlar */}
      {hucreler.map((w) => { const soluk = uz && uz !== w.d.id; const it = uz === w.d.id && !az ? 7 : 0;
        const lx = cx + Math.cos(w.orta) * 232, ly = cy + Math.sin(w.orta) * 232; const ust = Math.abs(Math.cos(w.orta)) < 0.3; const tx = ust ? "middle" : Math.cos(w.orta) > 0 ? "start" : "end";
        const dy = ust ? (Math.sin(w.orta) < 0 ? -16 : 12) : 0;
        return <g key={w.d.id} role="button" tabIndex={0} aria-label={`${w.d.ad} ${w.d.duzey}: ${w.d.not == null ? "not yok" : "şimdi " + w.d.not.toFixed(1).replace(".", ",")}${w.d.hedef ? ", hedef " + w.d.hedef : ""}`}
          onClick={() => sec(w.d.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(w.d.id); } }}
          onPointerEnter={() => setUz(w.d.id)} onPointerLeave={() => setUz(null)} onFocus={() => setUz(w.d.id)} onBlur={() => setUz(null)}
          style={{ cursor: "pointer", outline: "none", opacity: soluk ? 0.32 : 1, transform: `translate(${Math.cos(w.orta) * it}px, ${Math.sin(w.orta) * it}px)`, transition: "opacity .25s, transform .35s cubic-bezier(.2,.9,.25,1.2)" }}>
          {w.hucre.map((h) => { const acildi = p >= an(w.i, h.k); const yeni = acildi && p - an(w.i, h.k) < 0.06 && p < 1;
            const dolu = h.durum === "yanik", yarim = h.durum === "yarim", hedef = h.durum === "hedef";
            return <path key={h.k} d={h.yol} className="ib-plan-hucre"
              fill={dolu || yarim ? w.d.renk : hedef ? w.d.renk : "var(--kare-2)"} fillOpacity={!acildi ? 0.04 : dolu ? 1 : yarim ? 0.45 : hedef ? 0.13 : 1}
              stroke={hedef || yarim ? w.d.renk : dolu ? "none" : "var(--cizgi)"} strokeWidth={hedef || yarim ? 1.4 : 1} strokeOpacity={acildi ? 1 : 0.3}
              style={{ filter: yeni && dolu ? "brightness(1.7)" : undefined }} />; })}
          <text x={lx} y={ly + dy} textAnchor={tx} className="ib-plan-yazi" opacity={kis(p * 2.4 - 0.4, 0, 1)}>{w.d.kisa}
            <tspan className="ib-plan-yazi-2" dx="6">{w.d.duzey}</tspan></text>
          <text x={lx} y={ly + dy + 16} textAnchor={tx} className="ib-plan-yazi-2" opacity={kis(p * 2.4 - 0.6, 0, 1)}>{w.d.not == null ? "not yok" : w.d.not.toFixed(1).replace(".", ",")}{w.d.hedef ? ` → ${w.d.hedef}` : ""}</text>
        </g>; })}
      {/* çekirdek küp + CAS halkası */}
      <circle cx={cx} cy={cy} r={casR} fill="none" stroke="var(--cizgi)" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={casR} fill="none" stroke="var(--vurgu)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${casC * kis(casOran, 0, 1) * kis(p * 1.4, 0, 1)} ${casC}`} transform={`rotate(-90 ${cx} ${cy})`} />
      <g role="button" tabIndex={0} aria-label={`Çekirdek: ${cekirdekPuan == null ? "puan belirsiz" : cekirdekPuan + " puan"}, CAS %${Math.round(casOran * 100)}`} onClick={() => sec("cekirdek")} onKeyDown={(e) => { if (e.key === "Enter") sec("cekirdek"); }} style={{ cursor: "pointer", outline: "none" }}
        onPointerEnter={() => setUz("cekirdek")} onPointerLeave={() => setUz(null)}>
        {yuz.map((pts, k) => { const dolu = (cekirdekPuan || 0) > k && p > 0.86 + k * 0.035;
          return <polygon key={k} points={pts} fill={dolu ? "var(--altin)" : "var(--kare-2)"} fillOpacity={dolu ? [1, 0.82, 0.66][k] : 1} stroke="var(--cizgi-2)" strokeWidth="1" style={{ transition: "fill .4s, fill-opacity .4s" }} />; })}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0 }}>
      <div className="ib-ucuncul ib-kucuk">Toplam puan</div>
      <div className="ib-kahraman ib-sayi" aria-live="polite">{yanan}<span style={{ fontSize: 24, fontWeight: 600, color: "var(--murekkep-3)", letterSpacing: 0 }}> / 45</span></div>
      <div className="ib-kucuk ib-ikincil" style={{ marginTop: 6 }}>Hedef {hedefToplam}</div>
    </div>
    <div style={{ marginLeft: "auto", marginTop: 6 }} className="ib-antet" aria-hidden="true">
      <div><span>Aday</span><b>{aday}</b></div><div><span>Oturum</span><b>{oturum}</b></div><div><span>Dersler</span><b>{toplam - (cekirdekPuan || 0)} / 42</b></div><div><span>Çekirdek</span><b>{cekirdekPuan == null ? "–" : cekirdekPuan} / 3</b></div>
    </div>
  </div>;
}
