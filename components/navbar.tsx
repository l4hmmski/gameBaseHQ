"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase";

export function Navbar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] =
    useState(false);

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  useEffect(() => {
    async function loadSession() {
      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      setIsLoggedIn(
        Boolean(
          session,
        ),
      );

      setIsLoading(
        false,
      );
    }

    void loadSession();

    const {
      data:
        subscription,
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          session,
        ) => {
          setIsLoggedIn(
            Boolean(
              session,
            ),
          );
        },
      );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    setIsLoggedIn(
      false,
    );

    router.push("/");
    router.refresh();
  }

  function linkClasses(
    href: string,
  ) {
    const active =
      pathname ===
      href;

    return `rounded-lg px-3 py-2 text-sm font-bold transition ${
      active
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-slate-950"
        >
          Game Library
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={
              linkClasses(
                "/",
              )
            }
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/library"
                className={
                  linkClasses(
                    "/library",
                  )
                }
              >
                Library
              </Link>

<Link
  href="/wishlist"
  className={
    linkClasses(
      "/wishlist",
    )
  }
>
  Wishlist
</Link>
              <Link
                href="/stats"
                className={
                  linkClasses(
                    "/stats",
                  )
                }
              >
                Stats
              </Link>

              <Link
                href="/profile"
                className={
                  linkClasses(
                    "/profile",
                  )
                }
              >
                Account
              </Link>
            </>
          )}

          {!isLoading &&
            (isLoggedIn ? (
              <button
                type="button"
                onClick={() =>
                  void handleLogout()
                }
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
      </nav>
    </header>
  );
}