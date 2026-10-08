import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { depoKur, depo } from "./storage.js";
import App from "./App.jsx";
import SenkronDugme from "./SenkronDugme.jsx";
import { kancaKur, acilis, izle } from "./senkron.js";

const KEY = "forma:td:v3";
depoKur();
kancaKur();

/* Bu sitede hiç kayıt yoksa: claude.ai sürümünden alınan yedeği taşımayı öner.
   Yedek dosyası "Kulüp → Veri → Yedeği indir" ile alınır (baran-calisma-yedek-*.json). */
function Tasima({ bitti }) {
  const [metin, setMetin] = useState(""); const [hata, setHata] = useState(""); const [ozet, setOzet] = useState(null);
  const coz = (txt) => {
    try { const o = JSON.parse(String(txt || "").trim()); const v = o && o.veri ? o.veri : o;
      if (!v || !Array.isArray(v.oyuncular) || !v.ayarlar) throw new Error();
      setHata(""); setOzet({ v, gun: Object.keys(v.antrenman || {}).length, konu: (v.konular || []).length, tarih: o.tarih ? new Date(o.tarih).toLocaleString("tr-TR") : null });
    } catch (e) { setOzet(null); setHata("Bu bir FORMA yedeği değil ya da eksik kopyalanmış. Dosyayı ya da metnin tamamını yeniden dene."); }
  };
  const dosya = (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => coz(r.result); r.readAsText(f); };
  const yukle = async () => { await depo.set(KEY, JSON.stringify(ozet.v)); bitti(); };
  const S = { kart: { width: "min(560px, calc(100vw - 32px))", padding: 28, borderRadius: 24, background: "linear-gradient(180deg,#141829,#0A0C16)", boxShadow: "0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.08)", color: "#F4F6FB", font: "15px/1.55 system-ui, sans-serif" },
    btn: { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "0 22px", borderRadius: 14, border: "none", font: "800 15px system-ui", cursor: "pointer" } };
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "radial-gradient(90% 70% at 50% 0%, rgba(215,255,58,.12), transparent 60%), #05060B" }}>
    <div style={S.kart}>
      <div style={{ font: "800 11px system-ui", letterSpacing: ".2em", color: "#D7FF3A" }}>FORMA · ARENA 3.0</div>
      <div style={{ font: "900 30px system-ui", lineHeight: 1.05, margin: "8px 0 10px" }}>Kaydını buraya taşı</div>
      <div style={{ color: "#A9B0C6" }}>Bu adreste henüz kayıt yok. Verilerin claude.ai'deki eski uygulamada duruyor; iki site birbirinin deposunu göremez. Eski uygulamada <b style={{ color: "#fff" }}>Kulüp → Veri → Yedeği indir</b> ile aldığın dosyayı seç ya da metni yapıştır: her şey kaldığı yerden devam eder.</div>
      <label style={{ ...S.btn, background: "#D7FF3A", color: "#0B0D10", marginTop: 18 }}>Yedek dosyasını seç<input type="file" accept=".json,application/json,text/plain" onChange={dosya} style={{ display: "none" }} /></label>
      <textarea value={metin} onChange={(e) => setMetin(e.target.value)} rows={3} placeholder="…ya da yedek metnini buraya yapıştır"
        style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 12, padding: 12, borderRadius: 12, border: "none", background: "rgba(255,255,255,.06)", color: "#fff", font: "12px ui-monospace, monospace", resize: "vertical" }} />
      {metin.trim() && !ozet && <button type="button" onClick={() => coz(metin)} style={{ ...S.btn, minHeight: 40, marginTop: 8, background: "rgba(255,255,255,.1)", color: "#fff" }}>Metni çözümle</button>}
      {hata && <div style={{ color: "#FF8A95", marginTop: 10, fontSize: 13.5 }}>{hata}</div>}
      {ozet && <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: "rgba(57,229,140,.1)", boxShadow: "inset 0 0 0 1px rgba(57,229,140,.4)" }}>
        <div style={{ fontWeight: 800 }}>Yedek bulundu{ozet.tarih ? ` · ${ozet.tarih}` : ""}</div>
        <div style={{ color: "#A9B0C6", fontSize: 13.5 }}>{ozet.gun} günlük antrenman · {ozet.konu} konu</div>
        <button type="button" onClick={yukle} style={{ ...S.btn, marginTop: 10, background: "#39E58C", color: "#06120B" }}>Kaydı yükle ve aç</button></div>}
      <button type="button" onClick={bitti} style={{ ...S.btn, minHeight: 36, padding: 0, marginTop: 18, background: "transparent", color: "#6E7591", fontWeight: 600, fontSize: 13 }}>Yedeğim yok, sıfırdan başla</button>
    </div></div>;
}
function Kok() {
  const [durum, setDurum] = useState("bak");
  React.useEffect(() => { acilis().catch(() => {}).then(() => depo.get(KEY)).then((r) => { izle();
    /* kayıt yoksa ya da henüz hiç antrenman girilmemiş boş bir kayıtsa taşıma ekranı; ?tasi ile her zaman açılır */
    let dolu = false; try { const v = r && JSON.parse(r.value); dolu = !!(v && Object.keys(v.antrenman || {}).length); } catch (e) {}
    setDurum(dolu && !/[?&]tasi\b/.test(location.search) ? "uygulama" : "tasima"); }).catch(() => setDurum("uygulama")); }, []);
  if (durum === "bak") return null;
  return <>{durum === "tasima" ? <Tasima bitti={() => setDurum("uygulama")} /> : <App />}<SenkronDugme /></>;
}
createRoot(document.getElementById("root")).render(<Kok />);
if ("serviceWorker" in navigator && location.protocol === "https:") window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
