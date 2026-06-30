import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar,
} from "recharts";

/* ════════════════════════════════════════════════════════════
   FORMA — ŞİMŞEK · 7   ·   PES 2020 Çalışma Hub'u (v5)
   ════════════════════════════════════════════════════════════ */

const KEY2 = "forma:save:v2";
const KEY1 = "forma:history:v1";

const SUBJECTS = {
  mat: { name: "Matematik", stat: "finishing", statLabel: "Bitiricilik", icon: "🎯" },
  fiz: { name: "Fizik / Fen", stat: "kickpower", statLabel: "Şut Gücü", icon: "⚡" },
  bio: { name: "Biyoloji", stat: "lowpass", statLabel: "Yerden Pas", icon: "🧬" },
  eng: { name: "İngilizce B", stat: "dribbling", statLabel: "Dripling", icon: "🌀" },
  gp:  { name: "Global Politics", stat: "offaware", statLabel: "Hücum Sezgisi", icon: "🧠" },
  tok: { name: "TOK", stat: "tightposs", statLabel: "Yakın Kontrol", icon: "💭" },
  cog: { name: "Coğrafya", stat: "balance", statLabel: "Denge", icon: "🗺️" },
  tur: { name: "Türkçe A", stat: "ballcontrol", statLabel: "Top Kontrolü", icon: "⚽" },
  fra: { name: "Fransızca B", stat: "loftpass", statLabel: "Havadan Pas", icon: "🪁" },
};
const subjName = (k) => SUBJECTS[k]?.name || k;
const DEFAULT_REC = () => ({ sm1: false, sm2: false, sm3: false, on1: false, on2: false, on3: false, ev1: false, ev2: false, ontime: false, journal: false, subjS: "mat", subjO: "bio", subjE: "gp", extra: 0 });
const DEFAULT_SETTINGS = { name: "ŞİMŞEK", number: "7", age: "16", height: "186 cm", weight: "—", foot: "Sağ", tSabah: "10:00–11:30", tOgle: "13:00–14:30", tAksam: "17:00–18:30", focusMin: 25, breakMin: 5 };
const DEFAULT_FIXTURE = { 0: { S: "mat", O: "bio", E: "gp" }, 1: { S: "mat", O: "eng", E: "tok" }, 2: { S: "fiz", O: "bio", E: "cog" }, 3: { S: "mat", O: "eng", E: "gp" }, 4: { S: "fiz", O: "bio", E: "tur" }, 5: { S: "mat", O: "fra", E: "tok" }, 6: { S: "mat", O: "bio", E: "gp" } };
const DEFAULT_EVENTS = [
  { id: "e1", title: "IB DP Sınavları (Kasım)", date: "2027-11-01", type: "exam" },
  { id: "e2", title: "EE İlk Taslak", date: "2026-11-15", type: "ee" },
];
const DEFAULT_TOPICS = {
  mat: [{ id: "m1", name: "Trigonometri (özdeşlikler, denklemler)", st: "doing" }, { id: "m2", name: "Fonksiyonlar & grafikler", st: "solid" }, { id: "m3", name: "Türev / diferansiyel", st: "todo" }, { id: "m4", name: "Olasılık & istatistik", st: "weak" }],
  gp: [{ id: "g1", name: "Power, sovereignty, legitimacy", st: "solid" }, { id: "g2", name: "Peace & Conflict", st: "doing" }, { id: "g3", name: "Development & Sustainability", st: "todo" }],
};
const DEFAULT_OBJECTIVES = [
  { id: "o1", text: "OVR 90'a ulaş", type: "ovr", target: 90, done: false },
  { id: "o2", text: "20 günlük seri yakala", type: "streak", target: 20, done: false },
  { id: "o3", text: "Math IA'yı tamamla", type: "custom", target: 0, done: false },
];
const DEFAULT_ACADEMICS = {
  uni: { name: "", country: "", ibTarget: 40, reason: "" },
  grades: [
    { id: "tur", name: "Türkçe A", lvl: "HL", pred: 5, target: 6 },
    { id: "eng", name: "İngilizce B", lvl: "HL", pred: 5, target: 6 },
    { id: "fra", name: "Fransızca B", lvl: "HL", pred: 5, target: 6 },
    { id: "gp", name: "Global Politics", lvl: "HL", pred: 6, target: 7 },
    { id: "mat", name: "Math AA", lvl: "SL", pred: 5, target: 6 },
    { id: "bio", name: "Biyoloji", lvl: "SL", pred: 5, target: 6 },
  ],
  core: { pred: 1, target: 2 },
  papers: [],
};

/* ───────── storage ───────── */
function pick(res) { if (res == null) return null; if (typeof res === "string") return res; if (typeof res === "object") { if (typeof res.value === "string") return res.value; if (res.value != null) return res.value; } return null; }
const blank = () => ({ days: {}, settings: DEFAULT_SETTINGS, fixture: DEFAULT_FIXTURE, events: DEFAULT_EVENTS, topics: DEFAULT_TOPICS, objectives: DEFAULT_OBJECTIVES, academics: DEFAULT_ACADEMICS });
function hydrate(o) { return { days: o.days || {}, settings: { ...DEFAULT_SETTINGS, ...(o.settings || {}) }, fixture: { ...DEFAULT_FIXTURE, ...(o.fixture || {}) }, events: o.events || DEFAULT_EVENTS, topics: { ...DEFAULT_TOPICS, ...(o.topics || {}) }, objectives: o.objectives || DEFAULT_OBJECTIVES, academics: o.academics ? { ...DEFAULT_ACADEMICS, ...o.academics, uni: { ...DEFAULT_ACADEMICS.uni, ...(o.academics.uni || {}) }, core: { ...DEFAULT_ACADEMICS.core, ...(o.academics.core || {}) }, grades: o.academics.grades || DEFAULT_ACADEMICS.grades, papers: o.academics.papers || [] } : DEFAULT_ACADEMICS }; }
const Store = {
  async load() {
    try { const raw = pick(await window.storage.get(KEY2, false)); if (raw != null) { const o = typeof raw === "string" ? JSON.parse(raw) : raw; if (o && (o.days || o.v)) return hydrate(o); if (o && typeof o === "object") return hydrate({ days: o }); } } catch (e) {}
    try { const raw = pick(await window.storage.get(KEY1, false)); if (raw != null) { const o = typeof raw === "string" ? JSON.parse(raw) : raw; if (o && typeof o === "object") { const s = hydrate({ days: o }); await Store.save(s); return s; } } } catch (e) {}
    return blank();
  },
  async save(s) { try { await window.storage.set(KEY2, JSON.stringify({ v: 3, days: s.days, settings: s.settings, fixture: s.fixture, events: s.events, topics: s.topics, objectives: s.objectives, academics: s.academics }), false); return true; } catch (e) { console.error("FORMA kayıt hatası:", e); return false; } },
  async health() { try { await window.storage.set("__forma_probe__", "ok", false); const v = pick(await window.storage.get("__forma_probe__", false)); return v === "ok" || v === '"ok"'; } catch (e) { return false; } },
};

/* ───────── date / math ───────── */
const z = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
const parseYMD = (s) => { const [y, m, dd] = s.split("-").map(Number); return new Date(y, m - 1, dd); };
const diffDays = (a, b) => Math.round((parseYMD(a) - parseYMD(b)) / 86400000);
const labelDM = (k) => { const d = parseYMD(k); return `${z(d.getDate())}.${z(d.getMonth() + 1)}`; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const dayBack = (k, i) => { const d = parseYMD(k); d.setDate(d.getDate() - i); return ymd(d); };
const fmtTime = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${z(Math.floor(s / 60))}:${z(s % 60)}`; };
const weekday = (k) => (parseYMD(k).getDay() + 6) % 7; // Mon=0

const schedDone = (r) => (r.sm1 ? 1 : 0) + (r.sm2 ? 1 : 0) + (r.sm3 ? 1 : 0) + (r.on1 ? 1 : 0) + (r.on2 ? 1 : 0) + (r.on3 ? 1 : 0) + (r.ev1 ? 1 : 0) + (r.ev2 ? 1 : 0);
const totalPomos = (r) => schedDone(r) + (r.extra || 0);
const blockList = (r) => [{ subj: r.subjS, c: ((r.sm1 ? 1 : 0) + (r.sm2 ? 1 : 0) + (r.sm3 ? 1 : 0)) / 3 }, { subj: r.subjO, c: ((r.on1 ? 1 : 0) + (r.on2 ? 1 : 0) + (r.on3 ? 1 : 0)) / 3 }, { subj: r.subjE, c: ((r.ev1 ? 1 : 0) + (r.ev2 ? 1 : 0)) / 2 }];

function computeOVR(r) {
  let v = 60;
  if (schedDone(r) > 0) v += 3;
  v += (r.sm1 ? 6 : 0) + (r.sm2 ? 6 : 0) + (r.sm3 ? 6 : 0);
  v += (r.on1 ? 4 : 0) + (r.on2 ? 4 : 0) + (r.on3 ? 4 : 0);
  v += (r.ev1 ? 3 : 0) + (r.ev2 ? 3 : 0);
  if (r.ontime) v += 2; if (r.journal) v += 2; v += (r.extra || 0) * 3;
  return clamp(v, 40, 110);
}
const matchRating = (r) => clamp(6 + 4 * (schedDone(r) / 8) + (r.ontime ? 0.1 : 0) + (r.journal ? 0.1 : 0) + (r.extra || 0) * 0.1, 6, 10);

function breakdown(r) {
  const sS = subjName(r.subjS), sO = subjName(r.subjO), sE = subjName(r.subjE);
  const items = [{ l: "Taban — profesyonellik", p: 60, on: true, base: true }, { l: "İlk Düdük (sahaya çıkış)", p: 3, on: schedDone(r) > 0 }, { l: `Sabah 1 · ${sS}`, p: 6, on: !!r.sm1 }, { l: `Sabah 2 · ${sS}`, p: 6, on: !!r.sm2 }, { l: `Sabah 3 · ${sS}`, p: 6, on: !!r.sm3 }, { l: `Öğlen 1 · ${sO}`, p: 4, on: !!r.on1 }, { l: `Öğlen 2 · ${sO}`, p: 4, on: !!r.on2 }, { l: `Öğlen 3 · ${sO}`, p: 4, on: !!r.on3 }, { l: `Akşam 1 · ${sE}`, p: 3, on: !!r.ev1 }, { l: `Akşam 2 · ${sE}`, p: 3, on: !!r.ev2 }];
  if (r.ontime) items.push({ l: "Zamanında başlangıç ⚡", p: 2, on: true });
  if (r.journal) items.push({ l: "Günlük ✍️", p: 2, on: true });
  if (r.extra > 0) items.push({ l: `Ekstra ×${r.extra}`, p: 3 * r.extra, on: true });
  return items;
}

/* stat engine */
function wSubj(id, m, t) { let ws = 0, vs = 0; for (const k in m) { const da = diffDays(t, k); if (da < 0 || da > 21) continue; const w = Math.pow(0.8, da); let pt = null; for (const b of blockList(m[k])) if (SUBJECTS[b.subj]?.stat === id) pt = pt === null ? b.c : Math.max(pt, b.c); if (pt !== null) { ws += w; vs += w * pt; } } return ws > 0 ? vs / ws : null; }
function iSubj(id, r) { let pt = null; for (const b of blockList(r)) if (SUBJECTS[b.subj]?.stat === id) pt = pt === null ? b.c : Math.max(pt, b.c); return pt === null ? null : 40 + 59 * pt; }
function subjStat(id, m, t, r, def = 58) { const roll = wSubj(id, m, t), inst = iSubj(id, r), rm = roll === null ? null : 40 + 59 * roll; let v; if (rm === null && inst === null) v = def; else v = Math.max(rm === null ? -1 : rm, inst === null ? -1 : inst); return clamp(Math.round(v), 40, 110); }
function tStat(f, m, t, r) { let ws = 0, vs = 0; for (const k in m) { const da = diffDays(t, k); if (da < 0 || da > 21) continue; const w = Math.pow(0.8, da); ws += w; vs += w * (m[k][f] ? 1 : 0); } const rm = 40 + 59 * (ws > 0 ? vs / ws : 0), inst = r[f] ? 99 : -1; return clamp(Math.round(Math.max(rm, inst)), 40, 110); }
function fieldDays(m, t, f, n) { let c = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (r && r[f]) c++; } return c; }
function evDays(m, t, n) { let c = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (r && (r.ev1 || r.ev2)) c++; } return c; }
function pomoDays(m, t, n) { let c = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (r && (schedDone(r) > 0 || r.extra > 0)) c++; } return c; }
function sumSched(m, t, n) { let s = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (r) s += schedDone(r); } return s; }
function sumPomTotal(m, t, n) { let s = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (r) s += totalPomos(r); } return s; }

function computeStats(m, t, r) {
  const S = (id) => subjStat(id, m, t, r);
  const finishing = S("finishing"), kickpower = S("kickpower"), lowpass = S("lowpass"), dribbling = S("dribbling"), offaware = S("offaware"), tightposs = S("tightposs"), balance = S("balance"), ballcontrol = S("ballcontrol"), loftpass = S("loftpass");
  const accel = tStat("ontime", m, t, r), placekick = tStat("journal", m, t, r);
  const c7 = clamp(sumSched(m, t, 7) / 42, 0, 1), c14 = pomoDays(m, t, 14) / 14;
  const stamina = clamp(Math.round(40 + 59 * c7), 40, 110), heading = clamp(Math.round(45 + 35 * c14), 40, 110), physical = clamp(Math.round(50 + 30 * c7), 40, 110);
  const speed = clamp(Math.round(42 + 45 * c7), 40, 110), jump = clamp(Math.round(stamina - 8), 40, 110), curl = clamp(Math.round((loftpass + placekick) / 2 - 4), 40, 110);
  const defaware = clamp(Math.round(40 + 22 * c7), 40, 99), ballwin = clamp(Math.round(40 + 20 * c7), 40, 99), aggr = clamp(Math.round(40 + 18 * c7), 40, 99);
  const form = clamp(Math.round(1 + 7 * c14), 1, 8), injury = clamp(Math.round(1 + 2 * c14), 1, 3);
  const weakUsage = clamp(Math.round(1 + 3 * (evDays(m, t, 10) / 10)), 1, 4), weakAcc = clamp(Math.round(1 + 3 * (fieldDays(m, t, "journal", 10) / 10)), 1, 4);
  return { offaware, ballcontrol, dribbling, tightposs, lowpass, loftpass, finishing, heading, placekick, curl, speed, accel, kickpower, jump, physical, balance, stamina, defaware, ballwin, aggr, form, injury, weakUsage, weakAcc };
}
const statsAt = (m, k) => computeStats(m, k, m[k] || DEFAULT_REC());
function computeArrow(m, t, ov) { const prev = []; for (let i = 1; i <= 7; i++) { const r = m[dayBack(t, i)]; if (r) prev.push(computeOVR(r)); } if (!prev.length) return "flat"; const a = prev.reduce((x, y) => x + y, 0) / prev.length; if (ov > a + 1.5) return "up"; if (ov < a - 1.5) return "down"; return "flat"; }
function coachComment(r) {
  if (schedDone(r) === 0) return "Henüz sahaya çıkmadın — Sabah bloğunu başlat, gün açılır.";
  if (!(r.sm1 && r.sm2 && r.sm3)) return `Sabah bloğu (${subjName(r.subjS)}) yarım — bitiriciliğin için kapat.`;
  if (!(r.on1 && r.on2 && r.on3)) return `Öğlen bloğunu (${subjName(r.subjO)}) tamamla, OVR'yi yukarı çek.`;
  if (!(r.ev1 && r.ev2)) return `Akşam bloğu (${subjName(r.subjE)}) kaldı — 8'i tamamla.`;
  if (!r.ontime) return "Tüm bloklar tamam. Yarın bir de zamanında başla ⚡ — 100'ü gör.";
  return "Tam maç. 8/8 pomodoro — bu tempo seni 99'a çiviler. 🔒";
}
function conditionRating(w) { if (w >= 42) return { l: "A", c: "#54B84A", t: "Mükemmel" }; if (w >= 34) return { l: "B", c: "#BCC83E", t: "İyi" }; if (w >= 20) return { l: "C", c: "#E8C13E", t: "Standart" }; if (w >= 10) return { l: "D", c: "#E5893C", t: "Düşük" }; return { l: "E", c: "#E25E69", t: "Form dışı" }; }
function streakCount(m, t) { let c = 0; for (let i = 0; ; i++) { const r = m[dayBack(t, i)]; if (r && (schedDone(r) > 0 || r.extra > 0)) c++; else break; } return c; }
function ontimeStreak(m, t) { let c = 0; for (let i = 0; ; i++) { const r = m[dayBack(t, i)]; if (r && r.ontime) c++; else break; } return c; }
function mathDays(m, t, n) { let c = 0; for (let i = 0; i < n; i++) { const r = m[dayBack(t, i)]; if (!r) continue; for (const b of blockList(r)) if (b.subj === "mat" && b.c >= 1) { c++; break; } } return c; }
function maxStreakAll(m) { const keys = Object.keys(m).filter((k) => { const r = m[k]; return r && (schedDone(r) > 0 || r.extra > 0); }).sort(); let best = 0, cur = 0, prev = null; for (const k of keys) { if (prev && diffDays(k, prev) === 1) cur++; else cur = 1; best = Math.max(best, cur); prev = k; } return best; }
const totalPomosAll = (m) => Object.keys(m).reduce((s, k) => s + totalPomos(m[k]), 0);
const bestOVRAll = (m) => Object.keys(m).reduce((b, k) => Math.max(b, computeOVR(m[k])), 0);
const maxPomoDayAll = (m) => Object.keys(m).reduce((b, k) => Math.max(b, totalPomos(m[k])), 0);
function subjCounts(m) { const a = {}; for (const k in m) { const r = m[k]; const add = (s, n) => { if (n) a[s] = (a[s] || 0) + n; }; add(r.subjS, (r.sm1 ? 1 : 0) + (r.sm2 ? 1 : 0) + (r.sm3 ? 1 : 0)); add(r.subjO, (r.on1 ? 1 : 0) + (r.on2 ? 1 : 0) + (r.on3 ? 1 : 0)); add(r.subjE, (r.ev1 ? 1 : 0) + (r.ev2 ? 1 : 0)); } return a; }
const nextTarget = (r) => { const o = ["sm1", "sm2", "sm3", "on1", "on2", "on3", "ev1", "ev2"]; return o.find((x) => !r[x]) || "extra"; };
function targetInfo(target, r) {
  if (target === "extra") return { label: "Ekstra Pomodoro", sub: "planın üstü", n: (r.extra || 0) + 1 };
  const map = { sm1: ["Sabah", r.subjS, 1], sm2: ["Sabah", r.subjS, 2], sm3: ["Sabah", r.subjS, 3], on1: ["Öğlen", r.subjO, 1], on2: ["Öğlen", r.subjO, 2], on3: ["Öğlen", r.subjO, 3], ev1: ["Akşam", r.subjE, 1], ev2: ["Akşam", r.subjE, 2] };
  const [blk, subj, n] = map[target]; return { label: `${blk} · ${subjName(subj)}`, sub: `Pomodoro ${n}`, icon: SUBJECTS[subj]?.icon };
}

