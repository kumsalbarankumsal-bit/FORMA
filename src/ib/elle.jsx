/* v73.1 · Elle çalışma kaydı: zamanlayıcı açmadan, yapılmış çalışmayı yaz.
   Kayıt odak seanslarıyla aynı listeye (d.antrenman[tarih]) gider; ödül, seri ve uyku penceresi kuralları aynen işler. */
import React, { useEffect, useMemo, useState } from "react";

export const ELLE_CSS = `
.el-perde { position: fixed; inset: 0; z-index: 99980; background: rgba(3,8,20,.66); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: grid; place-items: center; padding: 16px; animation: elSol .2s ease-out both; }
@keyframes elSol { from { opacity: 0; } }
.el-kutu { width: min(620px, 100%); max-height: calc(100vh - 32px); overflow: auto; background: #0C1A38; color: #EEF4FF; border-radius: 16px; box-shadow: 0 0 0 1px rgba(150,190,255,.22), 0 30px 80px -20px rgba(0,0,0,.8); padding: 20px; display: grid; gap: 16px;
  font-family: 'Atkinson Hyperlegible Next','Atkinson Hyperlegible',system-ui,sans-serif; font-size: 15px; line-height: 1.45; animation: elGir .32s cubic-bezier(.2,.9,.25,1.1) both; }
@keyframes elGir { from { opacity: 0; transform: translateY(14px) scale(.97); } }
.el-bas { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; } .el-bas h2 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -.01em; } .el-bas p { margin: 2px 0 0; color: #A9BBDD; font-size: 14px; }
.el-x { border: none; background: rgba(150,190,255,.12); color: #EEF4FF; width: 38px; height: 38px; border-radius: 10px; cursor: pointer; font-size: 20px; flex: 0 0 auto; }
.el-etk { font-size: 13px; font-weight: 700; color: #A9BBDD; margin-bottom: 7px; display: block; }
.el-cipler { display: flex; flex-wrap: wrap; gap: 6px; }
.el-cip { border: none; cursor: pointer; min-height: 38px; padding: 0 13px; border-radius: 9px; background: rgba(150,190,255,.10); color: #DCE6FA; font: inherit; font-weight: 600; font-size: 14px; box-shadow: inset 0 0 0 1px rgba(150,190,255,.18); transition: background .15s, transform .12s; }
.el-cip:active { transform: scale(.96); } .el-cip[aria-pressed="true"] { background: #6FB1FF; color: #04122B; box-shadow: none; }
.el-izg { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
.el-girdi { width: 100%; box-sizing: border-box; min-height: 42px; padding: 8px 11px; border-radius: 9px; border: none; background: rgba(150,190,255,.08); color: #EEF4FF; font: inherit; font-size: 16px; box-shadow: inset 0 0 0 1px rgba(150,190,255,.24); color-scheme: dark; }
.el-girdi:focus, .el-cip:focus-visible, .el-x:focus-visible, .el-kaydet:focus-visible { outline: 2px solid #6FB1FF; outline-offset: 2px; }
.el-sure { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; } .el-sure b { font-size: 34px; font-weight: 800; letter-spacing: -.02em; min-width: 120px; font-variant-numeric: tabular-nums; }
.el-adim { border: none; cursor: pointer; width: 42px; height: 42px; border-radius: 10px; background: rgba(150,190,255,.12); color: #EEF4FF; font-size: 20px; font-weight: 700; }
.el-not { font-size: 13.5px; color: #F2C14E; display: flex; gap: 8px; align-items: flex-start; } .el-not.el-iyi { color: #8FE3B0; }
.el-alt { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 4px; border-top: 1px solid rgba(150,190,255,.14); }
.el-kaydet { border: none; cursor: pointer; min-height: 46px; padding: 0 22px; border-radius: 11px; background: linear-gradient(135deg, #D7FF3A, #7CE04A); color: #0B0D10; font: inherit; font-weight: 800; font-size: 16px; }
.el-kaydet:disabled { opacity: .4; cursor: default; }
.el-liste { display: grid; gap: 6px; } .el-satir { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; background: rgba(150,190,255,.06); font-size: 14px; }
.el-satir span { flex: 1; min-width: 0; } .el-satir small { color: #8EA2C8; } .el-sil { border: none; background: transparent; color: #FF9A9A; cursor: pointer; font: inherit; font-weight: 700; min-height: 34px; padding: 0 8px; border-radius: 7px; }
.el-tost { position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); z-index: 99985; background: #EEF4FF; color: #04122B; font-family: 'Atkinson Hyperlegible Next',system-ui,sans-serif; font-weight: 700; padding: 12px 18px; border-radius: 12px; box-shadow: 0 16px 40px -12px rgba(0,0,0,.6); animation: elGir .3s both; display: flex; gap: 14px; align-items: center; }
.el-tost button { border: none; background: transparent; color: #1F5FBF; font: inherit; font-weight: 800; cursor: pointer; }
.el-dugme { display: inline-flex; align-items: center; gap: 7px; border: none; cursor: pointer; min-height: 38px; padding: 0 12px; border-radius: 10px; font-weight: 800; font-size: 13px; background: rgba(215,255,58,.14); color: #D7FF3A; box-shadow: inset 0 0 0 1px rgba(215,255,58,.4); white-space: nowrap; font-family: inherit; }
.el-dugme:active { transform: scale(.96); }
@media (prefers-reduced-motion: reduce) { .el-perde, .el-kutu, .el-tost { animation: none; } }
`;

