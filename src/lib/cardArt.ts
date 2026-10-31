/**
 * Drawing for the shareable images (Eid cards and the "My Ramadan" progress card).
 * Everything is drawn on a 1080×1350 canvas (4:5, the size WhatsApp and Facebook show best).
 */
import { digits } from "./i18n";
import type { Lang } from "./db";

export const W = 1080;
export const H = 1350;

export type CardStats = { fasts: number; prayers: number; pages: number; duas?: number; lessons?: number; streak?: number };

export type EidDesign = "crescent" | "arch" | "lanterns" | "emblem";
export const EID_DESIGNS: EidDesign[] = ["crescent", "arch", "lanterns", "emblem"];

type Pal = { ink: string; soft: string; gold: string; line: string };

const F = {
  bn: (w: number, px: number) => `${w} ${px}px "BN Digits", "Hind Siliguri", system-ui, sans-serif`,
  num: (px: number) => `500 ${px}px "Fraunces Variable", "BN Digits Serif", "Hind Siliguri", serif`,
  ar: (px: number) => `400 ${px}px "Amiri Quran", "Amiri", serif`,
};

export async function loadCardFonts() {
  try {
    await Promise.all([
      document.fonts.load('600 110px "Hind Siliguri"', "ঈদ মোবারক Eid"),
      document.fonts.load('400 80px "Amiri Quran"', "عيد مبارك"),
      document.fonts.load('500 80px "BN Digits"', "০১২"),
      document.fonts.load('500 80px "BN Digits Serif"', "০১২"),
      document.fonts.load('500 80px "Fraunces Variable"', "012"),
    ]);
  } catch {
    /* draw with whatever is available */
  }
}

const images = new Map<string, Promise<HTMLImageElement | null>>();
export function loadImage(src: string) {
  if (!images.has(src))
    images.set(
      src,
      new Promise((res) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = src;
      }),
    );
  return images.get(src)!;
}

/* ---------------- shared pieces ---------------- */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function starPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, inner: number, points = 8) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 ? inner : r;
    const a = (Math.PI / points) * i - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}

