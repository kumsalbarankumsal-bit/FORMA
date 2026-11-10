/* IB modu · Kokpit ve Dersler */
import React, { useMemo, useState } from "react";
import { DiplomaPlani } from "./plan.jsx";
import { Ik, Durum, GeriSayim, Damga, Onay, tarihGun, tarihKisa, kalanYazi, tarihNesne, kimlik } from "./ortak.jsx";
import { Halka, Kivilcim, CizgiGrafik, YatayCubuk, Sutunlar, Radar, IsiTakvim, IsiOlcek, Gosterge, Olcer, GrafikKart, Sayi, bicim } from "./grafik.jsx";
import { Pafta, Bos, Duzey, DersNokta, Adim, Kaydirak, Cipler, NotSayi, yuzdeYazi, dkYazi, TarihSatir } from "./parca.jsx";
import { DERSLER, ZIHIN_IPUCU, SINIR_NOTU } from "./veri.js";
import { gerekenYuzde, senaryoNot } from "./motor.js";

export const formaPid = (api, did) => ((api.gruplar || {})[DERSLER[did] ? DERSLER[did].forma : did] || [])[0] || null;
const DURUM_IK = { iyi: ["tik", "var(--iyi)", "Sağlandı"], kotu: ["uyari", "var(--kritik)", "Risk"], yolda: ["saat", "var(--vurgu)", "Yolda"], bilinmiyor: ["bilgi", "var(--murekkep-3)", "Veri bekliyor"] };
const MOD_AD = ["Kötü", "Düşük", "Orta", "İyi", "Harika"];

