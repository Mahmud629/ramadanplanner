"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
let deferred: BIPEvent | null = null;
const subs = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    subs.forEach((f) => f());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    subs.forEach((f) => f());
  });
}

/** Whether the app can be installed, and how (Android/Chrome prompt or iOS instructions). */
export function useInstall() {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, []);
  const standalone =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
  const ios = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
  return {
    installed: standalone,
    canPrompt: !!deferred,
    ios: ios && !standalone,
    prompt: async () => {
      if (!deferred) return;
      await deferred.prompt();
      deferred = null;
      force((n) => n + 1);
    },
  };
}