function pattern(ctx: CanvasRenderingContext2D, color: string, alpha: number, fade = true, step = 120) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  for (let y = 60; y < H; y += step) {
    for (let x = (y / step) % 2 ? 0 : step / 2; x < W + step; x += step) {
      ctx.globalAlpha = fade ? Math.max(0, alpha - (y / H) * (alpha * 0.9)) : alpha;
      starPath(ctx, x, y, 34, 14);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function gradientBg(ctx: CanvasRenderingContext2D, a: string, b: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function crescent(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, gold: string, glow = true) {
  const s = Math.ceil(r * 3);
  const off = document.createElement("canvas");
  off.width = s;
  off.height = s;
  const o = off.getContext("2d")!;
  const c = s / 2;
  const g = o.createRadialGradient(c - r * 0.25, c - r * 0.3, r * 0.1, c, c, r);
  g.addColorStop(0, "#fff3cf");
  g.addColorStop(1, gold);
  o.fillStyle = g;
  o.beginPath();
  o.arc(c, c, r, 0, Math.PI * 2);
  o.fill();
  o.globalCompositeOperation = "destination-out";
  o.beginPath();
  o.arc(c + r * 0.42, c - r * 0.27, r * 0.88, 0, Math.PI * 2);
  o.fill();
  ctx.save();
  if (glow) {
    ctx.shadowColor = gold;
    ctx.shadowBlur = r * 0.35;
  }
  ctx.drawImage(off, cx - c, cy - c);
  ctx.restore();
}

/** Moon with a given phase (Hijri day) and a score ring, like the app's main screen. */
function moonWithRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hijriDay: number, score: number, P: Pal & { dark: string }) {
  const ringR = r + 34;
  ctx.save();
  ctx.lineWidth = 10;
  ctx.strokeStyle = P.line;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = P.gold;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * Math.max(0.001, Math.min(100, score))) / 100);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = P.dark;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  const p = ((hijriDay - 0.2) / 29.53) % 1;
  const k = Math.cos(2 * Math.PI * p);
  const rx = Math.abs(k) * r;
  const waxing = p < 0.5;
  const cres = k > 0;
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
  g.addColorStop(0, "#fff3cf");
  g.addColorStop(1, P.gold);
  ctx.save();
  ctx.shadowColor = P.gold;
  ctx.shadowBlur = 40;
  ctx.fillStyle = g;
  ctx.beginPath();
  // lit limb
  ctx.ellipse(cx, cy, r, r, 0, -Math.PI / 2, Math.PI / 2, !waxing);
  // terminator back to the top
  ctx.ellipse(cx, cy, Math.max(0.01, rx), r, 0, Math.PI / 2, -Math.PI / 2, waxing ? cres : !cres);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function lantern(ctx: CanvasRenderingContext2D, x: number, top: number, len: number, size: number, gold: string) {
  // string
  ctx.save();
  ctx.strokeStyle = gold;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, top + len);
  ctx.stroke();
  ctx.restore();
  const y = top + len;
  const w = size;
  const h = size * 1.55;
  // glow
  const glow = ctx.createRadialGradient(x, y + h * 0.55, 4, x, y + h * 0.55, size * 1.6);
  glow.addColorStop(0, "rgba(255, 196, 90, 0.55)");
  glow.addColorStop(1, "rgba(255, 196, 90, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y + h * 0.55, size * 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = gold;
  // ring + cap
  ctx.beginPath();
  ctx.arc(x, y + 6, 8, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = gold;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - w * 0.18, y + 14);
  ctx.lineTo(x + w * 0.18, y + 14);
  ctx.lineTo(x + w * 0.42, y + h * 0.2);
  ctx.lineTo(x - w * 0.42, y + h * 0.2);
  ctx.closePath();
  ctx.fill();
  // body
  const by = y + h * 0.2;
  const bh = h * 0.62;
  const body = ctx.createLinearGradient(x, by, x, by + bh);
  body.addColorStop(0, "#ffe7a8");
  body.addColorStop(1, "#f2a93b");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.42, by);
  ctx.lineTo(x + w * 0.42, by);
  ctx.lineTo(x + w * 0.5, by + bh * 0.5);
  ctx.lineTo(x + w * 0.42, by + bh);
  ctx.lineTo(x - w * 0.42, by + bh);
  ctx.lineTo(x - w * 0.5, by + bh * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 4;
  ctx.stroke();
  // frame bars
  ctx.lineWidth = 3;
  for (const fx of [-0.17, 0.17]) {
    ctx.beginPath();
    ctx.moveTo(x + w * fx, by);
    ctx.lineTo(x + w * fx * 1.15, by + bh * 0.5);
    ctx.lineTo(x + w * fx, by + bh);
    ctx.stroke();
  }
  // bottom
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.42, by + bh);
  ctx.lineTo(x + w * 0.42, by + bh);
  ctx.lineTo(x + w * 0.12, by + bh + h * 0.14);
  ctx.lineTo(x - w * 0.12, by + bh + h * 0.14);
  ctx.closePath();
  ctx.fill();
}

function archPath(ctx: CanvasRenderingContext2D, x0: number, x1: number, base: number, spring: number, apex: number) {
  const mid = (x0 + x1) / 2;
  const w = x1 - x0;
  ctx.beginPath();
  ctx.moveTo(x0, base);
  ctx.lineTo(x0, spring);
  ctx.bezierCurveTo(x0, spring - (spring - apex) * 0.55, mid - w * 0.22, apex + (spring - apex) * 0.18, mid, apex);
  ctx.bezierCurveTo(mid + w * 0.22, apex + (spring - apex) * 0.18, x1, spring - (spring - apex) * 0.55, x1, spring);
  ctx.lineTo(x1, base);
  ctx.closePath();
}

