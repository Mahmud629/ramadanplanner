"use client";

import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { ramadanDates, shortDate } from "@/lib/ramadan";
import { digits } from "@/lib/i18n";
import { dayScore, fastPred, prayerPred, prayersCount, quranPred, ramadanScore, streak } from "@/lib/score";
import { contentForDay } from "@/content";

export default function JourneyView({ now, onOpenDay }: { now: Date; onOpenDay: (iso: string) => void }) {
  const { settings, days, t } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const dates = ramadanDates(rd.info.startISO);
  const upto = Math.min(30, rd.info.dayIndex);
  const from = rd.today > dates[29] ? dates[29] : rd.today;

  const streaks = [
    { label: t("legendFast"), n: streak(days, from, fastPred) },
    { label: t("legendPrayer"), n: streak(days, from, prayerPred) },
    { label: t("legendQuran"), n: streak(days, from, quranPred) },
  ];

  return (
    <div className="stack-lg" style={{ paddingTop: 16 }}>
      <div className="between">
        <div>
          <h1 style={{ fontSize: "1.4rem" }}>{t("journeyTitle")}</h1>
          <p className="small muted">{t("journeyHint")}</p>
        </div>
        {upto >= 1 ? (
          <div style={{ textAlign: "right" }}>
            <div className="num" style={{ fontSize: "1.8rem", lineHeight: 1 }}>
              {digits(ramadanScore(days, rd.info.startISO, upto, settings.khatmGoal), lang)}%
            </div>
            <div className="tiny faint">{t("ramadanScore")}</div>
          </div>
        ) : null}
      </div>

      <div className="days">
        {dates.map((iso, i) => {
          const e = days[iso];
          const n = i + 1;
          const isToday = iso === rd.today;
          const future = iso > rd.today;
          const fast = e?.fast;
          const s = dayScore(e, settings.khatmGoal);
          return (
            <button
              key={iso}
              className={`daycell${isToday ? " today" : ""}${future ? " future" : ""}${n >= 21 && n % 2 === 1 ? " odd" : ""}`}
              onClick={() => onOpenDay(iso)}
              aria-label={`${t("dayOf", { n })}, ${shortDate(iso, lang)}${e ? `, ${s}%` : ""}`}
              title={contentForDay(n).theme[lang]}
              style={e && !future ? { background: `color-mix(in srgb, var(--leaf) ${Math.round(s * 0.22)}%, transparent)` } : undefined}
            >
              <span className="dnum num">{digits(n, lang)}</span>
              <span className="ddate">{shortDate(iso, lang)}</span>
              <span className="pips" aria-hidden>
                <span className={`pip${fast === "done" ? " on" : fast === "excused" ? " ex" : ""}`} />
                <span className={`pip${e && prayersCount(e) === 5 ? " on" : ""}`} />
                <span className={`pip${e && e.quranPages > 0 ? " on" : ""}`} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="row wrap small muted" style={{ gap: 16 }}>
        <span className="row" style={{ gap: 6 }}>
          <span className="pips" style={{ marginTop: 0 }}>
            <span className="pip on" />
            <span className="pip on" />
            <span className="pip on" />
          </span>
          {t("legendFast")}, {t("legendPrayer")}, {t("legendQuran")}
        </span>
        <span className="row" style={{ gap: 6 }}>
          <span className="pip ex" /> {t("excused")}
        </span>
        <span className="row" style={{ gap: 6 }}>
          <span className="pip" style={{ background: "var(--gold)", width: 5, height: 5 }} /> {t("lastTen")}
        </span>
      </div>

      <section className="section">
        <h2>{t("streaks")}</h2>
        <div className="prayer-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {streaks.map((s) => (
            <div key={s.label} className="panel" style={{ padding: 14, textAlign: "center" }}>
              <div className="num" style={{ fontSize: "2rem", lineHeight: 1.1 }}>
                {digits(s.n, lang)}
              </div>
              <div className="tiny muted">
                {s.label}, {t("days")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
