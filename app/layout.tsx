
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GameBaseGoogleAnalytics } from "@/components/google-analytics";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const siteUrl = "https://gamebasehq.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "GameBaseHQ",

  title: {
    default: "GameBaseHQ | Your Gaming World. One Place.",
    template: "%s | GameBaseHQ",
  },

  description:
    "Build your game library, track your progress, rate games, manage your wishlist and discover what to play next. Connect Steam and bring your gaming world together with GameBaseHQ.",

  keywords: [
    "GameBaseHQ",
    "game library",
    "video game tracker",
    "game collection",
    "gaming wishlist",
    "Steam game tracker",
    "game recommendations",
    "track games played",
  ],

  openGraph: {
    type: "website",
    siteName: "GameBaseHQ",
    title: "GameBaseHQ | Your Gaming World. One Place.",
    description:
      "Track your games, build your collection, manage your wishlist and discover what to play next.",
    locale: "en_AU",
  },

  twitter: {
    card: "summary",
    title: "GameBaseHQ | Your Gaming World. One Place.",
    description:
      "Your game library, wishlist, recommendations and Steam collection in one place.",
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <div className="min-w-0 flex-1">
            {children}
          </div>

          <Footer />
        </div>

        <Analytics />
        <SpeedInsights />
        <GameBaseGoogleAnalytics />
      </body>
    </html>
  );
}
