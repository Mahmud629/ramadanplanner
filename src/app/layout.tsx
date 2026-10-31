import type { Metadata, Viewport } from "next";
import "@fontsource/hind-siliguri/bengali-400.css";
import "@fontsource/hind-siliguri/bengali-500.css";
import "@fontsource/hind-siliguri/bengali-600.css";
import "@fontsource/hind-siliguri/latin-400.css";
import "@fontsource/hind-siliguri/latin-500.css";
import "@fontsource/hind-siliguri/latin-600.css";
import "@fontsource/amiri-quran/arabic-400.css";
import "@fontsource-variable/fraunces/full.css";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "Ramadan Planner",
  description: "Track your fasts, prayers and Quran, learn a verse, a dua and a lesson every day of Ramadan. Works offline.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Ramadan", statusBarStyle: "black-translucent" },
  icons: {
    // "?v=2" makes browsers drop the old cached tab icon
    icon: [
      { url: "/favicon.ico?v=2", sizes: "16x16 32x32 48x48 64x64" },
      { url: "/icon-192.png?v=2", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2523",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="night" suppressHydrationWarning>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