export function Kokpit({ H, ib, yaz, bugun, api, git, ac, tost }) {
  const [uz, setUz] = useState(null);
  const plan = H.dersler.map((x) => ({ id: x.id, ad: x.ad, kisa: x.kisa, duzey: x.duzey, renk: x.renk, not: x.not, hedef: x.hedef }));
  const ilk = tarihNesne(ib.oturum.ilkSinav); ilk.setHours(9, 0, 0, 0);
  const haftalar = H.kopru.hafta.map((h) => ({ ad: tarihKisa(h.bas).replace(/\.$/, ""), uzun: `${tarihKisa(h.bas)} haftası`, deger: h.dk / 60, ek: "çalışma" }));
  const buHafta = H.kopru.hafta[11] ? H.kopru.hafta[11].dk : 0;
  const modSec = (v) => { yaz((s) => ({ ...s, zihin: { ...s.zihin, gun: { ...s.zihin.gun, [bugun]: { ...(s.zihin.gun[bugun] || {}), mod: v, t: Date.now() } } } })); tost("Bugünün kaydı alındı"); };
  const bos = H.eksikNot === H.dersler.length && !ib.olcum.length;
  return <div className="ib-ekran ib-izg">
    <div className="ib-kahraman-izg">
      <div className="ib-izg">
      <Pafta className="ib-vurgulu" baslik="Diploma planı" alt="Her hücre bir puan. Dolu hücreler bugünkü durumun, çerçeveli olanlar hedefe kalan yol."
        sag={H.kosul.kotu ? <Durum tur="kritik">{H.kosul.kotu} koşul riskte</Durum> : H.eksikNot ? <Durum tur="bilgi">{H.eksikNot} derste veri yok</Durum> : <Damga vur>YOLUNDA</Damga>}>
        <DiplomaPlani dersler={plan} cekirdekPuan={H.cek.puan} casOran={H.cas.oran} uz={uz} setUz={setUz} sec={(id) => (id === "cekirdek" ? git("cekirdek") : git("dersler", { did: id }))} aday={ib.aday || api.ad || "Aday"} oturum={ib.oturum.ad} />
        {bos && <div className="ib-bos" style={{ marginTop: 12 }}><span>Plan henüz boş. Bir ölçüm ya da öğretmen tahmini girdiğinde hücreler yanmaya başlar.</span>
          <span className="ib-sira"><button type="button" className="ib-dugme" onClick={() => ac({ tur: "olcum" })}>İlk ölçümü ekle</button><button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => git("dersler")}>Tahminî notları gir</button></span></div>}
      </Pafta>
    <div className="ib-ders-serit">{H.dersler.map((x) => <button key={x.id} type="button" className="ib-pafta ib-pafta-tik ib-ders-kart" onClick={() => git("dersler", { did: x.id })} onPointerEnter={() => setUz(x.id)} onPointerLeave={() => setUz(null)}
        style={{ "--dr": x.renk, outline: uz === x.id ? "1.5px solid var(--dr)" : "none" }} aria-label={`${x.ad} ${x.duzey}, not ${x.notTam == null ? "yok" : x.notTam}, hedef ${x.hedef}`}>
        <span className="ib-sira" style={{ gap: 7, flexWrap: "nowrap" }}><DersNokta did={x.id} /><b style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.kisa}</b><Duzey z={x.duzey} /></span>
        <span className="ib-sira" style={{ justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, flexWrap: "nowrap" }}><NotSayi not={x.not} boy={38} /><Kivilcim veri={x.trend.slice(-10).map((t) => t.y)} renk={x.renk} w={78} h={30} min={0} max={100} /></span>
        <Olcer oran={x.not == null ? 0 : (x.not - 1) / 6} renk={x.renk} isaret={(x.hedef - 1) / 6} etiket={`${x.kisa} hedefe göre`} kalin={6} />
        <span className="ib-sira ib-minik ib-ikincil" style={{ justifyContent: "space-between", marginTop: 8 }}><span>hedef {x.hedef}{x.kaynak === "tahmin" ? " · öğretmen tahmini" : ""}</span><span>{x.dk7 ? `${dkYazi(x.dk7)} bu hafta` : "bu hafta yok"}</span></span>
      </button>)}</div>
      </div>
      <div className="ib-izg">
        <Pafta baslik="İlk sınava kalan" alt={`${tarihGun(ib.oturum.ilkSinav)}${ib.sinav.some((s) => s.tahmini) ? " · tahminî tarih" : ""}`} sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("takvim")}>Takvim</button>}>
          <GeriSayim hedefMs={ilk.getTime()} buyuk saniye />
          <div className="ib-sira ib-kucuk ib-ikincil" style={{ marginTop: 12, gap: 16 }}><span><b className="ib-sayi" style={{ color: "var(--murekkep)" }}>{Math.max(0, Math.floor(H.kalanGun / 7))}</b> hafta</span><span><b className="ib-sayi" style={{ color: "var(--murekkep)" }}>{H.takvim.acik.filter((t) => t.tur === "teslim").length}</b> açık teslim</span><span><b className="ib-sayi" style={{ color: "var(--murekkep)" }}>{H.takvim.yedi.length}</b> iş bu hafta</span></div>
        </Pafta>
        <Pafta baslik="Bugünün reçetesi" alt="Açığın, takvimin ve tekrar günlerinin gösterdiği sıra">
          <div className="ib-liste">{H.koc.recete.map((r, i) => { const pid = r.did ? formaPid(api, r.did) : null;
            return <div key={i} className="ib-satir"><span className="ib-recete-no">{i + 1}</span>
              <div className="ib-satir-ana"><div className="ib-satir-ad">{r.did && <DersNokta did={r.did} />} {r.ad}</div><div className="ib-satir-alt">{r.alt}</div></div>
              {r.tur === "tarih" ? <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("takvim")}>Aç</button>
                : pid ? <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => api.odakAc({ pid })}><Ik ad="oynat" boy={14} dolu />{r.dk ? `${r.dk} dk çalış` : "Çalış"}</button> : null}</div>; })}</div>
        </Pafta>
        <Pafta baslik="Diploma güvenliği" alt="IB'nin diploma verme koşulları, bugünkü verinle" sag={<span className="ib-kucuk ib-kalin ib-sayi">{H.kosul.iyi} / {H.kosul.l.length}</span>}>
          <div className="ib-kosul">{H.kosul.l.map((k, i) => { const [ik, renk, ad] = DURUM_IK[k.durum];
            return <div key={k.id} className="ib-kosul-oge" style={{ animationDelay: `${300 + i * 60}ms` }} title={ad}><span style={{ color: renk, display: "inline-flex" }}><Ik ad={ik} boy={17} kalin={2.3} /></span>
              <span><b>{k.ad}</b><small>{ad}: {k.ac}</small></span></div>; })}</div>
        </Pafta>
      </div>
    </div>

    <div className="ib-g3">
      <Pafta baslik="Yaklaşan tarihler" sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => ac({ tur: "takvim" })}><Ik ad="arti" boy={14} />Ekle</button>}>
        {H.takvim.sikisik && <p className="ib-uyari-kutu"><Durum tur="uyari">Takvim sıkışıyor</Durum><span>Önündeki iki haftada {H.takvim.ondort.length} iş var. En büyüğünü bu hafta küçült.</span></p>}
        {H.takvim.geciken.length > 0 && <p className="ib-uyari-kutu"><Durum tur="kritik">{H.takvim.geciken.length} iş gecikti</Durum></p>}
        <div className="ib-liste">{[...H.takvim.geciken, ...H.takvim.acik].slice(0, 6).map((x) => <TarihSatir key={x.id} x={x} tikla={() => git("takvim")} />)}</div>
        {!H.takvim.acik.length && <Bos eylem={() => ac({ tur: "takvim" })} eylemAd="Tarih ekle">Önünde tarihli bir iş görünmüyor.</Bos>}
      </Pafta>
      <GrafikKart baslik="Haftalık çalışma" alt={`Bu hafta ${dkYazi(buHafta)} · FORMA seanslarından`} tablo={{ bas: ["Hafta", "Saat"], satir: haftalar.map((h) => [h.uzun, bicim(h.deger, 1)]) }}>
        <Sutunlar veri={haftalar} hedef={ib.plan.haftaSaat} degerBicim={(v) => bicim(v, v % 1 ? 1 : 0)} birim=" sa" yukseklik={170} />
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 6 }}>Çizgi haftalık hedefin: {ib.plan.haftaSaat} saat. Koç ekranından değiştirilir.</p>
      </GrafikKart>
      <Pafta baslik="Çekirdek" alt="TOK, EE ve CAS" sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("cekirdek")}>Aç</button>}>
        <div className="ib-sira" style={{ gap: 16, flexWrap: "nowrap" }}>
          <Halka oran={H.cas.oran} boy={84} kalin={8} renk="var(--vurgu)" etiket={`CAS portföyü %${Math.round(H.cas.oran * 100)}`}><b className="ib-sayi" style={{ fontSize: 20 }}>%{Math.round(H.cas.oran * 100)}</b><small className="ib-minik ib-ucuncul">CAS</small></Halka>
          <div className="ib-izg" style={{ gap: 6, flex: 1, minWidth: 0 }}>
            <div className="ib-sira" style={{ justifyContent: "space-between" }}><span>EE</span><b>{H.cek.eeHarf || `aşama ${H.cek.eeAsama}/9`}</b></div><Olcer oran={H.cek.eeAsama / 9} kalin={6} etiket="EE aşaması" />
            <div className="ib-sira" style={{ justifyContent: "space-between" }}><span>TOK</span><b>{H.cek.tokHarf || (ib.tok.sergi.bitti ? "sergi tamam" : "sergi bekliyor")}</b></div><Olcer oran={(Number(!!ib.tok.sergi.bitti) + Math.min(1, (ib.tok.deneme.asama || 0) / 8)) / 2} kalin={6} etiket="TOK ilerlemesi" />
          </div></div>
        <p className="ib-kucuk ib-ikincil" style={{ marginTop: 10 }}>{H.cek.basarisiz ? "TOK ya da EE'de E görünüyor: bu bir başarısızlık koşulu." : H.cek.puan == null ? "İki harf de girilince matris puanı hesaplanır." : `Matris puanı ${H.cek.puan} / 3`}</p>
      </Pafta>
    </div>

    <div className="ib-g2">
      <GrafikKart baslik="Çalışma haritası" alt="Son 18 hafta, gün gün" sag={<IsiOlcek />}>
        <div style={{ overflowX: "auto" }}><IsiTakvim gunler={H.kopru.gunluk} bitis={bugun} hafta={18} hucre={16} /></div>
      </GrafikKart>
      <Pafta baslik="Bugün nasılsın?" alt={H.zihin.bugun && H.zihin.bugun.mod ? "Kaydın alındı; istersen değiştir" : "Tek dokunuş yeter"} sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("zihin")}>Zihin</button>}>
        <Cipler etiket="Ruh hâli" secenek={MOD_AD.map((ad, i) => ({ id: i + 1, ad }))} deger={H.zihin.bugun ? H.zihin.bugun.mod : null} degis={modSec} />
        <p className="ib-ikincil" style={{ marginTop: 12, maxWidth: "62ch" }}>{ZIHIN_IPUCU[H.zihin.isaret]}</p>
      </Pafta>
    </div>
  </div>;
}

