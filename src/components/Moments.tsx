"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { countdown, useRamadan } from "@/lib/useRamadan";
import { addDays } from "@/lib/dates";
import { digits } from "@/lib/i18n";
import { NIGHT_ITEMS, type MyDua } from "@/lib/db";
import { IFTAR_DUA, QADR_DUA } from "@/content/days";
import { duaArabic } from "@/content";
import { playChime } from "@/lib/chime";
import Moon from "./Moon";
import { CheckRow, Icon, tap } from "./ui";
import { useCheer } from "./Cheers";

/* ---------------- Iftar moment ---------------- */
export function IftarMoment({ now, onClose }: { now: Date; onClose: () => void }) {
  const { settings, t, updateDay, updateSettings } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const pending = settings.myDuas.filter((d) => !d.answered).slice(0, 3);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    tap(60);
    if (settings.reminders) playChime();
  }, [settings.reminders]);

  const close = (broke: boolean) => {
    if (broke) updateDay(rd.today, (e) => (e.fast ? {} : { fast: "done" }));
    updateSettings({ iftarSeen: rd.today });
    onClose();
  };

  return (
    <div className="moment" role="dialog" aria-modal="true" aria-labelledby="iftar-title">
      <div className="moment-inner">
        <div className="moment-moon">
          <Moon hijriDay={rd.info.hijri.day} score={100} />
        </div>
        <h1 id="iftar-title" className="moment-title">
          {t("iftarTime")}
        </h1>
        <p className="muted" style={{ textAlign: "center" }}>
          {t("fastComplete")}
        </p>

        <div className="stack" style={{ gap: 6, width: "100%" }}>
          <p className="ar gold" lang="ar" style={{ textAlign: "center", fontSize: "1.7rem", lineHeight: 2 }}>
            {IFTAR_DUA.ar}
          </p>
          <p style={{ textAlign: "center" }}>{lang === "bn" ? IFTAR_DUA.bnPron : IFTAR_DUA.translit}</p>
          <p className="small muted" style={{ textAlign: "center" }}>
            {IFTAR_DUA.meaning[lang]}
          </p>
        </div>

        {pending.length ? (
          <div className="inset stack" style={{ gap: 6, width: "100%" }}>
            <p className="small muted">{t("iftarDuaTime")}</p>
            {pending.map((d) => (
              <p key={d.id} className="small">
                {d.text}
              </p>
            ))}
          </div>
        ) : null}

        <div className="stack" style={{ width: "100%", gap: 10 }}>
          <button className="btn primary" onClick={() => close(true)}>
            {t("brokeFast")}
          </button>
          <button className="btn ghost" onClick={() => close(false)}>
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Night plan (last ten nights) ---------------- */
export function NightPlan({ now, night, onClose }: { now: Date; night: number; onClose: () => void }) {
  const { settings, t, getDay, updateDay, days } = useStore();
  const lang = settings.lang;
  const rd = useRamadan(now);
  const date = addDays(rd.info.startISO, night - 1);
  const e = getDay(date);
  void days[date];
  const done = NIGHT_ITEMS.filter((k) => e.night?.[k]).length;
  const cheer = useCheer();

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="night-title" onClick={onClose}>
      <div className="sheet stack-lg" onClick={(ev) => ev.stopPropagation()}>
        <div className="between">
          <div>
            <p className="kicker">{t("nightPlan")}</p>
            <h1 id="night-title" style={{ fontSize: "1.35rem" }}>
              {t("nightTitle", { n: night })}
            </h1>
            <p className="small muted">{night % 2 ? t("oddNightLabel") : t("evenNightLabel")}</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label={t("close")}>
            ✕
          </button>
        </div>

        <div className="fast-times">
          <div>
            <span className="small muted">{t("fajrIn")}</span>
            <span className="num">{digits(countdown(rd.nextFajr.getTime() - now.getTime()), lang)}</span>
          </div>
          <div>
            <span className="small muted">{t("done")}</span>
            <span className="num">
              {digits(done, lang)}/{digits(NIGHT_ITEMS.length, lang)}
            </span>
          </div>
        </div>

        <div className="stack" style={{ gap: 2 }}>
          {NIGHT_ITEMS.map((k) => (
            <CheckRow key={k} on={!!e.night?.[k]} onToggle={() => {
              tap();
              updateDay(date, (x) => ({ night: { ...x.night, [k]: !x.night?.[k] } }));
              if (!e.night?.[k]) {
                if (done + 1 === NIGHT_ITEMS.length) cheer("c_nightAll", undefined, true);
                else cheer("c_night");
              }
            }}>
              {t(`n_${k}` as const)}
            </CheckRow>
          ))}
        </div>

        <div className="scroll stack" style={{ gap: 10, alignItems: "center", textAlign: "center" }}>
          <p className="ar gold" lang="ar" style={{ textAlign: "center", fontSize: "1.6rem", lineHeight: 1.9 }}>
            {duaArabic(QADR_DUA)}
          </p>
          <p className="small">{lang === "bn" ? QADR_DUA.bnPron : QADR_DUA.translit}</p>
          <p className="tiny muted">{QADR_DUA.meaning[lang]}</p>
          <button
            className="tasbih"
            style={{ width: 150, margin: "4px auto 0" }}
            onClick={() => {
              tap(10);
              updateDay(date, (x) => ({ afuwwCount: (x.afuwwCount ?? 0) + 1 }));
            }}
            aria-label={t("afuwwTap")}
          >
            <span className="num" style={{ fontSize: "2.6rem", lineHeight: 1 }}>
              {digits(e.afuwwCount ?? 0, lang)}
            </span>
          </button>
          <p className="tiny faint">{t("afuwwTap")}</p>
        </div>

        <MyDuas />
      </div>
    </div>
  );
}

/* ---------------- My dua list ---------------- */
export function MyDuas() {
  const { settings, t, updateSettings } = useStore();
  const cheer = useCheer();
  const [text, setText] = useState("");
  const list = settings.myDuas;
  const save = (next: MyDua[]) => updateSettings({ myDuas: next });

  const add = () => {
    const v = text.trim();
    if (!v) return;
    save([{ id: `${Date.now()}`, text: v, answered: false, createdAt: Date.now() }, ...list]);
    setText("");
  };

  return (
    <section className="section">
      <h2>{t("myDuas")}</h2>
      <p className="small muted">{t("myDuasHint")}</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("duaPlaceholder")} aria-label={t("myDuas")} />
        <button className="btn primary" type="submit" disabled={!text.trim()}>
          {t("addDua")}
        </button>
      </form>
      {list.length === 0 ? <p className="small faint">{t("noDuas")}</p> : null}
      <div className="stack" style={{ gap: 0 }}>
        {list.map((d, i) => (
          <div key={d.id} className="between" style={{ padding: "8px 0", borderTop: i ? "1px solid var(--line)" : 0, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ textDecoration: d.answered ? "line-through" : undefined, opacity: d.answered ? 0.7 : 1 }}>{d.text}</p>
              <CheckRow on={d.answered} onToggle={() => {
                save(list.map((x) => (x.id === d.id ? { ...x, answered: !x.answered } : x)));
                if (!d.answered) cheer("c_answered", undefined, true);
              }}>
                <span className="small muted">{t("answered")}</span>
              </CheckRow>
            </div>
            <button className="icon-btn" aria-label={t("remove")} onClick={() => save(list.filter((x) => x.id !== d.id))}>
              <Icon name="trash" size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
