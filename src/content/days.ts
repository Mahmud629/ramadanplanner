import type { DayContent } from "./types";

/**
 * 30-day Ramadan journey.
 * - Quran text and translations are pulled from the quran-json dataset at build time (see scripts/build-quran.mjs).
 * - Hadith are given as meaning with their reference (Sunnah.com numbering).
 * - Fiqh notes follow the Hanafi school where schools differ, since most users are in Bangladesh.
 */
export const DAYS: DayContent[] = [
  {
    day: 1,
    theme: { en: "Intention and taqwa", bn: "নিয়ত ও তাকওয়া" },
    verse: { s: 2, from: 183, to: 183 },
    dua: {
      kind: "quran",
      parts: [{ s: 2, a: 201, from: 3 }],
      translit: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
      bnPron: "রব্বানা আতিনা ফিদ্দুনইয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়া কিনা আযাবান্নার",
      meaning: {
        en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        bn: "হে আমাদের রব, আমাদের দুনিয়াতে কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।",
      },
    },
    hadith: {
      text: {
        en: "Whoever fasts Ramadan with faith and hoping for reward, his past sins will be forgiven.",
        bn: "যে ব্যক্তি ঈমানের সাথে ও সওয়াবের আশায় রমাদানের রোযা রাখে, তার অতীতের গুনাহ ক্ষমা করে দেওয়া হয়।",
      },
      ref: "Bukhari 38, Muslim 760",
    },
    action: {
      en: "Write down three goals for this Ramadan and keep them where you will see them.",
      bn: "এই রমাদানের জন্য তিনটি লক্ষ্য লিখে চোখের সামনে রাখুন।",
    },
    lesson: {
      title: { en: "Who must fast", bn: "কার ওপর রোযা ফরয" },
      body: {
        en: "Fasting Ramadan is obligatory on every Muslim who is adult, sane, physically able and not travelling. Children are not obliged, but it is good to train them gently, as the Companions did with their children.",
        bn: "প্রত্যেক প্রাপ্তবয়স্ক, সুস্থ মস্তিষ্ক, শারীরিকভাবে সক্ষম ও মুকীম (মুসাফির নয় এমন) মুসলিমের ওপর রমাদানের রোযা ফরয। শিশুদের ওপর ফরয নয়, তবে সাহাবিরা যেমন করতেন, তেমনি তাদের ধীরে ধীরে অভ্যস্ত করানো উত্তম।",
      },
    },
    quiz: {
      q: { en: "Who is obliged to fast in Ramadan?", bn: "রমাদানের রোযা কার ওপর ফরয?" },
      options: [
        { en: "Every adult, sane and able Muslim who is not travelling", bn: "প্রত্যেক প্রাপ্তবয়স্ক, সুস্থ ও সক্ষম মুকীম মুসলিম" },
        { en: "Only people who can read the Quran", bn: "শুধু যারা কুরআন পড়তে পারে" },
        { en: "Every child over seven", bn: "সাত বছরের বেশি প্রত্যেক শিশু" },
      ],
      answer: 0,
    },
  },
  {
    day: 2,
    theme: { en: "The month of the Quran", bn: "কুরআনের মাস" },
    verse: { s: 2, from: 185, to: 185 },
    dua: {
      kind: "quran",
      parts: [{ s: 20, a: 114, from: 14 }],
      translit: "Rabbi zidni 'ilma",
      bnPron: "রব্বি যিদনী ইলমা",
      meaning: { en: "My Lord, increase me in knowledge.", bn: "হে আমার রব, আমার জ্ঞান বৃদ্ধি করে দিন।" },
    },
    hadith: {
      text: {
        en: "The best of you are those who learn the Quran and teach it.",
        bn: "তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে এবং অন্যকে শেখায়।",
      },
      ref: "Bukhari 5027",
    },
    action: {
      en: "Fix a daily Quran time and read today's portion.",
      bn: "প্রতিদিন কুরআন পড়ার একটি নির্দিষ্ট সময় ঠিক করুন এবং আজকের অংশ পড়ুন।",
    },
    lesson: {
      title: { en: "The intention (niyyah)", bn: "রোযার নিয়ত" },
      body: {
        en: "The intention is in the heart: deciding to fast is enough, and waking for sehri already shows it. Saying it aloud is not required. Make it at night or before dawn. In the Hanafi school, the intention for a Ramadan fast is still valid until before midday (ad-dahwa al-kubra) if nothing that breaks the fast was done.",
        bn: "নিয়ত মূলত অন্তরের সিদ্ধান্ত; রোযা রাখার ইচ্ছা করাই যথেষ্ট, সেহরির জন্য ওঠাও নিয়তের প্রমাণ। মুখে উচ্চারণ করা জরুরি নয়। রাতে বা সুবহে সাদিকের আগে নিয়ত করুন। হানাফি মাযহাবে রমাদানের রোযার নিয়ত দুপুরের আগ (দাহওয়ায়ে কুবরা) পর্যন্তও করা যায়, যদি রোযা ভঙ্গকারী কিছু না করা হয়।",
      },
    },
    quiz: {
      q: { en: "Where is the intention for fasting made?", bn: "রোযার নিয়ত কোথায় করা হয়?" },
      options: [
        { en: "In the heart", bn: "অন্তরে" },
        { en: "Only by saying it aloud", bn: "শুধু মুখে উচ্চারণ করে" },
        { en: "Only by writing it down", bn: "শুধু লিখে রেখে" },
      ],
      answer: 0,
    },
  },
  {
    day: 3,
    theme: { en: "Allah is near", bn: "আল্লাহ অতি নিকটে" },
    verse: { s: 2, from: 186, to: 186 },
    dua: {
      kind: "quran",
      parts: [{ s: 3, a: 8 }],
      translit: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-Wahhab",
      bnPron: "রব্বানা লা তুযিগ কুলূবানা বা'দা ইয হাদাইতানা ওয়া হাব লানা মিল্লাদুনকা রহমাহ, ইন্নাকা আনতাল ওয়াহহাব",
      meaning: {
        en: "Our Lord, do not let our hearts turn away after You have guided us, and grant us mercy from Yourself. You are the Bestower.",
        bn: "হে আমাদের রব, হিদায়াত দেওয়ার পর আমাদের অন্তরকে বক্র করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন। নিশ্চয়ই আপনি মহাদাতা।",
      },
    },
    hadith: {
      text: {
        en: "Your dua is answered as long as you are not impatient and say, 'I prayed, but I was not answered.'",
        bn: "তোমাদের দোয়া কবুল হয়, যতক্ষণ না তাড়াহুড়া করে বলো: 'আমি দোয়া করেছি, কিন্তু কবুল হয়নি।'",
      },
      ref: "Bukhari 6340, Muslim 2735",
    },
    action: {
      en: "Write a personal dua list and read it before iftar.",
      bn: "নিজের দোয়ার একটি তালিকা লিখুন এবং ইফতারের আগে পড়ুন।",
    },
    lesson: {
      title: { en: "Sehri, the blessed meal", bn: "সেহরি: বরকতময় খাবার" },
      body: {
        en: "Sehri is a sunnah full of blessing, even if it is only a sip of water or a few dates. It is better to eat it late, close to the end of its time, and to stop as soon as Fajr begins.",
        bn: "সেহরি বরকতময় সুন্নত, তা এক ঢোক পানি বা কয়েকটি খেজুর হলেও। সময় শেষ হওয়ার কাছাকাছি দেরিতে সেহরি খাওয়া উত্তম, আর ফজরের সময় শুরু হলেই খাওয়া বন্ধ করতে হবে।",
      },
    },
    quiz: {
      q: { en: "When is the best time to eat sehri?", bn: "সেহরি খাওয়ার উত্তম সময় কখন?" },
      options: [
        { en: "Close to the end of its time, before Fajr", bn: "ফজরের আগে, সময় শেষ হওয়ার কাছাকাছি" },
        { en: "Right after Isha", bn: "ইশার ঠিক পরে" },
        { en: "After Fajr begins", bn: "ফজরের সময় শুরু হওয়ার পর" },
      ],
      answer: 0,
    },
  },
  {
    day: 4,
    theme: { en: "Patience", bn: "সবর" },
    verse: { s: 2, from: 153, to: 153 },
    dua: {
      kind: "quran",
      parts: [{ s: 2, a: 250, from: 5 }],
      translit: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
      bnPron: "রব্বানা আফরিগ আলাইনা সবরাও ওয়া সাব্বিত আকদামানা ওয়ানসুরনা আলাল কওমিল কাফিরীন",
      meaning: {
        en: "Our Lord, pour patience upon us, make our feet firm, and help us against the disbelieving people.",
        bn: "হে আমাদের রব, আমাদের ওপর ধৈর্য ঢেলে দিন, আমাদের পা অবিচল রাখুন এবং কাফির সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।",
      },
    },
    hadith: {
      text: {
        en: "Fasting is a shield. If someone argues or fights with you, say: 'I am fasting.'",
        bn: "রোযা ঢালস্বরূপ। কেউ তোমার সাথে ঝগড়া বা গালিগালাজ করলে বলো: 'আমি রোযাদার।'",
      },
      ref: "Bukhari 1894, Muslim 1151",
    },
    action: {
      en: "When something annoys you today, pause and say: \"I am fasting.\"",
      bn: "আজ কিছু বিরক্ত করলে থামুন এবং বলুন: \"আমি রোযাদার।\"",
    },
    lesson: {
      title: { en: "What breaks the fast", bn: "যা রোযা ভেঙে দেয়" },
      body: {
        en: "Eating or drinking on purpose, marital relations, vomiting on purpose (a mouthful, in the Hanafi school), and the start of menstrual or post-natal bleeding all break the fast. Breaking it deliberately without a valid reason is a serious sin.",
        bn: "ইচ্ছাকৃত খাওয়া বা পান করা, স্বামী-স্ত্রীর মিলন, ইচ্ছাকৃত মুখ ভরে বমি করা (হানাফি মাযহাব অনুযায়ী) এবং হায়েয বা নিফাস শুরু হওয়া—এগুলো রোযা ভেঙে দেয়। কোনো শরয়ী কারণ ছাড়া ইচ্ছাকৃত রোযা ভাঙা বড় গুনাহ।",
      },
    },
    quiz: {
      q: { en: "Which of these breaks the fast?", bn: "কোনটি রোযা ভেঙে দেয়?" },
      options: [
        { en: "Eating or drinking on purpose", bn: "ইচ্ছাকৃত খাওয়া বা পান করা" },
        { en: "Taking a bath", bn: "গোসল করা" },
        { en: "Smelling perfume", bn: "আতরের ঘ্রাণ নেওয়া" },
      ],
      answer: 0,
    },
  },
  {
    day: 5,
    theme: { en: "Gratitude", bn: "শুকরিয়া" },
    verse: { s: 14, from: 7, to: 7 },
    dua: {
      kind: "quran",
      parts: [{ s: 27, a: 19, from: 5 }],
      translit:
        "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni birahmatika fi 'ibadikas-salihin",
      bnPron:
        "রব্বি আওযি'নী আন আশকুরা নি'মাতাকাল্লাতী আন'আমতা আলাইয়া ওয়া আলা ওয়ালিদাইয়া ওয়া আন আ'মালা সলিহান তারদাহু ওয়া আদখিলনী বিরহমাতিকা ফী ইবাদিকাস সলিহীন",
      meaning: {
        en: "My Lord, enable me to be grateful for the favour You have given me and my parents, and to do good deeds that please You. And admit me by Your mercy among Your righteous servants.",
        bn: "হে আমার রব, আমাকে সামর্থ্য দিন যেন আমি আপনার সেই নিয়ামতের শুকরিয়া আদায় করতে পারি যা আপনি আমাকে ও আমার পিতা-মাতাকে দিয়েছেন, এবং এমন সৎকাজ করতে পারি যাতে আপনি সন্তুষ্ট হন। আর আপনার রহমতে আমাকে আপনার নেক বান্দাদের অন্তর্ভুক্ত করুন।",
      },
    },
    hadith: {
      text: {
        en: "Whoever does not thank people has not thanked Allah.",
        bn: "যে মানুষের শুকরিয়া আদায় করে না, সে আল্লাহরও শুকরিয়া আদায় করে না।",
      },
      ref: "Abu Dawud 4811, Tirmidhi 1954",
    },
    action: {
      en: "Thank three people today, by name, for something specific.",
      bn: "আজ তিনজন মানুষকে নির্দিষ্ট কোনো কারণে নাম ধরে ধন্যবাদ দিন।",
    },
    lesson: {
      title: { en: "What does not break the fast", bn: "যা রোযা ভাঙে না" },
      body: {
        en: "Eating or drinking by mistake does not break the fast: \"Allah has fed him and given him drink\" (Bukhari 1933). Brushing your teeth without swallowing, bathing, vomiting without intending to and giving a blood sample do not break it either. For medicines, injections and inhalers, ask a trusted local scholar.",
        bn: "ভুলে খাওয়া বা পান করলে রোযা ভাঙে না: \"আল্লাহই তাকে খাইয়েছেন ও পান করিয়েছেন\" (বুখারি ১৯৩৩)। না গিলে দাঁত মাজা, গোসল করা, অনিচ্ছায় বমি হওয়া ও রক্ত পরীক্ষার জন্য রক্ত দেওয়াতেও রোযা ভাঙে না। ওষুধ, ইনজেকশন বা ইনহেলারের বিষয়ে একজন বিশ্বস্ত আলেমকে জিজ্ঞেস করুন।",
      },
    },
    quiz: {
      q: { en: "If you eat by mistake while fasting, what happens?", bn: "রোযা অবস্থায় ভুলে কিছু খেয়ে ফেললে কী হয়?" },
      options: [
        { en: "The fast is still valid, so keep fasting", bn: "রোযা ঠিক থাকে, রোযা চালিয়ে যেতে হবে" },
        { en: "The fast is broken", bn: "রোযা ভেঙে যায়" },
        { en: "You must pay kaffarah", bn: "কাফফারা দিতে হয়" },
      ],
      answer: 0,
    },
  },
  {
    day: 6,
    theme: { en: "Never lose hope", bn: "আশা হারাবেন না" },
    verse: { s: 39, from: 53, to: 53 },
    dua: {
      kind: "quran",
      parts: [{ s: 23, a: 118 }],
      translit: "Wa qur-Rabbighfir warham wa anta khayrur-rahimin",
      bnPron: "ওয়া কুর রব্বিগফির ওয়ারহাম ওয়া আনতা খইরুর রাহিমীন",
      meaning: {
        en: "And say: My Lord, forgive and have mercy, for You are the best of those who show mercy.",
        bn: "আর বলুন: হে আমার রব, ক্ষমা করুন ও দয়া করুন, আপনিই সর্বশ্রেষ্ঠ দয়ালু।",
      },
    },
    hadith: {
      text: {
        en: "When Ramadan comes, the gates of Paradise are opened, the gates of Hell are closed and the devils are chained.",
        bn: "যখন রমাদান আসে, জান্নাতের দরজাগুলো খুলে দেওয়া হয়, জাহান্নামের দরজাগুলো বন্ধ করে দেওয়া হয় এবং শয়তানদের শিকলবন্দী করা হয়।",
      },
      ref: "Bukhari 1899, Muslim 1079",
    },
    action: { en: "Say istighfar sincerely 100 times.", bn: "আন্তরিকভাবে ১০০ বার ইস্তিগফার পড়ুন।" },
    lesson: {
      title: { en: "The sunnah of iftar", bn: "ইফতারের সুন্নত" },
      body: {
        en: "Break your fast as soon as the sun has set; people remain upon good as long as they hasten the iftar (Bukhari 1957). The Prophet ﷺ broke his fast with fresh dates, otherwise dry dates, otherwise water (Abu Dawud 2356). The moment of iftar is a time for dua.",
        bn: "সূর্য ডোবার সাথে সাথে ইফতার করুন; মানুষ ততদিন কল্যাণে থাকবে যতদিন তারা দ্রুত ইফতার করবে (বুখারি ১৯৫৭)। নবী ﷺ তাজা খেজুর দিয়ে, না পেলে শুকনো খেজুর, তাও না পেলে পানি দিয়ে ইফতার করতেন (আবু দাউদ ২৩৫৬)। ইফতারের মুহূর্ত দোয়ার সময়।",
      },
    },
    quiz: {
      q: { en: "What did the Prophet ﷺ prefer to break his fast with?", bn: "নবী ﷺ কী দিয়ে ইফতার করতে পছন্দ করতেন?" },
      options: [
        { en: "Fresh dates, otherwise dry dates or water", bn: "তাজা খেজুর, না পেলে শুকনো খেজুর বা পানি" },
        { en: "Milk", bn: "দুধ" },
        { en: "Bread", bn: "রুটি" },
      ],
      answer: 0,
    },
  },
  {
    day: 7,
    theme: { en: "Guarding the salah", bn: "নামাযের যত্ন" },
    verse: { s: 29, from: 45, to: 45 },
    dua: {
      kind: "quran",
      parts: [{ s: 14, a: 40 }],
      translit: "Rabbij-'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a",
      bnPron: "রব্বিজ আলনী মুকীমাস সলাতি ওয়া মিন যুররিয়্যাতী, রব্বানা ওয়া তাকাব্বাল দু'আ",
      meaning: {
        en: "My Lord, make me one who establishes prayer, and my descendants too. Our Lord, accept my dua.",
        bn: "হে আমার রব, আমাকে এবং আমার বংশধরদেরও নামায কায়েমকারী বানান। হে আমাদের রব, আমার দোয়া কবুল করুন।",
      },
    },
    hadith: {
      text: {
        en: "Whoever stands in prayer at night in Ramadan with faith and hoping for reward, his past sins will be forgiven.",
        bn: "যে ব্যক্তি ঈমানের সাথে ও সওয়াবের আশায় রমাদানের রাতে নামাযে দাঁড়ায়, তার অতীতের গুনাহ ক্ষমা করে দেওয়া হয়।",
      },
      ref: "Bukhari 37, Muslim 759",
    },
    action: { en: "Pray each salah early in its time today.", bn: "আজ প্রতিটি নামায আউয়াল ওয়াক্তে আদায় করুন।" },
    lesson: {
      title: { en: "Taraweeh", bn: "তারাবিহ" },
      body: {
        en: "Taraweeh is the sunnah night prayer of Ramadan, prayed after Isha, and praying it in congregation is sunnah. The Hanafi school and most mosques in Bangladesh pray 20 rak'ahs; some Muslims pray 8. What matters most is praying with calm and focus rather than speed.",
        bn: "তারাবিহ রমাদানের সুন্নত নামায, ইশার পরে পড়া হয়, জামাতে পড়া সুন্নত। হানাফি মাযহাবে ও বাংলাদেশের অধিকাংশ মসজিদে ২০ রাকাত পড়া হয়; কেউ কেউ ৮ রাকাত পড়েন। সবচেয়ে গুরুত্বপূর্ণ হলো তাড়াহুড়া না করে ধীরস্থিরভাবে ও মনোযোগ দিয়ে পড়া।",
      },
    },
    quiz: {
      q: { en: "When is Taraweeh prayed?", bn: "তারাবিহ কখন পড়া হয়?" },
      options: [
        { en: "After Isha", bn: "ইশার পরে" },
        { en: "Only before Fajr", bn: "শুধু ফজরের আগে" },
        { en: "After Asr", bn: "আসরের পরে" },
      ],
      answer: 0,
    },
  },
  {
    day: 8,
    theme: { en: "Honouring parents", bn: "পিতা-মাতার সম্মান" },
    verse: { s: 17, from: 23, to: 24 },
    dua: {
      kind: "quran",
      parts: [{ s: 17, a: 24, from: 7 }],
      translit: "Rabbir-hamhuma kama rabbayani saghira",
      bnPron: "রব্বির হামহুমা কামা রব্বাইয়ানী সগীরা",
      meaning: {
        en: "My Lord, have mercy on them both, as they raised me when I was small.",
        bn: "হে আমার রব, তাঁদের প্রতি দয়া করুন, যেমন তাঁরা শৈশবে আমাকে লালন-পালন করেছেন।",
      },
    },
    hadith: {
      text: {
        en: "A man asked who most deserves his good company. The Prophet ﷺ said \"Your mother\" three times, then \"your father\".",
        bn: "এক ব্যক্তি জিজ্ঞেস করল, আমার সদাচরণ পাওয়ার সবচেয়ে বেশি হকদার কে? নবী ﷺ তিনবার বললেন: \"তোমার মা\", তারপর বললেন: \"তোমার বাবা\"।",
      },
      ref: "Bukhari 5971, Muslim 2548",
    },
    action: {
      en: "Serve your parents at sehri or iftar, or call them and make dua for them.",
      bn: "সেহরি বা ইফতারে বাবা-মায়ের খেদমত করুন, অথবা ফোন করে তাঁদের জন্য দোয়া করুন।",
    },
    lesson: {
      title: { en: "Who may skip fasting", bn: "কারা রোযা না রাখার অনুমতি পান" },
      body: {
        en: "A traveller and a sick person may skip fasting and make it up later (2:184). A pregnant or breastfeeding woman who fears harm to herself or her baby may also skip and make up later. Elderly people who cannot fast at all give fidya instead.",
        bn: "মুসাফির ও অসুস্থ ব্যক্তি রোযা না রেখে পরে কাযা করতে পারেন (২:১৮৪)। গর্ভবতী বা স্তন্যদানকারী নারী নিজের বা সন্তানের ক্ষতির আশঙ্কা করলে রোযা না রেখে পরে কাযা করতে পারেন। যে বয়স্ক মানুষ একেবারেই রোযা রাখতে পারেন না, তিনি ফিদইয়া দেবেন।",
      },
    },
    quiz: {
      q: { en: "Which verse allows the traveller and the sick to fast later?", bn: "কোন আয়াতে মুসাফির ও অসুস্থকে পরে রোযা রাখার অনুমতি দেওয়া হয়েছে?" },
      options: [
        { en: "Al-Baqarah 2:184", bn: "আল-বাকারা ২:১৮৪" },
        { en: "Al-Qadr 97:1", bn: "আল-কদর ৯৭:১" },
        { en: "Al-Fatihah 1:5", bn: "আল-ফাতিহা ১:৫" },
      ],
      answer: 0,
    },
  },
  {
    day: 9,
    theme: { en: "Guarding the tongue", bn: "জিহ্বার হেফাজত" },
    verse: { s: 49, from: 12, to: 12 },
    dua: {
      kind: "quran",
      parts: [
        { s: 20, a: 25, from: 1 },
        { s: 20, a: 26 },
        { s: 20, a: 27 },
        { s: 20, a: 28 },
      ],
      translit: "Rabbish-rah li sadri, wa yassir li amri, wahlul 'uqdatan min lisani, yafqahu qawli",
      bnPron: "রব্বিশ রহলী সদরী, ওয়া ইয়াসসিরলী আমরী, ওয়াহলুল উকদাতাম মিল্লিসানী, ইয়াফকাহু কওলী",
      meaning: {
        en: "My Lord, open my heart, make my task easy, and untie the knot from my tongue so that they understand my speech.",
        bn: "হে আমার রব, আমার বক্ষ প্রশস্ত করে দিন, আমার কাজ সহজ করে দিন এবং আমার জিহ্বার জড়তা দূর করে দিন, যাতে তারা আমার কথা বুঝতে পারে।",
      },
    },
    hadith: {
      text: {
        en: "Whoever does not give up false speech and acting upon it, Allah has no need for him to give up his food and drink.",
        bn: "যে ব্যক্তি মিথ্যা কথা ও মিথ্যা অনুযায়ী কাজ ছাড়ে না, তার খাবার ও পানীয় ত্যাগ করায় আল্লাহর কোনো প্রয়োজন নেই।",
      },
      ref: "Bukhari 1903",
    },
    action: {
      en: "Go the whole day without complaining or speaking badly of anyone.",
      bn: "সারাদিন কারও নিন্দা বা অভিযোগ না করে কাটান।",
    },
    lesson: {
      title: { en: "Making up fasts and kaffarah", bn: "কাযা ও কাফফারা" },
      body: {
        en: "A fast missed for a valid reason is made up later, one day for each day (qada). Deliberately breaking a Ramadan fast by eating, drinking or marital relations requires qada and, in the Hanafi school, kaffarah: fasting 60 days in a row, or feeding 60 poor people if that is not possible.",
        bn: "শরয়ী কারণে ছুটে যাওয়া রোযা পরে এক দিনের বদলে এক দিন রাখতে হয় (কাযা)। রমাদানের রোযা ইচ্ছাকৃত খেয়ে, পান করে বা স্ত্রী-মিলনের মাধ্যমে ভাঙলে কাযার পাশাপাশি হানাফি মাযহাবে কাফফারাও দিতে হয়: একটানা ৬০ দিন রোযা, তা সম্ভব না হলে ৬০ জন মিসকিনকে খাওয়ানো।",
      },
    },
    quiz: {
      q: { en: "What is a missed fast made up later called?", bn: "ছুটে যাওয়া রোযা পরে রাখাকে কী বলে?" },
      options: [
        { en: "Qada", bn: "কাযা" },
        { en: "Fidya", bn: "ফিদইয়া" },
        { en: "Sadaqah", bn: "সদকা" },
      ],
      answer: 0,
    },
  },
  {
    day: 10,
    theme: { en: "Generosity", bn: "দানশীলতা" },
    verse: { s: 2, from: 261, to: 261 },
    dua: {
      kind: "hadith",
      ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
      translit: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina",
      bnPron: "আল্লাহুম্মা ইন্নী আসআলুকাল হুদা ওয়াত তুকা ওয়াল আফাফা ওয়াল গিনা",
      meaning: {
        en: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
        bn: "হে আল্লাহ, আমি আপনার কাছে হিদায়াত, তাকওয়া, পবিত্রতা ও অমুখাপেক্ষিতা প্রার্থনা করি।",
      },
      ref: "Muslim 2721",
    },
    hadith: {
      text: {
        en: "The Prophet ﷺ was the most generous of people, and he was most generous in Ramadan.",
        bn: "নবী ﷺ ছিলেন মানুষের মধ্যে সবচেয়ে দানশীল, আর রমাদানে তিনি সবচেয়ে বেশি দানশীল হতেন।",
      },
      ref: "Bukhari 6, Muslim 2308",
    },
    action: {
      en: "Give sadaqah quietly today, even a small amount.",
      bn: "আজ গোপনে সদকা দিন, পরিমাণ অল্প হলেও।",
    },
    lesson: {
      title: { en: "Fidya", bn: "ফিদইয়া" },
      body: {
        en: "Someone who can never fast, like the very elderly or the permanently ill, feeds one poor person for each day missed (2:184). In Bangladesh, the fidya per day is usually taken as the Zakat al-Fitr amount announced each year.",
        bn: "যিনি কখনোই রোযা রাখতে পারবেন না, যেমন অতি বৃদ্ধ বা স্থায়ীভাবে অসুস্থ, তিনি প্রতিটি রোযার বদলে একজন মিসকিনকে খাওয়াবেন (২:১৮৪)। বাংলাদেশে সাধারণত প্রতি বছর ঘোষিত ফিতরার পরিমাণকেই প্রতি দিনের ফিদইয়া ধরা হয়।",
      },
    },
    quiz: {
      q: { en: "What is fidya?", bn: "ফিদইয়া কী?" },
      options: [
        { en: "Feeding one poor person for each day missed", bn: "প্রতিটি রোযার বদলে একজন মিসকিনকে খাওয়ানো" },
        { en: "Fasting 60 days in a row", bn: "একটানা ৬০ দিন রোযা রাখা" },
        { en: "Praying two rak'ahs", bn: "দুই রাকাত নামায পড়া" },
      ],
      answer: 0,
    },
  },
  {
    day: 11,
    theme: { en: "Forgiving others", bn: "অন্যকে ক্ষমা করা" },
    verse: { s: 24, from: 22, to: 22 },
    dua: {
      kind: "quran",
      parts: [{ s: 14, a: 41 }],
      translit: "Rabbanagh-fir li wa li-walidayya wa lil-mu'minina yawma yaqumul-hisab",
      bnPron: "রব্বানাগফিরলী ওয়ালি ওয়ালিদাইয়া ওয়ালিল মু'মিনীনা ইয়াওমা ইয়াকূমুল হিসাব",
      meaning: {
        en: "Our Lord, forgive me, my parents and the believers on the Day when the reckoning takes place.",
        bn: "হে আমাদের রব, যেদিন হিসাব কায়েম হবে, সেদিন আমাকে, আমার পিতা-মাতাকে এবং সকল মুমিনকে ক্ষমা করুন।",
      },
    },
    hadith: {
      text: {
        en: "Charity does not decrease wealth. Allah increases in honour the one who forgives, and whoever humbles himself for Allah, Allah raises him.",
        bn: "সদকা সম্পদ কমায় না। যে ক্ষমা করে, আল্লাহ তার সম্মান বাড়িয়ে দেন। আর যে আল্লাহর জন্য বিনয়ী হয়, আল্লাহ তাকে উঁচু করেন।",
      },
      ref: "Muslim 2588",
    },
    action: {
      en: "Forgive someone who hurt you, and make dua for them.",
      bn: "যে আপনাকে কষ্ট দিয়েছে, তাকে ক্ষমা করুন এবং তার জন্য দোয়া করুন।",
    },
    lesson: {
      title: { en: "Women and fasting", bn: "নারী ও রোযা" },
      body: {
        en: "During menstruation or post-natal bleeding a woman does not fast, and she makes up the days later. There is no sin in this; it is Allah's ruling. She can still earn great reward through dhikr, dua, charity, listening to the Quran and serving others. In this app, mark these days as \"Excused\" so your streak is not broken.",
        bn: "হায়েয বা নিফাস চলাকালে নারী রোযা রাখবেন না, পরে কাযা করবেন। এতে কোনো গুনাহ নেই; এটি আল্লাহরই বিধান। এ সময়েও যিকির, দোয়া, দান, কুরআন শোনা ও অন্যের সেবার মাধ্যমে অনেক সওয়াব অর্জন করা যায়। এই অ্যাপে এই দিনগুলো \"অব্যাহতি\" হিসেবে চিহ্নিত করুন, তাহলে আপনার ধারাবাহিকতা ভাঙবে না।",
      },
    },
    quiz: {
      q: { en: "What does a woman do during menstruation in Ramadan?", bn: "রমাদানে হায়েয চলাকালে নারী কী করবেন?" },
      options: [
        { en: "She does not fast and makes it up later", bn: "রোযা রাখবেন না, পরে কাযা করবেন" },
        { en: "She must fast anyway", bn: "তবুও রোযা রাখতে হবে" },
        { en: "She never needs to make it up", bn: "কখনো কাযা করতে হবে না" },
      ],
      answer: 0,
    },
  },
  {
    day: 12,
    theme: { en: "Remembering Allah", bn: "আল্লাহর যিকির" },
    verse: { s: 13, from: 28, to: 28 },
    dua: {
      kind: "hadith",
      ar: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
      translit: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
      bnPron: "আল্লাহুম্মা আ'ইন্নী আলা যিকরিকা ওয়া শুকরিকা ওয়া হুসনি ইবাদাতিক",
      meaning: {
        en: "O Allah, help me to remember You, to thank You and to worship You well.",
        bn: "হে আল্লাহ, আপনার যিকির, আপনার শুকরিয়া এবং সুন্দরভাবে আপনার ইবাদত করতে আমাকে সাহায্য করুন।",
      },
      ref: "Abu Dawud 1522",
    },
    hadith: {
      text: {
        en: "The one who remembers his Lord and the one who does not are like the living and the dead.",
        bn: "যে তার রবের যিকির করে আর যে করে না, তাদের উদাহরণ জীবিত ও মৃতের মতো।",
      },
      ref: "Bukhari 6407",
    },
    action: { en: "Say the morning and evening adhkar.", bn: "সকাল-সন্ধ্যার যিকিরগুলো পড়ুন।" },
    lesson: {
      title: { en: "Fasting of the whole body", bn: "সমস্ত অঙ্গের রোযা" },
      body: {
        en: "A complete fast also protects the eyes, ears, tongue and hands. Lying, backbiting, quarrelling and wasting time do not legally break the fast, but they can empty it of its reward.",
        bn: "পূর্ণাঙ্গ রোযা চোখ, কান, জিহ্বা ও হাতকেও হেফাজত করে। মিথ্যা, গীবত, ঝগড়া ও সময় নষ্ট করলে ফিকহি দৃষ্টিতে রোযা ভাঙে না, কিন্তু রোযার সওয়াব নষ্ট হয়ে যেতে পারে।",
      },
    },
    quiz: {
      q: { en: "What happens to a fast filled with lying and backbiting?", bn: "মিথ্যা ও গীবতে ভরা রোযার কী হয়?" },
      options: [
        { en: "It can lose its reward", bn: "এর সওয়াব নষ্ট হয়ে যেতে পারে" },
        { en: "It earns double reward", bn: "দ্বিগুণ সওয়াব পাওয়া যায়" },
        { en: "Nothing changes", bn: "কিছুই হয় না" },
      ],
      answer: 0,
    },
  },
  {
    day: 13,
    theme: { en: "Trust in Allah", bn: "তাওয়াক্কুল" },
    verse: { s: 65, from: 3, to: 3 },
    dua: {
      kind: "quran",
      parts: [{ s: 28, a: 24, from: 7 }],
      translit: "Rabbi inni lima anzalta ilayya min khayrin faqir",
      bnPron: "রব্বি ইন্নী লিমা আনযালতা ইলাইয়া মিন খইরিন ফাকীর",
      meaning: {
        en: "My Lord, I am truly in need of whatever good You send down to me.",
        bn: "হে আমার রব, আপনি আমার প্রতি যে কল্যাণই নাযিল করবেন, আমি তার মুখাপেক্ষী।",
      },
    },
    hadith: {
      text: {
        en: "If you relied on Allah as He truly deserves, He would provide for you as He provides for the birds: they leave hungry in the morning and return full in the evening.",
        bn: "তোমরা যদি আল্লাহর ওপর যথাযথভাবে ভরসা করতে, তবে তিনি তোমাদের রিযিক দিতেন যেমন পাখিদের দেন—তারা সকালে খালি পেটে বের হয় আর সন্ধ্যায় ভরা পেটে ফেরে।",
      },
      ref: "Tirmidhi 2344",
    },
    action: {
      en: "Say Bismillah before every task today and leave the result to Allah.",
      bn: "আজ প্রতিটি কাজের শুরুতে বিসমিল্লাহ বলুন এবং ফলাফল আল্লাহর ওপর ছেড়ে দিন।",
    },
    lesson: {
      title: { en: "Revelation began in Ramadan", bn: "রমাদানে ওহির সূচনা" },
      body: {
        en: "The revelation of the Quran began in Ramadan, in the cave of Hira, with the words \"Read in the name of your Lord who created\" (96:1). The Prophet ﷺ was about forty years old.",
        bn: "কুরআনের ওহি রমাদানে হেরা গুহায় শুরু হয়, প্রথম বাণী ছিল: \"পড়ুন আপনার রবের নামে, যিনি সৃষ্টি করেছেন\" (৯৬:১)। তখন নবী ﷺ-এর বয়স ছিল প্রায় চল্লিশ বছর।",
      },
    },
    quiz: {
      q: { en: "Where did the revelation of the Quran begin?", bn: "কুরআনের ওহি কোথায় শুরু হয়?" },
      options: [
        { en: "The cave of Hira", bn: "হেরা গুহায়" },
        { en: "The cave of Thawr", bn: "সাওর গুহায়" },
        { en: "Masjid an-Nabawi", bn: "মসজিদে নববীতে" },
      ],
      answer: 0,
    },
  },
  {
    day: 14,
    theme: { en: "Truthfulness", bn: "সত্যবাদিতা" },
    verse: { s: 9, from: 119, to: 119 },
    dua: {
      kind: "quran",
      parts: [{ s: 17, a: 80, from: 1 }],
      translit: "Rabbi adkhilni mudkhala sidqin wa akhrijni mukhraja sidqin waj'al li min ladunka sultanan nasira",
      bnPron: "রব্বি আদখিলনী মুদখালা সিদকিও ওয়া আখরিজনী মুখরাজা সিদকিও ওয়াজ'আল্লী মিল্লাদুনকা সুলতানান নাসীরা",
      meaning: {
        en: "My Lord, let me enter with truth and leave with truth, and grant me from Yourself a helping authority.",
        bn: "হে আমার রব, আমাকে সত্যের সাথে প্রবেশ করান এবং সত্যের সাথে বের করুন, আর আপনার পক্ষ থেকে আমাকে সাহায্যকারী শক্তি দান করুন।",
      },
    },
    hadith: {
      text: {
        en: "Truthfulness leads to righteousness, and righteousness leads to Paradise.",
        bn: "সত্যবাদিতা নেকির পথ দেখায়, আর নেকি জান্নাতের পথ দেখায়।",
      },
      ref: "Bukhari 6094, Muslim 2607",
    },
    action: {
      en: "Keep every promise today and tell the truth even when it is hard.",
      bn: "আজ প্রতিটি কথা রাখুন এবং কঠিন হলেও সত্য বলুন।",
    },
    lesson: {
      title: { en: "How the Prophet ﷺ spent Ramadan", bn: "নবী ﷺ-এর রমাদান" },
      body: {
        en: "Every Ramadan, Jibril reviewed the Quran with the Prophet ﷺ, and in his final year they reviewed it twice (Bukhari 4998). You can follow this by reciting with a family member or listening to a full recitation during the month.",
        bn: "প্রতি রমাদানে জিবরীল নবী ﷺ-এর সাথে কুরআন পুনরাবৃত্তি করতেন, আর তাঁর জীবনের শেষ বছরে দুইবার করেছিলেন (বুখারি ৪৯৯৮)। পরিবারের কারও সাথে মিলে তিলাওয়াত করে বা মাসজুড়ে পুরো কুরআনের তিলাওয়াত শুনে আপনিও এটি অনুসরণ করতে পারেন।",
      },
    },
    quiz: {
      q: { en: "How many times did Jibril review the Quran with the Prophet ﷺ in his final Ramadan?", bn: "জীবনের শেষ রমাদানে জিবরীল নবী ﷺ-এর সাথে কতবার কুরআন পুনরাবৃত্তি করেছিলেন?" },
      options: [
        { en: "Twice", bn: "দুইবার" },
        { en: "Once", bn: "একবার" },
        { en: "Three times", bn: "তিনবার" },
      ],
      answer: 0,
    },
  },
  {
    day: 15,
    theme: { en: "Family", bn: "পরিবার" },
    verse: { s: 66, from: 6, to: 6 },
    dua: {
      kind: "quran",
      parts: [{ s: 25, a: 74, from: 2 }],
      translit: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
      bnPron: "রব্বানা হাবলানা মিন আযওয়াজিনা ওয়া যুররিয়্যাতিনা কুররাতা আ'ইউনিও ওয়াজ'আলনা লিল মুত্তাকীনা ইমামা",
      meaning: {
        en: "Our Lord, give us joy in our spouses and children, and make us an example for the righteous.",
        bn: "হে আমাদের রব, আমাদের জীবনসঙ্গী ও সন্তানদের আমাদের চোখের শীতলতা বানিয়ে দিন এবং আমাদের মুত্তাকীদের জন্য আদর্শ বানান।",
      },
    },
    hadith: {
      text: {
        en: "The best of you is the one who is best to his family, and I am the best of you to my family.",
        bn: "তোমাদের মধ্যে সর্বোত্তম সে, যে তার পরিবারের কাছে সর্বোত্তম। আর আমি আমার পরিবারের কাছে তোমাদের মধ্যে সর্বোত্তম।",
      },
      ref: "Tirmidhi 3895",
    },
    action: {
      en: "Have iftar together as a family and share one thing you learned this week.",
      bn: "পরিবারের সবাই মিলে ইফতার করুন এবং এই সপ্তাহে শেখা একটি বিষয় সবাইকে বলুন।",
    },
    lesson: {
      title: { en: "Zakat", bn: "যাকাত" },
      body: {
        en: "Zakat is one of the five pillars: 2.5% of savings, gold, silver, cash and business goods that stay above the nisab for a full lunar year. Many people pay it in Ramadan for the greater reward. Use the Zakat calculator in Tools.",
        bn: "যাকাত ইসলামের পাঁচ স্তম্ভের একটি: নিসাব পরিমাণ বা তার বেশি সঞ্চয়, সোনা, রুপা, নগদ অর্থ ও ব্যবসায়িক পণ্য পূর্ণ এক চান্দ্র বছর থাকলে তার ২.৫%। বেশি সওয়াবের আশায় অনেকে রমাদানে যাকাত দেন। টুলস অংশে যাকাত ক্যালকুলেটর ব্যবহার করুন।",
      },
    },
    quiz: {
      q: { en: "What is the rate of zakat on savings?", bn: "সঞ্চয়ের ওপর যাকাতের হার কত?" },
      options: [
        { en: "2.5%", bn: "২.৫%" },
        { en: "10%", bn: "১০%" },
        { en: "5%", bn: "৫%" },
      ],
      answer: 0,
    },
  },
  {
    day: 16,
    theme: { en: "Brotherhood", bn: "ভ্রাতৃত্ব" },
    verse: { s: 49, from: 10, to: 10 },
    dua: {
      kind: "quran",
      parts: [{ s: 59, a: 10, from: 5 }],
      translit:
        "Rabbanagh-fir lana wa li-ikhwaninal-ladhina sabaquna bil-imani wa la taj'al fi qulubina ghillal-lilladhina amanu, Rabbana innaka Ra'ufur-Rahim",
      bnPron:
        "রব্বানাগফিরলানা ওয়ালি ইখওয়ানিনাল্লাযীনা সাবাকূনা বিল ঈমানি ওয়ালা তাজ'আল ফী কুলূবিনা গিল্লাল লিল্লাযীনা আমানূ, রব্বানা ইন্নাকা রউফুর রহীম",
      meaning: {
        en: "Our Lord, forgive us and our brothers who came before us in faith, and leave no resentment in our hearts toward the believers. Our Lord, You are Kind and Merciful.",
        bn: "হে আমাদের রব, আমাদের এবং ঈমানে অগ্রগামী আমাদের ভাইদের ক্ষমা করুন, আর মুমিনদের প্রতি আমাদের অন্তরে কোনো বিদ্বেষ রাখবেন না। হে আমাদের রব, নিশ্চয়ই আপনি অতি স্নেহশীল, পরম দয়ালু।",
      },
    },
    hadith: {
      text: {
        en: "None of you truly believes until he loves for his brother what he loves for himself.",
        bn: "তোমাদের কেউ প্রকৃত মুমিন হবে না, যতক্ষণ না সে নিজের জন্য যা পছন্দ করে, তার ভাইয়ের জন্যও তা পছন্দ করে।",
      },
      ref: "Bukhari 13, Muslim 45",
    },
    action: {
      en: "Contact a relative or friend you have not spoken to in a while.",
      bn: "অনেকদিন কথা হয়নি এমন কোনো আত্মীয় বা বন্ধুর খোঁজ নিন।",
    },
    lesson: {
      title: { en: "The manners of dua", bn: "দোয়ার আদব" },
      body: {
        en: "Begin by praising Allah and sending salawat on the Prophet ﷺ, ask with certainty and humility, and keep asking. Special times include the last third of the night, between the adhan and iqamah, while fasting and at iftar.",
        bn: "আল্লাহর প্রশংসা ও নবী ﷺ-এর ওপর দরুদ পাঠ করে দোয়া শুরু করুন, দৃঢ় বিশ্বাস ও বিনয়ের সাথে চান এবং চাইতে থাকুন। দোয়ার বিশেষ সময়: রাতের শেষ তৃতীয়াংশ, আযান ও ইকামতের মাঝখানে, রোযা অবস্থায় ও ইফতারের সময়।",
      },
    },
    quiz: {
      q: { en: "Which is a special time for dua?", bn: "কোনটি দোয়ার বিশেষ সময়?" },
      options: [
        { en: "The last third of the night", bn: "রাতের শেষ তৃতীয়াংশ" },
        { en: "Only at noon on Fridays", bn: "শুধু শুক্রবার দুপুরে" },
        { en: "There is no special time", bn: "কোনো বিশেষ সময় নেই" },
      ],
      answer: 0,
    },
  },
  {
    day: 17,
    theme: { en: "The day of Badr", bn: "বদরের দিন" },
    verse: { s: 3, from: 123, to: 123 },
    dua: {
      kind: "quran",
      parts: [{ s: 2, a: 286, from: 12 }],
      translit:
        "Rabbana la tu'akhidhna in nasina aw akhta'na, Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina, Rabbana wa la tuhammilna ma la taqata lana bih, wa'fu 'anna waghfir lana warhamna, anta mawlana fansurna 'alal-qawmil-kafirin",
      bnPron:
        "রব্বানা লা তুআখিযনা ইন নাসীনা আও আখতা'না, রব্বানা ওয়ালা তাহমিল আলাইনা ইসরান কামা হামালতাহু আলাল্লাযীনা মিন কবলিনা, রব্বানা ওয়ালা তুহাম্মিলনা মা লা তাকাতা লানা বিহ, ওয়া'ফু আন্না ওয়াগফিরলানা ওয়ারহামনা, আনতা মাওলানা ফানসুরনা আলাল কওমিল কাফিরীন",
      meaning: {
        en: "Our Lord, do not hold us to account if we forget or make a mistake. Our Lord, do not put on us a burden like the one You put on those before us. Our Lord, do not burden us with more than we can bear. Pardon us, forgive us and have mercy on us. You are our Protector, so help us against the disbelieving people.",
        bn: "হে আমাদের রব, আমরা যদি ভুলে যাই বা ভুল করি, আমাদের পাকড়াও করবেন না। হে আমাদের রব, আমাদের পূর্ববর্তীদের ওপর যেমন ভারী বোঝা চাপিয়েছিলেন, আমাদের ওপর তেমন বোঝা চাপাবেন না। হে আমাদের রব, যা বহনের সামর্থ্য আমাদের নেই, তা আমাদের ওপর চাপাবেন না। আমাদের মাফ করুন, ক্ষমা করুন ও দয়া করুন। আপনিই আমাদের অভিভাবক, তাই কাফির সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।",
      },
    },
    hadith: {
      text: {
        en: "Eat sehri, for there is blessing in sehri.",
        bn: "তোমরা সেহরি খাও, কেননা সেহরিতে বরকত রয়েছে।",
      },
      ref: "Bukhari 1923, Muslim 1095",
    },
    action: {
      en: "Read about the Battle of Badr and tell someone what you learned.",
      bn: "বদর যুদ্ধ সম্পর্কে পড়ুন এবং যা শিখলেন কাউকে বলুন।",
    },
    lesson: {
      title: { en: "The Battle of Badr", bn: "বদর যুদ্ধ" },
      body: {
        en: "On 17 Ramadan, 2 AH, about 313 Muslims faced an army of around 1,000 at Badr. Allah gave them victory and called it \"the Day of the Criterion\" (8:41). Victory came from trust in Allah, not from numbers.",
        bn: "দ্বিতীয় হিজরির ১৭ রমাদান বদরে প্রায় ৩১৩ জন মুসলিম প্রায় ১,০০০ জনের একটি বাহিনীর মুখোমুখি হন। আল্লাহ তাদের বিজয় দান করেন এবং এই দিনকে \"ফুরকানের দিন\" বলেছেন (৮:৪১)। বিজয় এসেছিল আল্লাহর ওপর ভরসা থেকে, সংখ্যা থেকে নয়।",
      },
    },
    quiz: {
      q: { en: "On which day of Ramadan was the Battle of Badr?", bn: "রমাদানের কত তারিখে বদর যুদ্ধ হয়েছিল?" },
      options: [
        { en: "The 17th", bn: "১৭ তারিখে" },
        { en: "The 27th", bn: "২৭ তারিখে" },
        { en: "The 1st", bn: "১ তারিখে" },
      ],
      answer: 0,
    },
  },
  {
    day: 18,
    theme: { en: "Humility", bn: "বিনয়" },
    verse: { s: 25, from: 63, to: 63 },
    dua: {
      kind: "quran",
      parts: [{ s: 7, a: 23, from: 1 }],
      translit: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin",
      bnPron: "রব্বানা যলামনা আনফুসানা ওয়া ইল্লাম তাগফিরলানা ওয়া তারহামনা লানাকূনান্না মিনাল খসিরীন",
      meaning: {
        en: "Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.",
        bn: "হে আমাদের রব, আমরা নিজেদের ওপর জুলুম করেছি। আপনি যদি আমাদের ক্ষমা না করেন ও দয়া না করেন, তবে আমরা অবশ্যই ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।",
      },
    },
    hadith: {
      text: {
        en: "No one with an atom's weight of arrogance in his heart will enter Paradise.",
        bn: "যার অন্তরে অণু পরিমাণ অহংকার আছে, সে জান্নাতে প্রবেশ করবে না।",
      },
      ref: "Muslim 91",
    },
    action: {
      en: "Help with a household task you usually leave to others.",
      bn: "ঘরের এমন একটি কাজে সাহায্য করুন যা সাধারণত অন্যরা করে।",
    },
    lesson: {
      title: { en: "Sadaqah has many forms", bn: "সদকার নানা রূপ" },
      body: {
        en: "Every act of kindness is sadaqah (Bukhari 6021). Smiling at your brother, removing something harmful from the road, helping someone with their load and saying a good word all count.",
        bn: "প্রতিটি ভালো কাজই সদকা (বুখারি ৬০২১)। ভাইয়ের দিকে হাসিমুখে তাকানো, রাস্তা থেকে কষ্টদায়ক জিনিস সরানো, কারও বোঝা বহনে সাহায্য করা ও একটি ভালো কথা বলা—সবই সদকা।",
      },
    },
    quiz: {
      q: { en: "Which of these is also sadaqah?", bn: "নিচের কোনটিও সদকা?" },
      options: [
        { en: "Smiling at your brother", bn: "ভাইয়ের দিকে হাসিমুখে তাকানো" },
        { en: "Only giving money", bn: "শুধু টাকা দেওয়া" },
        { en: "Only giving gold", bn: "শুধু সোনা দেওয়া" },
      ],
      answer: 0,
    },
  },
  {
    day: 19,
    theme: { en: "After hardship comes ease", bn: "কষ্টের পর স্বস্তি" },
    verse: { s: 94, from: 5, to: 6 },
    dua: {
      kind: "quran",
      parts: [{ s: 21, a: 87, from: 14 }],
      translit: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
      bnPron: "লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনায যলিমীন",
      meaning: {
        en: "There is no god but You. Glory be to You! I have been one of the wrongdoers.",
        bn: "আপনি ছাড়া কোনো ইলাহ নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।",
      },
    },
    hadith: {
      text: {
        en: "No tiredness, illness, worry, grief, harm or sadness reaches a Muslim, not even a thorn that pricks him, without Allah wiping away some of his sins because of it.",
        bn: "মুসলিমের ওপর যে ক্লান্তি, অসুস্থতা, দুশ্চিন্তা, দুঃখ, কষ্ট বা বেদনা আসে—এমনকি একটি কাঁটা বিঁধলেও—আল্লাহ এর মাধ্যমে তার কিছু গুনাহ মাফ করে দেন।",
      },
      ref: "Bukhari 5641, Muslim 2573",
    },
    action: {
      en: "Visit or call someone who is ill or going through a hard time.",
      bn: "অসুস্থ বা কষ্টে থাকা কাউকে দেখতে যান বা ফোন করুন।",
    },
    lesson: {
      title: { en: "The last third of the night", bn: "রাতের শেষ তৃতীয়াংশ" },
      body: {
        en: "In the last third of every night, Allah descends to the lowest heaven and says: \"Who is calling on Me, so that I may answer him?\" (Bukhari 1145). Sehri time falls inside it, so pray two rak'ahs and make dua before you eat.",
        bn: "প্রতি রাতের শেষ তৃতীয়াংশে আল্লাহ দুনিয়ার আসমানে নেমে আসেন এবং বলেন: \"কে আমাকে ডাকছে, আমি তার ডাকে সাড়া দেব?\" (বুখারি ১১৪৫)। সেহরির সময় এর মধ্যেই পড়ে, তাই খাওয়ার আগে দুই রাকাত নামায পড়ে দোয়া করুন।",
      },
    },
    quiz: {
      q: { en: "When does Allah descend to the lowest heaven?", bn: "আল্লাহ কখন দুনিয়ার আসমানে নেমে আসেন?" },
      options: [
        { en: "In the last third of the night", bn: "রাতের শেষ তৃতীয়াংশে" },
        { en: "At noon", bn: "দুপুরে" },
        { en: "After Asr", bn: "আসরের পরে" },
      ],
      answer: 0,
    },
  },
  {
    day: 20,
    theme: { en: "Justice and excellence", bn: "ন্যায় ও ইহসান" },
    verse: { s: 16, from: 90, to: 90 },
    dua: {
      kind: "quran",
      parts: [{ s: 26, a: 83 }],
      translit: "Rabbi hab li hukman wa alhiqni bis-salihin",
      bnPron: "রব্বি হাবলী হুকমাও ওয়া আলহিকনী বিস সলিহীন",
      meaning: {
        en: "My Lord, grant me wisdom and join me with the righteous.",
        bn: "হে আমার রব, আমাকে প্রজ্ঞা দান করুন এবং আমাকে নেককারদের অন্তর্ভুক্ত করুন।",
      },
    },
    hadith: {
      text: {
        en: "The just will be with Allah on pulpits of light: those who are just in their judgements, with their families and in whatever they are put in charge of.",
        bn: "ন্যায়পরায়ণরা আল্লাহর কাছে নূরের মিম্বরে থাকবে—যারা তাদের বিচারে, পরিবারে এবং দায়িত্বপ্রাপ্ত বিষয়ে ন্যায় করে।",
      },
      ref: "Muslim 1827",
    },
    action: {
      en: "Return something you borrowed or pay off a small debt.",
      bn: "ধার নেওয়া কিছু ফেরত দিন বা ছোট কোনো ঋণ পরিশোধ করুন।",
    },
    lesson: {
      title: { en: "The conquest of Makkah", bn: "মক্কা বিজয়" },
      body: {
        en: "In Ramadan of 8 AH, the Prophet ﷺ entered Makkah with about 10,000 Companions, almost without fighting. He forgave the people who had persecuted him for years. Strength is best used for mercy.",
        bn: "অষ্টম হিজরির রমাদানে নবী ﷺ প্রায় ১০,০০০ সাহাবি নিয়ে প্রায় বিনা যুদ্ধে মক্কায় প্রবেশ করেন। যারা বছরের পর বছর তাঁকে নির্যাতন করেছিল, তিনি তাদের ক্ষমা করে দেন। শক্তির শ্রেষ্ঠ ব্যবহার দয়ায়।",
      },
    },
    quiz: {
      q: { en: "In which year was Makkah conquered?", bn: "মক্কা বিজয় কোন হিজরি সালে হয়েছিল?" },
      options: [
        { en: "8 AH", bn: "৮ হিজরি" },
        { en: "2 AH", bn: "২ হিজরি" },
        { en: "10 AH", bn: "১০ হিজরি" },
      ],
      answer: 0,
    },
  },
  {
    day: 21,
    theme: { en: "The Night of Decree", bn: "লাইলাতুল কদর" },
    verse: { s: 97, from: 1, to: 5 },
    dua: {
      kind: "hadith",
      ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      translit: "Allahumma innaka 'Afuwwun tuhibbul-'afwa fa'fu 'anni",
      bnPron: "আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল আফওয়া ফা'ফু আন্নী",
      meaning: {
        en: "O Allah, You are the Pardoner and You love to pardon, so pardon me.",
        bn: "হে আল্লাহ, আপনি ক্ষমাশীল, ক্ষমা করতে ভালোবাসেন, অতএব আমাকে ক্ষমা করুন।",
      },
      ref: "Tirmidhi 3513",
    },
    hadith: {
      text: {
        en: "Seek Laylatul Qadr in the odd nights of the last ten nights of Ramadan.",
        bn: "তোমরা রমাদানের শেষ দশকের বেজোড় রাতগুলোতে লাইলাতুল কদর অনুসন্ধান করো।",
      },
      ref: "Bukhari 2017",
    },
    action: {
      en: "Plan your last ten nights: sleep early and wake for tahajjud.",
      bn: "শেষ দশকের রাতগুলোর পরিকল্পনা করুন: আগে ঘুমান, তাহাজ্জুদে উঠুন।",
    },
    lesson: {
      title: { en: "Laylatul Qadr", bn: "লাইলাতুল কদর" },
      body: {
        en: "Laylatul Qadr is better than a thousand months (97:3). It is most likely in the odd nights of the last ten. Spend those nights in salah, Quran, dhikr and the dua the Prophet ﷺ taught Aisha: \"Allahumma innaka 'Afuwwun...\".",
        bn: "লাইলাতুল কদর হাজার মাসের চেয়েও উত্তম (৯৭:৩)। শেষ দশকের বেজোড় রাতগুলোতে এর সম্ভাবনা সবচেয়ে বেশি। এই রাতগুলো নামায, কুরআন, যিকির এবং নবী ﷺ আয়েশা (রা.)-কে যে দোয়া শিখিয়েছিলেন—\"আল্লাহুম্মা ইন্নাকা আফুউন...\"—তাতে কাটান।",
      },
    },
    quiz: {
      q: { en: "Laylatul Qadr is better than…", bn: "লাইলাতুল কদর কিসের চেয়ে উত্তম?" },
      options: [
        { en: "A thousand months", bn: "হাজার মাসের চেয়ে" },
        { en: "A hundred days", bn: "একশ দিনের চেয়ে" },
        { en: "One year", bn: "এক বছরের চেয়ে" },
      ],
      answer: 0,
    },
  },
  {
    day: 22,
    theme: { en: "Repentance", bn: "তওবা" },
    verse: { s: 3, from: 135, to: 135 },
    dua: {
      kind: "hadith",
      ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      translit:
        "Allahumma anta Rabbi, la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa anta",
      bnPron:
        "আল্লাহুম্মা আনতা রব্বী, লা ইলাহা ইল্লা আনতা, খলাকতানী ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া'দিকা মাসতাত'তু, আ'ঊযু বিকা মিন শাররি মা সনা'তু, আবূউ লাকা বিনি'মাতিকা আলাইয়া, ওয়া আবূউ বিযামবী ফাগফিরলী, ফাইন্নাহূ লা ইয়াগফিরুয যুনূবা ইল্লা আনতা",
      meaning: {
        en: "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. I hold to Your covenant and promise as much as I can. I seek refuge in You from the evil I have done. I acknowledge Your favours upon me and I acknowledge my sins, so forgive me, for no one forgives sins except You.",
        bn: "হে আল্লাহ, আপনি আমার রব, আপনি ছাড়া কোনো ইলাহ নেই। আপনি আমাকে সৃষ্টি করেছেন, আমি আপনার বান্দা। আমি যথাসাধ্য আপনার অঙ্গীকার ও প্রতিশ্রুতির ওপর আছি। আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার নিয়ামত স্বীকার করছি এবং আমার গুনাহও স্বীকার করছি। অতএব আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া কেউ গুনাহ ক্ষমা করতে পারে না।",
      },
      ref: "Bukhari 6306 (Sayyidul Istighfar)",
    },
    hadith: {
      text: {
        en: "O people, repent to Allah, for I repent to Him a hundred times a day.",
        bn: "হে লোকসকল, তোমরা আল্লাহর কাছে তওবা করো, কেননা আমি দিনে একশবার তাঁর কাছে তওবা করি।",
      },
      ref: "Muslim 2702",
    },
    action: {
      en: "Sit alone for ten minutes, recall your mistakes and turn back to Allah.",
      bn: "দশ মিনিট একা বসে নিজের ভুলগুলো স্মরণ করুন এবং আল্লাহর দিকে ফিরে আসুন।",
    },
    lesson: {
      title: { en: "Sincere repentance", bn: "খাঁটি তওবা" },
      body: {
        en: "Sincere repentance has three parts: stop the sin, regret it, and firmly intend not to return to it. If the sin involved someone else's rights, return what is theirs or ask their forgiveness.",
        bn: "খাঁটি তওবার তিনটি অংশ: গুনাহ ছেড়ে দেওয়া, অনুতপ্ত হওয়া এবং আর না করার দৃঢ় সংকল্প। গুনাহটি যদি অন্যের হকের সাথে জড়িত হয়, তবে তার হক ফিরিয়ে দিন বা তার কাছে ক্ষমা চান।",
      },
    },
    quiz: {
      q: { en: "Which is NOT a part of sincere repentance?", bn: "কোনটি খাঁটি তওবার অংশ নয়?" },
      options: [
        { en: "Announcing your sin to people", bn: "মানুষের কাছে নিজের গুনাহ প্রকাশ করা" },
        { en: "Stopping the sin", bn: "গুনাহ ছেড়ে দেওয়া" },
        { en: "Regretting it", bn: "অনুতপ্ত হওয়া" },
      ],
      answer: 0,
    },
  },
  {
    day: 23,
    theme: { en: "This life and the next", bn: "দুনিয়া ও আখিরাত" },
    verse: { s: 3, from: 185, to: 185 },
    dua: {
      kind: "quran",
      parts: [{ s: 3, a: 193 }],
      translit:
        "Rabbana innana sami'na munadiyan yunadi lil-imani an aminu birabbikum fa-amanna, Rabbana faghfir lana dhunubana wa kaffir 'anna sayyi'atina wa tawaffana ma'al-abrar",
      bnPron:
        "রব্বানা ইন্নানা সামি'না মুনাদিয়াই ইউনাদী লিল ঈমানি আন আমিনূ বিরব্বিকুম ফাআমান্না, রব্বানা ফাগফিরলানা যুনূবানা ওয়া কাফফির আন্না সাইয়িআতিনা ওয়া তাওয়াফফানা মা'আল আবরার",
      meaning: {
        en: "Our Lord, we heard someone calling to faith, saying \"Believe in your Lord,\" and we believed. Our Lord, forgive our sins, wipe away our bad deeds and let us die among the righteous.",
        bn: "হে আমাদের রব, আমরা একজন আহ্বানকারীকে ঈমানের দিকে ডাকতে শুনেছি—\"তোমরা তোমাদের রবের প্রতি ঈমান আনো\"—তাই আমরা ঈমান এনেছি। হে আমাদের রব, আমাদের গুনাহ ক্ষমা করুন, আমাদের মন্দ কাজগুলো মোচন করুন এবং নেককারদের সাথে আমাদের মৃত্যু দিন।",
      },
    },
    hadith: {
      text: {
        en: "Be in this world as if you were a stranger or a traveller.",
        bn: "দুনিয়াতে এমনভাবে থাকো, যেন তুমি একজন অপরিচিত বা পথিক।",
      },
      ref: "Bukhari 6416",
    },
    action: {
      en: "Cut one hour of screen time today and use it for worship.",
      bn: "আজ এক ঘণ্টা স্ক্রিন টাইম কমিয়ে সেই সময় ইবাদতে দিন।",
    },
    lesson: {
      title: { en: "I'tikaf", bn: "ইতিকাফ" },
      body: {
        en: "I'tikaf means staying in the masjid for worship. The Prophet ﷺ did it in the last ten days of every Ramadan (Bukhari 2026). In the Hanafi school it is a sunnah on the community: if someone in the area does it, the rest are relieved of it. Women may do it in the prayer corner of their home.",
        bn: "ইতিকাফ মানে ইবাদতের উদ্দেশ্যে মসজিদে অবস্থান করা। নবী ﷺ প্রতি রমাদানের শেষ দশকে ইতিকাফ করতেন (বুখারি ২০২৬)। হানাফি মাযহাবে এটি মহল্লার জন্য সুন্নতে মুয়াক্কাদা কিফায়া: এলাকার কেউ করলে বাকিরা দায়মুক্ত হন। নারীরা ঘরের নামাযের স্থানে ইতিকাফ করতে পারেন।",
      },
    },
    quiz: {
      q: { en: "What does i'tikaf mean?", bn: "ইতিকাফ মানে কী?" },
      options: [
        { en: "Staying in the masjid for worship", bn: "ইবাদতের জন্য মসজিদে অবস্থান করা" },
        { en: "Travelling for Umrah", bn: "উমরার জন্য সফর করা" },
        { en: "Fasting extra days", bn: "অতিরিক্ত রোযা রাখা" },
      ],
      answer: 0,
    },
  },
  {
    day: 24,
    theme: { en: "Tests and trials", bn: "পরীক্ষা" },
    verse: { s: 2, from: 155, to: 157 },
    dua: {
      kind: "hadith",
      ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
      translit:
        "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal",
      bnPron:
        "আল্লাহুম্মা ইন্নী আ'ঊযু বিকা মিনাল হাম্মি ওয়াল হাযান, ওয়াল আজযি ওয়াল কাসাল, ওয়াল বুখলি ওয়াল জুবন, ওয়া দলা'ইদ দাইনি ওয়া গলাবাতির রিজাল",
      meaning: {
        en: "O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by people.",
        bn: "হে আল্লাহ, আমি আপনার কাছে আশ্রয় চাই দুশ্চিন্তা ও দুঃখ থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও কাপুরুষতা থেকে, ঋণের বোঝা ও মানুষের দমন-পীড়ন থেকে।",
      },
      ref: "Bukhari 6369",
    },
    hadith: {
      text: {
        en: "How wonderful is the affair of the believer! All of it is good. If something good happens, he is grateful, and that is good for him. If harm reaches him, he is patient, and that is good for him.",
        bn: "মুমিনের ব্যাপারটি কতই না চমৎকার! তার সবকিছুই কল্যাণকর। ভালো কিছু হলে সে শুকরিয়া আদায় করে, তা তার জন্য কল্যাণ। আর বিপদ এলে সে সবর করে, তাও তার জন্য কল্যাণ।",
      },
      ref: "Muslim 2999",
    },
    action: {
      en: "When something goes wrong today, say \"Alhamdulillah 'ala kulli hal.\"",
      bn: "আজ কিছু খারাপ হলে বলুন: \"আলহামদুলিল্লাহি আলা কুল্লি হাল।\"",
    },
    lesson: {
      title: { en: "The Prophet's last ten nights", bn: "নবী ﷺ-এর শেষ দশক" },
      body: {
        en: "When the last ten nights came, the Prophet ﷺ tightened his waist-wrap, stayed up at night and woke his family (Bukhari 2024). Wake your family gently for tahajjud this week.",
        bn: "শেষ দশক এলে নবী ﷺ কোমর বেঁধে নিতেন, রাত জেগে ইবাদত করতেন এবং পরিবারকে জাগাতেন (বুখারি ২০২৪)। এই সপ্তাহে পরিবারকে আলতোভাবে তাহাজ্জুদের জন্য জাগান।",
      },
    },
    quiz: {
      q: { en: "What did the Prophet ﷺ do in the last ten nights?", bn: "শেষ দশকের রাতে নবী ﷺ কী করতেন?" },
      options: [
        { en: "Stayed up in worship and woke his family", bn: "রাত জেগে ইবাদত করতেন ও পরিবারকে জাগাতেন" },
        { en: "Travelled for trade", bn: "ব্যবসার জন্য সফর করতেন" },
        { en: "Slept early every night", bn: "প্রতি রাতে আগে ঘুমিয়ে পড়তেন" },
      ],
      answer: 0,
    },
  },
  {
    day: 25,
    theme: { en: "Seeking knowledge", bn: "জ্ঞান অন্বেষণ" },
    verse: { s: 96, from: 1, to: 5 },
    dua: {
      kind: "quran",
      parts: [{ s: 18, a: 10, from: 6 }],
      translit: "Rabbana atina min ladunka rahmatan wa hayyi' lana min amrina rashada",
      bnPron: "রব্বানা আতিনা মিল্লাদুনকা রহমাতাও ওয়া হাইয়ি' লানা মিন আমরিনা রশাদা",
      meaning: {
        en: "Our Lord, grant us mercy from Yourself and guide us to what is right in our affair.",
        bn: "হে আমাদের রব, আপনার পক্ষ থেকে আমাদের রহমত দান করুন এবং আমাদের কাজকর্ম সঠিক পথে পরিচালিত করুন।",
      },
    },
    hadith: {
      text: {
        en: "Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.",
        bn: "যে ব্যক্তি জ্ঞান অর্জনের জন্য কোনো পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।",
      },
      ref: "Muslim 2699",
    },
    action: {
      en: "Learn the meaning of one short surah you recite in salah.",
      bn: "নামাযে পড়েন এমন একটি ছোট সূরার অর্থ শিখুন।",
    },
    lesson: {
      title: { en: "Manners with the Quran", bn: "কুরআনের আদব" },
      body: {
        en: "Most scholars require wudu to touch the mushaf. Recite slowly and clearly, and pause at verses of mercy and warning. Reading a little with understanding is better than rushing without reflection.",
        bn: "অধিকাংশ আলেমের মতে মুসহাফ স্পর্শ করতে অযু লাগে। ধীরে ও স্পষ্টভাবে তিলাওয়াত করুন, রহমত ও সতর্কবাণীর আয়াতে থেমে ভাবুন। না বুঝে তাড়াহুড়া করে পড়ার চেয়ে বুঝে অল্প পড়া উত্তম।",
      },
    },
    quiz: {
      q: { en: "How should the Quran be recited?", bn: "কুরআন কীভাবে তিলাওয়াত করা উচিত?" },
      options: [
        { en: "Slowly and clearly, with reflection", bn: "ধীরে, স্পষ্টভাবে ও চিন্তা করে" },
        { en: "As fast as possible", bn: "যত দ্রুত সম্ভব" },
        { en: "Without caring about pronunciation", bn: "উচ্চারণের দিকে খেয়াল না করে" },
      ],
      answer: 0,
    },
  },
  {
    day: 26,
    theme: { en: "Neighbours and the needy", bn: "প্রতিবেশী ও অভাবী" },
    verse: { s: 4, from: 36, to: 36 },
    dua: {
      kind: "quran",
      parts: [{ s: 25, a: 65, from: 2 }],
      translit: "Rabbanas-rif 'anna 'adhaba jahannam, inna 'adhabaha kana gharama",
      bnPron: "রব্বানাসরিফ আন্না আযাবা জাহান্নামা, ইন্না আযাবাহা কানা গরামা",
      meaning: {
        en: "Our Lord, turn away from us the punishment of Hell. Its punishment is a lasting torment.",
        bn: "হে আমাদের রব, আমাদের থেকে জাহান্নামের আযাব দূর করে দিন। নিশ্চয়ই এর আযাব স্থায়ী বিপদ।",
      },
    },
    hadith: {
      text: {
        en: "Jibril kept advising me to treat the neighbour well until I thought he would make him an heir.",
        bn: "জিবরীল আমাকে প্রতিবেশীর সাথে সদ্ব্যবহারের বিষয়ে এত বেশি উপদেশ দিচ্ছিলেন যে, আমার মনে হলো তিনি প্রতিবেশীকে উত্তরাধিকারী বানিয়ে দেবেন।",
      },
      ref: "Bukhari 6014, Muslim 2624",
    },
    action: {
      en: "Send iftar to a neighbour or feed someone in need.",
      bn: "প্রতিবেশীর বাড়িতে ইফতার পাঠান বা কোনো অভাবীকে খাওয়ান।",
    },
    lesson: {
      title: { en: "Zakat al-Fitr (fitra)", bn: "সদকাতুল ফিতর (ফিতরা)" },
      body: {
        en: "Zakat al-Fitr purifies the fast and feeds the poor (Abu Dawud 1609). In the Hanafi school it is wajib on every Muslim who owns the nisab beyond basic needs, paid for yourself and your dependent children. It must be given before the Eid prayer, and giving it a few days early helps it reach people in time. Bangladesh's Islamic Foundation announces the amount each year.",
        bn: "ফিতরা রোযাকে পবিত্র করে এবং গরিবদের খাবারের ব্যবস্থা করে (আবু দাউদ ১৬০৯)। হানাফি মাযহাবে মৌলিক প্রয়োজনের অতিরিক্ত নিসাব পরিমাণ সম্পদের মালিক প্রত্যেক মুসলিমের ওপর নিজের ও নির্ভরশীল সন্তানদের পক্ষ থেকে ফিতরা ওয়াজিব। ঈদের নামাযের আগেই দিতে হবে; কয়েক দিন আগে দিলে তা সময়মতো প্রাপকের কাছে পৌঁছায়। ইসলামিক ফাউন্ডেশন প্রতি বছর এর পরিমাণ ঘোষণা করে।",
      },
    },
    quiz: {
      q: { en: "When must Zakat al-Fitr be given?", bn: "ফিতরা কখনের মধ্যে দিতে হয়?" },
      options: [
        { en: "Before the Eid prayer", bn: "ঈদের নামাযের আগে" },
        { en: "After Eid", bn: "ঈদের পরে" },
        { en: "Any time during the year", bn: "বছরের যেকোনো সময়" },
      ],
      answer: 0,
    },
  },
  {
    day: 27,
    theme: { en: "Racing towards Jannah", bn: "জান্নাতের পথে প্রতিযোগিতা" },
    verse: { s: 3, from: 133, to: 133 },
    dua: {
      kind: "quran",
      parts: [{ s: 66, a: 8, from: 34 }],
      translit: "Rabbana atmim lana nurana waghfir lana, innaka 'ala kulli shay'in qadir",
      bnPron: "রব্বানা আতমিম লানা নূরানা ওয়াগফিরলানা, ইন্নাকা আলা কুল্লি শাইয়িন কদীর",
      meaning: {
        en: "Our Lord, complete our light for us and forgive us. You have power over all things.",
        bn: "হে আমাদের রব, আমাদের জন্য আমাদের নূর পূর্ণ করে দিন এবং আমাদের ক্ষমা করুন। নিশ্চয়ই আপনি সবকিছুর ওপর ক্ষমতাবান।",
      },
    },
    hadith: {
      text: {
        en: "In Paradise there is a gate called Ar-Rayyan. On the Day of Resurrection, only those who fasted will enter through it.",
        bn: "জান্নাতে \"রাইয়ান\" নামে একটি দরজা আছে। কিয়ামতের দিন শুধু রোযাদাররাই সেই দরজা দিয়ে প্রবেশ করবে।",
      },
      ref: "Bukhari 1896, Muslim 1152",
    },
    action: {
      en: "Pay your Zakat al-Fitr now so it reaches the poor before Eid.",
      bn: "ঈদের আগেই যেন গরিবের হাতে পৌঁছায়, তাই আজই ফিতরা আদায় করুন।",
    },
    lesson: {
      title: { en: "Getting ready for Eid", bn: "ঈদের প্রস্তুতি" },
      body: {
        en: "Sunnahs of Eid al-Fitr: take a bath (ghusl), wear your best clothes, eat an odd number of dates before the prayer (Bukhari 953), say the takbir on the way, and go by one route and come back by another.",
        bn: "ঈদুল ফিতরের সুন্নতসমূহ: গোসল করা, সবচেয়ে ভালো পোশাক পরা, নামাযের আগে বেজোড় সংখ্যক খেজুর খাওয়া (বুখারি ৯৫৩), পথে তাকবির বলা এবং এক পথে যাওয়া ও অন্য পথে ফেরা।",
      },
    },
    quiz: {
      q: { en: "Which is a sunnah before the Eid al-Fitr prayer?", bn: "ঈদুল ফিতরের নামাযের আগে কোনটি সুন্নত?" },
      options: [
        { en: "Eating an odd number of dates", bn: "বেজোড় সংখ্যক খেজুর খাওয়া" },
        { en: "Fasting until noon", bn: "দুপুর পর্যন্ত রোযা রাখা" },
        { en: "Staying at home", bn: "ঘরে বসে থাকা" },
      ],
      answer: 0,
    },
  },
  {
    day: 28,
    theme: { en: "Steadfastness", bn: "অবিচলতা" },
    verse: { s: 41, from: 30, to: 30 },
    dua: {
      kind: "hadith",
      ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      translit: "Ya Muqallibal-qulub, thabbit qalbi 'ala dinik",
      bnPron: "ইয়া মুকাল্লিবাল কুলূব, সাব্বিত কলবী আলা দীনিক",
      meaning: {
        en: "O Turner of hearts, keep my heart firm on Your religion.",
        bn: "হে অন্তরসমূহের পরিবর্তনকারী, আমার অন্তরকে আপনার দ্বীনের ওপর অবিচল রাখুন।",
      },
      ref: "Tirmidhi 2140",
    },
    hadith: {
      text: {
        en: "The deeds most beloved to Allah are those done consistently, even if they are small.",
        bn: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো যা নিয়মিত করা হয়, যদিও তা অল্প হয়।",
      },
      ref: "Bukhari 6464, Muslim 783",
    },
    action: {
      en: "Choose one good habit from this Ramadan to keep all year.",
      bn: "এই রমাদানের একটি ভালো অভ্যাস বেছে নিন, যা সারা বছর ধরে রাখবেন।",
    },
    lesson: {
      title: { en: "The Eid prayer", bn: "ঈদের নামায" },
      body: {
        en: "The Eid prayer is two rak'ahs in congregation with extra takbirs, followed by a khutbah. In the Hanafi school it is wajib and has six extra takbirs: three in the first rak'ah before the recitation, and three in the second rak'ah after the recitation.",
        bn: "ঈদের নামায অতিরিক্ত তাকবিরসহ জামাতে দুই রাকাত, এরপর খুতবা। হানাফি মাযহাবে এটি ওয়াজিব এবং এতে ছয়টি অতিরিক্ত তাকবির: প্রথম রাকাতে কিরাতের আগে তিনটি, দ্বিতীয় রাকাতে কিরাতের পরে তিনটি।",
      },
    },
    quiz: {
      q: { en: "How many extra takbirs are in the Eid prayer in the Hanafi school?", bn: "হানাফি মাযহাবে ঈদের নামাযে কয়টি অতিরিক্ত তাকবির?" },
      options: [
        { en: "Six", bn: "ছয়টি" },
        { en: "Twelve", bn: "বারোটি" },
        { en: "None", bn: "একটিও না" },
      ],
      answer: 0,
    },
  },
  {
    day: 29,
    theme: { en: "Loving Allah", bn: "আল্লাহকে ভালোবাসা" },
    verse: { s: 3, from: 31, to: 31 },
    dua: {
      kind: "quran",
      parts: [{ s: 3, a: 16, from: 2 }],
      translit: "Rabbana innana amanna faghfir lana dhunubana wa qina 'adhaban-nar",
      bnPron: "রব্বানা ইন্নানা আমান্না ফাগফিরলানা যুনূবানা ওয়া কিনা আযাবান্নার",
      meaning: {
        en: "Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
        bn: "হে আমাদের রব, আমরা ঈমান এনেছি, অতএব আমাদের গুনাহ ক্ষমা করুন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।",
      },
    },
    hadith: {
      text: {
        en: "The fasting person has two joys: one when he breaks his fast, and one when he meets his Lord.",
        bn: "রোযাদারের জন্য দুটি আনন্দ: একটি ইফতারের সময়, আরেকটি যখন সে তার রবের সাথে সাক্ষাৎ করবে।",
      },
      ref: "Bukhari 1904, Muslim 1151",
    },
    action: {
      en: "Write a letter to yourself about how this Ramadan changed you.",
      bn: "এই রমাদান আপনাকে কীভাবে বদলেছে, তা নিয়ে নিজেকে একটি চিঠি লিখুন।",
    },
    lesson: {
      title: { en: "After Ramadan", bn: "রমাদানের পরে" },
      body: {
        en: "Fasting six days of Shawwal after Ramadan brings the reward of fasting a whole year (Muslim 1164). If you have fasts to make up, plan them too. The Qada tracker in Tools keeps count for you.",
        bn: "রমাদানের পর শাওয়ালের ছয়টি রোযা রাখলে সারা বছর রোযা রাখার সওয়াব পাওয়া যায় (মুসলিম ১১৬৪)। কাযা রোযা থাকলে সেগুলোরও পরিকল্পনা করুন। টুলস অংশের কাযা ট্র্যাকার আপনার হিসাব রাখবে।",
      },
    },
    quiz: {
      q: { en: "Ramadan followed by six days of Shawwal is like fasting…", bn: "রমাদানের পর শাওয়ালের ছয় রোযা রাখা যেন…" },
      options: [
        { en: "A whole year", bn: "সারা বছর রোযা রাখা" },
        { en: "A whole month", bn: "এক মাস রোযা রাখা" },
        { en: "A week", bn: "এক সপ্তাহ রোযা রাখা" },
      ],
      answer: 0,
    },
  },
  {
    day: 30,
    theme: { en: "Keep going after Ramadan", bn: "রমাদানের পরেও চলুক" },
    verse: { s: 15, from: 99, to: 99 },
    dua: {
      kind: "quran",
      parts: [{ s: 2, a: 127, from: 7 }],
      translit: "Rabbana taqabbal minna innaka antas-Sami'ul-'Alim",
      bnPron: "রব্বানা তাকাব্বাল মিন্না ইন্নাকা আনতাস সামি'উল আলীম",
      meaning: {
        en: "Our Lord, accept this from us. You are the All-Hearing, the All-Knowing.",
        bn: "হে আমাদের রব, আমাদের পক্ষ থেকে কবুল করুন। নিশ্চয়ই আপনি সর্বশ্রোতা, সর্বজ্ঞ।",
      },
    },
    hadith: {
      text: {
        en: "Whoever fasts Ramadan and follows it with six days of Shawwal, it is as if he fasted the whole year.",
        bn: "যে ব্যক্তি রমাদানের রোযা রাখল, তারপর শাওয়ালের ছয়টি রোযা রাখল, সে যেন সারা বছর রোযা রাখল।",
      },
      ref: "Muslim 1164",
    },
    action: {
      en: "Plan your six fasts of Shawwal and any fasts you need to make up.",
      bn: "শাওয়ালের ছয় রোযা ও কাযা রোযার পরিকল্পনা করুন।",
    },
    lesson: {
      title: { en: "Keeping the habits", bn: "অভ্যাস ধরে রাখা" },
      body: {
        en: "Allah is the Lord of every month, not only Ramadan. Keep at least one small act every day: a page of Quran, two rak'ahs at night, or daily istighfar. A small deed done consistently is the most beloved to Allah.",
        bn: "আল্লাহ শুধু রমাদানের নন, প্রতিটি মাসের রব। প্রতিদিন অন্তত একটি ছোট আমল ধরে রাখুন: এক পৃষ্ঠা কুরআন, রাতে দুই রাকাত নামায বা প্রতিদিন ইস্তিগফার। নিয়মিত ছোট আমলই আল্লাহর কাছে সবচেয়ে প্রিয়।",
      },
    },
    quiz: {
      q: { en: "Which deeds are most beloved to Allah?", bn: "আল্লাহর কাছে কোন আমল সবচেয়ে প্রিয়?" },
      options: [
        { en: "Consistent ones, even if small", bn: "নিয়মিত আমল, যদিও অল্প হয়" },
        { en: "Big ones done only once", bn: "একবার করা বড় আমল" },
        { en: "Those seen by many people", bn: "যা অনেক মানুষ দেখে" },
      ],
      answer: 0,
    },
  },
];

/** Shown in the fasting card at iftar time, every day. */
export const IFTAR_DUA = {
  ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
  translit: "Dhahabaz-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha' Allah",
  bnPron: "যাহাবায যমাউ ওয়াবতাল্লাতিল উরূকু ওয়া সাবাতাল আজরু ইনশাআল্লাহ",
  meaning: {
    en: "The thirst is gone, the veins are moist, and the reward is certain, if Allah wills.",
    bn: "পিপাসা দূর হলো, শিরাগুলো সিক্ত হলো এবং ইনশাআল্লাহ প্রতিদান নিশ্চিত হলো।",
  },
  ref: "Abu Dawud 2357",
};

/** Pinned during the last ten nights. */
export const QADR_DUA = DAYS[20].dua;
