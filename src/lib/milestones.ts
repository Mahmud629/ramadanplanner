import { addDays } from "./dates";
import { NIGHT_ITEMS, type DayEntry, type Settings } from "./db";
import { bestStreak, prayerPred, prayersCount, quranPred } from "./score";
import { DAYS } from "@/content/days";

type L = { en: string; bn: string };
export type Milestone = {
  id: string;
  icon: "moon" | "mat" | "book" | "star" | "lamp" | "heart" | "beads" | "gift";
  title: L;
  cheer: L;
  need: number;
  measure: (s: Stats) => number;
};

export type Stats = {
  fasts: number;
  fastsOrExcused: number;
  fullPrayerDays: number;
  bestPrayerStreak: number;
  taraweeh: number;
  tahajjud: number;
  pages: number;
  bestQuranStreak: number;
  duas: number;
  lessons: number;
  quizCorrect: number;
  surahs: number;
  sadaqahDays: number;
  fullNights: number;
  afuww: number;
  dhikr: number;
  answered: number;
};

export const MILESTONES: Milestone[] = [
  { id: "fast1", icon: "moon", need: 1, measure: (s) => s.fasts, title: { en: "First fast", bn: "প্রথম রোযা" }, cheer: { en: "Your Ramadan journey has begun. May Allah make the rest easy for you.", bn: "রমাদানের যাত্রা শুরু হলো। আল্লাহ বাকি রোযাগুলো সহজ করে দিন।" } },
  { id: "fast10", icon: "moon", need: 10, measure: (s) => s.fasts, title: { en: "10 fasts", bn: "১০টি রোযা" }, cheer: { en: "A third of the way. Keep going, the best is still ahead.", bn: "এক-তৃতীয়াংশ পথ পেরিয়েছেন। চালিয়ে যান, সেরা দিনগুলো সামনে।" } },
  { id: "fast20", icon: "moon", need: 20, measure: (s) => s.fasts, title: { en: "20 fasts", bn: "২০টি রোযা" }, cheer: { en: "The last ten nights are coming, the most precious part of Ramadan.", bn: "শেষ দশক সামনে, রমাদানের সবচেয়ে মূল্যবান সময়।" } },
  { id: "fastAll", icon: "moon", need: 29, measure: (s) => s.fastsOrExcused, title: { en: "A full Ramadan", bn: "পূর্ণ রমাদান" }, cheer: { en: "Alhamdulillah, the whole month is complete. May Allah accept every fast.", bn: "আলহামদুলিল্লাহ, পুরো মাস সম্পন্ন। আল্লাহ প্রতিটি রোযা কবুল করুন।" } },
  { id: "prayDay", icon: "mat", need: 1, measure: (s) => s.fullPrayerDays, title: { en: "All five in a day", bn: "এক দিনে পাঁচ ওয়াক্ত" }, cheer: { en: "A full day of prayer. Let every day be like this one.", bn: "একটি পূর্ণ দিনের নামায। প্রতিটি দিন এমন হোক।" } },
  { id: "pray7", icon: "mat", need: 7, measure: (s) => s.bestPrayerStreak, title: { en: "7 days of all five prayers", bn: "টানা ৭ দিন পাঁচ ওয়াক্ত" }, cheer: { en: "A full week without missing a prayer. MashaAllah!", bn: "পুরো এক সপ্তাহ কোনো নামায ছাড়েননি। মাশাআল্লাহ!" } },
  { id: "pray10", icon: "mat", need: 10, measure: (s) => s.bestPrayerStreak, title: { en: "10 days of all five prayers", bn: "টানা ১০ দিন পাঁচ ওয়াক্ত" }, cheer: { en: "Salah is becoming the anchor of your day.", bn: "নামায আপনার দিনের নোঙর হয়ে উঠছে।" } },
  { id: "pray30", icon: "mat", need: 30, measure: (s) => s.bestPrayerStreak, title: { en: "30 days of all five prayers", bn: "টানা ৩০ দিন পাঁচ ওয়াক্ত" }, cheer: { en: "A whole month of every prayer. Hold on to this after Ramadan too.", bn: "পুরো মাস প্রতিটি নামায। রমাদানের পরেও এটি ধরে রাখুন।" } },
  { id: "taraweeh10", icon: "star", need: 10, measure: (s) => s.taraweeh, title: { en: "10 nights of Taraweeh", bn: "১০ রাত তারাবিহ" }, cheer: { en: "Standing at night in Ramadan with faith brings forgiveness.", bn: "ঈমানের সাথে রমাদানের রাতে দাঁড়ালে গুনাহ মাফ হয়।" } },
  { id: "taraweeh20", icon: "star", need: 20, measure: (s) => s.taraweeh, title: { en: "20 nights of Taraweeh", bn: "২০ রাত তারাবিহ" }, cheer: { en: "Twenty nights of standing before Allah. May He accept them all.", bn: "বিশ রাত আল্লাহর সামনে দাঁড়িয়েছেন। আল্লাহ সবগুলো কবুল করুন।" } },
  { id: "tahajjud1", icon: "star", need: 1, measure: (s) => s.tahajjud, title: { en: "First Tahajjud", bn: "প্রথম তাহাজ্জুদ" }, cheer: { en: "You woke when Allah descends to the lowest heaven. What a moment.", bn: "যে সময় আল্লাহ দুনিয়ার আসমানে নেমে আসেন, সে সময় আপনি জেগেছেন।" } },
  { id: "tahajjud7", icon: "star", need: 7, measure: (s) => s.tahajjud, title: { en: "7 nights of Tahajjud", bn: "৭ রাত তাহাজ্জুদ" }, cheer: { en: "The night prayer is becoming your habit. MashaAllah!", bn: "রাতের নামায আপনার অভ্যাস হয়ে উঠছে। মাশাআল্লাহ!" } },
  { id: "juz1", icon: "book", need: 21, measure: (s) => s.pages, title: { en: "First juz completed", bn: "প্রথম পারা সম্পন্ন" }, cheer: { en: "A beautiful start with the Quran. One juz down, keep going.", bn: "কুরআনের সাথে সুন্দর শুরু। এক পারা শেষ, এগিয়ে চলুন।" } },
  { id: "juz10", icon: "book", need: 201, measure: (s) => s.pages, title: { en: "10 juz completed", bn: "১০ পারা সম্পন্ন" }, cheer: { en: "A third of the Quran. Every letter is a good deed.", bn: "কুরআনের এক-তৃতীয়াংশ। প্রতিটি হরফে নেকি।" } },
  { id: "khatm", icon: "book", need: 604, measure: (s) => s.pages, title: { en: "Quran completed", bn: "কুরআন খতম" }, cheer: { en: "Alhamdulillah! You've read the whole Quran. May it intercede for you.", bn: "আলহামদুলিল্লাহ! পুরো কুরআন খতম হলো। কুরআন আপনার জন্য সুপারিশকারী হোক।" } },
  { id: "quran7", icon: "book", need: 7, measure: (s) => s.bestQuranStreak, title: { en: "7 days of Quran in a row", bn: "টানা ৭ দিন তিলাওয়াত" }, cheer: { en: "Small and steady is most beloved to Allah.", bn: "নিয়মিত অল্প আমলই আল্লাহর কাছে সবচেয়ে প্রিয়।" } },
  { id: "duas10", icon: "heart", need: 10, measure: (s) => s.duas, title: { en: "10 duas learned", bn: "১০টি দোয়া মুখস্থ" }, cheer: { en: "Ten new ways to call on Allah, yours for life.", bn: "আল্লাহকে ডাকার দশটি নতুন উপায়, সারাজীবনের জন্য।" } },
  { id: "duas30", icon: "heart", need: 30, measure: (s) => s.duas, title: { en: "All 30 duas learned", bn: "৩০টি দোয়াই মুখস্থ" }, cheer: { en: "Every dua of the month is now in your heart. MashaAllah!", bn: "মাসের প্রতিটি দোয়া এখন আপনার হৃদয়ে। মাশাআল্লাহ!" } },
  { id: "lessons10", icon: "lamp", need: 10, measure: (s) => s.lessons, title: { en: "10 lessons read", bn: "১০টি পাঠ পড়েছি" }, cheer: { en: "The path to knowledge is a path to Paradise.", bn: "জ্ঞানের পথ জান্নাতের পথ।" } },
  { id: "lessons30", icon: "lamp", need: 30, measure: (s) => s.lessons, title: { en: "All 30 lessons read", bn: "৩০টি পাঠই সম্পন্ন" }, cheer: { en: "You've finished the whole course. Share what you learned.", bn: "পুরো কোর্স শেষ করেছেন। যা শিখেছেন অন্যকে শেখান।" } },
  { id: "quiz10", icon: "lamp", need: 10, measure: (s) => s.quizCorrect, title: { en: "10 quiz answers right", bn: "১০টি সঠিক উত্তর" }, cheer: { en: "Knowledge that stays with you. Well done.", bn: "শেখা জিনিস মনে থাকছে। মাশাআল্লাহ।" } },
  { id: "surah1", icon: "book", need: 1, measure: (s) => s.surahs, title: { en: "First surah memorised", bn: "প্রথম সূরা মুখস্থ" }, cheer: { en: "Now you can recite it in your salah.", bn: "এখন নামাযে এটি পড়তে পারবেন।" } },
  { id: "surahAll", icon: "book", need: 12, measure: (s) => s.surahs, title: { en: "All 12 surahs memorised", bn: "১২টি সূরাই মুখস্থ" }, cheer: { en: "A treasure for your salah, for life.", bn: "সারাজীবন নামাযের জন্য এক অমূল্য সম্পদ।" } },
  { id: "sadaqah10", icon: "gift", need: 10, measure: (s) => s.sadaqahDays, title: { en: "10 days of sadaqah", bn: "১০ দিন সদকা" }, cheer: { en: "Charity never decreases wealth.", bn: "সদকা সম্পদ কমায় না।" } },
  { id: "night", icon: "star", need: 1, measure: (s) => s.fullNights, title: { en: "A full Qadr night", bn: "পূর্ণ কদরের রাত" }, cheer: { en: "You gave a whole night to Allah. May it be Laylatul Qadr for you.", bn: "পুরো একটি রাত আল্লাহকে দিয়েছেন। আল্লাহ এটিকে আপনার জন্য লাইলাতুল কদর বানান।" } },
  { id: "afuww100", icon: "heart", need: 100, measure: (s) => s.afuww, title: { en: "100 × \"Allahumma innaka 'afuwwun\"", bn: "১০০ বার \"আল্লাহুম্মা ইন্নাকা আফুউন\"" }, cheer: { en: "Asking for pardon again and again, as the Prophet ﷺ taught.", bn: "নবী ﷺ যেমন শিখিয়েছেন, বারবার ক্ষমা চেয়েছেন।" } },
  { id: "dhikr1000", icon: "beads", need: 1000, measure: (s) => s.dhikr, title: { en: "1,000 dhikr", bn: "১০০০ বার যিকির" }, cheer: { en: "Hearts find rest in the remembrance of Allah.", bn: "আল্লাহর যিকিরেই অন্তর প্রশান্তি পায়।" } },
  { id: "answered", icon: "heart", need: 1, measure: (s) => s.answered, title: { en: "A dua answered", bn: "দোয়া কবুল" }, cheer: { en: "Allah answered your call. Thank Him, and keep asking.", bn: "আল্লাহ আপনার ডাকে সাড়া দিয়েছেন। শুকরিয়া আদায় করুন, চাইতে থাকুন।" } },
];

