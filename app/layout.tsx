import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Game Library",
  description:
    "Manage your video game collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        <Navbar />

        {children}
      </body>
    </html>
  );
}