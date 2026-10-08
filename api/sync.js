/* Cihazlar arası eşitleme: kayıt, eşitleme koduna bağlı olarak Upstash Redis'te tutulur.
   Vercel → Storage → Upstash Redis eklenince KV_REST_API_URL / KV_REST_API_TOKEN kendiliğinden gelir.
   GET ?k=KOD&meta=1 → { t }   GET ?k=KOD → { t, cihaz, v }   PUT { k, t, cihaz, v } → { ok, t } */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = async (...k) => { const r = await fetch(URL_, { method: "POST", headers: { Authorization: `Bearer ${TOK}` }, body: JSON.stringify(k) }); const j = await r.json(); if (j.error) throw new Error(j.error); return j.result; };
const gecerli = (k) => typeof k === "string" && /^[A-Za-z0-9-]{12,64}$/.test(k);
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOK) return res.status(503).json({ hata: "Eşitleme deposu bağlı değil (Vercel → Storage → Upstash Redis)." });
  try {
    if (req.method === "GET") {
      const k = req.query.k; if (!gecerli(k)) return res.status(400).json({ hata: "kod" });
      if (req.query.meta) return res.json({ t: Number(await redis("GET", `forma:t:${k}`)) || 0 });
      const v = await redis("GET", `forma:v:${k}`); return res.json(v ? JSON.parse(v) : { t: 0 });
    }
    if (req.method === "PUT" || req.method === "POST") {
      const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      if (!gecerli(b.k) || typeof b.v !== "string" || !(b.t > 0)) return res.status(400).json({ hata: "istek" });
      const eski = Number(await redis("GET", `forma:t:${b.k}`)) || 0;
      if (eski > b.t && !b.zorla) return res.status(409).json({ hata: "daha yeni kayıt var", t: eski });
      await redis("SET", `forma:v:${b.k}`, JSON.stringify({ t: b.t, cihaz: b.cihaz || "", v: b.v }));
      await redis("SET", `forma:t:${b.k}`, String(b.t));
      return res.json({ ok: true, t: b.t });
    }
    res.status(405).end();
  } catch (e) { res.status(500).json({ hata: String(e.message || e) }); }
}
