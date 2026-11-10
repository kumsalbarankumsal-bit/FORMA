/* IB modu · sabit bilgi: ders bileşenleri, ağırlıklar, ölçütler, diploma kuralları, çekirdek, komut terimleri.
   Kaynak durumu: bileşen ağırlıkları, süreler ve diploma koşulları IB ders özetlerinden ve ibo.org "passing criteria"
   sayfasından. Not sınırları IB tarafından yalnız okullara açıklanır; buradakiler ikincil kaynaktan (Kasım 2025 oturumu)
   alınmış yaklaşık değerlerdir ve Araçlar ekranından düzeltilebilir. Kasım 2027 takvimi henüz yayımlanmadı; tarihler
   Kasım 2026 sırasından öngörüdür. */

export const DERS_SIRA = ["tr", "bio", "mat", "en", "fr", "gp"];
const O = (k, ad, max) => ({ k, ad, max });
const LB_YAZMA = [O("A", "Dil", 12), O("B", "Mesaj", 12), O("C", "Kavramsal anlama", 6)];
const LB_SOZLU = [O("A", "Dil", 12), O("B1", "Mesaj: uyaran", 6), O("B2", "Mesaj: sohbet", 6), O("C", "Etkileşim", 6)];
const dilB = (duzey) => [
  { id: "p1", ad: "Paper 1 · Yazma", kisa: "P1", tur: "sinav", agirlik: 25, max: 30, sure: duzey === "HL" ? 90 : 75, ac: duzey === "HL" ? "Tek görev, 450–600 kelime" : "Tek görev, 250–400 kelime", olcut: LB_YAZMA },
  { id: "p2d", ad: "Paper 2 · Dinleme", kisa: "P2 D", tur: "sinav", agirlik: 25, max: 25, sure: duzey === "HL" ? 60 : 45, ac: "Üç ses kaydı; hız kayda bağlıdır" },
  { id: "p2o", ad: "Paper 2 · Okuma", kisa: "P2 O", tur: "sinav", agirlik: 25, max: 40, sure: 60, ac: "Üç metin; puan başına yaklaşık 1,5 dakika" },
  { id: "io", ad: "Bireysel sözlü", kisa: "IO", tur: "ic", agirlik: 25, max: 30, sure: 15, ac: duzey === "HL" ? "Edebî alıntı; 20 dk hazırlık, 12–15 dk sözlü" : "Görsel uyaran; 15 dk hazırlık, 12–15 dk sözlü", olcut: LB_SOZLU },
];