/** The Eid greeting text block; returns the y after the last line. */
function greeting(ctx: CanvasRenderingContext2D, lang: Lang, P: Pal, y: number, scale = 1) {
  const bn = lang === "bn";
  ctx.textAlign = "center";
  ctx.fillStyle = P.gold;
  ctx.direction = "rtl";
  ctx.font = F.ar(92 * scale);
  ctx.fillText("عِيدٌ مُبَارَكٌ", W / 2, y);
  ctx.direction = "ltr";
  ctx.fillStyle = P.ink;
  ctx.font = F.bn(600, (bn ? 124 : 118) * scale);
  ctx.fillText(bn ? "ঈদ মোবারক" : "Eid Mubarak", W / 2, y + 150 * scale);
  ctx.fillStyle = P.gold;
  ctx.direction = "rtl";
  ctx.font = F.ar(54 * scale);
  ctx.fillText("تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ", W / 2, y + 260 * scale);
  ctx.direction = "ltr";
  ctx.fillStyle = P.soft;
  ctx.font = F.bn(400, 36 * scale);
  ctx.fillText(bn ? "আল্লাহ আমাদের ও আপনাদের আমল কবুল করুন" : "May Allah accept from us and from you", W / 2, y + 320 * scale);
  return y + 320 * scale;
}

function statsRow(ctx: CanvasRenderingContext2D, lang: Lang, P: Pal, s: CardStats, y: number, x0 = 80, x1 = W - 80) {
  const bn = lang === "bn";
  const items: [number, string][] = [
    [s.fasts, bn ? "রোযা" : "fasts"],
    [s.prayers, bn ? "ওয়াক্ত নামায" : "prayers"],
    [s.pages, bn ? "পৃষ্ঠা কুরআন" : "pages of Quran"],
  ];
  const colW = (x1 - x0) / 3;
  ctx.textAlign = "center";
  items.forEach(([n, l], i) => {
    const x = x0 + colW * i + colW / 2;
    ctx.fillStyle = P.ink;
    ctx.font = F.num(64);
    ctx.fillText(digits(n, lang), x, y);
    ctx.fillStyle = P.soft;
    ctx.font = F.bn(400, 30);
    ctx.fillText(l, x, y + 42);
  });
}

function signature(ctx: CanvasRenderingContext2D, lang: Lang, P: Pal, name: string, y: number) {
  if (!name) return;
  ctx.textAlign = "center";
  ctx.fillStyle = P.ink;
  ctx.font = F.bn(500, 42);
  ctx.fillText(lang === "bn" ? `শুভেচ্ছান্তে, ${name}` : `With love, ${name}`, W / 2, y);
}

function footer(ctx: CanvasRenderingContext2D, lang: Lang, P: Pal, year: number, y = H - 78) {
  ctx.textAlign = "center";
  ctx.fillStyle = P.soft;
  ctx.font = F.bn(400, 26);
  ctx.fillText(lang === "bn" ? `রমাদান ${digits(year, "bn")} হিজরি` : `Ramadan ${year} AH`, W / 2, y);
}

/* ---------------- the four Eid designs ---------------- */

export type EidOpts = { lang: Lang; name: string; stats: CardStats | null; year: number };

