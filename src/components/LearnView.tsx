"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { addDays } from "@/lib/dates";
import { digits } from "@/lib/i18n";
import { contentForDay, hadithRef } from "@/content";
import { DAYS, IFTAR_DUA, QADR_DUA } from "@/content/days";
import { namesForDay } from "@/content/names";
import { DuaCard, HadithBlock, VerseBlock } from "./DailyContent";
import { CheckRow, Icon } from "./ui";
import { useCheer } from "./Cheers";

/** Deterministic shuffle so the right answer isn't always first, but stays put on re-render. */
function order(n: number, seed: number) {
  const idx = Array.from({ length: n }, (_, i) => i);
  let x = seed * 9301 + 49297;
  for (let i = n - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280;
    const j = Math.floor((x / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export default function LearnView({ now, day }: { now: Date; day: number }) {
  const { settings, t, getDay, updateDay, days } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const [selected, setSelected] = useState(day);
  const c = contentForDay(selected);
  const date = addDays(rd.info.startISO, selected - 1);
  const editable = date <= rd.today;
  const entry = getDay(date);
  void days[date];
  const opts = useMemo(() => order(c.quiz.options.length, selected), [c, selected]);
  const names = namesForDay(selected);
  const cheer = useCheer();
  const learnedSoFar = names[names.length - 1].index;

  // Quiz answers can be tried before the day arrives; they're kept in memory only.
  const [localAnswer, setLocalAnswer] = useState<Record<number, number>>({});
  const chosen = editable ? entry.quizAnswer : localAnswer[selected] ?? null;
  const choose = (i: number) => {
    if (chosen !== null) return;
    if (editable) updateDay(date, { quizAnswer: i, lessonRead: true });
    else setLocalAnswer((p) => ({ ...p, [selected]: i }));
  };

  return (
    <div className="stack-lg" style={{ paddingTop: 16 }}>
      <div className="day-switch">
        <button className="icon-btn" aria-label="−1" disabled={selected <= 1} onClick={() => setSelected((d) => Math.max(1, d - 1))}>
          <Icon name="back" size={18} />
        </button>
        <select value={selected} onChange={(e) => setSelected(Number(e.target.value))} aria-label={t("allLessons")}>
          {DAYS.map((d) => (
            <option key={d.day} value={d.day}>
              {t("dayOf", { n: d.day })}
            </option>
          ))}
        </select>
        <button className="icon-btn" aria-label="+1" disabled={selected >= 30} onClick={() => setSelected((d) => Math.min(30, d + 1))}>
          <Icon name="chev" size={18} />
        </button>
      </div>

      <header className="stack" style={{ gap: 4 }}>
        <p className="kicker">{t("todaysJourney")}</p>
        <h1 className="theme-title">{c.theme[lang]}</h1>
      </header>

      <VerseBlock s={c.verse.s} from={c.verse.from} to={c.verse.to} />

      <DuaCard
        title={t("duaOfDay")}
        shareTitle={t("duaCardTitle", { n: selected })}
        dua={c.dua}
        learned={entry.duaLearned}
        disabled={!editable}
        onLearned={() => {
          updateDay(date, { duaLearned: !entry.duaLearned });
          if (!entry.duaLearned) cheer("c_dua");
        }}
      />

      {selected >= 21 && selected !== 21 ? <DuaCard title={t("lastTenPinned")} dua={QADR_DUA} compact shareTitle={t("qadrDuaTitle")} /> : null}

      <HadithBlock text={c.hadith.text[lang]} refText={hadithRef(c.hadith.ref, lang)} />

      <article className="section">
        <p className="kicker">{t("lessonOfDay")}</p>
        <h2 style={{ fontSize: "1.25rem" }}>{c.lesson.title[lang]}</h2>
        <p className="lesson-body">{c.lesson.body[lang]}</p>
        <CheckRow on={entry.lessonRead} disabled={!editable} onToggle={() => {
          updateDay(date, { lessonRead: !entry.lessonRead });
          if (!entry.lessonRead) cheer("c_lesson");
        }}>
          {t("markRead")}
        </CheckRow>
      </article>

      <section className="panel stack" style={{ gap: 12 }}>
        <p className="kicker">{t("quiz")}</p>
        <h3 style={{ fontSize: "1.05rem" }}>{c.quiz.q[lang]}</h3>
        <div className="stack" style={{ gap: 8 }}>
          {opts.map((i) => {
            const o = c.quiz.options[i];
            const isRight = i === c.quiz.answer;
            const picked = chosen === i;
            const reveal = chosen !== null;
            return (
              <button
                key={i}
                className="btn quiz-opt"
                onClick={() => choose(i)}
                style={{
                  borderColor: reveal && isRight ? "var(--leaf)" : reveal && picked ? "var(--rose)" : undefined,
                  background: reveal && isRight ? "var(--leaf-soft)" : reveal && picked ? "var(--rose-soft)" : undefined,
                }}
                aria-pressed={picked}
              >
                {reveal && isRight ? <Icon name="check" size={16} /> : null}
                {o[lang]}
              </button>
            );
          })}
        </div>
        {chosen !== null ? <p className="small">{chosen === c.quiz.answer ? t("correct") : t("wrong")}</p> : null}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t("namesOfAllah")}</h2>
          <span className="tiny muted">{t("namesHint", { n: learnedSoFar })}</span>
        </div>
        <div className="stack" style={{ gap: 0 }}>
          {names.map((n, i) => (
            <div key={n.index} className="between" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--line)" : 0 }}>
              <div style={{ minWidth: 0 }}>
                <div className="tiny faint num">{digits(n.index, lang)}</div>
                <div style={{ fontWeight: 600 }}>{n.translit}</div>
                <div className="small muted">{lang === "bn" ? n.bn : n.en}</div>
              </div>
              <div className="ar gold" lang="ar" style={{ fontSize: "1.8rem", lineHeight: 1.6, flexShrink: 0 }}>
                {n.ar}
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="fold">
        <summary className="fold-head">
          <span style={{ fontWeight: 600 }}>{t("iftarDua")}</span>
          <span className="fold-chev">
            <Icon name="chev" size={18} />
          </span>
        </summary>
        <div className="fold-body">
          <DuaCard title={t("iftarDua")} dua={IFTAR_DUA} shareTitle={t("iftarDua")} />
        </div>
      </details>
    </div>
  );
}
