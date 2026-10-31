# Ramadan Planner 2.0

A Ramadan companion that works offline. Bangla first, with English as an option. It's built for Bangladesh and works anywhere.

## What it does

- **Today:** the moon shows the real phase of the Hijri day, with a ring for your daily score. It also shows a live countdown to sehri or iftar, the five prayers with their times, extra prayers, your fast status (Fasted, Excused or Missed), Quran pages read, good deeds, habits you stayed away from, and an evening reflection.
- **A 30-day journey:** each day has a theme, a verse of the Quran (Arabic, Bangla and English, with recitation), a dua (Arabic, Bangla and English pronunciation, and meaning), a hadith with its reference, one action to do, a short lesson and a quiz.
- **30 days:** a calendar of the month, your streaks, and markers on the odd nights of the last ten.
- **Quran:** a khatm planner (1, 2 or 3 completions, with juz progress and a catch-up target) and short surahs to memorise, with audio.
- **Learn:** the daily lesson (fiqh of fasting, seerah, Eid), a quiz, and the 99 Names of Allah spread across the month.
- **Tools:** a tasbih counter, a Zakat calculator (silver nisab), a Fitra calculator, a qada tracker, a "My Ramadan" recap, backup and restore, and settings.
- **Settings:** language; a theme that follows the sun (night from Maghrib to sunrise); GPS or a list of 30 cities; 11 calculation methods; Hanafi or Shafi'i Asr; minutes of caution for sehri and iftar; a moon-sighting adjustment of ±days, or an exact start date.
- **Fair to everyone:** excused days (travel, illness, menstruation) don't break streaks and are added to the qada count. During menstruation, prayers are counted as excused.
- **Private:** all data stays on the device (IndexedDB). Google Analytics only loads if the user agrees.

## Content and sources

- Quran text and translations come from [`quran-json`](https://github.com/risan/quran-json) (CC BY 4.0): Uthmani script from quranenc.com, Bangla by Muhiuddin Khan, English by Saheeh International, and transliteration from Tanzil. `npm run build:quran` extracts only the verses the app uses into `src/content/quran.generated.json`.
- The daily content is in `src/content/days.ts` and the 99 Names are in `src/content/names.ts`. Hadith numbers follow Sunnah.com. Where the schools of fiqh differ, the lessons follow the Hanafi view.
- Bangla digits use tiny digit-only cuts of Noto Sans Bengali and Noto Serif Bengali (SIL OFL) in `src/app/fonts/`.
- Recitation is Mishary Alafasy, streamed from everyayah.com. Audio that has been played is cached for offline use.
- Prayer times are calculated with [adhan-js](https://github.com/batoulapps/adhan-js). The start of Ramadan uses the Umm al-Qura calendar plus an adjustment, which is +1 by default for Bangladesh.

## Develop and deploy

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static site in ./out
firebase deploy        # serves ./out (see firebase.json)
```

Data saved by last year's version (2026) is converted automatically the first time the new version opens.

Prepared by Capt Asif Mahmud.