export async function drawEid(c: HTMLCanvasElement, design: EidDesign, o: EidOpts) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  const dy = o.stats ? 0 : o.name ? 50 : 100;

  if (design === "crescent") {
    const P = { ink: "#f1e7cf", soft: "rgba(241,231,207,0.72)", gold: "#e0b355", line: "rgba(224,179,85,0.35)" };
    gradientBg(ctx, "#0d2c29", "#071816");
    pattern(ctx, P.gold, 0.13);
    ctx.strokeStyle = P.line;
    ctx.lineWidth = 3;
    rr(ctx, 48, 48, W - 96, H - 96, 40);
    ctx.stroke();
    crescent(ctx, W / 2 - 40, 330, 170, P.gold);
    ctx.fillStyle = P.gold;
    starPath(ctx, W / 2 + 120, 250, 30, 12);
    ctx.fill();
    greeting(ctx, o.lang, P, 690 + dy);
    if (o.stats) statsRow(ctx, o.lang, P, o.stats, 1105);
    signature(ctx, o.lang, P, o.name, o.stats ? 1218 : 1150 + dy);
    footer(ctx, o.lang, P, o.year);
    return;
  }

  if (design === "arch") {
    // a mihrab-shaped window on a light sage wall
    gradientBg(ctx, "#eef3ea", "#dce8dc");
    pattern(ctx, "#a16d0f", 0.1, false);
    const x0 = 120;
    const x1 = W - 120;
    const base = H - 120;
    const spring = 520;
    const apex = 120;
    ctx.save();
    ctx.shadowColor = "rgba(15,45,42,0.35)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    archPath(ctx, x0, x1, base, spring, apex);
    const g = ctx.createLinearGradient(0, apex, 0, base);
    g.addColorStop(0, "#14493b");
    g.addColorStop(1, "#0a2a23");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    ctx.save();
    archPath(ctx, x0, x1, base, spring, apex);
    ctx.clip();
    pattern(ctx, "#e0b355", 0.1);
    ctx.restore();
    ctx.strokeStyle = "#c99a3e";
    ctx.lineWidth = 6;
    archPath(ctx, x0 + 22, x1 - 22, base - 22, spring + 10, apex + 34);
    ctx.stroke();
    const P = { ink: "#f6ecd2", soft: "rgba(246,236,210,0.75)", gold: "#e7bd62", line: "rgba(231,189,98,0.35)" };
    crescent(ctx, W / 2 - 18, 335, 105, P.gold);
    greeting(ctx, o.lang, P, 600 + dy * 0.8, 0.92);
    if (o.stats) statsRow(ctx, o.lang, P, o.stats, 1060, 170, W - 170);
    signature(ctx, o.lang, P, o.name, o.stats ? 1165 : 1110 + dy * 0.6);
    footer(ctx, o.lang, { ...P, soft: "rgba(15,45,42,0.7)" }, o.year, H - 58);
    return;
  }

  if (design === "lanterns") {
    gradientBg(ctx, "#1a1a44", "#0d2a32");
    // stars
    ctx.fillStyle = "#fff3cf";
    for (let i = 0; i < 70; i++) {
      const x = (i * 197) % W;
      const y = ((i * 131) % 520) + 20;
      ctx.globalAlpha = 0.25 + ((i * 37) % 50) / 100;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const gold = "#e9b949";
    lantern(ctx, 230, 0, 150, 120, gold);
    lantern(ctx, W / 2, 0, 250, 150, gold);
    lantern(ctx, W - 230, 0, 120, 110, gold);
    const P = { ink: "#fbf1da", soft: "rgba(251,241,218,0.75)", gold: "#f0c25a", line: "rgba(240,194,90,0.35)" };
    greeting(ctx, o.lang, P, 690 + dy);
    if (o.stats) statsRow(ctx, o.lang, P, o.stats, 1105);
    signature(ctx, o.lang, P, o.name, o.stats ? 1218 : 1150 + dy);
    footer(ctx, o.lang, P, o.year);
    return;
  }

  // "emblem": light and clean, with the Ramadan Planner logo
  gradientBg(ctx, "#ffffff", "#eef4ec");
  const P = { ink: "#0f3d1f", soft: "rgba(15,61,31,0.7)", gold: "#b07d14", line: "rgba(176,125,20,0.4)" };
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 3;
  rr(ctx, 48, 48, W - 96, H - 96, 40);
  ctx.stroke();
  rr(ctx, 64, 64, W - 128, H - 128, 30);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  const logo = await loadImage("/logo-emblem.png");
  if (logo) ctx.drawImage(logo, W / 2 - 170, 110, 340, 340);
  // thin rules either side of a small star
  ctx.strokeStyle = P.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 240, 520);
  ctx.lineTo(W / 2 - 30, 520);
  ctx.moveTo(W / 2 + 30, 520);
  ctx.lineTo(W / 2 + 240, 520);
  ctx.stroke();
  ctx.fillStyle = P.gold;
  starPath(ctx, W / 2, 520, 14, 6);
  ctx.fill();
  greeting(ctx, o.lang, P, 650 + dy);
  if (o.stats) statsRow(ctx, o.lang, P, o.stats, 1095);
  signature(ctx, o.lang, P, o.name, o.stats ? 1210 : 1130 + dy);
  footer(ctx, o.lang, P, o.year);
}

/* ---------------- My Ramadan progress card ---------------- */

export type ProgressOpts = {
  lang: Lang;
  name: string;
  year: number;
  day: number; // 1–30 (or 0 before Ramadan)
  score: number;
  hijriDay: number;
  stats: Required<CardStats>;
};

