
import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth-guard";
import { StatsDashboard } from "@/components/stats-dashboard";

export const metadata: Metadata = {
  title: "My Game Stats",

  description:
    "Explore your gaming statistics, track collection progress and see how your game library breaks down with GameBaseHQ.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function StatsPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen w-full min-w-0 bg-slate-50">
        {/* PAGE HEADER */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Your Collection
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Game Stats
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              See how your collection
              breaks down, what you play
              the most and how your
              library is progressing.
            </p>
          </div>
        </section>

        {/* STATS DASHBOARD */}

        <div className="mx-auto w-full max-w-7xl min-w-0 px-5 py-10 sm:px-8">
          <StatsDashboard />
        </div>
      </main>
    </AuthGuard>
  );
}
