import Dexie, { type Table } from "dexie";

export type FardPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export const FARD: FardPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type ExtraPrayer = "taraweeh" | "tahajjud" | "duha";
export const EXTRAS: ExtraPrayer[] = ["taraweeh", "tahajjud", "duha"];

export type FastStatus = "done" | "excused" | "missed" | null;
export type ExcuseReason = "travel" | "illness" | "period" | "other";

export const DEEDS = ["sadaqah", "feed", "family", "help", "smile", "istighfar"] as const;
export type Deed = (typeof DEEDS)[number];

export const AVOIDS = ["backbiting", "anger", "screen", "lying"] as const;
export type Avoid = (typeof AVOIDS)[number];

export type DayEntry = {
  date: string; // YYYY-MM-DD, primary key
  fast: FastStatus;
  excuse?: ExcuseReason;
  prayers: Record<FardPrayer, boolean>;
  extras: Record<ExtraPrayer, boolean>;
  quranPages: number;
  dhikr: number;
  deeds: Partial<Record<Deed, boolean>>;
  avoided: Partial<Record<Avoid, boolean>>;
  actionDone: boolean;
  duaLearned: boolean;
  lessonRead: boolean;
  quizAnswer: number | null;
  grateful: string;
  improve: string;
  /** Laylatul Qadr night plan, stored on the day the night leads into (night 21 → day 21) */
  night?: Partial<Record<NightItem, boolean>>;
  afuwwCount?: number;
  updatedAt: number;
};

export const NIGHT_ITEMS = ["isha", "taraweeh", "quran", "tahajjud", "duas", "sadaqah"] as const;
export type NightItem = (typeof NIGHT_ITEMS)[number];

export type MyDua = { id: string; text: string; answered: boolean; createdAt: number };

export type ThemeMode = "auto" | "night" | "dawn";
export type Lang = "bn" | "en";
export type Method =
  | "Karachi"
  | "MuslimWorldLeague"
  | "UmmAlQura"
  | "Egyptian"
  | "NorthAmerica"
  | "Dubai"
  | "Qatar"
  | "Kuwait"
  | "Singapore"
  | "Turkey"
  | "MoonsightingCommittee";

export type Settings = {
  id: "settings";
  onboarded: boolean;
  lang: Lang;
  theme: ThemeMode;
  locationMode: "city" | "gps";
  cityId: string;
  gps: { lat: number; lon: number; tz: string } | null;
  method: Method;
  madhab: "Hanafi" | "Shafi";
  /** days added to the Umm al-Qura calendar (Bangladesh usually starts one day later) */
  hijriAdjust: number;
  /** optional exact first day of Ramadan, overrides the calendar */
  startOverride: string;
  /** stop eating this many minutes before Fajr */
  sehriMargin: number;
  /** add this many minutes after sunset for iftar */
  iftarMargin: number;
  khatmGoal: number;
  reminders: boolean;
  analytics: boolean | null;
  qadaMadeUp: number;
  memorised: Record<string, "learning" | "done">;
  zakatPrices: { gold: number; silver: number; currency: string };
  fitraPerPerson: number;
  fitraPeople: number;
  myDuas: MyDua[];
  /** date (YYYY-MM-DD) on which the iftar moment was last closed */
  iftarSeen: string;
  eidName: string;
  /** show the "Alhamdulillah" pop-up after ticking something */
  cheers: boolean;
  /** milestone unlocks: "1448:juz1" → date unlocked */
  trophies: Record<string, string>;
  /** Hijri years whose existing progress has already been recorded without pop-ups */
  trophyYears: number[];
  updatedAt: number;
};

class RamadanDB extends Dexie {
  days!: Table<DayEntry, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("ramadan_planner_db");
    this.version(1).stores({ days: "date", settings: "id" });
    // v2: richer day entries. Old v1 rows are converted so last year's history is kept.
    this.version(2)
      .stores({ days: "date", settings: "id" })
      .upgrade(async (tx) => {
        await tx
          .table("days")
          .toCollection()
          .modify((row: Record<string, unknown>) => {
            if ("fast" in row) return;
            const old = row as {
              fastDone?: boolean;
              prayers?: Record<string, boolean>;
              quranPagesRead?: number;
              quranDone?: boolean;
              note?: string;
            };
            const fresh = defaultDay(row.date as string);
            fresh.fast = old.fastDone ? "done" : null;
            for (const p of FARD) fresh.prayers[p] = !!old.prayers?.[p];
            fresh.extras.taraweeh = !!old.prayers?.taraweeh;
            fresh.quranPages = Number(old.quranPagesRead || 0);
            fresh.grateful = old.note ?? "";
            for (const k of Object.keys(row)) delete row[k];
            Object.assign(row, fresh);
          });
        await tx.table("settings").clear();
      });
  }
}

export const db = new RamadanDB();

export function defaultDay(date: string): DayEntry {
  return {
    date,
    fast: null,
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    extras: { taraweeh: false, tahajjud: false, duha: false },
    quranPages: 0,
    dhikr: 0,
    deeds: {},
    avoided: {},
    actionDone: false,
    duaLearned: false,
    lessonRead: false,
    quizAnswer: null,
    grateful: "",
    improve: "",
    updatedAt: Date.now(),
  };
}

export function defaultSettings(): Settings {
  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Dhaka";
  const inBD = tz === "Asia/Dhaka";
  return {
    id: "settings",
    onboarded: false,
    lang: "bn",
    theme: "auto",
    locationMode: "city",
    cityId: "dhaka",
    gps: null,
    method: inBD ? "Karachi" : "MuslimWorldLeague",
    madhab: "Hanafi",
    hijriAdjust: inBD ? 1 : 0,
    startOverride: "",
    sehriMargin: 0,
    iftarMargin: 0,
    khatmGoal: 1,
    reminders: false,
    analytics: null,
    qadaMadeUp: 0,
    memorised: {},
    zakatPrices: { gold: 0, silver: 0, currency: "৳" },
    fitraPerPerson: 0,
    fitraPeople: 1,
    myDuas: [],
    iftarSeen: "",
    eidName: "",
    cheers: true,
    trophies: {},
    trophyYears: [],
    updatedAt: Date.now(),
  };
}
