"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const { error } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
        });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/library");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-md rounded-xl
        border border-gray-300
        bg-white p-8 text-gray-950
        shadow-sm
      "
    >
      <h1 className="text-3xl font-bold text-black">
        Log in
      </h1>

      <p className="mt-2 text-gray-800">
        Log in to access your game library.
      </p>

      <label className="mt-6 block space-y-2">
        <span className="font-semibold text-black">
          Email
        </span>

        <input
          required
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="email"
          className="
            w-full rounded-lg border
            border-gray-400 bg-white
            px-4 py-3 text-black
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </label>

      <label className="mt-5 block space-y-2">
        <span className="font-semibold text-black">
          Password
        </span>

        <input
          required
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value,
            )
          }
          autoComplete="current-password"
          className="
            w-full rounded-lg border
            border-gray-400 bg-white
            px-4 py-3 text-black
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </label>

      {errorMessage && (
        <div
          className="
            mt-5 rounded-lg border
            border-red-300 bg-red-50
            p-3 text-red-900
          "
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          mt-6 w-full rounded-lg
          bg-blue-700 px-5 py-3
          font-semibold text-white
          hover:bg-blue-800
          disabled:cursor-not-allowed
          disabled:bg-blue-300
        "
      >
        {isSubmitting
          ? "Logging in..."
          : "Log in"}
      </button>

      <p className="mt-6 text-center text-gray-800">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="
            font-semibold text-blue-700
            hover:underline
          "
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}