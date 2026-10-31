import { addDays } from "./dates";
import type { Settings } from "./db";
import { iftarTime, prayerTimes, sehriEnd } from "./prayer";

/**
 * A calendar file with 60 events (sehri end and iftar for each of the 30 days), each with
 * an alarm. Phone calendars ring these even when the app is closed, with no server needed.
 */
export function ramadanIcs(startISO: string, s: Settings, hijriYear: number) {
  const bn = s.lang === "bn";
  const stamp = utc(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ramadan Planner//Sehri and Iftar//BN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${bn ? `রমাদান ${hijriYear}` : `Ramadan ${hijriYear}`}`,
  ];
  for (let i = 0; i < 30; i++) {
    const iso = addDays(startISO, i);
    const t = prayerTimes(iso, s);
    const sehri = sehriEnd(t, s);
    const iftar = iftarTime(t, s);
    const n = i + 1;
    const ymd = iso.replace(/-/g, "");
    lines.push(
      ...event({
        uid: `sehri-${ymd}@ramadan-planner`,
        stamp,
        start: sehri,
        minutes: 10,
        title: bn ? `সেহরি শেষ (রমাদান ${n})` : `Sehri ends (Ramadan ${n})`,
        alarms: [
          { before: 30, text: bn ? "সেহরি শেষ হতে ৩০ মিনিট বাকি" : "Sehri ends in 30 minutes" },
          { before: 10, text: bn ? "সেহরি শেষ হতে ১০ মিনিট বাকি" : "Sehri ends in 10 minutes" },
        ],
      }),
      ...event({
        uid: `iftar-${ymd}@ramadan-planner`,
        stamp,
        start: iftar,
        minutes: 20,
        title: bn ? `ইফতার (রমাদান ${n})` : `Iftar (Ramadan ${n})`,
        alarms: [
          { before: 10, text: bn ? "ইফতারের ১০ মিনিট বাকি। দোয়ার সময়।" : "Iftar in 10 minutes. A time for dua." },
          { before: 0, text: bn ? "ইফতারের সময় হয়েছে" : "It's time for iftar" },
        ],
      }),
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

function event(e: { uid: string; stamp: string; start: Date; minutes: number; title: string; alarms: { before: number; text: string }[] }) {
  const end = new Date(e.start.getTime() + e.minutes * 60000);
  const out = ["BEGIN:VEVENT", `UID:${e.uid}`, `DTSTAMP:${e.stamp}`, `DTSTART:${utc(e.start)}`, `DTEND:${utc(end)}`, `SUMMARY:${esc(e.title)}`, "TRANSP:TRANSPARENT"];
  for (const a of e.alarms) {
    out.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(a.text)}`, a.before ? `TRIGGER:-PT${a.before}M` : "TRIGGER:PT0S", "END:VALARM");
  }
  out.push("END:VEVENT");
  return out;
}

function utc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Fold lines at 75 octets without splitting a UTF-8 character (RFC 5545 §3.1). */
function fold(line: string) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    const limit = parts.length ? 74 : 75;
    if (bytes + b > limit) {
      parts.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  parts.push(cur);
  return parts.join("\r\n ");
}

export function downloadIcs(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios) {
    // Safari on iPhone opens the calendar import screen when navigating to the file
    window.location.href = url;
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