export const DERSLER = {
  tr: { id: "tr", ad: "Türkçe A: Edebiyat", kisa: "Türkçe A", grup: 1, renk: "var(--d1)", duzey: "HL", duzeyler: ["HL"], forma: "tr", kh: "turkisha", saat: 240,
    bilesen: () => [
      { id: "p1", ad: "Paper 1 · Rehberli inceleme", kisa: "P1", tur: "sinav", agirlik: 35, max: 40, sure: 135, ac: "İki görülmemiş metin, her biri 20 puan; inceleme başına yaklaşık 67 dakika",
        olcut: [O("A", "Anlama ve yorum", 5), O("B", "Çözümleme ve değerlendirme", 5), O("C", "Odak ve düzen", 5), O("D", "Dil", 5)] },
      { id: "p2", ad: "Paper 2 · Karşılaştırmalı deneme", kisa: "P2", tur: "sinav", agirlik: 25, max: 30, sure: 105, ac: "Dört sorudan biri; okunan iki yapıt karşılaştırılır",
        olcut: [O("A", "Bilgi, anlama ve yorum", 10), O("B", "Çözümleme ve değerlendirme", 10), O("C", "Odak ve düzen", 5), O("D", "Dil", 5)] },
      { id: "io", ad: "Bireysel sözlü", kisa: "IO", tur: "ic", agirlik: 20, max: 40, sure: 15, ac: "Küresel sorun üzerinden iki yapıt; 10 dk sunum, 5 dk soru",
        olcut: [O("A", "Bilgi, anlama ve yorum", 10), O("B", "Çözümleme ve değerlendirme", 10), O("C", "Odak ve düzen", 10), O("D", "Dil", 10)] },
      { id: "hle", ad: "HL denemesi", kisa: "HLE", tur: "dis", agirlik: 20, max: 20, sure: 0, ac: "1.200–1.500 kelime; dışarıda değerlendirilir",
        olcut: [O("A", "Bilgi, anlama ve yorum", 5), O("B", "Çözümleme ve değerlendirme", 5), O("C", "Odak, düzen ve gelişim", 5), O("D", "Dil", 5)] },
    ], sinir: [14, 28, 45, 56, 67, 78] },
  bio: { id: "bio", ad: "Biyoloji", kisa: "Biyoloji", grup: 4, renk: "var(--d2)", duzey: "SL", duzeyler: ["SL"], forma: "bio", kh: "biology", saat: 150,
    bilesen: () => [
      { id: "p1", ad: "Paper 1", kisa: "P1", tur: "sinav", agirlik: 36, max: 55, sure: 90, ac: "1A: 30 çoktan seçmeli, 1B: 25 puanlık veri soruları; puan başına yaklaşık 1,6 dakika" },
      { id: "p2", ad: "Paper 2", kisa: "P2", tur: "sinav", agirlik: 44, max: 50, sure: 90, ac: "Veri, kısa ve uzun yanıt; puan başına yaklaşık 1,8 dakika" },
      { id: "ia", ad: "Bilimsel araştırma", kisa: "İD", tur: "ic", agirlik: 20, max: 24, sure: 0, ac: "En çok 3.000 kelime, 10 saat",
        olcut: [O("A", "Araştırma tasarımı", 6), O("B", "Veri analizi", 6), O("C", "Sonuç", 6), O("D", "Değerlendirme", 6)] },
    ], sinir: [14, 25, 40, 52, 66, 78] },
  mat: { id: "mat", ad: "Matematik: Analiz ve Yaklaşımlar", kisa: "Matematik AA", grup: 5, renk: "var(--d3)", duzey: "SL", duzeyler: ["SL"], forma: "mat", kh: "mathaa", saat: 150,
    bilesen: () => [
      { id: "p1", ad: "Paper 1 · Hesap makinesiz", kisa: "P1", tur: "sinav", agirlik: 40, max: 80, sure: 90, ac: "Puan başına yaklaşık 1,1 dakika" },
      { id: "p2", ad: "Paper 2 · Hesap makineli", kisa: "P2", tur: "sinav", agirlik: 40, max: 80, sure: 90, ac: "Puan başına yaklaşık 1,1 dakika" },
      { id: "ia", ad: "Matematiksel keşif", kisa: "İD", tur: "ic", agirlik: 20, max: 20, sure: 0, ac: "12–20 sayfa",
        olcut: [O("A", "Sunum", 4), O("B", "Matematiksel iletişim", 4), O("C", "Kişisel katılım", 3), O("D", "Yansıtma", 3), O("E", "Matematik kullanımı", 6)] },
    ], sinir: [13, 27, 41, 54, 67, 80] },
  en: { id: "en", ad: "İngilizce B", kisa: "İngilizce B", grup: 2, renk: "var(--d4)", duzey: "HL", duzeyler: ["HL"], forma: "en", kh: "englishb", saat: 240,
    bilesen: (z) => dilB(z || "HL"), sinir: [13, 26, 39, 55, 72, 89] },
  fr: { id: "fr", ad: "Fransızca B", kisa: "Fransızca B", grup: 2, renk: "var(--d5)", duzey: "SL", duzeyler: ["SL", "HL"], forma: "fr", kh: "frenchb", saat: 150,
    bilesen: (z) => dilB(z || "SL"), sinir: [12, 24, 37, 52, 67, 83], sinirHL: [13, 26, 39, 55, 71, 87] },
  gp: { id: "gp", ad: "Küresel Siyaset", kisa: "Küresel Siyaset", grup: 3, renk: "var(--d6)", duzey: "HL", duzeyler: ["HL"], forma: "gp", kh: "globalpol", saat: 240,
    bilesen: () => [
      { id: "p1", ad: "Paper 1 · Kaynak temelli", kisa: "P1", tur: "sinav", agirlik: 20, max: 25, sure: 75, ac: "Dört soru: 3, 4, 6 ve 12 puan; puan başına 3 dakika" },
      { id: "p2", ad: "Paper 2 · Deneme", kisa: "P2", tur: "sinav", agirlik: 30, max: 30, sure: 105, ac: "İki deneme, her biri 15 puan; deneme başına yaklaşık 52 dakika" },
      { id: "p3", ad: "Paper 3 · HL küresel sorunlar", kisa: "P3", tur: "sinav", agirlik: 30, max: 28, sure: 90, ac: "Sorular 3, 4, 6 ve 15 puan; puan başına yaklaşık 3,2 dakika" },
      { id: "ep", ad: "Katılım projesi", kisa: "EP", tur: "ic", agirlik: 20, max: 30, sure: 0, ac: "Rapor en çok 2.000 kelime, HL önerisi en çok 400 kelime",
        olcut: [O("A", "Açıklama ve gerekçe", 4), O("B", "Süreç", 3), O("C", "Çözümleme ve sentez", 8), O("D", "Değerlendirme ve yansıtma", 6), O("E", "İletişim", 3), O("F", "Öneri (HL)", 6)] },
    ], sinir: [10, 20, 33, 47, 58, 71] },
};
export const SINIR_NOTU = "Yaklaşık değerler: Kasım 2025 oturumunun ikincil kaynaktan derlenen sınırları (Küresel Siyaset için Mayıs 2026, yeni rehber). Fransızca B HL için veri bulunamadı, değer tahmindir. IB resmî sınırları yalnız okullara açıklar; öğretmeninden aldığın sınırla düzelt.";