/* ── Dersler ── */
export function Dersler({ H, ib, yaz, bugun, api, git, ac, arg, tost }) {
  const did = arg && arg.did && DERSLER[arg.did] ? arg.did : null;
  if (did) return <DersDetay key={did} x={H.dersler.find((q) => q.id === did)} {...{ H, ib, yaz, bugun, api, git, ac, tost }} />;
  const sirali = [...H.dersler].sort((a, b) => (b.fark == null ? -1 : b.fark) - (a.fark == null ? -1 : a.fark));
  return <div className="ib-ekran ib-izg">
    <div className="ib-g2">
      <GrafikKart baslik="Şimdi ve hedef" alt="Her eksen bir ders; 7 dış kenar" lejant={[{ ad: "Şimdi", renk: "var(--vurgu)" }, { ad: "Hedef", renk: "var(--murekkep-3)" }]}
        tablo={{ bas: ["Ders", "Düzey", "Şimdi", "Hedef", "Yüzde"], satir: H.dersler.map((x) => [x.kisa, x.duzey, x.notTam == null ? "–" : x.notTam, x.hedef, yuzdeYazi(x.yuzde)]) }}>
        <div style={{ display: "grid", placeItems: "center" }}><Radar boy={300} eksenler={H.dersler.map((x) => ({ ad: x.kisa.split(" ")[0], uzun: x.ad, deger: x.not == null ? 0 : x.not / 7, hedef: x.hedef / 7, yazi: x.not == null ? "veri yok" : bicim(x.not, 1), hedefYazi: String(x.hedef), renk: x.renk }))} /></div>
      </GrafikKart>
      <Pafta baslik="Hedefe uzaklık" alt="En büyük açık en üstte. Satıra dokun, dersi aç.">
        <YatayCubuk max={7} adGen={150} onSec={(id) => git("dersler", { did: id })} degerBicim={(v) => (v ? bicim(v, 1) : "–")}
          veri={sirali.map((x) => ({ id: x.id, ad: x.kisa, alt: `${x.duzey} · hedef ${x.hedef}`, deger: x.not || 0, hedef: x.hedef, renk: x.renk, ek: x.fark == null ? "veri yok" : x.fark > 0 ? `${x.fark} not açık` : "hedefte" }))} />
        <p className="ib-minik ib-ucuncul" style={{ marginTop: 10 }}>Dikey çizgi hedef notun. Kesirli not, bir üst sınıra ne kadar yaklaştığını gösterir.</p>
      </Pafta>
    </div>
    <div className="ib-g-oto" style={{ "--en": "300px" }}>{H.dersler.map((x) => <button key={x.id} type="button" className="ib-pafta ib-pafta-tik" onClick={() => git("dersler", { did: x.id })} style={{ "--dr": x.renk }}>
      <span className="ib-sira" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}><span className="ib-sira" style={{ gap: 8, flexWrap: "nowrap", minWidth: 0 }}><DersNokta did={x.id} boy={12} /><b style={{ fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.kisa}</b><Duzey z={x.duzey} /></span><Ik ad="sag" boy={18} /></span>
      <span className="ib-sira" style={{ gap: 18, marginTop: 12, alignItems: "flex-end" }}><NotSayi not={x.not} boy={44} /><span className="ib-kucuk ib-ikincil">{x.yuzde != null ? `${yuzdeYazi(x.yuzde)} · ` : ""}hedef {x.hedef}<br />{x.sonraki != null ? `${x.notTam + 1} için ${bicim(Math.max(0, x.sonraki), 1)} puan` : x.notTam === 7 ? "en üst notta" : x.kaynak === "tahmin" ? "öğretmen tahmini" : "ölçüm bekliyor"}</span></span>
      <span style={{ display: "block", marginTop: 12 }}><span className="ib-bilesen-serit">{x.bilesenler.filter((b) => !b.muaf).map((b) => <span key={b.id} style={{ flexGrow: b.agirlikN }} title={`${b.ad}: ${yuzdeYazi(b.yuzde)}`}><i style={{ height: `${b.yuzde == null ? 0 : b.yuzde}%`, background: x.renk }} /><small>{b.kisa}</small></span>)}</span></span>
      <span className="ib-sira ib-minik ib-ikincil" style={{ justifyContent: "space-between", marginTop: 8 }}><span>{x.olcumSay} ölçüm</span><span>{x.kapsama != null ? `konu kapsaması %${Math.round(x.kapsama * 100)}` : ""}</span><span>{dkYazi(x.dk28)} / 4 hafta</span></span>
    </button>)}</div>
  </div>;
}

