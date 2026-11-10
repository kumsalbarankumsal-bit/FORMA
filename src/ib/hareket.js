/* IB modu · hareket çekirdeği: yay fiziği, sayı akışı, görünürlük, kademeli giriş.
   Kütüphane yok; her şey requestAnimationFrame + CSS. Azaltılmış hareket tercihi her yerde okunur. */
import { useEffect, useLayoutEffect, useRef, useState, useCallback, createContext, useContext } from "react";

export const IBOrtam = createContext({ tema: "gece", kalite: 2, az: false });
export const useOrtam = () => useContext(IBOrtam);

export const azMi = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
export const kis = (v, a, b) => Math.max(a, Math.min(b, v));
export const ara = (a, b, t) => a + (b - a) * t;
export const yumusak = { cik: (t) => 1 - Math.pow(1 - t, 3), cikSert: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), icDis: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  geri: (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };

/* yay: hedef değişince fizikle oraya gider (sertlik/sönüm). Dönen değer her karede güncellenir. */
export function useYay(hedef, { sertlik = 170, sonum = 22, gecikme = 0, bas = null } = {}) {
  const { az } = useOrtam();
  const [v, setV] = useState(bas == null ? hedef : bas);
  const d = useRef({ x: bas == null ? hedef : bas, hiz: 0, raf: 0, hedef, t: 0 });
  useEffect(() => {
    const s = d.current; s.hedef = hedef;
    if (az) { s.x = hedef; s.hiz = 0; setV(hedef); return; }
    cancelAnimationFrame(s.raf); let son = 0; let bekle = gecikme;
    const adim = (z) => {
      if (!son) son = z; let dt = Math.min(0.034, (z - son) / 1000); son = z;
      if (bekle > 0) { bekle -= dt * 1000; s.raf = requestAnimationFrame(adim); return; }
      /* yarı-örtük Euler, iki alt adım: büyük dt'de bile kararlı */
      for (let i = 0; i < 2; i++) { const h = dt / 2; const kuvvet = -sertlik * (s.x - s.hedef) - sonum * s.hiz; s.hiz += kuvvet * h; s.x += s.hiz * h; }
      if (Math.abs(s.hiz) < 0.002 && Math.abs(s.x - s.hedef) < 0.002) { s.x = s.hedef; s.hiz = 0; setV(s.x); return; }
      setV(s.x); s.raf = requestAnimationFrame(adim);
    };
    s.raf = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(s.raf);
  }, [hedef, sertlik, sonum, az]);
  return v;
}

/* süreli geçiş: 0→1 ilerleme (yumuşatmalı). tetik değişince baştan oynar. */
export function useIlerleme(tetik, { sure = 900, gecikme = 0, egri = yumusak.cik, acik = true } = {}) {
  const { az } = useOrtam();
  const [p, setP] = useState(az ? 1 : 0);
  useEffect(() => {
    if (!acik) { setP(0); return; }
    if (az) { setP(1); return; }
    let raf = 0, bas = 0; setP(0);
    const adim = (z) => { if (!bas) bas = z + gecikme; const t = kis((z - bas) / sure, 0, 1); setP(t <= 0 ? 0 : egri(t)); if (t < 1) raf = requestAnimationFrame(adim); };
    raf = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(raf);
  }, [tetik, acik, sure, gecikme, az]);
  return p;
}

/* eleman görüş alanına girdi mi (bir kez). */
export function useGorunur(ref, { esik = 0.18, kenar = "0px 0px -6% 0px" } = {}) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || g) return;
    if (typeof IntersectionObserver === "undefined") { setG(true); return; }
    const io = new IntersectionObserver((l) => { if (l.some((x) => x.isIntersecting)) { setG(true); io.disconnect(); } }, { threshold: esik, rootMargin: kenar });
    io.observe(el); return () => io.disconnect();
  }, [ref, g, esik, kenar]);
  return g;
}

/* kapsayıcı genişliği (grafikler için). */
export function useGenislik(ref, varsayilan = 600) {
  const [w, setW] = useState(varsayilan);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const olc = () => { const x = el.clientWidth; if (x > 0) setW(x); };
    olc();
    if (typeof ResizeObserver === "undefined") { window.addEventListener("resize", olc); return () => window.removeEventListener("resize", olc); }
    const ro = new ResizeObserver(olc); ro.observe(el); return () => ro.disconnect();
  }, [ref]);
  return w;
}

/* sayı akışı: değer değişince eski değerden yenisine sayar. */
export function useSayim(hedef, { sure = 800, gecikme = 0, acik = true } = {}) {
  const { az } = useOrtam();
  const [v, setV] = useState(acik && !az ? 0 : hedef);
  const onceki = useRef(acik && !az ? 0 : hedef);
  useEffect(() => {
    if (!acik) return;
    if (az || !isFinite(hedef)) { setV(hedef); onceki.current = hedef; return; }
    const a = onceki.current, b = hedef; let raf = 0, bas = 0;
    const adim = (z) => { if (!bas) bas = z + gecikme; const t = kis((z - bas) / sure, 0, 1); const y = t <= 0 ? a : ara(a, b, yumusak.cikSert(t)); onceki.current = y; setV(y); if (t < 1) raf = requestAnimationFrame(adim); else onceki.current = b; };
    raf = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(raf);
  }, [hedef, acik, sure, gecikme, az]);
  return v;
}

/* her saniye/dakika tetiklenen saat (geri sayımlar için). */
export function useSaat(ms = 1000) {
  const [t, setT] = useState(() => Date.now());
  useEffect(() => { const iv = setInterval(() => setT(Date.now()), ms); return () => clearInterval(iv); }, [ms]);
  return t;
}

/* işaretçi konumu → CSS değişkenleri (--ix, --iy): ışık takibi için. */
export function useIsik(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return; let raf = 0, ev = null;
    const uygula = () => { raf = 0; if (!ev) return; const r = el.getBoundingClientRect(); el.style.setProperty("--ix", ((ev.clientX - r.left) / r.width * 100).toFixed(1) + "%"); el.style.setProperty("--iy", ((ev.clientY - r.top) / r.height * 100).toFixed(1) + "%"); };
    const f = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(uygula); };
    el.addEventListener("pointermove", f); return () => { el.removeEventListener("pointermove", f); cancelAnimationFrame(raf); };
  }, [ref]);
}

/* tek seferlik "mühür" gibi kısa durumlar: tetikle() çağrılınca ms boyunca true. */
export function useAnlik(ms = 900) {
  const [a, setA] = useState(false); const t = useRef(0);
  const tetikle = useCallback(() => { setA(true); clearTimeout(t.current); t.current = setTimeout(() => setA(false), ms); }, [ms]);
  useEffect(() => () => clearTimeout(t.current), []);
  return [a, tetikle];
}
