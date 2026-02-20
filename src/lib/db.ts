import Dexie, { Table } from "dexie";

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "taraweeh";

export type DayEntry = {
  date: string; // YYYY-MM-DD (primary key)
  fastDone: boolean;

  prayers: Record<PrayerKey, boolean>;

  quranPagesRead: number;
  quranDone: boolean;

  note: string;

  updatedAt: number;
};

export type Settings = {
  id: "settings"; // single row key
  ramadanStartDate: string; // YYYY-MM-DD
  quranPagesTarget: number; // default 604 pages
  updatedAt: number;
};

class RamadanDB extends Dexie {
  days!: Table<DayEntry, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("ramadan_planner_db");
    this.version(1).stores({
      days: "date",
      settings: "id",
    });
  }
}

export const db = new RamadanDB();

export function defaultDayEntry(date: string): DayEntry {
  return {
    date,
    fastDone: false,
    prayers: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      taraweeh: false,
    },
    quranPagesRead: 0,
    quranDone: false,
    note: "",
    updatedAt: Date.now(),
  };
}

export function defaultSettings(): Settings {
  return {
    id: "settings",
    ramadanStartDate: "",
    quranPagesTarget: 604,
    updatedAt: Date.now(),
  };
}
