export type City = { id: string; en: string; bn: string; lat: number; lon: number; tz: string; country: "BD" | "world" };

export const CITIES: City[] = [
  { id: "dhaka", en: "Dhaka", bn: "ঢাকা", lat: 23.8103, lon: 90.4125, tz: "Asia/Dhaka", country: "BD" },
  { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম", lat: 22.3569, lon: 91.7832, tz: "Asia/Dhaka", country: "BD" },
  { id: "sylhet", en: "Sylhet", bn: "সিলেট", lat: 24.8949, lon: 91.8687, tz: "Asia/Dhaka", country: "BD" },
  { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী", lat: 24.3745, lon: 88.6042, tz: "Asia/Dhaka", country: "BD" },
  { id: "khulna", en: "Khulna", bn: "খুলনা", lat: 22.8456, lon: 89.5403, tz: "Asia/Dhaka", country: "BD" },
  { id: "barishal", en: "Barishal", bn: "বরিশাল", lat: 22.701, lon: 90.3535, tz: "Asia/Dhaka", country: "BD" },
  { id: "rangpur", en: "Rangpur", bn: "রংপুর", lat: 25.7439, lon: 89.2752, tz: "Asia/Dhaka", country: "BD" },
  { id: "mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ", lat: 24.7471, lon: 90.4203, tz: "Asia/Dhaka", country: "BD" },
  { id: "cumilla", en: "Cumilla", bn: "কুমিল্লা", lat: 23.4607, lon: 91.1809, tz: "Asia/Dhaka", country: "BD" },
  { id: "coxsbazar", en: "Cox's Bazar", bn: "কক্সবাজার", lat: 21.4272, lon: 92.0058, tz: "Asia/Dhaka", country: "BD" },
  { id: "bogura", en: "Bogura", bn: "বগুড়া", lat: 24.8465, lon: 89.3773, tz: "Asia/Dhaka", country: "BD" },
  { id: "gazipur", en: "Gazipur", bn: "গাজীপুর", lat: 23.9999, lon: 90.4203, tz: "Asia/Dhaka", country: "BD" },
  { id: "narayanganj", en: "Narayanganj", bn: "নারায়ণগঞ্জ", lat: 23.6238, lon: 90.5, tz: "Asia/Dhaka", country: "BD" },
  { id: "jashore", en: "Jashore", bn: "যশোর", lat: 23.1664, lon: 89.2081, tz: "Asia/Dhaka", country: "BD" },
  { id: "dinajpur", en: "Dinajpur", bn: "দিনাজপুর", lat: 25.6217, lon: 88.6354, tz: "Asia/Dhaka", country: "BD" },
  { id: "makkah", en: "Makkah", bn: "মক্কা", lat: 21.4225, lon: 39.8262, tz: "Asia/Riyadh", country: "world" },
  { id: "madinah", en: "Madinah", bn: "মদিনা", lat: 24.4672, lon: 39.6111, tz: "Asia/Riyadh", country: "world" },
  { id: "riyadh", en: "Riyadh", bn: "রিয়াদ", lat: 24.7136, lon: 46.6753, tz: "Asia/Riyadh", country: "world" },
  { id: "dubai", en: "Dubai", bn: "দুবাই", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai", country: "world" },
  { id: "doha", en: "Doha", bn: "দোহা", lat: 25.2854, lon: 51.531, tz: "Asia/Qatar", country: "world" },
  { id: "kuwait", en: "Kuwait City", bn: "কুয়েত সিটি", lat: 29.3759, lon: 47.9774, tz: "Asia/Kuwait", country: "world" },
  { id: "muscat", en: "Muscat", bn: "মাস্কাট", lat: 23.588, lon: 58.3829, tz: "Asia/Muscat", country: "world" },
  { id: "kualalumpur", en: "Kuala Lumpur", bn: "কুয়ালালামপুর", lat: 3.139, lon: 101.6869, tz: "Asia/Kuala_Lumpur", country: "world" },
  { id: "singapore", en: "Singapore", bn: "সিঙ্গাপুর", lat: 1.3521, lon: 103.8198, tz: "Asia/Singapore", country: "world" },
  { id: "karachi", en: "Karachi", bn: "করাচি", lat: 24.8607, lon: 67.0011, tz: "Asia/Karachi", country: "world" },
  { id: "kolkata", en: "Kolkata", bn: "কলকাতা", lat: 22.5726, lon: 88.3639, tz: "Asia/Kolkata", country: "world" },
  { id: "london", en: "London", bn: "লন্ডন", lat: 51.5074, lon: -0.1278, tz: "Europe/London", country: "world" },
  { id: "newyork", en: "New York", bn: "নিউ ইয়র্ক", lat: 40.7128, lon: -74.006, tz: "America/New_York", country: "world" },
  { id: "toronto", en: "Toronto", bn: "টরন্টো", lat: 43.6532, lon: -79.3832, tz: "America/Toronto", country: "world" },
  { id: "sydney", en: "Sydney", bn: "সিডনি", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", country: "world" },
];

export function cityById(id: string) {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
