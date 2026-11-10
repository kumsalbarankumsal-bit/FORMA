/* IB modu · görsel dil: "mavi kopya" (blueprint). Diploma bir yapı gibi çizilir: ince çizgiler, ölçü işaretleri,
   pafta köşeleri, antet. Gece teması koyu IB laciverti, gündüz teması beyaz kâğıt üstünde mavi mürekkep.
   Yazı: gövde ve sayılar Atkinson Hyperlegible Next (okunabilirlik için tasarlandı), başlıklar Fraunces. */
export const IB_YAZI = "'Atkinson Hyperlegible Next','Atkinson Hyperlegible',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
export const IB_BASLIK = "'Fraunces','Iowan Old Style','Palatino Linotype',Georgia,serif";
export function ibYaziYukle() {
  try { if (document.getElementById("ib-yazi")) return; const l = document.createElement("link"); l.id = "ib-yazi"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap"; document.head.appendChild(l); } catch (e) {}
}

export const IB_CSS = `
.ib-kok { --yay: cubic-bezier(.2,.9,.25,1.12); --cik: cubic-bezier(.23,1,.32,1); --r: 10px;
  --d1:#d95926; --d2:#199e70; --d3:#c98500; --d4:#d55181; --d5:#008300; --d6:#9085e9;
  --iyi:#0ca30c; --uyari:#fab219; --ciddi:#ec835a; --kritik:#e25555;
  position: relative; min-height: 100vh; color: var(--murekkep); font-family: ${IB_YAZI}; font-size: 15px; line-height: 1.5; background: var(--zemin); isolation: isolate; -webkit-font-smoothing: antialiased; }
.ib-kok[data-tema="gece"] { color-scheme: dark; --zemin:#06142E; --yuzey:#0C2250; --yuzey-2:#102A5C; --yuzey-3:#16356F; --murekkep:#EEF4FF; --murekkep-2:#B4C7EA; --murekkep-3:#7F98C6;
  --cizgi: rgba(150,190,255,.18); --cizgi-2: rgba(150,190,255,.34); --izgara: rgba(150,190,255,.14); --kare: rgba(120,170,255,.055); --kare-2: rgba(120,170,255,.11);
  --vurgu:#6FB1FF; --vurgu-koyu:#2F6FD0; --vurgu-yazi:#06142E; --marka:#2F6FD0; --altin:#F2C14E; --golge: 0 18px 40px -22px rgba(0,0,0,.7);
  --isi-0: rgba(150,190,255,.08); --isi-1:#184f95; --isi-2:#256abf; --isi-3:#3987e5; --isi-4:#6da7ec; --isi-5:#b7d3f6; }
.ib-kok[data-tema="gunduz"] { color-scheme: light; --zemin:#EEF3FA; --yuzey:#FFFFFF; --yuzey-2:#F4F7FC; --yuzey-3:#E6EDF8; --murekkep:#0A1D42; --murekkep-2:#3B5180; --murekkep-3:#6B7FA6;
  --cizgi: rgba(20,62,140,.16); --cizgi-2: rgba(20,62,140,.36); --izgara: rgba(20,62,140,.12); --kare: rgba(20,62,140,.045); --kare-2: rgba(20,62,140,.09);
  --vurgu:#1F5FBF; --vurgu-koyu:#174A96; --vurgu-yazi:#FFFFFF; --marka:#1F5FBF; --altin:#A66B00; --golge: 0 14px 30px -20px rgba(16,44,100,.35);
  --d1:#eb6834; --d2:#1baf7a; --d3:#eda100; --d4:#e87ba4; --d5:#008300; --d6:#6250d6; --kritik:#d03b3b;
  --isi-0: rgba(20,62,140,.07); --isi-1:#b7d3f6; --isi-2:#86b6ef; --isi-3:#5598e7; --isi-4:#256abf; --isi-5:#104281; }
.ib-kok *, .ib-kok *::before, .ib-kok *::after { box-sizing: border-box; }
.ib-kok::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image: linear-gradient(var(--kare-2) 1px, transparent 1px), linear-gradient(90deg, var(--kare-2) 1px, transparent 1px), linear-gradient(var(--kare) 1px, transparent 1px), linear-gradient(90deg, var(--kare) 1px, transparent 1px);
  background-size: 160px 160px, 160px 160px, 32px 32px, 32px 32px; background-position: -1px -1px; }
.ib-kok::after { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(70% 55% at 22% 0%, color-mix(in srgb, var(--marka) 26%, transparent), transparent 70%); }
.ib-kok h1, .ib-kok h2, .ib-kok h3, .ib-kok p { margin: 0; }
.ib-kok button { font-family: inherit; color: inherit; }
.ib-kok :focus-visible { outline: 2px solid var(--vurgu); outline-offset: 2px; border-radius: 6px; }
.ib-gizli { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* ── iskelet ── */
.ib-iskelet { display: grid; grid-template-columns: 208px minmax(0,1fr); min-height: 100vh; }
.ib-ray { position: sticky; top: 0; align-self: start; height: 100vh; display: flex; flex-direction: column; gap: 4px; padding: 16px 12px; border-right: 1px solid var(--cizgi); background: color-mix(in srgb, var(--zemin) 82%, transparent); backdrop-filter: blur(8px); overflow-y: auto; }
.ib-amblem { display: flex; align-items: center; gap: 10px; padding: 4px 6px 14px; }
.ib-amblem-ad { font-family: ${IB_BASLIK}; font-weight: 700; font-size: 19px; line-height: 1.05; letter-spacing: -.01em; }
.ib-amblem-alt { font-size: 12px; color: var(--murekkep-3); }
.ib-ray-oge { position: relative; display: flex; align-items: center; gap: 11px; min-height: 44px; padding: 0 12px; border: none; border-radius: 8px; background: transparent; cursor: pointer; font-size: 15px; font-weight: 500; color: var(--murekkep-2); text-align: left; transition: background .16s, color .16s, transform .16s var(--cik); }
.ib-ray-oge:hover { background: var(--kare-2); color: var(--murekkep); }
.ib-ray-oge:active { transform: scale(.97); }
.ib-ray-oge[aria-current="page"] { color: var(--murekkep); font-weight: 700; }
.ib-ray-oge svg { flex: 0 0 auto; }
.ib-ray-isaret { position: absolute; left: 0; width: 100%; height: 44px; border-radius: 8px; background: color-mix(in srgb, var(--vurgu) 16%, transparent); box-shadow: inset 2px 0 0 var(--vurgu), inset 0 0 0 1px var(--cizgi); transition: transform .42s var(--yay); pointer-events: none; }
.ib-ray-rozet { margin-left: auto; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; display: grid; place-items: center; font-size: 12px; font-weight: 700; background: var(--altin); color: #1b1400; }
.ib-ray-alt { margin-top: auto; display: grid; gap: 8px; padding-top: 12px; }
.ib-ana { min-width: 0; padding: 0 22px 60px; }
.ib-ust { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 14px; padding: 12px 0; margin-bottom: 6px; background: linear-gradient(var(--zemin) 62%, transparent); }
.ib-ust-bas { flex: 1 1 auto; min-width: 0; }
.ib-baslik { font-family: ${IB_BASLIK}; font-weight: 600; font-size: 30px; line-height: 1.08; letter-spacing: -.015em; }
.ib-altbaslik { color: var(--murekkep-2); font-size: 14px; margin-top: 2px; }
.ib-dock { display: none; }
@media (max-width: 880px) { .ib-iskelet { grid-template-columns: minmax(0,1fr); } .ib-ray { display: none; } .ib-ana { padding: 0 12px 96px; }
  .ib-dock { display: flex; position: fixed; left: 8px; right: 8px; bottom: 8px; z-index: 40; gap: 2px; padding: 6px; border-radius: 14px; background: color-mix(in srgb, var(--yuzey) 94%, transparent); backdrop-filter: blur(10px); box-shadow: inset 0 0 0 1px var(--cizgi-2), var(--golge); overflow-x: auto; }
  .ib-dock button { flex: 1 0 58px; display: grid; justify-items: center; gap: 2px; min-height: 50px; border: none; background: transparent; border-radius: 10px; font-size: 11px; color: var(--murekkep-2); }
  .ib-dock button[aria-current="page"] { background: color-mix(in srgb, var(--vurgu) 18%, transparent); color: var(--murekkep); font-weight: 700; }
  .ib-baslik { font-size: 24px; } }

/* ── pafta (panel): çizim kâğıdı; köşelerde hizalama işaretleri ── */
.ib-pafta { position: relative; padding: 16px 18px 18px; border-radius: var(--r); background: var(--yuzey); box-shadow: inset 0 0 0 1px var(--cizgi), var(--golge); min-width: 0; }
.ib-pafta::before, .ib-pafta::after { content: ""; position: absolute; width: 11px; height: 11px; pointer-events: none; border: 0 solid var(--cizgi-2); }
.ib-pafta::before { left: 5px; top: 5px; border-left-width: 1.5px; border-top-width: 1.5px; border-top-left-radius: 5px; }
.ib-pafta::after { right: 5px; bottom: 5px; border-right-width: 1.5px; border-bottom-width: 1.5px; border-bottom-right-radius: 5px; }
.ib-pafta-bas { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.ib-pafta-bas h3 { font-size: 16px; font-weight: 700; line-height: 1.25; }
.ib-pafta-bas p { font-size: 13px; color: var(--murekkep-2); margin-top: 2px; }
.ib-pafta-sag { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }
.ib-pafta-tik { cursor: pointer; transition: transform .2s var(--cik), box-shadow .2s; border: none; text-align: left; width: 100%; font: inherit; color: inherit; display: block; }
.ib-pafta-tik:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px var(--cizgi-2), var(--golge); }
.ib-pafta-tik:active { transform: scale(.985); }
.ib-vurgulu { background: linear-gradient(160deg, color-mix(in srgb, var(--marka) 34%, var(--yuzey)), var(--yuzey) 70%); }
.ib-izg { display: grid; gap: 14px; }
.ib-sira { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ib-ayrac { height: 1px; background: var(--cizgi); margin: 12px 0; border: 0; }
.ib-ikincil { color: var(--murekkep-2); } .ib-ucuncul { color: var(--murekkep-3); } .ib-kucuk { font-size: 13px; } .ib-minik { font-size: 12px; }
.ib-kalin { font-weight: 700; } .ib-sayi { font-variant-numeric: lining-nums; }
.ib-kahraman { font-size: 64px; font-weight: 800; line-height: .95; letter-spacing: -.03em; }
.ib-buyuk { font-size: 34px; font-weight: 800; line-height: 1; letter-spacing: -.02em; }
.ib-orta { font-size: 22px; font-weight: 700; line-height: 1.1; }

/* ── ekran girişi: çocuklar sırayla yerine oturur ── */
.ib-ekran > * { animation: ibGir .52s var(--cik) both; animation-delay: calc(var(--i, 0) * 55ms); }
.ib-ekran > *:nth-child(1) { --i: 0; } .ib-ekran > *:nth-child(2) { --i: 1; } .ib-ekran > *:nth-child(3) { --i: 2; } .ib-ekran > *:nth-child(4) { --i: 3; } .ib-ekran > *:nth-child(5) { --i: 4; } .ib-ekran > *:nth-child(6) { --i: 5; } .ib-ekran > *:nth-child(n+7) { --i: 6; }
@keyframes ibGir { from { opacity: 0; transform: translateY(14px) scale(.985); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes ibBelir { from { opacity: 0; } to { opacity: 1; } }
@keyframes ibYuksel { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ── düğmeler, girdiler ── */
.ib-dugme { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; padding: 0 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 700; background: var(--vurgu); color: var(--vurgu-yazi) !important; transition: transform .16s var(--cik), filter .16s, box-shadow .16s; white-space: nowrap; }
.ib-dugme:hover { filter: brightness(1.08); } .ib-dugme:active { transform: scale(.97); } .ib-dugme:disabled { opacity: .45; cursor: default; }
.ib-dugme-ikincil { background: transparent; color: var(--murekkep) !important; box-shadow: inset 0 0 0 1.5px var(--cizgi-2); }
.ib-dugme-ikincil:hover { background: var(--kare-2); }
.ib-dugme-ince { min-height: 32px; padding: 0 11px; font-size: 13px; font-weight: 600; background: transparent; color: var(--murekkep-2) !important; box-shadow: inset 0 0 0 1px var(--cizgi-2); }
.ib-dugme-ince[aria-pressed="true"] { background: color-mix(in srgb, var(--vurgu) 18%, transparent); color: var(--murekkep) !important; box-shadow: inset 0 0 0 1.5px var(--vurgu); }
.ib-dugme-tehlike { background: transparent; color: var(--kritik) !important; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--kritik) 60%, transparent); }
.ib-ikon-dugme { width: 40px; height: 40px; display: grid; place-items: center; border: none; border-radius: 8px; background: transparent; cursor: pointer; color: var(--murekkep-2); transition: background .16s, transform .16s var(--cik); }
.ib-ikon-dugme:hover { background: var(--kare-2); color: var(--murekkep); } .ib-ikon-dugme:active { transform: scale(.94); }
.ib-girdi, .ib-secim, .ib-alan { width: 100%; min-height: 42px; padding: 8px 12px; border-radius: 8px; border: none; background: var(--yuzey-2); color: var(--murekkep); font: inherit; box-shadow: inset 0 0 0 1px var(--cizgi-2); transition: box-shadow .16s; }
.ib-alan { min-height: 88px; resize: vertical; line-height: 1.5; }
.ib-girdi:focus, .ib-secim:focus, .ib-alan:focus { outline: none; box-shadow: inset 0 0 0 2px var(--vurgu); }
.ib-etiket { display: grid; gap: 5px; font-size: 13px; font-weight: 600; color: var(--murekkep-2); min-width: 0; }
.ib-form { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); align-items: end; }
.ib-cip { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 10px; border-radius: 14px; font-size: 13px; font-weight: 600; background: var(--kare-2); color: var(--murekkep-2); box-shadow: inset 0 0 0 1px var(--cizgi); white-space: nowrap; }
.ib-cip i { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
.ib-cip-sec { cursor: pointer; border: none; transition: background .16s, transform .16s var(--cik); }
.ib-cip-sec:active { transform: scale(.96); }
.ib-cip-sec[aria-pressed="true"], .ib-cip-sec[aria-checked="true"] { background: color-mix(in srgb, var(--vurgu) 22%, transparent); color: var(--murekkep); box-shadow: inset 0 0 0 1.5px var(--vurgu); }
.ib-duzey { display: inline-grid; place-items: center; min-width: 30px; height: 20px; padding: 0 6px; border-radius: 4px; font-size: 11.5px; font-weight: 800; letter-spacing: .02em; box-shadow: inset 0 0 0 1.5px var(--cizgi-2); color: var(--murekkep-2); }
.ib-duzey-hl { background: var(--murekkep); color: var(--yuzey); box-shadow: none; }
.ib-durum { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; }
.ib-durum svg { flex: 0 0 auto; }
.ib-nokta { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex: 0 0 auto; }
.ib-sekmeler { position: relative; display: inline-flex; gap: 2px; padding: 4px; border-radius: 10px; background: var(--kare-2); box-shadow: inset 0 0 0 1px var(--cizgi); max-width: 100%; overflow-x: auto; }
.ib-sekmeler button { position: relative; z-index: 1; min-height: 36px; padding: 0 14px; border: none; border-radius: 7px; background: transparent; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--murekkep-2); white-space: nowrap; transition: color .2s; }
.ib-sekmeler button[aria-selected="true"] { color: var(--vurgu-yazi); }
.ib-sekme-hap { position: absolute; z-index: 0; top: 4px; bottom: 4px; left: 0; border-radius: 7px; background: var(--vurgu); transition: transform .38s var(--yay), width .38s var(--yay); }

/* ── grafik ── */
.ib-grafik { position: relative; width: 100%; touch-action: pan-y; }
.ib-grafik svg { display: block; overflow: visible; }
.ib-grafik-bos { display: grid; place-items: center; color: var(--murekkep-3); font-size: 14px; border-radius: 8px; background: repeating-linear-gradient(135deg, transparent 0 9px, var(--kare) 9px 10px); text-align: center; padding: 12px; }
.ib-izgara { stroke: var(--izgara); stroke-width: 1; fill: none; }
.ib-eksen { font-size: 11.5px; fill: var(--murekkep-3); font-family: ${IB_YAZI}; font-variant-numeric: tabular-nums; }
.ib-eksen-ad { font-size: 12.5px; fill: var(--murekkep-2); font-weight: 600; }
.ib-eksen-bant { fill: var(--altin); font-weight: 700; }
.ib-bant { stroke: var(--altin); stroke-width: 1; opacity: .5; }
.ib-imlec { stroke: var(--murekkep-2); stroke-width: 1; }
.ib-uc-etiket { font-size: 12.5px; font-weight: 700; fill: var(--murekkep); font-family: ${IB_YAZI}; transition: opacity .3s; }
.ib-ipucu { position: absolute; z-index: 5; min-width: 120px; max-width: 240px; padding: 8px 10px; border-radius: 8px; background: var(--yuzey-3); box-shadow: inset 0 0 0 1px var(--cizgi-2), 0 10px 24px -10px rgba(0,0,0,.5); pointer-events: none; font-size: 13px; animation: ibBelir .12s both; }
.ib-ipucu-bas { color: var(--murekkep-2); font-size: 12px; margin-bottom: 3px; }
.ib-ipucu-satir { display: flex; align-items: center; gap: 7px; } .ib-ipucu-satir i { width: 12px; height: 3px; border-radius: 2px; flex: 0 0 auto; }
.ib-ipucu-satir b { font-weight: 700; } .ib-ipucu-satir span { color: var(--murekkep-2); }
.ib-lejant { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-bottom: 8px; font-size: 13px; color: var(--murekkep-2); }
.ib-lejant-oge { display: inline-flex; align-items: center; gap: 6px; }
.ib-anahtar-cizgi { width: 14px; height: 3px; border-radius: 2px; } .ib-anahtar-kare { width: 10px; height: 10px; border-radius: 3px; }
.ib-halka { position: relative; display: inline-grid; place-items: center; flex: 0 0 auto; }
.ib-halka svg { position: absolute; inset: 0; } .ib-halka-ic { position: relative; display: grid; justify-items: center; line-height: 1.05; text-align: center; }
.ib-kivilcim-bos { display: inline-block; border-bottom: 1px solid var(--izgara); }
.ib-cubuklar { display: grid; gap: 8px; }
.ib-cubuk-satir { display: grid; align-items: center; gap: 10px; min-height: 30px; border: none; background: transparent; padding: 2px 4px; border-radius: 6px; text-align: left; width: 100%; font: inherit; color: inherit; }
.ib-tik { cursor: pointer; transition: background .16s; } .ib-tik:hover { background: var(--kare-2); } .ib-secili { background: var(--kare-2); box-shadow: inset 0 0 0 1px var(--cizgi-2); }
.ib-cubuk-ad { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: grid; } .ib-cubuk-ad small { font-size: 12px; font-weight: 400; color: var(--murekkep-3); }
.ib-cubuk-ray { position: relative; display: block; border-left: 1px solid var(--cizgi-2); }
.ib-cubuk-dolgu { display: block; height: 100%; border-radius: 0 4px 4px 0; transition: width .9s var(--cik), filter .15s; min-width: 0; }
.ib-cubuk-hedef { position: absolute; top: -4px; bottom: -4px; width: 2px; background: var(--murekkep); border-radius: 1px; }
.ib-cubuk-deger { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; text-align: right; display: grid; } .ib-cubuk-deger small { font-size: 12px; font-weight: 400; color: var(--murekkep-3); }
.ib-isi-0 { fill: var(--isi-0); background: var(--isi-0); } .ib-isi-1 { fill: var(--isi-1); background: var(--isi-1); } .ib-isi-2 { fill: var(--isi-2); background: var(--isi-2); } .ib-isi-3 { fill: var(--isi-3); background: var(--isi-3); } .ib-isi-4 { fill: var(--isi-4); background: var(--isi-4); } .ib-isi-5 { fill: var(--isi-5); background: var(--isi-5); }
.ib-isi-olcek { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--murekkep-3); } .ib-isi-olcek i { width: 12px; height: 12px; border-radius: 3px; }
.ib-gosterge { position: relative; } .ib-gosterge-alt { position: absolute; left: 0; right: 0; bottom: 0; text-align: center; }
.ib-bolumlu { display: flex; gap: 2px; width: 100%; } .ib-bolumlu span { display: block; border-radius: 4px; min-width: 0; transition: flex-grow .9s var(--cik); }
.ib-olcer { position: relative; display: block; width: 100%; border-radius: 4px; overflow: visible; } .ib-olcer > span { display: block; height: 100%; border-radius: 4px; transition: width 1s var(--cik); }
.ib-olcer > i { position: absolute; top: -3px; bottom: -3px; width: 2px; background: var(--murekkep); }
.ib-tablo-kap { overflow-x: auto; }
.ib-tablo { width: 100%; border-collapse: collapse; font-size: 14px; } .ib-tablo th { text-align: left; font-size: 12.5px; font-weight: 600; color: var(--murekkep-3); padding: 6px 10px 6px 0; border-bottom: 1px solid var(--cizgi-2); white-space: nowrap; }
.ib-tablo td { padding: 9px 10px 9px 0; border-bottom: 1px solid var(--cizgi); vertical-align: middle; font-variant-numeric: tabular-nums; } .ib-tablo tr:last-child td { border-bottom: none; }

/* ── diploma planı (kahraman çizim) ── */
.ib-plan { position: relative; width: 100%; }
.ib-plan svg { display: block; width: 100%; height: auto; overflow: visible; }
.ib-plan-hucre { transition: opacity .25s, transform .3s var(--yay), fill-opacity .3s; transform-box: fill-box; transform-origin: center; cursor: pointer; }
.ib-plan-cizgi { fill: none; stroke: var(--cizgi-2); stroke-width: 1; }
.ib-plan-olcu { fill: none; stroke: var(--murekkep-3); stroke-width: 1; }
.ib-plan-yazi { font-family: ${IB_YAZI}; fill: var(--murekkep); font-size: 14px; font-weight: 700; }
.ib-plan-yazi-2 { font-family: ${IB_YAZI}; fill: var(--murekkep-2); font-size: 12px; }
.ib-plan-pusula { transform-origin: center; transform-box: fill-box; animation: ibDon 140s linear infinite; }
@keyframes ibDon { to { transform: rotate(360deg); } }
.ib-antet { display: grid; grid-template-columns: repeat(4, auto); border: 1px solid var(--cizgi-2); border-radius: 6px; overflow: hidden; font-size: 12px; width: max-content; max-width: 100%; }
.ib-antet > div { padding: 5px 10px; border-right: 1px solid var(--cizgi); display: grid; } .ib-antet > div:last-child { border-right: none; }
.ib-antet span { color: var(--murekkep-3); font-size: 11px; } .ib-antet b { font-size: 13.5px; font-weight: 700; }

/* ── geri sayım: çevrilen rakamlar ── */
.ib-sayac { display: inline-flex; gap: 10px; align-items: flex-end; }
.ib-sayac-grup { display: grid; justify-items: center; gap: 3px; } .ib-sayac-grup small { font-size: 12px; color: var(--murekkep-3); }
.ib-rakamlar { display: inline-flex; gap: 3px; }
.ib-rakam { position: relative; width: 30px; height: 44px; border-radius: 6px; background: var(--yuzey-3); box-shadow: inset 0 0 0 1px var(--cizgi-2); overflow: hidden; font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums; }
.ib-rakam::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--zemin); opacity: .6; }
.ib-rakam-serit { display: grid; transition: transform .6s var(--yay); } .ib-rakam-serit span { height: 44px; display: grid; place-items: center; }
.ib-rakam-b { width: 44px; height: 62px; font-size: 40px; } .ib-rakam-b .ib-rakam-serit span { height: 62px; }

/* ── zaman şeridi ── */
.ib-serit { position: relative; overflow-x: auto; padding: 8px 0 4px; scrollbar-width: thin; }
.ib-serit-ic { position: relative; height: 150px; }
.ib-serit-hat { position: absolute; left: 0; right: 0; top: 74px; height: 2px; background: var(--cizgi-2); }
.ib-serit-ay { position: absolute; top: 80px; font-size: 12px; color: var(--murekkep-3); border-left: 1px solid var(--cizgi-2); padding-left: 5px; height: 16px; white-space: nowrap; }
.ib-serit-bugun { position: absolute; top: 20px; bottom: 30px; width: 2px; background: var(--altin); } .ib-serit-bugun::after { content: "Bugün"; position: absolute; top: -18px; left: -18px; font-size: 12px; font-weight: 700; color: var(--altin); }
.ib-serit-oge { position: absolute; display: grid; justify-items: center; gap: 4px; transform: translateX(-50%); border: none; background: transparent; cursor: pointer; padding: 0; color: inherit; font: inherit; }
.ib-serit-ust { top: 6px; flex-direction: column; } .ib-serit-altk { top: 66px; }
.ib-serit-nokta { width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 0 3px var(--yuzey), 0 0 0 4px var(--cizgi-2); transition: transform .2s var(--yay); }
.ib-serit-oge:hover .ib-serit-nokta { transform: scale(1.25); }
.ib-serit-ad { font-size: 12px; font-weight: 600; max-width: 110px; text-align: center; line-height: 1.2; color: var(--murekkep-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ib-nabiz { animation: ibNabiz 2.2s ease-in-out infinite; } @keyframes ibNabiz { 0%,100% { box-shadow: 0 0 0 3px var(--yuzey), 0 0 0 4px var(--altin); } 50% { box-shadow: 0 0 0 3px var(--yuzey), 0 0 0 9px color-mix(in srgb, var(--altin) 0%, transparent); } }

/* ── liste satırları ── */
.ib-liste { display: grid; } .ib-satir { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--cizgi); min-width: 0; } .ib-satir:last-child { border-bottom: none; }
.ib-satir-ana { flex: 1 1 auto; min-width: 0; } .ib-satir-ad { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .ib-satir-alt { font-size: 13px; color: var(--murekkep-2); }
.ib-onay { width: 24px; height: 24px; flex: 0 0 24px; border-radius: 6px; border: none; cursor: pointer; background: transparent; box-shadow: inset 0 0 0 1.5px var(--cizgi-2); display: grid; place-items: center; transition: background .2s, transform .2s var(--yay); color: var(--vurgu-yazi); }
.ib-onay[aria-checked="true"] { background: var(--vurgu); box-shadow: none; } .ib-onay:active { transform: scale(.88); }
.ib-onay path { stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset .3s .05s; } .ib-onay[aria-checked="true"] path { stroke-dashoffset: 0; }
.ib-bos { display: grid; justify-items: start; gap: 8px; padding: 18px; border-radius: 8px; background: repeating-linear-gradient(135deg, transparent 0 9px, var(--kare) 9px 10px); color: var(--murekkep-2); font-size: 14px; }

/* ── aşama hattı (IA / EE boru hattı) ── */
.ib-asama { display: flex; align-items: flex-start; gap: 0; overflow-x: auto; padding: 4px 2px 2px; }
.ib-asama-oge { position: relative; flex: 1 0 86px; display: grid; justify-items: center; gap: 6px; border: none; background: transparent; cursor: pointer; padding: 0 4px; color: var(--murekkep-3); font: inherit; font-size: 12px; text-align: center; line-height: 1.2; }
.ib-asama-oge::before { content: ""; position: absolute; top: 11px; left: -50%; width: 100%; height: 2px; background: var(--cizgi-2); } .ib-asama-oge:first-child::before { display: none; }
.ib-asama-oge[data-d="bitti"]::before, .ib-asama-oge[data-d="simdi"]::before { background: var(--vurgu); }
.ib-asama-top { position: relative; z-index: 1; width: 24px; height: 24px; border-radius: 50%; background: var(--yuzey); box-shadow: inset 0 0 0 2px var(--cizgi-2); display: grid; place-items: center; font-size: 12px; font-weight: 700; transition: transform .25s var(--yay), background .25s; }
.ib-asama-oge[data-d="bitti"] .ib-asama-top { background: var(--vurgu); color: var(--vurgu-yazi); box-shadow: none; }
.ib-asama-oge[data-d="simdi"] .ib-asama-top { box-shadow: inset 0 0 0 2px var(--vurgu), 0 0 0 5px color-mix(in srgb, var(--vurgu) 22%, transparent); color: var(--murekkep); transform: scale(1.12); }
.ib-asama-oge[data-d="simdi"] { color: var(--murekkep); font-weight: 700; } .ib-asama-oge[data-d="bitti"] { color: var(--murekkep-2); }

/* ── damga ── */
.ib-damga { display: inline-grid; place-items: center; padding: 3px 10px; border: 2px solid currentColor; border-radius: 6px; font-weight: 800; font-size: 12.5px; letter-spacing: .06em; transform: rotate(-6deg); color: var(--iyi); opacity: .92; }
.ib-damga-vur { animation: ibDamga .5s var(--yay) both; } @keyframes ibDamga { 0% { opacity: 0; transform: rotate(-16deg) scale(2.4); } 60% { opacity: 1; transform: rotate(-4deg) scale(.94); } 100% { transform: rotate(-6deg) scale(1); } }

/* ── kaydırak (what-if) ── */
.ib-kaydirak { -webkit-appearance: none; appearance: none; width: 100%; height: 28px; background: transparent; cursor: pointer; }
.ib-kaydirak::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: linear-gradient(90deg, var(--vurgu) var(--o, 50%), color-mix(in srgb, var(--vurgu) 18%, transparent) var(--o, 50%)); }
.ib-kaydirak::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; margin-top: -8px; border-radius: 50%; background: var(--murekkep); box-shadow: 0 0 0 3px var(--yuzey), 0 2px 8px rgba(0,0,0,.4); transition: transform .15s var(--yay); }
.ib-kaydirak:active::-webkit-slider-thumb { transform: scale(1.18); }
.ib-kaydirak::-moz-range-track { height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--vurgu) 18%, transparent); } .ib-kaydirak::-moz-range-progress { height: 8px; border-radius: 4px; background: var(--vurgu); }
.ib-kaydirak::-moz-range-thumb { width: 22px; height: 22px; border: none; border-radius: 50%; background: var(--murekkep); }

/* ── çekmece / pencere ── */
.ib-perde { position: fixed; inset: 0; z-index: 120; background: color-mix(in srgb, var(--zemin) 72%, transparent); backdrop-filter: blur(4px); animation: ibBelir .2s both; display: flex; justify-content: flex-end; }
.ib-cekmece { width: min(560px, 100%); height: 100%; overflow-y: auto; background: var(--yuzey); box-shadow: -1px 0 0 var(--cizgi-2), -30px 0 60px -30px rgba(0,0,0,.6); padding: 20px 22px 40px; animation: ibCek .36s var(--cik) both; }
@keyframes ibCek { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }
.ib-pencere-kap { justify-content: center; align-items: center; padding: 16px; }
.ib-pencere { width: min(620px, 100%); max-height: 100%; overflow-y: auto; border-radius: 14px; background: var(--yuzey); box-shadow: inset 0 0 0 1px var(--cizgi-2), 0 30px 80px -20px rgba(0,0,0,.7); padding: 22px; animation: ibPencere .34s var(--yay) both; }
@keyframes ibPencere { from { transform: scale(.95) translateY(10px); opacity: 0; } to { transform: none; opacity: 1; } }

/* ── hızlı ekle (sağ alt) ── */
.ib-hizli { position: fixed; right: 18px; bottom: 18px; z-index: 60; display: grid; justify-items: end; gap: 8px; }
.ib-hizli-ana { width: 56px; height: 56px; border-radius: 16px; border: none; cursor: pointer; background: var(--vurgu); color: var(--vurgu-yazi); display: grid; place-items: center; box-shadow: 0 14px 30px -10px color-mix(in srgb, var(--vurgu) 70%, transparent); transition: transform .3s var(--yay); }
.ib-hizli-ana[aria-expanded="true"] { transform: rotate(45deg); } .ib-hizli-ana:active { transform: scale(.94); }
.ib-hizli-oge { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 14px; border: none; border-radius: 12px; cursor: pointer; background: var(--yuzey-3); color: var(--murekkep); font-weight: 600; font-size: 14px; box-shadow: inset 0 0 0 1px var(--cizgi-2), var(--golge); animation: ibYuksel .28s var(--yay) both; }
@media (max-width: 880px) { .ib-hizli { bottom: 78px; right: 12px; } }

/* ── nefes halkası ── */
.ib-nefes { position: relative; width: 240px; height: 240px; display: grid; place-items: center; }
.ib-nefes-daire { position: absolute; inset: 20px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--vurgu) 70%, #fff), var(--marka) 70%); box-shadow: 0 0 60px color-mix(in srgb, var(--vurgu) 45%, transparent); transition: transform var(--ns, 4s) cubic-bezier(.4,0,.2,1), opacity var(--ns, 4s); }
.ib-nefes-iz { position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--cizgi-2); } .ib-nefes-iz:nth-child(2) { inset: 26px; opacity: .6; }
.ib-nefes-yazi { position: relative; font-weight: 800; font-size: 20px; color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,.4); text-align: center; }

/* ── bildirim şeridi ── */
.ib-tost { position: fixed; left: 50%; bottom: 26px; z-index: 200; transform: translateX(-50%); padding: 11px 16px; border-radius: 10px; background: var(--murekkep); color: var(--yuzey); font-weight: 600; font-size: 14px; box-shadow: 0 16px 40px -12px rgba(0,0,0,.6); animation: ibTost .4s var(--yay) both; display: flex; gap: 12px; align-items: center; max-width: calc(100vw - 24px); }
.ib-tost button { border: none; background: transparent; color: inherit; font: inherit; font-weight: 800; text-decoration: underline; cursor: pointer; }
@keyframes ibTost { from { opacity: 0; transform: translate(-50%, 16px) scale(.96); } to { opacity: 1; transform: translate(-50%, 0); } }

/* ── mod anahtarı ── */
.mod-anahtar { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 3px; border-radius: 11px; border: none; cursor: pointer; font-family: ${IB_YAZI}; font-weight: 800; font-size: 13px; background: rgba(120,140,190,.16); box-shadow: inset 0 0 0 1px rgba(160,190,255,.3); color: inherit; min-height: 38px; }
.mod-anahtar span { position: relative; z-index: 1; padding: 0 12px; display: grid; place-items: center; min-height: 32px; opacity: .62; transition: opacity .25s, color .25s; white-space: nowrap; }
.mod-anahtar span[data-a="1"] { opacity: 1; }
.mod-anahtar i { position: absolute; z-index: 0; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 8px; transition: transform .45s cubic-bezier(.2,.9,.25,1.15), background .3s; }
.mod-anahtar[data-mod="forma"] i { background: linear-gradient(135deg, #D7FF3A, #7CE04A); } .mod-anahtar[data-mod="forma"] span[data-a="1"] { color: #0B0D10; }
.mod-anahtar[data-mod="ib"] i { transform: translateX(100%); background: linear-gradient(135deg, #6FB1FF, #2F6FD0); } .mod-anahtar[data-mod="ib"] span[data-a="1"] { color: #04122B; }
.mod-anahtar:active i { filter: brightness(1.15); }

@media (prefers-reduced-motion: reduce) { .ib-kok *, .ib-kok *::before, .ib-kok *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
.ib-kok[data-az="1"] .ib-plan-pusula, .ib-kok[data-az="1"] .ib-nabiz { animation: none; }
@media print { .ib-ray, .ib-ust .ib-sira, .ib-hizli, .ib-dock { display: none !important; } .ib-iskelet { display: block; } .ib-kok::before, .ib-kok::after { display: none; } .ib-pafta { break-inside: avoid; box-shadow: inset 0 0 0 1px #999; } }
`;
