"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { StoreProvider, useStore } from "@/lib/store";
import { useNow, useRamadan } from "@/lib/useRamadan";
import TodayView from "./TodayView";
import JourneyView from "./JourneyView";
import QuranView from "./QuranView";
import LearnView from "./LearnView";
import MoreView, { LocationPicker } from "./MoreView";
import { Icon, Toast } from "./ui";
import { dayIndexFor, longDate } from "@/lib/ramadan";
import "@/lib/install";

const GA_ID = "G-M8HF0SPKZK";

type Tab = "today" | "journey" | "quran" | "learn" | "more";

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { ready, settings, t } = useStore();
  const now = useNow(1000);
  const rd = useRamadan(now);
  const [tab, setTab] = useState<Tab>("today");
  const [viewDate, setViewDate] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [moreKey, setMoreKey] = useState(0);
  const [moreInitial, setMoreInitial] = useState<"settings" | null>(null);
  const lang = settings.lang;

  // theme: follow the sun by default — night from Maghrib to sunrise
  const theme = settings.theme === "auto" ? (rd.isNight ? "night" : "dawn") : settings.theme;
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.lang = lang;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "night" ? "#0b2523" : "#edf2ea");
  }, [theme, lang]);

  // scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, viewDate]);

  // in-app reminders: 15 minutes before sehri ends, and at iftar
  const fired = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!settings.reminders || !rd.info.isRamadan) return;
    const notify = (key: string, text: string) => {
      if (fired.current.has(key)) return;
      fired.current.add(key);
      setToast(text);
      if ("Notification" in window && Notification.permission === "granted") {
        navigator.serviceWorker?.getRegistration().then((reg) => {
          if (reg) reg.showNotification(t("appName"), { body: text, icon: "/icon-192.png", tag: key });
          else new Notification(t("appName"), { body: text, icon: "/icon-192.png" });
        });
      }
    };
    const ms = now.getTime();
    const sehriWarn = rd.sehri.getTime() - 15 * 60000;
    if (ms >= sehriWarn && ms < sehriWarn + 60000) notify(`sehri-${rd.today}`, t("reminderSehri"));
    const ift = rd.iftar.getTime();
    if (ms >= ift && ms < ift + 60000) notify(`iftar-${rd.today}`, t("reminderIftar"));
  }, [now, settings.reminders, rd, t]);

  const openDay = useCallback(
    (iso: string) => {
      setViewDate(iso === rd.today ? null : iso);
      setTab("today");
    },
    [rd.today],
  );

  if (!ready) return <div className="shell" aria-busy="true" />;

  const learnDay = (() => {
    const base = viewDate ?? rd.today;
    const i = dayIndexFor(base, rd.info.startISO);
    return i >= 1 && i <= 30 ? i : i < 1 ? 1 : 30;
  })();

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "today", icon: "moon", label: t("tabToday") },
    { id: "journey", icon: "grid", label: t("tabJourney") },
    { id: "quran", icon: "book", label: t("tabQuran") },
    { id: "learn", icon: "lamp", label: t("tabLearn") },
    { id: "more", icon: "dots", label: t("tabMore") },
  ];

  return (
    <>
      <div className="shell">
        {tab === "today" ? (
          <header className="topbar">
            <span className="brand">{t("appName")}</span>
            <div className="row">
              <span className="dates muted">{longDate(rd.today, lang)}</span>
              <button
                className="icon-btn"
                aria-label={t("settings")}
                onClick={() => {
                  setMoreInitial("settings");
                  setMoreKey((k) => k + 1);
                  setTab("more");
                }}
              >
                <Icon name="gear" size={19} />
              </button>
            </div>
          </header>
        ) : null}

        <main>
          {tab === "today" && <TodayView now={now} viewDate={viewDate} onBackToToday={() => setViewDate(null)} onOpenLearn={() => setTab("learn")} />}
          {tab === "journey" && <JourneyView now={now} onOpenDay={openDay} />}
          {tab === "quran" && <QuranView now={now} />}
          {tab === "learn" && <LearnView key={learnDay} now={now} day={learnDay} />}
          {tab === "more" && <MoreView key={moreKey} now={now} initial={moreInitial} />}
        </main>
      </div>

      <div className="tabbar">
        <nav aria-label="Main">
          {tabs.map((x) => (
            <button
              key={x.id}
              aria-current={tab === x.id ? "page" : undefined}
              onClick={() => {
                if (x.id === "today" && tab === "today") setViewDate(null);
                if (x.id === "more") {
                  setMoreInitial(null);
                  setMoreKey((k) => k + 1);
                }
                setTab(x.id);
              }}
            >
              <Icon name={x.icon} />
              {x.label}
            </button>
          ))}
        </nav>
      </div>

      {!settings.onboarded ? <Onboarding /> : settings.analytics === null ? <ConsentBar /> : null}
      {settings.analytics ? <Analytics /> : null}
      {toast ? <Toast text={toast} onDone={() => setToast(null)} /> : null}
    </>
  );
}

function Onboarding() {
  const { settings, t, updateSettings } = useStore();
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <div className="sheet stack-lg">
        <div className="stack" style={{ gap: 8 }}>
          <p className="ar gold" style={{ textAlign: "center", fontSize: "2rem", lineHeight: 1.8 }}>
            رَمَضَان مُبَارَك
          </p>
          <h1 id="ob-title" style={{ fontSize: "1.5rem", textAlign: "center" }}>
            {t("welcome")}
          </h1>
          <p className="muted" style={{ textAlign: "center" }}>
            {t("welcomeBody")}
          </p>
        </div>
        <div className="seg">
          <button aria-pressed={settings.lang === "bn"} onClick={() => updateSettings({ lang: "bn" })}>
            বাংলা
          </button>
          <button aria-pressed={settings.lang === "en"} onClick={() => updateSettings({ lang: "en" })}>
            English
          </button>
        </div>
        <div className="stack">
          <h2>{t("whereAreYou")}</h2>
          <LocationPicker />
        </div>
        <button className="btn primary" onClick={() => updateSettings({ onboarded: true })}>
          {t("start")}
        </button>
      </div>
    </div>
  );
}

function ConsentBar() {
  const { t, updateSettings } = useStore();
  return (
    <div className="toast" style={{ background: "var(--surface-2)", color: "var(--ink)", border: "1px solid var(--line-strong)", fontWeight: 400, width: "min(560px, calc(100% - 32px))" }}>
      <p className="small" style={{ marginBottom: 10 }}>
        {t("analyticsNote")}
      </p>
      <div className="row">
        <button className="btn small primary" onClick={() => updateSettings({ analytics: true })}>
          {t("allow")}
        </button>
        <button className="btn small" onClick={() => updateSettings({ analytics: false })}>
          {t("noThanks")}
        </button>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
