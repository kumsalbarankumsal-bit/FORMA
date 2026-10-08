import React, { useEffect, useState } from "react";
import { durum, kodAl, kodYaz, gonder, cek, hesapAnahtari, uzakT } from "./senkron.js";

/* sağ altta küçük bulut düğmesi: eşitleme durumu, kod oluşturma/girme, e-postayla kod gönderme */
export default function SenkronDugme() {
  const [d, setD] = useState({ ...durum }); const [acik, setAcik] = useState(() => !kodAl() && !localStorage.getItem("forma:girisSoruldu")); const [ep, setEp] = useState(""); const [sf, setSf] = useState(""); const [bekle, setBekle] = useState(false); const [hata, setHata] = useState(""); const [kod, setKod] = useState(kodAl());
  useEffect(() => { const f = (x) => setD(x); durum.dinle.add(f); return () => durum.dinle.delete(f); }, []);
  const renk = { tamam: "#39E58C", gonderiyor: "#FFCB52", hata: "#FF5D6C", cakisma: "#FF9A3C", kapali: "#6E7591" }[d.ad] || "#6E7591";
  const yaz = { tamam: d.zaman ? `Eşitlendi · ${new Date(d.zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : "Eşitlendi", gonderiyor: "Gönderiliyor…", hata: "Bağlantı yok, sonra denenecek", cakisma: "Diğer cihazda daha yeni kayıt var", kapali: "Eşitleme kapalı" }[d.ad];
  const kapat = () => { localStorage.setItem("forma:girisSoruldu", "1"); setAcik(false); };
  /* giriş: e-posta + şifreden hesap anahtarı türetilir; bulutta kayıt varsa bu cihaza gelir, yoksa bu cihazdaki kayıt hesaba yüklenir */
  const giris = async () => { setBekle(true); setHata("");
    try { const k = await hesapAnahtari(ep, sf); kodYaz(k); localStorage.setItem("forma:hesap", ep.trim().toLowerCase()); localStorage.removeItem("forma:senkronT");
      if ((await uzakT()) > 0) { await cek(); location.reload(); } else { await gonder(true); setKod(k); kapat(); }
    } catch (e) { kodYaz(null); setHata("Bağlanılamadı. İnternetini kontrol edip yeniden dene."); } setBekle(false); };
  const cikis = () => { kodYaz(null); localStorage.removeItem("forma:hesap"); setKod(null); };
  const B = { border: "none", borderRadius: 12, minHeight: 40, padding: "0 14px", font: "800 13px system-ui", cursor: "pointer" };
  return <>
    {d.yeniVar && <div style={{ position: "fixed", left: "50%", top: 12, transform: "translateX(-50%)", zIndex: 99999, display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 14, background: "#141829", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.6), inset 0 0 0 1px #FFCB52", font: "600 13.5px system-ui" }}>
      Diğer cihazda daha yeni kayıt var.<button style={{ ...B, background: "#FFCB52", color: "#1A1204" }} onClick={async () => { await cek(); location.reload(); }}>Yükle</button></div>}
    <button aria-label={"Eşitleme: " + yaz} title={yaz} onClick={() => setAcik(!acik)} style={{ position: "fixed", right: 12, bottom: 12, zIndex: 99998, width: 40, height: 40, borderRadius: 999, border: "none", cursor: "pointer", background: "rgba(10,12,22,.9)", boxShadow: `inset 0 0 0 1.5px ${renk}`, color: renk, display: "grid", placeItems: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.25 4.25 0 0 0 7 18z" />{d.ad === "tamam" && <path d="m9.5 13.5 2 2 3.5-4" />}</svg></button>
    {acik && <div style={{ position: "fixed", right: 12, bottom: 60, zIndex: 99998, width: "min(340px, calc(100vw - 24px))", padding: 16, borderRadius: 18, background: "#11141F", color: "#F4F6FB", boxShadow: "0 20px 60px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.1)", font: "14px/1.5 system-ui" }}>
      <div style={{ font: "900 17px system-ui" }}>Hesap ve eşitleme</div>
      <div style={{ color: renk, fontSize: 12.5, margin: "2px 0 10px" }}>{yaz}</div>
      {kod ? <>
        <div style={{ color: "#A9B0C6", fontSize: 13 }}>{localStorage.getItem("forma:hesap") || "Hesap"} ile giriş yapıldı. Çalışmaların, ödüllerin ve kayıtların her cihazda kendiliğinden güncel kalır.</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          <button style={{ ...B, background: "rgba(255,255,255,.08)", color: "#fff" }} onClick={() => gonder(true)}>Şimdi eşitle</button>
          <button style={{ ...B, background: "transparent", color: "#6E7591" }} onClick={cikis}>Çıkış yap</button></div>
      </> : <>
        <div style={{ color: "#A9B0C6", fontSize: 13 }}>Her cihazda aynı e-posta ve şifreyle giriş yap; gerisi otomatik. İlk girişte hesap kendiliğinden açılır.</div>
        <input type="email" value={ep} onChange={(e) => setEp(e.target.value)} placeholder="E-posta" autoComplete="email" style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 10, borderRadius: 12, border: "none", padding: "0 12px", minHeight: 44, background: "rgba(255,255,255,.06)", color: "#fff", font: "15px system-ui" }} />
        <input type="password" value={sf} onChange={(e) => setSf(e.target.value)} placeholder="Şifre (en az 6 karakter)" autoComplete="current-password" onKeyDown={(e) => e.key === "Enter" && ep.includes("@") && sf.length >= 6 && giris()} style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 8, borderRadius: 12, border: "none", padding: "0 12px", minHeight: 44, background: "rgba(255,255,255,.06)", color: "#fff", font: "15px system-ui" }} />
        {hata && <div style={{ color: "#FF8A95", fontSize: 13, marginTop: 8 }}>{hata}</div>}
        <button style={{ ...B, marginTop: 10, width: "100%", minHeight: 46, background: "#D7FF3A", color: "#0B0D10", opacity: bekle ? 0.6 : 1 }} disabled={bekle || !ep.includes("@") || sf.length < 6} onClick={giris}>{bekle ? "Bağlanıyor…" : "Giriş yap"}</button>
        <button style={{ ...B, marginTop: 4, width: "100%", background: "transparent", color: "#6E7591", fontWeight: 600 }} onClick={kapat}>Şimdilik bu cihazda kalsın</button>
        <div style={{ color: "#6E7591", fontSize: 11.5, marginTop: 6 }}>Şifreyi unutursan kayda ulaşılamaz; onu bir yere not et.</div>
      </>}
    </div>}
  </>;
}
