"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ayahGlobal } from "@/content";

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "moon":
      return (
        <svg {...p}>
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
      );
    case "book":
      return (
        <svg {...p}>
          <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
          <path d="M12 6.5v13" />
        </svg>
      );
    case "lamp":
      return (
        <svg {...p}>
          <path d="M12 3v2M7 8.5a5 5 0 1 1 10 0c0 2-1.2 3.2-2 4-.6.6-1 1.4-1 2.5h-4c0-1.1-.4-1.9-1-2.5-.8-.8-2-2-2-4Z" />
          <path d="M10 18h4M10.5 21h3" />
        </svg>
      );
    case "dots":
      return (
        <svg {...p}>
          <circle cx="5" cy="12" r="1.3" />
          <circle cx="12" cy="12" r="1.3" />
          <circle cx="19" cy="12" r="1.3" />
        </svg>
      );
    case "check":
      return (
        <svg {...p} strokeWidth={2.4}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "play":
      return (
        <svg {...p}>
          <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "pause":
      return (
        <svg {...p}>
          <path d="M8 5v14M16 5v14" strokeWidth={3} />
        </svg>
      );
    case "back":
      return (
        <svg {...p}>
          <path d="M15 5 8 12l7 7" />
        </svg>
      );
    case "chev":
      return (
        <svg {...p} width={18} height={18}>
          <path d="m9 5 7 7-7 7" />
        </svg>
      );
    case "gear":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
        </svg>
      );
    case "beads":
      return (
        <svg {...p}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="6.5" cy="8.5" r="2" />
          <circle cx="17.5" cy="8.5" r="2" />
          <circle cx="6.5" cy="15" r="2" />
          <circle cx="17.5" cy="15" r="2" />
          <path d="M12 17v4" />
        </svg>
      );
    case "scale":
      return (
        <svg {...p}>
          <path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8Zm14 0-2.5 6a3 3 0 0 0 5 0L19 8Z" />
        </svg>
      );
    case "gift":
      return (
        <svg {...p}>
          <rect x="3.5" y="9" width="17" height="11" rx="2" />
          <path d="M12 9v11M3.5 13h17M12 9C10 5 6.5 5.5 7.5 8c.4 1 2.5 1 4.5 1Zm0 0c2-4 5.5-3.5 4.5-1-.4 1-2.5 1-4.5 1Z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      );
    case "star":
      return (
        <svg {...p}>
          <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" />
        </svg>
      );
    case "save":
      return (
        <svg {...p}>
          <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />
        </svg>
      );
    case "trash":
      return (
        <svg {...p}>
          <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" />
        </svg>
      );
    case "heart":
      return (
        <svg {...p}>
          <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15l1.5-2ZM10 20.5h4" />
        </svg>
      );
    case "info":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    default:
      return null;
  }
}

/** A light haptic tick on supported phones. */
export function tap(ms = 8) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    /* ignore */
  }
}

export function Check({ on }: { on: boolean }) {
  return <span className={`dot-check${on ? " on" : ""}`}>{on ? <Icon name="check" size={14} /> : null}</span>;
}

export function CheckRow({ on, onToggle, children, disabled }: { on: boolean; onToggle: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button className="check-row" role="checkbox" aria-checked={on} onClick={onToggle} disabled={disabled} style={{ opacity: disabled ? 0.55 : 1 }}>
      <Check on={on} />
      <span>{children}</span>
    </button>
  );
}

export function Chip({ on, onToggle, children, disabled, tone }: { on: boolean; onToggle: () => void; children: React.ReactNode; disabled?: boolean; tone?: "gold" }) {
  return (
    <button className={`chip${tone ? " " + tone : ""}`} aria-pressed={on} onClick={onToggle} disabled={disabled}>
      {on ? <Icon name="check" size={14} /> : null}
      {children}
    </button>
  );
}

/* ---------- audio: one shared player so recitations never overlap ---------- */
let sharedAudio: HTMLAudioElement | null = null;
type State = { id: string | null; status: "idle" | "loading" | "playing" | "error" };
let state: State = { id: null, status: "idle" };
const listeners = new Set<(s: State) => void>();
function setState(next: State) {
  state = next;
  listeners.forEach((l) => l(next));
}

/** Mishary Alafasy, one file per ayah, from three independent servers (tried in order). */
export function ayahAudioUrl(s: number, a: number): string[] {
  const sss = String(s).padStart(3, "0");
  const aaa = String(a).padStart(3, "0");
  return [
    `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobal(s, a)}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${sss}${aaa}.mp3`,
    `https://verses.quran.foundation/Alafasy/mp3/${sss}${aaa}.mp3`,
  ];
}

export function AudioButton({ id, urls, label }: { id: string; urls: string[][]; label?: string }) {
  const { t } = useStore();
  const [st, setSt] = useState<State>(state);

  useEffect(() => {
    listeners.add(setSt);
    return () => {
      listeners.delete(setSt);
    };
  }, []);

  const mine = st.id === id;
  const status = mine ? st.status : "idle";

  const toggle = () => {
    if (!sharedAudio) {
      sharedAudio = new Audio();
      sharedAudio.preload = "auto";
    }
    const a = sharedAudio;
    if (status === "playing" || status === "loading") {
      a.pause();
      setState({ id: null, status: "idle" });
      return;
    }
    let ayah = 0;
    let source = 0;
    const load = () => {
      a.src = urls[ayah][source];
      a.load();
      a.play().catch((err: DOMException) => {
        // a blocked play (e.g. iOS without a tap) is not a network error: stop quietly
        if (err?.name === "NotAllowedError" && state.id === id) setState({ id: null, status: "idle" });
      });
    };
    a.onplaying = () => state.id === id && setState({ id, status: "playing" });
    a.onwaiting = () => state.id === id && setState({ id, status: "loading" });
    a.onerror = () => {
      if (state.id !== id) return;
      source += 1;
      if (source < urls[ayah].length) load();
      else setState({ id, status: "error" });
    };
    a.onended = () => {
      if (state.id !== id) return;
      ayah += 1;
      if (ayah < urls.length) {
        source = 0;
        load();
      } else setState({ id: null, status: "idle" });
    };
    setState({ id, status: "loading" });
    load();
  };

  const icon = status === "playing" || status === "loading" ? "pause" : "play";
  const text = label && status === "idle" ? label : status === "loading" ? t("audioLoading") : status === "playing" ? t("pause") : status === "error" ? t("retry") : label ?? t("play");
  return (
    <span className="stack" style={{ gap: 4, alignItems: "flex-end" }}>
      <button className="btn small" onClick={toggle} aria-label={text} aria-busy={status === "loading"}>
        <Icon name={icon} size={16} />
        {text}
      </button>
      {status === "error" ? (
        <span className="tiny" style={{ color: "var(--rose)", textAlign: "right" }} role="alert">
          {t("audioError")}
        </span>
      ) : null}
    </span>
  );
}

export function SubHead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sub-head">
      <button className="icon-btn" onClick={onBack} aria-label="Back">
        <Icon name="back" size={20} />
      </button>
      <h1 style={{ fontSize: "1.2rem" }}>{title}</h1>
    </div>
  );
}

export function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 5000);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <div className="toast" role="status" onClick={onDone}>
      {text}
    </div>
  );
}
