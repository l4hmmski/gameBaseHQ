import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            About
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Your games.
            <span className="block text-indigo-600">
              One simple library.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Game Library is designed to
            make keeping track of your
            video game collection simple.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              What is Game Library?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Game Library is a personal
              collection manager that lets
              you keep the games you own in
              one place, regardless of which
              platform you play on.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Track your progress
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Games can be organised by
              their current status, including
              Backlog, Playing and Completed.
              This makes it easy to see what
              you are currently working
              through and what you want to
              play next.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Game information
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Game information and artwork
              may be provided by third-party
              services including IGDB.
            </p>
          </article>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}