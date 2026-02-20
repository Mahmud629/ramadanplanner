"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db, defaultDayEntry, DayEntry } from "@/lib/db";
import { computeStreak, isoToday, prayersComplete } from "@/lib/streak";

type Theme = "dark" | "light";
const THEME_KEY = "ramadan_theme_v1";

// ✅ Switch this to false after testing
const TEST_RAMADAN_START_TODAY = false;
const RAMADAN_START_ISO_FIXED = "2026-02-19";

function isoAddDays(startIso: string, add: number) {
  const d = new Date(startIso + "T00:00:00");
  d.setDate(d.getDate() + add);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type AdhanTimes = {
  fajr: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
};

function formatHHMM(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function Check({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="row" style={{ opacity: disabled ? 0.7 : 1 }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span style={{ fontWeight: 900 }}>{label}</span>
    </label>
  );
}

/** ✅ Small tile box like Suhoor/Iftar style (but generic) */
function ExtraTile({
  title,
  subtitle,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 12,
        background: active
          ? "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(96,165,250,0.12), rgba(167,139,250,0.08))"
          : "var(--card2)",
        boxShadow: active ? "var(--glow)" : "none",
        transition: "transform var(--trans), box-shadow var(--trans), background var(--trans)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900 }}>{title}</div>
          {subtitle ? (
            <div className="subtle" style={{ marginTop: 6 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

export default function Home() {
  const realToday = isoToday();
  const RAMADAN_START_ISO = TEST_RAMADAN_START_TODAY ? realToday : RAMADAN_START_ISO_FIXED;

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const [selectedDate, setSelectedDate] = useState(realToday);
  const [entry, setEntry] = useState<DayEntry | null>(null);
  const [allDays, setAllDays] = useState<Record<string, DayEntry>>({});
  const [theme, setTheme] = useState<Theme>("dark");

  // ✅ Allow editing today + past, block future
  const isFuture = selectedDate > realToday; // ISO yyyy-mm-dd compares correctly as string
  const isEditable = !isFuture;

  // --- location + adhan ---
  const [geoStatus, setGeoStatus] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [adhanTimes, setAdhanTimes] = useState<AdhanTimes | null>(null);
  const [adhanError, setAdhanError] = useState<string | null>(null);

  // ✅ Dua "image-only" view state
  const [duaOnly, setDuaOnly] = useState(false);

  // Ramadan day (selected)
  const selectedRamadanDay = useMemo(() => {
    const start = new Date(RAMADAN_START_ISO + "T00:00:00");
    const sel = new Date(selectedDate + "T00:00:00");
    const diff = Math.floor((sel.getTime() - start.getTime()) / 86400000);
    if (diff < 0) return 0;
    return clamp(diff + 1, 1, 30);
  }, [selectedDate, RAMADAN_START_ISO]);

  // Ramadan day (today)
  const todayRamadanDay = useMemo(() => {
    const start = new Date(RAMADAN_START_ISO + "T00:00:00");
    const t = new Date(realToday + "T00:00:00");
    const diff = Math.floor((t.getTime() - start.getTime()) / 86400000);
    if (diff < 0) return 0;
    return clamp(diff + 1, 1, 30);
  }, [realToday, RAMADAN_START_ISO]);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  function formatDDMMYYYY(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  // load entries
  useEffect(() => {
    let alive = true;

    async function load() {
      const rows = await db.days.toArray();
      const map: Record<string, DayEntry> = {};
      for (const r of rows) map[r.date] = r;

      const current = map[selectedDate] ?? defaultDayEntry(selectedDate);

      if (!alive) return;
      setAllDays(map);
      setEntry(current);
    }

    load();
    return () => {
      alive = false;
    };
  }, [selectedDate]);

  // ✅ save for today + past (block future)
  useEffect(() => {
    if (!entry) return;
    if (isFuture) return;

    async function save() {
      const next: DayEntry = { ...(entry as DayEntry), updatedAt: Date.now() };
      await db.days.put(next);
      setAllDays((prev) => ({ ...prev, [next.date]: next }));
    }

    save();
  }, [entry, isFuture]);

  // location request
  const requestLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation not supported in this browser.");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus("granted");
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setGeoError(err.message || "Failed to get location.");
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 6 * 60 * 60 * 1000 }
    );
  };

  useEffect(() => {
    if (!mounted) return;
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // adhan compute
  useEffect(() => {
    let alive = true;

    async function compute() {
      if (!coords) return;

      try {
        setAdhanError(null);
        const adhan: any = await import("adhan");

        const c = new adhan.Coordinates(coords.lat, coords.lon);
        const params = adhan.CalculationMethod.MuslimWorldLeague();
        params.madhab = adhan.Madhab.Hanafi;

        const pt = new adhan.PrayerTimes(c, new Date(), params);

        const times: AdhanTimes = {
          fajr: pt.fajr,
          dhuhr: pt.dhuhr,
          asr: pt.asr,
          maghrib: pt.maghrib,
          isha: pt.isha,
        };

        if (!alive) return;
        setAdhanTimes(times);
      } catch (e: any) {
        if (!alive) return;
        setAdhanTimes(null);
        setAdhanError(e?.message || "Failed to load adhan.");
      }
    }

    compute();
    return () => {
      alive = false;
    };
  }, [coords]);

  // streaks from real today
  const streaks = useMemo(() => {
    const fast = computeStreak(allDays, realToday, (e) => e.fastDone);
    const prayer = computeStreak(allDays, realToday, (e) => prayersComplete(e));
    const quran = computeStreak(allDays, realToday, (e) => e.quranDone || e.quranPagesRead > 0);
    return { fast, prayer, quran };
  }, [allDays, realToday]);

  // badges for Ramadan grid
  const badges = useMemo(() => {
    const out: Record<string, { fast?: boolean; prayer?: boolean; quran?: boolean; percent?: number }> = {};
    for (const [date, e] of Object.entries(allDays)) {
      const fast = e.fastDone;
      const prayer = prayersComplete(e);
      const quran = e.quranDone || e.quranPagesRead > 0;
      const done = (fast ? 1 : 0) + (prayer ? 1 : 0) + (quran ? 1 : 0);
      out[date] = { fast, prayer, quran, percent: Math.round((done / 3) * 100) };
    }
    return out;
  }, [allDays]);

  // overall Ramadan completion based on TODAY
  const overall = useMemo(() => {
    if (todayRamadanDay <= 0) return { completedDays: 0, percent: 0, day: 0 };

    const dates: string[] = [];
    for (let i = 0; i < todayRamadanDay; i++) dates.push(isoAddDays(RAMADAN_START_ISO, i));

    const isCompleteDay = (e?: DayEntry) => {
      if (!e) return false;
      return e.fastDone && prayersComplete(e) && (e.quranDone || e.quranPagesRead > 0);
    };

    const completedDays = dates.reduce((acc, iso) => acc + (isCompleteDay(allDays[iso]) ? 1 : 0), 0);
    const percent = Math.round((completedDays / 30) * 100);

    return { completedDays, percent, day: todayRamadanDay };
  }, [allDays, todayRamadanDay, RAMADAN_START_ISO]);

  // Dua image
  const duaImg =
    selectedRamadanDay >= 1 && selectedRamadanDay <= 30 ? `/dua/${String(selectedRamadanDay).padStart(2, "0")}.png` : null;

  const openDuaOnly = () => {
    if (!duaImg) return;
    setDuaOnly(true);
  };
  const closeDuaOnly = () => setDuaOnly(false);

  // completion stats
  const prayerCount5 =
    entry
      ? (entry.prayers.fajr ? 1 : 0) +
        (entry.prayers.dhuhr ? 1 : 0) +
        (entry.prayers.asr ? 1 : 0) +
        (entry.prayers.maghrib ? 1 : 0) +
        (entry.prayers.isha ? 1 : 0)
      : 0;

  const prayerPercent = entry ? Math.round((prayerCount5 / 5) * 100) : 0;
  const fastPercent = entry?.fastDone ? 100 : 0;
  const quranPercent = entry && (entry.quranDone || entry.quranPagesRead > 0) ? 100 : 0;

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ✅ setters block only future
  const safeSetEntry = (next: DayEntry) => {
    if (!isEditable) return;
    setEntry(next);
  };

  const safeSetPrayer = (key: keyof DayEntry["prayers"], val: boolean) => {
    if (!isEditable) return;
    setEntry((prev) => {
      if (!prev) return prev;
      return { ...prev, prayers: { ...prev.prayers, [key]: val } };
    });
  };

  // Next upcoming prayer glow
  const nextPrayerKey = useMemo<keyof AdhanTimes | null>(() => {
    if (!adhanTimes || !now) return null;
    const order: (keyof AdhanTimes)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    for (const k of order) {
      if (adhanTimes[k].getTime() > now.getTime()) return k;
    }
    return "fajr";
  }, [adhanTimes, now]);

  // Fasting: suhoor ends (fajr) + iftar (maghrib) + countdown
  const fastingInfo = useMemo(() => {
    if (!adhanTimes || !now) return null;

    const suhoorEnds = adhanTimes.fajr;
    const iftar = adhanTimes.maghrib;

    const tNow = now.getTime();

    let nextName: "Suhoor ends" | "Iftar" = "Iftar";
    let nextAt = iftar;

    if (tNow < suhoorEnds.getTime()) {
      nextName = "Suhoor ends";
      nextAt = suhoorEnds;
    } else if (tNow < iftar.getTime()) {
      nextName = "Iftar";
      nextAt = iftar;
    } else {
      const tomorrowFajr = new Date(suhoorEnds);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      nextName = "Suhoor ends";
      nextAt = tomorrowFajr;
    }

    return {
      suhoorEnds,
      iftar,
      nextName,
      left: formatCountdown(nextAt.getTime() - tNow),
    };
  }, [adhanTimes, now]);

  // ✅ Dua image-only view
  if (duaOnly && duaImg) {
    return (
      <main
        className="container"
        style={{
          minHeight: "100vh",
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <button className="btn" onClick={closeDuaOnly}>
            ← Back
          </button>
          <div className="badge">Ramadan Day {selectedRamadanDay}</div>
        </div>

        <img
          src={duaImg}
          alt={`Dua day ${selectedRamadanDay}`}
          onClick={closeDuaOnly}
          style={{
            width: "100%",
            maxWidth: 720,
            margin: "0 auto",
            borderRadius: 18,
            border: "1px solid var(--border)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        />

        <div className="subtle" style={{ textAlign: "center" }}>
          Tap the image to close
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="container">
        <div className="headerRow">
          <h1 className="title">🌙 Ramadan Planner</h1>
          <button className="btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
        <div className="topBar" style={{ marginTop: 12 }}>
          <div>
            <div style={{ fontWeight: 900 }}>{formatDDMMYYYY(realToday)}</div>
            <div className="subtle">Loading…</div>
          </div>
          <div className="clock">{now ? formatTime(now) : "--:--:--"}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="headerRow">
        <h1 className="title">🌙 Ramadan Planner</h1>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div
        className="topBar"
        style={{
          marginTop: 12,
          background: "linear-gradient(135deg, rgba(96,165,250,0.14), rgba(167,139,250,0.10), rgba(34,197,94,0.07))",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span>{formatDDMMYYYY(realToday)}</span>
            {TEST_RAMADAN_START_TODAY && <span className="badge">TEST MODE</span>}
            {isFuture && <span className="badge">VIEW ONLY (future)</span>}
          </div>

          <div className="subtle" style={{ marginTop: 4 }}>
            Ramadan Day {overall.day} of 30 • Completed {overall.completedDays}/30
          </div>

          {geoError && <div className="subtle">⚠ {geoError}</div>}
          {adhanError && <div className="subtle">⚠ Adhan: {adhanError}</div>}

          {(geoStatus === "denied" || geoStatus === "error") && (
            <button className="btn" style={{ marginTop: 8 }} onClick={requestLocation}>
              📍 Retry location
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ProgressRing percent={overall.percent} size={46} stroke={5} />
            <div style={{ lineHeight: 1.05, textAlign: "right" }}>
              <div style={{ fontWeight: 900 }}>{overall.percent}%</div>
              <div className="subtle">{overall.completedDays}/30</div>
            </div>
          </div>

          <div className="clock">{now ? formatTime(now) : "--:--:--"}</div>
        </div>
      </div>

      {/* Dua + Ramadan calendar */}
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <div
          className="card"
          style={{ minHeight: 0, cursor: duaImg ? "pointer" : "default" }}
          onClick={openDuaOnly}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openDuaOnly();
          }}
        >
          <div className="cardHeader">
            <div>
              <p className="cardTitle">🤲 Daily Dua</p>
              <div className="subtle">{selectedRamadanDay > 0 ? `Ramadan Day ${selectedRamadanDay}` : "Select a Ramadan day"}</div>
            </div>
            <div className="badge">Tap to view</div>
          </div>

          <hr className="hr" />

          {duaImg ? (
            <img
              src={duaImg}
              alt={`Dua day ${selectedRamadanDay}`}
              onClick={(e) => {
                e.stopPropagation();
                openDuaOnly();
              }}
              style={{
                width: "100%",
                borderRadius: 18,
                border: "1px solid var(--border)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
              }}
            />
          ) : (
            <div className="subtle">
              Ensure images exist in <b>public/dua/01.png</b> ... <b>30.png</b>.
            </div>
          )}
        </div>

        <RamadanGrid startISO={RAMADAN_START_ISO} selectedISO={selectedDate} onSelect={setSelectedDate} dayBadges={badges} />
      </div>

      {/* Tracking cards */}
      <div style={{ marginTop: 18 }} className="grid3">
        {/* Prayer */}
        <div className="card">
          <div className="cardHeader">
            <div>
              <p className="cardTitle">🕌 Prayer</p>
              <div className="subtle">Streak: {streaks.prayer} days</div>
            </div>

            <div className="kpi">
              <ProgressRing percent={prayerPercent} />
              <div className="kpiText">
                <div className="big">{prayerPercent}%</div>
                <div className="small">{prayerCount5}/5</div>
              </div>
            </div>
          </div>

          <hr className="hr" />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PrayerRow label="Fajr" checked={entry.prayers.fajr} disabled={isFuture} onChange={(v) => safeSetPrayer("fajr", v)} time={adhanTimes?.fajr} glow={nextPrayerKey === "fajr"} />
            <PrayerRow label="Dhuhr" checked={entry.prayers.dhuhr} disabled={isFuture} onChange={(v) => safeSetPrayer("dhuhr", v)} time={adhanTimes?.dhuhr} glow={nextPrayerKey === "dhuhr"} />
            <PrayerRow label="Asr" checked={entry.prayers.asr} disabled={isFuture} onChange={(v) => safeSetPrayer("asr", v)} time={adhanTimes?.asr} glow={nextPrayerKey === "asr"} />
            <PrayerRow label="Maghrib" checked={entry.prayers.maghrib} disabled={isFuture} onChange={(v) => safeSetPrayer("maghrib", v)} time={adhanTimes?.maghrib} glow={nextPrayerKey === "maghrib"} />
            <PrayerRow label="Isha" checked={entry.prayers.isha} disabled={isFuture} onChange={(v) => safeSetPrayer("isha", v)} time={adhanTimes?.isha} glow={nextPrayerKey === "isha"} />
            <PrayerRow label="Taraweeh (extra)" checked={entry.prayers.taraweeh} disabled={isFuture} onChange={(v) => safeSetPrayer("taraweeh", v)} time={null} glow={false} />
          </div>

          <div style={{ marginTop: 12 }} className="badge">
            All 5 prayers: <b style={{ color: "var(--text)" }}>{prayersComplete(entry) ? "Yes" : "No"}</b>
          </div>

          {!adhanTimes && (geoStatus === "requesting" || geoStatus === "granted") && (
            <div className="subtle" style={{ marginTop: 10 }}>
              Loading prayer times…
            </div>
          )}
        </div>

        {/* Fasting */}
        <div className="card">
          <div className="cardHeader">
            <div>
              <p className="cardTitle">🔥 Fasting</p>
              <div className="subtle">Streak: {streaks.fast} days</div>
            </div>

            <div className="kpi">
              <ProgressRing percent={fastPercent} />
              <div className="kpiText">
                <div className="big">{fastPercent}%</div>
                <div className="small">{entry.fastDone ? "Done" : "Not yet"}</div>
              </div>
            </div>
          </div>

          <hr className="hr" />

          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <FastingTile title="Sehri ends (Fajr)" time={adhanTimes ? formatHHMM(adhanTimes.fajr) : "--:--"} active={fastingInfo?.nextName === "Suhoor ends"} countdown={fastingInfo?.nextName === "Suhoor ends" ? fastingInfo.left : null} />
            <FastingTile title="Iftar (Maghrib)" time={adhanTimes ? formatHHMM(adhanTimes.maghrib) : "--:--"} active={fastingInfo?.nextName === "Iftar"} countdown={fastingInfo?.nextName === "Iftar" ? fastingInfo.left : null} />
          </div>

          <Check label="Fasted today" checked={entry.fastDone} disabled={isFuture} onChange={(v) => safeSetEntry({ ...entry, fastDone: v })} />

          {!adhanTimes && (geoStatus === "requesting" || geoStatus === "granted") && (
            <div className="subtle" style={{ marginTop: 10 }}>
              Loading Suhoor/Iftar times…
            </div>
          )}
        </div>

        {/* Quran */}
        <div className="card">
          <div className="cardHeader">
            <div>
              <p className="cardTitle">📖 Quran</p>
              <div className="subtle">Streak: {streaks.quran} days</div>
            </div>

            <div className="kpi">
              <ProgressRing percent={quranPercent} />
              <div className="kpiText">
                <div className="big">{quranPercent}%</div>
                <div className="small">{entry.quranPagesRead} pages</div>
              </div>
            </div>
          </div>

          <hr className="hr" />

          {/* ✅ Quran (clean tiles) */}
          <div style={{ display: "grid", gap: 10 }}>
            {/* Tile 1: Quran + Pages */}
            <ExtraTile title="📖 Quran">
              <div style={{ display: "grid", gap: 10 }}>
                <Check
                  label="Done"
                  checked={entry.quranDone}
                  disabled={isFuture}
                  onChange={(v) => safeSetEntry({ ...entry, quranDone: v })}
                />

                <div>
                  <div className="subtle" style={{ marginBottom: 6 }}>
                    Pages read today
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={entry.quranPagesRead}
                    disabled={isFuture}
                    onChange={(e) => safeSetEntry({ ...entry, quranPagesRead: Number(e.target.value || 0) })}
                  />
                </div>
              </div>
            </ExtraTile>

            {/* Tile 2: Istigfar */}
            <ExtraTile title="🤲 Istigfar (extra)">
              <Check
                label="Done"
                checked={(entry as any).istigfarDone ?? false}
                disabled={isFuture}
                onChange={(v) => safeSetEntry({ ...(entry as any), istigfarDone: v } as DayEntry)}
              />
            </ExtraTile>

            {/* Tile 3: Jikr */}
            <ExtraTile title="🧿 Jikr (extra)">
              <Check
                label="Done"
                checked={(entry as any).jikrDone ?? false}
                disabled={isFuture}
                onChange={(v) => safeSetEntry({ ...(entry as any), jikrDone: v } as DayEntry)}
              />
            </ExtraTile>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }} className="subtle">
        Prepared By: Capt Asif Mahmud. Keep me in your prayers.
      </div>
    </main>
  );
}

function PrayerRow({
  label,
  checked,
  disabled,
  onChange,
  time,
  glow,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
  time: Date | null | undefined;
  glow: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: glow
          ? "linear-gradient(135deg, rgba(96,165,250,0.16), rgba(167,139,250,0.10), var(--card2))"
          : "var(--card2)",
        boxShadow: glow ? "var(--glow)" : "none",
        transform: glow ? "translateY(-1px)" : "none",
        transition: "transform var(--trans), box-shadow var(--trans), background var(--trans)",
        opacity: disabled ? 0.75 : 1,
      }}
      title={glow ? "Next upcoming prayer" : ""}
    >
      <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span style={{ fontWeight: 900 }}>{label}</span>
      </span>

      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 900 }}>{time ? formatHHMM(time) : "--:--"}</span>
    </label>
  );
}

function FastingTile({
  title,
  time,
  active,
  countdown,
}: {
  title: string;
  time: string;
  active: boolean;
  countdown: string | null;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 12,
        background: active
          ? "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(96,165,250,0.12), rgba(167,139,250,0.08))"
          : "var(--card2)",
        boxShadow: active ? "var(--glow)" : "none",
        transition: "transform var(--trans), box-shadow var(--trans), background var(--trans)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900 }}>{title}</div>
          <div className="subtle" style={{ marginTop: 6 }}>
            {countdown ? <b style={{ color: "var(--text)" }}>Next in {countdown}</b> : "—"}
          </div>
        </div>
        <div style={{ fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{time}</div>
      </div>
    </div>
  );
}

function RamadanGrid({
  startISO,
  selectedISO,
  onSelect,
  dayBadges,
}: {
  startISO: string;
  selectedISO: string;
  onSelect: (iso: string) => void;
  dayBadges?: Record<string, { fast?: boolean; prayer?: boolean; quran?: boolean; percent?: number }>;
}) {
  const dates = useMemo(() => Array.from({ length: 30 }, (_, i) => isoAddDays(startISO, i)), [startISO]);

  function formatDayMonth(iso: string) {
    const d = new Date(iso + "T00:00:00");
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    return `${day} ${mon}`;
  }

  return (
    <div className="card" style={{ minHeight: 0 }}>
      <div className="cardHeader">
        <div>
          <p className="cardTitle">📅 Ramadan (30 Days)</p>
        </div>
        <div className="badge">Tap a day</div>
      </div>

      <hr className="hr" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 10 }}>
        {dates.map((iso, idx) => {
          const isSelected = iso === selectedISO;
          const b = dayBadges?.[iso];

          return (
            <button
              key={iso}
              className="btn"
              onClick={() => onSelect(iso)}
              style={{
                padding: 12,
                borderRadius: 16,
                width: "100%",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(96,165,250,0.22), rgba(167,139,250,0.12), rgba(34,197,94,0.08))"
                  : "var(--card2)",
                boxShadow: isSelected ? "var(--glow)" : "none",
                transform: "none",
              }}
              title={b?.percent != null ? `Completed ${b.percent}%` : ""}
            >
              <div style={{ fontWeight: 900 }}>Day {idx + 1}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{formatDayMonth(iso)}</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8 }}>
                <Dot on={!!b?.fast} />
                <Dot on={!!b?.prayer} />
                <Dot on={!!b?.quran} />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>Dots: Fast • Prayer • Quran</div>
    </div>
  );
}

function Dot({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        display: "inline-block",
        background: on ? "var(--good)" : "rgba(255,255,255,0.18)",
        boxShadow: on ? "0 0 14px rgba(34,197,94,0.25)" : "none",
      }}
    />
  );
}

function ProgressRing({
  percent,
  size = 40,
  stroke = 4,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const radius = size / 2 - 2;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle stroke="var(--border)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={size / 2} cy={size / 2} />
      <circle
        stroke="var(--accent)"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 420ms ease, stroke 220ms ease",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          filter: "drop-shadow(0 0 12px rgba(96,165,250,0.28))",
        }}
      />
    </svg>
  );
}