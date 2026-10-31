"use client";

import { Capacitor } from "@capacitor/core";

/** True inside the Android app (Capacitor), false on the website. */
export function isNative() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

/**
 * Save or share a file.
 * - Android app: writes it to the app's cache and opens the share sheet (WhatsApp, Files, Calendar…).
 * - Website: shares it where the browser can, otherwise downloads it.
 */
export async function saveFile(blob: Blob, filename: string, opts: { preferShare?: boolean; title?: string } = {}) {
  if (isNative()) {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([import("@capacitor/filesystem"), import("@capacitor/share")]);
    const data = await blobToBase64(blob);
    const written = await Filesystem.writeFile({ path: filename, data, directory: Directory.Cache });
    try {
      await Share.share({ title: opts.title ?? filename, files: [written.uri], dialogTitle: opts.title ?? filename });
    } catch {
      /* the user closed the share sheet */
    }
    return "shared" as const;
  }

  if (opts.preferShare) {
    const file = new File([blob], filename, { type: blob.type });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: opts.title });
        return "shared" as const;
      }
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled" as const;
    }
  }

  const url = URL.createObjectURL(blob);
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios && blob.type.startsWith("text/calendar")) {
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
  return "downloaded" as const;
}

/** Match the phone's status-bar icons to the app theme (Android app only). */
export async function setBarsStyle(theme: "night" | "dawn") {
  if (!isNative()) return;
  try {
    const { SystemBars, SystemBarsStyle } = await import("@capacitor/core");
    await SystemBars.setStyle({ style: theme === "night" ? SystemBarsStyle.Dark : SystemBarsStyle.Light });
  } catch {
    /* older shells */
  }
}
