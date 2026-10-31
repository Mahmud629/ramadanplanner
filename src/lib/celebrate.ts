"use client";

/** A tiny event bus for the "Alhamdulillah" pop-up shown after completing something. */
export type Cheer = { id: number; text: string; big?: boolean };
type Listener = (c: Cheer) => void;
const listeners = new Set<Listener>();
let n = 0;

export function celebrate(text: string, big = false) {
  const c = { id: ++n, text, big };
  listeners.forEach((l) => l(c));
}

export function onCelebrate(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
