import type { DayEntry } from "./db";

export function isoToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoPrevDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function prayersComplete(e: DayEntry) {
  return (
    e.prayers.fajr &&
    e.prayers.dhuhr &&
    e.prayers.asr &&
    e.prayers.maghrib &&
    e.prayers.isha
  );
}

export function computeStreak(
  entries: Record<string, DayEntry>,
  fromISO: string,
  predicate: (e: DayEntry) => boolean
) {
  let count = 0;
  let cur = fromISO;

  while (true) {
    const e = entries[cur];
    if (!e) break;
    if (!predicate(e)) break;
    count += 1;
    cur = isoPrevDay(cur);
  }

  return count;
}
