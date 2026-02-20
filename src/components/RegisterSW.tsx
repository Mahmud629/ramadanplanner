"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (e) {
        console.warn("SW registration failed:", e);
      }
    };

    register();
  }, []);

  return null;
}
