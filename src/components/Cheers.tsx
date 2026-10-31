"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { celebrate, onCelebrate, type Cheer } from "@/lib/celebrate";
import type { Key } from "@/lib/i18n";
import { Icon, tap } from "./ui";

/** Returns cheer(key, vars) which shows the pop-up (unless turned off in Settings). */
export function useCheer() {
  const { settings, t } = useStore();
  return useCallback(
    (key: Key, vars?: Record<string, string | number>, big = false) => {
      if (!settings.cheers) return;
      celebrate(t(key, vars), big);
    },
    [settings.cheers, t],
  );
}

/** The pop-up itself, mounted once in the app shell. */
export function Cheers() {
  const { t } = useStore();
  const [cheer, setCheer] = useState<Cheer | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () =>
      onCelebrate((c) => {
        setCheer(c);
        tap(c.big ? 40 : 15);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCheer(null), c.big ? 5200 : 4200);
      }),
    [],
  );

  if (!cheer) return null;
  const blessing = t(`bless${cheer.id % 3}` as Key);
  return (
    <div className={`cheer${cheer.big ? " big" : ""}`} role="status" aria-live="polite" key={cheer.id} onClick={() => setCheer(null)}>
      <span className="cheer-icon">
        <Icon name={cheer.big ? "star" : "check"} size={20} />
      </span>
      <span className="cheer-text">
        <b>{cheer.big ? t("cheerTitleBig") : t("cheerTitle")}</b>
        <span>{cheer.text}</span>
        <span className="cheer-bless">{blessing}</span>
      </span>
    </div>
  );
}
