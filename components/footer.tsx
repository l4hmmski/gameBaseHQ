
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full min-w-0 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-5 py-10 sm:px-8">
        <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">

          {/* BRAND AND DESCRIPTION */}

          <div className="min-w-0">
            <Link
              href="/"
              className="inline-flex max-w-full items-center"
            >
              <span className="text-xl font-black tracking-tight sm:text-2xl">
                <span className="text-slate-950">
                  GameBase
                </span>
                <span className="text-indigo-600">
                  HQ
                </span>
              </span>
            </Link>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Your Gaming World. One Place.
            </p>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
              Organise your video game collection,
              track what you are playing, manage
              your wishlist and discover new games.
              Bring your gaming world together
              with GameBaseHQ.
            </p>
          </div>

          {/* INFORMATION LINKS */}

          <div className="min-w-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Information
            </p>

            <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-3 text-sm min-[360px]:grid-cols-2 sm:grid-cols-3 lg:gap-x-10">
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
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                IGDB
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="mt-10 flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} GameBaseHQ.
            All rights reserved.
          </p>

          <p>
            Game information and artwork provided
            by IGDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
