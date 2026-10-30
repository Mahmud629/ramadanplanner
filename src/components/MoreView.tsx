"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { ramadanDates } from "@/lib/ramadan";
import { digits } from "@/lib/i18n";
import { bestStreak, prayerPred, prayersCount, ramadanScore } from "@/lib/score";
import { CITIES } from "@/lib/cities";
import { db, type DayEntry, type Method, type Settings } from "@/lib/db";
import { QURAN_SOURCE } from "@/content";
import Moon from "./Moon";
import { Icon, SubHead } from "./ui";

type Sub = "tasbih" | "zakat" | "fitra" | "qada" | "recap" | "settings" | "backup" | "about";

export default function MoreView({ now, initial }: { now: Date; initial?: Sub | null }) {
  const { t } = useStore();
  const [sub, setSub] = useState<Sub | null>(initial ?? null);
  const back = () => setSub(null);

  if (sub === "tasbih") return <Tasbih now={now} onBack={back} />;
  if (sub === "zakat") return <Zakat onBack={back} />;
  if (sub === "fitra") return <Fitra onBack={back} />;
  if (sub === "qada") return <Qada now={now} onBack={back} />;
  if (sub === "recap") return <Recap now={now} onBack={back} />;
  if (sub === "settings") return <SettingsPanel now={now} onBack={back} />;
  if (sub === "backup") return <Backup onBack={back} />;
  if (sub === "about") return <About onBack={back} />;

  const items: { id: Sub; icon: string; label: string }[] = [
    { id: "recap", icon: "star", label: t("recap") },
    { id: "tasbih", icon: "beads", label: t("tasbih") },
    { id: "qada", icon: "calendar", label: t("qada") },
    { id: "fitra", icon: "gift", label: t("fitra") },
    { id: "zakat", icon: "scale", label: t("zakat") },
  ];
  const items2: { id: Sub; icon: string; label: string }[] = [
    { id: "settings", icon: "gear", label: t("settings") },
    { id: "backup", icon: "save", label: t("backup") },
    { id: "about", icon: "info", label: t("about") },
  ];
  const List = ({ list }: { list: typeof items }) => (
    <div className="list">
      {list.map((i) => (
        <button key={i.id} onClick={() => setSub(i.id)}>
          <Icon name={i.icon} />
          {i.label}
          <span className="chev">
            <Icon name="chev" />
          </span>
        </button>
      ))}
    </div>
  );
  return (
    <div className="stack-lg" style={{ paddingTop: 16 }}>
      <h1 style={{ fontSize: "1.4rem" }}>{t("tools")}</h1>
      <List list={items} />
      <List list={items2} />
    </div>
  );
}

/* ---------------- Tasbih ---------------- */
const PRESETS = [
  { ar: "سُبْحَانَ اللَّهِ", en: "SubhanAllah", n: 33 },
  { ar: "الْحَمْدُ لِلَّهِ", en: "Alhamdulillah", n: 33 },
  { ar: "اللَّهُ أَكْبَرُ", en: "Allahu Akbar", n: 34 },
  { ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullah", n: 100 },
  { ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "La ilaha illallah", n: 100 },
  { ar: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", en: "Allahumma salli 'ala Muhammad", n: 100 },
];

function Tasbih({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, t, getDay, updateDay, days } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const [preset, setPreset] = useState(0);
  const [count, setCount] = useState(0);
  const p = PRESETS[preset];
  const today = getDay(rd.today);
  void days[rd.today];

  const tap = () => {
    const next = count + 1;
    setCount(next);
    updateDay(rd.today, (e) => ({ dhikr: e.dhikr + 1 }));
    if (navigator.vibrate) navigator.vibrate(next === p.n ? [40, 60, 40] : 12);
  };

  return (
    <div className="stack-lg">
      <SubHead title={t("tasbih")} onBack={onBack} />
      <div className="chips">
        {PRESETS.map((x, i) => (
          <button key={i} className="chip" aria-pressed={preset === i} onClick={() => { setPreset(i); setCount(0); }}>
            {x.en}
          </button>
        ))}
      </div>
      <button className="tasbih" onClick={tap} aria-label={`${p.en} ${count}`}>
        <span className="stack" style={{ gap: 4, alignItems: "center" }}>
          <span className="ar gold" style={{ textAlign: "center", fontSize: "1.6rem", lineHeight: 1.6 }}>
            {p.ar}
          </span>
          <span className="num" style={{ fontSize: "3.2rem", lineHeight: 1 }}>
            {digits(count, lang)}
          </span>
          <span className="small muted">/ {digits(p.n, lang)}</span>
        </span>
      </button>
      <p className="small muted" style={{ textAlign: "center" }}>
        {t("tapToCount")}
      </p>
      <div className="between">
        <span className="small muted">{t("todayDhikr", { n: today.dhikr })}</span>
        <button className="btn small" onClick={() => setCount(0)}>
          {t("reset")}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Zakat ---------------- */
function MoneyInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="field">
      <span className="muted">{label}</span>
      <input type="number" inputMode="decimal" min={0} value={value || ""} placeholder="0" onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} />
    </label>
  );
}

function fmt(n: number, lang: "en" | "bn") {
  return n.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { maximumFractionDigits: 0 });
}

