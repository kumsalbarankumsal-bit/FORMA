/* IB modu · Ölçümler, Koç, Zihin, Araçlar */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ik, Durum, Sekmeler, Onay, tarihKisa, tarihUzun, haftaBasi, kimlik, gunEkle } from "./ortak.jsx";
import { Halka, Kivilcim, CizgiGrafik, YatayCubuk, Sutunlar, Olcer, GrafikKart, bicim } from "./grafik.jsx";
import { Pafta, Bos, Duzey, DersNokta, Adim, Kaydirak, Cipler, NotSayi, BasiliTut, yuzdeYazi, dkYazi } from "./parca.jsx";
import { DERSLER, DERS_SIRA, KOMUT, KOMUT_DUZEY, NEFES, YENIDEN, ZIHIN_IPUCU, OLCUM_TUR } from "./veri.js";
import { kayipDagilim, ibDisari, ibIceri, ibVarsayilan, notHesap, sinirAl } from "./motor.js";
import { useGenislik, useGorunur, useIlerleme, useOrtam, kis } from "./hareket.js";
import { formaPid } from "./ekran1.jsx";

const gunMs = (t) => new Date(t + "T12:00:00").getTime();
const tarihX = (t) => new Date(t).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

/* ── Ölçümler ── */
function Kalibre({ l }) {
  /* tahmin (boş halka) ile sonuç (dolu nokta) aynı satırda; aradaki çizgi sapma */
  const kap = useRef(null); const w = useGenislik(kap, 520); const gor = useGorunur(kap); const p = useIlerleme(gor ? 1 : 0, { sure: 900, acik: gor }); const [uz, setUz] = useState(null);
  const son = l.slice(-10); const sol = 96, sag = 16, sat = 26, ust = 22; const X = (v) => sol + (kis(v, 0, 100) / 100) * (w - sol - sag); const h = ust + son.length * sat + 6;
  return <div ref={kap} className="ib-grafik" style={{ height: h }} onPointerLeave={() => setUz(null)}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Tahmin ve sonuç karşılaştırması">
      {[0, 25, 50, 75, 100].map((v) => <g key={v}><line x1={X(v)} x2={X(v)} y1={ust - 4} y2={h - 4} className="ib-izgara" /><text x={X(v)} y={12} textAnchor="middle" className="ib-eksen">%{v}</text></g>)}
      {son.map((o, i) => { const y = ust + i * sat + sat / 2; const a = X(o.tahmin), b = X(o.tahmin + (o.gercek - o.tahmin) * p);
        return <g key={o.id} onPointerEnter={() => setUz(i)} onPointerDown={() => setUz(i)}><rect x="0" y={y - sat / 2} width={w} height={sat} fill="transparent" />
          <text x={sol - 10} y={y + 4} textAnchor="end" className="ib-eksen ib-eksen-ad">{DERSLER[o.did].kisa.split(" ")[0]} {tarihKisa(o.tarih)}</text>
          <line x1={a} x2={b} y1={y} y2={y} stroke="var(--murekkep-3)" strokeWidth="2" />
          <circle cx={a} cy={y} r="5" fill="var(--yuzey)" stroke="var(--murekkep-2)" strokeWidth="2" /><circle cx={b} cy={y} r="5.5" fill={DERSLER[o.did].renk} stroke="var(--yuzey)" strokeWidth="2" /></g>; })}
    </svg>
    {uz != null && son[uz] && <div className="ib-ipucu" style={{ left: Math.min(w - 200, X(son[uz].gercek) + 12), top: ust + uz * sat - 6 }}><div className="ib-ipucu-bas">{son[uz].ad || DERSLER[son[uz].did].kisa}</div><div className="ib-ipucu-satir"><b>%{bicim(son[uz].tahmin)}</b><span>tahminin</span></div><div className="ib-ipucu-satir"><b>%{bicim(son[uz].gercek)}</b><span>sonuç</span></div></div>}
  </div>;
}
export function Olcumler({ H, ib, yaz, bugun, ac }) {
  const [filtre, setFiltre] = useState("hepsi");
  const l = ib.olcum.filter((o) => filtre === "hepsi" || o.did === filtre).slice().reverse();
  const seriler = H.dersler.filter((x) => (filtre === "hepsi" || x.id === filtre) && x.trend.length).map((x) => ({ id: x.id, ad: x.kisa, renk: x.renk, noktalar: x.trend }));
  const kayip = kayipDagilim(ib, filtre === "hepsi" ? null : filtre); const K = H.kalibre;
  const ay = {}; for (const o of ib.olcum) { const k = o.tarih.slice(0, 7); ay[k] = (ay[k] || 0) + 1; }
  const aylar = Array.from({ length: 8 }, (_, i) => { const d = new Date(bugun + "T12:00:00"); d.setDate(1); d.setMonth(d.getMonth() - (7 - i)); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; return { ad: d.toLocaleDateString("tr-TR", { month: "short" }), uzun: d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }), deger: ay[k] || 0, ek: "ölçüm" }; });
  return <div className="ib-ekran ib-izg">
    <div className="ib-sira" style={{ justifyContent: "space-between" }}>
      <Cipler etiket="Ders süzgeci" secenek={[{ id: "hepsi", ad: "Bütün dersler" }, ...DERS_SIRA.map((id) => ({ id, ad: DERSLER[id].kisa, renk: DERSLER[id].renk }))]} deger={filtre} degis={setFiltre} />
      <button type="button" className="ib-dugme" onClick={() => ac({ tur: "olcum", on: filtre !== "hepsi" ? { did: filtre } : null })}><Ik ad="arti" boy={16} />Ölçüm ekle</button>
    </div>
    {!ib.olcum.length && <Pafta className="ib-vurgulu"><div className="ib-izg" style={{ gap: 10, maxWidth: "64ch" }}><h3 style={{ fontSize: 20 }}>Ölçüm, tahminin yerini alır</h3><p className="ib-ikincil">Çözdüğün her geçmiş sınav kâğıdını, okul sınavını ve puanlanan ödevi buraya yaz. Ders notların, diploma planın ve koçun önerileri bu kayıtlardan hesaplanır. Sınavdan önce bir tahmin yazarsan, kendini ne kadar doğru ölçtüğünü de görürsün.</p><div><button type="button" className="ib-dugme" onClick={() => ac({ tur: "olcum" })}>İlk ölçümü ekle</button></div></div></Pafta>}
    <div className="ib-g2">
      <GrafikKart baslik="Eğilim" alt="Her nokta bir ölçümün yüzdesi" lejant={seriler.length > 1 ? seriler.map((s) => ({ ad: s.ad, renk: s.renk })) : null}
        tablo={{ bas: ["Tarih", "Ders", "Ölçüm", "Yüzde"], satir: l.map((o) => [tarihKisa(o.tarih), DERSLER[o.did].kisa, o.ad || "–", yuzdeYazi((o.puan / o.max) * 100)]) }}>
        <CizgiGrafik seriler={seriler} birim="%" xBicim={tarihX} yukseklik={260} alan bos="Ölçüm girdikçe çizgiler burada uzar." />
      </GrafikKart>
      <div className="ib-izg">
        <GrafikKart baslik="Kendini ne kadar doğru ölçüyorsun?" alt={K.l.length ? `${K.l.length} ölçümde tahmin yazdın` : "Sınavdan önce bir yüzde tahmini yaz; fark burada görünür"} lejant={K.l.length ? [{ ad: "Tahminin", renk: "var(--murekkep-2)" }, { ad: "Sonuç", renk: "var(--vurgu)" }] : null}>
          {K.l.length ? <><Kalibre l={K.l} /><p className="ib-ikincil" style={{ marginTop: 8 }}>{K.yon === "dusuk" ? `Kendini ortalama ${bicim(K.ort, 1)} puan düşük tahmin ediyorsun. Hazırlığın düşündüğünden iyi.` : K.yon === "yuksek" ? `Kendini ortalama ${bicim(-K.ort, 1)} puan yüksek tahmin ediyorsun. "Biliyorum" dediğin konuları kapalı defterle sına.` : `Tahminlerin sonuca yakın (ortalama sapma ${bicim(K.mutlak, 1)} puan). Nerede olduğunu iyi biliyorsun.`}</p></> : <div className="ib-grafik-bos" style={{ height: 110 }}>Henüz tahminli ölçüm yok.</div>}
        </GrafikKart>
        <Pafta baslik="Puan nerede gidiyor?" alt="Ölçümlere eklediğin kayıp nedenleri">
          {kayip.length ? <YatayCubuk adGen={170} veri={kayip.map((k, i) => ({ id: k.ad, ad: k.ad, deger: k.n, renk: i === 0 ? "var(--vurgu)" : "var(--murekkep-3)", ek: i === 0 ? "en sık" : null }))} degerBicim={(v) => `${v} kez`} /> : <Bos>Ölçüm eklerken "Puan nerede gitti?" sorusunu işaretlersen en pahalı alışkanlığın burada belirir.</Bos>}
        </Pafta>
      </div>
    </div>
    <div className="ib-g2">
      <Pafta baslik="Kayıtlar" alt={`${l.length} ölçüm`}>
        {l.length ? <div className="ib-tablo-kap" style={{ maxHeight: 420, overflowY: "auto" }}><table className="ib-tablo"><thead><tr><th>Tarih</th><th>Ders</th><th>Ölçüm</th><th>Puan</th><th>Yüzde</th><th>Not</th><th /></tr></thead><tbody>{l.map((o) => { const y = (o.puan / o.max) * 100; const n = notHesap(y, sinirAl(ib, o.did)); const b = DERSLER[o.did].bilesen(ib.dersler[o.did].duzey).find((q) => q.id === o.bilesen);
          return <tr key={o.id}><td>{tarihKisa(o.tarih)}</td><td><span className="ib-sira" style={{ gap: 7, flexWrap: "nowrap" }}><DersNokta did={o.did} />{DERSLER[o.did].kisa}</span></td><td>{o.ad || (b ? b.kisa : "Genel")}<div className="ib-minik ib-ucuncul">{(OLCUM_TUR.find((t) => t.id === o.tur) || {}).ad}{b && o.ad ? ` · ${b.kisa}` : ""}</div></td><td>{o.puan} / {o.max}</td><td><b>%{bicim(y)}</b></td><td><b>{Math.floor(n)}</b></td>
            <td><button type="button" className="ib-ikon-dugme" aria-label="Düzelt" onClick={() => ac({ tur: "olcum", on: o })}><Ik ad="duzenle" boy={17} /></button></td></tr>; })}</tbody></table></div> : <Bos>Bu süzgeçte kayıt yok.</Bos>}
      </Pafta>
      <GrafikKart baslik="Ölçüm sıklığı" alt="Ayda kaç kez kendini sınadın" tablo={{ bas: ["Ay", "Ölçüm"], satir: aylar.map((a) => [a.uzun, a.deger]) }}>
        <Sutunlar veri={aylar} yukseklik={180} birim="" />
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 6 }}>Kendini sınamak, yeniden okumaktan daha kalıcı öğrenme sağlar (Roediger ve Karpicke, 2006).</p>
      </GrafikKart>
    </div>
  </div>;
}

