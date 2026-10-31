"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { ramadanDates } from "@/lib/ramadan";
import { digits } from "@/lib/i18n";
import { juzForPage, KHATM_PAGES, pagesPerDay } from "@/lib/score";
import { arabicNumber, MEMORISE, surahName, verse } from "@/content";
import { AudioButton, ayahAudioUrl, Icon } from "./ui";
import { useCheer } from "./Cheers";

export default function QuranView({ now }: { now: Date }) {
  const { settings, days, t, updateSettings } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const goal = settings.khatmGoal;
  const dates = ramadanDates(rd.info.startISO);
  const read = dates.reduce((a, d) => a + (days[d]?.quranPages ?? 0), 0);
  const target = KHATM_PAGES * goal;
  const elapsed = Math.min(30, Math.max(0, rd.info.dayIndex));
  const expected = Math.min(target, pagesPerDay(goal) * elapsed);
  const behind = expected - read;
  // pages a day needed from today (inclusive) to still reach the goal by day 30
  const daysLeft = Math.max(1, 30 - elapsed + 1);
  const needPerDay = Math.ceil(Math.max(0, target - read) / daysLeft);
  const inCurrentKhatm = read >= target ? KHATM_PAGES : read % KHATM_PAGES;
  const khatmsDone = Math.floor(read / KHATM_PAGES);
  const juzReached = inCurrentKhatm === 0 ? 0 : juzForPage(inCurrentKhatm);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="stack-lg" style={{ paddingTop: 16 }}>
      <h1 style={{ fontSize: "1.4rem" }}>{t("khatmPlanner")}</h1>

      <section className="section">
        <p className="muted">{t("khatmGoal")}</p>
        <div className="seg">
          {[1, 2, 3].map((g) => (
            <button key={g} aria-pressed={goal === g} onClick={() => updateSettings({ khatmGoal: g })}>
              {digits(g, lang)} {t("times")}
            </button>
          ))}
        </div>
        <div className="between">
          <span className="num" style={{ fontSize: "2rem" }}>
            {digits(read, lang)}
            <span className="small muted"> / {digits(target, lang)}</span>
          </span>
          <span className="small muted">{t("targetPerDay", { n: pagesPerDay(goal) })}</span>
        </div>
        <div className="bar">
          <span style={{ width: `${Math.min(100, (read / target) * 100)}%` }} />
        </div>
        {elapsed > 0 ? <p className="small muted">{behind > 0 ? t("behind", { n: behind, d: needPerDay, p: Math.ceil(needPerDay / 5) }) : t("ahead")}</p> : null}

        <div>
          <p className="small muted" style={{ marginBottom: 8 }}>
            {t("juz")} {khatmsDone > 0 && read < target ? `(${digits(khatmsDone + 1, lang)})` : ""}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5 }}>
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="num tiny"
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  background: i < juzReached ? "var(--gold)" : "var(--bg-deep)",
                  color: i < juzReached ? "var(--on-gold)" : "var(--ink-3)",
                }}
              >
                {digits(i + 1, lang)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2>{t("memorise")}</h2>
        <p className="small muted">{t("memoriseHint")}</p>
        <div className="list">
          {MEMORISE.map((m) => {
            const st = settings.memorised[m.id];
            const name = m.id === "kursi" ? t("ayatKursi") : surahName(m.s, lang);
            const isOpen = open === m.id;
            return (
              <div key={m.id} style={{ borderTop: m.id === MEMORISE[0].id ? 0 : "1px solid var(--line)" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: 0, background: "transparent", textAlign: "left" }}
                >
                  <span
                    className="dot-check"
                    style={{
                      background: st === "done" ? "var(--leaf)" : st === "learning" ? "var(--gold-soft)" : undefined,
                      borderColor: st === "done" ? "var(--leaf)" : st === "learning" ? "var(--gold)" : undefined,
                      color: "var(--bg)",
                    }}
                  >
                    {st === "done" ? <Icon name="check" size={14} /> : null}
                  </span>
                  <span style={{ flex: 1 }}>
                    {name}
                    <span className="tiny faint" style={{ display: "block" }}>
                      {st === "done" ? t("memorised") : st === "learning" ? t("learning") : t("notStarted")}
                    </span>
                  </span>
                  <span className="ar" style={{ fontSize: "1.2rem", lineHeight: 1.4 }}>
                    {m.id === "kursi" ? "آيَةُ الْكُرْسِيِّ" : `سُورَةُ ${verseSurahArabic(m.s)}`}
                  </span>
                </button>
                {isOpen ? <SurahPanel s={m.s} from={m.from} to={m.to} id={m.id} /> : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const SURAH_AR: Record<number, string> = {
  1: "الفَاتِحَة", 105: "الفِيل", 106: "قُرَيْش", 107: "المَاعُون", 108: "الكَوْثَر", 109: "الكَافِرُون", 110: "النَّصْر", 111: "المَسَد", 112: "الإِخْلَاص", 113: "الفَلَق", 114: "النَّاس",
};
function verseSurahArabic(s: number) {
  return SURAH_AR[s] ?? "";
}

function SurahPanel({ s, from, to, id }: { s: number; from: number; to: number; id: string }) {
  const { settings, t, updateSettings } = useStore();
  const lang = settings.lang;
  const ayahs = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const st = settings.memorised[id];
  const cheer = useCheer();
  const setSt = (v: "learning" | "done" | null) => {
    if (v === "done" && st !== "done") cheer("c_memorised", { x: id === "kursi" ? t("ayatKursi") : surahName(s, lang) }, true);
    const next = { ...settings.memorised };
    if (v) next[id] = v;
    else delete next[id];
    updateSettings({ memorised: next });
  };
  return (
    <div className="stack" style={{ padding: "0 16px 18px", gap: 14 }}>
      <AudioButton id={`m-${id}`} urls={ayahs.map((a) => ayahAudioUrl(s, a))} label={t("playAll")} />
      {ayahs.map((a) => {
        const v = verse(s, a);
        return (
          <div key={a} className="stack" style={{ gap: 4 }}>
            <p className="ar" lang="ar" style={{ fontSize: "1.6rem" }}>
              {v.ar} <span className="gold">﴿{arabicNumber(a)}﴾</span>
            </p>
            <p className="small faint" style={{ fontStyle: "italic" }}>
              {v.tr}
            </p>
            <p className="small muted">{v[lang]}</p>
          </div>
        );
      })}
      <div className="seg">
        <button aria-pressed={!st} onClick={() => setSt(null)}>
          {t("notStarted")}
        </button>
        <button aria-pressed={st === "learning"} onClick={() => setSt("learning")}>
          {t("learning")}
        </button>
        <button className="done" aria-pressed={st === "done"} onClick={() => setSt("done")}>
          {t("memorised")}
        </button>
      </div>
    </div>
  );
}
