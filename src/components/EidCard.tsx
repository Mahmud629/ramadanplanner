"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { ramadanDates } from "@/lib/ramadan";
import { prayersCount } from "@/lib/score";
import type { Lang } from "@/lib/db";
import { downloadCanvas, drawEid, EID_DESIGNS, H, loadCardFonts, shareCanvas, W, type CardStats, type EidDesign } from "@/lib/cardArt";
import type { Key } from "@/lib/i18n";
import { Icon, SubHead } from "./ui";

export default function EidCard({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, days, t, updateSettings } = useStore();
  const rd = useRamadan(now);
  const [lang, setLang] = useState<Lang>(settings.lang);
  const [design, setDesign] = useState<EidDesign>("crescent");
  const [withStats, setWithStats] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  const stats: CardStats = { fasts: 0, prayers: 0, pages: 0 };
  for (const d of ramadanDates(rd.info.startISO)) {
    const e = days[d];
    if (!e) continue;
    if (e.fast === "done") stats.fasts++;
    stats.prayers += prayersCount(e);
    stats.pages += e.quranPages;
  }
  const year = rd.info.hijri.year;

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadCardFonts();
      if (alive && canvas.current) await drawEid(canvas.current, design, { lang, name: settings.eidName.trim(), stats: withStats ? stats : null, year });
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, lang, withStats, settings.eidName, stats.fasts, stats.prayers, stats.pages, year]);

  return (
    <div className="stack-lg">
      <SubHead title={t("eidCard")} onBack={onBack} />
      <canvas ref={canvas} width={W} height={H} className="eid-canvas" aria-label={t("eidCard")} />

      <div className="stack" style={{ gap: 6 }}>
        <span className="muted small">{t("cardDesign")}</span>
        <div className="design-picker" role="radiogroup" aria-label={t("cardDesign")}>
          {EID_DESIGNS.map((d) => (
            <button key={d} role="radio" aria-checked={design === d} className={`design-swatch ${d}`} onClick={() => setDesign(d)}>
              <span className="swatch-art" aria-hidden />
              <span className="tiny">{t(`design_${d}` as Key)}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="muted">{t("yourName")}</span>
        <input type="text" value={settings.eidName} maxLength={40} onChange={(e) => updateSettings({ eidName: e.target.value })} />
      </label>
      <div className="stack" style={{ gap: 6 }}>
        <span className="muted small">{t("cardLang")}</span>
        <div className="seg">
          <button aria-pressed={lang === "bn"} onClick={() => setLang("bn")}>
            বাংলা
          </button>
          <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>
            English
          </button>
        </div>
      </div>
      <button className="chip" aria-pressed={withStats} onClick={() => setWithStats((v) => !v)} style={{ alignSelf: "flex-start" }}>
        {t("includeStats")}
      </button>
      <div className="row">
        <button className="btn primary" style={{ flex: 1 }} onClick={() => canvas.current && shareCanvas(canvas.current, "eid-mubarak.png")}>
          <Icon name="share" size={18} /> {t("shareCard")}
        </button>
        <button className="btn" style={{ flex: 1 }} onClick={() => canvas.current && downloadCanvas(canvas.current, "eid-mubarak.png")}>
          <Icon name="save" size={18} /> {t("downloadCard")}
        </button>
      </div>
    </div>
  );
}