/* ── Koç ── */
export function Koc({ H, ib, yaz, bugun, api, git, tost }) {
  const K = H.koc; const hb = haftaBasi(bugun); const W = ib.plan.woop && ib.plan.woop.hafta === hb ? ib.plan.woop : { hafta: hb, dilek: "", sonuc: "", engel: "", plan: "" };
  const wY = (p) => yaz((s) => ({ ...s, plan: { ...s.plan, woop: { ...W, ...p } } }));
  const topPlan = K.dagitim.reduce((s, x) => s + x.plan, 0), topGercek = K.dagitim.reduce((s, x) => s + x.gercek, 0);
  return <div className="ib-ekran ib-izg">
    <div className="ib-g2">
      <Pafta className="ib-vurgulu" baslik="Bu haftanın dağıtımı" alt="Çubuk bu hafta çalıştığın, dikey çizgi önerilen süre" sag={<span className="ib-kucuk ib-kalin ib-sayi">{dkYazi(topGercek)} / {dkYazi(topPlan)}</span>}>
        <YatayCubuk adGen={215} onSec={(id) => git("dersler", { did: id })} degerBicim={(v) => dkYazi(v)}
          veri={K.dagitim.map((x) => ({ id: x.id, ad: x.ad, alt: x.neden.join(" · "), deger: x.gercek, hedef: x.plan, renk: x.renk, ek: `öneri ${dkYazi(x.plan)}` }))} />
        <hr className="ib-ayrac" />
        <label className="ib-senaryo"><span>Haftalık<small>hedef</small></span><Kaydirak etiket="Haftalık çalışma hedefi" min={4} max={50} deger={K.saat} degis={(v) => yaz((s) => ({ ...s, plan: { ...s.plan, haftaSaat: v } }))} /><b className="ib-sayi">{K.saat} sa</b></label>
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 6 }}>Öneri dört şeye bakar: hedefe uzaklık, HL ya da SL oluşu, konu kapsaması ve üç hafta içindeki tarihler. Dakikalar FORMA seanslarından gelir.</p>
      </Pafta>
      <div className="ib-izg">
        <Pafta baslik="En ucuz puan" alt="Bir üst nota en az yüzde puanı kalan dersler">
          {K.ucuz.length ? <div className="ib-liste">{K.ucuz.slice(0, 4).map((u, i) => <div key={u.id} className="ib-satir"><span className="ib-recete-no">{i + 1}</span><div className="ib-satir-ana"><div className="ib-satir-ad"><DersNokta did={u.id} /> {u.ad}: {u.hedefNot} için {bicim(Math.max(0, u.kalan), 1)} puan</div><div className="ib-satir-alt">{u.hedefte ? "Hedefinin üstüne çıkar" : "Hedefe götürür"}{u.bilesen ? ` · en zayıf halka: ${u.bilesen}` : ""}</div></div>
            <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("dersler", { did: u.id })}>Aç</button></div>)}</div> : <Bos>Yüzde verisi olan ders yok. Ölçüm girdikçe, toplam puanını en az emekle yükseltecek ders burada sıralanır.</Bos>}
        </Pafta>
        {(K.risk.length > 0 || K.ihmal.length > 0 || H.takvim.sikisik) && <Pafta baslik="Dikkat">
          <div className="ib-izg" style={{ gap: 10 }}>
            {K.risk.map((r) => <div key={r.id} className="ib-sira" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Durum tur="ciddi">Sınırda</Durum><span className="ib-ikincil">{r.ad} notu {r.notTam}, alt sınırın yalnız {bicim(r.pay, 1)} puan üstünde.</span></div>)}
            {K.ihmal.slice(0, 2).map((r) => <div key={r.id} className="ib-sira" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Durum tur="uyari">Geride</Durum><span className="ib-ikincil">{r.ad} bu hafta önerinin üçte birine ulaşmadı.</span></div>)}
            {H.takvim.sikisik && <div className="ib-sira" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Durum tur="uyari">Sıkışma</Durum><span className="ib-ikincil">İki haftada {H.takvim.ondort.length} tarih var; yeni konu açmak yerine ödevleri kapat.</span></div>}
          </div></Pafta>}
      </div>
    </div>
    <Pafta baslik="On iki haftanın izi" alt="Ders başına haftalık çalışma; sağdaki sayı son dört hafta">
      <div className="ib-g-oto" style={{ "--en": "330px", gap: "10px 28px" }}>{H.dersler.map((x) => <button key={x.id} type="button" className="ib-duz ib-sira" style={{ flexWrap: "nowrap", gap: 10, justifyContent: "space-between" }} onClick={() => git("dersler", { did: x.id })}>
        <span className="ib-sira" style={{ gap: 8, flexWrap: "nowrap", minWidth: 0 }}><DersNokta did={x.id} /><span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.kisa}</span></span>
        <span className="ib-sira" style={{ gap: 10, flexWrap: "nowrap" }}><Kivilcim veri={H.kopru.hafta.map((h) => h.ders[x.id] || 0)} renk={x.renk} w={110} h={30} min={0} /><b className="ib-sayi" style={{ width: 62, textAlign: "right" }}>{dkYazi(x.dk28)}</b></span></button>)}</div>
    </Pafta>
    <Pafta baslik="Haftanın planı" alt="Dört kısa cümle. Engeli önceden adlandırmak, planı tutma olasılığını artırır (Oettingen, zihinsel karşılaştırma ve uygulama niyeti).">
      <div className="ib-form" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", alignItems: "start" }}>
        <label className="ib-etiket"><span>Bu hafta en çok ne olsun istiyorum?</span><textarea className="ib-alan" style={{ minHeight: 70 }} value={W.dilek} placeholder="örn. Biyoloji İD taslağını bitirmek" onChange={(e) => wY({ dilek: e.target.value })} /></label>
        <label className="ib-etiket"><span>Olursa ne değişir?</span><textarea className="ib-alan" style={{ minHeight: 70 }} value={W.sonuc} placeholder="örn. Kasım'da yalnız sınava çalışırım" onChange={(e) => wY({ sonuc: e.target.value })} /></label>
        <label className="ib-etiket"><span>Beni en çok ne durdurur?</span><textarea className="ib-alan" style={{ minHeight: 70 }} value={W.engel} placeholder="örn. Okuldan sonra telefona dalmak" onChange={(e) => wY({ engel: e.target.value })} /></label>
        <label className="ib-etiket"><span>Eğer o olursa, şunu yapacağım</span><textarea className="ib-alan" style={{ minHeight: 70 }} value={W.plan} placeholder="örn. Telefonu öbür odaya koyar, 25 dakikalık odak açarım" onChange={(e) => wY({ plan: e.target.value })} /></label>
      </div>
    </Pafta>
  </div>;
}

