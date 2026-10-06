# FORMA · Arena 3.0 (v72)

Baran Şimşek'in IB DP2 (Kasım 2027) ve YKS 2028 çalışma uygulaması: Konu Haritası, odak seansları, Boğaziçi Yolu ve çalışmaya bağlı ödül katmanı.

- `src/App.jsx` — uygulamanın tamamı (claude.ai artifact'ındaki "Baran Şimşek çalışma v1.jsx" ile birebir aynı).
- `src/storage.js` — artifact'taki `window.storage` arayüzünü tarayıcıda IndexedDB ile kurar; veriler yalnız bu cihazda kalır.
- Vercel: çerçeve Vite, derleme `npm run build`, çıktı `dist` (vercel.json'da hazır).

Yerelde: `npm install && npm run dev`.
