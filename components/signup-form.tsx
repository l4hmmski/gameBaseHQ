"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export function SignupForm() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage(
        "The passwords do not match.",
      );

      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters.",
      );

      return;
    }

    setIsSubmitting(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo:
            `${window.location.origin}/login`,
        },
      });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(
      "Account created. Check your email to confirm your account, then log in.",
    );

    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
        Create Account
      </h1>

      <p className="mt-2 text-gray-800">
        Create an account to manage your
        game library.
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
          autoComplete="new-password"
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
          Confirm Password
        </span>

        <input
          required
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value,
            )
          }
          autoComplete="new-password"
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

      {successMessage && (
        <div
          className="
            mt-5 rounded-lg border
            border-green-300 bg-green-50
            p-3 text-green-900
          "
        >
          {successMessage}
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
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <p className="mt-6 text-center text-gray-800">
        Already have an account?{" "}
        <Link
          href="/login"
          className="
            font-semibold text-blue-700
            hover:underline
          "
        >
          Log In
        </Link>
      </p>
    </form>
  );
}