/* ── Zihin ── */
function Nefes({ teknik }) {
  const { az } = useOrtam(); const [acik, setAcik] = useState(false); const [adim, setAdim] = useState(0); const [tur, setTur] = useState(0); const [kalan, setKalan] = useState(0);
  useEffect(() => { if (!acik) return; let i = 0, t = 0; let z;
    const ileri = () => { const [, sn] = teknik.adim[i]; setAdim(i); setKalan(sn); let k = sn; clearInterval(z); z = setInterval(() => { k--; setKalan(Math.max(0, k)); if (k <= 0) { clearInterval(z); i = (i + 1) % teknik.adim.length; if (i === 0) { t++; setTur(t); } ileri(); } }, 1000); };
    ileri(); return () => clearInterval(z); }, [acik, teknik.id]);
  useEffect(() => { setAcik(false); setTur(0); setAdim(0); }, [teknik.id]);
  const [ad, sn] = teknik.adim[adim]; const N = teknik.adim.length;
  const olcek = (i) => { const a = teknik.adim[i][0]; if (/daha al/i.test(a)) return 1.12; if (/^al/i.test(a)) return 1; if (/ver/i.test(a)) return 0.55; return /al/i.test(teknik.adim[(i - 1 + N) % N][0]) ? 1 : 0.55; };
  const buyuk = olcek(adim);
  return <div className="ib-izg" style={{ justifyItems: "center", gap: 14 }}>
    <div className="ib-nefes" style={{ "--ns": `${az ? 0.2 : sn}s` }} aria-live="polite"><span className="ib-nefes-iz" /><span className="ib-nefes-iz" />
      <span className="ib-nefes-daire" style={{ transform: `scale(${acik ? buyuk : 0.7})`, opacity: acik ? 1 : 0.75 }} />
      <span className="ib-nefes-yazi">{acik ? <>{ad}<br /><span className="ib-sayi" style={{ fontSize: 34 }}>{kalan}</span></> : "Hazır"}</span></div>
    <div className="ib-sira"><button type="button" className="ib-dugme" onClick={() => setAcik(!acik)}>{acik ? "Durdur" : "Başlat"}</button><span className="ib-ikincil ib-sayi">{tur} tur</span></div>
    <p className="ib-kucuk ib-ikincil" style={{ textAlign: "center", maxWidth: "46ch" }}>{teknik.ac}</p>
  </div>;
}
const OLCEK = { mod: ["Ruh hâli", ["Kötü", "Düşük", "Orta", "İyi", "Harika"]], enerji: ["Enerji", ["Bitik", "Düşük", "Orta", "İyi", "Dolu"]], stres: ["Stres", ["Sakin", "Hafif", "Orta", "Yüksek", "Çok yüksek"]] };
export function Zihin({ H, ib, yaz, bugun, api, tost }) {
  const Z = H.zihin; const g = ib.zihin.gun[bugun] || {}; const [tek, setTek] = useState("ic"); const [tunel, setTunel] = useState(0); const [dokum, setDokum] = useState(""); const [kart, setKart] = useState(0); const [zafer, setZafer] = useState("");
  const gY = (p) => yaz((s) => ({ ...s, zihin: { ...s.zihin, gun: { ...s.zihin.gun, [bugun]: { ...(s.zihin.gun[bugun] || {}), ...p, t: Date.now() } } } }));
  const seri = (k, ad, renk) => ({ id: k, ad, renk, noktalar: Z.son.filter((x) => x[k] != null).map((x) => ({ t: gunMs(x.t), y: Number(x[k]) })) });
  const seriler = [seri("mod", "Ruh hâli", "var(--d2)"), seri("enerji", "Enerji", "var(--d3)"), seri("stres", "Stres", "var(--d4)")];
  const zaferEkle = () => { const m = zafer.trim(); if (!m) return; yaz((s) => ({ ...s, zihin: { ...s.zihin, zafer: [{ id: kimlik("z"), tarih: bugun, metin: m }, ...s.zihin.zafer].slice(0, 200) } })); setZafer(""); tost("Zafer günlüğüne yazıldı"); };
  const T = NEFES.find((n) => n.id === tek);
  return <div className="ib-ekran ib-izg">
    <div className="ib-g2">
      <Pafta className="ib-vurgulu" baslik="Bugünün kaydı" alt={Z.seri > 1 ? `${Z.seri} gündür kayıt tutuyorsun` : "Yarım dakika sürer"}>
        <div className="ib-izg" style={{ gap: 14 }}>{Object.entries(OLCEK).map(([k, [ad, l]]) => <div key={k}><div className="ib-kucuk ib-ikincil" style={{ marginBottom: 6 }}>{ad}</div><Cipler etiket={ad} secenek={l.map((x, i) => ({ id: i + 1, ad: x }))} deger={g[k] || null} degis={(v) => gY({ [k]: v })} /></div>)}
          <label className="ib-etiket"><span>Bugünden bir cümle</span><input className="ib-girdi" value={g.not || ""} placeholder="İstersen" onChange={(e) => gY({ not: e.target.value })} /></label>
          <p className="ib-ipucu-kutu"><Ik ad="bilgi" boy={17} /> {ZIHIN_IPUCU[Z.isaret]}</p></div>
      </Pafta>
      <GrafikKart baslik="Son iki hafta" alt="1 en düşük, 5 en yüksek" lejant={seriler.map((s) => ({ ad: s.ad, renk: s.renk }))} tablo={{ bas: ["Gün", "Ruh hâli", "Enerji", "Stres"], satir: Z.son.filter((x) => x.var).map((x) => [tarihKisa(x.t), x.mod || "–", x.enerji || "–", x.stres || "–"]) }}>
        <CizgiGrafik seriler={seriler} yMin={1} yMax={5} yCizgi={[1, 2, 3, 4, 5]} xBicim={tarihX} yukseklik={240} alan={false} bos="Birkaç gün kayıt girince eğri burada belirir." />
      </GrafikKart>
    </div>
    <div className="ib-g2">
      <Pafta baslik="Nefes" alt="Ekrandaki daireyi izle; ses gerekmez" sag={<Cipler etiket="Teknik" secenek={NEFES.map((n) => ({ id: n.id, ad: n.ad }))} deger={tek} degis={setTek} />}><Nefes teknik={T} /></Pafta>
      <Pafta baslik="Sınav öncesi tünel" alt="Deneme ya da sınavdan önceki on dakika için dört adım" sag={tunel > 0 ? <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => { setTunel(0); setDokum(""); }}>Baştan</button> : null}>
        <div className="ib-asama" style={{ marginBottom: 14 }}>{["Dök", "Çevir", "Nefes", "İlk hamle"].map((a, i) => <span key={a} className="ib-asama-oge" data-d={i < tunel - 1 ? "bitti" : i === tunel - 1 ? "simdi" : ""} style={{ cursor: "default" }}><span className="ib-asama-top">{i < tunel - 1 ? <Ik ad="tik" boy={13} kalin={3} /> : i + 1}</span><span>{a}</span></span>)}</div>
        {tunel === 0 && <div className="ib-izg"><p className="ib-ikincil" style={{ maxWidth: "58ch" }}>Sınavdan hemen önce kaygıları yazıya dökmek, kaygılı öğrencilerin puanını yükseltti (Ramirez ve Beilock, 2011). Heyecanı tehdit yerine hazırlık olarak adlandırmak da performansı iyileştirdi (Jamieson ve ark., 2010).</p><div><button type="button" className="ib-dugme" onClick={() => setTunel(1)}>Tünele gir</button></div></div>}
        {tunel === 1 && <div className="ib-izg" key="t1" style={{ animation: "ibYuksel .3s both" }}><label className="ib-etiket"><span>Aklından ne geçiyorsa yaz. Kimse okumayacak; istersen kaydetme.</span><textarea className="ib-alan" style={{ minHeight: 130 }} autoFocus value={dokum} onChange={(e) => setDokum(e.target.value)} /></label>
          <div className="ib-sira"><button type="button" className="ib-dugme" onClick={() => { setDokum(""); setTunel(2); }}>Sil ve devam et</button><button type="button" className="ib-dugme ib-dugme-ikincil" disabled={!dokum.trim()} onClick={() => { yaz((s) => ({ ...s, zihin: { ...s.zihin, kaygi: [{ id: kimlik("k"), tarih: bugun, metin: dokum.trim() }, ...s.zihin.kaygi].slice(0, 60) } })); setDokum(""); setTunel(2); }}>Sakla ve devam et</button></div></div>}
        {tunel === 2 && <div className="ib-izg" key="t2" style={{ animation: "ibYuksel .3s both" }}><blockquote className="ib-alinti" key={kart}>{YENIDEN[kart % YENIDEN.length]}</blockquote>
          <div className="ib-sira"><button type="button" className="ib-dugme" onClick={() => setTunel(3)}>Bunu alıyorum</button><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => setKart(kart + 1)}>Başka bir cümle</button></div></div>}
        {tunel === 3 && <div className="ib-izg" key="t3" style={{ animation: "ibYuksel .3s both" }}><Nefes teknik={NEFES[0]} /><div style={{ justifySelf: "center" }}><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => setTunel(4)}>Devam</button></div></div>}
        {tunel === 4 && <div className="ib-izg" key="t4" style={{ animation: "ibYuksel .3s both" }}><p style={{ fontSize: 17, maxWidth: "52ch" }}>Kâğıt açılınca ilk iki dakika yalnız oku. En emin olduğun soruyu bul ve oradan başla. Takıldığın soruyu işaretle, geç.</p><Durum tur="iyi">Hazırsın</Durum></div>}
      </Pafta>
    </div>
    <div className="ib-g3">
      <Pafta baslik="Uyku" alt="FORMA uyku kayıtlarından, son iki hafta" sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => api.formaGit("uyku")}>Kayıt gir</button>}>
        {Z.uOrt == null ? <Bos>Uyku kaydı yok. FORMA'daki uyku günlüğüne yazdıkların burada özetlenir.</Bos> : <div className="ib-sira" style={{ gap: 16, flexWrap: "nowrap" }}>
          <Halka oran={Z.tutarlilik == null ? 0 : Z.tutarlilik} boy={96} kalin={9} renk="var(--d6)" etiket="Yatış saati tutarlılığı"><b className="ib-sayi" style={{ fontSize: 20 }}>{Z.tutarlilik == null ? "–" : `%${Math.round(Z.tutarlilik * 100)}`}</b><small className="ib-minik ib-ucuncul">tutarlılık</small></Halka>
          <div className="ib-izg" style={{ gap: 4 }}><span><b className="ib-sayi">{bicim(Z.uOrt, 1)}</b> saat ortalama</span><span><b className="ib-sayi">{Z.uyku.length}</b> gece kayıtlı</span>{Z.sapma != null && <span className="ib-kucuk ib-ikincil">Yatış saatin ±{Math.round(Z.sapma)} dk oynuyor</span>}</div></div>}
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 10 }}>Düzensiz uyku saatleri, benzer uyku süresine rağmen daha düşük akademik başarıyla ilişkili bulundu (Phillips ve ark., 2017).</p>
      </Pafta>
      <Pafta baslik="Yük" alt="Bu hafta, önceki üç haftanın ortalamasına göre">
        {Z.yukOran == null ? <Bos>Karşılaştırma için birkaç haftalık çalışma verisi gerekiyor.</Bos> : <><div className="ib-sira" style={{ alignItems: "flex-end", gap: 10 }}><span className="ib-buyuk ib-sayi">×{bicim(Z.yukOran, 2)}</span><span className="ib-ikincil">{dkYazi(H.kopru.son7)} / {dkYazi(H.kopru.onceki21)}</span></div>
          <div style={{ marginTop: 12 }}><Olcer oran={Z.yukOran / 2} isaret={0.5} renk={Z.yukOran > 1.6 ? "var(--ciddi)" : Z.yukOran < 0.6 ? "var(--uyari)" : "var(--iyi)"} etiket="Yük oranı" /></div>
          <p className="ib-kucuk ib-ikincil" style={{ marginTop: 8 }}>{Z.yukOran > 1.6 ? "Ani sıçrama. Bir iki günü hafiflet." : Z.yukOran < 0.6 ? "Alıştığından hayli az. Küçük bir seansla yeniden başla." : "Alıştığın aralıkta."}</p></>}
      </Pafta>
      <Pafta baslik="Zafer günlüğü" alt="Küçük de olsa bugün iyi giden bir şey">
        <div className="ib-sira" style={{ flexWrap: "nowrap" }}><input className="ib-girdi" value={zafer} placeholder="örn. İlk kez hatasız türev sorusu" aria-label="Bugünün zaferi" onChange={(e) => setZafer(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") zaferEkle(); }} /><button type="button" className="ib-dugme" disabled={!zafer.trim()} onClick={zaferEkle}>Yaz</button></div>
        <div className="ib-liste" style={{ marginTop: 8, maxHeight: 190, overflowY: "auto" }}>{ib.zihin.zafer.slice(0, 12).map((z) => <div key={z.id} className="ib-satir" style={{ padding: "7px 0" }}><span style={{ color: "var(--altin)", display: "inline-flex" }}><Ik ad="yildiz" boy={16} dolu /></span><div className="ib-satir-ana"><div style={{ fontWeight: 500 }}>{z.metin}</div><div className="ib-satir-alt">{tarihKisa(z.tarih)}</div></div>
          <button type="button" className="ib-ikon-dugme" aria-label="Sil" onClick={() => yaz((s) => ({ ...s, zihin: { ...s.zihin, zafer: s.zihin.zafer.filter((q) => q.id !== z.id) } }))}><Ik ad="kapat" boy={15} /></button></div>)}</div>
      </Pafta>
    </div>
    {ib.zihin.kaygi.length > 0 && <Pafta baslik="Sakladığın dökümler" alt="Yalnız bu cihazda ve kendi hesabında durur" sag={<BasiliTut className="ib-dugme ib-dugme-ince" onay={() => { yaz((s) => ({ ...s, zihin: { ...s.zihin, kaygi: [] } })); tost("Dökümler silindi"); }}>Hepsini sil</BasiliTut>}>
      <div className="ib-liste">{ib.zihin.kaygi.slice(0, 5).map((k) => <div key={k.id} className="ib-satir" style={{ alignItems: "flex-start" }}><div className="ib-satir-ana"><div className="ib-satir-alt">{tarihUzun(k.tarih)}</div><div style={{ whiteSpace: "pre-wrap" }}>{k.metin}</div></div></div>)}</div></Pafta>}
    <p className="ib-kucuk ib-ucuncul" style={{ maxWidth: "80ch" }}>Bu ekran bir öz gözlem aracıdır; tanı koymaz. Kendini uzun süredir kötü hissediyorsan okulunun rehber öğretmeniyle, ailenle ya da bir sağlık uzmanıyla konuş.</p>
  </div>;
}

/* ── Araçlar ── */
function KomutKart({ k, cevir }) { const [a, setA] = useState(false);
  return <button type="button" className="ib-komut" data-a={a ? 1 : 0} onClick={() => setA(!a)} aria-pressed={a}><span className="ib-komut-ic">
    <span className="ib-komut-on"><b>{cevir ? k.tr : k.en}</b><small>{KOMUT_DUZEY[k.duzey]}</small></span>
    <span className="ib-komut-arka"><b>{cevir ? k.en : k.tr}</b><span>{k.ac}</span></span></span></button>; }
export function Araclar({ H, ib, yaz, bugun, tost, api }) {
  const [sek, setSek] = useState("komut"); const [ara, setAra] = useState(""); const [duzey, setDuzey] = useState(0); const [cevir, setCevir] = useState(false);
  const [hd, setHd] = useState("mat"); const [puan, setPuan] = useState(""); const [max, setMax] = useState(""); const [bag, setBag] = useState({ ad: "", url: "" }); const dosya = useRef(null);
  const liste = KOMUT.filter((k) => (!duzey || k.duzey === duzey) && (!ara.trim() || (k.en + " " + k.tr).toLocaleLowerCase("tr").includes(ara.trim().toLocaleLowerCase("tr"))));
  const yz = Number(max) > 0 && puan !== "" ? kis((Number(puan) / Number(max)) * 100, 0, 100) : null; const sinir = sinirAl(ib, hd); const n = notHesap(yz, sinir);
  const indir = () => { try { const b = new Blob([ibDisari(ib)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `ib-pano-${bugun}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); tost("Yedek indirildi"); } catch (e) { tost("İndirilemedi"); } };
  const yukle = (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const y = ibIceri(String(r.result || "")); if (!y) { tost("Bu dosya bir IB panosu yedeği değil"); return; } const eski = ib; yaz(() => y); tost("Yedek yüklendi", () => yaz(() => eski)); }; r.readAsText(f); e.target.value = ""; };
  return <div className="ib-ekran ib-izg">
    <Sekmeler etiket="Araç" ogeler={[{ id: "komut", ad: "Komut terimleri" }, { id: "hesap", ad: "Not hesabı" }, { id: "bag", ad: "Bağlantılar" }, { id: "veri", ad: "Ayarlar ve veri" }]} secili={sek} sec={setSek} />
    {sek === "komut" && <div className="ib-izg ib-ekran" key="k">
      <Pafta baslik="Soru senden ne istiyor?" alt="Karta dokun, arkasını gör. Puanın büyük kısmı, sorunun istediği işi yapmaktan gelir.">
        <div className="ib-sira" style={{ justifyContent: "space-between" }}><input className="ib-girdi" style={{ maxWidth: 260 }} value={ara} placeholder="Terim ara" aria-label="Terim ara" onChange={(e) => setAra(e.target.value)} />
          <Cipler etiket="Düzey" secenek={[{ id: 0, ad: "Hepsi" }, ...[1, 2, 3, 4].map((d) => ({ id: d, ad: KOMUT_DUZEY[d] }))]} deger={duzey} degis={setDuzey} />
          <button type="button" className="ib-dugme ib-dugme-ince" aria-pressed={cevir} onClick={() => setCevir(!cevir)}>Önce Türkçesi</button></div>
      </Pafta>
      <div className="ib-g-oto" style={{ "--en": "200px", gap: 10 }}>{liste.map((k) => <KomutKart key={k.en + cevir} k={k} cevir={cevir} />)}</div>
      {!liste.length && <Bos>Bu aramayla eşleşen terim yok.</Bos>}
    </div>}
    {sek === "hesap" && <div className="ib-g2 ib-ekran" key="h">
      <Pafta baslik="Puandan nota" alt="Bir kâğıttaki puanın hangi nota denk geldiğini gör">
        <div className="ib-izg"><Cipler etiket="Ders" secenek={DERS_SIRA.map((id) => ({ id, ad: DERSLER[id].kisa, renk: DERSLER[id].renk }))} deger={hd} degis={setHd} />
          <div className="ib-form"><label className="ib-etiket"><span>Puan</span><input type="number" inputMode="decimal" className="ib-girdi" value={puan} onChange={(e) => setPuan(e.target.value)} /></label><label className="ib-etiket"><span>Tam puan</span><input type="number" inputMode="decimal" className="ib-girdi" value={max} onChange={(e) => setMax(e.target.value)} /></label></div>
          <div className="ib-sira" style={{ gap: 18, alignItems: "flex-end" }}><NotSayi not={n} boy={64} /><div><div className="ib-orta ib-sayi">{yuzdeYazi(yz)}</div><div className="ib-kucuk ib-ikincil">{n == null ? "Puanı gir" : Math.floor(n) < 7 ? `${Math.floor(n) + 1} için %${sinir[Math.floor(n) - 1]} gerekir` : "En üst not"}</div></div></div></div>
      </Pafta>
      <Pafta baslik="Not sınırları" alt={`${DERSLER[hd].kisa} ${ib.dersler[hd].duzey} · yaklaşık`}>
        <div className="ib-sinir-serit">{[1, 2, 3, 4, 5, 6, 7].map((g) => { const alt = g === 1 ? 0 : sinir[g - 2], ust = g === 7 ? 100 : sinir[g - 1]; const ic = yz != null && yz >= alt && (yz < ust || g === 7);
          return <span key={g} style={{ flexGrow: ust - alt }} data-a={ic ? 1 : 0}><b>{g}</b><small>%{alt}</small></span>; })}{yz != null && <i style={{ left: `${yz}%` }} />}</div>
        <p className="ib-kucuk ib-ikincil" style={{ marginTop: 14 }}>Sınırları ders ekranındaki "Notlar ve sınırlar" bölümünden düzeltebilirsin. Her oturumda birkaç puan oynarlar.</p>
      </Pafta>
    </div>}
    {sek === "bag" && <Pafta baslik="Bağlantılar" alt="ManageBac, ders kaynakları, geçmiş sınav arşivin" key="b">
      <div className="ib-form" style={{ gridTemplateColumns: "minmax(140px,1fr) minmax(180px,2fr) auto" }}><input className="ib-girdi" value={bag.ad} placeholder="Ad" aria-label="Bağlantı adı" onChange={(e) => setBag({ ...bag, ad: e.target.value })} /><input className="ib-girdi" value={bag.url} placeholder="https://" aria-label="Adres" onChange={(e) => setBag({ ...bag, url: e.target.value })} />
        <button type="button" className="ib-dugme" disabled={!bag.ad.trim() || !/^https?:\/\/\S+/.test(bag.url.trim())} onClick={() => { yaz((s) => ({ ...s, baglanti: [...s.baglanti, { id: kimlik("b"), ad: bag.ad.trim(), url: bag.url.trim() }] })); setBag({ ad: "", url: "" }); }}>Ekle</button></div>
      <div className="ib-liste" style={{ marginTop: 10 }}>{ib.baglanti.map((b) => <div key={b.id} className="ib-satir"><Ik ad="dis" boy={17} /><a className="ib-satir-ana" href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--murekkep)", textDecoration: "none" }}><div className="ib-satir-ad">{b.ad}</div><div className="ib-satir-alt" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.url}</div></a>
        <button type="button" className="ib-ikon-dugme" aria-label="Sil" onClick={() => yaz((s) => ({ ...s, baglanti: s.baglanti.filter((q) => q.id !== b.id) }))}><Ik ad="sil" boy={17} /></button></div>)}</div>
      {!ib.baglanti.length && <Bos>Henüz bağlantı yok.</Bos>}
    </Pafta>}
    {sek === "veri" && <div className="ib-g2 ib-ekran" key="v">
      <Pafta baslik="Pano"><div className="ib-izg">
        <label className="ib-etiket"><span>Planın antetinde görünen ad</span><input className="ib-girdi" value={ib.aday} placeholder="Adın" onChange={(e) => yaz((s) => ({ ...s, aday: e.target.value }))} /></label>
        <label className="ib-etiket"><span>Oturum</span><input className="ib-girdi" value={ib.oturum.ad} onChange={(e) => yaz((s) => ({ ...s, oturum: { ...s.oturum, ad: e.target.value } }))} /></label>
        <div><div className="ib-kucuk ib-ikincil" style={{ marginBottom: 6 }}>Görünüm</div><Cipler etiket="Tema" secenek={[{ id: "gece", ad: "Gece (lacivert)" }, { id: "gunduz", ad: "Gündüz (beyaz kâğıt)" }]} deger={ib.tema} degis={(v) => yaz((s) => ({ ...s, tema: v }))} /></div>
        <p className="ib-kucuk ib-ikincil">IB panosu FORMA kaydının içinde durur; FORMA hesabınla birlikte bütün cihazlarına eşitlenir.</p></div></Pafta>
      <Pafta baslik="Veri"><div className="ib-izg">
        <div className="ib-sira"><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={indir}><Ik ad="indir" boy={16} />Yedeği indir</button><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => dosya.current && dosya.current.click()}>Yedekten yükle</button><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => window.print()}><Ik ad="yazdir" boy={16} />Yazdır</button>
          <input ref={dosya} type="file" accept="application/json,.json" hidden onChange={yukle} /></div>
        <p className="ib-kucuk ib-ikincil">Yedek yalnız IB panosunu içerir: {ib.olcum.length} ölçüm, {ib.cas.deneyim.length} CAS deneyimi, {ib.takvim.length} tarih.</p>
        <hr className="ib-ayrac" />
        <div className="ib-sira"><BasiliTut onay={() => { const eski = ib; yaz(() => ({ ...ibVarsayilan(), tema: ib.tema, aday: ib.aday })); tost("IB panosu sıfırlandı", () => yaz(() => eski)); }}>IB panosunu sıfırla (basılı tut)</BasiliTut></div>
        <p className="ib-minik ib-ucuncul">Sıfırlama yalnız bu panodaki IB kayıtlarını siler. FORMA'daki seansların, kadron ve ödüllerin etkilenmez.</p></div></Pafta>
    </div>}
  </div>;
}
