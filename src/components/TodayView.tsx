"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { countdown, useRamadan } from "@/lib/useRamadan";
import { formatClock, iftarTime, prayerTimes, sehriEnd } from "@/lib/prayer";
import { dayIndexFor, hijriParts, HIJRI_MONTHS, longDate } from "@/lib/ramadan";
import { AVOIDS, DEEDS, EXTRAS, FARD, type ExcuseReason, type FastStatus } from "@/lib/db";
import { dayScore, pagesPerDay, ramadanScore } from "@/lib/score";
import { digits } from "@/lib/i18n";
import { contentForDay, duaArabic } from "@/content";
import { IFTAR_DUA } from "@/content/days";
import Moon from "./Moon";
import { DuaCard } from "./DailyContent";
import { NightPlan } from "./Moments";
import { Check, CheckRow, Chip, Icon, tap } from "./ui";

type Props = {
  now: Date;
  /** a specific date opened from the 30-day grid; null = today */
  viewDate: string | null;
  onBackToToday: () => void;
  onOpenLearn: () => void;
  onOpenEid: () => void;
};

export default function TodayView({ now, viewDate, onBackToToday, onOpenLearn, onOpenEid }: Props) {
  const { settings, days, t, updateDay, getDay } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const { info } = rd;
  const [moreOpen, setMoreOpen] = useState(false);
  const [nightOpen, setNightOpen] = useState(false);

  const date = viewDate ?? rd.today;
  const isToday = date === rd.today;
  const isFuture = date > rd.today;
  const editable = !isFuture;
  const entry = getDay(date);
  void days[date];

  const dayIdx = dayIndexFor(date, info.startISO);
  const inRamadan = dayIdx >= 1 && dayIdx <= 30;
  const contentDay = inRamadan ? dayIdx : dayIdx < 1 ? 1 : 30;
  const c = contentForDay(contentDay);

  const times = useMemo(() => (isToday ? rd.times : prayerTimes(date, settings)), [isToday, rd.times, date, settings]);
  const sehri = isToday ? rd.sehri : sehriEnd(times, settings);
  const iftar = isToday ? rd.iftar : iftarTime(times, settings);
  const hijri = isToday ? info.hijri : hijriParts(date, settings.hijriAdjust);

  const score = dayScore(entry, settings.khatmGoal);
  const soFar = ramadanScore(days, info.startISO, Math.min(info.dayIndex, 30), settings.khatmGoal);
  const clock = (d: Date) => formatClock(d, rd.tz, lang);
  const set = (patch: Parameters<typeof updateDay>[1]) => {
    if (!editable) return;
    tap();
    updateDay(date, patch);
  };

  // Show the iftar dua by itself around iftar time, so it's there when it's needed.
  const msToIftar = rd.iftar.getTime() - now.getTime();
  const iftarSoon = isToday && inRamadan && msToIftar < 20 * 60000 && msToIftar > -40 * 60000;
  const night = isToday ? rd.night : null;
  const eidSoon = isToday && info.dayIndex >= 28 && info.dayIndex <= 33;

  const pagesTarget = pagesPerDay(settings.khatmGoal);
  const deedsDone = DEEDS.filter((d) => entry.deeds[d]).length + AVOIDS.filter((d) => entry.avoided[d]).length;
  const periodExcused = entry.fast === "excused" && entry.excuse === "period";

  return (
    <div className="today">
      {/* ---------- hero: moon + what's next ---------- */}
      <section className="hero-row" aria-label={t("todayScore")}>
        <div className="moon-sm">
          <Moon hijriDay={hijri.day} score={score} />
          <span className="moon-score num" title={t("todayScore")}>
            {digits(score, lang)}%
          </span>
        </div>
        <div className="hero-text">
          {inRamadan ? (
            <h1 className="hero-day">{t("dayOf", { n: dayIdx })}</h1>
          ) : dayIdx < 1 ? (
            <h1 className="hero-day">{info.daysUntil === 1 ? t("ramadanTomorrow") : t("ramadanIn", { n: info.daysUntil })}</h1>
          ) : (
            <h1 className="hero-day">{t("afterRamadan")}</h1>
          )}
          <p className="tiny faint">
            {digits(hijri.day, lang)} {HIJRI_MONTHS[lang][hijri.month - 1]} {digits(hijri.year, lang)}
            {lang === "bn" ? " হিজরি" : " AH"}
          </p>
          {isToday ? (
            <>
              <p className="countdown-label">{rd.next.kind === "iftar" ? t("iftarIn") : t("sehriEndsIn")}</p>
              <p className="countdown num">{digits(countdown(rd.next.at.getTime() - now.getTime()), lang)}</p>
            </>
          ) : (
            <p className="small muted" style={{ marginTop: 6 }}>
              {longDate(date, lang)}
            </p>
          )}
        </div>
      </section>

      <div className="fast-times">
        <div className={isToday && rd.next.kind === "sehri" ? "active" : ""}>
          <span className="small muted">{t("sehriEnds")}</span>
          <span className="num">{clock(sehri)}</span>
        </div>
        <div className={isToday && rd.next.kind === "iftar" ? "active" : ""}>
          <span className="small muted">{t("iftar")}</span>
          <span className="num">{clock(iftar)}</span>
        </div>
        {info.dayIndex >= 1 ? (
          <div>
            <span className="small muted">{t("ramadanScoreShort")}</span>
            <span className="num">{digits(soFar, lang)}%</span>
          </div>
        ) : null}
      </div>

      {/* ---------- one contextual card at most ---------- */}
      {!isToday ? (
        <div className="notice gold">
          <span>{isFuture ? t("futureDay") : t("viewingDay", { n: contentDay })}</span>
          <button className="btn small" onClick={onBackToToday}>
            {t("backToToday")}
          </button>
        </div>
      ) : iftarSoon ? (
        <DuaCard title={t("iftarDua")} dua={IFTAR_DUA} />
      ) : night ? (
        <button className="notice gold night-card" onClick={() => setNightOpen(true)}>
          <span className="row" style={{ gap: 10, textAlign: "left" }}>
            <Icon name="star" size={20} />
            <span>
              <b style={{ display: "block" }}>{t("nightTitle", { n: night })}</b>
              <span className="small">{night % 2 ? t("oddNightLabel") : t("evenNightLabel")}</span>
            </span>
          </span>
          <span className="btn small">{t("nightPlan")}</span>
        </button>
      ) : eidSoon ? (
        <div className="notice gold">
          <span>{t("eidPrompt")}</span>
          <button className="btn small" onClick={onOpenEid}>
            {t("makeCard")}
          </button>
        </div>
      ) : null}
      {nightOpen && night ? <NightPlan now={now} night={night} onClose={() => setNightOpen(false)} /> : null}

      {/* ---------- fast ---------- */}
      {inRamadan ? (
        <section className="block">
          <h2>{t("fast")}</h2>
          <FastControl status={entry.fast} excuse={entry.excuse} disabled={!editable} onChange={(fast, excuse) => set({ fast, excuse })} />
        </section>
      ) : null}

      {/* ---------- prayers ---------- */}
      <section className="block">
        <div className="section-head">
          <h2>{t("prayers")}</h2>
          <span className="tiny faint">
            {t("sunrise")} {clock(times.sunrise)}
          </span>
        </div>
        <div className="prayer-grid">
          {FARD.map((p) => {
            const on = entry.prayers[p];
            const isNext = isToday && rd.nextPrayer === p;
            return (
              <button
                key={p}
                className={`prayer${on ? " on" : ""}${isNext && !on ? " next" : ""}`}
                role="checkbox"
                aria-checked={on}
                disabled={!editable}
                onClick={() => set((e) => ({ prayers: { ...e.prayers, [p]: !e.prayers[p] } }))}
              >
                <span className="pname">{t(p)}</span>
                <span className="ptime num">{clock(times[p])}</span>
                <Check on={on} />
              </button>
            );
          })}
        </div>
        {periodExcused ? <p className="tiny muted">{t("prayersExcused")}</p> : null}
        <div className="chips scroll-x">
          {EXTRAS.filter((x) => inRamadan || x !== "taraweeh").map((x) => (
            <Chip key={x} on={entry.extras[x]} disabled={!editable} onToggle={() => set((e) => ({ extras: { ...e.extras, [x]: !e.extras[x] } }))}>
              {t(x)}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---------- quran: one row ---------- */}
      <section className="block">
        <div className="quran-row">
          <div style={{ minWidth: 0 }}>
            <h2>{t("quranToday")}</h2>
            <p className="tiny muted">
              {digits(entry.quranPages, lang)} / {digits(pagesTarget, lang)} {t("pages")}
            </p>
          </div>
          <div className="mini-stepper">
            <button aria-label={t("lessPage")} disabled={!editable} onClick={() => set((e) => ({ quranPages: Math.max(0, e.quranPages - 1) }))}>
              −
            </button>
            <span className="num">{digits(entry.quranPages, lang)}</span>
            <button aria-label={t("addPage")} disabled={!editable} onClick={() => set((e) => ({ quranPages: e.quranPages + 1 }))}>
              +
            </button>
          </div>
        </div>
        <div className="bar">
          <span style={{ width: `${Math.min(100, (entry.quranPages / pagesTarget) * 100)}%` }} />
        </div>
      </section>

      {/* ---------- today's dua (short) + link to the full journey ---------- */}
      <section className="dua-mini" aria-label={t("duaOfDay")}>
        <div className="between">
          <p className="kicker">{t("duaOfDay")}</p>
          <span className="tiny faint">{c.theme[lang]}</span>
        </div>
        <button className="dua-mini-text" onClick={onOpenLearn}>
          <span className="ar gold clamp-2" lang="ar">
            {duaArabic(c.dua)}
          </span>
          <span className="small muted clamp-2">{c.dua.meaning[lang]}</span>
        </button>
        <div className="between">
          <CheckRow on={entry.duaLearned} disabled={!editable} onToggle={() => set((e) => ({ duaLearned: !e.duaLearned }))}>
            {t("learned")}
          </CheckRow>
          <button className="btn small" onClick={onOpenLearn}>
            {t("openJourney")}
            <Icon name="chev" size={16} />
          </button>
        </div>
      </section>

      {/* ---------- today's action ---------- */}
      <section className="block">
        <p className="kicker">{t("actionOfDay")}</p>
        <CheckRow on={entry.actionDone} disabled={!editable} onToggle={() => set((e) => ({ actionDone: !e.actionDone }))}>
          {c.action[lang]}
        </CheckRow>
      </section>

      {/* ---------- good deeds + reflection, folded away ---------- */}
      <section className="fold">
        <button className="fold-head" aria-expanded={moreOpen} onClick={() => setMoreOpen((v) => !v)}>
          <span>
            <span style={{ display: "block", fontWeight: 600 }}>{t("deedsAndReflection")}</span>
            <span className="tiny muted">{deedsDone > 0 ? t("deedsCount", { n: deedsDone }) : t("deedsHint")}</span>
          </span>
          <span className={`fold-chev${moreOpen ? " open" : ""}`}>
            <Icon name="chev" size={18} />
          </span>
        </button>
        {moreOpen ? (
          <div className="fold-body">
            <div className="chips">
              {DEEDS.map((d) => (
                <Chip key={d} on={!!entry.deeds[d]} disabled={!editable} onToggle={() => set((e) => ({ deeds: { ...e.deeds, [d]: !e.deeds[d] } }))}>
                  {t(d)}
                </Chip>
              ))}
            </div>
            <h3 className="muted" style={{ fontWeight: 500 }}>
              {t("avoidTitle")}
            </h3>
            <div className="chips">
              {AVOIDS.map((d) => (
                <Chip key={d} tone="gold" on={!!entry.avoided[d]} disabled={!editable} onToggle={() => set((e) => ({ avoided: { ...e.avoided, [d]: !e.avoided[d] } }))}>
                  {t(d)}
                </Chip>
              ))}
            </div>
            <label className="field">
              <span className="muted">{t("gratefulQ")}</span>
              <textarea value={entry.grateful} disabled={!editable} onChange={(e) => updateDay(date, { grateful: e.target.value })} />
            </label>
            <label className="field">
              <span className="muted">{t("improveQ")}</span>
              <textarea value={entry.improve} disabled={!editable} onChange={(e) => updateDay(date, { improve: e.target.value })} />
            </label>
          </div>
        ) : null}
      </section>

      <p className="tiny faint" style={{ textAlign: "center", paddingTop: 4 }}>
        {t("preparedBy")}
      </p>
    </div>
  );
}

function FastControl({
  status,
  excuse,
  disabled,
  onChange,
}: {
  status: FastStatus;
  excuse?: ExcuseReason;
  disabled: boolean;
  onChange: (s: FastStatus, e?: ExcuseReason) => void;
}) {
  const { t } = useStore();
  const opts: { v: Exclude<FastStatus, null>; label: string }[] = [
    { v: "done", label: t("fasted") },
    { v: "excused", label: t("excused") },
    { v: "missed", label: t("missed") },
  ];
  return (
    <>
      <div className="seg" role="group" aria-label={t("fast")}>
        {opts.map((o) => (
          <button
            key={o.v}
            className={o.v}
            aria-pressed={status === o.v}
            disabled={disabled}
            onClick={() => onChange(status === o.v ? null : o.v, o.v === "excused" ? excuse ?? "travel" : undefined)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {status === "excused" ? (
        <>
          <div className="chips scroll-x" role="radiogroup" aria-label={t("reason")}>
            {(["travel", "illness", "period", "other"] as const).map((r) => (
              <Chip key={r} tone="gold" on={excuse === r} disabled={disabled} onToggle={() => onChange("excused", r)}>
                {t(r)}
              </Chip>
            ))}
          </div>
          <p className="tiny muted">{t("excusedNote")}</p>
        </>
      ) : null}
    </>
  );
}
