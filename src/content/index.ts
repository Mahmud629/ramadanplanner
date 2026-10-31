import Q from "./quran.generated.json";
import { DAYS } from "./days";
import type { Dua, DayContent } from "./types";
import type { Lang } from "@/lib/db";
import { digits } from "@/lib/i18n";

type Verse = { ar: string; en: string; bn: string; tr: string };
const verses = Q.verses as Record<string, Verse>;
const slices = Q.slices as Record<string, string>;
const surahs = Q.surahs as Record<string, { name: string; tr: string; en: string; bn: string; total: number }>;

const SURAH_BN: Record<number, string> = {
  1: "আল-ফাতিহা", 2: "আল-বাকারা", 3: "আলে ইমরান", 4: "আন-নিসা", 7: "আল-আরাফ", 9: "আত-তাওবা", 13: "আর-রাদ", 14: "ইবরাহিম",
  15: "আল-হিজর", 16: "আন-নাহল", 17: "বনি ইসরাইল", 18: "আল-কাহফ", 20: "ত্বা-হা", 21: "আল-আম্বিয়া", 23: "আল-মুমিনুন",
  24: "আন-নূর", 25: "আল-ফুরকান", 26: "আশ-শুআরা", 27: "আন-নামল", 28: "আল-কাসাস", 29: "আল-আনকাবুত", 39: "আয-যুমার",
  41: "হা-মীম আস-সাজদা", 49: "আল-হুজুরাত", 59: "আল-হাশর", 65: "আত-তালাক", 66: "আত-তাহরীম", 94: "আলাম নাশরাহ",
  96: "আল-আলাক", 97: "আল-কদর", 105: "আল-ফীল", 106: "কুরাইশ", 107: "আল-মাউন", 108: "আল-কাওসার", 109: "আল-কাফিরুন",
  110: "আন-নাসর", 111: "আল-লাহাব", 112: "আল-ইখলাস", 113: "আল-ফালাক", 114: "আন-নাস",
};

export function surahName(s: number, lang: Lang) {
  return lang === "bn" ? SURAH_BN[s] ?? surahs[s]?.tr : surahs[s]?.tr ?? String(s);
}

export function verse(s: number, a: number) {
  return verses[`${s}:${a}`];
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function arabicNumber(n: number) {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export function contentForDay(day: number): DayContent {
  return DAYS[Math.min(30, Math.max(1, day)) - 1];
}

export function duaArabic(d: Dua) {
  if (d.kind === "hadith") return d.ar;
  return d.parts.map((p) => slices[`${p.s}:${p.a}:${p.from ?? ""}:${p.to ?? ""}`]).join(" ۝ ");
}

const BOOKS_BN: [RegExp, string][] = [
  [/Bukhari/g, "বুখারি"],
  [/Muslim/g, "মুসলিম"],
  [/Tirmidhi/g, "তিরমিযি"],
  [/Abu Dawud/g, "আবু দাউদ"],
  [/Sayyidul Istighfar/g, "সাইয়িদুল ইস্তিগফার"],
];

/** Hadith reference in the user's language, e.g. "বুখারি ৩৮, মুসলিম ৭৬০". */
export function hadithRef(ref: string, lang: Lang) {
  if (lang === "en") return ref;
  let out = ref;
  for (const [re, bn] of BOOKS_BN) out = out.replace(re, bn);
  return digits(out, lang);
}

export function duaRef(d: Dua, lang: Lang) {
  if (d.kind === "hadith") return hadithRef(d.ref, lang);
  const first = d.parts[0];
  const last = d.parts[d.parts.length - 1];
  const range = first.a === last.a ? `${first.a}` : `${first.a}–${last.a}`;
  return `${surahName(first.s, lang)} ${digits(`${first.s}:${range}`, lang)}`;
}

/** Only offer audio for a Quranic dua when it is made of whole ayahs (so the recitation matches the text). */
export function duaAudio(d: Dua) {
  if (d.kind !== "quran") return null;
  if (d.parts.some((p) => p.from !== undefined || p.to !== undefined)) return null;
  return d.parts.map((p) => ({ s: p.s, a: p.a }));
}

const offsets = (Q as unknown as { offsets: number[] }).offsets;
/** Global ayah number, 1–6236. */
export function ayahGlobal(s: number, a: number) {
  return offsets[s - 1] + a;
}

export const MEMORISE = Q.memorise as { id: string; s: number; from: number; to: number }[];
export const QURAN_SOURCE = Q.source;
