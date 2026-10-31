"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "./store";
import { iftarTime, isoInTz, locationOf, prayerTimes, sehriEnd, type Times } from "./prayer";
import { ramadanInfo } from "./ramadan";
import { addDays } from "./dates";

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

/** Everything time-related, computed for the user's chosen location. */
export function useRamadan(now: Date) {
  const { settings } = useStore();
  const loc = locationOf(settings);
  const today = isoInTz(now, loc.tz);

  const info = useMemo(() => ramadanInfo(today, settings), [today, settings]);
  const times: Times = useMemo(() => prayerTimes(today, settings), [today, settings]);
  const tomorrowTimes: Times = useMemo(() => prayerTimes(addDays(today, 1), settings), [today, settings]);

  const sehri = sehriEnd(times, settings);
  const iftar = iftarTime(times, settings);
  const nextSehri = sehriEnd(tomorrowTimes, settings);

  let next: { kind: "sehri" | "iftar"; at: Date };
  if (now < sehri) next = { kind: "sehri", at: sehri };
  else if (now < iftar) next = { kind: "iftar", at: iftar };
  else next = { kind: "sehri", at: nextSehri };

  const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
  const nextPrayer = order.find((k) => times[k] > now) ?? "fajr";
  // the prayer whose time is running now (null before Fajr after midnight)
  const currentPrayer = [...order].reverse().find((k) => times[k] <= now) ?? null;

  // the sky turns at Maghrib and at sunrise
  const isNight = now >= times.maghrib || now < times.sunrise;

  // Nights of the last ten: night N runs from Maghrib before day N until Fajr of day N.
  let night: number | null = null;
  const d = info.dayIndex;
  if (d >= 20 && d <= 29 && now >= times.maghrib) night = d + 1;
  else if (d >= 21 && d <= 30 && now < times.fajr) night = d;
  const nextFajr = now < times.fajr ? times.fajr : tomorrowTimes.fajr;

  return { today, tz: loc.tz, info, times, sehri, iftar, next, nextPrayer, currentPrayer, isNight, night, nextFajr };
}

export function countdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
