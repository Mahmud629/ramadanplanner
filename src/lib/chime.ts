/** A soft three-note chime made in the browser (no sound file needed). */
export function playChime() {
  try {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return;
    const ctx = new C();
    const notes = [659.25, 783.99, 987.77]; // E5, G5, B5
    notes.forEach((f, i) => {
      const t = ctx.currentTime + i * 0.28;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.7);
    });
    setTimeout(() => ctx.close().catch(() => {}), 2600);
  } catch {
    /* audio not allowed yet */
  }
}
