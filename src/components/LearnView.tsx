"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { addDays } from "@/lib/dates";
import { digits } from "@/lib/i18n";
import { contentForDay } from "@/content";
import { DAYS } from "@/content/days";
import { namesForDay } from "@/content/names";
import { CheckRow, Icon } from "./ui";

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
  const answered = entry.quizAnswer;
  const names = namesForDay(selected);
  const learnedSoFar = names[names.length - 1].index;

  // Quiz answers can be tried before Ramadan too; they're kept in memory only until the day arrives.
  const [localAnswer, setLocalAnswer] = useState<Record<number, number>>({});
  const chosen = editable ? answered : localAnswer[selected] ?? null;
  const choose = (i: number) => {
    if (chosen !== null) return;
    if (editable) updateDay(date, { quizAnswer: i, lessonRead: true });
    else setLocalAnswer((p) => ({ ...p, [selected]: i }));
  };

  return (
    <div className="stack-lg" style={{ paddingTop: 16 }}>
      <div className="between">
        <h1 style={{ fontSize: "1.4rem" }}>{t("lessonOfDay")}</h1>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          style={{ width: "auto" }}
          aria-label={t("allLessons")}
        >
          {DAYS.map((d) => (
            <option key={d.day} value={d.day}>
              {t("dayOf", { n: d.day })}
            </option>
          ))}
        </select>
      </div>

      <article className="section">
        <p className="kicker">{c.theme[lang]}</p>
        <h2 className="theme-title">{c.lesson.title[lang]}</h2>
        <p className="lesson-body">{c.lesson.body[lang]}</p>
        <CheckRow on={entry.lessonRead} disabled={!editable} onToggle={() => updateDay(date, { lessonRead: !entry.lessonRead })}>
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
                className="btn"
                onClick={() => choose(i)}
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
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
              <div>
                <div className="tiny faint num">{digits(n.index, lang)}</div>
                <div style={{ fontWeight: 600 }}>{n.translit}</div>
                <div className="small muted">{lang === "bn" ? n.bn : n.en}</div>
              </div>
              <div className="ar gold" lang="ar" style={{ fontSize: "1.9rem", lineHeight: 1.6 }}>
                {n.ar}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
