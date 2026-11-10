/* IB modu · Çekirdek (EE, TOK, CAS), İç değerlendirme, Takvim */
import React, { useEffect, useRef, useState } from "react";
import { Ik, Durum, Sekmeler, Onay, Damga, tarihKisa, tarihUzun, kalanYazi, gunFarki, tarihNesne, ymd } from "./ortak.jsx";
import { Halka, Olcer, Bolumlu, GrafikKart, YatayCubuk, bicim } from "./grafik.jsx";
import { Pafta, Bos, Duzey, DersNokta, Adim, AsamaHatti, Cipler, TarihSatir, yuzdeYazi } from "./parca.jsx";
import { DERSLER, DERS_SIRA, EE, TOK, CAS, MATRIS, HARFLER, TAKVIM_TUR } from "./veri.js";
import { useGorunur } from "./hareket.js";

const HarfSec = ({ deger, degis, etiket }) => <Cipler etiket={etiket} secenek={[{ id: "", ad: "Yok" }, ...HARFLER.map((h) => ({ id: h, ad: h }))]} deger={deger || ""} degis={degis} />;
const Girdi = ({ etiket, deger, degis, tur = "text", yer, genis, ...r }) => <label className="ib-etiket" style={genis ? { gridColumn: "1 / -1" } : undefined}><span>{etiket}</span>
  {tur === "alan" ? <textarea className="ib-alan" value={deger || ""} placeholder={yer} onChange={(e) => degis(e.target.value)} {...r} /> : <input type={tur} className="ib-girdi" value={deger == null ? "" : deger} placeholder={yer} onChange={(e) => degis(tur === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} {...r} />}</label>;
function KelimeOlcer({ n, max, alt, ad }) { const o = max ? (n || 0) / max : 0; const asti = n > max;
  return <div><div className="ib-sira" style={{ justifyContent: "space-between" }}><span className="ib-kucuk ib-ikincil">{ad}</span><b className="ib-sayi" style={{ color: asti ? "var(--kritik)" : undefined }}>{bicim(n || 0)} / {bicim(max)}</b></div>
    <Olcer oran={o} renk={asti ? "var(--kritik)" : "var(--vurgu)"} isaret={alt ? alt / max : null} etiket={ad} />{asti && <div className="ib-minik" style={{ color: "var(--kritik)", marginTop: 4 }}>Sınırı {bicim(n - max)} kelime aştın; fazlası okunmaz.</div>}</div>; }
function Gorusmeler({ adlar, l, yaz }) {
  return <div className="ib-liste">{adlar.map((ad, i) => { const g = l[i] || {}; const u = (p) => yaz(l.map((x, k) => (k === i ? { ...x, ...p } : x)));
    return <div key={ad} className="ib-satir" style={{ alignItems: "flex-start" }}><Onay isaretli={!!g.bitti} degis={(v) => u({ bitti: v })} etiket={ad} />
      <div className="ib-satir-ana"><div className="ib-satir-ad">{ad}</div><div className="ib-sira" style={{ marginTop: 6, gap: 8 }}><input type="date" className="ib-girdi" style={{ width: 160 }} value={g.tarih || ""} aria-label={`${ad} tarihi`} onChange={(e) => u({ tarih: e.target.value })} />
        <input className="ib-girdi" style={{ flex: "1 1 180px", width: "auto" }} value={g.not || ""} placeholder="Görüşmeden akılda kalan" aria-label={`${ad} notu`} onChange={(e) => u({ not: e.target.value })} /></div></div></div>; })}</div>;
}
function Matris({ tok, ee }) {
  const ref = useRef(null); const gor = useGorunur(ref);
  return <div ref={ref} className="ib-matris" role="table" aria-label="TOK ve EE matrisi">
    <span className="ib-matris-kose">TOK ↓ · EE →</span>{HARFLER.map((h) => <span key={h} className="ib-matris-bas" data-a={ee === h ? 1 : 0}>{h}</span>)}
    {HARFLER.map((t, i) => <React.Fragment key={t}><span className="ib-matris-bas" data-a={tok === t ? 1 : 0}>{t}</span>
      {HARFLER.map((e, k) => { const v = MATRIS[t][e]; const sec = tok === t && ee === e; const satir = tok === t || ee === e;
        return <span key={e} className="ib-matris-h" data-v={v == null ? "x" : v} data-sec={sec ? 1 : 0} data-iz={satir && !sec ? 1 : 0} style={{ opacity: gor ? 1 : 0, transform: gor ? "none" : "scale(.6)", transitionDelay: `${(i + k) * 35}ms` }} aria-label={`TOK ${t}, EE ${e}: ${v == null ? "başarısızlık koşulu" : v + " puan"}`}>{v == null ? "×" : v}</span>; })}</React.Fragment>)}
  </div>;
}

export function Cekirdek({ H, ib, yaz, bugun, ac, arg, git, tost }) {
  const [sek, setSek] = useState((arg && arg.sek) || "ee");
  useEffect(() => { if (arg && arg.sek) setSek(arg.sek); }, [arg && arg.sek]);
  const ee = ib.ee, tok = ib.tok, cas = ib.cas; const C = H.cek, K = H.cas;
  const eeY = (p) => yaz((s) => ({ ...s, ee: { ...s.ee, ...p } })); const tokY = (k, p) => yaz((s) => ({ ...s, tok: { ...s.tok, [k]: typeof p === "object" && !Array.isArray(p) && k !== "harf" ? { ...s.tok[k], ...p } : p } })); const casY = (p) => yaz((s) => ({ ...s, cas: { ...s.cas, ...p } }));
  return <div className="ib-ekran ib-izg">
    <div className="ib-g2">
      <Pafta className="ib-vurgulu" baslik="Çekirdek puanı" alt="TOK ve EE harfleri birlikte en çok 3 puan getirir">
        <div className="ib-sira" style={{ gap: 22, alignItems: "center" }}>
          <Matris tok={C.tokHarf} ee={C.eeHarf} />
          <div className="ib-izg" style={{ gap: 8, flex: "1 1 180px" }}>
            <div><span className="ib-kahraman ib-sayi" style={{ fontSize: 56 }}>{C.puan == null ? "–" : C.puan}</span><span className="ib-orta ib-ucuncul"> / 3</span></div>
            {C.basarisiz ? <Durum tur="kritik">E harfi diplomayı engeller</Durum> : C.puan == null ? <p className="ib-ikincil">İki harfi de gir ya da ölçüt puanlarını doldur; hücre kendiliğinden işaretlenir.</p> : <Durum tur="iyi">TOK {C.tokHarf} · EE {C.eeHarf}</Durum>}
            <p className="ib-kucuk ib-ikincil">EE {C.eeHarf || "?"}{C.eeKaynak === "olcut" ? " (ölçüt puanlarından tahmin)" : C.eeKaynak === "tahmin" ? " (girilen tahmin)" : ""} · TOK {C.tokHarf || "?"}{C.tokKaynak === "puan" ? " (puanlardan tahmin)" : ""}</p>
          </div>
        </div>
      </Pafta>
      <Pafta baslik="Üç parça, tek bakış">
        <div className="ib-izg" style={{ gap: 14 }}>
          {[["ee", "Uzun Makale (EE)", C.eeAsama / EE.asama.length, `${C.eeAsama} / ${EE.asama.length} aşama · ${bicim(C.eeKelime)} kelime`], ["tok", "Bilgi Kuramı (TOK)", (Number(!!tok.sergi.bitti) + Math.min(1, (tok.deneme.asama || 0) / TOK.asamaDeneme.length)) / 2, `Sergi ${tok.sergi.bitti ? "tamam" : "sürüyor"} · deneme ${tok.deneme.asama || 0} / ${TOK.asamaDeneme.length} aşama`], ["cas", "CAS", K.oran, `${K.ciktiSay} / 7 çıktı · ${K.n} deneyim · ${K.gorusme} / 3 görüşme`]].map(([id, ad, o, alt]) =>
            <button key={id} type="button" className="ib-duz" onClick={() => setSek(id)} style={{ display: "grid", gap: 6 }}><span className="ib-sira" style={{ justifyContent: "space-between" }}><b>{ad}</b><span className="ib-sayi ib-kalin">%{Math.round(o * 100)}</span></span><Olcer oran={o} etiket={ad} /><span className="ib-kucuk ib-ikincil">{alt}</span></button>)}
        </div>
      </Pafta>
    </div>
    <Sekmeler etiket="Çekirdek bölümü" ogeler={[{ id: "ee", ad: "Uzun Makale" }, { id: "tok", ad: "Bilgi Kuramı" }, { id: "cas", ad: "CAS", say: K.n || null }]} secili={sek} sec={setSek} />

    {sek === "ee" && <div className="ib-izg ib-ekran" key="ee">
      <Pafta baslik="Yol haritası" alt="Tamamladığın aşamaya dokun" sag={C.eeAsama >= EE.asama.length ? <Damga vur>TESLİM</Damga> : null}><AsamaHatti asamalar={EE.asama} no={C.eeAsama} sec={(n) => eeY({ asama: n })} /></Pafta>
      <div className="ib-g2">
        <Pafta baslik="Makale"><div className="ib-form">
          <Girdi etiket="Ders" deger={ee.ders} degis={(v) => eeY({ ders: v })} yer="örn. Küresel Siyaset" />
          <Girdi etiket="Danışman" deger={ee.danisman} degis={(v) => eeY({ danisman: v })} />
          <Girdi etiket="Konu" deger={ee.konu} degis={(v) => eeY({ konu: v })} genis />
          <Girdi etiket="Araştırma sorusu" tur="alan" deger={ee.soru} degis={(v) => eeY({ soru: v })} genis yer="Dar, tartışılabilir ve 4.000 kelimede yanıtlanabilir bir soru" style={{ minHeight: 70 }} />
          <Girdi etiket="Kelime sayısı" tur="number" deger={ee.kelime} degis={(v) => eeY({ kelime: v })} min="0" />
          <Girdi etiket="Yansıtma metni (kelime)" tur="number" deger={ee.rpf} degis={(v) => eeY({ rpf: v })} min="0" />
          <Girdi etiket="Kaynak sayısı" tur="number" deger={ee.kaynak} degis={(v) => eeY({ kaynak: v })} min="0" />
          <Girdi etiket="Okulun teslim tarihi" tur="date" deger={ee.teslim} degis={(v) => eeY({ teslim: v })} />
        </div>
        <div className="ib-izg" style={{ marginTop: 14 }}><KelimeOlcer n={Number(ee.kelime) || 0} max={EE.kelime} ad="Makale" /><KelimeOlcer n={Number(ee.rpf) || 0} max={EE.rpf} ad="Yansıtma metni" /></div></Pafta>
        <Pafta baslik="Ölçütlerle öz değerlendirme" alt={`Toplam ${C.eeTop == null ? "–" : C.eeTop} / ${EE.max}`} sag={<span className="ib-orta ib-sayi">{C.eeHarf || "?"}</span>}>
          <div className="ib-izg" style={{ gap: 10 }}>{EE.olcut.map((c) => { const v = ee.olcut[c.k]; return <div key={c.k} className="ib-olcut"><span><b>{c.k}</b> {c.ad}</span><Olcer oran={(Number(v) || 0) / c.max} kalin={6} etiket={c.ad} /><Adim etiket={c.ad} deger={v == null || v === "" ? null : Number(v)} min={0} max={c.max} degis={(n) => eeY({ olcut: { ...ee.olcut, [c.k]: n } })} genis={30} /><small className="ib-ucuncul">/ {c.max}</small></div>; })}</div>
          <hr className="ib-ayrac" /><label className="ib-etiket"><span>Danışmanın tahminî harfi (girersen ölçüt hesabının yerine geçer)</span><HarfSec etiket="EE tahminî harfi" deger={ee.harf} degis={(v) => eeY({ harf: v })} /></label>
          <p className="ib-minik ib-ucuncul" style={{ marginTop: 8 }}>{EE.sinirNot}</p>
        </Pafta>
      </div>
      <Pafta baslik="Yansıtma görüşmeleri" alt="Üç zorunlu görüşme; sonuncusu viva voce"><Gorusmeler adlar={EE.gorusme} l={ee.gorusme} yaz={(l) => eeY({ gorusme: l })} /></Pafta>
      <Pafta baslik="Çalışma notları"><textarea className="ib-alan" style={{ minHeight: 120 }} value={ee.not || ""} placeholder="Argüman hattı, danışman geri bildirimi, eksik kaynaklar" onChange={(e) => eeY({ not: e.target.value })} /></Pafta>
    </div>}

    {sek === "tok" && <div className="ib-izg ib-ekran" key="tok">
      <div className="ib-g2">
        <Pafta baslik="Sergi" alt="Üç nesne, en çok 950 kelime, notun üçte biri" sag={<label className="ib-sira" style={{ gap: 8, cursor: "pointer" }}><Onay isaretli={!!tok.sergi.bitti} degis={(v) => tokY("sergi", { bitti: v })} etiket="Sergi tamamlandı" /><span className="ib-kucuk">Tamamlandı</span></label>}>
          <div className="ib-izg">
            <Girdi etiket="Seçtiğin İD sorusu" deger={tok.sergi.soru} degis={(v) => tokY("sergi", { soru: v })} yer="35 sorudan biri; numarasını ve metnini yaz" />
            {[0, 1, 2].map((i) => <Girdi key={i} etiket={`${i + 1}. nesne`} deger={tok.sergi.nesne[i]} degis={(v) => tokY("sergi", { nesne: tok.sergi.nesne.map((x, k) => (k === i ? v : x)) })} yer="Gerçek, belirli bir nesne ve senin için bağlamı" />)}
            <div className="ib-form"><Girdi etiket="Kelime sayısı" tur="number" deger={tok.sergi.kelime} degis={(v) => tokY("sergi", { kelime: v })} min="0" />
              <label className="ib-etiket"><span>Puan (10 üzerinden)</span><Adim etiket="Sergi puanı" deger={tok.sergi.puan === "" ? null : tok.sergi.puan} min={0} max={10} bos="yok" degis={(v) => tokY("sergi", { puan: v })} /></label></div>
            <KelimeOlcer n={Number(tok.sergi.kelime) || 0} max={TOK.sergi.kelime} ad="Sergi yorumu" />
          </div>
        </Pafta>
        <Pafta baslik="Deneme" alt="Altı başlıktan biri, en çok 1.600 kelime, notun üçte ikisi">
          <div className="ib-izg">
            <Girdi etiket="Seçtiğin başlık" tur="alan" deger={tok.deneme.baslik} degis={(v) => tokY("deneme", { baslik: v })} yer="Başlıklar 1 Mart 2027'de açıklanır (Kasım oturumu için tahminî)" style={{ minHeight: 64 }} />
            <div className="ib-form"><Girdi etiket="Kelime sayısı" tur="number" deger={tok.deneme.kelime} degis={(v) => tokY("deneme", { kelime: v })} min="0" />
              <label className="ib-etiket"><span>Puan (10 üzerinden)</span><Adim etiket="Deneme puanı" deger={tok.deneme.puan === "" ? null : tok.deneme.puan} min={0} max={10} bos="yok" degis={(v) => tokY("deneme", { puan: v })} /></label>
              <Girdi etiket="Okulun teslim tarihi" tur="date" deger={tok.deneme.teslim} degis={(v) => tokY("deneme", { teslim: v })} /></div>
            <KelimeOlcer n={Number(tok.deneme.kelime) || 0} max={TOK.deneme.kelime} ad="Deneme" />
          </div>
        </Pafta>
      </div>
      <Pafta baslik="Deneme yol haritası"><AsamaHatti asamalar={TOK.asamaDeneme} no={Math.min(TOK.asamaDeneme.length, tok.deneme.asama || 0)} sec={(n) => tokY("deneme", { asama: n })} /></Pafta>
      <div className="ib-g2">
        <Pafta baslik="Öğretmenle üç etkileşim" alt="Planlama ve ilerleme formuna yazılır"><Gorusmeler adlar={["Başlık ve ilk fikirler", "Plan ve örnekler", "Taslak üzerine"]} l={tok.deneme.etkilesim} yaz={(l) => tokY("deneme", { etkilesim: l })} /></Pafta>
        <Pafta baslik="Harf" alt={`Toplam ${C.tokTop == null ? "–" : C.tokTop} / 30 (sergi + deneme × 2)`} sag={<span className="ib-orta ib-sayi">{C.tokHarf || "?"}</span>}>
          <label className="ib-etiket"><span>Öğretmenin tahminî harfi (girersen puan hesabının yerine geçer)</span><HarfSec etiket="TOK tahminî harfi" deger={tok.harf} degis={(v) => tokY("harf", v)} /></label>
          <p className="ib-kucuk ib-ikincil" style={{ marginTop: 12 }}>Yaklaşık sınırlar (30 üzerinden): A {TOK.sinir.A}, B {TOK.sinir.B}, C {TOK.sinir.C}, D {TOK.sinir.D}. Bilgi alanları: {TOK.alanlar.join(", ")}.</p>
        </Pafta>
      </div>
    </div>}

    {sek === "cas" && <div className="ib-izg ib-ekran" key="cas">
      <div className="ib-g3">
        <Pafta baslik="Portföy" sag={<label className="ib-sira" style={{ gap: 8, cursor: "pointer" }}><Onay isaretli={!!cas.tamam} degis={(v) => casY({ tamam: v })} etiket="Koordinatör onayladı" /><span className="ib-kucuk">Onaylandı</span></label>}>
          <div className="ib-sira" style={{ gap: 16, flexWrap: "nowrap" }}><Halka oran={K.oran} boy={110} kalin={10} ucNokta etiket={`CAS %${Math.round(K.oran * 100)}`}><b className="ib-buyuk ib-sayi" style={{ fontSize: 26 }}>%{Math.round(K.oran * 100)}</b></Halka>
            <div className="ib-izg" style={{ gap: 4 }}><span><b className="ib-sayi">{K.n}</b> deneyim</span><span><b className="ib-sayi">{bicim(K.ay, 1)}</b> / {CAS.ay} ay</span><span style={{ color: K.yansimasiz ? "var(--altin)" : undefined }}><b className="ib-sayi">{K.yansimasiz}</b> yansıma bekliyor</span></div></div>
          <label className="ib-etiket" style={{ marginTop: 12 }}><span>CAS başlangıç tarihi</span><input type="date" className="ib-girdi" value={cas.bas || ""} onChange={(e) => casY({ bas: e.target.value })} /></label>
        </Pafta>
        <Pafta baslik="Üç kol dengesi" alt="Deneyim sayısına göre">
          <Bolumlu kalin={12} parcalar={CAS.kollar.map((k) => ({ ad: k.ad, deger: K.kol[k.id], renk: k.renk }))} />
          <div className="ib-izg" style={{ gap: 6, marginTop: 12 }}>{CAS.kollar.map((k) => <div key={k.id} className="ib-sira" style={{ justifyContent: "space-between" }}><span className="ib-sira" style={{ gap: 8 }}><i className="ib-nokta" style={{ background: k.renk }} />{k.ad}</span><span className="ib-sayi"><b>{K.kol[k.id]}</b> deneyim{K.saat[k.id] ? ` · ${bicim(K.saat[k.id])} sa` : ""}</span></div>)}</div>
          {CAS.kollar.some((k) => !K.kol[k.id]) && K.n > 0 && <p className="ib-kucuk" style={{ marginTop: 10, color: "var(--altin)" }}>{CAS.kollar.filter((k) => !K.kol[k.id]).map((k) => k.ad).join(" ve ")} kolunda henüz deneyim yok.</p>}
        </Pafta>
        <Pafta baslik="CAS projesi" alt="En az bir ay, ekip hâlinde, beş aşama">
          {K.proje ? <><b>{K.proje.ad}</b><p className="ib-kucuk ib-ikincil">{tarihKisa(K.proje.bas)}{K.proje.bit ? ` – ${tarihKisa(K.proje.bit)}` : " – sürüyor"}</p><div style={{ marginTop: 8 }}>{K.projeTamam ? <Durum tur="iyi">Bir ay koşulu sağlandı</Durum> : <Durum tur="uyari">Bitiş tarihi bir ayı doldurmalı</Durum>}</div></> : <Bos>Bir deneyimi "CAS projem" olarak işaretle.</Bos>}
          <p className="ib-minik ib-ucuncul" style={{ marginTop: 10 }}>{CAS.asama.join(" · ")}</p>
        </Pafta>
      </div>
      <Pafta baslik="Yedi öğrenme çıktısı" alt="Her çıktı için en az bir kanıt gerekir" sag={<span className="ib-kalin ib-sayi">{K.ciktiSay} / 7</span>}>
        <div className="ib-cikti">{CAS.cikti.map((c, i) => <div key={c} className="ib-cikti-oge" data-d={K.cikti[i] ? 1 : 0}><span className="ib-cikti-no">{K.cikti[i] ? <Ik ad="tik" boy={15} kalin={3} /> : i + 1}</span><span>{c}<small>{K.cikti[i] ? `${K.cikti[i]} deneyimde kanıt` : "kanıt yok"}</small></span></div>)}</div>
      </Pafta>
      <Pafta baslik="Deneyimler" sag={<button type="button" className="ib-dugme" onClick={() => ac({ tur: "cas" })}><Ik ad="arti" boy={16} />Deneyim ekle</button>}>
        {cas.deneyim.length ? <div className="ib-liste">{[...cas.deneyim].sort((a, b) => (a.bas < b.bas ? 1 : -1)).map((x) => <div key={x.id} className="ib-satir">
          <span className="ib-sira" style={{ gap: 3 }}>{CAS.kollar.map((k) => <span key={k.id} className="ib-kol" data-a={(x.tur || []).includes(k.id) ? 1 : 0} style={{ "--kr": k.renk }}>{k.id}</span>)}</span>
          <div className="ib-satir-ana"><div className="ib-satir-ad">{x.ad}{x.proje ? " · proje" : ""}</div><div className="ib-satir-alt">{tarihKisa(x.bas)}{x.bit ? ` – ${tarihKisa(x.bit)}` : ""}{x.saat ? ` · ${x.saat} sa` : ""} · {(x.cikti || []).length} çıktı{!String(x.yansima || "").trim() ? " · yansıma yok" : ""}</div></div>
          <button type="button" className="ib-ikon-dugme" aria-label="Düzelt" onClick={() => ac({ tur: "cas", on: x })}><Ik ad="duzenle" boy={17} /></button></div>)}</div>
          : <Bos eylem={() => ac({ tur: "cas" })} eylemAd="İlk deneyimi ekle">Kulüp, spor, gönüllülük: aklına gelen ilk deneyimi yaz, yansımasını sonra eklersin.</Bos>}
      </Pafta>
      <Pafta baslik="CAS görüşmeleri"><Gorusmeler adlar={CAS.gorusme} l={cas.gorusme} yaz={(l) => casY({ gorusme: l })} /></Pafta>
    </div>}
  </div>;
}

/* ── İç değerlendirme ── */
export function IcDeger({ H, ib, yaz, bugun, arg, git }) {
  const [acik, setAcik] = useState((arg && arg.id) || null);
  useEffect(() => { if (arg && arg.id) setAcik(arg.id); }, [arg && arg.id]);
  const oY = (id, p) => yaz((s) => ({ ...s, odev: { ...s.odev, [id]: { ...(s.odev[id] || {}), ...p } } }));
  const bitti = H.odevler.filter((o) => o.bitti).length;
  return <div className="ib-ekran ib-izg">
    <div className="ib-g2">
      <Pafta className="ib-vurgulu" baslik="Ödev portföyü" alt="İç değerlendirmeler ve dışarıya gönderilen yazılar" sag={<span className="ib-orta ib-sayi">{bitti} / {H.odevler.length}</span>}>
        <YatayCubuk max={1} adGen={190} onSec={(id) => setAcik(id)} secili={acik} degerBicim={(v) => `%${Math.round(v * 100)}`}
          veri={H.odevler.map((o) => ({ id: o.id, ad: o.ad.split(" · ")[1], alt: DERSLER[o.did].kisa, deger: o.oran, renk: DERSLER[o.did].renk, ek: o.bitti ? "bitti" : o.kalan == null ? "tarih yok" : kalanYazi(o.kalan) }))} />
      </Pafta>
      <Pafta baslik="Notundaki payı" alt="Sınav dışında, senin elinde olan yüzde">
        <div className="ib-liste">{H.dersler.map((x) => { const pay = x.bilesenler.filter((b) => !b.muaf && b.tur !== "sinav").reduce((s, b) => s + b.agirlikN, 0); return <div key={x.id} className="ib-satir" style={{ padding: "8px 0" }}><DersNokta did={x.id} /><div className="ib-satir-ana"><div className="ib-satir-ad">{x.kisa}</div></div><span style={{ width: 120 }}><Olcer oran={pay / 100} renk={x.renk} kalin={6} etiket={`${x.kisa} sınav dışı pay`} /></span><b className="ib-sayi" style={{ width: 44, textAlign: "right" }}>%{bicim(pay)}</b></div>; })}</div>
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 8 }}>Bu puanlar sınav salonuna girmeden kazanılır; erken bitirilen ödev sınav dönemine zaman bırakır.</p>
      </Pafta>
    </div>
    {H.odevler.map((o) => { const x = o.durum; const a = acik === o.id; const b = o.bilesen; const top = b.olcut ? b.olcut.reduce((s, c) => s + (Number((x.olcut || {})[c.k]) || 0), 0) : null; const dolu = b.olcut ? b.olcut.filter((c) => (x.olcut || {})[c.k] != null).length : 0;
      return <Pafta key={o.id} id={"odev-" + o.id} style={{ "--dr": DERSLER[o.did].renk }}>
        <button type="button" className="ib-duz ib-sira" style={{ width: "100%", justifyContent: "space-between", flexWrap: "nowrap" }} aria-expanded={a} onClick={() => setAcik(a ? null : o.id)}>
          <span className="ib-sira" style={{ gap: 10, minWidth: 0, flexWrap: "nowrap" }}><DersNokta did={o.did} boy={12} /><span style={{ minWidth: 0 }}><b style={{ fontSize: 16 }}>{o.ad}</b><span className="ib-kucuk ib-ikincil" style={{ display: "block" }}>notun %{bicim(b.agirlik)} kadarı · {b.max} puan{o.bitti ? "" : ` · sıradaki: ${o.asama[o.asamaNo]}`}</span></span></span>
          <span className="ib-sira" style={{ gap: 12, flexWrap: "nowrap" }}>{o.bitti ? <Damga>BİTTİ</Damga> : o.kalan != null && <span className="ib-kucuk ib-kalin" style={{ color: o.kalan < 0 ? "var(--kritik)" : o.kalan <= 14 ? "var(--altin)" : "var(--murekkep-2)" }}>{kalanYazi(o.kalan)}</span>}
            <Halka oran={o.oran} boy={40} kalin={5} renk={DERSLER[o.did].renk} etiket={`%${Math.round(o.oran * 100)}`} /><Ik ad={a ? "yukari" : "asagi"} boy={18} /></span></button>
        {a && <div className="ib-izg" style={{ marginTop: 14, animation: "ibYuksel .3s var(--cik) both" }}>
          <AsamaHatti asamalar={o.asama} no={o.asamaNo} sec={(n) => oY(o.id, { asama: n })} />
          <p className="ib-ipucu-kutu"><Ik ad="bilgi" boy={17} /> {o.ipucu}</p>
          <div className="ib-g2">
            <div className="ib-form" style={{ alignContent: "start" }}>
              <Girdi etiket="Konu / başlık" deger={x.konu} degis={(v) => oY(o.id, { konu: v })} genis />
              <Girdi etiket="Okulun teslim tarihi" tur="date" deger={x.teslim} degis={(v) => oY(o.id, { teslim: v })} />
              {o.kelime > 0 && <Girdi etiket="Kelime sayısı" tur="number" deger={x.kelime} degis={(v) => oY(o.id, { kelime: v })} min="0" />}
              <label className="ib-etiket"><span>Kesinleşen puan ({b.max} üzerinden)</span><Adim etiket="Kesinleşen puan" deger={x.puan == null || x.puan === "" ? null : Number(x.puan)} min={0} max={b.max} bos="yok" degis={(v) => oY(o.id, { puan: v })} /></label>
              {x.puan != null && x.puan !== "" && <button type="button" className="ib-dugme ib-dugme-ince" style={{ alignSelf: "end" }} onClick={() => oY(o.id, { puan: null })}>Puanı sil</button>}
              {o.kelime > 0 && <div style={{ gridColumn: "1 / -1" }}><KelimeOlcer n={Number(x.kelime) || 0} max={o.kelime} alt={o.kelimeAlt} ad="Kelime" /></div>}
              <Girdi etiket="Notlar ve geri bildirim" tur="alan" deger={x.not} degis={(v) => oY(o.id, { not: v })} genis />
            </div>
            {b.olcut && <div><div className="ib-sira" style={{ justifyContent: "space-between", marginBottom: 8 }}><b>Ölçütlerle öz değerlendirme</b><span className="ib-sayi ib-kalin">{dolu ? `${top} / ${b.max} · ${yuzdeYazi((top / b.olcut.filter((c) => (x.olcut || {})[c.k] != null).reduce((s, c) => s + c.max, 0)) * 100)}` : "–"}</span></div>
              <div className="ib-izg" style={{ gap: 10 }}>{b.olcut.map((c) => { const v = (x.olcut || {})[c.k]; return <div key={c.k} className="ib-olcut"><span><b>{c.k}</b> {c.ad}</span><Olcer oran={(Number(v) || 0) / c.max} kalin={6} renk={DERSLER[o.did].renk} etiket={c.ad} /><Adim etiket={c.ad} deger={v == null ? null : Number(v)} min={0} max={c.max} degis={(n) => oY(o.id, { olcut: { ...(x.olcut || {}), [c.k]: n } })} genis={30} /><small className="ib-ucuncul">/ {c.max}</small></div>; })}</div>
              <p className="ib-minik ib-ucuncul" style={{ marginTop: 8 }}>Kesinleşen puan girilene kadar ders notunda bu öz değerlendirme kullanılır.</p></div>}
          </div>
          <div className="ib-sira"><button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("dersler", { did: o.did })}>{DERSLER[o.did].kisa} dersine git</button></div>
        </div>}
      </Pafta>; })}
  </div>;
}

