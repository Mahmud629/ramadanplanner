"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { downloadCanvas, drawDuaCard, loadCardFonts, shareCanvas, type DuaCardSize } from "@/lib/cardArt";
import { Icon } from "./ui";

export type DuaShareContent = { title: string; ar: string; translit: string; bnPron: string; meaning: { en: string; bn: string }; ref: string };

/** A sheet that turns a dua into a photocard for Facebook/Instagram/WhatsApp stories or posts. */
export function DuaShareSheet({ content, onClose }: { content: DuaShareContent; onClose: () => void }) {
  const { settings, t } = useStore();
  const lang = settings.lang;
  const [size, setSize] = useState<DuaCardSize>("story");
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadCardFonts();
      if (alive && canvas.current)
        await drawDuaCard(canvas.current, {
          lang,
          size,
          title: content.title,
          ar: content.ar,
          pron: lang === "bn" ? content.bnPron : content.translit,
          meaning: content.meaning[lang],
          ref: content.ref,
        });
    })();
    return () => {
      alive = false;
    };
  }, [content, lang, size]);

  const file = `dua-${size}.png`;
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={t("shareDua")} onClick={onClose}>
      <div className="sheet stack" style={{ gap: 14 }} onClick={(e) => e.stopPropagation()}>
        <div className="between">
          <h2>{t("shareDua")}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t("close")}>
            ✕
          </button>
        </div>
        <canvas ref={canvas} width={1080} height={1920} className={`dua-canvas ${size}`} aria-label={content.title} />
        <div className="seg">
          <button aria-pressed={size === "story"} onClick={() => setSize("story")}>
            {t("sizeStory")}
          </button>
          <button aria-pressed={size === "post"} onClick={() => setSize("post")}>
            {t("sizePost")}
          </button>
        </div>
        <div className="row">
          <button className="btn primary" style={{ flex: 1 }} onClick={() => canvas.current && shareCanvas(canvas.current, file, content.title)}>
            <Icon name="share" size={18} /> {t("shareCard")}
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={() => canvas.current && downloadCanvas(canvas.current, file)}>
            <Icon name="save" size={18} /> {t("downloadCard")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** A small round share button that opens the sheet. */
export function DuaShareButton({ content }: { content: DuaShareContent }) {
  const { t } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-label={t("shareDua")} title={t("shareDua")}>
        <Icon name="share" size={18} />
      </button>
      {open ? <DuaShareSheet content={content} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