const z2 = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${z2(d.getMonth() + 1)}-${z2(d.getDate())}`;
const gunEkle = (t, n) => { const d = new Date(t + "T12:00:00"); d.setDate(d.getDate() + n); return ymd(d); };
const sureYazi = (dk) => (dk >= 60 ? `${Math.floor(dk / 60)} sa${dk % 60 ? ` ${dk % 60} dk` : ""}` : `${dk} dk`);
const TUR_SIRA = ["hucumHareketleri", "bitiricilik", "duranTop", "pasCalismasi", "savunmaSekli", "macProvasi", "kondisyonSeans"];
/* Seans türlerinin futbol adları yerine ne yaptığın: */
const TUR_AD = { hucumHareketleri: "Yeni konu", bitiricilik: "Soru çözümü", duranTop: "Ezber / kart", pasCalismasi: "Özet / anlatarak", savunmaSekli: "Hata analizi", macProvasi: "Süreli deneme", kondisyonSeans: "Uzun okuma" };

export function ElleSeans({ d, bugun, on, kaydet, kapat, yardim }) {
  const { SEANS_TUR, gecSaatMi, ritimAl, konuUygula, ses } = yardim;
  const dersler = (d.oyuncular || []).filter((p) => p && p.id && !p.emekli);
  const [pid, setPid] = useState((on && on.pid) || "");
  const [tarih, setTarih] = useState(bugun);
  const [dk, setDk] = useState(60);
  const simdi = new Date();
  const [bas, setBas] = useState(() => { const t = new Date(Date.now() - 60 * 60000); return `${z2(t.getHours())}:${z2(Math.floor(t.getMinutes() / 5) * 5)}`; });
  const [tur, setTur] = useState("bitiricilik");
  const [soru, setSoru] = useState(""); const [dogru, setDogru] = useState("");
  const [konu, setKonu] = useState("");
  const [tost, setTost] = useState(null);
  useEffect(() => { const f = (e) => { if (e.key === "Escape") kapat(); }; window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, [kapat]);
  useEffect(() => { if (!tost) return; const t = setTimeout(() => setTost(null), 5000); return () => clearTimeout(t); }, [tost]);
  const saat = Number(bas.split(":")[0]);
  const uyku = (() => { try { return gecSaatMi(saat, ritimAl(d)); } catch (e) { return false; } })();
  const konular = useMemo(() => (d.konular || []).filter((k) => k && k.pid === pid).slice(0, 200), [d.konular, pid]);
  const gelecek = tarih === bugun && (() => { const [h, m] = bas.split(":").map(Number); return h * 60 + m > simdi.getHours() * 60 + simdi.getMinutes(); })();
  const soruN = Number(soru) || 0, dogruN = Math.min(Number(dogru) || 0, soruN);
  const gecerli = pid && dk > 0 && dk <= 600 && tarih && tarih <= bugun && /^\d{1,2}:\d{2}$/.test(bas) && !gelecek;
  const gunun = (d.antrenman || {})[tarih] || [];
  const ad = (id) => (dersler.find((p) => p.id === id) || {}).ad || id;
  const kaydetBas = () => {
    if (!gecerli) return;
    const [h, m] = bas.split(":").map(Number); const basTs = new Date(`${tarih}T${z2(h)}:${z2(m)}:00`).getTime();
    const s = { id: "el" + Date.now().toString(36), pid, dakika: Math.round(dk), soru: soruN, dogruluk: soruN ? Math.round((dogruN / soruN) * 100) : 0, tahmin: null,
      saat: h, zorluk: 2, tur, bas: basTs, ts: basTs + dk * 60000, elle: true, ...(konu ? { konuId: konu } : {}) };
    let y = { ...d, antrenman: { ...(d.antrenman || {}), [tarih]: [...((d.antrenman || {})[tarih] || []), s] } };
    if (konu && konuUygula) { try { y = konuUygula(y, konu, tarih); } catch (e) {} }
    kaydet(y); try { ses("odul"); } catch (e) {} try { navigator.vibrate && navigator.vibrate(15); } catch (e) {}
    setTost({ metin: `${ad(pid)} · ${sureYazi(dk)} kaydedildi`, id: s.id, tarih });
    setSoru(""); setDogru(""); setKonu("");
  };
  const sil = (id) => { kaydet({ ...d, antrenman: { ...d.antrenman, [tarih]: gunun.filter((x) => x.id !== id) } }); };
  const tarihSec = [[bugun, "Bugün"], [gunEkle(bugun, -1), "Dün"], [gunEkle(bugun, -2), "2 gün önce"]];
  return <>
    <div className="el-perde" onPointerDown={(e) => { if (e.target === e.currentTarget) kapat(); }}>
      <div className="el-kutu" role="dialog" aria-modal="true" aria-labelledby="el-baslik">
        <div className="el-bas"><div><h2 id="el-baslik">Çalıştığımı yaz</h2><p>Zamanlayıcı yok. Yaptığın çalışmayı gir; odak seansı gibi sayılır.</p></div><button type="button" className="el-x" onClick={kapat} aria-label="Kapat">×</button></div>

        <div><span className="el-etk">Ders</span><div className="el-cipler" role="radiogroup" aria-label="Ders">{dersler.map((p) =>
          <button key={p.id} type="button" className="el-cip" role="radio" aria-pressed={pid === p.id} aria-checked={pid === p.id} onClick={() => { setPid(p.id); setKonu(""); }}>{p.ad}</button>)}</div></div>

        <div><span className="el-etk">Ne kadar çalıştın?</span>
          <div className="el-sure"><button type="button" className="el-adim" aria-label="5 dakika azalt" onClick={() => setDk((v) => Math.max(5, v - 5))}>−</button><b aria-live="polite">{sureYazi(dk)}</b><button type="button" className="el-adim" aria-label="5 dakika artır" onClick={() => setDk((v) => Math.min(600, v + 5))}>+</button></div>
          <div className="el-cipler" style={{ marginTop: 8 }}>{[25, 45, 60, 90, 120, 180].map((v) => <button key={v} type="button" className="el-cip" aria-pressed={dk === v} onClick={() => setDk(v)}>{sureYazi(v)}</button>)}</div></div>

        <div className="el-izg">
          <div><span className="el-etk">Hangi gün?</span><div className="el-cipler">{tarihSec.map(([t, a]) => <button key={t} type="button" className="el-cip" aria-pressed={tarih === t} onClick={() => setTarih(t)}>{a}</button>)}</div>
            <input type="date" className="el-girdi" style={{ marginTop: 6 }} value={tarih} max={bugun} min={gunEkle(bugun, -30)} aria-label="Tarih" onChange={(e) => e.target.value && setTarih(e.target.value)} /></div>
          <label><span className="el-etk">Saat kaçta başladın?</span><input type="time" className="el-girdi" value={bas} step="300" onChange={(e) => e.target.value && setBas(e.target.value)} /></label>
        </div>
        {uyku && <div className="el-not">◐ Bu saat uyku pencerende. Çalışma kaydedilir ve dakikaların sayılır, ama ödül ve bonus vermez.</div>}
        {gelecek && <div className="el-not">Başlangıç saati henüz gelmedi; saati ya da günü düzelt.</div>}

        <div><span className="el-etk">Ne yaptın?</span><div className="el-cipler">{TUR_SIRA.filter((k) => SEANS_TUR[k]).map((k) => <button key={k} type="button" className="el-cip" aria-pressed={tur === k} onClick={() => setTur(k)}>{TUR_AD[k] || SEANS_TUR[k].ad}</button>)}</div></div>

        <div className="el-izg">
          <label><span className="el-etk">Kaç soru? (isteğe bağlı)</span><input type="number" inputMode="numeric" min="0" className="el-girdi" value={soru} onChange={(e) => setSoru(e.target.value)} /></label>
          <label><span className="el-etk">Kaçı doğru?</span><input type="number" inputMode="numeric" min="0" className="el-girdi" value={dogru} disabled={!soruN} onChange={(e) => setDogru(e.target.value)} /></label>
          {konular.length > 0 && <label style={{ gridColumn: "1 / -1" }}><span className="el-etk">Konu (isteğe bağlı)</span><select className="el-girdi" value={konu} onChange={(e) => setKonu(e.target.value)}><option value="">Seçme</option>{konular.map((k) => <option key={k.id} value={k.id}>{k.kod ? `${k.kod} · ` : ""}{k.ad || k.baslik || k.id}</option>)}</select></label>}
        </div>

        {gunun.length > 0 && <div><span className="el-etk">{tarih === bugun ? "Bugün" : tarih} kayıtlı ({sureYazi(gunun.reduce((s, x) => s + (Number(x.dakika) || 0), 0))})</span>
          <div className="el-liste">{gunun.slice().reverse().slice(0, 8).map((x) => <div key={x.id} className="el-satir"><span>{ad(x.pid)} <small>· {sureYazi(Number(x.dakika) || 0)}{x.saat != null ? ` · ${z2(x.saat)}:00` : ""}{x.elle ? " · elle" : ""}</small></span>
            {x.elle && <button type="button" className="el-sil" onClick={() => sil(x.id)}>Sil</button>}</div>)}</div></div>}

        <div className="el-alt"><span style={{ color: "#A9BBDD", fontSize: 14 }}>{pid ? `${ad(pid)} · ${sureYazi(dk)} · ${tarih === bugun ? "bugün" : tarih} ${bas}` : "Önce dersi seç"}</span>
          <button type="button" className="el-kaydet" disabled={!gecerli} onClick={kaydetBas}>Kaydet</button></div>
      </div>
    </div>
    {tost && <div className="el-tost" role="status">✓ {tost.metin}</div>}
  </>;
}
