"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { digits } from "@/lib/i18n";
import { arabicNumber, duaArabic, duaAudio, duaRef, hadithRef, surahName, verse } from "@/content";
import type { Dua } from "@/content/types";
import { AudioButton, ayahAudioUrl, CheckRow } from "./ui";

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
  dua: Dua | { ar: string; translit: string; bnPron: string; meaning: { en: string; bn: string }; ref: string };
  learned?: boolean;
  onLearned?: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { settings, t } = useStore();
  const lang = settings.lang;
  const [showPron, setShowPron] = useState(!compact);
  const isDua = "kind" in dua;
  const audio = isDua ? duaAudio(dua) : null;
  const ar = isDua ? duaArabic(dua) : dua.ar;
  const ref = isDua ? duaRef(dua, lang) : hadithRef(dua.ref, lang);
  return (
    <div className="scroll stack" style={{ gap: 12 }}>
      <div className="between">
        <p className="kicker">{title}</p>
        {audio ? <AudioButton id={`d-${audio[0].s}-${audio[0].a}`} urls={audio.map((x) => ayahAudioUrl(x.s, x.a))} /> : null}
      </div>
      <p className="ar gold" lang="ar" style={{ fontSize: compact ? "1.5rem" : "1.85rem" }}>
        {ar}
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
      <p className="ref">{ref}</p>
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

export function HadithBlock({ text, refText }: { text: string; refText: string }) {
  const { t } = useStore();
  return (
    <div className="stack" style={{ gap: 8 }}>
      <p className="kicker">{t("hadithOfDay")}</p>
      <p className="quote">{text}</p>
      <p className="ref">{refText}</p>
    </div>
  );
}
