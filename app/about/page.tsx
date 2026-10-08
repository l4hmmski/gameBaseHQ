
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about GameBaseHQ, the platform that brings your gaming collection, wishlist and progress together.",
    alternates: {
    canonical: "/about",
  },
};

const features = [
  {
    title: "Your Game Library",
    description:
      "Build a personal collection of games across different platforms and keep everything organised in one place.",
  },
  {
    title: "Track Your Progress",
    description:
      "Keep track of what you are playing, what you have completed and what you want to play next.",
  },
  {
    title: "Wishlist & Discovery",
    description:
      "Save games you are interested in and discover new titles to add to your collection.",
  },
  {
    title: "Steam Integration",
    description:
      "Connect your Steam account to bring supported game information into your GameBaseHQ library.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          About GameBaseHQ
        </p>

        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Your Gaming World.
          <span className="block text-indigo-600">
            One Place.
          </span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          GameBaseHQ is a personal game library platform
          designed to make managing your gaming collection
          simple, organised and enjoyable.
        </p>

        <p className="mt-5 leading-8 text-slate-600">
          Whether you play on PC, PlayStation, Xbox,
          Nintendo or multiple platforms, GameBaseHQ
          gives you a central place to organise your
          games, track your progress and plan what
          to play next.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-black text-slate-950">
          What you can do
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10">
        <h2 className="text-2xl font-black">
          Less managing. More gaming.
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          GameBaseHQ is built around a simple idea:
          your gaming collection should be easy to
          organise, explore and enjoy.
        </p>

        <Link
          href="/library"
          className="mt-7 inline-flex rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
        >
          Explore Your Library
        </Link>
      </section>
    </main>
  );
}
