import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import { fromISO } from "./dates";
import type { Method, Settings } from "./db";
import { cityById } from "./cities";
import { digits } from "./i18n";

export type Times = { fajr: Date; sunrise: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date };

export function locationOf(s: Settings) {
  if (s.locationMode === "gps" && s.gps) return { ...s.gps, label: null as string | null };
  const c = cityById(s.cityId);
  return { lat: c.lat, lon: c.lon, tz: c.tz, label: c.id };
}

function params(method: Method, madhab: Settings["madhab"]) {
  const p = (CalculationMethod as unknown as Record<string, () => ReturnType<typeof CalculationMethod.Karachi>>)[method]?.() ?? CalculationMethod.Karachi();
  p.madhab = madhab === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return p;
}

/**
 * Prayer times for a calendar date at a location. The date's year/month/day are taken
 * in the location's own time zone, so choosing a city abroad gives that city's day.
 */
export function prayerTimes(iso: string, s: Settings): Times {
  const loc = locationOf(s);
  const d = fromISO(iso);
  const pt = new PrayerTimes(new Coordinates(loc.lat, loc.lon), d, params(s.method, s.madhab));
  return { fajr: pt.fajr, sunrise: pt.sunrise, dhuhr: pt.dhuhr, asr: pt.asr, maghrib: pt.maghrib, isha: pt.isha };
}

export function sehriEnd(t: Times, s: Settings) {
  return new Date(t.fajr.getTime() - s.sehriMargin * 60000);
}
export function iftarTime(t: Times, s: Settings) {
  return new Date(t.maghrib.getTime() + s.iftarMargin * 60000);
}

export function formatClock(d: Date, tz: string, lang: "en" | "bn") {
  return digits(d.toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }), lang);
}

/** "Today" in the location's own time zone. */
export function isoInTz(date: Date, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}