/* ── iç değerlendirme ve dışarıda değerlendirilen ödevler ── */
const ASAMA_YAZILI = ["Konu", "Araştırma sorusu", "Plan", "Veri / kaynak", "İlk taslak", "Geri bildirim", "Son hâl", "Teslim"];
const ASAMA_SOZLU = ["Metin seçimi", "Küresel sorun / tema", "Taslak plan", "Prova 1", "Prova 2", "Kayıt"];
export const ODEVLER = [
  { id: "tr-io", did: "tr", bid: "io", ad: "Türkçe A · Bireysel sözlü", asama: ["Yapıt seçimi", "Küresel sorun", "Alıntılar", "Taslak plan", "Prova 1", "Prova 2", "Kayıt"], kelime: 0, ipucu: "10 dakikayı iki yapıta eşit böl; küresel sorunu ilk 30 saniyede söyle." },
  { id: "tr-hle", did: "tr", bid: "hle", ad: "Türkçe A · HL denemesi", asama: ASAMA_YAZILI, kelime: 1500, kelimeAlt: 1200, ipucu: "Bir araştırma hattı seç: yapıtın bütününe değil, dar ve savunulabilir bir soruya odaklan." },
  { id: "en-io", did: "en", bid: "io", ad: "İngilizce B · Bireysel sözlü", asama: ASAMA_SOZLU, kelime: 0, ipucu: "Alıntıyı özetleme; temayla ve yapıtın bütünüyle bağla." },
  { id: "fr-io", did: "fr", bid: "io", ad: "Fransızca B · Bireysel sözlü", asama: ASAMA_SOZLU, kelime: 0, ipucu: "Görseli betimle, sonra hedef kültürle ilişkilendir; bağlaçlarını önceden hazırla." },
  { id: "gp-ep", did: "gp", bid: "ep", ad: "Küresel Siyaset · Katılım projesi", asama: ["Siyasi sorun", "Araştırma sorusu", "Katılım etkinliği", "Kanıt ve kaynak", "Rapor taslağı", "HL önerisi", "Geri bildirim", "Teslim"], kelime: 2400, ipucu: "Etkinlik gerçek bir katılım olmalı; raporda öğrendiğini kaynaklarla sına." },
  { id: "mat-ia", did: "mat", bid: "ia", ad: "Matematik · Keşif", asama: ASAMA_YAZILI, kelime: 0, sayfa: 20, ipucu: "En ağır ölçüt matematik kullanımı: SL düzeyine uygun, doğru ve anlaşılmış matematik." },
  { id: "bio-ia", did: "bio", bid: "ia", ad: "Biyoloji · Bilimsel araştırma", asama: ["Konu", "Araştırma sorusu", "Yöntem", "Veri toplama", "Analiz", "Sonuç ve değerlendirme", "Geri bildirim", "Teslim"], kelime: 3000, ipucu: "Dört ölçüt eşit ağırlıkta; değerlendirmede yöntemin zayıflığını ve somut iyileştirmeyi yaz." },
];

