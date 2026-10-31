"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/native";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // the Android app already has every file on the phone
    if (isNative()) return;

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
