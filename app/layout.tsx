import type {
  Metadata,
} from "next";

import {
  Analytics,
} from "@vercel/analytics/next";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Game Library",

    template:
      "%s | Game Library",
  },

  description:
    "Manage, rate and track your personal video game collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-950">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </div>

        <Analytics />
      </body>
    </html>
  );
}