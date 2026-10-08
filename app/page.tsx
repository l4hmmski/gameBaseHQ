
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "GameBaseHQ | Your Gaming World. One Place.",
  },

  description:
    "Organise your video game collection with GameBaseHQ. Track games across PC, PlayStation, Xbox and Nintendo, manage your wishlist, rate games and connect your Steam library.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://gamebasehq.app/",
    siteName: "GameBaseHQ",
    title: "GameBaseHQ | Your Gaming World. One Place.",
    description:
      "Build your game library, track your progress and manage your gaming collection across every platform.",
    locale: "en_AU",
  },

  twitter: {
    card: "summary",
    title: "GameBaseHQ | Your Gaming World. One Place.",
    description:
      "Your game library, wishlist and gaming progress, all in one place.",
  },
};

const featuredGames = [
  {
    title: "Cyberpunk 2077",
    image: "/home-games/cyberpunk.jpg",
  },
  {
    title: "Elden Ring",
    image: "/home-games/elden-ring.jpg",
  },
  {
    title: "Red Dead Redemption",
    image: "/home-games/red-dead-redemption.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen w-full min-w-0 bg-slate-50">
      {/* HERO */}

      <section className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:py-28">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Your Personal Collection
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Every Game You Own.

              <span className="block text-indigo-600">
                All in One Place.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Build your personal game
              library, track what you are
              playing and keep your
              collection organised across
              every platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/library"
                className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                View My Library
              </Link>

              <Link
                href="/profile"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* FEATURED GAME PREVIEW */}

          <div className="relative min-w-0">
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-indigo-100 blur-2xl" />

            <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-4 shadow-2xl sm:p-6">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
                    Your Library
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                    Currently Playing
                  </h2>
                </div>

                <div className="shrink-0 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                  Playing
                </div>
              </div>

              <div className="mt-8 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                {featuredGames.map((game) => (
                  <div
                    key={game.title}
                    className="relative aspect-[3/4] min-w-0 overflow-hidden rounded-xl bg-slate-800 sm:rounded-2xl"
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(max-width: 768px) 30vw, 180px"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <p className="absolute right-2 bottom-2 left-2 text-[10px] font-bold leading-tight text-white sm:right-3 sm:bottom-3 sm:left-3 sm:text-sm">
                      {game.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-800 pt-6">
                <div className="min-w-0">
                  <p className="text-2xl font-black text-white">
                    24
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Games
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-2xl font-black text-white">
                    6
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Playing
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-2xl font-black text-white">
                    11
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto w-full max-w-7xl min-w-0 px-5 py-16 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Simple Organisation
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Your Collection Without the Clutter.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Everything you need to keep
            track of your games without
            turning it into another job.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              01
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Build Your Library
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Add the games you own and
              keep your collection together
              in one clean library.
            </p>
          </section>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              02
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Track Progress
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Mark games as backlog,
              playing or completed so you
              always know what is next.
            </p>
          </section>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              03
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Organise Every Platform
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Keep PlayStation, Xbox,
              Nintendo and PC games
              organised together.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