/* transfer */
const VAL = [[40, 0.05], [50, 0.5], [58, 1.5], [64, 4], [70, 9], [75, 18], [80, 32], [84, 50], [87, 68], [90, 90], [92, 110], [94, 140], [96, 165], [98, 185], [100, 205], [110, 260]];
function marketM(ovr) { if (ovr <= VAL[0][0]) return VAL[0][1]; for (let i = 0; i < VAL.length - 1; i++) { const [x0, y0] = VAL[i], [x1, y1] = VAL[i + 1]; if (ovr <= x1) return y0 + ((ovr - x0) / (x1 - x0)) * (y1 - y0); } return VAL[VAL.length - 1][1]; }
function fmtVal(m) { if (m < 1) return `€${Math.round(m * 1000)} B`; if (m < 10) return `€${m.toFixed(1)} M`; return `€${Math.round(m)} M`; }
const CLUBS = [{ n: "Kasımpaşa", t: 58 }, { n: "Adana Demirspor", t: 60 }, { n: "Trabzonspor", t: 64 }, { n: "Başakşehir", t: 65 }, { n: "Beşiktaş", t: 68 }, { n: "Fenerbahçe", t: 68 }, { n: "Galatasaray", t: 69 }, { n: "Ajax", t: 72 }, { n: "Lyon", t: 72 }, { n: "Benfica", t: 73 }, { n: "Porto", t: 73 }, { n: "Villarreal", t: 76 }, { n: "Sevilla", t: 76 }, { n: "Napoli", t: 77 }, { n: "Leverkusen", t: 77 }, { n: "Newcastle", t: 80 }, { n: "Atalanta", t: 80 }, { n: "Milan", t: 81 }, { n: "Tottenham", t: 81 }, { n: "Inter", t: 84 }, { n: "Atlético Madrid", t: 84 }, { n: "Dortmund", t: 84 }, { n: "Arsenal", t: 85 }, { n: "PSG", t: 88 }, { n: "Chelsea", t: 88 }, { n: "Liverpool", t: 88 }, { n: "Bayern München", t: 89 }, { n: "Real Madrid", t: 91 }, { n: "Barcelona", t: 91 }, { n: "Manchester City", t: 92 }];
function interestedClubs(ovr) { return CLUBS.filter((c) => c.t <= ovr && c.t > ovr - 13).sort((a, b) => b.t - a.t).slice(0, 6).map((c) => { const g = ovr - c.t; return { ...c, level: g <= 2 ? "Scout takipte" : g <= 6 ? "Ciddi ilgi" : "Resmi teklif", col: g <= 2 ? C.lo : g <= 6 ? C.flat : "#54B84A" }; }); }
function currentClub(ovr) { const q = CLUBS.filter((c) => c.t <= ovr).sort((a, b) => b.t - a.t); return q.length ? q[0].n : "Genç Akademi"; }
function peer(ovr) { if (ovr >= 98) return "Haaland / Mbappé seviyesi"; if (ovr >= 95) return "Lewandowski seviyesi"; if (ovr >= 92) return "Osimhen / Vlahović seviyesi"; if (ovr >= 89) return "Darwin Núñez seviyesi"; if (ovr >= 85) return "Lacazette seviyesi"; if (ovr >= 80) return "İlk 11 santrforu"; if (ovr >= 75) return "Rotasyon oyuncusu"; if (ovr >= 70) return "Parlayan genç yetenek"; if (ovr >= 64) return "Akademi mezunu"; return "Altyapı prospect'i"; }

/* league */
const DIVS = [{ n: "Amatör Lig", min: 0 }, { n: "Bölgesel Lig", min: 14 }, { n: "1. Lig", min: 24 }, { n: "Süper Lig", min: 32 }, { n: "Avrupa Ligi", min: 40 }, { n: "Şampiyonlar Ligi", min: 48 }];
function leagueInfo(m, t) {
  const avg = sumPomTotal(m, t, 28) / 4;
  let idx = 0; for (let i = 0; i < DIVS.length; i++) if (avg >= DIVS[i].min) idx = i;
  const cur = DIVS[idx], next = DIVS[idx + 1] || null, prevMin = cur.min;
  const toNext = next ? Math.max(0, Math.ceil((next.min - avg) * 1)) : 0;
  const relRisk = idx > 0 && avg < prevMin + 3;
  return { avg: Math.round(avg), cur, next, idx, toNext, relRisk, prevDiv: DIVS[idx - 1] || null };
}
const EV_ICON = { exam: "🏆", mock: "⚽", ia: "📋", ee: "📕", other: "📌" };
const EV_LABEL = { exam: "Sınav", mock: "Deneme", ia: "IA", ee: "EE", other: "Diğer" };
function upcomingEvents(events, t) { return [...events].map((e) => ({ ...e, left: diffDays(e.date, t) })).filter((e) => e.left >= 0).sort((a, b) => a.left - b.left); }

/* match history & objectives */
function bestSubjOfDay(r) { const b = blockList(r).map((x) => ({ ...x, done: x.subj === r.subjS ? (r.sm1 ? 1 : 0) + (r.sm2 ? 1 : 0) + (r.sm3 ? 1 : 0) : x.subj === r.subjO ? (r.on1 ? 1 : 0) + (r.on2 ? 1 : 0) + (r.on3 ? 1 : 0) : (r.ev1 ? 1 : 0) + (r.ev2 ? 1 : 0) })).sort((a, z) => z.done - a.done); return b[0] && b[0].done > 0 ? b[0].subj : null; }
function matchHistory(m, days, t) { const keys = Object.keys(m).filter((k) => days[k] || k === t).sort().reverse().slice(0, 12); return keys.map((k) => { const r = m[k]; const g = schedDone(r); return { k, g, extra: r.extra || 0, rating: matchRating(r), res: g >= 8 ? "G" : g >= 5 ? "B" : "M", motm: bestSubjOfDay(r) }; }); }
function objProgress(o, ctx) { if (o.type === "ovr") return clamp(ctx.best / (o.target || 1), 0, 1); if (o.type === "streak") return clamp(ctx.maxStreak / (o.target || 1), 0, 1); if (o.type === "total") return clamp(ctx.totalPom / (o.target || 1), 0, 1); return o.done ? 1 : 0; }
const OBJ_TYPES = { ovr: "OVR hedefi", streak: "Seri (gün)", total: "Toplam pomodoro", custom: "Serbest görev" };

/* academics, reflection, career level */
const ibPred = (a) => a.grades.reduce((s, g) => s + (Number(g.pred) || 0), 0) + (Number(a.core.pred) || 0);
const ibTgt = (a) => a.grades.reduce((s, g) => s + (Number(g.target) || 0), 0) + (Number(a.core.target) || 0);
function paperAvg(papers, subjId) { const ps = papers.filter((p) => p.subj === subjId); return ps.length ? Math.round(ps.reduce((s, p) => s + (Number(p.score) || 0), 0) / ps.length) : null; }
function recentNotes(m, days, t, n = 6) { return Object.keys(m).filter((k) => (days[k] || k === t) && m[k].note && m[k].note.trim()).sort().reverse().slice(0, n).map((k) => ({ k, note: m[k].note.trim() })); }
function lastStudied(m, subjId, t) { for (let i = 0; i < 60; i++) { const r = m[dayBack(t, i)]; if (r) for (const b of blockList(r)) if (b.subj === subjId && b.c > 0) return i; } return null; }
function staleSubjects(m, t, minGap = 4) { return Object.keys(SUBJECTS).map((s) => ({ s, gap: lastStudied(m, s, t) })).filter((x) => x.gap === null || x.gap >= minGap).sort((a, b) => (b.gap === null ? 999 : b.gap) - (a.gap === null ? 999 : a.gap)); }
const studyHours = (m, focusMin) => Math.round((totalPomosAll(m) * (Number(focusMin) || 25) / 60) * 10) / 10;
function careerLevel(totalPom) { let lvl = 1, need = 10, acc = 0; while (totalPom >= acc + need) { acc += need; lvl++; need = Math.round(need * 1.25); } return { lvl, into: totalPom - acc, need, pct: need ? (totalPom - acc) / need : 0 }; }
const examLeft = (events, t) => { const e = upcomingEvents(events, t).find((x) => x.type === "exam"); return e ? e.left : null; };