export async function drawProgress(c: HTMLCanvasElement, o: ProgressOpts) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const bn = o.lang === "bn";
  const P = { ink: "#f1e7cf", soft: "rgba(241,231,207,0.7)", gold: "#e0b355", line: "rgba(241,231,207,0.14)", dark: "#0f2f2b" };
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  gradientBg(ctx, "#0d2c29", "#071816");
  pattern(ctx, P.gold, 0.11);

  // header: logo tile + app name
  const logo = await loadImage("/icon-192.png");
  if (logo) {
    ctx.save();
    rr(ctx, 80, 74, 76, 76, 18);
    ctx.clip();
    ctx.drawImage(logo, 80, 74, 76, 76);
    ctx.restore();
  }
  ctx.textAlign = "left";
  ctx.fillStyle = P.ink;
  ctx.font = F.bn(600, 36);
  ctx.fillText(bn ? "রমাদান প্ল্যানার" : "Ramadan Planner", 176, 124);

  // title
  ctx.textAlign = "center";
  ctx.font = F.bn(600, 72);
  ctx.fillText(bn ? `আমার রমাদান ${digits(o.year, "bn")}` : `My Ramadan ${o.year}`, W / 2, 268);
  ctx.fillStyle = P.soft;
  ctx.font = F.bn(400, 36);
  const dayText = o.day >= 1 ? (bn ? `${digits(Math.min(30, o.day), "bn")}তম দিন, ৩০ দিনের মধ্যে` : `Day ${Math.min(30, o.day)} of 30`) : bn ? "রমাদানের প্রস্তুতি" : "Getting ready for Ramadan";
  ctx.fillText(dayText, W / 2, 322);

  // moon + score
  moonWithRing(ctx, W / 2, 560, 150, Math.max(1, o.hijriDay), o.score, P);
  ctx.fillStyle = P.gold;
  ctx.font = F.num(96);
  ctx.fillText(`${digits(o.score, o.lang)}%`, W / 2, 870);
  ctx.fillStyle = P.soft;
  ctx.font = F.bn(400, 32);
  ctx.fillText(bn ? "এ পর্যন্ত রমাদানের অর্জন" : "Ramadan score so far", W / 2, 918);

  // stats grid 3 × 2
  const items: [number, string][] = [
    [o.stats.fasts, bn ? "রোযা" : "fasts"],
    [o.stats.prayers, bn ? "ওয়াক্ত নামায" : "prayers"],
    [o.stats.pages, bn ? "পৃষ্ঠা কুরআন" : "pages of Quran"],
    [o.stats.duas, bn ? "দোয়া শিখেছি" : "duas learned"],
    [o.stats.lessons, bn ? "পাঠ পড়েছি" : "lessons read"],
    [o.stats.streak, bn ? "দিনের নামাযের ধারা" : "day prayer streak"],
  ];
  ctx.fillStyle = "rgba(241,231,207,0.06)";
  rr(ctx, 80, 960, W - 160, 270, 28);
  ctx.fill();
  ctx.strokeStyle = P.line;
  ctx.lineWidth = 2;
  ctx.stroke();
  const colW = (W - 160) / 3;
  items.forEach(([n, l], i) => {
    const x = 80 + colW * (i % 3) + colW / 2;
    const y = 1048 + Math.floor(i / 3) * 128;
    ctx.fillStyle = P.ink;
    ctx.font = F.num(58);
    ctx.fillText(digits(n, o.lang), x, y);
    ctx.fillStyle = P.soft;
    ctx.font = F.bn(400, 28);
    ctx.fillText(l, x, y + 40);
  });

  // footer
  ctx.fillStyle = P.soft;
  ctx.font = F.bn(500, 34);
  const foot = o.name ? (bn ? `${o.name}, দোয়ায় রাখবেন` : `${o.name}. Keep me in your duas`) : bn ? "আল্লাহ আমাদের আমল কবুল করুন" : "May Allah accept our deeds";
  ctx.fillText(foot, W / 2, H - 62);
}

/* ---------------- share / download ---------------- */

export async function shareCanvas(c: HTMLCanvasElement, filename: string, text?: string) {
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
  if (!blob) return "failed" as const;
  const file = new File([blob], filename, { type: "image/png" });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text });
      return "shared" as const;
    }
  } catch (e) {
    if ((e as DOMException)?.name === "AbortError") return "cancelled" as const;
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  return "downloaded" as const;
}

export async function downloadCanvas(c: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
  if (!blob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
