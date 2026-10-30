export type L = { en: string; bn: string };

/** A range of words inside one ayah. `from`/`to` are 0-based word indices (to is inclusive). */
export type AyahPart = { s: number; a: number; from?: number; to?: number };

export type Dua =
  | {
      kind: "quran";
      parts: AyahPart[];
      translit: string;
      bnPron: string;
      meaning: L;
    }
  | {
      kind: "hadith";
      ar: string;
      translit: string;
      bnPron: string;
      meaning: L;
      ref: string;
    };

export type DayContent = {
  day: number;
  theme: L;
  /** verse of the day: surah, first ayah, last ayah */
  verse: { s: number; from: number; to: number };
  dua: Dua;
  hadith: { text: L; ref: string };
  action: L;
  lesson: { title: L; body: L };
  quiz: { q: L; options: L[]; answer: number };
};