function coachContext(p) {
  const { settings, ovr, record, stats, merged, days, todayKey, events, topics, academics } = p;
  const lg = leagueInfo(merged, todayKey); const streak = streakCount(merged, todayKey);
  const A = stats;
  const allStats = [["Bitiricilik", A.finishing], ["Hücum Sezgisi", A.offaware], ["Top Kontrolü", A.ballcontrol], ["Dripling", A.dribbling], ["Yerden Pas", A.lowpass], ["Havadan Pas", A.loftpass], ["Şut Gücü", A.kickpower], ["Dayanıklılık", A.stamina], ["İvmelenme", A.accel], ["Duran Top", A.placekick]];
  const sorted = [...allStats].sort((a, b) => b[1] - a[1]);
  const strong = sorted.slice(0, 3).map(([l, v]) => `${l} ${v}`).join(", ");
  const weak = sorted.slice(-3).map(([l, v]) => `${l} ${v}`).join(", ");
  const weakTopics = Object.entries(topics).flatMap(([s, list]) => list.filter((t) => t.st === "weak").map((t) => `${subjName(s)}: ${t.name}`)).slice(0, 5).join("; ") || "yok";
  const up = upcomingEvents(events, todayKey); const nextEv = up[0];
  const ac = academics || DEFAULT_ACADEMICS;
  const grades = ac.grades.map((g) => `${g.name} ${g.lvl}: ${g.pred}→${g.target}`).join("; ");
  const papers = ac.papers.length ? ac.grades.map((g) => { const av = paperAvg(ac.papers, g.id); return av != null ? `${g.name} %${av}` : null; }).filter(Boolean).join(", ") : "henüz deneme yok";
  const notes = recentNotes(merged, days || {}, todayKey, 3).map((x) => `(${labelDM(x.k)}) ${x.note}`).join(" | ") || "yok";
  return `OYUNCU VERİSİ:
- İsim: ${settings.name} (${settings.number} numara santrfor)
- Hedef üniversite: ${ac.uni.name ? `${ac.uni.name}${ac.uni.country ? ", " + ac.uni.country : ""}` : "henüz belirlenmedi"}${ac.uni.reason ? ` (neden: ${ac.uni.reason})` : ""}
- IB hedef puanı: ${ac.uni.ibTarget}/45 · şu anki tahmini toplam: ${ibPred(ac)}/45
- Ders notları (tahmini→hedef): ${grades}
- Deneme (past paper) ortalamaları: ${papers}
- Bugünkü OVR: ${ovr}
- Bugün tamamlanan: ${schedDone(record)}/8 pomodoro${record.extra ? ` (+${record.extra} ekstra)` : ""}
- Bugünkü dersler: Sabah ${subjName(record.subjS)}, Öğlen ${subjName(record.subjO)}, Akşam ${subjName(record.subjE)}
- Güncel seri: ${streak} gün
- Lig: ${lg.cur.n}, haftalık ortalama ${lg.avg} pomodoro
- En güçlü yetenekler: ${strong}
- En zayıf yetenekler: ${weak}
- Zayıf konular: ${weakTopics}
- Son maç sonu röportajları: ${notes}
- Yaklaşan sınav/teslim: ${nextEv ? `${nextEv.title} (${nextEv.left} gün kaldı)` : "yok"}`;
}
const COACH_PERSONA = `Sen FORMA çalışma uygulamasının teknik direktörüsün (futbol koçu). Öğrenci Baran senin santrforun "ŞİMŞEK, 7 numara". Türkçe konuşursun. Tarzın: doğrudan, net, motive edici ama boş övgü yok; futbol mecazları kullanırsın (maç, idman, forma, kondisyon, fikstür). Verilere dayanarak konuşur, somut çalışma tavsiyesi verirsin. Kısa tut (en fazla 200 kelime). Başlık/madde işareti kullanma, akıcı paragraflar yaz. Ona "7 numara", "ŞİMŞEK" ya da "kaptan" diye hitap edebilirsin.`;
const COACH_MODES = {
  match: { label: "Maç Sonu Konuşması", icon: "🎙️", task: "Bugünkü performansına göre soyunma odası konuşması yap. İyi gittiği yeri öv, eksik kalan bloğu/yeteneği işaret et, yarın için tek net hedef ver." },
  week: { label: "Haftalık Analiz", icon: "📋", task: "Haftalık tempoyu ve ligdeki yerini analiz et. En zayıf yeteneğine ve zayıf konularına odaklanan, bu hafta uygulanabilir 2-3 somut çalışma tavsiyesi ver." },
  weak: { label: "Zayıf Nokta Raporu", icon: "🎯", task: "En zayıf yeteneğini ve zayıf konularını ele al. Bunları güçlendirmek için hangi derse nasıl yükleneceğini, somut bir idman planıyla anlat." },
  exam: { label: "Sınav Kampı", icon: "🔥", task: "Yaklaşan sınava/teslime göre bir kamp planı çiz. Kalan günü nasıl bölmesi gerektiğini, hangi konulara öncelik vereceğini söyle. Yaklaşan bir şey yoksa genel sezon hedefi ver." },
  uni: { label: "Üniversite Yolu", icon: "🎓", task: "Hedef üniversitesine ve IB puan hedefine odaklı bir yol haritası çiz. Şu anki tahmini puanı ile hedefi arasındaki farkı söyle; en çok puan kazandıracak (tahmini ile hedefi arasındaki farkı en büyük olan) derslere nasıl yükleneceğini somut anlat. Deneme ortalamaları düşükse onu vurgula. Hedef üniversite belirlenmemişse önce 'Karne' sekmesinden hayalini netleştirmesini iste, sonra puan planı yap. Onu hayaline doğru motive et ama gerçekçi ve net ol." },
};
async function callCoach(mode, ctx) {
  const prompt = `${COACH_PERSONA}\n\n${ctx}\n\nGÖREV: ${COACH_MODES[mode].task}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}


/* ───────── palette ───────── */
const C = { hi: "#F3EDFB", mid: "#CBBEDD", lo: "#9C8DB8", accent: "#B14FD8", accentDeep: "#7A2E9E", teal: "#4ED4C2", red: "#E25E69", up: "#46A6E0", flat: "#E8C13E", down: "#E25E69", gold: "#E8C13E", line: "rgba(255,255,255,0.06)", lineHard: "rgba(255,255,255,0.13)", panel: "rgba(28,14,46,0.60)", panelSolid: "#1d0e30" };
function abilityColor(v) { if (v >= 100) return { bg: "#46C657", fg: "#0a2a10", glow: true }; if (v >= 90) return { bg: "#54B84A", fg: "#0a2a10" }; if (v >= 80) return { bg: "#BCC83E", fg: "#241a06" }; if (v >= 70) return { bg: "#E5893C", fg: "#2a1606" }; return { bg: C.red, fg: "#fff" }; }
const ST_COLOR = { todo: { c: C.lo, l: "Öğrenilecek" }, doing: { c: C.flat, l: "Çalışılıyor" }, solid: { c: "#54B84A", l: "Sağlam" }, weak: { c: C.red, l: "Zayıf" } };
const TABS = [["today", "Bugün"], ["karne", "Karne"], ["topics", "Konular"], ["program", "Program"], ["coach", "Hoca"], ["career", "Kariyer"], ["ability", "Yetenek"], ["transfer", "Transfer"], ["style", "Stil"], ["data", "Veri"]];

/* ───────── primitives ───────── */
function FormArrow({ a, size = 22 }) { const m = { up: { ch: "▲", c: C.up, t: "YÜKSELİŞTE" }, flat: { ch: "▬", c: C.flat, t: "SABİT" }, down: { ch: "▼", c: C.down, t: "DÜŞÜŞTE" } }[a]; return <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ color: m.c, fontSize: size, lineHeight: 1, textShadow: `0 0 10px ${m.c}66` }}>{m.ch}</span><span style={{ color: m.c, fontSize: Math.max(9, size * 0.42), fontWeight: 700, letterSpacing: 1 }}>{m.t}</span></span>; }
function Badge({ v, special }) { const col = special ? { bg: C.teal, fg: "#0c3530" } : abilityColor(v); return <span className={col.glow ? "pes-glow" : ""} style={{ ...ST.badge, background: col.bg, color: col.fg, backgroundImage: "linear-gradient(180deg,rgba(255,255,255,0.20),rgba(0,0,0,0.12))", boxShadow: col.glow ? `0 0 12px ${col.bg}aa` : "inset 0 1px 0 rgba(255,255,255,0.25)" }}>{v}</span>; }
const Panel = ({ children, style }) => <div style={{ ...ST.panel, ...style }}>{children}</div>;
const PanelHead = ({ title, right }) => <div style={ST.panelHeadRow}><span style={ST.panelTitle}>{title}</span><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>{right}</div></div>;
const StatRow = ({ label, value, special }) => <div style={ST.statRow}><span style={{ color: C.hi, fontSize: 14 }}>{label}</span><Badge v={value} special={special} /></div>;
const Pill = ({ children, onClick, solid, danger }) => <button onClick={onClick} className="pes-pill" style={{ ...ST.pill, ...(solid ? { background: C.accentDeep, color: "#fff", borderColor: C.accentDeep } : {}), ...(danger ? { color: C.red, borderColor: C.red + "66" } : {}) }}>{children}</button>;
const Stat = ({ label, value, color }) => <div style={ST.statCard}><div style={{ color: C.lo, fontSize: 10, letterSpacing: 1 }}>{label}</div><div style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 28, color, lineHeight: 1.1 }}>{value}</div></div>;
function TaskRow({ icon, label, time, pts, on, onToggle, accent, live }) {
  return (
    <button className="pes-task" onClick={onToggle} style={{ ...ST.taskRow, background: on ? "rgba(84,184,74,0.10)" : live ? "rgba(70,166,224,0.10)" : "transparent", borderLeft: on ? "3px solid #54B84A" : live ? `3px solid ${C.up}` : accent ? `3px solid ${C.accent}` : "3px solid transparent" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>{icon && <span style={{ fontSize: 16, width: 20 }}>{icon}</span>}<span><span style={{ display: "block", color: on ? "#fff" : C.hi, fontWeight: 600, fontSize: 14 }}>{label}{live && <span style={{ color: C.up, fontSize: 10, marginLeft: 6 }}>● İDMANDA</span>}</span>{time && <span style={{ display: "block", color: C.lo, fontSize: 11 }}>{time}</span>}</span></span>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: on ? "#54B84A" : C.lo }}>+{pts}</span><span style={{ ...ST.check, background: on ? "#54B84A" : "transparent", borderColor: on ? "#54B84A" : C.lineHard, color: on ? "#0a2a10" : "transparent" }}>✓</span></span>
    </button>
  );
}
function SubjPicker({ slot, label, value, onChange }) { const s = SUBJECTS[value]; return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}><span style={ST.groupLabel}>{label}</span><span style={{ display: "flex", alignItems: "center", gap: 8 }}><select className="pes-select" value={value} onChange={(e) => onChange(slot, e.target.value)} style={ST.select}>{Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select><span style={{ color: C.accent, fontSize: 11, whiteSpace: "nowrap" }}>→ {s.icon} {s.statLabel}</span></span></div>; }
function Field({ label, k, w, settings, setSetting, type }) { return <label style={{ display: "flex", flexDirection: "column", gap: 4, width: w || "auto" }}><span style={{ color: C.lo, fontSize: 11, letterSpacing: 1 }}>{label}</span><input className="pes-input" type={type || "text"} value={settings[k]} onChange={(e) => setSetting(k, e.target.value)} style={ST.input} /></label>; }
function Ring({ frac, size = 116, color }) { const r = (size - 12) / 2, c = 2 * Math.PI * r; return <svg width={size} height={size}><circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" /><circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .4s linear" }} /></svg>; }
function KitCard({ ovr, arrow, settings, top }) {
  const col = abilityColor(ovr);
  return (
    <div style={ST.kit}>
      <div style={{ color: C.lo, letterSpacing: 4, fontSize: 10 }}>SANTRFOR</div>
      <div className="pes-seven" style={ST.seven}>{settings.number}</div>
      <div style={{ fontFamily: "Oswald,sans-serif", fontStyle: "italic", fontWeight: 600, fontSize: 24, color: "#fff", letterSpacing: 2 }}>{settings.name}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}><span style={{ color: C.lo, fontSize: 10, letterSpacing: 2 }}>OVR</span><span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 40, color: col.bg, textShadow: `0 0 14px ${col.bg}66` }}>{ovr}</span></div>
      <div style={{ marginTop: 6, color: C.gold, fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 16 }}>{fmtVal(marketM(ovr))}</div>
      <div style={{ marginTop: 8 }}><FormArrow a={arrow} size={18} /></div>
      {top && <div style={{ marginTop: 16, width: "100%" }}><div style={{ color: C.lo, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>EN İYİ 3 YETENEK</div>{top.map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}><span style={{ color: C.mid, fontSize: 12 }}>{l}</span><Badge v={v} /></div>)}</div>}
    </div>
  );
}
class Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error("FORMA bölüm hatası:", err, info); }
  render() { if (this.state.err) return (<Panel style={{ borderColor: C.red + "55" }}><div style={{ color: "#fff", fontFamily: "Oswald,sans-serif", fontSize: 18, marginBottom: 8 }}>Bu bölümde bir hata oluştu</div><div style={{ color: C.mid, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>Verilerin güvende. Başka sekmeye geç ya da tekrar dene. Yedek için "Veri" sekmesini kullan.</div><Pill solid onClick={() => this.setState({ err: null })}>Tekrar dene</Pill></Panel>); return this.props.children; }
}

/* ════════════════════════════════════════════════════════════ */
export default function App() {
  const todayKey = useMemo(() => ymd(new Date()), []);
  const [days, setDays] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [fixture, setFixture] = useState(DEFAULT_FIXTURE);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [objectives, setObjectives] = useState(DEFAULT_OBJECTIVES);
  const [academics, setAcademics] = useState(DEFAULT_ACADEMICS);
  const [loading, setLoading] = useState(true);
  const [storageOk, setStorageOk] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const [lastSaved, setLastSaved] = useState(null);
  const [tab, setTab] = useState("today");
  const [timer, setTimer] = useState({ status: "idle", mode: "focus", endTime: null, target: null, leftPaused: null });
  const [now, setNow] = useState(Date.now());

  const ref = useRef({});
  useEffect(() => { ref.current = { days, settings, fixture, events, topics, objectives, academics }; }, [days, settings, fixture, events, topics, objectives, academics]);
  useEffect(() => { (async () => { const ok = await Store.health(); setStorageOk(ok); const d = await Store.load(); setDays(d.days); setSettings(d.settings); setFixture(d.fixture); setEvents(d.events); setTopics(d.topics); setObjectives(d.objectives); setAcademics(d.academics); setLoading(false); })(); }, []);
  useEffect(() => { const f = () => { if (document.visibilityState === "hidden") Store.save(ref.current); }; document.addEventListener("visibilitychange", f); window.addEventListener("pagehide", f); return () => { document.removeEventListener("visibilitychange", f); window.removeEventListener("pagehide", f); }; }, []);
  useEffect(() => { if (timer.status !== "running") return; const id = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, [timer.status]);

  const fixToday = fixture[weekday(todayKey)] || { S: "mat", O: "bio", E: "gp" };
  const record = days[todayKey] || { ...DEFAULT_REC(), subjS: fixToday.S, subjO: fixToday.O, subjE: fixToday.E };
  const merged = useMemo(() => ({ ...days, [todayKey]: record }), [days, record, todayKey]);

  async function persist(next) { const s = { days, settings, fixture, events, topics, objectives, academics, ...next }; setDays(s.days); setSettings(s.settings); setFixture(s.fixture); setEvents(s.events); setTopics(s.topics); setObjectives(s.objectives); setAcademics(s.academics); setSaveState("saving"); const ok = await Store.save(s); setSaveState(ok ? "saved" : "error"); if (ok) setLastSaved(Date.now()); setStorageOk(ok || storageOk); }
  const update = (patch) => persist({ days: { ...days, [todayKey]: { ...record, ...patch } } });
  const onSubj = (slot, val) => update({ [slot]: val });
  const setSetting = (k, v) => persist({ settings: { ...settings, [k]: v } });
  const setFix = (wd, slot, val) => persist({ fixture: { ...fixture, [wd]: { ...(fixture[wd] || {}), [slot]: val } } });
  const addEvent = (ev) => persist({ events: [...events, ev] });
  const removeEvent = (id) => persist({ events: events.filter((e) => e.id !== id) });
  const setTopicsFor = (subj, list) => persist({ topics: { ...topics, [subj]: list } });
  const addObjective = (o) => persist({ objectives: [...objectives, o] });
  const removeObjective = (id) => persist({ objectives: objectives.filter((o) => o.id !== id) });
  const toggleObjective = (id) => persist({ objectives: objectives.map((o) => o.id === id ? { ...o, done: !o.done } : o) });
  const setUni = (patch) => persist({ academics: { ...academics, uni: { ...academics.uni, ...patch } } });
  const setGrade = (id, field, val) => persist({ academics: { ...academics, grades: academics.grades.map((g) => g.id === id ? { ...g, [field]: val } : g) } });
  const setCore = (field, val) => persist({ academics: { ...academics, core: { ...academics.core, [field]: val } } });
  const addPaper = (p) => persist({ academics: { ...academics, papers: [...academics.papers, p] } });
  const removePaper = (id) => persist({ academics: { ...academics, papers: academics.papers.filter((p) => p.id !== id) } });
  const resetToday = () => { if (confirm("Bugünün kaydını sıfırla?")) persist({ days: { ...days, [todayKey]: { ...DEFAULT_REC(), subjS: fixToday.S, subjO: fixToday.O, subjE: fixToday.E } } }); };
  const resetAll = () => { if (confirm("TÜM kariyer verisi silinecek. Emin misin?")) persist({ days: {} }); };
  const importData = (obj) => persist(hydrate(obj.days ? obj : { days: obj }));

  // timer controls
  const fMin = Number(settings.focusMin) || 25, bMin = Number(settings.breakMin) || 5;
  const startFocus = () => { const t = nextTarget(record); setTimer({ status: "running", mode: "focus", endTime: Date.now() + fMin * 60000, target: t, leftPaused: null }); };
  const pauseTimer = () => setTimer((t) => ({ ...t, status: "paused", leftPaused: (t.endTime || Date.now()) - Date.now(), endTime: null }));
  const resumeTimer = () => setTimer((t) => ({ ...t, status: "running", endTime: Date.now() + (t.leftPaused || 0), leftPaused: null }));
  const stopTimer = () => setTimer({ status: "idle", mode: "focus", endTime: null, target: null, leftPaused: null });
  useEffect(() => {
    if (timer.status === "running" && timer.endTime && now >= timer.endTime) {
      if (timer.mode === "focus") { if (timer.target === "extra") update({ extra: (record.extra || 0) + 1 }); else if (timer.target) update({ [timer.target]: true }); try { navigator.vibrate?.(300); } catch (e) {} setTimer({ status: "running", mode: "break", endTime: Date.now() + bMin * 60000, target: null, leftPaused: null }); }
      else { try { navigator.vibrate?.(200); } catch (e) {} setTimer({ status: "idle", mode: "focus", endTime: null, target: null, leftPaused: null }); }
    }
  }, [now, timer]); // eslint-disable-line

  if (loading) return <Splash />;
  const ovr = computeOVR(record);
  const arrow = computeArrow(merged, todayKey, ovr);
  const stats = computeStats(merged, todayKey, record);
  const remaining = timer.endTime ? Math.max(0, timer.endTime - now) : (timer.leftPaused || 0);
  const timerCtl = { timer, remaining, fMin, bMin, startFocus, pauseTimer, resumeTimer, stopTimer };
  const props = { merged, days, settings, fixture, events, topics, objectives, academics, todayKey, record, ovr, arrow, stats, update, onSubj, setSetting, setFix, addEvent, removeEvent, setTopicsFor, addObjective, removeObjective, toggleObjective, setUni, setGrade, setCore, addPaper, removePaper, resetToday, resetAll, importData, storageOk, timerCtl };

  return (
    <div style={ST.root} className="pes-root">
      <StyleTag /><Ribbons />
      <div style={ST.inner}>
        <div style={ST.header}>
          <span style={ST.logo}>PES<span style={{ color: "#fff" }}>2020</span></span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {timer.status === "running" && <span onClick={() => setTab("today")} style={{ cursor: "pointer", background: timer.mode === "focus" ? "rgba(70,166,224,0.18)" : "rgba(84,184,74,0.18)", border: `1px solid ${timer.mode === "focus" ? C.up : "#54B84A"}66`, color: timer.mode === "focus" ? C.up : "#54B84A", fontWeight: 700, fontSize: 12, padding: "5px 10px", borderRadius: 20, fontFamily: "Oswald,sans-serif" }}>{timer.mode === "focus" ? "⏱ MAÇTA" : "☕ MOLA"} {fmtTime(remaining)}</span>}
            <SaveChip saveState={saveState} lastSaved={lastSaved} />
          </div>
        </div>
        {!storageOk && <div style={ST.warn}>⚠️ Cihaz depolaması erişilemiyor olabilir — <b>Veri</b> sekmesinden <b>Dışa Aktar</b> ile yedek al.</div>}
        <div style={ST.tabbar}>{TABS.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className="pes-tab" style={{ ...ST.tab, ...(tab === id ? ST.tabActive : {}) }}>{label}</button>)}</div>
        <Boundary key={tab}>
          {tab === "today" && <TodayView {...props} />}
          {tab === "karne" && <KarneView {...props} />}
          {tab === "ability" && <AbilityView {...props} />}
          {tab === "topics" && <TopicsView {...props} />}
          {tab === "program" && <ProgramView {...props} />}
          {tab === "coach" && <CoachView {...props} />}
          {tab === "transfer" && <TransferView {...props} />}
          {tab === "career" && <CareerView {...props} />}
          {tab === "style" && <StyleView {...props} />}
          {tab === "data" && <DataView {...props} />}
        </Boundary>
        <div style={ST.footer}><FBtn glyph="□" label="Yardım" /><FBtn glyph="✕" label="Onayla" col="#5B8DEF" /><FBtn glyph="◯" label="Geri" col={C.red} /><FBtn glyph="△" label="Günü Sıfırla" col="#54B84A" onClick={resetToday} /></div>
      </div>
    </div>
  );
}
function SaveChip({ saveState, lastSaved }) { const map = { idle: ["Hazır", C.lo, "rgba(255,255,255,0.06)"], saving: ["Kaydediliyor…", "#241a06", "#E8C13E"], saved: ["Kaydedildi ✓", "#0a2a10", "#54B84A"], error: ["Kayıt hatası ✗", "#fff", C.red] }; const [txt, fg, bg] = map[saveState]; return <span style={{ background: bg, color: fg, fontWeight: 700, fontSize: 11, padding: "5px 11px", borderRadius: 20 }}>{txt}{lastSaved && saveState === "saved" ? ` · ${new Date(lastSaved).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : ""}</span>; }
function FBtn({ glyph, label, col, onClick }) { return <button className="pes-fbtn" onClick={onClick} style={{ ...ST.fbtn, cursor: onClick ? "pointer" : "default" }}><span style={{ color: col || C.mid, fontSize: 14 }}>{glyph}</span><span style={{ color: C.mid, fontSize: 12 }}>{label}</span></button>; }
function Splash() { return <div style={{ ...ST.root, display: "flex", alignItems: "center", justifyContent: "center" }} className="pes-root"><StyleTag /><Ribbons /><div style={{ textAlign: "center", zIndex: 3 }}><div style={ST.logo}>PES<span style={{ color: C.accent }}>FORMA</span></div><div style={{ color: C.mid, marginTop: 8, letterSpacing: 5, fontSize: 11 }}>YÜKLENİYOR…</div></div></div>; }

