import React, { useEffect, useState } from "react";
import { durum, kodAl, kodYaz, yeniKod, gonder, cek, acilis } from "./senkron.js";

/* sağ altta küçük bulut düğmesi: eşitleme durumu, kod oluşturma/girme, e-postayla kod gönderme */
export default function SenkronDugme() {
  const [d, setD] = useState({ ...durum }); const [acik, setAcik] = useState(false); const [giris, setGiris] = useState(""); const [kod, setKod] = useState(kodAl());
  useEffect(() => { const f = (x) => setD(x); durum.dinle.add(f); return () => durum.dinle.delete(f); }, []);
  const renk = { tamam: "#39E58C", gonderiyor: "#FFCB52", hata: "#FF5D6C", cakisma: "#FF9A3C", kapali: "#6E7591" }[d.ad] || "#6E7591";
  const yaz = { tamam: d.zaman ? `Eşitlendi · ${new Date(d.zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : "Eşitlendi", gonderiyor: "Gönderiliyor…", hata: "Bağlantı yok, sonra denenecek", cakisma: "Diğer cihazda daha yeni kayıt var", kapali: "Eşitleme kapalı" }[d.ad];
  const bagla = async (k) => { kodYaz(k); setKod(k); localStorage.removeItem("forma:senkronT"); await acilis(); if (k) location.reload(); };
  const B = { border: "none", borderRadius: 12, minHeight: 40, padding: "0 14px", font: "800 13px system-ui", cursor: "pointer" };
  return <>
    {d.yeniVar && <div style={{ position: "fixed", left: "50%", top: 12, transform: "translateX(-50%)", zIndex: 99999, display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 14, background: "#141829", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.6), inset 0 0 0 1px #FFCB52", font: "600 13.5px system-ui" }}>
      Diğer cihazda daha yeni kayıt var.<button style={{ ...B, background: "#FFCB52", color: "#1A1204" }} onClick={async () => { await cek(); location.reload(); }}>Yükle</button></div>}
    <button aria-label={"Eşitleme: " + yaz} title={yaz} onClick={() => setAcik(!acik)} style={{ position: "fixed", right: 12, bottom: 12, zIndex: 99998, width: 40, height: 40, borderRadius: 999, border: "none", cursor: "pointer", background: "rgba(10,12,22,.9)", boxShadow: `inset 0 0 0 1.5px ${renk}`, color: renk, display: "grid", placeItems: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.25 4.25 0 0 0 7 18z" />{d.ad === "tamam" && <path d="m9.5 13.5 2 2 3.5-4" />}</svg></button>
    {acik && <div style={{ position: "fixed", right: 12, bottom: 60, zIndex: 99998, width: "min(340px, calc(100vw - 24px))", padding: 16, borderRadius: 18, background: "#11141F", color: "#F4F6FB", boxShadow: "0 20px 60px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.1)", font: "14px/1.5 system-ui" }}>
      <div style={{ font: "900 17px system-ui" }}>Cihazlar arası eşitleme</div>
      <div style={{ color: renk, fontSize: 12.5, margin: "2px 0 10px" }}>{yaz}</div>
      {kod ? <>
        <div style={{ color: "#A9B0C6", fontSize: 13 }}>Bu kodu diğer cihazında aynı yere gir. Kod parola gibidir; kimseyle paylaşma.</div>
        <div style={{ font: "800 18px ui-monospace, monospace", letterSpacing: ".04em", margin: "8px 0", userSelect: "all" }}>{kod}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button style={{ ...B, background: "#D7FF3A", color: "#0B0D10" }} onClick={() => gonder(true)}>Şimdi gönder</button>
          <button style={{ ...B, background: "rgba(255,255,255,.08)", color: "#fff" }} onClick={async () => { await cek(); location.reload(); }}>Buluttan al</button>
          <a style={{ ...B, display: "inline-flex", alignItems: "center", textDecoration: "none", background: "rgba(255,255,255,.08)", color: "#fff" }} href={`mailto:?subject=FORMA eşitleme kodu&body=${encodeURIComponent(`Kod: ${kod}\nAdres: ${location.origin}`)}`}>E-postayla gönder</a>
          <button style={{ ...B, background: "transparent", color: "#6E7591" }} onClick={() => bagla(null)}>Bu cihazda kapat</button></div>
      </> : <>
        <div style={{ color: "#A9B0C6", fontSize: 13 }}>İlk cihazda kod oluştur, diğer cihaza aynı kodu gir. Çalışmaların, ödüllerin ve kayıtların otomatik taşınır.</div>
        <button style={{ ...B, marginTop: 10, background: "#D7FF3A", color: "#0B0D10", width: "100%" }} onClick={async () => { const k = yeniKod(); kodYaz(k); setKod(k); await gonder(true); }}>Yeni kod oluştur (bu cihazdaki kayıt yüklenir)</button>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <input value={giris} onChange={(e) => setGiris(e.target.value.trim().toLowerCase())} placeholder="xxxx-xxxx-xxxx-xxxx" style={{ flex: 1, minWidth: 0, borderRadius: 12, border: "none", padding: "0 12px", minHeight: 40, background: "rgba(255,255,255,.06)", color: "#fff", font: "14px ui-monospace, monospace" }} />
          <button style={{ ...B, background: "#39E58C", color: "#06120B" }} disabled={giris.length < 12} onClick={() => bagla(giris)}>Bağlan</button></div>
        <div style={{ color: "#6E7591", fontSize: 12, marginTop: 8 }}>Bağlanınca buluttaki kayıt bu cihaza gelir.</div>
      </>}
    </div>}
  </>;
}