/* ── çekirdek ── */
export const EE = {
  kelime: 4000, rpf: 500, max: 30,
  olcut: [O("A", "Makalenin çerçevesi", 6), O("B", "Bilgi ve anlama", 6), O("C", "Çözümleme ve argüman hattı", 6), O("D", "Tartışma ve değerlendirme", 8), O("E", "Yansıtma", 4)],
  asama: ["Ders ve konu", "Araştırma sorusu", "Kaynak taraması", "Ana hatlar", "İlk taslak", "Danışman geri bildirimi", "Son taslak", "Yansıtma metni", "Teslim"],
  gorusme: ["İlk yansıtma görüşmesi", "Ara yansıtma görüşmesi", "Son görüşme (viva voce)"],
  /* 30 puanlık yeni ölçek için sınır henüz yayımlanmadı; eski 34'lük ölçekten oranlanmış tahmin */
  sinir: { A: 24, B: 19, C: 12, D: 6 }, sinirNot: "Yeni 30 puanlık ölçek ilk kez 2027'de uygulanıyor; sınırlar eski ölçekten oranlanmış tahmindir.",
};
export const TOK = {
  sergi: { kelime: 950, max: 10, nesne: 3 }, deneme: { kelime: 1600, max: 10, etkilesim: 3 },
  asamaDeneme: ["Başlık seçimi", "Bilgi sorusu ve kavramlar", "Örnekler", "Plan", "İlk taslak", "Geri bildirim", "Son hâl", "Teslim"],
  /* 30 üzerinden: sergi + deneme × 2 */
  sinir: { A: 22, B: 16, C: 10, D: 4 }, alanlar: ["Tarih", "İnsan bilimleri", "Doğa bilimleri", "Matematik", "Sanatlar"],
  temalar: ["Bilen kişi (çekirdek)", "Bilgi ve teknoloji", "Bilgi ve dil", "Bilgi ve siyaset", "Bilgi ve din", "Bilgi ve yerli toplumlar"],
};
export const HARFLER = ["A", "B", "C", "D", "E"];
/* TOK × EE: matris[tok][ee] → puan; null = başarısızlık koşulu */
export const MATRIS = { A: { A: 3, B: 3, C: 2, D: 2, E: null }, B: { A: 3, B: 2, C: 2, D: 1, E: null }, C: { A: 2, B: 2, C: 1, D: 0, E: null }, D: { A: 2, B: 1, C: 0, D: 0, E: null }, E: { A: null, B: null, C: null, D: null, E: null } };
export const CAS = {
  kollar: [{ id: "C", ad: "Yaratıcılık", renk: "var(--d6)" }, { id: "A", ad: "Etkinlik", renk: "var(--d2)" }, { id: "S", ad: "Hizmet", renk: "var(--d1)" }],
  cikti: ["Güçlü yanlarını ve gelişim alanlarını tanıma", "Zorluk üstlenme ve yeni beceri geliştirme", "Bir CAS deneyimini başlatma ve planlama", "Bağlılık ve sebat gösterme", "Birlikte çalışma becerisi ve yararını görme", "Küresel önemdeki konularla ilgilenme", "Seçim ve eylemlerin etiğini gözetme"],
  asama: ["Araştırma", "Hazırlık", "Eylem", "Yansıtma", "Sergileme"], gorusme: ["Başlangıç görüşmesi", "Birinci yıl sonu görüşmesi", "Son görüşme"], ay: 18,
};

/* ── diploma koşulları (ibo.org, DP passing criteria) ── */
export const KOSULLAR = [
  { id: "cas", ad: "CAS koşulları tamamlandı" }, { id: "24", ad: "Toplam en az 24 puan" }, { id: "n", ad: "Bütün derslerde, TOK ve EE'de not verildi" },
  { id: "2", ad: "Hiçbir derste 1 yok" }, { id: "iki2", ad: "En çok iki derste 2" }, { id: "uc3", ad: "En çok üç derste 3 ya da altı" },
  { id: "hl", ad: "HL derslerinde en az 12 puan" }, { id: "sl", ad: "SL derslerinde en az 9 puan" }, { id: "e", ad: "TOK ve EE'de E yok" },
];

