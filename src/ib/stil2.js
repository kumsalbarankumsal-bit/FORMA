/* IB modu · ekranlara özgü stiller ve FORMA'nın genel kurallarına karşı düzeltmeler. */
import { IB_BASLIK, IB_YAZI } from "./stil.js";
export const IB_CSS2 = `
.ib-kok { min-height: calc(100vh / var(--olcek, 1)); }
.ib-iskelet { min-height: calc(100vh / var(--olcek, 1)); } .ib-ray { height: calc(100vh / var(--olcek, 1)); }
.ib-kok h2, .ib-kok h3, .ib-kok h4 { font-family: inherit; color: inherit; letter-spacing: 0; text-transform: none; }
.ib-kok input, .ib-kok select, .ib-kok textarea, .ib-kok button { font-family: ${IB_YAZI}; }
.ib-kok select option { background: var(--yuzey-2); color: var(--murekkep); }
.ib-kok[data-tema="gunduz"] input, .ib-kok[data-tema="gunduz"] select { color-scheme: light; }
.ib-kok[data-tema="gece"] input, .ib-kok[data-tema="gece"] select { color-scheme: dark; }
.ib-kok ::selection { background: color-mix(in srgb, var(--vurgu) 40%, transparent); color: var(--murekkep); }
.ib-kok ::-webkit-scrollbar-track { background: transparent; } .ib-kok ::-webkit-scrollbar-thumb { background: var(--cizgi-2); border-radius: 8px; }
.ib-kok small { font-size: 12px; }
.ib-baslik { animation: ibBaslik .5s var(--cik) both; } @keyframes ibBaslik { from { opacity: 0; transform: translateX(-10px); letter-spacing: .02em; } to { opacity: 1; transform: none; } }

/* imleç ışığı */
.ib-pafta { background-image: radial-gradient(260px circle at var(--ix, -400px) var(--iy, -400px), color-mix(in srgb, var(--vurgu) 10%, transparent), transparent 70%); background-color: var(--yuzey); }
.ib-vurgulu { background-image: radial-gradient(260px circle at var(--ix, -400px) var(--iy, -400px), color-mix(in srgb, var(--vurgu) 12%, transparent), transparent 70%), linear-gradient(160deg, color-mix(in srgb, var(--marka) 34%, var(--yuzey)), var(--yuzey) 70%); }

/* ızgaralar */
.ib-kahraman-izg { display: grid; gap: 14px; grid-template-columns: minmax(0, 1.28fr) minmax(0, 1fr); align-items: start; }
.ib-g2 { display: grid; gap: 14px; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
.ib-g3 { display: grid; gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; }
.ib-g-oto { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--en, 220px)), 1fr)); }
@media (max-width: 1100px) { .ib-g3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ib-g3 > :last-child:nth-child(odd) { grid-column: 1 / -1; } }
@media (max-width: 980px) { .ib-kahraman-izg, .ib-g2, .ib-g3 { grid-template-columns: minmax(0, 1fr); } }
.ib-ust-sag { gap: 8px; } .ib-yalniz-dar { display: none; } @media (max-width: 880px) { .ib-yalniz-dar { display: inline-flex; } }
.ib-toplam { display: inline-flex; align-items: baseline; gap: 4px; padding: 6px 12px; border-radius: 8px; background: var(--kare-2); box-shadow: inset 0 0 0 1px var(--cizgi); white-space: nowrap; }
.ib-toplam b { font-size: 22px; font-weight: 800; line-height: 1; } .ib-toplam small { color: var(--murekkep-3); font-size: 13px; }

.ib-duzey { flex: 0 0 auto; white-space: nowrap; }
.ib-duz { border: none; background: transparent; padding: 0; margin: 0; cursor: pointer; text-align: left; font: inherit; color: inherit; min-width: 0; }
.ib-duz:disabled { cursor: default; }
.ib-adim { display: inline-flex; align-items: center; border-radius: 8px; background: var(--yuzey-2); box-shadow: inset 0 0 0 1px var(--cizgi-2); overflow: hidden; }
.ib-adim button { width: 36px; height: 40px; border: none; background: transparent; cursor: pointer; display: grid; place-items: center; color: var(--murekkep-2); transition: background .15s, transform .15s var(--cik); }
.ib-adim button:hover:not(:disabled) { background: var(--kare-2); color: var(--murekkep); } .ib-adim button:active:not(:disabled) { transform: scale(.88); } .ib-adim button:disabled { opacity: .3; cursor: default; }
.ib-adim output { text-align: center; font-weight: 800; font-size: 17px; font-variant-numeric: tabular-nums; padding: 0 2px; }
.ib-recete-no { flex: 0 0 26px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 13px; box-shadow: inset 0 0 0 1.5px var(--cizgi-2); color: var(--murekkep-2); }
.ib-kosul { display: grid; gap: 9px; } .ib-kosul-oge { display: flex; gap: 10px; align-items: flex-start; animation: ibYuksel .45s var(--cik) both; }
.ib-kosul-oge b { display: block; font-weight: 600; font-size: 14.500px; line-height: 1.3; } .ib-kosul-oge small { display: block; color: var(--murekkep-3); font-size: 12.500px; }
.ib-uyari-kutu, .ib-ipucu-kutu { display: flex; gap: 10px; align-items: flex-start; flex-wrap: wrap; padding: 9px 12px; border-radius: 8px; background: var(--kare-2); margin-bottom: 8px; font-size: 14px; color: var(--murekkep-2); }
.ib-ipucu-kutu { flex-wrap: nowrap; margin: 0; } .ib-ipucu-kutu svg { flex: 0 0 auto; margin-top: 2px; color: var(--vurgu); }
.ib-ders-kart { padding: 14px 14px 12px; box-shadow: inset 0 3px 0 var(--dr), inset 0 0 0 1px var(--cizgi), var(--golge); }
.ib-ders-kart::before { display: none; }
.ib-ders-serit { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); } @media (max-width: 620px) { .ib-ders-serit { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 880px) { .ib-dock { right: 62px; } }
.ib-ekle-kap { position: relative; display: inline-flex; } .ib-ekle { min-height: 40px; padding: 0 14px 0 11px; } @media (max-width: 560px) { .ib-ekle span { display: none; } .ib-ekle { padding: 0 11px; } }
.ib-ekle svg { transition: transform .3s var(--yay); } .ib-ekle[aria-expanded="true"] svg { transform: rotate(45deg); }
.ib-ekle-perde { position: fixed; inset: 0; z-index: 29; } .ib-ekle-menu { position: absolute; z-index: 30; right: 0; top: calc(100% + 8px); display: grid; gap: 6px; justify-items: stretch; min-width: 190px; }
.ib-ekle-menu .ib-hizli-oge { justify-content: flex-start; } .ib-ekle-menu kbd { margin-left: auto; font: inherit; font-size: 12px; padding: 1px 7px; border-radius: 5px; box-shadow: inset 0 0 0 1px var(--cizgi-2); color: var(--murekkep-3); }
.ib-bilesen-serit { display: flex; gap: 4px; height: 56px; } .ib-bilesen-serit > span { position: relative; display: flex; flex-direction: column; justify-content: flex-end; flex-basis: 0; min-width: 26px; border-radius: 5px; background: var(--kare-2); overflow: hidden; }
.ib-bilesen-serit i { display: block; width: 100%; opacity: .85; border-radius: 4px 4px 0 0; animation: ibBoy 1s var(--cik) both; transform-origin: bottom; } @keyframes ibBoy { from { transform: scaleY(0); } to { transform: none; } }
.ib-bilesen-serit small { position: absolute; left: 6px; top: 4px; font-size: 11.500px; font-weight: 700; color: var(--murekkep); }
.ib-senaryo { display: grid; grid-template-columns: 74px minmax(0, 1fr) 58px; align-items: center; gap: 12px; } .ib-senaryo > span { display: grid; font-weight: 700; line-height: 1.15; } .ib-senaryo small { font-weight: 400; color: var(--murekkep-3); } .ib-senaryo > b { text-align: right; }
.ib-sinir { display: inline-grid; gap: 3px; justify-items: center; font-size: 12px; font-weight: 700; color: var(--murekkep-2); } .ib-sinir input { width: 62px; min-height: 36px; padding: 4px 6px; text-align: center; }
.ib-olcut { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(50px, 1fr) auto auto; align-items: center; gap: 10px; font-size: 14px; }
@media (max-width: 560px) { .ib-olcut { grid-template-columns: minmax(0, 1fr) auto auto; } .ib-olcut > .ib-olcer { display: none; } }

/* matris */
.ib-matris { display: grid; grid-template-columns: 34px repeat(5, 42px); gap: 4px; align-items: center; justify-items: center; flex: 0 0 auto; }
.ib-matris-kose { font-size: 9.500px; color: var(--murekkep-3); line-height: 1.1; text-align: center; } .ib-matris-bas { font-weight: 800; color: var(--murekkep-3); transition: color .3s; } .ib-matris-bas[data-a="1"] { color: var(--altin); }
.ib-matris-h { width: 42px; height: 42px; border-radius: 7px; display: grid; place-items: center; font-weight: 800; font-size: 16px; transition: transform .45s var(--yay), opacity .4s, box-shadow .3s, filter .3s; color: var(--murekkep); }
.ib-matris-h[data-v="0"] { background: var(--isi-0); } .ib-matris-h[data-v="1"] { background: color-mix(in srgb, var(--marka) 35%, var(--yuzey)); } .ib-matris-h[data-v="2"] { background: color-mix(in srgb, var(--marka) 62%, var(--yuzey)); } .ib-matris-h[data-v="3"] { background: var(--marka); color: #fff; }
.ib-matris-h[data-v="x"] { background: color-mix(in srgb, var(--kritik) 22%, var(--yuzey)); color: var(--kritik); }
.ib-matris-h[data-iz="1"] { box-shadow: inset 0 0 0 1.500px var(--cizgi-2); } .ib-matris-h[data-sec="1"] { box-shadow: 0 0 0 2.500px var(--altin), 0 8px 22px -6px var(--altin); transform: scale(1.12) !important; z-index: 1; }

/* CAS */
.ib-cikti { display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); }
.ib-cikti-oge { display: flex; gap: 10px; padding: 10px 12px; border-radius: 8px; background: var(--kare); box-shadow: inset 0 0 0 1px var(--cizgi); font-size: 14px; line-height: 1.3; transition: box-shadow .3s, background .3s; }
.ib-cikti-oge small { display: block; color: var(--murekkep-3); margin-top: 2px; } .ib-cikti-no { flex: 0 0 26px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 13px; box-shadow: inset 0 0 0 1.500px var(--cizgi-2); color: var(--murekkep-3); }
.ib-cikti-oge[data-d="1"] { background: color-mix(in srgb, var(--vurgu) 12%, transparent); box-shadow: inset 0 0 0 1.500px color-mix(in srgb, var(--vurgu) 60%, transparent); } .ib-cikti-oge[data-d="1"] .ib-cikti-no { background: var(--vurgu); color: var(--vurgu-yazi); box-shadow: none; }
.ib-kol { width: 22px; height: 22px; border-radius: 5px; display: grid; place-items: center; font-size: 11.500px; font-weight: 800; color: var(--murekkep-3); box-shadow: inset 0 0 0 1px var(--cizgi); } .ib-kol[data-a="1"] { background: var(--kr); color: #fff; box-shadow: none; }

/* komut terimi kartı: çevrilir */
.ib-komut { height: 124px; perspective: 800px; border: none; background: transparent; padding: 0; cursor: pointer; text-align: left; }
.ib-komut-ic { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .55s var(--yay); } .ib-komut[data-a="1"] .ib-komut-ic { transform: rotateY(180deg); }
.ib-komut-on, .ib-komut-arka { position: absolute; inset: 0; display: grid; align-content: center; gap: 4px; padding: 12px 14px; border-radius: 10px; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: var(--yuzey); box-shadow: inset 0 0 0 1px var(--cizgi); color: var(--murekkep); }
.ib-komut-on b { font-family: ${IB_BASLIK}; font-size: 21px; font-weight: 600; } .ib-komut-on small { color: var(--murekkep-3); }
.ib-komut-arka { transform: rotateY(180deg); background: var(--yuzey-3); box-shadow: inset 0 0 0 1.500px var(--vurgu); align-content: start; overflow: hidden; } .ib-komut-arka b { font-size: 15px; } .ib-komut-arka span { font-size: 13px; color: var(--murekkep-2); line-height: 1.35; }
.ib-komut:hover .ib-komut-on { box-shadow: inset 0 0 0 1px var(--cizgi-2); }

.ib-sinir-serit { position: relative; display: flex; gap: 2px; height: 58px; margin-top: 8px; } .ib-sinir-serit > span { display: grid; align-content: center; justify-items: center; flex-basis: 0; min-width: 22px; border-radius: 5px; background: var(--kare-2); transition: background .3s; }
.ib-sinir-serit b { font-size: 17px; } .ib-sinir-serit small { font-size: 11px; color: var(--murekkep-3); } .ib-sinir-serit > span[data-a="1"] { background: color-mix(in srgb, var(--vurgu) 34%, transparent); box-shadow: inset 0 0 0 1.500px var(--vurgu); }
.ib-sinir-serit > i { position: absolute; top: -6px; bottom: -6px; width: 2px; background: var(--altin); transition: left .5s var(--yay); }
.ib-alinti { margin: 0; padding: 4px 0 4px 18px; border-left: 3px solid var(--altin); font-family: ${IB_BASLIK}; font-size: 22px; line-height: 1.35; max-width: 34ch; animation: ibYuksel .4s var(--cik) both; }
.ib-serit-oge { z-index: 1; } .ib-serit-oge:hover { z-index: 3; } .ib-serit-oge:hover .ib-serit-ad { color: var(--murekkep); }
.ib-serit-bugun { z-index: 2; } .ib-serit-bugun::after { white-space: nowrap; left: 6px !important; top: -4px !important; }
.ib-serit-oge { gap: 0 !important; } .ib-serit-sap { width: 1px; background: var(--cizgi-2); } .ib-serit-ad { padding: 2px 0; }
.ib-satir .ib-duz.ib-satir-ana { display: block; }
.ib-tablo td .ib-girdi { min-height: 36px; }
@media print { .ib-kok { background: #fff !important; color: #000 !important; } .ib-pafta { background: #fff !important; } }
`;