function Zakat({ onBack }: { onBack: () => void }) {
  const { settings, t, updateSettings } = useStore();
  const lang = settings.lang;
  const cur = settings.zakatPrices.currency;
  const [v, setV] = useState({ cash: 0, gold: 0, silver: 0, business: 0, owed: 0, debts: 0 });
  const silverPrice = settings.zakatPrices.silver;
  const nisab = silverPrice * 612.36;
  const wealth = Math.max(0, v.cash + v.gold + v.silver + v.business + v.owed - v.debts);
  const due = nisab > 0 && wealth >= nisab ? wealth * 0.025 : 0;
  const upd = (k: keyof typeof v) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  return (
    <div className="stack-lg">
      <SubHead title={t("zakat")} onBack={onBack} />
      <div className="stack">
        <MoneyInput label={t("silverPrice")} value={silverPrice} onChange={(n) => updateSettings({ zakatPrices: { ...settings.zakatPrices, silver: n } })} />
        <p className="tiny muted">{t("nisabNote")}</p>
      </div>
      <div className="stack">
        <MoneyInput label={t("cash")} value={v.cash} onChange={upd("cash")} />
        <MoneyInput label={t("goldValue")} value={v.gold} onChange={upd("gold")} />
        <MoneyInput label={t("silverValue")} value={v.silver} onChange={upd("silver")} />
        <MoneyInput label={t("business")} value={v.business} onChange={upd("business")} />
        <MoneyInput label={t("owedToYou")} value={v.owed} onChange={upd("owed")} />
        <MoneyInput label={t("debts")} value={v.debts} onChange={upd("debts")} />
      </div>
      <div className="panel stack" style={{ gap: 8 }}>
        <div className="between small">
          <span className="muted">{t("nisab")}</span>
          <span className="num">{nisab ? `${cur}${fmt(nisab, lang)}` : "—"}</span>
        </div>
        <div className="between small">
          <span className="muted">{t("zakatable")}</span>
          <span className="num">
            {cur}
            {fmt(wealth, lang)}
          </span>
        </div>
        <hr className="rule" />
        <div className="between">
          <span>{t("zakatDue")}</span>
          <span className="num" style={{ fontSize: "1.8rem", color: "var(--gold)" }}>
            {cur}
            {fmt(due, lang)}
          </span>
        </div>
        {!nisab ? <p className="tiny muted">{t("enterSilver")}</p> : wealth < nisab ? <p className="tiny muted">{t("belowNisab")}</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Fitra ---------------- */
function Fitra({ onBack }: { onBack: () => void }) {
  const { settings, t, updateSettings } = useStore();
  const lang = settings.lang;
  const cur = settings.zakatPrices.currency;
  return (
    <div className="stack-lg">
      <SubHead title={t("fitra")} onBack={onBack} />
      <p className="small muted">{t("fitraNote")}</p>
      <MoneyInput label={t("perPerson")} value={settings.fitraPerPerson} onChange={(n) => updateSettings({ fitraPerPerson: n })} />
      <div className="stack" style={{ gap: 6 }}>
        <span className="muted small">{t("people")}</span>
        <div className="stepper">
          <button onClick={() => updateSettings({ fitraPeople: Math.max(1, settings.fitraPeople - 1) })}>−</button>
          <div className="value num">{digits(settings.fitraPeople, lang)}</div>
          <button onClick={() => updateSettings({ fitraPeople: settings.fitraPeople + 1 })}>+</button>
        </div>
      </div>
      <div className="panel between">
        <span>{t("fitraTotal")}</span>
        <span className="num" style={{ fontSize: "1.8rem", color: "var(--gold)" }}>
          {cur}
          {fmt(settings.fitraPerPerson * settings.fitraPeople, lang)}
        </span>
      </div>
    </div>
  );
}

/* ---------------- Qada ---------------- */
function Qada({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, days, t, updateSettings } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const owed = ramadanDates(rd.info.startISO).filter((d) => days[d]?.fast === "excused" || days[d]?.fast === "missed").length;
  const made = settings.qadaMadeUp;
  const remaining = Math.max(0, owed - made);
  return (
    <div className="stack-lg">
      <SubHead title={t("qada")} onBack={onBack} />
      <div className="prayer-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { l: t("owed"), n: owed },
          { l: t("madeUp"), n: made },
          { l: t("remaining"), n: remaining },
        ].map((x) => (
          <div key={x.l} className="panel" style={{ textAlign: "center", padding: 14 }}>
            <div className="num" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
              {digits(x.n, lang)}
            </div>
            <div className="tiny muted">{x.l}</div>
          </div>
        ))}
      </div>
      <div className="stepper">
        <button onClick={() => updateSettings({ qadaMadeUp: Math.max(0, made - 1) })}>−</button>
        <div className="value small muted">{t("madeUp")}</div>
        <button onClick={() => updateSettings({ qadaMadeUp: made + 1 })}>+</button>
      </div>
      <p className="small muted">{t("qadaNote")}</p>
    </div>
  );
}

/* ---------------- Recap ---------------- */
function Recap({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, days, t } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const dates = ramadanDates(rd.info.startISO);
  const es = dates.map((d) => days[d]).filter(Boolean) as DayEntry[];
  const stats = {
    fasts: es.filter((e) => e.fast === "done").length,
    prayers: es.reduce((a, e) => a + prayersCount(e), 0),
    pages: es.reduce((a, e) => a + e.quranPages, 0),
    duas: es.filter((e) => e.duaLearned).length,
    lessons: es.filter((e) => e.lessonRead).length,
    streak: bestStreak(days, dates, prayerPred),
  };
  const score = ramadanScore(days, rd.info.startISO, Math.min(30, rd.info.dayIndex), settings.khatmGoal);
  const year = rd.info.startISO.slice(0, 4);
  const rows: [number, string][] = [
    [stats.fasts, t("fastsKept")],
    [stats.prayers, t("prayersPrayed")],
    [stats.pages, t("pagesOfQuran")],
    [stats.duas, t("duasLearned")],
    [stats.lessons, t("lessonsRead")],
    [stats.streak, t("bestStreak")],
  ];
  const text = `${t("recapTitle", { y: year })}\n` + rows.map(([n, l]) => `${digits(n, lang)} ${l}`).join("\n");
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* cancelled */
    }
  };
  return (
    <div className="stack-lg">
      <SubHead title={t("recap")} onBack={onBack} />
      <div className="scroll stack" style={{ alignItems: "center", textAlign: "center", gap: 14 }}>
        <div style={{ width: 150, height: 150 }}>
          <Moon hijriDay={15} score={score} size={160} />
        </div>
        <h2 style={{ fontSize: "1.3rem" }}>{t("recapTitle", { y: digits(year, lang) })}</h2>
        <div className="num" style={{ fontSize: "2.6rem", lineHeight: 1, color: "var(--gold)" }}>
          {digits(score, lang)}%
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: "100%" }}>
          {rows.map(([n, l]) => (
            <div key={l}>
              <div className="num" style={{ fontSize: "1.6rem", lineHeight: 1.1 }}>
                {digits(n, lang)}
              </div>
              <div className="tiny muted">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="small muted">{t("recapPrivate")}</p>
      <button className="btn" onClick={share}>
        {t("share")}
      </button>
    </div>
  );
}

/* ---------------- Settings ---------------- */
const METHODS: { id: Method; label: string }[] = [
  { id: "Karachi", label: "Karachi (University of Islamic Sciences)" },
  { id: "MuslimWorldLeague", label: "Muslim World League" },
  { id: "UmmAlQura", label: "Umm al-Qura, Makkah" },
  { id: "Egyptian", label: "Egyptian General Authority" },
  { id: "NorthAmerica", label: "ISNA, North America" },
  { id: "MoonsightingCommittee", label: "Moonsighting Committee" },
  { id: "Dubai", label: "Dubai" },
  { id: "Qatar", label: "Qatar" },
  { id: "Kuwait", label: "Kuwait" },
  { id: "Singapore", label: "Singapore, Malaysia" },
  { id: "Turkey", label: "Turkey (Diyanet)" },
];

export function useGps() {
  const { updateSettings } = useStore();
  const [state, setState] = useState<"idle" | "asking" | "denied" | "error">("idle");
  const ask = () => {
    if (!navigator.geolocation) return setState("error");
    setState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState("idle");
        updateSettings({
          locationMode: "gps",
          gps: { lat: pos.coords.latitude, lon: pos.coords.longitude, tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
        });
      },
      (err) => setState(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { timeout: 15000, maximumAge: 6 * 3600 * 1000 },
    );
  };
  return { state, ask };
}

export function LocationPicker() {
  const { settings, t, updateSettings } = useStore();
  const lang = settings.lang;
  const gps = useGps();
  return (
    <div className="stack">
      <div className="row wrap">
        <button className="btn small" aria-pressed={settings.locationMode === "gps"} onClick={gps.ask} style={settings.locationMode === "gps" ? { borderColor: "var(--leaf)" } : undefined}>
          {settings.locationMode === "gps" ? t("gpsActive") : t("useGps")}
        </button>
      </div>
      {gps.state === "denied" || gps.state === "error" ? <p className="tiny" style={{ color: "var(--rose)" }}>{t("gpsDenied")}</p> : null}
      <label className="field">
        <span className="muted">{t("chooseCity")}</span>
        <select
          value={settings.locationMode === "city" ? settings.cityId : ""}
          onChange={(e) => {
            const c = CITIES.find((x) => x.id === e.target.value);
            if (!c) return;
            updateSettings({ locationMode: "city", cityId: c.id, ...(c.country === "BD" ? { method: "Karachi" as Method, hijriAdjust: 1 } : {}) });
          }}
        >
          {settings.locationMode === "gps" ? <option value="">—</option> : null}
          <optgroup label={lang === "bn" ? "বাংলাদেশ" : "Bangladesh"}>
            {CITIES.filter((c) => c.country === "BD").map((c) => (
              <option key={c.id} value={c.id}>
                {c[lang]}
              </option>
            ))}
          </optgroup>
          <optgroup label={lang === "bn" ? "বিশ্ব" : "World"}>
            {CITIES.filter((c) => c.country === "world").map((c) => (
              <option key={c.id} value={c.id}>
                {c[lang]}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
    </div>
  );
}

function SettingsPanel({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, t, updateSettings } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const Seg = <K extends keyof Settings>({ k, opts }: { k: K; opts: { v: Settings[K]; l: string }[] }) => (
    <div className="seg">
      {opts.map((o) => (
        <button key={String(o.v)} aria-pressed={settings[k] === o.v} onClick={() => updateSettings({ [k]: o.v } as Partial<Settings>)}>
          {o.l}
        </button>
      ))}
    </div>
  );
  const NumStep = ({ k, min, max }: { k: "sehriMargin" | "iftarMargin" | "hijriAdjust"; min: number; max: number }) => (
    <div className="stepper" style={{ gridTemplateColumns: "44px 1fr 44px" }}>
      <button onClick={() => updateSettings({ [k]: Math.max(min, settings[k] - 1) })}>−</button>
      <div className="value num" style={{ fontSize: "1.4rem" }}>
        {settings[k] > 0 && k === "hijriAdjust" ? "+" : ""}
        {digits(settings[k], lang)}
      </div>
      <button onClick={() => updateSettings({ [k]: Math.min(max, settings[k] + 1) })}>+</button>
    </div>
  );

  return (
    <div className="stack-lg">
      <SubHead title={t("settings")} onBack={onBack} />

      <section className="section">
        <h2>{t("language")}</h2>
        <Seg k="lang" opts={[{ v: "bn", l: "বাংলা" }, { v: "en", l: "English" }]} />
      </section>

      <section className="section">
        <h2>{t("appearance")}</h2>
        <Seg k="theme" opts={[{ v: "auto", l: t("themeAuto") }, { v: "night", l: t("themeNight") }, { v: "dawn", l: t("themeDawn") }]} />
      </section>

      <section className="section">
        <h2>{t("location")}</h2>
        <LocationPicker />
        <label className="field">
          <span className="muted">{t("method")}</span>
          <select value={settings.method} onChange={(e) => updateSettings({ method: e.target.value as Method })}>
            {METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <span className="muted small">{t("asrMethod")}</span>
        <Seg k="madhab" opts={[{ v: "Hanafi", l: t("hanafi") }, { v: "Shafi", l: t("shafi") }]} />
        <span className="muted small">{t("sehriMargin")}</span>
        <NumStep k="sehriMargin" min={0} max={20} />
        <span className="muted small">{t("iftarMargin")}</span>
        <NumStep k="iftarMargin" min={0} max={10} />
        <p className="tiny muted">{t("marginNote")}</p>
      </section>

      <section className="section">
        <h2>{t("ramadanStart")}</h2>
        <p className="small">{t("expectedStart", { d: new Date(rd.info.startISO + "T00:00:00").toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) })}</p>
        <span className="muted small">{t("hijriAdjust")}</span>
        <NumStep k="hijriAdjust" min={-2} max={2} />
        <p className="tiny muted">{t("hijriAdjustNote")}</p>
        <label className="field">
          <span className="muted">{t("exactStart")}</span>
          <div className="row">
            <input type="date" value={settings.startOverride} onChange={(e) => updateSettings({ startOverride: e.target.value })} />
            {settings.startOverride ? (
              <button className="btn small" onClick={() => updateSettings({ startOverride: "" })}>
                {t("clear")}
              </button>
            ) : null}
          </div>
        </label>
      </section>

      <section className="section">
        <div className="between">
          <h2>{t("reminders")}</h2>
          <button
            className="chip"
            aria-pressed={settings.reminders}
            onClick={async () => {
              const on = !settings.reminders;
              if (on && "Notification" in window && Notification.permission === "default") {
                try {
                  await Notification.requestPermission();
                } catch {
                  /* ignore */
                }
              }
              updateSettings({ reminders: on });
            }}
          >
            {settings.reminders ? t("on") : t("off")}
          </button>
        </div>
        <p className="tiny muted">{t("remindersNote")}</p>
      </section>

      <section className="section">
        <div className="between">
          <h2>{t("analytics")}</h2>
          <button className="chip" aria-pressed={!!settings.analytics} onClick={() => updateSettings({ analytics: !settings.analytics })}>
            {settings.analytics ? t("on") : t("off")}
          </button>
        </div>
        <p className="tiny muted">{t("analyticsNote")}</p>
      </section>
    </div>
  );
}

/* ---------------- Backup ---------------- */
function Backup({ onBack }: { onBack: () => void }) {
  const { t, replaceAll } = useStore();
  const [msg, setMsg] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const download = async () => {
    const data = { app: "ramadan-planner", version: 2, exportedAt: new Date().toISOString(), days: await db.days.toArray(), settings: await db.settings.get("settings") };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ramadan-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const restore = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (data.app !== "ramadan-planner" || !Array.isArray(data.days)) throw new Error("bad file");
      await replaceAll(data.days, data.settings);
      setMsg(t("restored"));
    } catch {
      setMsg(t("restoreFailed"));
    }
  };

  return (
    <div className="stack-lg">
      <SubHead title={t("backup")} onBack={onBack} />
      <button className="btn primary" onClick={download}>
        <Icon name="save" size={18} /> {t("exportData")}
      </button>
      <button className="btn" onClick={() => file.current?.click()}>
        {t("importData")}
      </button>
      <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
      {msg ? <p className="small">{msg}</p> : null}
    </div>
  );
}

/* ---------------- About ---------------- */
function About({ onBack }: { onBack: () => void }) {
  const { t } = useStore();
  return (
    <div className="stack-lg">
      <SubHead title={t("about")} onBack={onBack} />
      <p className="small">{t("disclaimer")}</p>
      <p className="small muted">{t("sources")}</p>
      <p className="tiny faint">{QURAN_SOURCE}</p>
      <p className="small">{t("preparedBy")}</p>
    </div>
  );
}
