"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { digits } from "@/lib/i18n";
import { MILESTONES, seasonStats, trophyKey, type Milestone } from "@/lib/milestones";
import { hijriParts, shortDate } from "@/lib/ramadan";
import { celebrate } from "@/lib/celebrate";
import { Icon, SubHead } from "./ui";

/** Watches progress and records milestones as they are reached (mounted once in the app shell). */
export function MilestoneWatcher({ now }: { now: Date }) {
  const { ready, settings, days, t, updateSettings } = useStore();
  const rd = useRamadan(now);
  const year = hijriParts(rd.info.startISO, settings.hijriAdjust).year;
  const stats = useMemo(() => seasonStats(days, settings, rd.info.startISO), [days, settings, rd.info.startISO]);

  useEffect(() => {
    if (!ready || !settings.onboarded) return;
    const reached = MILESTONES.filter((m) => m.measure(stats) >= m.need && !settings.trophies[trophyKey(year, m.id)]);
    const seeded = settings.trophyYears.includes(year);
    if (!reached.length) {
      if (!seeded) updateSettings({ trophyYears: [...settings.trophyYears, year] });
      return;
    }
    const next = { ...settings.trophies };
    for (const m of reached) next[trophyKey(year, m.id)] = rd.today;
    updateSettings({ trophies: next, trophyYears: seeded ? settings.trophyYears : [...settings.trophyYears, year] });
    // Celebrate only progress made from now on, not what existed before this feature
    if (seeded && settings.cheers) {
      const m = reached[reached.length - 1];
      celebrate(`${t("newTrophy", { x: m.title[settings.lang] })} ${m.cheer[settings.lang]}`, true);
    }
  }, [ready, stats, settings.trophies, settings.trophyYears, settings.onboarded, settings.cheers, settings.lang, year, rd.today, t, updateSettings]);

  return null;
}

export default function Trophies({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, days, t } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const year = hijriParts(rd.info.startISO, settings.hijriAdjust).year;
  const stats = useMemo(() => seasonStats(days, settings, rd.info.startISO), [days, settings, rd.info.startISO]);
  const earned = MILESTONES.filter((m) => settings.trophies[trophyKey(year, m.id)]);
  const [open, setOpen] = useState<Milestone | null>(null);

  return (
    <div className="stack-lg">
      <SubHead title={t("trophies")} onBack={onBack} />
      <div className="stack" style={{ gap: 6 }}>
        <p className="num" style={{ fontSize: "2rem", lineHeight: 1 }}>
          {digits(earned.length, lang)} <span className="small muted">/ {digits(MILESTONES.length, lang)}</span>
        </p>
        <p className="small muted">{t("trophiesCount", { n: earned.length, t: MILESTONES.length })}</p>
        <div className="bar">
          <span style={{ width: `${(earned.length / MILESTONES.length) * 100}%` }} />
        </div>
        <p className="tiny faint">{t("trophiesNote")}</p>
      </div>

      <div className="trophy-grid">
        {MILESTONES.map((m) => {
          const date = settings.trophies[trophyKey(year, m.id)];
          const have = Math.min(m.need, m.measure(stats));
          return (
            <button key={m.id} className={`trophy${date ? " won" : ""}`} onClick={() => setOpen(m)} aria-label={`${m.title[lang]}${date ? "" : `, ${t("locked")}`}`}>
              <span className="medal">
                <Icon name={m.icon} size={26} />
              </span>
              <span className="trophy-title">{m.title[lang]}</span>
              {date ? (
                <span className="tiny faint">{shortDate(date, lang)}</span>
              ) : m.need > 1 ? (
                <span className="trophy-progress" aria-hidden>
                  <span style={{ width: `${(have / m.need) * 100}%` }} />
                </span>
              ) : (
                <span className="tiny faint">{t("locked")}</span>
              )}
            </button>
          );
        })}
      </div>

      {open ? (
        <div className="overlay" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <div className="sheet stack" style={{ alignItems: "center", textAlign: "center", gap: 12 }} onClick={(e) => e.stopPropagation()}>
            {(() => {
              const date = settings.trophies[trophyKey(year, open.id)];
              const have = Math.min(open.need, open.measure(stats));
              return (
                <>
                  <span className={`medal big${date ? " won" : ""}`}>
                    <Icon name={open.icon} size={44} />
                  </span>
                  <h2 style={{ fontSize: "1.3rem" }}>{open.title[lang]}</h2>
                  <p className="muted">{open.cheer[lang]}</p>
                  <p className="small">{date ? t("earnedOn", { d: shortDate(date, lang) }) : `${t("locked")}. ${t("progressOf", { n: have, t: open.need })}`}</p>
                  <button className="btn" style={{ width: "100%" }} onClick={() => setOpen(null)}>
                    {t("close")}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
