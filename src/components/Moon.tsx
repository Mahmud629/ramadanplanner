/**
 * The moon for a given Hijri day (1–30), drawn with its real phase, wrapped in a ring
 * that fills with the user's score. As Ramadan goes on, the crescent grows into a full
 * moon and wanes again, so the month itself becomes the progress indicator.
 */
export default function Moon({ hijriDay, score, size = 200 }: { hijriDay: number; score: number; size?: number }) {
  const c = size / 2;
  const ringR = c - 6;
  const r = c - 30;
  const circ = 2 * Math.PI * ringR;
  const pct = Math.max(0, Math.min(100, score));

  // fraction of the synodic month: day 1 is a thin crescent, ~15 is full
  const p = ((hijriDay - 0.2) / 29.53) % 1;
  const k = Math.cos(2 * Math.PI * p); // 1 = new, -1 = full
  const rx = Math.abs(k) * r;
  const waxing = p < 0.5;
  const crescent = k > 0;

  // lit limb: right half when waxing, left half when waning; terminator is an ellipse
  const limbSweep = waxing ? 1 : 0;
  const termSweep = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0;
  const d = `M ${c} ${c - r} A ${r} ${r} 0 0 ${limbSweep} ${c} ${c + r} A ${rx} ${r} 0 0 ${termSweep} ${c} ${c - r} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Moon, day ${hijriDay}. Score ${pct}%`}>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="var(--moon-lit)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--moon-lit)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonLit" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="var(--moon-lit)" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <circle cx={c} cy={c} r={r + 22} fill="url(#moonGlow)" />
      <circle cx={c} cy={c} r={ringR} fill="none" stroke="var(--line)" strokeWidth="3" />
      <circle
        cx={c}
        cy={c}
        r={ringR}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: "stroke-dasharray 600ms ease" }}
      />
      <circle cx={c} cy={c} r={r} fill="var(--moon-dark)" stroke="var(--line)" />
      {Math.abs(k) > 0.995 && k > 0 ? null : <path d={d} fill="url(#moonLit)" />}
    </svg>
  );
}
