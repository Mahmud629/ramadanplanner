"use client";

import { useMemo } from "react";

function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function firstWeekday(year: number, monthIndex0: number) {
  // 0=Sun ... 6=Sat
  return new Date(year, monthIndex0, 1).getDay();
}

function toISODate(year: number, monthIndex0: number, day: number) {
  const y = year;
  const m = String(monthIndex0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  selectedISO,
  onSelect,
  dayBadges,
}: {
  selectedISO: string;
  onSelect: (iso: string) => void;
  dayBadges?: Record<
    string,
    { fast?: boolean; prayer?: boolean; quran?: boolean; percent?: number }
  >;
}) {
  const [y, m] = selectedISO.split("-").map(Number);
  const year = y;
  const monthIndex0 = m - 1;

  const { totalDays, pad } = useMemo(() => {
    return {
      totalDays: daysInMonth(year, monthIndex0),
      pad: firstWeekday(year, monthIndex0),
    };
  }, [year, monthIndex0]);

  const cells: Array<{ iso: string | null; label: string }> = [];

  // padding for first weekday
  for (let i = 0; i < pad; i++) cells.push({ iso: null, label: "" });

  // days
  for (let d = 1; d <= totalDays; d++) {
    const iso = toISODate(year, monthIndex0, d);
    cells.push({ iso, label: String(d) });
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{ fontSize: 12, opacity: 0.7, textAlign: "center" }}
          >
            {w}
          </div>
        ))}

        {cells.map((c, idx) => {
          if (!c.iso) return <div key={idx} style={{ height: 44 }} />;

          const isSelected = c.iso === selectedISO;
          const badge = dayBadges?.[c.iso];

          return (
            <button
              key={c.iso}
              onClick={() => onSelect(c.iso!)}
              style={{
                height: 44,
                borderRadius: 10,
                border: "1px solid #eee",
                background: isSelected ? "#111" : "white",
                color: isSelected ? "white" : "#111",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
              title={badge?.percent != null ? `Completed ${badge.percent}%` : ""}
            >
              <div style={{ fontWeight: 700, lineHeight: 1 }}>{c.label}</div>

              {/* dots: fast / prayer / quran */}
              <div style={{ display: "flex", gap: 3 }}>
                <Dot on={!!badge?.fast} />
                <Dot on={!!badge?.prayer} />
                <Dot on={!!badge?.quran} />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Dots: Fast • Prayer • Quran
      </div>
    </div>
  );
}

function Dot({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: 999,
        display: "inline-block",
        background: on ? "#22c55e" : "#e5e7eb",
      }}
    />
  );
}