/* ════════════ TIMER CARD ════════════ */
function TimerCard({ timerCtl, record }) {
  const { timer, remaining, fMin, bMin, startFocus, pauseTimer, resumeTimer, stopTimer } = timerCtl;
  const target = timer.target || nextTarget(record);
  const info = targetInfo(target, record);
  const allDone = nextTarget(record) === "extra";
  const total = (timer.mode === "focus" ? fMin : bMin) * 60000;
  const frac = timer.status === "idle" ? 1 : clamp(remaining / total, 0, 1);
  const ringColor = timer.mode === "break" ? "#54B84A" : C.up;
  const running = timer.status === "running", paused = timer.status === "paused";
  const setPreset = timerCtl.setPreset;
  return (
    <Panel style={{ background: "linear-gradient(160deg, rgba(40,20,68,0.6), rgba(20,11,38,0.5))" }}>
      <PanelHead title="İdman Saati" right={<span style={ST.tag}>{fMin}·{bMin} dk</span>} />
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 116, height: 116, flex: "0 0 auto" }}>
          <Ring frac={frac} color={ringColor} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: 1 }}>{timer.status === "idle" ? `${fMin}:00` : fmtTime(remaining)}</span>
            <span style={{ fontSize: 9, letterSpacing: 2, color: timer.mode === "break" ? "#54B84A" : C.up, fontWeight: 700 }}>{timer.status === "idle" ? "HAZIR" : timer.mode === "break" ? "MOLA" : "MAÇTA"}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          {timer.mode === "break" && running ? (
            <div style={{ color: C.mid, fontSize: 14, lineHeight: 1.5 }}>☕ Mola — nefes al, su iç. Sıradaki idman birazdan.</div>
          ) : (
            <>
              <div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, marginBottom: 2 }}>SIRADAKİ</div>
              <div style={{ color: "#fff", fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 17 }}>{info.icon ? info.icon + " " : ""}{info.label}</div>
              <div style={{ color: C.mid, fontSize: 12 }}>{info.sub}{allDone ? " · 8/8 tamam, bonus tur 🔥" : ""}</div>
            </>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {timer.status === "idle" && <Pill solid onClick={startFocus}>▶ Başla</Pill>}
            {running && <Pill onClick={pauseTimer}>⏸ Duraklat</Pill>}
            {paused && <Pill solid onClick={resumeTimer}>▶ Devam</Pill>}
            {timer.status !== "idle" && <Pill onClick={stopTimer}>■ Durdur</Pill>}
          </div>
        </div>
      </div>
      {timer.status === "idle" && setPreset && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {[[25, 5], [50, 10], [15, 3]].map(([f, b]) => <button key={f} className="pes-pill" onClick={() => setPreset(f, b)} style={{ ...ST.pill, ...(f === fMin && b === bMin ? { background: C.accentDeep, color: "#fff", borderColor: C.accentDeep } : {}) }}>{f}·{b}</button>)}
        </div>
      )}
    </Panel>
  );
}

