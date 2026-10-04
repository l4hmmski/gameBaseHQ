import Link from "next/link";

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
    image:
      "/home-games/red-dead-redemption.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          {/* LEFT SIDE */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Your personal collection
            </p>

            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Every game you own.
              <span className="block text-indigo-600">
                All in one place.
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
                View my library
              </Link>

              <Link
                href="/profile"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                My account
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - GAME PREVIEW */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-indigo-100 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 shadow-2xl">
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
                    Your library
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Currently playing
                  </h2>
                </div>

                <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                  Playing
                </div>
              </div>

              {/* GAME COVERS */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {featuredGames.map(
                  (game) => (
                    <div
                      key={game.title}
                      className="group relative aspect-[3/4] min-w-0 overflow-hidden rounded-2xl bg-slate-800"
                    >
                      <img
                        src={game.image}
                        alt={game.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* DARK GRADIENT */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* GAME TITLE */}
                      <p className="absolute bottom-3 left-3 right-3 text-xs font-bold leading-tight text-white sm:text-sm">
                        {game.title}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* FAKE DEMO STATS */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-800 pt-6">
                <div>
                  <p className="text-2xl font-black text-white">
                    24
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Games
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-white">
                    6
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Playing
                  </p>
                </div>

                <div>
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
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Simple organisation
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Your collection without the
            clutter.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Everything you need to keep
            track of your games without
            turning it into another job.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* FEATURE 1 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              01
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Build your library
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Add the games you own and
              keep your collection together
              in one clean library.
            </p>
          </section>

          {/* FEATURE 2 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              02
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Track progress
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Mark games as backlog,
              playing or completed so you
              always know what is next.
            </p>
          </section>

          {/* FEATURE 3 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-black text-indigo-700">
              03
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              Organise every platform
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