/* ── Takvim ── */
function Serit({ H, ib, bugun, sec }) {
  const kap = useRef(null); const bas = ymd(new Date(tarihNesne(bugun).getFullYear(), tarihNesne(bugun).getMonth(), 1)); const son = ib.oturum.sonuc > bugun ? ib.oturum.sonuc : H.takvim.hepsi.length ? H.takvim.hepsi[H.takvim.hepsi.length - 1].tarih : bugun;
  const gun = Math.max(120, gunFarki(son, bas) + 30); const px = 6.4; const X = (t) => gunFarki(t, bas) * px + 30;
  const aylar = []; { const d = tarihNesne(bas); for (let i = 0; i < 40 && gunFarki(ymd(d), bas) < gun; i++) { aylar.push({ t: ymd(d), ad: d.toLocaleDateString("tr-TR", { month: "short", year: d.getMonth() === 0 || i === 0 ? "2-digit" : undefined }) }); d.setMonth(d.getMonth() + 1); } }
  /* dört şerit: ikisi hattın üstünde, ikisi altında; her öğe en çok boşluğu olan şeride yerleşir */
  const l = H.takvim.hepsi.filter((x) => x.tarih >= bas); const yer = []; const sonX = [-999, -999, -999, -999];
  for (const x of l) { const xx = X(x.tarih); let s = sonX.findIndex((q) => xx - q >= 112); if (s < 0) s = sonX.indexOf(Math.min(...sonX)); sonX[s] = xx; yer.push({ x, xx, ust: s % 2, sira: s >> 1 }); }
  useEffect(() => { if (kap.current) kap.current.scrollLeft = Math.max(0, X(bugun) - 120); }, []);
  return <div className="ib-serit" ref={kap} tabIndex={0} aria-label="Zaman şeridi; kaydırılabilir">
    <div className="ib-serit-ic" style={{ width: gun * px + 80, height: 252 }}>
      <div className="ib-serit-hat" style={{ top: 124 }} />
      {aylar.map((a) => <span key={a.t} className="ib-serit-ay" style={{ left: X(a.t), top: 128 }}>{a.ad}</span>)}
      <span className="ib-serit-bugun" style={{ left: X(bugun), top: 22, bottom: 14 }} />
      {yer.map(({ x, xx, ust, sira }, i) => { const T = TAKVIM_TUR.find((t) => t.id === x.tur) || TAKVIM_TUR[4]; const renk = x.did ? DERSLER[x.did].renk : T.renk;
        const nokta = <span className={"ib-serit-nokta" + (!x.bitti && x.kalan >= 0 && x.kalan <= 7 ? " ib-nabiz" : "")} style={{ background: x.bitti ? "var(--yuzey-3)" : renk, borderRadius: x.tur === "sinav" ? 3 : "50%" }} />;
        const sap = <span className="ib-serit-sap" style={{ height: sira ? 52 : 8 }} />;
        return <button key={x.id} type="button" className="ib-serit-oge" style={{ left: xx, ...(ust ? { top: 117 } : { bottom: 252 - 133 }), animation: `ibYuksel .5s ${Math.min(i, 24) * 30}ms both` }} onClick={() => sec(x)} title={`${x.ad} · ${tarihUzun(x.tarih)}`}>
          {ust ? <>{nokta}{sap}<span className="ib-serit-ad">{x.ad}</span></> : <><span className="ib-serit-ad">{x.ad}</span>{sap}{nokta}</>}</button>; })}
    </div></div>;
}
export function Takvim({ H, ib, yaz, bugun, ac, git, tost }) {
  const [sek, setSek] = useState("yaklasan");
  const isaretle = (x, v) => { if (x.kaynak === "takvim") yaz((s) => ({ ...s, takvim: s.takvim.map((t) => (t.id === x.id ? { ...t, bitti: v } : t)) })); };
  const tikla = (x) => { if (x.kaynak === "takvim") ac({ tur: "takvim", on: ib.takvim.find((t) => t.id === x.id) }); else if (x.kaynak === "odev") git("ia", { id: x.odevId }); else if (x.kaynak === "ee") git("cekirdek", { sek: "ee" }); else if (x.kaynak === "tok") git("cekirdek", { sek: "tok" }); else if (x.kaynak === "sinav") setSek("sinav"); };
  const liste = sek === "gecmis" ? H.takvim.hepsi.filter((x) => x.kalan < 0 || x.bitti).reverse() : [...H.takvim.geciken, ...H.takvim.acik];
  const ay = {}; for (const x of liste) { const k = x.tarih.slice(0, 7); (ay[k] = ay[k] || []).push(x); }
  const sinavY = (id, p) => yaz((s) => ({ ...s, sinav: s.sinav.map((q) => (q.id === id ? { ...q, ...p, tahmini: false } : q)) }));
  const sinavlar = [...ib.sinav].sort((a, b) => (a.tarih < b.tarih ? -1 : 1));
  const tahmini = ib.sinav.some((s) => s.tahmini);
  return <div className="ib-ekran ib-izg">
    <Pafta className="ib-vurgulu" baslik="Sonuçlara kadar yol" alt="Kare işaretler sınav, yuvarlaklar teslim ve öbür tarihler. Kaydır, dokun." sag={<button type="button" className="ib-dugme" onClick={() => ac({ tur: "takvim" })}><Ik ad="arti" boy={16} />Tarih ekle</button>}>
      <Serit H={H} ib={ib} bugun={bugun} sec={tikla} />
    </Pafta>
    {H.takvim.sikisik && <Pafta><div className="ib-sira" style={{ gap: 12 }}><Durum tur="uyari">Takvim sıkışıyor</Durum><span className="ib-ikincil">Önündeki 7 günde {H.takvim.yedi.length}, 14 günde {H.takvim.ondort.length} iş var. Birini öne çekmek ya da öğretmenle tarih konuşmak için en uygun an şimdi.</span></div></Pafta>}
    <Sekmeler etiket="Takvim görünümü" ogeler={[{ id: "yaklasan", ad: "Yaklaşan", say: H.takvim.acik.length }, { id: "sinav", ad: "Sınav programı" }, { id: "gecmis", ad: "Geçmiş" }]} secili={sek} sec={setSek} />
    {sek !== "sinav" && (Object.keys(ay).length ? <div className="ib-g-oto" style={{ "--en": "320px", alignItems: "start" }}>{Object.entries(ay).map(([k, l]) => <Pafta key={k} baslik={tarihNesne(k + "-01").toLocaleDateString("tr-TR", { month: "long", year: "numeric" })} alt={`${l.length} tarih`}>
      <div className="ib-liste">{l.map((x) => <TarihSatir key={x.id} x={x} tikla={tikla} isaretle={x.kaynak === "takvim" ? isaretle : null} />)}</div></Pafta>)}</div> : <Bos eylem={() => ac({ tur: "takvim" })} eylemAd="Tarih ekle">{sek === "gecmis" ? "Geçmişte kayıt yok." : "Önünde tarihli bir iş yok."}</Bos>)}
    {sek === "sinav" && <Pafta baslik={`${ib.oturum.ad} sınav programı`} alt={tahmini ? "IB bu oturumun programını henüz yayımlamadı. Tarihler Kasım 2026 sırasından öngörüdür; okul açıklayınca düzelt." : "Tarihleri sen girdin."}>
      <div className="ib-tablo-kap"><table className="ib-tablo"><thead><tr><th>Ders</th><th>Kâğıt</th><th>Tarih</th><th>Dilim</th><th>Süre</th><th>Kalan</th></tr></thead><tbody>{sinavlar.map((s) => { const b = DERSLER[s.did].bilesen(ib.dersler[s.did].duzey).find((q) => q.id === s.bid); const muaf = ib.dersler[s.did].muaf[s.bid];
        return <tr key={s.id} style={{ opacity: muaf ? 0.45 : 1 }}><td><span className="ib-sira" style={{ gap: 8, flexWrap: "nowrap" }}><DersNokta did={s.did} />{DERSLER[s.did].kisa}</span></td><td>{b ? b.ad : s.bid}{muaf ? " · uygulanmıyor" : ""}</td>
          <td><input type="date" className="ib-girdi" style={{ width: 158, minHeight: 36 }} value={s.tarih} aria-label="Sınav tarihi" onChange={(e) => e.target.value && sinavY(s.id, { tarih: e.target.value })} />{s.tahmini && <div className="ib-minik ib-ucuncul">tahminî</div>}</td>
          <td><Cipler etiket="Dilim" secenek={[{ id: "ÖÖ", ad: "Sabah" }, { id: "ÖS", ad: "Öğleden sonra" }]} deger={s.dilim} degis={(v) => sinavY(s.id, { dilim: v })} /></td><td className="ib-sayi">{b && b.sure ? `${b.sure} dk` : "–"}</td><td className="ib-sayi ib-kalin">{kalanYazi(gunFarki(s.tarih, bugun))}</td></tr>; })}</tbody></table></div>
      <div className="ib-form" style={{ marginTop: 14 }}>
        <label className="ib-etiket"><span>İlk sınavın (geri sayım buna göre)</span><input type="date" className="ib-girdi" value={ib.oturum.ilkSinav} onChange={(e) => e.target.value && yaz((s) => ({ ...s, oturum: { ...s.oturum, ilkSinav: e.target.value } }))} /></label>
        <label className="ib-etiket"><span>Sonuç günü</span><input type="date" className="ib-girdi" value={ib.oturum.sonuc} onChange={(e) => e.target.value && yaz((s) => ({ ...s, oturum: { ...s.oturum, sonuc: e.target.value } }))} /></label>
        <button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => { const ilk = sinavlar.find((s) => !ib.dersler[s.did].muaf[s.bid]); if (ilk) { yaz((s) => ({ ...s, oturum: { ...s.oturum, ilkSinav: ilk.tarih } })); tost("Geri sayım ilk sınavına ayarlandı"); } }}>Geri sayımı programdan al</button>
      </div>
      <p className="ib-minik ib-ucuncul" style={{ marginTop: 10 }}>Fransızca B kâğıtlarının günü öngörülemedi; okul bildirince Yaklaşan sekmesinden "Tarih ekle" ile gir.</p>
    </Pafta>}
  </div>;
}
