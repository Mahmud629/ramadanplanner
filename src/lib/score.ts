import { addDays } from "./dates";
import { DEEDS, FARD, type DayEntry } from "./db";

export const KHATM_PAGES = 604;

/** Page on which each juz starts in the standard 604-page Madani mushaf. */
const JUZ_START = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];

export function juzForPage(page: number) {
  let j = 1;
  for (let i = 0; i < JUZ_START.length; i++) if (page >= JUZ_START[i]) j = i + 1;
  return j;
}

export function pagesPerDay(goal: number) {
  return Math.ceil((KHATM_PAGES * goal) / 30);
}

const isPeriod = (e: DayEntry) => e.fast === "excused" && e.excuse === "period";

export function prayersCount(e: DayEntry) {
  return FARD.filter((p) => e.prayers[p]).length;
}

/**
 * A day's score out of 100.
 * Fast 30 · five prayers 35 · Quran 15 · extra prayers 10 · learning 5 · good deeds 5.
 * An excused fast counts as fulfilled; during menstruation the prayers are excused too.
 */
export function dayScore(e: DayEntry | undefined, goal: number) {
  if (!e) return 0;
  let s = 0;
  if (e.fast === "done" || e.fast === "excused") s += 30;
  s += isPeriod(e) ? 35 : prayersCount(e) * 7;
  s += 15 * Math.min(1, e.quranPages / pagesPerDay(goal));
  s += (e.extras.taraweeh ? 5 : 0) + (e.extras.tahajjud ? 3 : 0) + (e.extras.duha ? 2 : 0);
  s += (e.duaLearned ? 2 : 0) + (e.lessonRead || e.quizAnswer !== null ? 3 : 0);
  s += (e.actionDone ? 3 : 0) + (DEEDS.some((d) => e.deeds[d]) ? 2 : 0);
  return Math.round(Math.min(100, s));
}

/** Average daily score from Ramadan day 1 up to `uptoDay` (inclusive). */
export function ramadanScore(entries: Record<string, DayEntry>, startISO: string, uptoDay: number, goal: number) {
  const n = Math.max(0, Math.min(30, uptoDay));
  if (n === 0) return 0;
  let total = 0;
  for (let i = 0; i < n; i++) total += dayScore(entries[addDays(startISO, i)], goal);
  return Math.round(total / n);
}

type Pred = (e: DayEntry) => "yes" | "no" | "skip";

/** Count back from `fromISO` while the predicate holds; "skip" days (excused) neither add nor break. */
export function streak(entries: Record<string, DayEntry>, fromISO: string, pred: Pred, limit = 60) {
  let count = 0;
  let cur = fromISO;
  // If today isn't done yet, start counting from yesterday so the streak doesn't look broken all day.
  const today = entries[cur];
  if (!today || pred(today) === "no") cur = addDays(cur, -1);
  for (let i = 0; i < limit; i++) {
    const e = entries[cur];
    if (!e) break;
    const r = pred(e);
    if (r === "no") break;
    if (r === "yes") count++;
    cur = addDays(cur, -1);
  }
  return count;
}

export const fastPred: Pred = (e) => (e.fast === "done" ? "yes" : e.fast === "excused" ? "skip" : "no");
export const prayerPred: Pred = (e) => (isPeriod(e) ? "skip" : prayersCount(e) === 5 ? "yes" : "no");
export const quranPred: Pred = (e) => (e.quranPages > 0 ? "yes" : "no");

export function bestStreak(entries: Record<string, DayEntry>, dates: string[], pred: Pred) {
  let best = 0;
  let cur = 0;
  for (const d of dates) {
    const e = entries[d];
    const r = e ? pred(e) : "no";
    if (r === "yes") cur++;
    else if (r === "no") cur = 0;
    best = Math.max(best, cur);
  }
  return best;
}