/* ── komut terimleri: sorunun ne istediğini okuma. Tanımlar özettir, kendi sözlerimle. ── */
export const KOMUT = [
  ["Define", "Tanımla", 1, "Terimin kesin anlamını ver; örnek ya da yorum istenmez."], ["State", "Belirt", 1, "Kısa ve net yanıt; açıklama yok."],
  ["List", "Sırala", 1, "Kısa yanıtları açıklamasız alt alta ver."], ["Identify", "Belirle", 1, "Seçenekler içinden doğru olanı göster."],
  ["Label", "Etiketle", 1, "Çizimin parçalarını adlandır."], ["Draw", "Çiz", 1, "Cetvelle, etiketli ve doğru oranlı çizim yap."],
  ["Describe", "Betimle", 2, "Ayrıntılı anlat; neden-sonuç istenmez."], ["Outline", "Ana hatlarıyla ver", 2, "Kısa özet; temel noktalar yeter."],
  ["Distinguish", "Ayırt et", 2, "İki şey arasındaki farkları açıkça ortaya koy."], ["Calculate", "Hesapla", 2, "İşlem adımlarını göstererek sayısal sonuca ulaş."],
  ["Estimate", "Kestir", 2, "Yaklaşık değeri bul."], ["Annotate", "Not düş", 2, "Çizime ya da grafiğe kısa açıklamalar ekle."],
  ["Apply", "Uygula", 2, "Bir fikri ya da yöntemi verilen duruma kullan."], ["Sketch", "Taslağını çiz", 2, "Genel biçimi ve önemli noktaları gösteren grafik."],
  ["Explain", "Açıkla", 3, "Nedenleri ve işleyişi ver: 'çünkü' ve 'bu yüzden' görünmeli."], ["Analyse", "Çözümle", 3, "Parçalara ayır, aralarındaki ilişkiyi ve yapıyı göster."],
  ["Compare", "Karşılaştır", 3, "Benzerlikleri ver; her maddede iki tarafa da değin."], ["Compare and contrast", "Benzerlik ve fark", 3, "Hem benzerlikleri hem farkları, sürekli iki tarafa değinerek ver."],
  ["Contrast", "Farkları ver", 3, "Yalnız farklar; her maddede iki taraf."], ["Suggest", "Öner", 3, "Olası bir açıklama ya da çözüm ileri sür."],
  ["Deduce", "Çıkarım yap", 3, "Verilen bilgiden sonuca var."], ["Determine", "Sapta", 3, "Tek olası yanıtı bul."], ["Predict", "Öngör", 3, "Beklenen sonucu söyle."],
  ["Show that", "Göster", 3, "İstenen sonuca adım adım ulaş; sonuç verilmiştir, yolu sen kurarsın."], ["Hence", "Buradan", 3, "Önceki sonucu kullanmak zorundasın."],
  ["Discuss", "Tartış", 4, "Farklı görüşleri ve etkenleri dengeli sun; kanıta dayalı bir sonuca bağla."], ["Evaluate", "Değerlendir", 4, "Güçlü ve zayıf yanları tart, yargıya var."],
  ["Examine", "İncele", 4, "Bir savın varsayımlarını ve iç ilişkilerini açığa çıkar."], ["To what extent", "Ne ölçüde", 4, "Savın ne kadar geçerli olduğunu kanıtla tart; açık bir derece bildir."],
  ["Justify", "Gerekçelendir", 4, "Yanıtını ya da sonucunu kanıtla destekle."], ["Interpret", "Yorumla", 4, "Veriden eğilim çıkar ve sonuca bağla."],
].map(([en, tr, duzey, ac]) => ({ en, tr, duzey, ac }));
export const KOMUT_DUZEY = { 1: "Bilgi", 2: "Uygulama", 3: "Çözümleme", 4: "Değerlendirme" };

export const OLCUM_TUR = [{ id: "gecmis", ad: "Geçmiş sınav kâğıdı" }, { id: "mock", ad: "Deneme sınavı (mock)" }, { id: "okul", ad: "Okul sınavı" }, { id: "quiz", ad: "Kısa sınav" }, { id: "odev", ad: "Ödev / deneme yazısı" }];
export const KAYIP = ["Konu eksiği", "Soruyu yanlış okuma", "Zaman yetmedi", "Dikkatsizlik", "Yapı ve düzen", "Dil ve ifade", "Kanıt ve örnek eksik"];
export const TAKVIM_TUR = [{ id: "sinav", ad: "Sınav", renk: "var(--kritik)" }, { id: "teslim", ad: "Teslim", renk: "var(--altin)" }, { id: "mock", ad: "Deneme sınavı", renk: "var(--d6)" }, { id: "gorusme", ad: "Görüşme", renk: "var(--d2)" }, { id: "diger", ad: "Diğer", renk: "var(--murekkep-3)" }];

