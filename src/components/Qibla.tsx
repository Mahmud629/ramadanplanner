"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { locationOf } from "@/lib/prayer";
import { cityById } from "@/lib/cities";
import { digits } from "@/lib/i18n";
import { SubHead, tap } from "./ui";
import { LocationPicker } from "./MoreView";

const KAABA = { lat: 21.422487, lon: 39.826206 };
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Initial great-circle bearing from a point to the Kaaba, degrees clockwise from true north. */
export function qiblaBearing(lat: number, lon: number) {
  const φ1 = rad(lat);
  const φ2 = rad(KAABA.lat);
  const Δλ = rad(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

export function distanceToMakkahKm(lat: number, lon: number) {
  const R = 6371;
  const dφ = rad(KAABA.lat - lat);
  const dλ = rad(KAABA.lon - lon);
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

type OrientationEventIOS = DeviceOrientationEvent & { webkitCompassHeading?: number };
type PermissionAPI = { requestPermission?: () => Promise<"granted" | "denied"> };

function screenAngle() {
  return (typeof screen !== "undefined" && screen.orientation?.angle) || 0;
}

/** Live compass heading (degrees from north), or null when the device has no compass. */
function useHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "waiting" | "live" | "unsupported" | "denied">("idle");
  const smooth = useRef<number | null>(null);
  const cleanup = useRef<() => void>(() => {});

  const update = useCallback((h: number) => {
    // low-pass filter on the circle so the needle doesn't jitter
    const prev = smooth.current;
    let next = h;
    if (prev !== null) {
      const diff = ((h - prev + 540) % 360) - 180;
      next = (prev + diff * 0.25 + 360) % 360;
    }
    smooth.current = next;
    setHeading(next);
    setState("live");
  }, []);

  const start = useCallback(async () => {
    cleanup.current();
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setState("unsupported");
      return;
    }
    const api = DeviceOrientationEvent as unknown as PermissionAPI;
    if (typeof api.requestPermission === "function") {
      try {
        if ((await api.requestPermission()) !== "granted") {
          setState("denied");
          return;
        }
      } catch {
        setState("denied");
        return;
      }
    }
    setState("waiting");
    const onAbs = (e: DeviceOrientationEvent) => {
      if (e.alpha == null) return;
      update((360 - e.alpha + screenAngle()) % 360);
    };
    const onIOS = (e: DeviceOrientationEvent) => {
      const h = (e as OrientationEventIOS).webkitCompassHeading;
      if (typeof h === "number" && !Number.isNaN(h)) update((h + screenAngle()) % 360);
    };
    window.addEventListener("deviceorientationabsolute", onAbs as EventListener);
    window.addEventListener("deviceorientation", onIOS as EventListener);
    const timer = setTimeout(() => {
      if (smooth.current === null) setState("unsupported");
    }, 2500);
    cleanup.current = () => {
      window.removeEventListener("deviceorientationabsolute", onAbs as EventListener);
      window.removeEventListener("deviceorientation", onIOS as EventListener);
      clearTimeout(timer);
    };
  }, [update]);

  useEffect(() => {
    // Android needs no permission prompt, so start straight away there
    // iPhone needs a tap to ask permission; everywhere else start straight away
    const api = typeof window !== "undefined" ? (window.DeviceOrientationEvent as unknown as PermissionAPI | undefined) : undefined;
    if (!api || typeof api.requestPermission !== "function") start();
    return () => cleanup.current();
  }, [start]);

  return { heading, state, start };
}

export default function Qibla({ onBack }: { onBack: () => void }) {
  const { settings, t } = useStore();
  const lang = settings.lang;
  const loc = locationOf(settings);
  const place = settings.locationMode === "gps" ? t("gpsActive") : cityById(settings.cityId)[lang];
  const bearing = qiblaBearing(loc.lat, loc.lon);
  const km = distanceToMakkahKm(loc.lat, loc.lon);
  const { heading, state, start } = useHeading();
  const live = state === "live" && heading !== null;
  const rel = live ? (bearing - heading + 360) % 360 : bearing;
  const off = Math.min(rel, 360 - rel);
  const aligned = live && off <= 4;
  const wasAligned = useRef(false);
  useEffect(() => {
    if (aligned && !wasAligned.current) tap(60);
    wasAligned.current = aligned;
  }, [aligned]);

  const dialRotation = live ? -heading! : 0;
  const n = (v: number) => digits(Math.round(v), lang);

  return (
    <div className="stack-lg">
      <SubHead title={t("qibla")} onBack={onBack} />

      <div className={`qibla${aligned ? " aligned" : ""}`}>
        <svg viewBox="0 0 320 320" width="100%" height="100%" role="img" aria-label={t("qiblaAria", { d: n(bearing) })}>
          <g transform={`rotate(${dialRotation} 160 160)`} style={{ transition: "transform 120ms linear" }}>
            <circle cx="160" cy="160" r="150" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2" />
            {Array.from({ length: 72 }, (_, i) => (
              <line
                key={i}
                x1="160"
                y1={i % 18 === 0 ? 18 : i % 2 === 0 ? 22 : 26}
                x2="160"
                y2="34"
                stroke={i % 18 === 0 ? "var(--gold)" : "var(--ink-3)"}
                strokeWidth={i % 18 === 0 ? 3 : 1.4}
                transform={`rotate(${i * 5} 160 160)`}
              />
            ))}
            {[
              ["N", 0],
              ["E", 90],
              ["S", 180],
              ["W", 270],
            ].map(([l, a]) => (
              <text
                key={l}
                x="160"
                y="58"
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill={l === "N" ? "var(--rose)" : "var(--ink-2)"}
                transform={`rotate(${a} 160 160)`}
              >
                {lang === "bn" ? { N: "উ", E: "পূ", S: "দ", W: "প" }[l as string] : l}
              </text>
            ))}
            {/* Qibla marker on the dial edge */}
            <g transform={`rotate(${bearing} 160 160)`}>
              <rect x="146" y="2" width="28" height="28" rx="3" fill="#1b1b1b" stroke="var(--gold)" strokeWidth="2" />
              <rect x="146" y="10" width="28" height="4" fill="var(--gold)" />
            </g>
          </g>
          {/* needle pointing towards the Kaaba */}
          <g transform={`rotate(${rel} 160 160)`} style={{ transition: "transform 120ms linear" }}>
            <path d="M160 52 L176 160 L160 150 L144 160 Z" fill={aligned ? "var(--leaf)" : "var(--gold)"} />
            <path d="M160 268 L172 160 L160 170 L148 160 Z" fill="var(--ink-3)" opacity="0.5" />
          </g>
          <circle cx="160" cy="160" r="10" fill="var(--bg)" stroke="var(--gold)" strokeWidth="3" />
          {/* the phone's "forward" mark */}
          <path d="M160 0 L152 14 L168 14 Z" fill="var(--ink)" />
        </svg>
      </div>

      <div className="stack" style={{ gap: 6, textAlign: "center" }}>
        {aligned ? (
          <p className="qibla-status ok">{t("qiblaAligned")}</p>
        ) : live ? (
          <p className="qibla-status">{t("qiblaTurn", { d: n(off), dir: ((bearing - heading! + 360) % 360) < 180 ? t("right") : t("left") })}</p>
        ) : (
          <p className="qibla-status">{t("qiblaStatic", { d: n(bearing) })}</p>
        )}
        <p className="small muted">
          {t("qiblaDirection", { d: n(bearing) })}
          <br />
          {t("qiblaDistance", { km: digits(Math.round(km).toLocaleString("en-US"), lang) })}
        </p>
      </div>

      {state === "idle" || state === "denied" ? (
        <button className="btn primary" onClick={start}>
          {t("qiblaStart")}
        </button>
      ) : null}
      {state === "unsupported" ? <p className="small muted">{t("qiblaNoSensor")}</p> : null}
      {state === "denied" ? <p className="small" style={{ color: "var(--rose)" }}>{t("qiblaDenied")}</p> : null}

      <div className="inset stack" style={{ gap: 6 }}>
        <p className="small">
          <b>{t("location")}:</b> {place}
        </p>
        <p className="tiny muted">{t("qiblaTips")}</p>
      </div>
      <details className="fold">
        <summary className="fold-head">
          <span style={{ fontWeight: 600 }}>{t("chooseCity")}</span>
        </summary>
        <div className="fold-body">
          <LocationPicker />
        </div>
      </details>
    </div>
  );
}