/* ════════════ TODAY ════════════ */
function Mola({ time, label }) { return <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0 12px", color: C.lo, fontSize: 11 }}><div style={{ flex: 1, height: 1, background: C.line }} />☕ Mola · {time} · {label}<div style={{ flex: 1, height: 1, background: C.line }} /></div>; }
function TodayView({ record: r, ovr, arrow, update, onSubj, merged, days, todayKey, settings, events, academics, timerCtl, setSetting }) {
  const [showCard, setShowCard] = useState(false);
  const dateStr = parseYMD(todayKey).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  const rating = matchRating(r);
  let weekPom = 0; const dow = weekday(todayKey); for (let i = 0; i <= dow; i++) { const x = merged[dayBack(todayKey, i)]; if (x) weekPom += totalPomos(x); }
  const cond = conditionRating(weekPom); const breakthrough = ovr >= 95; const val = marketM(ovr);
  const up = upcomingEvents(events, todayKey); const nextEv = up[0];
  const ac = academics || DEFAULT_ACADEMICS; const exL = examLeft(events, todayKey); const pred = ibPred(ac);
  const lvl = careerLevel(totalPomosAll(merged));
  const liveTarget = timerCtl.timer.status === "running" && timerCtl.timer.mode === "focus" ? timerCtl.timer.target : null;
  const T = (icon, label, time, pts, field, accent) => <TaskRow icon={icon} label={label} time={time} pts={pts} on={r[field]} onToggle={() => update({ [field]: !r[field] })} accent={accent} live={liveTarget === field} />;
  const BlockHead = ({ icon, title, tag, time }) => <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}><span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 17 }}>{icon}</span><span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 17, color: "#fff" }}>{title}</span><span style={ST.blockTag}>{tag}</span></span><span style={{ color: C.lo, fontSize: 11 }}>{time}</span></div>;

  return (
    <div style={ST.col}>
      {ac.uni.name && <div style={ST.northstar}><span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 16 }}>🎓</span><span><b style={{ color: "#fff" }}>{ac.uni.name}</b><span style={{ color: C.lo }}> · hedefin</span></span></span><span style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ color: pred >= (Number(ac.uni.ibTarget) || 45) ? "#54B84A" : C.gold, fontFamily: "Oswald,sans-serif", fontWeight: 700 }}>{pred}/{ac.uni.ibTarget}</span>{exL != null && <span style={{ color: exL <= 60 ? C.red : C.mid, fontFamily: "Oswald,sans-serif", fontWeight: 700 }}>{exL}g</span>}</span></div>}
      {nextEv && <div style={ST.deadline}><span>{EV_ICON[nextEv.type]} <b style={{ color: "#fff" }}>{nextEv.title}</b> · {EV_LABEL[nextEv.type]}</span><span style={{ color: nextEv.left <= 14 ? C.red : C.gold, fontFamily: "Oswald,sans-serif", fontWeight: 700 }}>{nextEv.left === 0 ? "BUGÜN" : `${nextEv.left} gün`}</span></div>}

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "center" }}><div style={{ color: C.lo, fontSize: 10, letterSpacing: 3 }}>OVERALL</div><div className={breakthrough ? "pes-glow" : ""} style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 62, lineHeight: 0.9, color: abilityColor(ovr).bg, textShadow: `0 0 18px ${abilityColor(ovr).bg}66` }}>{ovr}</div><FormArrow a={arrow} size={18} /></div>
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}><span style={ST.posPill}>CF</span><span style={ST.matchPill}>MAÇ {rating.toFixed(1)}</span><span style={{ ...ST.condPill, color: cond.c, borderColor: cond.c + "88" }}>KOND. {cond.l}</span><span style={ST.valPill}>{fmtVal(val)}</span></div>
              <div style={{ color: C.mid, fontSize: 13, maxWidth: 320, lineHeight: 1.4 }}>{coachComment(r)}</div>
              {breakthrough && <div className="pes-blink" style={ST.breakthrough}>⚡ BREAKTHROUGH · gün formda</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}><div style={{ color: C.lo, fontSize: 11, textTransform: "capitalize" }}>{dateStr}</div><div style={{ color: C.mid, fontSize: 12, marginTop: 4 }}>{schedDone(r)}/8 pomodoro{r.extra ? ` +${r.extra}` : ""}</div><div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(177,79,216,0.15)", border: `1px solid ${C.accent}55`, borderRadius: 20, padding: "3px 10px" }}><span style={{ color: C.accent, fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 12 }}>★ Sv {lvl.lvl}</span><span style={{ width: 40, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${Math.round(lvl.pct * 100)}%`, background: C.accent }} /></span></div></div>
        </div>
      </Panel>

      <TimerCard timerCtl={{ ...timerCtl, setPreset: (f, b) => { setSetting("focusMin", f); setSetting("breakMin", b); } }} record={r} />

      <Panel>
        <PanelHead title="Günün Programı" right={<span style={ST.tag}>8 pomodoro · 3 blok</span>} />
        <div style={{ marginBottom: 6 }}><BlockHead icon="☀️" title="Sabah Bloğu" tag="ZOR DERS" time={settings.tSabah} /><SubjPicker slot="subjS" label="DERS" value={r.subjS} onChange={onSubj} />{T(null, "Pomodoro 1", null, 6, "sm1")}{T(null, "Pomodoro 2", null, 6, "sm2")}{T(null, "Pomodoro 3", null, 6, "sm3")}</div>
        <Mola time="11:30–11:45" label="Dinlenme" />
        <div style={{ marginBottom: 6 }}><BlockHead icon="⛅" title="Öğlen Bloğu" tag="ZOR DERS" time={settings.tOgle} /><SubjPicker slot="subjO" label="DERS" value={r.subjO} onChange={onSubj} />{T(null, "Pomodoro 1", null, 4, "on1")}{T(null, "Pomodoro 2", null, 4, "on2")}{T(null, "Pomodoro 3", null, 4, "on3")}</div>
        <Mola time="14:30–15:00" label="Yemek / Dinlenme" />
        <div style={{ marginBottom: 12 }}><BlockHead icon="🌙" title="Akşam Bloğu" tag="KOLAY DERS & IA" time={settings.tAksam} /><SubjPicker slot="subjE" label="DERS" value={r.subjE} onChange={onSubj} />{T(null, "Pomodoro 1", null, 3, "ev1")}{T(null, "Pomodoro 2", null, 3, "ev2")}</div>
        <div style={{ ...ST.groupLabel, marginBottom: 8 }}>BONUS & EKSTRA</div>
        {T("⚡", "Zamanında Başladım", "Sabah bloğu vaktinde", 2, "ontime", true)}
        {T("✍️", "Günlük / Yansıma", "Vakur · IA notu", 2, "journal")}
        <textarea className="pes-input" value={r.note || ""} onChange={(e) => update({ note: e.target.value, journal: e.target.value.trim() ? true : r.journal })} placeholder="Maç sonu röportajı — bugün ne öğrendin, ne zorladı? (Karne sekmesinde saklanır)" style={{ ...ST.textarea, minHeight: 52, fontFamily: "'Roboto Condensed',sans-serif", fontSize: 13.5, color: C.hi, marginBottom: 8 }} />
        <div style={{ ...ST.taskRow, cursor: "default" }}><span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 16 }}>🔥</span><span><span style={{ display: "block", color: C.hi, fontWeight: 600 }}>Ekstra Pomodoro</span><span style={{ display: "block", color: C.lo, fontSize: 11 }}>planın üstü · her biri +3</span></span></span><span style={{ display: "flex", alignItems: "center", gap: 10 }}><button className="pes-step" style={ST.step} onClick={() => update({ extra: Math.max(0, (r.extra || 0) - 1) })}>−</button><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, color: "#fff", minWidth: 20, textAlign: "center" }}>{r.extra || 0}</span><button className="pes-step" style={ST.step} onClick={() => update({ extra: (r.extra || 0) + 1 })}>+</button></span></div>
        <button className="pes-link" style={ST.link} onClick={() => setShowCard(!showCard)}>{showCard ? "▾ Maç Karnesini gizle" : "▸ Maç Karnesi — OVR nasıl çıktı?"}</button>
        {showCard && <div style={{ marginTop: 8, borderTop: `1px solid ${C.line}`, paddingTop: 8 }}>{breakdown(r).map((it, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 2px", opacity: it.on ? 1 : 0.4 }}><span style={{ color: it.base ? C.mid : C.hi, fontSize: 13 }}>{it.l}</span><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: it.base ? C.mid : it.on ? "#54B84A" : C.lo }}>{it.base ? it.p : `+${it.p}`}</span></div>)}<div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, marginTop: 6, paddingTop: 6 }}><span style={{ color: "#fff", fontWeight: 700 }}>BUGÜNKÜ OVR</span><span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 18, color: abilityColor(ovr).bg }}>{ovr}</span></div></div>}
      </Panel>
    </div>
  );
}

/* ════════════ ABILITY ════════════ */
function AbilityView({ stats: A, ovr, arrow, settings }) {
  const [page, setPage] = useState(0);
  const ability = [["Hücum Sezgisi", A.offaware], ["Top Kontrolü", A.ballcontrol], ["Dripling", A.dribbling], ["Yakın Kontrol", A.tightposs], ["Yerden Pas", A.lowpass], ["Havadan Pas", A.loftpass], ["Bitiricilik", A.finishing], ["Kafa Vuruşu", A.heading], ["Duran Top", A.placekick], ["Falso", A.curl], ["Hız", A.speed], ["İvmelenme", A.accel], ["Şut Gücü", A.kickpower], ["Sıçrama", A.jump], ["Fiziksel Mücadele", A.physical], ["Denge", A.balance], ["Dayanıklılık", A.stamina], ["Defans Sezgisi", A.defaware], ["Top Kapma", A.ballwin], ["Agresiflik", A.aggr], ["GK Sezgisi", 40], ["GK Tutuş", 40], ["GK Çıkış", 40], ["GK Refleks", 40], ["GK Uzanış", 40]];
  const special = [["Zayıf Ayak Kullanımı", A.weakUsage], ["Zayıf Ayak İsabeti", A.weakAcc], ["Form", A.form], ["Sakatlık Direnci", A.injury]];
  const bio = [["Yaş", settings.age], ["Boy", settings.height], ["Kilo", settings.weight], ["Mevki", "CF"], ["Güçlü Ayak", settings.foot], ["Forma No", settings.number]];
  const top = [...ability].filter(([l]) => !l.startsWith("GK")).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const PER = 13, pages = Math.ceil(ability.length / PER), p = clamp(page, 0, pages - 1), slice = ability.slice(p * PER, p * PER + PER), last = p === pages - 1;
  return (
    <div style={ST.abilityWrap}>
      <Panel style={{ flex: "1 1 420px" }}>
        <PanelHead title="Yetenek" right={<><Pill onClick={() => setPage(Math.max(0, p - 1))}>L1</Pill><Pill onClick={() => setPage(Math.min(pages - 1, p + 1))}>R1</Pill><span style={ST.pageNum}>{p + 1}/{pages}</span></>} />
        {slice.map(([l, v]) => <StatRow key={l} label={l} value={v} />)}
        {last && <><div style={ST.divider} />{special.map(([l, v]) => <StatRow key={l} label={l} value={v} special />)}<div style={ST.divider} />{bio.map(([l, v]) => <div key={l} style={{ ...ST.statRow, cursor: "default" }}><span style={{ color: C.hi, fontSize: 14 }}>{l}</span><span style={{ fontFamily: "Oswald,sans-serif", color: "#fff", fontSize: 15 }}>{v}</span></div>)}</>}
      </Panel>
      <KitCard ovr={ovr} arrow={arrow} settings={settings} top={top} />
    </div>
  );
}

/* ════════════ TOPICS (Antrenman Sahası) ════════════ */
function TopicsView({ topics, setTopicsFor, stats, merged, todayKey }) {
  const [sel, setSel] = useState("mat");
  const [txt, setTxt] = useState("");
  const list = topics[sel] || [];
  const solid = list.filter((t) => t.st === "solid").length;
  const pct = list.length ? Math.round((solid / list.length) * 100) : 0;
  const cycle = (id) => { const order = ["todo", "doing", "solid", "weak"]; setTopicsFor(sel, list.map((t) => t.id === id ? { ...t, st: order[(order.indexOf(t.st) + 1) % 4] } : t)); };
  const add = () => { if (!txt.trim()) return; setTopicsFor(sel, [...list, { id: "t" + Date.now(), name: txt.trim(), st: "todo" }]); setTxt(""); };
  const del = (id) => setTopicsFor(sel, list.filter((t) => t.id !== id));
  const statLabel = SUBJECTS[sel].statLabel, statVal = stats[SUBJECTS[sel].stat];
  const stale = staleSubjects(merged, todayKey, 4).slice(0, 4);
  const weakAll = Object.entries(topics).flatMap(([s, l]) => (l || []).filter((t) => t.st === "weak").map((t) => ({ s, name: t.name }))).slice(0, 6);
  return (
    <div style={ST.col}>
      <Panel>
        <PanelHead title="Antrenman Sahası" right={<span style={ST.tag}>müfredat / konu takibi</span>} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
          {Object.entries(SUBJECTS).map(([k, v]) => <button key={k} onClick={() => setSel(k)} className="pes-pill" style={{ ...ST.pill, ...(sel === k ? { background: C.accentDeep, color: "#fff", borderColor: C.accentDeep } : {}) }}>{v.icon} {v.name}</button>)}
        </div>
      </Panel>

      {(stale.length > 0 || weakAll.length > 0) && (
        <Panel style={{ borderColor: C.flat + "44" }}>
          <PanelHead title="Akıllı Tekrar" right={<span style={ST.tag}>kondisyon koruma</span>} />
          {stale.length > 0 && <div style={{ marginBottom: weakAll.length ? 10 : 0 }}><div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>⏳ UZUN SÜREDİR DOKUNMADIN</div><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{stale.map((x) => <button key={x.s} className="pes-pill" onClick={() => setSel(x.s)} style={{ ...ST.pill, color: C.flat, borderColor: C.flat + "55" }}>{SUBJECTS[x.s].icon} {SUBJECTS[x.s].name} · {x.gap === null ? "hiç" : x.gap + "g"}</button>)}</div></div>}
          {weakAll.length > 0 && <div><div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>🎯 ZAYIF KONULAR — SINAV ÖNCESİ ÖNCELİK</div>{weakAll.map((w, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} /><span style={{ color: C.hi, fontSize: 13 }}><b style={{ color: C.lo }}>{SUBJECTS[w.s].name}:</b> {w.name}</span></div>)}</div>}
        </Panel>
      )}

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 20, color: "#fff" }}>{SUBJECTS[sel].icon} {SUBJECTS[sel].name}</div><div style={{ color: C.lo, fontSize: 12 }}>{statLabel} yeteneğini besler</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Badge v={statVal} /><div style={{ textAlign: "right" }}><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, color: pct >= 70 ? "#54B84A" : C.flat }}>{pct}%</div><div style={{ color: C.lo, fontSize: 10 }}>SAĞLAM</div></div></div>
        </div>
        <div style={{ ...ST.barOuter, marginBottom: 14 }}><div style={{ ...ST.barInner, width: `${pct}%` }} /></div>
        {list.length === 0 && <div style={{ color: C.lo, fontSize: 13, padding: "8px 0" }}>Bu ders için henüz konu yok. Aşağıdan ekle — her konu bir drill.</div>}
        {list.map((t) => { const sc = ST_COLOR[t.st]; return (
          <div key={t.id} style={ST.topicRow}>
            <button className="pes-pill" onClick={() => cycle(t.id)} style={{ ...ST.statusDot, background: sc.c + "22", borderColor: sc.c + "88", color: sc.c }}>{sc.l}</button>
            <span style={{ flex: 1, color: C.hi, fontSize: 14 }}>{t.name}</span>
            <button className="pes-x" onClick={() => del(t.id)} style={ST.xBtn}>×</button>
          </div>
        ); })}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input className="pes-input" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Yeni konu / drill ekle…" style={{ ...ST.input, flex: 1 }} />
          <Pill solid onClick={add}>+ Ekle</Pill>
        </div>
        <div style={{ color: C.mid, fontSize: 12, marginTop: 10 }}>Duruma dokunarak değiştir: <b style={{ color: C.lo }}>Öğrenilecek</b> → <b style={{ color: C.flat }}>Çalışılıyor</b> → <b style={{ color: "#54B84A" }}>Sağlam</b> → <b style={{ color: C.red }}>Zayıf</b>. Zayıf konuları sınav öncesi önce çöz.</div>
      </Panel>
    </div>
  );
}