/* ── Kasım 2027 için öngörülen takvim. Hepsi "tahminî": okul koordinatörünün verdiği tarihle değiştir. ── */
export const TAKVIM_ON = [
  ["tok-baslik", "TOK deneme başlıkları açıklanır", "2027-03-01", "diger", null], ["ee-yukle", "EE, TOK denemesi ve HL denemesi için IB yükleme sınırı", "2027-09-15", "teslim", null],
  ["ia-not", "İç değerlendirme notları ve tahminî notlar IB'ye girilir", "2027-10-20", "teslim", null], ["sonuc", "Sonuçlar açıklanır", "2027-12-17", "diger", null],
].map(([id, ad, tarih, tur, did]) => ({ id, ad, tarih, tur, did, tahmini: true, bitti: false }));
export const SINAV_ON = [
  ["tr", "p1", "2027-10-25", "ÖS"], ["tr", "p2", "2027-10-26", "ÖÖ"], ["bio", "p1", "2027-10-26", "ÖS"], ["bio", "p2", "2027-10-27", "ÖÖ"],
  ["en", "p1", "2027-11-04", "ÖS"], ["en", "p2o", "2027-11-04", "ÖS"], ["en", "p2d", "2027-11-05", "ÖÖ"], ["gp", "p1", "2027-11-05", "ÖS"], ["gp", "p2", "2027-11-08", "ÖÖ"],
  ["mat", "p1", "2027-11-08", "ÖS"], ["mat", "p2", "2027-11-09", "ÖÖ"], ["gp", "p3", "2027-11-09", "ÖS"],
].map(([did, bid, tarih, dilim]) => ({ id: `${did}-${bid}`, did, bid, tarih, dilim, tahmini: true }));
export const OTURUM = { ad: "Kasım 2027", ilkSinav: "2027-10-25", sonSinav: "2027-11-12", sonuc: "2027-12-17" };

/* ── koç ve zihin metinleri ── */
export const NEFES = [
  { id: "ic", ad: "Çifte iç çekiş", ac: "Burundan iki kısa nefes al, ağızdan uzun ver. Günde beş dakikalık uygulama, bir çalışmada ruh hâlini farkındalık meditasyonundan daha çok iyileştirdi (Balban ve ark., 2023).", adim: [["Al", 2], ["Bir daha al", 1], ["Uzun ver", 6]] },
  { id: "kutu", ad: "Kutu nefesi", ac: "Dört al, dört tut, dört ver, dört tut. Sınav kapısında nabzı toplamak için.", adim: [["Al", 4], ["Tut", 4], ["Ver", 4], ["Tut", 4]] },
  { id: "uzun", ad: "Uzun veriş", ac: "Dört say al, altı say ver. Uyumadan önce.", adim: [["Al", 4], ["Ver", 6]] },
];
export const YENIDEN = [
  "Kalbimin hızlanması bedenimin hazırlandığını gösterir; bu enerjiyi kullanabilirim.",
  "Bir soruda takılırsam geçerim. Puan kâğıdın tamamında toplanır.",
  "Bu deneme bir ölçüm. Sonuç, bundan sonra neye çalışacağımı söyler.",
  "Hazırlandığım kadarını göstermek yeterli. Fazlası benden istenmiyor.",
];
export const ZIHIN_IPUCU = {
  stres: "Son günlerde stresin yüksek seyrediyor. Bugünün ilk seansını kısa tut ve başlamadan iki dakika nefes çalış. Bu durum bir haftadan uzun sürerse rehber öğretmeninle ya da güvendiğin bir yetişkinle konuşmak iyi gelir.",
  uyku: "Uykun hedefin altında kalıyor. Öğrenilen bilginin kalıcı olması uykuda gerçekleşir; bu hafta yatış saatini sabitlemek yeni bir konu açmaktan daha çok puan getirir.",
  yuk: "Bu haftaki yükün alıştığının hayli üstünde. İki gün hafifletmek temponun sürmesini sağlar.",
  dusuk: "Enerjin düşük görünüyor. Bugün en kolay görevle başla; yirmi dakika sonra devam edip etmeyeceğine o zaman karar ver.",
  iyi: "Dengen yerinde görünüyor. Bugünkü plan olduğu gibi kalabilir.",
};
