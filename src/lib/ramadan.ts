import { addDays, diffDays, fromISO, toISO } from "./dates";
import type { Settings } from "./db";
import { digits } from "./i18n";

const hijriFmt = () =>
  new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric" });

export function hijriParts(iso: string, adjust = 0) {
  // A positive adjustment means the local month starts later, so local Hijri date = calendar date of (day - adjust).
  const d = fromISO(addDays(iso, -adjust));
  const parts = Object.fromEntries(hijriFmt().formatToParts(d).map((p) => [p.type, p.value]));
  return { day: Number(parts.day), month: Number(parts.month), year: Number(String(parts.year).replace(/\D/g, "")) };
}

/** First day of the next Ramadan that has not finished yet (or the current one). */
export function findRamadanStart(fromISODate: string, adjust: number): string {
  // Scan back 61 days (so we stay on this year's Ramadan during it and for a month after, for the recap)
  // and forward up to ~13 months.
  let iso = addDays(fromISODate, -61);
  for (let i = 0; i < 450; i++) {
    const h = hijriParts(iso, adjust);
    if (h.month === 9 && h.day === 1) {
      if (diffDays(fromISODate, iso) < 60) return iso;
    }
    iso = addDays(iso, 1);
  }
  return fromISODate;
}

export type RamadanInfo = {
  startISO: string;
  /** 1–30 during Ramadan, 0 before, 31–60 in the month after */
  dayIndex: number;
  daysUntil: number;
  hijri: { day: number; month: number; year: number };
  isRamadan: boolean;
  isLastTen: boolean;
  isOddNight: boolean;
};

export function ramadanInfo(todayISO: string, s: Pick<Settings, "hijriAdjust" | "startOverride">): RamadanInfo {
  const startISO = s.startOverride || findRamadanStart(todayISO, s.hijriAdjust);
  const diff = diffDays(todayISO, startISO);
  const dayIndex = diff < 0 ? 0 : diff + 1;
  const isRamadan = dayIndex >= 1 && dayIndex <= 30;
  return {
    startISO,
    dayIndex,
    daysUntil: Math.max(0, -diff),
    hijri: hijriParts(todayISO, s.hijriAdjust),
    isRamadan,
    isLastTen: dayIndex >= 21 && dayIndex <= 30,
    // the odd nights (21st, 23rd…) begin at sunset before days 21, 23… — we highlight the evening of even days 20, 22…
    isOddNight: dayIndex >= 20 && dayIndex <= 28 && dayIndex % 2 === 0,
  };
}

export function ramadanDates(startISO: string) {
  return Array.from({ length: 30 }, (_, i) => addDays(startISO, i));
}

export function dayIndexFor(iso: string, startISO: string) {
  return diffDays(iso, startISO) + 1;
}

export const HIJRI_MONTHS = {
  en: ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul-Qa'dah", "Dhul-Hijjah"],
  bn: ["মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শাবান", "রমাদান", "শাওয়াল", "জিলকদ", "জিলহজ"],
};

export function longDate(iso: string, lang: "en" | "bn") {
  return digits(fromISO(iso).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { weekday: "long", day: "numeric", month: "long" }), lang);
}

export function shortDate(iso: string, lang: "en" | "bn") {
  return digits(fromISO(iso).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short" }), lang);
}

export { toISO };
