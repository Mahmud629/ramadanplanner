// Extracts only the Quran text the app needs from the quran-json dataset
// (Uthmani text from quranenc.com, Bangla & English translations, Tanzil transliteration)
// into src/content/quran.generated.json.  Run: npm run build:quran
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const base = "quran-json/dist/";
const ar = require(base + "quran.json");
const en = require(base + "quran_en.json");
const bn = require(base + "quran_bn.json");
const tr = require(base + "quran_transliteration.json");

const daysSrc = readFileSync(new URL("../src/content/days.ts", import.meta.url), "utf8");

const verses = {};
const slices = {};
const surahs = {};

function cleanTr(t) {
  // Tanzil uses "AA" for 'ayn; make it friendlier.
  return t.replace(/AA/g, "'").replace(/\s+/g, " ").trim();
}

function addVerse(s, a) {
  const key = `${s}:${a}`;
  if (verses[key]) return;
  const v = ar[s - 1].verses[a - 1];
  if (!v) throw new Error("Missing verse " + key);
  verses[key] = {
    ar: v.text,
    en: en[s - 1].verses[a - 1].translation,
    bn: bn[s - 1].verses[a - 1].translation,
    tr: cleanTr(tr[s - 1].verses[a - 1].transliteration),
  };
  addSurah(s);
}

function addSurah(s) {
  if (surahs[s]) return;
  surahs[s] = { name: ar[s - 1].name, tr: ar[s - 1].transliteration, en: en[s - 1].translation, bn: bn[s - 1].translation, total: ar[s - 1].total_verses };
}

// A word at the start of a slice may carry a shadda that only exists because of
// assimilation with the previous word (e.g. "رَّبِّ" after "وَقُل"). Remove it when the
// word stands alone.
function stripLeadingShadda(word) {
  const chars = [...word];
  if (chars[1] === "ّ") chars.splice(1, 1);
  return chars.join("");
}

// Verse of the day:  verse: { s: 2, from: 183, to: 183 }
for (const m of daysSrc.matchAll(/verse: \{ s: (\d+), from: (\d+), to: (\d+) \}/g)) {
  const [s, from, to] = m.slice(1).map(Number);
  for (let a = from; a <= to; a++) addVerse(s, a);
}

// Dua parts:  { s: 2, a: 201, from: 3 }
for (const m of daysSrc.matchAll(/\{ s: (\d+), a: (\d+)(?:, from: (\d+))?(?:, to: (\d+))? \}/g)) {
  const s = Number(m[1]);
  const a = Number(m[2]);
  const from = m[3] ? Number(m[3]) : 0;
  const words = ar[s - 1].verses[a - 1].text.split(" ");
  const to = m[4] ? Number(m[4]) : words.length - 1;
  const part = words.slice(from, to + 1);
  part[0] = stripLeadingShadda(part[0]);
  slices[`${s}:${a}:${m[3] ?? ""}:${m[4] ?? ""}`] = part.join(" ");
  addSurah(s);
}

// Surahs to memorise
const memorise = [
  { id: "fatihah", s: 1, from: 1, to: 7 },
  { id: "kursi", s: 2, from: 255, to: 255 },
  ...[105, 106, 107, 108, 109, 110, 111, 112, 113, 114].map((s) => ({ id: String(s), s, from: 1, to: ar[s - 1].total_verses })),
];
for (const m of memorise) for (let a = m.from; a <= m.to; a++) addVerse(m.s, a);

// offsets[s] = number of ayahs before surah s (for global ayah numbers 1–6236)
const offsets = [0];
for (let i = 0; i < 114; i++) offsets.push(offsets[i] + ar[i].total_verses);

const out = { verses, slices, surahs, memorise, offsets, source: "quran-json 3.1.2 (CC BY 4.0): Uthmani text from quranenc.com, transliteration from tanzil.net" };
writeFileSync(new URL("../src/content/quran.generated.json", import.meta.url), JSON.stringify(out));
console.log(`verses: ${Object.keys(verses).length}, dua slices: ${Object.keys(slices).length}, surahs: ${Object.keys(surahs).length}`);
for (const [k, v] of Object.entries(slices)) console.log(k.padEnd(12), v);
