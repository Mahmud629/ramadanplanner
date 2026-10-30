"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { db, defaultDay, defaultSettings, type DayEntry, type Settings } from "./db";
import { makeT, type T } from "./i18n";

type Store = {
  ready: boolean;
  settings: Settings;
  days: Record<string, DayEntry>;
  t: T;
  updateSettings: (patch: Partial<Settings>) => void;
  updateDay: (date: string, patch: Partial<DayEntry> | ((e: DayEntry) => Partial<DayEntry>)) => void;
  getDay: (date: string) => DayEntry;
  replaceAll: (days: DayEntry[], settings: Settings) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => defaultSettings());
  const [days, setDays] = useState<Record<string, DayEntry>>({});
  const daysRef = useRef(days);
  daysRef.current = days;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [rows, s] = await Promise.all([db.days.toArray(), db.settings.get("settings")]);
        if (!alive) return;
        const map: Record<string, DayEntry> = {};
        for (const r of rows) map[r.date] = r;
        setDays(map);
        if (s) setSettings({ ...defaultSettings(), ...s });
      } catch (e) {
        console.warn("Could not open the local database", e);
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch, updatedAt: Date.now() };
      db.settings.put(next).catch(() => {});
      return next;
    });
  }, []);

  const getDay = useCallback((date: string) => daysRef.current[date] ?? defaultDay(date), []);

  const updateDay = useCallback<Store["updateDay"]>((date, patch) => {
    setDays((prev) => {
      const cur = prev[date] ?? defaultDay(date);
      const p = typeof patch === "function" ? patch(cur) : patch;
      const next = { ...cur, ...p, updatedAt: Date.now() };
      db.days.put(next).catch(() => {});
      return { ...prev, [date]: next };
    });
  }, []);

  const replaceAll = useCallback(async (rows: DayEntry[], s: Settings) => {
    await db.transaction("rw", db.days, db.settings, async () => {
      await db.days.clear();
      await db.days.bulkPut(rows);
      await db.settings.put(s);
    });
    const map: Record<string, DayEntry> = {};
    for (const r of rows) map[r.date] = r;
    setDays(map);
    setSettings({ ...defaultSettings(), ...s });
  }, []);

  const t = useMemo(() => makeT(settings.lang), [settings.lang]);

  const value = useMemo(
    () => ({ ready, settings, days, t, updateSettings, updateDay, getDay, replaceAll }),
    [ready, settings, days, t, updateSettings, updateDay, getDay, replaceAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}
