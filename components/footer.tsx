import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-sm">
                G
              </div>

              <div>
                <p className="font-black tracking-tight text-slate-950">
                  Game Library
                </p>

                <p className="text-sm text-slate-500">
                  Track Your Collection
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
              A simple way to organise your
              video game collection, track
              what you are playing and keep
              your games across multiple
              platforms in one place.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Information
            </p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
              <Link
                href="/about"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                About
              </Link>

              <Link
                href="/privacy"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                Terms of Use
              </Link>

              <Link
                href="/contact"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                Contact
              </Link>

              <a
                href="https://www.igdb.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                IGDB
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Game
            Library. All rights reserved.
          </p>

          <p>
            Game information and artwork
            provided by IGDB.
          </p>
        </div>
      </div>
    </footer>
  );
}