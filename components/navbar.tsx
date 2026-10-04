"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  User,
} from "@supabase/supabase-js";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);
      setIsLoading(false);
    }

    void loadUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user ?? null,
          );

          setIsLoading(false);
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    setUser(null);

    router.push("/");
    router.refresh();
  }

  function isActive(
    href: string,
  ) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href,
    );
  }

  const userInitial =
    user?.email
      ?.charAt(0)
      .toUpperCase() ?? "A";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-sm">
            G
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-black tracking-tight text-slate-950">
              Game Library
            </p>

            <p className="text-xs font-semibold text-slate-500">
              Track your collection
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`hidden rounded-xl px-4 py-2 text-sm font-bold transition sm:inline-flex ${
              isActive("/")
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            Home
          </Link>

          {!isLoading && user && (
            <>
              <Link
                href="/library"
                className={`hidden rounded-xl px-4 py-2 text-sm font-bold transition sm:inline-flex ${
                  isActive(
                    "/library",
                  )
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                Library
              </Link>

              <Link
                href="/profile"
                className={`hidden rounded-xl px-4 py-2 text-sm font-bold transition sm:inline-flex ${
                  isActive(
                    "/profile",
                  )
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                Account
              </Link>
            </>
          )}

          {!isLoading && !user && (
            <>
              <Link
                href="/login"
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  isActive("/login")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}

          {!isLoading && user && (
            <>
              <Link
                href="/profile"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800"
                title={user.email ?? "Account"}
              >
                {userInitial}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
              >
                Log out
              </button>
            </>
          )}

          {isLoading && (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>
      </nav>

      {!isLoading && user && (
        <nav className="border-t border-slate-100 bg-white sm:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-around px-3 py-2">
            <Link
              href="/"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                isActive("/")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500"
              }`}
            >
              Home
            </Link>

            <Link
              href="/library"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                isActive(
                  "/library",
                )
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500"
              }`}
            >
              Library
            </Link>

            <Link
              href="/profile"
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                isActive(
                  "/profile",
                )
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500"
              }`}
            >
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}