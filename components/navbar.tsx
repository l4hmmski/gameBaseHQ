
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(Boolean(session));
      setIsLoading(false);
    }

    void loadSession();

    const { data: subscription } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(Boolean(session));
      });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);

    router.push("/");
    router.refresh();
  }

  function linkClasses(href: string) {
    const active = pathname === href;

    return `rounded-lg px-3 py-2 text-sm font-bold transition ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;
  }

  function mobileLinkClasses(href: string) {
    const active = pathname === href;

    return `block rounded-xl px-4 py-3 text-sm font-bold transition ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-700 hover:bg-slate-100"
    }`;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto max-w-7xl px-5 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* TEXT-ONLY BRAND */}

          <Link
            href="/"
            aria-label="GameBaseHQ Home"
            className="shrink-0 whitespace-nowrap text-xl font-black tracking-tight sm:text-2xl"
          >
            <span className="text-slate-950">
              GameBase
            </span>
            <span className="text-indigo-600">
              HQ
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className={linkClasses("/")}>
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/library"
                  className={linkClasses("/library")}
                >
                  Library
                </Link>

                <Link
                  href="/wishlist"
                  className={linkClasses("/wishlist")}
                >
                  Wishlist
                </Link>

                <Link
                  href="/stats"
                  className={linkClasses("/stats")}
                >
                  Stats
                </Link>

                <Link
                  href="/profile"
                  className={linkClasses("/profile")}
                >
                  Account
                </Link>
              </>
            )}

            {!isLoading &&
              (isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="ml-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Log In
                </Link>
              ))}
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen((current) => !current)
            }
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl leading-none">
                ×
              </span>
            ) : (
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded bg-slate-700" />
                <span className="block h-0.5 w-5 rounded bg-slate-700" />
                <span className="block h-0.5 w-5 rounded bg-slate-700" />
              </span>
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="mt-4 border-t border-slate-200 pt-4 md:hidden"
          >
            <div className="grid gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileLinkClasses("/")}
              >
                Home
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/library"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClasses("/library")}
                  >
                    Library
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClasses("/wishlist")}
                  >
                    Wishlist
                  </Link>

                  <Link
                    href="/stats"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClasses("/stats")}
                  >
                    Stats
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkClasses("/profile")}
                  >
                    Account
                  </Link>
                </>
              )}

              {!isLoading &&
                (isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="mt-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Log In
                  </Link>
                ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
