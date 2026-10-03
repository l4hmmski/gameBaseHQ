"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  User,
} from "@supabase/supabase-js";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export function Navbar() {
  const router = useRouter();

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

    loadUser();

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

    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className="
        border-b border-gray-300
        bg-white text-gray-950
      "
    >
      <nav
        className="
          mx-auto flex max-w-6xl
          items-center justify-between
          px-6 py-4
        "
      >
        <Link
          href="/"
          className="text-xl font-bold text-black"
        >
          Game Library
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-medium hover:text-blue-700"
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                href="/library"
                className="
                  font-medium
                  hover:text-blue-700
                "
              >
                Library
              </Link>

              <Link
                href="/profile"
                className="
                  font-medium
                  hover:text-blue-700
                "
              >
                Profile
              </Link>
            </>
          )}

          {!isLoading && !user && (
            <>
              <Link
                href="/login"
                className="
                  font-medium
                  hover:text-blue-700
                "
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="
                  rounded-lg bg-blue-700
                  px-4 py-2 font-semibold
                  text-white
                  hover:bg-blue-800
                "
              >
                Sign up
              </Link>
            </>
          )}

          {!isLoading && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="
                rounded-lg border
                border-gray-400
                px-4 py-2 font-semibold
                text-black
                hover:bg-gray-100
              "
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}