/* ════════════ PROGRAM (Fikstür + Takvim) ════════════ */
function ProgramView({ fixture, setFix, events, addEvent, removeEvent, todayKey, objectives, addObjective, removeObjective, toggleObjective, merged, days }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState(""); const [type, setType] = useState("exam");
  const [oText, setOText] = useState(""); const [oType, setOType] = useState("ovr"); const [oTarget, setOTarget] = useState("90");
  const oCtx = { best: bestOVRAll(merged), maxStreak: maxStreakAll(merged), totalPom: totalPomosAll(merged) };
  const addObj = () => { if (!oText.trim()) return; addObjective({ id: "o" + Date.now(), text: oText.trim(), type: oType, target: Number(oTarget) || 0, done: false }); setOText(""); };
  const wdNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const up = upcomingEvents(events, todayKey);
  const Sel = ({ wd, slot }) => <select className="pes-select" value={(fixture[wd] || {})[slot] || "mat"} onChange={(e) => setFix(wd, slot, e.target.value)} style={{ ...ST.select, maxWidth: 120, fontSize: 12 }}>{Object.entries(SUBJECTS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select>;
  const submit = () => { if (!title.trim() || !date) return; addEvent({ id: "e" + Date.now(), title: title.trim(), date, type }); setTitle(""); setDate(""); };
  return (
    <div style={ST.col}>
      <Panel>
        <PanelHead title="Haftalık Fikstür" right={<span style={ST.tag}>blok ↔ ders eşlemesi</span>} />
        <div style={{ color: C.mid, fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>Her gün hangi dersi hangi bloğa koyacağını burada belirle. "Bugün" ekranı o günün fikstürünü otomatik yükler.</div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 380 }}>
            <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 1fr", gap: 6, marginBottom: 6, color: C.lo, fontSize: 11, fontWeight: 700 }}><span></span><span>☀️ Sabah</span><span>⛅ Öğlen</span><span>🌙 Akşam</span></div>
            {wdNames.map((nm, wd) => (
              <div key={wd} style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr 1fr", gap: 6, marginBottom: 6, alignItems: "center", padding: "4px 0", background: wd === weekday(todayKey) ? "rgba(177,79,216,0.10)" : "transparent", borderRadius: 6 }}>
                <span style={{ color: wd === weekday(todayKey) ? C.accent : C.hi, fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 13, paddingLeft: 4 }}>{nm}</span>
                <Sel wd={wd} slot="S" /><Sel wd={wd} slot="O" /><Sel wd={wd} slot="E" />
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Sezon Takvimi" right={<span style={ST.tag}>sınav · IA · EE geri sayım</span>} />
        {up.length === 0 && <div style={{ color: C.lo, fontSize: 13, padding: "6px 0" }}>Yaklaşan bir şey yok. Aşağıdan sınav/IA/EE tarihi ekle.</div>}
        {up.map((e) => (
          <div key={e.id} style={ST.clubRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>{EV_ICON[e.type]}</span><div><div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{e.title}</div><div style={{ color: C.lo, fontSize: 11 }}>{EV_LABEL[e.type]} · {labelDM(e.date)}.{parseYMD(e.date).getFullYear()}</div></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 18, color: e.left <= 14 ? C.red : e.left <= 60 ? C.flat : "#54B84A" }}>{e.left === 0 ? "BUGÜN" : `${e.left}g`}</span><button className="pes-x" onClick={() => removeEvent(e.id)} style={ST.xBtn}>×</button></div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 140px" }}><span style={{ color: C.lo, fontSize: 11 }}>BAŞLIK</span><input className="pes-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="örn. Math IA teslim" style={ST.input} /></label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ color: C.lo, fontSize: 11 }}>TARİH</span><input className="pes-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={ST.input} /></label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ color: C.lo, fontSize: 11 }}>TÜR</span><select className="pes-select" value={type} onChange={(e) => setType(e.target.value)} style={ST.select}>{Object.entries(EV_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <Pill solid onClick={submit}>+ Ekle</Pill>
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Sezon Hedefleri" right={<span style={ST.tag}>{objectives.filter((o) => objProgress(o, oCtx) >= 1).length}/{objectives.length} tamam</span>} />
        {objectives.length === 0 && <div style={{ color: C.lo, fontSize: 13, padding: "6px 0" }}>Henüz hedef yok. Sezonun için bir kupa belirle.</div>}
        {objectives.map((o) => { const pr = objProgress(o, oCtx); const done = pr >= 1; const manual = o.type === "custom"; return (
          <div key={o.id} style={{ padding: "9px 2px", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {manual ? <button className="pes-step" onClick={() => toggleObjective(o.id)} style={{ ...ST.check, background: o.done ? "#54B84A" : "transparent", borderColor: o.done ? "#54B84A" : C.lineHard, color: o.done ? "#0a2a10" : "transparent", cursor: "pointer" }}>✓</button> : <span style={{ fontSize: 18 }}>{done ? "🏆" : "🎯"}</span>}
              <span style={{ flex: 1, color: done ? "#54B84A" : C.hi, fontSize: 14, fontWeight: 600 }}>{o.text}</span>
              {!manual && <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: done ? "#54B84A" : C.mid }}>{Math.round(pr * 100)}%</span>}
              <button className="pes-x" onClick={() => removeObjective(o.id)} style={ST.xBtn}>×</button>
            </div>
            {!manual && <div style={{ ...ST.barOuter, marginTop: 6, height: 8 }}><div style={{ ...ST.barInner, width: `${Math.round(pr * 100)}%` }} /></div>}
          </div>
        ); })}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 130px" }}><span style={{ color: C.lo, fontSize: 11 }}>HEDEF</span><input className="pes-input" value={oText} onChange={(e) => setOText(e.target.value)} placeholder="örn. OVR 95'e ulaş" style={ST.input} /></label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ color: C.lo, fontSize: 11 }}>TÜR</span><select className="pes-select" value={oType} onChange={(e) => setOType(e.target.value)} style={ST.select}>{Object.entries(OBJ_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          {oType !== "custom" && <label style={{ display: "flex", flexDirection: "column", gap: 4, width: 90 }}><span style={{ color: C.lo, fontSize: 11 }}>SAYI</span><input className="pes-input" type="number" value={oTarget} onChange={(e) => setOTarget(e.target.value)} style={ST.input} /></label>}
          <Pill solid onClick={addObj}>+ Ekle</Pill>
        </div>
        <div style={{ color: C.mid, fontSize: 12, marginTop: 10 }}>OVR / Seri / Toplam pomodoro hedefleri otomatik ilerler. "Serbest görev" elle işaretlenir.</div>
      </Panel>
    </div>
  );
}

/* ════════════ KARNE (Hedef · IB Notları · Denemeler) ════════════ */
function gradeColor(v) { v = Number(v) || 0; if (v >= 7) return "#46C657"; if (v >= 6) return "#54B84A"; if (v >= 5) return "#BCC83E"; if (v >= 4) return "#E8C13E"; if (v >= 3) return "#E5893C"; return C.red; }
function KarneView({ academics: a, setUni, setGrade, setCore, addPaper, removePaper, events, todayKey, merged, days }) {
  const [pSubj, setPSubj] = useState("mat"); const [pLabel, setPLabel] = useState(""); const [pScore, setPScore] = useState(""); const [pDate, setPDate] = useState(todayKey);
  const pred = ibPred(a), tgt = ibTgt(a), dream = Number(a.uni.ibTarget) || 45;
  const exL = examLeft(events, todayKey);
  const notes = recentNotes(merged, days, todayKey, 5);
  const subjPapers = a.papers.filter((p) => p.subj === pSubj).sort((x, y) => (y.date || "").localeCompare(x.date || ""));
  const trend = [...subjPapers].reverse().map((p, i) => ({ d: p.label || `#${i + 1}`, v: Number(p.score) || 0 }));
  const addP = () => { if (pScore === "") return; addPaper({ id: "p" + Date.now(), subj: pSubj, label: pLabel.trim() || "Deneme", score: clamp(Number(pScore) || 0, 0, 100), date: pDate || todayKey }); setPLabel(""); setPScore(""); };
  return (
    <div style={ST.col}>
      <Panel style={{ background: "linear-gradient(160deg, rgba(56,24,92,0.62), rgba(20,11,38,0.5))" }}>
        <PanelHead title="Hayalindeki Kulüp" right={<span style={ST.tag}>kariyerin zirvesi</span>} />
        {a.uni.name ? (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(180deg,#E8C13E,#B8860B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🎓</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "Oswald,sans-serif", fontSize: 24, color: "#fff", lineHeight: 1.1 }}>{a.uni.name}</div>
              {a.uni.country && <div style={{ color: C.mid, fontSize: 13 }}>{a.uni.country}</div>}
              {a.uni.reason && <div style={{ color: C.lo, fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{a.uni.reason}"</div>}
            </div>
            <div style={{ textAlign: "right" }}>{exL != null && <><div style={{ color: C.lo, fontSize: 10, letterSpacing: 1 }}>IB SINAVINA</div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 30, color: exL <= 60 ? C.red : C.gold }}>{exL}g</div></>}</div>
          </div>
        ) : (
          <div style={{ color: C.mid, fontSize: 13, lineHeight: 1.6 }}>Hayalindeki üniversiteyi yaz — her maçın, her idmanın bir anlam kazansın. Bu senin "rüya transferin".</div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <Field2 label="ÜNİVERSİTE" val={a.uni.name} on={(v) => setUni({ name: v })} w="200px" ph="örn. Boğaziçi / LSE / Sciences Po" />
          <Field2 label="ÜLKE / ŞEHİR" val={a.uni.country} on={(v) => setUni({ country: v })} w="150px" />
          <Field2 label="IB HEDEF (/45)" val={String(a.uni.ibTarget)} on={(v) => setUni({ ibTarget: v })} w="110px" type="number" />
          <Field2 label="NEDEN ORASI?" val={a.uni.reason} on={(v) => setUni({ reason: v })} w="100%" ph="seni oraya çeken şey" />
        </div>
      </Panel>

      <Panel>
        <PanelHead title="IB Karnesi" right={<span style={{ ...ST.tag, color: pred >= dream ? "#54B84A" : C.gold }}>{pred}/45 · hedef {dream}</span>} />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
          <div><div style={{ color: C.lo, fontSize: 10, letterSpacing: 2 }}>ŞU ANKİ TAHMİNİ</div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 46, color: gradeColor(pred / 6.43), lineHeight: 1 }}>{pred}<span style={{ fontSize: 20, color: C.lo }}>/45</span></div></div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: C.mid, fontSize: 12, marginBottom: 4 }}><span>Hedef: {dream}/45</span><span style={{ color: pred >= dream ? "#54B84A" : C.flat }}>{pred >= dream ? "✓ hedefte" : `${dream - pred} puan açık`}</span></div>
            <div style={{ ...ST.barOuter, height: 12 }}><div style={{ ...ST.barInner, width: `${clamp((pred / 45) * 100, 2, 100)}%` }} /><div style={{ ...ST.barMark, left: `${(dream / 45) * 100}%`, top: -4, height: 20 }} /></div>
          </div>
        </div>
        <div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, margin: "12px 0 6px" }}>DERSLER — TAHMİNİ → HEDEF (1–7)</div>
        {a.grades.map((g) => (
          <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 2px", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ flex: 1, color: C.hi, fontSize: 14 }}>{g.name} <span style={{ color: C.lo, fontSize: 11 }}>{g.lvl}</span></span>
            <Stepper val={g.pred} on={(v) => setGrade(g.id, "pred", v)} color={gradeColor(g.pred)} />
            <span style={{ color: C.lo }}>→</span>
            <Stepper val={g.target} on={(v) => setGrade(g.id, "target", v)} color={C.lo} small />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px" }}>
          <span style={{ flex: 1, color: C.hi, fontSize: 14 }}>TOK + EE <span style={{ color: C.lo, fontSize: 11 }}>bonus 0–3</span></span>
          <Stepper val={a.core.pred} on={(v) => setCore("pred", v)} color={C.teal} max={3} />
          <span style={{ color: C.lo }}>→</span>
          <Stepper val={a.core.target} on={(v) => setCore("target", v)} color={C.lo} max={3} small />
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Deneme Maçları" right={<span style={ST.tag}>past paper takibi</span>} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {a.grades.map((g) => { const av = paperAvg(a.papers, g.id); return <button key={g.id} onClick={() => setPSubj(g.id)} className="pes-pill" style={{ ...ST.pill, ...(pSubj === g.id ? { background: C.accentDeep, color: "#fff", borderColor: C.accentDeep } : {}) }}>{g.name}{av != null ? ` %${av}` : ""}</button>; })}
        </div>
        {trend.length >= 2 && <div style={{ width: "100%", height: 150, marginBottom: 8 }}><ResponsiveContainer><LineChart data={trend} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}><CartesianGrid stroke={C.line} vertical={false} /><XAxis dataKey="d" tick={{ fill: C.lo, fontSize: 10 }} stroke={C.line} /><YAxis domain={[0, 100]} tick={{ fill: C.lo, fontSize: 10 }} stroke={C.line} /><Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.lineHard}`, borderRadius: 8 }} formatter={(v) => [`%${v}`, "Skor"]} /><Line type="monotone" dataKey="v" stroke={C.teal} strokeWidth={2.5} dot={{ r: 3, fill: C.teal }} /></LineChart></ResponsiveContainer></div>}
        {subjPapers.length === 0 ? <div style={{ color: C.lo, fontSize: 13, padding: "4px 0" }}>Bu ders için deneme yok. Çözdüğün past paper'ı aşağıdan ekle.</div> : subjPapers.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 2px", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ width: 48, fontFamily: "Oswald,sans-serif", fontSize: 18, color: gradeColor((Number(p.score) || 0) / 14.3) }}>%{p.score}</span>
            <span style={{ flex: 1, color: C.hi, fontSize: 14 }}>{p.label}</span>
            <span style={{ color: C.lo, fontSize: 11 }}>{labelDM(p.date)}</span>
            <button className="pes-x" onClick={() => removePaper(p.id)} style={ST.xBtn}>×</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Field2 label="ETİKET" val={pLabel} on={setPLabel} w="120px" ph="örn. Paper 1 / 2023 N" />
          <label style={{ display: "flex", flexDirection: "column", gap: 4, width: 90 }}><span style={{ color: C.lo, fontSize: 11 }}>SKOR %</span><input className="pes-input" type="number" value={pScore} onChange={(e) => setPScore(e.target.value)} style={ST.input} /></label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ color: C.lo, fontSize: 11 }}>TARİH</span><input className="pes-input" type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} style={ST.input} /></label>
          <Pill solid onClick={addP}>+ Ekle</Pill>
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Röportaj Defteri" right={<span style={ST.tag}>maç sonu yansımaları</span>} />
        {notes.length === 0 ? <div style={{ color: C.lo, fontSize: 13, padding: "4px 0" }}>Henüz röportaj yok. "Bugün" ekranında günün sonunda kısa bir yansıma yaz — ileride okumak altın değerinde.</div> : notes.map((x) => (
          <div key={x.k} style={{ padding: "8px 2px", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ color: C.accent, fontSize: 11, fontFamily: "Oswald,sans-serif", letterSpacing: 1 }}>{parseYMD(x.k).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</div>
            <div style={{ color: C.hi, fontSize: 13.5, lineHeight: 1.5, marginTop: 2 }}>{x.note}</div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
function Field2({ label, val, on, w, ph, type }) { return <label style={{ display: "flex", flexDirection: "column", gap: 4, width: w || "auto" }}><span style={{ color: C.lo, fontSize: 11, letterSpacing: 1 }}>{label}</span><input className="pes-input" type={type || "text"} value={val} onChange={(e) => on(e.target.value)} placeholder={ph || ""} style={ST.input} /></label>; }
function Stepper({ val, on, color, max = 7, small }) { const v = Number(val) || 0; return <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><button className="pes-step" onClick={() => on(clamp(v - 1, 0, max))} style={{ ...ST.step, width: 26, height: 26, fontSize: 15 }}>−</button><span style={{ fontFamily: "Oswald,sans-serif", fontSize: small ? 16 : 20, color, minWidth: 18, textAlign: "center" }}>{v}</span><button className="pes-step" onClick={() => on(clamp(v + 1, 0, max))} style={{ ...ST.step, width: 26, height: 26, fontSize: 15 }}>+</button></span>; }

/* ════════════ COACH (AI Teknik Direktör) ════════════ */
function CoachView(props) {
  const [mode, setMode] = useState("match");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const run = async (md) => {
    setMode(md); setLoading(true); setErr(false); setText("");
    try { const ctx = coachContext(props); const out = await callCoach(md, ctx); setText(out || "Hoca şu an konuşamadı, tekrar dene."); }
    catch (e) { console.error(e); setErr(true); }
    setLoading(false);
  };
  return (
    <div style={ST.col}>
      <Panel style={{ background: "linear-gradient(160deg, rgba(48,22,80,0.6), rgba(20,11,38,0.5))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(180deg,#B14FD8,#7A2E9E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🧑‍🏫</div>
          <div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, color: "#fff" }}>Teknik Direktör</div><div style={{ color: C.mid, fontSize: 13 }}>Verilerine bakar, sana özel konuşur. Bir mod seç.</div></div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {Object.entries(COACH_MODES).map(([k, m]) => <button key={k} className="pes-pill" onClick={() => run(k)} disabled={loading} style={{ ...ST.pill, padding: "8px 12px", ...(mode === k ? { background: C.accentDeep, color: "#fff", borderColor: C.accentDeep } : {}), opacity: loading && mode !== k ? 0.5 : 1 }}>{m.icon} {m.label}</button>)}
        </div>
      </Panel>
      <Panel>
        <PanelHead title={COACH_MODES[mode].label} right={<span style={ST.tag}>{COACH_MODES[mode].icon} canlı</span>} />
        {loading && <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.mid, padding: "20px 0" }}><span className="pes-spin" style={{ width: 18, height: 18, border: `2px solid ${C.line}`, borderTopColor: C.accent, borderRadius: "50%" }} /> Hoca taktik tahtasında…</div>}
        {err && <div style={{ color: C.red, fontSize: 13, lineHeight: 1.5, padding: "10px 0" }}>Hoca'ya ulaşılamadı. Bu özellik canlı bir AI bağlantısı gerektirir; birkaç saniye sonra tekrar dene. Bağlantı yoksa diğer sekmeler normal çalışır.</div>}
        {!loading && !err && text && <div style={{ color: C.hi, fontSize: 14.5, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{text}</div>}
        {!loading && !err && !text && <div style={{ color: C.lo, fontSize: 13, padding: "16px 0", lineHeight: 1.5 }}>Yukarıdan bir mod seç — hoca bugünkü OVR'ına, serine, zayıf yeteneklerine ve yaklaşan sınavına göre konuşsun.</div>}
        {!loading && text && <div style={{ marginTop: 14 }}><Pill solid onClick={() => run(mode)}>↻ Yeniden konuş</Pill></div>}
      </Panel>
    </div>
  );
}

/* ════════════ TRANSFER ════════════ */
function TransferView({ merged, todayKey, ovr }) {
  const val = marketM(ovr); const past = dayBack(todayKey, 7); const ovrPast = computeOVR(merged[past] || DEFAULT_REC());
  const dVal = val - marketM(ovrPast); const clubs = interestedClubs(ovr); const club = currentClub(ovr);
  return (
    <div style={ST.col}>
      <Panel style={{ background: "linear-gradient(160deg, rgba(60,26,96,0.55), rgba(26,12,44,0.45))" }}>
        <PanelHead title="Piyasa Değeri" right={<span style={ST.tag}>OVR {ovr}</span>} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}><span style={{ fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 52, color: C.gold, textShadow: `0 0 20px ${C.gold}44` }}>{fmtVal(val)}</span><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 15, color: dVal > 0 ? "#54B84A" : dVal < 0 ? C.red : C.lo }}>{dVal > 0 ? "▲" : dVal < 0 ? "▼" : ""} {dVal !== 0 ? fmtVal(Math.abs(dVal)) : "sabit"} <span style={{ color: C.lo, fontSize: 12 }}>· son 7 gün</span></span></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}><span style={ST.infoChip}>🏟️ Kulüp: <b style={{ color: "#fff" }}>{club}</b></span><span style={ST.infoChip}>📊 Seviye: <b style={{ color: "#fff" }}>{peer(ovr)}</b></span><span style={ST.infoChip}>📈 Potansiyel: <b style={{ color: "#54B84A" }}>↑ yüksek (16 yaş)</b></span></div>
      </Panel>
      <Panel>
        <PanelHead title="İlgilenen Takımlar" right={<span style={ST.tag}>OVR'ye göre</span>} />
        {clubs.length === 0 ? <div style={{ color: C.lo, fontSize: 13, padding: "16px 0", textAlign: "center" }}>Henüz vitrin yok. Birkaç günü tamamla, scout'lar tribüne gelsin.</div> : clubs.map((c) => (
          <div key={c.n} style={ST.clubRow}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={ST.clubBadge}>{c.n.slice(0, 2).toUpperCase()}</span><div><div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{c.n}</div><div style={{ color: C.lo, fontSize: 11 }}>kadro seviyesi ~{c.t}</div></div></div><span style={{ fontSize: 11, fontWeight: 700, color: c.col, border: `1px solid ${c.col}66`, borderRadius: 6, padding: "3px 9px" }}>{c.level}</span></div>
        ))}
        <div style={{ color: C.mid, fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>OVR yükseldikçe büyük kulüpler tribüne gelir. <b style={{ color: C.gold }}>Resmi teklif</b> = seni rahat alır; <b style={{ color: C.flat }}>Ciddi ilgi</b> = pazarlık; <b style={{ color: C.lo }}>Scout takipte</b> = yeni göz koydu.</div>
      </Panel>
    </div>
  );
}

/* ════════════ STYLE ════════════ */
function StyleView({ stats: A, merged, todayKey, settings }) {
  const streak = streakCount(merged, todayKey);
  const skills = [{ n: "Bitiricilik", d: "Matematik bloğunu son 5 günde 3+ kez bitirdi", got: mathDays(merged, todayKey, 5) >= 3, icon: "🎯" }, { n: "Süratli Başlangıç", d: "7 gün üst üste zamanında başladı", got: ontimeStreak(merged, todayKey) >= 7, icon: "⚡" }, { n: "Çelik İrade", d: "10 günlük kesintisiz seri", got: maxStreakAll(merged) >= 10, icon: "🛡️" }, { n: "Gece Şairi", d: "Günlüğü son 10 günde 5 kez tuttu", got: fieldDays(merged, todayKey, "journal", 10) >= 5, icon: "✍️" }, { n: "Maraton Adam", d: "Bir günde 8+ pomodoro", got: maxPomoDayAll(merged) >= 8, icon: "🔥" }, { n: "İki Ayaklı", d: "Akşam bloğu 4 seviyeye ulaştı", got: A.weakUsage >= 4, icon: "🦶" }];
  const com = [{ n: "Hedef Adam", e: "Post Player", active: true, d: "Hücumun kalbinde topu tutar, oyunu içine çeker. İri santrforun kimliği." }, { n: "Golcü İçgüdüsü", e: "Goal Poacher", active: A.finishing >= 85, d: "Doğru anı bekler, tek dokunuşla bitirir. Bitiricilik 85+ olunca aktif." }, { n: "Geriye Düşen Forvet", e: "Deep-Lying Forward", active: A.offaware >= 80, d: "Önce derine inip kurar, sonra dalar. Dışarıdan target man, içeride playmaker." }];
  const technical = (A.ballcontrol + A.dribbling + A.finishing + A.loftpass) / 4;
  const pers = [streak >= 7 ? "Soğukkanlı" : "Tutkulu", "Yalnız Kurt", technical >= A.physical ? "Teknik" : "Fiziksel", "İçgüdü"];
  return (
    <div style={ST.col}>
      <Panel>
        <PanelHead title="Kayıtlı Pozisyon & Stil" />
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}><div style={{ textAlign: "center" }}><span style={{ ...ST.posPill, fontSize: 16, padding: "6px 16px" }}>CF</span><div style={{ color: C.lo, fontSize: 11, marginTop: 6 }}>Forma No {settings.number}</div></div><div style={{ flex: 1, minWidth: 200 }}><div style={{ color: "#fff", fontFamily: "Oswald,sans-serif", fontSize: 18, fontWeight: 600 }}>Hedef Adam · Geriye Düşen Forvet</div><div style={{ color: C.mid, fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>Vücut tipin gereği target man; oyun yapın playmaker-bitirici. Dışarının gördüğü heybetle içerideki analitik kafanın farkı.</div></div></div>
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>{pers.map((p) => <span key={p} style={ST.persChip}>{p}</span>)}</div>
      </Panel>
      <Panel>
        <PanelHead title="COM Oyun Stilleri" right={<span style={ST.tag}>davranış</span>} />
        {com.map((s) => <div key={s.n} style={{ ...ST.statRow, alignItems: "flex-start", flexDirection: "column", gap: 4, opacity: s.active ? 1 : 0.5 }}><div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}><span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{s.n} <span style={{ color: C.lo, fontSize: 11 }}>· {s.e}</span></span><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: s.active ? "#54B84A" : C.lo }}>{s.active ? "AKTİF" : "PASİF"}</span></div><span style={{ color: C.mid, fontSize: 12, lineHeight: 1.4 }}>{s.d}</span></div>)}
      </Panel>
      <Panel>
        <PanelHead title="Oyuncu Yetenekleri" right={<span style={ST.tag}>{skills.filter((s) => s.got).length}/{skills.length} açık</span>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>{skills.map((s) => <div key={s.n} style={{ ...ST.skillCard, opacity: s.got ? 1 : 0.45, borderColor: s.got ? C.teal + "66" : C.line, background: s.got ? "rgba(78,212,194,0.08)" : "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 20 }}>{s.got ? s.icon : "🔒"}</div><div style={{ color: s.got ? "#fff" : C.mid, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{s.n}</div><div style={{ color: C.lo, fontSize: 11, marginTop: 2, lineHeight: 1.35 }}>{s.d}</div></div>)}</div>
      </Panel>
    </div>
  );
}

/* ════════════ CAREER ════════════ */
function Heatmap({ merged, todayKey }) {
  const today = parseYMD(todayKey); const dow = weekday(todayKey); const start = new Date(today); start.setDate(today.getDate() - dow - 7 * 5);
  const weeks = [];
  for (let w = 0; w < 6; w++) { const col = []; for (let d = 0; d < 7; d++) { const day = new Date(start); day.setDate(start.getDate() + w * 7 + d); const k = ymd(day); const future = day > today; const r = merged[k]; col.push({ k, n: r ? schedDone(r) : 0, future }); } weeks.push(col); }
  const cc = (n, f) => { if (f) return "transparent"; if (n === 0) return "rgba(255,255,255,0.06)"; if (n <= 2) return "#356b46"; if (n <= 4) return "#479e57"; if (n <= 6) return "#54B84A"; return "#46C657"; };
  const dl = ["P", "S", "Ç", "P", "C", "C", "P"];
  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: 2 }}>{dl.map((d, i) => <div key={i} style={{ height: 16, fontSize: 9, color: C.lo, display: "flex", alignItems: "center" }}>{d}</div>)}</div>
        {weeks.map((col, wi) => <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>{col.map((c, di) => <div key={di} title={c.future ? "" : `${labelDM(c.k)} · ${c.n} pomodoro`} style={{ width: 16, height: 16, borderRadius: 4, background: cc(c.n, c.future), border: c.k === todayKey ? `1px solid ${C.accent}` : "none" }} />)}</div>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: C.lo, fontSize: 10 }}>az<span style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} /><span style={{ width: 12, height: 12, borderRadius: 3, background: "#356b46" }} /><span style={{ width: 12, height: 12, borderRadius: 3, background: "#479e57" }} /><span style={{ width: 12, height: 12, borderRadius: 3, background: "#54B84A" }} /><span style={{ width: 12, height: 12, borderRadius: 3, background: "#46C657" }} />çok</div>
    </div>
  );
}
function CareerView({ merged, days, todayKey, stats, settings }) {
  const keys = Object.keys(merged).filter((k) => days[k] || k === todayKey).sort();
  const data = keys.map((k) => ({ d: labelDM(k), ovr: computeOVR(merged[k]) }));
  const ovrs = data.map((x) => x.ovr), best = bestOVRAll(merged), last7 = ovrs.slice(-7);
  const avg7 = last7.length ? Math.round(last7.reduce((a, b) => a + b, 0) / last7.length) : 0;
  const streak = streakCount(merged, todayKey), totalPom = totalPomosAll(merged), maxStreak = maxStreakAll(merged);
  let weekPom = 0; const dow = weekday(todayKey); for (let i = 0; i <= dow; i++) { const r = merged[dayBack(todayKey, i)]; if (r) weekPom += totalPomos(r); }
  const reward = weekPom >= 42 ? "🍿 Büyük ödül açıldı" : weekPom >= 30 ? "🎧 Küçük ödül açıldı" : `🎧 ${Math.max(0, 30 - weekPom)} pomodoro → küçük ödül`;
  const lg = leagueInfo(merged, todayKey);
  const hist = matchHistory(merged, days, todayKey);
  const rivalTarget = lg.next ? lg.next.min : lg.cur.min + 8;
  const counts = subjCounts(merged); const cmax = Math.max(1, ...Object.values(counts));
  const cEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const radar = [["Bitiricilik", "finishing"], ["Hücum Sezgisi", "offaware"], ["Top Kont.", "ballcontrol"], ["Dripling", "dribbling"], ["Y.Pas", "lowpass"], ["H.Pas", "loftpass"], ["Yakın K.", "tightposs"], ["Denge", "balance"]].map(([k, id]) => ({ k, v: stats[id] }));
  const past = dayBack(todayKey, 7), before = statsAt(merged, past);
  const devLabels = { finishing: "Bitiricilik", offaware: "Hücum Sezgisi", dribbling: "Dripling", ballcontrol: "Top Kontrolü", lowpass: "Yerden Pas", kickpower: "Şut Gücü", stamina: "Dayanıklılık", accel: "İvmelenme" };
  const dev = Object.keys(devLabels).map((id) => ({ id, label: devLabels[id], v: stats[id], d: stats[id] - before[id] })).sort((a, b) => b.d - a.d).slice(0, 6);
  const trophies = [{ n: "İlk Adım", d: "Bir günü tamamla", got: totalPom > 0, icon: "👟" }, { n: "Forma Buldu", d: "OVR 90", got: best >= 90, icon: "📈" }, { n: "Dünya Klasması", d: "OVR 99", got: best >= 99, icon: "🌍" }, { n: "Süper Seri", d: "7 gün", got: maxStreak >= 7, icon: "🔥" }, { n: "Demir Adam", d: "30 gün", got: maxStreak >= 30, icon: "🛡️" }, { n: "Yüz Pomodoro", d: "Toplam 100", got: totalPom >= 100, icon: "💯" }];
  const hrs = studyHours(merged, settings.focusMin); const lvl = careerLevel(totalPom);
  return (
    <div style={ST.col}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(104px,1fr))", gap: 10 }}><Stat label="EN YÜKSEK OVR" value={best || "—"} color={best ? abilityColor(best).bg : C.mid} /><Stat label="ORTALAMA (7g)" value={avg7 || "—"} color={avg7 ? abilityColor(avg7).bg : C.mid} /><Stat label="SERİ" value={`${streak}g`} color={streak >= 3 ? "#54B84A" : C.hi} /><Stat label="TOPLAM POM." value={totalPom} color={C.teal} /><Stat label="SAHADA SÜRE" value={`${hrs}s`} color={C.gold} /><Stat label="KARİYER SV." value={lvl.lvl} color={C.accent} /></div>

      <Panel>
        <PanelHead title="Lig & Rakip" right={<span style={ST.tag}>4 haftalık ort.</span>} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div><div style={{ color: C.lo, fontSize: 11, letterSpacing: 1 }}>MEVCUT LİG</div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 24, color: "#fff" }}>🏆 {lg.cur.n}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ color: C.lo, fontSize: 11 }}>haftalık ort.</div><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 24, color: C.teal }}>{lg.avg} pom</div></div>
        </div>
        {lg.next && <div style={{ marginTop: 12 }}><div style={{ display: "flex", justifyContent: "space-between", color: C.mid, fontSize: 12, marginBottom: 4 }}><span>{lg.cur.n}</span><span>{lg.next.n} ({lg.next.min}+)</span></div><div style={ST.barOuter}><div style={{ ...ST.barInner, width: `${clamp(((lg.avg - lg.cur.min) / (lg.next.min - lg.cur.min)) * 100, 2, 100)}%` }} /></div><div style={{ color: C.mid, fontSize: 12, marginTop: 8 }}>⬆️ Terfi için haftalık <b style={{ color: "#54B84A" }}>{lg.toNext} pomodoro</b> daha. {lg.relRisk && <span style={{ color: C.red }}> ⚠️ Düşme hattındasın — tempoyu düşürme!</span>}</div></div>}
        <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.line}`, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ color: "#fff", fontWeight: 600 }}>🤖 Rakip: Yıldırım B.</div><div style={{ color: C.lo, fontSize: 12 }}>hedef {rivalTarget} pom/hafta</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontFamily: "Oswald,sans-serif", fontSize: 18, color: weekPom >= rivalTarget ? "#54B84A" : C.flat }}>{weekPom} / {rivalTarget}</div><div style={{ color: weekPom >= rivalTarget ? "#54B84A" : C.lo, fontSize: 11 }}>{weekPom >= rivalTarget ? "öndesin 💪" : `${rivalTarget - weekPom} geride`}</div></div>
        </div>
      </Panel>

      <Panel><PanelHead title="İstikrar Takvimi" right={<span style={ST.tag}>son 6 hafta</span>} /><Heatmap merged={merged} todayKey={todayKey} /></Panel>

      <Panel>
        <PanelHead title="Maç Geçmişi" right={<span style={ST.tag}>son maçlar</span>} />
        {hist.length === 0 ? <div style={{ color: C.lo, fontSize: 13, padding: "10px 0", textAlign: "center" }}>Henüz maç yok. İlk gününü tamamla.</div> : hist.map((mch) => { const rc = mch.res === "G" ? "#54B84A" : mch.res === "B" ? C.flat : C.red; const rl = mch.res === "G" ? "G" : mch.res === "B" ? "B" : "M"; const total = 8 + mch.extra; return (
          <div key={mch.k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 2px", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: rc + "22", border: `1px solid ${rc}88`, color: rc, fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{rl}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 14, fontFamily: "Oswald,sans-serif", fontWeight: 600 }}>ŞİMŞEK {mch.g}{mch.extra ? `+${mch.extra}` : ""} <span style={{ color: C.lo, fontWeight: 400 }}>—</span> {total} Hedef</div>
              <div style={{ color: C.lo, fontSize: 11 }}>{labelDM(mch.k)}{mch.motm ? ` · ⭐ ${subjName(mch.motm)}` : ""}</div>
            </div>
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, color: C.mid, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.line}`, borderRadius: 6, padding: "3px 8px" }}>{mch.rating.toFixed(1)}</span>
          </div>
        ); })}
        <div style={{ color: C.mid, fontSize: 12, marginTop: 10 }}><b style={{ color: "#54B84A" }}>G</b> galibiyet (8/8) · <b style={{ color: C.flat }}>B</b> beraberlik (5–7) · <b style={{ color: C.red }}>M</b> mağlubiyet (&lt;5) · ⭐ maçın adamı (en çok çalıştığın ders)</div>
      </Panel>

      <Panel>
        <PanelHead title="Ders Dengesi" right={<span style={ST.tag}>radar</span>} />
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer><RadarChart data={radar} outerRadius="72%"><PolarGrid stroke={C.line} /><PolarAngleAxis dataKey="k" tick={{ fill: C.mid, fontSize: 10 }} /><PolarRadiusAxis domain={[40, 100]} tick={{ fill: C.lo, fontSize: 9 }} axisLine={false} /><Radar dataKey="v" stroke={C.accent} fill={C.accent} fillOpacity={0.35} /></RadarChart></ResponsiveContainer>
        </div>
        {cEntries.length > 0 && <div style={{ marginTop: 6 }}><div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>POMODORO DAĞILIMI</div>{cEntries.map(([s, n]) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ width: 92, color: C.mid, fontSize: 12 }}>{SUBJECTS[s]?.icon} {subjName(s)}</span><div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}><div style={{ width: `${(n / cmax) * 100}%`, height: "100%", background: "linear-gradient(90deg,#B14FD8,#4ED4C2)" }} /></div><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: "#fff", width: 24, textAlign: "right" }}>{n}</span></div>)}</div>}
      </Panel>

      <Panel>
        <PanelHead title="Gelişim Grafiği" right={<span style={ST.tag}>OVR · zaman</span>} />
        {data.length < 2 ? <div style={{ color: C.lo, padding: "30px 0", textAlign: "center", fontSize: 13 }}>Grafik için en az 2 günlük veri gerekiyor.</div> : <div style={{ width: "100%", height: 220 }}><ResponsiveContainer><LineChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}><CartesianGrid stroke={C.line} vertical={false} /><XAxis dataKey="d" tick={{ fill: C.lo, fontSize: 11 }} stroke={C.line} /><YAxis domain={[55, 110]} tick={{ fill: C.lo, fontSize: 11 }} stroke={C.line} /><Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.lineHard}`, borderRadius: 8, color: "#fff" }} labelStyle={{ color: C.mid }} formatter={(v) => [v, "OVR"]} /><ReferenceLine y={99} stroke="#54B84A" strokeDasharray="4 4" /><ReferenceLine y={60} stroke={C.line} strokeDasharray="3 3" /><Line type="monotone" dataKey="ovr" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div>}
      </Panel>

      <Panel>
        <PanelHead title="Gelişim Sayfası" right={<span style={ST.tag}>son 7 gün ▲▼</span>} />
        {dev.map((row) => <div key={row.id} style={ST.statRow}><span style={{ color: C.hi, fontSize: 14 }}>{row.label}</span><span style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, color: row.d > 0 ? "#54B84A" : row.d < 0 ? C.red : C.lo, minWidth: 34, textAlign: "right" }}>{row.d > 0 ? `▲ +${row.d}` : row.d < 0 ? `▼ ${row.d}` : "—"}</span><Badge v={row.v} /></span></div>)}
      </Panel>

      <Panel>
        <PanelHead title="Haftalık Ödül" right={<span style={{ ...ST.tag, color: weekPom >= 30 ? "#54B84A" : C.lo }}>{reward}</span>} />
        <div style={ST.barOuter}><div style={{ ...ST.barInner, width: `${Math.min(100, (weekPom / 42) * 100)}%` }} /><div style={{ ...ST.barMark, left: `${(30 / 42) * 100}%` }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, color: C.lo, fontSize: 11 }}><span>0</span><span>30 🎧</span><span>42 🍿</span></div>
      </Panel>

      <Panel>
        <PanelHead title="Kupalar" right={<span style={ST.tag}>{trophies.filter((t) => t.got).length}/{trophies.length}</span>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>{trophies.map((t) => <div key={t.n} style={{ ...ST.skillCard, opacity: t.got ? 1 : 0.4, borderColor: t.got ? "#E8C13E66" : C.line, background: t.got ? "rgba(232,193,62,0.08)" : "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 22 }}>{t.got ? t.icon : "🔒"}</div><div style={{ color: t.got ? "#fff" : C.mid, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{t.n}</div><div style={{ color: C.lo, fontSize: 11, marginTop: 2 }}>{t.d}</div></div>)}</div>
      </Panel>
    </div>
  );
}

/* ════════════ DATA ════════════ */
function DataView({ settings, setSetting, days, fixture, events, topics, objectives, academics, importData, resetAll, storageOk }) {
  const [imp, setImp] = useState(""), [copied, setCopied] = useState(false);
  const json = useMemo(() => JSON.stringify({ v: 3, days, settings, fixture, events, topics, objectives, academics }), [days, settings, fixture, events, topics, objectives, academics]);
  const copy = async () => { try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) {} };
  const doImport = () => { try { const o = JSON.parse(imp.trim()); importData(o); setImp(""); alert("İçe aktarıldı ✓"); } catch (e) { alert("Geçersiz JSON. Dışa Aktar'dan aldığın metnin tamamını yapıştır."); } };
  return (
    <div style={ST.col}>
      <Panel>
        <PanelHead title="Veri & Yedek" right={<span style={{ ...ST.tag, color: storageOk ? "#54B84A" : C.red }}>{storageOk ? "Depolama çalışıyor ✓" : "Depolama erişilemiyor ✗"}</span>} />
        <div style={{ color: C.mid, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>Tüm veri (günler, fikstür, takvim, konular, ayarlar) cihazında otomatik kaydediliyor. Garanti için metni kopyalayıp sakla — "İçe Aktar" ile geri yükle.</div>
        <textarea readOnly value={json} style={ST.textarea} onFocus={(e) => e.target.select()} />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}><Pill solid onClick={copy}>{copied ? "Kopyalandı ✓" : "Dışa Aktar (kopyala)"}</Pill></div>
        <div style={{ height: 1, background: C.line, margin: "14px 0" }} />
        <div style={{ color: C.lo, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>İÇE AKTAR — yedek metni yapıştır</div>
        <textarea value={imp} onChange={(e) => setImp(e.target.value)} placeholder='{"v":3,"days":{...}}' style={ST.textarea} />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}><Pill solid onClick={doImport}>İçe Aktar</Pill><Pill danger onClick={resetAll}>Tüm Veriyi Sıfırla</Pill></div>
      </Panel>
      <Panel>
        <PanelHead title="Oyuncu & Zamanlayıcı" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Field label="İSİM" k="name" w="150px" settings={settings} setSetting={setSetting} /><Field label="FORMA NO" k="number" w="90px" settings={settings} setSetting={setSetting} /><Field label="YAŞ" k="age" w="80px" settings={settings} setSetting={setSetting} /><Field label="BOY" k="height" w="110px" settings={settings} setSetting={setSetting} /><Field label="GÜÇLÜ AYAK" k="foot" w="110px" settings={settings} setSetting={setSetting} /><Field label="ODAK (dk)" k="focusMin" w="100px" type="number" settings={settings} setSetting={setSetting} /><Field label="MOLA (dk)" k="breakMin" w="100px" type="number" settings={settings} setSetting={setSetting} /></div>
      </Panel>
      <Panel>
        <PanelHead title="Blok Saatleri" right={<span style={ST.tag}>Bugün ekranında görünür</span>} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Field label="SABAH BLOĞU" k="tSabah" w="170px" settings={settings} setSetting={setSetting} /><Field label="ÖĞLEN BLOĞU" k="tOgle" w="170px" settings={settings} setSetting={setSetting} /><Field label="AKŞAM BLOĞU" k="tAksam" w="170px" settings={settings} setSetting={setSetting} /></div>
        <div style={{ color: C.mid, fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>Haftalık fikstürü ve sınav/IA/EE takvimini <b>Program</b> sekmesinden, konu/müfredat takibini <b>Konular</b> sekmesinden yönetirsin.</div>
      </Panel>
    </div>
  );
}

/* ───────── bg ───────── */
function Ribbons() { const bar = (s) => ({ position: "absolute", filter: "blur(2px)", borderRadius: 8, ...s }); return <div style={ST.ribWrap} aria-hidden><div style={bar({ top: "-8%", left: "-6%", width: "46%", height: "13%", transform: "rotate(-26deg)", background: "linear-gradient(90deg,#C25BE0,#C25BE000)" })} /><div style={bar({ top: "3%", left: "-8%", width: "40%", height: "8%", transform: "rotate(-26deg)", background: "linear-gradient(90deg,#9B3FBE,#9B3FBE00)" })} /><div style={bar({ top: "11%", left: "-10%", width: "34%", height: "6%", transform: "rotate(-26deg)", background: "linear-gradient(90deg,#7A2E9E,#7A2E9E00)" })} /><div style={bar({ bottom: "-4%", left: "-8%", width: "44%", height: "12%", transform: "rotate(-26deg)", background: "linear-gradient(90deg,#B53A86,#B53A8600)" })} /><div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 6% 100%, rgba(150,48,126,0.35), transparent 60%)" }} /></div>; }

/* ───────── styles ───────── */
const ST = {
  root: { position: "relative", minHeight: "100vh", width: "100%", background: "radial-gradient(130% 100% at 12% 0%, #5a2080 0%, #3c1660 36%, #2a1048 66%, #1f0d3c 100%)", fontFamily: "'Roboto Condensed',system-ui,sans-serif", color: C.hi, overflowX: "hidden" },
  inner: { position: "relative", zIndex: 3, maxWidth: 1120, margin: "0 auto", padding: "14px 12px 26px" },
  ribWrap: { position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" },
  logo: { fontFamily: "Oswald,sans-serif", fontWeight: 700, fontStyle: "italic", fontSize: 28, color: "#fff", letterSpacing: 1, textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  warn: { background: "rgba(226,94,105,0.14)", border: `1px solid ${C.red}55`, color: "#F6D9DC", padding: "9px 12px", borderRadius: 10, fontSize: 12.5, lineHeight: 1.5, marginBottom: 12 },
  tabbar: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, background: "rgba(20,11,38,0.45)", border: `1px solid ${C.line}`, borderRadius: 12, padding: 8 },
  tab: { flex: "1 1 auto", minWidth: 84, fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: 0.5, padding: "10px 10px", borderRadius: 8, border: `1px solid ${C.lineHard}`, background: "rgba(255,255,255,0.04)", color: C.mid, cursor: "pointer" },
  tabActive: { background: C.accent, color: "#fff", border: `1px solid ${C.accent}`, boxShadow: `0 2px 14px ${C.accent}55` },
  col: { display: "flex", flexDirection: "column", gap: 14 },
  panel: { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, backdropFilter: "blur(5px)" },
  panelHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" },
  panelTitle: { fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 20, color: "#fff", letterSpacing: 0.3 },
  tag: { color: C.lo, fontSize: 11, letterSpacing: 1 },
  divider: { height: 1, background: C.line, margin: "10px 0" },
  deadline: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "rgba(232,193,62,0.10)", border: `1px solid ${C.gold}44`, borderRadius: 10, padding: "9px 13px", fontSize: 13, color: C.mid },
  northstar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "linear-gradient(90deg, rgba(177,79,216,0.18), rgba(78,212,194,0.10))", border: `1px solid ${C.accent}55`, borderRadius: 10, padding: "9px 13px", fontSize: 13, color: C.mid },
  posPill: { fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", background: C.accentDeep, padding: "3px 11px", borderRadius: 6, letterSpacing: 1 },
  matchPill: { fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.10)", border: `1px solid ${C.lineHard}`, padding: "3px 9px", borderRadius: 6, letterSpacing: 1 },
  condPill: { fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 700, background: "transparent", border: "1px solid", padding: "3px 9px", borderRadius: 6, letterSpacing: 1 },
  valPill: { fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 700, color: C.gold, background: "rgba(232,193,62,0.12)", border: `1px solid ${C.gold}55`, padding: "3px 9px", borderRadius: 6, letterSpacing: 0.5 },
  breakthrough: { marginTop: 8, display: "inline-block", color: C.up, fontSize: 11, fontWeight: 700, letterSpacing: 1, background: "rgba(70,166,224,0.12)", border: `1px solid ${C.up}66`, padding: "3px 9px", borderRadius: 6 },
  blockTag: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.accent, border: `1px solid ${C.accent}55`, borderRadius: 5, padding: "2px 7px" },
  groupLabel: { color: C.accent, fontFamily: "Oswald,sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 2 },
  taskRow: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", marginBottom: 4 },
  check: { width: 24, height: 24, borderRadius: 6, border: "2px solid", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 },
  select: { background: C.panelSolid, color: "#fff", border: `1px solid ${C.lineHard}`, borderRadius: 6, padding: "5px 8px", fontFamily: "'Roboto Condensed',sans-serif", fontSize: 13, maxWidth: 160 },
  step: { width: 30, height: 30, borderRadius: 6, border: `1px solid ${C.lineHard}`, background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 18, cursor: "pointer", lineHeight: 1 },
  link: { background: "transparent", border: "none", color: C.accent, fontSize: 13, cursor: "pointer", padding: "8px 2px", fontFamily: "'Roboto Condensed',sans-serif" },
  abilityWrap: { display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" },
  statRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 4px", borderBottom: `1px solid ${C.line}` },
  badge: { minWidth: 44, height: 28, borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 15, padding: "0 8px" },
  pill: { fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, color: C.mid, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.lineHard}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer" },
  pageNum: { fontFamily: "Oswald,sans-serif", fontSize: 12, color: "#fff", background: C.accentDeep, borderRadius: 12, padding: "2px 10px" },
  kit: { flex: "1 1 240px", minWidth: 220, background: "linear-gradient(180deg,rgba(42,19,72,0.55),rgba(26,12,44,0.30))", border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  seven: { fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 120, lineHeight: 0.9, background: "linear-gradient(180deg,#E879F9,#4ED4C2)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", margin: "6px 0" },
  persChip: { fontSize: 12, color: "#fff", background: "rgba(177,79,216,0.18)", border: `1px solid ${C.accent}55`, padding: "4px 11px", borderRadius: 20, fontWeight: 600 },
  skillCard: { border: "1px solid", borderRadius: 10, padding: "12px 12px" },
  statCard: { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" },
  barOuter: { position: "relative", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.07)", overflow: "hidden" },
  barInner: { position: "absolute", left: 0, top: 0, bottom: 0, background: "linear-gradient(90deg,#B14FD8,#4ED4C2)", borderRadius: 7 },
  barMark: { position: "absolute", top: -3, width: 2, height: 20, background: "#E8C13E" },
  infoChip: { fontSize: 12, color: C.mid, background: "rgba(255,255,255,0.05)", border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 11px" },
  clubRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 4px", borderBottom: `1px solid ${C.line}`, gap: 8 },
  clubBadge: { width: 34, height: 34, borderRadius: 8, background: "linear-gradient(180deg,#3a1c5e,#241040)", border: `1px solid ${C.lineHard}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Oswald,sans-serif", fontWeight: 700, fontSize: 13, color: C.mid },
  topicRow: { display: "flex", alignItems: "center", gap: 10, padding: "7px 2px", borderBottom: `1px solid ${C.line}` },
  statusDot: { fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, border: "1px solid", minWidth: 92, textAlign: "center" },
  xBtn: { background: "transparent", border: "none", color: C.lo, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "0 4px" },
  input: { background: C.panelSolid, color: "#fff", border: `1px solid ${C.lineHard}`, borderRadius: 6, padding: "8px 10px", fontFamily: "'Roboto Condensed',sans-serif", fontSize: 14, width: "100%" },
  textarea: { width: "100%", minHeight: 64, background: C.panelSolid, color: C.mid, border: `1px solid ${C.lineHard}`, borderRadius: 8, padding: 10, fontFamily: "monospace", fontSize: 11, resize: "vertical" },
  footer: { display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap", marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.line}` },
  fbtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", padding: 4 },
};
function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto+Condensed:wght@400;500;700&display=swap');
      * { box-sizing: border-box; }
      .pes-root { -webkit-font-smoothing: antialiased; }
      .pes-task:hover { background: rgba(255,255,255,0.05) !important; }
      .pes-tab:hover { filter: brightness(1.1); }
      .pes-step:hover,.pes-pill:hover,.pes-fbtn:hover { background: rgba(255,255,255,0.13) !important; }
      .pes-x:hover { color: ${C.red} !important; }
      .pes-link:hover { text-decoration: underline; }
      .pes-input:focus,.pes-select:focus,textarea:focus { outline:none; border-color:${C.accent} !important; }
      .pes-tab:focus-visible,.pes-task:focus-visible,.pes-step:focus-visible,.pes-pill:focus-visible,.pes-fbtn:focus-visible,.pes-link:focus-visible { outline:2px solid ${C.accent}; outline-offset:2px; border-radius:8px; }
      .pes-glow { animation: pesGlow 1.8s ease-in-out infinite; }
      @keyframes pesGlow { 0%,100%{filter:brightness(1);} 50%{filter:brightness(1.18);} }
      .pes-blink { animation: pesBlink 1.1s ease-in-out infinite; }
      @keyframes pesBlink { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
      .pes-seven { animation: sevenIn .6s ease-out; }
      @keyframes sevenIn { from{opacity:0;transform:translateY(8px) scale(.96);} to{opacity:1;transform:none;} }
      .pes-spin { animation: pesSpin .8s linear infinite; }
      @keyframes pesSpin { to{ transform: rotate(360deg); } }
      select option { background:${C.panelSolid}; color:#fff; }
      @media (prefers-reduced-motion: reduce){ .pes-glow,.pes-blink,.pes-seven{ animation:none !important; } }
    `}</style>
  );
}