function DersDetay({ x, H, ib, yaz, bugun, api, git, ac, tost }) {
  const D = ib.dersler[x.id]; const T = DERSLER[x.id]; const pid = formaPid(api, x.id); const k = H.kopru.ders[x.id];
  const dersYaz = (p) => yaz((s) => ({ ...s, dersler: { ...s.dersler, [x.id]: { ...s.dersler[x.id], ...p } } }));
  const tahminYaz = (v) => yaz((s) => ({ ...s, dersler: { ...s.dersler, [x.id]: { ...s.dersler[x.id], tahmin: v } }, tahminGecmis: [...s.tahminGecmis.filter((g) => !(g.did === x.id && g.tarih === bugun)), ...(v == null ? [] : [{ id: kimlik("g"), did: x.id, tarih: bugun, not: v }])] }));
  const bas = useMemo(() => Object.fromEntries(x.bilesenler.filter((b) => !b.muaf).map((b) => [b.id, Math.round(b.yuzde != null ? b.yuzde : x.genel != null ? x.genel : x.yuzde != null ? x.yuzde : 60)])), [x.id]);
  const [sen, setSen] = useState(bas); const S = senaryoNot(x, sen); const G = gerekenYuzde(x, x.hedef);
  const sinavlar = x.bilesenler.filter((b) => b.tur === "sinav" && !b.muaf);
  const gecmis = ib.tahminGecmis.filter((g) => g.did === x.id);
  const hafta = H.kopru.hafta.map((h) => ({ ad: tarihKisa(h.bas).replace(/\.$/, ""), uzun: `${tarihKisa(h.bas)} haftası`, deger: (h.ders[x.id] || 0) / 60, ek: x.kisa }));
  const olcumler = ib.olcum.filter((o) => o.did === x.id).slice().reverse();
  const muafVar = x.bilesenler.some((b) => b.muaf);
  return <div className="ib-ekran ib-izg" style={{ "--dr": x.renk }}>
    <div className="ib-sira" style={{ justifyContent: "space-between" }}>
      <button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => git("dersler")}><Ik ad="sol" boy={16} />Bütün dersler</button>
      <span className="ib-sira">{pid && api.elleAc && <button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => api.elleAc({ pid })}><Ik ad="saat" boy={15} />Çalıştığımı yaz</button>}{pid && <button type="button" className="ib-dugme ib-dugme-ikincil" onClick={() => api.odakAc({ pid })}><Ik ad="oynat" boy={15} dolu />Odak başlat</button>}
        <button type="button" className="ib-dugme" onClick={() => ac({ tur: "olcum", on: { did: x.id } })}><Ik ad="arti" boy={16} />Ölçüm ekle</button></span>
    </div>
    <div className="ib-g2">
      <Pafta className="ib-vurgulu" baslik={<span className="ib-sira" style={{ gap: 8 }}><DersNokta did={x.id} boy={12} />{x.ad}<Duzey z={x.duzey} /></span>} alt={`Grup ${x.grup} · ${x.saat} ders saati${x.ogretmen ? ` · ${x.ogretmen}` : ""}`}>
        <div className="ib-sira" style={{ gap: 20, alignItems: "center" }}>
          <Gosterge deger={x.not} hedef={x.hedef} boy={230} renk={x.renk} alt={<span><NotSayi not={x.not} boy={40} /><br /><small className="ib-kucuk ib-ikincil">{x.kaynak === "tahmin" ? "öğretmen tahmini" : x.yuzde != null ? `${yuzdeYazi(x.yuzde)} ağırlıklı` : "veri yok"}</small></span>} />
          <div className="ib-izg" style={{ gap: 10, flex: "1 1 200px", minWidth: 0 }}>
            <p style={{ fontSize: 16, maxWidth: "44ch" }}>{x.not == null ? "Henüz veri yok. Bir ölçüm gir ya da öğretmeninin tahminî notunu yaz." : x.notTam >= x.hedef ? `Hedefindesin. ${x.altta != null ? `Alt sınırın ${bicim(x.altta, 1)} puan üstündesin.` : ""}` : x.sonraki != null ? `${x.notTam + 1} için ${bicim(Math.max(0, x.sonraki), 1)} yüzde puanı gerekiyor.` : `Hedefe ${x.fark} not var.`}</p>
            {x.not != null && !G.tamam && G.gereken != null && <p className="ib-ikincil">Hedefin {x.hedef} için, henüz puanı olmayan bileşenlerde (toplamın %{bicim(G.bosA)} kadarı) ortalama <b style={{ color: "var(--murekkep)" }}>{G.imkansiz ? "%100'den fazlası" : `%${bicim(Math.max(0, G.gereken))}`}</b> gerekiyor.{G.imkansiz ? " Puanı olan bileşenleri yükseltmeden bu hedef kapanmıyor." : ""}</p>}
            <div className="ib-form" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
              <label className="ib-etiket"><span>Hedef not</span><Adim etiket="Hedef not" deger={D.hedef} min={1} max={7} degis={(v) => dersYaz({ hedef: v })} /></label>
              <label className="ib-etiket"><span>Öğretmen tahmini</span><span className="ib-sira" style={{ gap: 6, flexWrap: "nowrap" }}><Adim etiket="Öğretmen tahmini" deger={D.tahmin} min={1} max={7} bos="yok" degis={tahminYaz} />{D.tahmin != null && <button type="button" className="ib-ikon-dugme" aria-label="Tahmini sil" onClick={() => tahminYaz(null)}><Ik ad="kapat" boy={16} /></button>}</span></label>
              {T.duzeyler.length > 1 && <label className="ib-etiket"><span>Düzey</span><Cipler etiket="Düzey" secenek={T.duzeyler.map((z) => ({ id: z, ad: z }))} deger={D.duzey} degis={(z) => dersYaz({ duzey: z })} /></label>}
            </div>
          </div>
        </div>
      </Pafta>
      <GrafikKart baslik="Ölçüm eğilimi" alt="Her nokta bir ölçüm. Yatay çizgiler not sınırları." tablo={{ bas: ["Tarih", "Ölçüm", "Yüzde"], satir: x.trend.map((t) => [tarihKisa(t.o.tarih), t.ad, yuzdeYazi(t.y)]) }}>
        <CizgiGrafik seriler={[{ id: x.id, ad: x.kisa, renk: x.renk, noktalar: x.trend }]} bantlar={[4, 5, 6, 7].map((n) => ({ y: x.sinir[n - 2], etiket: String(n) }))} yBicim={(v) => bicim(v)} birim="%" xBicim={(t) => new Date(t).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} yukseklik={250} bos="Ölçüm girdikçe eğilim burada çizilir." />
      </GrafikKart>
    </div>

    <Pafta baslik="Bileşenler" alt={muafVar ? "Muaf tutulan bileşenin ağırlığı öbürlerine oranlandı. IB'nin kendi hesabı farklı olabilir; sonuç tahmindir." : "Notun hangi parçalardan oluştuğu ve her birinde nerede durduğun"}>
      <div className="ib-tablo-kap"><table className="ib-tablo"><thead><tr><th>Bileşen</th><th>Ağırlık</th><th style={{ width: "34%" }}>Durum</th><th>Yüzde</th><th>Ölçüm</th><th>Uygulanmıyor</th><th /></tr></thead>
        <tbody>{x.bilesenler.map((b) => <tr key={b.id} style={{ opacity: b.muaf ? 0.5 : 1 }}>
          <td><b>{b.ad}</b><div className="ib-minik ib-ucuncul">{b.max} puan{b.sure ? ` · ${b.sure} dk` : ""}{b.tur === "ic" ? " · iç değerlendirme" : b.tur === "dis" ? " · dışarıda değerlendirilir" : ""}</div></td>
          <td className="ib-sayi">%{bicim(b.muaf ? b.agirlik : b.agirlikN, b.agirlikN % 1 ? 1 : 0)}</td>
          <td>{b.muaf ? <span className="ib-ucuncul">hesaba katılmıyor</span> : <Olcer oran={(b.yuzde || 0) / 100} renk={x.renk} isaret={x.sinir[Math.max(2, x.hedef) - 2] / 100} etiket={b.ad} />}</td>
          <td className="ib-sayi ib-kalin">{b.muaf ? "–" : yuzdeYazi(b.yuzde)}{b.kaynak === "ozdeger" && <div className="ib-minik ib-ucuncul">öz değerlendirme</div>}</td>
          <td className="ib-sayi">{b.n || "–"}</td>
          <td><Onay isaretli={b.muaf} etiket={`${b.ad} uygulanmıyor`} degis={(v) => dersYaz({ muaf: { ...D.muaf, [b.id]: v } })} /></td>
          <td>{!b.muaf && (b.odev ? <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => git("ia", { id: b.odev.id })}>Ödevi aç</button> : <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => ac({ tur: "olcum", on: { did: x.id, bilesen: b.id, max: String(b.max) } })}>Ekle</button>)}</td>
        </tr>)}</tbody></table></div>
    </Pafta>

    <div className="ib-g2">
      <Pafta baslik="Ne olursa?" alt="Kaydırakları oynat; not anında değişir. Hiçbir şey kaydedilmez." sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => setSen(bas)}>Sıfırla</button>}>
        <div className="ib-sira" style={{ gap: 18, marginBottom: 6 }}><NotSayi not={S.not} boy={56} /><div><div className="ib-kalin ib-sayi">{yuzdeYazi(S.yuzde)}</div>
          <div className="ib-kucuk" style={{ color: S.not != null && Math.floor(S.not) >= x.hedef ? "var(--iyi)" : "var(--murekkep-2)" }}>{S.not == null ? "" : Math.floor(S.not) >= x.hedef ? "Bu senaryo hedefi tutturuyor" : `Hedefe ${bicim(Math.max(0, x.sinir[x.hedef - 2] - S.yuzde), 1)} puan kalıyor`}</div></div></div>
        <div className="ib-izg" style={{ gap: 4 }}>{x.bilesenler.filter((b) => !b.muaf).map((b) => <label key={b.id} className="ib-senaryo"><span>{b.kisa}<small>%{bicim(b.agirlikN)}</small></span><Kaydirak etiket={b.ad} deger={sen[b.id] == null ? 0 : sen[b.id]} degis={(v) => setSen((s) => ({ ...s, [b.id]: v }))} /><b className="ib-sayi">%{sen[b.id]}</b></label>)}</div>
      </Pafta>
      <Pafta baslik="Konu haritası" alt="FORMA'daki konu kayıtlarından" sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => api.formaGit("konu")}>Haritayı aç</button>}>
        {k.kapsama == null ? <Bos>Bu ders için konu haritası bulunamadı.</Bos> : <>
          <div className="ib-sira" style={{ gap: 18, flexWrap: "nowrap" }}>
            <Halka oran={k.kapsama} boy={96} kalin={9} renk={x.renk} etiket={`Kapsama %${Math.round(k.kapsama * 100)}`}><b className="ib-sayi" style={{ fontSize: 22 }}>%{Math.round(k.kapsama * 100)}</b><small className="ib-minik ib-ucuncul">kapsama</small></Halka>
            <div className="ib-izg" style={{ gap: 4 }}><span><b className="ib-sayi">{k.puanli}</b> / {k.alt} alt konu puanlandı</span><span><b className="ib-sayi">%{Math.round((k.guven || 0) * 100)}</b> güven</span><span style={{ color: k.vade ? "var(--altin)" : undefined }}><b className="ib-sayi">{k.vade}</b> tekrar günü geldi</span></div>
          </div>
          {k.zayif.length > 0 && <><hr className="ib-ayrac" /><div className="ib-kucuk ib-ikincil" style={{ marginBottom: 4 }}>En zayıf konular</div>
            <div className="ib-liste">{k.zayif.map((z) => <div key={z.id} className="ib-satir" style={{ padding: "7px 0" }}><div className="ib-satir-ana"><div className="ib-satir-ad">{z.kod ? `${z.kod} · ` : ""}{z.ad}</div></div><span className="ib-kucuk ib-sayi ib-ikincil">%{Math.round(z.guven * 100)}</span>
              {pid && <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => api.odakAc({ pid, konuId: z.id })}>Çalış</button>}</div>)}</div></>}
        </>}
      </Pafta>
    </div>

    <div className="ib-g2">
      <GrafikKart baslik="Çalışma saatleri" alt={`Son 4 haftada ${dkYazi(x.dk28)} · toplam ${dkYazi(x.dkToplam)}`} tablo={{ bas: ["Hafta", "Saat"], satir: hafta.map((h) => [h.uzun, bicim(h.deger, 1)]) }}>
        <Sutunlar veri={hafta} renk={x.renk} degerBicim={(v) => bicim(v, v % 1 ? 1 : 0)} birim=" sa" yukseklik={170} />
      </GrafikKart>
      <Pafta baslik="Sınavda zaman" alt="Kâğıt başına süre ve puan başına düşen dakika">
        <div className="ib-tablo-kap"><table className="ib-tablo"><thead><tr><th>Kâğıt</th><th>Süre</th><th>Puan</th><th>dk / puan</th></tr></thead><tbody>{sinavlar.map((b) => <tr key={b.id}><td><b>{b.kisa}</b><div className="ib-minik ib-ucuncul">{b.ac}</div></td><td className="ib-sayi">{b.sure} dk</td><td className="ib-sayi">{b.max}</td><td className="ib-sayi ib-kalin">{bicim(b.sure / b.max, 1)}</td></tr>)}</tbody></table></div>
      </Pafta>
    </div>

    <div className="ib-g2">
      <Pafta baslik="Ölçümler" alt={`${olcumler.length} kayıt`} sag={<button type="button" className="ib-dugme ib-dugme-ince" onClick={() => ac({ tur: "olcum", on: { did: x.id } })}><Ik ad="arti" boy={14} />Ekle</button>}>
        {olcumler.length ? <div className="ib-liste">{olcumler.slice(0, 8).map((o) => <div key={o.id} className="ib-satir"><div className="ib-satir-ana"><div className="ib-satir-ad">{o.ad || (x.bilesenler.find((b) => b.id === o.bilesen) || { ad: "Genel" }).ad}</div><div className="ib-satir-alt">{tarihKisa(o.tarih)} · {o.puan} / {o.max}{o.kayip && o.kayip.length ? ` · ${o.kayip.join(", ")}` : ""}</div></div>
          <b className="ib-sayi">%{bicim((o.puan / o.max) * 100)}</b><button type="button" className="ib-ikon-dugme" aria-label="Düzelt" onClick={() => ac({ tur: "olcum", on: o })}><Ik ad="duzenle" boy={17} /></button></div>)}</div>
          : <Bos eylem={() => ac({ tur: "olcum", on: { did: x.id } })} eylemAd="Ölçüm ekle">Bu derste henüz ölçüm yok.</Bos>}
      </Pafta>
      <Pafta baslik="Notlar ve sınırlar">
        <div className="ib-izg">
          <label className="ib-etiket"><span>Öğretmen</span><input className="ib-girdi" value={D.ogretmen || ""} onChange={(e) => dersYaz({ ogretmen: e.target.value })} /></label>
          <label className="ib-etiket"><span>Bu ders için notların</span><textarea className="ib-alan" value={D.not || ""} placeholder="Geri bildirimler, dikkat edilecekler, kaynaklar" onChange={(e) => dersYaz({ not: e.target.value })} /></label>
          <div><div className="ib-kucuk ib-ikincil" style={{ marginBottom: 6 }}>Not sınırları (2, 3, 4, 5, 6, 7 için en düşük yüzde){x.ozelSinir ? " · senin girdiğin" : " · yaklaşık"}</div>
            <div className="ib-sira" style={{ gap: 6 }}>{x.sinir.map((s, i) => <label key={i} className="ib-sinir"><span>{i + 2}</span><input type="number" className="ib-girdi" value={s} min="0" max="100" aria-label={`${i + 2} notu için alt sınır`}
              onChange={(e) => { const y = [...x.sinir]; y[i] = Math.max(0, Math.min(100, Number(e.target.value) || 0)); dersYaz({ sinir: y }); }} /></label>)}
              {x.ozelSinir && <button type="button" className="ib-dugme ib-dugme-ince" onClick={() => { dersYaz({ sinir: null }); tost("Varsayılan sınırlara dönüldü"); }}>Varsayılana dön</button>}</div>
            <p className="ib-minik ib-ucuncul" style={{ marginTop: 8, maxWidth: "70ch" }}>{SINIR_NOTU}</p></div>
          {gecmis.length > 1 && <div className="ib-kucuk ib-ikincil">Tahmin geçmişi: {gecmis.map((g) => `${tarihKisa(g.tarih)} → ${g.not}`).join(" · ")}</div>}
        </div>
      </Pafta>
    </div>
  </div>;
}
