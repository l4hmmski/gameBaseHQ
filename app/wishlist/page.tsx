
import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth-guard";
import { WishlistPage } from "@/components/wishlist-page";

export const metadata: Metadata = {
  title: "My Wishlist",

  description:
    "Manage your gaming wishlist, save games you want to play and discover new titles with GameBaseHQ.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistRoute() {
  return (
    <AuthGuard>
      <main className="min-h-screen w-full min-w-0 bg-slate-50">
        {/* PAGE HEADER */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Discover
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Your Wishlist
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Save games you want to play
              and discover new titles
              based on your wishlist.
            </p>
          </div>
        </section>

        {/* WISHLIST CONTENT */}

        <div className="mx-auto w-full max-w-7xl min-w-0 px-5 py-10 sm:px-8">
          <WishlistPage />
        </div>
      </main>
    </AuthGuard>
  );
}
