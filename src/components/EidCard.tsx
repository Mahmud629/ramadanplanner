"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useRamadan } from "@/lib/useRamadan";
import { ramadanDates } from "@/lib/ramadan";
import { digits } from "@/lib/i18n";
import { prayersCount } from "@/lib/score";
import type { Lang } from "@/lib/db";
import { SubHead } from "./ui";

const W = 1080;
const H = 1350;

const STYLES = {
  night: { bg1: "#0d2c29", bg2: "#071816", ink: "#f1e7cf", soft: "rgba(241,231,207,0.72)", gold: "#e0b355", line: "rgba(224,179,85,0.35)" },
  dawn: { bg1: "#f4f7f1", bg2: "#dce8de", ink: "#0f2d2a", soft: "rgba(15,45,42,0.7)", gold: "#a16d0f", line: "rgba(161,109,15,0.35)" },
};

type Stats = { fasts: number; prayers: number; pages: number };

export default function EidCard({ now, onBack }: { now: Date; onBack: () => void }) {
  const { settings, days, t, updateSettings } = useStore();
  const rd = useRamadan(now);
  const [lang, setLang] = useState<Lang>(settings.lang);
  const [style, setStyle] = useState<keyof typeof STYLES>("night");
  const [withStats, setWithStats] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canShare, setCanShare] = useState(false);

  const dates = ramadanDates(rd.info.startISO);
  const stats: Stats = { fasts: 0, prayers: 0, pages: 0 };
  for (const d of dates) {
    const e = days[d];
    if (!e) continue;
    if (e.fast === "done") stats.fasts++;
    stats.prayers += prayersCount(e);
    stats.pages += e.quranPages;
  }

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    let alive = true;
    (async () => {
      try {
        await Promise.all([
          document.fonts.load('600 110px "Hind Siliguri"', "ঈদ মোবারক Eid"),
          document.fonts.load('400 80px "Amiri Quran"', "عيد مبارك"),
          document.fonts.load('500 80px "BN Digits"', "০১২"),
          document.fonts.load('500 80px "Fraunces Variable"', "012"),
        ]);
      } catch {
        /* draw with whatever is available */
      }
      if (alive) draw(c, { lang, style, name: settings.eidName.trim(), stats: withStats ? stats : null, year: rd.info.hijri.year });
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, style, withStats, settings.eidName, stats.fasts, stats.prayers, stats.pages]);

  useEffect(() => {
    try {
      const f = new File([new Blob()], "x.png", { type: "image/png" });
      setCanShare(!!navigator.canShare?.({ files: [f] }));
    } catch {
      setCanShare(false);
    }
  }, []);

  const toBlob = () => new Promise<Blob | null>((res) => canvas.current?.toBlob(res, "image/png"));
  const filename = "eid-mubarak.png";

  const download = async () => {
    const b = await toBlob();
    if (!b) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  };
  const share = async () => {
    const b = await toBlob();
    if (!b) return;
    try {
      await navigator.share({ files: [new File([b], filename, { type: "image/png" })] });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="stack-lg">
      <SubHead title={t("eidCard")} onBack={onBack} />
      <canvas ref={canvas} width={W} height={H} className="eid-canvas" aria-label={t("eidCard")} />
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
      <div className="stack" style={{ gap: 6 }}>
        <span className="muted small">{t("cardStyle")}</span>
        <div className="seg">
          <button aria-pressed={style === "night"} onClick={() => setStyle("night")}>
            {t("themeNight")}
          </button>
          <button aria-pressed={style === "dawn"} onClick={() => setStyle("dawn")}>
            {t("themeDawn")}
          </button>
        </div>
      </div>
      <button className="chip" aria-pressed={withStats} onClick={() => setWithStats((v) => !v)} style={{ alignSelf: "flex-start" }}>
        {t("includeStats")}
      </button>
      <div className="row">
        <button className="btn primary" style={{ flex: 1 }} onClick={download}>
          {t("downloadCard")}
        </button>
        {canShare ? (
          <button className="btn" style={{ flex: 1 }} onClick={share}>
            {t("shareCard")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function draw(c: HTMLCanvasElement, o: { lang: Lang; style: keyof typeof STYLES; name: string; stats: Stats | null; year: number }) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const S = STYLES[o.style];
  const bn = o.lang === "bn";
  const latin = (w: number, px: number) => `${w} ${px}px "Hind Siliguri", system-ui, sans-serif`;
  const text = (w: number, px: number) => `${w} ${px}px "BN Digits", "Hind Siliguri", system-ui, sans-serif`;
  const numFont = (px: number) => `500 ${px}px "Fraunces Variable", "BN Digits Serif", "Hind Siliguri", serif`;
  const arabic = (px: number) => `400 ${px}px "Amiri Quran", "Amiri", serif`;

  // background
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, S.bg1);
  g.addColorStop(1, S.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // eight-pointed star pattern, fading downwards
  ctx.save();
  ctx.strokeStyle = S.gold;
  ctx.lineWidth = 1.4;
  for (let y = 60; y < H; y += 120) {
    for (let x = (y / 120) % 2 ? 0 : 60; x < W + 60; x += 120) {
      ctx.globalAlpha = Math.max(0, 0.13 - y / H / 8);
      star(ctx, x, y, 34, 14);
    }
  }
  ctx.restore();

  // inner frame
  ctx.strokeStyle = S.line;
  ctx.lineWidth = 3;
  roundRect(ctx, 48, 48, W - 96, H - 96, 40);
  ctx.stroke();

  // crescent with glow
  const off = document.createElement("canvas");
  off.width = 520;
  off.height = 520;
  const o2 = off.getContext("2d")!;
  const cg = o2.createRadialGradient(220, 210, 20, 260, 260, 190);
  cg.addColorStop(0, "#fff3cf");
  cg.addColorStop(1, S.gold);
  o2.fillStyle = cg;
  o2.beginPath();
  o2.arc(260, 260, 170, 0, Math.PI * 2);
  o2.fill();
  o2.globalCompositeOperation = "destination-out";
  o2.beginPath();
  o2.arc(330, 215, 150, 0, Math.PI * 2);
  o2.fill();
  ctx.save();
  ctx.shadowColor = S.gold;
  ctx.shadowBlur = 60;
  ctx.drawImage(off, W / 2 - 300, 70, 520, 520);
  ctx.restore();
  // a small star beside the crescent
  ctx.save();
  ctx.fillStyle = S.gold;
  ctx.translate(W / 2 + 120, 250);
  starFill(ctx, 0, 0, 30, 12);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  // without a summary or a name, move the greeting down so the card stays balanced
  const dy = o.stats ? 0 : o.name ? 50 : 100;

  // Arabic greeting
  ctx.fillStyle = S.gold;
  ctx.direction = "rtl";
  ctx.font = arabic(92);
  ctx.fillText("عِيدٌ مُبَارَكٌ", W / 2, 690 + dy);
  ctx.direction = "ltr";

  // main greeting
  ctx.fillStyle = S.ink;
  ctx.font = bn ? text(600, 124) : latin(600, 118);
  ctx.fillText(bn ? "ঈদ মোবারক" : "Eid Mubarak", W / 2, 840 + dy);

  // taqabbal Allahu minna wa minkum
  ctx.fillStyle = S.gold;
  ctx.direction = "rtl";
  ctx.font = arabic(54);
  ctx.fillText("تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ", W / 2, 950 + dy);
  ctx.direction = "ltr";
  ctx.fillStyle = S.soft;
  ctx.font = text(400, 36);
  ctx.fillText(bn ? "আল্লাহ আমাদের ও আপনাদের আমল কবুল করুন" : "May Allah accept from us and from you", W / 2, 1010 + dy);

  // optional Ramadan summary
  if (o.stats) {
    const items = [
      [o.stats.fasts, bn ? "রোযা" : "fasts"],
      [o.stats.prayers, bn ? "ওয়াক্ত নামায" : "prayers"],
      [o.stats.pages, bn ? "পৃষ্ঠা কুরআন" : "pages of Quran"],
    ] as const;
    const colW = (W - 160) / 3;
    items.forEach(([n, l], i) => {
      const x = 80 + colW * i + colW / 2;
      ctx.fillStyle = S.ink;
      ctx.font = numFont(64);
      ctx.fillText(digits(n, o.lang), x, 1105);
      ctx.fillStyle = S.soft;
      ctx.font = text(400, 30);
      ctx.fillText(l, x, 1147);
    });
  }

  // from
  if (o.name) {
    ctx.fillStyle = S.ink;
    ctx.font = text(500, 42);
    ctx.fillText(bn ? `শুভেচ্ছান্তে, ${o.name}` : `With love, ${o.name}`, W / 2, o.stats ? 1218 : 1150 + dy);
  }

  // footer
  ctx.fillStyle = S.soft;
  ctx.font = text(400, 26);
  ctx.fillText(bn ? `রমাদান ${digits(o.year, "bn")} হিজরি` : `Ramadan ${o.year} AH`, W / 2, H - 78);
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, inner: number) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const rr = i % 2 ? inner : r;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.stroke();
}
function starFill(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, inner: number) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const rr = i % 2 ? inner : r;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
