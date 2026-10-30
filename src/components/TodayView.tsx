"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { countdown, useRamadan } from "@/lib/useRamadan";
import { formatClock, iftarTime, prayerTimes, sehriEnd } from "@/lib/prayer";
import { dayIndexFor, hijriParts, HIJRI_MONTHS, longDate, ramadanDates } from "@/lib/ramadan";
import { AVOIDS, DEEDS, EXTRAS, FARD, type ExcuseReason, type FastStatus } from "@/lib/db";
import { dayScore, pagesPerDay, ramadanScore } from "@/lib/score";
import { digits } from "@/lib/i18n";
import { arabicNumber, contentForDay, duaArabic, duaAudio, duaRef, hadithRef, surahName, verse } from "@/content";
import { IFTAR_DUA, QADR_DUA } from "@/content/days";
import type { Dua } from "@/content/types";
import Moon from "./Moon";
import { AudioButton, ayahAudioUrl, Check, CheckRow, Chip, Icon } from "./ui";

type Props = {
  now: Date;
  /** a specific date opened from the 30-day grid; null = today */
  viewDate: string | null;
  onBackToToday: () => void;
  onOpenLesson: () => void;
};

export default function TodayView({ now, viewDate, onBackToToday, onOpenLesson }: Props) {
  const { settings, days, t, updateDay, getDay } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const { info } = rd;

  const date = viewDate ?? rd.today;
  const isToday = date === rd.today;
  const isFuture = date > rd.today;
  const editable = !isFuture;
  const entry = getDay(date);
  // re-read on change
  void days[date];

  const dayIdx = dayIndexFor(date, info.startISO);
  const inRamadan = dayIdx >= 1 && dayIdx <= 30;
  // Before Ramadan we preview Day 1; after it we keep showing Day 30.
  const contentDay = inRamadan ? dayIdx : dayIdx < 1 ? 1 : 30;
  const c = contentForDay(contentDay);

  const times = useMemo(() => (isToday ? rd.times : prayerTimes(date, settings)), [isToday, rd.times, date, settings]);
  const sehri = isToday ? rd.sehri : sehriEnd(times, settings);
  const iftar = isToday ? rd.iftar : iftarTime(times, settings);
  const hijri = isToday ? info.hijri : hijriParts(date, settings.hijriAdjust);

  const score = dayScore(entry, settings.khatmGoal);
  const soFar = ramadanScore(days, info.startISO, Math.min(info.dayIndex, 30), settings.khatmGoal);
  const clock = (d: Date) => formatClock(d, rd.tz, lang);

  const set = (patch: Parameters<typeof updateDay>[1]) => editable && updateDay(date, patch);

  return (
    <div className="stack-lg">
      {/* ---------- hero ---------- */}
      <section className="hero" aria-label={t("todayScore")}>
        <div className="moon-wrap">
          <Moon hijriDay={hijri.day} score={score} />
          <span className="moon-score num" title={t("todayScore")}>
            {digits(score, lang)}%
          </span>
        </div>

        {inRamadan ? (
          <h1 className="hero-day">{t("dayOf", { n: dayIdx })}</h1>
        ) : dayIdx < 1 ? (
          <>
            <h1 className="hero-day">{info.daysUntil === 1 ? t("ramadanTomorrow") : t("ramadanIn", { n: info.daysUntil })}</h1>
            <p className="small muted">{t("expectedStart", { d: longDate(info.startISO, lang) })}</p>
          </>
        ) : (
          <h1 className="hero-day">{t("afterRamadan")}</h1>
        )}
        <p className="small faint">
          {digits(hijri.day, lang)} {HIJRI_MONTHS[lang][hijri.month - 1]} {digits(hijri.year, lang)}
          {lang === "bn" ? " হিজরি" : " AH"}
        </p>

        {isToday ? (
          <>
            <p className="countdown-label">{rd.next.kind === "iftar" ? t("iftarIn") : t("sehriEndsIn")}</p>
            <p className="countdown num" aria-live="off">
              {digits(countdown(rd.next.at.getTime() - now.getTime()), lang)}
            </p>
          </>
        ) : null}

        <div className="fast-times">
          <div className={isToday && rd.next.kind === "sehri" ? "active" : ""}>
            <div className="small muted">{t("sehriEnds")}</div>
            <div className="num">{clock(sehri)}</div>
          </div>
          <div className={isToday && rd.next.kind === "iftar" ? "active" : ""}>
            <div className="small muted">{t("iftar")}</div>
            <div className="num">{clock(iftar)}</div>
          </div>
        </div>

        {info.dayIndex >= 1 ? (
          <div className="score-line">
            <span>
              {t("todayScore")} <b>{digits(score, lang)}%</b>
            </span>
            <span>
              {t("ramadanScore")} <b>{digits(soFar, lang)}%</b>
            </span>
          </div>
        ) : null}
      </section>

      {/* ---------- notices ---------- */}
      {!isToday ? (
        <div className="notice gold">
          <span>{t("viewingDay", { n: contentDay })}</span>
          <button className="btn small" onClick={onBackToToday}>
            {t("backToToday")}
          </button>
        </div>
      ) : null}
      {isFuture ? <p className="small muted">{t("futureDay")}</p> : null}
      {isToday && dayIdx < 1 ? <p className="small muted">{t("previewNote")}</p> : null}
      {isToday && info.isOddNight && now >= rd.times.maghrib ? (
        <div className="notice gold">
          <span>
            <Icon name="star" size={16} /> {t("oddNightTonight")}
          </span>
        </div>
      ) : null}

      {/* ---------- fast ---------- */}
      {inRamadan ? (
        <section className="section">
          <h2>{t("fast")}</h2>
          <FastControl
            status={entry.fast}
            excuse={entry.excuse}
            disabled={!editable}
            onChange={(fast, excuse) => set({ fast, excuse })}
          />
          <details className="inset">
            <summary className="small" style={{ cursor: "pointer" }}>
              {t("iftarDua")}
            </summary>
            <div className="stack" style={{ marginTop: 10 }}>
              <p className="ar gold" lang="ar">
                {IFTAR_DUA.ar}
              </p>
              <p className="small">{lang === "bn" ? IFTAR_DUA.bnPron : IFTAR_DUA.translit}</p>
              <p className="small muted">{IFTAR_DUA.meaning[lang]}</p>
              <p className="ref">{hadithRef(IFTAR_DUA.ref, lang)}</p>
            </div>
          </details>
        </section>
      ) : null}

      {/* ---------- prayers ---------- */}
      <section className="section">
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
                title={isNext ? t("next") : undefined}
              >
                <span className="pname">{t(p)}</span>
                <span className="ptime num">{clock(times[p])}</span>
                <Check on={on} />
              </button>
            );
          })}
        </div>
        {entry.fast === "excused" && entry.excuse === "period" ? <p className="tiny muted">{t("prayersExcused")}</p> : null}
        <div className="chips">
          {EXTRAS.filter((x) => inRamadan || x !== "taraweeh").map((x) => (
            <Chip key={x} on={entry.extras[x]} disabled={!editable} onToggle={() => set((e) => ({ extras: { ...e.extras, [x]: !e.extras[x] } }))}>
              {t(x)}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---------- today's journey ---------- */}
      <section className="section">
        <p className="kicker">{t("theme")}</p>
        <h2 className="theme-title">{c.theme[lang]}</h2>

        <VerseBlock s={c.verse.s} from={c.verse.from} to={c.verse.to} />

        <DuaCard
          title={t("duaOfDay")}
          dua={c.dua}
          learned={entry.duaLearned}
          disabled={!editable}
          onLearned={() => set((e) => ({ duaLearned: !e.duaLearned }))}
        />

        {inRamadan && dayIdx >= 21 && dayIdx !== 21 ? <DuaCard title={t("lastTenPinned")} dua={QADR_DUA} compact /> : null}

        <div className="stack" style={{ gap: 8 }}>
          <p className="kicker">{t("hadithOfDay")}</p>
          <p className="quote">{c.hadith.text[lang]}</p>
          <p className="ref">{hadithRef(c.hadith.ref, lang)}</p>
        </div>

        <div className="panel stack" style={{ gap: 10 }}>
          <p className="kicker">{t("actionOfDay")}</p>
          <CheckRow on={entry.actionDone} disabled={!editable} onToggle={() => set((e) => ({ actionDone: !e.actionDone }))}>
            {c.action[lang]}
          </CheckRow>
        </div>

        <button className="list" onClick={onOpenLesson} style={{ background: "transparent", textAlign: "left", padding: "14px 16px", display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Icon name="lamp" />
          <span>
            <span className="tiny faint" style={{ display: "block" }}>
              {t("lessonOfDay")}
            </span>
            {c.lesson.title[lang]}
          </span>
          <span className="chev" style={{ marginLeft: "auto" }}>
            <Icon name="chev" />
          </span>
        </button>
      </section>

      {/* ---------- quran ---------- */}
      <section className="section">
        <div className="section-head">
          <h2>{t("quranToday")}</h2>
          <span className="small muted">{t("targetPerDay", { n: pagesPerDay(settings.khatmGoal) })}</span>
        </div>
        <div className="stepper">
          <button aria-label="−" disabled={!editable} onClick={() => set((e) => ({ quranPages: Math.max(0, e.quranPages - 1) }))}>
            −
          </button>
          <div className="value num">
            {digits(entry.quranPages, lang)} <span className="small muted">{t("pages")}</span>
          </div>
          <button aria-label="+" disabled={!editable} onClick={() => set((e) => ({ quranPages: e.quranPages + 1 }))}>
            +
          </button>
        </div>
        <div className="bar">
          <span style={{ width: `${Math.min(100, (entry.quranPages / pagesPerDay(settings.khatmGoal)) * 100)}%` }} />
        </div>
      </section>

      {/* ---------- deeds ---------- */}
      <section className="section">
        <h2>{t("goodDeeds")}</h2>
        <div className="chips">
          {DEEDS.map((d) => (
            <Chip key={d} on={!!entry.deeds[d]} disabled={!editable} onToggle={() => set((e) => ({ deeds: { ...e.deeds, [d]: !e.deeds[d] } }))}>
              {t(d)}
            </Chip>
          ))}
        </div>
        <h3 className="muted" style={{ fontWeight: 500, marginTop: 6 }}>
          {t("avoidTitle")}
        </h3>
        <div className="chips">
          {AVOIDS.map((d) => (
            <Chip key={d} tone="gold" on={!!entry.avoided[d]} disabled={!editable} onToggle={() => set((e) => ({ avoided: { ...e.avoided, [d]: !e.avoided[d] } }))}>
              {t(d)}
            </Chip>
          ))}
        </div>
      </section>

      {/* ---------- reflection ---------- */}
      <section className="section">
        <h2>{t("reflection")}</h2>
        <label className="field">
          <span className="muted">{t("gratefulQ")}</span>
          <textarea value={entry.grateful} disabled={!editable} onChange={(e) => set({ grateful: e.target.value })} />
        </label>
        <label className="field">
          <span className="muted">{t("improveQ")}</span>
          <textarea value={entry.improve} disabled={!editable} onChange={(e) => set({ improve: e.target.value })} />
        </label>
      </section>

      <p className="tiny faint" style={{ textAlign: "center" }}>
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
    <div className="stack" style={{ gap: 10 }}>
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
          <div className="chips" role="radiogroup" aria-label={t("reason")}>
            {(["travel", "illness", "period", "other"] as const).map((r) => (
              <Chip key={r} tone="gold" on={excuse === r} disabled={disabled} onToggle={() => onChange("excused", r)}>
                {t(r)}
              </Chip>
            ))}
          </div>
          <p className="tiny muted">{t("excusedNote")}</p>
        </>
      ) : null}
    </div>
  );
}

export function VerseBlock({ s, from, to }: { s: number; from: number; to: number }) {
  const { settings, t } = useStore();
  const lang = settings.lang;
  const ayahs = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const range = from === to ? `${from}` : `${from}–${to}`;
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="between">
        <p className="kicker">{t("verseOfDay")}</p>
        <AudioButton id={`v-${s}-${from}`} urls={ayahs.map((a) => ayahAudioUrl(s, a))} />
      </div>
      <p className="ar" lang="ar">
        {ayahs.map((a) => (
          <span key={a}>
            {verse(s, a).ar} <span className="gold">﴿{arabicNumber(a)}﴾</span>{" "}
          </span>
        ))}
      </p>
      <p className="quote">
        {ayahs.map((a, i) => (
          <span key={a}>
            {ayahs.length > 1 ? <sup className="faint">{digits(a, lang)} </sup> : null}
            {verse(s, a)[lang]}
            {i < ayahs.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
      <p className="ref">
        {surahName(s, lang)} {digits(`${s}:${range}`, lang)}
      </p>
    </div>
  );
}

export function DuaCard({
  title,
  dua,
  learned,
  onLearned,
  disabled,
  compact,
}: {
  title: string;
  dua: Dua;
  learned?: boolean;
  onLearned?: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { settings, t } = useStore();
  const lang = settings.lang;
  const [showPron, setShowPron] = useState(!compact);
  const audio = duaAudio(dua);
  return (
    <div className="scroll stack" style={{ gap: 12 }}>
      <div className="between">
        <p className="kicker">{title}</p>
        {audio ? <AudioButton id={`d-${audio[0].s}-${audio[0].a}`} urls={audio.map((x) => ayahAudioUrl(x.s, x.a))} /> : null}
      </div>
      <p className="ar gold" lang="ar" style={{ fontSize: compact ? "1.5rem" : "1.9rem" }}>
        {duaArabic(dua)}
      </p>
      {showPron ? (
        <div className="stack" style={{ gap: 4 }}>
          <span className="tiny faint">{t("pronunciation")}</span>
          <p>{lang === "bn" ? dua.bnPron : dua.translit}</p>
        </div>
      ) : (
        <button className="btn small ghost" style={{ alignSelf: "flex-start", paddingLeft: 0 }} onClick={() => setShowPron(true)}>
          {t("showPron")}
        </button>
      )}
      <div className="stack" style={{ gap: 4 }}>
        <span className="tiny faint">{t("meaning")}</span>
        <p className="muted">{dua.meaning[lang]}</p>
      </div>
      <p className="ref">{duaRef(dua, lang)}</p>
      {onLearned ? (
        <>
          <hr className="rule" />
          <CheckRow on={!!learned} onToggle={onLearned} disabled={disabled}>
            {t("learned")}
          </CheckRow>
        </>
      ) : null}
    </div>
  );
}

export { ramadanDates };