/**
 * Work out the numbers behind every milestone for one Ramadan season: the 30 days of
 * Ramadan plus the months leading up to it (so last year's Ramadan isn't counted again).
 */
export function seasonStats(days: Record<string, DayEntry>, settings: Settings, startISO: string): Stats {
  const ramadan = Array.from({ length: 30 }, (_, i) => addDays(startISO, i));
  const from = addDays(startISO, -320);
  const season = Object.keys(days)
    .filter((d) => d >= from && d <= ramadan[29])
    .sort();
  const allDates: string[] = [];
  for (let d = from; d <= ramadan[29]; d = addDays(d, 1)) allDates.push(d);
  const es = season.map((d) => days[d]);
  const inRamadan = ramadan.map((d) => days[d]).filter(Boolean) as DayEntry[];

  return {
    fasts: inRamadan.filter((e) => e.fast === "done").length,
    fastsOrExcused: inRamadan.filter((e) => e.fast === "done" || e.fast === "excused").length,
    fullPrayerDays: es.filter((e) => prayersCount(e) === 5).length,
    bestPrayerStreak: bestStreak(days, allDates, prayerPred),
    taraweeh: es.filter((e) => e.extras.taraweeh).length,
    tahajjud: es.filter((e) => e.extras.tahajjud).length,
    pages: inRamadan.reduce((a, e) => a + e.quranPages, 0),
    bestQuranStreak: bestStreak(days, allDates, quranPred),
    duas: inRamadan.filter((e) => e.duaLearned).length,
    lessons: inRamadan.filter((e) => e.lessonRead).length,
    quizCorrect: ramadan.filter((d, i) => days[d]?.quizAnswer === DAYS[i].quiz.answer).length,
    surahs: Object.values(settings.memorised).filter((v) => v === "done").length,
    sadaqahDays: es.filter((e) => e.deeds.sadaqah).length,
    fullNights: inRamadan.filter((e) => NIGHT_ITEMS.every((k) => e.night?.[k])).length,
    afuww: inRamadan.reduce((a, e) => a + (e.afuwwCount ?? 0), 0),
    dhikr: es.reduce((a, e) => a + (e.dhikr ?? 0), 0),
    answered: settings.myDuas.filter((d) => d.answered).length,
  };
}


/** Key used to store an unlock: one set of trophies per Ramadan (Hijri year). */
export const trophyKey = (year: number, id: string) => `${year}:${id}`;
